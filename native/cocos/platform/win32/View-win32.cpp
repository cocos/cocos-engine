/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "View-win32.h"
#include <unordered_map>
#include "base/Log.h"

using namespace cc;

namespace {

std::unordered_map<int, KeyCode> gKeyMap = {
    {SDLK_APPLICATION, KeyCode::CONTEXT_MENU}, {SDLK_SCROLLLOCK, KeyCode::SCROLLLOCK}, {SDLK_PAUSE, KeyCode::PAUSE}, {SDLK_PRINTSCREEN, KeyCode::PRINT_SCREEN}, {SDLK_INSERT, KeyCode::INSERT}, {SDLK_ESCAPE, KeyCode::ESCAPE}, {SDLK_MINUS, KeyCode::MINUS}, {SDLK_LSHIFT, KeyCode::SHIFT_LEFT}, {SDLK_RSHIFT, KeyCode::SHIFT_RIGHT}, {SDLK_EQUALS, KeyCode::EQUAL}, {SDLK_BACKSLASH, KeyCode::BACKSLASH}, {SDLK_BACKQUOTE, KeyCode::BACKQUOTE}, {SDLK_BACKSPACE, KeyCode::BACKSPACE}, {SDLK_RETURN, KeyCode::ENTER}, {SDLK_RETURN2, KeyCode::ENTER}, {SDLK_LEFTBRACKET, KeyCode::BRACKET_LEFT}, {SDLK_RIGHTBRACKET, KeyCode::BRACKET_RIGHT}, {SDLK_SEMICOLON, KeyCode::SEMICOLON}, {SDLK_QUOTE, KeyCode::QUOTE}, {SDLK_TAB, KeyCode::TAB}, {SDLK_LCTRL, KeyCode::CONTROL_LEFT}, {SDLK_RCTRL, KeyCode::CONTROL_RIGHT}, {SDLK_LALT, KeyCode::ALT_LEFT}, {SDLK_RALT, KeyCode::ALT_RIGHT}, {SDLK_LEFT, KeyCode::ARROW_LEFT}, {SDLK_RIGHT, KeyCode::ARROW_RIGHT}, {SDLK_UP, KeyCode::ARROW_UP}, {SDLK_DOWN, KeyCode::ARROW_DOWN}, {SDLK_KP_ENTER, KeyCode::NUMPAD_ENTER}, {SDLK_KP_PLUS, KeyCode::NUMPAD_PLUS}, {SDLK_KP_MULTIPLY, KeyCode::NUMPAD_MULTIPLY}, {SDLK_KP_DIVIDE, KeyCode::NUMPAD_DIVIDE}, {SDLK_KP_MINUS, KeyCode::NUMPAD_MINUS}, {SDLK_KP_PERIOD, KeyCode::NUMPAD_DECIMAL}, {SDLK_KP_BACKSPACE, KeyCode::BACKSPACE}, {SDLK_NUMLOCKCLEAR, KeyCode::NUM_LOCK}, {SDLK_HOME, KeyCode::HOME}, {SDLK_PAGEUP, KeyCode::PAGE_UP}, {SDLK_PAGEDOWN, KeyCode::PAGE_DOWN}, {SDLK_END, KeyCode::END}, {SDLK_COMMA, KeyCode::COMMA}, {SDLK_PERIOD, KeyCode::PERIOD}, {SDLK_SLASH, KeyCode::SLASH}, {SDLK_SPACE, KeyCode::SPACE}, {SDLK_DELETE, KeyCode::DELETE_KEY}, {SDLK_CAPSLOCK, KeyCode::CAPS_LOCK}, {SDLK_KP_0, KeyCode::NUMPAD_0}, {SDLK_KP_1, KeyCode::NUMPAD_1}, {SDLK_KP_2, KeyCode::NUMPAD_2}, {SDLK_KP_3, KeyCode::NUMPAD_3}, {SDLK_KP_4, KeyCode::NUMPAD_4}, {SDLK_KP_5, KeyCode::NUMPAD_5}, {SDLK_KP_6, KeyCode::NUMPAD_6}, {SDLK_KP_7, KeyCode::NUMPAD_7}, {SDLK_KP_8, KeyCode::NUMPAD_8}, {SDLK_KP_9, KeyCode::NUMPAD_9}};

int sdlKeycodeToCocosCode(int code_, int mode) {
    auto it = gKeyMap.find(code_);
    if (it != gKeyMap.end()) {
        return static_cast<int>(it->second);
    }
    
    if (code_ >= SDLK_F1 && code_ <= SDLK_F12) {
        // F1 ~ F12
        return 112 + (code_ - SDLK_F1);
    } else {
        int code = code_ & (~(1 << 30));
        if (code >= SDLK_a && code <= SDLK_z) {
            return 'A' + (code - SDLK_a);
        } else {
            return code;
        }
    }
}
} // namespace

namespace cc {

View::View(const std::string &title, int width, int height) : _title(title),
                                                              _width(width),
                                                              _height(height) {
}

View::~View() {
    if (_window) {
        SDL_DestroyWindow(_window);
        _window = nullptr;
    }
    if (_inited) {
        SDL_Quit();
    }
}

bool View::init() {
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        // Display error message
        CC_LOG_ERROR("SDL could not initialize! SDL_Error: %s\n", SDL_GetError());
        return false;
    }
    _inited = true;
    // Create window
    uint32_t flags = SDL_WINDOW_SHOWN |
                     SDL_WINDOW_RESIZABLE |
                     SDL_WINDOW_INPUT_FOCUS;
    _window = SDL_CreateWindow(_title.c_str(), SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, _width, _height, flags);
    if (_window == NULL) {
        // Display error message
        CC_LOG_ERROR("Window could not be created! SDL_Error: %s\n", SDL_GetError());
        return false;
    }

    return true;
}

bool View::pollEvent(bool *quit, bool *resume, bool *pause, bool *close) {
    int cnt = SDL_PollEvent(&sdlEvent);
    if (cnt == 0) return false;
    cc::TouchEvent    touch;
    cc::MouseEvent    mouse;
    cc::KeyboardEvent keyboard;
    switch (sdlEvent.type) {
        case SDL_QUIT: {
            if (quit) *quit = true;
            break;
        }
        case SDL_WINDOWEVENT: {
            SDL_WindowEvent &wevent = sdlEvent.window;
            switch (wevent.event) {
                case SDL_WINDOWEVENT_SHOWN:
                case SDL_WINDOWEVENT_RESTORED:
                    *resume = true;
                    break;
                case SDL_WINDOWEVENT_SIZE_CHANGED:
                case SDL_WINDOWEVENT_RESIZED:
                    this->_width = wevent.data1;
                    this->_height = wevent.data2;
                    cc::EventDispatcher::dispatchResizeEvent(wevent.data1, wevent.data2);
                    break;
                case SDL_WINDOWEVENT_HIDDEN:
                case SDL_WINDOWEVENT_MINIMIZED:
                    *pause = true;
                    break;
                case SDL_WINDOWEVENT_ENTER:
                    SDL_CaptureMouse(SDL_TRUE);
                    break;
                case SDL_WINDOWEVENT_CLOSE:
                    *close = true;
                    break;
            }
            break;
        }
        case SDL_MOUSEBUTTONDOWN: {
            SDL_MouseButtonEvent &event = sdlEvent.button;
            mouse.type                  = MouseEvent::Type::DOWN;
            mouse.x                     = static_cast<float>(event.x);
            mouse.y                     = static_cast<float>(event.y);
            if (0 > mouse.x || mouse.x > this->_width || 0 > mouse.y || mouse.y > this->_height) {
                break;
            }
            mouse.button                = event.button - 1;
            cc::EventDispatcher::dispatchMouseEvent(mouse);
            break;
        }
        case SDL_MOUSEBUTTONUP: {
            SDL_MouseButtonEvent &event = sdlEvent.button;
            mouse.type                  = MouseEvent::Type::UP;
            mouse.x                     = static_cast<float>(event.x);
            mouse.y                     = static_cast<float>(event.y);
            mouse.button                = event.button - 1;
            cc::EventDispatcher::dispatchMouseEvent(mouse);
            break;
        }
        case SDL_MOUSEMOTION: {
            SDL_MouseMotionEvent &event = sdlEvent.motion;
            mouse.type                  = MouseEvent::Type::MOVE;
            mouse.x                     = static_cast<float>(event.x);
            mouse.y                     = static_cast<float>(event.y);
            mouse.button                = 0;
            cc::EventDispatcher::dispatchMouseEvent(mouse);
            break;
        }
        case SDL_MOUSEWHEEL: {
            SDL_MouseWheelEvent &event = sdlEvent.wheel;
            mouse.type                 = MouseEvent::Type::WHEEL;
            mouse.x                    = static_cast<float>(event.x);
            mouse.y                    = static_cast<float>(event.y);
            mouse.button               = 0; //TODO: direction
            cc::EventDispatcher::dispatchMouseEvent(mouse);
            break;
        }
        case SDL_FINGERUP: {
            SDL_TouchFingerEvent &event = sdlEvent.tfinger;
            touch.type                  = TouchEvent::Type::ENDED;
            touch.touches               = {TouchInfo(event.x, event.y, (int)event.fingerId)};
            cc::EventDispatcher::dispatchTouchEvent(touch);
            break;
        }
        case SDL_FINGERDOWN: {
            SDL_TouchFingerEvent &event = sdlEvent.tfinger;
            touch.type                  = TouchEvent::Type::BEGAN;
            touch.touches               = {TouchInfo(event.x, event.y, (int)event.fingerId)};
            cc::EventDispatcher::dispatchTouchEvent(touch);
            break;
        }
        case SDL_FINGERMOTION: {
            SDL_TouchFingerEvent &event = sdlEvent.tfinger;
            touch.type                  = TouchEvent::Type::MOVED;
            touch.touches               = {TouchInfo(event.x, event.y, (int)event.fingerId)};
            cc::EventDispatcher::dispatchTouchEvent(touch);
            break;
        }
        case SDL_KEYDOWN: {
            SDL_KeyboardEvent &event = sdlEvent.key;
            auto               mode  = event.keysym.mod;
            keyboard.action          = KeyboardEvent::Action::PRESS;
            keyboard.key             = sdlKeycodeToCocosCode(event.keysym.sym, mode);
            keyboard.altKeyActive    = mode & KMOD_ALT;
            keyboard.ctrlKeyActive   = mode & KMOD_CTRL;
            keyboard.shiftKeyActive  = mode & KMOD_SHIFT;
            //CC_LOG_DEBUG("==> key %d -> code %d", event.keysym.sym, keyboard.key);
            cc::EventDispatcher::dispatchKeyboardEvent(keyboard);
            break;
        }
        case SDL_KEYUP: {
            SDL_KeyboardEvent &event = sdlEvent.key;
            auto               mode  = event.keysym.mod;
            keyboard.action          = KeyboardEvent::Action::RELEASE;
            keyboard.key             = sdlKeycodeToCocosCode(event.keysym.sym, mode);
            keyboard.altKeyActive    = mode & KMOD_ALT;
            keyboard.ctrlKeyActive   = mode & KMOD_CTRL;
            keyboard.shiftKeyActive  = mode & KMOD_SHIFT;
            cc::EventDispatcher::dispatchKeyboardEvent(keyboard);
            break;
        }
        default:

            break;
    }

    return true;
}

HWND View::getWindowHandler() {
    assert(_window);
    SDL_SysWMinfo wmInfo;
    SDL_VERSION(&wmInfo.version);
    SDL_GetWindowWMInfo(_window, &wmInfo);
    return wmInfo.info.win.window;
}

void View::setCursorEnabeld(bool enable) {
    SDL_SetRelativeMouseMode(enable ? SDL_FALSE : SDL_TRUE);
}

} // namespace cc
