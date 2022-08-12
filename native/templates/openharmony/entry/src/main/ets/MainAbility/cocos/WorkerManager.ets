/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import worker from '@ohos.worker';
import {Constants} from '../common/Constants'
import {log} from '../cocos/log_utils'
export class WorkerManager {
    private static instance: WorkerManager;
    private cocosWorker: any;

    private constructor() {
        this.cocosWorker = new worker.Worker("workers/cocos_worker.ts", {type:"classic", name: "CocosWorker"});
        this.cocosWorker.onerror = function (e) {
            var msg = e.message;
            var filename = e.filename;
            var lineno = e.lineno;
            var colno = e.colno;
            console.error(`pptest on Error ${msg} ${filename} ${lineno} ${colno}`);
        }
    }

    public static getInstance(): WorkerManager {
        console.log("kee cocos WorkerManager getInstance");
        if (AppStorage.Get(Constants.APP_KEY_WORKER_MANAGER) == null) {
            AppStorage.SetOrCreate(Constants.APP_KEY_WORKER_MANAGER, new WorkerManager);
        }
        return AppStorage.Get(Constants.APP_KEY_WORKER_MANAGER);
    }
    public getWorker(): any {
        return this.cocosWorker;
    }
}

