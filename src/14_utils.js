// convert column number to letter
function columnToLetter(column) {
  let letter = '';
  while (column > 0) {
    let temp = (column - 1) % 26;
    letter = String.fromCharCode(temp+65) + letter;
    column = Math.floor((column - 1) / 26);
  }
  return letter;
}

// get pre-filled link for corrections form 
function getPreFilledFormLink(name, date, forgot, signInTime, signOutTime) {
  const forgotFormatted = forgot ? forgot[0].toUpperCase() + forgot.slice(1) : "";
  const formattedSignInTime = signInTime.length == 4 ? '0'+signInTime : signInTime;
  const formattedSignOutTime = signOutTime.length == 4 ? '0'+signOutTime : signOutTime;

  const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdmiOa5IK2I_BxZ_agh7ezqYEjSJuR9RenPvf1lwlPapZyilg/viewform?usp=pp_url';
  const urlName = `&entry.611374195=${encodeURIComponent(name).replace(/%20/g, "+")}`;
  const urlDate = `&entry.1283689077=${Utilities.formatDate(date, c.TIMEZONE, c.DATE_GOOGLE_FORM_FORMAT)}`;
  const urlForgot = `&entry.2022018068=${encodeURIComponent(forgotFormatted).replace(/%20/g, "+")}`;
  const urlSignInTime = signInTime ? `&entry.1007118312=${formattedSignInTime}` : '';
  const urlSignOutTime = signOutTime ? `&entry.1429947177=${formattedSignOutTime}` : '';

  return baseUrl+urlName+urlDate+urlForgot+urlSignInTime+urlSignOutTime;
}
