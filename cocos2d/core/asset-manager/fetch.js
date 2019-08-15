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
const Task = require('./task');
const {getDepends, clear, forEach} = require('./utilities');
const {assets, fetchPipeline} = require('./shared');

function fetch (task, done) {

    if (!task.progress) {
        task.progress = { finish: 0, total: task.input.length }; 
    }

    var options = task.options, depends = [], progress = task.progress, total = progress.total;
    options.exclude = options.exclude || Object.create(null);

    task.output = [];

    forEach(task.input, function (item, cb) {
        
        if (!item.isNative && assets.has(item.uuid)) {
            var asset = assets.get(item.uuid);
            asset._addRef();
            handle(item, task, asset, null, asset.__nativeDepend__, depends, total, done);
            return cb();
        }

        packManager.load(item, task.options, function (err, data) {
            if (err) {
                if (!task.isFinish) {
                    if (!cc.assetManager.force) {
                        done(err);
                    }
                    else {
                        handle(item, task, null, null, false, depends, total, done);
                    }
                }
            }
            else {
                if (!task.isFinish) handle(item, task, null, data, !item.isNative, depends, total, done);
            }
            cb();
        });
        
    }, function () {

        if (task.isFinish) {
            clear(task, true);
            return task.dispatch('error');
        } 
        if (depends.length > 0) {

            // stage 2 , download depend asset
            let subTask = Task.create({
                name: task.name + ' dependencies',
                input: depends,
                progress,
                options,
                onProgress: task.onProgress,
                onError: Task.prototype.recycle,
                onComplete: function (err) {
                    if (!err) {
                        subTask.recycle();
                        task.output.push.apply(task.output, this.output);
                    }
                    done(err);
                },
            });
            fetchPipeline.async(subTask);
            return;
        }
        done();
    });
}

function handle (item, task, content, file, loadDepends, depends, last, done) {

    var exclude = task.options.exclude;
    var progress = task.progress;

    item.content = content;
    item.file = file;
    task.output.push(item);

    if (loadDepends) {
        exclude[item.uuid] = true;
        var err = getDepends(item.uuid, file, exclude, depends, true, item.config);
        if (err) {
            if (!cc.assetManager.force) {
                return done(err);
            }
            item.file = null;
        }
        progress.total = last + depends.length;
    }

    task.dispatch('progress', ++progress.finish, progress.total, item);
}

module.exports = fetch;