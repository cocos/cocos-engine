/****************************************************************************
Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#undef CC_USE_NVN
#undef CC_USE_VULKAN
#undef CC_USE_METAL
#undef CC_USE_GLES3
#undef CC_USE_GLES2

#include "bindings/jswrapper/SeApi.h"
#include "core/Root.h"
#include "gtest/gtest.h"
#include "renderer/GFXDeviceManager.h"

using namespace cc;
using namespace cc::gfx;

// Fix linking error of undefined symbol cocos_main
int cocos_main(int argc, const char** argv) {
    return 0;
}

int main(int argc, const char* argv[]) {
    int ret = 0;
    cocos_main(argc, argv);

    Root* root = new Root(DeviceManager::create());
    se::ScriptEngine* scriptEngine = new se::ScriptEngine();
    scriptEngine->start();
    {
        se::AutoHandleScope hs;
        ::testing::InitGoogleTest(&argc, (char**)argv);
        ret = RUN_ALL_TESTS();
    }
    scriptEngine->cleanup();
    delete root;
    delete scriptEngine;
    return ret;
}
