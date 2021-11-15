/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "cocos/platform/Application.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "pipeline/RenderPipeline.h"
#include "cocos/renderer/GFXDeviceManager.h"

#if USE_AUDIO
    #include "cocos/audio/include/AudioEngine.h"
#endif

#if USE_SOCKET
    #include "cocos/network/WebSocket.h"
#endif

#include "cocos/network/HttpClient.h"

namespace cc {
void Application::restartVM() {
    cc::EventDispatcher::dispatchRestartVM();

    pipeline::RenderPipeline::getInstance()->destroy();

    auto *scriptEngine = se::ScriptEngine::getInstance();

    cc::PoolManager::getInstance()->getCurrentPool()->clear();
#if USE_AUDIO
    cc::AudioEngine::stopAll();
#endif
#if USE_SOCKET
    cc::network::WebSocket::closeAllConnections();
#endif
    cc::network::HttpClient::destroyInstance();

    scheduler->removeAllFunctionsToBePerformedInCocosThread();
    scheduler->unscheduleAll();

    scriptEngine->cleanup();
    cc::gfx::DeviceManager::destroy();
    cc::EventDispatcher::destroy();
    init();
    cc::EventDispatcher::init();
}

void Application::close() { // NOLINT
    if (cc::EventDispatcher::initialized()) {
        cc::EventDispatcher::dispatchCloseEvent();
    }

    auto *scriptEngine = se::ScriptEngine::getInstance();

    cc::PoolManager::getInstance()->getCurrentPool()->clear();
#if USE_AUDIO
    cc::AudioEngine::stopAll();
#endif
#if USE_SOCKET
    cc::network::WebSocket::closeAllConnections();
#endif
    cc::network::HttpClient::destroyInstance();

    scheduler->removeAllFunctionsToBePerformedInCocosThread();
    scheduler->unscheduleAll();

    scriptEngine->cleanup();
    cc::EventDispatcher::destroy();

    // exit

    exit(0);
}

void Application::tick() {
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

    scheduler->update(dt);
    cc::EventDispatcher::dispatchTickEvent(dt);

    LegacyAutoreleasePool *currentPool = PoolManager::getInstance()->getCurrentPool();
    if (currentPool) {
        currentPool->clear();
    }

    now  = std::chrono::steady_clock::now();
    dtNS = dtNS * 0.1 + 0.9 * static_cast<double>(std::chrono::duration_cast<std::chrono::nanoseconds>(now - prevTime).count());
    dt   = static_cast<float>(dtNS) / NANOSECONDS_PER_SECOND;
}

} // namespace cc
