
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
#include "platform/openharmony/OpenHarmonyPlatform.h"
#include "bindings/jswrapper/napi/HelperMacros.h"
#include "platform/openharmony/modules/SystemWindow.h"
#include "platform/openharmony/FileUtils-OpenHarmony.h"
#include "bindings/jswrapper/SeApi.h"
#if CC_USE_EDITBOX
    #include "ui/edit-box/EditBox-openharmony.h"
#endif
#if CC_USE_WEBVIEW
    #include "ui/webview/WebViewImpl-openharmony.h"
#endif
namespace cc {
const int32_t kMaxStringLen = 512;

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
NapiHelper::PostMessage2UIThreadCb NapiHelper::_postMsg2UIThreadCb;
NapiHelper::PostSyncMessage2UIThreadCb NapiHelper::_postSyncMsg2UIThreadCb;

static bool js_set_PostMessage2UIThreadCallback(se::State& s) {
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction()) {
                //se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                //jsThis.toObject()->attachObject(jsFunc.toObject());
                auto * thisObj = s.thisObject();
                NapiHelper::_postMsg2UIThreadCb = [=](const std::string larg0, const se::Value& larg1) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    CC_ASSERT(ok);
                    args[1] = larg1;
                    //ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                    se::Value rval;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
            }
        } while(false);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_set_PostMessage2UIThreadCallback);

static bool js_set_PostSyncMessage2UIThreadCallback(se::State& s) {
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction()) {
                //se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                //jsThis.toObject()->attachObject(jsFunc.toObject());
                auto * thisObj = s.thisObject();
                NapiHelper::_postSyncMsg2UIThreadCb = [=](const std::string larg0, const se::Value& larg1, se::Value* res) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;
                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok &= nativevalue_to_se(larg0, args[0], nullptr /*ctx*/);
                    CC_ASSERT(ok);
                    args[1] = larg1;
                    //ok &= nativevalue_to_se(larg1, args[1], nullptr /*ctx*/);
                    //se::Value rval;
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, res);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
            }
        } while(false);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_set_PostSyncMessage2UIThreadCallback);

// NAPI Interface
napi_value NapiHelper::getContext(napi_env env, napi_callback_info info) {
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
            // Register app lifecycle
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("onCreate", NapiHelper::napiOnCreate),
                DECLARE_NAPI_FUNCTION("onShow", NapiHelper::napiOnShow),
                DECLARE_NAPI_FUNCTION("onHide", NapiHelper::napiOnHide),
                DECLARE_NAPI_FUNCTION("onDestroy", NapiHelper::napiOnDestroy),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
        }
        break;
        case JS_PAGE_LIFECYCLE: {
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("onPageShow", NapiHelper::napiOnPageShow),
                DECLARE_NAPI_FUNCTION("onPageHide", NapiHelper::napiOnPageHide),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
        } break;
        case XCOMPONENT_REGISTER_LIFECYCLE_CALLBACK: {
        } break;
        case NATIVE_RENDER_API: {
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("nativeEngineInit", NapiHelper::napiNativeEngineInit),
                DECLARE_NAPI_FUNCTION("nativeEngineStart", NapiHelper::napiNativeEngineStart),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
        } break;
        case WORKER_INIT: {
            se::ScriptEngine::setEnv(env);
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("workerInit", NapiHelper::napiWorkerInit),
                DECLARE_NAPI_FUNCTION("setPostMessageFunction", _SE(js_set_PostMessage2UIThreadCallback)),
                DECLARE_NAPI_FUNCTION("setPostSyncMessageFunction", _SE(js_set_PostSyncMessage2UIThreadCallback)),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
        } break;
        case ENGINE_UTILS: {
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("resourceManagerInit", NapiHelper::napiResourceManagerInit),
                DECLARE_NAPI_FUNCTION("writablePathInit", NapiHelper::napiWritablePathInit),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
        } break;
        case EDITBOX_UTILS: {
            #if CC_USE_EDITBOX
                std::vector<napi_property_descriptor> desc;
                OpenHarmonyEditBox::GetInterfaces(desc);
                NAPI_CALL(env, napi_define_properties(env, exports, desc.size(), desc.data()));
            #endif
        } break;
        case WEBVIEW_UTILS: {
            #if CC_USE_WEBVIEW
                std::vector<napi_property_descriptor> desc;
                OpenHarmonyWebView::GetInterfaces(desc);
                NAPI_CALL(env, napi_define_properties(env, exports, desc.size(), desc.data()));
            #endif
        } break;
        case UV_ASYNC_SEND: {
            napi_property_descriptor desc[] = {
                DECLARE_NAPI_FUNCTION("send", NapiHelper::napiASend),
            };
            NAPI_CALL(env, napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc));
        } break;
        default:
            LOGE("unknown type");
    }
    return exports;
}


// NAPI Interface
bool NapiHelper::exportFunctions(napi_env env, napi_value exports) {
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

    OpenHarmonyPlatform::getInstance()->setNativeXComponent(nativeXComponent);
    return true;
}

napi_value NapiHelper::napiOnCreate(napi_env env, napi_callback_info info) {
    // uv_loop_t* loop = nullptr;
    // NAPI_CALL(env, napi_get_uv_event_loop(env, &loop));
    // OpenHarmonyPlatform::getInstance()->onCreateNative(env, loop);
    return nullptr;
}

napi_value NapiHelper::napiOnShow(napi_env env, napi_callback_info info) {
    cc::WorkerMessageData data{cc::MessageType::WM_APP_SHOW, nullptr, nullptr};
    OpenHarmonyPlatform::getInstance()->enqueue(data);
    return nullptr;
}

napi_value NapiHelper::napiOnHide(napi_env env, napi_callback_info info) {
    cc::WorkerMessageData data{cc::MessageType::WM_APP_HIDE, nullptr, nullptr};
    OpenHarmonyPlatform::getInstance()->enqueue(data);
    return nullptr;
}

napi_value NapiHelper::napiOnDestroy(napi_env env, napi_callback_info info) {
    cc::WorkerMessageData data{cc::MessageType::WM_APP_DESTROY, nullptr, nullptr};
    OpenHarmonyPlatform::getInstance()->enqueue(data);
    return nullptr;
}

napi_value NapiHelper::napiOnPageShow(napi_env env, napi_callback_info info) {
    return nullptr;
}

napi_value NapiHelper::napiOnPageHide(napi_env env, napi_callback_info info) {
    return nullptr;
}

napi_value NapiHelper::napiNativeEngineInit(napi_env env, napi_callback_info info) {
    se::ScriptEngine::setEnv(env);
    OpenHarmonyPlatform::getInstance()->run(0, nullptr);
    return nullptr;
}

napi_value NapiHelper::napiNativeEngineStart(napi_env env, napi_callback_info info) {
    OpenHarmonyPlatform::getInstance()->requestVSync();
    return nullptr;
}

napi_value NapiHelper::napiWorkerInit(napi_env env, napi_callback_info info) {
    uv_loop_t* loop = nullptr;
    NAPI_CALL(env, napi_get_uv_event_loop(env, &loop));
    OpenHarmonyPlatform::getInstance()->workerInit(env, loop);
    return nullptr;
}

napi_value NapiHelper::napiResourceManagerInit(napi_env env, napi_callback_info info) {
    size_t      argc = 1;
    napi_value  args[1];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));
    FileUtilsOpenHarmony::initResourceManager(env, args[0]);
    return nullptr;
}

napi_value NapiHelper::napiWritablePathInit(napi_env env, napi_callback_info info) {
    size_t      argc = 1;
    napi_value  args[1];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));

    napi_status status;
    char   buffer[kMaxStringLen];
    size_t result = 0;
    NODE_API_CALL(status, env, napi_get_value_string_utf8(env, args[0], buffer, kMaxStringLen, &result));
    FileUtilsOpenHarmony::_ohWritablePath = std::string(buffer);
    return nullptr;
}

napi_value NapiHelper::napiASend(napi_env env, napi_callback_info info) {
    OpenHarmonyPlatform::getInstance()->triggerMessageSignal();
    return nullptr;
}
}
