// Email when there's an error
function emailError(err, context, info) {
  const emailSubject = 'Robotics Attendance Error';

  const emailBody = `There was an error: ${err} <br> 
    context: ${context} <br> \
    info: ${info}`;

  GmailApp.sendEmail(
    c.ERROR_EMAIL,
    emailSubject,
    "",
    {
      name: c.EMAIL_SENDER,
      htmlBody: emailBody,
    }
  );
}

// Email specified person specified body
function emailStudent(name, emailSubject, emailBody) {
  let emailAddress = getEmailAddress(name);

  GmailApp.sendEmail(
    emailAddress,
    emailSubject,
    "",
    {
      name: 'ASL Robotics',
      htmlBody: emailBody,
    }
  );
}

// Get email of a certain person from the sheet
function getEmailAddress(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const emailSheet = ss.getSheetByName(c.TEAM_SHEET);
  const emailSheetLastRow = emailSheet.getLastRow();

  for (let j = 1; j < emailSheetLastRow + 1; j++) {
    if (emailSheet.getRange(j, c.TEAM_NAME_COL).getValue() == name) {
      return emailSheet.getRange(j, c.TEAM_EMAIL_COL).getValue();
    }
  }

  return c.ERROR_EMAIL;
}