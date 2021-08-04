/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/CoreStd.h"

#include "DeviceValidator.h"
#include "TextureValidator.h"
#include "ValidationUtils.h"

namespace cc {
namespace gfx {

namespace {
unordered_map<Format, Feature> featureCheckMap{
    {Format::RGB8, Feature::FORMAT_RGB8},
    {Format::R11G11B10F, Feature::FORMAT_R11G11B10F},
};
} // namespace

TextureValidator::TextureValidator(Texture *actor)
: Agent<Texture>(actor) {
    _typedID = generateObjectID<decltype(this)>();
}

TextureValidator::~TextureValidator() {
    DeviceResourceTracker<Texture>::erase(this);
    CC_SAFE_DELETE(_actor);
}

void TextureValidator::doInit(const TextureInfo &info) {
    CCASSERT(!featureCheckMap.count(_format) || DeviceValidator::getInstance()->hasFeature(featureCheckMap[_format]), "unsupported format");

    // Potentially inefficient
    static const TextureUsageBit INEFFICIENT_MASK{TextureUsageBit::INPUT_ATTACHMENT | TextureUsageBit::SAMPLED};
    CCASSERT((info.usage & INEFFICIENT_MASK) != INEFFICIENT_MASK, "Both SAMPLED and INPUT_ATTACHMENT are specified?");

    _actor->initialize(info);
}

void TextureValidator::doInit(const TextureViewInfo &info) {
    TextureViewInfo actorInfo = info;
    actorInfo.texture         = static_cast<TextureValidator *>(info.texture)->getActor();

    _actor->initialize(actorInfo);
}

void TextureValidator::doDestroy() {
    _actor->destroy();
}

void TextureValidator::doResize(uint width, uint height, uint /*size*/) {
    CCASSERT(!_isTextureView, "Cannot resize texture views");

    _actor->resize(width, height);
}

void TextureValidator::sanityCheck() {
    uint cur = DeviceValidator::getInstance()->currentFrame();

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
