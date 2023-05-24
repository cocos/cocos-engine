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

#include <iostream>
#include "base/std/container/array.h"
#include "gfx-base/GFXDef-common.h"
#include "math/Vec2.h"
#include "platform/interfaces/OSInterface.h"
#if CC_USE_VULKAN
    #include "vulkan/vulkan_core.h"
#endif
#include "XRCommon.h"
namespace cc {
// forward declare
namespace gfx {
class GLES3GPUContext;
}
namespace scene {
class Camera;
}

enum class EGLSurfaceType {
    NONE,
    WINDOW,
    PBUFFER
};

/**
 * @en Mainly responsible for the docking work of the engine and the xr library
 * @zh 主要负责引擎与xr库的对接工作
 */
class CC_DLL IXRInterface : public OSInterface {
public:
    /**
     * @en get xr device vendor
     * @zh 获取XR设备品牌
     * @return xr::XRVendor
     */
    virtual xr::XRVendor getVendor() = 0;

    /**
     * @en get xr config parameter
     * @zh 获取XR配置参数
     */
    virtual xr::XRConfigValue getXRConfig(xr::XRConfigKey key) = 0;

    /**
     * @en set xr config parameter
     * @zh 设置XR配置参数
     * @param key
     * @param value
     */
    virtual void setXRConfig(xr::XRConfigKey key, xr::XRConfigValue value) = 0;

    /**
      * @en get XR runtime version
      * @zh 获取XR运行时版本号
      * @return
     */
    virtual uint32_t getRuntimeVersion() = 0;
    /**
     * @en initialize xr runtime envirment
     * @zh 初始化XR运行环境
     * @param javaVM android JVM
     * @param activity android activity
    */
    virtual void initialize(void *javaVM, void *activity) = 0;

    // render thread lifecycle
    /**
     * @en call when render pause
     * @zh 渲染暂停时调用
     */
    virtual void onRenderPause() = 0;
    /**
     * @en call when render resume
     * @zh 渲染恢复时调用
    */
    virtual void onRenderResume() = 0;
    /**
     * @en call when render destroy
     * @zh 渲染结束退出时调用
     */
    virtual void onRenderDestroy() = 0;
    // render thread lifecycle

    // gfx
    /**
     * @en call before gfx device initialize
     * @zh GFX设备初始化前调用
     * @param gfxApi
     */
    virtual void preGFXDeviceInitialize(gfx::API gfxApi) = 0;
    /**
     * @en call after gfx device initialize
     * @zh GFX设备初始化后调用
     * @param gfxApi
     */
    virtual void postGFXDeviceInitialize(gfx::API gfxApi) = 0;
    /**
     * @en call when gfx device acquire
     * @zh GFX设备请求渲染
     * @param gfxApi
     * @return
     */
    virtual const xr::XRSwapchain &doGFXDeviceAcquire(gfx::API gfxApi) = 0;
    /**
     * @en call when gfx device present
     * @zh GFX设备是否需要展示操作
     */
    virtual bool isGFXDeviceNeedsPresent(gfx::API gfxApi) = 0;
    /**
     * @en call after gfx device present
     * @zh GFX设备展示操作执行之后调用
     * @param gfxApi
     */
    virtual void postGFXDevicePresent(gfx::API gfxApi) = 0;
    /**
     * @en call when create gfx device's swapchain
     * @zh 创建GFX交换链时调用
     */
    virtual void createXRSwapchains() = 0;
    /**
     * @en get xr swapchain list
     * @zh 获取XR交换链列表
     * @return
     */
    virtual const std::vector<cc::xr::XRSwapchain> &getXRSwapchains() = 0;
    /**
     * @en get xr swapchain's format
     * @zh 获取XR交换链格式
     * @return
     */
    virtual gfx::Format getXRSwapchainFormat() = 0;
    /**
     * @en bind engine's swapchain with xr swapchain
     * @zh 绑定引擎交换链与XR交换链对应关系
     * @param typedID engine swapchain's type id
     */
    virtual void updateXRSwapchainTypedID(uint32_t typedID) = 0;
    // gfx

    // vulkan
#ifdef CC_USE_VULKAN
    /**
     * @en get the vk version required by XR
     * @zh 获取XR要求的VK版本信息
     * @param engineVkApiVersion engine's vk version
     */
    virtual uint32_t getXRVkApiVersion(uint32_t engineVkApiVersion) = 0;
    /**
     * @en initialize vulkan envirment
     * @zh 初始化vk运行环境
     * @param addr
     */
    virtual void initializeVulkanData(const PFN_vkGetInstanceProcAddr &addr) = 0;
    /**
     * @en create vulkan instance
     * @zh 创建vk实例
     * @param instInfo
     * @return
     */
    virtual VkInstance createXRVulkanInstance(const VkInstanceCreateInfo &instInfo) = 0;
    /**
     * @en create vulkan device
     * @zh 创建vk逻辑设备
     * @param deviceInfo
     * @return
     */
    virtual VkDevice createXRVulkanDevice(const VkDeviceCreateInfo *deviceInfo) = 0;
    /**
     * @en get vulkan physical device
     * @zh 获取vk物理设备
     * @return
     */
    virtual VkPhysicalDevice getXRVulkanGraphicsDevice() = 0;
    /**
     * @en get vkImage list from xrswapchain
     * @zh 获取xr交换链中vkimage列表
     * @param vkImages
     * @param eye
     */
    virtual void getXRSwapchainVkImages(std::vector<VkImage> &vkImages, uint32_t eye) = 0;
#endif
    // vulkan

    // gles3
#ifdef CC_USE_GLES3
    /**
     * @en initialize gles envirment
     * @zh 初始化gles运行环境
     * @param gles3wLoadFuncProc
     * @param gpuContext
     */
    virtual void initializeGLESData(xr::PFNGLES3WLOADPROC gles3wLoadFuncProc, gfx::GLES3GPUContext *gpuContext) = 0;
    /**
     * @en attach current texture id to fbo
     * @zh 绑定当前纹理到帧缓冲区
     */
    virtual void attachGLESFramebufferTexture2D() = 0;
    /**
     * @en acquire EGLSurfaceType by engine swapchain's type id
     * @zh 根据引擎交换链获取对应需要创建的EGLSurface类型
     * @param typedID
     * @return
     */
    virtual EGLSurfaceType acquireEGLSurfaceType(uint32_t typedID) = 0;
#endif
    // gles3

    // stereo render loop
    /**
     * @en call when platform loop start
     * @zh 平台循环开始时调用
     * @return
     */
    virtual bool platformLoopStart() = 0;
    /**
     * @en call when frame render begin
     * @zh 一帧开始时调用
     * @return
     */
    virtual bool beginRenderFrame() = 0;
    /**
     * @en whether the current frame allows rendering
     * @zh 当前帧是否允许渲染
     * @return
     */
    virtual bool isRenderAllowable() = 0;
    /**
     * @en call when single eye render begin
     * @zh 单眼渲染开始时调用
     * @param eye
     * @return
     */
    virtual bool beginRenderEyeFrame(uint32_t eye) = 0;
    /**
     * @en call when single eye render end
     * @zh 单眼渲染结束时调用
     * @param eye
     * @return
     */
    virtual bool endRenderEyeFrame(uint32_t eye) = 0;
    /**
     * @en call when frame render end
     * @zh 一帧结束时调用
     * @return
     */
    virtual bool endRenderFrame() = 0;
    /**
     * @en call when platform loop end
     * @zh 平台循环结束时调用
     * @return
     */
    virtual bool platformLoopEnd() = 0;
    // stereo render loop

    /**
     * @en get hmd view position data
     * @zh 获取hmd双眼位置坐标
     * @param eye
     * @return
     */
    virtual ccstd::vector<float> getHMDViewPosition(uint32_t eye, int trackingType) = 0;

    /**
     * @en get xr view projection data
     * @zh 获取xr双眼投影矩阵数据
     * @param eye
     * @param near
     * @param far
     * @return
     */
    virtual ccstd::vector<float> getXRViewProjectionData(uint32_t eye, float near, float far) = 0;

    /**
     * @en get xr eye's fov
     * @zh 获取xr双眼视场角
     * @param eye
     * @return
     */
    virtual ccstd::vector<float> getXREyeFov(uint32_t eye) = 0;

    // renderwindow
    /**
     * @en get renderwindow's xreye type
     * @zh 获取当前RenderWindow的XREye类型
     * @param window
     * @return
     */
    virtual xr::XREye getXREyeByRenderWindow(void *window) = 0;
    /**
     * @en bind renderwindow with xr eye
     * @zh 建立RenderWindow与XREye的对应关系
     * @param window
     * @param eye
     */
    virtual void bindXREyeWithRenderWindow(void *window, xr::XREye eye) = 0;

    /**
     * @en app's lifecycle callback
     * @zh 应用程序生命周期回调
     * @param appCmd
     */
    virtual void handleAppCommand(int appCmd) = 0;

    /**
     * @en adapt orthographic matrix(projection and view)
     * @zh 适配正交相机
     * @param camera
     * @param preTransform
     * @param proj
     * @param view
     */
    virtual void adaptOrthographicMatrix(cc::scene::Camera *camera, const ccstd::array<float, 4> &preTransform, Mat4 &proj, Mat4 &view) = 0;
};
} // namespace cc
