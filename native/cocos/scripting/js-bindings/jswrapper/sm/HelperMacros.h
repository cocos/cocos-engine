#pragma once

#include "../config.hpp"

#ifdef SCRIPT_ENGINE_SM

#define SAFE_ADD_REF(obj) if (obj != nullptr) obj->addRef()
#define SAFE_RELEASE(obj) if (obj != nullptr) obj->release()

#define _SE(name) name##Registry


#define SE_DECLARE_FUNC(funcName) \
    bool funcName##Registry(JSContext* _cx, unsigned argc, JS::Value* _vp)

#define SE_BIND_FUNC(funcName) \
    bool funcName##Registry(JSContext* _cx, unsigned argc, JS::Value* _vp) \
    { \
        bool ret = false; \
        JS::CallArgs _argv = JS::CallArgsFromVp(argc, _vp); \
        JS::Value _thiz = _argv.computeThis(_cx); \
        se::ValueArray args; \
        se::internal::jsToSeArgs(_cx, argc, _argv, &args); \
        JS::RootedObject _thizObj(_cx, _thiz.toObjectOrNull()); \
        void* nativeThisObject = se::internal::getPrivate(_cx, _thizObj); \
        se::State state(nativeThisObject, args); \
        ret = funcName(state); \
        se::internal::setReturnValue(_cx, state.rval(), _argv); \
        for (auto& v : args) \
        { \
            if (v.isObject() && v.toObject()->isRooted()) \
            { \
                v.toObject()->switchToUnrooted(); \
            } \
        } \
        return ret; \
    }

#define SE_DECLARE_FINALIZE_FUNC(funcName) \
    void funcName##Registry(JSFreeOp* _fop, JSObject* _obj);

#define SE_BIND_FINALIZE_FUNC(funcName) \
    void funcName##Registry(JSFreeOp* _fop, JSObject* _obj) \
    { \
        void* nativeThisObject = JS_GetPrivate(_obj); \
        se::State state(nativeThisObject); \
        if (!funcName(state)) \
            return; \
    }


#define SE_BIND_CTOR(funcName, cls, finalizeCb) \
    bool funcName##Registry(JSContext* _cx, unsigned argc, JS::Value* _vp) \
    { \
        bool ret = false; \
        JS::CallArgs _argv = JS::CallArgsFromVp(argc, _vp); \
        se::ValueArray args; \
        se::internal::jsToSeArgs(_cx, argc, _argv, &args); \
        se::Object* thisObject = se::Object::createObjectWithClass(cls, false); \
        _argv.rval().setObject(*thisObject->_getJSObject()); \
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
            if (v.isObject() && v.toObject()->isRooted()) \
            { \
                v.toObject()->switchToUnrooted(); \
            } \
        } \
        return ret; \
    }


#define SE_BIND_SUB_CLS_CTOR(funcName, cls, finalizeCb) \
    bool funcName##Registry(JSContext* _cx, unsigned argc, JS::Value* _vp) \
    { \
        bool ret = false; \
        JS::CallArgs _argv = JS::CallArgsFromVp(argc, _vp); \
        JS::Value _thiz = _argv.computeThis(_cx); \
        se::ValueArray args; \
        se::internal::jsToSeArgs(_cx, argc, _argv, &args); \
        se::Object* thisObject = se::Object::_createJSObject(cls, _thiz.toObjectOrNull(), false); \
        thisObject->_setFinalizeCallback(finalizeCb##Registry); \
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
            if (v.isObject() && v.toObject()->isRooted()) \
            { \
                v.toObject()->switchToUnrooted(); \
            } \
        } \
        return ret; \
    }


#define SE_BIND_PROP_GET(funcName) \
    bool funcName##Registry(JSContext *_cx, unsigned argc, JS::Value* _vp) \
    { \
        bool ret = false; \
        JS::CallArgs _argv = JS::CallArgsFromVp(argc, _vp); \
        JS::Value _thiz = _argv.computeThis(_cx); \
        JS::RootedObject _thizObj(_cx, _thiz.toObjectOrNull()); \
        void* nativeThisObject = se::internal::getPrivate(_cx, _thizObj); \
        se::State state(nativeThisObject); \
        ret = funcName(state); \
        se::internal::setReturnValue(_cx, state.rval(), _argv); \
        return ret; \
    }


#define SE_BIND_PROP_SET(funcName) \
    bool funcName##Registry(JSContext *_cx, unsigned _argc, JS::Value *_vp) \
    { \
        bool ret = false; \
        JS::CallArgs _argv = JS::CallArgsFromVp(_argc, _vp); \
        JS::Value _thiz = _argv.computeThis(_cx); \
        JS::RootedObject _thizObj(_cx, _thiz.toObjectOrNull()); \
        void* nativeThisObject = se::internal::getPrivate(_cx, _thizObj); \
        se::Value data; \
        se::internal::jsToSeValue(_cx, _argv[0], &data); \
        se::ValueArray args; \
        args.push_back(std::move(data)); \
        se::State state(nativeThisObject, args); \
        ret = funcName(state); \
        if (args[0].isObject() && args[0].toObject()->isRooted()) \
        { \
            args[0].toObject()->switchToUnrooted(); \
        } \
        return ret; \
    }


#define SE_TYPE_NAME(t) typeid(t).name()

#define SE_QUOTEME_(x) #x
#define SE_QUOTEME(x) SE_QUOTEME_(x)

#define SE_REPORT_ERROR(fmt, ...)  \
    LOGD("ERROR (" __FILE__ ", " SE_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__); \
    JS_ReportErrorUTF8(se::ScriptEngine::getInstance()->_getContext(), fmt, ##__VA_ARGS__)

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

#endif // #ifdef SCRIPT_ENGINE_SM
