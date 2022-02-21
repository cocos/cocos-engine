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
#include "../ValueArrayPool.h"

//#define RECORD_JSB_INVOKING

#ifndef CC_DEBUG
    #undef RECORD_JSB_INVOKING
#endif


#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM

#if defined(RECORD_JSB_INVOKING)

    class JsbInvokeScopeT {
    public:
        JsbInvokeScopeT(const char *functionName);
        ~JsbInvokeScopeT();

    private:
        const char *                                                _functionName;
        std::chrono::time_point<std::chrono::high_resolution_clock> _start;
    };
    #define JsbInvokeScope(arg) JsbInvokeScopeT invokeScope(arg); // NOLINT(readability-identifier-naming)

#else
    // NOLINTNEXTLINE(readability-identifier-naming)
    #define JsbInvokeScope(arg) \
        do {                    \
        } while (0)

#endif

template <typename T, typename STATE>
constexpr inline T *SE_THIS_OBJECT(STATE &s) { // NOLINT(readability-identifier-naming)
    return reinterpret_cast<T *>(s.nativeThisObject());
}

template <typename T>
constexpr typename std::enable_if<std::is_enum<T>::value, char *>::type SE_UNDERLYING_TYPE_NAME() { // NOLINT(readability-identifier-naming)
    return typeid(std::underlying_type_t<T>).name();
}

template <typename T>
constexpr typename std::enable_if<!std::is_enum<T>::value, char *>::type SE_UNDERLYING_TYPE_NAME() { // NOLINT(readability-identifier-naming)
    return typeid(T).name();
}

void clearRecordJSBInvoke();

void printJSBInvoke();

void printJSBInvokeAtFrame(int n);


    #define SAFE_INC_REF(obj) \
        if (obj != nullptr) obj->incRef()
    #define SAFE_DEC_REF(obj)   \
        if ((obj) != nullptr) { \
            (obj)->decRef();    \
            (obj) = nullptr;    \
        }

    #define _SE(name) name##Registry

    #define SE_DECLARE_FUNC(funcName) \
        bool funcName##Registry(JSContext *_cx, unsigned argc, JS::Value *_vp)

    #define SE_BIND_FUNC(funcName)                                                                        \
        bool funcName##Registry(JSContext *_cx, unsigned argc, JS::Value *_vp) {                          \
            JsbInvokeScope(#funcName);                                                                           \
            bool           ret   = false;                                                                 \
            JS::CallArgs   _argv = JS::CallArgsFromVp(argc, _vp);                                         \
            JS::RootedObject      _thizObj(_cx); \
            _argv.computeThis(_cx, &_thizObj); \
            se::ValueArray &       args = se::gValueArrayPool.get(argc); \
            se::CallbackDepthGuard depthGuard{args, se::gValueArrayPool._depth}; \
            se::internal::jsToSeArgs(_cx, argc, _argv, &args);                                            \
            se::PrivateObjectBase *privateObject = static_cast<se::PrivateObjectBase *>(se::internal::getPrivate(_cx, _thizObj, 0));                  \
            se::Object *           thisObject    = reinterpret_cast<se::Object *>(se::internal::getPrivate(_cx, _thizObj, 1));       \
            se::State        state(thisObject, privateObject, args);                                               \
            ret = funcName(state);                                                                        \
            if (!ret) {                                                                                   \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            }                                                                                             \
            se::internal::setReturnValue(_cx, state.rval(), _argv);                                       \
            return ret;                                                                                   \
        }

#define SE_BIND_FUNC_FAST(funcName)                                                                                        \
    bool funcName##Registry(JSContext *_cx, unsigned argc, JS::Value *_vp) {                                          \
        JS::CallArgs   _argv = JS::CallArgsFromVp(argc, _vp);                                         \
        JS::RootedObject      _thizObj(_cx); \
        _argv.computeThis(_cx, &_thizObj); \
        auto *privateObject = static_cast<se::PrivateObjectBase *>(se::internal::SE_JS_GetPrivate(_thizObj, 0)); \
        funcName(privateObject->getRaw()); \
    }

    #define SE_DECLARE_FINALIZE_FUNC(funcName) \
        void funcName##Registry(JSFreeOp *_fop, JSObject *_obj);

    #define SE_BIND_FINALIZE_FUNC(funcName)                                                               \
        void funcName##Registry(JSFreeOp *_fop, JSObject *_obj) {                                         \
            JsbInvokeScope(#funcName);                                                                    \
            se::PrivateObjectBase* privateObject = static_cast<se::PrivateObjectBase*>(se::internal::SE_JS_GetPrivate(_obj, 0)); \
            bool  ret              = false;                                                               \
            if (privateObject == nullptr)                                                              \
                return;                                                                                   \
            se::State state(privateObject);                                                            \
            ret = funcName(state);                                                                        \
            if (!ret) {                                                                                   \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            }                                                                                             \
        }

    #define SE_BIND_CTOR(funcName, cls, finalizeCb)                                                       \
        bool funcName##Registry(JSContext *_cx, unsigned argc, JS::Value *_vp) {                          \
            JsbInvokeScope(#funcName);                                                                    \
            bool           ret   = false;                                                                 \
            JS::CallArgs   _argv = JS::CallArgsFromVp(argc, _vp);                                         \
            se::ValueArray &       args = se::gValueArrayPool.get(argc);                      \
            se::CallbackDepthGuard depthGuard{args, se::gValueArrayPool._depth};                          \
            se::internal::jsToSeArgs(_cx, argc, _argv, &args);                                            \
            se::Object *thisObject = se::Object::createObjectWithClass(cls);                              \
            _argv.rval().setObject(*thisObject->_getJSObject());                                          \
            se::State state(thisObject, args);                                                            \
            ret = funcName(state);                                                                        \
            if (ret) {                                                                                    \
                se::Value _property;                                                                      \
                bool      _found = false;                                                                 \
                _found           = thisObject->getProperty("_ctor", &_property);                          \
                if (_found) _property.toObject()->call(args, thisObject);                                 \
            } else {                                                                                      \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            }                                                                                             \
            return ret;                                                                                   \
        }

    #define SE_BIND_SUB_CLS_CTOR(funcName, cls, finalizeCb)                                               \
        bool funcName##Registry(JSContext *_cx, unsigned argc, JS::Value *_vp) {                          \
            JsbInvokeScope(#funcName);                                                                    \
            bool           ret   = false;                                                                 \
            JS::CallArgs   _argv = JS::CallArgsFromVp(argc, _vp);                                         \
            JS::RootedObject      _thizObj(_cx); \
            _argv.computeThis(_cx, &_thizObj); \
            se::ValueArray &       args = se::gValueArrayPool.get(argc);                      \
            se::CallbackDepthGuard depthGuard{args, se::gValueArrayPool._depth};                          \
            se::internal::jsToSeArgs(_cx, argc, _argv, &args);                                            \
            se::Object *thisObject = se::Object::_createJSObject(cls, _thizObj);            \
            thisObject->_setFinalizeCallback(finalizeCb##Registry);                                       \
            se::State state(thisObject, args);                                                            \
            ret = funcName(state);                                                                        \
            if (ret) {                                                                                    \
                se::Value _property;                                                                      \
                bool      _found = false;                                                                 \
                _found           = thisObject->getProperty("_ctor", &_property);                          \
                if (_found) _property.toObject()->call(args, thisObject);                                 \
            } else {                                                                                      \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            }                                                                                             \
            return ret;                                                                                   \
        }

    #define SE_BIND_PROP_GET_IMPL(funcName, postFix)                                                                    \
        bool funcName##postFix##Registry(JSContext *_cx, unsigned argc, JS::Value *_vp) {                          \
            JsbInvokeScope(#funcName);                                                                    \
            bool             ret   = false;                                                               \
            JS::CallArgs     _argv = JS::CallArgsFromVp(argc, _vp);                                       \
            JS::RootedObject      _thizObj(_cx); \
            _argv.computeThis(_cx, &_thizObj); \
            se::PrivateObjectBase * privateObject = static_cast<se::PrivateObjectBase *>(se::internal::getPrivate(_cx, _thizObj, 0));                  \
            se::Object *thisObject    = reinterpret_cast<se::Object *>(se::internal::getPrivate(_cx, _thizObj, 1));       \
            se::State        state(thisObject, privateObject);                                                     \
            ret = funcName(state);                                                                        \
            if (!ret) {                                                                                   \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            }                                                                                             \
            se::internal::setReturnValue(_cx, state.rval(), _argv);                                       \
            return ret;                                                                                   \
        }

    #define SE_BIND_PROP_GET(funcName)         SE_BIND_PROP_GET_IMPL(funcName, )
    #define SE_BIND_FUNC_AS_PROP_GET(funcName) SE_BIND_PROP_GET_IMPL(funcName, _asGetter)

    #define SE_BIND_PROP_SET_IMPL(funcName, postFix)                                                                           \
        bool funcName##postFix##Registry(JSContext *_cx, unsigned _argc, JS::Value *_vp) {                         \
            JsbInvokeScope(#funcName);                                                                    \
            bool             ret   = false;                                                               \
            JS::CallArgs     _argv = JS::CallArgsFromVp(_argc, _vp);                                      \
            JS::RootedObject      _thizObj(_cx); \
            _argv.computeThis(_cx, &_thizObj); \
            se::PrivateObjectBase * privateObject = static_cast<se::PrivateObjectBase *>(se::internal::getPrivate(_cx, _thizObj, 0));                  \
            se::Object *thisObject    = reinterpret_cast<se::Object *>(se::internal::getPrivate(_cx, _thizObj, 1));       \
            se::ValueArray &       args          = se::gValueArrayPool.get(1);  \
            se::CallbackDepthGuard depthGuard{args, se::gValueArrayPool._depth};                                                                          \
            se::Value& data{args[0]}; \
            se::internal::jsToSeValue(_cx, _argv[0], &data);                                              \
            se::State state(thisObject, privateObject, args);                                                      \
            ret = funcName(state);                                                                        \
            if (!ret) {                                                                                   \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            }                                                                                             \
            return ret;                                                                                   \
        }

    #define SE_BIND_PROP_SET(funcName)         SE_BIND_PROP_SET_IMPL(funcName, )
    #define SE_BIND_FUNC_AS_PROP_SET(funcName) SE_BIND_PROP_SET_IMPL(funcName, _asSetter)

    #define SE_TYPE_NAME(t) typeid(t).name()

    #define SE_QUOTEME_(x) #x
    #define SE_QUOTEME(x)  SE_QUOTEME_(x)

    #define SE_REPORT_ERROR(fmt, ...)                                                        \
        SE_LOGD("ERROR (" __FILE__ ", " SE_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__); \
        JS_ReportErrorUTF8(se::ScriptEngine::getInstance()->_getContext(), fmt, ##__VA_ARGS__)

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

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM
