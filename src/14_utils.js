/** convert column number to letter */
function columnToLetter(column) {
  let letter = '';
  while (column > 0) {
    let temp = (column - 1) % 26;
    letter = String.fromCharCode(temp+65) + letter;
    column = Math.floor((column - 1) / 26);
  }
  return letter;
}
