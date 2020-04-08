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
const Config = require('./config');
const finalizer = require('./finalizer');
const { parseParameters, parseLoadResArgs } = require('./utilities');
const { RequestType, assets, bundles } = require('./shared');

/**
 * @module cc.AssetManager
 */

/**
 * !#en
 * A bundle contains an amount of assets(includes scene), you can load, preload, release asset which is in this bundle
 * 
 * !#zh
 * 一个包含一定数量资源（包括场景）的包，你可以加载，预加载，释放此包内的资源
 * 
 * @class Bundle
 */
function Bundle () {
    this._config = new Config();
}

Bundle.prototype = {
    
    /**
     * !#en
     * Create a bundle
     * 
     * !#zh
     * 创建一个 bundle
     * 
     * @method constructor
     * 
     * @typescript
     * constructor()
     */
    constructor: Bundle,

    /**
     * !#en
     * The name of this bundle
     * 
     * !#zh
     * 此 bundle 的名称
     * 
     * @property name
     * @type {string}
     */
    get name () {
        return this._config.name;
    },

    /**
     * !#en
     * The dependency of this bundle
     * 
     * !#zh
     * 此 bundle 的依赖
     * 
     * @property deps
     * @type {string[]}
     */
    get deps () {
        return this._config.deps;
    },

    /**
     * !#en
     * The root path of this bundle, such like 'http://example.com/bundle1'
     * 
     * !#zh
     * 此 bundle 的根路径, 例如 'http://example.com/bundle1'
     * 
     * @property base
     * @type {string}
     */
    get base () {
        return this._config.base;
    },

    /**
     * !#en
     * Get asset's info using path, only valid when asset is in bundle folder.
     *  
     * !#zh
     * 使用 path 获取资源的配置信息
     * 
     * @method getInfoWithPath
     * @param {string} path - The relative path of asset, such as 'images/a'
     * @param {Function} [type] - The constructor of asset, such as  `cc.Texture2D`
     * @returns {Object} The asset info 
     * 
     * @example
     * var info = bundle.getInfoWithPath('image/a', cc.Texture2D);
     * 
     * @typescript
     * getInfoWithPath (path: string, type?: typeof cc.Asset): Record<string, any>
     */
    getInfoWithPath (path, type) {
        return this._config.getInfoWithPath(path, type);
    },

    /**
     * !#en
     * Get all asset's info within specific folder
     * 
     * !#zh
     * 获取在某个指定文件夹下的所有资源信息
     * 
     * @method getDirWithPath
     * @param {string} path - The relative path of folder, such as 'images'
     * @param {Function} [type] - The constructor should be used to filter paths
     * @param {Array} [out] - The output array
     * @returns {Object[]} Infos
     * 
     * @example 
     * var infos = [];
     * bundle.getDirWithPath('images', cc.Texture2D, infos);
     * 
     * @typescript
     * getDirWithPath (path: string, type?: typeof cc.Asset, out?: Record<string, any>[]): Record<string, any>[]
     */
    getDirWithPath (path, type, out) {
        return this._config.getDirWithPath(path, type, out);
    },

    /**
     * !#en
     * Get asset's info with uuid
     * 
     * !#zh
     * 通过 uuid 获取资源信息
     * 
     * @method getAssetInfo
     * @param {string} uuid - The asset's uuid
     * @returns {Object} info 
     * 
     * @example
     * var info = bundle.getAssetInfo('fcmR3XADNLgJ1ByKhqcC5Z');
     * 
     * @typescript
     * getAssetInfo (uuid: string): Record<string, any>
     */
    getAssetInfo (uuid) {
        return this._config.getAssetInfo(uuid);
    },

    /**
     * !#en
     * Get scene'info with name
     * 
     * !#zh
     * 通过场景名获取场景信息
     * 
     * @method getSceneInfo
     * @param {string} name - The name of scene
     * @return {Object} info
     * 
     * @example
     * var info = bundle.getSceneInfo('first.fire');
     * 
     * @typescript
     * getSceneInfo(name: string): Record<string, any>
     */
    getSceneInfo: function (name) {
        return this._config.getSceneInfo(name);
    },

    /**
     * !#en
     * Initialize this bundle with options
     * 
     * !#zh
     * 初始化此 bundle
     * 
     * @method init
     * @param {Object} options 
     * 
     * @typescript
     * init(options: Record<string, any>): void
     */
    init (options) {
        this._config.init(options);
        bundles.add(options.name, this);
    },

    /**
     * !#en
     * Everything is the same like {{#crossLink "AssetManager/loadRes:method"}}{{/crossLink}}, but not load asset which in folder `resources`. The path is 
     * relative to bundle's folder path in project
     * 
     * !#zh
     * 所有一切与 {{#crossLink "AssetManager/loadRes:method"}}{{/crossLink}} 类似，但不是加载 `resources` 目录下的资源。路径是相对 bundle 在工程中的文件夹路径的相对路径
     *
     * @method load
     * @param {String|String[]} paths - Paths of the target assets.The path is relative to the bundle's folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {RequestItem} onProgress.item - The finished request item.
     * @param {Function} [onComplete] - Callback invoked when all assets loaded.
     * @param {Error} onComplete.error - The error info or null if loaded successfully.
     * @param {Asset|Asset[]} onComplete.assets - The loaded assets.
     *
     * @example
     * // load the prefab (project/assets/bundle1/misc/character/cocos) from bundle1 folder
     * bundle1.load('misc/character/cocos', (err, prefab) => console.log(err));
     *
     * // load the sprite frame of (project/assets/bundle2/imgs/cocos.png) from bundle2 folder
     * bundle2.load('imgs/cocos', cc.SpriteFrame, null, (err, spriteFrame) => console.log(err));
     * 
     * @typescript
     * load(paths: string|string[], type?: typeof cc.Asset, onProgress?: (finish: number, total: number, item: RequestItem) => void, onComplete?: (error: Error, assets: cc.Asset|cc.Asset[]) => void): void
     * load(paths: string|string[], onProgress?: (finish: number, total: number, item: RequestItem) => void, onComplete?: (error: Error, assets: cc.Asset|cc.Asset[]) => void): void
     * load(paths: string|string[], type?: typeof cc.Asset, onComplete?: (error: Error, assets: cc.Asset|cc.Asset[]) => void): void
     * load(paths: string|string[], onComplete?: (error: Error, assets: cc.Asset|cc.Asset[]) => void): void
     */
    load (paths, type, onProgress, onComplete) {
        var { type, onProgress, onComplete } = parseLoadResArgs(type, onProgress, onComplete);
        cc.assetManager.loadAny(paths, { requestType: RequestType.PATH, type: type, bundle: this.name }, onProgress, onComplete);
    },

    /**
     * !#en
     * Preload assets from the bundle folder<br>
     * Everything are like {{#crossLink "AssetManager/preloadRes:method"}}{{/crossLink}}
     * 
     * !#zh
     * 预加载 bundle 目录下的资源，其他都和 {{#crossLink "AssetManager/preloadRes:method"}}{{/crossLink}} 相同
     *
     * @method preload
     * @param {String|String[]} paths - Paths of the target asset.The path is relative to bundle folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {RequestItem} onProgress.item - The finished request item.
     * @param {Function} [onComplete] - Callback invoked when the resource loaded.
     * @param {Error} onComplete.error - The error info or null if loaded successfully.
     * @param {RequestItem[]} onComplete.items - The preloaded items.
     * 
     * @typescript
     * preload(paths: string|string[], type?: typeof cc.Asset, onProgress?: (finish: number, total: number, item: RequestItem) => void, onComplete?: (error: Error, items: RequestItem[]) => void): void
     * preload(paths: string|string[], onProgress?: (finish: number, total: number, item: RequestItem) => void, onComplete?: (error: Error, items: RequestItem[]) => void): void
     * preload(paths: string|string[], type?: typeof cc.Asset, onComplete?: (error: Error, items: RequestItem[]) => void): void
     * preload(paths: string|string[], onComplete?: (error: Error, items: RequestItem[]) => void): void
     */
    preload (paths, type, onProgress, onComplete) {
        var { type, onProgress, onComplete } = parseLoadResArgs(type, onProgress, onComplete);
        cc.assetManager.preloadAny(paths, { requestType: RequestType.PATH, type: type, bundle: this.name }, onProgress, onComplete);
    },

    /**
     * !#en
     * Load all assets in a folder inside the bundle folder.<br>
     * <br>
     * Note: All asset paths in Creator use forward slashes, paths using backslashes will not work.
     * 
     * !#zh
     * 加载目标文件夹中的所有资源, 注意：路径中只能使用斜杠，反斜杠将停止工作
     *
     * @method loadDir
     * @param {string} dir - path of the target folder.
     *                       The path is relative to the bundle folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {Object} onProgress.item - The latest request item
     * @param {Function} [onComplete] - A callback which is called when all assets have been loaded, or an error occurs.
     * @param {Error} onComplete.error - If one of the asset failed, the complete callback is immediately called
     *                                         with the error. If all assets are loaded successfully, error will be null.
     * @param {Asset[]|Asset} onComplete.assets - An array of all loaded assets.
     *
     * @typescript
     * loadDir(dir: string, type?: typeof cc.Asset, onProgress?: (finish: number, total: number, item: RequestItem) => void, onComplete?: (error: Error, assets: Asset[]|Asset) => void): void
     * loadDir(dir: string, onProgress?: (finish: number, total: number, item: RequestItem) => void, onComplete?: (error: Error, assets: Asset[]|Asset) => void): void
     * loadDir(dir: string, type?: typeof cc.Asset, onComplete?: (error: Error, assets: Asset[]|Asset) => void): void
     * loadDir(dir: string, onComplete?: (error: Error, assets: Asset[]|Asset) => void): void
     */
    loadDir (dir, type, onProgress, onComplete) {
        var { type, onProgress, onComplete } = parseLoadResArgs(type, onProgress, onComplete);
        cc.assetManager.loadAny(dir, {requestType: RequestType.DIR, type: type, bundle: this.name}, onProgress, onComplete);
    },

    /**
     * !#en
     * Preload all assets in a folder inside the bundle folder.<br>
     * <br>
     * Everything are like `loadDir`
     * 
     * !#zh
     * 预加载目标文件夹中的所有资源, 其他和 `loadDir` 一样
     *
     * @method preloadDir
     * @param {string} dir - path of the target folder.
     *                       The path is relative to the bundle folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be preloaded if this argument is supplied.
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {Object} onProgress.item - The latest request item
     * @param {Function} [onComplete] - A callback which is called when all assets have been loaded, or an error occurs.
     * @param {Error} onComplete.error - If one of the asset failed, the complete callback is immediately called
     *                                         with the error. If all assets are preloaded successfully, error will be null.
     * @param {RequestItem[]} onComplete.items - An array of all preloaded items.
     *                                             
     * @typescript
     * preloadDir(dir: string, type?: typeof cc.Asset, onProgress?: (finish: number, total: number, item: RequestItem) => void, onComplete?: (error: Error, items: RequestItem[]) => void): void
     * preloadDir(dir: string, onProgress?: (finish: number, total: number, item: RequestItem) => void, onComplete?: (error: Error, items: RequestItem[]) => void): void
     * preloadDir(dir: string, type?: typeof cc.Asset, onComplete?: (error: Error, items: RequestItem[]) => void): void
     * preloadDir(dir: string, onComplete?: (error: Error, items: RequestItem[]) => void): void
     */
    preloadDir (dir, type, onProgress, onComplete) {
        var { type, onProgress, onComplete } = parseLoadResArgs(type, onProgress, onComplete);
        cc.assetManager.preloadAny(dir, { requestType: RequestType.DIR, type: type, bundle: this.name }, onProgress, onComplete);
    },

    /**
     * !#en 
     * Loads the scene by its name. Everything are like {{#crossLink "AssetManager/loadScene:method"}}{{/crossLink}}, 
     * but can only load scene from this bundle
     * 
     * !#zh 
     * 通过场景名称进行加载场景。所有和 {{#crossLink "AssetManager/loadScene:method"}}{{/crossLink}} 一样，但只能加载此包中的场景
     *
     * @method loadScene
     * @param {String} sceneName - The name of the scene to load.
     * @param {Object} [options] - Some optional parameters
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {Object} onProgress.item - The latest request item
     * @param {Function} [onComplete] - callback, will be called after scene launched.
     * @param {Error} onComplete.err - The occurred error, null indicetes success
     * @param {Scene} onComplete.scene - The scene
     * 
     * @example
     * bundle1.loadScene('first', (err, scene) => cc.director.runScene(scene));
     * 
     * @typescript
     * loadScene(sceneName: string, options?: Record<string, any>, onProgress?: (finish: number, total: number, item: RequestItem) => void, onComplete?: (error: Error, scene: cc.Scene) => void): void
     * loadScene(sceneName: string, onProgress?: (finish: number, total: number, item: RequestItem) => void, onComplete?: (error: Error, scene: cc.Scene) => void): void
     * loadScene(sceneName: string, options?: Record<string, any>, onComplete?: (error: Error, scene: cc.Scene) => void): void
     * loadScene(sceneName: string, onComplete?: (error: Error, scene: cc.Scene) => void): void
     */
    loadScene (sceneName, options, onProgress, onComplete) {
        var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);
    
        options.priority = options.priority !== undefined ? options.priority : 1;
        options.bundle = this.name;
        return cc.assetManager.loadAny({ 'scene': sceneName }, options, onProgress, function (err, sceneAsset) {
            if (err) {
                onComplete && onComplete(err);
            }
            else if (sceneAsset instanceof cc.SceneAsset) {
                var scene = sceneAsset.scene;
                scene._id = sceneAsset._uuid;
                scene._name = sceneAsset._name;
                onComplete && onComplete(null, scene);
            }
            else {
                onComplete && onComplete(new Error('The asset ' + sceneAsset._uuid + ' is not a scene'));
            }
        });
    },

    /**
     * !#en
     * Everything are like {{#crossLink "AssetManager/preloadScene:method"}}{{/crossLink}},
     * but can only preload scene from this bundle
     * 
     * !#zh 
     * 所有一切与 {{#crossLink "AssetManager/preloadScene:method"}}{{/crossLink}} 类似，但只能预加载此包中的场景
     *
     * @method preloadScene
     * @param {String} sceneName - The name of the scene to preload.
     * @param {Object} [options] - Some optional parameters
     * @param {Function} [onProgress] - callback, will be called when the load progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed
     * @param {Number} onProgress.total - The total number of the items
     * @param {RequestItem} onProgress.item The latest request item
     * @param {Function} [onComplete] - callback, will be called after scene loaded.
     * @param {Error} onComplete.error - null or the error object.
     * 
     * @example
     * bundle1.preloadScene('first', (err) => bundle1.loadScene('first'));
     * 
     * @typescript
     * preloadScene(sceneName: string, options?: Record<string, any>, onProgress?: (finish: number, total: number, item: RequestItem) => void, onComplete?: (error: Error) => void): void
     * preloadScene(sceneName: string, onProgress?: (finish: number, total: number, item: RequestItem) => void, onComplete?: (error: Error) => void): void
     * preloadScene(sceneName: string, options?: Record<string, any>, onComplete?: (error: Error) => void): void
     * preloadScene(sceneName: string, onComplete?: (error: Error) => void): void
     */
    preloadScene (sceneName, options, onProgress, onComplete) {
        var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);

        options.bundle = this.name;
        cc.assetManager.preloadAny({'scene': sceneName}, options, onProgress, function (err) {
            if (err) {
                cc.errorID(1210, sceneName, err.message);
            }
            onComplete && onComplete(err);
        });
    },

    /**
     * !#en
     * Everything are like {{#crossLink "AssetManager/getRes:method"}}{{/crossLink}}
     * but can only get asset from this bundle
     * 
     * !#zh
     * 所有一切与 {{#crossLink "AssetManager/getRes:method"}}{{/crossLink}} 类似，但只能
     * 获取到此包中的资源
     * 
     * @method getAsset
     * @param {String} path - The path of asset
     * @param {Function} [type] - Only asset of type will be returned if this argument is supplied.
     * @returns {Asset} 
     * 
     * @typescript
     * getAsset(path: string, type?: typeof cc.Asset): cc.Asset
     */
    getAsset (path, type) {
        var info = this.getInfoWithPath(path, type);
        return assets.get(info && info.uuid);
    },

    /**
     * !#en
     * Everything are like {{#crossLink "AssetManager/releaseRes:method"}}{{/crossLink}}
     * but can only release asset from this bundle
     * 
     * !#zh
     * 所有一切与 {{#crossLink "AssetManager/releaseRes:method"}}{{/crossLink}} 类似，但只能
     * 释放此包中的资源
     * 
     * @method releaseAsset
     * @param {String} path - The path of asset
     * @param {Function} [type] - Only asset of type will be released if this argument is supplied.
     * @param {boolean} [force] - Indicates whether or not release this asset forcely
     * 
     * @example
     * // release a texture which is no longer need
     * bundle1.releaseAsset('misc/character/cocos');
     *
     * @typescript
     * releaseAsset(path: string, type: typeof cc.Asset, force?: boolean): void
     * releaseAsset(path: string): void
     */
    releaseAsset (path, type, force) {
        finalizer.release(this.getAsset(path, type), force);
    },

    /**
     * !#en 
     * Release all assets from this bundle. Refer to {{#crossLink "AssetManager/releaseAll:method"}}{{/crossLink}} for detailed informations.
     * 
     * !#zh 
     * 释放此包中的所有资源。详细信息请参考 {{#crossLink "AssetManager/release:method"}}{{/crossLink}}
     *
     * @method releaseAll
     * @param {boolean} [force] - Indicates whether or not release this asset forcely
     * 
     * @typescript
     * releaseAll(force?: boolean): void
     */
    releaseAll (force) {
        var self = this;
        assets.forEach(function (asset) {
            let info = self.getAssetInfo(asset._uuid);
            if (info && !info.redirect) {
                finalizer.release(asset, force);
            }
        });
    },

    /**
     * !#en 
     * Destroy this bundle. NOTE: The asset whthin this bundle will not be released automatically, you can call {{#crossLink "Bundle/releaseAll:method"}}{{/crossLink}} manually before destroy it if you need
     * 
     * !#zh 
     * 销毁此包, 注意：这个包内的资源不会自动释放, 如果需要的话你可以在摧毁之前手动调用 {{#crossLink "Bundle/releaseAll:method"}}{{/crossLink}} 进行释放
     *
     * @method destroy
     * 
     * @typescript
     * destroy(): void
     */
    destroy () {
        this._config.destroy();
        bundles.remove(this.name);
    }

};

module.exports = Bundle;