/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/mac/MacPlatform.h"
#include "platform/interfaces/OSInterface.h"
#include "platform/mac/AppDelegate.h"

#include "modules/Accelerometer.h"
#include "modules/Battery.h"
#include "modules/Network.h"
#include "modules/System.h"
#include "modules/Vibrator.h"

#if defined(CC_SERVER_MODE)
    #include "platform/empty/modules/Screen.h"
    #include "platform/empty/modules/SystemWindow.h"
    #include "platform/empty/modules/SystemWindowManager.h"
#else
    #include "modules/Screen.h"
    #include "modules/SystemWindow.h"
    #include "modules/SystemWindowManager.h"
#endif

#import <AppKit/AppKit.h>
#include "base/memory/Memory.h"

extern int cocos_main(int argc, const char **argv);

@interface MyTimer : NSObject {
    cc::MacPlatform *_platform;
    NSTimer *_timer;
}
- (instancetype)initWithApp:(cc::MacPlatform *)platform fps:(int)fps;
- (void)start;
- (void)changeFPS;
- (void)pause;
- (void)resume;
@end

@implementation MyTimer

- (instancetype)initWithApp:(cc::MacPlatform *)platform fps:(int)fps {
    if (self = [super init]) {
        _platform = platform;
    }
    return self;
}
#if CC_EDITOR
    - (void)start { }
    - (void)changeFPS { }
    - (void)pause { }
    - (void)resume { }
#else
- (void)start {
    int32_t fps = _platform->getFps();
    _timer = [NSTimer scheduledTimerWithTimeInterval:1.0f / fps
                                              target:self
                                            selector:@selector(renderScene)
                                            userInfo:nil
                                             repeats:YES];
}

- (void)pause {
    [_timer invalidate];
}

- (void)resume {
    [self start];
}

- (void)changeFPS {
    [self pause];
    [self resume];
}

- (void)renderScene {
    _platform->runTask();
}

- (bool) isValid {
    return [_timer valid];
}
#endif
@end

namespace {
MyTimer *_timer;
}

namespace cc {

MacPlatform::~MacPlatform() {
    [_timer release];
}

int32_t MacPlatform::init() {
    _timer = [[MyTimer alloc] initWithApp:this fps:60];
    registerInterface(std::make_shared<Accelerometer>());
    registerInterface(std::make_shared<Battery>());
    registerInterface(std::make_shared<Network>());
    registerInterface(std::make_shared<Screen>());
    registerInterface(std::make_shared<System>());
    registerInterface(std::make_shared<SystemWindowManager>());
    registerInterface(std::make_shared<Vibrator>());
    return 0;
}

bool MacPlatform::readyToExit() {
    return _readyToExit;
}

void MacPlatform::exit() {
    if(!_readyToExit) {
        [[NSApplication sharedApplication] replyToApplicationShouldTerminate:true];
        _readyToExit = true;
    }
}

int32_t MacPlatform::loop(void) {
#if CC_EDITOR
    runTask();
    return 1;
#else
    [_timer start];
    NSArray *arguments = [[NSProcessInfo processInfo] arguments];
    int argc = static_cast<int>(arguments.count);
    std::vector<const char*> argv;
    argv.reserve(argc);
    for (id arg in arguments) {
        argv.emplace_back([arg UTF8String]);
    }

    return cocos_main(argc, argv.data());
#endif
}

int32_t MacPlatform::run(int argc, const char **argv) {
#if defined(CC_SERVER_MODE)
    cocos_main(argc, argv);
    while (true) {
        runTask();
    }
    return 0;
#else
    id delegate = [[AppDelegate alloc] init];
    NSApplication.sharedApplication.delegate = delegate;
    return NSApplicationMain(argc, argv);
#endif
}

void MacPlatform::setFps(int32_t fps) {
    if(fps != getFps()) {
        UniversalPlatform::setFps(fps);
        [_timer changeFPS];
    }
}

void MacPlatform::onPause() {
    [_timer pause];

    cc::WindowEvent ev;
    ev.type = cc::WindowEvent::Type::HIDDEN;
    cc::events::WindowEvent::broadcast(ev);
}

void MacPlatform::onResume() {
    [_timer resume];

    cc::WindowEvent ev;
    ev.type = cc::WindowEvent::Type::SHOW;
    cc::events::WindowEvent::broadcast(ev);
}

void MacPlatform::onClose() {
    cc::WindowEvent ev;
    ev.type = cc::WindowEvent::Type::CLOSE;
    cc::events::WindowEvent::broadcast(ev);
}

cc::ISystemWindow *MacPlatform::createNativeWindow(uint32_t windowId, void *externalHandle) { 
    return ccnew SystemWindow(windowId, externalHandle);
}

} // namespace cc
