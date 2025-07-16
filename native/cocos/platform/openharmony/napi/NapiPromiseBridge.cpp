/****************************************************************************
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

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
#include "cocos/platform/openharmony/napi/NapiPromiseBridge.h"
#include "cocos/platform/openharmony/napi/NapiHelper.h"
#include "cocos/bindings/jswrapper/SeApi.h"

namespace cc {
struct CallbackData {
    se::Object* object;
};

se::Object* NapiPromiseBridge::createPromise(Napi::Value napiPromise) {
    bool isPromise{false};
    auto env = NapiHelper::getWorkerEnv();
    napi_status status = napi_is_promise(env, napiPromise, &isPromise);
    if (status != napi_ok) {
        SE_REPORT_ERROR("The returned type is not a promise");
        return nullptr;
    }
#if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_JSVM) || (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8)
    se::Object* sePromise = se::Object::createPromise();
    bindArkPromise(napiPromise, sePromise);
    return sePromise;
#else
    return se::Object::_createJSObject(env, napiPromise, nullptr);
#endif
}

#if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_JSVM) || (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8)
void NapiPromiseBridge::bindArkPromise(Napi::Value napiPromise, se::Object* sePromise) {
    auto cbData = new CallbackData{sePromise};
    auto env = NapiHelper::getWorkerEnv();
    napi_value onFulfilled;
    napi_create_function(env, "onFulfilled", -1, [](napi_env env, napi_callback_info info) -> napi_value {
            se::AutoHandleScope hs;
            size_t argc = 1;
            napi_value argv[1];
            void* data;
            napi_get_cb_info(env, info, &argc, argv, nullptr, &data);
            se::Value seArg;
            NapiValueConverter::NapiValueToSeValue(env, argv[0], &seArg);
            auto cbData = static_cast<CallbackData*>(data);
            se::Object::resolverPromise(cbData->object, seArg);

            napi_value undefined;
            napi_get_undefined(env, &undefined);
            delete cbData;
            return undefined; }, cbData, &onFulfilled);

    napi_value onRejected;
    napi_create_function(env, "onRejected", -1, [](napi_env env, napi_callback_info info) -> napi_value {
            se::AutoHandleScope hs;
            size_t argc = 1;
            napi_value argv[1];
            void* data;
            napi_get_cb_info(env, info, &argc, argv, nullptr, &data);
            se::Value seArg;
            NapiValueConverter::NapiValueToSeValue(env, argv[0], &seArg);
            auto cbData = static_cast<CallbackData*>(data);
            se::Object::rejectPromise(cbData->object, seArg);
            napi_value undefined;
            napi_get_undefined(env, &undefined);
            delete cbData;
            return undefined; }, cbData, &onRejected);

    napi_value thenFunc;
    napi_get_named_property(env, napiPromise, "then", &thenFunc);

    napi_value argvThen[2] = {onFulfilled, onRejected};
    napi_value thenResult;
    napi_call_function(env, napiPromise, thenFunc, 2, argvThen, &thenResult);
}
#endif
} // namespace cc