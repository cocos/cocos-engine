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

#include "scene/RenderWindow.h"
#include "scene/Camera.h"
#include "platform/interfaces/modules/Device.h"

namespace cc {
namespace scene {

namespace {

const std::unordered_map<IScreen::Orientation, gfx::SurfaceTransform> orientationMap {
    { IScreen::Orientation::PORTRAIT, gfx::SurfaceTransform::IDENTITY },
    { IScreen::Orientation::LANDSCAPE_RIGHT, gfx::SurfaceTransform::ROTATE_90 },
    { IScreen::Orientation::PORTRAIT_UPSIDE_DOWN, gfx::SurfaceTransform::ROTATE_180 },
    { IScreen::Orientation::LANDSCAPE_LEFT, gfx::SurfaceTransform::ROTATE_270 },
};

}

bool RenderWindow::initialize(gfx::Device *device, IRenderWindowInfo &info) {
    if (info.title.has_value() && !info.title.value().empty()) {
        _title = info.title.value();
    }

    if (info.swapchain != nullptr) {
        _swapchain = info.swapchain;
    }

    _width  = info.width;
    _height = info.height;

    _renderPass = device->createRenderPass(info.renderPassInfo);

    if (info.swapchain != nullptr) {
        _swapchain = info.swapchain;
        _colorTextures.pushBack(info.swapchain->getColorTexture());
        _depthStencilTexture = info.swapchain->getDepthStencilTexture();
    } else {
        for (auto &colorAttachment : info.renderPassInfo.colorAttachments) {
            _colorTextures.pushBack(
                device->createTexture({gfx::TextureType::TEX2D,
                                       gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_SRC,
                                       colorAttachment.format,
                                       _width,
                                       _height}));
        }
    }

    // Use the sign bit to indicate depth attachment
    if (info.renderPassInfo.depthStencilAttachment.format != gfx::Format::UNKNOWN) {
        _depthStencilTexture = device->createTexture({gfx::TextureType::TEX2D,
                                                      gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
                                                      info.renderPassInfo.depthStencilAttachment.format,
                                                      _width,
                                                      _height});
    }

    _frameBuffer = device->createFramebuffer(gfx::FramebufferInfo{
        _renderPass,
        _colorTextures.get(),
        _depthStencilTexture});
    return true;
}

void RenderWindow::destroy() {
    clearCameras();

    CC_SAFE_DESTROY_NULL(_frameBuffer);

    CC_SAFE_DESTROY_NULL(_depthStencilTexture);

    for (auto *colorTexture : _colorTextures) {
        CC_SAFE_DESTROY(colorTexture);
    }
    _colorTextures.clear();
}

void RenderWindow::resize(uint32_t width, uint32_t height) {
    if (_swapchain != nullptr) {
        _swapchain->resize(width, height, orientationMap.at(Device::getDeviceOrientation()));
        _width  = _swapchain->getWidth();
        _height = _swapchain->getHeight();
    } else {
        for (auto *colorTexture : _colorTextures) {
            colorTexture->resize(width, height);
        }
        if (_depthStencilTexture != nullptr) {
            _depthStencilTexture->resize(width, height);
        }
        _width  = width;
        _height = height;
    }

    if (_frameBuffer != nullptr) {
        _frameBuffer->destroy();
        _frameBuffer->initialize({
            _renderPass,
            _colorTextures.get(),
            _depthStencilTexture,
        });
    }

    for (Camera *camera : _cameras) {
        camera->resize(width, height);
    }
}

void RenderWindow::extractRenderCameras(std::vector<Camera *> &cameras) {
    for (Camera *camera : _cameras) {
        if (camera->isEnabled()) {
            camera->update();
            cameras.emplace_back(camera);
        }
    }
}

void RenderWindow::attachCamera(Camera *camera) {
    for (Camera *cam : _cameras) {
        if (cam == camera) return;
    }
    _cameras.emplace_back(camera);
    sortCameras();
}

void RenderWindow::detachCamera(Camera *camera) {
    for (auto it = _cameras.begin(); it != _cameras.end(); ++it) {
        if (*it == camera) {
            _cameras.erase(it);
            return;
        }
    }
}

void RenderWindow::clearCameras() {
    for (Camera *camera : _cameras) {
        CC_SAFE_DESTROY(camera);
    }
    _cameras.clear();
}

void RenderWindow::sortCameras() {
    std::sort(_cameras.begin(), _cameras.end(), [](Camera *a, Camera *b) { return a->getPriority() < b->getPriority(); });
}

} // namespace scene

} // namespace cc
