/****************************************************************************
Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

http://www.cocos.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/

#include <cstring>
#include <memory>
#include <sstream>
#include <string>

#include "audio/include/AudioEngine.h"
#include "base/Scheduler.h"
#include "cocos/bindings/event/EventDispatcher.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "pipeline/Define.h"
#include "pipeline/RenderPipeline.h"
#include "platform/Application.h"
#include "platform/Device.h"
#include "platform/java/jni/JniHelper.h"
#include "platform/java/jni/JniImp.h"
#include "platform/ohos/jni/JniCocosAbility.h"
#include "renderer/GFXDeviceManager.h"

#include <hilog/log.h>

#define LOGD(...) HILOG_DEBUG(LOG_APP, __VA_ARGS__)

namespace {
bool setCanvasCallback(se::Object *global) { //NOLINT
    auto                viewLogicalSize = cc::Application::getInstance()->getViewLogicalSize();
    se::AutoHandleScope scope;
    se::ScriptEngine *  se   = se::ScriptEngine::getInstance();
    auto *              view = cc::cocosApp.pendingWindow;
    std::stringstream   ss;
    {
        auto windowPtr = reinterpret_cast<uintptr_t>(view);
        ss << "window.innerWidth = " << static_cast<int>(viewLogicalSize.x) << ";"
           << "window.innerHeight = " << static_cast<int>(viewLogicalSize.y) << ";"
           << "window.windowHandler = ";
        if constexpr (sizeof(windowPtr) == 8) { // use bigint
            ss << static_cast<uint64_t>(windowPtr) << "n;";
        }
        if constexpr (sizeof(windowPtr) == 4) {
            ss << static_cast<uint64_t>(windowPtr) << ";";
        }
    }
    se->evalString(ss.str().c_str());

    return true;
}
} // namespace

namespace cc {

Application *              Application::instance  = nullptr;
std::shared_ptr<Scheduler> Application::scheduler = nullptr;

Application::Application(int width, int height) {
    Application::instance = this;
    scheduler             = std::make_shared<Scheduler>();
    _viewLogicalSize.x    = static_cast<float>(width);
    _viewLogicalSize.y    = static_cast<float>(height);
}

Application::~Application() {
#if USE_AUDIO
    AudioEngine::end();
#endif

    pipeline::RenderPipeline::getInstance()->destroy();

    EventDispatcher::destroy();
    se::ScriptEngine::destroyInstance();

    gfx::DeviceManager::destroy();

    Application::instance = nullptr;
}

bool Application::init() {
    se::ScriptEngine *se = se::ScriptEngine::getInstance();
    se->addRegisterCallback(setCanvasCallback);

    EventDispatcher::init();

    return true;
}

void Application::onPause() {
}

void Application::onResume() {
}

void Application::onClose() {
}

void Application::setPreferredFramesPerSecond(int fps) {
    if (fps == 0) {
        return;
    }

    _fps                            = fps;
    _prefererredNanosecondsPerFrame = static_cast<long>(1.0 / _fps * NANOSECONDS_PER_SECOND); //NOLINT(google-runtime-int)
}

std::string Application::getCurrentLanguageCode() const { //NOLINT
    return getCurrentLanguageCodeJNI();
}

bool Application::isDisplayStats() { //NOLINT
    se::AutoHandleScope hs;
    se::Value           ret;
    char                commandBuf[100] = "cc.debug.isDisplayStats();";
    se::ScriptEngine::getInstance()->evalString(commandBuf, 100, &ret);
    return ret.toBoolean();
}

void Application::setDisplayStats(bool isShow) { //NOLINT
    se::AutoHandleScope hs;
    char                commandBuf[100] = {0};
    sprintf(commandBuf, "cc.debug.setDisplayStats(%s);", isShow ? "true" : "false");
    se::ScriptEngine::getInstance()->evalString(commandBuf);
}

void Application::setCursorEnabled(bool value) {
}

Application::LanguageType Application::getCurrentLanguage() const { //NOLINT
    std::string  languageName  = getCurrentLanguageJNI();
    const char * pLanguageName = languageName.c_str();
    LanguageType ret           = LanguageType::ENGLISH;

    if (0 == strcmp("zh", pLanguageName)) {
        ret = LanguageType::CHINESE;
    } else if (0 == strcmp("en", pLanguageName)) {
        ret = LanguageType::ENGLISH;
    } else if (0 == strcmp("fr", pLanguageName)) {
        ret = LanguageType::FRENCH;
    } else if (0 == strcmp("it", pLanguageName)) {
        ret = LanguageType::ITALIAN;
    } else if (0 == strcmp("de", pLanguageName)) {
        ret = LanguageType::GERMAN;
    } else if (0 == strcmp("es", pLanguageName)) {
        ret = LanguageType::SPANISH;
    } else if (0 == strcmp("ru", pLanguageName)) {
        ret = LanguageType::RUSSIAN;
    } else if (0 == strcmp("nl", pLanguageName)) {
        ret = LanguageType::DUTCH;
    } else if (0 == strcmp("ko", pLanguageName)) {
        ret = LanguageType::KOREAN;
    } else if (0 == strcmp("ja", pLanguageName)) {
        ret = LanguageType::JAPANESE;
    } else if (0 == strcmp("hu", pLanguageName)) {
        ret = LanguageType::HUNGARIAN;
    } else if (0 == strcmp("pt", pLanguageName)) {
        ret = LanguageType::PORTUGUESE;
    } else if (0 == strcmp("ar", pLanguageName)) {
        ret = LanguageType::ARABIC;
    } else if (0 == strcmp("nb", pLanguageName)) {
        ret = LanguageType::NORWEGIAN;
    } else if (0 == strcmp("pl", pLanguageName)) {
        ret = LanguageType::POLISH;
    } else if (0 == strcmp("tr", pLanguageName)) {
        ret = LanguageType::TURKISH;
    } else if (0 == strcmp("uk", pLanguageName)) {
        ret = LanguageType::UKRAINIAN;
    } else if (0 == strcmp("ro", pLanguageName)) {
        ret = LanguageType::ROMANIAN;
    } else if (0 == strcmp("bg", pLanguageName)) {
        ret = LanguageType::BULGARIAN;
    }
    return ret;
}

Application::Platform Application::getPlatform() const { //NOLINT
    return Platform::OHOS;
}

bool Application::openURL(const std::string &url) { //NOLINT
    return openURLJNI(url);
}

void Application::copyTextToClipboard(const std::string &text) { //NOLINT
    copyTextToClipboardJNI(text);
}

std::string Application::getSystemVersion() { //NOLINT
    return getSystemVersionJNI();
}

} // namespace cc
