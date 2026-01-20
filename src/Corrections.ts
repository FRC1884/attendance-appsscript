/**
 * This script will update the attendance if someone fills out the attendance corrections form. 
 */

/** When the corrections form is submitted, what happens */
function onCorrectionFormSubmission(formData) {
  try {
    makeCorrection(formData); 
  } catch (err) {
    emailError(err, "onCorrectionFormSubmission"); 
  }
}

/** make the actual correction */
function makeCorrection(formData) {
  // need to update sheet 
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const processSheet = ss.getSheetByName(PROCESS_SHEET);

  // get values from form submitted
  const timestamp = formData['Timestamp'][0];
  const corrections_name = formData['Name'][0];
  const which_missed = formData['Which did you forget to do?'][0]; 
  const sign_in_time_string = formData['If you forgot to sign in, what time did you arrive?'][0]; 
  const sign_out_time_string = formData['If you forgot to sign out, what time did you leave?'][0];
  const sign_in_time = timeStringToDate(sign_in_time_string, 'Europe/London');  
  const sign_out_time = timeStringToDate(sign_out_time_string, 'Europe/London');

  const error = `You entered a time which gave you a negative session length. Please resubmit 
    <a href=${CORRECTION_FORM_URL}>the form</a>.`
  const context = `You forgot to ${which_missed} and the time you entered was 
    ${sign_in_time}${sign_out_time}.`;

  // get the entry from the processing table
  const last_row_processing = processSheet.getRange(1, 12).getValue(); 
  const last_row_confirmed = processSheet.getRange(1, 10).getValue(); 
  let found_entry = false; 

  for (let i = last_row_processing; i > last_row_confirmed; i--) {
    process_sheet_status = processSheet.getRange(i, 6); 

    if(process_sheet_status.getValue() != CORRECTING_STATUS) {
      continue; 

    } else if(processSheet.getRange(i, 1).getValue() == corrections_name) {
      found_entry = true;
      process_sheet_in = processSheet.getRange(i, 3); 
      process_sheet_out = processSheet.getRange(i, 4); 
      process_sheet_length = processSheet.getRange(i, 5); 
      last_row_confirmed_new = i;

      if(which_missed == "Sign in" && process_sheet_in.getDisplayValue() == "" && sign_in_time != "") {
        let session_length = process_sheet_out.getValue() - sign_in_time; 
        let session_converted_length = Utilities.formatString("%02d:%02d", Math.floor(session_length/3600000), Math.floor(session_length/60000)%60);

        if (session_length < 0) { // they would have negative length
          console.log(`session length was negative for ${corrections_name} looking at ${timestamp}`); 
          emailError(error, context, corrections_name);
          break; 
        }

        process_sheet_in.setValue(Utilities.formatDate(sign_in_time, 'Europe/London', 'HH:mm')); 
        process_sheet_length.setValue(session_converted_length); 
        process_sheet_status.setValue("confirmed"); 
        break;

      // sign out case
      } else if (which_missed == "Sign out" && process_sheet_out.getDisplayValue() == "" && sign_out_time != "") {
        let session_length = sign_out_time - process_sheet_in.getValue(); 
        let session_converted_length = Utilities.formatString("%02d:%02d", Math.floor(session_length/3600000), Math.floor(session_length/60000)%60);

        if (session_length < 0) { // they would have negative length
          console.log(`session length was negative for ${corrections_name} looking at ${timestamp}`); 
          emailError(error, context, corrections_name);
          break; 
        }

        process_sheet_out.setValue(Utilities.formatDate(sign_out_time, 'Europe/London', 'HH:mm')); 
        process_sheet_length.setValue(session_converted_length); 
        process_sheet_status.setValue("confirmed"); 
        break;
      }  

      break;
    } 
  }

  if (!found_entry) {
    console.log(`correction entry not found for ${formData['Name'][0]}`);
    throw new Error(`correction entry not found for ${formData}`);
  }
}

function timeStringToDate(timeString) {
  if (!timeString) return null;

  const [time, meridiem] = timeString.trim().split(" ");
  let [h, m, s] = time.split(":").map(Number);

  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;

  return new Date(1899, 11, 30, h, m, s || 0);
}
