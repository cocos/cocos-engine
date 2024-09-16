// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// gfx at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="gfx") gfx

// Disable some swig warnings, find warning number reference here ( https://www.swig.org/Doc4.1/Warnings.html )
#pragma SWIG nowarn=503,302,401,317,402

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "renderer/GFXDeviceManager.h"
%}

// Insert code at the beginning of generated source file (.cpp)
%{
#include "bindings/auto/jsb_gfx_auto.h"
%}

// ----- Ignore Section ------
// Brief: Classes, methods or attributes need to be ignored
//
// Usage:
//
//  %ignore your_namespace::your_class_name;
//  %ignore your_namespace::your_class_name::your_method_name;
//  %ignore your_namespace::your_class_name::your_attribute_name;
//
// Note:
//  1. 'Ignore Section' should be placed before attribute definition and %import/%include
//  2. namespace is needed
//

// ----- Rename Section ------
// Brief: Classes, methods or attributes needs to be renamed
//
// Usage:
//
//  %rename(rename_to_name) your_namespace::original_class_name;
//  %rename(rename_to_name) your_namespace::original_class_name::method_name;
//  %rename(rename_to_name) your_namespace::original_class_name::attribute_name;
//
// Note:
//  1. 'Rename Section' should be placed before attribute definition and %import/%include
//  2. namespace is needed

%ignore cc::RefCounted;

namespace cc { namespace gfx {

// TODO(cjh): use regex to ignore
%ignore TextureInfo::_padding;
%ignore TextureViewInfo::_padding;
%ignore ColorAttachment::_padding;
%ignore DepthStencilAttachment::_padding;
%ignore SubpassDependency::_padding;
%ignore BufferInfo::_padding;

%ignore Buffer::initialize;
%ignore Buffer::update;
%ignore Buffer::write;

%ignore CommandBuffer::execute;
%ignore CommandBuffer::updateBuffer;
%ignore CommandBuffer::resolveTexture;
%ignore CommandBuffer::copyBuffersToTexture;
%rename(drawWithInfo) CommandBuffer::draw(const DrawInfo&);

%ignore DescriptorSetLayout::getBindingIndices;
%ignore DescriptorSetLayout::descriptorIndices;
%ignore DescriptorSetLayout::getDescriptorIndices;

%ignore DescriptorSet::DescriptorSet;
%ignore DescriptorSet::forceUpdate;

%ignore BufferBarrier::BufferBarrier;

%ignore CommandBuffer::execute;
%ignore CommandBuffer::updateBuffer;
%ignore CommandBuffer::copyBuffersToTexture;

%ignore Device::copyBuffersToTexture;
%ignore Device::copyTextureToBuffers;
%ignore Device::createBuffer;
%ignore Device::createTexture;
%ignore Device::getInstance;
%ignore Device::setOptions;
%ignore Device::getOptions;
%ignore Device::frameSync;

%ignore DeviceManager::isDetachDeviceThread;
%ignore DeviceManager::getGFXName;

// %ignore FormatInfo;

%ignore DefaultResource;

}} // namespace cc { namespace gfx {

// ----- Module Macro Section ------
// Brief: Generated code should be wrapped inside a macro
// Usage:
//  1. Configure for class
//    %module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::GeometryRenderer;
//  2. Configure for member function or attribute
//    %module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::RenderPipeline::geometryRenderer;
// Note: Should be placed before 'Attribute Section'

// Write your code bellow


// ----- Attribute Section ------
// Brief: Define attributes ( JS properties with getter and setter )
// Usage:
//  1. Define an attribute without setter
//    %attribute(your_namespace::your_class_name, cpp_member_variable_type, js_property_name, cpp_getter_name)
//  2. Define an attribute with getter and setter
//    %attribute(your_namespace::your_class_name, cpp_member_variable_type, js_property_name, cpp_getter_name, cpp_setter_name)
//  3. Define an attribute without getter
//    %attribute_writeonly(your_namespace::your_class_name, cpp_member_variable_type, js_property_name, cpp_setter_name)
//
// Note:
//  1. Don't need to add 'const' prefix for cpp_member_variable_type
//  2. The return type of getter should keep the same as the type of setter's parameter
//  3. If using reference, add '&' suffix for cpp_member_variable_type to avoid generated code using value assignment
//  4. 'Attribute Section' should be placed before 'Import Section' and 'Include Section'
//
// Device
%attribute(cc::gfx::Device, cc::gfx::API, gfxAPI, getGfxAPI);
%attribute(cc::gfx::Device, ccstd::string&, deviceName, getDeviceName);
%attribute(cc::gfx::Device, cc::gfx::MemoryStatus&, memoryStatus, getMemoryStatus);
%attribute(cc::gfx::Device, cc::gfx::Queue*, queue, getQueue);
%attribute(cc::gfx::Device, cc::gfx::CommandBuffer*, commandBuffer, getCommandBuffer);
%attribute(cc::gfx::Device, ccstd::string&, renderer, getRenderer);
%attribute(cc::gfx::Device, ccstd::string&, vendor, getVendor);
%attribute(cc::gfx::Device, uint32_t, numDrawCalls, getNumDrawCalls);
%attribute(cc::gfx::Device, uint32_t, numInstances, getNumInstances);
%attribute(cc::gfx::Device, uint32_t, numTris, getNumTris);
%attribute(cc::gfx::Device, cc::gfx::DeviceCaps&, capabilities, getCapabilities);

// Shader
%attribute(cc::gfx::Shader, ccstd::string&, name, getName);
%attribute(cc::gfx::Shader, cc::gfx::ShaderStageList&, stages, getStages);
%attribute(cc::gfx::Shader, cc::gfx::AttributeList&, attributes, getAttributes);
%attribute(cc::gfx::Shader, cc::gfx::UniformBlockList&, blocks, getBlocks);
%attribute(cc::gfx::Shader, cc::gfx::UniformSamplerList&, samplers, getSamplers);

// Texture
%attribute(cc::gfx::Texture, cc::gfx::TextureInfo&, info, getInfo);
%attribute(cc::gfx::Texture, cc::gfx::TextureViewInfo&, viewInfo, getViewInfo);
%attribute(cc::gfx::Texture, uint32_t, width, getWidth);
%attribute(cc::gfx::Texture, uint32_t, height, getHeight);
%attribute(cc::gfx::Texture, cc::gfx::Format, format, getFormat);
%attribute(cc::gfx::Texture, uint32_t, size, getSize);
%attribute(cc::gfx::Texture, ccstd::hash_t, hash, getHash);

// Queue
%attribute(cc::gfx::Queue, cc::gfx::QueueType, type, getType);

// RenderPass
%attribute(cc::gfx::RenderPass, ccstd::hash_t, hash, getHash);

// DescriptorSet
%attribute(cc::gfx::DescriptorSet, cc::gfx::DescriptorSetLayout*, layout, getLayout);

// DescriptorSetLayout
%attribute(cc::gfx::DescriptorSetLayout, cc::gfx::DescriptorSetLayoutBindingList&, bindings, getBindings);

// PipelineState
%attribute(cc::gfx::PipelineState, cc::gfx::Shader*, shader, getShader);
%attribute(cc::gfx::PipelineState, cc::gfx::PrimitiveMode, primitive, getPrimitive);
%attribute(cc::gfx::PipelineState, cc::gfx::PipelineBindPoint, bindPoint, getBindPoint);
%attribute(cc::gfx::PipelineState, cc::gfx::InputState&, inputState, getInputState);
%attribute(cc::gfx::PipelineState, cc::gfx::RasterizerState&, rasterizerState, getRasterizerState);
%attribute(cc::gfx::PipelineState, cc::gfx::DepthStencilState&, depthStencilState, getDepthStencilState);
%attribute(cc::gfx::PipelineState, cc::gfx::BlendState&, blendState, getBlendState);
%attribute(cc::gfx::PipelineState, cc::gfx::RenderPass*, renderPass, getRenderPass);

// InputAssembler
%attribute(cc::gfx::InputAssembler, cc::gfx::BufferList&, vertexBuffers, getVertexBuffers);
%attribute(cc::gfx::InputAssembler, cc::gfx::AttributeList&, attributes, getAttributes);
%attribute(cc::gfx::InputAssembler, cc::gfx::Buffer*, indexBuffer, getIndexBuffer);
%attribute(cc::gfx::InputAssembler, cc::gfx::Buffer*, indirectBuffer, getIndirectBuffer);
%attribute(cc::gfx::InputAssembler, uint32_t, attributesHash, getAttributesHash);

%attribute(cc::gfx::InputAssembler, cc::gfx::DrawInfo&, drawInfo, getDrawInfo, setDrawInfo);
%attribute(cc::gfx::InputAssembler, uint32_t, vertexCount, getVertexCount, setVertexCount);
%attribute(cc::gfx::InputAssembler, uint32_t, firstVertex, getFirstVertex, setFirstVertex);
%attribute(cc::gfx::InputAssembler, uint32_t, indexCount, getIndexCount, setIndexCount);
%attribute(cc::gfx::InputAssembler, uint32_t, firstIndex, getFirstIndex, setFirstIndex);
%attribute(cc::gfx::InputAssembler, uint32_t, vertexOffset, getVertexOffset, setVertexOffset);
%attribute(cc::gfx::InputAssembler, uint32_t, instanceCount, getInstanceCount, setInstanceCount);
%attribute(cc::gfx::InputAssembler, uint32_t, firstInstance, getFirstInstance, setFirstInstance);

// CommandBuffer
%attribute(cc::gfx::CommandBuffer, cc::gfx::CommandBufferType, type, getType);
%attribute(cc::gfx::CommandBuffer, cc::gfx::Queue*, queue, getQueue);
%attribute(cc::gfx::CommandBuffer, uint32_t, numDrawCalls, getNumDrawCalls);
%attribute(cc::gfx::CommandBuffer, uint32_t, numInstances, getNumInstances);
%attribute(cc::gfx::CommandBuffer, uint32_t, numTris, getNumTris);

// Framebuffer
%attribute(cc::gfx::Framebuffer, cc::gfx::RenderPass*, renderPass, getRenderPass);
%attribute(cc::gfx::Framebuffer, cc::gfx::TextureList&, colorTextures, getColorTextures);
%attribute(cc::gfx::Framebuffer, cc::gfx::Texture*, depthStencilTexture, getDepthStencilTexture);

// Buffer
%attribute(cc::gfx::Buffer, cc::gfx::BufferUsage, usage, getUsage);
%attribute(cc::gfx::Buffer, cc::gfx::MemoryUsage, memUsage, getMemUsage);
%attribute(cc::gfx::Buffer, uint32_t, stride, getStride);
%attribute(cc::gfx::Buffer, uint32_t, count, getCount);
%attribute(cc::gfx::Buffer, uint32_t, size, getSize);
%attribute(cc::gfx::Buffer, cc::gfx::BufferFlags, flags, getFlags);

// Sampler
%attribute(cc::gfx::Sampler, cc::gfx::SamplerInfo&, info, getInfo);
%attribute(cc::gfx::Sampler, ccstd::hash_t, hash, getHash);

// Swapchain
%attribute(cc::gfx::Swapchain, uint32_t, width, getWidth);
%attribute(cc::gfx::Swapchain, uint32_t, height, getHeight);
%attribute(cc::gfx::Swapchain, cc::gfx::SurfaceTransform, surfaceTransform, getSurfaceTransform);
%attribute(cc::gfx::Swapchain, cc::gfx::Texture*, colorTexture, getColorTexture);
%attribute(cc::gfx::Swapchain, cc::gfx::Texture*, depthStencilTexture, getDepthStencilTexture);

// GFXObject
%attribute(cc::gfx::GFXObject, cc::gfx::ObjectType, objectType, getObjectType);
%attribute(cc::gfx::GFXObject, uint32_t, objectID, getObjectID);
%attribute(cc::gfx::GFXObject, uint32_t, typedID, getTypedID);

// GeneralBarrier
%attribute(cc::gfx::GeneralBarrier, ccstd::hash_t, hash, getHash);
%attribute(cc::gfx::GeneralBarrier, cc::gfx::GeneralBarrierInfo&, info, getInfo);

// TextureBarrier
%attribute(cc::gfx::TextureBarrier, ccstd::hash_t, hash, getHash);
%attribute(cc::gfx::TextureBarrier, cc::gfx::TextureBarrierInfo&, info, getInfo);


// ----- Release Returned Cpp Object in GC Section ------
%release_returned_cpp_object_in_gc(cc::gfx::Device::createCommandBuffer);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createQueue);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createQueryPool);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createSwapchain);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createBuffer);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createTexture);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createShader);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createInputAssembler);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createRenderPass);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createFramebuffer);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createDescriptorSet);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createDescriptorSetLayout);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createPipelineLayout);
%release_returned_cpp_object_in_gc(cc::gfx::Device::createPipelineState);

// ----- Import Section ------
// Brief: Import header files which are depended by 'Include Section'
// Note:
//   %import "your_header_file.h" will not generate code for that header file
//
%import "base/Macros.h"
%import "base/RefCounted.h"
%import "base/memory/Memory.h"

// ----- Include Section ------
// Brief: Include header files in which classes and methods will be bound
%include "renderer/gfx-base/GFXDef-common.h"
%include "renderer/gfx-base/GFXObject.h"
%include "renderer/gfx-base/GFXBuffer.h"
%include "renderer/gfx-base/GFXCommandBuffer.h"
%include "renderer/gfx-base/GFXDescriptorSet.h"
%include "renderer/gfx-base/GFXDescriptorSetLayout.h"
%include "renderer/gfx-base/GFXFramebuffer.h"
%include "renderer/gfx-base/GFXInputAssembler.h"
%include "renderer/gfx-base/GFXPipelineLayout.h"
%include "renderer/gfx-base/GFXPipelineState.h"
%include "renderer/gfx-base/GFXQueryPool.h"
%include "renderer/gfx-base/GFXQueue.h"
%include "renderer/gfx-base/GFXRenderPass.h"
%include "renderer/gfx-base/GFXShader.h"
%include "renderer/gfx-base/GFXSwapchain.h"
%include "renderer/gfx-base/GFXTexture.h"

%include "renderer/gfx-base/states/GFXGeneralBarrier.h"
%include "renderer/gfx-base/states/GFXSampler.h"
%include "renderer/gfx-base/states/GFXTextureBarrier.h"
%include "renderer/gfx-base/states/GFXBufferBarrier.h"

%include "renderer/gfx-base/GFXDevice.h"

%include "renderer/GFXDeviceManager.h"
