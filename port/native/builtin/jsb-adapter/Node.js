const EventTarget = require('./EventTarget');

class Node extends EventTarget {
  constructor() {
    super()
    this.childNodes = []
    this.parentNode = window.__canvas;
  }

  appendChild(node) {
    if (node instanceof Node) {
      this.childNodes.push(node)
    } else {
      throw new TypeError('Failed to executed \'appendChild\' on \'Node\': parameter 1 is not of type \'Node\'.')
    }
  }

  insertBefore(newNode, referenceNode) {
    //REFINE:
    return newNode;
  }

  replaceChild(newChild, oldChild) {
    //REFINE:
    return oldChild;
  }

  cloneNode() {
    const copyNode = Object.create(this)

    Object.assign(copyNode, this)
    return copyNode
  }

  removeChild(node) {
    const index = this.childNodes.findIndex((child) => child === node)

    if (index > -1) {
      return this.childNodes.splice(index, 1)
    }
    return null
  }

  contains(node) {
    return this.childNodes.indexOf(node) > -1;
  }
}

module.exports = Node;
