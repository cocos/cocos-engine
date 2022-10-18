#include "WGPUUtils.h"
#include "WGPUCommandBuffer.h"
#include "WGPUDescriptorSet.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUPipelineLayout.h"
#include "WGPUTexture.h"

namespace cc::gfx {

void createPipelineLayoutFallback(const ccstd::vector<DescriptorSet*>& descriptorSets, PipelineLayout* pipelineLayout) {
    ccstd::hash_t hash = descriptorSets.size() * 2 + 1;
    ccstd::hash_combine(hash, descriptorSets.size());
    std::string label = "";
    ccstd::vector<WGPUBindGroupLayout> descriptorSetLayouts;
    for (size_t i = 0; i < descriptorSets.size(); ++i) {
        auto* descriptorSet = static_cast<CCWGPUDescriptorSet*>(descriptorSets[i]);
        if (descriptorSet && descriptorSet->getHash() != 0) {
            auto* descriptorSetLayout = static_cast<CCWGPUDescriptorSetLayout*>(descriptorSet->getLayout());
            auto* wgpuBindGroupLayout = static_cast<WGPUBindGroupLayout>(CCWGPUDescriptorSetLayout::getBindGroupLayoutByHash(descriptorSet->getHash()));
            descriptorSetLayouts.push_back(wgpuBindGroupLayout);
            ccstd::hash_combine(hash, i);
            ccstd::hash_combine(hash, descriptorSet->getHash());
            label += std::to_string(descriptorSet->getHash()) + "-" + descriptorSet->label + "-" + std::to_string(descriptorSetLayout->getHash()) + " ";
        } else {
            descriptorSetLayouts.push_back(static_cast<WGPUBindGroupLayout>(CCWGPUDescriptorSetLayout::defaultBindGroupLayout()));
            ccstd::hash_combine(hash, i);
            ccstd::hash_combine(hash, 0);
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
struct MipmapPassData {
    WGPUShaderModule vertShader = wgpuDefaultHandle;
    WGPUShaderModule fragShader = wgpuDefaultHandle;
    WGPUSampler sampler = wgpuDefaultHandle;
    WGPUBindGroupLayout bindGroupLayout = wgpuDefaultHandle;
    WGPUPipelineLayout pipelineLayout = wgpuDefaultHandle;
    WGPURenderPipeline pipeline = wgpuDefaultHandle;
};

thread_local MipmapPassData mipmapData;
} // namespace

void genMipMap(Texture* texture, uint8_t fromLevel, uint8_t toLevel, CommandBuffer* cmdBuff) {
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
        const char* fullscreenTexturedQuad = R"(
@group(0) @binding(0) var mySampler : sampler;
@group(0) @binding(1) var myTexture : texture_2d<f32>;

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

@fragment
fn frag_main(@location(0) fragUV : vec2<f32>) -> @location(0) vec4<f32> {
  return textureSample(myTexture, mySampler, fragUV);
}
        )";

        WGPUSamplerDescriptor samplerDesc;
        samplerDesc.label = "filterSampler";
        samplerDesc.addressModeU = WGPUAddressMode_MirrorRepeat;
        samplerDesc.addressModeV = WGPUAddressMode_MirrorRepeat;
        samplerDesc.addressModeW = WGPUAddressMode_MirrorRepeat;
        samplerDesc.magFilter = WGPUFilterMode_Linear;
        samplerDesc.minFilter = WGPUFilterMode_Linear;
        samplerDesc.mipmapFilter = WGPUFilterMode_Linear;
        samplerDesc.lodMinClamp = 0.0;
        samplerDesc.lodMaxClamp = 32.0;
        samplerDesc.compare = WGPUCompareFunction_Undefined;
        samplerDesc.maxAnisotropy = 1;
        mipmapData.sampler = wgpuDeviceCreateSampler(wgpuDevice, &samplerDesc);

        WGPUShaderModuleWGSLDescriptor wgslShaderDesc;
        wgslShaderDesc.source = fullscreenTexturedQuad;

        WGPUShaderModuleDescriptor shaderDesc;
        shaderDesc.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&wgslShaderDesc);
        shaderDesc.label = "fullscreenTexturedQuad";
        mipmapData.vertShader = wgpuDeviceCreateShaderModule(wgpuDevice, &shaderDesc);

        mipmapData.fragShader = wgpuDeviceCreateShaderModule(wgpuDevice, &shaderDesc);

        WGPUBindGroupLayoutEntry samplerEntry;
        samplerEntry.binding = 0;
        samplerEntry.visibility = WGPUShaderStage_Fragment;
        samplerEntry.sampler = {nullptr, WGPUSamplerBindingType_Filtering};

        WGPUBindGroupLayoutEntry textureEntry;
        textureEntry.binding = 1;
        textureEntry.visibility = WGPUShaderStage_Fragment;
        textureEntry.texture = {nullptr, textureSampleTypeTrait(ccTexture->getFormat()), toWGPUTextureViewDimension(ccTexture->getTextureType()), false};
        WGPUBindGroupLayoutEntry entries[2] = {samplerEntry, textureEntry};

        WGPUBindGroupLayoutDescriptor bgLayoutDesc;
        bgLayoutDesc.label = "fullscreenTexturedQuadBGLayout";
        bgLayoutDesc.entryCount = 2;
        bgLayoutDesc.entries = entries;
        mipmapData.bindGroupLayout = wgpuDeviceCreateBindGroupLayout(wgpuDevice, &bgLayoutDesc);

        WGPUPipelineLayoutDescriptor pipelineLayoutDesc;
        pipelineLayoutDesc.label = "fullscreenTexturedQuadPipelineLayout";
        pipelineLayoutDesc.bindGroupLayoutCount = 1;
        pipelineLayoutDesc.bindGroupLayouts = &mipmapData.bindGroupLayout;
        mipmapData.pipelineLayout = wgpuDeviceCreatePipelineLayout(wgpuDevice, &pipelineLayoutDesc);

        WGPUVertexState vertexState;
        vertexState.module = mipmapData.vertShader;
        vertexState.entryPoint = "vert_main";

        WGPUPrimitiveState primitiveState;
        primitiveState.topology = WGPUPrimitiveTopology_TriangleList;
        primitiveState.stripIndexFormat = WGPUIndexFormat_Undefined;
        primitiveState.frontFace = WGPUFrontFace_CCW;
        primitiveState.cullMode = WGPUCullMode_None;

        WGPUColorTargetState colorState;
        colorState.format = format;
        colorState.writeMask = WGPUColorWriteMask_All;

        WGPUFragmentState fragState;
        fragState.module = mipmapData.fragShader;
        fragState.entryPoint = "frag_main";
        fragState.targetCount = 1;
        fragState.targets = &colorState;

        WGPURenderPipelineDescriptor pipelineDesc;
        pipelineDesc.label = "fullscreenTexturedQuadPipeline";
        pipelineDesc.layout = mipmapData.pipelineLayout;
        pipelineDesc.vertex = vertexState;
        pipelineDesc.primitive = primitiveState;
        pipelineDesc.fragment = &fragState;
        pipelineDesc.depthStencil = nullptr;
        mipmapData.pipeline = wgpuDeviceCreateRenderPipeline(wgpuDevice, &pipelineDesc);
    }

    WGPUTextureViewDescriptor desc;
    desc.format = format;
    desc.dimension = toWGPUTextureViewDimension(ccTexture->getTextureType());
    desc.baseMipLevel = fromLevel;
    desc.mipLevelCount = 1;
    desc.baseArrayLayer = 0;
    desc.arrayLayerCount = ccTexture->getLayerCount();
    desc.aspect = WGPUTextureAspect_All;

    CC_ASSERT(i > 0);
    auto cmdBuffCommandEncoder = static_cast<CCWGPUCommandBuffer*>(cmdBuff)->gpuCommandBufferObject()->wgpuCommandEncoder;
    auto commandEncoder = cmdBuffCommandEncoder;
    if (!cmdBuffCommandEncoder) {
        commandEncoder = wgpuDeviceCreateCommandEncoder(wgpuDevice, nullptr);
    }
    for (uint8_t i = fromLevel; i < toLevel; ++i) {
        desc.baseMipLevel = i - 1;
        auto srcView = wgpuTextureCreateView(wgpuTexture, &desc);
        desc.baseMipLevel = i;
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

        WGPUBindGroupDescriptor bindgroupDesc;
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

        WGPURenderPassDescriptor rpDesc;
        rpDesc.nextInChain = nullptr;
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
    }
    if (!cmdBuffCommandEncoder) {
        auto commandBuffer = wgpuCommandEncoderFinish(commandEncoder, nullptr);
        wgpuQueueSubmit(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, 1, &commandBuffer);
        wgpuCommandEncoderRelease(commandEncoder);
        wgpuCommandBufferRelease(commandBuffer);
    }
}
} // namespace cc::gfx
