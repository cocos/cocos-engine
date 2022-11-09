/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

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
 */

import { IMemoryImageSource } from '../assets/image-asset';
import { js } from '../../core/utils/js';
import Cache from './cache';
import deserialize from './deserialize';
import { isScene } from './helper';
import plistParser from './plist-parser';
import { CompleteCallback, IDownloadParseOptions, files, parsed } from './shared';

import { PixelFormat } from '../assets/asset-enum';
import { CCON } from '../../serialization/ccon';
import { Asset } from '../assets';
import { Enum } from '../../core/value-types';

export const compressType = Enum({
    PVR: 0,
    PKM: 1,
    ASTC: 2,
});

// PVR constants //
// https://github.com/toji/texture-tester/blob/master/js/webgl-texture-util.js#L424
const PVR_HEADER_LENGTH = 13; // The header length in 32 bit ints.
const PVR_MAGIC = 0x03525650; // 0x50565203;

// Compress mipmap constants
// https://github.com/cocos/3d-tasks/issues/10876
const COMPRESSED_HEADER_LENGTH = 4;
const COMPRESSED_MIPMAP_LEVEL_COUNT_LENGTH = 4;
const COMPRESSED_MIPMAP_DATA_SIZE_LENGTH = 4;
const COMPRESSED_MIPMAP_MAGIC = 0x50494d43;

// Offsets into the header array.
const PVR_HEADER_MAGIC = 0;
const PVR_HEADER_FORMAT = 2;
const PVR_HEADER_HEIGHT = 6;
const PVR_HEADER_WIDTH = 7;
const PVR_HEADER_MIPMAPCOUNT = 11;
const PVR_HEADER_METADATA = 12;

// ETC constants //
const ETC_PKM_HEADER_LENGTH = 16;

const ETC_PKM_FORMAT_OFFSET = 6;
const ETC_PKM_ENCODED_WIDTH_OFFSET = 8;
const ETC_PKM_ENCODED_HEIGHT_OFFSET = 10;
const ETC_PKM_WIDTH_OFFSET = 12;
const ETC_PKM_HEIGHT_OFFSET = 14;

const ETC1_RGB_NO_MIPMAPS = 0;
const ETC2_RGB_NO_MIPMAPS = 1;
const ETC2_RGBA_NO_MIPMAPS = 3;

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
        return PixelFormat.RGBA_ASTC_4x4;
    } if (xdim === 5) {
        if (ydim === 4) {
            return PixelFormat.RGBA_ASTC_5x4;
        }
        return PixelFormat.RGBA_ASTC_5x5;
    } if (xdim === 6) {
        if (ydim === 5) {
            return PixelFormat.RGBA_ASTC_6x5;
        }
        return PixelFormat.RGBA_ASTC_6x6;
    } if (xdim === 8) {
        if (ydim === 5) {
            return PixelFormat.RGBA_ASTC_8x5;
        } if (ydim === 6) {
            return PixelFormat.RGBA_ASTC_8x6;
        }
        return PixelFormat.RGBA_ASTC_8x8;
    } if (xdim === 10) {
        if (ydim === 5) {
            return PixelFormat.RGBA_ASTC_10x5;
        } if (ydim === 6) {
            return PixelFormat.RGBA_ASTC_10x6;
        } if (ydim === 8) {
            return PixelFormat.RGBA_ASTC_10x8;
        }
        return PixelFormat.RGBA_ASTC_10x10;
    }
    if (ydim === 10) {
        return PixelFormat.RGBA_ASTC_12x10;
    }
    return PixelFormat.RGBA_ASTC_12x12;
}

function readBEUint16 (header, offset: number) {
    return (header[offset] << 8) | header[offset + 1];
}

function _parseCompressedTexs (file: ArrayBuffer | ArrayBufferView, options: IDownloadParseOptions,
    onComplete: CompleteCallback<IMemoryImageSource>, type: number) {
    const out: IMemoryImageSource = {
        _data: new Uint8Array(0),
        _compressed: true,
        width: 0,
        height: 0,
        format: 0,
        mipmapLevelDataSize: [],
    };

    const err: Error | null = null;
    // try {
    const buffer = file instanceof ArrayBuffer ? file : file.buffer;
    const bufferView = new DataView(buffer);
    // Get a view of the arrayBuffer that represents compress header.
    const magicNumber = bufferView.getUint32(0, true);
    // Do some sanity checks to make sure this is a valid compress file.
    if (magicNumber === COMPRESSED_MIPMAP_MAGIC) {
        // Get a view of the arrayBuffer that represents compress document.
        const mipmapLevelNumber = bufferView.getUint32(COMPRESSED_HEADER_LENGTH, true);
        const mipmapLevelDataSize = bufferView.getUint32(COMPRESSED_HEADER_LENGTH + COMPRESSED_MIPMAP_LEVEL_COUNT_LENGTH, true);
        const fileHeaderByteLength = COMPRESSED_HEADER_LENGTH + COMPRESSED_MIPMAP_LEVEL_COUNT_LENGTH
            + mipmapLevelNumber * COMPRESSED_MIPMAP_DATA_SIZE_LENGTH;

        // Get a view of the arrayBuffer that represents compress chunks.
        _parseCompressedTex(file, 0, fileHeaderByteLength, mipmapLevelDataSize, type, out);
        let beginOffset = fileHeaderByteLength + mipmapLevelDataSize;

        for (let i = 1; i < mipmapLevelNumber; i++) {
            const endOffset = bufferView.getUint32(COMPRESSED_HEADER_LENGTH + COMPRESSED_MIPMAP_LEVEL_COUNT_LENGTH
                +  i * COMPRESSED_MIPMAP_DATA_SIZE_LENGTH, true);
            _parseCompressedTex(file, i, beginOffset, endOffset, type, out);
            beginOffset += endOffset;
        }
    } else {
        _parseCompressedTex(file, 0, 0, 0, type, out);
    }
    // } catch (e) {
    //     err = e as Error;
    // }
    onComplete(err, out);
}

/**
 * @zh 解析压缩纹理
 * @param file @zh ccon 文件
 * @param levelIndex @zh 当前 mipmap 层级
 * @param beginOffset @zh 压缩纹理开始时的偏移
 * @param endOffset @zh 压缩纹理结束时的偏移
 * @param type @zh 压缩纹理类型
 * @param out @zh 压缩纹理输出
 */
function _parseCompressedTex (file: ArrayBuffer | ArrayBufferView, levelIndex: number,
    beginOffset: number, endOffset: number, type: number, out: IMemoryImageSource) {
    switch (type) {
    case compressType.PVR:
        _parsePVRTex(file, levelIndex, beginOffset, endOffset, out);
        break;
    case compressType.PKM:
        _parsePKMTex(file, levelIndex, beginOffset, endOffset, out);
        break;
    case compressType.ASTC:
        _parseASTCTex(file, levelIndex, beginOffset, endOffset, out);
        break;
    default:
        break;
    }
}

/**
 * @zh 解析 PVR 格式的压缩纹理
 * @param file @zh ccon 文件
 * @param levelIndex @zh 当前 mipmap 层级
 * @param beginOffset @zh 压缩纹理开始时的偏移
 * @param endOffset @zh 压缩纹理结束时的偏移
 * @param out @zh 压缩纹理输出
 */
function _parsePVRTex (file: ArrayBuffer | ArrayBufferView, levelIndex: number,
    beginOffset: number, endOffset: number, out: IMemoryImageSource) {
    // let err: Error | null = null;
    // try {
    const buffer = file instanceof ArrayBuffer ? file : file.buffer;
    // Get a view of the arrayBuffer that represents the DDS header.
    const header = new Int32Array(buffer, beginOffset, PVR_HEADER_LENGTH);

    // Do some sanity checks to make sure this is a valid DDS file.
    if (header[PVR_HEADER_MAGIC] === PVR_MAGIC) {
        // Gather other basic metrics and a view of the raw the DXT data.
        const byteOffset = beginOffset + header[PVR_HEADER_METADATA] + 52;
        const length = endOffset - header.byteLength;
        if (endOffset > 0) {
            const srcView = new Uint8Array(buffer, byteOffset, length);
            const dstView = new Uint8Array(out._data!.byteLength + srcView.byteLength);
            dstView.set(out._data as Uint8Array);
            dstView.set(srcView, out._data!.byteLength);
            out._data  = dstView;
            out.mipmapLevelDataSize![levelIndex] = length;
        } else {
            out._data = new Uint8Array(buffer, byteOffset);
        }
        out.width = levelIndex > 0 ? out.width : header[PVR_HEADER_WIDTH];
        out.height = levelIndex > 0 ? out.height : header[PVR_HEADER_HEIGHT];
    } else if (header[11] === 0x21525650) {
        const dataOffset = beginOffset + header[0];
        if (endOffset > 0) {
            const srcView = new Uint8Array(buffer, dataOffset, endOffset - header.byteLength);
            const dstView = new Uint8Array(out._data!.byteLength + srcView.byteLength);
            dstView.set(out._data as Uint8Array);
            dstView.set(srcView, out._data!.byteLength);
            out._data  = dstView;
            out.mipmapLevelDataSize![levelIndex] = srcView.byteLength;
        } else {
            out._data  = new Uint8Array(buffer, dataOffset);
        }
        out.width = levelIndex > 0 ? out.width : header[1];
        out.height = levelIndex > 0 ? out.height : header[2];
    } else {
        throw new Error('Invalid magic number in PVR header');
    }
    // } catch (e) {
    //     err = e as Error;
    // }
}

/**
 * @zh 解析 PKM 格式的压缩纹理
 * @param file @zh ccon 文件
 * @param levelIndex @zh 当前 mipmap 层级
 * @param beginOffset @zh 压缩纹理开始时的偏移
 * @param endOffset @zh 压缩纹理结束时的偏移
 * @param out @zh 压缩纹理输出
 */
function _parsePKMTex (file: ArrayBuffer | ArrayBufferView, levelIndex: number,
    beginOffset: number, endOffset: number, out: IMemoryImageSource) {
    // let err: Error | null = null;
    // try {
    const buffer = file instanceof ArrayBuffer ? file : file.buffer;
    const header = new Uint8Array(buffer, beginOffset, ETC_PKM_HEADER_LENGTH);
    const format = readBEUint16(header, ETC_PKM_FORMAT_OFFSET);
    if (format !== ETC1_RGB_NO_MIPMAPS && format !== ETC2_RGB_NO_MIPMAPS && format !== ETC2_RGBA_NO_MIPMAPS) {
        throw new Error('Invalid magic number in ETC header');
    }

    const byteOffset = beginOffset + ETC_PKM_HEADER_LENGTH;
    const length = endOffset - ETC_PKM_HEADER_LENGTH;
    if (endOffset > 0) {
        const srcView = new Uint8Array(buffer, byteOffset, length);
        const dstView = new Uint8Array(out._data!.byteLength + srcView.byteLength);
        dstView.set(out._data as Uint8Array);
        dstView.set(srcView, out._data!.byteLength);
        out._data  = dstView;
        out.mipmapLevelDataSize![levelIndex] = length;
    } else {
        out._data = new Uint8Array(buffer, byteOffset);
    }
    out.width = levelIndex > 0 ? out.width : readBEUint16(header, ETC_PKM_WIDTH_OFFSET);
    out.height = levelIndex > 0 ? out.height : readBEUint16(header, ETC_PKM_HEIGHT_OFFSET);
    // } catch (e) {
    //     err = e as Error;
    // }
}

/**
 * @zh 解析 ASTC 格式的压缩纹理
 * @param file @zh ccon 文件
 * @param levelIndex @zh 当前 mipmap 层级
 * @param beginOffset @zh 压缩纹理开始时的偏移
 * @param endOffset @zh 压缩纹理结束时的偏移
 * @param out @zh 压缩纹理输出
 */
function _parseASTCTex (file: ArrayBuffer | ArrayBufferView, levelIndex: number,
    beginOffset: number, endOffset: number, out: IMemoryImageSource) {
    // let err: Error | null = null;
    // try {
    const buffer = file instanceof ArrayBuffer ? file : file.buffer;
    const header = new Uint8Array(buffer, beginOffset, ASTC_HEADER_LENGTH);

    const magicval = header[0] + (header[1] << 8) + (header[2] << 16) + (header[3] << 24);
    if (magicval !== ASTC_MAGIC) {
        throw new Error('Invalid magic number in ASTC header');
    }

    const xdim = header[ASTC_HEADER_MAGIC];
    const ydim = header[ASTC_HEADER_MAGIC + 1];
    const zdim = header[ASTC_HEADER_MAGIC + 2];
    if ((xdim < 3 || xdim > 6 || ydim < 3 || ydim > 6 || zdim < 3 || zdim > 6)
            && (xdim < 4 || xdim === 7 || xdim === 9 || xdim === 11 || xdim > 12
            || ydim < 4 || ydim === 7 || ydim === 9 || ydim === 11 || ydim > 12 || zdim !== 1)) {
        throw new Error('Invalid block number in ASTC header');
    }

    const format = getASTCFormat(xdim, ydim);
    const byteOffset = beginOffset + ASTC_HEADER_LENGTH;
    const length = endOffset - ASTC_HEADER_LENGTH;
    if (endOffset > 0) {
        const srcView = new Uint8Array(buffer, byteOffset, length);
        const dstView = new Uint8Array(out._data!.byteLength + srcView.byteLength);
        dstView.set(out._data as Uint8Array);
        dstView.set(srcView, out._data!.byteLength);
        out._data  = dstView;
        out.mipmapLevelDataSize![levelIndex] = length;
    } else {
        out._data = new Uint8Array(buffer, byteOffset);
    }
    out.width = levelIndex > 0 ? out.width : header[ASTC_HEADER_SIZE_X_BEGIN] + (header[ASTC_HEADER_SIZE_X_BEGIN + 1] << 8)
            + (header[ASTC_HEADER_SIZE_X_BEGIN + 2] << 16);
    out.height = levelIndex > 0 ? out.height : header[ASTC_HEADER_SIZE_Y_BEGIN] + (header[ASTC_HEADER_SIZE_Y_BEGIN + 1] << 8)
            + (header[ASTC_HEADER_SIZE_Y_BEGIN + 2] << 16);
    out.format = format;
    // } catch (e) {
    //     err = e as Error;
    // }
}

export type ParseHandler = (file: any, options: IDownloadParseOptions, onComplete: CompleteCallback) => void;

/**
 * @en
 * Parse the downloaded file, it's a singleton, all member can be accessed with `assetManager.parser`
 *
 * @zh
 * 解析已下载的文件，parser 是一个单例, 所有成员能通过 `assetManaager.parser` 访问
 *
 */
export class Parser {
    private _parsing = new Cache<CompleteCallback[]>();

    private _parsers: Record<string, ParseHandler> = {
        '.png': this.parseImage,
        '.jpg': this.parseImage,
        '.bmp': this.parseImage,
        '.jpeg': this.parseImage,
        '.gif': this.parseImage,
        '.ico': this.parseImage,
        '.tiff': this.parseImage,
        '.webp': this.parseImage,
        '.image': this.parseImage,
        '.pvr': this.parsePVRTex,
        '.pkm': this.parsePKMTex,
        '.astc': this.parseASTCTex,

        // plist
        '.plist': this.parsePlist,
        import: this.parseImport,

        '.ccon': this.parseImport,
        '.cconb': this.parseImport,
    };

    public parseImage (file: HTMLImageElement | Blob, options: IDownloadParseOptions, onComplete: CompleteCallback<HTMLImageElement|ImageBitmap>) {
        if (file instanceof HTMLImageElement) {
            onComplete(null, file);
            return;
        }
        createImageBitmap(file, { premultiplyAlpha: 'none' }).then((result) => {
            onComplete(null, result);
        }, (err) => {
            onComplete(err, null);
        });
    }

    public parsePVRTex (file: ArrayBuffer | ArrayBufferView, options: IDownloadParseOptions, onComplete: CompleteCallback<IMemoryImageSource>) {
        _parseCompressedTexs(file, options, onComplete, compressType.PVR);
    }

    public parsePKMTex (file: ArrayBuffer | ArrayBufferView, options: IDownloadParseOptions, onComplete: CompleteCallback<IMemoryImageSource>) {
        _parseCompressedTexs(file, options, onComplete, compressType.PKM);
    }

    public parseASTCTex (file: ArrayBuffer | ArrayBufferView, options: IDownloadParseOptions, onComplete: CompleteCallback<IMemoryImageSource>) {
        _parseCompressedTexs(file, options, onComplete, compressType.ASTC);
    }

    public parsePlist (file: string, options: IDownloadParseOptions, onComplete: CompleteCallback) {
        let err: Error | null = null;
        const result = plistParser.parse(file);
        if (!result) { err = new Error('parse failed'); }
        onComplete(err, result);
    }

    public parseImport (file: Record<string, any> | CCON, options: IDownloadParseOptions, onComplete: CompleteCallback<Asset>) {
        if (!file) {
            onComplete(new Error(`The json file of asset ${options.__uuid__ as string} is empty or missing`));
            return;
        }
        let result: Asset | null = null;
        let err: Error | null = null;
        try {
            result = deserialize(file, options);
        } catch (e) {
            err = e as Error;
        }
        onComplete(err, result);
    }

    public init () {
        this._parsing.clear();
    }

    /**
     * @en
     * Register custom handler if you want to change default behavior or extend parser to parse other format file
     *
     * @zh
     * 当你想修改默认行为或者拓展 parser 来解析其他格式文件时可以注册自定义的handler
     *
     * @param type - Extension likes '.jpg' or map likes {'.jpg': jpgHandler, '.png': pngHandler}
     * @param handler - The corresponding handler
     * @param handler.file - File
     * @param handler.options - Some optional paramter
     * @param handler.onComplete - callback when finishing parsing
     *
     * @example
     * parser.register('.tga', (file, options, onComplete) => onComplete(null, null));
     * parser.register({'.tga': (file, options, onComplete) => onComplete(null, null),
     *                  '.ext': (file, options, onComplete) => onComplete(null, null)});
     *
     */
    public register (type: string, handler: ParseHandler): void;
    public register (map: Record<string, ParseHandler>): void;
    public register (type: string | Record<string, ParseHandler>, handler?: ParseHandler) {
        if (typeof type === 'object') {
            js.mixin(this._parsers, type);
        } else {
            this._parsers[type] = handler as ParseHandler;
        }
    }

    /**
     * @en
     * Use corresponding handler to parse file
     *
     * @zh
     * 使用对应的handler来解析文件
     *
     * @param id - The id of file
     * @param file - File
     * @param type - The corresponding type of file, likes '.jpg'.
     * @param options - Some optional parameters will be transferred to the corresponding handler.
     * @param onComplete - callback when finishing downloading
     * @param onComplete.err - The occurred error, null indicates success
     * @param onComplete.content - The parsed file
     *
     * @example
     * downloader.download('test.jpg', 'test.jpg', '.jpg', {}, (err, file) => {
     *      parser.parse('test.jpg', file, '.jpg', null, (err, img) => console.log(err));
     * });
     *
     */
    public parse (id: string, file: any, type: string, options: IDownloadParseOptions, onComplete: CompleteCallback): void {
        const parsedAsset = parsed.get(id);
        if (parsedAsset) {
            onComplete(null, parsedAsset);
            return;
        }
        const parsing = this._parsing.get(id);
        if (parsing) {
            parsing.push(onComplete);
            return;
        }

        const parseHandler = this._parsers[type];
        if (!parseHandler) {
            onComplete(null, file);
            return;
        }

        this._parsing.add(id, [onComplete]);
        parseHandler(file, options, (err, data) => {
            if (err) {
                files.remove(id);
            } else if (!isScene(data)) {
                parsed.add(id, data);
            }
            const callbacks = this._parsing.remove(id);
            for (let i = 0, l = callbacks!.length; i < l; i++) {
                callbacks![i](err, data);
            }
        });
    }
}

export default new Parser();
