/****************************************************************************
 Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#pragma once

#include <functional>
#include <memory>

#include "engine/EngineEvents.h"

namespace se {
class Value;
}

namespace cc {
class EventDispatcher {
public:
    static void init();
    static void destroy();
    static bool initialized();

    static void doDispatchJsEvent(const char *jsFunctionName, const std::vector<se::Value> &args);

private:
    static void dispatchTouchEvent(const TouchEvent &touchEvent);
    static void dispatchMouseEvent(const MouseEvent &mouseEvent);
    static void dispatchKeyboardEvent(const KeyboardEvent &keyboardEvent);
    static void dispatchControllerEvent(const ControllerEvent &controllerEvent);
    static void dispatchControllerChangeEvent(const ControllerChangeEvent &changeEvent);
    static void dispatchTickEvent(float dt);
    static void dispatchResizeEvent(int width, int height, uint32_t windowId = UINT32_MAX);
    static void dispatchOrientationChangeEvent(int orientation);
    static void dispatchEnterBackgroundEvent();
    static void dispatchEnterForegroundEvent();
    static void dispatchMemoryWarningEvent();
    static void dispatchRestartVM();
    static void dispatchCloseEvent();
    static void dispatchPointerlockChangeEvent(bool value);
    static uint32_t hashListenerId; // simple increment hash

    static events::EnterForeground::Listener listenerEnterForeground;
    static events::EnterBackground::Listener listenerEnterBackground;
    static events::WindowChanged::Listener listenerWindowChanged;
    static events::LowMemory::Listener listenerLowMemory;
    static events::Touch::Listener listenerTouch;
    static events::Mouse::Listener listenerMouse;
    static events::Keyboard::Listener listenerKeyboard;
    static events::Controller::Listener listenerConroller;
    static events::ControllerChange::Listener listenerConrollerChange;
    static events::Tick::Listener listenerTick;
    static events::Resize::Listener listenerResize;
    static events::Orientation::Listener listenerOrientation;
    static events::RestartVM::Listener listenerRestartVM;
    static events::Close::Listener listenerClose;
    static events::PointerLock::Listener listenerPointerLock;
};

} // end of namespace cc
