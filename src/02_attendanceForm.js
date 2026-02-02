/**
 * This code evaluates when the attendance form is submitted.
 */

function evaluateAttendanceFormSubmission(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const processSheet = ss.getSheetByName(c.PROCESS_SHEET);
  const processLastRow = processSheet.getRange(c.PROCESS_LAST_ROW_CELL[0], c.PROCESS_LAST_ROW_CELL[1]).getValue();

  const cleanData = {};
  for (const key in formData) {
    cleanData[key] = formData[key][0];
  }
  const timeAsDate = new Date(cleanData['Timestamp']);
  cleanData['time'] = Utilities.formatDate(timeAsDate, c.TIMEZONE, c.DURATION_FORMAT);
  cleanData['date'] = Utilities.formatDate(timeAsDate, c.TIMEZONE, c.DATE_FORMAT);
  const submittedInOut = cleanData['IN/OUT'];

  if (submittedInOut == 'IN') {
    checkIn(processSheet, cleanData, processLastRow);
  } else {
    checkOut(processSheet, cleanData, processLastRow);
  }
}

// process when a person checks in
function checkIn(processSheet, cleanData, processLastRow) {
  addProcessEntry(processSheet, processLastRow, cleanData, true);
}

// process when a person checks out
function checkOut(processSheet, cleanData, processLastRow) {
  const sessions = findAllSessions(processSheet, cleanData['Name'], cleanData['date'], false);

  // they forgot to sign in
  if (sessions.length === 0) {
    addProcessEntry(processSheet, processLastRow, cleanData, false);
    return;
  }

  // they did not forget to sign in
  const { hasValidSession, validSessionRow } = checkSessionValidity(processSheet, sessions, cleanData, false);

  if (hasValidSession) {
    updateProcessEntry(processSheet, cleanData, validSessionRow, false)
  } else {
    emailError('checkOut failed', cleanData['time'], cleanData);
  }
}
