/****************************************************************************
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include "platform/java/modules/SystemWindow.h"
#include <fcntl.h>
#include <jni.h>
#include <unistd.h>
#include <functional>
#include <thread>
#include <vector>
#include "base/Log.h"
#include "base/Macros.h"
#include "platform/java/jni/JniImp.h"
#include "platform/java/jni/glue/JniNativeGlue.h"


namespace {

} // namespace

namespace cc {

bool SystemWindow::createWindow(const char *title,
                                int x, int y, int w,
                                int h, int flags) {
    CC_UNUSED_PARAM(title);
    CC_UNUSED_PARAM(x);
    CC_UNUSED_PARAM(y);
    CC_UNUSED_PARAM(w);
    CC_UNUSED_PARAM(h);
    CC_UNUSED_PARAM(flags);
    return true;
}

void SystemWindow::setCursorEnabled(bool value) {
}

void SystemWindow::copyTextToClipboard(const std::string &text) {
    copyTextToClipboardJNI(text);
}

uintptr_t SystemWindow::getWindowHandler() const {
    return reinterpret_cast<uintptr_t>(
        JNI_NATIVE_GLUE()->getWindowHandler());
}

SystemWindow::Size SystemWindow::getViewSize() const {
    return Size{static_cast<float>(JNI_NATIVE_GLUE()->getWidth()),
                static_cast<float>(JNI_NATIVE_GLUE()->getHeight())};
}

} // namespace cc