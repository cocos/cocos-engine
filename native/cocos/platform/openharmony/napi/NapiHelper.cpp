
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
#include <js_native_api.h>
#include <js_native_api_types.h>

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
// NapiHelper::PostMessage2UIThreadCb NapiHelper::_postMsg2UIThreadCb;
// NapiHelper::PostSyncMessage2UIThreadCb NapiHelper::_postSyncMsg2UIThreadCb;

static void js_set_PostMessage2UIThreadCallback(const Napi::CallbackInfo &info) {
    // size_t argc = 1;
    // napi_value result = nullptr;
    // napi_get_undefined(env, &result);
    // napi_value argv = nullptr;
    // napi_value this_arg = nullptr;
    // napi_status status = napi_get_cb_info(env, info, &argc, &argv, &this_arg, nullptr);
    // if (status == napi_ok && argc == 1) {
    //     do {
    //         if (args[0].isObject() && args[0].toObject()->isFunction()) {
    //             //se::Value jsThis(s.thisObject());
    //             se::Value jsFunc(args[0]);
    //             //jsThis.toObject()->attachObject(jsFunc.toObject());
    //             auto * thisObj = s.thisObject();
    //             NapiHelper::_postMsg2UIThreadCb = [=](const std::string larg0, const se::Value& larg1) -> void {
    //                 se::ScriptEngine::getInstance()->clearException();
    //                 se::AutoHandleScope hs;
    //                 CC_UNUSED bool ok = true;
    //                 se::ValueArray args;
    //                 args.resize(2);
    //                 ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
    //                 CC_ASSERT(ok);
    //                 args[1] = larg1;
    //                 //ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
    //                 se::Value rval;
    //                 se::Object* funcObj = jsFunc.toObject();
    //                 bool succeed = funcObj->call(args, thisObj, &rval);
    //                 if (!succeed) {
    //                     se::ScriptEngine::getInstance()->clearException();
    //                 }
    //             };
    //         }
    //     } while(false);
    //     return result;
    // }
    // SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);

    // return result;
}

static void js_set_PostSyncMessage2UIThreadCallback(const Napi::CallbackInfo &info) {
    // const auto& args = s.args();
    // size_t argc = args.size();
    // CC_UNUSED bool ok = true;
    // if (argc == 1) {
    //     do {
    //         if (args[0].isObject() && args[0].toObject()->isFunction()) {
    //             //se::Value jsThis(s.thisObject());
    //             se::Value jsFunc(args[0]);
    //             //jsThis.toObject()->attachObject(jsFunc.toObject());
    //             auto * thisObj = s.thisObject();
    //             NapiHelper::_postSyncMsg2UIThreadCb = [=](const std::string larg0, const se::Value& larg1, se::Value* res) -> void {
    //                 se::ScriptEngine::getInstance()->clearException();
    //                 se::AutoHandleScope hs;
    //                 CC_UNUSED bool ok = true;
    //                 se::ValueArray args;
    //                 args.resize(2);
    //                 ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
    //                 CC_ASSERT(ok);
    //                 args[1] = larg1;
    //                 //ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
    //                 //se::Value rval;
    //                 se::Object* funcObj = jsFunc.toObject();
    //                 bool succeed = funcObj->call(args, thisObj, res);
    //                 if (!succeed) {
    //                     se::ScriptEngine::getInstance()->clearException();
    //                 }
    //             };
    //         }
    //     } while(false);
    //     return true;
    // }
    // SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    // return false;
    // return nullptr;
}

// NAPI Interface
static bool exportFunctions(Napi::Env env, Napi::Object exports) {
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

    char idStr[OH_XCOMPONENT_ID_LEN_MAX + 1] = {};
    uint64_t idSize = OH_XCOMPONENT_ID_LEN_MAX + 1;
    int32_t ret = OH_NativeXComponent_GetXComponentId(nativeXComponent, idStr, &idSize);
    if (ret != OH_NATIVEXCOMPONENT_RESULT_SUCCESS) {
        CC_LOG_ERROR("OH_NativeXComponent_GetXComponentId failed");
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

            exports["workerInit"] = Napi::Function::New(env, napiWorkerInit);
            exports["setPostMessageFunction"] = Napi::Function::New(env, js_set_PostMessage2UIThreadCallback);
            exports["setPostSyncMessageFunction"] = Napi::Function::New(env, js_set_PostSyncMessage2UIThreadCallback);
        } break;
        case ENGINE_UTILS: {
            exports["resourceManagerInit"] = Napi::Function::New(env, napiResourceManagerInit);
            exports["writablePathInit"] = Napi::Function::New(env, napiWritablePathInit);
        } break;
        case EDITBOX_UTILS: {
            //cjh #if CC_USE_EDITBOX
            //     std::vector<napi_property_descriptor> desc;
            //     OpenHarmonyEditBox::GetInterfaces(desc);
            //     NAPI_CALL(env, napi_define_properties(env, exports, desc.size(), desc.data()));
            // #endif
        } break;
        case WEBVIEW_UTILS: {
            //cjh #if CC_USE_WEBVIEW
            //     std::vector<napi_property_descriptor> desc;
            //     OpenHarmonyWebView::GetInterfaces(desc);
            //     NAPI_CALL(env, napi_define_properties(env, exports, desc.size(), desc.data()));
            // #endif
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
Napi::Object NapiHelper::init(Napi::Env env, Napi::Object exports) {
    exports["getContext"] = Napi::Function::New(env, getContext);
    bool ret = exportFunctions(env, exports);
    if (!ret) {
        CC_LOG_ERROR("Init failed");
    }
    return exports;
}

} // namespace cc
