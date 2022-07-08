#pragma once

#include "CommonHeader.h"
#if !defined(_WIN)
    #include <Hilog/log.h>

    #ifndef LOGI
        #define LOGI(...) ((void) OH_LOG_Print(LOG_APP, LOG_INFO, LOG_DOMAIN, "HMG_LOG", __VA_ARGS__))
        #define LOGW(...) ((void) OH_LOG_Print(LOG_APP, LOG_WARN, LOG_DOMAIN, "HMG_LOG", __VA_ARGS__))
        #define LOGE(...) ((void) OH_LOG_Print(LOG_APP, LOG_ERROR, LOG_DOMAIN, "HMG_LOG", __VA_ARGS__))
    #endif
#else
    #define LOGI
    #define LOGW
    #define LOGE
#endif

template <typename T, typename STATE>
constexpr inline T *SE_THIS_OBJECT(STATE &s) { // NOLINT(readability-identifier-naming)
    return reinterpret_cast<T *>(s.nativeThisObject());
}

#define SAFE_INC_REF(obj) \
    if (obj != nullptr) obj->incRef()
#define SAFE_DEC_REF(obj)   \
    if ((obj) != nullptr) { \
        (obj)->decRef();    \
        (obj) = nullptr;    \
    }

#define SE_QUOTEME_(x)            #x // NOLINT(readability-identifier-naming)
#define SE_QUOTEME(x)             SE_QUOTEME_(x)
#define SE_REPORT_ERROR(fmt, ...) SE_LOGE("[ERROR] (" __FILE__ ", " SE_QUOTEME(__LINE__) "): " fmt "\n", ##__VA_ARGS__)

#define SE_BIND_PROP_GET(funcName)                                                                    \
    napi_value funcName##Registry(napi_env env, napi_callback_info info) {                            \
        LOGD("SE_BIND_PROP_GET get %s", #funcName);                                                   \
        napi_value  _this;                                                                            \
        napi_status status;                                                                           \
        NODE_API_CALL(status, env,                                                                    \
                      napi_get_cb_info(env, info, nullptr, nullptr, &_this, nullptr));                \
        void *obj;                                                                                    \
        napi_unwrap(env, _this, reinterpret_cast<void **>(&obj));                                     \
        se::State state(obj);                                                                         \
        LOGD("unwrap ptr :%p", obj);                                                                  \
        bool ret = funcName(state);                                                                   \
        if (!ret) {                                                                                   \
            SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
            return nullptr;                                                                           \
        }                                                                                             \
        napi_value retVal;                                                                            \
        se::internal::setReturnValue(state.rval(), retVal);                                           \
        return retVal;                                                                                \
    }

#define SE_BIND_PROP_SET(funcName)                                                                    \
    napi_value funcName##Registry(napi_env env, napi_callback_info info) {                            \
        LOGD("SE_BIND_PROP_SET set %s", #funcName);                                                   \
        napi_status status;                                                                           \
        size_t      argc = 1;                                                                         \
        napi_value  args[1];                                                                          \
        napi_value  _this;                                                                            \
        se::Value   data;                                                                             \
        NODE_API_CALL(status, env, napi_get_cb_info(env, info, &argc, args, &_this, nullptr));        \
        se::internal::jsToSeValue(args[0], &data);                                                    \
        se::ValueArray args2;                                                                         \
        args2.reserve(10);                                                                            \
        args2.push_back(std::move(data));                                                             \
        void *nativeThisObject;                                                                       \
        napi_unwrap(env, _this, reinterpret_cast<void **>(&nativeThisObject));                        \
        se::State state(nativeThisObject, args2);                                                     \
        bool      ret = funcName(state);                                                              \
        if (!ret) {                                                                                   \
            SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
        }                                                                                             \
        return nullptr;                                                                               \
    }

#define SE_DECLARE_FUNC(funcName) \
    napi_value funcName##Registry(napi_env env, napi_callback_info info)

#define SE_BIND_FUNC(funcName)                                                                          \
    napi_value funcName##Registry(                                                                      \
        napi_env env, napi_callback_info info) {                                                        \
        LOGD("%s", #funcName);                                                                          \
        napi_status    status;                                                                          \
        bool           ret = false;                                                                     \
        napi_value     _this;                                                                           \
        se::ValueArray seArgs;                                                                          \
        seArgs.reserve(10);                                                                             \
        size_t     argc = 10;                                                                           \
        napi_value args[10];                                                                            \
        NODE_API_CALL(status, env, napi_get_cb_info(env, info, &argc, args, &_this, NULL));             \
        void *nativeThisObject = nullptr;                                                               \
        status                 = napi_unwrap(env, _this, reinterpret_cast<void **>(&nativeThisObject)); \
        se::internal::jsToSeArgs(argc, args, &seArgs);                                                  \
        se::State state(nativeThisObject, seArgs);                                                      \
        ret = funcName(state);                                                                          \
        if (!ret) {                                                                                     \
            SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__);   \
            return nullptr;                                                                             \
        }                                                                                               \
        napi_value retVal;                                                                              \
        if (se::internal::setReturnValue(state.rval(), retVal))                                         \
            return retVal;                                                                              \
        return nullptr;                                                                                 \
    }

#define SE_BIND_CTOR(funcName, cls, finalizeCb)                                                       \
    napi_value funcName##Registry(                                                                    \
        napi_env env, napi_callback_info info) {                                                      \
        napi_status    status;                                                                        \
        bool           ret = false;                                                                   \
        napi_value     _this;                                                                         \
        se::ValueArray seArgs;                                                                        \
        seArgs.reserve(10);                                                                           \
        size_t     argc = 10;                                                                         \
        napi_value args[10];                                                                          \
        NODE_API_CALL(status, env, napi_get_cb_info(env, info, &argc, args, &_this, NULL));           \
        if (!se::ScriptEngine::getInstance()->_needCallConstructor()) {                               \
            return _this;                                                                             \
        }                                                                                             \
        se::internal::jsToSeArgs(argc, args, &seArgs);                                                \
        se::Object *thisObject = se::Object::_createJSObject(env, _this, cls);                        \
        thisObject->_setFinalizeCallback(_SE(finalizeCb));                                            \
        se::State state(thisObject, seArgs);                                                          \
        ret = funcName(state);                                                                        \
        if (!ret) {                                                                                   \
            SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
        }                                                                                             \
        se::Value _property;                                                                          \
        bool      _found = false;                                                                     \
        _found           = thisObject->getProperty("_ctor", &_property);                              \
        if (_found) _property.toObject()->call(seArgs, thisObject);                                   \
        return _this;                                                                                 \
    }

#define SE_BIND_SUB_CLS_CTOR SE_BIND_CTOR

#define SE_DECLARE_FINALIZE_FUNC(funcName) \
    void funcName##Registry(               \
        napi_env env, void *nativeObject, void * /*finalize_hint*/);

#define SE_BIND_FINALIZE_FUNC(funcName)                                                               \
    void funcName##Registry(                                                                          \
        napi_env env, void *nativeObject, void *hint /*finalize_hint*/) {                             \
        LOGD("%s %p hint:%p", #funcName, nativeObject, hint);                                         \
        if (nativeObject == nullptr) {                                                                \
            return;                                                                                   \
        }                                                                                             \
        se::State state(nativeObject);                                                                \
        bool      ret = funcName(state);                                                              \
        if (!ret) {                                                                                   \
            SE_LOGE("[ERROR] Failed to invoke %s, location: %s:%d\n", #funcName, __FILE__, __LINE__); \
        }                                                                                             \
    }

#define _SE(name) name##Registry // NOLINT(readability-identifier-naming, bugprone-reserved-identifier)