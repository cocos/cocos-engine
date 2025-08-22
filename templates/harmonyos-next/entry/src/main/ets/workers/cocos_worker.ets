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
import cocos from 'libcocos.so';
import hilog from '@ohos.hilog';

import { ContextType, AnyType } from '../common/Constants';
import { patchConsoleAssert } from '../common/Utils';
<% if(!useV8) { %>
import { launchEngine } from '../cocos/game';
<% } %>
import { UiPort } from './ui_port';
import '../cocos/oh-adapter/sys-ability-polyfill';
<% if(useV8) { %>
  globalThis.oh = {};
<% } %>

patchConsoleAssert();


const nativeContext = cocos.getContext(ContextType.WORKER_INIT);
nativeContext.workerInit();

const nativeEditBox = cocos.getContext(ContextType.EDITBOX_UTILS);
const nativeWebView = cocos.getContext(ContextType.WEBVIEW_UTILS);
const appLifecycle = cocos.getContext(ContextType.APP_LIFECYCLE);
const nativeVideo = cocos.getContext(ContextType.VIDEO_UTILS);


UiPort.getInstance().initPort(worker.workerPort);

const uiPort = UiPort.getInstance();
nativeContext.postMessage = (msgType: string, msgData: string): void => {
  uiPort.postMessage(msgType, msgData);
}

nativeContext.postSyncMessage = async (msgType: string, msgData: string): Promise<boolean | string | number> => {
  return uiPort.postSyncMessage(msgType, msgData);
}

// The purpose of this is to avoid being GC
nativeContext.setPostMessageFunction(nativeContext.postMessage);
nativeContext.setPostSyncMessageFunction(nativeContext.postSyncMessage);

globalThis.terminateProcess = () => {
  uiPort.postMessage("exitGame", 0);
}

globalThis.openUrl = (url: string) => {
  uiPort.postMessage("openUrl", url);
}

uiPort.on("onXCLoad", () => {
  const renderContext = cocos.getContext(ContextType.NATIVE_RENDER_API);
  renderContext.nativeEngineInit();
  <% if(!useV8) { %>
    launchEngine().then(() => {
      console.info('launch CC engine finished');
    }).catch(() => {
      console.error('launch CC engine failed');
    });
  <% } %>
  renderContext.nativeEngineStart();
});

uiPort.on("onTextInput", (txt: string) => {
  nativeEditBox.onTextChange(txt);
})

uiPort.on("onComplete", (txt: string) => {
  nativeEditBox.onComplete(txt);
})

uiPort.on("onConfirm", (txt: string) => {
  nativeEditBox.onConfirm(txt);
})

uiPort.on("onPageBegin", (viewTag: number, url: string) => {
  nativeWebView.shouldStartLoading(viewTag, url);
})

uiPort.on("onPageEnd", (viewTag: number, url: string) => {
  nativeWebView.finishLoading(viewTag, url);
})

uiPort.on("onErrorReceive", (viewTag: number, url: string) => {
  nativeWebView.failLoading(viewTag, url);
})

uiPort.on("onVideoEvent", (videoTag: number, videoEvent: number, args?: AnyType ) => {
  nativeVideo.onVideoEvent(JSON.stringify({videoTag: videoTag, videoEvent: videoEvent, args: args ?? null}));
})

uiPort.on("backPress", () => {
  appLifecycle.onBackPress();
})