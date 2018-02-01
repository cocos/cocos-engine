/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
#pragma once

#include "libplatform/libplatform.h"

//#define V8_DEPRECATION_WARNINGS 1
//#define V8_IMMINENT_DEPRECATION_WARNINGS 1
//#define V8_HAS_ATTRIBUTE_DEPRECATED_MESSAGE 1

#include "v8.h"

#include <string>
#include <string.h> // Resolves that memset, memcpy aren't found while APP_PLATFORM >= 22 on Android
#include <vector>
#include <unordered_map>
#include <functional>
#include <algorithm> // for std::find
#include <chrono>
#include <assert.h>

#include "HelperMacros.h"


namespace se {
    using V8FinalizeFunc = void (*)(void* nativeObj);
}
