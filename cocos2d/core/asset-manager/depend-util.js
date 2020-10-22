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
const Cache = require('./cache');
const deserialize = require('./deserialize');
const { files, parsed } = require('./shared');
import { hasNativeDep , getDependUuidList } from '../platform/deserialize-compiled';
import deserializeForCompiled from '../platform/deserialize-compiled';

/**
 * @module cc.AssetManager
 */
/**
 * !#en
 * Control asset's dependency list, it is a singleton. All member can be accessed with `cc.assetManager.dependUtil`
 * 
 * !#zh
 * 控制资源的依赖列表，这是一个单例, 所有成员能通过 `cc.assetManager.dependUtil` 访问
 * 
 * @class DependUtil
 */
var dependUtil = {
    _depends: new Cache(),

    init () {
        this._depends.clear();
    },

    /**
     * !#en
     * Get asset's native dependency. For example, Texture's native dependency is image.
     * 
     * !#zh
     * 获取资源的原生依赖，例如 Texture 的原生依赖是图片
     * 
     * @method getNativeDep
     * @param {string} uuid - asset's uuid
     * @returns {Object} native dependency
     * 
     * @example
     * var dep = dependUtil.getNativeDep('fcmR3XADNLgJ1ByKhqcC5Z');
     * 
     * @typescript
     * getNativeDep(uuid: string): Record<string, any>
     */
    getNativeDep (uuid) {
        let depend = this._depends.get(uuid);
        if (depend) return depend.nativeDep && Object.assign({}, depend.nativeDep);
        return null;
    },

    /**
     * !#en
     * Get asset's direct referencing non-native dependency list. For example, Material's non-native dependencies are Texture.
     * 
     * !#zh
     * 获取资源直接引用的非原生依赖列表，例如，材质的非原生依赖是 Texture
     * 
     * @method getDeps
     * @param {string} uuid - asset's uuid
     * @returns {string[]} direct referencing non-native dependency list
     * 
     * @example
     * var deps = dependUtil.getDeps('fcmR3XADNLgJ1ByKhqcC5Z');
     * 
     * @typescript
     * getDeps(uuid: string): string[]
     */
    getDeps (uuid) {
        if (this._depends.has(uuid)) {
            return this._depends.get(uuid).deps;
        }
        return [];
    },
    
    /**
     * !#en
     * Get non-native dependency list of the loaded asset, include indirect reference.
     * The returned array stores the dependencies with their uuid, after retrieve dependencies,
     * 
     * !#zh
     * 获取某个已经加载好的资源的所有非原生依赖资源列表，包括间接引用的资源，并保存在数组中返回。
     * 返回的数组将仅保存依赖资源的 uuid。
     *
     * @method getDependsRecursively
     * @param {String} uuid - The asset's uuid
     * @returns {string[]} non-native dependency list
     * 
     * @example
     * var deps = dependUtil.getDepsRecursively('fcmR3XADNLgJ1ByKhqcC5Z');
     * 
     * @typescript
     * getDepsRecursively(uuid: string): string[]
     */
    getDepsRecursively (uuid) {
        var exclude = Object.create(null), depends = [];
        this._descend(uuid, exclude, depends);
        return depends;
    },

    _descend (uuid, exclude, depends) {
        var deps = this.getDeps(uuid);
        for (var i = 0; i < deps.length; i++) {
            var depend = deps[i];
            if ( !exclude[depend] ) {
                exclude[depend] = true;
                depends.push(depend);
                this._descend(depend, exclude, depends);
            }
        }
    },

    remove (uuid) {
        this._depends.remove(uuid);
    },
    
    /**
     * !#en
     * Extract dependency list from serialized data or asset and then store in cache.
     * 
     * !#zh
     * 从序列化数据或资源中提取出依赖列表，并且存储在缓存中。
     * 
     * @param {string} uuid - The uuid of serialized data or asset
     * @param {Object} json - Serialized data or asset
     * @returns {Object} dependency list, include non-native and native dependency
     * 
     * @example
     * downloader.downloadFile('test.json', {responseType: 'json'}, null, (err, file) => {
     *     var dependencies = parse('fcmR3XADNLgJ1ByKhqcC5Z', file);
     * });
     * 
     * @typescript
     * parse(uuid: string, json: any): { deps?: string[], nativeDep?: any }
     */
    parse (uuid, json) {
        var out = null;
        if (Array.isArray(json) || json.__type__) {

            if (out = this._depends.get(uuid)) return out;

            if (Array.isArray(json) && (!(CC_BUILD || deserializeForCompiled.isCompiledJson(json)) || !hasNativeDep(json))) {
                out = {
                    deps: this._parseDepsFromJson(json),
                };
            }
            else {
                try {
                    var asset = deserialize(json);
                    out = this._parseDepsFromAsset(asset);
                    out.nativeDep && (out.nativeDep.uuid = uuid);
                    parsed.add(uuid + '@import', asset);
                }
                catch (e) {
                    files.remove(uuid + '@import');
                    out = { deps: [] };
                }
            }
        }
        // get deps from an existing asset 
        else {
            if (!CC_EDITOR && (out = this._depends.get(uuid)) && out.parsedFromExistAsset) return out;
            out = this._parseDepsFromAsset(json);
        }
        // cache dependency list
        this._depends.add(uuid, out);
        return out;
    },

    _parseDepsFromAsset: function (asset) {
        var out = {
            deps: [],
            parsedFromExistAsset: true,
            preventPreloadNativeObject: asset.constructor.preventPreloadNativeObject,
            preventDeferredLoadDependents: asset.constructor.preventDeferredLoadDependents
        };
        let deps = asset.__depends__;
        for (var i = 0, l = deps.length; i < l; i++) {
            var dep = deps[i].uuid;
            out.deps.push(dep);
        }
    
        if (asset.__nativeDepend__) {
            out.nativeDep = asset._nativeDep;
        }

        return out;
    },

    _parseDepsFromJson: CC_EDITOR || CC_PREVIEW ? function (json) {

        if (deserializeForCompiled.isCompiledJson(json)) {
            let depends = getDependUuidList(json);
            depends.forEach((uuid, index) => depends[index] = cc.assetManager.utils.decodeUuid(uuid));
            return depends;
        }
            
        var depends = [];
        function parseDependRecursively (data, out) {
            if (!data || typeof data !== 'object' || data.__id__) return;
            var uuid = data.__uuid__;
            if (Array.isArray(data)) {
                for (let i = 0, l = data.length; i < l; i++) {
                    parseDependRecursively(data[i], out);
                }
            }
            else if (uuid) { 
                out.push(cc.assetManager.utils.decodeUuid(uuid));
            }
            else {
                for (var prop in data) {
                    parseDependRecursively(data[prop], out);
                }
            }
        }
        parseDependRecursively(json, depends);
        return depends;
    } : function (json) {
        let depends = getDependUuidList(json);
        depends.forEach((uuid, index) => depends[index] = cc.assetManager.utils.decodeUuid(uuid));
        return depends;
    }
};

module.exports = dependUtil;