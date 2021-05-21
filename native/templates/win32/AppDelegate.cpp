#include "AppDelegate.h"

#include <Windows.h>
#include <shellapi.h>
#include <MMSystem.h>
#include <sstream>

#include "platform/StdC.h"
#include "platform/win32/View-win32.h"
#include "cocos/bindings/jswrapper/SeApi.h"

namespace {
    std::weak_ptr<cc::View> gView;
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

        const WCHAR* wszValue        = L"hide_gui";
        const WCHAR* wszNewData      = (bEnable) ? L"NO" : L"YES";
        WCHAR        wszOldData[256] = {0};
        DWORD        dwSize          = sizeof(wszOldData);
        LSTATUS      status          = RegQueryValueExW(hKey, wszValue, 0, nullptr, (LPBYTE)wszOldData, &dwSize);
        if (ERROR_FILE_NOT_FOUND == status               // the key not exist
            || (ERROR_SUCCESS == status                  // or the hide_gui value is exist
                && 0 != wcscmp(wszNewData, wszOldData))) // but new data and old data not equal
        {
            dwSize = sizeof(WCHAR) * (wcslen(wszNewData) + 1);
            RegSetValueEx(hKey, wszValue, 0, REG_SZ, (const BYTE*)wszNewData, dwSize);
        }

        RegCloseKey(hKey);
    }

    bool setCanvasCallback(se::Object* global) {
        std::stringstream ss;
        se::ScriptEngine* se              = se::ScriptEngine::getInstance();
        auto              view            = gView.lock();
        auto              handler         = view->getWindowHandler();
        auto              viewSize        = view->getViewSize();
        char              commandBuf[200] = {0};
        ss << "window.innerWidth = " << viewSize[0] << "; "
        << "window.innerHeight = " << viewSize[1] << "; "
        << "window.windowHandler = "
        << reinterpret_cast<intptr_t>(handler)
        << ";";

        se->evalString(ss.str().c_str());
        return true;
    }
} // namespace

//exported function
std::shared_ptr<cc::View> cc_get_application_view() {
    return gView.lock();
}

AppDelegate::AppDelegate(const std::string& name, int width, int height) {
    _view = std::make_shared<cc::View>(name, width, height);
    _game = std::make_shared<Game>(width, height);

    gView = _view;
}

void AppDelegate::start() {
    bool resume, pause, close;
    se::ScriptEngine::getInstance()->addPermanentRegisterCallback(setCanvasCallback);

    if (!_view->init()) return;
    if (!_game->init()) return;

    if (!_view)
        return;

    _quit = false;

    PVRFrameEnableControlWindow(false);

    ///////////////////////////////////////////////////////////////////////////
    /////////////// changing timer resolution
    ///////////////////////////////////////////////////////////////////////////
    UINT     TARGET_RESOLUTION = 1; // 1 millisecond target resolution
    TIMECAPS tc;
    UINT     wTimerRes = 0;
    if (TIMERR_NOERROR == timeGetDevCaps(&tc, sizeof(TIMECAPS))) {
        wTimerRes = std::min(std::max(tc.wPeriodMin, TARGET_RESOLUTION), tc.wPeriodMax);
        timeBeginPeriod(wTimerRes);
    }

    float       dt    = 0.f;
    const DWORD _16ms = 16;

    // Main message loop:
    LARGE_INTEGER nFreq;
    LARGE_INTEGER nLast;
    LARGE_INTEGER nNow;

    LONGLONG actualInterval  = 0LL; // actual frame internal
    LONGLONG desiredInterval = 0LL; // desired frame internal, 1 / fps
    LONG     waitMS          = 0L;

    QueryPerformanceCounter(&nLast);
    QueryPerformanceFrequency(&nFreq);
    se::ScriptEngine* se = se::ScriptEngine::getInstance();

    _game->onResume();

    while (!_quit) {
        desiredInterval = (LONGLONG)(1.0 / _game->getPreferredFramesPerSecond() * nFreq.QuadPart);

        resume = false;
        pause  = false;
        close  = false;
        while (_view->pollEvent(&_quit, &resume, &pause, &close)) {
        }

        if (pause) _game->onPause();
        if (resume) _game->onResume();
        if (close) _game->onClose();

        QueryPerformanceCounter(&nNow);
        actualInterval = nNow.QuadPart - nLast.QuadPart;
        if (actualInterval >= desiredInterval) {
            nLast.QuadPart = nNow.QuadPart;
            _game->tick();
            _view->swapbuffer();
        } else {
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

    if (wTimerRes != 0)
        timeEndPeriod(wTimerRes);
}
