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
const parser = require('./parser');
const { cache, gatherAsset, setProperties, clear, forEach } = require('./utilities');
const { assets, parsed, files } = require('./shared');

function initializing (task, done) {
    var input = task.input, assetsMap = Object.create(null);

    // stage 1, deserialize and prepare
    forEach (input, function (item, cb) {
        var { id, isNative, uuid, options, content, file, ext } = item;
        if (content) {
            assetsMap[id] = content;
            cb();
        }
        else if (!isNative && assets.has(uuid)) {
            var asset = assetsMap[id] = item.content = assets.get(uuid);
            asset._addRef();
            cb();
        } 
        else {
            parser.parse(id, file, isNative ? ext : 'import', options, function (err, data) {
                if (err) {
                    if (!task.isFinish && !cc.assetManager.force) {
                        done(err);
                    }
                    assetsMap[id] = null;
                }
                else {
                    assetsMap[id] = data;
                    isNative && (item.content = data);
                }
                cb();
            });
        }
    }, function () {
        if (task.isFinish) {
            clear(task, true);
            return task.dispatch('error');
        } 
        
        var deferredInits = [], inits = [];
        // stage 2, set properties
        for (var i = 0, l = input.length; i < l; i++) {
            var item = input[i];
            var { id, isNative, uuid, options } = item;
            var { cacheAsset } = options;
            parsed.remove(id);
            files.remove(id);
            if (!isNative) {
                if (!item.content) {
                    var asset = assetsMap[id];
                    asset._uuid = uuid;
                    var deferredInit = asset.__depends__.length > 0;
                    var missingAsset = setProperties(uuid, asset, assetsMap);
                    if (!missingAsset) {
                        if (deferredInit) {
                            asset.onLoad && deferredInits.push(asset);
                        }
                        else {
                            asset.onLoad && inits.push(asset);
                        }
                    }
                    cache(uuid, asset, cacheAsset !== undefined ? cacheAsset : cc.assetManager.cacheAsset); 
                    item.content = asset;
                    asset._addRef();
                }
            }
        }

        // stage 3, initialize
        for (var i = 0, l = inits.length; i < l; i++) {
            var item = inits[i];
            try {
                item.onLoad();
            }
            catch (e) {
                cc.warn(e);
            }
        }

        for (var i = 0, l = deferredInits.length; i < l; i++) {
            var item = deferredInits[i];
            try {
                item.onLoad();
            }
            catch (e) {
                cc.warn(e);
            }
        }

        // stage 4, gathering
        gatherAsset(task);
        clear(task, true);
        done();
    });
}
module.exports = initializing;