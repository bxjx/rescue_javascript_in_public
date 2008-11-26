// standardise parameters:
// maybe put in browser stats (core?)
// use custom exception that prints out pretty info

var RescueJavascriptInPublic = {

  // The url that we post back rescued javascript exceptions. This should match
  // the url in config/routes
  url : '/rescue_javascript_in_public',

  // Called when an exception has occurred within an event handler. This can either
  // be used manually in the catch part of a try/catch statement, or it is automatically
  // called if you are using LowPro to unobtrusively bind your event handlers 
  rescueEventHanderException : function(exception, event, observer){
    var error = {
      error_type : 'event_handler_exception',
      exception : exception.message,
      event_type : event,
      observer : observer
    }
    if (exception.stack) error['stack'] = exception.stack;
    if (exception.file_name) error['file_name'] = exception.fileName;
    if (exception.description) error['description'] = exception.description;
    this.rescue(error);
  },

  // Called when an error has occured with a prototype callback
  rescueAjaxException : function(request, exception){
    var error = {
      error_type : 'ajax_callback_exception',
      exception : exception.message
    };
    if (exception.stack) error['stack'] = exception.stack;
    if (exception.file_name) error['file_name'] = exception.fileName;
    if (exception.description) error['description'] = exception.description;
    this.rescue(error);
  },

  // Can be used as an onFailure callback. e.g.
  // new Ajax.Request('/url',{
  //   onFailure : RescueJavascriptInPublic.rescueAjaxFailure.bind(RescueJavascriptInPublic)
  // });
  // Maybe not as useful, as you're probably logging 404 as 500 errors on the server, but
  // nice to catch it cleanly on the client side
  rescueAjaxFailure : function(response){
    var error = {
      error_type : 'ajax_on_failure',
      exception : "Ajax request to " + response.request.url + " returned status: " + response.status
    };
    this.rescue(error);
  },

  // Called when the browsers onerror handler is called.
  rescueOnError : function(message, uri, line){
    var error = {
      error_type :  'on_error',
      exception :  message,
      uri : uri,
      line : line
    };
    this.rescue(error);
    return false;
  },

/*  Some experimental code for getting a stack trace... needs work
  generateStackTrace : function(functionObject, stack){
    if (!stack) stack = [];
    stack.push(this.extractSignature(functionObject));
    if (!functionObject.caller){
      return stack;
    }else{
      return this.generateStackTrace(functionObject.caller, stack);
    }
  },
  
    if (arguments && arguments.callee && arguments.callee.caller){
      stackTrace = this.generateStackTrace(arguments.callee.caller);
    }else{
      stackTrace = [];
    }
    stackTrace.each(function(info){
      errorInfo.push(['stack[]', info]);
      console.info("pushing " + info);
    })


  extractSignature : function(functionObject){
    var functionMatch = functionObject.toString().match(/function (.*)\(/i)
    if (functionMatch && !functionMatch.last().blank()){
      functionName = functionMatch.last();
    }else{
      functionName = 'function'; // it's an anonymous function
    }
    return functionName + "(" + $A(functionObject.arguments).map(function(arg){
      return arg.toString();
    }).join(", ") + ")";
  },
*/

  // Called by each different type of exception handler
  rescue : function(error){
		new Ajax.Request(
			this.url,
			{method : 'post', parameters : error}
		);
    this.displayMessage();
  },

  // Displays a modal dialog that informs the user that an error has occurred
  displayMessage : function(){
    var title = 'An error has occurred'
    var node = new Element('div').update(
      new Element('p').update('This error has been logged and reported. The application will now be reloaded.')
    ).insert(
      new Element('input', {type: 'button', value: 'Okay', id: 'okay'})
    );
    var hideObserver = Modalbox.hide.bindAsEventListener(Modalbox);
    function setObservers() {
      $('okay').observe('click', hideObserver);
    };
    Modalbox.show(node, {title: title, width: 300, 
        afterLoad: setObservers, afterHide: this.afterMessageHasBeenRead }); 
  },
  
  // Called after the modal dialog is closed. Override if you don't want the page to reload
  afterMessageHasBeenRead : function() {
    window.location.reload();
  }
}

// This will catch some Runtime and Syntax errors in IE and firefox but not Safari
// or Opera. This is actually not that helpful but let's catch it just in case.
window.onerror = RescueJavascriptInPublic.rescueOnError.bind(RescueJavascriptInPublic);

// If using Prototype, register an exception handler for ajax exceptions  */
if (Ajax && Ajax.Responders){
  Ajax.Responders.register({
    onException: function(request, exception) {
      if (request.url != RescueJavascriptInPublic.url){
        RescueJavascriptInPublic.rescueAjaxException(request, exception);
      }
    }
  });
}

// If using LowPro, this will wrap observer functions with a try/catch that
// calls RescueJavascriptInPublic if an exception is caught.
if (LowPro){
  Event.addBehavior._wrapObserver = Event.addBehavior._wrapObserver.wrap(
    function(_oldWrapObserver, observer){
      return function(event){
        try{
          _oldWrapObserver(observer).call(this, event);
        }catch(e){
          RescueJavascriptInPublic.rescueEventHanderException(e, event, observer);
          event.stop();
        }
      }
    } 
  );
}
