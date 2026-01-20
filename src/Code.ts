/**
 * This script processes attendance data once the form is submitted, and will update the process sheet. 
 * Process: 
 * - Form is submitted
 * - Added to process form for in / out 
 */

const RAW_DATA_SHEET = 'Data';
const PROCESS_SHEET = 'Process';
const CORRECTIONS_SHEET = 'Corrections';
const CORRECTION_FORM_URL = "https://forms.gle/8npSN7TMSbzuE7BX8";
const TEAM_SHEET_NAME = "Team"; 
const CORRECTING_STATUS = "email sent"; 

/** This function runs whenever a form is submitted. */
function onFormSubmission(form) {
  try {
    // if the form submitted was the attendance form, generate the table
    if(form.range.getSheet().getName() == RAW_DATA_SHEET) {
      console.log('submitted attendance form with values: ', form.namedValues);
      tableGenerator(form.namedValues); 
    } else {
      // if the form submitted was a correction, do the corrections 
      console.log('submitted corrections form with values: ', form.namedValues);
      onCorrectionFormSubmission(form.namedValues); 
    }
  } catch (err) {
    console.log('there was an error ', err);
    console.log('the form was: ', form.namedValues);
    emailError(err, "onFormSubmission"); 
  }
}

/** This function will update the list of people/sessions. */
function tableGenerator(submittedData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const processSheet = ss.getSheetByName(PROCESS_SHEET);
  const processLastRow = processSheet.getRange(1, 12).getValue();

  // once the form is submitted, update the table based on if it was an in or out 
  const submittedInOut = submittedData['IN/OUT'][0];
  if (submittedInOut == 'IN') {
    checkIn(processSheet, submittedData, processLastRow);
  } else {
    checkOut(processSheet, submittedData, processLastRow);
  }
}

/** when you check in, add a row */
function checkIn(processSheet, submittedData, processLastRow) {
  next_row = processLastRow+1;
  
  name = submittedData['Name'][0];
  timestamp = submittedData['Timestamp'][0];
  time = Utilities.formatDate(new Date(timestamp), 'Europe/London', 'HH:mm');
  date = Utilities.formatDate(new Date(timestamp), 'Europe/London', 'yyyy-MM-dd');

  console.log(`logged in ${name} at ${timestamp} ${time}`); 

  processSheet.getRange(next_row, 1).setValue(name);
  processSheet.getRange(next_row, 2).setValue(timestamp);
  processSheet.getRange(next_row, 3).setValue(time);
}

/** when you check out  */
function checkOut(processSheet, submittedData, processLastRow) {
  name = submittedData['Name'][0];
  timestamp = submittedData['Timestamp'][0];
  timestampDate = new Date(timestamp);
  time = Utilities.formatDate(new Date(timestamp), 'Europe/London', 'HH:mm');
  lastSession = processLastRow;

  console.log(`logged out ${name} at ${timestamp} ${time}`); 

  var noValidIn = true;

  for (i = lastSession; i > 0; i--) {
    // find the last session where they signed in 
    if (processSheet.getRange(i, 1).getValue().valueOf() == name) {
      // check if this session already has a value for out
      if (!processSheet.getRange(i, 4).getValue() == "") {
        break;
      }
      
      noValidIn = false;

      startTime = processSheet.getRange(i, 2).getValue();
      length = timestampDate - startTime;
      converted_length = Utilities.formatString("%02d:%02d", Math.floor(length/3600000), Math.floor(length/60000)%60);

      // only update if they signed in less than 20 hours ago
      if (length < 72000000) {
        processSheet.getRange(i, 4).setValue(time);
        processSheet.getRange(i, 5).setValue(converted_length);
      }
      break;
    }
  }

  // if it never finds a session add a new row 
  if (noValidIn == true) {
    processSheet.getRange(lastSession + 1, 1).setValue(name);
    processSheet.getRange(lastSession + 1, 2).setValue(timestamp);
    processSheet.getRange(lastSession + 1, 4).setValue(time);
  }
}

/** Email mackensie (or the person) when there's an error */
function emailError(err, context, name) {
  let email_address = getEmailAddress(name); 
  const email_subject = 'Robotics Attendance Error'; 
  
  const email_body = `There was an error: ${err}<br> context: ${context}`; 

  // send the reminder email 
  GmailApp.sendEmail(
    email_address, 
    email_subject, 
    "", 
    { name: 'ASL Robotics', 
      htmlBody: email_body, 
    }
  );
}

