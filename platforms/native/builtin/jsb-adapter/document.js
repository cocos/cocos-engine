const HTMLElement = require('./HTMLElement');
const Image = require('./Image');
const HTMLCanvasElement = require('./HTMLCanvasElement');
const HTMLVideoElement = require('./HTMLVideoElement');
const HTMLScriptElement = require('./HTMLScriptElement');
const Node = require('./Node');
const FontFaceSet = require('./FontFaceSet');

const jsbWindow = require('../../jsbWindow');

class Document extends Node {
  constructor () {
    super();

    this.readyState = 'complete';
    this.visibilityState = 'visible';
    this.documentElement = globalThis;
    this.hidden = false;
    this.style = {};
    this.location = require('./location');

    this.head = new HTMLElement('head');
    this.body = new HTMLElement('body');

    this.fonts = new FontFaceSet();

    this.scripts = [];
  }

  createElementNS (namespaceURI, qualifiedName, options) {
    return this.createElement(qualifiedName);
  }

  createElement (tagName) {
    if (tagName === 'canvas') {
      return new HTMLCanvasElement(1, 1);
    } else if (tagName === 'img') {
      return new Image();
    } else if (tagName === 'video') {
      return new HTMLVideoElement();
    } else if (tagName === 'script') {
      return new HTMLScriptElement();
    }

    return new HTMLElement(tagName);
  }

  getElementById (id) {
    if (id === jsbWindow.__canvas.id || id === 'canvas') {
      return jsbWindow.__canvas;
    }
    return new HTMLElement(id);
  }

  getElementsByTagName (tagName) {
    if (tagName === 'head') {
      return [document.head];
    } else if (tagName === 'body') {
      return [document.body];
    } else if (tagName === 'canvas') {
      return [jsbWindow.__canvas];
    }
    return [new HTMLElement(tagName)];
  }

  getElementsByName (tagName) {
    if (tagName === 'head') {
      return [document.head];
    } else if (tagName === 'body') {
      return [document.body];
    } else if (tagName === 'canvas') {
      return [jsbWindow.__canvas];
    }
    return [new HTMLElement(tagName)];
  }

  querySelector (query) {
    if (query === 'head') {
      return document.head;
    } else if (query === 'body') {
      return document.body;
    } else if (query === 'canvas') {
      return jsbWindow.__canvas;
    } else if (query === `#${jsbWindow.__canvas.id}`) {
      return jsbWindow.__canvas;
    }
    return new HTMLElement(query);
  }

  querySelectorAll (query) {
    if (query === 'head') {
      return [document.head];
    } else if (query === 'body') {
      return [document.body];
    } else if (query === 'canvas') {
      return [jsbWindow.__canvas];
    } else if (query.startsWith('script[type="systemjs-importmap"]')) {
      return HTMLScriptElement._getAllScriptElementsSystemJSImportType();
    }
    return [new HTMLElement(query)];
  }

  createTextNode () {
      return new HTMLElement('text');
  }

  elementFromPoint () {
      return jsbWindow.canvas;
  }

  createEvent (type) {
      if (jsbWindow[type]) {
          return new jsbWindow[type]();
      }
      return null;
  }

  exitPointerLock () {
    jsb.setCursorEnabled(true);
  }
}

let document = new Document();

module.exports = document;
