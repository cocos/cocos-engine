/*
 Copyright (c) 2016 Chukong Technologies Inc.
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
 * @category loader
 */

import {extname} from '../utils/path';
import * as debug from '../platform/debug';
import { Pipeline, IPipe } from './pipeline';
import { LoadingItems } from './loading-items';
import { EDITOR } from 'internal:constants';
import { legacyCC } from '../global-exports';

const ID = 'AssetLoader';
let reusedArray:Array<any> = [];

export default class AssetLoader implements IPipe {
    static ID = ID;
    public id:string = ID;
    public async:boolean = true;
    public pipeline:Pipeline | null = null;

    handle (item, callback) {
        let uuid = item.uuid;
        if (!uuid) {
            return item.content || null;
        }

        legacyCC.AssetLibrary.queryAssetInfo(uuid, (error, url, isRawAsset) => {
            if (error) {
                callback(error);
            }
            else {
                item.url = item.rawUrl = url;
                item.isRawAsset = isRawAsset;
                if (isRawAsset) {
                    let ext = extname(url).toLowerCase();
                    if (!ext) {
                        callback(new Error(debug.getError(4931, uuid, url)));
                        return;
                    }
                    ext = ext.substr(1);
                    let queue = LoadingItems.getQueue(item);
                    reusedArray[0] = {
                        queueId: item.queueId,
                        id: url,
                        url: url,
                        type: ext,
                        error: null,
                        alias: item,
                        complete: true
                    };
                    if (EDITOR && this.pipeline) {
                        this.pipeline._cache[url] = reusedArray[0];
                    }
                    queue.append(reusedArray);
                    // Dispatch to other raw type downloader
                    item.type = ext;
                    callback(null, item.content);
                }
                else {
                    item.type = 'uuid';
                    callback(null, item.content);
                }
            }
        });
    }
}

// @ts-ignore
Pipeline.AssetLoader = AssetLoader;