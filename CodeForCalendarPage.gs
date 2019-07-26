function getWeekLabel(weekOffsetFromToday)
{
  var startDate = new Date();
  var endDate;
  
  if (weekOffsetFromToday > 0) {
    startDate = startDate.addDays(7 * weekOffsetFromToday);
  }
  
  if (startDate.getDay() != 1) {
    startDate = startDate.addDays(1 - startDate.getDay());
  }
  endDate = startDate.addDays(5);
  
  return Utilities.formatDate(startDate, "GMT", "MMM dd") + " - " + Utilities.formatDate(endDate, "GMT", "MMM dd");
}


function buildNewWeek(newWeekOffsetFromToday)
{
  var newWeekData = {};
  
  newWeekData.weekLabel = getWeekLabel(newWeekOffsetFromToday);
  newWeekData.hiddenWeekOffsetFromToday = newWeekOffsetFromToday;
  return newWeekData;
}

function doGetForCalendarPage(e) 
{
  try {
    var template = HtmlService.createTemplateFromFile("HtmlForCalendarPage");
    
    template.weekLabel = getWeekLabel(0);
    template.hiddenWeekOffsetFromToday = 0;
    
    var html = template.evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('Calendar Page test');
    return html;
  } catch(ex) {
    
  }
}
