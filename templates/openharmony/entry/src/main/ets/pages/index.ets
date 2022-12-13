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
import nativerender from "libcocos.so";

import { WorkerManager } from '../cocos/WorkerManager'
import { ContextType } from "../common/Constants"
import featureAbility from '@ohos.ability.featureAbility'
import { EditBoxDialog } from '../components/EditBoxDialog'
import { ViewInfo, CocosWebView } from '../components/CocosWebView'
const nativePageLifecycle = nativerender.getContext(ContextType.JSPAGE_LIFECYCLE);
const engineUtils = nativerender.getContext(ContextType.ENGINE_UTILS);

@Entry
@Component
struct Index {
  @State showMessage: string = ''
  @State viewArray: ViewInfo[] = [];
  //private index: number = 0;
  private indexMap: Map<number, number> = new Map;

  cocosWorker = WorkerManager.getInstance().getWorker();
  dialogController: CustomDialogController = new CustomDialogController({
    builder: EditBoxDialog({
      showMessage: this.showMessage,
      onTextChange: (msg: string) => {
        this.showMessage = msg;
        this.cocosWorker.postMessage({ type: 'onTextInput', data: msg })
      },
      accept: (msg: string) => {
        this.showMessage = msg;
        this.cocosWorker.postMessage({ type: 'onComplete', data: msg })
      },
    }),
    cancel: () => {
      this.cocosWorker.postMessage({ type: 'onComplete', data: this.showMessage })
    },
    autoCancel: true,
    alignment: DialogAlignment.Bottom,
    customStyle: true,
  })

  aboutToAppear(): void  {
    console.log('[LIFECYCLE-Index] cocos aboutToAppear');
    this.cocosWorker.onmessage = (e) => {
      let data = e['data']
      switch (data.type) {
        case "showEditBox": {
          this.showMessage = data.data
          this.dialogController.open()
          break;
        }
        case "hideEditBox": {
          this.showMessage = ''
          this.dialogController.close()
          break;
        }
        case "createWebView": {
          this.viewArray.push(new ViewInfo(0, 0, 0, 0, data.data))
          this.indexMap.set(data.data, this.viewArray.length - 1);
          break;
        }
        case "removeWebView": {
          if (this.viewArray.length > 0) {
            this.viewArray.splice(this.indexMap.get(data.data), 1)
          }
          break;
        }
        case "loadUrl": {
          var web = data.data;
          var index = this.indexMap.get(web.tag);
          this.viewArray[index].controller.loadUrl({url: web.url});
          break;
        }
        case "loadHTMLString": {
          var web = data.data;
          var index = this.indexMap.get(web.tag);
          this.viewArray[index].controller.loadData({data: web.contents, mimeType:"text/html",encoding:"UTF-8", baseUrl:web.baseUrl});
          break;
        }
        case "loadData": {
          var web = data.data;
          var index = this.indexMap.get(web.tag);
          this.viewArray[index].controller.loadData({data: web.contents, mimeType:web.mimeType,encoding:web.encoding, baseUrl:web.baseUrl});
          break;
        }
        case "evaluateJS": {
          var web = data.data;
          var index = this.indexMap.get(web.tag)
          this.viewArray[index].controller.runJavaScript({
            script: web.jsContents
          });
          break;
        }
        case "reload": {
          var index = this.indexMap.get(data.data);
          this.viewArray[index].controller.refresh();
          break;
        }
        case "stopLoading": {
          var index = this.indexMap.get(data.data);
          this.viewArray[index].controller.stop();
          break;
        }
        case "goForward": {
          var index = this.indexMap.get(data.data);
          this.viewArray[index].controller.forward();
          break;
        }
        case "goBack": {
          var index = this.indexMap.get(data.data);
          this.viewArray[index].controller.backward();
          break;
        }
        case "setWebViewRect": {
          var web = data.data;
          var index = this.indexMap.get(web.tag);
          this.viewArray[index].x = px2vp(web.x);
          this.viewArray[index].y = px2vp(web.y);
          this.viewArray[index].w = px2vp(web.w);
          this.viewArray[index].h = px2vp(web.h);
        }
        case "setVisible":
          var web = data.data;
          var index = this.indexMap.get(web.tag);
          this.viewArray[index].visible = web.visible;
          break;
        default: {

        }
      }
    }
  }

  aboutToDisappear(): void {
    console.log('[LIFECYCLE-Index] cocos aboutToDisappear');
//  this.cocosWorker.postMessage({type: "JSPageLifecycle", data: "aboutToAppear"});
//  nativePageLifecycle.aboutToDisappear();
  }

  onPageShow(): void  {
    console.log('[LIFECYCLE-Page] cocos onPageShow');
    nativePageLifecycle.onPageShow();
  }

  onPageHide(): void  {
    console.log('[LIFECYCLE-Page] cocos onPageHide');
    nativePageLifecycle.onPageHide();
  }

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
      XComponent({ id: 'xcomponentId', type: 'surface', libraryname: 'cocos'})
        .onLoad((context) => {
          // Set the cache directory in the ts layer.
          this.cocosWorker.postMessage({type: "onXCLoad", data: "XComponent"});
        })
        .onDestroy(() => {
          console.log('cocos onDestroy')
        })

        ForEach(this.viewArray, (item: ViewInfo, index: number) => {
            CocosWebView({ viewInfo: this.viewArray[index] })
        }, item => item.viewTag)
    }
    .width('100%')
    .height('100%')
  }
}
