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

#include "GlobalDescriptorSetManager.h"

#include "Define.h"
#include "RenderInstancedQueue.h"
#include "forward/ForwardPipeline.h"
#include "gfx-base/GFXDevice.h"

namespace cc {
namespace pipeline {

#define INIT_GLOBAL_DESCSET_LAYOUT(info)                                      \
    do {                                                                      \
        globalDescriptorSetLayout.samplers[info::NAME]    = info::LAYOUT;     \
        globalDescriptorSetLayout.bindings[info::BINDING] = info::DESCRIPTOR; \
    } while (0)

void GlobalDSManager::activate(gfx::Device *device, RenderPipeline *pipeline) {
    _device   = device;
    _pipeline = pipeline;

    _linearSampler = device->getSampler({
        gfx::Filter::LINEAR,
        gfx::Filter::LINEAR,
        gfx::Filter::NONE,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
    });

    _pointSampler = device->getSampler({
        gfx::Filter::POINT,
        gfx::Filter::POINT,
        gfx::Filter::NONE,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
    });

    setDescriptorSetLayout();
    CC_SAFE_DESTROY_NULL(_descriptorSetLayout);
    _descriptorSetLayout = device->createDescriptorSetLayout({globalDescriptorSetLayout.bindings});

    if (_globalDescriptorSet) {
        _globalDescriptorSet->destroy();
        CC_DELETE(_globalDescriptorSet);
    }
    _globalDescriptorSet = device->createDescriptorSet({_descriptorSetLayout});
}

void GlobalDSManager::bindBuffer(uint binding, gfx::Buffer *buffer) {
    if (_globalDescriptorSet) {
        _globalDescriptorSet->bindBuffer(binding, buffer);
    }

    for (auto &pair : _descriptorSetMap) {
        if (pair.second) pair.second->bindBuffer(binding, buffer);
    }
}

void GlobalDSManager::bindSampler(uint binding, gfx::Sampler *sampler) {
    if (_globalDescriptorSet) {
        _globalDescriptorSet->bindSampler(binding, sampler);
    }

    for (auto &pair : _descriptorSetMap) {
        if (pair.second) pair.second->bindSampler(binding, sampler);
    }
}

void GlobalDSManager::bindTexture(uint binding, gfx::Texture *texture) {
    if (_globalDescriptorSet) {
        _globalDescriptorSet->bindTexture(binding, texture);
    }

    for (auto &pair : _descriptorSetMap) {
        if (pair.second) pair.second->bindTexture(binding, texture);
    }
}

void GlobalDSManager::update() {
    if (_globalDescriptorSet) {
        _globalDescriptorSet->update();
    }

    for (auto &pair : _descriptorSetMap) {
        if (pair.second) pair.second->update();
    }
}

gfx::DescriptorSet *GlobalDSManager::getOrCreateDescriptorSet(uint idx) {
    // The global descriptorSet is managed by the pipeline and binds the buffer
    if (_descriptorSetMap.count(idx) <= 0 || !_descriptorSetMap.at(idx)) {
        auto *descriptorSet = _device->createDescriptorSet({_descriptorSetLayout});
        _descriptorSetMap.emplace(idx, descriptorSet);

        const auto begin = static_cast<uint>(PipelineGlobalBindings::UBO_GLOBAL);
        const auto end   = static_cast<uint>(PipelineGlobalBindings::COUNT);
        for (uint i = begin; i < end; ++i) {
            auto *const buffer = _globalDescriptorSet->getBuffer(i);
            if (buffer) descriptorSet->bindBuffer(i, buffer);
            auto *const sampler = _globalDescriptorSet->getSampler(i);
            if (sampler) descriptorSet->bindSampler(i, sampler);
            auto *const texture = _globalDescriptorSet->getTexture(i);
            if (texture) descriptorSet->bindTexture(i, texture);
        }

        auto *shadowUBO = _device->createBuffer({
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
            UBOShadow::SIZE,
            UBOShadow::SIZE,
            gfx::BufferFlagBit::NONE,
        });
        _shadowUBOs.push_back(shadowUBO);
        descriptorSet->bindBuffer(UBOShadow::BINDING, shadowUBO);

        descriptorSet->update();
    }

    return _descriptorSetMap.at(idx);
}

void GlobalDSManager::destroy() {
    for (auto *shadowUBO : _shadowUBOs) {
        CC_SAFE_DELETE(shadowUBO);
    }
    for (auto &pair : _descriptorSetMap) {
        CC_SAFE_DELETE(pair.second);
    }
    _descriptorSetMap.clear();

    CC_SAFE_DESTROY_NULL(_descriptorSetLayout);
    CC_SAFE_DELETE(_globalDescriptorSet);
}

void GlobalDSManager::setDescriptorSetLayout() {
    globalDescriptorSetLayout.bindings.resize(static_cast<size_t>(PipelineGlobalBindings::COUNT));

    globalDescriptorSetLayout.blocks[UBOGlobal::NAME]            = UBOGlobal::LAYOUT;
    globalDescriptorSetLayout.bindings[UBOGlobal::BINDING]       = UBOGlobal::DESCRIPTOR;
    globalDescriptorSetLayout.blocks[UBOCamera::NAME]            = UBOCamera::LAYOUT;
    globalDescriptorSetLayout.bindings[UBOCamera::BINDING]       = UBOCamera::DESCRIPTOR;
    globalDescriptorSetLayout.blocks[UBOShadow::NAME]            = UBOShadow::LAYOUT;
    globalDescriptorSetLayout.bindings[UBOShadow::BINDING]       = UBOShadow::DESCRIPTOR;
    globalDescriptorSetLayout.samplers[SHADOWMAP::NAME]          = SHADOWMAP::LAYOUT;
    globalDescriptorSetLayout.bindings[SHADOWMAP::BINDING]       = SHADOWMAP::DESCRIPTOR;
    globalDescriptorSetLayout.samplers[ENVIRONMENT::NAME]        = ENVIRONMENT::LAYOUT;
    globalDescriptorSetLayout.bindings[ENVIRONMENT::BINDING]     = ENVIRONMENT::DESCRIPTOR;
    globalDescriptorSetLayout.samplers[SPOTLIGHTINGMAP::NAME]    = SPOTLIGHTINGMAP::LAYOUT;
    globalDescriptorSetLayout.bindings[SPOTLIGHTINGMAP::BINDING] = SPOTLIGHTINGMAP::DESCRIPTOR;
    globalDescriptorSetLayout.samplers[DIFFUSEMAP::NAME]         = DIFFUSEMAP::LAYOUT;
    globalDescriptorSetLayout.bindings[DIFFUSEMAP::BINDING]      = DIFFUSEMAP::DESCRIPTOR;

    localDescriptorSetLayout.bindings.resize(static_cast<size_t>(ModelLocalBindings::COUNT));
    localDescriptorSetLayout.blocks[UBOLocalBatched::NAME]           = UBOLocalBatched::LAYOUT;
    localDescriptorSetLayout.bindings[UBOLocalBatched::BINDING]      = UBOLocalBatched::DESCRIPTOR;
    localDescriptorSetLayout.blocks[UBOLocal::NAME]                  = UBOLocal::LAYOUT;
    localDescriptorSetLayout.bindings[UBOLocal::BINDING]             = UBOLocal::DESCRIPTOR;
    localDescriptorSetLayout.blocks[UBOWorldBound::NAME]             = UBOWorldBound::LAYOUT;
    localDescriptorSetLayout.bindings[UBOWorldBound::BINDING]        = UBOWorldBound::DESCRIPTOR;
    localDescriptorSetLayout.blocks[UBOForwardLight::NAME]           = UBOForwardLight::LAYOUT;
    localDescriptorSetLayout.bindings[UBOForwardLight::BINDING]      = UBOForwardLight::DESCRIPTOR;
    localDescriptorSetLayout.blocks[UBOSkinningTexture::NAME]        = UBOSkinningTexture::LAYOUT;
    localDescriptorSetLayout.bindings[UBOSkinningTexture::BINDING]   = UBOSkinningTexture::DESCRIPTOR;
    localDescriptorSetLayout.blocks[UBOSkinningAnimation::NAME]      = UBOSkinningAnimation::LAYOUT;
    localDescriptorSetLayout.bindings[UBOSkinningAnimation::BINDING] = UBOSkinningAnimation::DESCRIPTOR;
    localDescriptorSetLayout.blocks[UBOSkinning::NAME]               = UBOSkinning::LAYOUT;
    localDescriptorSetLayout.bindings[UBOSkinning::BINDING]          = UBOSkinning::DESCRIPTOR;
    localDescriptorSetLayout.blocks[UBOMorph::NAME]                  = UBOMorph::LAYOUT;
    localDescriptorSetLayout.bindings[UBOMorph::BINDING]             = UBOMorph::DESCRIPTOR;
    localDescriptorSetLayout.blocks[UBOUILocal::NAME]                = UBOUILocal::LAYOUT;
    localDescriptorSetLayout.bindings[UBOUILocal::BINDING]           = UBOUILocal::DESCRIPTOR;
    localDescriptorSetLayout.samplers[JOINTTEXTURE::NAME]            = JOINTTEXTURE::LAYOUT;
    localDescriptorSetLayout.bindings[JOINTTEXTURE::BINDING]         = JOINTTEXTURE::DESCRIPTOR;
    localDescriptorSetLayout.samplers[POSITIONMORPH::NAME]           = POSITIONMORPH::LAYOUT;
    localDescriptorSetLayout.bindings[POSITIONMORPH::BINDING]        = POSITIONMORPH::DESCRIPTOR;
    localDescriptorSetLayout.samplers[NORMALMORPH::NAME]             = NORMALMORPH::LAYOUT;
    localDescriptorSetLayout.bindings[NORMALMORPH::BINDING]          = NORMALMORPH::DESCRIPTOR;
    localDescriptorSetLayout.samplers[TANGENTMORPH::NAME]            = TANGENTMORPH::LAYOUT;
    localDescriptorSetLayout.bindings[TANGENTMORPH::BINDING]         = TANGENTMORPH::DESCRIPTOR;
    localDescriptorSetLayout.samplers[LIGHTMAPTEXTURE::NAME]         = LIGHTMAPTEXTURE::LAYOUT;
    localDescriptorSetLayout.bindings[LIGHTMAPTEXTURE::BINDING]      = LIGHTMAPTEXTURE::DESCRIPTOR;
    localDescriptorSetLayout.samplers[SPRITETEXTURE::NAME]           = SPRITETEXTURE::LAYOUT;
    localDescriptorSetLayout.bindings[SPRITETEXTURE::BINDING]        = SPRITETEXTURE::DESCRIPTOR;
    localDescriptorSetLayout.samplers[REFLECTIONTEXTURE::NAME]       = REFLECTIONTEXTURE::LAYOUT;
    localDescriptorSetLayout.bindings[REFLECTIONTEXTURE::BINDING]    = REFLECTIONTEXTURE::DESCRIPTOR;
    localDescriptorSetLayout.storeImages[REFLECTIONSTORAGE::NAME]    = REFLECTIONSTORAGE::LAYOUT;
    localDescriptorSetLayout.bindings[REFLECTIONSTORAGE::BINDING]    = REFLECTIONSTORAGE::DESCRIPTOR;
}

} // namespace pipeline
} // namespace cc
