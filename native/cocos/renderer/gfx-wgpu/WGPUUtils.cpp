/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

#include "WGPUUtils.h"
#include "WGPUCommandBuffer.h"
#include "WGPUDescriptorSet.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUPipelineLayout.h"
#include "WGPUTexture.h"

namespace cc::gfx {

void createPipelineLayoutFallback(const ccstd::vector<DescriptorSet*>& descriptorSets, PipelineLayout* pipelineLayout, bool skipEmpty) {
    ccstd::hash_t hash = descriptorSets.size() * 2 + 1;
    ccstd::hash_combine(hash, descriptorSets.size());
    std::string label = "";
    ccstd::vector<WGPUBindGroupLayout> descriptorSetLayouts;
    for (size_t i = 0; i < descriptorSets.size(); ++i) {
        auto* descriptorSet = static_cast<CCWGPUDescriptorSet*>(descriptorSets[i]);
        if (descriptorSet && descriptorSet->getHash() != 0) {
            auto* tLayout = const_cast<DescriptorSetLayout*>(descriptorSet->getLayout());
            auto* descriptorSetLayout = static_cast<CCWGPUDescriptorSetLayout*>(tLayout);
            auto* wgpuBindGroupLayout = static_cast<WGPUBindGroupLayout>(CCWGPUDescriptorSetLayout::getBindGroupLayoutByHash(descriptorSet->getHash()));
            descriptorSetLayouts.push_back(wgpuBindGroupLayout);
            ccstd::hash_combine(hash, i);
            ccstd::hash_combine(hash, descriptorSet->getHash());
            //label += std::to_string(descriptorSet->getHash()) + "-" + descriptorSet->label + "-" + std::to_string(descriptorSetLayout->getHash()) + " ";
        } else if (!skipEmpty) {
            auto bindgroup = static_cast<WGPUBindGroupLayout>(CCWGPUDescriptorSetLayout::defaultBindGroupLayout());
            descriptorSetLayouts.push_back(bindgroup);
            ccstd::hash_combine(hash, i);
        }
    }

    auto* ccPipelineLayout = static_cast<CCWGPUPipelineLayout*>(pipelineLayout);
    WGPUPipelineLayoutDescriptor descriptor = {
        .nextInChain = nullptr,
        .label = label.c_str(),
        .bindGroupLayoutCount = descriptorSetLayouts.size(),
        .bindGroupLayouts = descriptorSetLayouts.data(),
    };

    auto iter = ccPipelineLayout->layoutMap.find(hash);
    if (iter == ccPipelineLayout->layoutMap.end()) {
        ccPipelineLayout->layoutMap[hash] = wgpuDeviceCreatePipelineLayout(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &descriptor);
        ccPipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout = static_cast<WGPUPipelineLayout>(ccPipelineLayout->layoutMap[hash]);
        printf("create new ppl\n");
    } else {
        ccPipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout = static_cast<WGPUPipelineLayout>(iter->second);
    }
    ccPipelineLayout->_hash = hash;
}

namespace {
struct ClearPassData {
    WGPUShaderModule vertShader = wgpuDefaultHandle;
    WGPUShaderModule fragShader = wgpuDefaultHandle;
    WGPUBindGroupLayout bindGroupLayout = wgpuDefaultHandle;
    WGPUPipelineLayout pipelineLayout = wgpuDefaultHandle;
    WGPURenderPipeline pipeline = wgpuDefaultHandle;
};

struct MipmapPassData {
    WGPUShaderModule vertShader = wgpuDefaultHandle;
    WGPUShaderModule fragShader = wgpuDefaultHandle;
    WGPUSampler sampler = wgpuDefaultHandle;
    WGPUBindGroupLayout bindGroupLayout = wgpuDefaultHandle;
    WGPUPipelineLayout pipelineLayout = wgpuDefaultHandle;
    WGPURenderPipeline pipeline = wgpuDefaultHandle;
};

// no need to release
thread_local MipmapPassData mipmapData;
thread_local ClearPassData clearPassData;
} // namespace

#pragma region FIXED_PIPELINE
void clearRect(CommandBuffer* cmdBuff, Texture* texture, const Rect& renderArea, const Color& color) {
    auto wgpuDevice = CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice;
    auto* ccTexture = static_cast<CCWGPUTexture*>(texture);
    auto format = toWGPUTextureFormat(ccTexture->getFormat());
    auto dimension = toWGPUTextureDimension(ccTexture->getTextureType());
    auto wgpuTextureView = ccTexture->gpuTextureObject()->selfView;

    if (!clearPassData.vertShader) {
        const char* clearQuadVert = R"(
struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
}

@vertex
fn vert_main(@builtin(vertex_index) VertexIndex : u32) -> VertexOutput {
  var pos = array<vec2<f32>, 6>(
    vec2<f32>( 1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0,  1.0),
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(-1.0,  1.0)
  );

  var output : VertexOutput;
  output.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
  return output;
}
        )";

        const char* clearQuadFrag = R"(
struct ClearColor {
    color: vec4<f32>,
}

@group(0) @binding(0) var<uniform> clearColor : ClearColor;

@fragment
fn frag_main() -> @location(0) vec4<f32> {
  return clearColor.color;
}
        )";

        WGPUShaderModuleWGSLDescriptor wgslShaderDescVert{};
        wgslShaderDescVert.code = clearQuadVert;
        wgslShaderDescVert.chain.sType = WGPUSType_ShaderModuleWGSLDescriptor;
        WGPUShaderModuleDescriptor shaderDescVert;
        shaderDescVert.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&wgslShaderDescVert);
        shaderDescVert.label = "clearQuadVert";
        clearPassData.vertShader = wgpuDeviceCreateShaderModule(wgpuDevice, &shaderDescVert);

        WGPUShaderModuleWGSLDescriptor wgslShaderDescFrag{};
        wgslShaderDescFrag.code = clearQuadFrag;
        wgslShaderDescFrag.chain.sType = WGPUSType_ShaderModuleWGSLDescriptor;
        WGPUShaderModuleDescriptor shaderDescFrag;
        shaderDescFrag.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&wgslShaderDescFrag);
        shaderDescFrag.label = "clearQuadFrag";
        clearPassData.fragShader = wgpuDeviceCreateShaderModule(wgpuDevice, &shaderDescFrag);

        WGPUBindGroupLayoutEntry bufferEntry{};
        bufferEntry.binding = 0;
        bufferEntry.visibility = WGPUShaderStage_Fragment;
        bufferEntry.texture.sampleType = WGPUTextureSampleType_Undefined;
        bufferEntry.buffer.type = WGPUBufferBindingType_Uniform;
        bufferEntry.buffer.hasDynamicOffset = false;
        bufferEntry.buffer.minBindingSize = 16;
        bufferEntry.sampler.type = WGPUSamplerBindingType_Undefined;
        bufferEntry.storageTexture.access = WGPUStorageTextureAccess_Undefined;

        WGPUBindGroupLayoutDescriptor bgLayoutDesc{};
        bgLayoutDesc.label = "clearPassBGLayout";
        bgLayoutDesc.entryCount = 1;
        bgLayoutDesc.entries = &bufferEntry;
        clearPassData.bindGroupLayout = wgpuDeviceCreateBindGroupLayout(wgpuDevice, &bgLayoutDesc);

        WGPUPipelineLayoutDescriptor pipelineLayoutDesc{};
        pipelineLayoutDesc.label = "clearPassPipelineLayout";
        pipelineLayoutDesc.bindGroupLayoutCount = 1;
        pipelineLayoutDesc.bindGroupLayouts = &clearPassData.bindGroupLayout;
        clearPassData.pipelineLayout = wgpuDeviceCreatePipelineLayout(wgpuDevice, &pipelineLayoutDesc);

        WGPUVertexState vertexState{};
        vertexState.module = clearPassData.vertShader;
        vertexState.entryPoint = "vert_main";

        WGPUPrimitiveState primitiveState{};
        primitiveState.topology = WGPUPrimitiveTopology_TriangleList;
        primitiveState.stripIndexFormat = WGPUIndexFormat_Undefined;
        primitiveState.frontFace = WGPUFrontFace_CCW;
        primitiveState.cullMode = WGPUCullMode_None;

        WGPUColorTargetState colorState{};
        colorState.format = format;
        colorState.writeMask = WGPUColorWriteMask_All;

        WGPUFragmentState fragState{};
        fragState.module = clearPassData.fragShader;
        fragState.entryPoint = "frag_main";
        fragState.targetCount = 1;
        fragState.targets = &colorState;

        WGPUMultisampleState multisample{};
        multisample.count = 1;
        multisample.alphaToCoverageEnabled = false;
        multisample.mask = 0xFFFFFFFF;

        WGPURenderPipelineDescriptor pipelineDesc{};
        pipelineDesc.label = "clearPassPipeline";
        pipelineDesc.layout = clearPassData.pipelineLayout;
        pipelineDesc.vertex = vertexState;
        pipelineDesc.primitive = primitiveState;
        pipelineDesc.fragment = &fragState;
        pipelineDesc.depthStencil = nullptr;
        pipelineDesc.multisample = multisample;
        clearPassData.pipeline = wgpuDeviceCreateRenderPipeline(wgpuDevice, &pipelineDesc);
    }

    CC_ASSERT_GT(i, 0);
    auto cmdBuffCommandEncoder = static_cast<CCWGPUCommandBuffer*>(cmdBuff)->gpuCommandBufferObject()->wgpuCommandEncoder;
    auto commandEncoder = cmdBuffCommandEncoder;
    if (!cmdBuffCommandEncoder) {
        commandEncoder = wgpuDeviceCreateCommandEncoder(wgpuDevice, nullptr);
    }

    auto dstView = wgpuTextureView;

    WGPUBufferDescriptor bufferDesc{};
    bufferDesc.usage = WGPUBufferUsage_Uniform;
    bufferDesc.size = 16;
    bufferDesc.mappedAtCreation = true;
    auto uniformBuffer = wgpuDeviceCreateBuffer(wgpuDevice, &bufferDesc);

    float colorArr[4] = {color.x, color.y, color.z, color.w};
    auto* mappedBuffer = wgpuBufferGetMappedRange(uniformBuffer, 0, 16);
    memcpy(mappedBuffer, colorArr, 16);
    wgpuBufferUnmap(uniformBuffer);

    WGPUBindGroupEntry entry{};
    entry.binding = 0;
    entry.sampler = wgpuDefaultHandle;
    entry.buffer = uniformBuffer;
    entry.offset = 0;
    entry.size = 16;
    entry.textureView = wgpuDefaultHandle;

    WGPUBindGroupDescriptor bindgroupDesc{};
    bindgroupDesc.layout = clearPassData.bindGroupLayout;
    bindgroupDesc.entryCount = 1;
    bindgroupDesc.entries = &entry;
    auto bindGroup = wgpuDeviceCreateBindGroup(wgpuDevice, &bindgroupDesc);

    WGPURenderPassColorAttachment colorAttachment{};
    colorAttachment.view = dstView;
    colorAttachment.resolveTarget = wgpuDefaultHandle;
    colorAttachment.loadOp = WGPULoadOp_Load;
    colorAttachment.storeOp = WGPUStoreOp_Store;
    colorAttachment.clearValue = {0.88, 0.88, 0.88, 1.0};

    WGPURenderPassDescriptor rpDesc{};
    rpDesc.colorAttachmentCount = 1;
    rpDesc.colorAttachments = &colorAttachment;
    rpDesc.depthStencilAttachment = nullptr;
    rpDesc.occlusionQuerySet = nullptr;
    rpDesc.timestampWriteCount = 0;
    rpDesc.timestampWrites = nullptr;
    auto renderPassEncoder = wgpuCommandEncoderBeginRenderPass(commandEncoder, &rpDesc);

    wgpuRenderPassEncoderSetPipeline(renderPassEncoder, clearPassData.pipeline);
    wgpuRenderPassEncoderSetBindGroup(renderPassEncoder, 0, bindGroup, 0, nullptr);
    wgpuRenderPassEncoderSetViewport(renderPassEncoder, renderArea.x, renderArea.y, renderArea.width, renderArea.height, 0.0F, 1.0F);
    wgpuRenderPassEncoderSetScissorRect(renderPassEncoder, renderArea.x, renderArea.y, renderArea.width, renderArea.height);
    wgpuRenderPassEncoderDraw(renderPassEncoder, 6, 1, 0, 0);
    wgpuRenderPassEncoderEnd(renderPassEncoder);
    wgpuRenderPassEncoderRelease(renderPassEncoder);
    wgpuBindGroupRelease(bindGroup);
    wgpuBufferRelease(uniformBuffer);

    if (!cmdBuffCommandEncoder) {
        auto commandBuffer = wgpuCommandEncoderFinish(commandEncoder, nullptr);
        wgpuQueueSubmit(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, 1, &commandBuffer);
        wgpuCommandEncoderRelease(commandEncoder);
        wgpuCommandBufferRelease(commandBuffer);
    }
}

void genMipMap(Texture* texture, uint8_t fromLevel, uint8_t levelCount, uint32_t baseLayer, CommandBuffer* cmdBuff) {
    auto wgpuDevice = CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice;
    auto* ccTexture = static_cast<CCWGPUTexture*>(texture);
    auto format = toWGPUTextureFormat(ccTexture->getFormat());
    auto dimension = toWGPUTextureDimension(ccTexture->getTextureType());
    auto* wgpuTexture = ccTexture->gpuTextureObject()->wgpuTexture;

    if (!mipmapData.vertShader) {
        // WGPUBufferDescriptor bufferDesc;
        // bufferDesc.usage = WGPUBufferUsage_Vertex;
        // bufferDesc.size = 120;
        // bufferDesc.mappedAtCreation = true;
        // mipmapData.vertexBuffer = wgpuDeviceCreateBuffer(wgpuDevice, &bufferDesc);

        // auto* mappedBuffer = wgpuBufferGetMappedRange(mipmapData.vertexBuffer, 0, 120);
        // memcpy(mappedBuffer, quadVert, 120);
        // wgpuBufferUnmap(mipmapData.vertexBuffer);

        // https://github.com/austinEng/webgpu-samples/blob/main/src/shaders/fullscreenTexturedQuad.wgsl
        const char* textureQuadVert = R"(
struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  @location(0) fragUV : vec2<f32>,
}

@vertex
fn vert_main(@builtin(vertex_index) VertexIndex : u32) -> VertexOutput {
  var pos = array<vec2<f32>, 6>(
    vec2<f32>( 1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0,  1.0),
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(-1.0,  1.0)
  );

  var uv = array<vec2<f32>, 6>(
    vec2<f32>(1.0, 0.0),
    vec2<f32>(1.0, 1.0),
    vec2<f32>(0.0, 1.0),
    vec2<f32>(1.0, 0.0),
    vec2<f32>(0.0, 1.0),
    vec2<f32>(0.0, 0.0)
  );

  var output : VertexOutput;
  output.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
  output.fragUV = uv[VertexIndex];
  return output;
}
        )";

        const char* textureQuadFrag = R"(
@group(0) @binding(0) var mySampler : sampler;
@group(0) @binding(1) var myTexture : texture_2d<f32>;

@fragment
fn frag_main(@location(0) fragUV : vec2<f32>) -> @location(0) vec4<f32> {
  return textureSample(myTexture, mySampler, fragUV);
}
        )";

        WGPUSamplerDescriptor samplerDesc{};
        samplerDesc.label = "filterSampler";
        samplerDesc.addressModeU = WGPUAddressMode_MirrorRepeat;
        samplerDesc.addressModeV = WGPUAddressMode_MirrorRepeat;
        samplerDesc.addressModeW = WGPUAddressMode_MirrorRepeat;
        samplerDesc.magFilter = WGPUFilterMode_Linear;
        samplerDesc.minFilter = WGPUFilterMode_Linear;
        samplerDesc.mipmapFilter = WGPUMipmapFilterMode_Linear;
        samplerDesc.lodMinClamp = 0.0;
        samplerDesc.lodMaxClamp = 32.0;
        samplerDesc.compare = WGPUCompareFunction_Undefined;
        samplerDesc.maxAnisotropy = 1;
        mipmapData.sampler = wgpuDeviceCreateSampler(wgpuDevice, &samplerDesc);

        WGPUShaderModuleWGSLDescriptor wgslShaderDescVert{};
        wgslShaderDescVert.code = textureQuadVert;
        wgslShaderDescVert.chain.sType = WGPUSType_ShaderModuleWGSLDescriptor;
        WGPUShaderModuleDescriptor shaderDescVert;
        shaderDescVert.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&wgslShaderDescVert);
        shaderDescVert.label = "textureQuadVert";
        mipmapData.vertShader = wgpuDeviceCreateShaderModule(wgpuDevice, &shaderDescVert);

        WGPUShaderModuleWGSLDescriptor wgslShaderDescFrag{};
        wgslShaderDescFrag.code = textureQuadFrag;
        wgslShaderDescFrag.chain.sType = WGPUSType_ShaderModuleWGSLDescriptor;
        WGPUShaderModuleDescriptor shaderDescFrag;
        shaderDescFrag.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&wgslShaderDescFrag);
        shaderDescFrag.label = "textureQuadFrag";
        mipmapData.fragShader = wgpuDeviceCreateShaderModule(wgpuDevice, &shaderDescFrag);

        WGPUBindGroupLayoutEntry samplerEntry{};
        samplerEntry.binding = 0;
        samplerEntry.visibility = WGPUShaderStage_Fragment;
        samplerEntry.sampler.type = WGPUSamplerBindingType_Filtering;
        samplerEntry.buffer.type = WGPUBufferBindingType_Undefined;
        samplerEntry.texture.sampleType = WGPUTextureSampleType_Undefined;
        samplerEntry.storageTexture.access = WGPUStorageTextureAccess_Undefined;

        WGPUBindGroupLayoutEntry textureEntry{};
        textureEntry.binding = 1;
        textureEntry.visibility = WGPUShaderStage_Fragment;
        textureEntry.texture.sampleType = textureSampleTypeTrait(ccTexture->getFormat());
        textureEntry.texture.viewDimension = WGPUTextureViewDimension_2D;
        textureEntry.texture.multisampled = false;
        textureEntry.buffer.type = WGPUBufferBindingType_Undefined;
        textureEntry.sampler.type = WGPUSamplerBindingType_Undefined;
        textureEntry.storageTexture.access = WGPUStorageTextureAccess_Undefined;
        WGPUBindGroupLayoutEntry entries[2] = {samplerEntry, textureEntry};

        WGPUBindGroupLayoutDescriptor bgLayoutDesc{};
        bgLayoutDesc.label = "fullscreenTexturedQuadBGLayout";
        bgLayoutDesc.entryCount = 2;
        bgLayoutDesc.entries = entries;
        mipmapData.bindGroupLayout = wgpuDeviceCreateBindGroupLayout(wgpuDevice, &bgLayoutDesc);

        WGPUPipelineLayoutDescriptor pipelineLayoutDesc{};
        pipelineLayoutDesc.label = "fullscreenTexturedQuadPipelineLayout";
        pipelineLayoutDesc.bindGroupLayoutCount = 1;
        pipelineLayoutDesc.bindGroupLayouts = &mipmapData.bindGroupLayout;
        mipmapData.pipelineLayout = wgpuDeviceCreatePipelineLayout(wgpuDevice, &pipelineLayoutDesc);

        WGPUVertexState vertexState{};
        vertexState.module = mipmapData.vertShader;
        vertexState.entryPoint = "vert_main";
        vertexState.bufferCount = 0;
        vertexState.buffers = nullptr;

        WGPUPrimitiveState primitiveState{};
        primitiveState.topology = WGPUPrimitiveTopology_TriangleList;
        primitiveState.stripIndexFormat = WGPUIndexFormat_Undefined;
        primitiveState.frontFace = WGPUFrontFace_CCW;
        primitiveState.cullMode = WGPUCullMode_None;

        WGPUColorTargetState colorState{};
        colorState.format = format;
        colorState.writeMask = WGPUColorWriteMask_All;

        WGPUFragmentState fragState{};
        fragState.module = mipmapData.fragShader;
        fragState.entryPoint = "frag_main";
        fragState.targetCount = 1;
        fragState.targets = &colorState;

        WGPUMultisampleState multisample{};
        multisample.count = 1;
        multisample.alphaToCoverageEnabled = false;
        multisample.mask = 0xFFFFFFFF;

        WGPURenderPipelineDescriptor pipelineDesc{};
        pipelineDesc.label = "fullscreenTexturedQuadPipeline";
        pipelineDesc.layout = mipmapData.pipelineLayout;
        pipelineDesc.vertex = vertexState;
        pipelineDesc.primitive = primitiveState;
        pipelineDesc.fragment = &fragState;
        pipelineDesc.depthStencil = nullptr;
        pipelineDesc.multisample = multisample;
        mipmapData.pipeline = wgpuDeviceCreateRenderPipeline(wgpuDevice, &pipelineDesc);
    }

    WGPUTextureViewDescriptor desc{};
    desc.format = format;
    desc.dimension = WGPUTextureViewDimension_2D;
    desc.baseMipLevel = fromLevel;
    desc.mipLevelCount = 1;
    desc.baseArrayLayer = baseLayer;
    desc.arrayLayerCount = 1;
    desc.aspect = WGPUTextureAspect_All;

    CC_ASSERT_GT(i, 0);
    auto cmdBuffCommandEncoder = static_cast<CCWGPUCommandBuffer*>(cmdBuff)->gpuCommandBufferObject()->wgpuCommandEncoder;
    auto commandEncoder = cmdBuffCommandEncoder;
    if (!cmdBuffCommandEncoder) {
        commandEncoder = wgpuDeviceCreateCommandEncoder(wgpuDevice, nullptr);
    }

    for (uint8_t i = fromLevel; i < fromLevel + levelCount; ++i) {
        desc.baseMipLevel = i - 1;
        auto srcView = wgpuTextureCreateView(wgpuTexture, &desc);
        desc.baseMipLevel = i;
        desc.baseArrayLayer = baseLayer;
        desc.arrayLayerCount = 1;
        auto dstView = wgpuTextureCreateView(wgpuTexture, &desc);

        WGPUBindGroupEntry entries[2];
        entries[0].nextInChain = nullptr;
        entries[0].binding = 0;
        entries[0].sampler = mipmapData.sampler;
        entries[0].buffer = wgpuDefaultHandle;
        entries[0].textureView = wgpuDefaultHandle;

        entries[1].nextInChain = nullptr;
        entries[1].binding = 1;
        entries[1].textureView = srcView;
        entries[1].buffer = wgpuDefaultHandle;
        entries[1].sampler = wgpuDefaultHandle;

        WGPUBindGroupDescriptor bindgroupDesc{};
        bindgroupDesc.layout = mipmapData.bindGroupLayout;
        bindgroupDesc.entryCount = 2;
        bindgroupDesc.entries = entries;
        auto bindGroup = wgpuDeviceCreateBindGroup(wgpuDevice, &bindgroupDesc);

        WGPURenderPassColorAttachment colorAttachment;
        colorAttachment.view = dstView;
        colorAttachment.resolveTarget = wgpuDefaultHandle;
        colorAttachment.loadOp = WGPULoadOp_Clear;
        colorAttachment.storeOp = WGPUStoreOp_Store;
        colorAttachment.clearValue = {0.88, 0.88, 0.88, 1.0};

        WGPURenderPassDescriptor rpDesc{};
        rpDesc.label = nullptr;
        rpDesc.colorAttachmentCount = 1;
        rpDesc.colorAttachments = &colorAttachment;
        rpDesc.depthStencilAttachment = nullptr;
        rpDesc.occlusionQuerySet = nullptr;
        rpDesc.timestampWriteCount = 0;
        rpDesc.timestampWrites = nullptr;
        auto renderPassEncoder = wgpuCommandEncoderBeginRenderPass(commandEncoder, &rpDesc);

        wgpuRenderPassEncoderSetPipeline(renderPassEncoder, mipmapData.pipeline);
        wgpuRenderPassEncoderSetBindGroup(renderPassEncoder, 0, bindGroup, 0, nullptr);
        wgpuRenderPassEncoderDraw(renderPassEncoder, 6, 1, 0, 0);
        wgpuRenderPassEncoderEnd(renderPassEncoder);
        wgpuRenderPassEncoderRelease(renderPassEncoder);
        wgpuBindGroupRelease(bindGroup);
        wgpuTextureViewRelease(srcView);
        wgpuTextureViewRelease(dstView);
    }

    if (!cmdBuffCommandEncoder) {
        auto commandBuffer = wgpuCommandEncoderFinish(commandEncoder, nullptr);
        wgpuQueueSubmit(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, 1, &commandBuffer);
        wgpuCommandEncoderRelease(commandEncoder);
        wgpuCommandBufferRelease(commandBuffer);
    }
}
#pragma endregion FIXED_PIPELINE

} // namespace cc::gfx
