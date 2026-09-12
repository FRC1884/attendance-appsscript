// convert column number to letter
function columnToLetter(column) {
  let letter = '';
  while (column > 0) {
    let temp = (column - 1) % 26;
    letter = String.fromCharCode(temp+65) + letter;
    column = Math.floor((column - 1) / 26);
  }
  return letter;
}

// get pre-filled link for corrections form
function getPreFilledFormLink(name, date, forgot, signInTime, signOutTime) {
  const forgotFormatted = forgot ? forgot[0].toUpperCase() + forgot.slice(1) : "";
  const formattedSignInTime = signInTime.length == 4 ? '0'+signInTime : signInTime;
  const formattedSignOutTime = signOutTime.length == 4 ? '0'+signOutTime : signOutTime;

  const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeQRCLRUty7X9Lu-hUDHe5PoVrT1asJXDFA3hTM1pCqwThA7g/viewform?usp=pp_url';
  const urlName = `&entry.1989714821=${encodeURIComponent(name).replace(/%20/g, "+")}`;
  const urlDate = `&entry.618312039=${Utilities.formatDate(date, c.TIMEZONE, c.DATE_GOOGLE_FORM_FORMAT)}`;
  const urlForgot = `&entry.1837039774=${encodeURIComponent(forgotFormatted).replace(/%20/g, "+")}`;
  const urlSignInTime = signInTime ? `&entry.44185224=${formattedSignInTime}` : '';
  const urlSignOutTime = signOutTime ? `&entry.413406831=${formattedSignOutTime}` : '';

  return baseUrl+urlName+urlDate+urlForgot+urlSignInTime+urlSignOutTime;
}

// get session type for the relevant date
function getSessionType(date) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sessionSheet = ss.getSheetByName(c.SESSIONS_SHEET);
  const lastRow = sessionSheet.getLastRow();
  const lastCol = sessionSheet.getLastColumn();

  const rangeValues = sessionSheet.getRange(1, 1, lastRow, lastCol).getDisplayValues();
  
  for (let i = 0; i < rangeValues.length; i++) {
    if (rangeValues[i][0] == date) {
      return {
        expectedLength: rangeValues[i][1],
        sessionType: rangeValues[i][2],
      }
    }
  }
  
  return {
    expectedLength: -1,
    sessionType: 'bonus',
  }
}
