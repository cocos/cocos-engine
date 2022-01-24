/****************************************************************************
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include "cocos/bindings/manual/jsb_module_register.h"
#include "cocos/base/AutoreleasePool.h"
#include "cocos/bindings/auto/jsb_cocos_auto.h"
#include "cocos/bindings/auto/jsb_extension_auto.h"
#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/auto/jsb_network_auto.h"
#include "cocos/bindings/auto/jsb_pipeline_auto.h"
#include "cocos/bindings/auto/jsb_scene_auto.h"
#include "cocos/bindings/dop/jsb_dop.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_cocos_manual.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_gfx_manual.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "cocos/bindings/manual/jsb_network_manual.h"
#include "cocos/bindings/manual/jsb_pipeline_manual.h"
#include "cocos/bindings/manual/jsb_platform.h"
#include "cocos/bindings/manual/jsb_scene_manual.h"
#include "cocos/bindings/manual/jsb_xmlhttprequest.h"

#if USE_GFX_RENDERER
#endif

#if USE_SOCKET
    #include "cocos/bindings/manual/jsb_socketio.h"
    #include "cocos/bindings/manual/jsb_websocket.h"
#endif // USE_SOCKET

#if USE_AUDIO
    #include "cocos/bindings/auto/jsb_audio_auto.h"
#endif

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    #include "cocos/bindings/manual/JavaScriptObjCBridge.h"
#endif

#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS)
    #include "cocos/bindings/manual/JavaScriptJavaBridge.h"
#endif

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS)

    #if USE_VIDEO
        #include "cocos/bindings/auto/jsb_video_auto.h"
    #endif

    #if USE_WEBVIEW
        #include "cocos/bindings/auto/jsb_webview_auto.h"
    #endif

#endif // (CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_ANDROID)

#if USE_SOCKET && USE_WEBSOCKET_SERVER
    #include "cocos/bindings/manual/jsb_websocket_server.h"
#endif

#if USE_MIDDLEWARE
    #include "cocos/bindings/auto/jsb_editor_support_auto.h"

    #if USE_SPINE
        #include "cocos/bindings/auto/jsb_spine_auto.h"
        #include "cocos/bindings/manual/jsb_spine_manual.h"
    #endif

    #if USE_DRAGONBONES
        #include "cocos/bindings/auto/jsb_dragonbones_auto.h"
        #include "cocos/bindings/manual/jsb_dragonbones_manual.h"
    #endif

#endif // USE_MIDDLEWARE

#if USE_PHYSICS_PHYSX
    #include "cocos/bindings/auto/jsb_physics_auto.h"
#endif

bool jsb_register_all_modules() {
    se::ScriptEngine *se = se::ScriptEngine::getInstance();

    se->addBeforeCleanupHook([se]() {
        se->garbageCollect();
        cc::PoolManager::getInstance()->getCurrentPool()->clear();
        se->garbageCollect();
        cc::PoolManager::getInstance()->getCurrentPool()->clear();
    });

    se->addRegisterCallback(jsb_register_global_variables);
    se->addRegisterCallback(register_all_engine);
    se->addRegisterCallback(register_all_cocos_manual);
    se->addRegisterCallback(register_platform_bindings);
    se->addRegisterCallback(register_all_gfx);
    se->addRegisterCallback(register_all_gfx_manual);

    se->addRegisterCallback(register_all_network);
    se->addRegisterCallback(register_all_network_manual);
    se->addRegisterCallback(register_all_xmlhttprequest);
    // extension depend on network
    se->addRegisterCallback(register_all_extension);
    se->addRegisterCallback(register_all_dop_bindings);
    se->addRegisterCallback(register_all_pipeline);
    se->addRegisterCallback(register_all_pipeline_manual);
    se->addRegisterCallback(register_all_scene);
    se->addRegisterCallback(register_all_scene_manual);

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    se->addRegisterCallback(register_javascript_objc_bridge);
    se->addRegisterCallback(register_script_native_bridge);
#endif

#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS)
    se->addRegisterCallback(register_javascript_java_bridge);
    se->addRegisterCallback(register_script_native_bridge);
#endif

#if USE_AUDIO
    se->addRegisterCallback(register_all_audio);
#endif

#if USE_SOCKET
    se->addRegisterCallback(register_all_websocket);
    se->addRegisterCallback(register_all_socketio);
#endif

#if USE_MIDDLEWARE
    se->addRegisterCallback(register_all_editor_support);

    #if USE_SPINE
    se->addRegisterCallback(register_all_spine);
    se->addRegisterCallback(register_all_spine_manual);
    #endif

    #if USE_DRAGONBONES
    se->addRegisterCallback(register_all_dragonbones);
    se->addRegisterCallback(register_all_dragonbones_manual);
    #endif

#endif // USE_MIDDLEWARE

#if USE_PHYSICS_PHYSX
    se->addRegisterCallback(register_all_physics);
#endif

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS)

    #if USE_VIDEO
    se->addRegisterCallback(register_all_video);
    #endif

    #if USE_WEBVIEW
    se->addRegisterCallback(register_all_webview);
    #endif

#endif // (CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_ANDROID)

#if USE_SOCKET && USE_WEBSOCKET_SERVER
    se->addRegisterCallback(register_all_websocket_server);
#endif
    se->addAfterCleanupHook([]() {
        cc::PoolManager::getInstance()->getCurrentPool()->clear();
        JSBClassType::cleanup();
    });
    return true;
}
