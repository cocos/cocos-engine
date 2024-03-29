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

#include "application/ApplicationManager.h"
#include "base/Macros.h"

namespace cc {
// static
ApplicationManager *ApplicationManager::getInstance() {
    static ApplicationManager mgr;
    return &mgr;
}

void ApplicationManager::releaseAllApplications() {
    _apps.clear();
}

ApplicationManager::ApplicationPtr ApplicationManager::getCurrentApp() const {
    if (_currentApp.expired()) {
        return nullptr;
    }
    return _currentApp.lock();
}

ApplicationManager::ApplicationPtr ApplicationManager::getCurrentAppSafe() const {
    CC_ASSERT(!_currentApp.expired());
    return _currentApp.lock();
}
} // namespace cc

//
void cocos_destory() { // NOLINT(readability-identifier-naming)
    // Called in the platform layer, because the platform layer is isolated from the application layer
    // It is the platform layer to drive applications and reclaim resources.
    cc::ApplicationManager::getInstance()->releaseAllApplications();
}