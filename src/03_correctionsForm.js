/**
 * This code evaluates when the corrections form is submitted.
 */

function evaluateCorrectionFormSubmission(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const processSheet = ss.getSheetByName(c.PROCESS_SHEET);

  const cleanData = {};
  for (const key in formData) {
    cleanData[key] = formData[key][0];
  }

  const needToAddFullEntry = cleanData['Which did you forget to do?'] == "Both" ? true : false;

  if (needToAddFullEntry) {
    addFullEntry(processSheet, cleanData);
  } else {
    updateProcessEntryCorrections(processSheet, cleanData);
  }
}

function updateProcessEntryCorrections(processSheet, cleanData) {
  let isIn = false;
  if (cleanData['Which did you forget to do?'] == 'Sign in') {
    isIn = true;
    cleanData['time'] = cleanData['If you forgot to sign in, what time did you arrive?'];
  } else {
    cleanData['time'] = cleanData['If you forgot to sign out, what time did you arrive?'];
  }

  const sessions = findAllSessions(processSheet, cleanData['Name'], cleanData['date'], true);

  const { hasValidSession, validSessionRow } = checkSessionValidity(processSheet, sessions, cleanData, isIn);

  if (hasValidSession) {
    updateProcessEntry(processSheet, cleanData, validSessionRow, false)
  } else {
    emailError('update process entry corrections failed', cleanData['time'], cleanData);
  }
}

function addFullEntry(processSheet, cleanData) {
  const processLastRow = processSheet.getRange(c.PROCESS_LAST_ROW_CELL[0], c.PROCESS_LAST_ROW_CELL[1]).getValue();
  const nextRow = processLastRow + 1;

  const startCell = `${columnToLetter(c.PROCESS_START_COL)}${nextRow}`;
  const endCell = `${columnToLetter(c.PROCESS_END_COL)}${nextRow}`;
  const lenFormula = `=IF(AND(${startCell}<>"", ${endCell}<>""), ${endCell}-${startCell}, "")`;

  const signInTime = cleanData['If you forgot to sign in, what time did you arrive?'];
  const signOutTime = cleanData['If you forgot to sign out, what time did you leave?'];

  // TODO: move validation somewhere else 
  const signInHours = new Date(`2026-01-01 ${signInTime}`).getHours();
  const signOutHours = new Date(`2026-01-01 ${signOutTime}`).getHours();

  if (signInHours < 6 || signInHours > signOutHours || signInTime == "" || signOutTime == "") {
    throw new Error(`Invalid hours: sign in at ${signInTime}, sign out at ${signOutTime}`);
  }

  processSheet.getRange(nextRow, c.PROCESS_NAME_COL).setValue(cleanData['Name']);
  processSheet.getRange(nextRow, c.PROCESS_DATE_COL).setValue(cleanData['Session Date']).setNumberFormat(c.DATE_FORMAT);
  processSheet.getRange(nextRow, c.PROCESS_LEN_COL).setFormula(lenFormula);
  processSheet.getRange(nextRow, c.PROCESS_STATUS_COL).setValue(c.SessionStatus.Confirmed);

  processSheet.getRange(nextRow, c.PROCESS_START_COL).setValue(signInTime);
  processSheet.getRange(nextRow, c.PROCESS_END_COL).setValue(signOutTime);

  console.log(`added full corrections entry for ${cleanData['Name']} at ${cleanData['Timestamp']}`);
}
