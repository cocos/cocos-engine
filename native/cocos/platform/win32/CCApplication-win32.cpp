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
#include "scripting/js-bindings/jswrapper/v8/ScriptEngine.hpp"
#include "scripting/js-bindings/event/EventDispatcher.h"

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
        char commandBuf[200] = {0};
		sprintf(commandBuf, "var window = window || this; window.canvas = { width: %d, height: %d };",
                g_width,
                g_height);
        se->evalString(commandBuf);
        
        return true;
    }
}

NS_CC_BEGIN

Application::Application(const std::string& name)
{
    createView(name);
    
    renderer::DeviceGraphics::getInstance();
    se::ScriptEngine::getInstance();
}

Application::~Application()
{
    // TODO: destroy DeviceGraphics
    
    se::ScriptEngine::destroyInstance();
    
    delete CAST_VIEW(_view);
    _view = nullptr;
}

void Application::start()
{
    se::ScriptEngine* se = se::ScriptEngine::getInstance();
    se->addRegisterCallback(setCanvasCallback);
    
    if(!applicationDidFinishLaunching())
        return;

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

    // Main message loop:
    LARGE_INTEGER nLast;
    LARGE_INTEGER nNow;

    QueryPerformanceCounter(&nLast);

    LONGLONG interval = 0LL;
    LONG waitMS = 0L;

    LARGE_INTEGER freq;
    QueryPerformanceFrequency(&freq);
    
    while (!CAST_VIEW(_view)->windowShouldClose())
    {       

        QueryPerformanceCounter(&nNow);
        interval = nNow.QuadPart - nLast.QuadPart;
        if (interval >= _animationInterval)
        {
            nLast.QuadPart = nNow.QuadPart;
            
            CAST_VIEW(_view)->pollEvents();
            EventDispatcher::dispatchTickEvent();
            CAST_VIEW(_view)->swapBuffers();
        }
        else
        {
            // The precision of timer on Windows is set to highest (1ms) by 'timeBeginPeriod' from above code,
            // but it's still not precise enough. For example, if the precision of timer is 1ms,
            // Sleep(3) may make a sleep of 2ms or 4ms. Therefore, we subtract 1ms here to make Sleep time shorter.
            // If 'waitMS' is equal or less than 1ms, don't sleep and run into next loop to
            // boost CPU to next frame accurately.
            waitMS = (_animationInterval - interval) * 1000LL / freq.QuadPart - 1L;
            if (waitMS > 1L)
                Sleep(waitMS);
        } 
    }

    if (wTimerRes != 0)
        timeEndPeriod(wTimerRes);
}

void Application::setAnimationInterval(float interval)
{
    LARGE_INTEGER nFreq;
    QueryPerformanceFrequency(&nFreq);
    _animationInterval = (LONGLONG)(interval * nFreq.QuadPart);
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
    static char code[3] = { 0 };
    GetLocaleInfoA(locale_id, LOCALE_SISO639LANGNAME, code, sizeof(code));
    code[2] = '\0';
    return code;
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

void Application::onCreateView(int&x, int& y, int& width, int& height, PixelFormat& pixelformat, DepthFormat& depthFormat, int& multisamplingCount)
{
    x = 0;
    y = 0;
    width = 960;
    height = 640;
    
    pixelformat = PixelFormat::RGBA8;
    depthFormat = DepthFormat::DEPTH24_STENCIL8;

    multisamplingCount = 0;
}

void Application::createView(const std::string& name)
{
    int x = 0;
    int y = 0;
    int width = 0;
    int height = 0;
    int multisamplingCount = 0;
    PixelFormat pixelformat;
    DepthFormat depthFormat;
    
    onCreateView(x,
                 y,
                 width,
                 height,
                 pixelformat,
                 depthFormat,
                 multisamplingCount);

    _view = new GLView(this, name, x, y, width, height, pixelformat, depthFormat, multisamplingCount);
    
    g_width = width;
    g_height = height;
}

NS_CC_END
