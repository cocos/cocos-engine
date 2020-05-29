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

#include "Game.h"
#include "cocos/scripting/js-bindings/event/CustomEventTypes.h"
#include "cocos/scripting/js-bindings/event/EventDispatcher.h"
#include "cocos/scripting/js-bindings/manual/jsb_module_register.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/event/EventDispatcher.h"
#include "cocos/scripting/js-bindings/manual/jsb_classtype.hpp"

#include "ide-support/CodeIDESupport.h"
#include "runtime/Runtime.h"
#include "ide-support/RuntimeJsImpl.h"
USING_NS_CC;
using namespace std;

Game::Game(int width, int height) : cocos2d::Application(width, height) {}

Game::~Game()
{
    // NOTE:Please don't remove this call if you want to debug with Cocos Code IDE
    RuntimeEngine::getInstance()->end();
}

bool Game::init()
{
    
    cocos2d::Application::init();
    se::ScriptEngine *se = se::ScriptEngine::getInstance();

    // set default FPS
    Application::getInstance()->setPreferredFramesPerSecond(60);
    jsb_init_file_operation_delegate();
    jsb_register_all_modules();
    
    se->start();

    auto runtimeEngine = RuntimeEngine::getInstance();
    runtimeEngine->setEventTrackingEnable(true);
    auto jsRuntime = RuntimeJsImpl::create();
    runtimeEngine->addRuntime(jsRuntime, kRuntimeEngineJs);
    runtimeEngine->start();

    se::AutoHandleScope hs;
    jsb_run_script("jsb-adapter/jsb-builtin.js");
    jsb_run_script("main.js");
    
    se->addAfterCleanupHook([]() {
        JSBClassType::destroy();
    });
    
    // Runtime end
    cocos2d::log("iShow!");
    return true;
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void Game::onPause()
{
    cocos2d::Application::onPause();

    cocos2d::CustomEvent event;
    event.name = EVENT_COME_TO_BACKGROUND;
    cocos2d::EventDispatcher::dispatchCustomEvent(event);
    cocos2d::EventDispatcher::dispatchEnterBackgroundEvent();}

// this function will be called when the app is active again
void Game::onResume()
{
    cocos2d::Application::onResume();
    cocos2d::CustomEvent event;
    event.name = EVENT_COME_TO_FOREGROUND;
    cocos2d::EventDispatcher::dispatchCustomEvent(event);
    cocos2d::EventDispatcher::dispatchEnterForegroundEvent();
    
}
