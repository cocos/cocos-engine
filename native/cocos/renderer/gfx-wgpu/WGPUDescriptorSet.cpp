/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "WGPUDescriptorSet.h"
#include <emscripten/html5_webgpu.h>
#include <algorithm>
#include "WGPUBuffer.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUSampler.h"
#include "WGPUTexture.h"

namespace cc {
namespace gfx {

namespace {
WGPUBindGroup dftBindGroup = wgpuDefaultHandle;

struct BindGroupCache {
    CCWGPUDescriptorSet *descriptorSet{nullptr};
    WGPUBindGroup bindGroup{wgpuDefaultHandle};
    ccstd::hash_t bornHash{0};
};

thread_local ccstd::unordered_map<ccstd::hash_t, BindGroupCache> bindGroupMap;
} // namespace

CCWGPUDescriptorSet::CCWGPUDescriptorSet() : DescriptorSet() {
}

CCWGPUDescriptorSet::~CCWGPUDescriptorSet() {
    doDestroy();
}

void CCWGPUDescriptorSet::clearCache() {
    if (!bindGroupMap.empty()) {
        for (auto &it : bindGroupMap) {
            wgpuBindGroupRelease(static_cast<WGPUBindGroup>(it.second.bindGroup));
            it.second.descriptorSet->_isDirty = true;
        }
        bindGroupMap.clear();
    }
}

void CCWGPUDescriptorSet::doInit(const DescriptorSetInfo &info) {
    _gpuBindGroupObj = ccnew CCWGPUBindGroupObject{};
    _gpuDescriptorObj = ccnew CCWGPUGPUDescriptorSetObject{};

    auto *tLayout = const_cast<DescriptorSetLayout *>(_layout);
    auto *dsLayout = static_cast<CCWGPUDescriptorSetLayout *>(tLayout);
    const auto &bindings = dsLayout->getBindings();
    CCWGPUDeviceObject *deviceObj = CCWGPUDevice::getInstance()->gpuDeviceObject();
    for (size_t i = 0; i < bindings.size(); i++) {
        // effect.ts: INPUT_ATTACHMENT as combined texture but no sampler_texture desc type.
        if (hasFlag(COMBINED_ST_IN_USE, bindings[i].descriptorType)) {
        } else if (hasFlag(DESCRIPTOR_BUFFER_TYPE, bindings[i].descriptorType)) {
            if (hasAnyFlags(bindings[i].descriptorType, DescriptorType::DYNAMIC_STORAGE_BUFFER | DescriptorType::DYNAMIC_UNIFORM_BUFFER)) {
                _dynamicOffsets.emplace(i, bindings[i].binding);
            }
        }
    }

    _gpuDescriptorObj->gpuDescriptors.resize(bindings.size());
    _gpuDescriptorObj->descriptorIndices = info.layout->getBindingIndices();

    _bindingSatisfied = [](uint32_t) { return true; };

    (void)defaultBindGroup();
}

ccstd::hash_t CCWGPUDescriptorSet::hash() const {
    ccstd::hash_t hash = _gpuBindGroupObj->bindGroupEntries.size();

    for (const auto &entry : _gpuBindGroupObj->bindGroupEntries) {
        ccstd::hash_combine(hash, entry.binding);
        if (entry.buffer) {
            ccstd::hash_combine(hash, entry.buffer);
            ccstd::hash_combine(hash, entry.offset);
            ccstd::hash_combine(hash, entry.size);
        }
        if (entry.sampler) {
            ccstd::hash_combine(hash, entry.sampler);
        }
        if (entry.textureView) {
            ccstd::hash_combine(hash, entry.textureView);
        }
    }

    return hash;
}

void CCWGPUDescriptorSet::doDestroy() {
    if (_gpuBindGroupObj) {
        delete _gpuBindGroupObj;
        _gpuBindGroupObj = nullptr;
    }
    if (_gpuDescriptorObj) {
        delete _gpuDescriptorObj;
        _gpuDescriptorObj = nullptr;
    }
}

void CCWGPUDescriptorSet::setGpuDescriptors(DescriptorSet *set) {
    auto *ccDesc = static_cast<CCWGPUDescriptorSet *>(set);
    const auto &descs = ccDesc->gpuDescriptors();

    auto *tLayout = const_cast<DescriptorSetLayout *>(_layout);
    auto *dsLayout = static_cast<CCWGPUDescriptorSetLayout *>(tLayout);
    auto *srcTmpLayout = set->getLayout();

    dsLayout->setBindings(srcTmpLayout->getBindings());
    dsLayout->setBindingIndices(srcTmpLayout->getBindingIndices());
    dsLayout->setDescriptorIndices(srcTmpLayout->getDescriptorIndices());

    _gpuDescriptorObj->gpuDescriptors = descs.gpuDescriptors;
    _gpuDescriptorObj->descriptorIndices = descs.descriptorIndices;

    _buffers = ccDesc->_buffers;
    _textures = ccDesc->_textures;
    _samplers = ccDesc->_samplers;

    _isDirty = true;
}

void CCWGPUDescriptorSet::prune(ccstd::vector<uint8_t> bindings) {
    _gpuBindGroupObj->bindingInShader = std::set<uint8_t>(bindings.begin(), bindings.end());

    _bindingSatisfied = [&](uint32_t binding) {
        return (!_gpuBindGroupObj->bindingInShader.empty()) && (_gpuBindGroupObj->bindingInShader.find(binding) != _gpuBindGroupObj->bindingInShader.end());
    };
}

void CCWGPUDescriptorSet::update() {
    if (!_isDirty) {
        return;
    }
    auto *tLayout = const_cast<DescriptorSetLayout *>(_layout);
    auto *dsLayout = static_cast<CCWGPUDescriptorSetLayout *>(tLayout);
    const auto &bindings = dsLayout->getBindings();

    _gpuBindGroupObj->bindGroupEntries.clear();
    _dynamicOffsetNum = 0;

    for (size_t i = 0; i < _gpuDescriptorObj->gpuDescriptors.size(); i++) {
        if (!_bindingSatisfied(bindings[i].binding)) {
            continue;
        }
        _gpuDescriptorObj->gpuDescriptors[i].type = bindings[i].descriptorType;
        const auto &binding = bindings[i];
        uint8_t resourceIndex = _layout->getDescriptorIndices()[i];
        if (hasFlag(DESCRIPTOR_BUFFER_TYPE, bindings[i].descriptorType)) {
            auto *ccBuffer = _buffers[resourceIndex].ptr ? static_cast<CCWGPUBuffer *>(_buffers[resourceIndex].ptr) : CCWGPUBuffer::defaultUniformBuffer();
            auto *buffer = static_cast<CCWGPUBuffer *>(ccBuffer);
            auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries.emplace_back();
            buffer->check();
            bindGroupEntry.binding = binding.binding;
            bindGroupEntry.buffer = buffer->gpuBufferObject()->wgpuBuffer;
            bindGroupEntry.offset = buffer->getOffset();
            bindGroupEntry.size = buffer->getSize();
            dsLayout->updateBufferLayout(i, buffer, _buffers[resourceIndex].flags);
            uint8_t bindIndex = binding.binding;
            if (hasAnyFlags(binding.descriptorType, DescriptorType::DYNAMIC_STORAGE_BUFFER | DescriptorType::DYNAMIC_UNIFORM_BUFFER)) {
                _dynamicOffsets[i] = bindIndex;
                _dynamicOffsetNum++;
            }

            _gpuDescriptorObj->gpuDescriptors[i].buffer = ccBuffer;
        } else if (hasFlag(COMBINED_ST_IN_USE, bindings[i].descriptorType)) {
            // printf("texture update %d %d %p\n", i, resourceIndex, _textures[resourceIndex].ptr);
            auto *ccTexture = _textures[resourceIndex].ptr ? static_cast<CCWGPUTexture *>(_textures[resourceIndex].ptr) : CCWGPUTexture::defaultCommonTexture();
            auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries.emplace_back();
            bindGroupEntry.binding = binding.binding;
            bindGroupEntry.textureView = static_cast<WGPUTextureView>(ccTexture->getPlaneView(0));
            dsLayout->updateSampledTextureLayout(i, ccTexture);
            _gpuDescriptorObj->gpuDescriptors[i].texture = ccTexture;

            auto &sBindGroupEntry = _gpuBindGroupObj->bindGroupEntries.emplace_back();
            auto *ccSampler = _samplers[resourceIndex].ptr ? static_cast<CCWGPUSampler *>(_samplers[resourceIndex].ptr) : CCWGPUSampler::defaultFilterableSampler();
            sBindGroupEntry.binding = binding.binding + CC_WGPU_MAX_ATTACHMENTS;
            sBindGroupEntry.sampler = ccSampler->gpuSampler();
            dsLayout->updateSamplerLayout(i, ccSampler);
            _gpuDescriptorObj->gpuDescriptors[i].sampler = ccSampler;
        } else if (DescriptorType::STORAGE_IMAGE == bindings[i].descriptorType || DescriptorType::TEXTURE == bindings[i].descriptorType) {
            auto *ccTexture = _textures[resourceIndex].ptr ? static_cast<CCWGPUTexture *>(_textures[resourceIndex].ptr) : CCWGPUTexture::defaultCommonTexture();
            auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries.emplace_back();
            bindGroupEntry.binding = binding.binding;
            bindGroupEntry.textureView = static_cast<WGPUTextureView>(ccTexture->getPlaneView(0));
            if (DescriptorType::STORAGE_IMAGE == bindings[i].descriptorType) {
                dsLayout->updateStorageTextureLayout(i, ccTexture);
            } else {
                dsLayout->updateSampledTextureLayout(i, ccTexture);
            }
            _gpuDescriptorObj->gpuDescriptors[i].texture = ccTexture;
        } else if (DescriptorType::SAMPLER == bindings[i].descriptorType) {
            auto *ccSampler = _samplers[resourceIndex].ptr ? static_cast<CCWGPUSampler *>(_samplers[resourceIndex].ptr) : CCWGPUSampler::defaultFilterableSampler();
            auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries.emplace_back();
            bindGroupEntry.binding = binding.binding;
            bindGroupEntry.sampler = ccSampler->gpuSampler();
            dsLayout->updateSamplerLayout(i, ccSampler);
            _gpuDescriptorObj->gpuDescriptors[i].sampler = ccSampler;
        } else {
            printf("*******unexpected binding type detected!\n");
        }
    }
}

void CCWGPUDescriptorSet::prepare() {
    auto buffIter = std::find_if(_buffers.begin(), _buffers.end(), [](const ObjectWithId<Buffer> &buffer) {
        return buffer.ptr && static_cast<const CCWGPUBuffer *>(buffer.ptr)->internalChanged();
    });
    auto texIter = std::find_if(_textures.begin(), _textures.end(), [](const ObjectWithId<Texture> &texture) {
        return texture.ptr && static_cast<const CCWGPUTexture *>(texture.ptr)->internalChanged();
    });

    bool forceUpdate = buffIter != _buffers.end() || texIter != _textures.end();

    _isDirty |= forceUpdate;
    if (_isDirty) {
        update();
    }

    if (_isDirty || forceUpdate || !_gpuBindGroupObj->bindgroup) {
        // TODDO(Zeqiang): no const cast
        auto *tLayout = const_cast<DescriptorSetLayout *>(_layout);
        auto *dsLayout = static_cast<CCWGPUDescriptorSetLayout *>(tLayout);

        dsLayout->prepare(_gpuBindGroupObj->bindingInShader, forceUpdate);

        const auto &entries = _gpuBindGroupObj->bindGroupEntries;
        if (_gpuBindGroupObj->bindingInShader.empty()) {
            _gpuBindGroupObj->bindgroup = dftBindGroup;
            _bornHash = 0;
        } else {
            _hash = hash();
            auto iter = bindGroupMap.find(_hash);
            if (iter == bindGroupMap.end()) {
                // layout might be changed later.
                _bornHash = dsLayout->getHash();
                CCWGPUDeviceObject *deviceObj = CCWGPUDevice::getInstance()->gpuDeviceObject();

                label = std::to_string(_bornHash);
                WGPUBindGroupDescriptor bindGroupDesc = {
                    .nextInChain = nullptr,
                    .label = label.c_str(),
                    .layout = dsLayout->gpuLayoutEntryObject()->bindGroupLayout,
                    .entryCount = entries.size(),
                    .entries = entries.data(),
                };

                _gpuBindGroupObj->bindgroup = wgpuDeviceCreateBindGroup(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &bindGroupDesc);

                _isDirty = false;
                if (buffIter != _buffers.end())
                    std::for_each(_buffers.begin(), _buffers.end(), [](ObjectWithId<Buffer> &buffer) {
                        if (buffer.ptr)
                            static_cast<CCWGPUBuffer *>(buffer.ptr)->stamp();
                    });
                if (texIter != _textures.end())
                    std::for_each(_textures.begin(), _textures.end(), [](ObjectWithId<Texture> &texture) {
                        if (texture.ptr)
                            static_cast<CCWGPUTexture *>(texture.ptr)->stamp();
                    });

                bindGroupMap.insert(std::make_pair(_hash, BindGroupCache{this, _gpuBindGroupObj->bindgroup, _bornHash}));
                // CCWGPUDevice::getInstance()->destroyLater(_gpuBindGroupObj->bindgroup);
            } else {
                _gpuBindGroupObj->bindgroup = static_cast<WGPUBindGroup>(iter->second.bindGroup);
                _bornHash = iter->second.bornHash;
            }
        }
    }
}

uint8_t CCWGPUDescriptorSet::dynamicOffsetCount() const {
    return _dynamicOffsetNum;
}

void *CCWGPUDescriptorSet::defaultBindGroup() {
    CCWGPUDeviceObject *deviceObj = CCWGPUDevice::getInstance()->gpuDeviceObject();

    if (!dftBindGroup) {
        CCWGPUBuffer *buffer = deviceObj->defaultResources.uniformBuffer;
        WGPUBindGroupEntry bufferEntry = {
            .binding = 0,
            .buffer = buffer->gpuBufferObject()->wgpuBuffer,
            .offset = buffer->getOffset(),
            .size = buffer->getSize(),
        };

        WGPUBindGroupDescriptor bindGroupDesc = {
            .nextInChain = nullptr,
            .label = "defaultBindGroup",
            .layout = static_cast<WGPUBindGroupLayout>(CCWGPUDescriptorSetLayout::defaultBindGroupLayout()),
            .entryCount = 1,
            .entries = &bufferEntry,
        };
        dftBindGroup = wgpuDeviceCreateBindGroup(deviceObj->wgpuDevice, &bindGroupDesc);
    }
    return dftBindGroup;
}

} // namespace gfx
} // namespace cc
