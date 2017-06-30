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

USING_NS_CC;
using namespace std;

AppDelegate::AppDelegate()
{
}

AppDelegate::~AppDelegate()
{
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
