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

#include "VKStd.h"

#include "VKCommands.h"
#include "VKDevice.h"
#include "VKGPUObjects.h"
#include "VKQueue.h"
#include "VKRenderPass.h"
#include "VKSwapchain.h"
#include "VKTexture.h"
#include "VKUtils.h"

namespace cc {
namespace gfx {

CCVKSwapchain::CCVKSwapchain() {
    _typedID            = generateObjectID<decltype(this)>();
    _preRotationEnabled = ENABLE_PRE_ROTATION;
}

CCVKSwapchain::~CCVKSwapchain() {
    destroy();
}

void CCVKSwapchain::doInit(const SwapchainInfo &info) {
    auto *      gpuDevice  = CCVKDevice::getInstance()->gpuDevice();
    const auto *gpuContext = CCVKDevice::getInstance()->gpuContext();
    _gpuSwapchain          = CC_NEW(CCVKGPUSwapchain);
    gpuDevice->swapchains.insert(_gpuSwapchain);

    createVkSurface();

    ///////////////////// Parameter Selection /////////////////////

    uint32_t queueFamilyPropertiesCount = utils::toUint(gpuContext->queueFamilyProperties.size());
    _gpuSwapchain->queueFamilyPresentables.resize(queueFamilyPropertiesCount);
    for (uint32_t propertyIndex = 0U; propertyIndex < queueFamilyPropertiesCount; propertyIndex++) {
        vkGetPhysicalDeviceSurfaceSupportKHR(gpuContext->physicalDevice, propertyIndex,
                                             _gpuSwapchain->vkSurface, &_gpuSwapchain->queueFamilyPresentables[propertyIndex]);
    }

    // find other possible queues if not presentable
    auto *queue = static_cast<CCVKQueue *>(CCVKDevice::getInstance()->getQueue());
    if (!_gpuSwapchain->queueFamilyPresentables[queue->gpuQueue()->queueFamilyIndex]) {
        auto &indices = queue->gpuQueue()->possibleQueueFamilyIndices;
        indices.erase(std::remove_if(indices.begin(), indices.end(), [this](uint32_t i) {
                          return !_gpuSwapchain->queueFamilyPresentables[i];
                      }),
                      indices.end());
        CCASSERT(!_gpuSwapchain->queueFamilyPresentables.empty(), "no presentable queue found!");
        cmdFuncCCVKGetDeviceQueue(CCVKDevice::getInstance(), queue->gpuQueue());
    }

    Format colorFmt        = Format::BGRA8;
    Format depthStencilFmt = Format::DEPTH_STENCIL;

    VkSurfaceCapabilitiesKHR surfaceCapabilities{};
    vkGetPhysicalDeviceSurfaceCapabilitiesKHR(gpuContext->physicalDevice, _gpuSwapchain->vkSurface, &surfaceCapabilities);

    uint32_t surfaceFormatCount = 0U;
    VK_CHECK(vkGetPhysicalDeviceSurfaceFormatsKHR(gpuContext->physicalDevice, _gpuSwapchain->vkSurface, &surfaceFormatCount, nullptr));
    vector<VkSurfaceFormatKHR> surfaceFormats(surfaceFormatCount);
    VK_CHECK(vkGetPhysicalDeviceSurfaceFormatsKHR(gpuContext->physicalDevice, _gpuSwapchain->vkSurface, &surfaceFormatCount, surfaceFormats.data()));

    uint32_t presentModeCount = 0U;
    VK_CHECK(vkGetPhysicalDeviceSurfacePresentModesKHR(gpuContext->physicalDevice, _gpuSwapchain->vkSurface, &presentModeCount, nullptr));
    vector<VkPresentModeKHR> presentModes(presentModeCount);
    VK_CHECK(vkGetPhysicalDeviceSurfacePresentModesKHR(gpuContext->physicalDevice, _gpuSwapchain->vkSurface, &presentModeCount, presentModes.data()));

    VkFormat        colorFormat = VK_FORMAT_B8G8R8A8_UNORM;
    VkColorSpaceKHR colorSpace  = VK_COLOR_SPACE_SRGB_NONLINEAR_KHR;
    // If the surface format list only includes one entry with VK_FORMAT_UNDEFINED,
    // there is no preferred format, so we assume VK_FORMAT_B8G8R8A8_UNORM
    if ((surfaceFormatCount == 1) && (surfaceFormats[0].format == VK_FORMAT_UNDEFINED)) {
        colorFormat = VK_FORMAT_B8G8R8A8_UNORM;
        colorSpace  = surfaceFormats[0].colorSpace;
    } else {
        // iterate over the list of available surface format and
        // check for the presence of VK_FORMAT_B8G8R8A8_UNORM
        bool imageFormatFound = false;
        for (VkSurfaceFormatKHR &surfaceFormat : surfaceFormats) {
            if (surfaceFormat.format == VK_FORMAT_B8G8R8A8_UNORM) {
                colorFormat      = surfaceFormat.format;
                colorSpace       = surfaceFormat.colorSpace;
                imageFormatFound = true;
                break;
            }
        }

        // in case VK_FORMAT_B8G8R8A8_UNORM is not available
        // select the first available color format
        if (!imageFormatFound) {
            colorFormat = surfaceFormats[0].format;
            colorSpace  = surfaceFormats[0].colorSpace;
            switch (colorFormat) {
                case VK_FORMAT_R8G8B8A8_UNORM: colorFmt = Format::RGBA8; break;
                case VK_FORMAT_R8G8B8A8_SRGB: colorFmt = Format::SRGB8_A8; break;
                case VK_FORMAT_R5G6B5_UNORM_PACK16: colorFmt = Format::R5G6B5; break;
                default: CCASSERT(0, "assumption broken: new default surface format"); break;
            }
        }
    }

    // Select a present mode for the swapchain

    vector<VkPresentModeKHR> presentModePriorityList;

    switch (_vsyncMode) {
        case VsyncMode::OFF: presentModePriorityList.insert(presentModePriorityList.end(), {VK_PRESENT_MODE_IMMEDIATE_KHR, VK_PRESENT_MODE_FIFO_KHR}); break;
        case VsyncMode::ON: presentModePriorityList.insert(presentModePriorityList.end(), {VK_PRESENT_MODE_FIFO_KHR}); break;
        case VsyncMode::RELAXED: presentModePriorityList.insert(presentModePriorityList.end(), {VK_PRESENT_MODE_FIFO_RELAXED_KHR, VK_PRESENT_MODE_FIFO_KHR}); break;
        case VsyncMode::MAILBOX: presentModePriorityList.insert(presentModePriorityList.end(), {VK_PRESENT_MODE_MAILBOX_KHR, VK_PRESENT_MODE_FIFO_KHR}); break;
        case VsyncMode::HALF: presentModePriorityList.insert(presentModePriorityList.end(), {VK_PRESENT_MODE_FIFO_KHR}); break; // no easy fallback
    }

    VkPresentModeKHR swapchainPresentMode = VK_PRESENT_MODE_FIFO_KHR;

    // UNASSIGNED-BestPractices-vkCreateSwapchainKHR-swapchain-presentmode-not-fifo
#if !defined(VK_USE_PLATFORM_ANDROID_KHR)
    for (VkPresentModeKHR presentMode : presentModePriorityList) {
        if (std::find(presentModes.begin(), presentModes.end(), presentMode) != presentModes.end()) {
            swapchainPresentMode = presentMode;
            break;
        }
    }
#endif

    // Determine the number of images
    // for now we assume triple buffer is universal
    uint32_t desiredNumberOfSwapchainImages = gpuDevice->backBufferCount;
    CCASSERT(desiredNumberOfSwapchainImages <= surfaceCapabilities.maxImageCount &&
                 desiredNumberOfSwapchainImages >= surfaceCapabilities.minImageCount,
             "Swapchain image count assumption broken");

    VkExtent2D                    imageExtent  = {1U, 1U};
    VkSurfaceTransformFlagBitsKHR preTransform = VK_SURFACE_TRANSFORM_IDENTITY_BIT_KHR;

    // Find a supported composite alpha format (not all devices support alpha opaque)
    VkCompositeAlphaFlagBitsKHR compositeAlpha = VK_COMPOSITE_ALPHA_OPAQUE_BIT_KHR;
    // Simply select the first composite alpha format available
    vector<VkCompositeAlphaFlagBitsKHR> compositeAlphaFlags = {
        VK_COMPOSITE_ALPHA_OPAQUE_BIT_KHR,
        VK_COMPOSITE_ALPHA_PRE_MULTIPLIED_BIT_KHR,
        VK_COMPOSITE_ALPHA_POST_MULTIPLIED_BIT_KHR,
        VK_COMPOSITE_ALPHA_INHERIT_BIT_KHR,
    };
    for (VkCompositeAlphaFlagBitsKHR compositeAlphaFlag : compositeAlphaFlags) {
        if (surfaceCapabilities.supportedCompositeAlpha & compositeAlphaFlag) {
            compositeAlpha = compositeAlphaFlag;
            break;
        };
    }
    VkImageUsageFlags imageUsage = VK_IMAGE_USAGE_COLOR_ATTACHMENT_BIT;
    // Enable transfer source on swap chain images if supported
    if (surfaceCapabilities.supportedUsageFlags & VK_IMAGE_USAGE_TRANSFER_SRC_BIT) {
        imageUsage |= VK_IMAGE_USAGE_TRANSFER_SRC_BIT;
    }

    // Enable transfer destination on swap chain images if supported
    if (surfaceCapabilities.supportedUsageFlags & VK_IMAGE_USAGE_TRANSFER_DST_BIT) {
        imageUsage |= VK_IMAGE_USAGE_TRANSFER_DST_BIT;
    }

    _gpuSwapchain->createInfo.surface          = _gpuSwapchain->vkSurface;
    _gpuSwapchain->createInfo.minImageCount    = desiredNumberOfSwapchainImages;
    _gpuSwapchain->createInfo.imageFormat      = colorFormat;
    _gpuSwapchain->createInfo.imageColorSpace  = colorSpace;
    _gpuSwapchain->createInfo.imageExtent      = imageExtent;
    _gpuSwapchain->createInfo.imageUsage       = imageUsage;
    _gpuSwapchain->createInfo.imageArrayLayers = 1;
    _gpuSwapchain->createInfo.preTransform     = preTransform;
    _gpuSwapchain->createInfo.compositeAlpha   = compositeAlpha;
    _gpuSwapchain->createInfo.presentMode      = swapchainPresentMode;
    _gpuSwapchain->createInfo.clipped          = VK_TRUE; // Setting clipped to VK_TRUE allows the implementation to discard rendering outside of the surface area

    ///////////////////// Texture Creation /////////////////////

    _colorTexture        = CC_NEW(CCVKTexture);
    _depthStencilTexture = CC_NEW(CCVKTexture);

    SwapchainTextureInfo textureInfo;
    textureInfo.swapchain = this;
    textureInfo.format    = colorFmt;
    textureInfo.width     = info.width;
    textureInfo.height    = info.height;
    initTexture(textureInfo, _colorTexture);

    textureInfo.format = depthStencilFmt;
    initTexture(textureInfo, _depthStencilTexture);

    checkSwapchainStatus();
}

void CCVKSwapchain::doDestroy() {
    if (!_gpuSwapchain) return;

    CCVKDevice::getInstance()->waitAllFences();

    CC_SAFE_DESTROY(_depthStencilTexture)
    CC_SAFE_DESTROY(_colorTexture)

    auto *      gpuDevice  = CCVKDevice::getInstance()->gpuDevice();
    const auto *gpuContext = CCVKDevice::getInstance()->gpuContext();

    destroySwapchain(gpuDevice);

    if (_gpuSwapchain->vkSurface != VK_NULL_HANDLE) {
        vkDestroySurfaceKHR(gpuContext->vkInstance, _gpuSwapchain->vkSurface, nullptr);
        _gpuSwapchain->vkSurface = VK_NULL_HANDLE;
    }

    gpuDevice->swapchains.erase(_gpuSwapchain);
    CC_SAFE_DELETE(_gpuSwapchain)
}

void CCVKSwapchain::doResize(uint32_t width, uint32_t height, SurfaceTransform transform) {
    checkSwapchainStatus(width, height);

    // If these assertions are hit that almost always means something is wrong with the
    // resize event dispatch logic instead of the resize implementation executed above.
    if (ENABLE_PRE_ROTATION && toNumber(transform) & 1) std::swap(width, height);
    CCASSERT(getWidth() == width && getHeight() == height, "Wrong input size");
    CCASSERT(_transform == transform, "Wrong surface transformation");
}

bool CCVKSwapchain::checkSwapchainStatus(uint32_t width, uint32_t height) {
    auto *      gpuDevice  = CCVKDevice::getInstance()->gpuDevice();
    const auto *gpuContext = CCVKDevice::getInstance()->gpuContext();

    VkSurfaceCapabilitiesKHR surfaceCapabilities;
    VK_CHECK(vkGetPhysicalDeviceSurfaceCapabilitiesKHR(gpuContext->physicalDevice, _gpuSwapchain->vkSurface, &surfaceCapabilities));

    // surfaceCapabilities.currentExtent seems to remain the same
    // during any size/orientation change events on android devices
    // so we prefer the system input (oriented size) here
    uint32_t newWidth  = width ? width : surfaceCapabilities.currentExtent.width;
    uint32_t newHeight = height ? height : surfaceCapabilities.currentExtent.height;

    VkSurfaceTransformFlagBitsKHR preTransform = surfaceCapabilities.currentTransform;
    if (ENABLE_PRE_ROTATION) {
        if (preTransform & TRANSFORMS_THAT_REQUIRE_FLIPPING) {
            std::swap(newWidth, newHeight);
        }
    } else {
        preTransform = VK_SURFACE_TRANSFORM_IDENTITY_BIT_KHR;
    }

    if (_gpuSwapchain->createInfo.preTransform == preTransform &&
        _gpuSwapchain->createInfo.imageExtent.width == newWidth &&
        _gpuSwapchain->createInfo.imageExtent.height == newHeight && _gpuSwapchain->lastPresentResult == VK_SUCCESS) {
        return true;
    }

    if (newWidth == static_cast<uint32_t>(-1)) {
        _gpuSwapchain->createInfo.imageExtent.width  = _colorTexture->getWidth();
        _gpuSwapchain->createInfo.imageExtent.height = _colorTexture->getHeight();
    } else {
        _gpuSwapchain->createInfo.imageExtent.width  = newWidth;
        _gpuSwapchain->createInfo.imageExtent.height = newHeight;
    }

    if (newWidth == 0 || newHeight == 0) {
        _gpuSwapchain->lastPresentResult = VK_NOT_READY;
        return false;
    }

    _transform                             = mapSurfaceTransform(preTransform);
    _gpuSwapchain->createInfo.preTransform = preTransform;
    _gpuSwapchain->createInfo.surface      = _gpuSwapchain->vkSurface;
    _gpuSwapchain->createInfo.oldSwapchain = _gpuSwapchain->vkSwapchain;

    CC_LOG_INFO("Resizing surface: %dx%d, surface rotation: %d degrees", newWidth, newHeight, (uint32_t)_transform * 90);

    CCVKDevice::getInstance()->waitAllFences();

    VkSwapchainKHR vkSwapchain = VK_NULL_HANDLE;
    VK_CHECK(vkCreateSwapchainKHR(gpuDevice->vkDevice, &_gpuSwapchain->createInfo, nullptr, &vkSwapchain));

    destroySwapchain(gpuDevice);

    gpuDevice->curBackBufferIndex = 0;
    _gpuSwapchain->curImageIndex  = 0;
    _gpuSwapchain->vkSwapchain    = vkSwapchain;

    uint32_t imageCount;
    VK_CHECK(vkGetSwapchainImagesKHR(gpuDevice->vkDevice, _gpuSwapchain->vkSwapchain, &imageCount, nullptr));
    _gpuSwapchain->swapchainImages.resize(imageCount);
    VK_CHECK(vkGetSwapchainImagesKHR(gpuDevice->vkDevice, _gpuSwapchain->vkSwapchain, &imageCount, _gpuSwapchain->swapchainImages.data()));

    CCASSERT(imageCount == _gpuSwapchain->createInfo.minImageCount, "swapchain image count assumption is broken");

    // should skip size check, since the old swapchain has already been destroyed
    static_cast<CCVKTexture *>(_colorTexture)->_info.width        = 1;
    static_cast<CCVKTexture *>(_depthStencilTexture)->_info.width = 1;
    _colorTexture->resize(newWidth, newHeight);
    _depthStencilTexture->resize(newWidth, newHeight);

    bool                         hasStencil = GFX_FORMAT_INFOS[toNumber(_depthStencilTexture->getFormat())].hasStencil;
    vector<VkImageMemoryBarrier> barriers(imageCount * 2, VkImageMemoryBarrier{});
    VkPipelineStageFlags         srcStageMask = VK_PIPELINE_STAGE_TOP_OF_PIPE_BIT;
    VkPipelineStageFlags         dstStageMask = VK_PIPELINE_STAGE_BOTTOM_OF_PIPE_BIT;
    ThsvsImageBarrier            tempBarrier{};
    tempBarrier.srcQueueFamilyIndex             = VK_QUEUE_FAMILY_IGNORED;
    tempBarrier.dstQueueFamilyIndex             = VK_QUEUE_FAMILY_IGNORED;
    tempBarrier.subresourceRange.levelCount     = VK_REMAINING_MIP_LEVELS;
    tempBarrier.subresourceRange.layerCount     = VK_REMAINING_ARRAY_LAYERS;
    VkPipelineStageFlags tempSrcStageMask       = 0;
    VkPipelineStageFlags tempDstStageMask       = 0;
    auto *               colorGPUTexture        = static_cast<CCVKTexture *>(_colorTexture)->gpuTexture();
    auto *               depthStencilGPUTexture = static_cast<CCVKTexture *>(_depthStencilTexture)->gpuTexture();
    for (uint32_t i = 0U; i < imageCount; i++) {
        tempBarrier.nextAccessCount             = 1;
        tempBarrier.pNextAccesses               = &THSVS_ACCESS_TYPES[toNumber(AccessType::PRESENT)];
        tempBarrier.image                       = _gpuSwapchain->swapchainImages[i];
        tempBarrier.subresourceRange.aspectMask = VK_IMAGE_ASPECT_COLOR_BIT;
        thsvsGetVulkanImageMemoryBarrier(tempBarrier, &tempSrcStageMask, &tempDstStageMask, &barriers[i]);
        srcStageMask |= tempSrcStageMask;
        dstStageMask |= tempDstStageMask;

        tempBarrier.nextAccessCount             = 1;
        tempBarrier.pNextAccesses               = &THSVS_ACCESS_TYPES[toNumber(AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE)];
        tempBarrier.image                       = depthStencilGPUTexture->swapchainVkImages[i];
        tempBarrier.subresourceRange.aspectMask = hasStencil ? VK_IMAGE_ASPECT_DEPTH_BIT | VK_IMAGE_ASPECT_STENCIL_BIT : VK_IMAGE_ASPECT_DEPTH_BIT;
        thsvsGetVulkanImageMemoryBarrier(tempBarrier, &tempSrcStageMask, &tempDstStageMask, &barriers[imageCount + i]);
        srcStageMask |= tempSrcStageMask;
        dstStageMask |= tempDstStageMask;
    }
    CCVKDevice::getInstance()->gpuTransportHub()->checkIn(
        [&](const CCVKGPUCommandBuffer *gpuCommandBuffer) {
            vkCmdPipelineBarrier(gpuCommandBuffer->vkCommandBuffer, srcStageMask, dstStageMask, 0, 0, nullptr, 0, nullptr, imageCount, barriers.data());
        },
        true); // submit immediately

    colorGPUTexture->currentAccessTypes.assign(1, THSVS_ACCESS_PRESENT);
    depthStencilGPUTexture->currentAccessTypes.assign(1, THSVS_ACCESS_DEPTH_STENCIL_ATTACHMENT_READ);

    for (auto &it : _gpuSwapchain->vkSwapchainFramebufferListMap) {
        cmdFuncCCVKCreateFramebuffer(CCVKDevice::getInstance(), it.first);
    }

    _gpuSwapchain->lastPresentResult = VK_SUCCESS;

    return true;
}

void CCVKSwapchain::destroySwapchain(const CCVKGPUDevice *gpuDevice) {
    if (_gpuSwapchain->vkSwapchain != VK_NULL_HANDLE) {
        for (auto &it : _gpuSwapchain->vkSwapchainFramebufferListMap) {
            FramebufferList &list = it.second;
            for (VkFramebuffer framebuffer : list) {
                vkDestroyFramebuffer(gpuDevice->vkDevice, framebuffer, nullptr);
            }
            list.clear();
        }

        _gpuSwapchain->swapchainImages.clear();

        vkDestroySwapchainKHR(gpuDevice->vkDevice, _gpuSwapchain->vkSwapchain, nullptr);
        _gpuSwapchain->vkSwapchain = VK_NULL_HANDLE;
    }
}

void CCVKSwapchain::doDestroySurface() {
    if (!_gpuSwapchain || _gpuSwapchain->vkSurface == VK_NULL_HANDLE) return;
    const auto *gpuDevice  = CCVKDevice::getInstance()->gpuDevice();
    const auto *gpuContext = CCVKDevice::getInstance()->gpuContext();

    CCVKDevice::getInstance()->waitAllFences();
    destroySwapchain(gpuDevice);
    _gpuSwapchain->lastPresentResult = VK_NOT_READY;

    vkDestroySurfaceKHR(gpuContext->vkInstance, _gpuSwapchain->vkSurface, nullptr);
    _gpuSwapchain->vkSurface = VK_NULL_HANDLE;
}

void CCVKSwapchain::doCreateSurface(void * /*windowHandle*/) {
    if (!_gpuSwapchain || _gpuSwapchain->vkSurface != VK_NULL_HANDLE) return;
    createVkSurface();
    checkSwapchainStatus();
}

void CCVKSwapchain::createVkSurface() {
    const auto *gpuContext = CCVKDevice::getInstance()->gpuContext();

#if defined(VK_USE_PLATFORM_ANDROID_KHR)
    VkAndroidSurfaceCreateInfoKHR surfaceCreateInfo{VK_STRUCTURE_TYPE_ANDROID_SURFACE_CREATE_INFO_KHR};
    surfaceCreateInfo.window = reinterpret_cast<ANativeWindow *>(_windowHandle);
    VK_CHECK(vkCreateAndroidSurfaceKHR(gpuContext->vkInstance, &surfaceCreateInfo, nullptr, &_gpuSwapchain->vkSurface));
#elif defined(VK_USE_PLATFORM_WIN32_KHR)
    VkWin32SurfaceCreateInfoKHR surfaceCreateInfo{VK_STRUCTURE_TYPE_WIN32_SURFACE_CREATE_INFO_KHR};
    surfaceCreateInfo.hinstance = static_cast<HINSTANCE>(GetModuleHandle(0));
    surfaceCreateInfo.hwnd      = reinterpret_cast<HWND>(_windowHandle);
    VK_CHECK(vkCreateWin32SurfaceKHR(gpuContext->vkInstance, &surfaceCreateInfo, nullptr, &_gpuSwapchain->vkSurface));
#elif defined(VK_USE_PLATFORM_METAL_EXT)
    VkMetalSurfaceCreateInfoEXT surfaceCreateInfo{VK_STRUCTURE_TYPE_METAL_SURFACE_CREATE_INFO_EXT};
    surfaceCreateInfo.pLayer = reinterpret_cast<CAMetalLayer *>(_windowHandle);
    VK_CHECK(vkCreateMetalSurfaceEXT(gpuContext->vkInstance, &surfaceCreateInfo, nullptr, &_gpuSwapchain->vkSurface));
#elif defined(VK_USE_PLATFORM_WAYLAND_KHR)
    VkWaylandSurfaceCreateInfoKHR surfaceCreateInfo{VK_STRUCTURE_TYPE_WAYLAND_SURFACE_CREATE_INFO_KHR};
    surfaceCreateInfo.display = nullptr; // TODO
    surfaceCreateInfo.surface = reinterpret_cast<wl_surface *>(_windowHandle);
    VK_CHECK(vkCreateWaylandSurfaceKHR(gpuContext->vkInstance, &surfaceCreateInfo, nullptr, &_gpuSwapchain->vkSurface));
#elif defined(VK_USE_PLATFORM_XCB_KHR)
    VkXcbSurfaceCreateInfoKHR surfaceCreateInfo{VK_STRUCTURE_TYPE_XCB_SURFACE_CREATE_INFO_KHR};
    surfaceCreateInfo.connection = nullptr; // TODO
    surfaceCreateInfo.window     = reinterpret_cast<uint64_t>(_windowHandle);
    VK_CHECK(vkCreateXcbSurfaceKHR(gpuContext->vkInstance, &surfaceCreateInfo, nullptr, &_gpuSwapchain->vkSurface));
#else
    #pragma error Platform not supported
#endif
}

} // namespace gfx
} // namespace cc
