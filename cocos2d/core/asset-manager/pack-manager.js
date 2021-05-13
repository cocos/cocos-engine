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

import { unpackJSONs, packCustomObjData } from '../platform/deserialize-compiled';

const downloader = require('./downloader');
const Cache = require('./cache');
const js = require('../platform/js');
const { files } = require('./shared');

var _loading = new Cache();

function isLoading (val) {
    return _loading.has(val.uuid);
}


/**
 * @module cc.AssetManager
 */
/**
 * !#en
 * Handle the packed asset, include unpacking, loading, cache and so on. It is a singleton. All member can be accessed with `cc.assetManager.packManager`
 * 
 * !#zh
 * 处理打包资源，包括拆包，加载，缓存等等，这是一个单例, 所有成员能通过 `cc.assetManager.packManager` 访问
 * 
 * @class PackManager
 */
var packManager = {

    /**
     * !#en
     * Unpack the json, revert to what it was before packing
     * 
     * !#zh
     * 拆解 json 包，恢复为打包之前的内容
     * 
     * @method unpackJson
     * @param {String[]} pack - The pack
     * @param {Object} json - The content of pack
     * @param {Object} options - Some optional parameters
     * @param {Function} onComplete - Callback when finish unpacking
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {Object} onComplete.content - The unpacked assets
     * 
     * @example
     * downloader.downloadFile('pack.json', {responseType: 'json'}, null, (err, file) => {
     *      packManager.unpackJson(['a', 'b'], file, null, (err, data) => console.log(err));
     * });
     * 
     * @typescript
     * unpackJson(pack: string[], json: any, options: Record<string, any>, onComplete?: (err: Error, content: any) => void): void
     */
    unpackJson (pack, json, options, onComplete) {

        var out = js.createMap(true), err = null;
        
        if (Array.isArray(json)) {

            json = unpackJSONs(json);

            if (json.length !== pack.length) {
                cc.errorID(4915);
            }
            for (let i = 0; i < pack.length; i++) {
                var key = pack[i] + '@import';
                out[key] = json[i];
            }
        }
        else {
            const textureType = js._getClassId(cc.Texture2D);
            if (json.type === textureType) {
                if (json.data) {
                    var datas = json.data.split('|');
                    if (datas.length !== pack.length) {
                        cc.errorID(4915);
                    }
                    for (let i = 0; i < pack.length; i++) {
                        out[pack[i] + '@import'] = packCustomObjData(textureType, datas[i], true);
                    }
                }
            }
            else {
                err = new Error('unmatched type pack!');
                out = null;
            }
        }
        onComplete && onComplete(err, out);
    },

    init () {
        _loading.clear();
    },

    /**
     * !#en
     * Register custom handler if you want to change default behavior or extend packManager to unpack other format pack
     * 
     * !#zh
     * 当你想修改默认行为或者拓展 packManager 来拆分其他格式的包时可以注册自定义的 handler
     * 
     * @method register
     * @param {string|Object} type - Extension likes '.bin' or map likes {'.bin': binHandler, '.ab': abHandler}
     * @param {Function} [handler] - handler
     * @param {string} handler.packUuid - The uuid of pack
     * @param {*} handler.data - The content of pack
     * @param {Object} handler.options - Some optional parameters
     * @param {Function} handler.onComplete - Callback when finishing unpacking
     * 
     * @example
     * packManager.register('.bin', (packUuid, file, options, onComplete) => onComplete(null, null));
     * packManager.register({'.bin': (packUuid, file, options, onComplete) => onComplete(null, null), '.ab': (packUuid, file, options, onComplete) => onComplete(null, null)});
     * 
     * @typescript
     * register(type: string, handler: (packUuid: string, data: any, options: Record<string, any>, onComplete: (err: Error, content: any) => void) => void): void
     * register(map: Record<string, (packUuid: string, data: any, options: Record<string, any>, onComplete: (err: Error, content: any) => void) => void>): void
     */
    register (type, handler) {
        if (typeof type === 'object') {
            js.mixin(unpackers, type);
        }
        else {
            unpackers[type] = handler;
        }
    },
    
    /**
     * !#en
     * Use corresponding handler to unpack package
     * 
     * !#zh
     * 用对应的 handler 来进行解包 
     * 
     * @method unpack
     * @param {String[]} pack - The uuid of packed assets 
     * @param {*} data - The packed data
     * @param {string} type - The type indicates that which handler should be used to download, such as '.jpg'
     * @param {Object} options - Some optional parameter
     * @param {Function} onComplete - callback when finishing unpacking
     * @param {Error} onComplete.err -  The occurred error, null indicetes success
     * @param {*} onComplete.data - Original assets
     * 
     * @example
     * downloader.downloadFile('pack.json', {responseType: 'json'}, null, (err, file) => {
     *      packManager.unpack(['2fawq123d', '1zsweq23f'], file, '.json', null, (err, data) => console.log(err));
     * });
     * 
     * @typescript
     * unpack(pack: string[], data: any, type: string, options: Record<string, any>, onComplete?: (err: Error, data: any) => void): void
     */
    unpack (pack, data, type, options, onComplete) {
        if (!data) {
            onComplete && onComplete(new Error('package data is wrong!'));
            return;
        }
        var unpacker = unpackers[type];
        unpacker(pack, data, options, onComplete);
    },

    /**
     * !#en
     * Download request item, If item is not in any package, download as usual. Otherwise, download the corresponding package and unpack it. 
     * And then retrieve the corresponding content form it.
     * 
     * !#zh
     * 下载请求对象，如果请求对象不在任何包内，则正常下载，否则下载对应的 package 并进行拆解，并取回包内对应的内容
     * 
     * @method load
     * @param {RequestItem} item - Some item you want to download
     * @param {Object} options - Some optional parameters
     * @param {Function} onComplete - Callback when finished
     * @param {Err} onComplete.err - The occurred error, null indicetes success
     * @param {*} onComplete.data - The unpacked data retrieved from package
     * 
     * @example
     * var requestItem = cc.AssetManager.RequestItem.create();
     * requestItem.uuid = 'fcmR3XADNLgJ1ByKhqcC5Z';
     * requestItem.info = config.getAssetInfo('fcmR3XADNLgJ1ByKhqcC5Z');
     * packManager.load(requestItem, null, (err, data) => console.log(err));
     * 
     * @typescript
     * load(item: RequestItem, options: Record<string, any>, onComplete: (err: Error, data: any) => void): void
     * 
     */
    load (item, options, onComplete) {
        // if not in any package, download as uausl
        if (item.isNative || !item.info || !item.info.packs) return downloader.download(item.id, item.url, item.ext, item.options, onComplete);

        if (files.has(item.id)) return onComplete(null, files.get(item.id));

        var packs = item.info.packs;

        // find a loading package
        var pack = packs.find(isLoading);
        
        if (pack) return _loading.get(pack.uuid).push({ onComplete, id: item.id });

        // download a new package
        pack = packs[0];
        _loading.add(pack.uuid, [{ onComplete, id: item.id }]);

        let url = cc.assetManager._transform(pack.uuid, {ext: pack.ext, bundle: item.config.name});

        downloader.download(pack.uuid, url, pack.ext, item.options, function (err, data) {
            files.remove(pack.uuid);
            if (err) {
                cc.error(err.message, err.stack);
            }
            // unpack package
            packManager.unpack(pack.packs, data, pack.ext, item.options, function (err, result) {
                if (!err) {
                    for (var id in result) {
                        files.add(id, result[id]);
                    }
                } else {
                    err.message = `unpack ${url} failed! details: ${err.message}`;
                }
                var callbacks = _loading.remove(pack.uuid);
                for (var i = 0, l = callbacks.length; i < l; i++) {
                    var cb = callbacks[i];
                    if (err) {
                        cb.onComplete(err);
                        continue;
                    }

                    var data = result[cb.id];
                    if (!data) {
                        cb.onComplete(new Error('can not retrieve data from package'));
                    }
                    else {
                        cb.onComplete(null, data);
                    }
                }
            });
        });
    }
};

var unpackers = {
    '.json': packManager.unpackJson
};

module.exports = packManager;
