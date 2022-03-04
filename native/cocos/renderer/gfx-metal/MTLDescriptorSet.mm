/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "MTLStd.h"

#include "MTLBuffer.h"
#include "MTLDescriptorSet.h"
#include "MTLDescriptorSetLayout.h"
#include "MTLGPUObjects.h"
#include "MTLSampler.h"
#include "MTLTexture.h"

namespace cc {
namespace gfx {
CCMTLDescriptorSet::CCMTLDescriptorSet() : DescriptorSet() {
    _typedID = generateObjectID<decltype(this)>();
}

void CCMTLDescriptorSet::doInit(const DescriptorSetInfo &info) {
    const auto gpuDescriptorSetLayout = static_cast<CCMTLDescriptorSetLayout *>(_layout)->gpuDescriptorSetLayout();
    const auto descriptorCount = gpuDescriptorSetLayout->descriptorCount;
    const auto bindingCount = gpuDescriptorSetLayout->bindings.size();

    _gpuDescriptorSet = CC_NEW(CCMTLGPUDescriptorSet);
    _gpuDescriptorSet->descriptorIndices = &gpuDescriptorSetLayout->descriptorIndices;
    _gpuDescriptorSet->gpuDescriptors.resize(descriptorCount);
    for (auto i = 0u, k = 0u; i < bindingCount; i++) {
        const auto &binding = gpuDescriptorSetLayout->bindings[i];
        for (auto j = 0u; j < binding.count; j++, k++) {
            _gpuDescriptorSet->gpuDescriptors[k].type = binding.descriptorType;
        }
    }
}

CCMTLDescriptorSet::~CCMTLDescriptorSet() {
    destroy();
}

void CCMTLDescriptorSet::doDestroy() {
    CC_SAFE_DELETE(_gpuDescriptorSet);
}

void CCMTLDescriptorSet::update() {
    if (_isDirty && _gpuDescriptorSet) {
        const auto &descriptors = _gpuDescriptorSet->gpuDescriptors;
        for (size_t i = 0; i < descriptors.size(); i++) {
            if (hasAnyFlags(descriptors[i].type, DESCRIPTOR_BUFFER_TYPE)) {
                if (_buffers[i]) {
                    _gpuDescriptorSet->gpuDescriptors[i].buffer = static_cast<CCMTLBuffer *>(_buffers[i]);
                }
            } else if (hasAnyFlags(descriptors[i].type, DESCRIPTOR_TEXTURE_TYPE)) {
                if(!_textures[i] && !_samplers[i])
                    continue;
                    
                Texture* tex = _textures[i];
                if(!tex)
                    tex = CCMTLTexture::getDefaultTexture();
                _gpuDescriptorSet->gpuDescriptors[i].texture = static_cast<CCMTLTexture *>(tex);
            
                Sampler* sampler = _samplers[i];
                if(!sampler)
                    sampler = CCMTLSampler::getDefaultSampler();
                _gpuDescriptorSet->gpuDescriptors[i].sampler = static_cast<CCMTLSampler *>(sampler);
                
            }
        }
        _isDirty = false;
    }
}
}
}
