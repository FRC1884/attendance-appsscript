/** This creates a menu in the spreadsheet. */
function onOpen(e) {
  const menu = SpreadsheetApp.getUi().createMenu('Attendance')
  menu
    .addItem('Table Generator', 'tableGenerator')
    .addItem('checkForIncompleteResponses', 'checkForIncompleteResponses')
    .addToUi();
}
