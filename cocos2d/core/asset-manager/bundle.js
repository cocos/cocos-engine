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
const releaseManager = require('./releaseManager');
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
     * getDirWithPath (path: string, type: typeof cc.Asset, out: Array<Record<string, any>>): Array<Record<string, any>>
     * getDirWithPath (path: string, type: typeof cc.Asset): Array<Record<string, any>>
     * getDirWithPath (path: string): Array<Record<string, any>>
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
    getSceneInfo (name) {
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
     * Load the asset within this bundle by the path which is relative to bundle's path
     * 
     * !#zh
     * 通过相对路径加载分包中的资源。路径是相对分包文件夹路径的相对路径
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
     * // load the texture (${project}/assets/resources/textures/background.jpg) from resources
     * cc.resources.load('textures/background', cc.Texture2D, (err, texture) => console.log(err));
     * 
     * // load the audio (${project}/assets/resources/music/hit.mp3) from resources
     * cc.resources.load('music/hit', cc.AudioClip, (err, audio) => console.log(err));
     * 
     * // load the prefab (${project}/assets/bundle1/misc/character/cocos) from bundle1 folder
     * bundle1.load('misc/character/cocos', cc.Prefab, (err, prefab) => console.log(err));
     *
     * // load the sprite frame (${project}/assets/some/xxx/bundle2/imgs/cocos.png) from bundle2 folder
     * bundle2.load('imgs/cocos', cc.SpriteFrame, null, (err, spriteFrame) => console.log(err));
     * 
     * @typescript
     * load<T extends cc.Asset>(paths: string, type: { prototype: T } onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, assets: T) => void): void
     * load<T extends cc.Asset>(paths: string[], type: { prototype: T }, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, assets: Array<T>) => void): void
     * load<T extends cc.Asset>(paths: string, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, assets: T) => void): void
     * load<T extends cc.Asset>(paths: string[], onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, assets: Array<T>) => void): void
     * load<T extends cc.Asset>(paths: string, type: { prototype: T }, onComplete?: (error: Error, assets: T) => void): void
     * load<T extends cc.Asset>(paths: string[], type: { prototype: T }, onComplete?: (error: Error, assets: Array<T>) => void): void
     * load<T extends cc.Asset>(paths: string, onComplete?: (error: Error, assets: T) => void): void
     * load<T extends cc.Asset>(paths: string[], onComplete?: (error: Error, assets: Array<T>) => void): void
     */
    load (paths, type, onProgress, onComplete) {
        var { type, onProgress, onComplete } = parseLoadResArgs(type, onProgress, onComplete);
        cc.assetManager.loadAny(paths, { __requestType__: RequestType.PATH, type: type, bundle: this.name, __outputAsArray__: Array.isArray(paths) }, onProgress, onComplete);
    },

    /**
     * !#en
     * Preload the asset within this bundle by the path which is relative to bundle's path. 
     * After calling this method, you still need to finish loading by calling `Bundle.load`.
     * It will be totally fine to call `Bundle.load` at any time even if the preloading is not
     * yet finished
     * 
     * !#zh
     * 通过相对路径预加载分包中的资源。路径是相对分包文件夹路径的相对路径。调用完后，你仍然需要通过 `Bundle.load` 来完成加载。
     * 就算预加载还没完成，你也可以直接调用 `Bundle.load`。
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
     * @example
     * // preload the texture (${project}/assets/resources/textures/background.jpg) from resources
     * cc.resources.preload('textures/background', cc.Texture2D);
     * 
     * // preload the audio (${project}/assets/resources/music/hit.mp3) from resources
     * cc.resources.preload('music/hit', cc.AudioClip);
     * // wait for while
     * cc.resources.load('music/hit', cc.AudioClip, (err, audioClip) => {});
     * 
     * * // preload the prefab (${project}/assets/bundle1/misc/character/cocos) from bundle1 folder
     * bundle1.preload('misc/character/cocos', cc.Prefab);
     *
     * // load the sprite frame of (${project}/assets/bundle2/imgs/cocos.png) from bundle2 folder
     * bundle2.preload('imgs/cocos', cc.SpriteFrame);
     * // wait for while
     * bundle2.load('imgs/cocos', cc.SpriteFrame, (err, spriteFrame) => {});
     * 
     * @typescript
     * preload(paths: string|string[], type: typeof cc.Asset, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, items: RequestItem[]) => void): void
     * preload(paths: string|string[], onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, items: RequestItem[]) => void): void
     * preload(paths: string|string[], type: typeof cc.Asset, onComplete: (error: Error, items: RequestItem[]) => void): void
     * preload(paths: string|string[], type: typeof cc.Asset): void
     * preload(paths: string|string[], onComplete: (error: Error, items: RequestItem[]) => void): void
     * preload(paths: string|string[]): void
     */
    preload (paths, type, onProgress, onComplete) {
        var { type, onProgress, onComplete } = parseLoadResArgs(type, onProgress, onComplete);
        cc.assetManager.preloadAny(paths, { __requestType__: RequestType.PATH, type: type, bundle: this.name }, onProgress, onComplete);
    },

    /**
     * !#en
     * Load all assets under a folder inside the bundle folder.<br>
     * <br>
     * Note: All asset paths in Creator use forward slashes, paths using backslashes will not work.
     * 
     * !#zh
     * 加载目标文件夹中的所有资源, 注意：路径中只能使用斜杠，反斜杠将停止工作
     *
     * @method loadDir
     * @param {string} dir - path of the target folder.The path is relative to the bundle folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {Object} onProgress.item - The latest request item
     * @param {Function} [onComplete] - A callback which is called when all assets have been loaded, or an error occurs.
     * @param {Error} onComplete.error - If one of the asset failed, the complete callback is immediately called with the error. If all assets are loaded successfully, error will be null.
     * @param {Asset[]|Asset} onComplete.assets - An array of all loaded assets.
     * 
     * @example
     * // load all audios (resources/audios/) 
     * cc.resources.loadDir('audios', cc.AudioClip, (err, audios) => {});
     *
     * // load all textures in "resources/imgs/"
     * cc.resources.loadDir('imgs', cc.Texture2D, null, function (err, textures) {
     *     var texture1 = textures[0];
     *     var texture2 = textures[1];
     * });
     * 
     * // load all prefabs (${project}/assets/bundle1/misc/characters/) from bundle1 folder
     * bundle1.loadDir('misc/characters', cc.Prefab, (err, prefabs) => console.log(err));
     *
     * // load all sprite frame (${project}/assets/some/xxx/bundle2/skills/) from bundle2 folder
     * bundle2.loadDir('skills', cc.SpriteFrame, null, (err, spriteFrames) => console.log(err));
     *
     * @typescript
     * loadDir<T extends cc.Asset>(dir: string, type: { prototype: T }, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, assets: Array<T>) => void): void
     * loadDir<T extends cc.Asset>(dir: string, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, assets: Array<T>) => void): void
     * loadDir<T extends cc.Asset>(dir: string, type: { prototype: T }, onComplete: (error: Error, assets: Array<T>) => void): void
     * loadDir<T extends cc.Asset>(dir: string, type: { prototype: T }): void
     * loadDir<T extends cc.Asset>(dir: string, onComplete: (error: Error, assets: Array<T>) => void): void
     * loadDir<T extends cc.Asset>(dir: string): void
     */
    loadDir (dir, type, onProgress, onComplete) {
        var { type, onProgress, onComplete } = parseLoadResArgs(type, onProgress, onComplete);
        cc.assetManager.loadAny(dir, { __requestType__: RequestType.DIR, type: type, bundle: this.name, __outputAsArray__: true }, onProgress, onComplete);
    },

    /**
     * !#en
     * Preload all assets under a folder inside the bundle folder.<br> After calling this method, you still need to finish loading by calling `Bundle.loadDir`.
     * It will be totally fine to call `Bundle.loadDir` at any time even if the preloading is not yet finished
     * 
     * !#zh
     * 预加载目标文件夹中的所有资源。调用完后，你仍然需要通过 `Bundle.loadDir` 来完成加载。
     * 就算预加载还没完成，你也可以直接调用 `Bundle.loadDir`。
     *
     * @method preloadDir
     * @param {string} dir - path of the target folder.The path is relative to the bundle folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be preloaded if this argument is supplied.
     * @param {Function} [onProgress] - Callback invoked when progression change.
     * @param {Number} onProgress.finish - The number of the items that are already completed.
     * @param {Number} onProgress.total - The total number of the items.
     * @param {Object} onProgress.item - The latest request item
     * @param {Function} [onComplete] - A callback which is called when all assets have been loaded, or an error occurs.
     * @param {Error} onComplete.error - If one of the asset failed, the complete callback is immediately called with the error. If all assets are preloaded successfully, error will be null.
     * @param {RequestItem[]} onComplete.items - An array of all preloaded items.
     * 
     * @example
     * // preload all audios (resources/audios/) 
     * cc.resources.preloadDir('audios', cc.AudioClip);
     *
     * // preload all textures in "resources/imgs/"
     * cc.resources.preloadDir('imgs', cc.Texture2D);
     * // wait for while
     * cc.resources.loadDir('imgs', cc.Texture2D, (err, textures) => {});
     * 
     * // preload all prefabs (${project}/assets/bundle1/misc/characters/) from bundle1 folder
     * bundle1.preloadDir('misc/characters', cc.Prefab);
     *
     * // preload all sprite frame (${project}/assets/some/xxx/bundle2/skills/) from bundle2 folder
     * bundle2.preloadDir('skills', cc.SpriteFrame);
     * // wait for while
     * bundle2.loadDir('skills', cc.SpriteFrame, (err, spriteFrames) => {});
     *                                             
     * @typescript
     * preloadDir(dir: string, type: typeof cc.Asset, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, items: RequestItem[]) => void): void
     * preloadDir(dir: string, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, items: RequestItem[]) => void): void
     * preloadDir(dir: string, type: typeof cc.Asset, onComplete: (error: Error, items: RequestItem[]) => void): void
     * preloadDir(dir: string, type: typeof cc.Asset): void
     * preloadDir(dir: string, onComplete: (error: Error, items: RequestItem[]) => void): void
     * preloadDir(dir: string): void
     */
    preloadDir (dir, type, onProgress, onComplete) {
        var { type, onProgress, onComplete } = parseLoadResArgs(type, onProgress, onComplete);
        cc.assetManager.preloadAny(dir, { __requestType__: RequestType.DIR, type: type, bundle: this.name }, onProgress, onComplete);
    },

    /**
     * !#en 
     * Loads the scene within this bundle by its name.  
     * 
     * !#zh 
     * 通过场景名称加载分包中的场景。
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
     * @param {SceneAsset} onComplete.sceneAsset - The scene asset
     * 
     * @example
     * bundle1.loadScene('first', (err, sceneAsset) => cc.director.runScene(sceneAsset));
     * 
     * @typescript
     * loadScene(sceneName: string, options: Record<string, any>, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, sceneAsset: cc.SceneAsset) => void): void
     * loadScene(sceneName: string, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error, sceneAsset: cc.SceneAsset) => void): void
     * loadScene(sceneName: string, options: Record<string, any>, onComplete: (error: Error, sceneAsset: cc.SceneAsset) => void): void
     * loadScene(sceneName: string, onComplete: (error: Error, sceneAsset: cc.SceneAsset) => void): void
     * loadScene(sceneName: string, options: Record<string, any>): void
     * loadScene(sceneName: string): void
     */
    loadScene (sceneName, options, onProgress, onComplete) {
        var { options, onProgress, onComplete } = parseParameters(options, onProgress, onComplete);
    
        options.preset = options.preset || 'scene';
        options.bundle = this.name;
        cc.assetManager.loadAny({ 'scene': sceneName }, options, onProgress, function (err, sceneAsset) {
            if (err) {
                cc.error(err.message, err.stack);
                onComplete && onComplete(err);
            }
            else if (sceneAsset instanceof cc.SceneAsset) {
                var scene = sceneAsset.scene;
                scene._id = sceneAsset._uuid;
                scene._name = sceneAsset._name;
                onComplete && onComplete(null, sceneAsset);
            }
            else {
                onComplete && onComplete(new Error('The asset ' + sceneAsset._uuid + ' is not a scene'));
            }
        });
    },

    /**
     * !#en
     * Preloads the scene within this bundle by its name. After calling this method, you still need to finish loading by calling `Bundle.loadScene` or `cc.director.loadScene`.
     * It will be totally fine to call `Bundle.loadDir` at any time even if the preloading is not yet finished
     * 
     * !#zh 
     * 通过场景名称预加载分包中的场景.调用完后，你仍然需要通过 `Bundle.loadScene` 或 `cc.director.loadScene` 来完成加载。
     * 就算预加载还没完成，你也可以直接调用 `Bundle.loadScene` 或 `cc.director.loadScene`。
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
     * bundle1.preloadScene('first');
     * // wait for a while
     * bundle1.loadScene('first', (err, scene) => cc.director.runScene(scene));
     * 
     * @typescript
     * preloadScene(sceneName: string, options: Record<string, any>, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error) => void): void
     * preloadScene(sceneName: string, onProgress: (finish: number, total: number, item: RequestItem) => void, onComplete: (error: Error) => void): void
     * preloadScene(sceneName: string, options: Record<string, any>, onComplete: (error: Error) => void): void
     * preloadScene(sceneName: string, onComplete: (error: Error) => void): void
     * preloadScene(sceneName: string, options: Record<string, any>): void
     * preloadScene(sceneName: string): void
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
     * Get asset within this bundle by path and type. <br>
     * After you load asset with {{#crossLink "Bundle/load:method"}}{{/crossLink}} or {{#crossLink "Bundle/loadDir:method"}}{{/crossLink}},
     * you can acquire them by passing the path to this API.
     * 
     * !#zh
     * 通过路径与类型获取资源。在你使用 {{#crossLink "Bundle/load:method"}}{{/crossLink}} 或者 {{#crossLink "Bundle/loadDir:method"}}{{/crossLink}} 之后，
     * 你能通过传路径通过这个 API 获取到这些资源。
     * 
     * @method get
     * @param {String} path - The path of asset
     * @param {Function} [type] - Only asset of type will be returned if this argument is supplied.
     * @returns {Asset} 
     * 
     * @example
     * bundle1.get('music/hit', cc.AudioClip);
     * 
     * @typescript
     * get<T extends cc.Asset> (path: string, type?: { prototype: T }): T
     */
    get (path, type) {
        var info = this.getInfoWithPath(path, type);
        return assets.get(info && info.uuid);
    },

    /**
     * !#en 
     * Release the asset loaded by {{#crossLink "Bundle/load:method"}}{{/crossLink}} or {{#crossLink "Bundle/loadDir:method"}}{{/crossLink}} and it's dependencies. 
     * Refer to {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} for detailed informations.
     * 
     * !#zh 
     * 释放通过 {{#crossLink "Bundle/load:method"}}{{/crossLink}} 或者 {{#crossLink "Bundle/loadDir:method"}}{{/crossLink}} 加载的资源。详细信息请参考 {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}}
     * 
     * @method release
     * @param {String} path - The path of asset
     * @param {Function} [type] - Only asset of type will be released if this argument is supplied.
     * 
     * @example
     * // release a texture which is no longer need
     * bundle1.release('misc/character/cocos');
     *
     * @typescript
     * release(path: string, type: typeof cc.Asset): void
     * release(path: string): void
     */
    release (path, type) {
        releaseManager.tryRelease(this.get(path, type), true);
    },

    /**
     * !#en 
     * Release all unused assets within this bundle. Refer to {{#crossLink "AssetManager/releaseAll:method"}}{{/crossLink}} for detailed informations.
     * 
     * !#zh 
     * 释放此包中的所有没有用到的资源。详细信息请参考 {{#crossLink "AssetManager/releaseAll:method"}}{{/crossLink}}
     *
     * @method releaseUnusedAssets
     * @private
     * 
     * @example
     * // release all unused asset within bundle1
     * bundle1.releaseUnusedAssets();
     * 
     * @typescript
     * releaseUnusedAssets(): void
     */
    releaseUnusedAssets () {
        var self = this;
        assets.forEach(function (asset) {
            let info = self.getAssetInfo(asset._uuid);
            if (info && !info.redirect) {
                releaseManager.tryRelease(asset);
            }
        });
    },

    /**
     * !#en 
     * Release all assets within this bundle. Refer to {{#crossLink "AssetManager/releaseAll:method"}}{{/crossLink}} for detailed informations.
     * 
     * !#zh 
     * 释放此包中的所有资源。详细信息请参考 {{#crossLink "AssetManager/releaseAll:method"}}{{/crossLink}}
     *
     * @method releaseAll
     * 
     * @example
     * // release all asset within bundle1
     * bundle1.releaseAll();
     * 
     * @typescript
     * releaseAll(): void
     */
    releaseAll () {
        var self = this;
        assets.forEach(function (asset) {
            let info = self.getAssetInfo(asset._uuid);
            if (info && !info.redirect) {
                releaseManager.tryRelease(asset, true);
            }
        });
    },

    _destroy () {
        this._config.destroy();
    }

};

module.exports = Bundle;