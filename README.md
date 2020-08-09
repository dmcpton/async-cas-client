# async-cas-client

An unopinionated Promise-based JS client for Apereo's Central Authentication Service

The core ticket-validation code is adapted from [https://github.com/keeps/cas-authentication](https://github.com/keeps/cas-authentication), which itself is forked from [https://github.com/kylepixel/cas-authentication](https://github.com/kylepixel/cas-authentication). Look at the commit history to see how this was done.

**Issues and pull requests are welcome.** The code is pretty simple and straightforward, so don't be afraid to jump in and improve it. I'd love to resolve the warnings below and get this to `1.0`, but it's not at the top of my to-do list, so any help is welcome.

**Warning:** this package is not rigorously tested. I am mostly relying on the packages I adapted the core ticket-validation code from to be correct. This package has been tested against a real CAS server, but only for protocol version 2.0. Other protocol versions have not been used at all. If you have used this package and can testify that it works, please let me know so that I can update this!

**Warning:** this package is in development, and its API is not guaranteed to be stable (which is why it's on version 0.x). I _do_ promise that the API will be stable within minor versions, though, so you should be safe to use it as long as you pin the minor version (eg `~0.1.2`). See below for a description of the possible API instability. Also, I'm not going to bump the major version to `1.0` until I have 100% code coverage with automated testing, but that's not a priority right now. Again, feel free to submit an issue or pull request on GitHub if you want to help.

See the full [API documentation](./API.md).
