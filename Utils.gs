// Write a nicely formatted log from a string or exception type. Put this into the catch 
function logException(e) {
  e = (typeof e === 'string') ? new Error(e) : e;
  Logger.severe('%s: %s (line %s, file "%s"). Stack: "%s" . ',e.name||'', 
             e.message||'', e.lineNumber||'', e.fileName||'', e.stack||'');
}
