const Element = require('./Element');
const { noop } = require('./util');

class HTMLElement extends Element {

  constructor(tagName = '') {
    super()
    this.tagName = tagName.toUpperCase()

    this.className = ''
    this.children = []
    this.style = {
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`
    }

    this.innerHTML = ''
    this.parentElement = window.__canvas
  }

  setAttribute(name, value) {
    this[name] = value
  }

  getAttribute(name) {
    return this[name]
  }

  focus() {
    
  }
}

module.exports = HTMLElement;
