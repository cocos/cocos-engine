/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include "platform/Application.h"
#include "platform/StdC.h" // need it to include Windows.h

#include <MMSystem.h>
#include <shellapi.h>
#include <algorithm>
#include <array>
#include <memory>
#include <sstream>
#include "audio/include/AudioEngine.h"
#include "base/AutoreleasePool.h"
#include "base/Scheduler.h"
#include "cocos/bindings/event/EventDispatcher.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "platform/FileUtils.h"
#include "platform/win32/View-win32.h"

#include "pipeline/Define.h"
#include "pipeline/RenderPipeline.h"
#include "platform/Device.h"
#include "renderer/GFXDeviceManager.h"

extern std::shared_ptr<cc::View> cc_get_application_view();

namespace cc {

Application *              Application::instance  = nullptr;
std::shared_ptr<Scheduler> Application::scheduler = nullptr;

Application::Application(int width, int height) {
    Application::instance = this;
    scheduler             = std::make_shared<Scheduler>();

    FileUtils::getInstance()->addSearchPath("Resources", true);

    EventDispatcher::init();
    se::ScriptEngine::getInstance();
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
    auto scheduler = Application::getInstance()->getScheduler();
    scheduler->removeAllFunctionsToBePerformedInCocosThread();
    scheduler->unscheduleAll();

    se::ScriptEngine::getInstance()->cleanup();

    auto view     = cc_get_application_view();
    auto viewSize = view->getViewSize();

    return true;
}

void Application::setPreferredFramesPerSecond(int fps) {
    if (fps == 0)
        return;

    _fps                            = fps;
    _prefererredNanosecondsPerFrame = static_cast<int64_t>(1.0 / _fps * NANOSECONDS_PER_SECOND);
}

Application::LanguageType Application::getCurrentLanguage() const {
    LanguageType ret = LanguageType::ENGLISH;

    LCID           localeID          = GetUserDefaultLCID();
    unsigned short primaryLanguageID = localeID & 0xFF;

    switch (primaryLanguageID) {
        case LANG_CHINESE:
            ret = LanguageType::CHINESE;
            break;
        case LANG_ENGLISH:
            ret = LanguageType::ENGLISH;
            break;
        case LANG_FRENCH:
            ret = LanguageType::FRENCH;
            break;
        case LANG_ITALIAN:
            ret = LanguageType::ITALIAN;
            break;
        case LANG_GERMAN:
            ret = LanguageType::GERMAN;
            break;
        case LANG_SPANISH:
            ret = LanguageType::SPANISH;
            break;
        case LANG_DUTCH:
            ret = LanguageType::DUTCH;
            break;
        case LANG_RUSSIAN:
            ret = LanguageType::RUSSIAN;
            break;
        case LANG_KOREAN:
            ret = LanguageType::KOREAN;
            break;
        case LANG_JAPANESE:
            ret = LanguageType::JAPANESE;
            break;
        case LANG_HUNGARIAN:
            ret = LanguageType::HUNGARIAN;
            break;
        case LANG_PORTUGUESE:
            ret = LanguageType::PORTUGUESE;
            break;
        case LANG_ARABIC:
            ret = LanguageType::ARABIC;
            break;
        case LANG_NORWEGIAN:
            ret = LanguageType::NORWEGIAN;
            break;
        case LANG_POLISH:
            ret = LanguageType::POLISH;
            break;
        case LANG_TURKISH:
            ret = LanguageType::TURKISH;
            break;
        case LANG_UKRAINIAN:
            ret = LanguageType::UKRAINIAN;
            break;
        case LANG_ROMANIAN:
            ret = LanguageType::ROMANIAN;
            break;
        case LANG_BULGARIAN:
            ret = LanguageType::BULGARIAN;
            break;
    }

    return ret;
}

std::string Application::getCurrentLanguageCode() const {
    LANGID     lid       = GetUserDefaultUILanguage();
    const LCID locale_id = MAKELCID(lid, SORT_DEFAULT);
    int        length    = GetLocaleInfoA(locale_id, LOCALE_SISO639LANGNAME, nullptr, 0);

    char *tempCode = new char[length];
    GetLocaleInfoA(locale_id, LOCALE_SISO639LANGNAME, tempCode, length);
    std::string code = tempCode;
    delete tempCode;

    return code;
}

bool Application::isDisplayStats() {
    se::AutoHandleScope hs;
    se::Value           ret;
    char                commandBuf[100] = "cc.profiler.isShowingStats();";
    se::ScriptEngine::getInstance()->evalString(commandBuf, 100, &ret);
    return ret.toBoolean();
}

void Application::setDisplayStats(bool isShow) {
    se::AutoHandleScope hs;
    char                commandBuf[100] = {0};
    sprintf(commandBuf, isShow ? "cc.profiler.showStats();" : "cc.profiler.hideStats();");
    se::ScriptEngine::getInstance()->evalString(commandBuf);
}

void Application::setCursorEnabled(bool value) {
    cc_get_application_view()->setCursorEnabeld(value);
}

Application::Platform Application::getPlatform() const {
    return Platform::WINDOWS;
}

bool Application::openURL(const std::string &url) {
    WCHAR *   temp       = new WCHAR[url.size() + 1];
    int       wchars_num = MultiByteToWideChar(CP_UTF8, 0, url.c_str(), url.size() + 1, temp, url.size() + 1);
    HINSTANCE r          = ShellExecuteW(NULL, L"open", temp, NULL, NULL, SW_SHOWNORMAL);
    delete[] temp;
    return (size_t)r > 32;
}

void Application::copyTextToClipboard(const std::string &text) {
    //TODO
}

void Application::onPause() {
}

void Application::onResume() {
}

void Application::onClose() {
}

std::string Application::getSystemVersion() {
    OSVERSIONINFO osvi;
    memset(&osvi, 0, sizeof(osvi));
    osvi.dwOSVersionInfoSize = sizeof(OSVERSIONINFO);
    GetVersionEx(&osvi);
    char buff[256] = {0};
    snprintf(buff, sizeof(buff), "Windows version %d.%d.%d", osvi.dwMajorVersion, osvi.dwMinorVersion, osvi.dwBuildNumber);
    return buff;
}
} // namespace cc
