// Write a nicely formatted log from a string or exception type. Put this into the catch 
function logException(e) {
  e = (typeof e === 'string') ? new Error(e) : e;
  Logger.severe('%s: %s (line %s, file "%s"). Stack: "%s" . ',e.name||'', 
             e.message||'', e.lineNumber||'', e.fileName||'', e.stack||'');
}

// For some reason this is either missing or not implemented the way is should be, so adding here as a utility function

function include(File) {
  return HtmlService.createHtmlOutputFromFile(File).getContent();
};


Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}