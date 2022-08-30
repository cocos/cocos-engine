/****************************************************************************
 Copyright (c) 2018-2022 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <functional>
#include <memory>
#include "base/std/container/string.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"

namespace se {
class Value;
}

namespace cc {

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

class OSEvent {
public:
    explicit OSEvent(OSEventType type) : _type(type) {}

    template <typename T>
    std::enable_if_t<std::is_base_of<cc::OSEvent, T>::value, const T &> static castEvent(const cc::OSEvent &ev) {
        const T &evDetail = dynamic_cast<const T &>(ev);
        return std::move(evDetail);
    }

    virtual OSEventType eventType() const {
        return _type;
    }

private:
    OSEventType _type = OSEventType::UNKNOWN_OSEVENT;
};

#define CONSTRUCT_EVENT(name, type) \
    name() : OSEvent(type) {}

class WindowEvent : public OSEvent {
public:
    CONSTRUCT_EVENT(WindowEvent, OSEventType::WINDOW_OSEVENT)
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

class TouchEvent : public OSEvent {
public:
    CONSTRUCT_EVENT(TouchEvent, OSEventType::TOUCH_OSEVENT)
    enum class Type {
        BEGAN,
        MOVED,
        ENDED,
        CANCELLED,
        UNKNOWN
    };

    ccstd::vector<TouchInfo> touches;
    Type type = Type::UNKNOWN;
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

struct ControllerInfo {
    struct AxisInfo {
        StickAxisCode axis{StickAxisCode::UNDEFINE};
        float         value{0.F};
        AxisInfo(StickAxisCode axis, float value) : axis(axis), value(value) {}
    };
    struct ButtonInfo {
        StickKeyCode key{StickKeyCode::UNDEFINE};
        bool         isPress{false};
        ButtonInfo(StickKeyCode key, bool isPress) : key(key), isPress(isPress) {}
    };

    int napdId{0};
    std::vector<AxisInfo> axisInfos;
    std::vector<ButtonInfo> buttonInfos;
};

struct ControllerEvent : public OSEvent {
    CONSTRUCT_EVENT(ControllerEvent, OSEventType::CONTROLLER_OSEVENT)
    enum class Type {
        GAMEPAD,
        HANDLE,
        UNKNOWN
    };
    Type type = Type::UNKNOWN;
    std::vector<std::unique_ptr<ControllerInfo>> controllerInfos;
};

class MouseEvent : public OSEvent {
public:
    CONSTRUCT_EVENT(MouseEvent, OSEventType::MOUSE_OSEVENT)
    enum class Type {
        DOWN,
        UP,
        MOVE,
        WHEEL,
        UNKNOWN
    };

    float x = 0.0F;
    float y = 0.0F;
    // The button number that was pressed when the mouse event was fired: Left button=0, middle button=1 (if present), right button=2.
    // For mice configured for left handed use in which the button actions are reversed the values are instead read from right to left.
    uint16_t button = 0;
    Type type = Type::UNKNOWN;
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
    DELETE_KEY = 46, //DELETE has conflict
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
    DPAD_RIGHT = 1001
};

class KeyboardEvent : public OSEvent {
public:
    CONSTRUCT_EVENT(KeyboardEvent, OSEventType::KEYBOARD_OSEVENT)
    enum class Action {
        PRESS,
        RELEASE,
        REPEAT,
        UNKNOWN
    };

    int key = -1;
    Action action = Action::UNKNOWN;
    bool altKeyActive = false;
    bool ctrlKeyActive = false;
    bool metaKeyActive = false;
    bool shiftKeyActive = false;
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

class CustomEvent : public OSEvent {
public:
    CONSTRUCT_EVENT(CustomEvent, OSEventType::CUSTOM_OSEVENT)
    ccstd::string name;
    EventParameterType args[10];

    virtual ~CustomEvent() = default; // NOLINT(modernize-use-nullptr)
};

class DeviceEvent : public OSEvent {
public:
    CONSTRUCT_EVENT(DeviceEvent, OSEventType::DEVICE_OSEVENT)
    enum class Type {
        MEMORY,
        ORIENTATION,
        UNKNOWN
    };
    EventParameterType args[3];
    Type type{Type::UNKNOWN}; // NOLINT(modernize-use-nullptr)
};

class EventDispatcher {
public:
    static void init();
    static void destroy();
    static bool initialized();

    static void dispatchTouchEvent(const TouchEvent &touchEvent);
    static void dispatchMouseEvent(const MouseEvent &mouseEvent);
    static void dispatchKeyboardEvent(const KeyboardEvent &keyboardEvent);
    static void dispatchControllerEvent(const ControllerEvent &controllerEvent);
    static void dispatchTickEvent(float dt);
    static void dispatchResizeEvent(int width, int height);
    static void dispatchOrientationChangeEvent(int orientation);
    static void dispatchEnterBackgroundEvent();
    static void dispatchEnterForegroundEvent();
    static void dispatchMemoryWarningEvent();
    static void dispatchRestartVM();
    static void dispatchCloseEvent();
    static void dispatchDestroyWindowEvent();
    static void dispatchRecreateWindowEvent();
    static void dispatchSceneLoadEvent();

    using CustomEventListener = std::function<void(const CustomEvent &)>;
    static uint32_t addCustomEventListener(const ccstd::string &eventName, const CustomEventListener &listener);
    static void removeCustomEventListener(const ccstd::string &eventName, uint32_t listenerID);
    static void removeAllCustomEventListeners(const ccstd::string &eventName);
    static void removeAllEventListeners();
    static void dispatchCustomEvent(const CustomEvent &event);
    static void doDispatchJsEvent(const char *jsFunctionName, const std::vector<se::Value> &args);

private:
    static void dispatchCustomEvent(const char *eventName, int argNum, ...);

    struct Node {
        CustomEventListener listener;
        uint32_t listenerID;
        struct Node *next = nullptr;
    };
    static ccstd::unordered_map<ccstd::string, Node *> listeners;
    static uint32_t hashListenerId; //simple increment hash
};

} // end of namespace cc
