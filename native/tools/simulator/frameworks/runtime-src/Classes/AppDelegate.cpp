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

#include "platform/CCGLView.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#include "platform/ios/CCGLViewImpl-ios.h"
#endif // CC_TARGET_PLATFORM == CC_PLATFORM_IOS
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "platform/android/CCGLViewImpl-android.h"
#endif // CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "platform/desktop/CCGLViewImpl-desktop.h"
#endif // CC_TARGET_PLATFORM == CC_PLATFORM_WIN32
#if (CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
#include "platform/desktop/CCGLViewImpl-desktop.h"
#endif // CC_TARGET_PLATFORM == CC_PLATFORM_MAC

#include "base/CCDirector.h"
#include "base/CCEventDispatcher.h"

#include "ide-support/CodeIDESupport.h"
#include "runtime/Runtime.h"
#include "ide-support/RuntimeJsImpl.h"

USING_NS_CC;
using namespace std;

AppDelegate::AppDelegate()
{
}

AppDelegate::~AppDelegate()
{
    // NOTE:Please don't remove this call if you want to debug with Cocos Code IDE
    RuntimeEngine::getInstance()->end();
}

//if you want a different context,just modify the value of glContextAttrs
//it will takes effect on all platforms
void AppDelegate::initGLContextAttrs()
{
    //set OpenGL context attributions,now can only set six attributions:
    //red,green,blue,alpha,depth,stencil
    GLContextAttrs glContextAttrs = {8, 8, 8, 8, 24, 8};

    GLView::setGLContextAttrs(glContextAttrs);
}

bool AppDelegate::applicationDidFinishLaunching()
{
    // set default FPS
    Director::getInstance()->setAnimationInterval(1.0 / 60.0f);
    
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
    auto director = Director::getInstance();
    director->stopAnimation();
    director->getEventDispatcher()->dispatchCustomEvent("game_on_hide");
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
    auto director = Director::getInstance();
    director->startAnimation();
    director->getEventDispatcher()->dispatchCustomEvent("game_on_show");
}
