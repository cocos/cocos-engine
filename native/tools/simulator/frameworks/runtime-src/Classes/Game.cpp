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
#include "cocos/application/ApplicationManager.h"
#include "cocos/bindings/event/CustomEventTypes.h"
#include "cocos/bindings/event/EventDispatcher.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_classtype.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "cocos/bindings/manual/jsb_module_register.h"
#include "cocos/renderer/pipeline/GlobalDescriptorSetManager.h"

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #include "SimulatorApp.h"
    #include "windows.h"
#elif (CC_PLATFORM == CC_PLATFORM_MACOS)
    #include <CoreGraphics/CGDisplayConfiguration.h>
    #include "../proj.ios_mac/mac/SimulatorApp.h"
#endif

#include "ide-support/CodeIDESupport.h"
#include "ide-support/RuntimeJsImpl.h"
#include "runtime/ConfigParser.h"
#include "runtime/Runtime.h"

using namespace std;
Game::Game() {
}

Game::~Game() {
    // NOTE:Please don't remove this call if you want to debug with Cocos Code IDE
    RuntimeEngine::getInstance()->end();
}

int Game::init() {
    cc::pipeline::GlobalDSManager::setDescriptorSetLayout();
    SimulatorApp::getInstance()->run();
    int windowWidth = SimulatorApp::getInstance()->getWidth();
    int windowHeight = SimulatorApp::getInstance()->getHegith();
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    int windowPositionX = (GetSystemMetrics(SM_CXSCREEN) - windowWidth) / 2;
    int windowPositionY = (GetSystemMetrics(SM_CYSCREEN) - windowHeight) / 2;
#elif (CC_PLATFORM == CC_PLATFORM_MACOS)
    auto mainDisplayId = CGMainDisplayID();
    int windowPositionX = (CGDisplayPixelsWide(mainDisplayId) - windowWidth) / 2;
    int windowPositionY = (CGDisplayPixelsHigh(mainDisplayId) - windowHeight) / 2;
#endif
    createWindow("My game", windowPositionX, windowPositionY, SimulatorApp::getInstance()->getWidth(),
                 SimulatorApp::getInstance()->getHegith(),
                 cc::ISystemWindow::CC_WINDOW_SHOWN |
                     cc::ISystemWindow::CC_WINDOW_RESIZABLE |
                     cc::ISystemWindow::CC_WINDOW_INPUT_FOCUS);

    auto parser = ConfigParser::getInstance();
    setDebugIpAndPort("0.0.0.0", 5086, parser->isWaitForConnect());

    int ret = cc::CocosApplication::init();
    if (ret != 0) {
        return ret;
    }

    auto runtimeEngine = RuntimeEngine::getInstance();
    runtimeEngine->setEventTrackingEnable(true);
    auto jsRuntime = RuntimeJsImpl::create();
    runtimeEngine->addRuntime(jsRuntime, kRuntimeEngineJs);
    runtimeEngine->start();

    setXXTeaKey("");

    runScript("jsb-adapter/web-adapter.js");
    runScript("main.js");

    // Runtime end
    CC_LOG_DEBUG("iShow!");
    return 0;
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void Game::onPause() {
    cc::CocosApplication::onPause();
}

void Game::onResume() {
    cc::CocosApplication::onResume();
}

void Game::onClose() {
    cc::CocosApplication::onClose();
}

void Game::handleException(const char* location, const char* message, const char* stack) {
    //TODO: nothing
}

CC_REGISTER_APPLICATION(Game);
