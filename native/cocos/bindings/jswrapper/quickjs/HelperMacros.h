/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

//#define RECORD_JSB_INVOKING

#ifndef CC_DEBUG
    #undef RECORD_JSB_INVOKING
#endif

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_QUICKJS

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
        JSValue funcName##Registry(JSContext *_ctx, JSValueConst _thisVal, int argc, JSValueConst *argv)

    #define SE_BIND_FUNC(funcName)                                                                         \
        JSValue funcName##Registry(JSContext *_ctx, JSValueConst _thisVal, int argc, JSValueConst *argv) { \
            SE_LOGD("%s\n", #funcName);                                                                    \
            JsbInvokeScope(#funcName);                                                                     \
            JSValue                _jsRet = JS_UNDEFINED;                                                  \
            se::ValueArray args; \
            args.resize(argc); \
            se::internal::jsToSeArgs(_ctx, argc, argv, args);                                              \
                                                                                                           \
            se::Value seThisVal;                                                                           \
            se::internal::jsObjectToSeObject(_thisVal, &seThisVal);                                        \
            se::Object *thisObject = seThisVal.toObject();                                                 \
                                                                                                           \
            se::State state(thisObject, args);                                                             \
            bool      ret = funcName(state);                                                               \
            if (!ret) {                                                                                    \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__);  \
            } else {                                                                                       \
                se::internal::setReturnJSValue(_ctx, state.rval(), &_jsRet);                               \
            }                                                                                              \
            return _jsRet;                                                                                 \
        }

    #define SE_BIND_FUNC_FAST(funcName)                                                                    \
        JSValue funcName##Registry(JSContext *_ctx, JSValueConst _thisVal, int argc, JSValueConst *argv) { \
            SE_LOGD("%s\n", #funcName);                                                                    \
            JsbInvokeScope(#funcName);                                                                     \
            se::Object *seObj = (se::Object *)se::internal::getPrivate(_thisVal);                          \
            if (seObj) {                                                                                   \
                funcName(seObj->getPrivateData());                                                         \
            } else {                                                                                       \
                funcName(nullptr);                                                                         \
            }                                                                                              \
            return JS_UNDEFINED;                                                                           \
        }

    #define SE_DECLARE_FINALIZE_FUNC(funcName) \
        void funcName##Registry(JSRuntime *_rt, JSValue _thisVal);

    #define SE_BIND_FINALIZE_FUNC(funcName)                                                               \
        void funcName##Registry(JSRuntime *_rt, JSValue _thisVal) {                                       \
            SE_LOGD("%s\n", #funcName);                                                                   \
            JsbInvokeScope(#funcName);                                                                    \
                                                                                                          \
            se::Value seThisVal;                                                                          \
            se::internal::jsObjectToSeObject(_thisVal, &seThisVal);                                       \
            se::Object *seObj = seThisVal.toObject();                                                     \
                                                                                                          \
            void *nativeObj = seObj->getPrivateData();                                                    \
            bool  ret       = false;                                                                      \
            if (seObj == nullptr)                                                                         \
                return;                                                                                   \
            se::State state(seObj);                                                                       \
            ret = funcName(state);                                                                        \
            if (!ret) {                                                                                   \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            }                                                                                             \
            if (seObj->isClearMappingInFinalizer() && nativeObj != nullptr) {                             \
                auto iter = se::NativePtrToObjectMap::find(nativeObj);                                    \
                if (iter != se::NativePtrToObjectMap::end()) {                                            \
                    SE_LOGD(">>> %s, remove mapping\n", #funcName);                                       \
                    se::NativePtrToObjectMap::erase(iter);                                                \
                } else {                                                                                  \
                    assert(false);                                                                        \
                }                                                                                         \
            }                                                                                             \
            seObj->decRef();                                                                              \
        }

    #define SE_BIND_CTOR(funcName, cls, finalizeCb)                                                          \
        JSValue funcName##Registry(JSContext *_ctx, JSValueConst new_target, int argc, JSValueConst *argv) { \
            SE_LOGD("%s\n", #funcName);                                                                      \
            JsbInvokeScope(#funcName);                                                                       \
            se::ValueArray args; \
            args.resize(argc); \
            se::internal::jsToSeArgs(_ctx, argc, argv, args);                                              \
            JSValue proto = JS_GetPropertyStr(_ctx, new_target, "prototype");                                \
            JSValue jsobj = JS_NewObjectProtoClass(_ctx, proto, cls->_getClassID());                         \
            JS_FreeValue(_ctx, proto);                                                                       \
            se::Object *thisObject = se::Object::_createJSObject(cls, jsobj);                                \
            se::State   state(thisObject, args);                                                             \
            bool        ret = funcName(state);                                                               \
            if (ret) {                                                                                       \
                se::Value _property;                                                                         \
                bool      _found = false;                                                                    \
                _found           = thisObject->getProperty("_ctor", &_property);                             \
                if (_found) _property.toObject()->call(args, thisObject);                                    \
            } else {                                                                                         \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__);    \
            }                                                                                                \
            return jsobj;                                                                                    \
        }

    #define SE_BIND_PROP_GET_IMPL(funcName, postFix)                                                      \
        JSValue funcName##postFix##Registry(JSContext *_ctx, JSValueConst _thizObj) {                     \
            SE_LOGD("%s\n", #funcName);                                                                   \
            JsbInvokeScope(#funcName);                                                                    \
            JSValue _jsRet = JS_UNDEFINED;                                                                \
                                                                                                          \
            se::Value seThisVal;                                                                          \
            se::internal::jsObjectToSeObject(_thizObj, &seThisVal);                                       \
            se::Object *thisObject = seThisVal.toObject();                                                \
                                                                                                          \
            se::State state(thisObject);                                                                  \
            bool      ret = funcName(state);                                                              \
            if (!ret) {                                                                                   \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            } else {                                                                                      \
                se::internal::setReturnJSValue(_ctx, state.rval(), &_jsRet);                              \
            }                                                                                             \
            return _jsRet;                                                                                \
        }

    #define SE_BIND_PROP_GET(funcName)         SE_BIND_PROP_GET_IMPL(funcName, )
    #define SE_BIND_FUNC_AS_PROP_GET(funcName) SE_BIND_PROP_GET_IMPL(funcName, _asGetter)

    #define SE_BIND_PROP_SET_IMPL(funcName, postFix)                                                       \
        JSValue funcName##postFix##Registry(JSContext *_ctx, JSValueConst _thizObj, JSValueConst _jsval) { \
            SE_LOGD("%s\n", #funcName);                                                                    \
            JsbInvokeScope(#funcName);                                                                     \
                                                                                                           \
            se::Value seThisVal;                                                                           \
            se::internal::jsObjectToSeObject(_thizObj, &seThisVal);                                        \
            se::Object *thisObject = seThisVal.toObject();                                                 \
                                                                                                           \
            se::ValueArray args; \
            args.resize(1); \
            se::Value &            data{args[0]};                                                          \
            se::internal::jsToSeValue(_ctx, _jsval, &data);                                                \
            se::State state(thisObject, args);                                                             \
            bool      ret = funcName(state);                                                               \
            if (!ret) {                                                                                    \
                SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__);  \
            }                                                                                              \
            return JS_UNDEFINED;                                                                           \
        }

    #define SE_BIND_PROP_SET(funcName)         SE_BIND_PROP_SET_IMPL(funcName, )
    #define SE_BIND_FUNC_AS_PROP_SET(funcName) SE_BIND_PROP_SET_IMPL(funcName, _asSetter)

    #define SE_TYPE_NAME(t) typeid(t).name()

    #define SE_QUOTEME_(x) #x
    #define SE_QUOTEME(x)  SE_QUOTEME_(x)

    #define SE_REPORT_ERROR(fmt, ...)                                                        \
        SE_LOGE("ERROR (" __FILE__ ", " SE_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__); \
        JS_ThrowSyntaxError(se::ScriptEngine::getInstance()->_getContext(), fmt, ##__VA_ARGS__)

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

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_QUICKJS
