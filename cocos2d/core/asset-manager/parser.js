/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * @module cc.AssetManager
 */

const plistParser = require('../platform/CCSAXParser').plistParser;
const js = require('../platform/js');
const deserialize = require('./deserialize');
const Cache = require('./cache');
const { isScene } = require('./helper');
const { parsed, files } = require('./shared');
const { __audioSupport, capabilities } = require('../platform/CCSys');

var _parsing = new Cache();

/**
 * !#en
 * Parse the downloaded file, it's a singleton, all member can be accessed with `cc.assetManager.parser`
 * 
 * !#zh
 * 解析已下载的文件，parser 是一个单例, 所有成员能通过 `cc.assetManaager.parser` 访问
 * 
 * @class Parser
 */
var parser = {
    /*
     * !#en
     * Parse image file
     * 
     * !#zh
     * 解析图片文件
     * 
     * @method parseImage
     * @param {Blob} file - The downloaded file
     * @param {Object} options - Some optional paramters 
     * @param {Function} [onComplete] - callback when finish parsing.
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {ImageBitmap|HTMLImageElement} onComplete.img - The parsed content
     * 
     * @example
     * downloader.downloadFile('test.jpg', {responseType: 'blob'}, null, (err, file) => {
     *      parser.parseImage(file, null, (err, img) => console.log(err));
     * });
     * 
     * @typescript
     * parseImage(file: Blob, options: Record<string, any>, onComplete?: (err: Error, img: ImageBitmap|HTMLImageElement) => void): void
     */
    parseImage (file, options, onComplete) {
        if (capabilities.imageBitmap && file instanceof Blob) {
            let imageOptions = {};
            imageOptions.imageOrientation = options.__flipY__ ? 'flipY' : 'none';
            imageOptions.premultiplyAlpha = options.__premultiplyAlpha__ ? 'premultiply' : 'none';
            createImageBitmap(file, imageOptions).then(function (result) {
                result.flipY = !!options.__flipY__;
                result.premultiplyAlpha = !!options.__premultiplyAlpha__;
                onComplete && onComplete(null, result);
            }, function (err) {
                onComplete && onComplete(err, null);
            });
        }
        else {
            onComplete && onComplete(null, file);
        }
    },

    /*
     * !#en
     * Parse audio file
     * 
     * !#zh
     * 解析音频文件
     * 
     * @method parseAudio
     * @param {ArrayBuffer|HTMLAudioElement} file - The downloaded file
     * @param {Object} options - Some optional paramters
     * @param {Function} onComplete - Callback when finish parsing.
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {AudioBuffer|HTMLAudioElement} onComplete.audio - The parsed content
     * 
     * @example
     * downloader.downloadFile('test.mp3', {responseType: 'arraybuffer'}, null, (err, file) => {
     *      parser.parseAudio(file, null, (err, audio) => console.log(err));
     * });
     * 
     * @typescript
     * parseAudio(file: ArrayBuffer|HTMLAudioElement, options: Record<string, any>, onComplete?: (err: Error, audio: AudioBuffer|HTMLAudioElement) => void): void
     */
    parseAudio (file, options, onComplete) {
        if (file instanceof ArrayBuffer) { 
            __audioSupport.context.decodeAudioData(file, function (buffer) {
                onComplete && onComplete(null, buffer);
            }, function(e){
                onComplete && onComplete(e, null);
            });
        }
        else {
            onComplete && onComplete(null, file);
        }
    },

    /*
     * !#en
     * Parse pvr file 
     * 
     * !#zh
     * 解析压缩纹理格式 pvr 文件
     * 
     * @method parsePVRTex
     * @param {ArrayBuffer|ArrayBufferView} file - The downloaded file
     * @param {Object} options - Some optional paramters
     * @param {Function} onComplete - Callback when finish parsing.
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {Object} onComplete.pvrAsset - The parsed content
     * 
     * @example
     * downloader.downloadFile('test.pvr', {responseType: 'arraybuffer'}, null, (err, file) => {
     *      parser.parsePVRTex(file, null, (err, pvrAsset) => console.log(err));
     * });
     * 
     * @typescript
     * parsePVRTex(file: ArrayBuffer|ArrayBufferView, options: Record<string, any>, onComplete: (err: Error, pvrAsset: {_data: Uint8Array, _compressed: boolean, width: number, height: number}) => void): void
     */
    parsePVRTex : (function () {
        //===============//
        // PVR constants //
        //===============//
        // https://github.com/toji/texture-tester/blob/master/js/webgl-texture-util.js#L424
        const PVR_HEADER_LENGTH = 13; // The header length in 32 bit ints.
        const PVR_MAGIC = 0x03525650; //0x50565203;
    
        // Offsets into the header array.
        const PVR_HEADER_MAGIC = 0;
        const PVR_HEADER_FORMAT = 2;
        const PVR_HEADER_HEIGHT = 6;
        const PVR_HEADER_WIDTH = 7;
        const PVR_HEADER_MIPMAPCOUNT = 11;
        const PVR_HEADER_METADATA = 12;
    
        return function (file, options, onComplete) {
            let err = null, out = null;
            try {
                let buffer = file instanceof ArrayBuffer ? file : file.buffer;
                // Get a view of the arrayBuffer that represents the DDS header.
                let header = new Int32Array(buffer, 0, PVR_HEADER_LENGTH);
    
                // Do some sanity checks to make sure this is a valid DDS file.
                if(header[PVR_HEADER_MAGIC] != PVR_MAGIC) {
                    throw new Error("Invalid magic number in PVR header");
                }
    
                // Gather other basic metrics and a view of the raw the DXT data.
                let width = header[PVR_HEADER_WIDTH];
                let height = header[PVR_HEADER_HEIGHT];
                let dataOffset = header[PVR_HEADER_METADATA] + 52;
                let pvrtcData = new Uint8Array(buffer, dataOffset);
    
                out = {
                    _data: pvrtcData,
                    _compressed: true,
                    width: width,
                    height: height,
                };
                
            }
            catch (e) {
                err = e;
            }
            onComplete && onComplete(err, out);
        };
    })(),

    /*
     * !#en
     * Parse pkm file
     * 
     * !#zh
     * 解析压缩纹理格式 pkm 文件
     * 
     * @method parsePKMTex
     * @param {ArrayBuffer|ArrayBufferView} file - The downloaded file
     * @param {Object} options - Some optional paramters
     * @param {Function} onComplete - Callback when finish parsing.
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {Object} onComplete.etcAsset - The parsed content
     * 
     * @example
     * downloader.downloadFile('test.pkm', {responseType: 'arraybuffer'}, null, (err, file) => {
     *      parser.parsePKMTex(file, null, (err, etcAsset) => console.log(err));
     * });
     * 
     * @typescript
     * parsePKMTex(file: ArrayBuffer|ArrayBufferView, options: Record<string, any>, onComplete: (err: Error, etcAsset: {_data: Uint8Array, _compressed: boolean, width: number, height: number}) => void): void
     */
    parsePKMTex: (function () {
        //===============//
        // ETC constants //
        //===============//
        const ETC_PKM_HEADER_SIZE = 16;

        const ETC_PKM_FORMAT_OFFSET = 6;
        const ETC_PKM_ENCODED_WIDTH_OFFSET = 8;
        const ETC_PKM_ENCODED_HEIGHT_OFFSET = 10;
        const ETC_PKM_WIDTH_OFFSET = 12;
        const ETC_PKM_HEIGHT_OFFSET = 14;

        const ETC1_RGB_NO_MIPMAPS   = 0;
        const ETC2_RGB_NO_MIPMAPS   = 1;
        const ETC2_RGBA_NO_MIPMAPS  = 3;

        function readBEUint16(header, offset) {
            return (header[offset] << 8) | header[offset+1];
        }
        return function (file, options, onComplete) {
            let err = null, out = null;
            try {
                let buffer = file instanceof ArrayBuffer ? file : file.buffer;
                let header = new Uint8Array(buffer);
                let format = readBEUint16(header, ETC_PKM_FORMAT_OFFSET);
                if (format !== ETC1_RGB_NO_MIPMAPS && format !== ETC2_RGB_NO_MIPMAPS && format !== ETC2_RGBA_NO_MIPMAPS) {
                    return new Error("Invalid magic number in ETC header");
                }
                let width = readBEUint16(header, ETC_PKM_WIDTH_OFFSET);
                let height = readBEUint16(header, ETC_PKM_HEIGHT_OFFSET);
                let encodedWidth = readBEUint16(header, ETC_PKM_ENCODED_WIDTH_OFFSET);
                let encodedHeight = readBEUint16(header, ETC_PKM_ENCODED_HEIGHT_OFFSET);
                let etcData = new Uint8Array(buffer, ETC_PKM_HEADER_SIZE);
                out = {
                    _data: etcData,
                    _compressed: true,
                    width: width,
                    height: height
                };
                
            }
            catch (e) {
                err = e;
            }
            onComplete && onComplete(err, out);
        }
    })(),

    parseASTCTex: (function () {
        //= ==============//
        // ASTC constants //
        //= ==============//

        // struct astc_header
        // {
        //  uint8_t magic[4];
        //  uint8_t blockdim_x;
        //  uint8_t blockdim_y;
        //  uint8_t blockdim_z;
        //  uint8_t xsize[3]; // x-size = xsize[0] + xsize[1] + xsize[2]
        //  uint8_t ysize[3]; // x-size, y-size and z-size are given in texels;
        //  uint8_t zsize[3]; // block count is inferred
        // };
        const ASTC_MAGIC = 0x5CA1AB13;

        const ASTC_HEADER_LENGTH = 16; // The header length
        const ASTC_HEADER_MAGIC = 4;
        const ASTC_HEADER_BLOCKDIM = 3;

        const ASTC_HEADER_SIZE_X_BEGIN = 7;
        const ASTC_HEADER_SIZE_Y_BEGIN = 10;
        const ASTC_HEADER_SIZE_Z_BEGIN = 13;

        function getASTCFormat (xdim, ydim) {
            if (xdim === 4) {
                return cc.Texture2D.PixelFormat.RGBA_ASTC_4x4;
            } if (xdim === 5) {
                if (ydim === 4) {
                    return cc.Texture2D.PixelFormat.RGBA_ASTC_5x4;
                }
                return cc.Texture2D.PixelFormat.RGBA_ASTC_5x5;
            } if (xdim === 6) {
                if (ydim === 5) {
                    return cc.Texture2D.PixelFormat.RGBA_ASTC_6x5;
                }
                return cc.Texture2D.PixelFormat.RGBA_ASTC_6x6;
            } if (xdim === 8) {
                if (ydim === 5) {
                    return cc.Texture2D.PixelFormat.RGBA_ASTC_8x5;
                } if (ydim === 6) {
                    return cc.Texture2D.PixelFormat.RGBA_ASTC_8x6;
                }
                return cc.Texture2D.PixelFormat.RGBA_ASTC_8x8;
            } if (xdim === 10) {
                if (ydim === 5) {
                    return cc.Texture2D.PixelFormat.RGBA_ASTC_10x5;
                } if (ydim === 6) {
                    return cc.Texture2D.PixelFormat.RGBA_ASTC_10x6;
                } if (ydim === 8) {
                    return cc.Texture2D.PixelFormat.RGBA_ASTC_10x8;
                }
                return cc.Texture2D.PixelFormat.RGBA_ASTC_10x10;
            }
            if (ydim === 10) {
                return cc.Texture2D.PixelFormat.RGBA_ASTC_12x10;
            }
            return cc.Texture2D.PixelFormat.RGBA_ASTC_12x12;
        }

        return function (file, options, onComplete) {
            let err = null, out = null;
            try {
                const buffer = file instanceof ArrayBuffer ? file : file.buffer;
                const header = new Uint8Array(buffer);

                const magicval = header[0] + (header[1] << 8) + (header[2] << 16) + (header[3] << 24);
                if (magicval !== ASTC_MAGIC) {
                    return new Error('Invalid magic number in ASTC header');
                }

                const xdim = header[ASTC_HEADER_MAGIC];
                const ydim = header[ASTC_HEADER_MAGIC + 1];
                const zdim = header[ASTC_HEADER_MAGIC + 2];
                if ((xdim < 3 || xdim > 6 || ydim < 3 || ydim > 6 || zdim < 3 || zdim > 6)
                    && (xdim < 4 || xdim === 7 || xdim === 9 || xdim === 11 || xdim > 12
                        || ydim < 4 || ydim === 7 || ydim === 9 || ydim === 11 || ydim > 12 || zdim !== 1)) {
                    return new Error('Invalid block number in ASTC header');
                }

                const format = getASTCFormat(xdim, ydim);

                const xsize = header[ASTC_HEADER_SIZE_X_BEGIN] + (header[ASTC_HEADER_SIZE_X_BEGIN + 1] << 8)
                    + (header[ASTC_HEADER_SIZE_X_BEGIN + 2] << 16);
                const ysize = header[ASTC_HEADER_SIZE_Y_BEGIN] + (header[ASTC_HEADER_SIZE_Y_BEGIN + 1] << 8)
                    + (header[ASTC_HEADER_SIZE_Y_BEGIN + 2] << 16);
                const zsize = header[ASTC_HEADER_SIZE_Z_BEGIN] + (header[ASTC_HEADER_SIZE_Z_BEGIN + 1] << 8)
                    + (header[ASTC_HEADER_SIZE_Z_BEGIN + 2] << 16);

                // buffer = buffer.slice(ASTC_HEADER_LENGTH, buffer.byteLength);
                const astcData = new Uint8Array(buffer, ASTC_HEADER_LENGTH);

                out = {
                    _data: astcData,
                    _compressed: true,
                    width: xsize,
                    height: ysize,
                    format,
                };
            } catch (e) {
                err = e;
            }
            onComplete(err, out);
        }
    })(),

    /*
     * !#en
     * Parse plist file
     * 
     * !#zh
     * 解析 plist 文件
     * 
     * @method parsePlist
     * @param {string} file - The downloaded file
     * @param {Object} options - Some optional paramters
     * @param {Function} onComplete - Callback when finish parsing
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {*} onComplete.data - The parsed content
     * 
     * @example
     * downloader.downloadFile('test.plist', {responseType: 'text'}, null, (err, file) => {
     *      parser.parsePlist(file, null, (err, data) => console.log(err));
     * });
     * 
     * @typescript
     * parsePlist(file: string, options: Record<string, any>, onComplete?: (err: Error, data: any) => void): void
     */
    parsePlist (file, options, onComplete) {
        var err = null;
        var result = plistParser.parse(file);
        if (!result) err = new Error('parse failed');
        onComplete && onComplete(err, result);
    },

    /*
     * !#en
     * Deserialize asset file
     * 
     * !#zh
     * 反序列化资源文件
     * 
     * @method parseImport
     * @param {Object} file - The serialized json
     * @param {Object} options - Some optional paramters
     * @param {Function} onComplete - Callback when finish parsing
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {Asset} onComplete.asset - The parsed content
     * 
     * @example
     * downloader.downloadFile('test.json', {responseType: 'json'}, null, (err, file) => {
     *      parser.parseImport(file, null, (err, data) => console.log(err));
     * });
     * 
     * @typescript
     * parseImport (file: any, options: Record<string, any>, onComplete?: (err: Error, asset: cc.Asset) => void): void
     */
    parseImport (file, options, onComplete) {
        if (!file) return onComplete && onComplete(new Error('Json is empty'));
        var result, err = null;
        try {
            result = deserialize(file, options);
        }
        catch (e) {
            err = e;
        }
        onComplete && onComplete(err, result);
    },

    init () {
        _parsing.clear();
    },

    /**
     * !#en
     * Register custom handler if you want to change default behavior or extend parser to parse other format file
     * 
     * !#zh
     * 当你想修改默认行为或者拓展 parser 来解析其他格式文件时可以注册自定义的handler
     * 
     * @method register
     * @param {string|Object} type - Extension likes '.jpg' or map likes {'.jpg': jpgHandler, '.png': pngHandler}
     * @param {Function} [handler] - The corresponding handler
     * @param {*} handler.file - File
     * @param {Object} handler.options - Some optional paramter
     * @param {Function} handler.onComplete - callback when finishing parsing
     * 
     * @example
     * parser.register('.tga', (file, options, onComplete) => onComplete(null, null));
     * parser.register({'.tga': (file, options, onComplete) => onComplete(null, null), '.ext': (file, options, onComplete) => onComplete(null, null)});
     * 
     * @typescript
     * register(type: string, handler: (file: any, options: Record<string, any>, onComplete: (err: Error, data: any) => void) => void): void
     * register(map: Record<string, (file: any, options: Record<string, any>, onComplete: (err: Error, data: any) => void) => void>): void
     */
    register (type, handler) {
        if (typeof type === 'object') {
            js.mixin(parsers, type);
        }
        else {
            parsers[type] = handler;
        }
    },

    /**
     * !#en
     * Use corresponding handler to parse file 
     * 
     * !#zh
     * 使用对应的handler来解析文件
     * 
     * @method parse
     * @param {string} id - The id of file
     * @param {*} file - File
     * @param {string} type - The corresponding type of file, likes '.jpg'.
     * @param {Object} options - Some optional paramters will be transferred to the corresponding handler.
     * @param {Function} onComplete - callback when finishing downloading
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {*} onComplete.contetnt - The parsed file
     * 
     * @example
     * downloader.downloadFile('test.jpg', {responseType: 'blob'}, null, (err, file) => {
     *      parser.parse('test.jpg', file, '.jpg', null, (err, img) => console.log(err));
     * });
     * 
     * @typescript
     * parse(id: string, file: any, type: string, options: Record<string, any>, onComplete: (err: Error, content: any) => void): void
     */
    parse (id, file, type, options, onComplete) {
        let parsedAsset, parsing, parseHandler;
        if (parsedAsset = parsed.get(id)) {
            onComplete(null, parsedAsset);
        }
        else if (parsing = _parsing.get(id)){
            parsing.push(onComplete);
        }
        else if (parseHandler = parsers[type]){
            _parsing.add(id, [onComplete]);
            parseHandler(file, options, function (err, data) {
                if (err) {
                    files.remove(id);
                } 
                else if (!isScene(data)){
                    parsed.add(id, data);
                }
                let callbacks = _parsing.remove(id);
                for (let i = 0, l = callbacks.length; i < l; i++) {
                    callbacks[i](err, data);
                }
            });
        }
        else {
            onComplete(null, file);
        }
    }
};

var parsers = {
    '.png' : parser.parseImage,
    '.jpg' : parser.parseImage,
    '.bmp' : parser.parseImage,
    '.jpeg' : parser.parseImage,
    '.gif' : parser.parseImage,
    '.ico' : parser.parseImage,
    '.tiff' : parser.parseImage,
    '.webp' : parser.parseImage,
    '.image' : parser.parseImage,
    '.pvr' : parser.parsePVRTex,
    '.pkm' : parser.parsePKMTex,
    '.astc' : parser.parseASTCTex,
    // Audio
    '.mp3' : parser.parseAudio,
    '.ogg' : parser.parseAudio,
    '.wav' : parser.parseAudio,
    '.m4a' : parser.parseAudio,

    // plist
    '.plist' : parser.parsePlist,
    'import' : parser.parseImport
};

module.exports = parser;