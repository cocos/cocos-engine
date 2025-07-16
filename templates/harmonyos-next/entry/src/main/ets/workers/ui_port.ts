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
import worker, { ThreadWorkerGlobalScope } from '@ohos.worker';
import { MessageEvent } from '@ohos.worker';
import { MessageEvents } from '@kit.ArkTS';
import { EventTarget } from  '../common/EventTarget'

let port: UiPort;

export class UiPort extends EventTarget {
  private autoId: number = 0;
  public actionHandleMap = {}
  private port: ThreadWorkerGlobalScope | worker.ThreadWorker = null;

  public _messageHandle?: (e: MessageEvent<any>) => void;

  constructor() {
    super();
  }

  static getInstance (): UiPort {
    if (!port) {
      port = new UiPort();
    }
    return port;
  }

  public initPort(worker: ThreadWorkerGlobalScope | worker.ThreadWorker) {
    this.port = worker;
    this.port.onmessage = this.onMessage.bind(this);
  }

  public getPort() : ThreadWorkerGlobalScope | worker.ThreadWorker {
    return this.port;
  }

  public onMessage(e: MessageEvents) {
    let data = e['data'];
    if (data.type == "syncResult") {
      const { id, response } = data.data;
      if (!this.actionHandleMap[id]) {
        return;
      }
      this.actionHandleMap[id].call(this, response);
      delete this.actionHandleMap[id];
    } else {
      let params = [];
      if (data.data.param === null || data.data.param === undefined) {
        params = []; 
      } else if (Array.isArray(data.data.param)) {
        params = data.data.param; 
      } else if (typeof data.data.param === 'object') {
        params = Object.values(data.data.param); 
      } else {
        params = [data.data.param];
      }
      const result = this.emit(data.data.name, ...params);
      if(result != null && result != undefined && data.type == "sync") {
        this.postReturnMessage(data.data.cbId, result);
      }
    }
  }

  public postReturnMessage(cbId: number, res: any) {
    if (res != null && res != undefined) {
      this.port.postMessage({ type: "syncResult", data: { id: cbId, response: res } });
    }
  }

  public postMessage(msgName: string, msgData?: any) {
    this.port.postMessage({ type: "async", data: { name: msgName, param: msgData ?? null } });
  }

  public postSyncMessage(msgName: string, msgData: any): Promise<boolean | string | number> {
    const id = this.autoId++;
    return new Promise((resolve, reject) => {
      this.actionHandleMap[id] = (response) => {
        resolve(response)
      }
      const message = {
        type: "sync", data: { cbId: id, name: msgName, param: msgData }
      }
      this.port.postMessage(message);
    })
  }
}