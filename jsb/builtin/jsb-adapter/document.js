/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
 
const HTMLElement = require('./HTMLElement');
const Image = require('./Image');
const Audio = require('./Audio');
const HTMLCanvasElement = require('./HTMLCanvasElement');
const HTMLVideoElement = require('./HTMLVideoElement');
const Node = require('./Node');
const FontFaceSet = require('./FontFaceSet')

class Document extends Node {

  constructor() {
    super()

    this.readyState = 'complete'
    this.visibilityState = 'visible'
    this.documentElement = window
    this.hidden = false
    this.style = {}
    this.location = require('./location')

    this.head = new HTMLElement('head')
    this.body = new HTMLElement('body')

    this.fonts = new FontFaceSet()

    this.scripts = []
  }

  createElementNS(namespaceURI, qualifiedName, options) {
    return this.createElement(qualifiedName);
  }

  createElement(tagName) {
    if (tagName === 'canvas') {
      return new HTMLCanvasElement()
    } else if (tagName === 'audio') {
      return new Audio()
    } else if (tagName === 'img') {
      return new Image()
    } else if (tagName === 'video') {
      return new HTMLVideoElement();
    }

    return new HTMLElement(tagName)
  }

  getElementById(id) {
    if (id === window.__cccanvas.id || id === 'canvas') {
      return window.__cccanvas
    }
    return new HTMLElement(id);
  }

  getElementsByTagName(tagName) {
    if (tagName === 'head') {
      return [document.head]
    } else if (tagName === 'body') {
      return [document.body]
    } else if (tagName === 'canvas') {
      return [window.__cccanvas]
    }
    return [new HTMLElement(tagName)]
  }

  getElementsByName(tagName) {
    if (tagName === 'head') {
      return [document.head]
    } else if (tagName === 'body') {
      return [document.body]
    } else if (tagName === 'canvas') {
      return [window.__cccanvas]
    }
    return [new HTMLElement(tagName)]
  }

  querySelector(query) {
    if (query === 'head') {
      return document.head
    } else if (query === 'body') {
      return document.body
    } else if (query === 'canvas') {
      return window.__cccanvas
    } else if (query === `#${window.__cccanvas.id}`) {
      return window.__cccanvas
    }
    return new HTMLElement(query);
  }

  querySelectorAll(query) {
    if (query === 'head') {
      return [document.head]
    } else if (query === 'body') {
      return [document.body]
    } else if (query === 'canvas') {
      return [window.__cccanvas]
    }
    return [new HTMLElement(query)];
  }

  createTextNode() {
      return new HTMLElement('text');
  }
}

let document = new Document()

module.exports = document
