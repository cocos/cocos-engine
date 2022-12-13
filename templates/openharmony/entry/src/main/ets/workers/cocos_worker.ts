/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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
import nativerender from "libcocos.so";
import { ContextType } from "../common/Constants"
import { launchEngine } from '../cocos/game'

const nativeContext = nativerender.getContext(ContextType.WORKER_INIT);
nativeContext.workerInit()

const parentPort = worker.parentPort;

const nativeEditBox = nativerender.getContext(ContextType.EDITBOX_UTILS);
const nativeWebView = nativerender.getContext(ContextType.WEBVIEW_UTILS);

nativeContext.postMessage = function(msgType: string, msgData:string) {
    parentPort.postMessage({ type: msgType, data: msgData });
}

nativeContext.setPostMessageFunction.call(nativeContext, nativeContext.postMessage)

var renderContext: any = undefined;
parentPort.onmessage = function(e) {
    var data = e.data;
    switch(data.type) {
        case "onXCLoad":
            const renderContext = nativerender.getContext(ContextType.NATIVE_RENDER_API);
            renderContext.nativeEngineInit();
            launchEngine().then(() => {
                console.info('launch CC engien finished');
            }).catch(e => {
                console.error('launch CC engien failed');
            });
            renderContext.nativeEngineStart();
            break;
        case "onTextInput":
            nativeEditBox.onTextChange(data.data);
            break;
        case "onComplete":
            nativeEditBox.onComplete(data.data);
            break;
        case "onPageBegin":
            nativeWebView.shouldStartLoading(data.data.viewTag, data.data.url);
            break;
        case "onPageEnd":
            nativeWebView.finishLoading(data.data.viewTag, data.data.url);
            break;
        case "onErrorReceive":
            nativeWebView.failLoading(data.data.viewTag, data.data.url);
            break;
        default:
            console.error("cocos worker: message type unknown");
            break;
    }
}

