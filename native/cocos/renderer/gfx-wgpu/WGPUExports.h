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

#pragma once
#include "WGPUBuffer.h"
#include "WGPUCommandBuffer.h"
#include "WGPUDef.h"
#include "WGPUDescriptorSet.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUFrameBuffer.h"
#include "WGPUInputAssembler.h"
#include "WGPUPipelineLayout.h"
#include "WGPUPipelineState.h"
#include "WGPUQueue.h"
#include "WGPURenderPass.h"
#include "WGPUSampler.h"
#include "WGPUShader.h"
#include "WGPUSwapchain.h"
#include "WGPUTexture.h"
#include "boost/pfr.hpp"
#include "boost/type_index.hpp"
#include "states/WGPUBufferBarrier.h"
#include "states/WGPUGeneralBarrier.h"
#include "states/WGPUTextureBarrier.h"

REGISTER_GFX_PTRS_FOR_STRUCT(Device, Buffer, Texture, GeneralBarrier, Queue, RenderPass, Shader, PipelineLayout, DescriptorSetLayout, CommandBuffer, DescriptorSet, Sampler, CCWGPUGPUDescriptorSetObject);

namespace cc::gfx {

using ::emscripten::allow_raw_pointer;
using ::emscripten::allow_raw_pointers;
using ::emscripten::arg;
using ::emscripten::base;
using ::emscripten::class_;
using ::emscripten::constant;
using ::emscripten::enum_;
using ::emscripten::function;
using ::emscripten::pure_virtual;
using ::emscripten::register_vector;
using ::emscripten::select_overload;
using ::emscripten::val;
using ::emscripten::value_object;

using String = ccstd::string;
using ccstd::vector;

EMSCRIPTEN_BINDINGS(WEBGPU_DEVICE_WASM_EXPORT) {
    // register_vector<uint32_t>("Uint32Vector");

    EXPORT_STRUCT_POD(Size, x, y, z);
    EXPORT_STRUCT_POD(DeviceCaps, maxVertexAttributes, maxVertexUniformVectors, maxFragmentUniformVectors, maxTextureUnits, maxImageUnits, maxVertexTextureUnits, maxColorRenderTargets,
                      maxShaderStorageBufferBindings, maxShaderStorageBlockSize, maxUniformBufferBindings, maxUniformBlockSize, maxTextureSize, maxCubeMapTextureSize, uboOffsetAlignment,
                      maxComputeSharedMemorySize, maxComputeWorkGroupInvocations, maxComputeWorkGroupSize, maxComputeWorkGroupCount, supportQuery, clipSpaceMinZ, screenSpaceSignY, clipSpaceSignY);
    EXPORT_STRUCT_POD(Offset, x, y, z);
    EXPORT_STRUCT_POD(Rect, x, y, width, height);
    EXPORT_STRUCT_POD(Extent, width, height, depth);
    EXPORT_STRUCT_POD(TextureSubresLayers, mipLevel, baseArrayLayer, layerCount);
    EXPORT_STRUCT_POD(TextureCopy, srcSubres, srcOffset, dstSubres, dstOffset, extent);
    EXPORT_STRUCT_POD(TextureBlit, srcSubres, srcOffset, srcExtent, dstSubres, dstOffset, dstExtent);
    EXPORT_STRUCT_POD(BufferTextureCopy, buffOffset, buffStride, buffTexHeight, texOffset, texExtent, texSubres);
    EXPORT_STRUCT_POD(Viewport, left, top, width, height, minDepth, maxDepth);
    EXPORT_STRUCT_POD(Color, x, y, z, w);
    EXPORT_STRUCT_POD(BindingMappingInfo, maxBlockCounts, maxSamplerTextureCounts, maxSamplerCounts, maxTextureCounts, maxBufferCounts, maxImageCounts, maxSubpassInputCounts, setIndices);
    // SwapchainInfo ignore windowHandle
    EXPORT_STRUCT_NPOD(SwapchainInfo, vsyncMode, width, height);
    EXPORT_STRUCT_POD(DeviceInfo, bindingMappingInfo);
    EXPORT_STRUCT_POD(BufferInfo, usage, memUsage, size, stride, flags);
    EXPORT_STRUCT_NPOD(BufferViewInfo, buffer, offset, range);
    EXPORT_STRUCT_POD(DrawInfo, vertexCount, firstVertex, indexCount, firstIndex, vertexOffset, instanceCount, firstInstance);
    EXPORT_STRUCT_NPOD(DispatchInfo, groupCountX, groupCountY, groupCountZ, indirectBuffer, indirectOffset);
    EXPORT_STRUCT_POD(IndirectBuffer, drawInfos);
    EXPORT_STRUCT_NPOD(TextureInfo, type, usage, format, width, height, flags, layerCount, levelCount, samples, depth, externalRes);
    EXPORT_STRUCT_NPOD(TextureViewInfo, texture, type, format, baseLevel, levelCount, baseLayer, layerCount);
    EXPORT_STRUCT_POD(SamplerInfo, minFilter, magFilter, mipFilter, addressU, addressV, addressW, maxAnisotropy, cmpFunc);
    EXPORT_STRUCT_POD(Uniform, name, type, count);
    EXPORT_STRUCT_POD(UniformBlock, set, binding, name, members, count);
    EXPORT_STRUCT_POD(UniformSamplerTexture, set, binding, name, type, count);
    EXPORT_STRUCT_POD(UniformSampler, set, binding, name, count);
    EXPORT_STRUCT_POD(UniformTexture, set, binding, name, type, count);
    EXPORT_STRUCT_POD(UniformStorageImage, set, binding, name, type, count, memoryAccess);
    EXPORT_STRUCT_POD(UniformStorageBuffer, set, binding, name, count, memoryAccess);
    EXPORT_STRUCT_POD(UniformInputAttachment, set, binding, name, count);
    EXPORT_STRUCT_POD(ShaderStage, stage, source);
    EXPORT_STRUCT_POD(Attribute, name, format, isNormalized, stream, isInstanced, location);
    EXPORT_STRUCT_POD(ShaderInfo, name, stages, attributes, blocks, buffers, samplerTextures, samplers, textures, images, subpassInputs);
    EXPORT_STRUCT_NPOD(InputAssemblerInfo, attributes, vertexBuffers, indexBuffer, indirectBuffer);
    EXPORT_STRUCT_NPOD(ColorAttachment, format, sampleCount, loadOp, storeOp, barrier);
    EXPORT_STRUCT_NPOD(DepthStencilAttachment, format, sampleCount, depthLoadOp, depthStoreOp, stencilLoadOp, stencilStoreOp, barrier);
    EXPORT_STRUCT_POD(SubpassInfo, inputs, colors, resolves, preserves, depthStencil, depthStencilResolve, depthResolveMode, stencilResolveMode);

    // MAYBE TODO(Zeqiang): all ts related backend no need to care about barriers.
    EXPORT_STRUCT_POD(SubpassDependency, srcSubpass, dstSubpass, prevAccesses, nextAccesses);
    EXPORT_STRUCT_POD(RenderPassInfo, colorAttachments, depthStencilAttachment, subpasses, dependencies);
    EXPORT_STRUCT_POD(GeneralBarrierInfo, prevAccesses, nextAccesses, type);
    EXPORT_STRUCT_POD(ResourceRange, width, height, depthOrArraySize, firstSlice, numSlices, mipLevel, levelCount, basePlane, planeCount);
    EXPORT_STRUCT_NPOD(TextureBarrierInfo, prevAccesses, nextAccesses, type, range, discardContents, srcQueue, dstQueue);
    EXPORT_STRUCT_NPOD(BufferBarrierInfo, prevAccesses, nextAccesses, type, offset, size, discardContents, srcQueue, dstQueue);
    EXPORT_STRUCT_NPOD(FramebufferInfo, renderPass, colorTextures, depthStencilTexture);
    EXPORT_STRUCT_NPOD(WGPUGPUDescriptor, type, buffer, texture, sampler);
    EXPORT_STRUCT_NPOD(CCWGPUGPUDescriptorSetObject, gpuDescriptors, descriptorIndices);
    EXPORT_STRUCT_NPOD(DescriptorSetLayoutBinding, binding, descriptorType, count, stageFlags, immutableSamplers);
    EXPORT_STRUCT_POD(DescriptorSetLayoutInfo, bindings);
    EXPORT_STRUCT_NPOD(DescriptorSetInfo, layout);
    EXPORT_STRUCT_NPOD(PipelineLayoutInfo, setLayouts);
    EXPORT_STRUCT_POD(InputState, attributes);
    EXPORT_STRUCT_POD(RasterizerState, isDiscard, polygonMode, shadeModel, cullMode, isFrontFaceCCW, depthBiasEnabled, depthBias, depthBiasClamp, depthBiasSlop, isDepthClip, isMultisample, lineWidth);
    EXPORT_STRUCT_POD(DepthStencilState, depthTest, depthWrite, depthFunc, stencilTestFront, stencilFuncFront, stencilReadMaskFront, stencilWriteMaskFront, stencilFailOpFront, stencilZFailOpFront, stencilPassOpFront,
                      stencilRefFront, stencilTestBack, stencilFuncBack, stencilReadMaskBack, stencilWriteMaskBack, stencilFailOpBack, stencilZFailOpBack, stencilPassOpBack, stencilRefBack);
    EXPORT_STRUCT_POD(BlendTarget, blend, blendSrc, blendDst, blendEq, blendSrcAlpha, blendDstAlpha, blendAlphaEq, blendColorMask);
    EXPORT_STRUCT_POD(BlendState, isA2C, isIndepend, blendColor, targets)
    // MAYBE TODO(Zeqiang): no subpass in TS now
    EXPORT_STRUCT_NPOD(PipelineStateInfo, shader, pipelineLayout, renderPass, inputState, rasterizerState, depthStencilState, blendState, primitive, dynamicStates, bindPoint);
    EXPORT_STRUCT_NPOD(CommandBufferInfo, queue);
    EXPORT_STRUCT_POD(QueueInfo, type);
    EXPORT_STRUCT_POD(QueryPoolInfo, type, maxQueryObjects, forceWait);
    // EXPORT_STRUCT_POD(FormatInfo, name, size, count, type, hasAlpha, hasDepth, hasStencil, isCompressed);
    EXPORT_STRUCT_POD(MemoryStatus, bufferSize, textureSize);
    EXPORT_STRUCT_POD(DynamicStencilStates, writeMask, compareMask, reference);
    EXPORT_STRUCT_POD(DynamicStates, viewport, scissor, blendConstant, lineWidth, depthBiasConstant, depthBiasClamp, depthBiasSlope, depthMinBounds, depthMaxBounds, stencilStatesFront, stencilStatesBack);
    //--------------------------------------------------CLASS---------------------------------------------------------------------------
    class_<Swapchain>("Swapchain")
        .function("initialize", &Swapchain::initialize, allow_raw_pointer<arg<0>>())
        .function("destroy", &Swapchain::destroy)
        .function("resize", select_overload<void(uint32_t, uint32_t, SurfaceTransform)>(&Swapchain::resize))
        .function("destroySurface", &Swapchain::destroySurface)
        .function("createSurface", &Swapchain::createSurface, allow_raw_pointer<arg<0>>())
        .property("width", &Swapchain::getWidth)
        .property("height", &Swapchain::getHeight)
        .property("surfaceTransform", &Swapchain::getSurfaceTransform)
        .property("objectID", select_overload<uint32_t(void) const>(&Swapchain::getObjectID));
    class_<CCWGPUSwapchain, base<Swapchain>>("CCWGPUSwapchain")
        .property("depthStencilTexture", &CCWGPUSwapchain::getDepthStencilTexture, &CCWGPUSwapchain::setDepthStencilTexture)
        .property("colorTexture", &CCWGPUSwapchain::getColorTexture, &CCWGPUSwapchain::setColorTexture);

    class_<Device>("Device")
        .function("initialize", &Device::initialize)
        .function("destroy", &Device::destroy, pure_virtual())
        .function("present", &Device::present, pure_virtual())
        .function("createQueue", select_overload<Queue *(const QueueInfo &)>(&Device::createQueue), allow_raw_pointer<arg<0>>())
        .function("createSwapchain", select_overload<Swapchain *(const SwapchainInfo &)>(&Device::createSwapchain), allow_raw_pointer<arg<0>>())
        .function("createRenderPass", select_overload<RenderPass *(const RenderPassInfo &)>(&Device::createRenderPass))
        .function("createFramebuffer", select_overload<Framebuffer *(const FramebufferInfo &)>(&Device::createFramebuffer), allow_raw_pointer<arg<0>>())
        .function("createBuffer", select_overload<Buffer *(const BufferInfo &)>(&Device::createBuffer), allow_raw_pointer<arg<0>>())
        .function("createBufferView", select_overload<Buffer *(const BufferViewInfo &)>(&Device::createBuffer), allow_raw_pointer<arg<0>>())
        .function("createTexture", select_overload<Texture *(const TextureInfo &)>(&Device::createTexture), allow_raw_pointer<arg<0>>())
        .function("createTextureView", select_overload<Texture *(const TextureViewInfo &)>(&Device::createTexture), allow_raw_pointer<arg<0>>())
        .function("createDescriptorSetLayout", select_overload<DescriptorSetLayout *(const DescriptorSetLayoutInfo &)>(&Device::createDescriptorSetLayout), allow_raw_pointer<arg<0>>())
        .function("createInputAssembler", select_overload<InputAssembler *(const InputAssemblerInfo &)>(&Device::createInputAssembler), allow_raw_pointer<arg<0>>())
        .function("createPipelineState", select_overload<PipelineState *(const PipelineStateInfo &)>(&Device::createPipelineState), allow_raw_pointer<arg<0>>())
        .function("createDescriptorSet", select_overload<DescriptorSet *(const DescriptorSetInfo &)>(&Device::createDescriptorSet), allow_raw_pointer<arg<0>>())
        .function("createPipelineLayout", select_overload<PipelineLayout *(const PipelineLayoutInfo &)>(&Device::createPipelineLayout), allow_raw_pointer<arg<0>>())
        .function("getSampler", &Device::getSampler, allow_raw_pointer<arg<0>>())
        .function("getGeneralBarrier", &Device::getGeneralBarrier, allow_raw_pointer<arg<0>>())
        // .function("createTextureBarrier", select_overload<TextureBarrier*(const TextureBarrierInfo&)>(&Device::createTextureBarrier),
        //           /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        // .function("flushCommands", &Device::flushCommands, allow_raw_pointers())
        .function("present", select_overload<void(void)>(&Device::present))
        .function("enableAutoBarrier", &Device::enableAutoBarrier)
        .property("queue", &Device::getQueue)
        .property("commandBuffer", &Device::getCommandBuffer)
        .property("capabilities", &Device::getCapabilities)
        .property("name", &Device::getDeviceName)
        .property("renderer", &Device::getRenderer)
        .property("vendor", &Device::getVendor)
        .property("numDrawCalls", &Device::getNumDrawCalls)
        .property("numInstances", &Device::getNumInstances)
        .property("numTris", &Device::getNumTris);
    class_<CCWGPUDevice, base<Device>>("CCWGPUDevice")
        // .class_function("getInstance", &CCWGPUDevice::getInstance, allow_raw_pointer<arg<0>>())
        .constructor<>()
        .function("debug", &CCWGPUDevice::debug)

        .function("acquire", select_overload<void(const std::vector<Swapchain *> &)>(&CCWGPUDevice::acquire),
                  /* pure_virtual(), */ allow_raw_pointer<arg<0>>())
        .function("createShaderNative", select_overload<Shader *(const ShaderInfo &)>(&CCWGPUDevice::createShader))
        .function("copyTextureToBuffers", select_overload<void(Texture * src, const emscripten::val &, const emscripten::val &)>(&CCWGPUDevice::copyTextureToBuffers),
                  /* pure_virtual(), */ allow_raw_pointers())
        .function("copyBuffersToTexture", select_overload<void(const emscripten::val &, Texture *dst, const std::vector<BufferTextureCopy> &)>(&CCWGPUDevice::copyBuffersToTexture),
                  /* pure_virtual(), */ allow_raw_pointers())
        .function("getFormatFeatures", select_overload<uint32_t(uint32_t)>(&CCWGPUDevice::getFormatFeatures))
        .function("hasFeature", &CCWGPUDevice::hasFeature)
        .property("gfxAPI", &CCWGPUDevice::getGFXAPI)
        .property("memoryStatus", &CCWGPUDevice::getMemStatus);

    class_<RenderPass>("RenderPass")
        .class_function("computeHash", select_overload<ccstd::hash_t(const RenderPassInfo &)>(&RenderPass::computeHash), allow_raw_pointer<arg<0>>())
        .function("destroy", &RenderPass::destroy)
        .function("initialize", select_overload<void(const RenderPassInfo &)>(&CCWGPURenderPass::initialize), allow_raw_pointer<arg<0>>())
        .property("colorAttachments", &RenderPass::getColorAttachments)
        .property("depthStencilAttachment", &RenderPass::getDepthStencilAttachment)
        .property("subpasses", &RenderPass::getSubpasses)
        .property("dependencies", &RenderPass::getDependencies)
        .property("hash", &RenderPass::getHash)
        .property("objectID", select_overload<uint32_t(void) const>(&RenderPass::getObjectID));
    class_<CCWGPURenderPass, base<RenderPass>>("CCWGPURenderPass")
        .constructor<>();

    class_<Texture>("Texture")
        .class_function("computeHash", select_overload<ccstd::hash_t(const TextureInfo &)>(&Texture::computeHash), allow_raw_pointer<arg<0>>())
        .function("initialize", select_overload<void(const TextureInfo &)>(&Texture::initialize), allow_raw_pointer<arg<0>>())
        .function("initializeView", select_overload<void(const TextureViewInfo &)>(&Texture::initialize), allow_raw_pointer<arg<0>>())
        .function("destroy", &Texture::destroy)
        .function("resize", &Texture::resize)
        .property("info", &Texture::getInfo)
        .property("viewInfo", &Texture::getViewInfo)
        .property("width", &Texture::getWidth)
        .property("height", &Texture::getHeight)
        .property("size", &Texture::getSize)
        .property("isTextureView", &Texture::isTextureView)
        .property("objectID", select_overload<uint32_t(void) const>(&Texture::getObjectID));
    class_<CCWGPUTexture, base<Texture>>("CCWGPUTexture")
        .property("depth", &CCWGPUTexture::getDepth)
        .property("layerCount", &CCWGPUTexture::getLayerCount)
        .property("levelCount", &CCWGPUTexture::getLevelCount)
        .property("type", &CCWGPUTexture::getTextureType)
        .property("usage", &CCWGPUTexture::getTextureUsage)
        .property("format", &CCWGPUTexture::getTextureFormat)
        .property("samples", &CCWGPUTexture::getTextureSamples)
        .property("flags", &CCWGPUTexture::getTextureFlags)
        .constructor<>();

    class_<Framebuffer>("Framebuffer")
        .class_function("computeHash", select_overload<ccstd::hash_t(const FramebufferInfo &)>(&Framebuffer::computeHash), allow_raw_pointer<arg<0>>())
        .function("destroy", &Framebuffer::destroy)
        .function("initialize", &Framebuffer::initialize, allow_raw_pointer<arg<0>>())
        .property("objectID", select_overload<uint32_t(void) const>(&Framebuffer::getObjectID));
    class_<CCWGPUFramebuffer, base<Framebuffer>>("CCWGPUFramebuffer")
        .constructor<>()
        .property("renderPass", &CCWGPUFramebuffer::getRenderPass, &CCWGPUFramebuffer::setRenderPass)
        .property("colorTextures", &CCWGPUFramebuffer::getColorTextures, &CCWGPUFramebuffer::setColorTextures)
        .property("depthStencilTexture", &CCWGPUFramebuffer::getDepthStencilTexture, &CCWGPUFramebuffer::setDepthStencilTexture);

    class_<Sampler>("Sampler")
        .function("getInfo", &Sampler::getInfo)
        .property("hash", &Sampler::getHash)
        .property("objectID", select_overload<uint32_t(void) const>(&Sampler::getObjectID));
    class_<CCWGPUSampler, base<Sampler>>("CCWGPUSampler")
        .constructor<const SamplerInfo &>();

    class_<Buffer>("Buffer")
        .function("resize", &Buffer::resize)
        .function("destroy", &Buffer::destroy)
        .property("size", &Buffer::getSize)
        .property("stride", &Buffer::getStride)
        .property("count", &Buffer::getCount)
        .property("usage", &Buffer::getUsage)
        .property("memUsage", &Buffer::getMemUsage)
        .property("flags", &Buffer::getFlags)
        .property("objectID", select_overload<uint32_t(void) const>(&Buffer::getObjectID));
    class_<CCWGPUBuffer, base<Buffer>>("CCWGPUBuffer")
        // .function("update", select_overload<void(const DrawInfoList &infos)>(&CCWGPUBuffer::update), allow_raw_pointer<arg<0>>())
        .function("updateIndirect", select_overload<void(const DrawInfoList &)>(&CCWGPUBuffer::update))
        .function("update", select_overload<void(const emscripten::val &v, uint32_t)>(&CCWGPUBuffer::update))
        .constructor<>();

    class_<DescriptorSetLayout>("DescriptorSetLayout")
        .function("initialize", &DescriptorSetLayout::initialize)
        .function("destroy", &DescriptorSetLayout::destroy)
        .property("bindings", &DescriptorSetLayout::getBindings)
        .property("bindingIndices", &DescriptorSetLayout::getBindingIndices)
        .property("descriptorIndices", &DescriptorSetLayout::getDescriptorIndices)
        .property("objectID", select_overload<uint32_t(void) const>(&DescriptorSetLayout::getObjectID));
    class_<CCWGPUDescriptorSetLayout, base<DescriptorSetLayout>>("CCWGPUDescriptorSetLayout")
        .constructor<>();

    class_<DescriptorSet>("DescriptorSet")
        .function("initialize", &DescriptorSet::initialize)
        .function("destroy", &DescriptorSet::destroy)
        .function("update", &DescriptorSet::update)
        .function("bindBuffer", select_overload<void(uint32_t, Buffer *)>(&DescriptorSet::bindBuffer), allow_raw_pointer<arg<1>>())
        .function("bindBuffer", select_overload<void(uint32_t, Buffer *, uint32_t)>(&DescriptorSet::bindBuffer), allow_raw_pointer<arg<1>>())
        .function("bindBuffer", select_overload<void(uint32_t, Buffer *, uint32_t, AccessFlags)>(&DescriptorSet::bindBuffer), allow_raw_pointer<arg<1>>())
        .function("bindTexture", select_overload<void(uint32_t, Texture *)>(&DescriptorSet::bindTexture), allow_raw_pointer<arg<1>>())
        .function("bindTexture", select_overload<void(uint32_t, Texture *, uint32_t)>(&DescriptorSet::bindTexture), allow_raw_pointer<arg<1>>())
        .function("bindSampler", select_overload<void(uint32_t, Sampler *)>(&DescriptorSet::bindSampler), allow_raw_pointer<arg<1>>())
        .function("bindSampler", select_overload<void(uint32_t, Sampler *, uint32_t)>(&DescriptorSet::bindSampler), allow_raw_pointer<arg<1>>())
        .function("getBuffer", select_overload<Buffer *(uint32_t) const>(&DescriptorSet::getBuffer), allow_raw_pointers())
        .function("getBuffer", select_overload<Buffer *(uint32_t, uint32_t) const>(&DescriptorSet::getBuffer), allow_raw_pointers())
        .function("getTexture", select_overload<Texture *(uint32_t) const>(&DescriptorSet::getTexture), allow_raw_pointers())
        .function("getTexture", select_overload<Texture *(uint32_t, uint32_t) const>(&DescriptorSet::getTexture), allow_raw_pointers())
        .function("getSampler", select_overload<Sampler *(uint32_t) const>(&DescriptorSet::getSampler), allow_raw_pointers())
        .function("getSampler", select_overload<Sampler *(uint32_t, uint32_t) const>(&DescriptorSet::getSampler), allow_raw_pointers())
        .property("layout", &DescriptorSet::getLayout)
        .property("objectID", select_overload<uint32_t(void) const>(&DescriptorSet::getObjectID));
    class_<CCWGPUDescriptorSet, base<DescriptorSet>>("CCWGPUDescriptorSet")
        .property("gpuDescriptorSet", &CCWGPUDescriptorSet::gpuDescriptors, &CCWGPUDescriptorSet::setGpuDescriptors)
        .constructor<>();

    class_<PipelineLayout>("PipelineLayout")
        .function("initialize", &PipelineLayout::initialize)
        .function("destroy", &PipelineLayout::destroy)
        .property("setLayouts", &PipelineLayout::getSetLayouts)
        .property("objectID", select_overload<uint32_t(void) const>(&PipelineLayout::getObjectID));
    class_<CCWGPUPipelineLayout, base<PipelineLayout>>("CCWGPUPipelineLayout")
        .constructor<>();

    class_<Shader>("Shader")
        .function("destroy", &Shader::destroy)
        .property("name", &Shader::getName)
        .property("attributes", &Shader::getAttributes)
        .property("blocks", &Shader::getBlocks)
        .property("samplers", &Shader::getSamplers)
        .property("stages", &Shader::getStages)
        .property("buffers", &Shader::getBuffers)
        .property("samplerTextures", &Shader::getSamplerTextures)
        .property("textures", &Shader::getTextures)
        .property("images", &Shader::getImages)
        .property("subpassInputs", &Shader::getSubpassInputs)
        .property("objectID", select_overload<uint32_t(void) const>(&Shader::getObjectID));
    class_<CCWGPUShader, base<Shader>>("CCWGPUShader")
        .function("initialize", &CCWGPUShader::initWithWGSL)
        .function("reflectBinding", &CCWGPUShader::reflectBinding)
        .constructor<>();

    class_<InputAssembler>("InputAssembler")
        .function("initialize", &InputAssembler::initialize)
        .function("destroy", &InputAssembler::destroy)
        .property("drawInfo", &InputAssembler::getDrawInfo, &InputAssembler::setDrawInfo)
        .property("vertexCount", &InputAssembler::getVertexCount, &InputAssembler::setVertexCount)
        .property("firstVertex", &InputAssembler::getFirstVertex, &InputAssembler::setFirstVertex)
        .property("indexCount", &InputAssembler::getIndexCount, &InputAssembler::setIndexCount)
        .property("firstIndex", &InputAssembler::getFirstIndex, &InputAssembler::setFirstIndex)
        .property("vertexOffset", &InputAssembler::getVertexOffset, &InputAssembler::setVertexOffset)
        .property("instanceCount", &InputAssembler::getInstanceCount, &InputAssembler::setInstanceCount)
        .property("firstInstance", &InputAssembler::getFirstInstance, &InputAssembler::setFirstInstance)
        .property("attributesHash", &InputAssembler::getAttributesHash)
        .property("attributes", &InputAssembler::getAttributes)
        .property("vertexBuffers", &InputAssembler::getVertexBuffers)
        .property("indexBuffer", &InputAssembler::getIndexBuffer)
        .property("indirectBuffer", &InputAssembler::getIndirectBuffer)
        .property("objectID", select_overload<uint32_t(void) const>(&InputAssembler::getObjectID));
    class_<CCWGPUInputAssembler, base<InputAssembler>>("CCWGPUInputAssembler")
        .constructor<>();

    class_<CommandBuffer>("CommandBuffer")
        .function("initialize", &CommandBuffer::initialize)
        .function("destroy", &CommandBuffer::destroy)
        .function("end", &CommandBuffer::end)
        .function("endRenderPass", &CommandBuffer::endRenderPass)
        .function("setDepthBias", &CommandBuffer::setDepthBias)
        .function("setBlendConstants", &CommandBuffer::setBlendConstants)
        .function("setDepthBound", &CommandBuffer::setDepthBound)
        .function("setStencilWriteMask", &CommandBuffer::setStencilWriteMask)
        .function("setStencilCompareMask", &CommandBuffer::setStencilCompareMask)
        .function("nextSubpass", &CommandBuffer::nextSubpass)
        .function("copyBuffersToTexture", select_overload<void(const uint8_t *const *, Texture *, const BufferTextureCopy *, uint32_t)>(&CommandBuffer::copyBuffersToTexture), allow_raw_pointers())
        .function("blitTexture", select_overload<void(Texture *, Texture *, const TextureBlit *, uint32_t, Filter)>(&CommandBuffer::blitTexture), allow_raw_pointers())
        .function("execute", select_overload<void(CommandBuffer *const *, uint32_t)>(&CommandBuffer::execute), allow_raw_pointer<arg<0>>())
        .function("dispatch", &CommandBuffer::dispatch)
        .function("begin", select_overload<void(void)>(&CommandBuffer::begin))
        .function("begin", select_overload<void(RenderPass *)>(&CommandBuffer::begin), allow_raw_pointers())
        .function("begin", select_overload<void(RenderPass *, uint32_t)>(&CommandBuffer::begin), allow_raw_pointers())
        .function("begin", select_overload<void(RenderPass *, uint32_t, Framebuffer *)>(&CommandBuffer::begin), allow_raw_pointers())
        .function("execute", select_overload<void(const CommandBufferList &, uint32_t)>(&CommandBuffer::execute), allow_raw_pointers())
        .function("blitTexture2", select_overload<void(Texture *, Texture *, const TextureBlitList &, Filter)>(&CommandBuffer::blitTexture), allow_raw_pointers())
        .function("draw", select_overload<void(InputAssembler *)>(&CommandBuffer::draw), allow_raw_pointers())
        .function("type", &CommandBuffer::getType)
        .property("queue", &CommandBuffer::getQueue)
        .property("numDrawCalls", &CommandBuffer::getNumDrawCalls)
        .property("numInstances", &CommandBuffer::getNumInstances)
        .property("numTris", &CommandBuffer::getNumTris)
        .property("objectID", select_overload<uint32_t(void) const>(&CommandBuffer::getObjectID));
    class_<CCWGPUCommandBuffer, base<CommandBuffer>>("CCWGPUCommandBuffer")
        .constructor<>()
        .function("setViewport", select_overload<void(const Viewport &)>(&CCWGPUCommandBuffer::setViewport))
        .function("setScissor", select_overload<void(const Rect &)>(&CCWGPUCommandBuffer::setScissor))
        .function("beginRenderPass", select_overload<void(RenderPass *, Framebuffer *, const Rect &, const ColorList &, float, uint32_t)>(&CCWGPUCommandBuffer::beginRenderPass), allow_raw_pointers())
        .function("bindDescriptorSet", select_overload<void(uint32_t, DescriptorSet *, const std::vector<uint32_t> &)>(&CCWGPUCommandBuffer::bindDescriptorSet), allow_raw_pointers())
        .function("bindPipelineState", select_overload<void(PipelineState *)>(&CCWGPUCommandBuffer::bindPipelineState), allow_raw_pointer<arg<0>>())
        .function("bindInputAssembler", select_overload<void(InputAssembler *)>(&CCWGPUCommandBuffer::bindInputAssembler), allow_raw_pointer<arg<0>>())
        .function("drawByInfo", select_overload<void(const DrawInfo &)>(&CCWGPUCommandBuffer::draw))
        .function("updateIndirectBuffer", select_overload<void(Buffer *, const DrawInfoList &)>(&CCWGPUCommandBuffer::updateIndirectBuffer), allow_raw_pointers())
        .function("updateBuffer", select_overload<void(Buffer *, const emscripten::val &v, uint32_t)>(&CCWGPUCommandBuffer::updateBuffer), allow_raw_pointers());

    class_<Queue>("Queue")
        .function("initialize", &Queue::initialize)
        .function("destroy", &Queue::destroy)
        .function("submit", select_overload<void(const CommandBufferList &cmdBuffs)>(&Queue::submit))
        .property("type", &Queue::getType)
        .property("objectID", select_overload<uint32_t(void) const>(&Queue::getObjectID));
    class_<CCWGPUQueue, base<Queue>>("CCWGPUQueue")
        .constructor<>();

    class_<PipelineState>("PipelineState")
        .function("initialize", &Queue::initialize)
        .function("destroy", &Queue::destroy)
        .property("shader", &PipelineState::getShader)
        .property("pipelineLayout", &PipelineState::getPipelineLayout)
        .property("primitive", &PipelineState::getPrimitive)
        .property("rasterizerState", &PipelineState::getRasterizerState)
        .property("depthStencilState", &PipelineState::getDepthStencilState)
        .property("blendState", &PipelineState::getBlendState)
        .property("inputState", &PipelineState::getInputState)
        .property("dynamicStates", &PipelineState::getDynamicStates)
        .property("renderPass", &PipelineState::getRenderPass)
        .property("objectID", select_overload<uint32_t(void) const>(&PipelineState::getObjectID));
    class_<CCWGPUPipelineState, base<PipelineState>>("CCWGPUPipelineState")
        .constructor<>();

    class_<GeneralBarrier>("GeneralBarrier")
        .constructor<GeneralBarrierInfo>()
        .property("objectID", select_overload<uint32_t(void) const>(&GeneralBarrier::getObjectID));
    class_<WGPUGeneralBarrier>("WGPUGeneralBarrier")
        .constructor<GeneralBarrierInfo>();

    class_<BufferBarrier>("BufferBarrier")
        .constructor<BufferBarrierInfo>()
        .property("objectID", select_overload<uint32_t(void) const>(&BufferBarrier::getObjectID));
    class_<WGPUBufferBarrier>("WGPUBufferBarrier")
        .constructor<BufferBarrierInfo>();

    class_<TextureBarrier>("TextureBarrier")
        .constructor<TextureBarrierInfo>()
        .property("objectID", select_overload<uint32_t(void) const>(&TextureBarrier::getObjectID));
    class_<WGPUTextureBarrier>("WGPUTextureBarrier")
        .constructor<TextureBarrierInfo>();
};
} // namespace cc::gfx
