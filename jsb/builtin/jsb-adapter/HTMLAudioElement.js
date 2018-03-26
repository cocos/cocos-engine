let HTMLMediaElement = require('./HTMLMediaElement');

class HTMLAudioElement extends HTMLMediaElement {
  constructor() {
    super('audio')
  }
}

module.exports = HTMLAudioElement;
