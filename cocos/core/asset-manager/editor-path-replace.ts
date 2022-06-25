/*
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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
import { EDITOR, NATIVE, PREVIEW } from 'internal:constants';
import { fetchPipeline, pipeline } from './shared';
import Task, { TaskCompleteCallback } from './task';

declare const Editor: any;

function replaceExtension (task: Task, done: TaskCompleteCallback) {
    task.output = task.input;
    (async () => {
        for (let i = 0; i < task.input.length; i++) {
            const item = task.input[i];
            if (!item.uuid || item.isNative) { continue; }
            try {
                const extension = await queryExtension(item.uuid);
                if (extension) {
                    item.ext = extension;
                    item.url = item.url.replace('.json', extension);
                }
            } catch (err) {
                continue;
            }
        }
    })().then(() => {
        done(null, null);
    }).catch((reason) => {
        done(reason, null);
    });
}

const cache: {[uuid: string]: string | null} = {};
const resolveMap: { [uuid: string]: Function[] } = {};

async function queryExtension (uuid: string): Promise<string> {
    if (uuid in cache) {
        if (cache[uuid] !== null) {
            return cache[uuid] as string;
        }
        return new Promise((resolve) => {
            resolveMap[uuid] = resolveMap[uuid] || [];
            resolveMap[uuid].push(resolve);
        });
    }
    cache[uuid] = null;
    try {
        let text = '';
        if (EDITOR) {
            const info = await Editor.Message.request('asset-db', 'query-asset-info', uuid);
            if (info && info.library['.cconb']) {
                text = '.cconb';
            }
        } else {
            const response = await fetch(`${NATIVE ? 'http://<%= previewIp %>:<%= previewPort %>' : ''}/query-extname/${uuid}`);
            text = await response.text();
        }
        cache[uuid] = text;
        if (resolveMap[uuid]) {
            resolveMap[uuid].forEach((func) => func(text));
            resolveMap[uuid] = [];
        }
        return text;
    } catch (error) {
        console.error(error);
        cache[uuid] = '';
        return '';
    }
}

if (EDITOR || PREVIEW) {
    pipeline.insert(replaceExtension, 1);
    fetchPipeline.insert(replaceExtension, 1);
}
