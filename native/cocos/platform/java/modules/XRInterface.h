/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "base/Ptr.h"
#include "base/ThreadPool.h"
#include "platform/interfaces/modules/IXRInterface.h"
#if CC_USE_XR_REMOTE_PREVIEW
    #include "xr/XRRemotePreviewManager.h"
#endif
namespace se {
class Object;
}

namespace cc {

class XRInterface : public IXRInterface {
public:
    xr::XRVendor getVendor() override;
    xr::XRConfigValue getXRConfig(xr::XRConfigKey key) override;
    void setXRConfig(xr::XRConfigKey key, xr::XRConfigValue value) override;

    uint32_t getRuntimeVersion() override;
    void initialize(void *javaVM, void *activity) override;

    // render thread lifecycle
    void onRenderPause() override;
    void onRenderResume() override;
    void onRenderDestroy() override;
    // render thread lifecycle

    // gfx
    void preGFXDeviceInitialize(gfx::API gfxApi) override;
    void postGFXDeviceInitialize(gfx::API gfxApi) override;
    const xr::XRSwapchain &doGFXDeviceAcquire(gfx::API gfxApi) override;
    bool isGFXDeviceNeedsPresent(gfx::API gfxApi) override;
    void postGFXDevicePresent(gfx::API gfxApi) override;
    void createXRSwapchains() override;
    const std::vector<cc::xr::XRSwapchain> &getXRSwapchains() override;
    gfx::Format getXRSwapchainFormat() override;
    void updateXRSwapchainTypedID(uint32_t typedID) override;
    // gfx

    // vulkan
#ifdef CC_USE_VULKAN
    uint32_t getXRVkApiVersion(uint32_t engineVkApiVersion) override;
    void initializeVulkanData(const PFN_vkGetInstanceProcAddr &addr) override;
    VkInstance createXRVulkanInstance(const VkInstanceCreateInfo &instInfo) override;
    VkDevice createXRVulkanDevice(const VkDeviceCreateInfo *deviceInfo) override;
    VkPhysicalDevice getXRVulkanGraphicsDevice() override;
    void getXRSwapchainVkImages(std::vector<VkImage> &vkImages, uint32_t eye) override;
#endif
    // vulkan

    // gles
#ifdef CC_USE_GLES3
    void initializeGLESData(xr::PFNGLES3WLOADPROC gles3wLoadFuncProc, gfx::GLES3GPUContext *gpuContext) override;
    void attachGLESFramebufferTexture2D() override;
    EGLSurfaceType acquireEGLSurfaceType(uint32_t typedID) override;
#endif
    // gles

    // stereo render loop
    bool platformLoopStart() override;
    bool beginRenderFrame() override;
    bool isRenderAllowable() override;
    bool beginRenderEyeFrame(uint32_t eye) override;
    bool endRenderEyeFrame(uint32_t eye) override;
    bool endRenderFrame() override;
    bool platformLoopEnd() override;
    // stereo render loop

    ccstd::vector<float> getHMDViewPosition(uint32_t eye, int trackingType) override;
    ccstd::vector<float> getXRViewProjectionData(uint32_t eye, float near, float far) override;
    ccstd::vector<float> getXREyeFov(uint32_t eye) override;
    // renderwindow
    xr::XREye getXREyeByRenderWindow(void *window) override;
    void bindXREyeWithRenderWindow(void *window, xr::XREye eye) override;
    void handleAppCommand(int appCmd) override;
    void adaptOrthographicMatrix(cc::scene::Camera *camera, const ccstd::array<float, 4> &preTransform, Mat4 &proj, Mat4 &view) override;

private:
    void loadImageTrackingData(const std::string &imageInfo);
    void asyncLoadAssetsImage(const std::string &imagePath);
    void dispatchGamepadEventInternal(const xr::XRControllerEvent &xrControllerEvent);
    void dispatchHandleEventInternal(const xr::XRControllerEvent &xrControllerEvent);
    void dispatchHMDEventInternal(const xr::XRControllerEvent &xrControllerEvent);
    ControllerEvent _controllerEvent;
    se::Object *_jsPoseEventArray{nullptr};

#if CC_USE_VULKAN
    PFN_vkGetInstanceProcAddr _vkGetInstanceProcAddr{nullptr};
    VkPhysicalDevice _vkPhysicalDevice{nullptr};
    VkInstance _vkInstance{nullptr};
    VkDevice _vkDevice{nullptr};
#endif

#if CC_USE_GLES3
    xr::PFNGLES3WLOADPROC _gles3wLoadFuncProc{nullptr};
    gfx::GLES3GPUContext *_gles3GPUContext{nullptr};
#endif
    xr::XRSwapchain _acquireSwapchain;
    std::vector<cc::xr::XRSwapchain> _xrSwapchains;
    bool _renderPaused{false};
    bool _renderResumed{false};
    bool _isXrEntryInstanceValid{false};
    std::unordered_map<void *, xr::XREye> _xrWindowMap;
    std::unordered_map<uint32_t, EGLSurfaceType> _eglSurfaceTypeMap;
    bool _committedFrame{false};
#if CC_USE_XR_REMOTE_PREVIEW
    cc::IntrusivePtr<XRRemotePreviewManager> _xrRemotePreviewManager{nullptr};
#endif
    LegacyThreadPool *_gThreadPool{nullptr};
    bool _isFlipPixelY{false};
    bool _isEnabledEyeRenderJsCallback{false};
};

} // namespace cc
