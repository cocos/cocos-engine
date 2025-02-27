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

#define NODE_ADDON_API_ENABLE_TYPE_CHECK_ON_AS 1
#define NAPI_DISABLE_CPP_EXCEPTIONS            1
#define NODE_ADDON_API_DISABLE_DEPRECATED      1
#include "NapiValueConverter.h"
#include "base/Log.h"
#include "napi.h"

namespace cc {
using CallbackParamType = std::variant<std::string, double, bool>;

struct CallParam {
    bool isSync;
    std::function<void(CallbackParamType)> cb;
    std::string paramStr;
    char *module_info;
    const char *clsPath;
    const char *method;
};

class NapiHelper {
public:
    static Napi::Env getWorkerEnv();
    static Napi::Object init(Napi::Env env, Napi::Object exports);
    static Napi::Value napiCallFunction(const char *functionName);
    static Napi::Value napiCallFunction(const char *functionName, float duration);
    static void postMessageToUIThread(const std::string &type, Napi::Value param);
    static Napi::Value postSyncMessageToUIThread(const std::string &type, Napi::Value param);
};

class JSFunction {
public:
    napi_env env;
    napi_threadsafe_function saveFunc;

public:
    static std::unordered_map<std::string, JSFunction> jsFunctionMap;

    explicit JSFunction(napi_env env, napi_threadsafe_function save_func)
    : env(env), saveFunc(save_func) {}

    static JSFunction getFunction(std::string functionName) {
        return jsFunctionMap.at(functionName);
    }

    static void addFunction(std::string name, JSFunction jsFunction) {
        jsFunctionMap.emplace(name, jsFunction);
    }

    void invoke(CallParam *callParam) {
        napi_status status;
        status = napi_acquire_threadsafe_function(saveFunc);
        if (status != napi_ok) {
            CC_LOG_WARNING("invokeAsync napi_acquire_threadsafe_function fail,status=%{public}d", status);
            return;
        }

        status = napi_call_threadsafe_function(saveFunc, callParam, napi_tsfn_blocking);
        if (status != napi_ok) {
            CC_LOG_WARNING("invokeAsync napi_call_threadsafe_function fail,status=%{public}d", status);
            return;
        }
    }
    
    static void CallJS(napi_env env, napi_value js_cb, void *context, void *data) {
        CallParam *callParam = (CallParam*) (data);
        if(callParam->isSync){
            CallJsSync(env, js_cb, context, data);
        } else{
            CallJsAsync(env, js_cb, context, data);
        }
    }
    
    static void CallJsAsync(napi_env env, napi_value js_cb, void *context, void *data) {
        CallParam *callParam = (CallParam *)(data);
        if (callParam == nullptr) {
            CC_LOG_WARNING("CallJS CallParam callParam is null");
            return;
        }

        napi_status status;
        
        auto callback = [](napi_env env, napi_callback_info info) -> napi_value {
            size_t argc = 1;
            napi_value args[1] = {};
            void *param_in = nullptr;
            napi_get_cb_info(env, info, &argc, args, nullptr, &param_in);

            napi_value return_val;
            napi_get_undefined(env, &return_val);

            CallParam *callbackParam = reinterpret_cast<CallParam *>(param_in);
            if (callbackParam == nullptr) {
                CC_LOG_WARNING("CallJS CallParam callbackParam is null");
                return return_val;
            }

            napi_valuetype type;
            napi_typeof(env, args[0], &type);

            CallbackParamType callbackValue;

            if (type == napi_string) {
                std::string resultStr;
                NapiValueConverter::ToCppValue(env, args[0], resultStr);
                callbackValue = std::move(resultStr);
            } else if (type == napi_number) {
                double resultNum;
                NapiValueConverter::ToCppValue(env, args[0], resultNum);
                callbackValue = resultNum;
            } else if (type == napi_boolean) {
                bool resultBol;
                NapiValueConverter::ToCppValue(env, args[0], resultBol);
                callbackValue = resultBol;
            } else {
                callbackValue = "unknown";
                CC_LOG_WARNING("callbackValue returns incorrect value type");
            }
            callbackParam->cb(callbackValue);
            return return_val;
        };

        napi_value callbackFunc = nullptr;
        status = napi_create_function(env, "callbackFunc", NAPI_AUTO_LENGTH, callback, callParam, &callbackFunc);
        if (status != napi_ok) {
            CC_LOG_WARNING("CallJS napi_create_function fail,status=%{public}d", status);
            return;
        }

        napi_value result;
        status = napi_load_module_with_info(env, callParam->clsPath, callParam->module_info, &result);
        if (status != napi_ok) {
            CC_LOG_WARNING("callNativeMethod napi_load_module_with_info fail, status=%{public}d", status);
            return;
        }

        napi_value callFunc;
        status = napi_get_named_property(env, result, callParam->method, &callFunc);
        if (status != napi_ok) {
            CC_LOG_WARNING("callNativeMethod napi_get_named_property fail, status=%{public}d", status);
            return;
        }

        napi_value jsArgs[3] = {callFunc, NapiValueConverter::ToNapiValue(env, callParam->paramStr), callbackFunc};
        napi_value return_val;
        napi_value global;
        status = napi_get_global(env, &global);
        if (status != napi_ok) {
            CC_LOG_WARNING("CallJS napi_get_global fail,status=%{public}d", status);
        }

        status = napi_call_function(env, global, js_cb, 3, jsArgs, &return_val);
        if (status != napi_ok) {
            CC_LOG_WARNING("CallJS napi_call_function fail,status=%{public}d", status);
        }
    }

    static void CallJsSync(napi_env env, napi_value js_cb, void *context, void *data) {
        CallParam *callParam = (CallParam *)(data);
        if (callParam == nullptr) {
            CC_LOG_WARNING("CallJS CallParam callParam is null");
            return;
        }

        napi_status status;
        napi_value result;
        status = napi_load_module_with_info(env, callParam->clsPath, callParam->module_info, &result);
        if (status != napi_ok) {
            CC_LOG_WARNING("callNativeMethod napi_load_module_with_info fail, status=%{public}d", status);
            return;
        }

        napi_value callFunc;
        status = napi_get_named_property(env, result, callParam->method, &callFunc);
        if (status != napi_ok) {
            CC_LOG_WARNING("callNativeMethod napi_get_named_property fail, status=%{public}d", status);
            return;
        }

        napi_value jsArgs[2] = {callFunc, NapiValueConverter::ToNapiValue(env, callParam->paramStr)};
        napi_value return_val;
        napi_value global;
        status = napi_get_global(env, &global);
        if (status != napi_ok) {
            CC_LOG_WARNING("CallJS napi_get_global fail,status=%{public}d", status);
        }

        status = napi_call_function(env, global, js_cb, 2, jsArgs, &return_val);

        napi_valuetype type;
        napi_typeof(env, return_val, &type);

        CallbackParamType callbackValue;

        if (type == napi_string) {
            std::string resultStr;
            NapiValueConverter::ToCppValue(env, return_val, resultStr);
            callbackValue = std::move(resultStr);
        } else if (type == napi_number) {
            double resultNum;
            NapiValueConverter::ToCppValue(env, return_val, resultNum);
            callbackValue = resultNum;
        } else if (type == napi_boolean) {
            bool resultBol;
            NapiValueConverter::ToCppValue(env, return_val, resultBol);
            callbackValue = resultBol;
        } else {
            callbackValue = "unknown";
            CC_LOG_WARNING("callbackValue returns incorrect value type");
        }
        callParam->cb(callbackValue);

        if (status != napi_ok) {
            CC_LOG_WARNING("CallJS napi_call_function fail,status=%{public}d", status);
        }
    }
};

} // namespace cc
