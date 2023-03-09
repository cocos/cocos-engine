// import HTMLCanvasElement from './HTMLCanvasElement'
import { innerWidth, innerHeight } from './WindowProperties';

const hasModifiedCanvasPrototype = false;
const hasInit2DContextConstructor = false;
const hasInitWebGLContextConstructor = false;

export default function Canvas () {
  const canvas = wx.createCanvas();

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
    //TODO(xwx):refine for wechat program
    GameGlobal.document.addEventListener(type, listener, options);
  };

  canvas.removeEventListener = function (type, listener) {
    //TODO(xwx): refine for wechat program
    GameGlobal.document.removeEventListener(type, listener);
  };

  canvas.dispatchEvent = function (event = {}) {
    console.log('canvas.dispatchEvent', event.type, event);
    // nothing to do
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
}
