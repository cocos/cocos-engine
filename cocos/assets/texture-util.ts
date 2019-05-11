/****************************************************************************
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
 ****************************************************************************/

import { ImageAsset, ImageSource } from './image-asset';

/**
 * cc.textureUtil is a singleton object, it can load cc.Texture2D asynchronously
 * @class textureUtil
 * @static
 */

export function loadImage (url: string, cb, target) {
    cc.assertID(url, 3103);

    let imageAsset = cc.loader.getRes(url);
    if (imageAsset) {
        if (imageAsset.loaded) {
            if (cb){
                cb.call(target, imageAsset);
            }

            return imageAsset;
        }
        else {
            imageAsset.once('load', () => {
                if (cb) {
                    cb.call(target, imageAsset);
                }
            }, target);
            return imageAsset;
        }
    }
    else {
        imageAsset = new ImageAsset();
        imageAsset.url = url;
        cc.loader.load({ url, imageAsset }, (err, asset) => {
            if (err) {
                return cb && cb.call(target, err || new Error('Unknown error'));
            }
            if (cb) {
                cb.call(target, null, asset);
            }
        });
        return imageAsset;
    }
}

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
        cc.loader.flowOut(item);
        return imageAsset;
    }
}
// TODO:
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
    cc.loader.load({
        url: imageAsset.nativeUrl,
        // For image, we should skip loader otherwise it will load a new ImageAsset
        skips: ['Loader'],
    }, (err, image) => {
        if (image) {
            if (CC_DEBUG && image instanceof cc.ImageAsset) {
                return cc.error('internal error: loader handle pipe must be skipped');
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

cc.textureUtil = {
    loadImage,
    cacheImage,
    postLoadImage,
};
