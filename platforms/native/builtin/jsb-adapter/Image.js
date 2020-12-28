let HTMLImageElement = require('./HTMLImageElement');

class Image extends HTMLImageElement {
    constructor(width, height) {
        super(width, height, true)
    }
}

module.exports = Image;
