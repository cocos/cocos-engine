/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/UniversalPlatform.h"

#include <ace/xcomponent/native_interface_xcomponent.h>
#include <napi/native_api.h>
#include <uv.h>
#include <string>
#include <unordered_map>
#include "platform/openharmony/WorkerMessageQueue.h"

#define _ARKUI_DECLARATIVE_ 1

namespace cc {
class OpenHarmonyPlatform : public UniversalPlatform {
public:
    OpenHarmonyPlatform();
    int32_t init() override;
    static OpenHarmonyPlatform* getInstance();

    static napi_value GetContext(napi_env env, napi_callback_info info);

    /******************************APP Lifecycle******************************/
    static napi_value NapiOnCreate(napi_env env, napi_callback_info info);
    static napi_value NapiOnShow(napi_env env, napi_callback_info info);
    static napi_value NapiOnHide(napi_env env, napi_callback_info info);
    static napi_value NapiOnDestroy(napi_env env, napi_callback_info info);

    void OnCreateNative(napi_env env, uv_loop_t* loop);
    void OnShowNative();
    void OnHideNative();
    void OnDestroyNative();
    /*********************************************************************/
#ifdef _ARKUI_DECLARATIVE_
    /******************************声明式范式******************************/
    /**                      JS Page : Lifecycle                        **/
    static napi_value NapiOnPageShow(napi_env env, napi_callback_info info);
    static napi_value NapiOnPageHide(napi_env env, napi_callback_info info);
    void              OnPageShowNative();
    void              OnPageHideNative();
    /*************************************************************************/

#else
    /******************************类 Web范式******************************/
    /**                      JS Page : Lifecycle                        **/
    static napi_value NapiOnInit(napi_env env, napi_callback_info info);
    static napi_value NapiOnReady(napi_env env, napi_callback_info info);
    static napi_value NapiOnShow(napi_env env, napi_callback_info info);
    static napi_value NapiOnHide(napi_env env, napi_callback_info info);
    static napi_value NapiOnDestroy(napi_env env, napi_callback_info info);
    static napi_value NapiOnActive(napi_env env, napi_callback_info info);
    static napi_value NapiOnInactive(napi_env env, napi_callback_info info);

    void OnInitNative();
    void OnReadyNative();
    void OnShowNative();
    void OnHideNative();
    void OnDestroyNative();
    void OnActiveNative();
    void OnInactiveNative();
    /*************************************************************************/
#endif
    /*************************Worker Func*************************************/
    static napi_value NapiWorkerInit(napi_env env, napi_callback_info info);
    static napi_value NapiASend(napi_env env, napi_callback_info info);
    static napi_value NapiNativeEngineInit(napi_env env, napi_callback_info info);

    static napi_value NativeResourceManagerInit(napi_env env, napi_callback_info info);

    void WorkerInit(napi_env env, uv_loop_t* loop);
    int EnginInit(int argc, const char **argv);
    /*************************************************************************/

    // Napi export
    bool Export(napi_env env, napi_value exports);
    void SetNativeXComponent(OH_NativeXComponent* component);

    int32_t run(int argc, const char** argv) override;
    int     getSdkVersion() const override;
    int32_t loop() override;
    void onDestory() override;
private:
    int StartApplication(int argc, const char** argv);
    static void TimerCb(uv_timer_t* handle);
    static void MainOnMessage(const uv_async_t* req);
    static void WorkerOnMessage(const uv_async_t* req);
    bool        isRunning{false};
    void        waitWindowInitialized();
    std::string id_;

public:
    uv_timer_t timerHandle_;
    napi_env   mainEnv_{nullptr};
    uv_loop_t* mainLoop_{nullptr};
    uv_async_t mainOnMessageSignal_{};

    napi_env   workerEnv_{nullptr};
    uv_loop_t* workerLoop_{nullptr};
    uv_async_t workerOnMessageSignal_{};
    uv_async_t workerChangeColorSignal_{};

    WorkerMessageQueue workerMessageQ_;
};
} // namespace cc