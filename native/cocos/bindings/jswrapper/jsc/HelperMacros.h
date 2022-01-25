/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include "../config.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_JSC

    #ifdef __GNUC__
        #define SE_UNUSED __attribute__((unused))
    #else
        #define SE_UNUSED
    #endif

    #define SAFE_INC_REF(obj) \
        if (obj != nullptr) obj->incRef()
    #define SAFE_DEC_REF(obj)   \
        if ((obj) != nullptr) { \
            (obj)->decRef();    \
            (obj) = nullptr;    \
        }

    #define _SE(name) name##Registry

    #define SE_DECLARE_FUNC(funcName) \
        JSValueRef funcName##Registry(JSContextRef _cx, JSObjectRef _function, JSObjectRef _thisObject, size_t argc, const JSValueRef _argv[], JSValueRef *_exception)

    #define SE_BIND_FUNC(funcName)                                                                                                                                        \
        JSValueRef funcName##Registry(JSContextRef _cx, JSObjectRef _function, JSObjectRef _thisObject, size_t _argc, const JSValueRef _argv[], JSValueRef *_exception) { \
            unsigned short argc             = (unsigned short)_argc;                                                                                                      \
            JSValueRef     _jsRet           = JSValueMakeUndefined(_cx);                                                                                                  \
            void *         nativeThisObject = se::internal::getPrivate(_thisObject);                                                                                      \
            if (nativeThisObject != (void *)std::numeric_limits<unsigned long>::max()) {                                                                                  \
                bool           ret = true;                                                                                                                                \
                se::ValueArray args;                                                                                                                                      \
                se::internal::jsToSeArgs(_cx, argc, _argv, &args);                                                                                                        \
                se::State state(nativeThisObject, args);                                                                                                                  \
                ret = funcName(state);                                                                                                                                    \
                if (!ret) {                                                                                                                                               \
                    SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__);                                                             \
                }                                                                                                                                                         \
                se::internal::seToJsValue(_cx, state.rval(), &_jsRet);                                                                                                    \
            }                                                                                                                                                             \
            return _jsRet;                                                                                                                                                \
        }

    #define SE_BIND_FINALIZE_FUNC(funcName)                                                                   \
        void funcName##Registry(JSObjectRef _obj) {                                                           \
            auto se = se::ScriptEngine::getInstance();                                                        \
            se->_setGarbageCollecting(true);                                                                  \
            void *nativeThisObject = JSObjectGetPrivate(_obj);                                                \
            if (nativeThisObject != nullptr) {                                                                \
                bool        ret = false;                                                                      \
                se::State   state(nativeThisObject);                                                          \
                se::Object *_thisObject = state.thisObject();                                                 \
                if (_thisObject) _thisObject->_cleanup(nativeThisObject);                                     \
                ret = funcName(state);                                                                        \
                if (!ret) {                                                                                   \
                    SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
                }                                                                                             \
                JSObjectSetPrivate(_obj, nullptr);                                                            \
                SAFE_DEC_REF(_thisObject);                                                                    \
            }                                                                                                 \
            se->_setGarbageCollecting(false);                                                                 \
        }

    #define SE_DECLARE_FINALIZE_FUNC(funcName) \
        void funcName##Registry(JSObjectRef _obj);

    // NOTE: se::Object::createObjectWithClass(cls) will return a se::Object pointer which is watched by garbage collector.
    // If there is a '_ctor' function of current class, '_property.toObject->call(...)' will be invoked which is an operation that may
    // make garbage collector to mark the created JS object as a garbage and set it to an invalid state.
    // If this happens, crash will be triggered. So please take care of the value returned from se::Object::createObjectWithClass.
    // HOW TO FIX: Use a rooted se::Value to save the se::Object poiner returned by se::Object::createObjectWithClass.
    #define SE_BIND_CTOR(funcName, cls, finalizeCb)                                                                                                 \
        JSObjectRef funcName##Registry(JSContextRef _cx, JSObjectRef _constructor, size_t argc, const JSValueRef _argv[], JSValueRef *_exception) { \
            bool           ret = true;                                                                                                              \
            se::ValueArray args;                                                                                                                    \
            se::internal::jsToSeArgs(_cx, argc, _argv, &args);                                                                                      \
            se::Value   thisVal(se::Object::createObjectWithClass(cls), true);                                                                      \
            se::Object *thisObject = thisVal.toObject();                                                                                            \
            JSValueRef  _jsRet     = JSValueMakeUndefined(_cx);                                                                                     \
            se::State   state(thisObject, args);                                                                                                    \
            ret = funcName(state);                                                                                                                  \
            if (ret) {                                                                                                                              \
                _jsRet = thisObject->_getJSObject();                                                                                                \
                se::Value _property;                                                                                                                \
                bool      _found = false;                                                                                                           \
                _found           = thisObject->getProperty("_ctor", &_property);                                                                    \
                if (_found) _property.toObject()->call(args, thisObject);                                                                           \
            } else {                                                                                                                                \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__);                                           \
            }                                                                                                                                       \
            return JSValueToObject(_cx, _jsRet, nullptr);                                                                                           \
        }

    #define SE_BIND_SUB_CLS_CTOR(funcName, cls, finalizeCb)                                                                                                              \
        JSValueRef funcName##Registry(JSContextRef _cx, JSObjectRef _function, JSObjectRef _thisObject, size_t argc, const JSValueRef _argv[], JSValueRef *_exception) { \
            bool           ret    = true;                                                                                                                                \
            JSValueRef     _jsRet = JSValueMakeUndefined(_cx);                                                                                                           \
            se::ValueArray args;                                                                                                                                         \
            se::internal::jsToSeArgs(_cx, argc, _argv, &args);                                                                                                           \
            se::Object *thisObject = se::Object::_createJSObject(cls, _thisObject);                                                                                      \
            thisObject->_setFinalizeCallback(_SE(finalizeCb));                                                                                                           \
            se::State state(thisObject, args);                                                                                                                           \
            ret = funcName(state);                                                                                                                                       \
            if (ret) {                                                                                                                                                   \
                se::Value _property;                                                                                                                                     \
                bool      _found = false;                                                                                                                                \
                _found           = thisObject->getProperty("_ctor", &_property);                                                                                         \
                if (_found) _property.toObject()->call(args, thisObject);                                                                                                \
            } else {                                                                                                                                                     \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__);                                                                \
            }                                                                                                                                                            \
            return _jsRet;                                                                                                                                               \
        }

    #define SE_BIND_PROP_GET(funcName)                                                                                                                                   \
        JSValueRef funcName##Registry(JSContextRef _cx, JSObjectRef _function, JSObjectRef _thisObject, size_t argc, const JSValueRef _argv[], JSValueRef *_exception) { \
            assert(argc == 0);                                                                                                                                           \
            JSValueRef _jsRet           = JSValueMakeUndefined(_cx);                                                                                                     \
            void *     nativeThisObject = se::internal::getPrivate(_thisObject);                                                                                         \
            if (nativeThisObject != (void *)std::numeric_limits<unsigned long>::max()) {                                                                                 \
                se::State state(nativeThisObject);                                                                                                                       \
                if (funcName(state)) {                                                                                                                                   \
                    se::internal::seToJsValue(_cx, state.rval(), &_jsRet);                                                                                               \
                } else {                                                                                                                                                 \
                    SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__);                                                            \
                }                                                                                                                                                        \
            }                                                                                                                                                            \
            return _jsRet;                                                                                                                                               \
        }

    #define SE_BIND_PROP_SET(funcName)                                                                                                                                   \
        JSValueRef funcName##Registry(JSContextRef _cx, JSObjectRef _function, JSObjectRef _thisObject, size_t argc, const JSValueRef _argv[], JSValueRef *_exception) { \
            assert(argc == 1);                                                                                                                                           \
            JSValueRef _jsRet           = JSValueMakeUndefined(_cx);                                                                                                     \
            void *     nativeThisObject = se::internal::getPrivate(_thisObject);                                                                                         \
            if (nativeThisObject != (void *)std::numeric_limits<unsigned long>::max()) {                                                                                 \
                bool      ret = true;                                                                                                                                    \
                se::Value data;                                                                                                                                          \
                se::internal::jsToSeValue(_cx, _argv[0], &data);                                                                                                         \
                se::ValueArray args;                                                                                                                                     \
                args.push_back(std::move(data));                                                                                                                         \
                se::State state(nativeThisObject, args);                                                                                                                 \
                ret = funcName(state);                                                                                                                                   \
                if (!ret) {                                                                                                                                              \
                    SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__);                                                            \
                }                                                                                                                                                        \
            }                                                                                                                                                            \
            return _jsRet;                                                                                                                                               \
        }

    #define SE_TYPE_NAME(t) typeid(t).name()

    #define SE_QUOTEME_(x) #x
    #define SE_QUOTEME(x)  SE_QUOTEME_(x)

    //IDEA: implement this macro
    #define SE_REPORT_ERROR(fmt, ...) SE_LOGE("[ERROR] (" __FILE__ ", " SE_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)

    #if CC_DEBUG > 0

        #define SE_ASSERT(cond, fmt, ...)                                                                 \
            do {                                                                                          \
                if (!(cond)) {                                                                            \
                    SE_LOGE("ASSERT (" __FILE__ ", " SE_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__); \
                    assert(false);                                                                        \
                }                                                                                         \
            } while (false)

    #else

        #define SE_ASSERT(cond, fmt, ...)

    #endif // #if CC_DEBUG > 0

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_JSC
