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
struct ClearPassData {
    WGPUShaderModule vertShader = wgpuDefaultHandle;
    WGPUShaderModule fragShader = wgpuDefaultHandle;
    WGPUBindGroupLayout bindGroupLayout = wgpuDefaultHandle;
    WGPUPipelineLayout pipelineLayout = wgpuDefaultHandle;
    WGPURenderPipeline pipeline = wgpuDefaultHandle;
};
thread_local ClearPassData clearPassData;
} // namespace

void clearRect(CommandBuffer* cmdBuff, Texture* texture, uint32_t x, uint32_t y, uint32_t w, uint32_t h, const Color& color) {
    auto wgpuDevice = CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice;
    auto* ccTexture = static_cast<CCWGPUTexture*>(texture);
    auto format = toWGPUTextureFormat(ccTexture->getFormat());
    auto dimension = toWGPUTextureDimension(ccTexture->getTextureType());
    auto* wgpuTexture = ccTexture->gpuTextureObject()->wgpuTexture;

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

@group(0) @binding(0) var clearColor : ClearColor;

@fragment
fn frag_main(@location(0) fragUV : vec2<f32>) -> @location(0) vec4<f32> {
  return clearColor;
}
        )";

        WGPUShaderModuleWGSLDescriptor wgslShaderDescVert;
        wgslShaderDescVert.source = clearQuadVert;
        wgslShaderDescVert.chain.sType = WGPUSType_ShaderModuleWGSLDescriptor;
        WGPUShaderModuleDescriptor shaderDescVert;
        shaderDescVert.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&wgslShaderDescVert);
        shaderDescVert.label = "clearQuadVert";
        clearPassData.vertShader = wgpuDeviceCreateShaderModule(wgpuDevice, &shaderDescVert);

        WGPUShaderModuleWGSLDescriptor wgslShaderDescFrag;
        wgslShaderDescFrag.source = clearQuadFrag;
        wgslShaderDescFrag.chain.sType = WGPUSType_ShaderModuleWGSLDescriptor;
        WGPUShaderModuleDescriptor shaderDescFrag;
        shaderDescFrag.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&wgslShaderDescFrag);
        shaderDescFrag.label = "clearQuadFrag";
        clearPassData.fragShader = wgpuDeviceCreateShaderModule(wgpuDevice, &shaderDescFrag);

        WGPUBindGroupLayoutEntry textureEntry;
        textureEntry.binding = 0;
        textureEntry.visibility = WGPUShaderStage_Fragment;
        textureEntry.texture.sampleType = WGPUTextureSampleType_Undefined;
        textureEntry.texture.viewDimension = WGPUTextureViewDimension_2D;
        textureEntry.texture.multisampled = false;
        textureEntry.buffer.type = WGPUBufferBindingType_Uniform;
        textureEntry.sampler.type = WGPUSamplerBindingType_Undefined;
        textureEntry.storageTexture.access = WGPUStorageTextureAccess_Undefined;

        WGPUBindGroupLayoutDescriptor bgLayoutDesc;
        bgLayoutDesc.label = "clearPassBGLayout";
        bgLayoutDesc.entryCount = 1;
        bgLayoutDesc.entries = &textureEntry;
        clearPassData.bindGroupLayout = wgpuDeviceCreateBindGroupLayout(wgpuDevice, &bgLayoutDesc);

        WGPUPipelineLayoutDescriptor pipelineLayoutDesc;
        pipelineLayoutDesc.label = "clearPassPipelineLayout";
        pipelineLayoutDesc.bindGroupLayoutCount = 1;
        pipelineLayoutDesc.bindGroupLayouts = &clearPassData.bindGroupLayout;
        clearPassData.pipelineLayout = wgpuDeviceCreatePipelineLayout(wgpuDevice, &pipelineLayoutDesc);

        WGPUVertexState vertexState;
        vertexState.module = clearPassData.vertShader;
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
        fragState.module = clearPassData.fragShader;
        fragState.entryPoint = "frag_main";
        fragState.targetCount = 1;
        fragState.targets = &colorState;

        WGPUMultisampleState multisample;
        multisample.count = 1;
        multisample.alphaToCoverageEnabled = false;
        multisample.mask = 0xFFFFFFFF;

        WGPURenderPipelineDescriptor pipelineDesc;
        pipelineDesc.label = "clearPassPipeline";
        pipelineDesc.layout = clearPassData.pipelineLayout;
        pipelineDesc.vertex = vertexState;
        pipelineDesc.primitive = primitiveState;
        pipelineDesc.fragment = &fragState;
        pipelineDesc.depthStencil = nullptr;
        pipelineDesc.multisample = multisample;
        clearPassData.pipeline = wgpuDeviceCreateRenderPipeline(wgpuDevice, &pipelineDesc);
    }

    CC_ASSERT(i > 0);
    auto cmdBuffCommandEncoder = static_cast<CCWGPUCommandBuffer*>(cmdBuff)->gpuCommandBufferObject()->wgpuCommandEncoder;
    auto commandEncoder = cmdBuffCommandEncoder;
    if (!cmdBuffCommandEncoder) {
        commandEncoder = wgpuDeviceCreateCommandEncoder(wgpuDevice, nullptr);
    }
    WGPUTextureViewDescriptor desc;
    desc.format = format;
    desc.dimension = WGPUTextureViewDimension_2D;
    desc.baseMipLevel = 0;
    desc.mipLevelCount = 1;
    desc.baseArrayLayer = 0;
    desc.arrayLayerCount = 1;
    desc.aspect = WGPUTextureAspect_All;
    auto dstView = wgpuTextureCreateView(wgpuTexture, &desc);

    WGPUBufferDescriptor bufferDesc;
    bufferDesc.usage = WGPUBufferUsage_Vertex;
    bufferDesc.size = 16;
    bufferDesc.mappedAtCreation = true;
    auto uniformBuffer = wgpuDeviceCreateBuffer(wgpuDevice, &bufferDesc);

    float colorArr[4] = {color.x, color.y, color.z, color.w};
    auto* mappedBuffer = wgpuBufferGetMappedRange(uniformBuffer, 0, 16);
    memcpy(mappedBuffer, colorArr, 16);
    wgpuBufferUnmap(uniformBuffer);

    WGPUBindGroupEntry entry;
    entry.nextInChain = nullptr;
    entry.binding = 0;
    entry.sampler = wgpuDefaultHandle;
    entry.buffer = uniformBuffer;
    entry.textureView = wgpuDefaultHandle;

    WGPUBindGroupDescriptor bindgroupDesc;
    bindgroupDesc.layout = clearPassData.bindGroupLayout;
    bindgroupDesc.entryCount = 1;
    bindgroupDesc.entries = &entry;
    auto bindGroup = wgpuDeviceCreateBindGroup(wgpuDevice, &bindgroupDesc);

    WGPURenderPassColorAttachment colorAttachment;
    colorAttachment.view = dstView;
    colorAttachment.resolveTarget = wgpuDefaultHandle;
    colorAttachment.loadOp = WGPULoadOp_Load;
    colorAttachment.storeOp = WGPUStoreOp_Store;
    // colorAttachment.clearValue = {0.88, 0.88, 0.88, 1.0};

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

    wgpuRenderPassEncoderSetPipeline(renderPassEncoder, clearPassData.pipeline);
    wgpuRenderPassEncoderSetBindGroup(renderPassEncoder, 0, bindGroup, 0, nullptr);
    wgpuRenderPassEncoderDraw(renderPassEncoder, 6, 1, 0, 0);
    wgpuRenderPassEncoderEnd(renderPassEncoder);
    wgpuRenderPassEncoderRelease(renderPassEncoder);
    wgpuBindGroupRelease(bindGroup);
    wgpuTextureViewRelease(dstView);
    wgpuBufferRelease(uniformBuffer);

    if (!cmdBuffCommandEncoder) {
        auto commandBuffer = wgpuCommandEncoderFinish(commandEncoder, nullptr);
        wgpuQueueSubmit(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuQueue, 1, &commandBuffer);
        wgpuCommandEncoderRelease(commandEncoder);
        wgpuCommandBufferRelease(commandBuffer);
    }
}

} // namespace cc::gfx
