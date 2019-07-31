// Use the Log tab of the reservation sheet (1muq45nBd9l0oRF5d4iF3eObVkNIZcukc5kfne06fFd0) to capture logs
Logger = BetterLog.useSpreadsheet('1muq45nBd9l0oRF5d4iF3eObVkNIZcukc5kfne06fFd0');

function doGet(e) 
{
  try {

    /* what to do
    **
    ** The action can be one of these: 'fetch', 'fetchWeek'
    **
    */    
    var op;
    
    if (e === undefined) {
        // e was not passed
      op = null;
    } else {
      if (e.parameter === undefined) {
        op = null;
      } else {
        if (e.parameter.action === undefined) {
          op = null;
        } else {
          op = e.parameter.action;
        }
      }
    }
    
    if (op) {
      
      Logger.log("Operation is " + op);
      var ds;
      
      if (op == 'op1') {
        
        return HtmlService.createHtmlOutput("Hello");
        
      }
      
      if (op == 'fetchWeek') {
        
        ds = fetchWeek(e);
        
        Logger.log("Slot list built");
      }
      
      var output  = ContentService.createTextOutput();
        
      output.setContent(JSON.stringify(ds));
      output.setMimeType(ContentService.MimeType.JSON);
      
      return output;
      
    } else {
      
      // There is no op/action, so render the entire HTML page
      
      Logger.log("There is no op/action, so render the entire HTML page");
      
    
      var template = HtmlService.createTemplateFromFile("Main");
      
      Logger.log("Main");
      
      template.scriptUrl = ScriptApp.getService().getUrl() + "?action=op1";
      
      var html = template.evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setTitle('Időpont foglalás');
      Logger.log("template.evaluate");
      return html;
    }
    
  } catch(e) {
    logException(e);
  }
  
  //return doGetForJQAppDemo(e);
  //return doGetForCalendarPage(e);
  //return doGetForNavigation(e);
}
