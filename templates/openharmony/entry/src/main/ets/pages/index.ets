import nativerender from "libcocos.so";

import { WorkerManager } from '../cocos/WorkerManager'
import { ContextType } from "../common/Constants"
import featureAbility from '@ohos.ability.featureAbility'
import { EditBoxDialog } from '../components/EditBoxDialog'
const nativePageLifecycle = nativerender.getContext(ContextType.JSPAGE_LIFECYCLE);
const engineUtils = nativerender.getContext(ContextType.ENGINE_UTILS);

@Entry
@Component
struct Index {
  @State showMessage: string = ''
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
        default: {

        }
      }
    }
//  this.cocosWorker.postMessage({type: "JSPageLifecycle", data: "aboutToAppear"});
//  nativePageLifecycle.aboutToAppear();
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
    }
    .width('100%')
    .height('100%')
  }
}
