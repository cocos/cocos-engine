
/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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
#include "platform/openharmony/napi/NapiHelper.h"
#include "platform/openharmony/napi/napi_macros.h"
#include "platform/openharmony/OpenHarmonyPlatform.h"
#include "platform/openharmony/modules/SystemWindow.h"
#include "platform/openharmony/FileUtils-OpenHarmony.h"

#if CC_USE_EDITBOX
    #include "ui/edit-box/EditBox-openharmony.h"
#endif
#if CC_USE_WEBVIEW
    #include "ui/webview/WebViewImpl-openharmony.h"
#endif

namespace cc {

// Must be the same as the value called by js
enum ContextType {
    APP_LIFECYCLE = 0,
    JS_PAGE_LIFECYCLE,
    XCOMPONENT_CONTEXT,
    XCOMPONENT_REGISTER_LIFECYCLE_CALLBACK,
    NATIVE_RENDER_API,
    WORKER_INIT,
    ENGINE_UTILS,
    EDITBOX_UTILS,
    WEBVIEW_UTILS,
    UV_ASYNC_SEND,
};

static Napi::Env gWorkerEnv(nullptr);
static Napi::FunctionReference* gPostMessageToUIThreadFunc = nullptr;

static void js_set_PostMessage2UIThreadCallback(const Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    if (info.Length() != 1) {
        Napi::Error::New(env, "setPostMessageFunction, 1 argument expected").ThrowAsJavaScriptException();
        return;
    }

    if (!info[0].IsFunction()) {
        Napi::TypeError::New(env, "setPostMessageFunction, function expected").ThrowAsJavaScriptException();
        return;
    }

    delete gPostMessageToUIThreadFunc;
    gPostMessageToUIThreadFunc = new Napi::FunctionReference(Napi::Persistent(info[0].As<Napi::Function>()));
}

/* static */
void NapiHelper::postMessageToUIThread(const std::string& type, Napi::Value param) {
    if (gPostMessageToUIThreadFunc == nullptr) {
        CC_LOG_ERROR("callback was not set %s, type: %s", __FUNCTION__, type.c_str());
        return;
    }

    gPostMessageToUIThreadFunc->Call({param});
}

/* static */
Napi::Value NapiHelper::napiCallFunction(const char* functionName) {
    auto env = getWorkerEnv();
    auto funcVal = env.Global().Get(functionName);
    if (!funcVal.IsFunction()) {
        return {};
    }
    return funcVal.As<Napi::Function>().Call(env.Global(), {});
}

// NAPI Interface
static bool exportFunctions(Napi::Object exports) {
    Napi::MaybeOrValue<Napi::Value> xcomponentObject = exports.Get(OH_NATIVE_XCOMPONENT_OBJ);
    if (!xcomponentObject.IsObject()) {
        CC_LOG_ERROR("Could not get property: %s", OH_NATIVE_XCOMPONENT_OBJ);
        return false;
    }

    auto* nativeXComponent = Napi::ObjectWrap<OH_NativeXComponent>::Unwrap(xcomponentObject.As<Napi::Object>());
    if (nativeXComponent == nullptr) {
        CC_LOG_ERROR("nativeXComponent is nullptr");
        return false;
    }

    OpenHarmonyPlatform::getInstance()->setNativeXComponent(nativeXComponent);
    return true;
}

// APP Lifecycle
static void napiOnCreate(const Napi::CallbackInfo &info) {
    // uv_loop_t* loop = nullptr;
    // NAPI_CALL(env, napi_get_uv_event_loop(env, &loop));
    // OpenHarmonyPlatform::getInstance()->onCreateNative(env, loop);
}

static void napiOnShow(const Napi::CallbackInfo &info) {
    cc::WorkerMessageData data{cc::MessageType::WM_APP_SHOW, nullptr, nullptr};
    OpenHarmonyPlatform::getInstance()->enqueue(data);
}

static void napiOnHide(const Napi::CallbackInfo &info) {
    cc::WorkerMessageData data{cc::MessageType::WM_APP_HIDE, nullptr, nullptr};
    OpenHarmonyPlatform::getInstance()->enqueue(data);
}

static void napiOnDestroy(const Napi::CallbackInfo &info) {
    cc::WorkerMessageData data{cc::MessageType::WM_APP_DESTROY, nullptr, nullptr};
    OpenHarmonyPlatform::getInstance()->enqueue(data);
}

// JS Page : Lifecycle
static void napiOnPageShow(const Napi::CallbackInfo &info) {

}

static void napiOnPageHide(const Napi::CallbackInfo &info) {

}

static void napiNativeEngineInit(const Napi::CallbackInfo &info) {
//cjh    se::ScriptEngine::setEnv(env);
    CC_LOG_INFO("cjh napiNativeEngineInit ...");
    OpenHarmonyPlatform::getInstance()->run(0, nullptr);
}

static void napiNativeEngineStart(const Napi::CallbackInfo &info) {
    OpenHarmonyPlatform::getInstance()->requestVSync();
}

static void napiWorkerInit(const Napi::CallbackInfo &info) {
    CC_LOG_INFO("cjh napiWorkerInit ...");
    Napi::Env env = info.Env();
    uv_loop_t* loop = nullptr;
    NAPI_CALL_RETURN_VOID(napi_env(env), napi_get_uv_event_loop(napi_env(env), &loop));
    OpenHarmonyPlatform::getInstance()->workerInit(loop);
}

static void napiResourceManagerInit(const Napi::CallbackInfo &info) {
    if (info.Length() != 1) {
        Napi::Error::New(info.Env(), "1 argument expected").ThrowAsJavaScriptException();
        return;
    }

    FileUtilsOpenHarmony::initResourceManager(napi_env(info.Env()), napi_value(info[0]));
}

static void napiWritablePathInit(const Napi::CallbackInfo &info) {
    if (info.Length() != 1) {
        Napi::Error::New(info.Env(), "1 argument expected").ThrowAsJavaScriptException();
        return;
    }

    if (!info[0].IsString()) {
        Napi::Error::New(info.Env(), "string expected").ThrowAsJavaScriptException();
        return;
    }

    FileUtilsOpenHarmony::_ohWritablePath = info[0].As<Napi::String>().Utf8Value();
}

static void napiASend(const Napi::CallbackInfo &info) {
    OpenHarmonyPlatform::getInstance()->triggerMessageSignal();
}

// NAPI Interface
static Napi::Value getContext(const Napi::CallbackInfo &info) {
    CC_LOG_INFO("cjh getContext ...");

    Napi::Env env = info.Env();
    size_t argc = info.Length();
    if (argc != 1) {
        Napi::Error::New(env, "Wrong argument count, 1 expected!").ThrowAsJavaScriptException();
        return {};
    }

    if (!info[0].IsNumber()) {
        Napi::TypeError::New(env, "number expected!").ThrowAsJavaScriptException();
        return {};
    }

    auto exports = Napi::Object::New(env);
    int64_t value = info[0].As<Napi::Number>().Int64Value();

    CC_LOG_INFO("cjh getContext value: %d", (int)value);
    switch (value) {
        case APP_LIFECYCLE: {
            exports["onCreate"] = Napi::Function::New(env, napiOnCreate);
            exports["onShow"] = Napi::Function::New(env, napiOnShow);
            exports["onCreate"] = Napi::Function::New(env, napiOnHide);
            exports["onCreate"] = Napi::Function::New(env, napiOnDestroy);
        } break;
        case JS_PAGE_LIFECYCLE: {
            exports["onPageShow"] = Napi::Function::New(env, napiOnPageShow);
            exports["onPageHide"] = Napi::Function::New(env, napiOnPageHide);
        } break;
        case XCOMPONENT_REGISTER_LIFECYCLE_CALLBACK: {

        } break;
        case NATIVE_RENDER_API: {
            exports["nativeEngineInit"] = Napi::Function::New(env, napiNativeEngineInit);
            exports["nativeEngineStart"] = Napi::Function::New(env, napiNativeEngineStart);
        } break;
        case WORKER_INIT: {
//cjh            se::ScriptEngine::setEnv(env);
            CC_LOG_INFO("cjh getContext WORKER_INIT ...");
            gWorkerEnv = env;
            exports["workerInit"] = Napi::Function::New(env, napiWorkerInit);
            exports["setPostMessageFunction"] = Napi::Function::New(env, js_set_PostMessage2UIThreadCallback);
        } break;
        case ENGINE_UTILS: {
            exports["resourceManagerInit"] = Napi::Function::New(env, napiResourceManagerInit);
            exports["writablePathInit"] = Napi::Function::New(env, napiWritablePathInit);
        } break;
        case EDITBOX_UTILS: {
        #if CC_USE_EDITBOX
            exports["onTextChange"] = Napi::Function::New(env, OpenHarmonyEditBox::napiOnTextChange);
            exports["onComplete"] = Napi::Function::New(env, OpenHarmonyEditBox::napiOnComplete);
        #endif
        } break;
        case WEBVIEW_UTILS: {
        #if CC_USE_WEBVIEW
            exports["shouldStartLoading"] = Napi::Function::New(env, OpenHarmonyWebView::napiShouldStartLoading);
            exports["finishLoading"] = Napi::Function::New(env, OpenHarmonyWebView::napiFinishLoading);
            exports["failLoading"] = Napi::Function::New(env, OpenHarmonyWebView::napiFailLoading);
            exports["jsCallback"] = Napi::Function::New(env, OpenHarmonyWebView::napiJsCallback);
        #endif
        } break;
        case UV_ASYNC_SEND: {
            exports["send"] = Napi::Function::New(env, napiASend);
        } break;
        default:
            CC_LOG_ERROR("unknown type");
    }

    CC_LOG_INFO("cjh getContext return ...");
    return exports;
}

/* static */
Napi::Env NapiHelper::getWorkerEnv() {
    return gWorkerEnv;
}

/* static */
Napi::Object NapiHelper::init(Napi::Env env, Napi::Object exports) {
    exports["getContext"] = Napi::Function::New(env, getContext);
    bool ret = exportFunctions(exports);
    if (!ret) {
        CC_LOG_ERROR("Init failed");
    }
    return exports;
}

} // namespace cc
