/**
 * Adds a custom menu to the spreadsheet.
 */

function onOpen(e) {
  const menu = SpreadsheetApp.getUi().createMenu('Attendance');
  menu
    .addItem('createOnFormSubmitTrigger', 'createOnFormSubmitTrigger')
    .addToUi();
}
