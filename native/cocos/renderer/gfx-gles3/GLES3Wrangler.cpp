/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
#include "GLES3Wrangler.h"

#if defined(_WIN32) && !defined(ANDROID)
    #define WIN32_LEAN_AND_MEAN 1
    #include <windows.h>

static HMODULE libegl = NULL;
static HMODULE libgles = NULL;

bool gles3wOpen() {
    libegl = LoadLibraryA("libEGL.dll");
    libgles = LoadLibraryA("libGLESv2.dll");
    return (libegl && libgles);
}

void *gles3wLoad(const char *proc) {
    void *res = nullptr;
    if (eglGetProcAddress) res = (void *)eglGetProcAddress(proc);
    if (!res) res = (void *)GetProcAddress(libegl, proc);
    return res;
}
#elif defined(__EMSCRIPTEN__)
bool gles3wOpen() { return true; }
void *gles3wLoad(const char *proc) {
    return (void *)eglGetProcAddress(proc);
}
#else
    #include <dlfcn.h>

static void *libegl = nullptr;
static void *libgles = nullptr;

bool gles3wOpen() {
    libegl = dlopen("libEGL.so", RTLD_LAZY | RTLD_GLOBAL);
    libgles = dlopen("libGLESv2.so", RTLD_LAZY | RTLD_GLOBAL);
    return (libegl && libgles);
}

void *gles3wLoad(const char *proc) {
    void *res = nullptr;
    if (eglGetProcAddress) res = (void *)eglGetProcAddress(proc);
    if (!res) res = dlsym(libegl, proc);
    return res;
}
#endif

bool gles3wInit(void) {
    if (!gles3wOpen()) {
        return false;
    }

    eglwLoadProcs(gles3wLoad);
    gles2wLoadProcs(gles3wLoad);
    gles3wLoadProcs(gles3wLoad);

    return true;
}
