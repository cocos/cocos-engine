//
//  js_module_register.cpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 7/11/17.
//
//

#include "cocos/scripting/js-bindings/manual/jsb_module_register.hpp"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_ui_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_audioengine_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_extension_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_network_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_experimental_webView_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_experimental_video_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_spine_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_box2d_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_creator_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_dragonbones_auto.hpp"

#include "cocos/scripting/js-bindings/manual/jsb_cocos2dx_extension_manual.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/manual/jsb_node.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_cocos2dx_manual.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_spine_manual.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_dragonbones_manual.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_xmlhttprequest.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_websocket.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_socketio.hpp"
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
#include "cocos/scripting/js-bindings/manual/JavaScriptObjCBridge.h"
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "cocos/scripting/js-bindings/manual/JavaScriptJavaBridge.h"
#endif

#include "cocos2d.h"

using namespace cocos2d;

bool jsb_run_script(const std::string& filePath)
{
    Data data = FileUtils::getInstance()->getDataFromFile(filePath);
    if (data.isNull())
        return false;

    return se::ScriptEngine::getInstance()->executeScriptBuffer((const char*)data.getBytes(), (size_t)data.getSize(), nullptr, filePath.c_str());
}

static bool run_prepare_script(se::Object* global)
{
    jsb_run_script("script/jsb_prepare.js");
    return true;
}

static bool run_boot_script(se::Object* global)
{
    jsb_run_script("script/jsb_boot.js");
    return true;
}

bool jsb_register_all_modules()
{
    se::ScriptEngine* se = se::ScriptEngine::getInstance();
    se->addBeforeCleanupHook([se](){
        se->gc();
        PoolManager::getInstance()->getCurrentPool()->clear();
        se->gc();
        PoolManager::getInstance()->getCurrentPool()->clear();
        CCLOG("test");
    });

    se->addRegisterCallback(jsb_register_global_variables);

    se->addRegisterCallback(run_prepare_script);

    se->addRegisterCallback(register_all_cocos2dx);
    se->addRegisterCallback(jsb_register_Node_manual);
    se->addRegisterCallback(register_all_cocos2dx_manual);

    se->addRegisterCallback(register_all_cocos2dx_audioengine);

    se->addRegisterCallback(register_all_cocos2dx_extension);
    se->addRegisterCallback(register_all_cocos2dx_extension_manual);

    se->addRegisterCallback(register_all_cocos2dx_ui);
    se->addRegisterCallback(register_ui_manual);
    se->addRegisterCallback(register_all_cocos2dx_network);

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && !defined(CC_TARGET_OS_TVOS)
    se->addRegisterCallback(register_all_cocos2dx_experimental_video);
    se->addRegisterCallback(register_all_cocos2dx_experimental_webView);
#endif

    se->addRegisterCallback(register_all_cocos2dx_spine);
    se->addRegisterCallback(register_all_spine_manual);

    se->addRegisterCallback(register_all_box2dclasses);
    se->addRegisterCallback(register_all_creator);
    se->addRegisterCallback(register_all_cocos2dx_dragonbones);
    se->addRegisterCallback(register_all_dragonbones_manual);

    se->addRegisterCallback(register_all_xmlhttprequest);
    se->addRegisterCallback(register_all_websocket);
    se->addRegisterCallback(register_all_socketio);

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
    se->addRegisterCallback(register_javascript_objc_bridge);
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    se->addRegisterCallback(register_javascript_java_bridge);
#endif

    // run_boot_script has to be at last.
    se->addRegisterCallback(run_boot_script);

    se->addAfterCleanupHook([](){
        JSBClassType::cleanup();
        PoolManager::getInstance()->getCurrentPool()->clear();
    });
    return true;
}
