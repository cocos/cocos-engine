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
import UIAbility from '@ohos.app.ability.UIAbility';
import nativerender from "libcocos.so";
import { ContextType } from "../common/Constants"
import window from '@ohos.window';
import resourceManager from '@ohos.resourceManager';
//import avsession from '@ohos.multimedia.avsession';

const nativeContext = nativerender.getContext(ContextType.ENGINE_UTILS);
const nativeAppLifecycle = nativerender.getContext(ContextType.APP_LIFECYCLE);

export default class MainAbility extends UIAbility {
    onCreate(want, launchParam) {
        globalThis.abilityWant = want;
        nativeAppLifecycle.onCreate();
        nativeContext.resourceManagerInit(this.context.resourceManager);
        let tag = "createAudioSession";
        // TODO(qgh): This is a temporary fix for audio not continuing to play when switching from background to foreground.
        // The principle of the fix is to allow the app to continue playing audio after switching background, similar to music apps.
        // After a while it will be killed by the system.
        // This will cause a crash on harmonyos.
        // avsession.createAVSession(this.context, tag, 'audio').then(async (session) =>{
        //     globalThis.avsessionManager = session;
        //     await globalThis.avsessionManager.activate();
        // })
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
        // Set full screen
        windowStage.getMainWindow().then((window: window.Window) => {
            window.setWindowSystemBarEnable([]);
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
