import HTMLImageElement from './HTMLImageElement'

export default function() {
    const image = wx.createImage();

    // image.__proto__.__proto__.__proto__ = new HTMLImageElement();

    image.premultiplyAlpha = false;
    return image;
};
