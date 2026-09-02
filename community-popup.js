(function () {
  var popup = document.getElementById('community-popup');
  if (!popup || typeof popup.showModal !== 'function') return;

  var storageKey = 'ronin-community-invitation-dismissed';
  try {
    if (window.localStorage.getItem(storageKey)) return;
  } catch (_) {
    // A blocked storage API should not prevent the invitation from working.
  }

  function dismiss() {
    try { window.localStorage.setItem(storageKey, '1'); } catch (_) {}
    popup.close();
  }

  popup.querySelector('.community-popup__close').addEventListener('click', dismiss);
  popup.querySelector('[data-community-dismiss]').addEventListener('click', dismiss);
  popup.querySelector('[data-community-join]').addEventListener('click', dismiss);
  popup.addEventListener('cancel', function (event) {
    event.preventDefault();
    dismiss();
  });

  window.setTimeout(function () { popup.showModal(); }, 900);
}());
