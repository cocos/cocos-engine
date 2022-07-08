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
#include "platform/openharmony/OpenHarmonyPlatform.h"
#include "base/Macros.h"

#include <ace/xcomponent/native_interface_xcomponent.h>
#include <napi/native_api.h>

#include "application/ApplicationManager.h"
#include "application/CocosApplication.h"
#include "bindings/jswrapper/SeApi.h"
#include "platform/UniversalPlatform.h"

#include "platform/openharmony/FileUtils-OpenHarmony.h"

#include "platform/openharmony/modules/SystemWindow.h"
#include "bindings/jswrapper/napi/HelperMacros.h"
#include "platform/openharmony/modules/System.h"

#include <sstream>
#include <chrono>

enum ContextType {
    APP_LIFECYCLE = 0,
    JS_PAGE_LIFECYCLE,
    XCOMPONENT_CONTEXT,
    XCOMPONENT_REGISTER_LIFECYCLE_CALLBACK,
    NATIVE_RENDER_API,
    WORKER_INIT,
    ENGINE_UTILS,
    UV_ASYNC_SEND
};

int cocos_main(int argc, const char** argv) {
    return 0;
}

namespace cc {

int32_t OpenHarmonyPlatform::init() {
    registerInterface(std::make_shared<SystemWindow>());
    registerInterface(std::make_shared<System>());
    return 0;
}

// NAPI Interface
napi_value OpenHarmonyPlatform::GetContext(napi_env env, napi_callback_info info) {
    napi_status status;
    napi_value  exports;
    size_t      argc = 1;
    napi_value  args[1];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));

    if (argc != 1) {
        napi_throw_type_error(env, NULL, "Wrong number of arguments");
        return nullptr;
    }

    napi_valuetype valuetype;
    status = napi_typeof(env, args[0], &valuetype);
    if (status != napi_ok) {
        return nullptr;
    }
    if (valuetype != napi_number) {
        napi_throw_type_error(env, NULL, "Wrong arguments");
        return nullptr;
    }

    int64_t value;
    NAPI_CALL(env, napi_get_value_int64(env, args[0], &value));

    NAPI_CALL(env, napi_create_object(env, &exports));

    switch (value) {
        case APP_LIFECYCLE: {
            /**** 1. AppInit 对应 app.ets中的应用生命周期 onCreate, onShow, onHide, onDestroy ******/
            LOGE("kee cocos GetContext APP_LIFECYCLE");
            /**** Register App Lifecycle  ******/
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("onCreate", OpenHarmonyPlatform::NapiOnCreate),
                DECLARE_NAPI_FUNCTION("onShow", OpenHarmonyPlatform::NapiOnShow),
                DECLARE_NAPI_FUNCTION("onHide", OpenHarmonyPlatform::NapiOnHide),
                DECLARE_NAPI_FUNCTION("onDestroy", OpenHarmonyPlatform::NapiOnDestroy),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
        }

        break;
        case JS_PAGE_LIFECYCLE: {
            LOGE("kee cocos GetContext JS_PAGE_LIFECYCLE");
#ifdef _ARKUI_DECLARATIVE_
            /****************  声明式开发范式 JS Page 生命周期注册 ****************************/
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("onPageShow", OpenHarmonyPlatform::NapiOnPageShow),
                DECLARE_NAPI_FUNCTION("onPageHide", OpenHarmonyPlatform::NapiOnPageHide),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
#else
            /****************  类Web开发范式 JS Page 生命周期注册 ****************************/
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("onInit", OpenHarmonyPlatform::NapiOnInit),
                DECLARE_NAPI_FUNCTION("onReady", OpenHarmonyPlatform::NapiOnReady),
                DECLARE_NAPI_FUNCTION("onShow", OpenHarmonyPlatform::NapiOnShow),
                DECLARE_NAPI_FUNCTION("onHide", OpenHarmonyPlatform::NapiOnHide),
                DECLARE_NAPI_FUNCTION("onDestroy", OpenHarmonyPlatform::NapiOnDestroy),
                DECLARE_NAPI_FUNCTION("onActive", OpenHarmonyPlatform::NapiOnActive),
                DECLARE_NAPI_FUNCTION("onInactive", OpenHarmonyPlatform::NapiOnInactive),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
#endif
        } break;
        case XCOMPONENT_REGISTER_LIFECYCLE_CALLBACK: {
            LOGE("kee cocos GetContext XCOMPONENT_REGISTER_LIFECYCLE_CALLBACK");
        } break;
        case NATIVE_RENDER_API: {
            LOGE("kee cocos GetContext NATIVE_RENDER_API");
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("nativeEngineInit", OpenHarmonyPlatform::NapiNativeEngineInit),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
        } break;
        case WORKER_INIT: {
            LOGE("kee cocos GetContext WORKER_INIT");
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("workerInit", OpenHarmonyPlatform::NapiWorkerInit),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
        } break;
        case ENGINE_UTILS: {
            LOGE("kee cocos GetContext ENGINE_UTILS");
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("resourceManagerInit", OpenHarmonyPlatform::NativeResourceManagerInit),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
        }
        case UV_ASYNC_SEND: {
            LOGE("kee cocos GetContext UV_ASYNC_SEND");
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("send", OpenHarmonyPlatform::NapiASend),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
        } break;
        default:
            LOGE("kee cocos unknown type");
    }
    return exports;
}

OpenHarmonyPlatform* OpenHarmonyPlatform::getInstance() {
    return dynamic_cast<OpenHarmonyPlatform*>(BasePlatform::getPlatform());
}

OpenHarmonyPlatform::OpenHarmonyPlatform() {
}

int OpenHarmonyPlatform::getSdkVersion() const {
    return 0;
}

int32_t OpenHarmonyPlatform::run(int argc, const char** argv) {
    if (workerLoop_) {
        // Todo: Starting the timer in this way is inaccurate and will be fixed later.
        uv_timer_init(workerLoop_, &timerHandle_);
        // 1s = 1000ms = 60fps;
        // 1000ms / 60fps = 16 ms/fps
        uv_timer_start(&timerHandle_, &OpenHarmonyPlatform::TimerCb, 16, true);
    }
    return 0;
}

void OpenHarmonyPlatform::waitWindowInitialized() {
}

napi_value OpenHarmonyPlatform::NativeResourceManagerInit(napi_env env, napi_callback_info info) {
    size_t      argc = 1;
    napi_value  args[1];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    FileUtilsOpenHarmony::initResourceManager(env, args[0]);
    return nullptr;
}

napi_value OpenHarmonyPlatform::NapiWorkerInit(napi_env env, napi_callback_info info) {
    uv_loop_t* loop = nullptr;
    NAPI_CALL(env, napi_get_uv_event_loop(env, &loop));
    OpenHarmonyPlatform::getInstance()->WorkerInit(env, loop);
    return nullptr;
}

napi_value OpenHarmonyPlatform::NapiASend(napi_env env, napi_callback_info info) {
    LOGE("kee cocos OpenHarmonyPlatform::NapiASend");
    uv_async_send(&(OpenHarmonyPlatform::getInstance()->workerOnMessageSignal_));
    return nullptr;
}

napi_value OpenHarmonyPlatform::NapiNativeEngineInit(napi_env env, napi_callback_info info){
    LOGE("kee cocos NapiNativeEngineInit Triggered");
    void*             window          = nullptr;
    WorkerMessageData msgData;
    OpenHarmonyPlatform::getInstance()->workerMessageQ_.deQueue(reinterpret_cast<WorkerMessageData*>(&msgData));
    OH_NativeXComponent* nativexcomponet = reinterpret_cast<OH_NativeXComponent*>(msgData.data);
    LOGE("kee cocos NapiNativeEngineInit nativexcomponent = %p", nativexcomponet);
    SystemWindow* systemWindowIntf = getPlatform()->getInterface<SystemWindow>();
    CCASSERT(systemWindowIntf, "Invalid interface pointer");
    systemWindowIntf->OnSurfaceCreated(nativexcomponet, msgData.window);

    se::ScriptEngine::setEnv(env);
    OpenHarmonyPlatform::getInstance()->EnginInit(0, nullptr);

    return nullptr;
}

// NAPI Interface
bool OpenHarmonyPlatform::Export(napi_env env, napi_value exports) {
    napi_status status;
    // Application/SDK etc. Init
    // XComponent Init:
    napi_value        exportInstance   = nullptr;
    OH_NativeXComponent* nativeXComponent = nullptr;
    int32_t           ret;

    char     idStr[OH_XCOMPONENT_ID_LEN_MAX + 1] = {};
    uint64_t idSize                           = OH_XCOMPONENT_ID_LEN_MAX + 1;

    status = napi_get_named_property(env, exports, OH_NATIVE_XCOMPONENT_OBJ, &exportInstance);
    if (status != napi_ok) {
        return false;
    }

    status = napi_unwrap(env, exportInstance, reinterpret_cast<void**>(&nativeXComponent));
    if (status != napi_ok) {
        LOGE("napi_unwrap %d", status);
        return false;
    }

    ret = OH_NativeXComponent_GetXComponentId(nativeXComponent, idStr, &idSize);
    if (ret != OH_NATIVEXCOMPONENT_RESULT_SUCCESS) {
        return false;
    }

    SystemWindow* systemWindowIntf = getInterface<SystemWindow>();
    CCASSERT(systemWindowIntf, "Invalid interface pointer");
    systemWindowIntf->SetNativeXComponent(nativeXComponent);
    return true;
}

void OpenHarmonyPlatform::MainOnMessage(const uv_async_t* req) {
    LOGE("kee cocos MainOnMessage Triggered");
}

// static
void OpenHarmonyPlatform::WorkerOnMessage(const uv_async_t* /* req */) {
    void*             window          = nullptr;
    WorkerMessageData msgData;
    OpenHarmonyPlatform::getInstance()->workerMessageQ_.deQueue(reinterpret_cast<WorkerMessageData*>(&msgData));

    OH_NativeXComponent* nativexcomponet = reinterpret_cast<OH_NativeXComponent*>(msgData.data);
    CCASSERT(nativexcomponet != nullptr, "nativexcomponent cannot be empty");

    SystemWindow* systemWindowIntf = getPlatform()->getInterface<SystemWindow>();
    if(msgData.type == MessageType::WM_XCOMPONENT_SURFACE_CREATED) {
        CCASSERT(systemWindowIntf, "Invalid interface pointer");
        systemWindowIntf->OnSurfaceCreated(nativexcomponet, msgData.window);
    } else if(msgData.type == MessageType::WM_XCOMPONENT_TOUCH_EVENT) {
        systemWindowIntf->DispatchTouchEvent(nativexcomponet, msgData.window);
    } else if(msgData.type == MessageType::WM_XCOMPONENT_SURFACE_CHANGED) {
        systemWindowIntf->OnSurfaceChanged(nativexcomponet, msgData.window);
    } else if(msgData.type == MessageType::WM_XCOMPONENT_SURFACE_DESTROY) {
        systemWindowIntf->OnSurfaceDestroyed(nativexcomponet, msgData.window);
    }

}

napi_value OpenHarmonyPlatform::NapiOnCreate(napi_env env, napi_callback_info info) {
    uv_loop_t* loop = nullptr;
    NAPI_CALL(env, napi_get_uv_event_loop(env, &loop));
    OpenHarmonyPlatform::getInstance()->OnCreateNative(env, loop);
    return nullptr;
}
napi_value OpenHarmonyPlatform::NapiOnShow(napi_env env, napi_callback_info info) {
    OpenHarmonyPlatform::getInstance()->OnShowNative();
    return nullptr;
}
napi_value OpenHarmonyPlatform::NapiOnHide(napi_env env, napi_callback_info info) {
    OpenHarmonyPlatform::getInstance()->OnHideNative();
    return nullptr;
}
napi_value OpenHarmonyPlatform::NapiOnDestroy(napi_env env, napi_callback_info info) {
    OpenHarmonyPlatform::getInstance()->OnDestroyNative();
    return nullptr;
}

void OpenHarmonyPlatform::OnCreateNative(napi_env env, uv_loop_t* loop) {
    LOGE("kee cocos PluginManager::OnCreateNative");
    mainEnv_  = env;
    mainLoop_ = loop;
    LOGE("kee cocos PluginManager::OnCreateNative mainEnv = %p, mainLoop = %p", mainEnv_, mainLoop_);
    if (mainLoop_) {
        LOGE("kee cocos OnCreateNative uv_async_init");
        uv_async_init(mainLoop_, &mainOnMessageSignal_, reinterpret_cast<uv_async_cb>(OpenHarmonyPlatform::MainOnMessage));
    }
}
void OpenHarmonyPlatform::OnShowNative() {
    LOGE("kee cocos PluginManager::OnShowNative");
}
void OpenHarmonyPlatform::OnHideNative() {
    LOGE("kee cocos PluginManager::OnHideNative");
}
void OpenHarmonyPlatform::OnDestroyNative() {
    LOGE("kee cocos PluginManager::OnDestroyNative");
}

#ifdef _ARKUI_DECLARATIVE_
napi_value OpenHarmonyPlatform::NapiOnPageShow(napi_env env, napi_callback_info info) {
    LOGE("kee cocos PluginManager::NapiOnPageShow");
    return nullptr;
}

napi_value OpenHarmonyPlatform::NapiOnPageHide(napi_env env, napi_callback_info info) {
    LOGE("kee cocos PluginManager::NapiOnPageHide");
    return nullptr;
}

void OpenHarmonyPlatform::OnPageShowNative() {
    LOGE("kee cocos PluginManager::OnPageShowNative");
}

void OpenHarmonyPlatform::OnPageHideNative() {
    LOGE("kee cocos PluginManager::OnPageHideNative");
}

void OpenHarmonyPlatform::TimerCb(uv_timer_t* handle) {
    OpenHarmonyPlatform::getInstance()->runTask();
}

int OpenHarmonyPlatform::StartApplication(int argc, const char** argv) {
    CC_START_APPLICATION(CocosApplication);
}

int OpenHarmonyPlatform::EnginInit(int argc, const char** argv) {
    StartApplication(argc, argv);
    OpenHarmonyPlatform::getInstance()->run(0, nullptr);
    return 0;
}

void OpenHarmonyPlatform::WorkerInit(napi_env env, uv_loop_t* loop) {
    LOGE("kee cocos PluginManager::WorkerInit");
    workerEnv_  = env;
    workerLoop_ = loop;
    if (workerLoop_) {
        LOGE("kee cocos WorkerInit uv_async_init");
        uv_async_init(workerLoop_, &workerOnMessageSignal_, reinterpret_cast<uv_async_cb>(OpenHarmonyPlatform::WorkerOnMessage));
    }
    std::this_thread::sleep_for(std::chrono::seconds(2));
	LOGE("kee cocos PluginManager::WorkerInit workerEnv = %p, workerLoop = %p", workerEnv_, workerLoop_);
}

int32_t OpenHarmonyPlatform::loop() {
    return 0;
}

void OpenHarmonyPlatform::onDestory() {

}



#endif

}; // namespace cc
