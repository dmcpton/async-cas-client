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
    * [.generateLoginUrl()](#CasClient+generateLoginUrl) ⇒ <code>string</code>
    * [.validateTicket(ticket)](#CasClient+validateTicket) ⇒ <code>Promise</code>

<a name="new_CasClient_new"></a>

### new CasClient(options)

| Param | Type |
| --- | --- |
| options | [<code>CasOptions</code>](#CasOptions) | 

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

| Param | Type |
| --- | --- |
| ticket | <code>string</code> | 

<a name="CasOptions"></a>

## CasOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| cas_url | <code>string</code> |  | 
| service_url | <code>string</code> |  | 
| [cas_version] | <code>&#x27;1.0&#x27;</code> \| <code>&#x27;2.0&#x27;</code> \| <code>&#x27;3.0&#x27;</code> \| <code>&#x27;saml1.1&#x27;</code> | <code>&#x27;3.0&#x27;</code> | 
| [renew] | <code>boolean</code> | <code>false</code> | 
| [is_dev_mode] | <code>boolean</code> | <code>false</code> | 
| [dev_mode_user] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | 
| [dev_mode_info] | <code>Object</code> | <code>{}</code> | 

<a name="ValidationResult"></a>

## ValidationResult : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| user | <code>string</code> | 
| attributes | <code>Object</code> | 

