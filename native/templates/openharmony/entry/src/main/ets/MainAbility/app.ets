import nativerender from "libcocos2d.so";
import { ContextType } from "./common/Constants"
import {log} from './cocos/log_utils'
import resourceManager from '@ohos.resourceManager';


const nativeContext = nativerender.getContext(ContextType.ENGINE_UTILS);
resourceManager.getResourceManager().then(resMgr => {
  nativeContext.resourceManagerInit(resMgr);
}).catch(err => {
  console.log("cocos getResourceManager error = " + err);
});

const nativeAppLifecycle = nativerender.getContext(ContextType.APP_LIFECYCLE);
export default {
  onCreate() {
    console.info('[LIFECYCLE-App] cocos onCreate')
    nativeAppLifecycle.onCreate();

  },
  onShow() {
    console.info('[LIFECYCLE-App] cocos onShow')
    nativeAppLifecycle.onShow();
  },
  onHide() {
    console.info('[LIFECYCLE-App] cocos onHide')
    nativeAppLifecycle.onHide();
  },
  onDestroy() {
    console.info('[LIFECYCLE-App] cocos onDestroy')
    nativeAppLifecycle.onDestroy();
  },
}