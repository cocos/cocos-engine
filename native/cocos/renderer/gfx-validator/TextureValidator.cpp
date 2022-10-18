/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "TextureValidator.h"
#include "DeviceValidator.h"
#include "SwapchainValidator.h"
#include "ValidationUtils.h"
#include "gfx-base/GFXDef-common.h"

namespace cc {
namespace gfx {

namespace {
struct EnumHasher final {
    template <typename T, typename Enable = std::enable_if_t<std::is_enum<T>::value>>
    size_t operator()(const T &v) const {
        return static_cast<size_t>(v);
    }
};

ccstd::unordered_map<Format, Feature, EnumHasher> featureCheckMap{};
} // namespace

TextureValidator::TextureValidator(Texture *actor)
: Agent<Texture>(actor) {
    _typedID = actor->getTypedID();
}

TextureValidator::~TextureValidator() {
    DeviceResourceTracker<Texture>::erase(this);
    if (_ownTheActor) CC_SAFE_DELETE(_actor);
}

void TextureValidator::doInit(const TextureInfo &info) {
    CC_ASSERT(!isInited());
    _inited = true;

    CC_ASSERT(info.width && info.height && info.depth);

    FormatFeature ff = FormatFeature::NONE;
    if (hasAnyFlags(info.usage, TextureUsageBit::COLOR_ATTACHMENT | TextureUsageBit::DEPTH_STENCIL_ATTACHMENT)) ff |= FormatFeature::RENDER_TARGET;
    if (hasAnyFlags(info.usage, TextureUsageBit::SAMPLED)) ff |= FormatFeature::SAMPLED_TEXTURE;
    if (hasAnyFlags(info.usage, TextureUsageBit::STORAGE)) ff |= FormatFeature::STORAGE_TEXTURE;
    if (ff != FormatFeature::NONE) {
        CC_ASSERT(hasAllFlags(DeviceValidator::getInstance()->getFormatFeatures(info.format), ff));
    }

    switch (info.type) {
        case TextureType::TEX2D: {
            if (std::max(info.width, info.height) > DeviceValidator::getInstance()->getCapabilities().maxTextureSize) {
                CC_ASSERT(false);
            }
            break;
        }
        case TextureType::TEX2D_ARRAY: {
            if (std::max(info.width, info.height) > DeviceValidator::getInstance()->getCapabilities().maxTextureSize
                || info.layerCount > DeviceValidator::getInstance()->getCapabilities().maxArrayTextureLayers) {
                CC_ASSERT(false);
            }
            break;
        }
        case TextureType::CUBE: {
            if (std::max(info.width, info.height) > DeviceValidator::getInstance()->getCapabilities().maxCubeMapTextureSize || info.layerCount != 6) {
                CC_ASSERT(false);
            }
            break;
        }
        case TextureType::TEX3D: {
            if (std::max(std::max(info.width, info.height), info.depth) > DeviceValidator::getInstance()->getCapabilities().maxCubeMapTextureSize) {
                CC_ASSERT(false);
            }
            break;
        }
        default: {
            CC_ASSERT(false);
            break;
        }
    }

    if (hasFlag(info.flags, TextureFlagBit::GEN_MIPMAP)) {
        CC_ASSERT(info.levelCount > 1);

        bool isCompressed = GFX_FORMAT_INFOS[static_cast<int>(info.format)].isCompressed;
        CC_ASSERT(!isCompressed);
    }

    /////////// execute ///////////

    _actor->initialize(info);
}

void TextureValidator::doInit(const TextureViewInfo &info) {
    CC_ASSERT(!isInited());
    _inited = true;
    _isTextureView = true;
    CC_ASSERT(info.texture && static_cast<TextureValidator *>(info.texture)->isInited());

    /////////// execute ///////////

    TextureViewInfo actorInfo = info;
    actorInfo.texture = static_cast<TextureValidator *>(info.texture)->getActor();

    _actor->initialize(actorInfo);
}

void TextureValidator::doInit(const SwapchainTextureInfo &info) {
    CC_ASSERT(!isInited());
    _inited = true;
    CC_UNUSED_PARAM(info); // workaround tidy issue
    CC_ASSERT(info.swapchain && static_cast<SwapchainValidator *>(info.swapchain)->isInited());

    // the actor is already initialized
}

void TextureValidator::doDestroy() {
    CC_ASSERT(isInited());
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

void TextureValidator::doResize(uint32_t width, uint32_t height, uint32_t /*size*/) {
    CC_ASSERT(isInited());

    // Cannot resize texture views.
    CC_ASSERT(!_isTextureView);

    /////////// execute ///////////

    _actor->resize(width, height);
}

void TextureValidator::sanityCheck() {
    CC_ASSERT(isInited());

    uint64_t cur = DeviceValidator::getInstance()->currentFrame();

    // FIXME: minggo: as current implementation need to update some textures more than once, so disable it.
    // Should enable it when it is fixed.
    // if (cur == _lastUpdateFrame) {
    //     CC_LOG_WARNING(utils::getStacktraceJS().c_str());
    //     CC_LOG_WARNING("performance warning: texture updated more than once per frame");
    // }

    _lastUpdateFrame = cur;
}

} // namespace gfx
} // namespace cc
