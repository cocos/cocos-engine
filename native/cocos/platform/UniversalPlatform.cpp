/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "platform/UniversalPlatform.h"

#include "platform/interfaces/OSInterface.h"

extern int cocos_main(int argc, const char** argv); // NOLINT(readability-identifier-naming)
extern void cocos_destory();                        // NOLINT(readability-identifier-naming)

namespace cc {
UniversalPlatform::OSType UniversalPlatform::getOSType() const {
    return getInterface<ISystem>()->getOSType();
}

int32_t UniversalPlatform::run(int argc, const char** argv) {
    if (cocos_main(argc, argv) != 0) {
        return -1;
    }
    return loop();
}

int UniversalPlatform::getSdkVersion() const {
    return 0;
}

void UniversalPlatform::runInPlatformThread(const ThreadCallback& task) {
    _mainTask = task;
}

void UniversalPlatform::runTask() {
    if (_mainTask) {
        _mainTask();
    }
}

int32_t UniversalPlatform::getFps() const {
    return _fps;
}

void UniversalPlatform::setFps(int32_t fps) {
    _fps = fps;
}

void UniversalPlatform::pollEvent() {
}

void UniversalPlatform::onPause() {
}

void UniversalPlatform::onResume() {
}

void UniversalPlatform::onClose() {
}

void UniversalPlatform::onDestroy() {
    cocos_destory();
}

void UniversalPlatform::exit() {

}

} // namespace cc
