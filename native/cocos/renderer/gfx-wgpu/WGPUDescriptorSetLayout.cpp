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

#include "WGPUDescriptorSetLayout.h"
#include <emscripten/html5_webgpu.h>
#include <algorithm>
#include <boost/functional/hash.hpp>
#include "WGPUBuffer.h"
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUSampler.h"
#include "WGPUTexture.h"
#include "WGPUUtils.h"

namespace cc {
namespace gfx {

namespace {
WGPUBindGroupLayout dftBindgroupLayout = wgpuDefaultHandle;

ccstd::unordered_map<ccstd::hash_t, WGPUBindGroupLayout> layoutPool;
} // namespace

using namespace emscripten;

CCWGPUDescriptorSetLayout::CCWGPUDescriptorSetLayout() : DescriptorSetLayout() {
}

CCWGPUDescriptorSetLayout::~CCWGPUDescriptorSetLayout() {
    doDestroy();
}

void CCWGPUDescriptorSetLayout::doInit(const DescriptorSetLayoutInfo &info) {
    _gpuLayoutEntryObj = ccnew CCWGPUBindGroupLayoutObject;
    for (size_t i = 0; i < _bindings.size(); i++) {
        if (_bindings[i].descriptorType == DescriptorType::UNKNOWN)
            continue;
        if (hasFlag(COMBINED_ST_IN_USE, _bindings[i].descriptorType)) {
            // 1. texture
            WGPUBindGroupLayoutEntry textureLayout = {
                .nextInChain = nullptr,
                .binding = _bindings[i].binding,
                .visibility = toWGPUShaderStageFlag(_bindings[i].stageFlags),
                .texture.sampleType = WGPUTextureSampleType_Float,
                .texture.viewDimension = WGPUTextureViewDimension_2D,
            };
            _gpuLayoutEntryObj->bindGroupLayoutEntries.push_back(textureLayout);

            // 2. sampler
            WGPUBindGroupLayoutEntry samplerLayout = {
                .nextInChain = nullptr,
                .binding = _bindings[i].binding + CC_WGPU_MAX_ATTACHMENTS,
                .visibility = toWGPUShaderStageFlag(_bindings[i].stageFlags),
                .sampler.type = WGPUSamplerBindingType_NonFiltering,
            };
            _gpuLayoutEntryObj->bindGroupLayoutEntries.push_back(samplerLayout);
        } else if (hasFlag(DESCRIPTOR_BUFFER_TYPE, _bindings[i].descriptorType)) {
            bool hasDynamicOffset = hasAnyFlags(_bindings[i].descriptorType, DescriptorType::DYNAMIC_STORAGE_BUFFER | DescriptorType::DYNAMIC_UNIFORM_BUFFER);
            _dynamicOffsetCount += (hasDynamicOffset);
            if (hasFlag(_bindings[i].descriptorType, DescriptorType::STORAGE_BUFFER | DescriptorType::DYNAMIC_STORAGE_BUFFER)) {
                WGPUBindGroupLayoutEntry layout = {
                    .nextInChain = nullptr,
                    .binding = _bindings[i].binding,
                    .visibility = toWGPUShaderStageFlag(_bindings[i].stageFlags),
                    .buffer = {nullptr, WGPUBufferBindingType::WGPUBufferBindingType_Storage, hasDynamicOffset, 0},
                };
                _gpuLayoutEntryObj->bindGroupLayoutEntries.push_back(layout);
            } else if (hasFlag(_bindings[i].descriptorType, DescriptorType::UNIFORM_BUFFER | DescriptorType::DYNAMIC_UNIFORM_BUFFER)) {
                WGPUBindGroupLayoutEntry layout = {
                    .nextInChain = nullptr,
                    .binding = _bindings[i].binding,
                    .visibility = toWGPUShaderStageFlag(_bindings[i].stageFlags),
                    .buffer = {nullptr, WGPUBufferBindingType::WGPUBufferBindingType_Uniform, hasDynamicOffset, 0},
                };
                _gpuLayoutEntryObj->bindGroupLayoutEntries.push_back(layout);
            } else {
                printf("unsupport buffer descriptor type.");
            }
        } else if (_bindings[i].descriptorType == DescriptorType::SAMPLER) {
            WGPUBindGroupLayoutEntry layout = {
                .nextInChain = nullptr,
                .binding = _bindings[i].binding,
                .visibility = toWGPUShaderStageFlag(_bindings[i].stageFlags),
                .sampler = {nullptr, WGPUSamplerBindingType::WGPUSamplerBindingType_NonFiltering},
            };
            _gpuLayoutEntryObj->bindGroupLayoutEntries.push_back(layout);
        } else if (_bindings[i].descriptorType == DescriptorType::STORAGE_IMAGE) {
            WGPUBindGroupLayoutEntry layout = {
                .nextInChain = nullptr,
                .binding = _bindings[i].binding,
                .visibility = toWGPUShaderStageFlag(_bindings[i].stageFlags),
                .storageTexture = {
                    nullptr,
                    WGPUStorageTextureAccess::WGPUStorageTextureAccess_WriteOnly,
                    WGPUTextureFormat::WGPUTextureFormat_RGBA8Unorm,
                    WGPUTextureViewDimension::WGPUTextureViewDimension_2D,
                },
            };
            _gpuLayoutEntryObj->bindGroupLayoutEntries.push_back(layout);
        } else {
            WGPUBindGroupLayoutEntry layout = {
                .nextInChain = nullptr,
                .binding = _bindings[i].binding,
                .visibility = toWGPUShaderStageFlag(_bindings[i].stageFlags),
            };
            _gpuLayoutEntryObj->bindGroupLayoutEntries.push_back(layout);
        }
    }

    (void)defaultBindGroupLayout();

    _hash = hash();
}

void CCWGPUDescriptorSetLayout::updateBufferLayout(uint8_t binding, const CCWGPUBuffer *buffer) {
    // auto iter = std::find_if(_gpuLayoutEntryObj->bindGroupLayoutEntries.begin(), _gpuLayoutEntryObj->bindGroupLayoutEntries.end(), [binding](const WGPUBindGroupLayoutEntry &entry) {
    //     return entry.binding == binding;
    // });

    // if (iter != _gpuLayoutEntryObj->bindGroupLayoutEntries.end()) {
    //     auto bindingIter = std::find_if(_bindings.begin(), _bindings.end(), [binding](const auto &binding) {
    //         return binding.binding == binding;
    //     });
    // }

    // _internalChanged = true;
}

void CCWGPUDescriptorSetLayout::updateTextureLayout(uint8_t binding, const CCWGPUTexture *texture) {
    auto iter = std::find_if(_gpuLayoutEntryObj->bindGroupLayoutEntries.begin(), _gpuLayoutEntryObj->bindGroupLayoutEntries.end(), [binding](const WGPUBindGroupLayoutEntry &entry) {
        return entry.binding == binding;
    });

    if (iter != _gpuLayoutEntryObj->bindGroupLayoutEntries.end()) {
        auto bindingIter = std::find_if(_bindings.begin(), _bindings.end(), [binding](const auto &bindingElem) {
            return bindingElem.binding == binding;
        });
        if (texture) {
            if (texture->getInfo().usage == TextureUsageBit::STORAGE) {
                (*iter).storageTexture.nextInChain = nullptr;
                (*iter).storageTexture.access = WGPUStorageTextureAccess::WGPUStorageTextureAccess_WriteOnly;
                (*iter).storageTexture.format = toWGPUTextureFormat(texture->getFormat());
                TextureType type = texture->isTextureView() ? texture->getViewInfo().type : texture->getInfo().type;
                (*iter).storageTexture.viewDimension = toWGPUTextureViewDimension(type);
            } else {
                (*iter).texture.nextInChain = nullptr;
                (*iter).texture.sampleType = textureSampleTypeTrait(texture->getFormat());
                const CCWGPUTexture *ccTex = static_cast<const CCWGPUTexture *>(texture->isTextureView() ? texture->getViewInfo().texture : texture);
                TextureType type = ccTex->getViewInfo().type;
                (*iter).texture.viewDimension = toWGPUTextureViewDimension(type);
                (*iter).texture.multisampled = ccTex->getInfo().samples != SampleCount::ONE;
            }
        } else {
            (*iter).texture.nextInChain = nullptr;
            (*iter).texture.sampleType = WGPUTextureSampleType::WGPUTextureSampleType_Float;
            (*iter).texture.viewDimension = WGPUTextureViewDimension::WGPUTextureViewDimension_2D;
            (*iter).texture.multisampled = false;
        }
        _internalChanged = true;
    }
}

void CCWGPUDescriptorSetLayout::updateSamplerLayout(uint8_t binding, const CCWGPUSampler *sampler) {
    auto iter = std::find_if(_gpuLayoutEntryObj->bindGroupLayoutEntries.begin(), _gpuLayoutEntryObj->bindGroupLayoutEntries.end(), [binding](const WGPUBindGroupLayoutEntry &entry) {
        return entry.binding == binding;
    });

    if (iter != _gpuLayoutEntryObj->bindGroupLayoutEntries.end()) {
        auto bindingIter = std::find_if(_bindings.begin(), _bindings.end(), [binding](const auto &bindingElem) {
            return bindingElem.binding == binding;
        });
        if (sampler) {
            const SamplerInfo &info = sampler->getInfo();
            if ((info.minFilter == Filter::POINT || info.minFilter == Filter::NONE) &&
                (info.magFilter == Filter::POINT || info.magFilter == Filter::NONE) &&
                (info.mipFilter == Filter::POINT || info.mipFilter == Filter::NONE)) {
                (*iter).sampler.type = WGPUSamplerBindingType::WGPUSamplerBindingType_NonFiltering;
            } else {
                (*iter).sampler.type = WGPUSamplerBindingType::WGPUSamplerBindingType_Filtering;
            }
        } else {
            (*iter).sampler.type = WGPUSamplerBindingType::WGPUSamplerBindingType_NonFiltering;
        }
        _internalChanged = true;
    }
}

ccstd::hash_t CCWGPUDescriptorSetLayout::hash() const {
    const auto &entries = _gpuLayoutEntryObj->bindGroupLayoutEntries;
    ccstd::hash_t hash = 9527;
    ccstd::hash_combine(hash, entries.size());
    for (size_t i = 0; i < entries.size(); i++) {
        ccstd::hash_combine(hash, i);
        ccstd::hash_combine(hash, entries[i].binding);
        ccstd::hash_combine(hash, entries[i].visibility);
        if (entries[i].buffer.type != WGPUBufferBindingType_Undefined) {
            ccstd::hash_combine(hash, entries[i].buffer.type);
            ccstd::hash_combine(hash, entries[i].buffer.hasDynamicOffset);
            ccstd::hash_combine(hash, entries[i].buffer.minBindingSize);
        }
        if (entries[i].sampler.type != WGPUSamplerBindingType_Undefined) {
            ccstd::hash_combine(hash, entries[i].sampler.type);
        }
        if (entries[i].texture.sampleType != WGPUTextureSampleType_Undefined) {
            ccstd::hash_combine(hash, entries[i].texture.sampleType);
            ccstd::hash_combine(hash, entries[i].texture.viewDimension);
            ccstd::hash_combine(hash, entries[i].texture.multisampled);
        }
        if (entries[i].storageTexture.access != WGPUStorageTextureAccess_Undefined) {
            ccstd::hash_combine(hash, entries[i].storageTexture.access);
            ccstd::hash_combine(hash, entries[i].storageTexture.format);
            ccstd::hash_combine(hash, entries[i].storageTexture.viewDimension);
        }
    }
    return hash;
}

void CCWGPUDescriptorSetLayout::print() const {
    size_t hashVal = _hash;
    printf("\npr this %p %p %zu\n", _gpuLayoutEntryObj, this, hashVal);
    const auto &entries = _gpuLayoutEntryObj->bindGroupLayoutEntries;
    for (size_t j = 0; j < entries.size(); j++) {
        const auto &entry = entries[j];
        if ((entry.buffer.type != WGPUBufferBindingType_Undefined) +
                (entry.sampler.type != WGPUSamplerBindingType_Undefined) +
                (entry.texture.sampleType != WGPUTextureSampleType_Undefined) +
                (entry.storageTexture.access != WGPUStorageTextureAccess_Undefined) !=
            1) {
            printf("******missing %d, %d, %d, %d, %d\n", entry.binding, entry.buffer.type, entry.sampler.type, entry.texture.sampleType, entry.storageTexture.access);
        }
        printf("%d, %d\n", entry.binding, entry.visibility);
        if (entry.buffer.type != WGPUBufferBindingType_Undefined) {
            printf("b %d %d %d\n", entry.buffer.type, entry.buffer.hasDynamicOffset ? 1 : 0, entry.buffer.minBindingSize);
        }
        if (entry.sampler.type != WGPUSamplerBindingType_Undefined) {
            printf("s %d\n", entry.sampler.type);
        }
        if (entry.texture.sampleType != WGPUTextureSampleType_Undefined) {
            printf("t %d %d %d\n", entry.texture.sampleType, entry.texture.viewDimension, entry.texture.multisampled ? 1 : 0);
        }
        if (entry.storageTexture.access != WGPUStorageTextureAccess_Undefined) {
            printf("st %d %d %d\n", entry.storageTexture.access, entry.storageTexture.format, entry.storageTexture.viewDimension);
        }
    }
}

void CCWGPUDescriptorSetLayout::prepare(ccstd::set<uint8_t> &bindingInUse, bool forceUpdate) {
    // if (_gpuLayoutEntryObj->bindGroupLayout && !forceUpdate) {
    //     return;
    // }
    // ccstd::vector<WGPUBindGroupLayoutEntry> bindGroupLayoutEntries;
    // bindGroupLayoutEntries.assign(_gpuLayoutEntryObj->bindGroupLayoutEntries.begin(), _gpuLayoutEntryObj->bindGroupLayoutEntries.end());
    // bindGroupLayoutEntries.erase(std::remove_if(
    //                                  bindGroupLayoutEntries.begin(), bindGroupLayoutEntries.end(), [&bindingInUse, &bindGroupLayoutEntries](const WGPUBindGroupLayoutEntry &entry) {
    //                                      return bindingInUse.find(entry.binding) == bindingInUse.end();
    //                                  }),
    //                              bindGroupLayoutEntries.end());

    _hash = hash();
    auto iter = layoutPool.find(_hash);
    // printf("dsl upd %zu\n", _hash);
    if (iter != layoutPool.end()) {
        _gpuLayoutEntryObj->bindGroupLayout = iter->second;
        return;
    }
    const auto &entries = _gpuLayoutEntryObj->bindGroupLayoutEntries;

    // for (size_t j = 0; j < entries.size(); j++) {
    //     const auto& entry = entries[j];
    //     if ((entry.buffer.type != WGPUBufferBindingType_Undefined) +
    //             (entry.sampler.type != WGPUSamplerBindingType_Undefined) +
    //             (entry.texture.sampleType != WGPUTextureSampleType_Undefined) +
    //             (entry.storageTexture.access != WGPUStorageTextureAccess_Undefined) !=
    //         1) {
    //         printf("******missing %d, %d, %d, %d, %d\n", entry.binding, entry.buffer.type, entry.sampler.type, entry.texture.sampleType, entry.storageTexture.access);
    //     }
    //     // printf("l binding, b, t, s  %d, %d, %d, %d, %d\n", entry.binding, entry.buffer.type, entry.sampler.type, entry.texture.sampleType, entry.storageTexture.access);
    // }

    if (entries.empty()) {
        _gpuLayoutEntryObj->bindGroupLayout = dftBindgroupLayout;
    } else {
        WGPUBindGroupLayoutDescriptor descriptor = {
            .nextInChain = nullptr,
            .label = std::to_string(_hash).c_str(),
            .entryCount = entries.size(),
            .entries = entries.data(),
        };
        _gpuLayoutEntryObj->bindGroupLayout = wgpuDeviceCreateBindGroupLayout(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
        printf("create new bglayout\n");
    }
    layoutPool.insert({_hash, _gpuLayoutEntryObj->bindGroupLayout});
}

void *CCWGPUDescriptorSetLayout::getBindGroupLayoutByHash(ccstd::hash_t hash) {
    void *ret = nullptr;
    auto iter = layoutPool.find(hash);
    if (iter != layoutPool.end()) {
        ret = iter->second;
    }
    return ret;
}

void *CCWGPUDescriptorSetLayout::defaultBindGroupLayout() {
    if (!dftBindgroupLayout) {
        // default bindgroupLayout: for empty set
        WGPUBindGroupLayoutEntry layout = {
            .nextInChain = nullptr,
            .binding = 0,
            .visibility = WGPUShaderStage_Vertex | WGPUShaderStage_Fragment | WGPUShaderStage_Compute,
            .buffer = {nullptr, WGPUBufferBindingType::WGPUBufferBindingType_Uniform, false, 0},
        };

        WGPUBindGroupLayoutDescriptor descriptor = {
            .nextInChain = nullptr,
            .label = "defaultBindgroupLayout",
            .entryCount = 1,
            .entries = &layout,
        };
        dftBindgroupLayout = wgpuDeviceCreateBindGroupLayout(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
    }
    return dftBindgroupLayout;
}

void CCWGPUDescriptorSetLayout::doDestroy() {
    if (_gpuLayoutEntryObj) {
        delete _gpuLayoutEntryObj;
        _gpuLayoutEntryObj = nullptr;
    }
}

} // namespace gfx
} // namespace cc
