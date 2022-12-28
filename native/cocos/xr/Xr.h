/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#ifndef H_XR_H
#define H_XR_H

#include <functional>
#include <vector>
#include "XRCommon.h"

#ifndef XR_USE_GRAPHICS_API_OPENGL_ES
    #define XR_USE_GRAPHICS_API_OPENGL_ES 1
#endif

#ifdef XR_USE_GRAPHICS_API_VULKAN
    #include "vulkan/vulkan_core.h"
#endif

namespace cc {
namespace xr {

class XrEntry {
public:
    static XrEntry *getInstance();
    static void destroyInstance();

    virtual void initPlatformData(void *javaVM, void *activity) = 0;

    virtual void createXrInstance(const char *graphicsName) = 0;

    virtual void pauseXrInstance() = 0;

    virtual void resumeXrInstance() = 0;

    virtual void destroyXrInstance() = 0;

    virtual int getXrViewCount() = 0;

    virtual void initXrSwapchains() = 0;

    virtual bool isCreatedXrInstance() = 0;

#ifdef XR_USE_GRAPHICS_API_VULKAN
    virtual uint32_t getXrVkApiVersion(uint32_t defaultApiVersion) = 0;

    virtual void initXrSession(VkInstance vkInstance, VkPhysicalDevice vkPhyDevice, VkDevice vkDevice, uint32_t familyIndex) = 0;

    virtual void getSwapchainImages(std::vector<VkImage> &vkImages, uint32_t eye) = 0;

    virtual VkInstance xrVkCreateInstance(const VkInstanceCreateInfo &instInfo, const PFN_vkGetInstanceProcAddr &addr) = 0;

    virtual VkPhysicalDevice getXrVkGraphicsDevice(const VkInstance &vkInstance) = 0;

    virtual VkResult xrVkCreateDevice(const VkDeviceCreateInfo *deviceInfo, const PFN_vkGetInstanceProcAddr &addr, const VkPhysicalDevice &vkPhysicalDevice, VkDevice *vkDevice) = 0;
#endif

#ifdef XR_USE_GRAPHICS_API_OPENGL_ES
    virtual void initXrSession(PFNGLES3WLOADPROC gles3wLoadFuncProc, void *eglDisplay, void *eglConfig, void *eglDefaultContext) = 0;

    virtual void setXrFrameBuffer(unsigned int fbo) = 0;

    virtual unsigned int getXrFrameBuffer() = 0;

    virtual void attachXrFramebufferTexture2D() = 0;
#endif

    virtual std::vector<XRSwapchain> &getCocosXrSwapchains() = 0;

    virtual const XRSwapchain getCurrentXrSwapchain() = 0;

    virtual const xr::XRSwapchain &acquireXrSwapchain(uint32_t gfxApi) = 0;

    virtual bool isSessionRunning() = 0;

    virtual bool frameStart() = 0;

    virtual void renderLoopStart(int eye) = 0;

    virtual void renderLoopEnd(int eye) = 0;

    virtual void frameEnd() = 0;

    virtual bool isRenderAllowable() = 0;

    virtual void setGamepadCallback(const cc::xr::XRControllerCallback &xrControllerCallback) = 0;

    virtual void setHandleCallback(const cc::xr::XRControllerCallback &xrControllerCallback) = 0;

    virtual void setHMDCallback(const cc::xr::XRControllerCallback &xrControllerCallback) = 0;

    virtual void setXRConfigCallback(const cc::xr::XRConfigChangeCallback &xrConfigChangeCallback) = 0;

    virtual std::vector<float> computeViewProjection(uint32_t index, float nearZ, float farZ, float scaleF) = 0;

    virtual std::vector<float> getEyeFov(uint32_t eye) = 0;

    virtual uint32_t getSwapchainImageIndex() = 0;

    virtual void setMultisamplesRTT(int num) = 0;

    virtual void setRenderingScale(float scale) = 0;

    virtual void setIPDOffset(float offset) = 0;

    virtual void setBaseSpaceType(int type) = 0;

    virtual std::vector<float> getHMDViewPosition(uint32_t index, int trackingType) = 0;

    virtual bool platformLoopStart() = 0;

    virtual bool platformLoopEnd() = 0;

    virtual XRConfigValue getXRConfig(XRConfigKey key) = 0;

    virtual void setXRConfig(XRConfigKey key, XRConfigValue value) = 0;

    virtual void waitFrame() = 0;

    virtual void setXRIntConfig(int key, int value) = 0;

    virtual void setXRBoolConfig(int key, bool value) = 0;

    virtual void setXRFloatConfig(int key, float value) = 0;

    virtual void setXRStringConfig(int key, std::string value) = 0;

    virtual void setXRPointerConfig(int key, void *value) = 0;

    virtual int getXRIntConfig(int key) = 0;

    virtual bool getXRBoolConfig(int key) = 0;

    virtual float getXRFloatConfig(int key) = 0;

    virtual std::string getXRStringConfig(int key) = 0;

    virtual void *getXRPointerConfig(int key) = 0;

    virtual void getXrPose(cc::xr::XRPose &leftEyePose,
                           cc::xr::XRPose &rightEyePose,
                           cc::xr::XRPose &leftControllerPose,
                           cc::xr::XRPose &rightControllerPose) = 0;
};

} // namespace xr
} // namespace cc

#endif // H_XR_H
