/*
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
import { EDITOR, NATIVE, PREVIEW, TEST } from 'internal:constants';
import { assert, Settings, settings } from '../../core';
import { fetchPipeline, pipeline } from './shared';
import Task from './task';

declare const Editor: any;
if ((EDITOR || PREVIEW) && !TEST) {
    const cache: {[uuid: string]: string | null} = {};
    const resolveMap: { [uuid: string]: Function[] } = {};
    const replaceExtension  = (task: Task, done): void => {
        task.output = task.input;
        (async (): Promise<void> => {
            for (let i = 0; i < task.input.length; i++) {
                const item = task.input[i];
                if (!item.uuid || item.isNative) { continue; }
                try {
                    const extension = await queryExtension(item.overrideUuid || item.uuid);
                    if (extension) {
                        item.ext = extension;
                        item.url = item.url.replace('.json', extension);
                    }
                } catch (err) {
                    continue;
                }
            }
        })().then((): void => {
            done(null, null);
        }).catch((reason): void => {
            done(reason, null);
        });
    };

    const fetchText = (url): Promise<unknown> => new Promise((resolve, reject): void => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = (): void => {
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
            return new Promise((resolve): void => {
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
                    assert(Boolean(previewServer));
                }
                text = await fetchText(`${previewServer}/query-extname/${uuid}`) as string;
            }
            cache[uuid] = text;
            if (resolveMap[uuid]) {
                resolveMap[uuid].forEach((func): any => func(text));
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
