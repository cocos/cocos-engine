/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @hidden
 */
import { CompleteCallbackNoData, RequestType, transformPipeline } from './shared';
import Task from './task';

export default function preprocess (task: Task, done: CompleteCallbackNoData) {
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
