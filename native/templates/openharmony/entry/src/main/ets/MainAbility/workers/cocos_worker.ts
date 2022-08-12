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
import nativerender from "libcocos2d.so";
import { ContextType } from "../common/Constants"
import { log } from '../cocos/log_utils';
import { launchEngine } from '../cocos/game'

console.log("cocos worker: New Worker Thread")

const nativeContext = nativerender.getContext(ContextType.WORKER_INIT);
nativeContext.workerInit()

const parentPort = worker.parentPort;

var renderContext: any = undefined;
parentPort.onmessage = function(e) {
    var data = e.data;

    console.log("kee cocos worker type:" + data.type);
    switch(data.type) {
        case "AppLifecycle":
            console.log("kee cocos worker: AppLifecycle");
            const nativeAppLifecycle = nativerender.getContext(ContextType.APP_LIFECYCLE);
            switch(data.data) {
                case "onCreate":
                    console.log("kee cocos worker: onCreate");
                    nativeAppLifecycle.onCreate();
                    break;
                case "onShow":
                    console.log("kee cocos worker: onShow");
                    nativeAppLifecycle.onShow();
                    break;
                case "onHide":
                    console.log("kee cocos worker: onHide");
                    nativeAppLifecycle.onHide();
                    break;
                case "onDestroy":
                    console.log("kee cocos worker: onDestroy");
                    nativeAppLifecycle.onDestroy();
                    break;
            }
            break;
        case "JSPageLifecycle":
            const nativePageLifecycle = nativerender.getContext(ContextType.JSPAGE_LIFECYCLE);
            console.log("kee cocos worker: JSPageLifecycle");
            switch(data.data) {
                case "onPageShow":
                    console.log("kee cocos worker: onPageShow");
                    nativePageLifecycle.onPageShow();
                    break;
                case "onPageHide":
                    console.log("kee cocos worker: onPageHide");
                    nativePageLifecycle.onPageHide();
                    break;
            }
            break;
        case "onXCLoad":
            log('recieve msg from host XCLoad');
            log('start to launch CC engine');
            const renderContext = nativerender.getContext(ContextType.NATIVE_RENDER_API);
            renderContext.nativeEngineInit();
            console.log("kee cocos worker: onXCLoad");
            launchEngine().then(() => {
                log('launch CC engien finished');
            }).catch(e => {
                log('launch CC engien failed');
            });
            console.log("kee cocos worker napi init ok");
            console.log(data.data);
            break;
        case "render":
            console.log("kee cocos worker: render");
            if (data.data == "changeColor") {
                console.log("kee cocos worker: changeColor");
                renderContext.changeColor()
            }
        //            nativerender.bindXComponent(data.data);
            break;
        case "normal":
            console.log("kee cocos worker: data = " + data.date);
            break;
        default:
            console.error("cocos worker: message type unknown")
    }
}
