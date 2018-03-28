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
let HTMLAudioElement = require('./HTMLAudioElement');

const HAVE_NOTHING = 0
const HAVE_METADATA = 1
const HAVE_CURRENT_DATA = 2
const HAVE_FUTURE_DATA = 3
const HAVE_ENOUGH_DATA = 4

const _innerAudioContext = new WeakMap()
const _src = new WeakMap()
const _loop = new WeakMap()
const _autoplay = new WeakMap()

class Audio extends HTMLAudioElement {

//  constructor(url) {
//    super()
//
//    this.readyState = HAVE_NOTHING
//
//    _src.set(this, '')
//
//    const innerAudioContext = {};//cjh wx.createInnerAudioContext()
//
//    _innerAudioContext.set(this, innerAudioContext)
//
//    innerAudioContext.onCanplay(() => {
//      this.dispatchEvent({ type: 'load' })
//      this.dispatchEvent({ type: 'loadend' })
//      this.dispatchEvent({ type: 'canplay'})
//      this.dispatchEvent({ type: 'canplaythrough' })
//      this.dispatchEvent({ type: 'loadedmetadata' })
//      this.readyState = HAVE_CURRENT_DATA
//    })
//    innerAudioContext.onPlay(() => {
//      this.dispatchEvent({ type: 'play' })
//    })
//    innerAudioContext.onPause(() => {
//      this.dispatchEvent({ type: 'pause' })
//    })
//    innerAudioContext.onEnded(() => {
//      this.dispatchEvent({ type: 'ended' })
//      this.readyState = HAVE_ENOUGH_DATA
//    })
//    innerAudioContext.onError(() => {
//      this.dispatchEvent({ type: 'error' })
//    })
//
//    if (url) {
//      _innerAudioContext.get(this).src = url
//    }
//  }
//
//  load() {
//    console.warn('HTMLAudioElement.load() is not implemented.')
//  }
//
//  play() {
//    _innerAudioContext.get(this).play()
//  }
//
//  pause() {
//    _innerAudioContext.get(this).pause()
//  }
//
//  canPlayType(mediaType = '') {
//    if (typeof mediaType !== 'string') {
//      return ''
//    }
//
//    if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
//      return 'probably'
//    }
//    return ''
//  }
//
//  get currentTime() {
//    return _innerAudioContext.get(this).currentTime
//  }
//
//  set currentTime(value) {
//    _innerAudioContext.get(this).seek(value)
//  }
//
//  get src() {
//    return _src.get(this)
//  }
//
//  set src(value) {
//    _src.set(this, value)
//    _innerAudioContext.get(this).src = value
//  }
//
//  get loop() {
//    return _innerAudioContext.get(this).loop
//  }
//
//  set loop(value) {
//    _innerAudioContext.get(this).loop = value
//  }
//
//  get autoplay() {
//    return _innerAudioContext.get(this).autoplay
//  }
//
//  set autoplay(value) {
//    _innerAudioContext.get(this).autoplay = value
//  }
//
//  get paused() {
//    return _innerAudioContext.get(this).paused
//  }
//
//  cloneNode() {
//    const newAudio = new Audio()
//    newAudio.loop = _innerAudioContext.get(this).loop
//    newAudio.autoplay = _innerAudioContext.get(this).autoplay
//    newAudio.src = this.src
//    return newAudio
//  }
}

module.exports = Audio;

