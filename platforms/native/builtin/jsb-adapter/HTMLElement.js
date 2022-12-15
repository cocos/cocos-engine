const Element = require('./Element');
const { noop } = require('./util');

const jsbWindow = globalThis.jsb.window;

class HTMLElement extends Element {
  constructor (tagName = '') {
    super();
    this.tagName = tagName.toUpperCase();

    this.className = '';
    this.children = [];
    this.style = {
      width: `${jsbWindow.innerWidth}px`,
      height: `${jsbWindow.innerHeight}px`,
    };

    this.innerHTML = '';
    this.parentElement = jsbWindow.__canvas;
  }

  setAttribute (name, value) {
    this[name] = value;
  }

  getAttribute (name) {
    return this[name];
  }

  focus () {

  }
}

module.exports = HTMLElement;
