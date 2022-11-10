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

#include "platform/win32/WindowsPlatform.h"
#include "platform/win32/modules/SystemWindowManager.h"

#include <Windows.h>
#include <shellapi.h>
#include <sstream>

#include "cocos/platform/win32/modules/Accelerometer.h"
#include "cocos/platform/win32/modules/Battery.h"
#include "cocos/platform/win32/modules/Network.h"
#include "cocos/platform/win32/modules/System.h"
#if defined(CC_SERVER_MODE)
#include "platform/empty/modules/Screen.h"
#include "platform/empty/modules/SystemWindow.h"
#else
#include "cocos/platform/win32/modules/Screen.h"
#include "cocos/platform/win32/modules/SystemWindow.h"
#endif
#include "base/memory/Memory.h"
#include "cocos/platform/win32/modules/Vibrator.h"

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

        const WCHAR* wszValue = L"hide_gui";
        const WCHAR* wszNewData = (bEnable) ? L"NO" : L"YES";
        WCHAR wszOldData[256] = { 0 };
        DWORD dwSize = sizeof(wszOldData);
        LSTATUS status = RegQueryValueExW(hKey, wszValue, 0, nullptr, (LPBYTE)wszOldData, &dwSize);
        if (ERROR_FILE_NOT_FOUND == status               // the key not exist
            || (ERROR_SUCCESS == status                  // or the hide_gui value is exist
                && 0 != wcscmp(wszNewData, wszOldData))) // but new data and old data not equal
        {
            dwSize = static_cast<DWORD>(sizeof(WCHAR) * (wcslen(wszNewData) + 1));
            RegSetValueEx(hKey, wszValue, 0, REG_SZ, (const BYTE*)wszNewData, dwSize);
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

    int32_t WindowsPlatform::loop() {
        for (size_t i = 0; i < 5; i++)
        {
            _windowManager->processEvent(&_quit);
        }
        runTask();
        _window->swapWindow();
        return 0;
    }

    ISystemWindow* WindowsPlatform::createNativeWindow(uint32_t windowId, void* externalHandle) {
        return ccnew SystemWindow(windowId, externalHandle);
    }

} // namespace cc
