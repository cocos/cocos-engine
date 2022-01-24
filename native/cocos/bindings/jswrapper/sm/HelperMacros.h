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

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_SM

extern uint32_t __jsbInvocationCount;

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
            ++__jsbInvocationCount;                                                                       \
            bool           ret   = false;                                                                 \
            JS::CallArgs   _argv = JS::CallArgsFromVp(argc, _vp);                                         \
            JS::Value      _thiz = _argv.computeThis(_cx);                                                \
            se::ValueArray args;                                                                          \
            se::internal::jsToSeArgs(_cx, argc, _argv, &args);                                            \
            JS::RootedObject _thizObj(_cx, _thiz.toObjectOrNull());                                       \
            void *           nativeThisObject = se::internal::getPrivate(_cx, _thizObj);                  \
            se::State        state(nativeThisObject, args);                                               \
            ret = funcName(state);                                                                        \
            if (!ret) {                                                                                   \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            }                                                                                             \
            se::internal::setReturnValue(_cx, state.rval(), _argv);                                       \
            return ret;                                                                                   \
        }

    #define SE_DECLARE_FINALIZE_FUNC(funcName) \
        void funcName##Registry(JSFreeOp *_fop, JSObject *_obj);

    #define SE_BIND_FINALIZE_FUNC(funcName)                                                               \
        void funcName##Registry(JSFreeOp *_fop, JSObject *_obj) {                                         \
            void *nativeThisObject = JS_GetPrivate(_obj);                                                 \
            bool  ret              = false;                                                               \
            if (nativeThisObject == nullptr)                                                              \
                return;                                                                                   \
            se::State state(nativeThisObject);                                                            \
            ret = funcName(state);                                                                        \
            if (!ret) {                                                                                   \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            }                                                                                             \
        }

    #define SE_BIND_CTOR(funcName, cls, finalizeCb)                                                       \
        bool funcName##Registry(JSContext *_cx, unsigned argc, JS::Value *_vp) {                          \
            ++__jsbInvocationCount;                                                                       \
            bool           ret   = false;                                                                 \
            JS::CallArgs   _argv = JS::CallArgsFromVp(argc, _vp);                                         \
            se::ValueArray args;                                                                          \
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
            ++__jsbInvocationCount;                                                                       \
            bool           ret   = false;                                                                 \
            JS::CallArgs   _argv = JS::CallArgsFromVp(argc, _vp);                                         \
            JS::Value      _thiz = _argv.computeThis(_cx);                                                \
            se::ValueArray args;                                                                          \
            se::internal::jsToSeArgs(_cx, argc, _argv, &args);                                            \
            se::Object *thisObject = se::Object::_createJSObject(cls, _thiz.toObjectOrNull());            \
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

    #define SE_BIND_PROP_GET(funcName)                                                                    \
        bool funcName##Registry(JSContext *_cx, unsigned argc, JS::Value *_vp) {                          \
            ++__jsbInvocationCount;                                                                       \
            bool             ret   = false;                                                               \
            JS::CallArgs     _argv = JS::CallArgsFromVp(argc, _vp);                                       \
            JS::Value        _thiz = _argv.computeThis(_cx);                                              \
            JS::RootedObject _thizObj(_cx, _thiz.toObjectOrNull());                                       \
            void *           nativeThisObject = se::internal::getPrivate(_cx, _thizObj);                  \
            se::State        state(nativeThisObject);                                                     \
            ret = funcName(state);                                                                        \
            if (!ret) {                                                                                   \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            }                                                                                             \
            se::internal::setReturnValue(_cx, state.rval(), _argv);                                       \
            return ret;                                                                                   \
        }

    #define SE_BIND_PROP_SET(funcName)                                                                    \
        bool funcName##Registry(JSContext *_cx, unsigned _argc, JS::Value *_vp) {                         \
            ++__jsbInvocationCount;                                                                       \
            bool             ret   = false;                                                               \
            JS::CallArgs     _argv = JS::CallArgsFromVp(_argc, _vp);                                      \
            JS::Value        _thiz = _argv.computeThis(_cx);                                              \
            JS::RootedObject _thizObj(_cx, _thiz.toObjectOrNull());                                       \
            void *           nativeThisObject = se::internal::getPrivate(_cx, _thizObj);                  \
            se::Value        data;                                                                        \
            se::internal::jsToSeValue(_cx, _argv[0], &data);                                              \
            se::ValueArray args;                                                                          \
            args.push_back(std::move(data));                                                              \
            se::State state(nativeThisObject, args);                                                      \
            ret = funcName(state);                                                                        \
            if (!ret) {                                                                                   \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            }                                                                                             \
            return ret;                                                                                   \
        }

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
