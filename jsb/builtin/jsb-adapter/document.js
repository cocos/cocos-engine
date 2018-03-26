let HTMLElement = require('./HTMLElement');
let Image = require('./Image');
let Audio = require('./Audio');
let HTMLCanvasElement = require('./HTMLCanvasElement');
let Node = require('./Node');
let FontFaceSet = require('./FontFaceSet')

class Document extends Node {

  constructor() {
    super()
    this.readyState = 'complete'
    this.visibilityState = 'visible'
    this.documentElement = window
    this.hidden = false
    this.style = {}
    this.location = window.location

    this.head = new HTMLElement('head')
    this.body = new HTMLElement('body')

    this.fonts = new FontFaceSet()
  }

  createElement(tagName) {
    if (tagName === 'canvas') {
      return new HTMLCanvasElement()
    } else if (tagName === 'audio') {
      return new Audio()
    } else if (tagName === 'img') {
      return new Image()
    } else if (tagName === 'video') {
        return {
            canPlayType: () => {
                return false;
            }
        };
    }

    return new HTMLElement(tagName)
  }

  getElementById(id) {
    if (id === window.canvas.id) {
      return window.canvas
    }
    return null
  }

  getElementsByTagName(tagName) {
    if (tagName === 'head') {
      return [document.head]
    } else if (tagName === 'body') {
      return [document.body]
    } else if (tagName === 'canvas') {
      return [window.canvas]
    }
    return []
  }

  getElementsByName(tagName) {
    if (tagName === 'head') {
      return [document.head]
    } else if (tagName === 'body') {
      return [document.body]
    } else if (tagName === 'canvas') {
      return [window.canvas]
    }
    return []
  }

  querySelector(query) {
    if (query === 'head') {
      return document.head
    } else if (query === 'body') {
      return document.body
    } else if (query === 'canvas' || query === 'GameCanvas') {
      return window.canvas
    } else if (query === `#${window.canvas.id}`) {
      return window.canvas
    }
    return null
  }

  querySelectorAll(query) {
    if (query === 'head') {
      return [document.head]
    } else if (query === 'body') {
      return [document.body]
    } else if (query === 'canvas') {
      return [window.canvas]
    }
    return []
  }

  createTextNode() {
      return new HTMLElement('text');
  }
}

let document = new Document()

module.exports = document
