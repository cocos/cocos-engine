/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include "platform/interfaces/modules/IXRInterface.h"
namespace cc {

class XRInterface : public IXRInterface {
public:
    virtual xr::XRVendor getVendor() override;
    virtual xr::XRConfigValue getXRConfig(xr::XRConfigKey key) override;
    virtual void setXRConfig(xr::XRConfigKey key, xr::XRConfigValue value) override;

    virtual uint32_t getRuntimeVersion() override;
    virtual void initialize(void *javaVM, void *activity) override;

    // render thread lifecycle
    virtual void onRenderPause() override;
    virtual void onRenderResume() override;
    virtual void onRenderDestroy() override;
    // render thread lifecycle

    // gfx
    virtual void preGFXDeviceInitialize(gfx::API gfxApi) override;
    virtual void postGFXDeviceInitialize(gfx::API gfxApi) override;
    virtual const xr::XRSwapchain &doGFXDeviceAcquire(gfx::API gfxApi) override;
    virtual bool isGFXDeviceNeedsPresent(gfx::API gfxApi) override;
    virtual void postGFXDevicePresent(gfx::API gfxApi) override;
    virtual void createXRSwapchains() override;
    virtual const std::vector<cc::xr::XRSwapchain> &getXRSwapchains() override;
    virtual gfx::Format getXRSwapchainFormat() override;
    virtual void updateXRSwapchainTypedID(uint32_t index, uint32_t typedID) override;
    // gfx

    // vulkan
#ifdef CC_USE_VULKAN
    virtual uint32_t getXRVkApiVersion(uint32_t engineVkApiVersion) override;
    virtual void initializeVulkanData(const PFN_vkGetInstanceProcAddr &addr) override;
    virtual VkInstance createXRVulkanInstance(const VkInstanceCreateInfo &instInfo) override;
    virtual VkDevice createXRVulkanDevice(const VkDeviceCreateInfo *deviceInfo) override;
    virtual VkPhysicalDevice getXRVulkanGraphicsDevice() override;
    virtual void getXRSwapchainVkImages(std::vector<VkImage> &vkImages, uint32_t ccSwapchainTypedID) override;
#endif
    // vulkan

    // gles
#ifdef CC_USE_GLES3
    virtual void initializeGLESData(xr::PFNGLES3WLOADPROC gles3wLoadFuncProc, gfx::GLES3GPUContext *gpuContext) override;
    virtual void attachGLESFramebufferTexture2D() override;
    virtual EGLSurfaceType acquireEGLSurfaceType(uint32_t typedID) override;
#endif
    // gles

    // stereo render loop
    virtual bool platformLoopStart() override;
    virtual bool beginRenderFrame() override;
    virtual bool isRenderAllowable() override;
    virtual bool beginRenderEyeFrame(uint32_t eye) override;
    virtual bool endRenderEyeFrame(uint32_t eye) override;
    virtual bool endRenderFrame() override;
    virtual bool platformLoopEnd() override;
    // stereo render loop

    virtual ccstd::vector<float> getHMDViewPosition(uint32_t eye, int trackingType) override;
    virtual ccstd::vector<float> getXRViewProjectionData(uint32_t eye, float near, float far) override;
    // renderwindow
    virtual xr::XREye getXREyeByRenderWindow(void *window) override;
    virtual void bindXREyeWithRenderWindow(void *window, xr::XREye eye) override;

private:
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
    std::unordered_map<void *, xr::XREye> _xrWindowMap;
    std::unordered_map<uint32_t, EGLSurfaceType> _eglSurfaceTypeMap;
    bool _committedFrame{false};
};

} // namespace cc
