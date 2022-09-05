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

#include "platform/BasePlatform.h"

#if defined(CC_SERVER_MODE)
#include <windows.h>
int WINAPI WinMain(HINSTANCE hInst, HINSTANCE hPrev, LPSTR szCmdLine, int sw) {
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

  START_PLATFORM(0, nullptr);

  fclose(fConsole);
  if (!FreeConsole())
    MessageBox(NULL, L"Failed to free the console!", NULL, MB_ICONEXCLAMATION);
}
#else
#include "sdl2/SDL_main.h"

int SDL_main(int argc, char **argv) {
  START_PLATFORM(argc, (const char **)argv);
}
#endif