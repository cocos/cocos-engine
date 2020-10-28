class ImageData {

    // var imageData = new ImageData(array, width, height);
    // var imageData = new ImageData(width, height);
    constructor(array, width, height) {
        if (typeof array === 'number' && typeof width == 'number') {
            height = width;
            width = array;
            array = null;
        }
        if (array === null) {
            this._data = new Uint8ClampedArray(width * height * 4);
        }
        else {
            this._data = array;
        }
        this._width = width;
        this._height = height;
    }


    get data() {
        return this._data;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

}

module.exports = ImageData;
