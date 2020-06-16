#include "CoreStd.h"
#include "Assertion.h"

// Platform head file including
#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #include <Windows.h>
    #undef _T
    #include <tchar.h>
    #define snprintf _snprintf_s
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include <android/log.h>
#endif

namespace cc {
namespace gfx {

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)

enum ErrRet {
    ERRRET_IGNORE = 0,
    ERRRET_BREAKPOINT,
    ERRRET_EXIT
};

LRESULT __stdcall CBTHookProc(long nCode, WPARAM wParam, LPARAM lParam) {
    if (nCode == HCBT_ACTIVATE) {
        SetDlgItemTextA((HWND)wParam, IDRETRY, "&Debug");
        SetDlgItemTextA((HWND)wParam, IDIGNORE, "&Ignore");
        SetDlgItemTextA((HWND)wParam, IDABORT, "&Exit");
    }
    return 0;
}

ErrRet _DisplayError(const char *title, const char *content, const char *desc, const char *fileName, int lineNum) {
    const int MODULE_NAME_SIZE = 255;
    char moduleName[MODULE_NAME_SIZE];

    // attempt to get the module name
    if (!GetModuleFileNameA(NULL, moduleName, MODULE_NAME_SIZE)) {
        char *msg = "<unknown application>";
        strcpy_s(moduleName, strlen(msg), msg);
    }

    // build a collosal string containing the entire asster message
    const int MAX_BUFFER_SIZE = 4096;
    char buffer[MAX_BUFFER_SIZE];

    snprintf(buffer,
             MAX_BUFFER_SIZE,
             "%s\n\nProgram : %s\nFile : %s\nLine : %d\nError: %s\nComment: %s\n",
             title,
             moduleName,
             fileName,
             lineNum,
             content,
             desc);

    // place a copy of the message into the clipboard
    if (OpenClipboard(NULL)) {
        size_t bufferLength = strlen(buffer);
        HGLOBAL hMem = GlobalAlloc(GHND | GMEM_DDESHARE, bufferLength + 1);

        if (hMem) {
            uint8_t *pMem = (uint8_t *)GlobalLock(hMem);
            memcpy(pMem, buffer, bufferLength);
            GlobalUnlock(hMem);
            EmptyClipboard();
            SetClipboardData(CF_TEXT, hMem);
        }

        CloseClipboard();
    }

    // find the top most window of the current application
    HWND hWndParent = GetActiveWindow();
    if (NULL != hWndParent) {
        hWndParent = GetLastActivePopup(hWndParent);
    }

    HHOOK hHook = SetWindowsHookEx(WH_CBT, (HOOKPROC)CBTHookProc, GetModuleHandle(NULL), GetCurrentThreadId());
    // put up a message box with the error
    int iRet = MessageBoxA(hWndParent,
                           buffer,
                           "ERROR NOTIFICATION...",
                           MB_TASKMODAL | MB_SETFOREGROUND | MB_ABORTRETRYIGNORE | MB_ICONERROR);
    UnhookWindowsHookEx(hHook);

    if (iRet == IDRETRY) {
        // ignore this error and continue
        return ERRRET_BREAKPOINT;
    } else if (iRet == IDIGNORE) {
        // ignore this error and continue,
        // plus never stop on this error again (handled by the caller)
        return (ERRRET_IGNORE);
    } else {
        return ERRRET_EXIT;
    }
}

int _ExecAssert(const char *condition, const char *filename, int line, const char *formats, ...) {
    char buffer[4096];
    va_list args;
    va_start(args, formats);
    vsnprintf(buffer, sizeof(buffer) - 1, formats, args);
    va_end(args);

    ErrRet ret = _DisplayError("Assert Failed!", condition, buffer, filename, line);
    if (ret == ERRRET_BREAKPOINT) {
        return 1;
    } else if (ret == ERRRET_EXIT) {
        ExitProcess((UINT)-1);
    }
    return 0;
}
#else
int _ExecAssert(const char *condition, const char *filename, int line, const char *formats, ...) {
    char buffer[4096];
    va_list args;
    va_start(args, formats);
    vsnprintf(buffer, sizeof(buffer) - 1, formats, args);
    va_end(args);

    _ExecAssertOutput(condition, filename, line, buffer);
    return 0;
}
#endif

void _ExecAssertOutput(const char *condition, const char *filename, int line, const char *msg) {
    char buffer[4096];
    snprintf(buffer, sizeof(buffer) - 1, "[ASSERT] %s (%s:%d) %s", condition, filename, line, msg);

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    OutputDebugStringA(buffer);
#elif (CC_PLATFORM == CC_PLATFORM_ANDROID)
    __android_log_write(ANDROID_LOG_FATAL, "Cocos", buffer);
#else
    fputs(buffer, stdout);
#endif
}

} // namespace gfx
} // namespace cc
