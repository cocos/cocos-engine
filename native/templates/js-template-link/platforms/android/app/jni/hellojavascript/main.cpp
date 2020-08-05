/****************************************************************************
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
#include <jni.h>
#include <android_native_app_glue.h>
#include <android/log.h>
#include <unordered_map>
#include "platform/android/jni/JniHelper.h"
#include "platform/android/CCView.h"
#include "Game.h"

#define LOG_TAG "main"
#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG, LOG_TAG, __VA_ARGS__)

namespace
{
    Game *game = nullptr;

    /**
 * Shared state for our app.
 */
    struct SavedState {
        struct android_app* app = nullptr;
        int animating = 0;
    };
}

void handle_cmd(struct android_app* app, int32_t cmd)
{
    struct SavedState* state = (struct SavedState*)app->userData;
    switch (cmd)
    {
        case APP_CMD_INIT_WINDOW:
            if (state->app->window && !game)
            {
                auto width = ANativeWindow_getWidth(app->window);
                auto height = ANativeWindow_getHeight(app->window);
                game = new Game(width, height);
                game->init();
            }
            break;
        case APP_CMD_LOST_FOCUS:
            state->animating = 0;
            break;
        case APP_CMD_GAINED_FOCUS:
            state->animating = 1;
            break;
        default:
            break;
    }

    cc::View::engineHandleCmd(app, cmd);
}

void android_main(struct android_app* state) {
    struct SavedState savedState;
    memset(&savedState, 0, sizeof(savedState));
    state->userData = &savedState;
    state->onAppCmd = handle_cmd;
    state->onInputEvent = cc::View::engineHandleInput;
    savedState.app = state;
    cc::JniHelper::setAndroidApp(state);

    while (1)
    {
        // Read all pending events.
        int ident;
        int events;
        struct android_poll_source* source;

        // If not animating, we will block forever waiting for events.
        // If animating, we loop until all events are read, then continue
        // to draw the next frame of animation.
        while ((ident = ALooper_pollAll(savedState.animating ? 0 : -1, NULL, &events,
                                        (void**)&source)) >= 0)
        {

            // Process this event.
            if (source != nullptr)
                source->process(state, source);
        }

        if (state->destroyRequested != 0)
            return;

        cc::JniHelper::callStaticVoidMethod("org.cocos2dx.lib.Cocos2dxHelper", "flushTasksOnGameThread");

        if (savedState.animating)
            game->tick();
    }
}