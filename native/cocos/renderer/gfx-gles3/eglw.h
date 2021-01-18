#pragma once

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    #ifdef __OBJC__
        #include <OpenGLES/EAGL.h>
    #endif
#else
    #define EGL_EGL_PROTOTYPES 0
    #include <EGL/egl.h>
    #include <EGL/eglext.h>
    #include <EGL/eglplatform.h>
#endif

#define GL_GLES_PROTOTYPES 0
#include <GLES3/gl32.h>

#include <GLES2/gl2ext.h>
#include <GLES3/gl3platform.h>
#include <KHR/khrplatform.h>

void *eglwLoad(const char *proc);