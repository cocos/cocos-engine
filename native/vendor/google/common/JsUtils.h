/****************************************************************************
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include "bindings/jswrapper/SeApi.h"

namespace cc {

se::Value invokeJsCallback(se::Object* obj, const char* jsFunctionName, const se::ValueArray& args);

template <typename... Args>
se::Value callJSfunc(se::Object* obj, const char* jsFunctionName, Args&&... inargs){ // NOLINT(readability-identifier-naming)
    if (!se::ScriptEngine::getInstance()->isValid()) {
        return se::Value();
    }
    se::AutoHandleScope scope;
    se::ValueArray args;
    args.resize(sizeof...(Args));
    nativevalue_to_se_args_v(args, inargs...);
    return invokeJsCallback(obj, jsFunctionName, args);
}

se::Value callJSfunc(se::Object* obj, const char* jsFunctionName);

}