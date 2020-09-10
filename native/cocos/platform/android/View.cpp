/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
#include "View.h"
#include <android_native_app_glue.h>
#include "cocos/bindings/event/EventDispatcher.h"
#include "cocos/bindings/event/CustomEventTypes.h"
#include "platform/Application.h"

namespace
{
	struct cc::TouchEvent touchEvent;
    struct cc::KeyboardEvent keyboardEvent;

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

	void dispatchTouchEvent(int index, AInputEvent* event, cc::TouchEvent& touchEvent) {
        int pointerID = AMotionEvent_getPointerId(event, index);
        touchEvent.touches.push_back({
            AMotionEvent_getX(event, index), // x
            AMotionEvent_getY(event, index), // y
            pointerID});

        cc::EventDispatcher::dispatchTouchEvent(touchEvent);
        touchEvent.touches.clear();
    }

    void dispatchTouchEvents(AInputEvent* event, cc::TouchEvent& touchEvent) {
        size_t pointerCount = AMotionEvent_getPointerCount(event);
        for (size_t i = 0; i < pointerCount; ++i) {
            touchEvent.touches.push_back({
                AMotionEvent_getX(event, i),
                AMotionEvent_getY(event, i),
                AMotionEvent_getPointerId(event, i)
            });
        }

        cc::EventDispatcher::dispatchTouchEvent(touchEvent);
        touchEvent.touches.clear();
    }
}

namespace cc {

void View::engineHandleCmd(struct android_app* app, int32_t cmd)
{
    static bool isWindowInitiliased = false;
	// Handle CMD here if needed.
	switch (cmd) {
	    case APP_CMD_INIT_WINDOW:
	        if (!isWindowInitiliased) {
	            isWindowInitiliased = true;
	            return;
	        } else {
                cc::CustomEvent event;
                event.name = EVENT_RECREATE_WINDOW;
                event.args->ptrVal = app->window;
                cc::EventDispatcher::dispatchCustomEvent(event);
	        }
	        break;
	    case APP_CMD_TERM_WINDOW: {
            cc::CustomEvent event;
            event.name = EVENT_DESTROY_WINDOW;
            cc::EventDispatcher::dispatchCustomEvent(event);
        }
	        break;
	    case APP_CMD_RESUME:
	        if (Application::getInstance())
	            Application::getInstance()->onResume();
	        break;
	    case APP_CMD_PAUSE:
            if (Application::getInstance())
                Application::getInstance()->onPause();
	        break;
	}
}

/**
 * Process the next input event.
 */
int32_t View::engineHandleInput(struct android_app* app, AInputEvent* event) {
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

        keyboardEvent.key = keyCode;
        keyboardEvent.action = action == AKEY_EVENT_ACTION_DOWN
                                         ? cc::KeyboardEvent::Action::RELEASE
                                         : cc::KeyboardEvent::Action::PRESS;
        cc::EventDispatcher::dispatchKeyboardEvent(keyboardEvent);

        return 1;
    } else if (type == AINPUT_EVENT_TYPE_MOTION){
        int action = AMotionEvent_getAction(event);

        switch (action & AMOTION_EVENT_ACTION_MASK) {
            case AMOTION_EVENT_ACTION_DOWN:
                touchEvent.type = cc::TouchEvent::Type::BEGAN;
                dispatchTouchEvent(0, event, touchEvent);
                break;
            case AMOTION_EVENT_ACTION_POINTER_DOWN:
                touchEvent.type = cc::TouchEvent::Type::BEGAN;
                dispatchTouchEvent((action & AMOTION_EVENT_ACTION_POINTER_INDEX_MASK) >> AMOTION_EVENT_ACTION_POINTER_INDEX_SHIFT,
                                    event,
                                    touchEvent);
                break;
            case AMOTION_EVENT_ACTION_UP:
                touchEvent.type = cc::TouchEvent::Type::ENDED;
                dispatchTouchEvent(0, event, touchEvent);
                break;
            case AMOTION_EVENT_ACTION_POINTER_UP:
                touchEvent.type = cc::TouchEvent::Type::ENDED;
                dispatchTouchEvent((action & AMOTION_EVENT_ACTION_POINTER_INDEX_MASK) >> AMOTION_EVENT_ACTION_POINTER_INDEX_SHIFT,
                                   event,
                                   touchEvent);
                break;
            case AMOTION_EVENT_ACTION_MOVE:
                touchEvent.type = cc::TouchEvent::Type::MOVED;
                dispatchTouchEvents(event, touchEvent);
                break;
            case AMOTION_EVENT_ACTION_CANCEL:
                touchEvent.type = cc::TouchEvent::Type::CANCELLED;
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
