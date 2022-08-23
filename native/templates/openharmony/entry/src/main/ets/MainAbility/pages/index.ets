import nativerender from "libcocos.so";

import { WorkerManager } from '../cocos/WorkerManager'
import { ContextType } from "../common/Constants"
import {log} from '../cocos/log_utils'
import featureAbility from '@ohos.ability.featureAbility'

const nativePageLifecycle = nativerender.getContext(ContextType.JSPAGE_LIFECYCLE);
const engineUtils = nativerender.getContext(ContextType.ENGINE_UTILS);

@Entry
@Component
struct Index {
  context = null;

  cocosWorker = WorkerManager.getInstance().getWorker();
  aboutToAppear(): void  {
    console.log('[LIFECYCLE-Index] cocos aboutToAppear');
//    this.cocosWorker.postMessage({type: "JSPageLifecycle", data: "aboutToAppear"});
//    nativePageLifecycle.aboutToAppear();
  }

  aboutToDisappear(): void {
    console.log('[LIFECYCLE-Index] cocos aboutToDisappear');
//    this.cocosWorker.postMessage({type: "JSPageLifecycle", data: "aboutToAppear"});
//    nativePageLifecycle.aboutToDisappear();
  }

  onPageShow(): void  {
    console.log('[LIFECYCLE-Page] cocos onPageShow');
//    this.cocosWorker.postMessage({type: "JSPageLifecycle", data: "onPageShow"});
    nativePageLifecycle.onPageShow();
  }

  onPageHide(): void  {
    console.log('[LIFECYCLE-Page] cocos onPageHide');
//    this.cocosWorker.postMessage({type: "JSPageLifecycle", data: "onPageHide"});
    nativePageLifecycle.onPageHide();
  }

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center }) {
      XComponent({ id: 'xcomponentId', type: 'surface', libraryname: 'cocos'})
        .onLoad((context) => {
          // Set the cache directory in the ts layer.
          var cacheContext = featureAbility.getContext();
          cacheContext.getCacheDir((err, data) => {
            if (err.code != 0) {
              return;
            }
            engineUtils.writablePathInit(data);
          });

          // HACK: delay to post massage to wait for worker launching.
          setTimeout(() => {
            log('post msg when XCLoad');
            console.log('cocos xcomponent onLoad');
            this.context = context;
            this.cocosWorker.postMessage({type: "onXCLoad", data: "XComponent"});
          }, 500)

        })
        .onDestroy(() => {
          console.log('cocos onDestroy')
        })
   }
    .width('100%')
    .height('100%')
  }
}
