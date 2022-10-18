import Ability from '@ohos.application.Ability'
import nativerender from "libcocos.so";
import { ContextType } from "../common/Constants"
import resourceManager from '@ohos.resourceManager';

const nativeContext = nativerender.getContext(ContextType.ENGINE_UTILS);

const nativeAppLifecycle = nativerender.getContext(ContextType.APP_LIFECYCLE);
export default class MainAbility extends Ability {
    onCreate(want, launchParam) {
        console.log("[Demo] MainAbility onCreate")
        globalThis.abilityWant = want;
        nativeAppLifecycle.onCreate();
        nativeContext.resourceManagerInit(this.context.resourceManager);
    }

    onDestroy() {
        nativeAppLifecycle.onDestroy();
    }

    onWindowStageCreate(windowStage) {
        // Main window is created, set main page for this ability
        console.log("[Demo] MainAbility onWindowStageCreate")

        windowStage.loadContent("pages/index", (err, data) => {
            if (err.code) {
                console.error('Failed to load the content. Cause:' + JSON.stringify(err));
                return;
            }
            console.info('Succeeded in loading the content. Data: ' + JSON.stringify(data))
        });
        nativeContext.writablePathInit(this.context.cacheDir);
    }

    onWindowStageDestroy() {
        // Main window is destroyed, release UI related resources
        console.log("[Demo] MainAbility onWindowStageDestroy")
    }

    onForeground() {
        // Ability has brought to foreground
        console.log("[Demo] MainAbility onForeground")
        nativeAppLifecycle.onShow();
    }

    onBackground() {
        // Ability has back to background
        console.log("[Demo] MainAbility onBackground")
        nativeAppLifecycle.onHide();
    }
};
