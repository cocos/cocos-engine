const HTMLAudioElement = require('./HTMLAudioElement');

function Audio(url) {
    return new HTMLAudioElement(url);
}

module.exports = Audio;

