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

#ifndef CC_GFXGLES2_EGL_CONTEXT_H_
#define CC_GFXGLES2_EGL_CONTEXT_H_

#include "GLES2Wrangler.h"

namespace cc {
namespace gfx {

class CC_GLES2_API GLES2Context final : public Context {
public:
    GLES2Context(Device *device);
    ~GLES2Context();

public:
    virtual bool initialize(const ContextInfo &info) override;
    virtual void destroy() override;
    virtual void present() override;
    bool MakeCurrent(bool bound);

    bool CheckExtension(const String &extension) const;

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    CC_INLINE intptr_t eagl_context() const { return _eaglContext; }
    CC_INLINE intptr_t eagl_shared_ctx() const { return _eaglSharedContext; }
    CC_INLINE uint getDefaultFramebuffer() const { return _defaultFBO; }
#else
    CC_INLINE NativeDisplayType native_display() const { return _nativeDisplay; }
    CC_INLINE EGLDisplay egl_display() const { return _eglDisplay; }
    CC_INLINE EGLConfig egl_config() const { return _eglConfig; }
    CC_INLINE EGLSurface egl_surface() const { return _eglSurface; }
    CC_INLINE EGLContext egl_context() const { return _eglContext; }
    CC_INLINE EGLContext egl_shared_ctx() const { return _eglSharedContext; }
#endif
    CC_INLINE bool MakeCurrent() { return MakeCurrent(true); }
    CC_INLINE int major_ver() const { return _majorVersion; }
    CC_INLINE int minor_ver() const { return _minorVersion; }

private:
    bool MakeCurrentImpl(bool bound);

#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    bool createCustomFrameBuffer();
    void destroyCustomFrameBuffer();
#endif

private:
    bool _isPrimaryContex = false;
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    intptr_t _eaglContext = 0;
    intptr_t _eaglSharedContext = 0;
    // iOS needs to created frame buffer and attach color/depth/stencil buffer.
    uint _defaultFBO = 0;
    uint _defaultColorBuffer = 0;
    uint _defaultDepthStencilBuffer = 0;
#else
    NativeDisplayType _nativeDisplay = 0;
    EGLDisplay _eglDisplay = EGL_NO_DISPLAY;
    EGLConfig _eglConfig = EGL_NO_CONFIG_KHR;
    EGLSurface _eglSurface = EGL_NO_SURFACE;
    EGLContext _eglContext = EGL_NO_CONTEXT;
    EGLContext _eglSharedContext = EGL_NO_CONTEXT;
#endif
    int _majorVersion = 0;
    int _minorVersion = 0;
    StringArray _extensions;
    bool _isInitialized = false;
};

} // namespace gfx
} // namespace cc

#endif // CC_GFXGLES2_EGL_CONTEXT_H_
