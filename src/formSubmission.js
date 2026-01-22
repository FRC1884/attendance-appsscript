/** This function runs whenever a form has been submitted. */
function onFormSubmission(form) {
  try {
    const whichFormSubmitted = form.range.getSheet().getName();
    console.log('submitted form with values: ', form.namedValues);

    if (whichFormSubmitted == c.RAW_INPUT_SHEET) {
      // attendance form submitted
      evaluateAttendanceFormSubmission(form.namedValues);
    } else if (whichFormSubmitted == c.RAW_CORRECTIONS_SHEET) {
      // correction form submitted
      evaluateCorrectionFormSubmission(form.namedValues);
    } else {
      throw new Error('unknown form submitted');
    }
  } catch (err) {
    console.log('error onFormSubmission ', err);
    console.log('the form was: ', form.namedValues);
    emailError(err, 'onFormSubmission', form.namedValues);
  }
}