import * as _window from './window'
import HTMLElement from './HTMLElement'
import Image from './Image'
import Canvas from './Canvas'
import Audio from './Audio'

const events = {}

var document = {
  readyState: 'complete',
  visibilityState: 'visible',
  documentElement: _window,
  hidden: false,
  style: {},
  location: _window.location,
  ontouchstart: null,
  ontouchmove: null,
  ontouchend: null,

  head: new HTMLElement('head'),
  body: new HTMLElement('body'),

  createElement(tagName) {
    tagName = tagName.toLowerCase();
    if (tagName === 'canvas') {
      return new Canvas()
    } else if (tagName === 'audio') {
      return new Audio()
    } else if (tagName === 'img') {
      return new Image()
    }

    return new HTMLElement(tagName)
  },

  createElementNS(nameSpace, tagName) {
    return this.createElement(tagName);
  },

  getElementById(id) {
    if (id === _window.canvas.id) {
      return _window.canvas
    }
    return null
  },

  getElementsByTagName(tagName) {
    if (tagName === 'head') {
      return [document.head]
    } else if (tagName === 'body') {
      return [document.body]
    } else if (tagName === 'canvas') {
      return [_window.canvas]
    }
    return []
  },

  getElementsByName(tagName) {
    if (tagName === 'head') {
      return [document.head]
    } else if (tagName === 'body') {
      return [document.body]
    } else if (tagName === 'canvas') {
      return [_window.canvas]
    }
    return []
  },

  querySelector(query) {
    if (query === 'head') {
      return document.head
    } else if (query === 'body') {
      return document.body
    } else if (query === 'canvas') {
      return _window.canvas
    } else if (query === `#${_window.canvas.id}`) {
      return _window.canvas
    }
    return null
  },

  querySelectorAll(query) {
    if (query === 'head') {
      return [document.head]
    } else if (query === 'body') {
      return [document.body]
    } else if (query === 'canvas') {
      return [_window.canvas]
    }
    return []
  },

  addEventListener(type, listener) {
    if (!events[type]) {
      events[type] = []
    }
    events[type].push(listener)
  },

  removeEventListener(type, listener) {
    const listeners = events[type]

    if (listeners && listeners.length > 0) {
      for (let i = listeners.length; i--; i > 0) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1)
          break
        }
      }
    }
  },

  dispatchEvent(event) {
    const listeners = events[event.type]

    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](event)
      }
    }
  }
}

export { document }
