/* eslint-disable max-len */
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

import { Asset } from '../assets/asset';
import { SceneAsset } from '../assets/scene-asset';
import { error, errorID, cclegacy } from '../../core';
import Config, { IAddressableInfo, IAssetInfo, IConfigOption, ISceneInfo } from './config';
import releaseManager from './release-manager';
import RequestItem from './request-item';
import { assets, bundles, RequestType } from './shared';
import { parseLoadResArgs, parseParameters } from './utilities';

/**
 * @en
 * A bundle contains an amount of assets(includes scene), you can load, preload, release asset which is in this bundle.
 *
 * @zh
 * 一个包含一定数量资源（包括场景）的包，你可以加载，预加载，释放此包内的资源。
 *
 */
export default class Bundle {
    private _config: Config = new Config();

    /**
     * for internal use.
     * @engineInternal
     */
    public get config (): Config {
        return this._config;
    }

    /**
     * @en
     * The name of this bundle.
     *
     * @zh
     * 此 bundle 的名称。
     *
     */
    public get name (): string {
        return this._config.name;
    }

    /**
     * @en
     * The dependent bundles of this bundle.
     *
     * @zh
     * 此 bundle 的依赖包。
     *
     */
    public get deps (): string[] {
        return this._config.deps!;
    }

    /**
     * @en
     * The root path of this bundle, such like 'http://example.com/bundle1'.
     *
     * @zh
     * 此 bundle 的根路径, 例如 'http://example.com/bundle1'。
     *
     */
    public get base (): string {
        return this._config.base;
    }

    /**
     * @en
     * Get asset's info using path, only valid when asset is in bundle folder.
     *
     * @zh
     * 使用 path 获取资源的配置信息。
     *
     * @param path @en The relative path of asset, such as 'images/a'. @zh 资源的相对路径，例如 `images/a`。
     * @param type @en The constructor of asset, such as  `Texture2D`. @zh 资源的类型，例如 [[Texture2D]]。
     * @returns The asset info
     *
     * @example
     * var info = bundle.getInfoWithPath('image/a', Texture2D);
     *
     */
    public getInfoWithPath (path: string, type?: Constructor<Asset> | null): IAddressableInfo | null {
        return this._config.getInfoWithPath(path, type);
    }

    /**
     * @en
     * Get all asset's info within specific folder
     *
     * @zh
     * 获取在某个指定文件夹下的所有资源信息
     *
     * @param path - The relative path of folder, such as 'images'
     * @param type - The constructor should be used to filter paths
     * @param out - The output array
     * @returns Infos
     *
     * @example
     * var infos = [];
     * bundle.getDirWithPath('images', Texture2D, infos);
     */
    public getDirWithPath (path: string, type?: Constructor<Asset> | null, out?: IAddressableInfo[]): IAddressableInfo[] {
        return this._config.getDirWithPath(path, type, out);
    }

    /**
     * @en
     * Get asset's info with uuid
     *
     * @zh
     * 通过 uuid 获取资源信息
     *
     * @method getAssetInfo
     * @param  uuid - The asset's uuid
     * @returns info
     *
     * @example
     * var info = bundle.getAssetInfo('fcmR3XADNLgJ1ByKhqcC5Z');
     *
     */
    public getAssetInfo (uuid: string): IAssetInfo | null {
        return this._config.getAssetInfo(uuid);
    }

    /**
     * @en
     * Get scene'info with name
     *
     * @zh
     * 通过场景名获取场景信息
     *
     * @method getSceneInfo
     * @param name - The name of scene
     * @return info
     *
     * @example
     * var info = bundle.getSceneInfo('first.fire');
     *
     */
    public getSceneInfo (name: string): ISceneInfo | null {
        return this._config.getSceneInfo(name);
    }

    /**
     * @en
     * Initialize this bundle with options
     *
     * @zh
     * 初始化此 bundle
     *
     * @param options
     * @deprecate Since v3.7, this is an internal engine interface and you should not call this interface under any circumstances.
     *
     */
    public init (options: IConfigOption) {
        this._config.init(options);
        bundles.add(options.name, this);
    }

    /**
     * @en
     * Load the asset within this bundle by the path which is relative to bundle's path
     *
     * @zh
     * 通过相对路径加载分包中的资源。路径是相对分包文件夹路径的相对路径
     *
     * @param paths - Paths of the target assets.The path is relative to the bundle's folder, extensions must be omitted.
     * @param type - Only asset of type will be loaded if this argument is supplied.
     * @param onProgress - Callback invoked when progression change.
     * @param onProgress.finish - The number of the items that are already completed.
     * @param onProgress.total - The total number of the items.
     * @param onProgress.item - The finished request item.
     * @param onComplete - Callback invoked when all assets loaded.
     * @param onComplete.error - The error info or null if loaded successfully.
     * @param onComplete.assets - The loaded assets.
     *
     * @example
     * // load the texture (${project}/assets/resources/textures/background.jpg) from resources
     * resources.load('textures/background', Texture2D, (err, texture) => console.log(err));
     *
     * // load the audio (${project}/assets/resources/music/hit.mp3) from resources
     * resources.load('music/hit', AudioClip, (err, audio) => console.log(err));
     *
     * // load the prefab (${project}/assets/bundle1/misc/character/cocos) from bundle1 folder
     * bundle1.load('misc/character/cocos', Prefab, (err, prefab) => console.log(err));
     *
     * // load the sprite frame (${project}/assets/some/xxx/bundle2/imgs/cocos.png) from bundle2 folder
     * bundle2.load('imgs/cocos', SpriteFrame, null, (err, spriteFrame) => console.log(err));
     *
     */
    public load<T extends Asset> (
        paths: string,
        type: Constructor<T> | null,
        onProgress: ((finished: number, total: number, item: RequestItem) => void) | null,
        onComplete: ((err: Error | null, data: T) => void) | null): void;
    public load<T extends Asset> (
        paths: string[], type: Constructor<T> | null,
        onProgress: ((finished: number, total: number, item: RequestItem) => void) | null,
        onComplete: ((err: Error | null, data: T[]) => void) | null): void;
    public load<T extends Asset> (paths: string, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: T) => void) | null): void;
    public load<T extends Asset> (paths: string[], onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: T[]) => void) | null): void;
    public load<T extends Asset> (paths: string, onComplete?: ((err: Error | null, data: T) => void) | null): void;
    public load<T extends Asset> (paths: string[], onComplete?: ((err: Error | null, data: T[]) => void) | null): void;
    public load<T extends Asset> (paths: string, type: Constructor<T> | null, onComplete?: ((err: Error | null, data: T) => void) | null): void;
    public load<T extends Asset> (paths: string[], type: Constructor<T> | null, onComplete?: ((err: Error | null, data: T[]) => void) | null): void;
    public load<T extends Asset> (
        paths: string|string[],
        type?: Constructor<T> | ((finished: number, total: number, item: RequestItem) => void) | ((err: Error | null, data: T|T[]) => void) | null,
        onProgress?: ((finished: number, total: number, item: RequestItem) => void) | ((err: Error | null, data: T|T[]) => void) | null,
        onComplete?: ((err: Error | null, data: T|T[]) => void) | null,
    ) {
        const { type: _type, onProgress: onProg, onComplete: onComp } = parseLoadResArgs(type, onProgress, onComplete);
        const options = { __requestType__: RequestType.PATH, type: _type, bundle: this.name, __outputAsArray__: Array.isArray(paths) };
        cclegacy.assetManager.loadAny(paths, options, onProg, onComp);
    }

    /**
     * @en
     * Preload the asset within this bundle by the path which is relative to bundle's path.
     * After calling this method, you still need to finish loading by calling `Bundle.load`.
     * It will be totally fine to call `Bundle.load` at any time even if the preloading is not
     * yet finished
     *
     * @zh
     * 通过相对路径预加载分包中的资源。路径是相对分包文件夹路径的相对路径。调用完后，你仍然需要通过 `Bundle.load` 来完成加载。
     * 就算预加载还没完成，你也可以直接调用 `Bundle.load`。
     *
     * @param paths - Paths of the target asset.The path is relative to bundle folder, extensions must be omitted.
     * @param type - Only asset of type will be loaded if this argument is supplied.
     * @param onProgress - Callback invoked when progression change.
     * @param onProgress.finish - The number of the items that are already completed.
     * @param onProgress.total - The total number of the items.
     * @param onProgress.item - The finished request item.
     * @param onComplete - Callback invoked when the resource loaded.
     * @param onComplete.error - The error info or null if loaded successfully.
     * @param onComplete.items - The preloaded items.
     *
     * @example
     * // preload the texture (${project}/assets/resources/textures/background.jpg) from resources
     * resources.preload('textures/background', Texture2D);
     *
     * // preload the audio (${project}/assets/resources/music/hit.mp3) from resources
     * resources.preload('music/hit', AudioClip);
     * // wait for while
     * resources.load('music/hit', AudioClip, (err, audioClip) => {});
     *
     * * // preload the prefab (${project}/assets/bundle1/misc/character/cocos) from bundle1 folder
     * bundle1.preload('misc/character/cocos', Prefab);
     *
     * // load the sprite frame of (${project}/assets/bundle2/imgs/cocos.png) from bundle2 folder
     * bundle2.preload('imgs/cocos', SpriteFrame);
     * // wait for while
     * bundle2.load('imgs/cocos', SpriteFrame, (err, spriteFrame) => {});
     *
     */
    public preload (paths: string|string[], type: Constructor<Asset>|null, onProgress: ((finished: number, total: number, item: RequestItem) => void)|null, onComplete: ((err: Error | null, data: RequestItem[]) => void)|null): void;
    public preload (paths: string|string[], onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: RequestItem[]) => void) | null): void;
    public preload (paths: string|string[], onComplete?: ((err: Error | null, data: RequestItem[]) => void) | null): void;
    public preload (paths: string|string[], type: Constructor<Asset> | null, onComplete?: ((err: Error | null, data: RequestItem[]) => void) | null): void;
    public preload (
        paths: string|string[],
        type?: Constructor<Asset> | ((finished: number, total: number, item: RequestItem) => void) | ((err: Error | null, data: RequestItem[]) => void) | null,
        onProgress?: ((finished: number, total: number, item: RequestItem) => void) | ((err: Error | null, data: RequestItem[]) => void) | null,
        onComplete?: ((err: Error | null, data: RequestItem[]) => void) | null,
    ) {
        const { type: _type, onProgress: onProg, onComplete: onComp } = parseLoadResArgs(type, onProgress, onComplete);
        cclegacy.assetManager.preloadAny(paths, { __requestType__: RequestType.PATH, type: _type, bundle: this.name }, onProg, onComp);
    }

    /**
     * @en
     * Load all assets under a folder inside the bundle folder.<br>
     * <br>
     * Note: All asset paths in Creator use forward slashes, paths using backslashes will not work.
     *
     * @zh
     * 加载目标文件夹中的所有资源, 注意：路径中只能使用斜杠，反斜杠将停止工作
     *
     * @param dir - path of the target folder.The path is relative to the bundle folder, extensions must be omitted.
     * @param type - Only asset of type will be loaded if this argument is supplied.
     * @param onProgress - Callback invoked when progression change.
     * @param onProgress.finish - The number of the items that are already completed.
     * @param onProgress.total - The total number of the items.
     * @param onProgress.item - The latest request item
     * @param onComplete - A callback which is called when all assets have been loaded, or an error occurs.
     * @param onComplete.error - If one of the asset failed, the complete callback is immediately called with the error.
     *                           If all assets are loaded successfully, error will be null.
     * @param onComplete.assets - An array of all loaded assets.
     *
     * @example
     * // load all audios (resources/audios/)
     * resources.loadDir('audios', AudioClip, (err, audios) => {});
     *
     * // load all textures in "resources/imgs/"
     * resources.loadDir('imgs', Texture2D, null, function (err, textures) {
     *     var texture1 = textures[0];
     *     var texture2 = textures[1];
     * });
     *
     * // load all prefabs (${project}/assets/bundle1/misc/characters/) from bundle1 folder
     * bundle1.loadDir('misc/characters', Prefab, (err, prefabs) => console.log(err));
     *
     * // load all sprite frame (${project}/assets/some/xxx/bundle2/skills/) from bundle2 folder
     * bundle2.loadDir('skills', SpriteFrame, null, (err, spriteFrames) => console.log(err));
     *
     */
    public loadDir<T extends Asset> (dir: string, type: Constructor<T> | null, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: T[]) => void) | null): void;
    public loadDir<T extends Asset> (dir: string, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: T[]) => void) | null): void;
    public loadDir<T extends Asset> (dir: string, onComplete?: ((err: Error | null, data: T[]) => void) | null): void;
    public loadDir<T extends Asset> (dir: string, type: Constructor<T> | null, onComplete?: ((err: Error | null, data: T[]) => void) | null): void;
    public loadDir<T extends Asset> (
        dir: string,
        type?: Constructor<T> | ((finished: number, total: number, item: RequestItem) => void) | ((err: Error | null, data: T[]) => void) | null,
        onProgress?: ((finished: number, total: number, item: RequestItem) => void) | ((err: Error | null, data: T[]) => void) | null,
        onComplete?: ((err: Error | null, data: T[]) => void) | null,
    ) {
        const { type: _type, onProgress: onProg, onComplete: onComp } = parseLoadResArgs(type, onProgress, onComplete);
        cclegacy.assetManager.loadAny(dir, { __requestType__: RequestType.DIR, type: _type, bundle: this.name, __outputAsArray__: true }, onProg, onComp);
    }

    /**
     * @en
     * Preload all assets under a folder inside the bundle folder.<br> After calling this method, you still need to
     * finish loading by calling `Bundle.loadDir`.
     * It will be totally fine to call `Bundle.loadDir` at any time even if the preloading is not yet finished
     *
     * @zh
     * 预加载目标文件夹中的所有资源。调用完后，你仍然需要通过 `Bundle.loadDir` 来完成加载。
     * 就算预加载还没完成，你也可以直接调用 `Bundle.loadDir`。
     *
     * @param dir - path of the target folder.The path is relative to the bundle folder, extensions must be omitted.
     * @param type - Only asset of type will be preloaded if this argument is supplied.
     * @param onProgress - Callback invoked when progression change.
     * @param onProgress.finish - The number of the items that are already completed.
     * @param onProgress.total - The total number of the items.
     * @param onProgress.item - The latest request item
     * @param onComplete - A callback which is called when all assets have been loaded, or an error occurs.
     * @param onComplete.error - If one of the asset failed, the complete callback is immediately called with the error.
     *                                   If all assets are preloaded successfully, error will be null.
     * @param onComplete.items - An array of all preloaded items.
     *
     * @example
     * // preload all audios (resources/audios/)
     * resources.preloadDir('audios', AudioClip);
     *
     * // preload all textures in "resources/imgs/"
     * resources.preloadDir('imgs', Texture2D);
     * // wait for while
     * resources.loadDir('imgs', Texture2D, (err, textures) => {});
     *
     * // preload all prefabs (${project}/assets/bundle1/misc/characters/) from bundle1 folder
     * bundle1.preloadDir('misc/characters', Prefab);
     *
     * // preload all sprite frame (${project}/assets/some/xxx/bundle2/skills/) from bundle2 folder
     * bundle2.preloadDir('skills', SpriteFrame);
     * // wait for while
     * bundle2.loadDir('skills', SpriteFrame, (err, spriteFrames) => {});
     */
    public preloadDir (dir: string, type: Constructor<Asset> | null, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: RequestItem[]) => void) | null): void;
    public preloadDir (dir: string, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: RequestItem[]) => void) | null): void;
    public preloadDir (dir: string, onComplete?: ((err: Error | null, data: RequestItem[]) => void) | null): void;
    public preloadDir (dir: string, type: Constructor<Asset> | null, onComplete?: ((err: Error | null, data: RequestItem[]) => void) | null): void;
    public preloadDir (
        dir: string,
        type?: Constructor<Asset> | ((finished: number, total: number, item: RequestItem) => void) | ((err: Error | null, data: RequestItem[]) => void)| null,
        onProgress?: ((finished: number, total: number, item: RequestItem) => void) | ((err: Error | null, data: RequestItem[]) => void)| null,
        onComplete?: ((err: Error | null, data: RequestItem[]) => void)| null,
    ) {
        const { type: _type, onProgress: onProg, onComplete: onComp } = parseLoadResArgs(type, onProgress, onComplete);
        cclegacy.assetManager.preloadAny(dir, { __requestType__: RequestType.DIR, type: _type, bundle: this.name }, onProg, onComp);
    }

    /**
     * @en
     * Loads the scene asset within this bundle by its name.
     *
     * @zh
     * 通过场景名称加载分包中的场景资源。
     *
     * @param sceneName - The name of the scene to load.
     * @param options - Some optional parameters
     * @param onProgress - Callback invoked when progression change.
     * @param onProgress.finish - The number of the items that are already completed.
     * @param onProgress.total - The total number of the items.
     * @param onProgress.item - The latest request item
     * @param onComplete - callback, will be called after scene launched.
     * @param onComplete.err - The occurred error, null indicetes success
     * @param onComplete.sceneAsset - The scene asset
     *
     * @example
     * bundle1.loadScene('first', (err, sceneAsset) => director.runScene(sceneAsset));
     *
     */
    public loadScene (sceneName: string, options: Record<string, any> | null, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: SceneAsset) => void) | null): void;
    public loadScene (sceneName: string, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err: Error | null, data: SceneAsset) => void) | null): void;
    public loadScene (sceneName: string, options: Record<string, any> | null, onComplete?: ((err: Error | null, data: SceneAsset) => void) | null): void;
    public loadScene (sceneName: string, onComplete?: ((err: Error | null, data: SceneAsset) => void) | null): void;
    public loadScene (
        sceneName: string,
        options?: Record<string, any> | ((finished: number, total: number, item: RequestItem) => void) | ((err: Error | null, data: SceneAsset) => void) | null,
        onProgress?: ((finished: number, total: number, item: RequestItem) => void) | ((err: Error | null, data: SceneAsset) => void) | null,
        onComplete?: ((err: Error | null, data: SceneAsset) => void) | null,
    ) {
        const { options: opts, onProgress: onProg, onComplete: onComp } = parseParameters<((err: Error | null, data: SceneAsset) => void)>(options, onProgress, onComplete);

        opts.preset = opts.preset || 'scene';
        opts.bundle = this.name;
        cclegacy.assetManager.loadAny({ scene: sceneName }, opts, onProg, (err, sceneAsset) => {
            if (err) {
                error(err.message, err.stack);
            } else if (sceneAsset.scene) {
                const scene = sceneAsset.scene;
                scene._id = sceneAsset._uuid;
                scene.name = sceneAsset.name;
            } else {
                err = new Error(`The asset ${sceneAsset._uuid} is not a scene`);
            }
            if (onComp) { onComp(err, sceneAsset); }
        });
    }

    /**
     * @en
     * Preload the scene asset within this bundle by its name. After calling this method, you still need to finish loading
     * by calling `Bundle.loadScene` or `director.loadScene`.It will be totally fine to call `Bundle.loadDir` at any
     * time even if the preloading is not yet finished
     *
     * @zh
     * 通过场景名称预加载分包中的场景资源.调用完后，你仍然需要通过 `Bundle.loadScene` 或 `director.loadScene` 来完成加载。
     * 就算预加载还没完成，你也可以直接调用 `Bundle.loadScene` 或 `director.loadScene`。
     *
     * @param sceneName - The name of the scene to preload.
     * @param options - Some optional parameters
     * @param onProgress - callback, will be called when the load progression change.
     * @param onProgress.finish - The number of the items that are already completed
     * @param onProgress.total - The total number of the items
     * @param onProgress.item The latest request item
     * @param onComplete - callback, will be called after scene loaded.
     * @param onComplete.error - null or the error object.
     *
     * @example
     * bundle1.preloadScene('first');
     * // wait for a while
     * bundle1.loadScene('first', (err, scene) => director.runScene(scene));
     *
     */
    public preloadScene (sceneName: string, options: Record<string, any> | null, onProgress: ((finished: number, total: number, item: RequestItem) => void), onComplete: ((err?: Error | null) => void) | null): void;
    public preloadScene (sceneName: string, onProgress: ((finished: number, total: number, item: RequestItem) => void) | null, onComplete: ((err?: Error | null) => void) | null): void;
    public preloadScene (sceneName: string, options: Record<string, any> | null, onComplete?: ((err?: Error | null) => void) | null): void;
    public preloadScene (sceneName: string, onComplete?: ((err?: Error | null) => void) | null): void;
    public preloadScene (
        sceneName: string,
        options?: Record<string, any> | ((finished: number, total: number, item: RequestItem) => void) | ((err?: Error | null) => void) | null,
        onProgress?: ((finished: number, total: number, item: RequestItem) => void) | ((err?: Error | null) => void) | null,
        onComplete?: ((err?: Error | null) => void) | null,
    ) {
        const { options: opts, onProgress: onProg, onComplete: onComp } = parseParameters<((err?: Error | null) => void)>(options, onProgress, onComplete);

        opts.bundle = this.name;
        cclegacy.assetManager.preloadAny({ scene: sceneName }, opts, onProg, (err) => {
            if (err) {
                errorID(1210, sceneName, err.message);
            }
            if (onComp) { onComp(err); }
        });
    }

    /**
     * @en
     * Get cached asset within this bundle by path and type. <br>
     * After you load asset with [[load]] or [[loadDir]],
     * you can acquire them by passing the path to this API.
     *
     * NOTE：When there are multiple asset with the same name, you can get the specific asset by specifying the type.
     * Otherwise the first asset matching that name will be returned.
     *
     * @zh
     * 通过路径与类型获取已缓存资源。在你使用 [[load]] 或者 [[loadDir]] 之后，
     * 你能通过传路径通过这个 API 获取到这些资源。
     *
     * 注意：当有多个同名的资产时，你可以通过指定类型来获得具体的资产。
     * 否则将返回与该名称相匹配的第一个资产。
     *
     * @param path - @en The path of asset. @zh 资源的路径。
     * @param type - Only asset of type will be returned if this argument is supplied.
     * @returns - the asset has been cached.
     *
     * @example
     * bundle1.get('music/hit', AudioClip);
     */
    public get<T extends Asset> (path: string, type?: Constructor<T> | null): T | null {
        const info = this.getInfoWithPath(path, type);
        if (info) {
            return assets.get(info.uuid) as T || null;
        }

        return null;
    }

    /**
     * @en
     * Release the asset loaded by [[load]] or [[loadDir]].
     * and it's dependencies. Refer to [[AssetManager.releaseAsset]] for detailed informations.
     *
     * NOTE：When there are multiple asset with the same name, you can specify the asset to be released by specifying the type.
     * Otherwise the first resource matching that name will be released.
     *
     * @zh
     * 释放通过 [[load]] 或者 [[loadDir]] 加载的资源。
     * 详细信息请参考 [[AssetManager.releaseAsset]]。
     *
     * 注意：当存在多个资源同名时，可以通过指定类型来指定要释放的资源，否则将释放第一个匹配该名称的资源。

     *
     * @param path - @en The path of asset. @zh 资源的路径。
     * @param type - @en The type of asset. @zh 资源的类型。
     *
     * @example
     * // release a texture which is no longer need
     * bundle1.release('misc/character/cocos');
     *
     */
    public release (path: string, type?: Constructor<Asset> | null) {
        const asset = this.get(path, type);
        if (asset) {
            releaseManager.tryRelease(asset, true);
        }
    }

    /**
     * @en
     * Release all unused assets within this bundle. Refer to [[AssetManager.releaseAll]] for detailed information.
     *
     * @zh
     * 释放此包中的所有没有用到的资源。详细信息请参考 [[AssetManager.releaseAll]]
     *
     * @private
     *
     * @example
     * // release all unused asset within bundle1
     * bundle1.releaseUnusedAssets();
     *
     */
    public releaseUnusedAssets () {
        assets.forEach((asset) => {
            const info = this.getAssetInfo(asset._uuid);
            if (info && !info.redirect) {
                releaseManager.tryRelease(asset);
            }
        });
    }

    /**
     * @en
     * Release all assets within this bundle. Refer to [[AssetManager.releaseAll]] for detailed information.
     *
     * @zh
     * 释放此包中的所有资源。详细信息请参考 [[AssetManager.releaseAll]]
     *
     * @example
     * // release all asset within bundle1
     * bundle1.releaseAll();
     */
    public releaseAll () {
        assets.forEach((asset) => {
            const info = this.getAssetInfo(asset._uuid);
            if (info && !info.redirect) {
                releaseManager.tryRelease(asset, true);
            }
        });
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _destroy () {
        this._config.destroy();
    }
}

/**
 * @en
 * resources is a [[Bundle]] and controls all asset under assets/resources.
 *
 * @zh
 * resources 是一个 [[Bundle]]，用于管理所有在 assets/resources 下的资源。
 */
export const resources: Bundle = new Bundle();
cclegacy.resources = resources;
