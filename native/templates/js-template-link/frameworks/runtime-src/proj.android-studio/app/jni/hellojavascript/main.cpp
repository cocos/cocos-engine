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
#include "platform/android/CCFileUtils-android.h"
#include "platform/android/jni/JniHelper.h"
#include "Game.h"
#include "scripting/js-bindings/event/EventDispatcher.h"

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
        int32_t width = 0;
        int32_t height = 0;
    };

    void engineHandleCmd(struct android_app* app, int32_t cmd)
    {
        struct SavedState* state = (struct SavedState*)app->userData;
        switch (cmd)
        {
            case APP_CMD_INIT_WINDOW:
                if (state->app->window)
                {
                    state->width = ANativeWindow_getWidth(app->window);
                    state->height = ANativeWindow_getHeight(app->window);
                    game = new Game(state->width, state->height);
                    game->init();
                }
                break;
            case APP_CMD_TERM_WINDOW:
                state->animating = 0;
                break;
            case APP_CMD_GAINED_FOCUS:
                state->animating = 1;
                break;
            case APP_CMD_LOST_FOCUS:
                state->animating = 0;
                break;
            case APP_CMD_PAUSE:
                cocos2d::Application::getInstance()->onPause();
                break;
            case APP_CMD_RESUME:
                cocos2d::Application::getInstance()->onResume();
                break;
            default:
                break;
        }
    }

    void dispatchTouchEvent(int index, AInputEvent* event, cocos2d::TouchEvent& touchEvent) {
        int pointerID = AMotionEvent_getPointerId(event, index);
        touchEvent.touches.push_back({
            AMotionEvent_getX(event, index), // x
            AMotionEvent_getY(event, index), // y
            pointerID});

        cocos2d::EventDispatcher::dispatchTouchEvent(touchEvent);
    }

    void dispatchTouchEvents(AInputEvent* event, cocos2d::TouchEvent& touchEvent) {
        size_t pointerCount = AMotionEvent_getPointerCount(event);
        for (size_t i = 0; i < pointerCount; ++i) {
            touchEvent.touches.push_back({
                AMotionEvent_getX(event, i),
                AMotionEvent_getY(event, i),
                AMotionEvent_getPointerId(event, i)
            });
        }

        cocos2d::EventDispatcher::dispatchTouchEvent(touchEvent);
    }

    // key values in web, refer to http://docs.cocos.com/creator/api/en/enums/KEY.html
    std::unordered_map<int, int> keyCodeMap = {
            {AKEYCODE_BACK, 6},
            {AKEYCODE_ENTER, 13},
            {AKEYCODE_MENU, 18},
            {AKEYCODE_DPAD_UP, 1003},
            {AKEYCODE_DPAD_DOWN, 1004},
            {AKEYCODE_DPAD_LEFT, 1000},
            {AKEYCODE_DPAD_RIGHT, 1001},
            {AKEYCODE_DPAD_CENTER, 1005}
    };

    /**
     * Process the next input event.
     */
    int32_t engineHandleInput(struct android_app* app, AInputEvent* event) {
        int type = AInputEvent_getType(event);

        if(type == AINPUT_EVENT_TYPE_KEY){
            int action = AKeyEvent_getAction(event);
            if (action == AKEY_EVENT_ACTION_MULTIPLE)
                return 0;

            int keyCode = AKeyEvent_getKeyCode(event);
            if (keyCodeMap.count(keyCode) > 0)
                keyCode = keyCodeMap[keyCode];
            else
                keyCode = 0;

            cocos2d::KeyboardEvent keyboardEvent;
            keyboardEvent.key = keyCode;
            keyboardEvent.action = action == AKEY_EVENT_ACTION_DOWN
                                             ? cocos2d::KeyboardEvent::Action::RELEASE
                                             : cocos2d::KeyboardEvent::Action::PRESS;
            cocos2d::EventDispatcher::dispatchKeyboardEvent(keyboardEvent);

            return 1;
        } else if (type == AINPUT_EVENT_TYPE_MOTION){
            cocos2d::TouchEvent touchEvent;
            int action = AMotionEvent_getAction(event);

            switch (action & AMOTION_EVENT_ACTION_MASK) {
                case AMOTION_EVENT_ACTION_DOWN:
                    touchEvent.type = cocos2d::TouchEvent::Type::BEGAN;
                    dispatchTouchEvent(0, event, touchEvent);
                    break;
                case AMOTION_EVENT_ACTION_POINTER_DOWN:
                    touchEvent.type = cocos2d::TouchEvent::Type::BEGAN;
                    dispatchTouchEvent((action & AMOTION_EVENT_ACTION_POINTER_INDEX_MASK) >> AMOTION_EVENT_ACTION_POINTER_INDEX_SHIFT,
                                        event,
                                        touchEvent);
                    break;
                case AMOTION_EVENT_ACTION_UP:
                    touchEvent.type = cocos2d::TouchEvent::Type::ENDED;
                    dispatchTouchEvent(0, event, touchEvent);
                    break;
                case AMOTION_EVENT_ACTION_POINTER_UP:
                    touchEvent.type = cocos2d::TouchEvent::Type::ENDED;
                    dispatchTouchEvent((action & AMOTION_EVENT_ACTION_POINTER_INDEX_MASK) >> AMOTION_EVENT_ACTION_POINTER_INDEX_SHIFT,
                                       event,
                                       touchEvent);
                    break;
                case AMOTION_EVENT_ACTION_MOVE:
                    touchEvent.type = cocos2d::TouchEvent::Type::MOVED;
                    dispatchTouchEvents(event, touchEvent);
                    break;
                case AMOTION_EVENT_ACTION_CANCEL:
                    touchEvent.type = cocos2d::TouchEvent::Type::CANCELLED;
                    dispatchTouchEvents(event, touchEvent);
                    break;
                default:
                    return 0;
            }

            return 1;
        }

        return 0;
    }
}

void android_main(struct android_app* state) {
    struct SavedState savedState;
    memset(&savedState, 0, sizeof(savedState));
    state->userData = &savedState;
    state->onAppCmd = engineHandleCmd;
    state->onInputEvent = engineHandleInput;
    savedState.app = state;

    cocos2d::JniHelper::setAndroidApp(state);
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
        {
            return;
        }

        if (savedState.animating)
        {
            game->tick();
        }
    }
}