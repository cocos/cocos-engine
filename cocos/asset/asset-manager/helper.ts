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
import { cclegacy, error } from '../../core';
import RequestItem from './request-item';
import { bundles, transformPipeline } from './shared';
import Task from './task';

const _uuidRegex = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-@]{8,}).*/;

export { default as decodeUuid } from '../../core/utils/decode-uuid';

/**
 * @en
 * Extracts uuid from url.
 *
 * @zh
 * 从 url 中提取 uuid。
 *
 * @param url @en The url to be converted. @zh 待转换的 url。
 * @returns @en The uuid extracted from url. @zh url 转换为的 uuid。
 *
 * @example
 * var url = 'res/import/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.json';
 * var uuid = getUuidFromURL(url); // fc991dd7-0033-4b80-9d41-c8a86a702e59
 */
export function getUuidFromURL (url: string): string {
    const matches = _uuidRegex.exec(url);
    if (matches) {
        return matches[1];
    }
    return '';
}

/**
 * @en
 * Transforms uuid to url.
 *
 * @zh
 * 转换 uuid 为 url。
 *
 * @param uuid @en The uuid of asset. @zh 资源的 uuid。
 * @param options @en Some optional parameters. @zh 一些可选参数。
 * @param options.isNative @en Indicates whether the path you want is a native resource path. @zh 需要转换的路径是否是原生资源路径。
 * @param options.nativeExt @en Extension of the native resource path, it is required when isNative is true. @zh 原生资源路径的扩展名，如果 `isNative` 为 true，则需要。
 * @returns @en The url converted from uuid. @zh 从 uuid 转换而来的 url.
 *
 * @example
 * // json path, 'assets/main/import/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.json';
 * var url = getUrlWithUuid('fcmR3XADNLgJ1ByKhqcC5Z', {isNative: false});
 *
 * // png path, 'assets/main/native/fc/fc991dd7-0033-4b80-9d41-c8a86a702e59.png';
 * var url = getUrlWithUuid('fcmR3XADNLgJ1ByKhqcC5Z', {isNative: true, nativeExt: '.png'});
 *
 */
export function getUrlWithUuid (uuid: string, options?: { [k: string]: any, isNative: boolean, nativeExt?: string } | null): string {
    options = options || Object.create(null);

    options!.__isNative__ = options!.isNative;
    if (options!.nativeExt) {
        options!.ext = options!.nativeExt;
    }
    const bundle = bundles.find((b): boolean => !!b.getAssetInfo(uuid));
    if (bundle) {
        options!.bundle = bundle.name;
    }

    return transform(uuid, options) as string;
}

/**
 * @en
 * Checks if the type of asset is scene.
 *
 * @zh
 * 检查资源类型是否是场景。
 *
 * @param asset @en The asset to be checked. @zh 待检查的资源。
 * @returns @en Whether or not the asset is a SceneAsset. @zh 此资源是否是场景资源。
 *
 */
export function isScene (asset): boolean {
    return !!asset && (asset instanceof cclegacy.SceneAsset || asset instanceof cclegacy.Scene);
}

/**
 * @en
 * Normalizes url, strip './' and '/'.
 *
 * @zh
 * 标准化 url ，去除 './' 和 '/'。
 *
 * @param url @en The url to be normalized. @zh 待标准化的 url。
 * @returns @en The normalized url. @zh 标准化后的 url。
 */
export function normalize (url: string): string {
    if (url) {
        if (url.charCodeAt(0) === 46 && url.charCodeAt(1) === 47) {
            // strip './'
            url = url.slice(2);
        } else if (url.charCodeAt(0) === 47) {
            // strip '/'
            url = url.slice(1);
        }
    }
    return url;
}

export function transform (input: string | string[] | Record<string, any> | Array<Record<string, any>>, options?: Record<string, any> | null): string | string[] {
    const subTask = Task.create({ input, options });
    const urls: string[] = [];
    try {
        const result: RequestItem[] = transformPipeline.sync(subTask);
        for (const requestItem of result) {
            const url = requestItem.url;
            requestItem.recycle();
            urls.push(url);
        }
    } catch (e) {
        for (const item of subTask.output) {
            item.recycle();
        }
        error((e as Error).message, (e as Error).stack);
    }
    subTask.recycle();
    return urls.length > 1 ? urls : urls[0];
}
