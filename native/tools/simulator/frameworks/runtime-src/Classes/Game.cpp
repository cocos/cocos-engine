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
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_classtype.h"
#include "cocos/bindings/manual/jsb_global.h"
#include "cocos/bindings/manual/jsb_module_register.h"
#include "cocos/renderer/pipeline/GlobalDescriptorSetManager.h"
#include "cocos/platform/interfaces/modules/ISystemWindowManager.h"
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
    SimulatorApp::getInstance()->init();
    std::call_once(_windowCreateFlag, [&]() {
        cc::ISystemWindowInfo info;
        info.width= SimulatorApp::getInstance()->getWidth();
        info.height = SimulatorApp::getInstance()->getHeight();
    #if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
        info.x = (GetSystemMetrics(SM_CXSCREEN) - info.width) / 2;
        info.y = (GetSystemMetrics(SM_CYSCREEN) - info.height) / 2;
    #elif (CC_PLATFORM == CC_PLATFORM_MACOS)
        auto mainDisplayId = CGMainDisplayID();
        info.x = (CGDisplayPixelsWide(mainDisplayId) - info.width) / 2;
        info.y = (CGDisplayPixelsHigh(mainDisplayId) - info.height) / 2;
    #endif
        info.title = "My Game";
        info.flags = cc::ISystemWindow::CC_WINDOW_SHOWN |
                    cc::ISystemWindow::CC_WINDOW_RESIZABLE |
                    cc::ISystemWindow::CC_WINDOW_INPUT_FOCUS;
        
        cc::ISystemWindowManager* windowMgr = CC_GET_PLATFORM_INTERFACE(cc::ISystemWindowManager);
        windowMgr->createWindow(info);
    });
    SimulatorApp::getInstance()->run();
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
