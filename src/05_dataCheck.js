/**
 * Check if the attendance records are complete and send emails if they aren't.
 */

function attemptToCheckResponses() {
  try {
    checkForIncompleteResponses();
  } catch (err) {
    emailError(err, 'checkForIncompleteResponses', 'n/a');
  }
}

function checkForIncompleteResponses() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const processSheet = ss.getSheetByName(c.PROCESS_SHEET);

  const lastRow = processSheet.getRange(c.PROCESS_LAST_ROW_CELL[0], c.PROCESS_LAST_ROW_CELL[1]);
  const lastConfirmedRow = processSheet.getRange(c.PROCESS_LAST_CONFIRMED_CELL[0], c.PROCESS_LAST_CONFIRMED_CELL[1]);

  let nameValue, dateValue, startValue, endValue, lengthValue, statusCell, emailDateCell;
  const now = new Date();

  for (i = lastConfirmedRow; i < lastRow + 1; i++) {
    nameValue = processSheet.getRange(i, c.PROCESS_NAME_COL).getValue();
    dateValue = processSheet.getRange(i, c.PROCESS_DATE_COL).getValue();
    startValue = processSheet.getRange(i, c.PROCESS_START_COL).getValue();
    endValue = processSheet.getRange(i, c.PROCESS_END_COL).getValue();
    lengthValue = processSheet.getRange(i, c.PROCESS_LEN_COL).getValue();
    statusCell = processSheet.getRange(i, c.PROCESS_STATUS_COL);
    emailDateCell = processSheet.getRange(i, c.PROCESS_EMAIL_TIME_COL);

    // if the cell is confirmed or no correction or has no name
    if (statusCell.getValue() == c.SessionStatus.Confirmed || 
      statusCell.getValue() == c.SessionStatus.NoCorrection ||
      nameValue == "") {
      console.log(`skipped row ${i} of ${lastRow}`);
      continue;
    }

    if (statusCell.getValue() == c.SessionStatus.Incomplete) {
      console.log(`timed out row ${i} of ${lastRow}`);
      statusCell.setValue(c.SessionStatus.NoCorrection);
    }

    // if the entry has has been timed out
    if (statusCell.getValue() == c.SessionStatus.Pending) {
      if (lengthValue != "") {
        statusCell.setValue(c.SessionStatus.Confirmed);
      }

      if (startValue != "" && endValue != "") {
        throw new Error(`length missing but had both start and end cell for row ${i}`);
      }

      sendForCorrection(nameValue, dateValue, startValue, endValue);
      statusCell.setValue(c.SessionStatus.Incomplete);
      emailDateCell.setValue(Utilities.formatDate(now, c.TIMEZONE, c.DATE_TIME_FORMAT));
    }
  }
}

function sendForCorrection(name, date, start, end) {
  // need to add this and also test everything above 
}
