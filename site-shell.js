function copyText(button, text) {
  function finish(label) {
    var old = button.textContent;
    button.textContent = label;
    window.setTimeout(function () { button.textContent = old; }, 1400);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { finish('copied'); }, function () { finish('select it'); });
    return;
  }
  var target = document.querySelector(button.getAttribute('data-copy-target'));
  var range = document.createRange();
  range.selectNodeContents(target);
  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  finish('selected');
}
