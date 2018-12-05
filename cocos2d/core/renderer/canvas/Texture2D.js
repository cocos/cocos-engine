
// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.  
 
var Texture2D = function Texture2D(device, options) {
  this._device = device;
    
  this._width = 4;
  this._height = 4;

  this._image = null;

  if (options) {
    if (options.width !== undefined) {
      this._width = options.width;
    }
    if (options.height !== undefined) {
      this._height = options.height;
    }

    this.updateImage(options);
  }
};

Texture2D.prototype.update = function update (options) {
  this.updateImage(options);
};

Texture2D.prototype.updateImage = function updateImage (options) {
  if (options.images && options.images[0]) {
    var image = options.images[0];
    if (image && image !== this._image) {
      this._image = image;
    }
  }
};

Texture2D.prototype.destroy = function destroy () {
  this._image = null;
};

module.exports = Texture2D;
