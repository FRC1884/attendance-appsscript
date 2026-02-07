/**
 * This contains the code used to update records.
 */

// Add an entry to the process sheet
function addProcessEntry(processSheet, processLastRow, cleanData, isIn) {
  const nextRow = processLastRow + 1;

  console.log(`logged ${isIn} ${cleanData['Name']} at ${cleanData['Timestamp']}`);

  const startCell = `${columnToLetter(c.PROCESS_START_COL)}${nextRow}`;
  const endCell = `${columnToLetter(c.PROCESS_END_COL)}${nextRow}`;
  const lenFormula = `=IF(AND(${startCell}<>"", ${endCell}<>""), ${endCell}-${startCell}, "")`;

  processSheet.getRange(nextRow, c.PROCESS_NAME_COL).setValue(cleanData['Name']);
  processSheet.getRange(nextRow, c.PROCESS_DATE_COL).setValue(cleanData['date']).setNumberFormat(c.DATE_FORMAT);
  processSheet.getRange(nextRow, c.PROCESS_LEN_COL).setFormula(lenFormula);
  processSheet.getRange(nextRow, c.PROCESS_STATUS_COL).setValue(c.SessionStatus.Pending);

  if (isIn) {
    processSheet.getRange(nextRow, c.PROCESS_START_COL).setValue(cleanData['time']);
  } else {
    processSheet.getRange(nextRow, c.PROCESS_END_COL).setValue(cleanData['time']);
  }
}

// update a process entry
function updateProcessEntry(processSheet, cleanData, validSessionRow, isIn) {
  if (isIn) {
    processSheet.getRange(validSessionRow, c.PROCESS_START_COL).setValue(cleanData['time']);
  } else {
    processSheet.getRange(validSessionRow, c.PROCESS_END_COL).setValue(cleanData['time']);
  }

  processSheet.getRange(validSessionRow, c.PROCESS_STATUS_COL).setValue(c.SessionStatus.Confirmed);
  console.log(`updated entry for ${cleanData['Name']} in row ${validSessionRow} at ${cleanData['Timestamp']}`);
}

// find all sessions with the name and date
function findAllSessions(processSheet, name, date, checkExtended) {
  const processLastRow = processSheet.getRange(c.PROCESS_LAST_ROW_CELL[0], c.PROCESS_LAST_ROW_CELL[1]).getValue();

  const limit = checkExtended ? 1 : Math.max(1, processLastRow - 100);
  const numRows = processLastRow - limit + 1;

  const values = processSheet.getRange(limit, c.PROCESS_NAME_COL, numRows, c.PROCESS_DATE_COL).getValues();

  const nameIndex = 0;
  const dateIndex = 1;
  const sessions = [];
  let parsedDate, parsedDateAlt = '';

  for (let i = values.length - 1; i >= 0; i--) {
    parsedDate = Utilities.formatDate(new Date(values[i][dateIndex]), c.TIMEZONE, c.DATE_FORMAT);
    parsedDateAlt = Utilities.formatDate(new Date(values[i][dateIndex]), c.TIMEZONE, c.DATE_FORMAT_TWO);

    if (values[i][nameIndex] == name && (parsedDate == date || parsedDateAlt == date)) {
      sessions.push(limit + i);
    }
  }

  return sessions;
}

// check if a session is valid
function checkSessionValidity(processSheet, sessions, cleanData, isIn) {
  let difference = -1;

  for (const session of sessions) {
    let hour = cleanData['time'] ? new Date(cleanData['time']) : new Date(cleanData['Timestamp']).getHours();

    // session time is within an acceptable timeframe (not midnight - 6am)
    if (hour < 6) {
      continue;
    }
    // session length is not negative
    processSheet.getRange(session, c.PROCESS_EXTRA_COL_ONE).setValue(cleanData['time']);
    const startCell = `${columnToLetter(c.PROCESS_START_COL)}${session}`;
    const endCell = `${columnToLetter(c.PROCESS_END_COL)}${session}`;
    const extraCell = `${columnToLetter(c.PROCESS_EXTRA_COL_ONE)}${session}`;
    let formula = '';
    if (isIn) {
      formula = `=${endCell}-${extraCell}`;
    } else {
      formula = `=${extraCell}-${startCell}`;
    }

    processSheet.getRange(session, c.PROCESS_EXTRA_COL_TWO).setFormula(formula);

    let difference = processSheet.getRange(session, c.PROCESS_EXTRA_COL_TWO).getDisplayValue();
    let isNegative = difference.trim().startsWith("-");

    processSheet.getRange(session, c.PROCESS_EXTRA_COL_ONE).setValue('');
    processSheet.getRange(session, c.PROCESS_EXTRA_COL_TWO).setValue('');

    if (!isNegative){
      return {
        hasValidSession: true,
        validSessionRow: session,
        sessionLength: difference,
      };
    }
  }

  return {
    hasValidSession: false,
    validSessionRow: -1,
    sessionLength: difference,
  };
}
