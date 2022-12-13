const Element = require('./Element');
const { noop } = require('./util');

class HTMLElement extends Element {

  constructor(tagName = '') {
    super()
    this.tagName = tagName.toUpperCase()

    this.className = ''
    this.children = []
    this.style = {
      width: `${window.__engineGlobal__.innerWidth}px`,
      height: `${window.__engineGlobal__.innerHeight}px`
    }

    this.innerHTML = ''
    this.parentElement = window.__engineGlobal__.__canvas
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
