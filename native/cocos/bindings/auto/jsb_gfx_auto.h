// clang-format off
#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/renderer/GFXDeviceManager.h"

bool register_all_gfx(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::gfx::Size);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DeviceCaps);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Offset);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Rect);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Extent);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureSubresLayers);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureSubresRange);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureCopy);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureBlit);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::BufferTextureCopy);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Viewport);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Color);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::BindingMappingInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::SwapchainInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DeviceInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::BufferInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::BufferViewInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DrawInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DispatchInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::IndirectBuffer);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureViewInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::SamplerInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Uniform);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformBlock);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformSamplerTexture);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformSampler);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformTexture);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformStorageImage);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformStorageBuffer);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformInputAttachment);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::ShaderStage);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Attribute);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::ShaderInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::InputAssemblerInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::ColorAttachment);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DepthStencilAttachment);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::SubpassInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::SubpassDependency);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::RenderPassInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::GlobalBarrierInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureBarrierInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::FramebufferInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DescriptorSetLayoutBinding);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DescriptorSetLayoutInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DescriptorSetInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::PipelineLayoutInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::InputState);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::RasterizerState);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DepthStencilState);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::BlendTarget);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::BlendState);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::PipelineStateInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::CommandBufferInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::QueueInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::QueryPoolInfo);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::MemoryStatus);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::GFXObject);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Buffer);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::InputAssembler);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::CommandBuffer);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DescriptorSet);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DescriptorSetLayout);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Framebuffer);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::PipelineLayout);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::PipelineState);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::QueryPool);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Queue);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::RenderPass);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Shader);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Texture);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Swapchain);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::GlobalBarrier);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Sampler);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureBarrier);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Device);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DeviceManager);


extern se::Object *__jsb_cc_gfx_Size_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Size_class; // NOLINT

bool js_register_cc_gfx_Size(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::Size *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_DeviceCaps_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_DeviceCaps_class; // NOLINT

bool js_register_cc_gfx_DeviceCaps(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::DeviceCaps *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_Offset_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Offset_class; // NOLINT

bool js_register_cc_gfx_Offset(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::Offset *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_Rect_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Rect_class; // NOLINT

bool js_register_cc_gfx_Rect(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::Rect *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_Extent_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Extent_class; // NOLINT

bool js_register_cc_gfx_Extent(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::Extent *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_TextureSubresLayers_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_TextureSubresLayers_class; // NOLINT

bool js_register_cc_gfx_TextureSubresLayers(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureSubresLayers *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_TextureSubresRange_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_TextureSubresRange_class; // NOLINT

bool js_register_cc_gfx_TextureSubresRange(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureSubresRange *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_TextureCopy_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_TextureCopy_class; // NOLINT

bool js_register_cc_gfx_TextureCopy(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureCopy *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_TextureBlit_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_TextureBlit_class; // NOLINT

bool js_register_cc_gfx_TextureBlit(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureBlit *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_BufferTextureCopy_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_BufferTextureCopy_class; // NOLINT

bool js_register_cc_gfx_BufferTextureCopy(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::BufferTextureCopy *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_Viewport_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Viewport_class; // NOLINT

bool js_register_cc_gfx_Viewport(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::Viewport *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_Color_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Color_class; // NOLINT

bool js_register_cc_gfx_Color(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::Color *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_BindingMappingInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_BindingMappingInfo_class; // NOLINT

bool js_register_cc_gfx_BindingMappingInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::BindingMappingInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_SwapchainInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_SwapchainInfo_class; // NOLINT

bool js_register_cc_gfx_SwapchainInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::SwapchainInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_DeviceInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_DeviceInfo_class; // NOLINT

bool js_register_cc_gfx_DeviceInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::DeviceInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_BufferInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_BufferInfo_class; // NOLINT

bool js_register_cc_gfx_BufferInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::BufferInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_BufferViewInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_BufferViewInfo_class; // NOLINT

bool js_register_cc_gfx_BufferViewInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::BufferViewInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_DrawInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_DrawInfo_class; // NOLINT

bool js_register_cc_gfx_DrawInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::DrawInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_DispatchInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_DispatchInfo_class; // NOLINT

bool js_register_cc_gfx_DispatchInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::DispatchInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_IndirectBuffer_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_IndirectBuffer_class; // NOLINT

bool js_register_cc_gfx_IndirectBuffer(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::IndirectBuffer *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_TextureInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_TextureInfo_class; // NOLINT

bool js_register_cc_gfx_TextureInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_TextureViewInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_TextureViewInfo_class; // NOLINT

bool js_register_cc_gfx_TextureViewInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureViewInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_SamplerInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_SamplerInfo_class; // NOLINT

bool js_register_cc_gfx_SamplerInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::SamplerInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_Uniform_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Uniform_class; // NOLINT

bool js_register_cc_gfx_Uniform(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::Uniform *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_UniformBlock_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_UniformBlock_class; // NOLINT

bool js_register_cc_gfx_UniformBlock(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformBlock *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_UniformSamplerTexture_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_UniformSamplerTexture_class; // NOLINT

bool js_register_cc_gfx_UniformSamplerTexture(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformSamplerTexture *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_UniformSampler_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_UniformSampler_class; // NOLINT

bool js_register_cc_gfx_UniformSampler(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformSampler *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_UniformTexture_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_UniformTexture_class; // NOLINT

bool js_register_cc_gfx_UniformTexture(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformTexture *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_UniformStorageImage_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_UniformStorageImage_class; // NOLINT

bool js_register_cc_gfx_UniformStorageImage(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformStorageImage *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_UniformStorageBuffer_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_UniformStorageBuffer_class; // NOLINT

bool js_register_cc_gfx_UniformStorageBuffer(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformStorageBuffer *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_UniformInputAttachment_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_UniformInputAttachment_class; // NOLINT

bool js_register_cc_gfx_UniformInputAttachment(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformInputAttachment *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_ShaderStage_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_ShaderStage_class; // NOLINT

bool js_register_cc_gfx_ShaderStage(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::ShaderStage *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_Attribute_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Attribute_class; // NOLINT

bool js_register_cc_gfx_Attribute(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::Attribute *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_ShaderInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_ShaderInfo_class; // NOLINT

bool js_register_cc_gfx_ShaderInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::ShaderInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_InputAssemblerInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_InputAssemblerInfo_class; // NOLINT

bool js_register_cc_gfx_InputAssemblerInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::InputAssemblerInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_ColorAttachment_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_ColorAttachment_class; // NOLINT

bool js_register_cc_gfx_ColorAttachment(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::ColorAttachment *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_DepthStencilAttachment_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_DepthStencilAttachment_class; // NOLINT

bool js_register_cc_gfx_DepthStencilAttachment(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::DepthStencilAttachment *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_SubpassInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_SubpassInfo_class; // NOLINT

bool js_register_cc_gfx_SubpassInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::SubpassInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_SubpassDependency_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_SubpassDependency_class; // NOLINT

bool js_register_cc_gfx_SubpassDependency(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::SubpassDependency *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_RenderPassInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_RenderPassInfo_class; // NOLINT

bool js_register_cc_gfx_RenderPassInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::RenderPassInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_GlobalBarrierInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_GlobalBarrierInfo_class; // NOLINT

bool js_register_cc_gfx_GlobalBarrierInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::GlobalBarrierInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_TextureBarrierInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_TextureBarrierInfo_class; // NOLINT

bool js_register_cc_gfx_TextureBarrierInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureBarrierInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_FramebufferInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_FramebufferInfo_class; // NOLINT

bool js_register_cc_gfx_FramebufferInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::FramebufferInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_DescriptorSetLayoutBinding_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_DescriptorSetLayoutBinding_class; // NOLINT

bool js_register_cc_gfx_DescriptorSetLayoutBinding(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::DescriptorSetLayoutBinding *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_DescriptorSetLayoutInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_DescriptorSetLayoutInfo_class; // NOLINT

bool js_register_cc_gfx_DescriptorSetLayoutInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::DescriptorSetLayoutInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_DescriptorSetInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_DescriptorSetInfo_class; // NOLINT

bool js_register_cc_gfx_DescriptorSetInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::DescriptorSetInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_PipelineLayoutInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_PipelineLayoutInfo_class; // NOLINT

bool js_register_cc_gfx_PipelineLayoutInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::PipelineLayoutInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_InputState_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_InputState_class; // NOLINT

bool js_register_cc_gfx_InputState(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::InputState *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_RasterizerState_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_RasterizerState_class; // NOLINT

bool js_register_cc_gfx_RasterizerState(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::RasterizerState *, se::Object *ctx); //NOLINT
SE_DECLARE_FUNC(js_gfx_RasterizerState_reset);

extern se::Object *__jsb_cc_gfx_DepthStencilState_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_DepthStencilState_class; // NOLINT

bool js_register_cc_gfx_DepthStencilState(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::DepthStencilState *, se::Object *ctx); //NOLINT
SE_DECLARE_FUNC(js_gfx_DepthStencilState_reset);

extern se::Object *__jsb_cc_gfx_BlendTarget_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_BlendTarget_class; // NOLINT

bool js_register_cc_gfx_BlendTarget(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::BlendTarget *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_BlendState_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_BlendState_class; // NOLINT

bool js_register_cc_gfx_BlendState(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::BlendState *, se::Object *ctx); //NOLINT
SE_DECLARE_FUNC(js_gfx_BlendState_destroy);
SE_DECLARE_FUNC(js_gfx_BlendState_reset);
SE_DECLARE_FUNC(js_gfx_BlendState_setTarget);

extern se::Object *__jsb_cc_gfx_PipelineStateInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_PipelineStateInfo_class; // NOLINT

bool js_register_cc_gfx_PipelineStateInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::PipelineStateInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_CommandBufferInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_CommandBufferInfo_class; // NOLINT

bool js_register_cc_gfx_CommandBufferInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::CommandBufferInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_QueueInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_QueueInfo_class; // NOLINT

bool js_register_cc_gfx_QueueInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::QueueInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_QueryPoolInfo_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_QueryPoolInfo_class; // NOLINT

bool js_register_cc_gfx_QueryPoolInfo(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::QueryPoolInfo *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_MemoryStatus_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_MemoryStatus_class; // NOLINT

bool js_register_cc_gfx_MemoryStatus(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::gfx::MemoryStatus *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_gfx_GFXObject_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_GFXObject_class; // NOLINT

bool js_register_cc_gfx_GFXObject(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_GFXObject_GFXObject);

extern se::Object *__jsb_cc_gfx_Buffer_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Buffer_class; // NOLINT

bool js_register_cc_gfx_Buffer(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_Buffer_destroy);
SE_DECLARE_FUNC(js_gfx_Buffer_isBufferView);
SE_DECLARE_FUNC(js_gfx_Buffer_resize);
SE_DECLARE_FUNC(js_gfx_Buffer_computeHash);
SE_DECLARE_FUNC(js_gfx_Buffer_Buffer);

extern se::Object *__jsb_cc_gfx_InputAssembler_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_InputAssembler_class; // NOLINT

bool js_register_cc_gfx_InputAssembler(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_InputAssembler_destroy);
SE_DECLARE_FUNC(js_gfx_InputAssembler_initialize);
SE_DECLARE_FUNC(js_gfx_InputAssembler_InputAssembler);

extern se::Object *__jsb_cc_gfx_CommandBuffer_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_CommandBuffer_class; // NOLINT

bool js_register_cc_gfx_CommandBuffer(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_CommandBuffer_begin);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_beginQuery);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_beginRenderPass);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_bindDescriptorSet);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_bindInputAssembler);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_bindPipelineState);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_blitTexture);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_completeQueryPool);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_destroy);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_dispatch);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_draw);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_end);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_endQuery);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_endRenderPass);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_getNumDrawCalls);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_getNumInstances);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_getNumTris);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_getQueue);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_getType);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_initialize);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_nextSubpass);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_pipelineBarrier);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_resetQueryPool);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setBlendConstants);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setDepthBias);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setDepthBound);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setLineWidth);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setScissor);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setStencilCompareMask);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setStencilWriteMask);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setViewport);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_CommandBuffer);

extern se::Object *__jsb_cc_gfx_DescriptorSet_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_DescriptorSet_class; // NOLINT

bool js_register_cc_gfx_DescriptorSet(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_DescriptorSet_bindBuffer);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_bindBufferJSB);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_bindSampler);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_bindSamplerJSB);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_bindTexture);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_bindTextureJSB);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_destroy);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_getBuffer);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_getSampler);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_getTexture);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_initialize);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_update);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_DescriptorSet);

extern se::Object *__jsb_cc_gfx_DescriptorSetLayout_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_DescriptorSetLayout_class; // NOLINT

bool js_register_cc_gfx_DescriptorSetLayout(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_DescriptorSetLayout_destroy);
SE_DECLARE_FUNC(js_gfx_DescriptorSetLayout_getBindings);
SE_DECLARE_FUNC(js_gfx_DescriptorSetLayout_getDescriptorCount);
SE_DECLARE_FUNC(js_gfx_DescriptorSetLayout_getDynamicBindings);
SE_DECLARE_FUNC(js_gfx_DescriptorSetLayout_initialize);
SE_DECLARE_FUNC(js_gfx_DescriptorSetLayout_DescriptorSetLayout);

extern se::Object *__jsb_cc_gfx_Framebuffer_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Framebuffer_class; // NOLINT

bool js_register_cc_gfx_Framebuffer(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_Framebuffer_destroy);
SE_DECLARE_FUNC(js_gfx_Framebuffer_initialize);
SE_DECLARE_FUNC(js_gfx_Framebuffer_computeHash);
SE_DECLARE_FUNC(js_gfx_Framebuffer_Framebuffer);

extern se::Object *__jsb_cc_gfx_PipelineLayout_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_PipelineLayout_class; // NOLINT

bool js_register_cc_gfx_PipelineLayout(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_PipelineLayout_destroy);
SE_DECLARE_FUNC(js_gfx_PipelineLayout_getSetLayouts);
SE_DECLARE_FUNC(js_gfx_PipelineLayout_initialize);
SE_DECLARE_FUNC(js_gfx_PipelineLayout_PipelineLayout);

extern se::Object *__jsb_cc_gfx_PipelineState_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_PipelineState_class; // NOLINT

bool js_register_cc_gfx_PipelineState(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_PipelineState_destroy);
SE_DECLARE_FUNC(js_gfx_PipelineState_getDynamicStates);
SE_DECLARE_FUNC(js_gfx_PipelineState_getPipelineLayout);
SE_DECLARE_FUNC(js_gfx_PipelineState_initialize);
SE_DECLARE_FUNC(js_gfx_PipelineState_PipelineState);

extern se::Object *__jsb_cc_gfx_QueryPool_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_QueryPool_class; // NOLINT

bool js_register_cc_gfx_QueryPool(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_QueryPool_destroy);
SE_DECLARE_FUNC(js_gfx_QueryPool_getForceWait);
SE_DECLARE_FUNC(js_gfx_QueryPool_getMaxQueryObjects);
SE_DECLARE_FUNC(js_gfx_QueryPool_getResult);
SE_DECLARE_FUNC(js_gfx_QueryPool_getType);
SE_DECLARE_FUNC(js_gfx_QueryPool_hasResult);
SE_DECLARE_FUNC(js_gfx_QueryPool_initialize);
SE_DECLARE_FUNC(js_gfx_QueryPool_QueryPool);

extern se::Object *__jsb_cc_gfx_Queue_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Queue_class; // NOLINT

bool js_register_cc_gfx_Queue(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_Queue_destroy);
SE_DECLARE_FUNC(js_gfx_Queue_initialize);
SE_DECLARE_FUNC(js_gfx_Queue_submit);
SE_DECLARE_FUNC(js_gfx_Queue_Queue);

extern se::Object *__jsb_cc_gfx_RenderPass_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_RenderPass_class; // NOLINT

bool js_register_cc_gfx_RenderPass(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_RenderPass_destroy);
SE_DECLARE_FUNC(js_gfx_RenderPass_getDependencies);
SE_DECLARE_FUNC(js_gfx_RenderPass_getDepthStencilAttachment);
SE_DECLARE_FUNC(js_gfx_RenderPass_getSubpasses);
SE_DECLARE_FUNC(js_gfx_RenderPass_initialize);
SE_DECLARE_FUNC(js_gfx_RenderPass_computeHash);
SE_DECLARE_FUNC(js_gfx_RenderPass_RenderPass);

extern se::Object *__jsb_cc_gfx_Shader_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Shader_class; // NOLINT

bool js_register_cc_gfx_Shader(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_Shader_destroy);
SE_DECLARE_FUNC(js_gfx_Shader_getBuffers);
SE_DECLARE_FUNC(js_gfx_Shader_getImages);
SE_DECLARE_FUNC(js_gfx_Shader_getSamplerTextures);
SE_DECLARE_FUNC(js_gfx_Shader_getSubpassInputs);
SE_DECLARE_FUNC(js_gfx_Shader_getTextures);
SE_DECLARE_FUNC(js_gfx_Shader_initialize);
SE_DECLARE_FUNC(js_gfx_Shader_Shader);

extern se::Object *__jsb_cc_gfx_Texture_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Texture_class; // NOLINT

bool js_register_cc_gfx_Texture(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_Texture_destroy);
SE_DECLARE_FUNC(js_gfx_Texture_isTextureView);
SE_DECLARE_FUNC(js_gfx_Texture_resize);
SE_DECLARE_FUNC(js_gfx_Texture_computeHash);
SE_DECLARE_FUNC(js_gfx_Texture_Texture);

extern se::Object *__jsb_cc_gfx_Swapchain_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Swapchain_class; // NOLINT

bool js_register_cc_gfx_Swapchain(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_Swapchain_createSurface);
SE_DECLARE_FUNC(js_gfx_Swapchain_destroy);
SE_DECLARE_FUNC(js_gfx_Swapchain_destroySurface);
SE_DECLARE_FUNC(js_gfx_Swapchain_getVSyncMode);
SE_DECLARE_FUNC(js_gfx_Swapchain_getWindowHandle);
SE_DECLARE_FUNC(js_gfx_Swapchain_initialize);
SE_DECLARE_FUNC(js_gfx_Swapchain_resize);
SE_DECLARE_FUNC(js_gfx_Swapchain_Swapchain);

extern se::Object *__jsb_cc_gfx_GlobalBarrier_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_GlobalBarrier_class; // NOLINT

bool js_register_cc_gfx_GlobalBarrier(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_GlobalBarrier_getHash);
SE_DECLARE_FUNC(js_gfx_GlobalBarrier_getInfo);
SE_DECLARE_FUNC(js_gfx_GlobalBarrier_computeHash);
SE_DECLARE_FUNC(js_gfx_GlobalBarrier_GlobalBarrier);

extern se::Object *__jsb_cc_gfx_Sampler_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Sampler_class; // NOLINT

bool js_register_cc_gfx_Sampler(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_Sampler_getHash);
SE_DECLARE_FUNC(js_gfx_Sampler_computeHash);
SE_DECLARE_FUNC(js_gfx_Sampler_unpackFromHash);
SE_DECLARE_FUNC(js_gfx_Sampler_Sampler);

extern se::Object *__jsb_cc_gfx_TextureBarrier_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_TextureBarrier_class; // NOLINT

bool js_register_cc_gfx_TextureBarrier(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_TextureBarrier_getHash);
SE_DECLARE_FUNC(js_gfx_TextureBarrier_getInfo);
SE_DECLARE_FUNC(js_gfx_TextureBarrier_computeHash);
SE_DECLARE_FUNC(js_gfx_TextureBarrier_TextureBarrier);

extern se::Object *__jsb_cc_gfx_Device_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_Device_class; // NOLINT

bool js_register_cc_gfx_Device(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_Device_acquire);
SE_DECLARE_FUNC(js_gfx_Device_bindingMappingInfo);
SE_DECLARE_FUNC(js_gfx_Device_createCommandBuffer);
SE_DECLARE_FUNC(js_gfx_Device_createDescriptorSet);
SE_DECLARE_FUNC(js_gfx_Device_createDescriptorSetLayout);
SE_DECLARE_FUNC(js_gfx_Device_createFramebuffer);
SE_DECLARE_FUNC(js_gfx_Device_createInputAssembler);
SE_DECLARE_FUNC(js_gfx_Device_createPipelineLayout);
SE_DECLARE_FUNC(js_gfx_Device_createPipelineState);
SE_DECLARE_FUNC(js_gfx_Device_createQueryPool);
SE_DECLARE_FUNC(js_gfx_Device_createQueue);
SE_DECLARE_FUNC(js_gfx_Device_createRenderPass);
SE_DECLARE_FUNC(js_gfx_Device_createShader);
SE_DECLARE_FUNC(js_gfx_Device_createSwapchain);
SE_DECLARE_FUNC(js_gfx_Device_destroy);
SE_DECLARE_FUNC(js_gfx_Device_flushCommands);
SE_DECLARE_FUNC(js_gfx_Device_getFormatFeatures);
SE_DECLARE_FUNC(js_gfx_Device_getGlobalBarrier);
SE_DECLARE_FUNC(js_gfx_Device_getQueryPool);
SE_DECLARE_FUNC(js_gfx_Device_getQueryPoolResults);
SE_DECLARE_FUNC(js_gfx_Device_getSampler);
SE_DECLARE_FUNC(js_gfx_Device_getTextureBarrier);
SE_DECLARE_FUNC(js_gfx_Device_hasFeature);
SE_DECLARE_FUNC(js_gfx_Device_initialize);
SE_DECLARE_FUNC(js_gfx_Device_present);

extern se::Object *__jsb_cc_gfx_DeviceManager_proto; // NOLINT
extern se::Class * __jsb_cc_gfx_DeviceManager_class; // NOLINT

bool js_register_cc_gfx_DeviceManager(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_gfx_DeviceManager_addSurfaceEventListener);
SE_DECLARE_FUNC(js_gfx_DeviceManager_create);
SE_DECLARE_FUNC(js_gfx_DeviceManager_destroy);
// clang-format on