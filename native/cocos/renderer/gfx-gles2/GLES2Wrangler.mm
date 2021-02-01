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
#include "GLES2Wrangler.h"

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    #import <TargetConditionals.h>
    #import <CoreFoundation/CoreFoundation.h>
    #import <UIKit/UIDevice.h>
    #import <string>
    #import <iostream>
    #import <stdio.h>

static CFBundleRef g_es2Bundle;
static CFURLRef g_es2BundleURL;

static int gles2wOpen() {
    #if TARGET_IPHONE_SIMULATOR
    CFStringRef frameworkPath = CFSTR("/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator.sdk/System/Library/Frameworks/OpenGLES.framework");
    #else
    CFStringRef frameworkPath = CFSTR("/System/Library/Frameworks/OpenGLES.framework");
    #endif

    g_es2BundleURL = CFURLCreateWithFileSystemPath(kCFAllocatorDefault,
                                                   frameworkPath,
                                                   kCFURLPOSIXPathStyle, true);

    CFRelease(frameworkPath);

    g_es2Bundle = CFBundleCreate(kCFAllocatorDefault, g_es2BundleURL);

    return (g_es2Bundle != NULL);
}

static void *gles2wLoad(const char *proc) {
    void *res;

    CFStringRef procname = CFStringCreateWithCString(kCFAllocatorDefault, proc,
                                                     kCFStringEncodingASCII);
    res = CFBundleGetFunctionPointerForName(g_es2Bundle, procname);
    CFRelease(procname);
    return res;
}
#else
    // macos
    #include <dlfcn.h>
    #include <EGL/egl.h>
    #include <string>
    #import <Foundation/NSURL.h>
    #import <Foundation/NSBundle.h>

static void *libegl;
static void *libgl;

static int gles2wOpen() {
    NSURL *appURL = [[NSBundle mainBundle] bundleURL];

    std::string libPath(appURL.resourceSpecifier.UTF8String);
    libPath.append("/Contents/Frameworks/libEGL.dylib");
    libegl = dlopen(libPath.c_str(), RTLD_LOCAL | RTLD_LAZY);
    if (!libegl) printf("%s\n", dlerror());

    libPath = appURL.resourceSpecifier.UTF8String;
    libPath.append("/Contents/Frameworks/libGLESv2.dylib");
    libgl = dlopen(libPath.c_str(), RTLD_LOCAL | RTLD_LAZY);
    if (!libgl) printf("%s\n", dlerror());

    return (libegl && libgl);
}

static void *gles2wLoad(const char *proc) {
    void *res = nullptr;
    if (eglGetProcAddress) res = (void *)eglGetProcAddress(proc);
    if (!res) res = (void *)dlsym(libegl, proc);
    return res;
}
#endif

bool gles2wInit() {
    if (!gles2wOpen()) {
        return false;
    }

    eglwLoadProcs(gles2wLoad);
    gles2wLoadProcs(gles2wLoad);

    return true;
}
