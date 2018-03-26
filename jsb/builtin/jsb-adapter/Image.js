let HTMLImageElement = require('./HTMLImageElement');

function Image (width, height) {
    return new HTMLImageElement(width, height);
}

module.exports = Image;
