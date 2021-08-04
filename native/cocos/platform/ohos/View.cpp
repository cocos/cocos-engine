/****************************************************************************
Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
#include "cocos/bindings/event/CustomEventTypes.h"
#include "cocos/bindings/event/EventDispatcher.h"
#include "platform/Application.h"
#include "platform/ohos//jni/JniCocosAbility.h"
#include "platform/ohos/jni/AbilityConsts.h"

//NOLINTNEXTLINE
using namespace cc::ohos;

namespace cc {

void View::engineHandleCmd(int cmd) {
    static bool isWindowInitialized = false;
    // Handle CMD here if needed.
    switch (cmd) {
        case ABILITY_CMD_INIT_WINDOW:
            if (!isWindowInitialized) {
                isWindowInitialized = true;
                return;
            } else {
                cc::CustomEvent event;
                event.name         = EVENT_RECREATE_WINDOW;
                event.args->ptrVal = cocosApp.pendingWindow;
                cc::EventDispatcher::dispatchCustomEvent(event);
            }
            break;
        case ABILITY_CMD_TERM_WINDOW: {
            cc::CustomEvent event;
            event.name = EVENT_DESTROY_WINDOW;
            cc::EventDispatcher::dispatchCustomEvent(event);
        } break;
        case ABILITY_CMD_RESUME:
            if (Application::getInstance()) {
                Application::getInstance()->onResume();
            }
            break;
        case ABILITY_CMD_PAUSE:
            if (Application::getInstance()) {
                Application::getInstance()->onPause();
            }
            break;
        case ABILITY_CMD_LOW_MEMORY:
            cc::EventDispatcher::dispatchMemoryWarningEvent();
            break;
        default:
            break;
    }
}

} // namespace cc
