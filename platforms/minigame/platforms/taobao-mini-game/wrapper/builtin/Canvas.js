import { innerWidth, innerHeight } from './WindowProperties';

function Canvas () {}

const CanvasProxy = new Proxy(Canvas, {
  construct () {
    const canvas = my.createCanvas();

    canvas.type = 'canvas';

    // canvas.__proto__.__proto__.__proto__ = new HTMLCanvasElement()

    const _getContext = canvas.getContext;

    canvas.getBoundingClientRect = () => {
      const ret = {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
      return ret;
    };

    canvas.style = {
      top: '0px',
      left: '0px',
      width: `${innerWidth}px`,
      height: `${innerHeight}px`,
    };

    canvas.addEventListener = function (type, listener, options = {}) {
      // console.log('canvas.addEventListener', type);
      $global.document.addEventListener(type, listener, options);
    };

    canvas.removeEventListener = function (type, listener) {
      // console.log('canvas.removeEventListener', type);
      $global.document.removeEventListener(type, listener);
    };

    canvas.dispatchEvent = function (event = {}) {
      console.log('canvas.dispatchEvent', event.type, event);
      if (my.isIDE) {
        $global.document.dispatchEvent(event);
      }
    };

    Object.defineProperty(canvas, 'clientWidth', {
      enumerable: true,
      get: function get () {
        return innerWidth;
      },
    });

    Object.defineProperty(canvas, 'clientHeight', {
      enumerable: true,
      get: function get () {
        return innerHeight;
      },
    });

    return canvas;
  },
});

// Expose the global canvas
$global.screencanvas = $global.screencanvas || new CanvasProxy();

// NOTE: this is a hack operation
// let canvas = new window.Canvas()
// console.error(canvas instanceof window.Canvas)  => false
export default CanvasProxy;
