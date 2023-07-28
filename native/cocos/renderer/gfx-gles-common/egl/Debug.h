#pragma once

#include "base/Log.h"

#if CC_DEBUG > 0
    #define EGL_CHECK(x)                                              \
        do {                                                          \
            x;                                                        \
            const EGLint err = eglGetError();                         \
            if (err != EGL_SUCCESS) {                                 \
                CC_LOG_ERROR("%s returned EGL error: 0x%x", #x, err); \
                CC_ABORT();                                           \
            }                                                         \
        } while (0)
#else
    #define EGL_CHECK(x) x
#endif

#if CC_DEBUG > 0
    #define GL_CHECK(x)                                              \
        do {                                                         \
            x;                                                       \
            const GLenum err = glGetError();                         \
            if (err != GL_NO_ERROR) {                                \
                CC_LOG_ERROR("%s returned GL error: 0x%x", #x, err); \
                CC_ABORT();                                          \
            }                                                        \
        } while (0)
#else
    #define GL_CHECK(x)  x
#endif