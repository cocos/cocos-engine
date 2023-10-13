/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

#include "AndroidApp.h"
#include <android/native_window_jni.h>
#include "base/Macros.h"

#include "AndroidMessage.h"

namespace cc {

void NativeWindowCache::setSurface(jobject surface) {
    if (_nativeWindow != nullptr) {
        ANativeWindow_release(_nativeWindow);
    }
    if (surface != nullptr) {
        _nativeWindow = ANativeWindow_fromSurface(env, surface);
    } else {
        _nativeWindow = nullptr;
    }
}

AndroidApp::AndroidApp() {
    // running in main thread
    _gameRequestHandler = new MessageHandler(new CocosLooper());
    _gameRequestHandler->getLooper()->prepareMainLooper(AndroidApp::processGameRequest);
}

AndroidApp::~AndroidApp() {
    delete _gameRequestHandler;
    delete _appCmdHandler;
}

bool AndroidApp::hasWindow() {
    return std::any_of(_vecNativeWindow.begin(), _vecNativeWindow.end(), [](auto *nativeWindow) {
        return nativeWindow != nullptr;
    });
}

void AndroidApp::processAppCmd(AndroidApp* app) {
    auto msg = app->_appCmdHandler->getLooper()->getMessage();
    switch (msg.cmd) {
        case APP_CMD_INIT_WINDOW:
            break;
        case APP_CMD_TERM_WINDOW:
            break;
    }
}

void AndroidApp::processGameRequest(int fd, int events, void* data) {
    CC_UNUSED_PARAM(fd);
    CC_UNUSED_PARAM(events);
    auto* app = static_cast<AndroidApp*>(data);

    auto msg = app->_gameRequestHandler->getLooper()->getMessage();
    switch (msg.cmd) {
        case GAME_CMD_REQUEST_EXIT:
            break;
        case GAME_CMD_REQUEST_CREATE_RENDER_VIEW:
            break;
    }
}

} // namespace cc
