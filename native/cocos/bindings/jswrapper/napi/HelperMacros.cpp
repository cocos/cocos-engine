/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

#include "HelperMacros.h"
#include "../State.h"
#include "../ValueArrayPool.h"
#include "Class.h"
#include "Object.h"
#include "ScriptEngine.h"
#include "Utils.h"

SE_HOT napi_value jsbFunctionWrapper(napi_env env, napi_callback_info info, se_function_ptr func, const char *funcName) {
    napi_status status;
    bool ret = false;
    napi_value _this;
    se::ValueArray seArgs;
    seArgs.reserve(15);
    size_t argc = 15;
    napi_value args[15];
    NODE_API_CALL(status, env, napi_get_cb_info(env, info, &argc, args, &_this, NULL));
    se::Object *nativeThisObject = nullptr;
    status = napi_unwrap(env, _this, reinterpret_cast<void **>(&nativeThisObject));
    se::internal::jsToSeArgs(argc, args, &seArgs);
    se::State state(nativeThisObject, seArgs);
    ret = func(state);
    if (!ret) {
        SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", funcName, __FILE__, __LINE__);
        return nullptr;
    }
    napi_value retVal;
    if (se::internal::setReturnValue(state.rval(), retVal))
        return retVal;
    return nullptr;
}

SE_HOT void jsbFinalizeWrapper(void *thisObject, se_function_ptr func, const char *funcName) {
    se::State state(reinterpret_cast<se::Object *>(thisObject));
    bool ret = func(state);
    if (!ret) {
        SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", funcName, __FILE__, __LINE__);
    }
}

SE_HOT napi_value jsbConstructorWrapper(napi_env env, napi_callback_info info, se_function_ptr func, se_finalize_ptr finalizeCb, se::Class *cls, const char *funcName) {
    napi_status status;
    bool ret = false;
    napi_value _this;
    se::ValueArray seArgs;
    seArgs.reserve(10);
    size_t argc = 10;
    napi_value args[10];
    NODE_API_CALL(status, env, napi_get_cb_info(env, info, &argc, args, &_this, NULL));
    if (!se::ScriptEngine::getInstance()->_needCallConstructor()) {
        return _this;
    }
    se::internal::jsToSeArgs(argc, args, &seArgs);
    se::Object *thisObject = se::Object::_createJSObject(env, _this, cls);
    thisObject->_setFinalizeCallback(finalizeCb);
    se::State state(thisObject, seArgs);
    ret = func(state);
    if (!ret) {
        SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", funcName, __FILE__, __LINE__);
    }
    se::Value property;
    bool foundCtor = false;
    if (!cls->_getCtor().has_value()) {
        foundCtor = thisObject->getProperty("_ctor", &property, true);
        if (foundCtor) {
            cls->_setCtor(property.toObject());
        } else {
            cls->_setCtor(nullptr);
        }
    } else {
        auto *ctorObj = cls->_getCtor().value();
        if (ctorObj != nullptr) {
            property.setObject(ctorObj);
            foundCtor = true;
        }
    }

    if (foundCtor) {
        property.toObject()->call(seArgs, thisObject);
    }
    return _this;
}

SE_HOT napi_value jsbGetterWrapper(napi_env env, napi_callback_info info, se_function_ptr func, const char *funcName) {
    napi_value _this;
    napi_status status;
    NODE_API_CALL(status, env,
                  napi_get_cb_info(env, info, nullptr, nullptr, &_this, nullptr));
    se::Object *obj;
    napi_unwrap(env, _this, reinterpret_cast<void **>(&obj));
    se::State state(obj);
    bool ret = func(state);
    if (!ret) {
        SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", funcName, __FILE__, __LINE__);
        return nullptr;
    }
    napi_value retVal;
    se::internal::setReturnValue(state.rval(), retVal);
    return retVal;
}

SE_HOT napi_value jsbSetterWrapper(napi_env env, napi_callback_info info, se_function_ptr func, const char *funcName) {
    napi_status status;
    size_t argc = 1;
    napi_value args[1];
    napi_value _this;
    se::Value data;
    NODE_API_CALL(status, env, napi_get_cb_info(env, info, &argc, args, &_this, nullptr));
    se::internal::jsToSeValue(args[0], &data);
    se::ValueArray args2;
    args2.reserve(10);
    args2.push_back(std::move(data));
    se::Object *nativeThisObject;
    napi_unwrap(env, _this, reinterpret_cast<void **>(&nativeThisObject));
    se::State state(nativeThisObject, args2);
    bool ret = func(state);
    if (!ret) {
        SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", funcName, __FILE__, __LINE__);
    }
    return nullptr;
}
