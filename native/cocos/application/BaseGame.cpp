/****************************************************************************
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include "BaseGame.h"
#include <string>
#include "renderer/pipeline/GlobalDescriptorSetManager.h"

extern "C" void cc_load_all_plugins(); // NOLINT

namespace cc {
int BaseGame::init() {
    cc::pipeline::GlobalDSManager::setDescriptorSetLayout();

    cc_load_all_plugins();

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
        if (_windowInfo.x == -1 || _windowInfo.y == -1) {
            createWindow(_windowInfo.title.c_str(), _windowInfo.width, _windowInfo.height, _windowInfo.flags);
        } else {
            createWindow(_windowInfo.title.c_str(),
                         _windowInfo.x, _windowInfo.y, _windowInfo.width, _windowInfo.height, _windowInfo.flags);
        }
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
