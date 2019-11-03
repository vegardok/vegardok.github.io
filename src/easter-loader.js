(function loader() {
  function load() {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('src', 'snake.js');
    scriptEl.setAttribute('type', 'application/javascript');
    document.getElementsByTagName('body').item(0).append(scriptEl);

    document.removeEventListener('keyup', keyhandler);
  }

  const code = [
    'arrowup',
    'arrowup',
    'arrowdown',
    'arrowdown',
    'arrowleft',
    'arrowright',
    'arrowleft',
    'arrowright',
    'a',
    'b'
  ];
  let keyHistory = [];

  function keyhandler({ key }) {
    key = key.toLowerCase();
    keyHistory.push(key);
    keyHistory = keyHistory.slice(-code.length);
    if (code.join(',') === keyHistory.join(',')) {
      load();
    }
  }

  document.addEventListener('keyup', keyhandler);
})();
