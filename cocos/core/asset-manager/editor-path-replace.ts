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
import { EDITOR, NATIVE, PREVIEW, TEST } from 'internal:constants';
import { assert } from '../platform/debug';
import { Settings, settings } from '../settings';
import { fetchPipeline, pipeline } from './shared';
import Task, { TaskCompleteCallback } from './task';

declare const Editor: any;
if ((EDITOR || PREVIEW) && !TEST) {
    const cache: {[uuid: string]: string | null} = {};
    const resolveMap: { [uuid: string]: Function[] } = {};
    const replaceExtension  = (task: Task, done: TaskCompleteCallback) => {
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
    };

    const fetchText = (url) => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = () => {
            if (xhr.status !== 200) {
                reject();
                return;
            }
            resolve(xhr.response);
        };
        xhr.send(null);
    });

    const queryExtension = async (uuid: string): Promise<string> => {
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
                let previewServer = '';
                if (NATIVE) {
                    previewServer = settings.querySettings<string>(Settings.Category.PATH, 'previewServer') || '';
                    assert(previewServer);
                }
                text = await fetchText(`${previewServer}/query-extname/${uuid}`) as string;
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
    };
    pipeline.insert(replaceExtension, 1);
    fetchPipeline.insert(replaceExtension, 1);
}
