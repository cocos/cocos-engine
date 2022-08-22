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

#include <napi/native_api.h>

namespace cc {

class NapiHelper {
public:

    static napi_value getContext(napi_env env, napi_callback_info info);

    // APP Lifecycle
    static napi_value napiOnCreate(napi_env env, napi_callback_info info);
    static napi_value napiOnShow(napi_env env, napi_callback_info info);
    static napi_value napiOnHide(napi_env env, napi_callback_info info);
    static napi_value napiOnDestroy(napi_env env, napi_callback_info info);

    // JS Page : Lifecycle
    static napi_value napiOnPageShow(napi_env env, napi_callback_info info);
    static napi_value napiOnPageHide(napi_env env, napi_callback_info info);
    
    // Worker Func
    static napi_value napiWorkerInit(napi_env env, napi_callback_info info);
    static napi_value napiASend(napi_env env, napi_callback_info info);
    static napi_value napiNativeEngineInit(napi_env env, napi_callback_info info);

    static napi_value napiWritablePathInit(napi_env env, napi_callback_info info);
    static napi_value napiResourceManagerInit(napi_env env, napi_callback_info info);
    // Napi export
    static bool exportFunctions(napi_env env, napi_value exports);
};

}