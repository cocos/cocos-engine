/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import Cache from './cache';

/**
 * @en
 * Cache manager is a module which controls all caches downloaded from server in non-web platform, it is a singleton
 * All member can be accessed with `assetManager.cacheManager`.
 *
 * @zh
 * 缓存管理器是一个模块，在非 WEB 平台上，用于管理所有从服务器上下载下来的缓存，这是一个单例，所有成员能通过 `assetManager.cacheManager` 访问。
 *
 */
export default abstract class CacheManager {
    /**
     * @en
     * The name of cacheDir
     *
     * @zh
     * 缓存目录的名称
     */
    public abstract cacheDir: string;

    /**
     * @en
     * Whether or not cache asset into user's storage space, this property only works on mini-game platforms
     *
     * @zh
     * 是否缓存资源到用户存储空间，此属性只在小游戏平台有效
     *
     */
    public abstract cacheEnabled: boolean;

    /**
     * @en
     * Whether or not auto clear cache when storage ran out, this property only works on mini-game platforms
     *
     * @zh
     * 是否在存储空间满了后自动清理缓存，此属性只在小游戏平台有效
     *
     */
    public abstract autoClear: boolean;

    /**
     * @en
     * The interval between caching resources, this property only works on mini-game platforms, unit: ms
     *
     * @zh
     * 缓存资源的间隔时间，此属性只在小游戏平台有效，单位：毫秒
     *
     */
    public abstract cacheInterval: number;

    /**
     * @en
     * The interval between deleting resources, when you use `cleanLRU`, the resources will be deleted as this interval, unit: ms
     *
     * @zh
     * 清理资源的间隔时间，当你使用 `cleanLRU` 时，资源将以此间隔被删除，单位：毫秒
     *
     */
    public abstract deleteInterval: number;

    /**
     * @en
     * List of all cached files
     *
     * @zh
     * 所有缓存文件列表
     *
     */
    public abstract cachedFiles: Cache<{ bundle: string, url: string, lastTime: number }>;

    /**
     * @en
     * Get cached path with origin url
     *
     * @zh
     * 通过原始 url 获取缓存后的路径
     *
     * @param originUrl
     * @returns The cached path
     */
    public abstract getCache (originUrl: string): string;

    /**
     * @en
     * Get temporary path with origin url, this method only works on mini-game platforms
     *
     * @zh
     * 通过原始 url 获取临时文件的路径，此方法只在小游戏平台有效
     *
     * @param originUrl
     * @returns The temp path
     */
    public abstract getTemp (originUrl: string): string;

    /**
     * @en
     * Clear all caches, please use with caution, If necessary, we recommend using it before the game is launched
     *
     * @zh
     * 清空所有缓存，请谨慎使用，如果必要的话，我们建议在游戏启动之前使用
     *
     */
    public abstract clearCache (): void;

    /**
     * @en
     * Clear part of caches with LRU strategy
     *
     * @zh
     * 使用 LRU 策略清空部分缓存
     *
     */
    public abstract clearLRU (): void;

    /**
     * @en
     * Remove cache with origin url
     *
     * @zh
     * 通过原始 url 移除缓存
     *
     */
    public abstract removeCache (originUrl: string): void;
}
