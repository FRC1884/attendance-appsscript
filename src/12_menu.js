/**
 * Adds a custom menu to the spreadsheet.
 */

function onOpen(e) {
  const menu = SpreadsheetApp.getUi().createMenu('Attendance');
  menu
    .addItem('attemptToCheckResponses', 'attemptToCheckResponses')
    .addItem('create trigger: on form submit', 'createOnFormSubmitTrigger')
    .addItem('create trigger: timebased check for incomplete', 'createIncompleteResponseCheckTrigger')
    .addToUi();
}
