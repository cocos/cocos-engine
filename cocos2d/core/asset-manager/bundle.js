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
const Task = require('./task');
const Cache = require('./cache');
const finalizer = require('./finalizer');
const { parseParameters, parseLoadResArgs } = require('./utilities');
const { pipeline, fetchPipeline, initializePipeline, LoadStrategy, RequestType, assets, bundles } = require('./shared');


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
    this._preloadedScene = new Cache();
}

Bundle.prototype = {
    
    constructor: Bundle,

    /**
     * !#en
     * Initialize this bundle with options
     * 
     * !#zh
     * 初始化此 bundle
     * 
     * @method init
     * @param {Object} options 
     */
    init (options) {
        this._config.init(options);
        this._preloadedScene.clear();
        bundles.add(options.name, this);
    },
    
    /**
     * !#en
     * Refer to {{#crossLink "assetManager/load:method"}}{{/crossLink}} for detailed informations. Everything are the same as `cc.assetManager.load`, but
     * only can load asset which is in this bundle
     * 
     * !#zh
     * 参考 {{#crossLink "assetManager/load:method"}}{{/crossLink}} 获取更多详细信息，所有一切和 `cc.assetManager.load` 一样，但只能加载此包内的资源
     * 
     * @method load
     * @param {string|string[]|Object|Object[]|Task} requests - The request you want to load or a preloaded task
     * @param {Object} [options] - Optional parameters
     * @param {RequestType} [options.requestType] - Indicates that which type the requests is
     * @param {Function} [options.type] - When request's type is path or dir, indicates which type of asset you want to load
     * @param {Function} [onProgress] - Callback invoked when progression change
     * @param {Number} onProgress.finished - The number of the items that are already completed
     * @param {Number} onProgress.total - The total number of the items
     * @param {RequestItem} onProgress.item - The current request item
     * @param {Function} [onComplete] - Callback invoked when finish loading
     * @param {Error} onComplete.err - The error occured in loading process.
     * @param {Object} onComplete.data - The loaded content
     * @returns {Task} loading task
     * 
     * @typescript
     * load(requests: string | string[] | Object | Object[] | cc.AssetManager.Task, options?: any, onProgress?: ((finished: number, total: number, item: cc.AssetManager.RequestItem) => void)|null, onComplete?: ((err: Error, data: any) => void)|null): cc.AssetManager.Task
     */
    load (requests, options, onProgress, onComplete) {
        var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);

        if (requests instanceof Task) {
            requests.onComplete = onComplete;
            initializePipeline.async(requests);
            return null;
        }
        
        options = options || Object.create(null);
        options.bundle = this._config.name;
        var task = new Task({input: requests, onProgress, onComplete, options});
        pipeline.async(task);
        return task;
    },

    /**
     * !#en
     * Refer to {{#crossLink "assetManager/preload:method"}}{{/crossLink}} for detailed informations. Everything are same as `cc.assetManager.preload`, but
     * only can preload asset in this bundle
     * 
     * !#zh
     * 参考 {{#crossLink "assetManager/preload:method"}}{{/crossLink}} 获取更多详细信息，所有一切和 `cc.assetManager.preload` 一样，但只能预加载此包内的资源
     * 
     * @method preload
     * @param {string|string[]|Object|Object[]} requests - The request you want to preload
     * @param {Object} [options] - Optional parameters
     * @param {RequestType} [options.requestType] - Indicates that which type the requests is
     * @param {Function} [options.type] - When request's type is path or dir, indicates which type of asset you want to preload
     * @param {Function} [onProgress] - Callback invoked when progression change
     * @param {Number} onProgress.finished - The number of the items that are already completed
     * @param {Number} onProgress.total - The total number of the items
     * @param {RequestItem} onProgress.item - The current request item
     * @param {Function} [onComplete] - Callback invoked when finish preloading
     * @param {Error} onComplete.err - The error occured in preloading process.
     * @param {RequestItem[]} onComplete.items - The preloaded content
     * @returns {Task} preloading task
     * 
     * @typescript
     * preload(requests: string | string[] | Object | Object[], options?: any, onProgress?: ((finished: number, total: number, item: cc.AssetManager.RequestItem) => void)|null, onComplete?: ((err: Error, items: cc.AssetManager.RequestItem[]) => void)|null): cc.AssetManager.Task
     */
    preload (requests, options, onProgress, onComplete) {
        var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);

        options.loadStrategy = LoadStrategy.PRELOAD;
        options.bundle = this._config.name;
        options.priority = -1;
        var task = new Task({input: requests, onProgress, onComplete, options});
        fetchPipeline.async(task);
        return task;
    },

    /**
     * !#en
     * Everything is the same like {{#crossLink "assetManager/loadRes:method"}}{{/crossLink}}, but not load asset which in folder `resources`. The path is 
     * relative to bundle's folder path in project
     * 
     * !#zh
     * 所有一切与 {{#crossLink "assetManager/loadRes:method"}}{{/crossLink}} 类似，但不是加载 `resources` 目录下的资源。路径是相对 bundle 在工程中的文件夹路径的相对路径
     *
     * @method loadAsset
     * @param {String|String[]|Task} paths - Paths of the target assets or a preloaded task.The path is relative to the bundle's folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {RequestItem} onProgress.item - The finished request item.
     * @param {Function} [onComplete] - Callback invoked when all assets loaded.
     * @param {Error} onComplete.error - The error info or null if loaded successfully.
     * @param {Asset|Asset[]} onComplete.assets - The loaded assets.
     * @return {Task} loading task
     *
     * @example
     * // load the prefab (project/assets/bundle1/misc/character/cocos) from bundle1 folder
     * bundle1.loadAsset('misc/character/cocos', (err, prefab) => console.log(err));
     *
     * // load the sprite frame of (project/assets/bundle2/imgs/cocos.png) from bundle2 folder
     * bundle2.loadAsset('imgs/cocos', cc.SpriteFrame, null, (err, spriteFrame) => console.log(err));
     * 
     * @typescript
     * loadAsset(paths: string|string[]|cc.AssetManager.Task, type?: typeof cc.Asset, onProgress?: ((finish: number, total: number, item: cc.AssetManager.RequestItem) => void)|null, onComplete?: ((error: Error, assets: cc.Asset|cc.Asset[]) => void)|null): cc.AssetManager.Task
     */
    loadAsset (paths, type, onProgress, onComplete) {
        var { type, onProgress, onComplete } = parseLoadResArgs(type, onProgress, onComplete);
        return this.load(paths, {requestType: RequestType.PATH, type: type}, onProgress, onComplete);
    },

    /**
     * !#en
     * Preload assets from the bundle folder<br>
     * Everything are like {{#crossLink "assetManager/preloadRes:method"}}{{/crossLink}}
     * 
     * !#zh
     * 预加载 bundle 目录下的资源，其他都和 {{#crossLink "assetManager/preloadRes:method"}}{{/crossLink}} 相同
     *
     * @method preloadAsset
     * @param {String|String[]} paths - Paths of the target asset.The path is relative to bundle folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {RequestItem} onProgress.item - The finished request item.
     * @param {Function} [onComplete] - Callback invoked when the resource loaded.
     * @param {Error} onComplete.error - The error info or null if loaded successfully.
     * @param {RequestItem[]} onComplete.items - The preloaded items.
     * @return {Task} preloading task
     * 
     * @typescript
     * preloadAsset(paths: string|string[], type?: typeof cc.Asset, onProgress?: ((finish: number, total: number, item: cc.AssetManager.RequestItem) => void)|null, onComplete?: ((error: Error, items: cc.AssetManager.RequestItem[]) => void)|null): cc.AssetManager.Task
     */
    preloadAsset (paths, type, onProgress, onComplete) {
        var { type, onProgress, onComplete } = parseLoadResArgs(type, onProgress, onComplete);
        return this.preload(paths, {requestType: RequestType.PATH, type: type}, onProgress, onComplete);
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
     * @param {string|Task} dir - path of the target folder or a preloaded task.
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
     * @returns {Task} loading task
     *
     * @typescript
     * loadDir(dir: string|cc.AssetManager.Task, type?: typeof cc.Asset, onProgress?: ((finish: number, total: number, item: cc.AssetManager.RequestItem) => void)|null, onComplete?: ((error: Error, assets: Asset[]|Asset) => void)|null): cc.AssetManager.Task
     */
    loadDir (dir, type, onProgress, onComplete) {
        var { type, onProgress, onComplete } = parseLoadResArgs(type, onProgress, onComplete);
        return this.load(dir, {requestType: RequestType.DIR, type: type}, onProgress, onComplete);
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
     * @returns {Task} preloading task
     *                                             
     * @typescript
     * preloadDir(dir: string, type?: typeof cc.Asset, onProgress?: ((finish: number, total: number, item: cc.AssetManager.RequestItem) => void)|null, onComplete?: ((error: Error, items: cc.AssetManager.RequestItem[]) => void)|null): cc.AssetManager.Task
     */
    preloadDir (dir, type, onProgress, onComplete) {
        var { type, onProgress, onComplete } = parseLoadResArgs(type, onProgress, onComplete);
        return this.preload(dir, {requestType: RequestType.DIR, type: type}, onProgress, onComplete);
    },

    /**
     * !#en 
     * Loads the scene by its name. Everything are like {{#crossLink "assetManager/loadScene:method"}}{{/crossLink}}, 
     * but can only load scene from this bundle
     * 
     * !#zh 
     * 通过场景名称进行加载场景。所有和 {{#crossLink "assetManager/loadScene:method"}}{{/crossLink}} 一样，但只能加载此包中的场景
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
     * @return {Task} loading task
     * 
     * @example
     * bundle1.loadScene('first', (err, scene) => cc.director.runScene(scene));
     * 
     * @typescript
     * loadScene(sceneName: string, options?: any, onProgress?: ((finish: number, total: number, item: cc.AssetManager.RequestItem) => void)|null, onComplete?: ((error: Error, scene: cc.Scene) => void)|null): cc.AssetManager.Task
     */
    loadScene (sceneName, options, onProgress, onComplete) {
        var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);

        var request = null;
        if (this._preloadedScene.has(sceneName)) {
            request = this._preloadedScene.get(sceneName);
            if (!request.isFinish) {
                cc.warn('preloading task have not finished yet, please wait for preloading');
                return null;
            }
            this._preloadedScene.remove(sceneName);
        }
        else {
            request = {'scene': sceneName};
        }
    
        options.priority = options.priority !== undefined ? options.priority : 1;
        return this.load(request, options, onProgress, function (err, sceneAsset) {
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
     * Everything are like {{#crossLink "assetManager/preloadScene:method"}}{{/crossLink}},
     * but can only preload scene from this bundle
     * 
     * !#zh 
     * 所有一切与 {{#crossLink "assetManager/preloadScene:method"}}{{/crossLink}} 类似，但只能预加载此包中的场景
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
     * @return {Task} The preloading task
     * 
     * @example
     * bundle1.preloadScene('first', (err) => bundle1.loadScene('first'));
     * 
     * @typescript
     * preloadScene(sceneName: string, options?: any, onProgress?: ((finish: number, total: number, item: cc.AssetManager.RequestItem) => void)|null, onComplete?: ((error: Error) => void)|null): cc.AssetManager.Task
     */
    preloadScene (sceneName, options, onProgress, onComplete) {
        var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);

        var self = this;
        var task = this.preload({'scene': sceneName}, options, onProgress, function (err) {
            if (err) {
                self._preloadedScene.remove(sceneName);
                cc.errorID(1210, sceneName, err.message);
            }
            onComplete && onComplete(err);
        });
        if (!task.isFinish) this._preloadedScene.add(sceneName, task);   
        return task;
    },

    /**
     * !#en
     * Everything are like {{#crossLink "assetManager/getRes:method"}}{{/crossLink}}
     * but can only get asset from this bundle
     * 
     * !#zh
     * 所有一切与 {{#crossLink "assetManager/getRes:method"}}{{/crossLink}} 类似，但只能
     * 获取到此包中的资源
     * 
     * @method getAsset
     * @param {String} path - The path of asset
     * @param {Function} [type] - Only asset of type will be returned if this argument is supplied.
     * @returns {*}
     * 
     * @typescript
     * getAsset(path: string, type?: typeof cc.Asset): any
     */
    getAsset (path, type) {
        var info = this._config.getInfoWithPath(path, type);
        return assets.get(info && info.uuid);
    },

    /**
     * !#en
     * Everything are like {{#crossLink "assetManager/releaseRes:method"}}{{/crossLink}}
     * but can only release asset from this bundle
     * 
     * !#zh
     * 所有一切与 {{#crossLink "assetManager/releaseRes:method"}}{{/crossLink}} 类似，但只能
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
     * Release all assets from this bundle. Refer to {{#crossLink "assetManager/releaseAll:method"}}{{/crossLink}} for detailed informations.
     * 
     * !#zh 
     * 释放此包中的所有资源。详细信息请参考 {{#crossLink "assetManager/release:method"}}{{/crossLink}}
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
            if (self._config.getAssetInfo(asset.uuid)) {
                finalizer.release(asset, force);
            }
        });
    },

    /**
     * !#en 
     * Destroy this bundle. NOTE: asset will not be released automatically, you need to call {{#crossLink "Bundle/releaseAll:method"}}{{/crossLink}} manually before destroy it
     * 
     * !#zh 
     * 销毁此包, 注意：资源不会自动释放, 你需要在摧毁之前手动调用 {{#crossLink "Bundle/releaseAll:method"}}{{/crossLink}} 进行释放
     *
     * @method destroy
     * 
     * @typescript
     * destroy(): void
     */
    destroy () {
        this._config.destroy();
        this._preloadedScene.destroy();
        bundles.remove(this._config.name);
    }

};

module.exports = Bundle;