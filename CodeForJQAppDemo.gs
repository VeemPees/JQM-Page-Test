// modified from https://developers.google.com/apps-script/guides/html/communication#forms

// bit of code to establish html interface
function doGetForJQAppDemo() {

  var id = 8000003;
  
  //id = e.parameter.id; // getting parameter from querystring
  
  // opening a Sheet to read some data
  var alldata = SpreadsheetApp
      .openById('1ANtlQPLPpCIE8_1Y_5qNAaHY09yvOIqR4wYayWdVZU4')
      .getActiveSheet()
      .getDataRange()
      .getValues();
  
  // filtering that data for a single row
  var keys = alldata.shift();
  var objects = alldata.map(function(values) {
      return keys.reduce(function(o, k, i) {
          o[k] = values[i];
          return o;
      }, {});
  });
  var data = objects.filter(function(x){
                      return x['LocationId'] == id;
                     });
  // able to get email of who is using the form                   
  data.engineer = Session.getEffectiveUser().getEmail();
  
  // constructing the interface and passing data to it
  var t = HtmlService.createTemplateFromFile('HtmlForJQAppDemo');
  t.data = data;
  return t.evaluate()
          .addMetaTag('viewport', 'width=device-width, initial-scale=1')
          .setTitle('Mobile Capture Example');
}

// function that processes the form when submitted
function processForm(formObject) {
  // we get our Pics folder
  var folder = DriveApp.getFolderById('0B6GkLMU9sHmLejN2R0xUaVJfVjA');
  var formBlob = formObject.myPhoto;
  // sending image file to our Google Drive folder
  var imgFile = folder.createFile(formBlob); 
  
  // finding the row in our data to update
  var sheet = SpreadsheetApp.openById('1ANtlQPLPpCIE8_1Y_5qNAaHY09yvOIqR4wYayWdVZU4')
                            .getActiveSheet();

  var rows = sheet.getRange('A:A').getValues();
  var row = 0;
  
  while ( rows[row] && rows[row][0] !== Number(formObject.locationid) ) {
    row++;
  }
  
  // writing the data to the sheet
  var towrite = [formObject.name, formObject.reading, new Date(), formObject.email, imgFile.getUrl()];
  // getRange(Integer row, Integer column, Integer numRows, Integer numColumns) : Range
  sheet.getRange(row+1, 2, 1, towrite.length).setValues([towrite]);

  // Port of Slides API demo by Wesley Chun to Google Apps Script
  // Source: http://wescpy.blogspot.co.uk/2016/11/using-google-slides-api-with-python.html
  // See https://mashe.hawksey.info/2016/11/using-the-google-slides-api-with-google-apps-script/ 
  
  // Gernating a certificate using Google Slides
  SLIDES.setTokenService(function(){return ScriptApp.getOAuthToken()});
  
  // make a copy of our template
  var DECK = DriveApp.getFileById('1LlIkhs2wgL3sptJ5GUiAgmNqFX7iA7WRgtaEHtT2oEA')
                        .makeCopy()
                        .setName('Certificate - ' + formObject.locationid)
  var DECK_ID = DECK.getId();
  
  // get the slide object
  var slide = SLIDES.presentationsGet(DECK_ID).slides[0];
  
  // looking for the rectangle shape to replace with an image later
  var obj
  for (var i in slide['pageElements']){
    var obj = slide['pageElements'][i];
    if (obj['shape'] != undefined && obj['shape']['shapeType'] == 'RECTANGLE'){
      break;
    }
  }
  
  // for the Slide Api to us an image we need to pass a url in 
  var img_url = imgFile.getDownloadUrl()+"&access_token="+ScriptApp.getOAuthToken();
  
  // object describing the changes to our template slide
  var reqs = [
      {'replaceAllText': {
          'containsText': {'text': '{{reading}}'},
          'replaceText': formObject.reading
      }},
      {'replaceAllText': {
          'containsText': {'text': '{{engineer}}'},
          'replaceText': formObject.email
      }},
      {'replaceAllText': {
          'containsText': {'text': '{{date}}'},
          'replaceText': Utilities.formatDate(new Date(), 'GMT', 'MMM d, yyyy')
      }},
      {'createImage': {
          'url': img_url,
          'elementProperties': {
              'pageObjectId': slide['objectId'],
              'size': obj['size'],
              'transform': obj['transform'],
          }
      }},
      {'deleteObject': {'objectId': obj['objectId']}},
  ];
  // sending updates
  SLIDES.presentationsBatchUpdate(DECK_ID, {'requests': reqs});

  // Sending a copy of the cert as pdf
  // https://developers.google.com/apps-script/reference/mail/mail-app
  MailApp.sendEmail('apps@hawksey.info', 'Attachment example', 'Certificate attached.', {
    name: 'Automatic Emailer Script',
    attachments: [DECK.getAs(MimeType.PDF)]
  });

  return "Sent..";
}


