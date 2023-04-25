/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
