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

#include "cocos/renderer/core/PassInstance.h"
#include "cocos/renderer/core/MaterialInstance.h"
#include "cocos/renderer/core/ProgramLib.h"
#include "cocos/renderer/pipeline/InstancedBuffer.h"
#include "cocos/renderer/pipeline/custom/RenderingModule.h"

namespace cc {

PassInstance::PassInstance(scene::Pass *parent, MaterialInstance *owner)
: Super(parent->getRoot()), _parent(parent), _owner(owner) {
    doInit(_parent->getPassInfoFull());
    for (const auto &b : _shaderInfo->blocks) {
        scene::IBlockRef &block = _blocks[b.binding];
        const scene::IBlockRef &parentBlock = _parent->getBlocks()[b.binding];
        CC_ASSERT(block.count == parentBlock.count);
        memcpy(block.data, parentBlock.data, parentBlock.count * 4);
    }

    _rootBufferDirty = true;
    gfx::DescriptorSet *parentDescriptorSet = _parent->getDescriptorSet();

    auto *programLib = render::getProgramLibrary();
    if (programLib) {
        const auto &set = _shaderInfo->descriptors.at(
            static_cast<size_t>(pipeline::SetIndex::MATERIAL));
        for (const auto &samplerTexture : set.samplerTextures) {
            for (uint32_t i = 0; i < samplerTexture.count; ++i) {
                auto *sampler = parentDescriptorSet->getSampler(samplerTexture.binding, i);
                auto *texture = parentDescriptorSet->getTexture(samplerTexture.binding, i);
                _descriptorSet->bindSampler(samplerTexture.binding, sampler, i);
                _descriptorSet->bindTexture(samplerTexture.binding, texture, i);
            }
        }
    } else {
        for (const auto &samplerTexture : _shaderInfo->samplerTextures) {
            for (uint32_t i = 0; i < samplerTexture.count; ++i) {
                auto *sampler = parentDescriptorSet->getSampler(samplerTexture.binding, i);
                auto *texture = parentDescriptorSet->getTexture(samplerTexture.binding, i);
                _descriptorSet->bindSampler(samplerTexture.binding, sampler, i);
                _descriptorSet->bindTexture(samplerTexture.binding, texture, i);
            }
        }
    }

    Super::tryCompile();
}

PassInstance::~PassInstance() = default;

scene::Pass *PassInstance::getParent() const {
    return _parent.get();
}

void PassInstance::overridePipelineStates(const IPassInfo &original, const PassOverrides &override) {
    _blendState.reset();
    _rs.reset();
    _depthStencilState.reset();

    scene::Pass::fillPipelineInfo(this, original);
    scene::Pass::fillPipelineInfo(this, IPassInfoFull(override));
    onStateChange();
}

bool PassInstance::tryCompile(const ccstd::optional<MacroRecord> &defineOverrides) {
    if (defineOverrides.has_value()) {
        if (!overrideMacros(_defines, defineOverrides.value())) return false;
    }
    bool ret = Super::tryCompile();
    onStateChange();
    return ret;
}

void PassInstance::beginChangeStatesSilently() {
    _dontNotify = true;
}

void PassInstance::endChangeStatesSilently() {
    _dontNotify = false;
}

void PassInstance::syncBatchingScheme() {
    _defines["USE_INSTANCING"] = false;
    _batchingScheme = scene::BatchingSchemes::NONE;
}

void PassInstance::onStateChange() {
    _hash = scene::Pass::getPassHash(this);
    _owner->onPassStateChange(_dontNotify);
}

} // namespace cc
