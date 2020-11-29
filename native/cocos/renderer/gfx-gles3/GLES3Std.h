#pragma once

#include <Core.h>

#if (CC_PLATFORM == CC_PLATFORM_WINDOWS)
    #if defined(CC_STATIC)
        #define CC_GLES3_API
    #else
        #ifdef CC_GLES3_EXPORTS
            #define CC_GLES3_API __declspec(dllexport)
        #else
            #define CC_GLES3_API __declspec(dllimport)
        #endif
    #endif
#else
    #define CC_GLES3_API
#endif

#if CC_DEBUG > 0
#define GL_CHECK(x)                                                  \
    do {                                                             \
        x; GLenum err = glGetError();                                \
        if (err) {                                                   \
            CC_LOG_ERROR("%s returned GL error: 0x%x", #x, err);     \
            CCASSERT(0, "GL error");                                 \
        }                                                            \
    } while (0)
#else
#define GL_CHECK(x) x
#endif
