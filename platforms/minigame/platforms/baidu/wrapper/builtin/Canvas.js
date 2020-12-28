/* eslint-disable */
import * as Mixin from './util/mixin'
// import HTMLCanvasElement from './HTMLCanvasElement'

// TODO
let hasModifiedCanvasPrototype = false
let hasInit2DContextConstructor = false
let hasInitWebGLContextConstructor = false

export default function Canvas() {
    const canvas = swan.createCanvas()

    const _getContext = canvas.getContext;

    // canvas.__proto__.__proto__.__proto__ = new HTMLCanvasElement()

    if (!('tagName' in canvas)) {
        canvas.tagName = 'CANVAS'
    }

    canvas.type = 'canvas'

    Mixin.parentNode(canvas);
    Mixin.style(canvas);
    Mixin.classList(canvas);
    Mixin.clientRegion(canvas);
    Mixin.offsetRegion(canvas);

    canvas.focus = function() {};
    canvas.blur = function() {};

    canvas.addEventListener = function(type, listener, options = {}) {
        // console.log('canvas.addEventListener', type);
        document.addEventListener(type, listener, options);
    }

    canvas.removeEventListener = function(type, listener) {
        // console.log('canvas.removeEventListener', type);
        document.removeEventListener(type, listener);
    }

    canvas.dispatchEvent = function(event = {}) {
        console.log('canvas.dispatchEvent', event.type, event);
        // nothing to do
    }

    return canvas
}
