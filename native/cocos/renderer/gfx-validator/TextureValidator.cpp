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
#include "SwapchainValidator.h"
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
    _typedID = actor->getTypedID();
}

TextureValidator::~TextureValidator() {
    DeviceResourceTracker<Texture>::erase(this);
    if (_ownTheActor) CC_SAFE_DELETE(_actor);
}

void TextureValidator::doInit(const TextureInfo &info) {
    CCASSERT(!isInited(), "initializing twice?");
    _inited = true;

    CCASSERT(info.width && info.height && info.depth, "zero-sized texture?");
    CCASSERT(!featureCheckMap.count(_info.format) || DeviceValidator::getInstance()->hasFeature(featureCheckMap[_info.format]), "unsupported format");

    /////////// execute ///////////

    _actor->initialize(info);
}

void TextureValidator::doInit(const TextureViewInfo &info) {
    CCASSERT(!isInited(), "initializing twice?");
    _inited = true;
    CCASSERT(info.texture && static_cast<TextureValidator*>(info.texture)->isInited(), "alread destroyed?");

    /////////// execute ///////////

    TextureViewInfo actorInfo = info;
    actorInfo.texture         = static_cast<TextureValidator *>(info.texture)->getActor();

    _actor->initialize(actorInfo);
}

void TextureValidator::doInit(const SwapchainTextureInfo &info) {
    CCASSERT(!isInited(), "initializing twice?");
    _inited = true;
    CC_UNUSED_PARAM(info); // workaround tidy issue
    CCASSERT(info.swapchain && static_cast<SwapchainValidator*>(info.swapchain)->isInited(), "alread destroyed?");

    // the actor is already initialized
}

void TextureValidator::doDestroy() {
    CCASSERT(isInited(), "destroying twice?");
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

void TextureValidator::doResize(uint32_t width, uint32_t height, uint32_t /*size*/) {
    CCASSERT(isInited(), "alread destroyed?");

    CCASSERT(!_isTextureView, "Cannot resize texture views");

    /////////// execute ///////////

    _actor->resize(width, height);
}

void TextureValidator::sanityCheck() {
    CCASSERT(isInited(), "alread destroyed?");

    uint32_t cur = DeviceValidator::getInstance()->currentFrame();

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
