# async-cas-client

An unopinionated Promise-based JS client for Apereo's Central Authentication Service

The core ticket-validation code is adapted from [https://github.com/keeps/cas-authentication](https://github.com/keeps/cas-authentication), which itself is forked from [https://github.com/kylepixel/cas-authentication](https://github.com/kylepixel/cas-authentication). Look at the commit history to see how this was done.

**Issues and pull requests are welcome.** The code is pretty simple and straightforward, so don't be afraid to jump in and improve it. I'd love to resolve the warnings below and get this to `1.0`, but it's not at the top of my to-do list, so any help is welcome.

**Warning:** this package is not rigorously tested. I am mostly relying on the packages I adapted the core ticket-validation code from to be correct. This package has been tested against a real CAS server, but only for protocol version 2.0. Other protocol versions have not been used at all. If you have used this package and can testify that it works, please let me know so that I can update this!

**Warning:** this package is in development, and its API is not guaranteed to be stable (which is why it's on version 0.x). I _do_ promise that the API will be stable within minor versions, though, so you should be safe to use it as long as you pin the minor version (eg `~0.1.2`). See below for a description of the possible API instability. Also, I'm not going to bump the major version to `1.0` until I have 100% code coverage with automated testing, but that's not a priority right now. Again, feel free to submit an issue or pull request on GitHub if you want to help.

## Installation

```
npm install --save async-cas-client
```

## Usage

See the [full API documentation](https://github.com/dmcpton/async-cas-client/blob/master/API.md) for more details.

This package provides an object that, when constructed, has two methods: `generateLoginUrl(serviceUrl)` and `validateTicket(ticket[, serviceUrl])`. It's important to note that `generateLoginUrl` is synchronous, and returns a string, while `validateTicket` returns a `Promise` which will either reject on any error (from network errors to authentication errors), or resolve to an object of the form `{ user, attributes }`. **This might change** in different minor versions -- see above -- as I haven't decided to treat authentication errors differently from all other errors yet.

Construct a `CasClient` object like this:

```js
var CasClient = require("async-cas-client");

var casClient = new CasClient({
  cas_url: "https://my-cas-host.com/cas",
  cas_version: "3.0",
  renew: false,
  is_dev_mode: false,
  dev_mode_user: "",
  dev_mode_info: {},
});
```

Then, the two methods can be used. For example, usage in an [express](https://expressjs.com/) app, might look something like this:

```js
var app = require("express")();

// create a new CasClient
var casClient = new CasClient({
  cas_url: "https://example.com/cas",
  cas_version: "3.0",
});

app.get("/cas/login", (req, res) => {
  // where `HOST` is an environment variable containing the URL the app is hosted at
  res.redirect(casClient.generateLoginUrl(process.env.HOST + "/cas/verify"));
});

app.get("/cas/verify", (req, res) => {
  casClient
    .validateTicket(req.query.ticket)
    .then(result => {
      console.log(result.user + " logged in");
      res.send("Hello, " + result.user + "!");
    })
    .catch(err => {
      res.send("CAS authentication error: " + err);
    });
});
```

Obviously this is a very simple stub -- you would probably want to save the logged-in user in a session or similar, for one. But hopefully it's enough to get you started. (Submit an issue if it's not!)

## Options

| Name          |              Type               | Description                                                                                                                            |   Default    |
| :------------ | :-----------------------------: | :------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
| cas_url       |            _string_             | The URL of the CAS server.                                                                                                             | _(required)_ |
| cas_version   | _"1.0"\|"2.0\|"3.0"\|"saml1.1"_ | The CAS protocol version.                                                                                                              |   _"3.0"_    |
| renew         |            _boolean_            | If true, an unauthenticated client will be required to login to the CAS system regardless of whether a single sign-on session exists.  |   _false_    |
| is_dev_mode   |            _boolean_            | If true, no CAS authentication will be used and the session CAS variable will be set to whatever user is specified as _dev_mode_user_. |   _false_    |
| dev_mode_user |            _string_             | The CAS user to use if dev mode is active.                                                                                             |     _""_     |
| dev_mode_info |            _Object_             | The CAS user information to use if dev mode is active.                                                                                 |     _{}_     |
