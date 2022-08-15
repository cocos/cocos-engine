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
} // namespace

thread_local ccstd::unordered_map<ccstd::hash_t, void *> CCWGPUDescriptorSet::_bindGroupMap;

CCWGPUDescriptorSet::CCWGPUDescriptorSet() : DescriptorSet() {
}

CCWGPUDescriptorSet::~CCWGPUDescriptorSet() {
    doDestroy();
}

void CCWGPUDescriptorSet::clearCache() {
    if (!_bindGroupMap.empty()) {
        _bindGroupMap.clear();
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
    for (const auto &buffer : _buffers) {
        if (buffer) {
            auto *wgpuBuffer = static_cast<CCWGPUBuffer *>(buffer)->gpuBufferObject()->wgpuBuffer;
            ccstd::hash_combine(hash, wgpuBuffer);
        }
    }
    for (const auto &texture : _textures) {
        if (texture) {
            auto *wgpuTextureView = static_cast<CCWGPUTexture *>(texture)->gpuTextureObject()->selfView;
            ccstd::hash_combine(hash, wgpuTextureView);
        }
    }
    for (const auto &sampler : _samplers) {
        if (sampler) {
            auto *wgpuSampler = static_cast<CCWGPUSampler *>(sampler)->gpuSampler();
            ccstd::hash_combine(hash, wgpuSampler);
        }
    }
    return hash;
}

void CCWGPUDescriptorSet::doDestroy() {
    delete _gpuBindGroupObj;
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
            if (_buffers[resourceIndex]) {
                auto *buffer = static_cast<CCWGPUBuffer *>(_buffers[resourceIndex]);
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

            if (textureIdx != 255 && _textures[resourceIndex]) {
                auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries[textureIdx];
                auto *texture = static_cast<CCWGPUTexture *>(_textures[resourceIndex]);
                bindGroupEntry.binding = binding.binding;
                bindGroupEntry.textureView = texture->gpuTextureObject()->selfView;
                dsLayout->updateTextureLayout(bindGroupEntry.binding, texture);
                _gpuBindGroupObj->bindingSet.insert(binding.binding);
            }
            if (samplerIdx != 255 && _samplers[resourceIndex]) {
                auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries[samplerIdx];
                auto *sampler = static_cast<CCWGPUSampler *>(_samplers[resourceIndex]);
                bindGroupEntry.binding = binding.binding + CC_WGPU_MAX_ATTACHMENTS;
                bindGroupEntry.sampler = sampler->gpuSampler();
                dsLayout->updateSamplerLayout(bindGroupEntry.binding, sampler);
                _gpuBindGroupObj->bindingSet.insert(binding.binding + CC_WGPU_MAX_ATTACHMENTS);
            }
        } else if (DescriptorType::STORAGE_IMAGE == bindings[i].descriptorType || DescriptorType::TEXTURE == bindings[i].descriptorType) {
            if (_textures[resourceIndex]) {
                auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries[resourceIndex];
                auto *texture = static_cast<CCWGPUTexture *>(_textures[resourceIndex]);
                bindGroupEntry.binding = binding.binding;
                bindGroupEntry.textureView = texture->gpuTextureObject()->selfView;
                dsLayout->updateTextureLayout(bindGroupEntry.binding, texture);
            }
        } else if (DescriptorType::SAMPLER == bindings[i].descriptorType) {
            auto &bindGroupEntry = _gpuBindGroupObj->bindGroupEntries[resourceIndex];
            auto *sampler = static_cast<CCWGPUSampler *>(_samplers[resourceIndex]);
            bindGroupEntry.binding = binding.binding;
            bindGroupEntry.sampler = sampler->gpuSampler();
            dsLayout->updateSamplerLayout(bindGroupEntry.binding, sampler);
        } else {
            printf("*******unexpected binding type detected!\n");
        }
    }
}

void CCWGPUDescriptorSet::prepare() {
    auto buffIter = std::find_if(_buffers.begin(), _buffers.end(), [](const Buffer *buffer) {
        return buffer && static_cast<const CCWGPUBuffer *>(buffer)->internalChanged();
    });
    auto texIter = std::find_if(_textures.begin(), _textures.end(), [](const Texture *texture) {
        return texture && static_cast<const CCWGPUTexture *>(texture)->internalChanged();
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
        } else {
            _hash = hash();
            auto iter = _bindGroupMap.find(_hash);
            if (iter == _bindGroupMap.end()) {
                // layout might be changed later.
                _bornHash = dsLayout->getHash();
                CCWGPUDeviceObject *deviceObj = CCWGPUDevice::getInstance()->gpuDeviceObject();
                // if (_gpuBindGroupObj->bindgroup && _gpuBindGroupObj->bindgroup != dftBindGroup) {
                //     wgpuBindGroupRelease(_gpuBindGroupObj->bindgroup);
                // }

                WGPUBindGroupDescriptor bindGroupDesc = {
                    .nextInChain = nullptr,
                    .label = nullptr,
                    .layout = dsLayout->gpuLayoutEntryObject()->bindGroupLayout,
                    .entryCount = entries.size(),
                    .entries = entries.data(),
                };

                _gpuBindGroupObj->bindgroup = wgpuDeviceCreateBindGroup(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &bindGroupDesc);
                // printf("create new bg\n");

                _isDirty = false;
                if (buffIter != _buffers.end())
                    std::for_each(_buffers.begin(), _buffers.end(), [](Buffer *buffer) {
                        if (buffer)
                            static_cast<CCWGPUBuffer *>(buffer)->stamp();
                    });
                if (texIter != _textures.end())
                    std::for_each(_textures.begin(), _textures.end(), [](Texture *texture) {
                        if (texture)
                            static_cast<CCWGPUTexture *>(texture)->stamp();
                    });

                _bindGroupMap.insert(std::make_pair(_hash, _gpuBindGroupObj->bindgroup));
                CCWGPUDevice::getInstance()->destroyLater(_gpuBindGroupObj->bindgroup);
            } else {
                _gpuBindGroupObj->bindgroup = static_cast<WGPUBindGroup>(iter->second);
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
