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

#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/RefVector.h"
#include "base/std/optional.h"
#include "renderer/gfx-base/GFXDef-common.h"

namespace cc {
namespace scene {
class Camera;

struct IRenderWindowInfo {
    ccstd::optional<ccstd::string> title;
    uint32_t width{0};
    uint32_t height{0};
    gfx::RenderPassInfo renderPassInfo;
    gfx::Swapchain *swapchain{nullptr};
    ccstd::optional<uint32_t> externalResLow{0};                              // for vulkan vkImage/opengl es texture created from external
    ccstd::optional<uint32_t> externalResHigh{0};                             // for vulkan vkImage created from external
    ccstd::optional<gfx::TextureFlags> externalFlag{gfx::TextureFlags::NONE}; // external texture type normal or oes
};

/**
 * @en The render window represents the render target, it could be an off screen frame buffer or the on screen buffer.
 * @zh 渲染窗口代表了一个渲染目标，可以是离屏的帧缓冲，也可以是屏幕缓冲
 */
class RenderWindow : public RefCounted {
public:
    RenderWindow();
    ~RenderWindow() override;

    bool initialize(gfx::Device *device, IRenderWindowInfo &info);
    void destroy();

    /**
     * @en Resize window.
     * @zh 重置窗口大小。
     * @param width The new width.
     * @param height The new height.
     */
    void resize(uint32_t width, uint32_t height);

    void extractRenderCameras(ccstd::vector<Camera *> &cameras);

    void onNativeWindowDestroy(uint32_t windowId);
    void onNativeWindowResume(uint32_t windowId);

    /**
     * @zh
     * 添加渲染相机
     * @param camera 渲染相机
     */
    void attachCamera(Camera *camera);

    /**
     * @zh
     * 移除渲染相机
     * @param camera 相机
     */
    void detachCamera(Camera *camera);

    /**
     * @zh
     * 销毁全部渲染相机
     */
    void clearCameras();

    void sortCameras();

    /**
     * @en Get window width. Pre-rotated (i.e. rotationally invariant, always in identity/portrait mode) if possible.
     * If you want to get oriented size instead, you should use [[Camera.width]] which corresponds to the current screen rotation.
     * @zh 获取窗口宽度。如果支持交换链预变换，返回值将始终处于单位旋转（竖屏）坐标系下。如果需要获取旋转后的尺寸，请使用 [[Camera.width]]。
     */
    inline uint32_t getWidth() const { return _width; }

    /**
     * @en Get window height. Pre-rotated (i.e. rotationally invariant, always in identity/portrait mode) if possible.
     * If you want to get oriented size instead, you should use [[Camera.width]] which corresponds to the current screen rotation.
     * @zh 获取窗口高度。如果支持交换链预变换，返回值将始终处于单位旋转（竖屏）坐标系下。如果需要获取旋转后的尺寸，请使用 [[Camera.height]]。
     */
    inline uint32_t getHeight() const { return _height; }

    /**
     * @en Get the swapchain for this window, if there is one
     * @zh 如果存在的话，获取此窗口的交换链
     */
    inline gfx::Swapchain *getSwapchain() {
        return _swapchain;
    }

    /**
     * @en Get window frame buffer.
     * @zh 帧缓冲对象。
     */
    inline gfx::Framebuffer *getFramebuffer() const { return _frameBuffer.get(); }

    inline const ccstd::vector<IntrusivePtr<Camera>> &getCameras() const { return _cameras; }

    /**
     * @en Get render window Id.
     * Render windowd Id is used to identify the render window in the render pipeline.
     * @zh 获得渲染窗口Id。渲染窗口Id用于在渲染管线中标识渲染窗口。
     */
    inline uint32_t getRenderWindowId() const noexcept { return _renderWindowId; }

    /**
     * @en Get the name of the color attachment.
     * The name is used to identify the color attachment in the render pipeline.
     * @zh 获取颜色附件的名称。用于自定义渲染管线中的资源注册。
     */
    const ccstd::string &getColorName() const noexcept { return _colorName; }

    /**
     * @en Get the name of the depth stencil attachment.
     * The name is used to identify the depth stencil attachment in the render pipeline.
     * @zh 获取深度模板附件的名称。用于自定义渲染管线中的资源注册。
     */
    const ccstd::string &getDepthStencilName() const noexcept { return _depthStencilName; }

    /**
     * @en The render pipeline should handle the resize event properly
     * @zh 渲染管线应该正确处理窗口大小变化事件
     */
    bool isRenderWindowResized() const noexcept { return _isResized; }

    /**
     * @en The render pipeline should set this value to false after handling the resize event
     * @zh 渲染管线应该在处理完窗口大小变化事件后将此值设置为 false
     */
    void setRenderWindowResizeHandled() noexcept { _isResized = false; }

private:
    void generateFrameBuffer();

    uint32_t _width{1};
    uint32_t _height{1};
    gfx::Swapchain *_swapchain{nullptr};
    ccstd::string _title;
    IntrusivePtr<gfx::RenderPass> _renderPass;
    IntrusivePtr<gfx::Texture> _depthStencilTexture;
    IntrusivePtr<gfx::Framebuffer> _frameBuffer;
    ccstd::vector<IntrusivePtr<Camera>> _cameras;
    RefVector<gfx::Texture *> _colorTextures;
    uint32_t _renderWindowId{0};
    bool _isResized{true};
    ccstd::string _colorName;
    ccstd::string _depthStencilName;

    CC_DISALLOW_COPY_MOVE_ASSIGN(RenderWindow);
};

} // namespace scene
} // namespace cc
