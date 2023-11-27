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
import nativerender from "libcocos.so";

import { WorkerManager } from '../cocos/WorkerManager'
import { ContextType } from "../common/Constants"
import { EditBoxDialog } from '../components/EditBoxDialog'
import { WebViewInfo, CocosWebView } from '../components/CocosWebView'
import { VideoInfo, CocosVideoPlayer } from '../components/CocosVideoPlayer'

import {PortProxy} from '../common/PortProxy'
import { MessageEvent } from '@ohos.worker';
const nativePageLifecycle = nativerender.getContext(ContextType.JSPAGE_LIFECYCLE);

interface WorkerMessage {
  type: string,
  data: data
}

interface data {
  id: string,
  name: string,
  param: number | string | param
}

interface param {
  tag?: number,
  url?: string,
  contents?: string,
  mimeType?: string,
  encoding?: string,
  baseUrl?: string,
  jsContents?: string,
  x?: number,
  y?: number,
  w?: number,
  h?: number,
  visible?: boolean,
  resourceType?: number,
  time?: number,
  fullScreen?: boolean
}

@Entry
@Component
struct Index {
  @State showMessage: string = ''
  @State webViewArray: WebViewInfo[] = [];
  @State videoArray:VideoInfo[] = [];
  private webViewIndexMap: Map<number, number> = new Map<number, number>();
  private videoIndexMap: Map<number, number> = new Map<number, number>();
   
  private workPort : PortProxy = new PortProxy(WorkerManager.getInstance().getWorker());
  dialogController: CustomDialogController = new CustomDialogController({
    builder: EditBoxDialog({
      showMessage: this.showMessage,
      onTextChange: (msg: string) => {
        this.showMessage = msg;
        this.workPort.postMessage('onTextInput', msg)
      },
      accept: (msg: string) => {
        this.showMessage = msg;
        this.workPort.postMessage('onComplete', msg)
      },
    }),
    cancel: () => {
      this.workPort.postMessage('onComplete', this.showMessage)
    },
    autoCancel: true,
    alignment: DialogAlignment.Bottom,
    customStyle: true,
  })

  aboutToAppear(): void  {
    console.log('[LIFECYCLE-Index] cocos aboutToAppear');
    this.workPort._messageHandle = async (e:MessageEvent<WorkerMessage>): Promise<void> => {
      let data:WorkerMessage = e.data;
      let msg = data.data;
      let result:boolean | string | number | null = null;
      switch (msg.name) {
        // EditBox
        case "showEditBox": {
          this.showMessage = msg.param as string;
          this.dialogController.open();
          break;
        }
        case "hideEditBox": {
          this.showMessage = '';
          this.dialogController.close();
          break;
        }
        // WebView
        case "createWebView": {
          this.webViewArray.push(new WebViewInfo(0, 0, 0, 0, msg.param as number));
          this.webViewIndexMap.set(msg.param as number, this.webViewArray.length - 1);
          break;
        }
        case "removeWebView": {
          if (this.webViewArray.length > 0) {
            this.webViewArray.splice(this.webViewIndexMap.get(msg.param as number) as number, 1);
          }
          break;
        }
        case "loadUrl": {
          let web = msg.param as param;
          let index = this.webViewIndexMap.get(web?.tag as number) as number;
          this.webViewArray[index].controller.loadUrl({url: web?.url as string});
          break;
        }
        case "loadHTMLString": {
          let web = msg.param as param;
          let index = this.webViewIndexMap.get(web?.tag as number) as number;
          this.webViewArray[index].controller.loadData({data: web?.contents as string, mimeType:"text/html",encoding:"UTF-8", baseUrl:web?.baseUrl});
          break;
        }
        case "loadData": {
          let web = msg.param as param;
          let index = this.webViewIndexMap.get(web?.tag as number) as number;
          this.webViewArray[index].controller.loadData({data: web?.contents as string, mimeType:web?.mimeType as string,encoding:web?.encoding as string, baseUrl:web?.baseUrl as string});
          break;
        }
        case "evaluateJS": {
          let web = msg.param as param;
          let index = this.webViewIndexMap.get(web?.tag as number) as number;
          this.webViewArray[index].controller.runJavaScript({
            script: web?.jsContents as string
          });
          break;
        }
        case "reload": {
          let index = this.webViewIndexMap.get(msg.param as number) as number;
          this.webViewArray[index].controller.refresh();
          break;
        }
        case "stopLoading": {
          let index = this.webViewIndexMap.get(msg.param as number) as number;
          this.webViewArray[index].controller.stop();
          break;
        }
        case "canGoForward": {
          let index = this.webViewIndexMap.get(msg.param as number) as number;
          result = this.webViewArray[index].controller.accessForward();
          break;
        }
        case "canGoBack": {
          let index = this.webViewIndexMap.get(msg.param as number) as number;
          result = this.webViewArray[index].controller.accessBackward();
          break;
        }
        case "goForward": {
          let index = this.webViewIndexMap.get(msg.param as number) as number;
          this.webViewArray[index].controller.forward();
          break;
        }
        case "goBack": {
          let index = this.webViewIndexMap.get(msg.param as number) as number;
          this.webViewArray[index].controller.backward();
          break;
        }
        case "setWebViewRect": {
          let web = msg.param as param;
          let index = this.webViewIndexMap.get(web?.tag as number) as number;
          this.webViewArray[index].x = px2vp(web?.x as number) as number;
          this.webViewArray[index].y = px2vp(web?.y as number) as number;
          this.webViewArray[index].w = px2vp(web?.w as number) as number;
          this.webViewArray[index].h = px2vp(web?.h as number) as number;
        }
        case "setVisible":
          let web = msg.param as param;
          let index = this.webViewIndexMap.get(web?.tag as number) as number;
          this.webViewArray[index].visible = web?.visible as boolean;
          break;
        // video
        case "createVideo":
          this.videoArray.push(new VideoInfo(0, 0, 0, 0, msg.param as number))
          this.videoIndexMap.set(msg.param as number, this.videoArray.length - 1);
          break;
        case "removeVideo":
          if (this.videoArray.length > 0) {
            this.videoArray.splice(this.videoIndexMap.get(msg.param as number) as number, 1);
          }
          break;
        case "setVideoUrl":{
          let video = msg.param as param;
          const reg:RegExp = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
          let resourceType = reg.test(video?.url) ? 0 : 1;
          let index = this.videoIndexMap.get(video?.tag as number) as number;
          if (resourceType == 1) {
            this.videoArray[index].url = $rawfile("Resources/" + video?.url as string);
          } else {
            this.videoArray[index].url = video?.url as string;
          }
          break;
        }
        case "setVideoRect": {
          let video = msg.param as param;
          let index = this.videoIndexMap.get(video?.tag as number) as number;
          this.videoArray[index].x = px2vp(video?.x as number) as number;
          this.videoArray[index].y = px2vp(video?.y as number) as number;
          this.videoArray[index].w = px2vp(video?.w as number) as number;
          this.videoArray[index].h = px2vp(video?.h as number) as number;
          break;
        }
        case "startVideo": {
          let index = this.videoIndexMap.get(msg.param as number) as number;
          this.videoArray[index].controller.start();
          break;
        }
        case "pauseVideo" : {
          let index = this.videoIndexMap.get(msg.param as number) as number;
          this.videoArray[index].controller.pause();
          break;
        }
        case "stopVideo" : {
          let index = this.videoIndexMap.get(msg.param as number) as number;
          this.videoArray[index].controller.stop();
          break;
        }
        case "resumeVideo": {
          let index = this.videoIndexMap.get(msg.param as number) as number;
          this.videoArray[index].controller.start();
          break;
        }
        case "getVideoDuration": {
          let index = this.videoIndexMap.get(msg.param as number) as number;
          result = this.videoArray[index].duration;
          break;
        }
        case "seekVideoTo" : {
          let video = msg.param as param;
          let index = this.videoIndexMap.get(video?.tag as number) as number;
          this.videoArray[index].controller.setCurrentTime(video?.time as number, SeekMode.Accurate);
          break;
        }
        case "setVideoVisible" : {
          let video = msg.param as param;
          let index = this.videoIndexMap.get(video?.tag as number) as number;
          this.videoArray[index].visible = video.visible as boolean;
          break;
        }
        case "setFullScreenEnabled": {
          let video = msg.param as param;
          let index = this.videoIndexMap.get(video?.tag as number) as number;
          this.videoArray[index].isFullScreen = video.fullScreen as boolean;
          break;
        }
        case "currentTime": {
          let index = this.videoIndexMap.get(msg.param as number) as number;
          result = this.videoArray[index].currentTime;
        }
        default: {

        }
      }
      if (result != null || result != undefined) {
        this.workPort.postReturnMessage(data, result);
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
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center } as FlexOptions) {
      XComponent({ id: 'xcomponentId', type: 'surface', libraryname: 'cocos'})
        .onLoad((context) => {
          // Set the cache directory in the ts layer.
          this.workPort.postMessage("onXCLoad", "XComponent");
        })
        .onDestroy(() => {
          console.log('cocos onDestroy')
        })

        ForEach(this.webViewArray, (item: WebViewInfo) => {
            CocosWebView({ viewInfo: item, workPort: this.workPort})
        }, (item: WebViewInfo): string => item.viewTag.toString())

        ForEach(this.videoArray, (item: VideoInfo) => {
          CocosVideoPlayer({ videoInfo: item, workPort: this.workPort})
        }, (item: VideoInfo): string => item.viewTag.toString())
    }
    .width('100%')
    .height('100%')
  }
}
