function getCutoffDate(days_offset) {
  var cutoff_date = new Date();
  cutoff_date.setDate(cutoff_date.getDate() + days_offset);
  res = cutoff_date.toISOString();
  Logger.log('cutoff date: ' + res);
  return res;
}

function getTermsToQuery(number_of_terms) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var range = sheet.getRange("A1:A" + number_of_terms);
  Logger.log('Number of columns: ' + range.getNumColumns());
  Logger.log('Number of rows: ' + range.getNumRows());
  
  terms = [];
  for (var row = 1; row <= range.getNumRows(); row++) {
    for (var col = 1; col <= range.getNumColumns(); col++) {
      var term = range.getCell(row, col).getValue();
      if (term) {
        Logger.log('querying for %s\n', term);
        terms.push(term);
      }
    }
  }
  return terms;
}

function createHead(cutoff_date, terms) {
  var head = '<head>Querying for videos for the following terms since ' + cutoff_date + '</head>';
  head = head + '<ul>';
  for (var i = 0; i < terms.length; i++) {
    head = head + '<li>' + terms[i] + '</li>';
  }
  head = head + '</ul>';  
  Logger.log('Email head' + head);
  return head;
}

function queryYTForTerms() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];

  var cutoff_date = getCutoffDate(-1);

  // first find out how many terms we have
  var range = sheet.getRange("C1:C1");
  number_of_terms = range.getCell(1, 1).getValue();
  var terms = getTermsToQuery(number_of_terms);
  
  // read the max number of results per term
  range = sheet.getRange("C3:C3")
  max_results = range.getCell(1,1).getValue();

  var email_body = createHead(cutoff_date, terms); 
  email_body = email_body + '<body>';
  
  for (var i = 0; i < terms.length; i++) {
    Logger.log('Querying YT for '.concat(terms[i]));
     var results = YouTube.Search.list('id,snippet', {
       q: terms[i],
       maxResults: max_results,
       publishedAfter: cutoff_date,
       type: "video"
     });

    Logger.log('Found '.concat(results.items.length).concat(' videos matching.'));
    if (results.items.length > 0) {
      email_body = email_body + '<div>Results for '.concat(terms[i]);
      email_body = email_body + '<div>';
      email_body = email_body + '<table border="1">';
      for (var j = 0; j < results.items.length; j++) {
        email_body = email_body + '<tr>';
        var item = results.items[j];
        Logger.log('[%s] Title: %s, published at %s', item.id.videoId, item.snippet.title, item.snippet.publishedAt);
        email_body = email_body + '<td>' + 'https://www.youtube.com/watch?v=' + item.id.videoId + '</td><td>' + item.snippet.title + '</td>';
        email_body = email_body + '</tr>';
      }
      email_body = email_body + '</div>';
      email_body = email_body + '</table>';
      email_body = email_body + '</div>';
    }
  }
  email_body = email_body + '</body>';
  
  // find out the email recipient
  var range = sheet.getRange("C2:D2");
  email_recipient = range.getCell(1, 1).getValue();
  cc_recipient = range.getCell(1, 2).getValue();
  range = sheet.getRange("C4:C4");
  email_subject = range.getCell(1, 1).getValue();

  // find out the email title
  MailApp.sendEmail({to:email_recipient, cc:cc_recipient,subject: email_subject, htmlBody: email_body});
  Logger.log(email_body);
}
