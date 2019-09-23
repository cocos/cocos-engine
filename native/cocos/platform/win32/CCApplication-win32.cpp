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
#include <shellapi.h>
#include <MMSystem.h>
#include "platform/CCFileUtils.h"
#include "platform/desktop/CCGLView-desktop.h"
#include "renderer/gfx/DeviceGraphics.h"
#include "scripting/js-bindings/jswrapper/SeApi.h"
#include "scripting/js-bindings/event/EventDispatcher.h"
#include "base/CCScheduler.h"
#include "base/CCAutoreleasePool.h"
#include "base/CCGLUtils.h"
#include "audio/include/AudioEngine.h"

#define CAST_VIEW(view)    ((GLView*)view)

namespace
{
    /**
    @brief  This function changes the PVRFrame show/hide setting in register.
    @param  bEnable If true show the PVRFrame window, otherwise hide.
    */
    void PVRFrameEnableControlWindow(bool bEnable)
    {
        HKEY hKey = 0;

        // Open PVRFrame control key, if not exist create it.
        if(ERROR_SUCCESS != RegCreateKeyExW(HKEY_CURRENT_USER,
            L"Software\\Imagination Technologies\\PVRVFRame\\STARTUP\\",
            0,
            0,
            REG_OPTION_NON_VOLATILE,
            KEY_ALL_ACCESS,
            0,
            &hKey,
            nullptr))
        {
            return;
        }

        const WCHAR* wszValue = L"hide_gui";
        const WCHAR* wszNewData = (bEnable) ? L"NO" : L"YES";
        WCHAR wszOldData[256] = {0};
        DWORD   dwSize = sizeof(wszOldData);
        LSTATUS status = RegQueryValueExW(hKey, wszValue, 0, nullptr, (LPBYTE)wszOldData, &dwSize);
        if (ERROR_FILE_NOT_FOUND == status              // the key not exist
            || (ERROR_SUCCESS == status                 // or the hide_gui value is exist
            && 0 != wcscmp(wszNewData, wszOldData)))    // but new data and old data not equal
        {
            dwSize = sizeof(WCHAR) * (wcslen(wszNewData) + 1);
            RegSetValueEx(hKey, wszValue, 0, REG_SZ, (const BYTE *)wszNewData, dwSize);
        }

        RegCloseKey(hKey);
    }

    int g_width = 0;
    int g_height = 0;
    bool setCanvasCallback(se::Object* global)
    {
        se::ScriptEngine* se = se::ScriptEngine::getInstance();
        uint8_t devicePixelRatio = cocos2d::Application::getInstance()->getDevicePixelRatio();
        char commandBuf[200] = {0};
        sprintf(commandBuf, "window.innerWidth = %d; window.innerHeight = %d;",
          (int)(g_width / devicePixelRatio),
          (int)(g_height / devicePixelRatio));
        se->evalString(commandBuf);
        cocos2d::ccViewport(0, 0, g_width, g_height);
        glDepthMask(GL_TRUE);
        return true;
    }
}

NS_CC_BEGIN

Application* Application::_instance = nullptr;
std::shared_ptr<Scheduler> Application::_scheduler = nullptr;

Application::Application(const std::string& name, int width, int height)
{
    Application::_instance = this;
    _scheduler = std::make_shared<Scheduler>();

    createView(name, width, height);
    
    _renderTexture = new RenderTexture(width, height);
    
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

    delete CAST_VIEW(_view);
    _view = nullptr;

    delete _renderTexture;
    _renderTexture = nullptr;

    Application::_instance = nullptr;
}

void Application::start()
{
    if (!_view)
        return;

    PVRFrameEnableControlWindow(false);

    ///////////////////////////////////////////////////////////////////////////
    /////////////// changing timer resolution
    ///////////////////////////////////////////////////////////////////////////
    UINT TARGET_RESOLUTION = 1; // 1 millisecond target resolution
    TIMECAPS tc;
    UINT wTimerRes = 0;
    if (TIMERR_NOERROR == timeGetDevCaps(&tc, sizeof(TIMECAPS)))
    {
        wTimerRes = std::min(std::max(tc.wPeriodMin, TARGET_RESOLUTION), tc.wPeriodMax);
        timeBeginPeriod(wTimerRes);
    }
    
    float dt = 0.f;
    const DWORD _16ms = 16;

    // Main message loop:
    LARGE_INTEGER nFreq;
    LARGE_INTEGER nLast;
    LARGE_INTEGER nNow;

    LONGLONG actualInterval = 0LL; // actual frame internal
    LONGLONG desiredInterval = 0LL; // desired frame internal, 1 / fps
    LONG waitMS = 0L;

    QueryPerformanceCounter(&nLast);
    QueryPerformanceFrequency(&nFreq);
    se::ScriptEngine* se = se::ScriptEngine::getInstance();
    while (!CAST_VIEW(_view)->windowShouldClose())
    {       
        desiredInterval = (LONGLONG)(1.0 / _fps * nFreq.QuadPart);
        if (!_isStarted)
        {
            auto scheduler = Application::getInstance()->getScheduler();
            scheduler->removeAllFunctionsToBePerformedInCocosThread();
            scheduler->unscheduleAll();

            se::ScriptEngine::getInstance()->cleanup();
            cocos2d::PoolManager::getInstance()->getCurrentPool()->clear();
            cocos2d::EventDispatcher::init();

            ccInvalidateStateCache();
            se->addRegisterCallback(setCanvasCallback);

            if(!applicationDidFinishLaunching())
                return;

            _isStarted = true;
        }

        // should be invoked at the begin of rendering a frame
        if (_isDownsampleEnabled)
            _renderTexture->prepare();
        CAST_VIEW(_view)->pollEvents();
        if(_isStarted)
        {
            QueryPerformanceCounter(&nNow);
            actualInterval = nNow.QuadPart - nLast.QuadPart;
            if (actualInterval >= desiredInterval)
            {
                nLast.QuadPart = nNow.QuadPart;
                dt = (float)actualInterval / nFreq.QuadPart;
                _scheduler->update(dt);

                EventDispatcher::dispatchTickEvent(dt);

                if (_isDownsampleEnabled)
                    _renderTexture->draw();

                CAST_VIEW(_view)->swapBuffers();
                PoolManager::getInstance()->getCurrentPool()->clear();
            }
            else
            {
                // The precision of timer on Windows is set to highest (1ms) by 'timeBeginPeriod' from above code,
                // but it's still not precise enough. For example, if the precision of timer is 1ms,
                // Sleep(3) may make a sleep of 2ms or 4ms. Therefore, we subtract 1ms here to make Sleep time shorter.
                // If 'waitMS' is equal or less than 1ms, don't sleep and run into next loop to
                // boost CPU to next frame accurately.
                waitMS = (desiredInterval - actualInterval) * 1000LL / nFreq.QuadPart - 1L;
                if (waitMS > 1L)
                    Sleep(waitMS);
            } 
        }
        else
        {
            Sleep(_16ms);
        }

    }

    if (wTimerRes != 0)
        timeEndPeriod(wTimerRes);
}

void Application::restart()
{
    _isStarted = false;
}

void Application::end()
{
    glfwSetWindowShouldClose(CAST_VIEW(_view)->getGLFWWindow(), 1);
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

bool Application::isDisplayStats() {
    se::AutoHandleScope hs;
    se::Value ret;
    char commandBuf[100] = "cc.debug.isDisplayStats();";
    se::ScriptEngine::getInstance()->evalString(commandBuf, 100, &ret);
    return ret.toBoolean();
}

void Application::setDisplayStats(bool isShow) {
    se::AutoHandleScope hs;
    char commandBuf[100] = {0};
    sprintf(commandBuf, "cc.debug.setDisplayStats(%s);", isShow ? "true" : "false");
    se::ScriptEngine::getInstance()->evalString(commandBuf);
}

float Application::getScreenScale() const
{
    return CAST_VIEW(_view)->getScale();
}

GLint Application::getMainFBO() const
{
    return CAST_VIEW(_view)->getMainFBO();
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

bool Application::applicationDidFinishLaunching()
{
    return true;
}

void Application::applicationDidEnterBackground()
{
}

void Application::applicationWillEnterForeground()
{
}

void Application::setMultitouch(bool)
{
}

void Application::onCreateView(PixelFormat& pixelformat, DepthFormat& depthFormat, int& multisamplingCount)
{  
    pixelformat = PixelFormat::RGBA8;
    depthFormat = DepthFormat::DEPTH24_STENCIL8;

    multisamplingCount = 0;
}

void Application::createView(const std::string& name, int width, int height)
{
    int multisamplingCount = 0;
    PixelFormat pixelformat;
    DepthFormat depthFormat;
    
    onCreateView(pixelformat,
                 depthFormat,
                 multisamplingCount);

    _view = new GLView(this, name, 0, 0, width, height, pixelformat, depthFormat, multisamplingCount);
    
    g_width = width;
    g_height = height;
}

std::string Application::getSystemVersion()
{
    // REFINE
    return std::string("unknown Windows version");
}
NS_CC_END
