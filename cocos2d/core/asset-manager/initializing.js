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
const { cacheAsset, gatherAsset, setProperties, clear, forEach} = require('./utilities');
const { assets, parsed, files } = require('./shared');

function initializing (task, done) {
    var input = task.input, assetsMap = Object.create(null);

    // stage 1, deserialize and prepare
    forEach (input, function (item, cb) {
        if (item.content) {
            assetsMap[item.id] = item.content;
            cb();
        }
        else if (!item.isNative && assets.has(item.uuid)) {
            assetsMap[item.id] = item.content = assets.get(item.uuid);
            item.content._addRef();
            cb();
        } 
        else {
            parser.parse(item.id, item.file, item.isNative ? item.ext : 'import', item.options, function (err, data) {
                if (err) {
                    item.dispatch('error', err);
                    if (!task.isFinish && !cc.assetManager.force) {
                        done(err);
                    }
                    assetsMap[item.id] = null;
                }
                else {
                    assetsMap[item.id] = data;
                    item.isNative && (item.content = data);
                }
                cb();
            });
        }
    }, function () {
        if (task.isFinish) return clear(task, true);
        
        var inits = [];
        // stage 2, set properties
        for (var i = 0, l = input.length; i < l; i++) {
            var item = input[i];
            parsed.remove(item.id);
            files.remove(item.id);
            if (!item.isNative) {
                if (item.content) {
                    item.content._removeRef();
                }
                else {
                    var asset = assetsMap[item.id];
                    asset._uuid = item.uuid;
                    var result = setProperties(item.uuid, asset, assetsMap);
                    asset = result.asset;
                    if (!result.missingAsset) {
                        asset.onLoad && inits.push(item);
                    }
                    item.dispatch('load');
                    cacheAsset(item.uuid, asset, item.options.cacheAsset !== undefined ? item.options.cacheAsset : cc.assetManager.cacheAsset); 
                    item.content = asset;
                }
            }
        }

        // stage 3, initialize
        for (var i = 0, l = inits.length; i < l; i++) {
            var item = inits[i];
            try {
                item.content.onLoad();
            }
            catch (e) {
                item.dispatch('error', e);
            }
        }

        // stage 4, gathering
        gatherAsset(task);
        clear(task, false);
        done();
    });
}
module.exports = initializing;