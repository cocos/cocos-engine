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
#include "cocos/scripting/js-bindings/event/EventDispatcher.h"

#include "ide-support/CodeIDESupport.h"
#include "runtime/Runtime.h"
#include "ide-support/RuntimeJsImpl.h"
USING_NS_CC;
using namespace std;

AppDelegate::AppDelegate(const std::string& name, int width, int height) : Application(name, width, height)
{
}

AppDelegate::~AppDelegate()
{
    // NOTE:Please don't remove this call if you want to debug with Cocos Code IDE
    RuntimeEngine::getInstance()->end();
}

bool AppDelegate::applicationDidFinishLaunching()
{
    // set default FPS
    Application::getInstance()->setPreferredFramesPerSecond(60);

    auto runtimeEngine = RuntimeEngine::getInstance();
    runtimeEngine->setEventTrackingEnable(true);
    auto jsRuntime = RuntimeJsImpl::create();
    runtimeEngine->addRuntime(jsRuntime, kRuntimeEngineJs);
    runtimeEngine->start();

    // Runtime end
    cocos2d::log("iShow!");
    return true;
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void AppDelegate::applicationDidEnterBackground()
{
    EventDispatcher::dispatchEnterBackgroundEvent();
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
    EventDispatcher::dispatchEnterForegroundEvent();
}
