/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 
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

#pragma once

#include <vector>
#include <unordered_map>
#include <functional>
#include <string>

namespace cocos2d
{
    
// Touch event related
    
struct TouchInfo
{
    float x = 0;
    float y = 0;
    int index = 0;
};

struct TouchEvent
{
    enum class Type : uint8_t
    {
        BEGAN,
        MOVED,
        ENDED,
        CANCELLED,
        UNKNOWN
    };
    
    std::vector<TouchInfo> touches;
    Type type = Type::UNKNOWN;
};

struct MouseEvent
{
    enum class Type : uint8_t
    {
        DOWN,
        UP,
        MOVE,
        WHEEL,
        UNKNOWN
    };

    float x = 0.0f;
    float y = 0.0f;
    // The button number that was pressed when the mouse event was fired: Left button=0, middle button=1 (if present), right button=2.
    // For mice configured for left handed use in which the button actions are reversed the values are instead read from right to left.
    unsigned short button = 0;
    Type type = Type::UNKNOWN;
};

struct KeyboardEvent
{
    enum class Action : uint8_t {
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
};

class CustomEvent
{
public:
    std::string name;
    union {
        void* ptrVal;
        long longVal;
        int intVal;
        short shortVal;
        char charVal;
        bool boolVal;
    } args[10];

    CustomEvent(){};
    virtual ~CustomEvent(){};
};

class EventDispatcher
{
public:
    static void init();
    static void destroy();

    static void dispatchTouchEvent(const struct TouchEvent& touchEvent);
    static void dispatchMouseEvent(const struct MouseEvent& mouseEvent);
    static void dispatchKeyboardEvent(const struct KeyboardEvent& keyboardEvent);
    static void dispatchTickEvent(float dt);
    static void dispatchResizeEvent(int width, int height);
    static void dispatchEnterBackgroundEvent();
    static void dispatchEnterForegroundEvent();

    using CustomEventListener = std::function<void(const CustomEvent&)>;
    static uint32_t addCustomEventListener(const std::string& eventName, const CustomEventListener& listener);
    static void removeCustomEventListener(const std::string& eventName, uint32_t listenerID);
    static void removeAllCustomEventListeners(const std::string& eventName);
    static void dispatchCustomEvent(const CustomEvent& event);

private:
    struct Node
    {
        CustomEventListener listener;
        uint32_t listenerID;
        struct Node* next;
    };
    static std::unordered_map<std::string, Node*> _listeners;
};
    
} // end of namespace cocos2d
