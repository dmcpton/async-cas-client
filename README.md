# async-cas-client

An unopinionated Promise-based JS client for Apereo's Central Authentication Service

The core ticket-validation code is adapted from [https://github.com/keeps/cas-authentication](https://github.com/keeps/cas-authentication), which itself is forked from [https://github.com/kylepixel/cas-authentication](https://github.com/kylepixel/cas-authentication). Look at the commit history to see how this was done.

**Issues and pull requests are welcome.** The code is pretty simple and straightforward, so don't be afraid to jump in and improve it. I'd love to resolve the warnings below and get this to `1.0`, but it's not at the top of my to-do list, so any help is welcome.

**Warning:** this package is not rigorously tested. I am mostly relying on the packages I adapted the core ticket-validation code from to be correct. This package has been tested against a real CAS server, but only for protocol version 2.0. Other protocol versions have not been used at all. If you have used this package and can testify that it works, please let me know so that I can update this!

**Warning:** this package is in development, and its API is not guaranteed to be stable (which is why it's on version 0.x). I _do_ promise that the API will be stable within minor versions, though, so you should be safe to use it as long as you pin the minor version (eg `~0.1.2`). See below for a description of the possible API instability. Also, I'm not going to bump the major version to `1.0` until I have 100% code coverage with automated testing, but that's not a priority right now. Again, feel free to submit an issue or pull request on GitHub if you want to help.

# API

## Classes

<dl>
<dt><a href="#CasClient">CasClient</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CAS_options">CAS_options</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="CasClient"></a>

## CasClient

**Kind**: global class

- [CasClient](#CasClient)
  - [new CasClient(options)](#new_CasClient_new)
  - [.generateLoginUrl()](#CasClient+generateLoginUrl) ⇒ <code>string</code>
  - [.validateTicket(ticket)](#CasClient+validateTicket) ⇒ <code>Promise</code>

<a name="new_CasClient_new"></a>

### new CasClient(options)

| Param   | Type                                     |
| ------- | ---------------------------------------- |
| options | [<code>CAS_options</code>](#CAS_options) |

<a name="CasClient+generateLoginUrl"></a>

### casClient.generateLoginUrl() ⇒ <code>string</code>

Generates the URL that a client should be redirected to in order to log in with the CAS provider,
using the options passed in the initialization of this client.

**Kind**: instance method of [<code>CasClient</code>](#CasClient)  
**Returns**: <code>string</code> - the login URL  
<a name="CasClient+validateTicket"></a>

### casClient.validateTicket(ticket) ⇒ <code>Promise</code>

Validates the ticket generate by the CAS login requester with the CAS login accepter.

**Kind**: instance method of [<code>CasClient</code>](#CasClient)  
**Returns**: <code>Promise</code> - Promise object represents a @type {ValidationResult} object

| Param  | Type                |
| ------ | ------------------- |
| ticket | <code>string</code> |

<a name="CAS_options"></a>

## CAS_options : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name            | Type                                                                                                                             | Default                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| cas_url         | <code>string</code>                                                                                                              |                                       |
| service_url     | <code>string</code>                                                                                                              |                                       |
| [cas_version]   | <code>&#x27;1.0&#x27;</code> \| <code>&#x27;2.0&#x27;</code> \| <code>&#x27;3.0&#x27;</code> \| <code>&#x27;saml1.1&#x27;</code> | <code>&#x27;3.0&#x27;</code>          |
| [renew]         | <code>boolean</code>                                                                                                             | <code>false</code>                    |
| [is_dev_mode]   | <code>boolean</code>                                                                                                             | <code>false</code>                    |
| [dev_mode_user] | <code>string</code>                                                                                                              | <code>&quot;&#x27;&#x27;&quot;</code> |
| [dev_mode_info] | <code>Object</code>                                                                                                              | <code>{}</code>                       |
