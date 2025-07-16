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
#include "base/Assertf.h"

namespace cc {
namespace gfx {

namespace {
WGPUBindGroupLayout dftBindgroupLayout = wgpuDefaultHandle;

ccstd::unordered_map<ccstd::hash_t, WGPUBindGroupLayout> layoutPool;

ccstd::hash_t hash(const ccstd::vector<WGPUBindGroupLayoutEntry> &entries) {
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

bool checkInUse(uint8_t binding, const ccstd::set<uint8_t> &bindingInUse, bool samplerBinding) {
    bool res = bindingInUse.find(binding) != bindingInUse.end();
    if (!res && samplerBinding) {
        res |= bindingInUse.find(binding - CC_WGPU_MAX_ATTACHMENTS) != bindingInUse.end();
    }
    return res;
}

} // namespace

using namespace emscripten;

CCWGPUDescriptorSetLayout::CCWGPUDescriptorSetLayout() : DescriptorSetLayout() {
}

CCWGPUDescriptorSetLayout::~CCWGPUDescriptorSetLayout() {
    doDestroy();
}

void CCWGPUDescriptorSetLayout::doInit(const DescriptorSetLayoutInfo &info) {
    _gpuLayoutEntryObj = ccnew CCWGPUBindGroupLayoutObject;
    (void)defaultBindGroupLayout();
}

void CCWGPUDescriptorSetLayout::updateBufferLayout(uint8_t index, const CCWGPUBuffer *buffer, AccessFlags flags) {
    WGPUBindGroupLayoutEntry bufferEntry{};
    bufferEntry.binding = _bindings[index].binding;
    bufferEntry.visibility = toWGPUShaderStageFlag(_bindings[index].stageFlags);

    CC_ASSERT(buffer);

    WGPUBufferBindingLayout bufferLayout{};
    bool storageFlag = hasFlag(_bindings[index].descriptorType, DescriptorType::STORAGE_BUFFER | DescriptorType::DYNAMIC_STORAGE_BUFFER);
    if (storageFlag) {
        bufferLayout.type = flags > AccessFlagBit::PRESENT ? WGPUBufferBindingType_Storage : WGPUBufferBindingType_ReadOnlyStorage;
    } else {
        bufferLayout.type = WGPUBufferBindingType_Uniform;
    }
    bufferLayout.hasDynamicOffset = hasAnyFlags(_bindings[index].descriptorType, DescriptorType::DYNAMIC_STORAGE_BUFFER | DescriptorType::DYNAMIC_UNIFORM_BUFFER);

    bufferEntry.buffer = bufferLayout;
    _gpuLayoutEntryObj->bindGroupLayoutEntries[bufferEntry.binding] = bufferEntry;
}

namespace {
WGPUTextureFormat formatTraits(const CCWGPUTexture *texture, uint32_t plane) {
    if (texture->getFormat() == Format::DEPTH_STENCIL) {
        return plane ? WGPUTextureFormat_Stencil8 : WGPUTextureFormat_Depth24Plus;
    }
    return toWGPUTextureFormat(texture->getFormat());
}

WGPUTextureSampleType sampletypeTraits(const CCWGPUTexture *texture, uint32_t plane) {
    if (texture->getFormat() == Format::DEPTH_STENCIL) {
        return plane ? WGPUTextureSampleType_Uint : WGPUTextureSampleType_UnfilterableFloat;
    }
    return textureSampleTypeTrait(texture->getFormat());
}
} // namespace

void CCWGPUDescriptorSetLayout::updateSampledTextureLayout(uint8_t index, const CCWGPUTexture *texture, uint32_t plane) {
    WGPUBindGroupLayoutEntry textureEntry{};
    textureEntry.binding = _bindings[index].binding;
    textureEntry.visibility = toWGPUShaderStageFlag(_bindings[index].stageFlags);

    CC_ASSERT(texture);

        WGPUTextureBindingLayout textureLayout{};
        textureLayout.sampleType = sampletypeTraits(texture, plane); // textureSampleTypeTrait(texture->getFormat());
        const CCWGPUTexture *ccTex = static_cast<const CCWGPUTexture *>(texture->isTextureView() ? texture->getViewInfo().texture : texture);
        TextureType type = ccTex->getViewInfo().type;
        textureLayout.viewDimension = toWGPUTextureViewDimension(type);
        textureLayout.multisampled = ccTex->getInfo().samples != SampleCount::X1;
        textureEntry.texture = textureLayout;
    _gpuLayoutEntryObj->bindGroupLayoutEntries[textureEntry.binding] = textureEntry;
    }
void CCWGPUDescriptorSetLayout::updateStorageTextureLayout(uint8_t index, const CCWGPUTexture *texture, uint32_t plane) {
    WGPUBindGroupLayoutEntry textureEntry{};
    textureEntry.binding = _bindings[index].binding;
    textureEntry.visibility = toWGPUShaderStageFlag(_bindings[index].stageFlags);
    CC_ASSERT(texture);
    WGPUStorageTextureBindingLayout storageTextureLayout{};
    storageTextureLayout.access = WGPUStorageTextureAccess::WGPUStorageTextureAccess_WriteOnly;
    storageTextureLayout.format = formatTraits(texture, plane);
    TextureType type = texture->isTextureView() ? texture->getViewInfo().type : texture->getInfo().type;
    storageTextureLayout.viewDimension = toWGPUTextureViewDimension(type);
    textureEntry.storageTexture = storageTextureLayout;
    _gpuLayoutEntryObj->bindGroupLayoutEntries[textureEntry.binding] = textureEntry;
}

void CCWGPUDescriptorSetLayout::updateSamplerLayout(uint8_t index, const CCWGPUSampler *sampler) {
    WGPUBindGroupLayoutEntry samplerEntry{};
    samplerEntry.binding = _bindings[index].binding + CC_WGPU_MAX_ATTACHMENTS;
    samplerEntry.visibility = toWGPUShaderStageFlag(_bindings[index].stageFlags);

    CC_ASSERT(sampler);

    WGPUSamplerBindingLayout samplerLayout{};
    const SamplerInfo &info = sampler->getInfo();
    if ((info.minFilter == Filter::POINT || info.minFilter == Filter::NONE) &&
        (info.magFilter == Filter::POINT || info.magFilter == Filter::NONE) &&
        (info.mipFilter == Filter::POINT || info.mipFilter == Filter::NONE)) {
        samplerLayout.type = WGPUSamplerBindingType::WGPUSamplerBindingType_NonFiltering;
    } else {
        samplerLayout.type = WGPUSamplerBindingType::WGPUSamplerBindingType_Filtering;
    }
    samplerEntry.sampler = samplerLayout;

    _gpuLayoutEntryObj->bindGroupLayoutEntries[samplerEntry.binding] = samplerEntry;
}

void CCWGPUDescriptorSetLayout::print() const {
    size_t hashVal = _hash;
    printf("\npr this %p %p %zu\n", _gpuLayoutEntryObj, this, hashVal);
    const auto &entries = _gpuLayoutEntryObj->bindGroupLayoutEntries;
    for (const auto &[bd, entry] : entries) {
        if ((entry.buffer.type != WGPUBufferBindingType_Undefined) +
                (entry.sampler.type != WGPUSamplerBindingType_Undefined) +
                (entry.texture.sampleType != WGPUTextureSampleType_Undefined) +
                (entry.storageTexture.access != WGPUStorageTextureAccess_Undefined) !=
            1) {
            printf("******missing %d, %d, %d, %d, %d\n", entry.binding, entry.buffer.type, entry.sampler.type, entry.texture.sampleType, entry.storageTexture.access);
        }
        printf("%d, %d, %d\n", entry.binding, entry.visibility, static_cast<int>(entries.size()));
        if (entry.buffer.type != WGPUBufferBindingType_Undefined) {
            printf("b %d %d %llu\n", entry.buffer.type, entry.buffer.hasDynamicOffset ? 1 : 0, entry.buffer.minBindingSize);
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
    ccstd::vector<WGPUBindGroupLayoutEntry> bindGroupLayoutEntries{};
    bindGroupLayoutEntries.reserve(_gpuLayoutEntryObj->bindGroupLayoutEntries.size());
    for (const auto &[bd, layoutEntry] : _gpuLayoutEntryObj->bindGroupLayoutEntries) {
        if(checkInUse(static_cast<uint8_t>(bd), bindingInUse, layoutEntry.sampler.type != WGPUSamplerBindingType_Undefined)) {
            bindGroupLayoutEntries.emplace_back(layoutEntry);
        }
    }

    _hash = hash(bindGroupLayoutEntries);
    auto iter = layoutPool.find(_hash);
    if (iter != layoutPool.end()) {
        _gpuLayoutEntryObj->bindGroupLayout = iter->second;
        return;
    }

    const auto &entries = bindGroupLayoutEntries;
    if (entries.empty()) {
        _gpuLayoutEntryObj->bindGroupLayout = dftBindgroupLayout;
    } else {
        WGPUBindGroupLayoutDescriptor descriptor = {
            .nextInChain = nullptr,
            .label = "",//std::to_string(_hash).c_str(),
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
