#pragma once
#include <napi/native_api.h>
#include "native_common.h"

// Empty value so that macros here are able to return NULL or void
#define NODE_API_RETVAL_NOTHING // Intentionally blank #define

// Returns NULL on failed assertion.
// This is meant to be used inside napi_callback methods.
#define NODE_API_ASSERT(env, assertion, message) \
    NODE_API_ASSERT_BASE(env, assertion, message, NULL)

// Returns empty on failed assertion.
// This is meant to be used inside functions with void return type.
#define NODE_API_ASSERT_RETURN_VOID(env, assertion, message) \
    NODE_API_ASSERT_BASE(env, assertion, message, NODE_API_RETVAL_NOTHING)

#define NODE_API_CALL_BASE(env, the_call, ret_val) \
    do {                                           \
        if ((the_call) != napi_ok) {               \
            assert(false);                         \
        }                                          \
    } while (0)

// Returns nullptr if the_call doesn't return napi_ok.
#define NODE_API_CALL(status, env, the_call) \
    status = the_call;                       \
    if (status != napi_ok)                   \
        LOGI("error:%d", status);            \
    NODE_API_CALL_BASE(env, status, nullptr)

// Returns empty if the_call doesn't return napi_ok.
#define NODE_API_CALL_RETURN_VOID(env, the_call) \
    NODE_API_CALL_BASE(env, the_call, NODE_API_RETVAL_NOTHING)

#define DECLARE_NODE_API_PROPERTY(name, func) \
    { (name), nullptr, (func), nullptr, nullptr, nullptr, napi_default, nullptr }

#define DECLARE_NODE_API_GETTER(name, func) \
    { (name), nullptr, nullptr, (func), nullptr, nullptr, napi_default, nullptr }

void add_returned_status(napi_env    env,
                         const char* key,
                         napi_value  object,
                         char*       expected_message,
                         napi_status expected_status,
                         napi_status actual_status);

void add_last_status(napi_env env, const char* key, napi_value return_value);
