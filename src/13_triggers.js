/**
 * This file contains all of the triggers which will prompt functions to run. 
 * These need to be run once to be created. 
 */

// This trigger happens on form submissions
function createOnFormSubmitTrigger() {
  const ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('onFormSubmission')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
}
