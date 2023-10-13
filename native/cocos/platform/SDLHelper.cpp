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

#include "platform/SDLHelper.h"
#include "SDL2/SDL.h"
#include "SDL2/SDL_main.h"
#include "SDL2/SDL_syswm.h"
#include "base/Log.h"
#include "engine/EngineEvents.h"
#include "platform/BasePlatform.h"
#include "platform/interfaces/modules/IScreen.h"
#include "platform/interfaces/modules/ISystemWindow.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"

namespace {
std::unordered_map<int, cc::KeyCode> gKeyMap = {
    {SDLK_APPLICATION, cc::KeyCode::CONTEXT_MENU},
    {SDLK_SCROLLLOCK, cc::KeyCode::SCROLLLOCK},
    {SDLK_PAUSE, cc::KeyCode::PAUSE},
    {SDLK_PRINTSCREEN, cc::KeyCode::PRINT_SCREEN},
    {SDLK_INSERT, cc::KeyCode::INSERT},
    {SDLK_ESCAPE, cc::KeyCode::ESCAPE},
    {SDLK_MINUS, cc::KeyCode::MINUS},
    {SDLK_LSHIFT, cc::KeyCode::SHIFT_LEFT},
    {SDLK_RSHIFT, cc::KeyCode::SHIFT_RIGHT},
    {SDLK_EQUALS, cc::KeyCode::EQUAL},
    {SDLK_BACKSLASH, cc::KeyCode::BACKSLASH},
    {SDLK_BACKQUOTE, cc::KeyCode::BACKQUOTE},
    {SDLK_BACKSPACE, cc::KeyCode::BACKSPACE},
    {SDLK_RETURN, cc::KeyCode::ENTER},
    {SDLK_RETURN2, cc::KeyCode::ENTER},
    {SDLK_LEFTBRACKET, cc::KeyCode::BRACKET_LEFT},
    {SDLK_RIGHTBRACKET, cc::KeyCode::BRACKET_RIGHT},
    {SDLK_SEMICOLON, cc::KeyCode::SEMICOLON},
    {SDLK_QUOTE, cc::KeyCode::QUOTE},
    {SDLK_TAB, cc::KeyCode::TAB},
    {SDLK_LCTRL, cc::KeyCode::CONTROL_LEFT},
    {SDLK_RCTRL, cc::KeyCode::CONTROL_RIGHT},
    {SDLK_LALT, cc::KeyCode::ALT_LEFT},
    {SDLK_RALT, cc::KeyCode::ALT_RIGHT},
    {SDLK_LEFT, cc::KeyCode::ARROW_LEFT},
    {SDLK_RIGHT, cc::KeyCode::ARROW_RIGHT},
    {SDLK_UP, cc::KeyCode::ARROW_UP},
    {SDLK_DOWN, cc::KeyCode::ARROW_DOWN},
    {SDLK_KP_ENTER, cc::KeyCode::NUMPAD_ENTER},
    {SDLK_KP_PLUS, cc::KeyCode::NUMPAD_PLUS},
    {SDLK_KP_MULTIPLY, cc::KeyCode::NUMPAD_MULTIPLY},
    {SDLK_KP_DIVIDE, cc::KeyCode::NUMPAD_DIVIDE},
    {SDLK_KP_MINUS, cc::KeyCode::NUMPAD_MINUS},
    {SDLK_KP_PERIOD, cc::KeyCode::NUMPAD_DECIMAL},
    {SDLK_KP_BACKSPACE, cc::KeyCode::BACKSPACE},
    {SDLK_NUMLOCKCLEAR, cc::KeyCode::NUM_LOCK},
    {SDLK_HOME, cc::KeyCode::HOME},
    {SDLK_PAGEUP, cc::KeyCode::PAGE_UP},
    {SDLK_PAGEDOWN, cc::KeyCode::PAGE_DOWN},
    {SDLK_END, cc::KeyCode::END},
    {SDLK_COMMA, cc::KeyCode::COMMA},
    {SDLK_PERIOD, cc::KeyCode::PERIOD},
    {SDLK_SLASH, cc::KeyCode::SLASH},
    {SDLK_SPACE, cc::KeyCode::SPACE},
    {SDLK_DELETE, cc::KeyCode::DELETE_KEY},
    {SDLK_CAPSLOCK, cc::KeyCode::CAPS_LOCK},
    {SDLK_KP_0, cc::KeyCode::NUMPAD_0},
    {SDLK_KP_1, cc::KeyCode::NUMPAD_1},
    {SDLK_KP_2, cc::KeyCode::NUMPAD_2},
    {SDLK_KP_3, cc::KeyCode::NUMPAD_3},
    {SDLK_KP_4, cc::KeyCode::NUMPAD_4},
    {SDLK_KP_5, cc::KeyCode::NUMPAD_5},
    {SDLK_KP_6, cc::KeyCode::NUMPAD_6},
    {SDLK_KP_7, cc::KeyCode::NUMPAD_7},
    {SDLK_KP_8, cc::KeyCode::NUMPAD_8},
    {SDLK_KP_9, cc::KeyCode::NUMPAD_9}};

int sdlKeycodeToCocosCode(int sdlCode, int mode) {
    auto it = gKeyMap.find(sdlCode);
    if (it != gKeyMap.end()) {
        return static_cast<int>(it->second);
    }

    if (sdlCode >= SDLK_F1 && sdlCode <= SDLK_F12) {
        // F1 ~ F12
        return 112 + (sdlCode - SDLK_F1);
    } else {
        int code = sdlCode & (~(1 << 30));
        if (code >= SDLK_a && code <= SDLK_z) {
            return 'A' + (code - SDLK_a);
        } else {
            return code;
        }
    }
}

std::unordered_map<cc::ISystemWindow::WindowFlags, SDL_WindowFlags> gWindowFlagMap = {
    {cc::ISystemWindow::CC_WINDOW_FULLSCREEN, SDL_WINDOW_FULLSCREEN},
    {cc::ISystemWindow::CC_WINDOW_OPENGL, SDL_WINDOW_OPENGL},
    {cc::ISystemWindow::CC_WINDOW_SHOWN, SDL_WINDOW_SHOWN},
    {cc::ISystemWindow::CC_WINDOW_HIDDEN, SDL_WINDOW_HIDDEN},
    {cc::ISystemWindow::CC_WINDOW_BORDERLESS, SDL_WINDOW_BORDERLESS},
    {cc::ISystemWindow::CC_WINDOW_RESIZABLE, SDL_WINDOW_RESIZABLE},
    {cc::ISystemWindow::CC_WINDOW_MINIMIZED, SDL_WINDOW_MINIMIZED},
    {cc::ISystemWindow::CC_WINDOW_MAXIMIZED, SDL_WINDOW_MAXIMIZED},
    {cc::ISystemWindow::CC_WINDOW_INPUT_GRABBED, SDL_WINDOW_INPUT_GRABBED},
    {cc::ISystemWindow::CC_WINDOW_INPUT_FOCUS, SDL_WINDOW_INPUT_FOCUS},
    {cc::ISystemWindow::CC_WINDOW_MOUSE_FOCUS, SDL_WINDOW_MOUSE_FOCUS},
    {cc::ISystemWindow::CC_WINDOW_FULLSCREEN_DESKTOP, SDL_WINDOW_FULLSCREEN_DESKTOP},
    {cc::ISystemWindow::CC_WINDOW_FOREIGN, SDL_WINDOW_FOREIGN},
    {cc::ISystemWindow::CC_WINDOW_ALLOW_HIGHDPI, SDL_WINDOW_ALLOW_HIGHDPI},
    {cc::ISystemWindow::CC_WINDOW_MOUSE_CAPTURE, SDL_WINDOW_MOUSE_CAPTURE},
    {cc::ISystemWindow::CC_WINDOW_ALWAYS_ON_TOP, SDL_WINDOW_ALWAYS_ON_TOP},
    {cc::ISystemWindow::CC_WINDOW_SKIP_TASKBAR, SDL_WINDOW_SKIP_TASKBAR},
    {cc::ISystemWindow::CC_WINDOW_UTILITY, SDL_WINDOW_UTILITY},
    {cc::ISystemWindow::CC_WINDOW_TOOLTIP, SDL_WINDOW_TOOLTIP},
    {cc::ISystemWindow::CC_WINDOW_POPUP_MENU, SDL_WINDOW_POPUP_MENU},
    {cc::ISystemWindow::CC_WINDOW_VULKAN, SDL_WINDOW_VULKAN}};

int windowFlagsToSDLWindowFlag(int flags) {
    int sdlFlags = 0;
    for (auto it : gWindowFlagMap) {
        if ((it.first & flags) == it.first) {
            sdlFlags |= it.second;
        }
    }
    return sdlFlags;
}
} // namespace

namespace cc {
SDLHelper::SDLHelper() {}

SDLHelper::~SDLHelper() {
    SDL_Quit();
}

int SDLHelper::init() {
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        // Display error message
        CC_LOG_ERROR("SDL could not initialize! SDL_Error: %s\n", SDL_GetError());
        return -1;
    }
    // (1) Disable IDE on windows platform.
    // (2) On mac platform, SDL has an internal implementation of textinput ,
    // which internally sends the SDL_TEXTINPUT event. Causing two events to be sent.
    // So we need to stop the implementation of TextInput.
	// (3) Other platforms do not use textinput in sdl.
    stopTextInput();
    return 0;
}

void SDLHelper::dispatchWindowEvent(uint32_t windowId, const SDL_WindowEvent &wevent) {
    WindowEvent ev;
    ev.windowId = windowId;

    switch (wevent.event) {
        case SDL_WINDOWEVENT_SHOWN: {
            ev.type = WindowEvent::Type::SHOW;
            events::WindowEvent::broadcast(ev);
            break;
        }
        case SDL_WINDOWEVENT_RESTORED: {
            ev.type = WindowEvent::Type::RESTORED;
            events::WindowEvent::broadcast(ev);
            break;
        }
        case SDL_WINDOWEVENT_SIZE_CHANGED: {
            auto *screen = BasePlatform::getPlatform()->getInterface<IScreen>();
            CC_ASSERT(screen != nullptr);
            ev.type = WindowEvent::Type::SIZE_CHANGED;
            ev.width = wevent.data1 * screen->getDevicePixelRatio();
            ev.height = wevent.data2 * screen->getDevicePixelRatio();
            events::WindowEvent::broadcast(ev);
            break;
        }
        case SDL_WINDOWEVENT_RESIZED: {
            auto *screen = BasePlatform::getPlatform()->getInterface<IScreen>();
            CC_ASSERT(screen != nullptr);
            ev.type = WindowEvent::Type::RESIZED;
            ev.width = wevent.data1 * screen->getDevicePixelRatio();
            ev.height = wevent.data2 * screen->getDevicePixelRatio();
            events::WindowEvent::broadcast(ev);
            break;
        }
        case SDL_WINDOWEVENT_HIDDEN: {
            SDL_Window *window = SDL_GetWindowFromID(windowId);
            if (!isWindowMinimized(window)) {
                int32_t v = SDL_GetWindowFlags(window);
                ev.type = WindowEvent::Type::HIDDEN;
                events::WindowEvent::broadcast(ev);
            }
            break;
        }
        case SDL_WINDOWEVENT_MINIMIZED: {
            ev.type = WindowEvent::Type::MINIMIZED;
            events::WindowEvent::broadcast(ev);
            break;
        }
        case SDL_WINDOWEVENT_CLOSE: {
            ev.type = WindowEvent::Type::CLOSE;
            events::WindowEvent::broadcast(ev);
            break;
        }
    }
}

void SDLHelper::dispatchSDLEvent(uint32_t windowId, const SDL_Event &sdlEvent) {
    cc::TouchEvent touch;
    cc::MouseEvent mouse;
    cc::KeyboardEvent keyboard;

    touch.windowId = windowId;
    mouse.windowId = windowId;
    keyboard.windowId = windowId;

    SDL_Window *window = SDL_GetWindowFromID(sdlEvent.window.windowID);

    switch (sdlEvent.type) {
        case SDL_QUIT: {
            WindowEvent ev;
            ev.type = WindowEvent::Type::QUIT;
            events::WindowEvent::broadcast(ev);
            break;
        }
        case SDL_WINDOWEVENT: {
            dispatchWindowEvent(windowId, sdlEvent.window);
            break;
        }
        case SDL_MOUSEBUTTONDOWN: {
            int width = 0;
            int height = 0;
            SDL_GetWindowSize(window, &width, &height);
            const SDL_MouseButtonEvent &event = sdlEvent.button;
            if (0 > event.x || event.x > width || 0 > event.y || event.y > height) {
                break;
            }
            mouse.type = MouseEvent::Type::DOWN;
            mouse.x = static_cast<float>(event.x);
            mouse.y = static_cast<float>(event.y);
            mouse.button = event.button - 1;
            events::Mouse::broadcast(mouse);
            break;
        }
        case SDL_MOUSEBUTTONUP: {
            const SDL_MouseButtonEvent &event = sdlEvent.button;
            mouse.type = MouseEvent::Type::UP;
            mouse.x = static_cast<float>(event.x);
            mouse.y = static_cast<float>(event.y);
            mouse.button = event.button - 1;
            events::Mouse::broadcast(mouse);
            break;
        }
        case SDL_MOUSEMOTION: {
            const SDL_MouseMotionEvent &event = sdlEvent.motion;
            mouse.type = MouseEvent::Type::MOVE;
            mouse.button = -1; // BUTTON_MISSING
            // Needs to be consistent with event-mouse.ts definition
            // Multiple button presses at the same time are not supported.
            // if we are pressed at the same time, the result is indeterminate.
            if (event.state & SDL_BUTTON_LMASK) {
                mouse.button |= 0x00; // BUTTON_LEFT
            } else if (event.state & SDL_BUTTON_RMASK) {
                mouse.button |= 0x02; // BUTTON_RGIHT
            } else if (event.state & SDL_BUTTON_MIDDLE) {
                mouse.button |= 0x01; // BUTTON_MIDDLE
            }

            mouse.x = static_cast<float>(event.x);
            mouse.y = static_cast<float>(event.y);
            mouse.xDelta = static_cast<float>(event.xrel);
            mouse.yDelta = static_cast<float>(event.yrel);
            events::Mouse::broadcast(mouse);
            break;
        }
        case SDL_MOUSEWHEEL: {
            const SDL_MouseWheelEvent &event = sdlEvent.wheel;
            mouse.type = MouseEvent::Type::WHEEL;
            mouse.x = static_cast<float>(event.x);
            mouse.y = static_cast<float>(event.y);
            mouse.button = 0; //TODO: direction
            events::Mouse::broadcast(mouse);
            break;
        }
        case SDL_FINGERUP: {
            const SDL_TouchFingerEvent &event = sdlEvent.tfinger;
            touch.type = TouchEvent::Type::ENDED;
            touch.touches = {TouchInfo(event.x, event.y, (int)event.fingerId)};
            events::Touch::broadcast(touch);
            break;
        }
        case SDL_FINGERDOWN: {
            const SDL_TouchFingerEvent &event = sdlEvent.tfinger;
            touch.type = TouchEvent::Type::BEGAN;
            touch.touches = {TouchInfo(event.x, event.y, (int)event.fingerId)};
            events::Touch::broadcast(touch);
            break;
        }
        case SDL_FINGERMOTION: {
            const SDL_TouchFingerEvent &event = sdlEvent.tfinger;
            touch.type = TouchEvent::Type::MOVED;
            touch.touches = {TouchInfo(event.x, event.y, (int)event.fingerId)};
            events::Touch::broadcast(touch);
            break;
        }
        case SDL_KEYDOWN: {
            const SDL_KeyboardEvent &event = sdlEvent.key;
            auto mode = event.keysym.mod;
            keyboard.action = KeyboardEvent::Action::PRESS;
            keyboard.key = sdlKeycodeToCocosCode(event.keysym.sym, mode);
            keyboard.altKeyActive = mode & KMOD_ALT;
            keyboard.ctrlKeyActive = mode & KMOD_CTRL;
            keyboard.shiftKeyActive = mode & KMOD_SHIFT;
            //CC_LOG_DEBUG("==> key %d -> code %d", event.keysym.sym, keyboard.key);
            events::Keyboard::broadcast(keyboard);
            break;
        }
        case SDL_KEYUP: {
            const SDL_KeyboardEvent &event = sdlEvent.key;
            auto mode = event.keysym.mod;
            keyboard.action = KeyboardEvent::Action::RELEASE;
            keyboard.key = sdlKeycodeToCocosCode(event.keysym.sym, mode);
            keyboard.altKeyActive = mode & KMOD_ALT;
            keyboard.ctrlKeyActive = mode & KMOD_CTRL;
            keyboard.shiftKeyActive = mode & KMOD_SHIFT;
            events::Keyboard::broadcast(keyboard);
            break;
            break;
        }
        default:
            break;
    }
}

SDL_Window *SDLHelper::createWindow(const char *title,
                                    int w, int h, int flags) {
    SDL_Rect screenRect;
    if (SDL_GetDisplayUsableBounds(0, &screenRect) != 0) {
        return nullptr;
    }
    int x = screenRect.x;
    int y = screenRect.y + screenRect.h - h;
    return createWindow(title, x, y, w, h, flags);
}

SDL_Window *SDLHelper::createWindow(const char *title,
                                    int x, int y, int w,
                                    int h, int flags) {
    // Create window
    int sdlFlags = windowFlagsToSDLWindowFlag(flags);
    SDL_Window *handle = SDL_CreateWindow(title, x, y, w, h, sdlFlags);
    if (handle == nullptr) {
        // Display error message
        CC_LOG_ERROR("Window could not be created! SDL_Error: %s\n", SDL_GetError());
        return nullptr;
    }

    return handle;
}

void SDLHelper::setCursorEnabled(bool value) {
    SDL_SetRelativeMouseMode(value ? SDL_FALSE : SDL_TRUE);
    events::PointerLock::broadcast(!value);
}

#if (CC_PLATFORM == CC_PLATFORM_LINUX)
uintptr_t SDLHelper::getDisplay(SDL_Window *window) {
    SDL_SysWMinfo wmInfo;
    SDL_VERSION(&wmInfo.version);
    SDL_GetWindowWMInfo(window, &wmInfo);
    return reinterpret_cast<uintptr_t>(wmInfo.info.x11.display);
}
#endif

uintptr_t SDLHelper::getWindowHandle(SDL_Window *window) {
    SDL_SysWMinfo wmInfo;
    SDL_VERSION(&wmInfo.version);
    SDL_GetWindowWMInfo(window, &wmInfo);

#if CC_PLATFORM == CC_PLATFORM_WINDOWS
    return reinterpret_cast<uintptr_t>(wmInfo.info.win.window);
#elif (CC_PLATFORM == CC_PLATFORM_LINUX)
    return reinterpret_cast<uintptr_t>(wmInfo.info.x11.window);
#elif (CC_PLATFORM == CC_PLATFORM_MACOS)
    return reinterpret_cast<uintptr_t>(wmInfo.info.cocoa.window);
#endif
    CC_ABORT();
    return 0;
}

Vec2 SDLHelper::getWindowPosition(SDL_Window *window) {
    int x = 0;
    int y = 0;
    SDL_GetWindowPosition(window, &x, &y);
    return Vec2(x, y);
}

void SDLHelper::stopTextInput() {
    SDL_StopTextInput();
}

bool SDLHelper::isWindowMinimized(SDL_Window *window) {
    return SDL_GetWindowFlags(window) & SDL_WINDOW_MINIMIZED;
}

} // namespace cc
