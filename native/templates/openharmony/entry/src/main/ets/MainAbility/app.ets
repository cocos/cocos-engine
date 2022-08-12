import nativerender from "libcocos2d.so";
import { ContextType } from "./common/Constants"
import {log} from './cocos/log_utils'
import resourceManager from '@ohos.resourceManager';


log('===========================================')

log('get engine_utils 1');
const nativeContext = nativerender.getContext(ContextType.ENGINE_UTILS);

log('get engine_utils 2');

resourceManager.getResourceManager().then(resMgr => {
  console.log('pptest get reousrce manager 1');
  nativeContext.resourceManagerInit(resMgr);
  console.log('pptest get reousrce manager 2');
}).catch(err => {
    console.log("kee cocos getResourceManager error = " + err);
});

const nativeAppLifecycle = nativerender.getContext(ContextType.APP_LIFECYCLE);
export default {
  onCreate() {
    console.info('[LIFECYCLE-App] kee cocos onCreate')
    nativeAppLifecycle.onCreate();

  },
  onShow() {
    console.info('[LIFECYCLE-App] kee cocos onShow')
    nativeAppLifecycle.onShow();
  },
  onHide() {
    console.info('[LIFECYCLE-App] kee cocos onHide')
    nativeAppLifecycle.onHide();
  },
  onDestroy() {
    console.info('[LIFECYCLE-App] kee cocos onDestroy')
    nativeAppLifecycle.onDestroy();
  },
}