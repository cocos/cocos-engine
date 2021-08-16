#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/renderer/gfx-base/GFXBase.h"
#include "cocos/renderer/GFXDeviceManager.h"

extern se::Object* __jsb_cc_gfx_Size_proto;
extern se::Class* __jsb_cc_gfx_Size_class;

bool js_register_cc_gfx_Size(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::Size *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Size);

extern se::Object* __jsb_cc_gfx_DeviceCaps_proto;
extern se::Class* __jsb_cc_gfx_DeviceCaps_class;

bool js_register_cc_gfx_DeviceCaps(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::DeviceCaps *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DeviceCaps);

extern se::Object* __jsb_cc_gfx_Offset_proto;
extern se::Class* __jsb_cc_gfx_Offset_class;

bool js_register_cc_gfx_Offset(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::Offset *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Offset);

extern se::Object* __jsb_cc_gfx_Rect_proto;
extern se::Class* __jsb_cc_gfx_Rect_class;

bool js_register_cc_gfx_Rect(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::Rect *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Rect);

extern se::Object* __jsb_cc_gfx_Extent_proto;
extern se::Class* __jsb_cc_gfx_Extent_class;

bool js_register_cc_gfx_Extent(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::Extent *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Extent);

extern se::Object* __jsb_cc_gfx_TextureSubresLayers_proto;
extern se::Class* __jsb_cc_gfx_TextureSubresLayers_class;

bool js_register_cc_gfx_TextureSubresLayers(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureSubresLayers *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureSubresLayers);

extern se::Object* __jsb_cc_gfx_TextureSubresRange_proto;
extern se::Class* __jsb_cc_gfx_TextureSubresRange_class;

bool js_register_cc_gfx_TextureSubresRange(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureSubresRange *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureSubresRange);

extern se::Object* __jsb_cc_gfx_TextureCopy_proto;
extern se::Class* __jsb_cc_gfx_TextureCopy_class;

bool js_register_cc_gfx_TextureCopy(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureCopy *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureCopy);

extern se::Object* __jsb_cc_gfx_TextureBlit_proto;
extern se::Class* __jsb_cc_gfx_TextureBlit_class;

bool js_register_cc_gfx_TextureBlit(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureBlit *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureBlit);

extern se::Object* __jsb_cc_gfx_BufferTextureCopy_proto;
extern se::Class* __jsb_cc_gfx_BufferTextureCopy_class;

bool js_register_cc_gfx_BufferTextureCopy(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::BufferTextureCopy *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::BufferTextureCopy);

extern se::Object* __jsb_cc_gfx_Viewport_proto;
extern se::Class* __jsb_cc_gfx_Viewport_class;

bool js_register_cc_gfx_Viewport(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::Viewport *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Viewport);

extern se::Object* __jsb_cc_gfx_Color_proto;
extern se::Class* __jsb_cc_gfx_Color_class;

bool js_register_cc_gfx_Color(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::Color *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Color);

extern se::Object* __jsb_cc_gfx_BindingMappingInfo_proto;
extern se::Class* __jsb_cc_gfx_BindingMappingInfo_class;

bool js_register_cc_gfx_BindingMappingInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::BindingMappingInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::BindingMappingInfo);

extern se::Object* __jsb_cc_gfx_BufferInfo_proto;
extern se::Class* __jsb_cc_gfx_BufferInfo_class;

bool js_register_cc_gfx_BufferInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::BufferInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::BufferInfo);

extern se::Object* __jsb_cc_gfx_BufferViewInfo_proto;
extern se::Class* __jsb_cc_gfx_BufferViewInfo_class;

bool js_register_cc_gfx_BufferViewInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::BufferViewInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::BufferViewInfo);

extern se::Object* __jsb_cc_gfx_DrawInfo_proto;
extern se::Class* __jsb_cc_gfx_DrawInfo_class;

bool js_register_cc_gfx_DrawInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::DrawInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DrawInfo);

extern se::Object* __jsb_cc_gfx_DispatchInfo_proto;
extern se::Class* __jsb_cc_gfx_DispatchInfo_class;

bool js_register_cc_gfx_DispatchInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::DispatchInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DispatchInfo);

extern se::Object* __jsb_cc_gfx_IndirectBuffer_proto;
extern se::Class* __jsb_cc_gfx_IndirectBuffer_class;

bool js_register_cc_gfx_IndirectBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::IndirectBuffer *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::IndirectBuffer);

extern se::Object* __jsb_cc_gfx_TextureInfo_proto;
extern se::Class* __jsb_cc_gfx_TextureInfo_class;

bool js_register_cc_gfx_TextureInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureInfo);

extern se::Object* __jsb_cc_gfx_TextureViewInfo_proto;
extern se::Class* __jsb_cc_gfx_TextureViewInfo_class;

bool js_register_cc_gfx_TextureViewInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureViewInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureViewInfo);

extern se::Object* __jsb_cc_gfx_SamplerInfo_proto;
extern se::Class* __jsb_cc_gfx_SamplerInfo_class;

bool js_register_cc_gfx_SamplerInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::SamplerInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::SamplerInfo);

extern se::Object* __jsb_cc_gfx_Uniform_proto;
extern se::Class* __jsb_cc_gfx_Uniform_class;

bool js_register_cc_gfx_Uniform(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::Uniform *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Uniform);

extern se::Object* __jsb_cc_gfx_UniformBlock_proto;
extern se::Class* __jsb_cc_gfx_UniformBlock_class;

bool js_register_cc_gfx_UniformBlock(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformBlock *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformBlock);

extern se::Object* __jsb_cc_gfx_UniformSamplerTexture_proto;
extern se::Class* __jsb_cc_gfx_UniformSamplerTexture_class;

bool js_register_cc_gfx_UniformSamplerTexture(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformSamplerTexture *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformSamplerTexture);

extern se::Object* __jsb_cc_gfx_UniformSampler_proto;
extern se::Class* __jsb_cc_gfx_UniformSampler_class;

bool js_register_cc_gfx_UniformSampler(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformSampler *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformSampler);

extern se::Object* __jsb_cc_gfx_UniformTexture_proto;
extern se::Class* __jsb_cc_gfx_UniformTexture_class;

bool js_register_cc_gfx_UniformTexture(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformTexture *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformTexture);

extern se::Object* __jsb_cc_gfx_UniformStorageImage_proto;
extern se::Class* __jsb_cc_gfx_UniformStorageImage_class;

bool js_register_cc_gfx_UniformStorageImage(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformStorageImage *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformStorageImage);

extern se::Object* __jsb_cc_gfx_UniformStorageBuffer_proto;
extern se::Class* __jsb_cc_gfx_UniformStorageBuffer_class;

bool js_register_cc_gfx_UniformStorageBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformStorageBuffer *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformStorageBuffer);

extern se::Object* __jsb_cc_gfx_UniformInputAttachment_proto;
extern se::Class* __jsb_cc_gfx_UniformInputAttachment_class;

bool js_register_cc_gfx_UniformInputAttachment(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::UniformInputAttachment *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::UniformInputAttachment);

extern se::Object* __jsb_cc_gfx_ShaderStage_proto;
extern se::Class* __jsb_cc_gfx_ShaderStage_class;

bool js_register_cc_gfx_ShaderStage(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::ShaderStage *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::ShaderStage);

extern se::Object* __jsb_cc_gfx_Attribute_proto;
extern se::Class* __jsb_cc_gfx_Attribute_class;

bool js_register_cc_gfx_Attribute(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::Attribute *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::Attribute);

extern se::Object* __jsb_cc_gfx_ShaderInfo_proto;
extern se::Class* __jsb_cc_gfx_ShaderInfo_class;

bool js_register_cc_gfx_ShaderInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::ShaderInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::ShaderInfo);

extern se::Object* __jsb_cc_gfx_InputAssemblerInfo_proto;
extern se::Class* __jsb_cc_gfx_InputAssemblerInfo_class;

bool js_register_cc_gfx_InputAssemblerInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::InputAssemblerInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::InputAssemblerInfo);

extern se::Object* __jsb_cc_gfx_ColorAttachment_proto;
extern se::Class* __jsb_cc_gfx_ColorAttachment_class;

bool js_register_cc_gfx_ColorAttachment(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::ColorAttachment *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::ColorAttachment);

extern se::Object* __jsb_cc_gfx_DepthStencilAttachment_proto;
extern se::Class* __jsb_cc_gfx_DepthStencilAttachment_class;

bool js_register_cc_gfx_DepthStencilAttachment(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::DepthStencilAttachment *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DepthStencilAttachment);

extern se::Object* __jsb_cc_gfx_SubpassInfo_proto;
extern se::Class* __jsb_cc_gfx_SubpassInfo_class;

bool js_register_cc_gfx_SubpassInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::SubpassInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::SubpassInfo);

extern se::Object* __jsb_cc_gfx_SubpassDependency_proto;
extern se::Class* __jsb_cc_gfx_SubpassDependency_class;

bool js_register_cc_gfx_SubpassDependency(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::SubpassDependency *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::SubpassDependency);

extern se::Object* __jsb_cc_gfx_RenderPassInfo_proto;
extern se::Class* __jsb_cc_gfx_RenderPassInfo_class;

bool js_register_cc_gfx_RenderPassInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::RenderPassInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::RenderPassInfo);

extern se::Object* __jsb_cc_gfx_GlobalBarrierInfo_proto;
extern se::Class* __jsb_cc_gfx_GlobalBarrierInfo_class;

bool js_register_cc_gfx_GlobalBarrierInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::GlobalBarrierInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::GlobalBarrierInfo);

extern se::Object* __jsb_cc_gfx_TextureBarrierInfo_proto;
extern se::Class* __jsb_cc_gfx_TextureBarrierInfo_class;

bool js_register_cc_gfx_TextureBarrierInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::TextureBarrierInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureBarrierInfo);

extern se::Object* __jsb_cc_gfx_FramebufferInfo_proto;
extern se::Class* __jsb_cc_gfx_FramebufferInfo_class;

bool js_register_cc_gfx_FramebufferInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::FramebufferInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::FramebufferInfo);

extern se::Object* __jsb_cc_gfx_DescriptorSetLayoutBinding_proto;
extern se::Class* __jsb_cc_gfx_DescriptorSetLayoutBinding_class;

bool js_register_cc_gfx_DescriptorSetLayoutBinding(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::DescriptorSetLayoutBinding *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DescriptorSetLayoutBinding);

extern se::Object* __jsb_cc_gfx_DescriptorSetLayoutInfo_proto;
extern se::Class* __jsb_cc_gfx_DescriptorSetLayoutInfo_class;

bool js_register_cc_gfx_DescriptorSetLayoutInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::DescriptorSetLayoutInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DescriptorSetLayoutInfo);

extern se::Object* __jsb_cc_gfx_DescriptorSetInfo_proto;
extern se::Class* __jsb_cc_gfx_DescriptorSetInfo_class;

bool js_register_cc_gfx_DescriptorSetInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::DescriptorSetInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DescriptorSetInfo);

extern se::Object* __jsb_cc_gfx_PipelineLayoutInfo_proto;
extern se::Class* __jsb_cc_gfx_PipelineLayoutInfo_class;

bool js_register_cc_gfx_PipelineLayoutInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::PipelineLayoutInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::PipelineLayoutInfo);

extern se::Object* __jsb_cc_gfx_InputState_proto;
extern se::Class* __jsb_cc_gfx_InputState_class;

bool js_register_cc_gfx_InputState(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::InputState *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::InputState);

extern se::Object* __jsb_cc_gfx_RasterizerState_proto;
extern se::Class* __jsb_cc_gfx_RasterizerState_class;

bool js_register_cc_gfx_RasterizerState(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::RasterizerState *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::RasterizerState);

extern se::Object* __jsb_cc_gfx_DepthStencilState_proto;
extern se::Class* __jsb_cc_gfx_DepthStencilState_class;

bool js_register_cc_gfx_DepthStencilState(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::DepthStencilState *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DepthStencilState);

extern se::Object* __jsb_cc_gfx_BlendTarget_proto;
extern se::Class* __jsb_cc_gfx_BlendTarget_class;

bool js_register_cc_gfx_BlendTarget(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::BlendTarget *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::BlendTarget);

extern se::Object* __jsb_cc_gfx_BlendState_proto;
extern se::Class* __jsb_cc_gfx_BlendState_class;

bool js_register_cc_gfx_BlendState(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::BlendState *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::BlendState);

extern se::Object* __jsb_cc_gfx_PipelineStateInfo_proto;
extern se::Class* __jsb_cc_gfx_PipelineStateInfo_class;

bool js_register_cc_gfx_PipelineStateInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::PipelineStateInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::PipelineStateInfo);

extern se::Object* __jsb_cc_gfx_CommandBufferInfo_proto;
extern se::Class* __jsb_cc_gfx_CommandBufferInfo_class;

bool js_register_cc_gfx_CommandBufferInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::CommandBufferInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::CommandBufferInfo);

extern se::Object* __jsb_cc_gfx_QueueInfo_proto;
extern se::Class* __jsb_cc_gfx_QueueInfo_class;

bool js_register_cc_gfx_QueueInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::QueueInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::QueueInfo);

extern se::Object* __jsb_cc_gfx_MemoryStatus_proto;
extern se::Class* __jsb_cc_gfx_MemoryStatus_class;

bool js_register_cc_gfx_MemoryStatus(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::MemoryStatus *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::MemoryStatus);

extern se::Object* __jsb_cc_gfx_DeviceInfo_proto;
extern se::Class* __jsb_cc_gfx_DeviceInfo_class;

bool js_register_cc_gfx_DeviceInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::DeviceInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::DeviceInfo);

extern se::Object* __jsb_cc_gfx_ContextInfo_proto;
extern se::Class* __jsb_cc_gfx_ContextInfo_class;

bool js_register_cc_gfx_ContextInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::gfx::ContextInfo *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::gfx::ContextInfo);

extern se::Object* __jsb_cc_gfx_GFXObject_proto;
extern se::Class* __jsb_cc_gfx_GFXObject_class;

bool js_register_cc_gfx_GFXObject(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::GFXObject);
SE_DECLARE_FUNC(js_gfx_GFXObject_resizeObjectID);
SE_DECLARE_FUNC(js_gfx_GFXObject_GFXObject);

extern se::Object* __jsb_cc_gfx_Buffer_proto;
extern se::Class* __jsb_cc_gfx_Buffer_class;

bool js_register_cc_gfx_Buffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::Buffer);
SE_DECLARE_FUNC(js_gfx_Buffer_destroy);
SE_DECLARE_FUNC(js_gfx_Buffer_isBufferView);
SE_DECLARE_FUNC(js_gfx_Buffer_resize);
SE_DECLARE_FUNC(js_gfx_Buffer_computeHash);
SE_DECLARE_FUNC(js_gfx_Buffer_Buffer);

extern se::Object* __jsb_cc_gfx_InputAssembler_proto;
extern se::Class* __jsb_cc_gfx_InputAssembler_class;

bool js_register_cc_gfx_InputAssembler(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::InputAssembler);
SE_DECLARE_FUNC(js_gfx_InputAssembler_destroy);
SE_DECLARE_FUNC(js_gfx_InputAssembler_initialize);
SE_DECLARE_FUNC(js_gfx_InputAssembler_InputAssembler);

extern se::Object* __jsb_cc_gfx_CommandBuffer_proto;
extern se::Class* __jsb_cc_gfx_CommandBuffer_class;

bool js_register_cc_gfx_CommandBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::CommandBuffer);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_begin);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_beginRenderPassForJS);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_bindDescriptorSetForJS);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_bindInputAssembler);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_bindPipelineState);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_blitTexture);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_destroy);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_dispatch);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_draw);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_end);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_endRenderPass);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_getNumDrawCalls);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_getNumInstances);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_getNumTris);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_getQueue);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_getType);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_initialize);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_nextSubpass);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_pipelineBarrier);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setBlendConstants);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setDepthBias);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setDepthBound);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setLineWidth);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setScissor);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setStencilCompareMask);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setStencilWriteMask);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_setViewport);
SE_DECLARE_FUNC(js_gfx_CommandBuffer_CommandBuffer);

extern se::Object* __jsb_cc_gfx_Context_proto;
extern se::Class* __jsb_cc_gfx_Context_class;

bool js_register_cc_gfx_Context(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::Context);
SE_DECLARE_FUNC(js_gfx_Context_destroy);
SE_DECLARE_FUNC(js_gfx_Context_initialize);
SE_DECLARE_FUNC(js_gfx_Context_present);
SE_DECLARE_FUNC(js_gfx_Context_Context);

extern se::Object* __jsb_cc_gfx_DescriptorSet_proto;
extern se::Class* __jsb_cc_gfx_DescriptorSet_class;

bool js_register_cc_gfx_DescriptorSet(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::DescriptorSet);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_bindBuffer);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_bindBufferJSB);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_bindSampler);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_bindSamplerJSB);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_bindTexture);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_bindTextureJSB);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_destroy);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_getBuffer);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_getLayout);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_getSampler);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_getTexture);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_initialize);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_update);
SE_DECLARE_FUNC(js_gfx_DescriptorSet_DescriptorSet);

extern se::Object* __jsb_cc_gfx_DescriptorSetLayout_proto;
extern se::Class* __jsb_cc_gfx_DescriptorSetLayout_class;

bool js_register_cc_gfx_DescriptorSetLayout(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::DescriptorSetLayout);
SE_DECLARE_FUNC(js_gfx_DescriptorSetLayout_destroy);
SE_DECLARE_FUNC(js_gfx_DescriptorSetLayout_getBindings);
SE_DECLARE_FUNC(js_gfx_DescriptorSetLayout_getDescriptorCount);
SE_DECLARE_FUNC(js_gfx_DescriptorSetLayout_getDynamicBindings);
SE_DECLARE_FUNC(js_gfx_DescriptorSetLayout_initialize);
SE_DECLARE_FUNC(js_gfx_DescriptorSetLayout_DescriptorSetLayout);

extern se::Object* __jsb_cc_gfx_Framebuffer_proto;
extern se::Class* __jsb_cc_gfx_Framebuffer_class;

bool js_register_cc_gfx_Framebuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::Framebuffer);
SE_DECLARE_FUNC(js_gfx_Framebuffer_destroy);
SE_DECLARE_FUNC(js_gfx_Framebuffer_initialize);
SE_DECLARE_FUNC(js_gfx_Framebuffer_computeHash);
SE_DECLARE_FUNC(js_gfx_Framebuffer_Framebuffer);

extern se::Object* __jsb_cc_gfx_GlobalBarrier_proto;
extern se::Class* __jsb_cc_gfx_GlobalBarrier_class;

bool js_register_cc_gfx_GlobalBarrier(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::GlobalBarrier);
SE_DECLARE_FUNC(js_gfx_GlobalBarrier_info);
SE_DECLARE_FUNC(js_gfx_GlobalBarrier_computeHash);
SE_DECLARE_FUNC(js_gfx_GlobalBarrier_GlobalBarrier);

extern se::Object* __jsb_cc_gfx_PipelineLayout_proto;
extern se::Class* __jsb_cc_gfx_PipelineLayout_class;

bool js_register_cc_gfx_PipelineLayout(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::PipelineLayout);
SE_DECLARE_FUNC(js_gfx_PipelineLayout_destroy);
SE_DECLARE_FUNC(js_gfx_PipelineLayout_getSetLayouts);
SE_DECLARE_FUNC(js_gfx_PipelineLayout_initialize);
SE_DECLARE_FUNC(js_gfx_PipelineLayout_PipelineLayout);

extern se::Object* __jsb_cc_gfx_PipelineState_proto;
extern se::Class* __jsb_cc_gfx_PipelineState_class;

bool js_register_cc_gfx_PipelineState(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::PipelineState);
SE_DECLARE_FUNC(js_gfx_PipelineState_destroy);
SE_DECLARE_FUNC(js_gfx_PipelineState_getDynamicStates);
SE_DECLARE_FUNC(js_gfx_PipelineState_getPipelineLayout);
SE_DECLARE_FUNC(js_gfx_PipelineState_initialize);
SE_DECLARE_FUNC(js_gfx_PipelineState_PipelineState);

extern se::Object* __jsb_cc_gfx_Queue_proto;
extern se::Class* __jsb_cc_gfx_Queue_class;

bool js_register_cc_gfx_Queue(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::Queue);
SE_DECLARE_FUNC(js_gfx_Queue_destroy);
SE_DECLARE_FUNC(js_gfx_Queue_initialize);
SE_DECLARE_FUNC(js_gfx_Queue_submitForJS);
SE_DECLARE_FUNC(js_gfx_Queue_Queue);

extern se::Object* __jsb_cc_gfx_RenderPass_proto;
extern se::Class* __jsb_cc_gfx_RenderPass_class;

bool js_register_cc_gfx_RenderPass(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::RenderPass);
SE_DECLARE_FUNC(js_gfx_RenderPass_destroy);
SE_DECLARE_FUNC(js_gfx_RenderPass_getDependencies);
SE_DECLARE_FUNC(js_gfx_RenderPass_getDepthStencilAttachment);
SE_DECLARE_FUNC(js_gfx_RenderPass_getSubpasses);
SE_DECLARE_FUNC(js_gfx_RenderPass_initialize);
SE_DECLARE_FUNC(js_gfx_RenderPass_computeHash);
SE_DECLARE_FUNC(js_gfx_RenderPass_RenderPass);

extern se::Object* __jsb_cc_gfx_Sampler_proto;
extern se::Class* __jsb_cc_gfx_Sampler_class;

bool js_register_cc_gfx_Sampler(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::Sampler);
SE_DECLARE_FUNC(js_gfx_Sampler_destroy);
SE_DECLARE_FUNC(js_gfx_Sampler_initialize);
SE_DECLARE_FUNC(js_gfx_Sampler_Sampler);

extern se::Object* __jsb_cc_gfx_Shader_proto;
extern se::Class* __jsb_cc_gfx_Shader_class;

bool js_register_cc_gfx_Shader(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::Shader);
SE_DECLARE_FUNC(js_gfx_Shader_destroy);
SE_DECLARE_FUNC(js_gfx_Shader_getBuffers);
SE_DECLARE_FUNC(js_gfx_Shader_getImages);
SE_DECLARE_FUNC(js_gfx_Shader_getSamplerTextures);
SE_DECLARE_FUNC(js_gfx_Shader_getSubpassInputs);
SE_DECLARE_FUNC(js_gfx_Shader_getTextures);
SE_DECLARE_FUNC(js_gfx_Shader_initialize);
SE_DECLARE_FUNC(js_gfx_Shader_Shader);

extern se::Object* __jsb_cc_gfx_Texture_proto;
extern se::Class* __jsb_cc_gfx_Texture_class;

bool js_register_cc_gfx_Texture(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::Texture);
SE_DECLARE_FUNC(js_gfx_Texture_destroy);
SE_DECLARE_FUNC(js_gfx_Texture_isTextureView);
SE_DECLARE_FUNC(js_gfx_Texture_resize);
SE_DECLARE_FUNC(js_gfx_Texture_computeHash);
SE_DECLARE_FUNC(js_gfx_Texture_Texture);

extern se::Object* __jsb_cc_gfx_TextureBarrier_proto;
extern se::Class* __jsb_cc_gfx_TextureBarrier_class;

bool js_register_cc_gfx_TextureBarrier(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::TextureBarrier);
SE_DECLARE_FUNC(js_gfx_TextureBarrier_info);
SE_DECLARE_FUNC(js_gfx_TextureBarrier_computeHash);
SE_DECLARE_FUNC(js_gfx_TextureBarrier_TextureBarrier);

extern se::Object* __jsb_cc_gfx_Device_proto;
extern se::Class* __jsb_cc_gfx_Device_class;

bool js_register_cc_gfx_Device(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::Device);
SE_DECLARE_FUNC(js_gfx_Device_acquire);
SE_DECLARE_FUNC(js_gfx_Device_bindingMappingInfo);
SE_DECLARE_FUNC(js_gfx_Device_createCommandBuffer);
SE_DECLARE_FUNC(js_gfx_Device_createDescriptorSet);
SE_DECLARE_FUNC(js_gfx_Device_createDescriptorSetLayout);
SE_DECLARE_FUNC(js_gfx_Device_createFramebuffer);
SE_DECLARE_FUNC(js_gfx_Device_createGlobalBarrier);
SE_DECLARE_FUNC(js_gfx_Device_createInputAssembler);
SE_DECLARE_FUNC(js_gfx_Device_createPipelineLayout);
SE_DECLARE_FUNC(js_gfx_Device_createPipelineState);
SE_DECLARE_FUNC(js_gfx_Device_createQueue);
SE_DECLARE_FUNC(js_gfx_Device_createRenderPass);
SE_DECLARE_FUNC(js_gfx_Device_createSampler);
SE_DECLARE_FUNC(js_gfx_Device_createShader);
SE_DECLARE_FUNC(js_gfx_Device_destroy);
SE_DECLARE_FUNC(js_gfx_Device_devicePixelRatio);
SE_DECLARE_FUNC(js_gfx_Device_flushCommandsForJS);
SE_DECLARE_FUNC(js_gfx_Device_hasFeature);
SE_DECLARE_FUNC(js_gfx_Device_initialize);
SE_DECLARE_FUNC(js_gfx_Device_present);
SE_DECLARE_FUNC(js_gfx_Device_resize);

extern se::Object* __jsb_cc_gfx_DeviceManager_proto;
extern se::Class* __jsb_cc_gfx_DeviceManager_class;

bool js_register_cc_gfx_DeviceManager(se::Object* obj);
bool register_all_gfx(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::gfx::DeviceManager);
SE_DECLARE_FUNC(js_gfx_DeviceManager_destroy);
SE_DECLARE_FUNC(js_gfx_DeviceManager_create);
SE_DECLARE_FUNC(js_gfx_DeviceManager_addCustomEvent);

