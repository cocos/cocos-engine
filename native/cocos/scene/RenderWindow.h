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

#pragma once

#include "base/Macros.h"
#include "base/Vector.h"
#include "cocos/base/Optional.h"
#include "renderer/gfx-base/GFXDef-common.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/gfx-base/GFXFramebuffer.h"
#include "renderer/gfx-base/GFXSwapchain.h"
#include "renderer/gfx-base/GFXTexture.h"
#include "scene/Camera.h"

namespace cc {
namespace scene {

struct IRenderWindowInfo {
    cc::optional<std::string> title;
    uint32_t                  width{0};
    uint32_t                  height{0};
    gfx::RenderPassInfo       renderPassInfo;
    gfx::Swapchain *          swapchain{nullptr};
};

/**
 * @en The render window represents the render target, it could be an off screen frame buffer or the on screen buffer.
 * @zh 渲染窗口代表了一个渲染目标，可以是离屏的帧缓冲，也可以是屏幕缓冲
 */
class RenderWindow : public RefCounted {
public:
    RenderWindow()           = default;
    ~RenderWindow() override = default;

    bool initialize(gfx::Device *device, IRenderWindowInfo &info);
    void destroy();

    /**
     * @en Resize window.
     * @zh 重置窗口大小。
     * @param width The new width.
     * @param height The new height.
     */
    void resize(uint32_t width, uint32_t height);

    void extractRenderCameras(std::vector<Camera *> &cameras);

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
    inline gfx::Framebuffer *getFramebuffer() const { return _frameBuffer; }

    inline const std::vector<IntrusivePtr<Camera>> &getCameras() const { return _cameras; }

private:
    uint32_t                          _width{1};
    uint32_t                          _height{1};
    gfx::Swapchain *                  _swapchain{nullptr};
    std::string                       _title;
    IntrusivePtr<gfx::RenderPass>     _renderPass;
    IntrusivePtr<gfx::Texture>        _depthStencilTexture;
    IntrusivePtr<gfx::Framebuffer>    _frameBuffer;
    std::vector<IntrusivePtr<Camera>> _cameras;
    Vector<gfx::Texture *>            _colorTextures;

    CC_DISALLOW_COPY_MOVE_ASSIGN(RenderWindow);
};

} // namespace scene
} // namespace cc
