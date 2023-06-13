/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { RequestType, transformPipeline } from './shared';
import Task from './task';

export default function preprocess (task: Task, done: ((err?: Error | null) => void)): void {
    const options = task.options;
    const subOptions = Object.create(null);
    const leftOptions = Object.create(null);

    for (const op in options) {
        switch (op) {
        // can't set these attributes in options
        case RequestType.PATH:
        case RequestType.UUID:
        case RequestType.DIR:
        case RequestType.SCENE:
        case RequestType.URL: break;
            // only need these attributes to transform url
        case '__requestType__':
        case '__isNative__':
        case 'ext':
        case 'type':
        case '__nativeName__':
        case 'audioLoadMode':
        case 'bundle':
            subOptions[op] = options[op];
            break;
            // other settings, left to next pipe
        case '__exclude__':
        case '__outputAsArray__':
            leftOptions[op] = options[op];
            break;
        default:
            subOptions[op] = options[op];
            leftOptions[op] = options[op];
            break;
        }
    }
    task.options = leftOptions;

    // transform url
    const subTask = Task.create({ input: task.input, options: subOptions });
    let err: Error | null = null;
    try {
        task.output = task.source = transformPipeline.sync(subTask);
    } catch (e) {
        err = e as Error;
        for (let i = 0, l = subTask.output.length; i < l; i++) {
            subTask.output[i].recycle();
        }
    }
    subTask.recycle();
    done(err);
}
