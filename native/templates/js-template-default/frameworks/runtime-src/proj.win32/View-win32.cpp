/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

#include "View-win32.h"
#include "Game.h"

using namespace cocos2d;

View::View(const std::string & title, int width, int height) :
    _title(title), _width(width), _height(height)
{
}

View::~View()
{
    if (_window)
    {
        SDL_DestroyWindow(_window);
        _window = nullptr;
    }
    if (_inited) {
        SDL_Quit();
    }
}

bool View::init()
{
    if (SDL_Init(SDL_INIT_VIDEO) < 0)
    {
        // Display error message
        CCLOGERROR("SDL could not initialize! SDL_Error: %s\n", SDL_GetError());
        return false;
    }
    _inited = true;
    // Create window
    uint32_t flags = SDL_WINDOW_SHOWN|
        SDL_WINDOW_RESIZABLE|
        SDL_WINDOW_INPUT_FOCUS;
    _window = SDL_CreateWindow(_title.c_str(), SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, _width, _height, flags);
    if (_window == NULL)
    {
        // Display error message
        CCLOGERROR("Window could not be created! SDL_Error: %s\n", SDL_GetError());
        return false;
    }
    return true;
}

bool View::pollEvent(bool * quit, Game *game)
{
    int cnt = SDL_PollEvent(&sdlEvent);
    if (cnt == 0) return false;
    cocos2d::TouchEvent  touch;
    cocos2d::MouseEvent mouse;
    cocos2d::KeyboardEvent  keyboard;
    switch (sdlEvent.type)
    {
    case SDL_QUIT:
    {
        if (quit) *quit = true;
        break;
    }
    case SDL_WINDOWEVENT:
    {
        SDL_WindowEvent &wevent = sdlEvent.window;
        switch (wevent.event) {
        case SDL_WINDOWEVENT_SHOWN:
        case SDL_WINDOWEVENT_RESTORED:
            game->onResume();
            break;
        case SDL_WINDOWEVENT_SIZE_CHANGED:
        case SDL_WINDOWEVENT_RESIZED:
            cocos2d::EventDispatcher::dispatchResizeEvent(wevent.data1, wevent.data2);
            break;
        case SDL_WINDOWEVENT_HIDDEN:
            game->onPause();
            break;
        default: 
            break;
        }
    }
    case SDL_MOUSEBUTTONDOWN:
    {
        SDL_MouseButtonEvent& event = sdlEvent.button;
        mouse.type = MouseEvent::Type::DOWN;
        mouse.x = event.x;
        mouse.y = event.y;
        mouse.button = event.button;
        cocos2d::EventDispatcher::dispatchMouseEvent(mouse);
        break;
    }
    case SDL_MOUSEBUTTONUP:
    {
        SDL_MouseButtonEvent& event = sdlEvent.button;
        mouse.type = MouseEvent::Type::UP;
        mouse.x = event.x;
        mouse.y = event.y;
        mouse.button = event.button;
        cocos2d::EventDispatcher::dispatchMouseEvent(mouse);
        break;
    }
    case SDL_MOUSEMOTION:
    {
        SDL_MouseMotionEvent& event = sdlEvent.motion;
        mouse.type = MouseEvent::Type::MOVE;
        mouse.x = event.x;
        mouse.y = event.y;
        mouse.button = 0;
        cocos2d::EventDispatcher::dispatchMouseEvent(mouse);
        break;
    }
    case SDL_MOUSEWHEEL:
    {
        SDL_MouseWheelEvent& event = sdlEvent.wheel;
        mouse.type = MouseEvent::Type::WHEEL;
        mouse.x = event.x;
        mouse.y = event.y;
        mouse.button = 0; //TODO: direction
        cocos2d::EventDispatcher::dispatchMouseEvent(mouse);
        break;
    }
    case SDL_FINGERUP:
    {
        SDL_TouchFingerEvent& event = sdlEvent.tfinger;
        touch.type = TouchEvent::Type::ENDED;
        touch.touches = { TouchInfo(event.x, event.y, (int)event.fingerId) };
        cocos2d::EventDispatcher::dispatchTouchEvent(touch);
        break;
    }
    case SDL_FINGERDOWN:
    {
        SDL_TouchFingerEvent& event = sdlEvent.tfinger;
        touch.type = TouchEvent::Type::BEGAN;
        touch.touches = { TouchInfo(event.x, event.y, (int)event.fingerId) };
        cocos2d::EventDispatcher::dispatchTouchEvent(touch);
        break;
    }
    case SDL_FINGERMOTION:
    {
        SDL_TouchFingerEvent& event = sdlEvent.tfinger;
        touch.type = TouchEvent::Type::MOVED;
        touch.touches = { TouchInfo(event.x, event.y, (int)event.fingerId) };
        cocos2d::EventDispatcher::dispatchTouchEvent(touch);
        break;
    }
    case SDL_KEYDOWN:
    {
        SDL_KeyboardEvent& event = sdlEvent.key;
        auto mode = event.keysym.mod;
        keyboard.action = KeyboardEvent::Action::PRESS;
        keyboard.key = event.keysym.sym;
        keyboard.altKeyActive = mode & KMOD_ALT;
        keyboard.ctrlKeyActive = mode & KMOD_CTRL;
        keyboard.shiftKeyActive = mode & KMOD_SHIFT;
        cocos2d::EventDispatcher::dispatchKeyboardEvent(keyboard);
        break;
    }
    case SDL_KEYUP:
    {
        SDL_KeyboardEvent& event = sdlEvent.key;
        auto mode = event.keysym.mod;
        keyboard.action = KeyboardEvent::Action::RELEASE;
        keyboard.key = event.keysym.sym;
        keyboard.altKeyActive = mode & KMOD_ALT;
        keyboard.ctrlKeyActive = mode & KMOD_CTRL;
        keyboard.shiftKeyActive = mode & KMOD_SHIFT;
        cocos2d::EventDispatcher::dispatchKeyboardEvent(keyboard);
        break;
    }
    default:

        break;
    }



    return true;
}

HWND View::getWindowHandler()
{
    assert(_window);
    SDL_SysWMinfo wmInfo;
    SDL_VERSION(&wmInfo.version);
    SDL_GetWindowWMInfo(_window, &wmInfo);
    return wmInfo.info.win.window;
}

void View::setCursorEnabeld(bool enable)
{
    if (enable) {
        SDL_RaiseWindow(_window);
    }
}
