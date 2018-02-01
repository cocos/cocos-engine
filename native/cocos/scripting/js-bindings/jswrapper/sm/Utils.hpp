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

#include "../config.hpp"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM

#include "Base.h"

#include "../Value.hpp"

namespace se {

    class Class;

    namespace internal {

        struct PrivateData
        {
            void* data;
            JSFinalizeOp finalizeCb;
        };

        void forceConvertJsValueToStdString(JSContext* cx, JS::HandleValue jsval, std::string* ret);
        std::string jsToStdString(JSContext* cx, JS::HandleString jsStr);

        void jsToSeArgs(JSContext* cx, int argc, const JS::CallArgs& argv, ValueArray* outArr);
        void jsToSeValue(JSContext *cx, JS::HandleValue jsval, Value* v);
        void seToJsArgs(JSContext* cx, const ValueArray& args, JS::AutoValueVector* outArr);
        void seToJsValue(JSContext* cx, const Value& v, JS::MutableHandleValue outVal);
        
        void setReturnValue(JSContext* cx, const Value& data, const JS::CallArgs& argv);

        bool hasPrivate(JSContext* cx, JS::HandleObject obj);
        void* getPrivate(JSContext* cx, JS::HandleObject obj);
        void setPrivate(JSContext* cx, JS::HandleObject obj, void* data, JSFinalizeOp finalizeCb);
        void clearPrivate(JSContext* cx, JS::HandleObject obj);

    } // namespace internal {

} // namespace se {

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
