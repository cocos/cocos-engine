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
    _gpuBindGroupObj = ccnew CCWGPUBindGroupObject;

    auto *dsLayout = static_cast<CCWGPUDescriptorSetLayout *>(_layout);
    CCWGPUBindGroupLayoutObject *layoutEntries = dsLayout->gpuLayoutEntryObject();
    const auto &bindings = dsLayout->getBindings();
    CCWGPUDeviceObject *deviceObj = CCWGPUDevice::getInstance()->gpuDeviceObject();
    for (size_t i = 0; i < bindings.size(); i++) {
        // effect.ts: INPUT_ATTACHMENT as combined texture but no sampler_texture desc type.
        if (hasFlag(COMBINED_ST_IN_USE, bindings[i].descriptorType)) {
            // 1. texture
            CCWGPUTexture *texture = deviceObj->defaultResources.commonTexture;
            WGPUBindGroupEntry texEntry = {
                .binding = bindings[i].binding,
                .textureView = texture->gpuTextureObject()->selfView,
            };
            _gpuBindGroupObj->bindGroupEntries.push_back(texEntry);
            _textureIdxMap.insert(std::make_pair<uint8_t, uint8_t>(bindings[i].binding, _gpuBindGroupObj->bindGroupEntries.size() - 1));
            dsLayout->updateTextureLayout(texEntry.binding, texture);

            // 2. sampler
            CCWGPUSampler *sampler = deviceObj->defaultResources.unfilterableSampler;
            WGPUBindGroupEntry smpEntry = {
                .binding = bindings[i].binding + CC_WGPU_MAX_ATTACHMENTS,
                .sampler = sampler->gpuSampler(),
            };
            _gpuBindGroupObj->bindGroupEntries.push_back(smpEntry);
            _samplerIdxMap.insert(std::make_pair<uint8_t, uint8_t>(bindings[i].binding, _gpuBindGroupObj->bindGroupEntries.size() - 1));
            dsLayout->updateSamplerLayout(smpEntry.binding, sampler);
        } else if (hasFlag(DESCRIPTOR_BUFFER_TYPE, bindings[i].descriptorType)) {
            CCWGPUBuffer *buffer = hasFlag(DescriptorType::DYNAMIC_STORAGE_BUFFER | DescriptorType::STORAGE_BUFFER, bindings[i].descriptorType)
                                       ? deviceObj->defaultResources.storageBuffer
                                       : deviceObj->defaultResources.uniformBuffer;
            WGPUBindGroupEntry bufferEntry = {
                .binding = bindings[i].binding,
                .buffer = buffer->gpuBufferObject()->wgpuBuffer,
                .size = buffer->getSize(),
                .offset = buffer->getOffset(),
            };

            if (hasAnyFlags(bindings[i].descriptorType, DescriptorType::DYNAMIC_STORAGE_BUFFER | DescriptorType::DYNAMIC_UNIFORM_BUFFER)) {
                _dynamicOffsets.push_back({bindings[i].binding, 0});
            }
            _gpuBindGroupObj->bindGroupEntries.push_back(bufferEntry);
        } else if (bindings[i].descriptorType == DescriptorType::STORAGE_IMAGE) {
            CCWGPUTexture *texture = deviceObj->defaultResources.storageTexture;
            WGPUBindGroupEntry texEntry = {
                .binding = bindings[i].binding,
                .textureView = texture->gpuTextureObject()->selfView,
            };
            _gpuBindGroupObj->bindGroupEntries.push_back(texEntry);
            dsLayout->updateTextureLayout(texEntry.binding, texture);
        } else if (bindings[i].descriptorType == DescriptorType::TEXTURE) {
            CCWGPUTexture *texture = deviceObj->defaultResources.commonTexture;
            WGPUBindGroupEntry texEntry = {
                .binding = bindings[i].binding,
                .textureView = texture->gpuTextureObject()->selfView,
            };
            _gpuBindGroupObj->bindGroupEntries.push_back(texEntry);
            dsLayout->updateTextureLayout(texEntry.binding, texture);
        } else if (bindings[i].descriptorType == DescriptorType::SAMPLER) {
            CCWGPUSampler *sampler = deviceObj->defaultResources.unfilterableSampler;
            WGPUBindGroupEntry smpEntry = {
                .binding = bindings[i].binding,
                .sampler = sampler->gpuSampler(),
            };
            _gpuBindGroupObj->bindGroupEntries.push_back(smpEntry);
            dsLayout->updateSamplerLayout(smpEntry.binding, sampler);
        } else {
            WGPUBindGroupEntry texEntry = {
                .binding = bindings[i].binding,
            };
            _gpuBindGroupObj->bindGroupEntries.push_back(texEntry);
        }
    }

    (void)defaultBindGroup();
}

ccstd::hash_t CCWGPUDescriptorSet::hash() const {
    ccstd::hash_t hash = 9527;
    for (const auto &bufferWrapper : _buffers) {
        auto *buffer = bufferWrapper.ptr;
        if (buffer) {
            auto *wgpuBuffer = static_cast<CCWGPUBuffer *>(buffer)->gpuBufferObject()->wgpuBuffer;
            ccstd::hash_combine(hash, wgpuBuffer);
        }
    }
    for (const auto &textureWrapper : _textures) {
        auto *texture = textureWrapper.ptr;
        if (texture) {
            auto *wgpuTextureView = static_cast<CCWGPUTexture *>(texture)->gpuTextureObject()->selfView;
            ccstd::hash_combine(hash, wgpuTextureView);
        }
    }
    for (const auto &samplerWrapper : _samplers) {
        auto *sampler = samplerWrapper.ptr;
        if (sampler) {
            auto *wgpuSampler = static_cast<CCWGPUSampler *>(sampler)->gpuSampler();
            ccstd::hash_combine(hash, wgpuSampler);
        }
    }
    return hash;
}

void CCWGPUDescriptorSet::doDestroy() {
    if (_gpuBindGroupObj) {
        delete _gpuBindGroupObj;
        _gpuBindGroupObj = nullptr;
    }
}

void CCWGPUDescriptorSet::update() {
    if (!_isDirty) {
        return;
    }
    auto *dsLayout = static_cast<CCWGPUDescriptorSetLayout *>(_layout);
    const auto &bindings = dsLayout->getBindings();

    for (size_t i = 0; i < bindings.size(); i++) {
        const auto &binding = bindings[i];
        uint8_t resourceIndex = _layout->getDescriptorIndices()[i];
        if (hasFlag(DESCRIPTOR_BUFFER_TYPE, bindings[i].descriptorType)) {
            if (_buffers[resourceIndex].ptr) {
                auto *buffer = static_cast<CCWGPUBuffer *>(_buffers[resourceIndex].ptr);
                auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries[i];
                buffer->check();
                bindGroupEntry.binding = binding.binding;
                bindGroupEntry.buffer = buffer->gpuBufferObject()->wgpuBuffer;
                bindGroupEntry.offset = buffer->getOffset();
                bindGroupEntry.size = buffer->getSize();
                dsLayout->updateBufferLayout(bindGroupEntry.binding, buffer);
                uint8_t bindIndex = binding.binding;
                if (hasAnyFlags(binding.descriptorType, DescriptorType::DYNAMIC_STORAGE_BUFFER | DescriptorType::DYNAMIC_UNIFORM_BUFFER)) {
                    auto iter = std::find_if(_dynamicOffsets.begin(), _dynamicOffsets.end(), [bindIndex](const std::pair<uint8_t, uint8_t> dynIndex) {
                        return dynIndex.first == bindIndex;
                    });
                    // assert(iter != _dynamicOffsets.end()); //can't happen
                    (*iter).second = 1;
                }
            }
        } else if (hasFlag(COMBINED_ST_IN_USE, bindings[i].descriptorType)) {
            auto texIter = _textureIdxMap.find(binding.binding);
            auto smpIter = _samplerIdxMap.find(binding.binding);
            // assert((texIter != _textureIdxMap.end()) + (smpIter != _samplerIdxMap.end()) == 1);
            uint8_t textureIdx = texIter != _textureIdxMap.end() ? texIter->second : 255;
            uint8_t samplerIdx = smpIter != _samplerIdxMap.end() ? smpIter->second : 255;

            if (textureIdx != 255 && _textures[resourceIndex].ptr) {
                auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries[textureIdx];
                auto *texture = static_cast<CCWGPUTexture *>(_textures[resourceIndex].ptr);
                bindGroupEntry.binding = binding.binding;
                bindGroupEntry.textureView = texture->gpuTextureObject()->selfView;
                dsLayout->updateTextureLayout(bindGroupEntry.binding, texture);
                _gpuBindGroupObj->bindingSet.insert(binding.binding);
            }
            if (samplerIdx != 255 && _samplers[resourceIndex].ptr) {
                auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries[samplerIdx];
                auto *sampler = static_cast<CCWGPUSampler *>(_samplers[resourceIndex].ptr);
                bindGroupEntry.binding = binding.binding + CC_WGPU_MAX_ATTACHMENTS;
                bindGroupEntry.sampler = sampler->gpuSampler();
                dsLayout->updateSamplerLayout(bindGroupEntry.binding, sampler);
                _gpuBindGroupObj->bindingSet.insert(binding.binding + CC_WGPU_MAX_ATTACHMENTS);
            }
        } else if (DescriptorType::STORAGE_IMAGE == bindings[i].descriptorType || DescriptorType::TEXTURE == bindings[i].descriptorType) {
            if (_textures[resourceIndex].ptr) {
                auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries[resourceIndex];
                auto *texture = static_cast<CCWGPUTexture *>(_textures[resourceIndex].ptr);
                bindGroupEntry.binding = binding.binding;
                bindGroupEntry.textureView = texture->gpuTextureObject()->selfView;
                dsLayout->updateTextureLayout(bindGroupEntry.binding, texture);
            }
        } else if (DescriptorType::SAMPLER == bindings[i].descriptorType) {
            auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries[resourceIndex];
            auto *sampler = static_cast<CCWGPUSampler *>(_samplers[resourceIndex].ptr);
            bindGroupEntry.binding = binding.binding;
            bindGroupEntry.sampler = sampler->gpuSampler();
            dsLayout->updateSamplerLayout(bindGroupEntry.binding, sampler);
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

    const auto &entries = _gpuBindGroupObj->bindGroupEntries;

    if (_isDirty || forceUpdate || !_gpuBindGroupObj->bindgroup) {
        auto *dsLayout = static_cast<CCWGPUDescriptorSetLayout *>(_layout);
        dsLayout->prepare(_gpuBindGroupObj->bindingSet, forceUpdate);

        // ccstd::vector<WGPUBindGroupEntry> bindGroupEntries;
        // bindGroupEntries.assign(_gpuBindGroupObj->bindGroupEntries.begin(), _gpuBindGroupObj->bindGroupEntries.end());
        // bindGroupEntries.erase(std::remove_if(
        //                            bindGroupEntries.begin(), bindGroupEntries.end(), [this, &bindGroupEntries](const WGPUBindGroupEntry &entry) {
        //                                return _gpuBindGroupObj->bindingSet.find(entry.binding) == _gpuBindGroupObj->bindingSet.end();
        //                            }),
        //                        bindGroupEntries.end());
        if (entries.empty()) {
            _gpuBindGroupObj->bindgroup = dftBindGroup;
            _bornHash = 0;
        } else {
            _hash = hash();
            auto iter = bindGroupMap.find(_hash);
            if (iter == bindGroupMap.end()) {
                // layout might be changed later.
                _bornHash = dsLayout->getHash();
                CCWGPUDeviceObject *deviceObj = CCWGPUDevice::getInstance()->gpuDeviceObject();
                // if (_gpuBindGroupObj->bindgroup && _gpuBindGroupObj->bindgroup != dftBindGroup) {
                //     wgpuBindGroupRelease(_gpuBindGroupObj->bindgroup);
                // }
                label = std::to_string(_bornHash);
                WGPUBindGroupDescriptor bindGroupDesc = {
                    .nextInChain = nullptr,
                    .label = label.c_str(),
                    .layout = dsLayout->gpuLayoutEntryObject()->bindGroupLayout,
                    .entryCount = entries.size(),
                    .entries = entries.data(),
                };

                _gpuBindGroupObj->bindgroup = wgpuDeviceCreateBindGroup(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &bindGroupDesc);
                // printf("create new bg\n");

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
                // printf("reuse bg\n");
            }
        }
    }
}

uint8_t CCWGPUDescriptorSet::dynamicOffsetCount() const {
    return _dynamicOffsets.size();
}

void *CCWGPUDescriptorSet::defaultBindGroup() {
    CCWGPUDeviceObject *deviceObj = CCWGPUDevice::getInstance()->gpuDeviceObject();

    if (!dftBindGroup) {
        CCWGPUBuffer *buffer = deviceObj->defaultResources.uniformBuffer;
        WGPUBindGroupEntry bufferEntry = {
            .binding = 0,
            .buffer = buffer->gpuBufferObject()->wgpuBuffer,
            .size = buffer->getSize(),
            .offset = buffer->getOffset(),
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
