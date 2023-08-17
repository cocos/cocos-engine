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

#include "scene/RenderWindow.h"
#include "BasePlatform.h"
#include "interfaces/modules/ISystemWindow.h"
#include "interfaces/modules/ISystemWindowManager.h"
#include "platform/interfaces/modules/Device.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/gfx-base/GFXFramebuffer.h"
#include "renderer/gfx-base/GFXSwapchain.h"
#include "renderer/gfx-base/GFXTexture.h"
#include "scene/Camera.h"

namespace cc {
namespace scene {

namespace {

const ccstd::unordered_map<IScreen::Orientation, gfx::SurfaceTransform> ORIENTATION_MAP{
    {IScreen::Orientation::PORTRAIT, gfx::SurfaceTransform::IDENTITY},
    {IScreen::Orientation::LANDSCAPE_RIGHT, gfx::SurfaceTransform::ROTATE_90},
    {IScreen::Orientation::PORTRAIT_UPSIDE_DOWN, gfx::SurfaceTransform::ROTATE_180},
    {IScreen::Orientation::LANDSCAPE_LEFT, gfx::SurfaceTransform::ROTATE_270},
};

}

RenderWindow::RenderWindow() = default;
RenderWindow::~RenderWindow() = default;

bool RenderWindow::initialize(gfx::Device *device, IRenderWindowInfo &info) {
    if (info.title.has_value() && !info.title.value().empty()) {
        _title = info.title.value();
    }

    if (info.swapchain != nullptr) {
        _swapchain = info.swapchain;
    }

    _width = info.width;
    _height = info.height;

    _renderPass = device->createRenderPass(info.renderPassInfo);

    if (info.swapchain != nullptr) {
        _swapchain = info.swapchain;
        _colorTextures.pushBack(info.swapchain->getColorTexture());
        _depthStencilTexture = info.swapchain->getDepthStencilTexture();
    } else {
        for (auto &colorAttachment : info.renderPassInfo.colorAttachments) {
            gfx::TextureInfo textureInfo = {gfx::TextureType::TEX2D,
                                            gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_SRC,
                                            colorAttachment.format,
                                            _width,
                                            _height};
            if (info.externalFlag.has_value()) {
                if (hasFlag(info.externalFlag.value(), gfx::TextureFlagBit::EXTERNAL_NORMAL)) {
                    textureInfo.flags |= info.externalFlag.value();
                    if (info.externalResLow.has_value() && info.externalResHigh.has_value()) {
                        uint64_t externalResAddr = (static_cast<uint64_t>(info.externalResHigh.value()) << 32) | info.externalResLow.value();
                        textureInfo.externalRes = reinterpret_cast<void *>(externalResAddr);
                    } else if (info.externalResLow.has_value()) {
                        textureInfo.externalRes = reinterpret_cast<void *>(static_cast<uint64_t>(info.externalResLow.value()));
                    }
                }
            }

            _colorTextures.pushBack(device->createTexture(textureInfo));
        }
        if (info.renderPassInfo.depthStencilAttachment.format != gfx::Format::UNKNOWN) {
            _depthStencilTexture = device->createTexture({gfx::TextureType::TEX2D,
                                                          gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
                                                          info.renderPassInfo.depthStencilAttachment.format,
                                                          _width,
                                                          _height});
        }
    }

    generateFrameBuffer();
    return true;
}

void RenderWindow::destroy() {
    clearCameras();

    // Gfx objects invoke destroy in VK\GL\MTL Object destructor.
    _frameBuffer = nullptr;
    _renderPass = nullptr;
    _depthStencilTexture = nullptr;

    // RefVector invokes RefCounted::release() when removing an element.
    _colorTextures.clear();
}

void RenderWindow::resize(uint32_t width, uint32_t height) {
    if (_swapchain != nullptr) {
        _swapchain->resize(width, height, ORIENTATION_MAP.at(Device::getDeviceOrientation()));
        _width = _swapchain->getWidth();
        _height = _swapchain->getHeight();
    } else {
        for (auto *colorTexture : _colorTextures) {
            colorTexture->resize(width, height);
        }
        if (_depthStencilTexture != nullptr) {
            _depthStencilTexture->resize(width, height);
        }
        _width = width;
        _height = height;
    }

    generateFrameBuffer();

    for (Camera *camera : _cameras) {
        camera->resize(width, height);
    }
}

void RenderWindow::extractRenderCameras(ccstd::vector<Camera *> &cameras) {
    for (Camera *camera : _cameras) {
        if (camera->isEnabled()) {
            camera->update();
            cameras.emplace_back(camera);
        }
    }
}

void RenderWindow::onNativeWindowDestroy(uint32_t windowId) {
    if (_swapchain != nullptr && _swapchain->getWindowId() == windowId) {
        _swapchain->destroySurface();
    }
}

void RenderWindow::onNativeWindowResume(uint32_t windowId) {
    if (_swapchain == nullptr || _swapchain->getWindowId() != windowId) {
        return;
    }
    auto *windowMgr = BasePlatform::getPlatform()->getInterface<ISystemWindowManager>();
    auto *hWnd = reinterpret_cast<void *>(windowMgr->getWindow(windowId)->getWindowHandle());
    _swapchain->createSurface(hWnd);
    generateFrameBuffer();
}

void RenderWindow::generateFrameBuffer() {
    _frameBuffer = gfx::Device::getInstance()->createFramebuffer(gfx::FramebufferInfo{
        _renderPass,
        _colorTextures.get(),
        _depthStencilTexture});
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
    _cameras.clear();
}

void RenderWindow::sortCameras() {
    std::stable_sort(_cameras.begin(), _cameras.end(), [](Camera *a, Camera *b) { return a->getPriority() < b->getPriority(); });
}

} // namespace scene

} // namespace cc
