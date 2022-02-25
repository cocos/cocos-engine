/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/empty/EmptyPlatform.h"

#include <sys/time.h>
#include <unistd.h>

#include "platform/interfaces/OSInterface.h"
#include "platform/interfaces/modules/ISystemWindow.h"

namespace cc {
EmptyPlatform::EmptyPlatform() = default;
EmptyPlatform::~EmptyPlatform() {
}

int32_t EmptyPlatform::init() {
    UniversalPlatform::init();

    //init
    return 0;
}

int32_t EmptyPlatform::loop() {
    while (!_quit) {
        usleep(1000);
    }
    return 0;
}

void EmptyPlatform::pollEvent() {
}

bool EmptyPlatform::createWindow(const char *title,
                                 int x, int y, int w,
                                 int h, int flags) {
    return true;
}

uintptr_t EmptyPlatform::getWindowHandler() const {
    return -1;
}

} // namespace cc
