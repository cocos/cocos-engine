const HTMLMediaElement = require('./HTMLMediaElement');

class HTMLVideoElement extends HTMLMediaElement {
  constructor() {
    super('video')
  }

  canPlayType(type) {
    if (type === 'video/mp4')
        return true;
    return false;
  }
}

module.exports = HTMLVideoElement;
