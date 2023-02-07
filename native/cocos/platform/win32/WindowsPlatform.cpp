/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "platform/win32/WindowsPlatform.h"
#include "platform/win32/modules/SystemWindowManager.h"

#include <Windows.h>
#include <shellapi.h>
#include <sstream>

#include "modules/Accelerometer.h"
#include "modules/Battery.h"
#include "modules/Network.h"
#include "modules/System.h"
#if defined(CC_SERVER_MODE)
    #include "platform/empty/modules/Screen.h"
    #include "platform/empty/modules/SystemWindow.h"
#else
    #include "modules/Screen.h"
    #include "modules/SystemWindow.h"
#endif
#include "base/memory/Memory.h"
#include "modules/Vibrator.h"

namespace {
/**
 @brief  This function changes the PVRFrame show/hide setting in register.
 @param  bEnable If true show the PVRFrame window, otherwise hide.
*/
void PVRFrameEnableControlWindow(bool bEnable) {
    HKEY hKey = 0;

    // Open PVRFrame control key, if not exist create it.
    if (ERROR_SUCCESS != RegCreateKeyExW(HKEY_CURRENT_USER,
                                         L"Software\\Imagination Technologies\\PVRVFRame\\STARTUP\\",
                                         0,
                                         0,
                                         REG_OPTION_NON_VOLATILE,
                                         KEY_ALL_ACCESS,
                                         0,
                                         &hKey,
                                         nullptr)) {
        return;
    }

    const WCHAR *wszValue = L"hide_gui";
    const WCHAR *wszNewData = (bEnable) ? L"NO" : L"YES";
    WCHAR wszOldData[256] = {0};
    DWORD dwSize = sizeof(wszOldData);
    LSTATUS status = RegQueryValueExW(hKey, wszValue, 0, nullptr, (LPBYTE)wszOldData, &dwSize);
    if (ERROR_FILE_NOT_FOUND == status               // the key not exist
        || (ERROR_SUCCESS == status                  // or the hide_gui value is exist
            && 0 != wcscmp(wszNewData, wszOldData))) // but new data and old data not equal
    {
        dwSize = static_cast<DWORD>(sizeof(WCHAR) * (wcslen(wszNewData) + 1));
        RegSetValueEx(hKey, wszValue, 0, REG_SZ, (const BYTE *)wszNewData, dwSize);
    }

    RegCloseKey(hKey);
}

} // namespace

namespace cc {
WindowsPlatform::WindowsPlatform() {
}
WindowsPlatform::~WindowsPlatform() {
#ifdef USE_WIN32_CONSOLE
    FreeConsole();
#endif
}

int32_t WindowsPlatform::init() {
    registerInterface(std::make_shared<Accelerometer>());
    registerInterface(std::make_shared<Battery>());
    registerInterface(std::make_shared<Network>());
    registerInterface(std::make_shared<Screen>());
    registerInterface(std::make_shared<System>());
    _windowManager = std::make_shared<SystemWindowManager>();
    registerInterface(_windowManager);
    registerInterface(std::make_shared<Vibrator>());

#ifdef USE_WIN32_CONSOLE
    AllocConsole();
    freopen("CONIN$", "r", stdin);
    freopen("CONOUT$", "w", stdout);
    freopen("CONOUT$", "w", stderr);
#endif

    PVRFrameEnableControlWindow(false);

    return _windowManager->init();
}

void WindowsPlatform::exit() {
    _quit = true;
}

int32_t WindowsPlatform::loop() {
#if CC_EDITOR
    _windowManager->processEvent();
    runTask();
#else
    ///////////////////////////////////////////////////////////////////////////
    /////////////// changing timer resolution
    ///////////////////////////////////////////////////////////////////////////
    UINT TARGET_RESOLUTION = 1; // 1 millisecond target resolution
    TIMECAPS tc;
    UINT wTimerRes = 0;
    if (TIMERR_NOERROR == timeGetDevCaps(&tc, sizeof(TIMECAPS))) {
        wTimerRes = std::min(std::max(tc.wPeriodMin, TARGET_RESOLUTION), tc.wPeriodMax);
        timeBeginPeriod(wTimerRes);
    }

    float dt = 0.f;
    const DWORD _16ms = 16;

    // Main message loop:
    LARGE_INTEGER nFreq;
    LARGE_INTEGER nLast;
    LARGE_INTEGER nNow;

    LONGLONG actualInterval = 0LL;  // actual frame internal
    LONGLONG desiredInterval = 0LL; // desired frame internal, 1 / fps
    LONG waitMS = 0L;

    QueryPerformanceCounter(&nLast);
    QueryPerformanceFrequency(&nFreq);

    onResume();
    while (!_quit) {
        desiredInterval = (LONGLONG)(1.0 / getFps() * nFreq.QuadPart);
        _windowManager->processEvent();

        QueryPerformanceCounter(&nNow);
        actualInterval = nNow.QuadPart - nLast.QuadPart;
        if (actualInterval >= desiredInterval) {
            nLast.QuadPart = nNow.QuadPart;
            runTask();
        } else {
            // The precision of timer on Windows is set to highest (1ms) by 'timeBeginPeriod' from above code,
            // but it's still not precise enough. For example, if the precision of timer is 1ms,
            // Sleep(3) may make a sleep of 2ms or 4ms. Therefore, we subtract 1ms here to make Sleep time shorter.
            // If 'waitMS' is equal or less than 1ms, don't sleep and run into next loop to
            // boost CPU to next frame accurately.
            waitMS = static_cast<LONG>((desiredInterval - actualInterval) * 1000LL / nFreq.QuadPart - 1L);
            if (waitMS > 1L)
                Sleep(waitMS);
        }
    }

    if (wTimerRes != 0)
        timeEndPeriod(wTimerRes);

    onDestroy();
#endif
    return 0;
}

ISystemWindow *WindowsPlatform::createNativeWindow(uint32_t windowId, void *externalHandle) {
    return ccnew SystemWindow(windowId, externalHandle);
}

} // namespace cc
