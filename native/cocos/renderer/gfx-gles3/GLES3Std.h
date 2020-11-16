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
