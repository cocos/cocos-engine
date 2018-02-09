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

#include "AppDelegate.h"

#include "cocos2d.h"

#include "cocos/scripting/js-bindings/manual/ScriptingCore.h"
#include "cocos/scripting/js-bindings/manual/jsb_module_register.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && PACKAGE_AS
#include "SDKManager.h"
#include "jsb_anysdk_protocols_auto.hpp"
#include "manualanysdkbindings.hpp"
using namespace anysdk::framework;
#endif

USING_NS_CC;

AppDelegate::AppDelegate()
{
}

AppDelegate::~AppDelegate()
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && PACKAGE_AS
    SDKManager::getInstance()->purge();
#endif
}

bool AppDelegate::applicationDidFinishLaunching()
{
#if CC_TARGET_PLATFORM == CC_PLATFORM_IOS && PACKAGE_AS
    SDKManager::getInstance()->loadAllPlugins();
#endif
    
    // set FPS. the default value is 1.0/60 if you don't call this
    setAnimationInterval(1.0 / 60);

    se::ScriptEngine* se = se::ScriptEngine::getInstance();

    jsb_set_xxtea_key("");
    jsb_init_file_operation_delegate();

#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
    // Enable debugger here
    jsb_enable_debugger("0.0.0.0", 5086);
#endif

    se->setExceptionCallback([](const char* location, const char* message, const char* stack){
        // Send exception information to server like Tencent Bugly.

    });

    jsb_register_all_modules();

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS) && PACKAGE_AS
    se->addRegisterCallback(register_all_anysdk_framework);
    se->addRegisterCallback(register_all_anysdk_manual);
#endif

    se->start();

    jsb_run_script("main.js");

    return true;
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void AppDelegate::applicationDidEnterBackground()
{
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
}
