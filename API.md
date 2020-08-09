## Classes

<dl>
<dt><a href="#CasClient">CasClient</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CasOptions">CasOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ValidationResult">ValidationResult</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="CasClient"></a>

## CasClient
**Kind**: global class  

* [CasClient](#CasClient)
    * [new CasClient(options)](#new_CasClient_new)
    * [.generateLoginUrl(serviceUrl)](#CasClient+generateLoginUrl) ⇒ <code>string</code>
    * [.validateTicket(ticket, [serviceUrl])](#CasClient+validateTicket) ⇒ <code>Promise</code>

<a name="new_CasClient_new"></a>

### new CasClient(options)

| Param | Type |
| --- | --- |
| options | [<code>CasOptions</code>](#CasOptions) | 

<a name="CasClient+generateLoginUrl"></a>

### casClient.generateLoginUrl(serviceUrl) ⇒ <code>string</code>
Generates the URL that a client should be redirected to in order to log in with the CAS provider,
using the options passed in the initialization of this client.

**Kind**: instance method of [<code>CasClient</code>](#CasClient)  
**Returns**: <code>string</code> - the login URL the client should be redirected to  

| Param | Type | Description |
| --- | --- | --- |
| serviceUrl | <code>string</code> | the URL of your service to which the client should be redirected to after they've logged in, where ticket validation will be performed |

<a name="CasClient+validateTicket"></a>

### casClient.validateTicket(ticket, [serviceUrl]) ⇒ <code>Promise</code>
Validates the ticket generate by the CAS login requester with the CAS login accepter.

**Kind**: instance method of [<code>CasClient</code>](#CasClient)  
**Returns**: <code>Promise</code> - Promise object represents a @type {ValidationResult} object  

| Param | Type | Description |
| --- | --- | --- |
| ticket | <code>string</code> | the ID of the ticket you wish to validate |
| [serviceUrl] | <code>string</code> | (SAML1.1 only) the URL of the service that is performing ticket validation |

<a name="CasOptions"></a>

## CasOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| cas_url | <code>string</code> |  | The URL of the CAS server. |
| [cas_version] | <code>&#x27;1.0&#x27;</code> \| <code>&#x27;2.0&#x27;</code> \| <code>&#x27;3.0&#x27;</code> \| <code>&#x27;saml1.1&#x27;</code> | <code>&#x27;3.0&#x27;</code> | The CAS protocol version. |
| [renew] | <code>boolean</code> | <code>false</code> | If true, an unauthenticated client will be required to login to the CAS system regardless of whether a single sign-on session exists. |
| [is_dev_mode] | <code>boolean</code> | <code>false</code> | If true, no CAS authentication will be used and the session CAS variable will be set to whatever user is specified as _dev_mode_user_. |
| [dev_mode_user] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The CAS user to use if dev mode is active. |
| [dev_mode_info] | <code>Object</code> | <code>{}</code> | The CAS user information to use if dev mode is active. |

<a name="ValidationResult"></a>

## ValidationResult : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| user | <code>string</code> | 
| attributes | <code>Object</code> | 

