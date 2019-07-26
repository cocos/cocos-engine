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
const packManager = require('./pack-manager');
const Pipeline = require('./pipeline');
const parser = require('./parser');
const { getDepends, cacheAsset, gatherAsset, setProperties, forEach, clear, checkCircleReference } = require('./utilities');
const { assets, files, parsed, pipeline } = require('./shared');
const Task = require('./task');

function load (task, done) {

    if (!task.progress) {
        task.progress = {finish: 0, total: task.input.length};
    }
    
    var options = task.options, progress = task.progress;

    options.exclude = options.exclude || Object.create(null);

    task.output = [];
    
    forEach(task.input, function (item, cb) {

        let subTask = Task.create({ 
            input: item, 
            onProgress: task.onProgress, 
            options, 
            progress, 
            onComplete: function (err, item) {
                if (err && !task.isFinish && !cc.assetManager.force) done(err);
                task.output.push(item);
                subTask.recycle();
                cb();
            }
        });

        loadOneAssetPipeline.async(subTask);

    }, function () {

        options.exclude = null;

        if (task.isFinish) {
            clear(task, true);
            return task.dispatch('error');
        }

        gatherAsset(task);
        clear(task, true);
        done();
    });
}

var loadOneAssetPipeline = new Pipeline('loadOneAsset', [

    function (task, done) {
        var item = task.output = task.input;

        if (!item.options.reload && !item.isNative && assets.has(item.uuid)) {
            var asset = item.content = assets.get(item.uuid);
            asset._addRef();
            return done();
        }

        if (item.file) return done();

        packManager.load(item, task.options, function (err, data) {
            if (err) {
                item.dispatch('error', err);
                if (cc.assetManager.force) {
                    err = null;
                } else {
                    item.recycle();
                }
                data = null;
            }
            item.file = data;
            done(err);
        });
    },

    function (task, done) {

        var item = task.input, progress = task.progress, exclude = task.options.exclude;
        task.output = item;

        if (item.content) {
            task.dispatch('progress', ++progress.finish, progress.total, item);
            done();
        }
        else if (!item.options.reload && !item.isNative && assets.has(item.uuid)) {
            item.content = assets.get(item.uuid);
            item.content._addRef();
            task.dispatch('progress', ++progress.finish, progress.total, item);
            done();
        }
        else if (!item.isNative && item.uuid in exclude) {

            var cache = exclude[item.uuid];
            task.dispatch('progress', ++progress.finish, progress.total, item);

            if (cache.finish || checkCircleReference(item.uuid, item.uuid, exclude) ) {
                cache.content && cache.content._addRef();
                item.content = cache.content;
                cache.err && item.dispatch('error', cache.err);
                cache.loaded && item.dispatch('load');
                done(cache.subTaskError);
            }
            else {
                cache.callbacks.push({ done, item });
            }
        }
        else {
            parser.parse(item.id, item.file, item.isNative ? item.ext : 'import', item.options, function (err, asset) {
                if (err) {
                    item.dispatch('error', err);
                    if (!cc.assetManager.force) {
                        item.recycle();
                        return done(err);
                    }
                }
                if (item.isNative) {
                    item.content = asset;
                    task.dispatch('progress', ++progress.finish, progress.total, item);
                    done();
                }
                else {
                    asset._uuid = item.uuid;

                    var depends = [];
                    getDepends(item.uuid, asset, Object.create(null), depends, false, item.options.asyncLoadAssets, item.config);
                    
                    task.dispatch('progress', ++progress.finish, progress.total += depends.length, item);

                    var cache = exclude[item.uuid] = { content: asset, finish: false, callbacks: [] };

                    if (depends.length > 0) {

                        cache.callbacks.push({ done, item });
                        let subTask = Task.create({ 
                            input: depends, 
                            options: task.options, 
                            onProgress: task.onProgress, 
                            onError: Task.prototype.recycle, 
                            progress, 
                            onComplete: function (err) {
                                cache.finish = true;
                                cache.subTaskError = err;

                                if (!err) {

                                    var assets = Array.isArray(subTask.output) ? subTask.output : [subTask.output];
                                    var map = Object.create(null);
                                    for (let i = 0, l = assets.length; i < l; i++) {
                                        var dependAsset = assets[i];
                                        dependAsset && (map[dependAsset._uuid ? dependAsset._uuid + '@import' : item.uuid + '@native'] = dependAsset);
                                    }

                                    var result = setProperties(item.uuid, asset, map);
                                    asset = result.asset;
                                    files.remove(item.id);
                                    parsed.remove(item.id);

                                    if (!result.missingAsset) {
                                        try {
                                            asset.onLoad && asset.onLoad();
                                        }
                                        catch (e) {
                                            cache.err = e;
                                        }
                                    }

                                    cache.loaded = true;
                                    cacheAsset(item.uuid, asset, item.options.cacheAsset !== undefined ? item.options.cacheAsset : cc.assetManager.cacheAsset); 
                                    subTask.recycle();
                                }

                                var callbacks = cache.callbacks;

                                for (var i = 0, l = callbacks.length; i < l; i++) {

                                    var cb = callbacks[i];
                                    cache.content && cache.content._addRef();
                                    cb.item.content = cache.content;
                                    cache.err && cb.item.dispatch('error', cache.err);
                                    cache.loaded && cb.item.dispatch('load');
                                    cb.done(cache.subTaskError);

                                }

                                callbacks.length = 0;
                            }
                        });

                        pipeline.async(subTask);
                    }
                    else {
                        files.remove(item.id);
                        parsed.remove(item.id);
                        cache.loaded = true;
                        cache.finish = true;
                        try {
                            asset.onLoad && asset.onLoad();
                        }
                        catch (e) {
                            item.dispatch('error', e);
                            cache.err = e;
                        }

                        item.dispatch('load');

                        asset._addRef();
                        item.content = asset;

                        cacheAsset(item.uuid, asset, item.options.cacheAsset !== undefined ? item.options.cacheAsset : cc.assetManager.cacheAsset); 
                        done();
                    }
                }
            });
        }
    }
]);

module.exports = load;