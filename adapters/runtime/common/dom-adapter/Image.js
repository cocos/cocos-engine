import HTMLImageElement from './HTMLImageElement'
let _Image = window.Image;
export default class Image extends HTMLImageElement {
    constructor(width, height) {
        super(width, height, true);
    }
}

let _creteImage = jsb.createImage;
if (_creteImage) {
    _Image.prototype.__proto__ = Image.prototype;
}
