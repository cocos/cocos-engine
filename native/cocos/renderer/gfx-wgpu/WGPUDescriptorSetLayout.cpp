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

namespace anoymous {
WGPUBindGroupLayout defaultBindgroupLayout = wgpuDefaultHandle;

ccstd::unordered_map<ccstd::hash_t, WGPUBindGroupLayout> layoutPool;
} // namespace anoymous

using namespace emscripten;
using namespace anoymous;

CCWGPUDescriptorSetLayout::CCWGPUDescriptorSetLayout() : DescriptorSetLayout() {
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

    (void)hash();
}

void CCWGPUDescriptorSetLayout::updateLayout(uint8_t binding, const CCWGPUBuffer *buffer, const CCWGPUTexture *tex, const CCWGPUSampler *sampler) {
    auto iter = std::find_if(_gpuLayoutEntryObj->bindGroupLayoutEntries.begin(), _gpuLayoutEntryObj->bindGroupLayoutEntries.end(), [binding](const WGPUBindGroupLayoutEntry &entry) {
        return entry.binding == binding;
    });

    if (iter != _gpuLayoutEntryObj->bindGroupLayoutEntries.end()) {
        if (buffer) {
            //
        }
        if (sampler) {
            bool flag = false;
            const SamplerInfo &info = sampler->getInfo();
            if ((info.minFilter == Filter::POINT || info.minFilter == Filter::NONE) &&
                (info.magFilter == Filter::POINT || info.magFilter == Filter::NONE) &&
                (info.mipFilter == Filter::POINT || info.mipFilter == Filter::NONE)) {
                (*iter).sampler.type = WGPUSamplerBindingType::WGPUSamplerBindingType_NonFiltering;
                flag = true;
            } else {
                (*iter).sampler.type = WGPUSamplerBindingType::WGPUSamplerBindingType_Filtering;
            }
        }
        if (tex) {
            if (tex->getInfo().usage == TextureUsageBit::STORAGE) {
                (*iter).storageTexture.nextInChain = nullptr;
                (*iter).storageTexture.access = WGPUStorageTextureAccess::WGPUStorageTextureAccess_WriteOnly;
                (*iter).storageTexture.format = toWGPUTextureFormat(tex->getFormat());
                TextureType type = tex->isTextureView() ? tex->getViewInfo().type : tex->getInfo().type;
                (*iter).storageTexture.viewDimension = toWGPUTextureViewDimension(type);
            } else {
                (*iter).texture.nextInChain = nullptr;
                (*iter).texture.sampleType = textureSampleTypeTrait(tex->getFormat());
                const CCWGPUTexture *ccTex = static_cast<const CCWGPUTexture *>(tex->isTextureView() ? tex->getViewInfo().texture : tex);
                TextureType type = ccTex->getViewInfo().type;
                (*iter).texture.viewDimension = toWGPUTextureViewDimension(type);
                (*iter).texture.multisampled = ccTex->getInfo().samples != SampleCount::ONE;
            }
        }
        _internalChanged = true;
    }
}

ccstd::hash_t CCWGPUDescriptorSetLayout::hash() {
    const auto &entries = _gpuLayoutEntryObj->bindGroupLayoutEntries;
    _hash = entries.size() * 12 + 1;
    ccstd::hash_combine(_hash, entries.size());
    for (size_t i = 0; i < entries.size(); i++) {
        ccstd::hash_combine(_hash, i);
        ccstd::hash_combine(_hash, entries[i].binding);
        ccstd::hash_combine(_hash, entries[i].visibility);
        ccstd::hash_combine(_hash, entries[i].buffer.type);
        ccstd::hash_combine(_hash, entries[i].buffer.hasDynamicOffset);
        ccstd::hash_combine(_hash, entries[i].buffer.minBindingSize);
        ccstd::hash_combine(_hash, entries[i].sampler.type);
        ccstd::hash_combine(_hash, entries[i].texture.sampleType);
        ccstd::hash_combine(_hash, entries[i].texture.viewDimension);
        ccstd::hash_combine(_hash, entries[i].texture.multisampled);
        ccstd::hash_combine(_hash, entries[i].storageTexture.access);
        ccstd::hash_combine(_hash, entries[i].storageTexture.format);
        ccstd::hash_combine(_hash, entries[i].storageTexture.viewDimension);
    }
    return _hash;
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
    if (_gpuLayoutEntryObj->bindGroupLayout && !forceUpdate) {
        return;
    }
    // ccstd::vector<WGPUBindGroupLayoutEntry> bindGroupLayoutEntries;
    // bindGroupLayoutEntries.assign(_gpuLayoutEntryObj->bindGroupLayoutEntries.begin(), _gpuLayoutEntryObj->bindGroupLayoutEntries.end());
    // bindGroupLayoutEntries.erase(std::remove_if(
    //                                  bindGroupLayoutEntries.begin(), bindGroupLayoutEntries.end(), [&bindingInUse, &bindGroupLayoutEntries](const WGPUBindGroupLayoutEntry &entry) {
    //                                      return bindingInUse.find(entry.binding) == bindingInUse.end();
    //                                  }),
    //                              bindGroupLayoutEntries.end());

    size_t hashVal = _hash || _internalChanged ? hash() : _hash;
    auto iter = layoutPool.find(hashVal);
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
        _gpuLayoutEntryObj->bindGroupLayout = anoymous::defaultBindgroupLayout;
    } else {
        static uint64_t counter = 0;
        WGPUBindGroupLayoutDescriptor descriptor = {
            .nextInChain = nullptr,
            .label = (std::to_string(_objectID) + " " + std::to_string(counter++)).c_str(),
            .entryCount = entries.size(),
            .entries = entries.data(),
        };
        _gpuLayoutEntryObj->bindGroupLayout = wgpuDeviceCreateBindGroupLayout(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
        layoutPool.insert({hashVal, _gpuLayoutEntryObj->bindGroupLayout});
    }
}

void *CCWGPUDescriptorSetLayout::defaultBindGroupLayout() {
    if (!anoymous::defaultBindgroupLayout) {
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
        anoymous::defaultBindgroupLayout = wgpuDeviceCreateBindGroupLayout(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
    }
    return anoymous::defaultBindgroupLayout;
}

void CCWGPUDescriptorSetLayout::doDestroy() {
    delete _gpuLayoutEntryObj;
}

} // namespace gfx
} // namespace cc
