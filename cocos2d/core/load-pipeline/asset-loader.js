/****************************************************************************
 Copyright (c) 2017 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var Path = require('../utils/CCPath');
var Pipeline = require('./pipeline');
var LoadingItems = require('./loading-items');

var ID = 'AssetLoader';

var AssetLoader = function (extMap) {
    this.id = ID;
    this.async = true;
    this.pipeline = null;
};
AssetLoader.ID = ID;

var reusedArray = [];
AssetLoader.prototype.handle = function (item, callback) {
    var uuid = item.uuid;
    if (!uuid) {
        return !!item.content ? item.content : null;
    }

    var self = this;
    cc.AssetLibrary.queryAssetInfo(uuid, function (error, url, isRawAsset) {
        if (error) {
            callback(error);
        }
        else {
            item.url = url;
            item.isRawAsset = isRawAsset;
            if (isRawAsset) {
                var ext = Path.extname(url).toLowerCase();
                if (!ext) {
                    callback(new Error('Download Uuid: can not find type of raw asset[' + uuid + ']: ' + url));
                    return;
                }
                ext = ext.substr(1);
                var queue = LoadingItems.getQueue(item);
                reusedArray[0] = {
                    queueId: item.queueId,
                    id: url,
                    url: url,
                    type: ext,
                    error: null,
                    alias: item.id,
                    complete: true
                };
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
};

Pipeline.AssetLoader = module.exports = AssetLoader;