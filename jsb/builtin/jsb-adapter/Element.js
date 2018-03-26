let Node = require('./Node');

class Element extends Node {
  constructor() {
    super()
    this.className = ''
    this.children = []
  }
}

module.exports = Element;
