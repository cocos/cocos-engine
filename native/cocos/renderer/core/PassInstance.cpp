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

#include "renderer/core/PassInstance.h"
#include <cstdint>
#include "renderer/core/MaterialInstance.h"
#include "renderer/core/ProgramLib.h"
#include "renderer/pipeline/BatchedBuffer.h"
#include "renderer/pipeline/InstancedBuffer.h"

namespace cc {

PassInstance::PassInstance(scene::Pass *parent, MaterialInstance *owner) : Super(parent->getRoot()), _parent(parent), _owner(owner) {
    doInit(_parent->getPassInfoFull());
    for (const auto &b : _shaderInfo->blocks) {
        scene::IBlockRef &      block       = _blocks[b.binding];
        const scene::IBlockRef &parentBlock = _parent->getBlocks()[b.binding];
        assert(block.count == parentBlock.count);
        memcpy(block.data, parentBlock.data, parentBlock.count * 4);
    }

    _rootBufferDirty                        = true;
    gfx::DescriptorSet *parentDescriptorSet = _parent->getDescriptorSet();
    for (const auto &samplerTexture : _shaderInfo->samplerTextures) {
        for (uint32_t i = 0; i < samplerTexture.count; ++i) {
            auto *sampler = parentDescriptorSet->getSampler(samplerTexture.binding, i);
            auto *texture = parentDescriptorSet->getTexture(samplerTexture.binding, i);
            _descriptorSet->bindSampler(samplerTexture.binding, sampler, i);
            _descriptorSet->bindTexture(samplerTexture.binding, texture, i);
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

    Pass::fillPipelineInfo(this, original);
    Pass::fillPipelineInfo(this, IPassInfoFull(override));
    onStateChange();
}

bool PassInstance::tryCompile(const cc::optional<MacroRecord> &defineOverrides) {
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
    _defines["USE_BATCHING"]   = false;
    _batchingScheme            = scene::BatchingSchemes::NONE;
}

void PassInstance::onStateChange() {
    _hash = Pass::getPassHash(this);
    _owner->onPassStateChange(_dontNotify);
}

} // namespace cc
