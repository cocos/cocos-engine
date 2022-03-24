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

#include "CocosApplication.h"

#include <string>

namespace cc {
class SimpleCocosApplication : public CocosApplication {
public:
    SimpleCocosApplication() = default;
    int init() override {
        createWindow(windowTitle.c_str(), windowX, windowY, windowWidth, windowHeight, windowFlags);

        if (enableDebugger) {
            setJsDebugIpAndPort(debugListenAddress, debugPort, debugPauseOnStart);
        }

        int ret = cc::CocosApplication::init();
        if (ret != 0) {
            return ret;
        }

        setXXTeaKey(xxTeaKey);

        runJsScript("jsb-adapter/jsb-builtin.js");
        runJsScript("main.js");
        return 0;
    }

protected:
    std::string windowTitle;
    int32_t     windowX{0};
    int32_t     windowY{0};
    int32_t     windowWidth{0};
    int32_t     windowHeight{0};
    int32_t     windowFlags = cc::ISystemWindow::CC_WINDOW_SHOWN |
                          cc::ISystemWindow::CC_WINDOW_RESIZABLE |
                          cc::ISystemWindow::CC_WINDOW_INPUT_FOCUS;
    std::string xxTeaKey{""};
    bool        enableDebugger{true};
    int32_t     debugPort{6086};
    std::string debugListenAddress{"0.0.0.0"};
    bool        debugPauseOnStart{false};
};
} // namespace cc