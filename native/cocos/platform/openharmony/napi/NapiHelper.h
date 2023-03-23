/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include <napi/native_api.h>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"

namespace cc {

class NapiHelper {
public:

    static napi_value getContext(napi_env env, napi_callback_info info);
    // APP Lifecycle
    static napi_value napiOnCreate(napi_env env, napi_callback_info info);
    static napi_value napiOnShow(napi_env env, napi_callback_info info);
    static napi_value napiOnHide(napi_env env, napi_callback_info info);
    static napi_value napiOnDestroy(napi_env env, napi_callback_info info);

    // JS Page : Lifecycle
    static napi_value napiOnPageShow(napi_env env, napi_callback_info info);
    static napi_value napiOnPageHide(napi_env env, napi_callback_info info);

    // Worker Func
    static napi_value napiWorkerInit(napi_env env, napi_callback_info info);
    static napi_value napiASend(napi_env env, napi_callback_info info);
    static napi_value napiNativeEngineInit(napi_env env, napi_callback_info info);
    static napi_value napiNativeEngineStart(napi_env env, napi_callback_info info);

    static napi_value napiWritablePathInit(napi_env env, napi_callback_info info);
    static napi_value napiResourceManagerInit(napi_env env, napi_callback_info info);

    template <class ReturnType>
    static napi_value napiCallFunction(const std::string& functionName, ReturnType* value) {
        if (!se::ScriptEngine::getInstance()->isValid()) {
            return nullptr;
        }
        se::Value tickVal;
        se::AutoHandleScope scope;
        if (tickVal.isUndefined()) {
            se::ScriptEngine::getInstance()->getGlobalObject()->getProperty(functionName, &tickVal);
        }
        se::Value rval;
        se::ValueArray tickArgsValArr(1);
        if (!tickVal.isUndefined()) {
            tickVal.toObject()->call(tickArgsValArr, nullptr, &rval);
        }
        if(rval.isNullOrUndefined()) {
            return nullptr;
        }
        bool ok = true;
        ok &= sevalue_to_native(rval, value, nullptr);
        SE_PRECONDITION2(ok, nullptr, "Error processing arguments");
        return nullptr;
    }
    static napi_value napiSetPostMessageFunction(napi_env env, napi_callback_info info);
    // Napi export
    static bool exportFunctions(napi_env env, napi_value exports);

    template <typename ParamType>
    static void postMessageToUIThread(const std::string& type, ParamType param) {
        if (!_postMsg2UIThreadCb) {
            return;
        }
        CC_UNUSED bool ok = true;
        se::Value value;
        ok &= nativevalue_to_se(param, value, nullptr /*ctx*/);
        _postMsg2UIThreadCb(type, value);
    }

    template <typename ParamType, typename ResType>
    static void postSyncMessageToUIThread(const std::string& type, ParamType param, ResType* res) {
        if (!_postSyncMsg2UIThreadCb) {
            return;
        }
        CC_UNUSED bool ok = true;
        se::Value value;
        ok &= nativevalue_to_se(param, value, nullptr /*ctx*/);
        se::Value seOut;
        _postSyncMsg2UIThreadCb(type, value, &seOut);
        sevalue_to_native(seOut, res, nullptr);
    }

public:
    using PostMessage2UIThreadCb = std::function<void(const std::string&, const se::Value&)>;
    static PostMessage2UIThreadCb _postMsg2UIThreadCb;
    using PostSyncMessage2UIThreadCb = std::function<void(const std::string&, const se::Value&, se::Value*)>;
    static PostSyncMessage2UIThreadCb _postSyncMsg2UIThreadCb;
};

}
