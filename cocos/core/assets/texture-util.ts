/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 * @category asset
 */

import { assertID, error } from '../platform/debug';
import { loader } from '../load-pipeline/CCLoader';
import { ImageAsset, ImageSource } from './image-asset';
import { DEBUG } from 'internal:constants';
import { IItem } from '../load-pipeline/loading-items';

export type LoadImageCallback<T> = (
    this: T | undefined,
    error: Error | null | undefined,
    asset?: ImageAsset,
    ) => void;

/**
 * 加载指定的图像资源。
 * @param url 图像资源的链接。
 * @param callback 回调函数。
 * @param target 回调函数的 `this` 参数。
 * @returns 图像资源，返回时可能还未完成加载；加载完成或失败时会调用回调函数。
 */
export function loadImage<T extends object> (url: string, callback?: LoadImageCallback<T>, target?: T) {
    assertID(!!url, 3103);

    let imageAsset = loader.getRes<ImageAsset>(url);
    if (imageAsset) {
        if (imageAsset.loaded) {
            if (callback){
                callback.call(target, null, imageAsset);
            }
            return imageAsset;
        } else {
            imageAsset.once('load', () => {
                if (callback) {
                    callback.call(target, null, imageAsset!);
                }
            }, target);
            return imageAsset;
        }
    } else {
        imageAsset = new ImageAsset();
        loader.load({url, imageAsset}, (err, asset) => {
            if (err) {
                if (callback) {
                    callback.call(target, err || new Error('Unknown error'));
                }
                return imageAsset;
            }
            if (callback) {
                callback.call(target, null, asset);
            }
        });
        return imageAsset;
    }
}

/**
 * 缓存指定的图像源，为它指定链接。此后，可以通过该链接直接加载它。
 * @param url 指定的链接。
 * @param image 缓存的图像源。
 */
export function cacheImage (url: string, image: ImageSource) {
    if (url && image) {
        const imageAsset = new ImageAsset(image);
        const item = {
            id: url,
            url, // real download url, maybe changed
            error: null,
            content: imageAsset,
            complete: false,
        };
        loader.flowOut(item as IItem);
        return imageAsset;
    }
}

/**
 * 尝试加载图像资源的实际数据。
 * @param imageAsset 图像资源。
 * @param callback 回调函数。
 */
export function postLoadImage (imageAsset: ImageAsset, callback?: Function) {
    if (imageAsset.loaded) {
        if (callback) {
            callback();
        }
        return;
    }
    if (!imageAsset.nativeUrl) {
        if (callback) {
            callback();
        }
        return;
    }
    // load image
    loader.load({
        url: imageAsset.nativeUrl,
        // For image, we should skip loader otherwise it will load a new ImageAsset
        skips: imageAsset.isCompressed ? undefined : ['Loader'],
    }, (err, image) => {
        if (image) {
            if (DEBUG && image instanceof ImageAsset) {
                return error('internal error: loader handle pipe must be skipped');
            }
            if (!imageAsset.loaded) {
                imageAsset._nativeAsset = image;
            }
        }
        if (callback) {
            callback(err);
        }
    });
}
