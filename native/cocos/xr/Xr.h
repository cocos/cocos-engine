/****************************************************************************
 Xiamen Yaji Software Co., Ltd., (the ¡°Licensor¡±) grants the user (the ¡°Licensee¡±) non-exclusive and non-transferable rights to use the software according to the following conditions:
 a.  The Licensee shall pay royalties to the Licensor, and the amount of those royalties and the payment method are subject to separate negotiations between the parties.
 b.  The software is licensed for use rather than sold, and the Licensor reserves all rights over the software that are not expressly granted (whether by implication, reservation or prohibition).
 c.  The open source codes contained in the software are subject to the MIT Open Source Licensing Agreement (see the attached for the details);
 d.  The Licensee acknowledges and consents to the possibility that errors may occur during the operation of the software for one or more technical reasons, and the Licensee shall take precautions and prepare remedies for such events. In such circumstance, the Licensor shall provide software patches or updates according to the agreement between the two parties. The    Licensor will not assume any liability beyond the explicit wording of this  Licensing Agreement.
 e.  Where the Licensor must assume liability for the software according to relevant laws, the Licensor¡¯s entire liability is limited to the annual royalty payable by the Licensee.
 f.  The Licensor owns the portions listed in the root directory and subdirectory (if any) in the software and enjoys the intellectual property rights over those portions. As for the portions owned by the Licensor, the Licensee shall not:
     i.  Bypass or avoid any relevant technical protection measures in the products or services;
     ii. Release the source codes to any other parties;
     iii.Disassemble, decompile, decipher, attack, emulate, exploit or reverse-engineer these portion of code;
     iv. Apply it to any third-party products or services without Licensor¡¯s permission;
     v.  Publish, copy, rent, lease, sell, export, import, distribute or lend any products containing these portions of code;
     vi. Allow others to use any services relevant to the technology of these codes; and
     vii.Conduct any other act beyond the scope of this Licensing Agreement.
 g.  This Licensing Agreement terminates immediately if the Licensee breaches this Agreement. The Licensor may claim compensation from the Licensee where the Licensee¡¯s breach causes any damage to the Licensor.
 h.  The laws of the People's Republic of China apply to this Licensing Agreement.
 i.  This Agreement is made in both Chinese and English, and the Chinese version shall prevail the event of conflict.
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
