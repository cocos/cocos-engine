const Element = require('./Element');
const { noop } = require('./util');
const { innerWidth, innerHeight } = require('./WindowProperties');

class HTMLElement extends Element {

  constructor(tagName = '') {
    super()
    this.tagName = tagName.toUpperCase()

    this.className = ''
    this.children = []
    this.style = {
      width: `${innerWidth}px`,
      height: `${innerHeight}px`
    }

    this.insertBefore = noop

    this.innerHTML = ''
    this.parentElement = window.canvas
  }

  setAttribute(name, value) {
    this[name] = value
  }

  getAttribute(name) {
    return this[name]
  }

  get clientWidth() {
    const ret = parseInt(this.style.fontSize, 10) * this.innerHTML.length

    return Number.isNaN(ret) ? 0 : ret
  }

  get clientHeight() {
    const ret = parseInt(this.style.fontSize, 10)

    return Number.isNaN(ret) ? 0 : ret
  }

  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: innerWidth,
      height: innerHeight
    }
  }

  focus() {
    
  }
}

module.exports = HTMLElement;
