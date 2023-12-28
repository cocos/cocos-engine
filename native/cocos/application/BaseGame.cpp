/****************************************************************************
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

#include "BaseGame.h"
#include <string>
#include "ApplicationManager.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"
#include "renderer/pipeline/GlobalDescriptorSetManager.h"

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #include "platform/android/adpf_manager.h"
#endif
extern "C" void cc_load_all_plugins(); // NOLINT

namespace cc {
int BaseGame::init() {
    cc::pipeline::GlobalDSManager::setDescriptorSetLayout();

    cc_load_all_plugins();

#if (CC_PLATFORM == CC_PLATFORM_ANDROID) && CC_SUPPORT_ADPF
    ADPFManager::getInstance().initialize();
#endif

#if CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_LINUX || CC_PLATFORM == CC_PLATFORM_QNX || CC_PLATFORM == CC_PLATFORM_MACOS
    // override default value
    //_windowInfo.x      = _windowInfo.x == -1 ? 0 : _windowInfo.x;
    //_windowInfo.y      = _windowInfo.y == -1 ? 0 : _windowInfo.y;
    _windowInfo.width = _windowInfo.width == -1 ? 800 : _windowInfo.width;
    _windowInfo.height = _windowInfo.height == -1 ? 600 : _windowInfo.height;
    _windowInfo.flags = _windowInfo.flags == -1 ? cc::ISystemWindow::CC_WINDOW_SHOWN |
                                                      cc::ISystemWindow::CC_WINDOW_RESIZABLE |
                                                      cc::ISystemWindow::CC_WINDOW_INPUT_FOCUS
                                                : _windowInfo.flags;
    std::call_once(_windowCreateFlag, [&]() {
        ISystemWindowInfo info;
        info.title = _windowInfo.title;
    #if CC_PLATFORM == CC_PLATFORM_WINDOWS
        info.x = _windowInfo.x == -1 ? 50 : _windowInfo.x; // 50 meams move window a little for now
        info.y = _windowInfo.y == -1 ? 50 : _windowInfo.y; // same above
    #else
        info.x = _windowInfo.x == -1 ? 0 : _windowInfo.x;
        info.y = _windowInfo.y == -1 ? 0 : _windowInfo.y;
    #endif
        info.width = _windowInfo.width;
        info.height = _windowInfo.height;
        info.flags = _windowInfo.flags;

        ISystemWindowManager* windowMgr = CC_GET_PLATFORM_INTERFACE(ISystemWindowManager);
        windowMgr->createWindow(info);
    });

#endif

    if (_debuggerInfo.enabled) {
        setDebugIpAndPort(_debuggerInfo.address, _debuggerInfo.port, _debuggerInfo.pauseOnStart);
    }

    int ret = cc::CocosApplication::init();
    if (ret != 0) {
        return ret;
    }

    setXXTeaKey(_xxteaKey);
    runScript("jsb-adapter/web-adapter.js");
    runScript("main.js");
    return 0;
}
} // namespace cc
