/****************************************************************************
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

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
#include "platform/CCApplication.h"
#include "platform/CCStdC.h" // need it to include Windows.h
#include <algorithm>
#include <memory>
#include <sstream>
#include <array>
#include <shellapi.h>
#include <MMSystem.h>
#include "platform/CCFileUtils.h"
#include "scripting/js-bindings/jswrapper/SeApi.h"
#include "scripting/js-bindings/event/EventDispatcher.h"
#include "base/CCScheduler.h"
#include "base/CCAutoreleasePool.h"
#include "audio/include/AudioEngine.h"



NS_CC_BEGIN



Application* Application::_instance = nullptr;
std::shared_ptr<Scheduler> Application::_scheduler = nullptr;



Application::Application(int width, int height)
{
    Application::_instance = this;
    _scheduler = std::make_shared<Scheduler>();

    EventDispatcher::init();
    se::ScriptEngine::getInstance();
}

Application::~Application()
{

#if USE_AUDIO
    AudioEngine::end();
#endif

    EventDispatcher::destroy();
    se::ScriptEngine::destroyInstance();

    Application::_instance = nullptr;
}

bool Application::init()
{
    auto scheduler = Application::getInstance()->getScheduler();
    scheduler->removeAllFunctionsToBePerformedInCocosThread();
    scheduler->unscheduleAll();

    se::ScriptEngine::getInstance()->cleanup();

    return true;
}

void Application::setPreferredFramesPerSecond(int fps)
{
    _fps = fps;
}

Application::LanguageType Application::getCurrentLanguage() const
{
    LanguageType ret = LanguageType::ENGLISH;

    LCID localeID = GetUserDefaultLCID();
    unsigned short primaryLanguageID = localeID & 0xFF;

    switch (primaryLanguageID)
    {
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

std::string Application::getCurrentLanguageCode() const
{
    LANGID lid = GetUserDefaultUILanguage();
    const LCID locale_id = MAKELCID(lid, SORT_DEFAULT);
    int length = GetLocaleInfoA(locale_id, LOCALE_SISO639LANGNAME, nullptr, 0);

    char *tempCode = new char[length];
    GetLocaleInfoA(locale_id, LOCALE_SISO639LANGNAME, tempCode, length);
    std::string code = tempCode;
    delete tempCode;

    return code;
}

bool Application::isDisplayStats()
{
    se::AutoHandleScope hs;
    se::Value ret;
    char commandBuf[100] = "cc.debug.isDisplayStats();";
    se::ScriptEngine::getInstance()->evalString(commandBuf, 100, &ret);
    return ret.toBoolean();
}

void Application::setDisplayStats(bool isShow)
{
    se::AutoHandleScope hs;
    char commandBuf[100] = {0};
    sprintf(commandBuf, "cc.debug.setDisplayStats(%s);", isShow ? "true" : "false");
    se::ScriptEngine::getInstance()->evalString(commandBuf);
}

void Application::setCursorEnabled(bool value)
{
    //glfwSetInputMode(CAST_VIEW(_view)->getGLFWWindow(), GLFW_CURSOR, value ? GLFW_CURSOR_NORMAL : GLFW_CURSOR_DISABLED);
}

Application::Platform Application::getPlatform() const
{
    return Platform::WINDOWS;
}

bool Application::openURL(const std::string &url)
{
    WCHAR *temp = new WCHAR[url.size() + 1];
    int wchars_num = MultiByteToWideChar(CP_UTF8, 0, url.c_str(), url.size() + 1, temp, url.size() + 1);
    HINSTANCE r = ShellExecuteW(NULL, L"open", temp, NULL, NULL, SW_SHOWNORMAL);
    delete[] temp;
    return (size_t)r>32;
}

void Application::copyTextToClipboard(const std::string &text)
{
    //TODO
}

void Application::onPause()
{
}

void Application::onResume()
{
}


std::string Application::getSystemVersion()
{
    OSVERSIONINFO osvi;
    memset(&osvi, 0, sizeof(osvi));
    osvi.dwOSVersionInfoSize = sizeof(OSVERSIONINFO);
    GetVersionEx(&osvi);
    char buff[256] = { 0 };
    snprintf(buff, sizeof(buff), "Windows version %d.%d.%d", osvi.dwMajorVersion, osvi.dwMinorVersion, osvi.dwBuildNumber);
    return buff;
}
NS_CC_END
