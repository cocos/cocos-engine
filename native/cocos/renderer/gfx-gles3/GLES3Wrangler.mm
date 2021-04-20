/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "GLES3Wrangler.h"

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    #import <TargetConditionals.h>
    #import <CoreFoundation/CoreFoundation.h>
    #import <UIKit/UIDevice.h>
    #import <string>
    #import <iostream>
    #import <stdio.h>

static CFBundleRef g_es3Bundle;
static CFURLRef g_es3BundleURL;

static int gles3wOpen() {
    #if TARGET_IPHONE_SIMULATOR
    CFStringRef frameworkPath = CFSTR("/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator.sdk/System/Library/Frameworks/OpenGLES.framework");
    #else
    CFStringRef frameworkPath = CFSTR("/System/Library/Frameworks/OpenGLES.framework");
    #endif

    g_es3BundleURL = CFURLCreateWithFileSystemPath(kCFAllocatorDefault,
                                                   frameworkPath,
                                                   kCFURLPOSIXPathStyle, true);

    CFRelease(frameworkPath);

    g_es3Bundle = CFBundleCreate(kCFAllocatorDefault, g_es3BundleURL);

    return (g_es3Bundle != NULL);
}

static void *gles3wLoad(const char *proc) {
    void *res;

    CFStringRef procname = CFStringCreateWithCString(kCFAllocatorDefault, proc,
                                                     kCFStringEncodingASCII);
    res = CFBundleGetFunctionPointerForName(g_es3Bundle, procname);
    CFRelease(procname);
    return res;
}
#else
    #include <dlfcn.h>
    #include <EGL/egl.h>
    #include <string>
    #import <Foundation/NSURL.h>
    #import <Foundation/NSBundle.h>

static void *libegl;
static void *libgl;

static int gles3wOpen() {
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

static void *gles3wLoad(const char *proc) {
    void *res = nullptr;
    if (eglGetProcAddress) res = (void *)eglGetProcAddress(proc);
    if (!res) res = (void *)dlsym(libegl, proc);
    return res;
}
#endif

bool gles3wInit() {
    if (!gles3wOpen()) {
        return false;
    }

    eglwLoadProcs(gles3wLoad);
    gles2wLoadProcs(gles3wLoad);
    gles3wLoadProcs(gles3wLoad);

    return true;
}
