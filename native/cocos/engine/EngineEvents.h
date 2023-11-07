/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include <memory>
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"
#include "core/event/EventBus.h"

namespace cc {

class ISystemWindow;

enum class OSEventType {
    KEYBOARD_OSEVENT = 0,
    TOUCH_OSEVENT = 1,
    MOUSE_OSEVENT = 2,
    CUSTOM_OSEVENT = 3,
    DEVICE_OSEVENT = 4,
    WINDOW_OSEVENT = 5,
    APP_OSEVENT = 6,
    CONTROLLER_OSEVENT = 7,
    UNKNOWN_OSEVENT = 8
};

class WindowEvent {
public:
    WindowEvent() = default;
    enum class Type {
        QUIT = 0,
        SHOW,
        RESTORED,
        SIZE_CHANGED,
        RESIZED,
        HIDDEN,
        MINIMIZED,
        CLOSE,
        UNKNOWN,
    };
    Type type = Type::UNKNOWN;
    int width = 0;
    int height = 0;
    uint32_t windowId = 0;
};
// Touch event related

class TouchInfo {
public:
    float x = 0;
    float y = 0;
    int index = 0;

    TouchInfo(float x, float y, int index)
    : x(x),
      y(y),
      index(index) {}
};

class TouchEvent {
public:
    TouchEvent() = default;
    enum class Type {
        BEGAN,
        MOVED,
        ENDED,
        CANCELLED,
        UNKNOWN
    };

    ccstd::vector<TouchInfo> touches;
    Type type = Type::UNKNOWN;
    uint32_t windowId = 0;
};

enum class StickKeyCode {
    UNDEFINE = 0,
    A,
    B,
    X,
    Y,
    L1,
    R1,
    MINUS,
    PLUS,
    L3,
    R3,
    MENU,
    START,
    TRIGGER_LEFT,
    TRIGGER_RIGHT,
};

enum class StickAxisCode {
    UNDEFINE = 0,
    X,
    Y,
    LEFT_STICK_X,
    LEFT_STICK_Y,
    RIGHT_STICK_X,
    RIGHT_STICK_Y,
    L2,
    R2,
    LEFT_GRIP,
    RIGHT_GRIP,
};

enum class StickTouchCode {
    UNDEFINE = 0,
    A,
    B,
    X,
    Y,
    LEFT_TRIGGER,
    RIGHT_TRIGGER,
    LEFT_THUMBSTICK,
    RIGHT_THUMBSTICK,
};

struct ControllerInfo {
    struct AxisInfo {
        StickAxisCode axis{StickAxisCode::UNDEFINE};
        float value{0.F};
        AxisInfo(StickAxisCode axis, float value) : axis(axis), value(value) {}
    };
    struct ButtonInfo {
        StickKeyCode key{StickKeyCode::UNDEFINE};
        bool isPress{false};
        ButtonInfo(StickKeyCode key, bool isPress) : key(key), isPress(isPress) {}
    };
    struct TouchInfo {
        StickTouchCode key{StickTouchCode::UNDEFINE};
        float value{0.F};
        TouchInfo(StickTouchCode key, float value) : key(key), value(value) {}
    };
    int napdId{0};
    std::vector<AxisInfo> axisInfos;
    std::vector<ButtonInfo> buttonInfos;
    std::vector<TouchInfo> touchInfos;
};

struct ControllerEvent {
    ControllerEvent() = default;
    enum class Type {
        GAMEPAD,
        HANDLE,
        UNKNOWN
    };
    Type type = Type::UNKNOWN;
    ccstd::vector<std::unique_ptr<ControllerInfo>> controllerInfos;
};

struct ControllerChangeEvent {
    ccstd::vector<uint32_t> controllerIds;
};

class MouseEvent {
public:
    MouseEvent() = default;
    enum class Type {
        DOWN,
        UP,
        MOVE,
        WHEEL,
        UNKNOWN
    };

    float x = 0.0F;
    float y = 0.0F;
    float xDelta = 0.0F;
    float yDelta = 0.0F;
    // The button number that was pressed when the mouse event was fired: Left button=0, middle button=1 (if present), right button=2.
    // For mice configured for left handed use in which the button actions are reversed the values are instead read from right to left.
    uint16_t button = 0;
    Type type = Type::UNKNOWN;
    uint32_t windowId = 0;
};

enum class KeyCode {
    /**
     * @en The back key on mobile phone
     * @zh 移动端返回键
     */
    MOBILE_BACK = 6,
    BACKSPACE = 8,
    TAB = 9,
    NUM_LOCK = 12,
    NUMPAD_ENTER = 20013,
    ENTER = 13,
    SHIFT_RIGHT = 20016,
    SHIFT_LEFT = 16,
    CONTROL_LEFT = 17,
    CONTROL_RIGHT = 20017,
    ALT_RIGHT = 20018,
    ALT_LEFT = 18,
    PAUSE = 19,
    CAPS_LOCK = 20,
    ESCAPE = 27,
    SPACE = 32,
    PAGE_UP = 33,
    PAGE_DOWN = 34,
    END = 35,
    HOME = 36,
    ARROW_LEFT = 37,
    ARROW_UP = 38,
    ARROW_RIGHT = 39,
    ARROW_DOWN = 40,
    INSERT = 45,
    DELETE_KEY = 46, // DELETE has conflict
    META_LEFT = 91,
    CONTEXT_MENU = 20093,
    PRINT_SCREEN = 20094,
    META_RIGHT = 93,
    NUMPAD_MULTIPLY = 106,
    NUMPAD_PLUS = 107,
    NUMPAD_MINUS = 109,
    NUMPAD_DECIMAL = 110,
    NUMPAD_DIVIDE = 111,
    SCROLLLOCK = 145,
    SEMICOLON = 186,
    EQUAL = 187,
    COMMA = 188,
    MINUS = 189,
    PERIOD = 190,
    SLASH = 191,
    BACKQUOTE = 192,
    BRACKET_LEFT = 219,
    BACKSLASH = 220,
    BRACKET_RIGHT = 221,
    QUOTE = 222,
    NUMPAD_0 = 10048,
    NUMPAD_1 = 10049,
    NUMPAD_2 = 10050,
    NUMPAD_3 = 10051,
    NUMPAD_4 = 10052,
    NUMPAD_5 = 10053,
    NUMPAD_6 = 10054,
    NUMPAD_7 = 10055,
    NUMPAD_8 = 10056,
    NUMPAD_9 = 10057,
    DPAD_UP = 1003,
    DPAD_LEFT = 1000,
    DPAD_DOWN = 1004,
    DPAD_RIGHT = 1001,
    DPAD_CENTER = 1005
};

class KeyboardEvent {
public:
    KeyboardEvent() = default;
    enum class Action {
        PRESS,
        RELEASE,
        REPEAT,
        UNKNOWN
    };

    uint32_t windowId = 0;
    int key = -1;
    Action action = Action::UNKNOWN;
    bool altKeyActive = false;
    bool ctrlKeyActive = false;
    bool metaKeyActive = false;
    bool shiftKeyActive = false;
    ccstd::string code;
    // TODO(mingo): support caps lock?
};
union EventParameterType {
    void *ptrVal;
    int32_t longVal;
    int intVal;
    int16_t shortVal;
    char charVal;
    bool boolVal;
};

class CustomEvent {
public:
    CustomEvent() = default;
    ccstd::string name;
    EventParameterType args[10];

    virtual ~CustomEvent() = default; // NOLINT(modernize-use-nullptr)
};

class DeviceEvent {
public:
    DeviceEvent() = default;
    enum class Type {
        MEMORY,
        ORIENTATION,
        UNKNOWN
    };
    EventParameterType args[3];
    Type type{Type::UNKNOWN}; // NOLINT(modernize-use-nullptr)
};

enum class ScriptEngineEvent {
    BEFORE_INIT,
    AFTER_INIT,
    BEFORE_CLEANUP,
    AFTER_CLEANUP,
};

namespace events {
DECLARE_EVENT_BUS(Engine)

DECLARE_BUS_EVENT_ARG0(EnterForeground, Engine)
DECLARE_BUS_EVENT_ARG0(EnterBackground, Engine)
DECLARE_BUS_EVENT_ARG1(WindowRecreated, Engine, uint32_t /* windowId*/)
DECLARE_BUS_EVENT_ARG1(WindowDestroy, Engine, uint32_t /*windowId*/)
DECLARE_BUS_EVENT_ARG1(WindowEvent, Engine, const cc::WindowEvent &)
DECLARE_BUS_EVENT_ARG1(WindowChanged, Engine, cc::WindowEvent::Type)
DECLARE_BUS_EVENT_ARG0(LowMemory, Engine)
DECLARE_BUS_EVENT_ARG1(Touch, Engine, const cc::TouchEvent &)
DECLARE_BUS_EVENT_ARG1(Mouse, Engine, const cc::MouseEvent &)
DECLARE_BUS_EVENT_ARG1(Keyboard, Engine, const cc::KeyboardEvent &)
DECLARE_BUS_EVENT_ARG1(Controller, Engine, const cc::ControllerEvent &)
DECLARE_BUS_EVENT_ARG1(ControllerChange, Engine, const cc::ControllerChangeEvent &)
DECLARE_BUS_EVENT_ARG1(Tick, Engine, float)
DECLARE_BUS_EVENT_ARG0(BeforeTick, Engine)
DECLARE_BUS_EVENT_ARG0(AfterTick, Engine)
DECLARE_BUS_EVENT_ARG3(Resize, Engine, int, int, uint32_t /* windowId*/)
DECLARE_BUS_EVENT_ARG1(Orientation, Engine, int)
DECLARE_BUS_EVENT_ARG1(PointerLock, Engine, bool)
DECLARE_BUS_EVENT_ARG0(RestartVM, Engine)
DECLARE_BUS_EVENT_ARG0(Close, Engine)
DECLARE_BUS_EVENT_ARG0(SceneLoad, Engine)
DECLARE_BUS_EVENT_ARG1(ScriptEngine, Engine, ScriptEngineEvent)
} // namespace events
} // namespace cc
