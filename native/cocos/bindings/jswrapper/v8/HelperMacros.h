/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include "v8.h"
#include <algorithm>
#include <chrono>
#include <map>
#include <tuple>
#include <type_traits>
#include <typeinfo>
#include "../config.h"
#include "base/Log.h"
#include "base/Macros.h"
#include "base/std/container/string.h"

// #define RECORD_JSB_INVOKING

#ifndef CC_DEBUG
    #undef RECORD_JSB_INVOKING
#endif

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

    #if defined(RECORD_JSB_INVOKING)

class JsbInvokeScopeT {
public:
    JsbInvokeScopeT(const char *functionName);
    ~JsbInvokeScopeT();

private:
    const char *_functionName;
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

namespace se {
class Class;
class Object;
class State;
} // namespace se
using se_function_ptr = bool (*)(se::State &state);
using se_finalize_ptr = void (*)(se::Object *seObj);

void jsbFunctionWrapper(const v8::FunctionCallbackInfo<v8::Value> &,
                        se_function_ptr,
                        const char *);
void jsbFinalizeWrapper(se::Object *thisObject,
                        se_function_ptr,
                        const char *);
void jsbConstructorWrapper(const v8::FunctionCallbackInfo<v8::Value> &,
                           se_function_ptr,
                           se_finalize_ptr finalizeCb,
                           se::Class *,
                           const char *);
void jsbGetterWrapper(const v8::FunctionCallbackInfo<v8::Value> &,
                      se_function_ptr,
                      const char *);
void jsbSetterWrapper(const v8::FunctionCallbackInfo<v8::Value> &,
                      se_function_ptr,
                      const char *);

    #ifdef __GNUC__
        #define SE_UNUSED __attribute__((unused))
        #define SE_HOT    __attribute__((hot))
    #else
        #define SE_UNUSED
        #define SE_HOT
    #endif

    #define SAFE_INC_REF(obj) \
        if (obj != nullptr) obj->incRef()
    #define SAFE_DEC_REF(obj)   \
        if ((obj) != nullptr) { \
            (obj)->decRef();    \
            (obj) = nullptr;    \
        }

    #define _SE(name) name##Registry // NOLINT(readability-identifier-naming, bugprone-reserved-identifier)

    #define SE_DECLARE_FUNC(funcName) \
        void funcName##Registry(const v8::FunctionCallbackInfo<v8::Value> &v8args)

    #define SE_BIND_FUNC(funcName)                                                    \
        void funcName##Registry(const v8::FunctionCallbackInfo<v8::Value> &_v8args) { \
            JsbInvokeScope(#funcName);                                                \
            jsbFunctionWrapper(_v8args, funcName, #funcName);                         \
        }

    #define SE_BIND_FUNC_FAST(funcName)                                                                          \
        void funcName##Registry(const v8::FunctionCallbackInfo<v8::Value> &_v8args) {                            \
            JsbInvokeScope(#funcName);                                                                           \
            auto *thisObject = static_cast<se::Object *>(_v8args.This()->GetAlignedPointerFromInternalField(0)); \
            auto *nativeObject = thisObject != nullptr ? thisObject->getPrivateData() : nullptr;                 \
            funcName(nativeObject);                                                                              \
        }

    #define SE_BIND_FINALIZE_FUNC(funcName)                      \
        void funcName##Registry(se::Object *thisObject) {        \
            JsbInvokeScope(#funcName);                           \
            if (thisObject == nullptr)                           \
                return;                                          \
            jsbFinalizeWrapper(thisObject, funcName, #funcName); \
        }

    #define SE_DECLARE_FINALIZE_FUNC(funcName) \
        void funcName##Registry(se::Object *thisObject);

    // v8 doesn't need to create a new JSObject in SE_BIND_CTOR while SpiderMonkey needs.
    #define SE_BIND_CTOR(funcName, cls, finalizeCb)                                    \
        void funcName##Registry(const v8::FunctionCallbackInfo<v8::Value> &_v8args) {  \
            JsbInvokeScope(#funcName);                                                 \
            jsbConstructorWrapper(_v8args, funcName, _SE(finalizeCb), cls, #funcName); \
        }

    #define SE_BIND_PROP_GET_IMPL(funcName, postFix)                                           \
        void funcName##postFix##Registry(const v8::FunctionCallbackInfo<v8::Value> &_v8args) { \
            JsbInvokeScope(#funcName);                                                         \
            jsbGetterWrapper(_v8args, funcName, #funcName);                                    \
        }

    #define SE_BIND_PROP_GET(funcName)         SE_BIND_PROP_GET_IMPL(funcName, )
    #define SE_BIND_FUNC_AS_PROP_GET(funcName) SE_BIND_PROP_GET_IMPL(funcName, _asGetter)

    #define SE_BIND_PROP_SET_IMPL(funcName, postFix)                                           \
        void funcName##postFix##Registry(const v8::FunctionCallbackInfo<v8::Value> &_v8args) { \
            JsbInvokeScope(#funcName);                                                         \
            jsbSetterWrapper(_v8args, funcName, #funcName);                                    \
        }

    #define SE_BIND_PROP_SET(funcName)         SE_BIND_PROP_SET_IMPL(funcName, )
    #define SE_BIND_FUNC_AS_PROP_SET(funcName) SE_BIND_PROP_SET_IMPL(funcName, _asSetter)

    #define SE_TYPE_NAME(t) typeid(t).name()

    #define SE_QUOTEME_(x) #x // NOLINT(readability-identifier-naming)
    #define SE_QUOTEME(x)  SE_QUOTEME_(x)

    // IDEA: implement this macro
    // #define SE_REPORT_ERROR(fmt, ...) SE_LOGE(SE_STR_CONCAT3("[ERROR] ( %s, %d): ", fmt, "\n"), __FILE__, __LINE__, ##__VA_ARGS__)
    #define SE_REPORT_ERROR(fmt, ...) selogMessage(cc::LogLevel::ERR, "[SE_ERROR]", (" (%s, %d): " fmt), __FILE__, __LINE__, ##__VA_ARGS__)

    #if CC_DEBUG > 0

        #define SE_ASSERT(cond, fmt, ...)                                                                                   \
            do {                                                                                                            \
                if (!(cond)) {                                                                                              \
                    selogMessage(cc::LogLevel::ERR, "[SE_ASSERT]", (" (%s, %d): " fmt), __FILE__, __LINE__, ##__VA_ARGS__); \
                    CC_ABORT();                                                                                             \
                }                                                                                                           \
            } while (false)

    #else

        #define SE_ASSERT(cond, fmt, ...)

    #endif // #if CC_DEBUG > 0

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
