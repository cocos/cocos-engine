import nativerender from "libcocos.so";

import { WorkerManager } from '../cocos/WorkerManager'
import { ContextType } from "../common/Constants"
import featureAbility from '@ohos.ability.featureAbility'

const nativePageLifecycle = nativerender.getContext(ContextType.JSPAGE_LIFECYCLE);
const engineUtils = nativerender.getContext(ContextType.ENGINE_UTILS);

@Entry
@Component
struct Index {

  cocosWorker = WorkerManager.getInstance().getWorker();
  aboutToAppear(): void  {
    console.log('[LIFECYCLE-Index] cocos aboutToAppear');
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
