RescueJavascriptInPublic
========================

Rails plugin to log and gracefully handle javascript/ajax errors in production.

Gracefully handles errors
-------------------------

Javsacript errors have a way of causing AJAX apps to die in unintended ways. In many cases, the user is not even aware that an error has occurred. Furthermore, they are often left with an interface that only partially works.

This plugin attempts to handle javascript errors with a little grace. When an error is detected, an ajax dialog box informs the user of the error has occurred and informs them that it has been logged. It also prevents them from using the interface further. Closing the dialog will then reload the application (note: this behaviour can be customised).

Logs javascript error in Rails
------------------------------

The other issue with javascript errors in production apps is that they are rarely logged. They often die silently in the user's browser. 

This plugin will instead attempt to communicate details about javascript errors back to your Rails app. Depending on the error and the browser, various details are logged, including the exception message, the event name, details about the event handler code and stack trace. The details are posted to a controller within the plugin that will raise a custom ruby exception. This allows you to log errors and receive notifications using existing rails tools eg. ExceptionNotication plugin, FiveRuns etc.

How are errors caught?
------------------------------

The plugin attempts to catch exceptions in the following ways:

1) The onerror handler: This is configured by default. It works in IE and Mozilla but not in Safari or Opera. It will catch syntax errors but generally I don't find this all that useful.

2) Registering a Prototype Ajax.Responder for the onException event: This is configured by default. It will catch exceptions occuring during ajax communication and in onSuccess or onComplete
callbacks. It will not catch 404 or 500 errors. See (3).

3) Using Prototype's onFailure callbacks: By including the following in your Ajax.Request calls:

`
new Ajax.Request('/url',{
  onFailure : RescueJavascriptInPublic.rescueAjaxFailure.bind(RescueJavascriptInPublic)
});
`

the plugin will catch Ajax failures including 400 and 500 errors.

4) Via wrapped callbacks if you are using LowPro: If using lowpro to unobtrusively add javascript behaviours, errors in the behaviours are automatically caught. This methods allows more details error messages, such as stack traces. For me, this is probably the most useful method of catching errors.

5) Custom function wrapping your handlers: If you're not using lowpro, another option is to wrap your code in the following code:
 
try{
  yourCallBackCode(event);
}catch(e){
  rescueEventHanderException : function(e, event, yourCallCode){
}


Install
------------------------------

`script/plugin install git://github.com/bxjx/rescue_javascript_in_public.git`


Usage
------------------------------

The install script for the plugin will copy necessary assets to your public directory.

You will then need to do the following:

1) Add a route for the controller 
map.connect '/rescue_javascript_in_public', {:controller => 'rescue_javascript_in_public'}

2) Add the following to the head of your template file:

<%=rescue_javascript_in_public_tag %>

Note: This will only include assets if local_request? is false.

== Future

email b.j.rossiter AT gmail DOT com with feedback and suggestions

