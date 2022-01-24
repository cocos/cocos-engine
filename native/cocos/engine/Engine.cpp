/****************************************************************************
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include "engine/Engine.h"
#include <functional>
#include "base/AutoreleasePool.h"
#include "base/Macros.h"
#include "platform/BasePlatform.h"

#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/renderer/GFXDeviceManager.h"
#include "pipeline/RenderPipeline.h"

#if USE_AUDIO
    #include "cocos/audio/include/AudioEngine.h"
#endif

#if USE_SOCKET
    #include "cocos/network/WebSocket.h"
#endif

#include <memory>
#include <sstream>
#include "application/ApplicationManager.h"
#include "application/BaseApplication.h"
#include "base/Scheduler.h"
#include "cocos/network/HttpClient.h"
#include "platform/interfaces/modules/ISystemWindow.h"

namespace {

bool setCanvasCallback(se::Object* /*global*/) {
    se::AutoHandleScope scope;
    se::ScriptEngine*   se       = se::ScriptEngine::getInstance();
    auto*               window   = CC_CURRENT_ENGINE()->getInterface<cc::ISystemWindow>();
    auto                handler  = window->getWindowHandler();
    auto                viewSize = window->getViewSize();

    std::stringstream ss;
    {
        ss << "window.innerWidth = " << static_cast<int>(viewSize.x) << ";";
        ss << "window.innerHeight = " << static_cast<int>(viewSize.y) << ";";
        ss << "window.windowHandler = ";
        if (sizeof(handler) == 8) { // use bigint
            ss << static_cast<uint64_t>(handler) << "n;";
        }
        if (sizeof(handler) == 4) {
            ss << static_cast<uint32_t>(handler) << ";";
        }
    }
    se->evalString(ss.str().c_str());

    return true;
}

} // namespace

namespace cc {

Engine::Engine() {
    _scheduler = std::make_shared<Scheduler>();
    FileUtils::getInstance()->addSearchPath("Resources", true);
    EventDispatcher::init();
    se::ScriptEngine::getInstance();
}

Engine::~Engine() {
#if USE_AUDIO
    AudioEngine::end();
#endif

    pipeline::RenderPipeline::getInstance()->destroy();

    EventDispatcher::destroy();
    se::ScriptEngine::destroyInstance();

    gfx::DeviceManager::destroy();

    BasePlatform* platform = BasePlatform::getPlatform();
    platform->setHandleEventCallback(nullptr);
}

int32_t Engine::init() {
    _scheduler->removeAllFunctionsToBePerformedInCocosThread();
    _scheduler->unscheduleAll();

    se::ScriptEngine::getInstance()->cleanup();

    BasePlatform* platform = BasePlatform::getPlatform();
    platform->setHandleEventCallback(
        std::bind(&Engine::handleEvent, this, std::placeholders::_1));// NOLINT(modernize-avoid-bind)

    se::ScriptEngine::getInstance()->addPermanentRegisterCallback(setCanvasCallback);
    return 0;
}

int32_t Engine::run() {
    BasePlatform* platform = BasePlatform::getPlatform();
    platform->runInPlatformThread([&]() {
        tick();
    });
    return 0;
}

void Engine::pause() {
    // TODO(cc) : Follow-up support
}

void Engine::resume() {
    // TODO(cc) : Follow-up support
}

int Engine::restart() {
    _needRestart = true;
    return 0;
}

void Engine::close() { // NOLINT
    if (cc::EventDispatcher::initialized()) {
        cc::EventDispatcher::dispatchCloseEvent();
    }

    auto* scriptEngine = se::ScriptEngine::getInstance();

    cc::PoolManager::getInstance()->getCurrentPool()->clear();
#if USE_AUDIO
    cc::AudioEngine::stopAll();
#endif
//#if USE_SOCKET
//    cc::network::WebSocket::closeAllConnections();
//#endif
    cc::network::HttpClient::destroyInstance();

    _scheduler->removeAllFunctionsToBePerformedInCocosThread();
    _scheduler->unscheduleAll();

    scriptEngine->cleanup();
    cc::EventDispatcher::destroy();

    // exit
    exit(0);
}

uint Engine::getTotalFrames() const {
    return _totalFrames;
}

void Engine::setPreferredFramesPerSecond(int fps) {
    if (fps == 0) {
        return;
    }
    BasePlatform* platform = BasePlatform::getPlatform();
    platform->setFps(fps);
    _prefererredNanosecondsPerFrame = static_cast<long>(1.0 / fps * NANOSECONDS_PER_SECOND); //NOLINT(google-runtime-int)
}

void Engine::addEventCallback(OSEventType evType, const EventCb& cb) {
    _eventCallbacks.insert(std::make_pair(evType, cb));
}

void Engine::removeEventCallback(OSEventType evType) {
    auto it = _eventCallbacks.find(evType);
    if (it != _eventCallbacks.end()) {
        _eventCallbacks.erase(it);
        return;
    }

    // For debugging.
    CCASSERT(false, "Interface does not exist");
}

void Engine::tick() {
    if (_needRestart) {
        restartVM();
        _needRestart = false;
    }

    static std::chrono::steady_clock::time_point prevTime;
    static std::chrono::steady_clock::time_point now;
    static float                                 dt   = 0.F;
    static double                                dtNS = NANOSECONDS_60FPS;

    ++_totalFrames;

    // iOS/macOS use its own fps limitation algorithm.
#if (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_WINDOWS || CC_PLATFORM == CC_PLATFORM_OHOS)
    if (dtNS < static_cast<double>(_prefererredNanosecondsPerFrame)) {
        std::this_thread::sleep_for(
            std::chrono::nanoseconds(_prefererredNanosecondsPerFrame - static_cast<int64_t>(dtNS)));
        dtNS = static_cast<double>(_prefererredNanosecondsPerFrame);
    }
#endif

    prevTime = std::chrono::steady_clock::now();

    _scheduler->update(dt);
    cc::EventDispatcher::dispatchTickEvent(dt);

    LegacyAutoreleasePool* currentPool = PoolManager::getInstance()->getCurrentPool();
    if (currentPool) {
        currentPool->clear();
    }

    now  = std::chrono::steady_clock::now();
    dtNS = dtNS * 0.1 + 0.9 * static_cast<double>(std::chrono::duration_cast<std::chrono::nanoseconds>(now - prevTime).count());
    dt   = static_cast<float>(dtNS) / NANOSECONDS_PER_SECOND;
}

int32_t Engine::restartVM() {
    cc::EventDispatcher::dispatchRestartVM();

    pipeline::RenderPipeline::getInstance()->destroy();

    auto* scriptEngine = se::ScriptEngine::getInstance();

    cc::PoolManager::getInstance()->getCurrentPool()->clear();
#if USE_AUDIO
    cc::AudioEngine::stopAll();
#endif
//#if USE_SOCKET
//    cc::network::WebSocket::closeAllConnections();
//#endif
    cc::network::HttpClient::destroyInstance();

    _scheduler->removeAllFunctionsToBePerformedInCocosThread();
    _scheduler->unscheduleAll();

    scriptEngine->cleanup();
    cc::EventDispatcher::destroy();

    // start
    cc::EventDispatcher::init();
    CC_CURRENT_APPLICATION()->init();

    cc::gfx::DeviceManager::addSurfaceEventListener();
    return 0;
}

bool Engine::handleEvent(const OSEvent& ev) {
    bool        isHandled = false;
    OSEventType type      = ev.eventType();
    if (type == OSEventType::TOUCH_OSEVENT) {
        cc::EventDispatcher::dispatchTouchEvent(OSEvent::castEvent<TouchEvent>(ev));
        isHandled = true;
    } else if (type == OSEventType::MOUSE_OSEVENT) {
        cc::EventDispatcher::dispatchMouseEvent(OSEvent::castEvent<MouseEvent>(ev));
        isHandled = true;
    } else if (type == OSEventType::KEYBOARD_OSEVENT) {
        cc::EventDispatcher::dispatchKeyboardEvent(OSEvent::castEvent<KeyboardEvent>(ev));
        isHandled = true;
    } else if (type == OSEventType::CUSTOM_OSEVENT) {
        cc::EventDispatcher::dispatchCustomEvent(OSEvent::castEvent<CustomEvent>(ev));
        isHandled = true;
    } else if (type == OSEventType::WINDOW_OSEVENT) {
        isHandled = dispatchWindowEvent(OSEvent::castEvent<WindowEvent>(ev));
    } else if (type == OSEventType::DEVICE_OSEVENT) {
        isHandled = dispatchDeviceEvent(OSEvent::castEvent<DeviceEvent>(ev));
    }
    isHandled = dispatchEventToApp(type, ev);
    return isHandled;
}

Engine::SchedulerPtr Engine::getScheduler() const {
    return _scheduler;
}

bool Engine::dispatchDeviceEvent(const DeviceEvent& ev) { // NOLINT(readability-convert-member-functions-to-static)
    if (ev.type == DeviceEvent::Type::DEVICE_MEMORY) {
        cc::EventDispatcher::dispatchMemoryWarningEvent();
        return true;
    }
    return false;
}

bool Engine::dispatchWindowEvent(const WindowEvent& ev) {
    bool isHandled = false;
    if (ev.type == WindowEvent::Type::SHOW ||
        ev.type == WindowEvent::Type::RESTORED) {
        onResume();
        isHandled = true;
    } else if (ev.type == WindowEvent::Type::SIZE_CHANGED ||
               ev.type == WindowEvent::Type::RESIZED) {
        cc::EventDispatcher::dispatchResizeEvent(ev.width, ev.height);
        isHandled = true;
    } else if (ev.type == WindowEvent::Type::HIDDEN ||
               ev.type == WindowEvent::Type::MINIMIZED) {
        onPause();
        isHandled = true;
    } else if (ev.type == WindowEvent::Type::CLOSE) {
        onClose();
        isHandled = true;
    } else if (ev.type == WindowEvent::Type::QUIT) {
        onClose();
        isHandled = true;
    }
    return isHandled;
}

bool Engine::dispatchEventToApp(OSEventType type, const OSEvent& ev) {
    auto it = _eventCallbacks.find(type);
    if (it != _eventCallbacks.end()) {
        it->second(ev);
        return true;
    }
    return false;
}

void Engine::onPause() {
    AppEvent appEv;
    appEv.type = AppEvent::Type::PAUSE;
    dispatchEventToApp(OSEventType::APP_OSEVENT, appEv);

    cc::EventDispatcher::dispatchEnterBackgroundEvent();
}

void Engine::onResume() {
    AppEvent appEv;
    appEv.type = AppEvent::Type::RESUME;
    dispatchEventToApp(OSEventType::APP_OSEVENT, appEv);

    cc::EventDispatcher::dispatchEnterForegroundEvent();
}

void Engine::onClose() {
    AppEvent appEv;
    appEv.type = AppEvent::Type::CLOSE;
    dispatchEventToApp(OSEventType::APP_OSEVENT, appEv);

    cc::EventDispatcher::dispatchCloseEvent();
}

} // namespace cc
