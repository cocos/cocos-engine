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

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE

#ifdef __GNUC__
#define SE_UNUSED __attribute__ ((unused))
#else
#define SE_UNUSED
#endif

#define SAFE_INC_REF(obj) if (obj != nullptr) obj->incRef()
#define SAFE_DEC_REF(obj) if ((obj) != nullptr) { (obj)->decRef(); (obj) = nullptr; }

#define _SE(name) name##Registry


#define SE_DECLARE_FUNC(funcName) \
    JsValueRef funcName##Registry(JsValueRef _callee, bool _isConstructCall, JsValueRef* _argv, unsigned short argc, void* _callbackState)

#define SE_BIND_FUNC(funcName) \
    JsValueRef funcName##Registry(JsValueRef _callee, bool _isConstructCall, JsValueRef* _argv, unsigned short argc, void* _callbackState) \
    { \
        assert(argc > 0); \
        --argc; \
        JsValueRef _jsRet = JS_INVALID_REFERENCE; \
        bool ret = true; \
        se::ValueArray args; \
        se::internal::jsToSeArgs(argc, _argv+1, &args); \
        void* nativeThisObject = se::internal::getPrivate(_argv[0]); \
        se::State state(nativeThisObject, args); \
        ret = funcName(state); \
        if (!ret) { \
            SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
        } \
        se::internal::seToJsValue(state.rval(), &_jsRet); \
        return _jsRet; \
    }

#define SE_BIND_FINALIZE_FUNC(funcName) \
    void funcName##Registry(void* nativeThisObject) \
    { \
        if (nativeThisObject != nullptr) \
        { \
            auto se = se::ScriptEngine::getInstance(); \
            se->_setGarbageCollecting(true); \
            bool ret = false; \
            se::State state(nativeThisObject); \
            se::Object* _thisObject = state.thisObject(); \
            if (_thisObject) _thisObject->_cleanup(nativeThisObject); \
            ret = funcName(state); \
            if (!ret) { \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            } \
            SAFE_DEC_REF(_thisObject); \
            se->_setGarbageCollecting(false); \
        } \
    }

#define SE_DECLARE_FINALIZE_FUNC(funcName) \
    void funcName##Registry(void* nativeThisObject);


// NOTE: se::Object::createObjectWithClass(cls) will return a se::Object pointer which is watched by garbage collector.
// If there is a '_ctor' function of current class, '_property.toObject->call(...)' will be invoked which is an operation that may
// make garbage collector to mark the created JS object as a garbage and set it to an invalid state.
// If this happens, crash will be triggered. So please take care of the value returned from se::Object::createObjectWithClass.
// HOW TO FIX: Use a rooted se::Value to save the se::Object poiner returned by se::Object::createObjectWithClass.
#define SE_BIND_CTOR(funcName, cls, finalizeCb) \
    JsValueRef funcName##Registry(JsValueRef _callee, bool _isConstructCall, JsValueRef* _argv, unsigned short argc, void* _callbackState) \
    { \
        assert(argc > 0); \
        --argc; \
        bool ret = true; \
        se::ValueArray args; \
        se::internal::jsToSeArgs(argc, _argv+1, &args); \
        se::Value thisVal(se::Object::createObjectWithClass(cls), true); \
        se::Object* thisObject = thisVal.toObject(); \
        JsValueRef _jsRet = thisObject->_getJSObject(); \
        se::State state(thisObject, args); \
        ret = funcName(state); \
        if (ret) \
        { \
            se::Value _property; \
            bool _found = false; \
            _found = thisObject->getProperty("_ctor", &_property); \
            if (_found) _property.toObject()->call(args, thisObject); \
        } \
        else \
        { \
            SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
        } \
        return _jsRet; \
    }

#define SE_BIND_SUB_CLS_CTOR(funcName, cls, finalizeCb) \
    JsValueRef funcName##Registry(JsValueRef _callee, bool _isConstructCall, JsValueRef* _argv, unsigned short argc, void* _callbackState) \
    { \
        assert(argc > 0); \
        --argc; \
        JsValueRef _jsRet = JS_INVALID_REFERENCE; \
        bool ret = true; \
        se::ValueArray args; \
        se::internal::jsToSeArgs(argc, _argv+1, &args); \
        se::Object* thisObject = se::Object::_createJSObject(cls, _argv[0]); \
        thisObject->_setFinalizeCallback(_SE(finalizeCb)); \
        se::State state(thisObject, args); \
        ret = funcName(state); \
        if (ret) \
        { \
            se::Value _property; \
            bool _found = false; \
            _found = thisObject->getProperty("_ctor", &_property); \
            if (_found) _property.toObject()->call(args, thisObject); \
        } \
        else \
        { \
            SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
        } \
        return _jsRet; \
    }


#define SE_BIND_PROP_GET(funcName) \
    JsValueRef funcName##Registry(JsValueRef _callee, bool _isConstructCall, JsValueRef* _argv, unsigned short _argc, void* _callbackState) \
    { \
        assert(_argc == 1); \
        JsValueRef _jsRet = JS_INVALID_REFERENCE; \
        bool ret = true; \
        void* nativeThisObject = se::internal::getPrivate(_argv[0]); \
        se::State state(nativeThisObject); \
        ret = funcName(state); \
        if (!ret) { \
            SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
        } \
        se::internal::seToJsValue(state.rval(), &_jsRet); \
        return _jsRet; \
    }


#define SE_BIND_PROP_SET(funcName) \
    JsValueRef funcName##Registry(JsValueRef _callee, bool _isConstructCall, JsValueRef* _argv, unsigned short _argc, void* _callbackState) \
    { \
        assert(_argc == 2); \
        bool ret = true; \
        void* nativeThisObject = se::internal::getPrivate(_argv[0]); \
        se::Value data; \
        se::internal::jsToSeValue(_argv[1], &data); \
        se::ValueArray args; \
        args.push_back(std::move(data)); \
        se::State state(nativeThisObject, args); \
        ret = funcName(state); \
        if (!ret) { \
            SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
        } \
        return JS_INVALID_REFERENCE; \
    }


#define SE_TYPE_NAME(t) typeid(t).name()

#define SE_QUOTEME_(x) #x
#define SE_QUOTEME(x) SE_QUOTEME_(x)

//IDEA: implement this macro
#define SE_REPORT_ERROR(fmt, ...) SE_LOGE("[ERROR] (" __FILE__ ", " SE_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)

#if COCOS2D_DEBUG > 0

#define SE_ASSERT(cond, fmt, ...) \
    do \
    { \
        if (!(cond)) \
        { \
            SE_LOGE("ASSERT (" __FILE__ ", " SE_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__); \
            assert(false); \
        } \
    } while(false)

#else

#define SE_ASSERT(cond, fmt, ...) 

#endif // #if COCOS2D_DEBUG > 0

#define _CHECK(cmd)                     \
    do                                      \
    {                                       \
        JsErrorCode _errCode = cmd;          \
        if (_errCode != JsNoError)           \
        {                                   \
            SE_LOGE("Error 0x%x at '%s, %s, %d'\n",    \
                _errCode, #cmd, __FILE__, __LINE__); \
            assert(false); \
        }                                   \
    } while(0)


#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_CHAKRACORE
