(() => {
  function loadPromise (url) {
    return new Promise((resolve, reject) => {
      const xhr = new window.XMLHttpRequest();
      xhr.open('GET', `${url}?_=${new Date().getTime()}`, true); // force no cache
      xhr.onreadystatechange = onreadystatechange;
      xhr.send(null);

      function onreadystatechange (e) {
        if (xhr.readyState !== 4) {
          return;
        }

        // Testing harness file:/// results in 0.
        if ([0, 200, 304].indexOf(xhr.status) === -1) {
          reject(new Error(`While loading from url ${url} server responded with a status of ${xhr.status}`));
        } else {
          resolve(e.target.response);
        }
      }
    });
  }

  function _load (url) {
    loadPromise(url).then((result) => {
      if (window.dgui) {
        window.dgui.destroy();
        window.dgui = null;
      }

      cc.director.off(cc.Director.EVENT_BEFORE_UPDATE);
      // cc.director.off(cc.Director.EVENT_AFTER_UPDATE);
      // cc.director.off(cc.Director.EVENT_BEFORE_DRAW);
      // cc.director.off(cc.Director.EVENT_AFTER_DRAW);
      cc.systemEvent.off(cc.SystemEvent.EventType.MOUSE_WHEEL);
      cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
      cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);
      cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_START);
      cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_MOVE);
      cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_END);

      // init dgui
      if (window.dat) {
        const dgui = new window.dat.GUI({ width: 270 });
        dgui.domElement.classList.add('dgui');
        window.dgui = dgui;
      }

      const curAbsPath = (() => {
        const scripts = document.getElementsByTagName('script');
        const lastScriptPath = scripts[scripts.length - 1].src;
        const segs = lastScriptPath.split('/');
        if (segs.length >= 1) {
          segs.pop();
        }
        const path = `${segs.join('/')}/`;
        return path;
      })();

      // eslint-disable-next-line no-eval
      eval(`(() => {\n${result}\n})();\n\n//# sourceURL=${curAbsPath + url}`);
      window.cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, () => {
        window.stats.update();
      });
    }).catch((err) => {
      console.error(err);
    });
  }

  document.addEventListener('readystatechange', () => {
    if (document.readyState !== 'complete') return;

    const view = document.getElementById('view');
    const showFPS = document.getElementById('showFPS');
    const enableSpector = document.getElementById('spector');
    const enableVConsole = document.getElementById('vconsole');
    const exampleList = document.getElementById('exampleList');

    // update profile
    showFPS.checked = localStorage.getItem('engine.showFPS') === 'true';
    enableSpector.checked = localStorage.getItem('engine.enableSpector') === 'true';
    enableVConsole.checked = localStorage.getItem('engine.enableVConsole') === 'true';
    let exampleIndex = parseInt(localStorage.getItem('engine.exampleIndex'));
    if (Number.isNaN(exampleIndex) || exampleIndex >= exampleList.childElementCount) exampleIndex = 0;
    exampleList.selectedIndex = exampleIndex;

    // init stats
    if (window.Stats) {
      const stats = new window.Stats();
      stats.dom.style.cssText = 'position:fixed;top:0;right:0;cursor:pointer;opacity:0.9;z-index:10000';
      stats.dom.style.display = showFPS.checked ? 'block' : 'none';
      document.body.appendChild(stats.dom);
      window.stats = stats;
      showFPS.addEventListener('click', (event) => {
        localStorage.setItem('engine.showFPS', event.target.checked);
        stats.dom.style.display = event.target.checked ? 'block' : 'none';
      });
    }

    // init spector
    const url = '../node_modules/spectorjs/dist/spector.bundle.js';
    loadPromise(url).then((result) => {
      // eslint-disable-next-line no-eval
      eval(`${result}\n//# sourceURL=${url}`);
      if (enableSpector.checked) {
        window.spector = new window.SPECTOR.Spector();
        window.spector.displayUI();
      }
      enableSpector.addEventListener('click', () => {
        // localStorage.setItem('engine.enableSpector', event.target.checked);
        if (enableSpector.checked) {
          window.spector = new window.SPECTOR.Spector();
          window.spector.displayUI();
        }
      });
    });

    // init vconsole
    if (window.VConsole) {
      if (enableVConsole.checked) window.vconsole = new window.VConsole();
      enableVConsole.addEventListener('click', () => {
        // localStorage.setItem('engine.enableVConsole', event.target.checked);
        if (enableVConsole.checked) window.vconsole = new window.VConsole();
      });
    }

    // create canvas
    const bcr = view.getBoundingClientRect();
    const canvas = document.getElementById('GameCanvas');
    canvas.classList.add('fit');
    canvas.tabIndex = -1;
    canvas.width = bcr.width;
    canvas.height = bcr.height;

    // init engine
    window.cc.game.init({
      adapter: { canvas, container: canvas.parentNode, frame: canvas.parentNode.parentNode },
      customJointTextureLayouts: [],
    });
    window.cc.game.run(() => {
      _load(exampleList.value);
      window.addEventListener('resize', () => {
        const bcr = view.getBoundingClientRect();
        cc.director.root.resize(bcr.width, bcr.height);
      });
      const bcr = view.getBoundingClientRect();
      cc.director.root.resize(bcr.width, bcr.height);
      exampleList.addEventListener('change', (event) => {
        localStorage.setItem('engine.exampleIndex', event.target.selectedIndex);
        _load(exampleList.value);
      });
    });
  });
})();
