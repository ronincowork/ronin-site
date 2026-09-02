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
  popup.querySelector('[data-community-form]').addEventListener('submit', function (event) {
    event.preventDefault();
    var data = new FormData(event.currentTarget);
    var email = String(data.get('email') || '').trim();
    var agents = data.getAll('agents');
    var interests = data.getAll('interests');
    var note = String(data.get('note') || '').trim();
    var body = [
      'Please add me to the Ronin community.',
      '',
      'Email: ' + email,
      'Agents I use: ' + (agents.length ? agents.join(', ') : 'Not specified'),
      'I am interested in: ' + (interests.length ? interests.join(', ') : 'Not specified'),
      'Anything else: ' + (note || '—')
    ].join('\n');
    window.location.href = 'mailto:support@ronincowork.com?subject=' +
      encodeURIComponent('Join the Ronin community') + '&body=' + encodeURIComponent(body);
    dismiss();
  });
  popup.addEventListener('cancel', function (event) {
    event.preventDefault();
    dismiss();
  });

  window.setTimeout(function () { popup.showModal(); }, 900);
}());
