#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_JSC

#ifdef __GNUC__
#define SE_UNUSED __attribute__ ((unused))
#else
#define SE_UNUSED
#endif

#define SAFE_ADD_REF(obj) if (obj != nullptr) obj->addRef()
#define SAFE_RELEASE(obj) if (obj != nullptr) obj->release()

#define _SE(name) name##Registry

#define SE_DECLARE_FUNC(funcName) \
    JSValueRef funcName##Registry(JSContextRef _cx, JSObjectRef _function, JSObjectRef _thisObject, size_t argc, const JSValueRef _argv[], JSValueRef* _exception)


#define SE_BIND_FUNC(funcName) \
    JSValueRef funcName##Registry(JSContextRef _cx, JSObjectRef _function, JSObjectRef _thisObject, size_t _argc, const JSValueRef _argv[], JSValueRef* _exception) \
    { \
        unsigned short argc = (unsigned short) _argc; \
        JSValueRef _jsRet = nullptr; \
        bool ret = true; \
        se::ValueArray args; \
        se::internal::jsToSeArgs(_cx, argc, _argv, &args); \
        void* nativeThisObject = se::internal::getPrivate(_thisObject); \
        se::State state(nativeThisObject, args); \
        ret = funcName(state); \
        se::internal::seToJsValue(_cx, state.rval(), &_jsRet); \
        for (auto& v : args) \
        { \
            if (v.isObject()) \
            { \
                v.toObject()->unroot(); \
            } \
        } \
        return _jsRet; \
    }

#define SE_BIND_FINALIZE_FUNC(funcName) \
    void funcName##Registry(JSObjectRef _obj) \
    { \
        auto se = se::ScriptEngine::getInstance(); \
        se->_setInGC(true); \
        void* nativeThisObject = JSObjectGetPrivate(_obj); \
        if (nativeThisObject != nullptr) \
        { \
            bool ret = false; \
            se::State state(nativeThisObject); \
            se::Object* _thisObject = state.thisObject(); \
            if (_thisObject) _thisObject->_cleanup(nativeThisObject); \
            ret = funcName(state); \
            JSObjectSetPrivate(_obj, nullptr); \
            SAFE_RELEASE(_thisObject); \
        } \
        se->_setInGC(false); \
    }

#define SE_DECLARE_FINALIZE_FUNC(funcName) \
    void funcName##Registry(JSObjectRef _obj);


#define SE_BIND_CTOR(funcName, cls, finalizeCb) \
    JSObjectRef funcName##Registry(JSContextRef _cx, JSObjectRef _constructor, size_t argc, const JSValueRef _argv[], JSValueRef* _exception) \
    { \
        bool ret = true; \
        se::ValueArray args; \
        se::internal::jsToSeArgs(_cx, argc, _argv, &args); \
        se::Object* thisObject = se::Object::createObjectWithClass(cls); \
        JSValueRef _jsRet = JSValueMakeUndefined(_cx); \
        se::State state(thisObject, args); \
        ret = funcName(state); \
        if (ret) \
        { \
            _jsRet = thisObject->_getJSObject(); \
            se::Value _property; \
            bool _found = false; \
            _found = thisObject->getProperty("_ctor", &_property); \
            if (_found) _property.toObject()->call(args, thisObject); \
        } \
        for (auto& v : args) \
        { \
            if (v.isObject()) \
            { \
                v.toObject()->unroot(); \
            } \
        } \
        return JSValueToObject(_cx, _jsRet, nullptr); \
    }


#define SE_BIND_SUB_CLS_CTOR(funcName, cls, finalizeCb) \
    JSValueRef funcName##Registry(JSContextRef _cx, JSObjectRef _function, JSObjectRef _thisObject, size_t argc, const JSValueRef _argv[], JSValueRef* _exception) \
    { \
        SE_UNUSED bool ret = true; \
        JSValueRef _jsRet = JSValueMakeUndefined(_cx); \
        se::ValueArray args; \
        se::internal::jsToSeArgs(_cx, argc, _argv, &args); \
        se::Object* thisObject = se::Object::_createJSObject(cls, _thisObject); \
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
        for (auto& v : args) \
        { \
            if (v.isObject()) \
            { \
                v.toObject()->unroot(); \
            } \
        } \
        return _jsRet; \
    }


#define SE_BIND_PROP_GET(funcName) \
    JSValueRef funcName##Registry(JSContextRef _cx, JSObjectRef _function, JSObjectRef _thisObject, size_t argc, const JSValueRef _argv[], JSValueRef* _exception) \
    { \
        assert(argc == 0); \
        JSValueRef _jsRet = nullptr; \
        bool ret = true; \
        void* nativeThisObject = se::internal::getPrivate(_thisObject); \
        se::State state(nativeThisObject); \
        ret = funcName(state); \
        se::internal::seToJsValue(_cx, state.rval(), &_jsRet); \
        return _jsRet; \
    }


#define SE_BIND_PROP_SET(funcName) \
    JSValueRef funcName##Registry(JSContextRef _cx, JSObjectRef _function, JSObjectRef _thisObject, size_t argc, const JSValueRef _argv[], JSValueRef* _exception) \
    { \
        assert(argc == 1); \
        JSValueRef _jsRet = JSValueMakeUndefined(_cx); \
        bool ret = true; \
        void* nativeThisObject = se::internal::getPrivate(_thisObject); \
        se::Value data; \
        se::internal::jsToSeValue(_cx, _argv[0], &data); \
        se::ValueArray args; \
        args.push_back(std::move(data)); \
        se::State state(nativeThisObject, args); \
        ret = funcName(state); \
        if (args[0].isObject() && args[0].toObject()->isRooted()) \
        { \
            args[0].toObject()->unroot(); \
        } \
        return _jsRet; \
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

#endif // #ifdef SCRIPT_ENGINE_JSC
