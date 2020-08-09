var url = require("url"),
  http = require("http"),
  https = require("https"),
  parseXML = require("xml2js").parseString,
  XMLprocessors = require("xml2js/lib/processors");

/**
 * @typedef {Object} CasOptions
 * @property {string}  cas_url
 * @property {('1.0'|'2.0'|'3.0'|'saml1.1')} [cas_version='3.0']
 * @property {boolean} [renew=false]
 * @property {boolean} [is_dev_mode=false]
 * @property {string}  [dev_mode_user='']
 * @property {Object}  [dev_mode_info={}]
 */

/**
 * @typedef {Object} ValidationResult
 * @property {string} user
 * @property {Object} attributes
 */

/**
 * @param {CasOptions} options
 * @constructor
 */
function CasClient(options) {
  // the body of this function is only lightly adapted from
  // https://github.com/keeps/cas-authentication/blob/ed7cf4ddf98986f78c3aa68be93f427a9f7c7579/index.js
  if (!options || typeof options !== "object") {
    throw new Error("CAS Authentication was not given a valid configuration object.");
  }
  if (options.cas_url === undefined) {
    throw new Error("CAS Authentication requires a cas_url parameter.");
  }

  this.cas_version = options.cas_version !== undefined ? options.cas_version : "3.0";

  if (this.cas_version === "1.0") {
    this._validateUri = "/validate";
    this._validate = function (body, callback) {
      var lines = body.split("\n");
      if (lines[0] === "yes" && lines.length >= 2) {
        return callback(null, lines[1]);
      } else if (lines[0] === "no") {
        return callback(new Error("CAS authentication failed."));
      } else {
        return callback(new Error("Response from CAS server was bad."));
      }
    };
  } else if (this.cas_version === "2.0" || this.cas_version === "3.0") {
    this._validateUri = this.cas_version === "2.0" ? "/serviceValidate" : "/p3/serviceValidate";
    this._validate = function (body, callback) {
      parseXML(
        body,
        {
          trim: true,
          normalize: true,
          explicitArray: false,
          tagNameProcessors: [XMLprocessors.normalize, XMLprocessors.stripPrefix],
        },
        function (err, result) {
          if (err) {
            return callback(new Error("Response from CAS server was bad."));
          }
          try {
            var failure = result.serviceresponse.authenticationfailure;
            if (failure) {
              return callback(new Error("CAS authentication failed (" + failure.$.code + ")."));
            }
            var success = result.serviceresponse.authenticationsuccess;
            if (success) {
              return callback(null, success.user, success.attributes);
            } else {
              return callback(new Error("CAS authentication failed."));
            }
          } catch (err) {
            console.log(err);
            return callback(new Error("CAS authentication failed."));
          }
        }
      );
    };
  } else if (this.cas_version === "saml1.1") {
    this._validateUri = "/samlValidate";
    this._validate = function (body, callback) {
      parseXML(
        body,
        {
          trim: true,
          normalize: true,
          explicitArray: false,
          tagNameProcessors: [XMLprocessors.normalize, XMLprocessors.stripPrefix],
        },
        function (err, result) {
          if (err) {
            return callback(new Error("Response from CAS server was bad."));
          }
          try {
            var samlResponse = result.envelope.body.response;
            var success = samlResponse.status.statuscode.$.Value.split(":")[1];
            if (success !== "Success") {
              return callback(new Error("CAS authentication failed (" + success + ")."));
            } else {
              var attributes = {};
              var attributesArray = samlResponse.assertion.attributestatement.attribute;
              if (!(attributesArray instanceof Array)) {
                attributesArray = [attributesArray];
              }
              attributesArray.forEach(function (attr) {
                var thisAttrValue;
                if (attr.attributevalue instanceof Array) {
                  thisAttrValue = [];
                  attr.attributevalue.forEach(function (v) {
                    thisAttrValue.push(v._);
                  });
                } else {
                  thisAttrValue = attr.attributevalue._;
                }
                attributes[attr.$.AttributeName] = thisAttrValue;
              });
              return callback(null, samlResponse.assertion.authenticationstatement.subject.nameidentifier, attributes);
            }
          } catch (err) {
            console.log(err);
            return callback(new Error("CAS authentication failed."));
          }
        }
      );
    };
  } else {
    throw new Error('The supplied CAS version ("' + this.cas_version + '") is not supported.');
  }

  this.cas_url = options.cas_url;
  var parsed_cas_url = url.parse(this.cas_url);
  this.request_client = parsed_cas_url.protocol === "http:" ? http : https;
  this.cas_host = parsed_cas_url.hostname;
  this.cas_port = parsed_cas_url.protocol === "http:" ? 80 : 443;
  this.cas_path = parsed_cas_url.pathname;

  this.renew = options.renew !== undefined ? !!options.renew : false;

  this.is_dev_mode = options.is_dev_mode !== undefined ? !!options.is_dev_mode : false;
  this.dev_mode_user = options.dev_mode_user !== undefined ? options.dev_mode_user : "";
  this.dev_mode_info = options.dev_mode_info !== undefined ? options.dev_mode_info : {};

  this.generateLoginUrl = this.generateLoginUrl.bind(this);
  this.validateTicket = this.validateTicket.bind(this);
}

/**
 * Generates the URL that a client should be redirected to in order to log in with the CAS provider,
 * using the options passed in the initialization of this client.
 * @param {string} serviceUrl the URL of your service to which the client should be redirected to after
 * they've logged in, where ticket validation will be performed
 * @return {string} the login URL the client should be redirected to
 */
CasClient.prototype.generateLoginUrl = function (serviceUrl) {
  // derive the appropriate query params
  var query = {
    service: serviceUrl,
  };

  if (this.renew) {
    query.renew = this.renew;
  }

  // return the formatted URL
  return this.cas_url + url.format({ pathname: "/login", query: query });
};

/**
 * Validates the ticket generate by the CAS login requester with the CAS login accepter.
 * @param {string} ticket the ID of the ticket you wish to validate
 * @param {string} [serviceUrl] (SAML1.1 only) the URL of the service that is performing ticket validation
 * @returns {Promise} Promise object represents a @type {ValidationResult} object
 */
CasClient.prototype.validateTicket = function (ticket, serviceUrl) {
  // The body of this function is only lightly adapted (basically just wrapping it in a Promise) from
  // https://github.com/keeps/cas-authentication/blob/ed7cf4ddf98986f78c3aa68be93f427a9f7c7579/index.js
  return new Promise(
    function (resolve, reject) {
      var requestOptions = {
        host: this.cas_host,
        port: this.cas_port,
      };

      if (["1.0", "2.0", "3.0"].indexOf(this.cas_version) >= 0) {
        requestOptions.method = "GET";
        requestOptions.path = url.format({
          pathname: this.cas_path + this._validateUri,
          query: {
            service: serviceUrl,
            ticket: ticket,
          },
        });
      } else if (this.cas_version === "saml1.1") {
        var now = new Date();
        var post_data =
          '<?xml version="1.0" encoding="utf-8"?>\n' +
          '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">\n' +
          "  <SOAP-ENV:Header/>\n" +
          "  <SOAP-ENV:Body>\n" +
          '    <samlp:Request xmlns:samlp="urn:oasis:names:tc:SAML:1.0:protocol" MajorVersion="1"\n' +
          '      MinorVersion="1" RequestID="_' +
          serviceUrl +
          "." +
          now.getTime() +
          '"\n' +
          '      IssueInstant="' +
          now.toISOString() +
          '">\n' +
          "      <samlp:AssertionArtifact>\n" +
          "        " +
          ticket +
          "\n" +
          "      </samlp:AssertionArtifact>\n" +
          "    </samlp:Request>\n" +
          "  </SOAP-ENV:Body>\n" +
          "</SOAP-ENV:Envelope>";

        requestOptions.method = "POST";
        requestOptions.path = url.format({
          pathname: this.cas_path + this._validateUri,
          query: {
            TARGET: serviceUrl,
            ticket: "",
          },
        });
        requestOptions.headers = {
          "Content-Type": "text/xml",
          "Content-Length": Buffer.byteLength(post_data),
        };
      }

      var request = this.request_client.request(
        requestOptions,
        function (response) {
          response.setEncoding("utf8");
          var body = "";
          response.on(
            "data",
            function (chunk) {
              return (body += chunk);
            }.bind(this)
          );
          response.on(
            "end",
            function () {
              this._validate(
                body,
                function (err, user, attributes) {
                  if (err) {
                    // TODO do we really want to reject here?
                    // my thinking is that rejecting here makes an authentication failure look similar to a request error/etc
                    // however I'm doing this for now because it makes sense to me for only the happy path to resolve
                    // and everything else ot reject
                    reject(err);
                  } else {
                    resolve({ user: user, attributes: attributes });
                  }
                }.bind(this)
              );
            }.bind(this)
          );
          response.on(
            "error",
            function (err) {
              reject(err);
            }.bind(this)
          );
        }.bind(this)
      );

      request.on(
        "error",
        function (err) {
          reject(err);
        }.bind(this)
      );

      if (this.cas_version === "saml1.1") {
        request.write(post_data);
      }
      request.end();
    }.bind(this)
  );
};

module.exports = CasClient;
