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
import nativerender,{context} from 'libcocos.so';

import { WorkerManager } from '../cocos/WorkerManager';
import { ContextType } from '../common/Constants';
import { EditBoxDialog, EditboxShowInfo } from '../components/EditBoxDialog';
import { CocosWebView, LoadType, WebViewInfo } from '../components/CocosWebView';
import { CocosVideoPlayer, VideoInfo } from '../components/CocosVideoPlayer';
import { MessageEvent } from '@ohos.worker';
import { WorkerPort } from '../common/WorkerPort';
import { common, Want } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';

const nativePageLifecycle :context = nativerender.getContext(ContextType.JSPAGE_LIFECYCLE);
const engineUtils :context = nativerender.getContext(ContextType.ENGINE_UTILS);
const mouseWheelNapi :context = nativerender.getContext(ContextType.MOUSE_WHEEL_NAPI);

function executeMethodAsync(nativeFunc: Function, funcData: string, funCb: Function): void {
  nativeFunc && nativeFunc(funcData, funCb);
}
function executeMethodSync(nativeFunc: Function, funcData: string): string|boolean|number {
  return nativeFunc && nativeFunc(funcData);
}
engineUtils.registerFunction("executeMethodAsync", executeMethodAsync);
engineUtils.registerFunction("executeMethodSync", executeMethodSync);
WorkerPort.getInstance().initPort(WorkerManager.getInstance().getWorker());

@Entry
@Component
struct Index {
  @State showInfo: EditboxShowInfo = new EditboxShowInfo;
  @State webViewArray: WebViewInfo[] = [];
  @State videoArray: VideoInfo[] = [];
  private webViewIndexMap: Map<number, number> = new Map<number, number>();
  private videoIndexMap: Map<number, number> = new Map<number, number>();
  private workPort: WorkerPort = WorkerPort.getInstance();
  private panOption: PanGestureOptions = new PanGestureOptions({ direction: PanDirection.Up | PanDirection.Down});
  dialogController: CustomDialogController = new CustomDialogController({
    builder: EditBoxDialog({
      showInfo: this.showInfo,
      workPort: this.workPort,
    }),
    autoCancel: true,
    alignment: DialogAlignment.Bottom,
    customStyle: true,
  })

  aboutToAppear(): void {
    console.log('[LIFECYCLE-Index] cocos aboutToAppear');

    this.workPort?.on("showEditBox", (defaultValue?: string,
      confirmType?: string,
      inputType?: string,
      maxLength?: number,
      x?:number,
      y?:number,
      width?:number,
      height?:number,
      confirmHold?: boolean,
      isMultiline?: boolean,
      fontSize?: number,
      fontColor?: number,
      backColor?: number,
      backgroundColor?: number,
      isBold?: boolean,
      isItalic?: boolean,
      isUnderline?: boolean,
      underlineColor?: number,
      textAlignment?: number) => {
      //let param = msg.param as editboxShowInfo;
      this.showInfo.defaultMessage = defaultValue!;
      this.showInfo.backgroundColor = backColor!;
      if(confirmType == 'done') {
        this.showInfo.enterKeyType = EnterKeyType.Done;
      } else if(confirmType == 'send') {
        this.showInfo.enterKeyType = EnterKeyType.Send;
      } else if(confirmType == 'search') {
        this.showInfo.enterKeyType = EnterKeyType.Search;
      } else if(confirmType == 'go') {
        this.showInfo.enterKeyType = EnterKeyType.Go;
      } else if(confirmType == 'next') {
        this.showInfo.enterKeyType = EnterKeyType.Next;
      } else {
        this.showInfo.enterKeyType = EnterKeyType.Done;
      }
      if(inputType == 'password') {
        this.showInfo.type = InputType.Password;
      } else if(inputType === 'email') {
        this.showInfo.type = InputType.Email;
      } else if(inputType === 'number') {
        this.showInfo.type = InputType.Number;
      } else if(inputType === 'digit') {
        this.showInfo.type = InputType.NUMBER_DECIMAL;
      } else if(inputType === 'tel') {
        this.showInfo.type = InputType.PhoneNumber;
      } else if(inputType === 'url') {
        // No url support
      } else {
        this.showInfo.type = InputType.Normal;
      }
      if(maxLength != undefined && maxLength > 0) {
        this.showInfo.maxLength = maxLength;
      } else {
        this.showInfo.maxLength =  65536;
      }

      if(isUnderline != undefined) {
        this.showInfo.showUnderline = isUnderline;
        this.showInfo.underLineColor = underlineColor as number;
      } else {
        this.showInfo.showUnderline = false;
      }

      if(textAlignment == 0) {
        this.showInfo.textAlign = TextAlign.Start;
      } else if(textAlignment == 1) {
        this.showInfo.textAlign = TextAlign.Center;
      } else if(textAlignment == 2) {
        this.showInfo.textAlign = TextAlign.End;
      } else {
        this.showInfo.textAlign = TextAlign.Start;
      }
      this.dialogController?.open();
    });

    this.workPort?.on("hideEditBox",() => {
      this.showInfo.defaultMessage = '';
      this.dialogController?.close();
    });

    this.workPort?.on("createWebView",(tag: number) => {
      this.webViewArray.push(new WebViewInfo(0, 0, 0, 0, tag));
      this.webViewIndexMap.set(tag, this.webViewArray.length - 1);
    });
    this.workPort?.on("removeWebView",(tag: number) => {
      if (this.webViewArray.length > 0) {
        this.webViewArray.splice(this.webViewIndexMap.get(tag) as number, 1);
      }
    });
    this.workPort?.on("loadUrl",(tag: number, url: string) => {
      let index = this.webViewIndexMap.get(tag) as number;
      if(this.webViewArray[index].isInited) {
        this.webViewArray[index].controller.loadUrl(url);
      } else {
        this.webViewArray[index].url = url;
        this.webViewArray[index].loadType = LoadType.URL;
      }
    });
    this.workPort?.on("loadHTMLString",(tag: number, contents: string, baseUrl: string) => {
      let index = this.webViewIndexMap.get(tag) as number;
      if(this.webViewArray[index].isInited) {
        this.webViewArray[index].controller.loadData(
          contents,
          "text/html",
          "UTF-8",
          baseUrl
        );
      } else {
        this.webViewArray[index].contents = contents;
        this.webViewArray[index].baseUrl = baseUrl;
        this.webViewArray[index].loadType = LoadType.HTML_STRING;
      }
    });
    this.workPort?.on("loadData",(tag: number,
                                  contents: string,
                                  mimeType: string,
                                  encoding: string,
                                  baseUrl: string) => {
      let index = this.webViewIndexMap.get(tag) as number;
      if(this.webViewArray[index].isInited) {
        this.webViewArray[index].controller.loadData(
          contents as string,
          mimeType as string,
          encoding as string,
          baseUrl as string
        );
      } else {
        this.webViewArray[index].contents = contents;
        this.webViewArray[index].mimeType = mimeType;
        this.webViewArray[index].encoding = encoding;
        this.webViewArray[index].baseUrl = baseUrl;
        this.webViewArray[index].loadType = LoadType.DATA;
      }

    });
    this.workPort?.on("evaluateJS",(tag: number, jsContents: string) => {
      let index = this.webViewIndexMap.get(tag) as number;
      if(this.webViewArray[index].isInited) {
        this.webViewArray[index].controller.runJavaScript(jsContents);
      } else {
        this.webViewArray[index].jsContents = jsContents;
      }

    });

    this.workPort?.on("reload",(tag: number) => {
      let index = this.webViewIndexMap.get(tag) as number;
      if(this.webViewArray[index].isInited) {
        this.webViewArray[index].controller.refresh();
      } else {
        console.warn('The webview is not initialized.');
      }
    });

    this.workPort?.on("stopLoading",(tag: number) => {
      let index = this.webViewIndexMap.get(tag) as number;
      if(this.webViewArray[index].isInited) {
        this.webViewArray[index].controller.stop();
      } else {
        console.warn('The webview is not initialized.');
      }
    });
    this.workPort?.on("canGoForward",(tag: number) => {
      let index = this.webViewIndexMap.get(tag) as number;
      this.webViewArray[index].controller.accessForward();
    });
    this.workPort?.on("canGoBack",(tag: number) => {
      let index = this.webViewIndexMap.get(tag) as number;
      this.webViewArray[index].controller.accessBackward();
    });
    this.workPort?.on("goForward",(tag: number) => {
      let index = this.webViewIndexMap.get(tag) as number;
      if(this.webViewArray[index].isInited) {
        this.webViewArray[index].controller.forward();
      } else {
        console.warn('The webview is not initialized.');
      }
    });
    this.workPort?.on("goBack",(tag: number) => {
      let index = this.webViewIndexMap.get(tag) as number;
      if(this.webViewArray[index].isInited) {
        this.webViewArray[index].controller.backward();
      } else {
        console.warn('The webview is not initialized.');
      }
    });
    this.workPort?.on("setWebViewRect",(tag: number, x: number,y: number,w: number,h: number) => {
      let index = this.webViewIndexMap.get(tag as number) as number;
      this.webViewArray[index].x = px2vp(x as number) as number;
      this.webViewArray[index].y = px2vp(y as number) as number;
      this.webViewArray[index].w = px2vp(w as number) as number;
      this.webViewArray[index].h = px2vp(h as number) as number;
    });
    this.workPort?.on("setVisible",(tag: number, visible: boolean) => {
      let index = this.webViewIndexMap.get(tag) as number;
      this.webViewArray[index].visible = visible as boolean;
    });

    this.workPort?.on("createVideo",(tag: number) => {
      this.videoArray.push(new VideoInfo(0, 0, 0, 0, tag));
      this.videoIndexMap.set(tag, this.videoArray.length - 1);
    });
    this.workPort?.on("removeVideo",(tag: number) => {
      if (this.videoArray.length > 0) {
        this.videoArray.splice(this.videoIndexMap.get(tag) as number, 1);
      }
    });
    this.workPort?.on("setVideoUrl",(tag: number, resourceType:number, url: string) => {
      let index = this.videoIndexMap.get(tag) as number;
      if (resourceType == 1) {
        url = 'Resources/' + url;
        this.videoArray[index].url = $rawfile(url);
      } else {
        this.videoArray[index].url = url;
      }
    });

    this.workPort?.on("setVideoRect",(tag: number, x: number,y: number,w: number,h: number) => {
      let index = this.videoIndexMap.get(tag as number) as number;
      this.videoArray[index].x = px2vp(x as number) as number;
      this.videoArray[index].y = px2vp(y as number) as number;
      this.videoArray[index].w = px2vp(w as number) as number;
      this.videoArray[index].h = px2vp(h as number) as number;
    });
    this.workPort?.on("startVideo",(tag: number) => {
      let index = this.videoIndexMap.get(tag) as number;
      if(this.videoArray[index].duration){
        this.videoArray[index].controller.start();
      }else{
        this.videoArray[index].isPreparedStart = true;
      }
    });
    this.workPort?.on("pauseVideo",(tag: number) => {
      let index = this.videoIndexMap.get(tag) as number;
      this.videoArray[index].controller.pause();
    });
    this.workPort?.on("stopVideo",(tag: number) => {
      let index = this.videoIndexMap.get(tag) as number;
      this.videoArray[index].controller.stop();
    });
    this.workPort?.on("resumeVideo",(tag: number) => {
      let index = this.videoIndexMap.get(tag) as number;
      this.videoArray[index].controller.start();
    });
    this.workPort?.on("getVideoDuration",(tag: number) => {
      let index = this.videoIndexMap.get(tag) as number;
      return this.videoArray[index].duration;
    });
    this.workPort?.on("seekVideoTo",(tag: number, time: number) => {
      let index = this.videoIndexMap.get(tag) as number;
      this.videoArray[index].controller.setCurrentTime(time, SeekMode.Accurate);
    });
    
    this.workPort?.on("setVideoVisible",(tag: number, visible: boolean) => {
      let index = this.videoIndexMap.get(tag) as number;
      this.videoArray[index].visible = visible as boolean;
    });

    this.workPort?.on("setFullScreenEnabled",(tag: number, fullScreen: boolean) => {
      let index = this.videoIndexMap.get(tag) as number;
      this.videoArray[index].isFullScreen = fullScreen;
    });

    this.workPort?.on("currentTime",(tag: number) => {
      let index = this.videoIndexMap.get(tag) as number;
      return this.videoArray[index].currentTime;
    });

    this.workPort?.on("exitGame",() => {
      this.terminateSelf();
    });

    this.workPort?.on("openUrl", (url: string) => {
      let context = getContext() as common.UIAbilityContext;

      let trimmedUrl = url.trim();
      const schemeRegex  = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
      if (!schemeRegex.test(trimmedUrl)) {
        trimmedUrl = "https://" + trimmedUrl;
      }
      let wantInfo: Want = {
        'action': 'ohos.want.action.viewData',
        'entities': ['entity.system.browsable'],
        'uri': trimmedUrl,
        'parameters': {
          'ohos.ability.params.showDefaultPicker': true
        }
      }
      context.startAbility(wantInfo).then(()=>{
        console.log('openUrl success');
      }).catch((err: BusinessError)=>{
        console.warn('openUrl err:', err.code, err.message);
      })
    })
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

  onBackPress() {
    console.log("[LIFECYCLE-Page] cocos onBackPress");
    this.workPort.postMessage("backPress");
    // If disable system exit needed, remove comment "return true"
    // return true;
  }

  terminateSelf() {
    try {
      (getContext(this) as common.UIAbilityContext).terminateSelf((err: BusinessError) => {
        if (err.code) {
          console.error(`terminateSelf failed, code is ${err.code}, message is ${err.message}`);
          return;
        }
        console.info('terminateSelf succeed');
      });
    } catch (err) {
      let code = (err as BusinessError).code;
      let message = (err as BusinessError).message;
      console.error(`terminateSelf failed, code is ${code}, message is ${message}`);
    }
  }

  onMouseWheel(eventType: string, event: PanGestureEvent) {
      if(event.source == SourceType.Mouse) {
        mouseWheelNapi.onMouseWheel(eventType, event.offsetY);
      }
  }

  build() {
    Flex({
      direction: FlexDirection.Column,
      alignItems: ItemAlign.Center,
      justifyContent: FlexAlign.Center
    } as FlexOptions) {
      XComponent({ id: 'xcomponentId', type: 'surface', libraryname: 'cocos' })
        .focusable(true)
        .defaultFocus(true)
        .gesture(
          PanGesture(this.panOption)
            .onActionStart((event: GestureEvent) => {
              this.onMouseWheel("actionStart", event);
            })
            .onActionUpdate((event: GestureEvent) => {
              this.onMouseWheel("actionUpdate", event);
            })
            .onActionEnd((event: GestureEvent) => {
              this.onMouseWheel("actionEnd", event);
            })
        )
        .onLoad((context) => {
          // Set the cache directory in the ts layer.
          this.workPort.postMessage("onXCLoad");
        })
        .onDestroy(() => {
          console.log('cocos onDestroy')
        })

      ForEach(this.webViewArray, (item: WebViewInfo) => {
        CocosWebView({ viewInfo: item, workPort: this.workPort })
      }, (item: WebViewInfo): string => item.viewTag.toString())

      ForEach(this.videoArray, (item: VideoInfo) => {
        CocosVideoPlayer({ videoInfo: item, workPort: this.workPort })
      }, (item: VideoInfo): string => item.viewTag.toString())
    }
    .width('100%')
    .height('100%')
  }
}
