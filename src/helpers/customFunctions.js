function selectHelper(status, options) {
  return options
    .fn(this)
    .replace(new RegExp('value="' + status + '"'), '$&selected="selected"');
}

function checkboxHelper(condition) {
  return condition ? "checked" : "";
}

function disabledHelper(condition) {
  return condition ? "" : "disabled";
}

function toDateString(dateUTC) {
  return dateUTC.toDateString();
}

export { selectHelper, checkboxHelper, disabledHelper, toDateString };
