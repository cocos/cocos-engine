/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

import worker from '@ohos.worker';
import {Constants} from '../common/Constants'

export class WorkerManager {
    private static instance: WorkerManager;
    private cocosWorker: any;

    private constructor() {
        this.cocosWorker = new worker.Worker("/entry/ets/workers/cocos_worker.ts", {type:"classic", name: "CocosWorker"});
        this.cocosWorker.onerror = function (e) {
            var msg = e.message;
            var filename = e.filename;
            var lineno = e.lineno;
            var colno = e.colno;
            console.error(`on Error ${msg} ${filename} ${lineno} ${colno}`);
        }
    }

    public static getInstance(): WorkerManager {
        if (AppStorage.Get(Constants.APP_KEY_WORKER_MANAGER) == null) {
            AppStorage.SetOrCreate(Constants.APP_KEY_WORKER_MANAGER, new WorkerManager);
        }
        return AppStorage.Get(Constants.APP_KEY_WORKER_MANAGER);
    }
    public getWorker(): any {
        return this.cocosWorker;
    }
}

