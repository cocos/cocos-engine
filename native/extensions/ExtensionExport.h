/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

#ifndef __CCEXTENSIONEXPORT_H__
#define __CCEXTENSIONEXPORT_H__

#if (defined(WIN32) && defined(_WINDOWS)) || defined(WINRT) || defined(WP8)
    #ifdef __MINGW32__
        #include <string.h>
    #endif

    #if defined(CC_STATIC)
        #define CC_EX_DLL
    #else
        #if defined(_USREXDLL)
            #define CC_EX_DLL __declspec(dllexport)
        #else /* use a DLL library */
            #define CC_EX_DLL __declspec(dllimport)
        #endif
    #endif

    /* Define NULL pointer value */
    #ifndef NULL
        #ifdef __cplusplus
            #define NULL 0
        #else
            #define NULL ((void *)0)
        #endif
    #endif
#elif defined(_SHARED_)
    #define CC_EX_DLL __attribute__((visibility("default")))
#else
    #define CC_EX_DLL
#endif

#endif /* __CCEXTENSIONEXPORT_H__*/
