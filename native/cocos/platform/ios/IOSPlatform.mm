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

#include "platform/ios/IOSPlatform.h"
#include "platform/interfaces/OSInterface.h"
#include "platform/interfaces/modules/ISystemWindow.h"

#import <UIKit/UIKit.h>
#include "base/memory/Memory.h"
#include "modules/Accelerometer.h"
#include "modules/Battery.h"
#include "modules/Network.h"
#include "modules/Screen.h"
#include "modules/System.h"
#include "modules/SystemWindow.h"
#include "modules/SystemWindowManager.h"
#include "modules/Vibrator.h"

extern int cocos_main(int argc, const char **argv);

@interface MyTimer : NSObject {
    cc::IOSPlatform *_platform;
    CADisplayLink *_displayLink;
    int _fps;
}
- (instancetype)initWithApp:(cc::IOSPlatform *)platform fps:(int)fps;
- (void)start;
- (void)changeFPS:(int)fps;
- (void)pause;
- (void)resume;
@end

@implementation MyTimer

- (instancetype)initWithApp:(cc::IOSPlatform *)platform fps:(int)fps {
    if (self = [super init]) {
        _fps = fps;
        _platform = platform;
        _displayLink = [NSClassFromString(@"CADisplayLink") displayLinkWithTarget:self selector:@selector(renderScene:)];
        _displayLink.preferredFramesPerSecond = _fps;
    }
    return self;
}

- (void)start {
    [_displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
}

- (void)pause {
    _displayLink.paused = TRUE;
}

- (void)resume {
    _displayLink.paused = FALSE;
}

- (void)changeFPS:(int)fps {
    _displayLink.preferredFramesPerSecond = fps;
}

- (int)getFPS {
    return (int)_displayLink.preferredFramesPerSecond;
}

- (void)renderScene:(id)sender {
    _platform->runTask();
}

@end

namespace {
MyTimer *_timer;
}

namespace cc {

IOSPlatform::~IOSPlatform() = default;

int32_t IOSPlatform::init() {
    _timer = [[MyTimer alloc] initWithApp:this fps:60];
    registerInterface(std::make_shared<Accelerometer>());
    registerInterface(std::make_shared<Battery>());
    registerInterface(std::make_shared<Network>());
    registerInterface(std::make_shared<Screen>());
    registerInterface(std::make_shared<System>());
    registerInterface(std::make_shared<Vibrator>());
    registerInterface(std::make_shared<SystemWindowManager>());
    return 0;
}

void IOSPlatform::exit() {
    if(_requestExit) {
        // Manual quit requires a call to onDestory.
        onDestroy();
        ::exit(0);
    } else {
        _quitLoop = true;
    }
}

int32_t IOSPlatform::loop() {
    cocos_main(0, nullptr);
    [_timer start];
    return 0;
}

int32_t IOSPlatform::run(int argc, const char **argv) {
    return 0;
}

void IOSPlatform::setFps(int32_t fps) {
    [_timer changeFPS:fps];
}

int32_t IOSPlatform::getFps() const {
    return [_timer getFPS];
}

void IOSPlatform::onPause() {
    [_timer pause];

    cc::WindowEvent ev;
    ev.type = cc::WindowEvent::Type::HIDDEN;
    cc::events::WindowEvent::broadcast(ev);
}

void IOSPlatform::onResume() {
    [_timer resume];

    cc::WindowEvent ev;
    ev.type = cc::WindowEvent::Type::SHOW;
    cc::events::WindowEvent::broadcast(ev);
}

void IOSPlatform::onClose() {
    cc::WindowEvent ev;
    ev.type = cc::WindowEvent::Type::CLOSE;
    cc::events::WindowEvent::broadcast(ev);
}

void IOSPlatform::requestExit() {
    _requestExit = true;
    onClose();
}

void IOSPlatform::onDestroy() {
    if(!_requestExit) {
        // ios exit process is special because it needs to wait for ts layer to destroy resources.
        // The timer cannot be used here.
        while (!_quitLoop) {
            runTask();
        }
    }
    UniversalPlatform::onDestroy();
}

ISystemWindow *IOSPlatform::createNativeWindow(uint32_t windowId, void *externalHandle) {
    return ccnew SystemWindow(windowId, externalHandle);
}

} // namespace cc
