(function () {
  var key = 'ronin-theme';
  var choices = ['auto', 'light', 'dark'];
  var saved = 'auto';
  try {
    var value = localStorage.getItem(key);
    if (choices.indexOf(value) !== -1) saved = value;
  } catch (_) {}

  function apply(value) {
    if (value === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', value);
  }

  function label(value) {
    return 'Theme: ' + value.charAt(0).toUpperCase() + value.slice(1);
  }

  apply(saved);

  window.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    var button = document.createElement('button');
    button.className = 'theme-switch';
    button.type = 'button';
    button.setAttribute('data-theme-choice', saved);
    button.setAttribute('aria-label', label(saved));
    button.title = label(saved);
    button.innerHTML = '<span class="theme-switch__track" aria-hidden="true"><i></i></span>';

    button.addEventListener('click', function () {
      var current = button.getAttribute('data-theme-choice') || 'auto';
      var next = choices[(choices.indexOf(current) + 1) % choices.length];
      apply(next);
      button.setAttribute('data-theme-choice', next);
      button.setAttribute('aria-label', label(next));
      button.title = label(next);
      try { localStorage.setItem(key, next); } catch (_) {}
    });

    nav.insertBefore(button, nav.firstChild);
  });
})();
