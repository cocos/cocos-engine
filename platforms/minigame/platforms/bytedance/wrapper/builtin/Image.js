import HTMLImageElement from './HTMLImageElement'

export default function() {
    const image = tt.createImage();

    // image.__proto__.__proto__.__proto__ = new HTMLImageElement();

    return image;
};
