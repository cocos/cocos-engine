/* eslint-disable */
import * as Mixin from './util/mixin'
import HTMLImageElement from './HTMLImageElement'

export default function() {
    const image = swan.createImage();

    // image.__proto__.__proto__.__proto__ = new HTMLImageElement();

    if (!('tagName' in image)) {
        image.tagName = 'IMG'
    }

    Mixin.parentNode(image);
    Mixin.classList(image);

    return image;
};
