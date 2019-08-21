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
const js = require('../platform/js');

/**
 * !#en
 * Control asset's dependency list, it is a singleton.
 * 
 * !#zh
 * 控制资源的依赖列表，这是一个单例
 * 
 * @static
 */
var dependUtil = {
    _depends: new Cache(),

    /**
     * !#en
     * Initialize
     * 
     * !#zh
     * 初始化
     * 
     * @method init
     * 
     * @typescript
     * init(): void
     */
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
     * getNativeDep(uuid: string): any
     */
    getNativeDep (uuid) {
        if (this._depends.has(uuid)) return this._depends.get(uuid).nativeDep;
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

    /**
     * !#en
     * Remove dependency list from cache
     * 
     * !#zh
     * 移除缓存中的依赖列表
     * 
     * @method remove
     * @param {string} uuid - The asset's uuid
     * 
     * @example
     * dependUtil.remove('fcmR3XADNLgJ1ByKhqcC5Z');
     * 
     * @typescript
     * remove(uuid: string): void;
     */
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
     * parse(uuid: string, json: any): any
     */
    parse (uuid, json) {
        if (!CC_EDITOR && this._depends.has(uuid)) return this._depends.get(uuid);
        
        var out = Object.create(null);
        var type = json.__type__;

        // scene or prefab
        if (Array.isArray(json)) {
            out.deps = cc.Asset._parseDepsFromJson(json);
            out.asyncLoadAssets = json[0].asyncLoadAssets;
        }
        // get deps from json
        else if (type) {
            var ctor = js._getClassById(type);
            out.preventPreloadNativeObject = ctor.preventPreloadNativeObject;
            out.preventDeferredLoadDependents = ctor.preventDeferredLoadDependents;
            out.deps = ctor._parseDepsFromJson(json);
            out.nativeDep = ctor._parseNativeDepFromJson(json);
            out.nativeDep && (out.nativeDep.uuid = uuid);
        }
        // get deps from an existing asset 
        else {
            var asset = json;
            out.deps = [];
            out.preventPreloadNativeObject = asset.constructor.preventPreloadNativeObject;
            out.preventDeferredLoadDependents = asset.constructor.preventDeferredLoadDependents;
            let deps = asset.__depends__;
            for (var i = 0, l = deps.length; i < l; i++) {
                var dep = deps[i].uuid;
                out.deps.push(dep);
            }
        
            if (asset.__nativeDepend__) {
                out.nativeDep = asset._nativeDep;
            }
        }
        // cache dependency list
        this._depends.add(uuid, out);
        return out;
    }
};

module.exports = dependUtil;