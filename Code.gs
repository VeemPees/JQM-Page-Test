Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function doGet(e) 
{
  //return doGetForJQAppDemo(e);
  
  return doGetForCalendarPage(e);
  
  //return doGetForNavigation(e);
  
}