
/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include "cocos/renderer/gfx/GFXUtils.h"

#define _JSB_GL_CHECK(_call) \
                do { \
                    _call; \
                    GLenum gl_err = glGetError(); \
                    if (0 != gl_err) { \
                        SE_REPORT_ERROR(#_call "; GL error 0x%x: %s", gl_err, glEnumName(gl_err)); \
                        return false; \
                    } \
                } while(false)

#define _JSB_GL_CHECK_VOID(_call) \
                do { \
                    _call; \
                    GLenum gl_err = glGetError(); \
                    if (0 != gl_err) { \
                        SE_REPORT_ERROR(#_call "; GL error 0x%x: %s", gl_err, glEnumName(gl_err)); \
                    } \
                } while(false)

#if COCOS2D_DEBUG > 0
    #define JSB_GL_CHECK(_call)   _JSB_GL_CHECK(_call)
    #define JSB_GL_CHECK_VOID(_call)   _JSB_GL_CHECK_VOID(_call)
    #define JSB_GL_CHECK_ERROR() \
                do { \
                    GLenum gl_err = glGetError(); \
                    if (0 != gl_err) { \
                        SE_REPORT_ERROR("line: %d: GL error 0x%x: %s", __LINE__, gl_err, glEnumName(gl_err)); \
                        return false; \
                    } \
                } while(false)
#else
    #define JSB_GL_CHECK(_call)   _call
    #define JSB_GL_CHECK_VOID(_call)   _call
    #define JSB_GL_CHECK_ERROR() 
#endif // BRENDERER_CONFIG_DEBUG
