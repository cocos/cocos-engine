/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "GLES2Swapchain.h"
#include "GLES2Device.h"
#include "GLES2GPUObjects.h"
#include "GLES2Texture.h"

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include "android/native_window.h"
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    #include <native_layer.h>
    #include <native_layer_jni.h>
#endif

namespace cc {
namespace gfx {

GLES2Swapchain::GLES2Swapchain() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES2Swapchain::~GLES2Swapchain() {
    destroy();
}

void GLES2Swapchain::doInit(const SwapchainInfo& info) {
    const auto* context = GLES2Device::getInstance()->context();
    _gpuSwapchain       = CC_NEW(GLES2GPUSwapchain);
    auto window        = reinterpret_cast<EGLNativeWindowType>(info.windowHandle); //NOLINT[readability-qualified-auto]

#if CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS
    EGLint nFmt;
    if (eglGetConfigAttrib(context->eglDisplay, context->eglConfig, EGL_NATIVE_VISUAL_ID, &nFmt) == EGL_FALSE) {
        CC_LOG_ERROR("Getting configuration attributes failed.");
        return;
    }

    auto width  = static_cast<int32_t>(info.width);
    auto height = static_cast<int32_t>(info.height);

    #if CC_PLATFORM == CC_PLATFORM_ANDROID
    ANativeWindow_setBuffersGeometry(window, width, height, nFmt);
    #elif CC_PLATFORM == CC_PLATFORM_OHOS
    NativeLayerHandle(window, NativeLayerOps::SET_WIDTH_AND_HEIGHT, width, height);
    NativeLayerHandle(window, NativeLayerOps::SET_FORMAT, nFmt);
    #endif
#endif

    EGL_CHECK(_gpuSwapchain->eglSurface = eglCreateWindowSurface(context->eglDisplay, context->eglConfig, window, nullptr));
    if (_gpuSwapchain->eglSurface == EGL_NO_SURFACE) {
        CC_LOG_ERROR("Create window surface failed.");
        return;
    }

    switch (_vsyncMode) {
        case VsyncMode::OFF: _gpuSwapchain->eglSwapInterval = 0; break;
        case VsyncMode::ON:
        case VsyncMode::RELAXED: _gpuSwapchain->eglSwapInterval = 1; break;
        case VsyncMode::MAILBOX: _gpuSwapchain->eglSwapInterval = 0; break;
        case VsyncMode::HALF: _gpuSwapchain->eglSwapInterval = 2; break;
        default: break;
    }

    ///////////////////// Texture Creation /////////////////////

    _colorTexture        = CC_NEW(GLES2Texture);
    _depthStencilTexture = CC_NEW(GLES2Texture);

    SwapchainTextureInfo textureInfo;
    textureInfo.swapchain = this;
    textureInfo.format    = Format::RGBA8;
    textureInfo.width     = info.width;
    textureInfo.height    = info.height;
    initTexture(textureInfo, _colorTexture);

    textureInfo.format = Format::DEPTH_STENCIL;
    initTexture(textureInfo, _depthStencilTexture);

    _gpuSwapchain->gpuColorTexture = static_cast<GLES2Texture*>(_colorTexture)->gpuTexture();
}

void GLES2Swapchain::doDestroy() {
    if (!_gpuSwapchain) return;

    CC_SAFE_DESTROY(_depthStencilTexture)
    CC_SAFE_DESTROY(_colorTexture)

    doDestroySurface();
    CC_SAFE_DELETE(_gpuSwapchain);
}

void GLES2Swapchain::doResize(uint32_t width, uint32_t height, SurfaceTransform /*transform*/) {
    _colorTexture->resize(width, height);
    _depthStencilTexture->resize(width, height);

    doCreateSurface(_windowHandle);
}

void GLES2Swapchain::doDestroySurface() {
    if (_gpuSwapchain->eglSurface != EGL_NO_SURFACE) {
        auto* context = GLES2Device::getInstance()->context();
        eglDestroySurface(context->eglDisplay, _gpuSwapchain->eglSurface);
        _gpuSwapchain->eglSurface = EGL_NO_SURFACE;
        context->bindContext(false);
    }
}

void GLES2Swapchain::doCreateSurface(void* windowHandle) {
    auto* context = GLES2Device::getInstance()->context();
    auto window  = reinterpret_cast<EGLNativeWindowType>(windowHandle); //NOLINT [readability-qualified-auto]

    EGLint nFmt = 0;
    if (eglGetConfigAttrib(context->eglDisplay, context->eglConfig, EGL_NATIVE_VISUAL_ID, &nFmt) == EGL_FALSE) {
        CC_LOG_ERROR("Getting configuration attributes failed.");
        return;
    }

    auto width  = static_cast<int>(_colorTexture->getWidth());
    auto height = static_cast<int>(_colorTexture->getHeight());
    CC_UNUSED_PARAM(width);
    CC_UNUSED_PARAM(height);
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    ANativeWindow_setBuffersGeometry(window, width, height, nFmt);
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    NativeLayerHandle(window, NativeLayerOps::SET_WIDTH_AND_HEIGHT, width, height);
    NativeLayerHandle(window, SET_FORMAT, nFmt);
#endif

    if (_gpuSwapchain->eglSurface == EGL_NO_SURFACE) {
        EGL_CHECK(_gpuSwapchain->eglSurface = eglCreateWindowSurface(context->eglDisplay, context->eglConfig, window, nullptr));
        if (_gpuSwapchain->eglSurface == EGL_NO_SURFACE) {
            CC_LOG_ERROR("Recreate window surface failed.");
            return;
        }
    }

    context->makeCurrent(_gpuSwapchain, _gpuSwapchain);
}

} // namespace gfx
} // namespace cc
