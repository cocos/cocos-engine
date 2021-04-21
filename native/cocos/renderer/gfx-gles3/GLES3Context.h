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

#pragma once

#include <vector>
#include "GLES3Std.h"
#include "GLES3Wrangler.h"
#include "gfx-base/GFXContext.h"

namespace cc {
namespace gfx {

class CC_GLES3_API GLES3Context final : public Context {
public:
    GLES3Context();
    ~GLES3Context() override;

    void present() override;

    bool makeCurrent(bool bound);
    bool checkExtension(const String &extension) const;

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    CC_INLINE intptr_t eagl_context() const { return _eaglContext; }
    CC_INLINE intptr_t eagl_shared_ctx() const { return _eaglSharedContext; }
    CC_INLINE uint     getDefaultFramebuffer() const { return _defaultFBO; }
#else
    CC_INLINE NativeDisplayType nativeDisplay() const { return _nativeDisplay; }
    CC_INLINE EGLDisplay        eglDisplay() const { return _eglDisplay; }
    CC_INLINE EGLConfig         eglConfig() const { return _eglConfig; }
    CC_INLINE EGLSurface        eglSurface() const { return _eglSurface; }
    CC_INLINE EGLContext        eglContext() const { return _eglContext; }
    CC_INLINE EGLContext        eglSharedCtx() const { return _eglSharedContext; }
#endif
    CC_INLINE bool    makeCurrent() { return makeCurrent(true); }
    CC_INLINE int     majorVer() const { return _majorVersion; }
    CC_INLINE int     minorVer() const { return _minorVersion; }
    CC_INLINE uint8_t multiSampleCount() const { return _sampleCount; }

    void releaseSurface(uintptr_t windowHandle);
    void acquireSurface(uintptr_t windowHandle);

protected:
    bool makeCurrentImpl(bool bound);
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    bool createCustomFrameBuffer();
    void doDestroyCustomFrameBuffer();
#endif

    bool doInit(const ContextInfo &info) override;
    void doDestroy() override;

    bool    _isPrimaryContex = false;
    bool    _isInitialized   = false;
    uint8_t _sampleBuffers   = 0;
    uint8_t _sampleCount     = 0;
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    intptr_t _eaglContext       = 0;
    intptr_t _eaglSharedContext = 0;
    // iOS needs to created frame buffer and attach color/depth/stencil buffer.
    uint _defaultFBO                = 0;
    uint _defaultColorBuffer        = 0;
    uint _defaultDepthStencilBuffer = 0;
#else
    NativeDisplayType           _nativeDisplay    = 0; // NOLINT(modernize-use-nullptr) portability issues
    EGLDisplay                  _eglDisplay       = EGL_NO_DISPLAY;
    EGLConfig                   _eglConfig        = EGL_NO_CONFIG_KHR;
    EGLSurface                  _eglSurface       = EGL_NO_SURFACE;
    EGLContext                  _eglContext       = EGL_NO_CONTEXT;
    EGLContext                  _eglSharedContext = EGL_NO_CONTEXT;
    std::vector<EGLConfig>      _vecEGLConfig;
#endif
    int         _majorVersion = 0;
    int         _minorVersion = 0;
    StringArray _extensions;
};

} // namespace gfx
} // namespace cc
