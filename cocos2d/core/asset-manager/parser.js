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
const plistParser = require('../platform/CCSAXParser').plistParser;
const js = require('../platform/js');
const deserialize = require('./deserialize');
const downloader = require('./downloader');
const Cache = require('./cache');
const { isScene } = require('./helper');
const { parsed, files } = require('./shared');
const { __audioSupport, capabilities } = require('../platform/CCSys');

var _parsing = new Cache();

/**
 * !#en
 * Parse the downloaded file, it's a singleton
 * 
 * !#zh
 * 解析已下载的文件，parser 是一个单例
 * 
 * @static
 */
var parser = {
    /**
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
     * parseImage(file: Blob, options: any, onComplete?: ((err: Error, img: ImageBitmap|HTMLImageElement) => void)|null): void
     */
    parseImage (file, options, onComplete) {
        if (capabilities.createImageBitmap && file instanceof Blob) {
            createImageBitmap(file).then(function (result) {
                onComplete && onComplete(null, result);
            }, function (err) {
                var url = URL.createObjectURL(file);
                downloader.downloadDomImage(url, null, function (err, img) {
                    URL.revokeObjectURL(url);
                    onComplete && onComplete(err, img);
                });
            });
        }
        else {
            onComplete && onComplete(null, file);
        }
    },

    /**
     * !#en
     * Parse audio file
     * 
     * !#zh
     * 解析音频文件
     * 
     * @method parseAudio
     * @param {ArrayBuffer} file - The downloaded file
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
     * parseAudio(file: ArrayBuffer, options: any, onComplete?: ((err: Error, audio: AudioBuffer|HTMLAudioElement) => void)|null): void
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

    /**
     * !#en
     * Parse pvr file that is a compressed texture format 
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
     * parsePVRTex(file: ArrayBuffer|ArrayBufferView, options: any, onComplete: ((err: Error, pvrAsset: any) => void)|null): void
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
    
                pvrAsset = {
                    _data: pvrtcData,
                    _compressed: true,
                    width: width,
                    height: height,
                };
                onComplete && onComplete(null, pvrAsset);
            }
            catch (e) {
                onComplete && onComplete(e, null);
            }
        };
    })(),

    /**
     * !#en
     * Parse pkm file that is a compressed texture format 
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
     * parsePKMTex(file: ArrayBuffer|ArrayBufferView, options: any, onComplete: ((err: Error, etcAsset: any) => void)|null): void
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
                let etcAsset = {
                    _data: etcData,
                    _compressed: true,
                    width: width,
                    height: height
                };
                onComplete && onComplete(null, etcAsset);
            }
            catch (e) {
                onComplete && onComplete(e, null);
            }
        }
    })(),

    /**
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
     * parsePlist(file: string, options: any, onComplete?: ((err: Error, data: any) => void)|null): void
     */
    parsePlist (file, options, onComplete) {
        var err = null;
        var result = plistParser.parse(file);
        if (!result) err = new Error('parse failed');
        onComplete && onComplete(err, result);
    },

    /**
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
     * parseImport (file: any, options: any, onComplete?: ((err: Error, asset: any) => void)|null): void
     */
    parseImport (file, options, onComplete) {
        var result = deserialize(file, options);
        if (result instanceof Error) {
            onComplete && onComplete(result, null);
        }
        else {
            onComplete && onComplete(null, result);
        }
    },

    /**
     * !#en 
     * Initialize parser
     * 
     * !#zh
     * 初始化解析器
     * 
     * @method init
     * 
     * @typescript
     * init(): void
     */
    init () {
        _parsing.clear();
    },

    /**
     * !#en
     * Register custom handler if you want to change default behavior or extend parser to parse other format file
     * 
     * !#zh
     * 当你想修改默认行为或者拓展parser来解析其他格式文件时可以注册自定义的handler
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
     * register(type: string, handler: (file: any, options: any, onComplete: (err: Error, data: any) => void) => void): void
     * register(map: any): void
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
     * parse(id: string, file: any, type: string, options: any, onComplete: (err: Error, content: any) => void): void
     */
    parse (id, file, type, options, onComplete) {
        if (parsed.has(id)) {
            onComplete(null, parsed.get(id));
        }
        else if (_parsing.has(id)){
            _parsing.get(id).push(onComplete);
        }
        else if (parsers[type]){
            _parsing.add(id, [onComplete]);
            parsers[type](file, options, function (err, data) {
                if (err) {
                    files.remove(id);
                } 
                else if (!isScene(data)){
                    parsed.add(id, data);
                }
                var callbacks = _parsing.remove(id);
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
    '.jpeg' : parser.parseImage,
    '.pvr' : parser.parsePVRTex,
    '.pkm' : parser.parsePKMTex,
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