/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

#include "cocos2d.h"

#include "cocos/scripting/js-bindings/manual/jsb_module_register.hpp"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"

#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/manual/jsb_node.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_opengl_manual.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_platform.h"
#include "cocos/scripting/js-bindings/manual/jsb_cocos2dx_manual.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_xmlhttprequest.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_cocos2dx_network_manual.h"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_network_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_extension_auto.hpp"

#if USE_GFX_RENDERER
#include "cocos/scripting/js-bindings/auto/jsb_gfx_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_renderer_auto.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_gfx_manual.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_renderer_manual.hpp"
#endif

#if USE_SOCKET
#include "cocos/scripting/js-bindings/manual/jsb_websocket.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_socketio.hpp"
#endif // USE_SOCKET

#if USE_AUDIO
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_audioengine_auto.hpp"
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
#include "cocos/scripting/js-bindings/manual/JavaScriptObjCBridge.h"
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "cocos/scripting/js-bindings/manual/JavaScriptJavaBridge.h"
#endif

#if USE_MIDDLEWARE
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_editor_support_auto.hpp"

#if USE_SPINE
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_spine_auto.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_spine_manual.hpp"
#endif

#if USE_DRAGONBONES
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_dragonbones_auto.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_dragonbones_manual.hpp"
#endif

#endif // USE_MIDDLEWARE

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

#if USE_VIDEO
#include "cocos/scripting/js-bindings/auto/jsb_video_auto.hpp"
#endif

#if USE_WEB_VIEW
#include "cocos/scripting/js-bindings/auto/jsb_webview_auto.hpp"
#endif

#endif // (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

using namespace cocos2d;

bool jsb_register_all_modules()
{
    se::ScriptEngine* se = se::ScriptEngine::getInstance();

    se->addBeforeInitHook([](){
        JSBClassType::init();
    });

    se->addBeforeCleanupHook([se](){
        se->garbageCollect();
        PoolManager::getInstance()->getCurrentPool()->clear();
        se->garbageCollect();
        PoolManager::getInstance()->getCurrentPool()->clear();
    });

    se->addRegisterCallback(jsb_register_global_variables);
    se->addRegisterCallback(JSB_register_opengl);
    se->addRegisterCallback(register_all_engine);
    se->addRegisterCallback(register_all_cocos2dx_manual);
    se->addRegisterCallback(register_platform_bindings);
    
    se->addRegisterCallback(register_all_network);
    se->addRegisterCallback(register_all_cocos2dx_network_manual);
    se->addRegisterCallback(register_all_xmlhttprequest);
    // extension depend on network
    se->addRegisterCallback(register_all_extension);

#if USE_GFX_RENDERER
    se->addRegisterCallback(register_all_gfx);
    se->addRegisterCallback(jsb_register_gfx_manual);
    se->addRegisterCallback(register_all_renderer);
    se->addRegisterCallback(jsb_register_renderer_manual);
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
    se->addRegisterCallback(register_javascript_objc_bridge);
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    se->addRegisterCallback(register_javascript_java_bridge);
#endif

#if USE_AUDIO
    se->addRegisterCallback(register_all_audioengine);
#endif

    
#if USE_SOCKET
    se->addRegisterCallback(register_all_websocket);
    se->addRegisterCallback(register_all_socketio);
#endif

#if USE_MIDDLEWARE
    se->addRegisterCallback(register_all_cocos2dx_editor_support);

#if USE_SPINE
    se->addRegisterCallback(register_all_cocos2dx_spine);
    se->addRegisterCallback(register_all_spine_manual);
#endif

#if USE_DRAGONBONES
    se->addRegisterCallback(register_all_cocos2dx_dragonbones);
    se->addRegisterCallback(register_all_dragonbones_manual);
#endif

#endif // USE_MIDDLEWARE

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

#if USE_VIDEO
    se->addRegisterCallback(register_all_video);
#endif

#if USE_WEB_VIEW
    se->addRegisterCallback(register_all_webview);
#endif

#endif // (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

    se->addAfterCleanupHook([](){
        PoolManager::getInstance()->getCurrentPool()->clear();
        JSBClassType::destroy();
    });
    return true;
}
