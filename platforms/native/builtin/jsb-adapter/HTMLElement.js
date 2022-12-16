const Element = require('./Element');
const { noop } = require('./util');
const jsbWindow = require('../../jsbWindow');

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
