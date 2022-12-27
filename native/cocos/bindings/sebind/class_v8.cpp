/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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
#include "class_v8.h"

namespace sebind {
// adoption layer from v8 function to se function
void genericFunction(const v8::FunctionCallbackInfo<v8::Value> &v8args) {
    void *ctx = v8args.Data().IsEmpty() ? nullptr : v8args.Data().As<v8::External>()->Value();
    auto *method = reinterpret_cast<intl::InstanceMethodBase *>(ctx);
    assert(ctx);
    bool ret = false;
    v8::Isolate *isolate = v8args.GetIsolate();
    v8::HandleScope handleScope(isolate);
    bool needDeleteValueArray{false};
    se::ValueArray &args = se::gValueArrayPool.get(v8args.Length(), needDeleteValueArray);
    se::CallbackDepthGuard depthGuard{args, se::gValueArrayPool._depth, needDeleteValueArray};
    se::internal::jsToSeArgs(v8args, args);
    auto *thisObject = reinterpret_cast<se::Object *>(se::internal::getPrivate(isolate, v8args.This()));
    se::State state(thisObject, args);
    ret = method->invoke(state);
    if (!ret) {
        SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", method->methodName.c_str(), __FILE__, __LINE__);
    }
    se::internal::setReturnValue(state.rval(), v8args);
}

} // namespace sebind
