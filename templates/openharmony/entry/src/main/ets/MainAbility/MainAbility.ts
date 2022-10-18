import Ability from '@ohos.application.Ability'
import nativerender from "libcocos.so";
import { ContextType } from "../common/Constants"
import resourceManager from '@ohos.resourceManager';

const nativeContext = nativerender.getContext(ContextType.ENGINE_UTILS);

const nativeAppLifecycle = nativerender.getContext(ContextType.APP_LIFECYCLE);
export default class MainAbility extends Ability {
    onCreate(want, launchParam) {
        globalThis.abilityWant = want;
        nativeAppLifecycle.onCreate();
        nativeContext.resourceManagerInit(this.context.resourceManager);
    }

    onDestroy() {
        nativeAppLifecycle.onDestroy();
    }

    onWindowStageCreate(windowStage) {
        // Main window is created, set main page for this ability
        windowStage.loadContent("pages/index", (err, data) => {
            if (err.code) {
                console.error('Failed to load the content. Cause:' + JSON.stringify(err));
                return;
            }
        });
        nativeContext.writablePathInit(this.context.cacheDir);
    }

    onWindowStageDestroy() {
    }

    onForeground() {
        // Ability has brought to foreground
        nativeAppLifecycle.onShow();
    }

    onBackground() {
        // Ability has back to background
        nativeAppLifecycle.onHide();
    }
};
