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
/**
 * @packageDocumentation
 * @module asset-manager
 */

import { ImageAsset, Texture2D } from '../assets';
import { packCustomObjData, unpackJSONs } from '../data/deserialize';
import { error, errorID } from '../platform/debug';
import { js } from '../utils/js';
import Cache from './cache';
import downloader from './downloader';
import { transform } from './helper';
import RequestItem from './request-item';
import { CompleteCallback, files, IDownloadParseOptions } from './shared';

export type Unpacker = (packUuid: string[], data: any, options: IDownloadParseOptions, onComplete: CompleteCallback) => void;

interface IUnpackRequest {
    onComplete: CompleteCallback;
    id: string;
}

/**
 * @en
 * Handle the packed asset, include unpacking, loading, cache and so on. It is a singleton. All member can be accessed with `cc.assetManager.packManager`
 *
 * @zh
 * 处理打包资源，包括拆包，加载，缓存等等，这是一个单例, 所有成员能通过 `cc.assetManager.packManager` 访问
 *
 */
export class PackManager {
    private _loading = new Cache<IUnpackRequest[]>();
    private _unpackers: Record<string, Unpacker> = {
        '.json': this.unpackJson,
    };

    /**
     * @en
     * Unpack the json, revert to what it was before packing
     *
     * @zh
     * 拆解 json 包，恢复为打包之前的内容
     *
     * @param pack - The pack
     * @param json - The content of pack
     * @param options - Some optional parameters
     * @param onComplete - Callback when finish unpacking
     * @param onComplete.err - The occurred error, null indicates success
     * @param onComplete.content - The unpacked assets
     *
     * @example
     * downloader.downloadFile('pack.json', { xhrResponseType: 'json'}, null, (err, file) => {
     *      packManager.unpackJson(['a', 'b'], file, null, (err, data) => console.log(err));
     * });
     *
     */
    public unpackJson (pack: string[], json: any, options: IDownloadParseOptions, onComplete: CompleteCallback<Record<string, any>>): void {
        let out = js.createMap(true);
        let err: Error | null = null;

        if (Array.isArray(json)) {
            json = unpackJSONs(json as any);

            if (json.length !== pack.length) {
                errorID(4915);
            }
            for (let i = 0; i < pack.length; i++) {
                out[`${pack[i]}@import`] = json[i];
            }
        } else {
            const textureType = js._getClassId(Texture2D);
            const imageAssetType = js._getClassId(ImageAsset);
            if (json.type === textureType && json.data) {
                const datas = json.data;
                if (datas.length !== pack.length) {
                    errorID(4915);
                }
                for (let i = 0; i < pack.length; i++) {
                    out[`${pack[i]}@import`] = packCustomObjData(textureType, { base: datas[i][0], mipmaps: datas[i][1] });
                }
            } else if (json.type === imageAssetType && json.data) {
                const datas = json.data;
                if (datas.length !== pack.length) {
                    errorID(4915);
                }
                for (let i = 0; i < pack.length; i++) {
                    out[`${pack[i]}@import`] = datas[i];
                }
            } else {
                err = new Error('unmatched type pack!');
                out = null;
            }
        }
        onComplete(err, out);
    }

    public init () {
        this._loading.clear();
    }

    /**
     * @en
     * Register custom handler if you want to change default behavior or extend packManager to unpack other format pack
     *
     * @zh
     * 当你想修改默认行为或者拓展 packManager 来拆分其他格式的包时可以注册自定义的 handler
     *
     * @param type - Extension likes '.bin' or map likes {'.bin': binHandler, '.ab': abHandler}
     * @param handler - handler
     * @param handler.packUuid - The uuid of pack
     * @param handler.data - The content of pack
     * @param handler.options - Some optional parameters
     * @param handler.onComplete - Callback when finishing unpacking
     *
     * @example
     * packManager.register('.bin', (packUuid, file, options, onComplete) => onComplete(null, null));
     * packManager.register({
     *  '.bin': (packUuid, file, options, onComplete) => onComplete(null, null),
     *  '.ab': (packUuid, file, options, onComplete) => onComplete(null, null),
     * });
     */
    public register (type: string, handler: Unpacker): void;
    public register (map: Record<string, Unpacker>): void;
    public register (type: string | Record<string, Unpacker>, handler?: Unpacker) {
        if (typeof type === 'object') {
            js.mixin(this._unpackers, type);
        } else {
            this._unpackers[type] = handler!;
        }
    }

    /**
     * @en
     * Use corresponding handler to unpack package
     *
     * @zh
     * 用对应的 handler 来进行解包
     *
     * @method unpack
     * @param pack - The uuid of packed assets
     * @param data - The packed data
     * @param type - The type indicates that which handler should be used to download, such as '.jpg'
     * @param options - Some optional parameter
     * @param onComplete - callback when finishing unpacking
     * @param onComplete.err -  The occurred error, null indicates success
     * @param onComplete.data - Original assets
     *
     * @example
     * downloader.downloadFile('pack.json', {xhrResponseType: 'json'}, null, (err, file) => {
     *      packManager.unpack(['2fawq123d', '1zsweq23f'], file, '.json', null, (err, data) => console.log(err));
     * });
     *
     */
    public unpack (pack: string[], data: any, type: string, options: IDownloadParseOptions, onComplete: CompleteCallback): void {
        if (!data) {
            onComplete(new Error('package data is wrong!'));
            return;
        }
        const unpacker = this._unpackers[type];
        unpacker(pack, data, options, onComplete);
    }

    /**
     * @en
     * Download request item, If item is not in any package, download as usual. Otherwise, download the corresponding package and unpack it.
     * And then retrieve the corresponding content form it.
     *
     * @zh
     * 下载请求对象，如果请求对象不在任何包内，则正常下载，否则下载对应的 package 并进行拆解，并取回包内对应的内容
     *
     * @param item - Some item you want to download
     * @param options - Some optional parameters
     * @param onComplete - Callback when finished
     * @param onComplete.err - The occurred error, null indicates success
     * @param onComplete.data - The unpacked data retrieved from package
     *
     * @example
     * var requestItem = cc.AssetManager.RequestItem.create();
     * requestItem.uuid = 'fcmR3XADNLgJ1ByKhqcC5Z';
     * requestItem.info = config.getAssetInfo('fcmR3XADNLgJ1ByKhqcC5Z');
     * packManager.load(requestItem, null, (err, data) => console.log(err));
     *
     */
    public load (item: RequestItem, options: IDownloadParseOptions | null, onComplete: CompleteCallback): void {
        // if not in any package, download as uausl
        if (item.isNative || !item.info || !item.info.packs) {
            downloader.download(item.id, item.url, item.ext, item.options, onComplete);
            return;
        }

        if (files.has(item.id)) {
            onComplete(null, files.get(item.id));
            return;
        }

        const packs = item.info.packs;

        // find a loading package
        let pack = packs.find((val) => this._loading.has(val.uuid));

        if (pack) {
            this._loading.get(pack.uuid)!.push({ onComplete, id: item.id });
            return;
        }

        // download a new package
        pack = packs[0];
        this._loading.add(pack.uuid, [{ onComplete, id: item.id }]);

        // find the url of pack
        const url = transform(pack.uuid, { ext: pack.ext, bundle: item.config!.name }) as string;

        downloader.download(pack.uuid, url, pack.ext, item.options, (err, data) => {
            files.remove(pack!.uuid);
            if (err) {
                error(err.message, err.stack);
            }
            // unpack package
            this.unpack(pack!.packedUuids, data, pack!.ext, item.options, (err2, result) => {
                if (!err2) {
                    for (const id in result) {
                        files.add(id, result[id]);
                    }
                }
                const callbacks = this._loading.remove(pack!.uuid);
                for (let i = 0, l = callbacks!.length; i < l; i++) {
                    const cb = callbacks![i];
                    if (err || err2) {
                        cb.onComplete(err || err2);
                        continue;
                    }

                    const unpackedData = result[cb.id];
                    if (!unpackedData) {
                        cb.onComplete(new Error('can not retrieve data from package'));
                    } else {
                        cb.onComplete(null, unpackedData);
                    }
                }
            });
        });
    }
}

export default new PackManager();
