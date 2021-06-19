/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

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
 */
import downloader from './downloader';
import factory from './factory';
import parser from './parser';
import { assets, files, parsed } from './shared';
import Task from './task';

export function fetch (task: Task) {
    const item = task.output = task.input;
    const { options, uuid } = item;
    const { reloadAsset } = options;

    if (!reloadAsset && assets.has(uuid)) {
        item.content = assets.get(uuid);
        task.finish();
        return;
    }

    downloader.download(item.uuid, item.url, item.ext, item.options, (err, data) => {
        item.file = data;
        task.done(err);
    });
}

export function parse (task: Task) {
    const item = task.output = task.input;
    const { uuid, file, options } = item;

    parser.parse(uuid, file, item.ext, options, (err, asset) => {
        if (err) {
            task.done(err);
            return;
        }
        item.content = asset;
        task.done();
    });
}

export function create (task: Task) {
    const item = task.output = task.input;
    const { uuid, content, options, ext } = item;
    factory.create(uuid, content, ext, options, (err, asset) => {
        parsed.remove(uuid);
        files.remove(uuid);
        
        if (err) {
            task.done(err);
            return;
        }
        task.done();
    });
}