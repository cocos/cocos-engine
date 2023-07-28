#include "GLESSwapchain.h"

#if CC_SWAPPY_ENABLED
    #include "platform/android/AndroidPlatform.h"
    #include "swappy/swappyGL.h"
#endif

#if (CC_PLATFORM == CC_PLATFORM_ANDROID)
    #include "android/native_window.h"
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    #include <native_layer.h>
    #include <native_layer_jni.h>
#endif

#include "application/ApplicationManager.h"
#include "platform/interfaces/modules/IXRInterface.h"
#include "GLESTexture.h"
#include "gfx-gles-common/common/GLESDevice.h"
#include "gfx-gles-common/egl/Surface.h"

namespace cc::gfx {

GLESSwapchain::GLESSwapchain() {
    _typedID = generateObjectID<decltype(this)>();
}

GLESSwapchain::~GLESSwapchain() {
    destroy();
}

void GLESSwapchain::doInit(const SwapchainInfo &info) {
    _xr = CC_GET_XR_INTERFACE();
    if (_xr) {
        _xr->updateXRSwapchainTypedID(getTypedID());
    }
    auto width = static_cast<int32_t>(info.width);
    auto height = static_cast<int32_t>(info.height);
    const auto *context = GLESDevice::getInstance()->getMainContext();
    _gpuSwapchain = ccnew GLESGPUSwapchain;
#if CC_PLATFORM == CC_PLATFORM_LINUX
    auto window = reinterpret_cast<EGLNativeWindowType>(info.windowHandle);
#else
    auto *window = reinterpret_cast<EGLNativeWindowType>(info.windowHandle);
#endif

#if CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_OHOS
    EGLint nFmt = 0;
    if (eglGetConfigAttrib(context->getDisplay(), context->getConfig(), EGL_NATIVE_VISUAL_ID, &nFmt) == EGL_FALSE) {
        CC_LOG_ERROR("Getting configuration attributes failed.");
        return;
    }

    #if CC_SWAPPY_ENABLED
    bool enableSwappy = true;
    auto *platform = static_cast<AndroidPlatform *>(cc::BasePlatform::getPlatform());
    enableSwappy &= SwappyGL_init(static_cast<JNIEnv *>(platform->getEnv()), static_cast<jobject>(platform->getActivity()));
    int32_t fps = cc::BasePlatform::getPlatform()->getFps();
    if (enableSwappy) {
        if (!fps)
            SwappyGL_setSwapIntervalNS(SWAPPY_SWAP_60FPS);
        else
            SwappyGL_setSwapIntervalNS(1000000000L / fps); //ns
        enableSwappy &= SwappyGL_setWindow(window);
        _gpuSwapchain->swappyEnabled = enableSwappy;
    } else {
        CC_LOG_ERROR("Failed to enable Swappy in current GL swapchain, fallback instead.");
    }

    #endif

    if (_xr) {
        width = _xr->getXRConfig(xr::XRConfigKey::SWAPCHAIN_WIDTH).getInt();
        height = _xr->getXRConfig(xr::XRConfigKey::SWAPCHAIN_HEIGHT).getInt();
    }

    #if CC_PLATFORM == CC_PLATFORM_ANDROID
    ANativeWindow_setBuffersGeometry(window, width, height, nFmt);
    #elif CC_PLATFORM == CC_PLATFORM_OHOS
    NativeLayerHandle(window, NativeLayerOps::SET_WIDTH_AND_HEIGHT, width, height);
    NativeLayerHandle(window, NativeLayerOps::SET_FORMAT, nFmt);
    #endif
#endif

    auto surfaceType = _xr ? _xr->acquireEGLSurfaceType(getTypedID()) : EGLSurfaceType::WINDOW;
    if (surfaceType == EGLSurfaceType::WINDOW) {
        auto *surface = ccnew egl::WindowSurface();
        if (!surface->init(context->getConfig(), window)) {
            CC_LOG_ERROR("Create window surface failed.");
            return;
        }
        _gpuSwapchain->surface = surface;
    } else {
        _gpuSwapchain->surface = context->getPBufferSurface();
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

    _colorTexture = ccnew GLESTexture;
    _depthStencilTexture = ccnew GLESTexture;

    SwapchainTextureInfo textureInfo;
    textureInfo.swapchain = this;
    textureInfo.format = Format::RGBA8;
    textureInfo.width = width;
    textureInfo.height = height;
    initTexture(textureInfo, _colorTexture);

    textureInfo.format = Format::DEPTH_STENCIL;
    initTexture(textureInfo, _depthStencilTexture);

    _gpuSwapchain->gpuColorTexture = static_cast<GLESTexture *>(_colorTexture.get())->gpuTexture();
}

void GLESSwapchain::doDestroy() {
    _depthStencilTexture = nullptr;
    _colorTexture = nullptr;
    doDestroySurface();
    _gpuSwapchain = nullptr;
}

void GLESSwapchain::doResize(uint32_t width, uint32_t height, SurfaceTransform  /*transform*/) {
    _colorTexture->resize(width, height);
    _depthStencilTexture->resize(width, height);

    if (_windowHandle) {
        doCreateSurface(_windowHandle);
    }
}

void GLESSwapchain::doDestroySurface() {
    auto *queue = GLESDevice::getInstance()->getQueue(QueueType::GRAPHICS);
    queue->surfaceDestroy(_gpuSwapchain->surface);
    queue->waitIdle();
    _gpuSwapchain->surface = nullptr;
}

void GLESSwapchain::doCreateSurface(void *windowHandle) {
#if CC_PLATFORM == CC_PLATFORM_LINUX
    auto window = reinterpret_cast<EGLNativeWindowType>(windowHandle);
#else
    auto *window = reinterpret_cast<EGLNativeWindowType>(windowHandle);
#endif
    auto *context = GLESDevice::getInstance()->getMainContext();

    EGLint nFmt = 0;
    if (eglGetConfigAttrib(context->getDisplay(), context->getConfig(), EGL_NATIVE_VISUAL_ID, &nFmt) == EGL_FALSE) {
        CC_LOG_ERROR("Getting configuration attributes failed.");
        return;
    }

    auto width = static_cast<int>(_colorTexture->getWidth());
    auto height = static_cast<int>(_colorTexture->getHeight());
    CC_UNUSED_PARAM(width);
    CC_UNUSED_PARAM(height);

#if CC_SWAPPY_ENABLED
    if (_gpuSwapchain->swappyEnabled) {
        _gpuSwapchain->swappyEnabled &= SwappyGL_setWindow(window);
    }
#endif

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    ANativeWindow_setBuffersGeometry(window, width, height, nFmt);
#elif CC_PLATFORM == CC_PLATFORM_OHOS
    NativeLayerHandle(window, NativeLayerOps::SET_WIDTH_AND_HEIGHT, width, height);
    NativeLayerHandle(window, SET_FORMAT, nFmt);
#endif

    auto surfaceType = _xr ? _xr->acquireEGLSurfaceType(getTypedID()) : EGLSurfaceType::WINDOW;
    if (surfaceType == EGLSurfaceType::WINDOW) {
        auto *surface = ccnew egl::WindowSurface();
        if (!surface->init(context->getConfig(), window)) {
            CC_LOG_ERROR("Recreate window surface failed.");
        }
        _gpuSwapchain->surface = surface;
    } else {
        _gpuSwapchain->surface = context->getPBufferSurface();
    }
}
} // namespace cc::gfx
