/****************************************************************************
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You
shall not use Cocos Creator software for developing other software or tools
that's used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to
you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include <iostream>
#include <windows.h>

#include "platform/BasePlatform.h"

#if defined(CC_SERVER_MODE)

static bool UTF16ToUTF8(LPCWSTR wideStr, const char **const outUtf8) {
  if (outUtf8 == nullptr) {
    return false;
  }
  int utf8BufferBytes =
      ::WideCharToMultiByte(CP_UTF8, 0, wideStr, -1, NULL, 0, NULL, NULL);
  if (utf8BufferBytes < 0) {
    *outUtf8 = nullptr;
    return false;
  }

  char *utf8Str = static_cast<char *>(malloc(utf8BufferBytes));
  int convResult = ::WideCharToMultiByte(
      CP_UTF8, 0, wideStr, -1, (LPSTR)utf8Str, utf8BufferBytes, NULL, NULL);
  if (convResult != utf8BufferBytes) {
    free(utf8Str);
    *outUtf8 = nullptr;
    return false;
  }

  *outUtf8 = utf8Str;
  return true;
}

int WINAPI WinMain(HINSTANCE hInst, HINSTANCE hPrev, LPSTR lpCmdLine, int sw) {
  if (!AllocConsole()) {
    // GetLastError() to get more info about the error.
    MessageBox(NULL, L"The console window was not created", NULL,
               MB_ICONEXCLAMATION);
    return 0;
  }

  FILE *fConsole;
  freopen_s(&fConsole, "CONOUT$", "w", stdout);
  freopen_s(&fConsole, "CONOUT$", "w", stderr);
  freopen_s(&fConsole, "CONIN$", "r", stdin);

  int argc = 0;

  LPCWSTR szCmdLine = ::GetCommandLineW();
  LPWSTR *lpszArgv = ::CommandLineToArgvW(szCmdLine, &argc);

  std::vector<const char *> argv;
  argv.reserve(argc);
  for (int i = 0; i < argc; ++i) {
    const char *utf8Arg = nullptr;
    if (UTF16ToUTF8(lpszArgv[i], &utf8Arg)) {
      argv.emplace_back(utf8Arg);
    }
  }

  START_PLATFORM(static_cast<int>(argv.size()), argv.data());

  for (const char *arg : argv) {
    free(const_cast<char *>(arg));
  }

  fclose(fConsole);
  if (!FreeConsole()) {
    MessageBox(NULL, L"Failed to free the console!", NULL, MB_ICONEXCLAMATION);
  }
}
#else
#include "SDL2/SDL_main.h"

int SDL_main(int argc, char **argv) {
  START_PLATFORM(argc, (const char **)argv);
}
#endif