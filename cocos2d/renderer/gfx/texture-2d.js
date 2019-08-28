// @ts-check
import Texture from './texture';
import { enums, glFilter, glTextureFmt } from './enums';
import { isPow2 } from './misc';

const ArrayBufferView = Object.getPrototypeOf(Object.getPrototypeOf(new Uint8Array)).constructor

/**
 * @typedef {HTMLImageElement | HTMLCanvasElement} HTMLImageSource
 * @typedef {HTMLImageSource | ArrayBufferView} ImageSource
 * @typedef {{width?: number, height?: number, minFilter?: number, magFilter?: number, mipFilter?: number, wrapS?: number, wrapT?: number, format?: number, genMipmaps?: boolean, images?: ImageSource[], image?: ImageSource, flipY?: boolean, premultiplyAlpha?: boolean, anisotropy?: number}} TextureUpdateOpts
 * @typedef {import("../gfx/device").default} Device
 */

export default class Texture2D extends Texture {
  /**
   * @constructor
   * @param {Device} device
   * @param {TextureUpdateOpts} options
   */
  constructor(device, options) {
    super(device);

    let gl = this._device._gl;
    this._target = gl.TEXTURE_2D;
    this._glID = gl.createTexture();

    // always alloc texture in GPU when we create it.
    options.images = options.images || [null];
    this.update(options);
  }

  /**
   * @method update
   * @param {TextureUpdateOpts} options
   */
  update(options) {
    let gl = this._device._gl;
    let genMipmaps = this._genMipmap;

    if (options) {
      if (options.width !== undefined) {
        this._width = options.width;
      }
      if (options.height !== undefined) {
        this._height = options.height;
      }
      if (options.anisotropy !== undefined) {
        this._anisotropy = options.anisotropy;
      }
      if (options.minFilter !== undefined) {
        this._minFilter = options.minFilter;
      }
      if (options.magFilter !== undefined) {
        this._magFilter = options.magFilter;
      }
      if (options.mipFilter !== undefined) {
        this._mipFilter = options.mipFilter;
      }
      if (options.wrapS !== undefined) {
        this._wrapS = options.wrapS;
      }
      if (options.wrapT !== undefined) {
        this._wrapT = options.wrapT;
      }
      if (options.format !== undefined) {
        this._format = options.format;
        this._compressed = 
          (this._format >= enums.TEXTURE_FMT_RGB_DXT1 && this._format <= enums.TEXTURE_FMT_RGBA_PVRTC_4BPPV1) || 
          (this._format >= enums.TEXTURE_FMT_RGB_ETC2 && this._format <= enums.TEXTURE_FMT_RGBA_ETC2)
        ;
      }

      // check if generate mipmap
      if (options.genMipmaps !== undefined) {
        this._genMipmap = options.genMipmaps;
        genMipmaps = options.genMipmaps;
      }

      let maxSize = this._device.caps.maxTextureSize || Number.MAX_VALUE;
      let textureMaxSize = Math.max(options.width || 0, options.height || 0);
      if (maxSize < textureMaxSize)
        console.warn(`The current texture size ${textureMaxSize} exceeds the maximum size [${maxSize}] supported on the device.`);

      if (options.images !== undefined) {
        if (options.images.length > 1) {
          genMipmaps = false;
          let maxLength = options.width > options.height ? options.width : options.height;
          if (maxLength >> (options.images.length - 1) !== 1) {
            console.error('texture-2d mipmap is invalid, should have a 1x1 mipmap.');
          }
        }
      }
    }

    // NOTE: get pot after this._width, this._height has been assigned.
    let pot = isPow2(this._width) && isPow2(this._height);
    if (!pot) {
      genMipmaps = false;
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._glID);
    if (options.images !== undefined && options.images.length > 0) {
      this._setMipmap(options.images, options.flipY, options.premultiplyAlpha);
      if (options.images.length > 1) this._genMipmap = true;
    }
    if (genMipmaps) {
      gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
      gl.generateMipmap(gl.TEXTURE_2D);
      this._genMipmap = true;
    }

    this._setTexInfo();
    this._device._restoreTexture(0);
  }

  /**
   * @method updateSubImage
   * @param {Object} options
   * @param {Number} options.x
   * @param {Number} options.y
   * @param {Number} options.width
   * @param {Number} options.height
   * @param {Number} options.level
   * @param {HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ArrayBufferView} options.image
   * @param {Boolean} options.flipY
   * @param {Boolean} options.premultiplyAlpha
   */
  updateSubImage(options) {
    let gl = this._device._gl;
    let glFmt = glTextureFmt(this._format);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._glID);
    this._setSubImage(glFmt, options);
    this._device._restoreTexture(0);
  }

  /**
   * @method updateImage
   * @param {Object} options
   * @param {Number} options.width
   * @param {Number} options.height
   * @param {Number} options.level
   * @param {HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ArrayBufferView} options.image
   * @param {Boolean} options.flipY
   * @param {Boolean} options.premultiplyAlpha
   */
  updateImage(options) {
    let gl = this._device._gl;
    let glFmt = glTextureFmt(this._format);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._glID);
    this._setImage(glFmt, options);
    this._device._restoreTexture(0);
  }

  _setSubImage(glFmt, options) {
    let gl = this._device._gl;
    let flipY = options.flipY;
    let premultiplyAlpha = options.premultiplyAlpha;
    let img = options.image;

    if (img && !ArrayBuffer.isView(img) && !(img instanceof ArrayBuffer)) {
      if (flipY === undefined) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      } else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      }

      if (premultiplyAlpha === undefined) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
      }

      gl.texSubImage2D(gl.TEXTURE_2D, options.level, options.x, options.y, glFmt.format, glFmt.pixelType, img);
    } else {
      if (flipY === undefined) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      }

      if (premultiplyAlpha === undefined) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
      }

      if (this._compressed) {
        gl.compressedTexSubImage2D(gl.TEXTURE_2D,
          options.level,
          options.x,
          options.y,
          options.width,
          options.height,
          glFmt.format,
          img
        );
      } else {
        gl.texSubImage2D(
          gl.TEXTURE_2D,
          options.level,
          options.x,
          options.y,
          options.width,
          options.height,
          glFmt.format,
          glFmt.pixelType,
          img
        );
      }
    }
  }

  _setImage(glFmt, options) {
    let gl = this._device._gl;
    let flipY = options.flipY;
    let premultiplyAlpha = options.premultiplyAlpha;
    let img = options.image;

    if (img && !ArrayBuffer.isView(img) && !(img instanceof ArrayBuffer)) {
      if (flipY === undefined) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      } else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      }

      if (premultiplyAlpha === undefined) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
      }

      gl.texImage2D(
        gl.TEXTURE_2D,
        options.level,
        glFmt.internalFormat,
        glFmt.format,
        glFmt.pixelType,
        img
      );
    } else {
      if (flipY === undefined) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
      }

      if (premultiplyAlpha === undefined) {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      } else {
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
      }

      if (this._compressed) {
        gl.compressedTexImage2D(
          gl.TEXTURE_2D,
          options.level,
          glFmt.internalFormat,
          options.width,
          options.height,
          0,
          img
        );
      } else {
        gl.texImage2D(
          gl.TEXTURE_2D,
          options.level,
          glFmt.internalFormat,
          options.width,
          options.height,
          0,
          glFmt.format,
          glFmt.pixelType,
          img
        );
      }
    }
  }

  _setMipmap(images, flipY, premultiplyAlpha) {
    let glFmt = glTextureFmt(this._format);
    let options = {
      width: this._width,
      height: this._height,
      flipY: flipY,
      premultiplyAlpha: premultiplyAlpha,
      level: 0,
      image: null
    };

    for (let i = 0; i < images.length; ++i) {
      options.level = i;
      options.width = this._width >> i;
      options.height = this._height >> i;
      options.image = images[i];
      this._setImage(glFmt, options);
    }
  }

  _setTexInfo() {
    let gl = this._device._gl;
    let pot = isPow2(this._width) && isPow2(this._height);

    // WebGL1 doesn't support all wrap modes with NPOT textures
    if (!pot && (this._wrapS !== enums.WRAP_CLAMP || this._wrapT !== enums.WRAP_CLAMP)) {
      console.warn('WebGL1 doesn\'t support all wrap modes with NPOT textures');
      this._wrapS = enums.WRAP_CLAMP;
      this._wrapT = enums.WRAP_CLAMP;
    }

    let mipFilter = this._genMipmap ? this._mipFilter : -1;
    if (!pot && mipFilter !== -1) {
      console.warn('NPOT textures do not support mipmap filter');
      mipFilter = -1;
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter(gl, this._minFilter, mipFilter));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter(gl, this._magFilter, -1));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._wrapT);

    let ext = this._device.ext('EXT_texture_filter_anisotropic');
    if (ext) {
      gl.texParameteri(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, this._anisotropy);
    }
  }
}