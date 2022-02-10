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

#include "core/assets/RenderTexture.h"
#include "core/Root.h"
#include "core/utils/IDGenerator.h"
#include "renderer/gfx-base/GFXDef-common.h"

namespace cc {

namespace {

gfx::ColorAttachment colorAttachment = {
    gfx::Format::RGBA8,
    gfx::SampleCount::ONE,
    gfx::LoadOp::CLEAR,
    gfx::StoreOp::STORE,
    {cc::gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE},
    {cc::gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE}};

gfx::RenderPassInfo passInfo{
    std::vector<gfx::ColorAttachment>{colorAttachment},
    gfx::DepthStencilAttachment{gfx::Format::DEPTH_STENCIL}};

cc::scene::IRenderWindowInfo windowInfo{
    cc::nullopt,
    1,
    1,
    passInfo};

} // namespace

void RenderTexture::initialize(const IRenderTextureCreateInfo &info) {
    _name   = info.name.has_value() ? info.name.value() : "";
    _width  = info.width;
    _height = info.height;
    initWindow(info);
}

void RenderTexture::reset(const IRenderTextureCreateInfo &info) {
    initialize(info);
}

bool RenderTexture::destroy() {
    if (_window != nullptr) {
        Root::getInstance()->destroyWindow(_window);
        _window = nullptr;
    }
    return Super::destroy();
}

void RenderTexture::resize(uint32_t width, uint32_t height) {
    _width  = std::floor(clampf(static_cast<float>(width), 1.F, 2048.F));
    _height = std::floor(clampf(static_cast<float>(height), 1.F, 2048.F));
    if (_window != nullptr) {
        _window->resize(_width, _height);
    }
    // emit(std::string("resize"), _window); //TODO(xwx): not inherit form Eventify in Asset base class
}

gfx::Texture *RenderTexture::getGFXTexture() const {
    return _window ? _window->getFramebuffer()->getColorTextures()[0] : nullptr;
}

void RenderTexture::onLoaded() {
    initWindow();
}

void RenderTexture::initWindow() {
    windowInfo.title          = _name;
    windowInfo.width          = _width;
    windowInfo.height         = _height;
    windowInfo.renderPassInfo = passInfo;

    if (_window != nullptr) {
        _window->destroy();
        _window->initialize(Root::getInstance()->getDevice(), windowInfo);
    } else {
        _window = Root::getInstance()->createWindow(windowInfo);
    }
}

void RenderTexture::initWindow(const IRenderTextureCreateInfo &info) {
    windowInfo.title  = _name;
    windowInfo.width  = _width;
    windowInfo.height = _height;
    if (info.passInfo.has_value()) {
        windowInfo.renderPassInfo = info.passInfo.value();
    } else {
        windowInfo.renderPassInfo = passInfo;
    }
    if (_window != nullptr) {
        _window->destroy();
        _window->initialize(Root::getInstance()->getDevice(), windowInfo);
    } else {
        _window = Root::getInstance()->createWindow(windowInfo);
    }
}

void RenderTexture::initDefault(const cc::optional<std::string> &uuid) {
    Super::initDefault(uuid);
    _width  = 1;
    _height = 1;
    initWindow();
}

bool RenderTexture::validate() const {
    return _width >= 1 && _width <= 2048 && _height >= 1 && _height <= 2048;
}

std::vector<uint8_t> RenderTexture::readPixels(uint32_t x, uint32_t y, uint32_t width, uint32_t height) const {
    auto *gfxTexture = getGFXTexture();
    if (!gfxTexture) {
        return {};
    }

    auto *gfxDevice = getGFXDevice();

    gfx::BufferTextureCopy region0{};
    region0.texOffset.x      = static_cast<int32_t>(x);
    region0.texOffset.y      = static_cast<int32_t>(y);
    region0.texExtent.width  = width;
    region0.texExtent.height = height;

    std::vector<uint8_t> buffer;
    buffer.resize(width * height * 4);
    uint8_t *pBuffer = buffer.data();
    gfxDevice->copyTextureToBuffers(gfxTexture, &pBuffer, &region0, 1);

    return buffer;
}

} // namespace cc
