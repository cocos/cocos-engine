/*
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ImageAsset, IMemoryImageSource } from '../assets/image-asset';
import { js } from '../../core';
import Cache from './cache';
import deserialize from './deserialize';
import { isScene } from './helper';
import plistParser from './plist-parser';
import { CompleteCallback, IDownloadParseOptions, files, parsed } from './shared';
import { CCON } from '../../serialization/ccon';
import { Asset } from '../assets';

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
        let err: Error | null = null;
        let out: IMemoryImageSource | null = null;
        try {
            out = ImageAsset.parseCompressedTextures(file, 0);
        } catch (e) {
            err = e as Error;
            console.warn(err);
        }
        onComplete(err, out);
    }

    public parsePKMTex (file: ArrayBuffer | ArrayBufferView, options: IDownloadParseOptions, onComplete: CompleteCallback<IMemoryImageSource>) {
        let err: Error | null = null;
        let out: IMemoryImageSource | null = null;
        try {
            out = ImageAsset.parseCompressedTextures(file, 1);
        } catch (e) {
            err = e as Error;
            console.warn(err);
        }
        onComplete(err, out);
    }

    public parseASTCTex (file: ArrayBuffer | ArrayBufferView, options: IDownloadParseOptions, onComplete: CompleteCallback<IMemoryImageSource>) {
        let err: Error | null = null;
        let out: IMemoryImageSource | null = null;
        try {
            out = ImageAsset.parseCompressedTextures(file, 2);
        } catch (e) {
            err = e as Error;
            console.warn(err);
        }
        onComplete(err, out);
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
