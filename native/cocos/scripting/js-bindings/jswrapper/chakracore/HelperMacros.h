#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_CHAKRACORE

#ifdef __GNUC__
#define SE_UNUSED __attribute__ ((unused))
#else
#define SE_UNUSED
#endif

#define SAFE_INC_REF(obj) if (obj != nullptr) obj->incRef()
#define SAFE_DEC_REF(obj) if (obj != nullptr) obj->decRef()

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
            SAFE_DEC_REF(_thisObject); \
            se->_setGarbageCollecting(false); \
        } \
    }

#define SE_DECLARE_FINALIZE_FUNC(funcName) \
    void funcName##Registry(void* nativeThisObject);


#define SE_BIND_CTOR(funcName, cls, finalizeCb) \
    JsValueRef funcName##Registry(JsValueRef _callee, bool _isConstructCall, JsValueRef* _argv, unsigned short argc, void* _callbackState) \
    { \
        assert(argc > 0); \
        --argc; \
        bool ret = true; \
        se::ValueArray args; \
        se::internal::jsToSeArgs(argc, _argv+1, &args); \
        se::Object* thisObject = se::Object::createObjectWithClass(cls); \
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
        return _jsRet; \
    }


#define SE_BIND_PROP_GET(funcName) \
    JsValueRef funcName##Registry(JsValueRef _callee, bool _isConstructCall, JsValueRef* _argv, unsigned short _argc, void* _callbackState) \
    { \
        assert(_argc == 1); \
        JsValueRef _jsRet = JS_INVALID_REFERENCE; \
        SE_UNUSED bool ret = true; \
        void* nativeThisObject = se::internal::getPrivate(_argv[0]); \
        se::State state(nativeThisObject); \
        ret = funcName(state); \
        se::internal::seToJsValue(state.rval(), &_jsRet); \
        return _jsRet; \
    }


#define SE_BIND_PROP_SET(funcName) \
    JsValueRef funcName##Registry(JsValueRef _callee, bool _isConstructCall, JsValueRef* _argv, unsigned short _argc, void* _callbackState) \
    { \
        assert(_argc == 2); \
        SE_UNUSED bool ret = true; \
        void* nativeThisObject = se::internal::getPrivate(_argv[0]); \
        se::Value data; \
        se::internal::jsToSeValue(_argv[1], &data); \
        se::ValueArray args; \
        args.push_back(std::move(data)); \
        se::State state(nativeThisObject, args); \
        ret = funcName(state); \
        return JS_INVALID_REFERENCE; \
    }


#define SE_TYPE_NAME(t) typeid(t).name()

#define SE_QUOTEME_(x) #x
#define SE_QUOTEME(x) SE_QUOTEME_(x)

//FIXME: implement this macro
#define SE_REPORT_ERROR(fmt, ...) LOGD("ERROR (" __FILE__ ", " SE_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)

#if COCOS2D_DEBUG > 0

#define SE_ASSERT(cond, fmt, ...) \
    do \
    { \
        if (!(cond)) \
        { \
            LOGD("ASSERT (" __FILE__ ", " SE_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__); \
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
            LOGD("Error 0x%x at '%s, %s, %d'\n",    \
                _errCode, #cmd, __FILE__, __LINE__); \
            assert(false); \
        }                                   \
    } while(0)


#endif // #ifdef SCRIPT_ENGINE_CHAKRACORE
