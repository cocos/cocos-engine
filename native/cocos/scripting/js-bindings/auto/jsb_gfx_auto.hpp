#pragma once
#include "base/ccConfig.h"
#if (USE_GFX_RENDERER > 0) && (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cocos2d_GFXOffset_proto;
extern se::Class* __jsb_cocos2d_GFXOffset_class;

bool js_register_cocos2d_GFXOffset(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXRect_proto;
extern se::Class* __jsb_cocos2d_GFXRect_class;

bool js_register_cocos2d_GFXRect(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXExtent_proto;
extern se::Class* __jsb_cocos2d_GFXExtent_class;

bool js_register_cocos2d_GFXExtent(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXTextureSubres_proto;
extern se::Class* __jsb_cocos2d_GFXTextureSubres_class;

bool js_register_cocos2d_GFXTextureSubres(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXTextureCopy_proto;
extern se::Class* __jsb_cocos2d_GFXTextureCopy_class;

bool js_register_cocos2d_GFXTextureCopy(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXBufferTextureCopy_proto;
extern se::Class* __jsb_cocos2d_GFXBufferTextureCopy_class;

bool js_register_cocos2d_GFXBufferTextureCopy(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXViewport_proto;
extern se::Class* __jsb_cocos2d_GFXViewport_class;

bool js_register_cocos2d_GFXViewport(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXColor_proto;
extern se::Class* __jsb_cocos2d_GFXColor_class;

bool js_register_cocos2d_GFXColor(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXDeviceInfo_proto;
extern se::Class* __jsb_cocos2d_GFXDeviceInfo_class;

bool js_register_cocos2d_GFXDeviceInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXWindowInfo_proto;
extern se::Class* __jsb_cocos2d_GFXWindowInfo_class;

bool js_register_cocos2d_GFXWindowInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXContextInfo_proto;
extern se::Class* __jsb_cocos2d_GFXContextInfo_class;

bool js_register_cocos2d_GFXContextInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXBufferInfo_proto;
extern se::Class* __jsb_cocos2d_GFXBufferInfo_class;

bool js_register_cocos2d_GFXBufferInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXDrawInfo_proto;
extern se::Class* __jsb_cocos2d_GFXDrawInfo_class;

bool js_register_cocos2d_GFXDrawInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXIndirectBuffer_proto;
extern se::Class* __jsb_cocos2d_GFXIndirectBuffer_class;

bool js_register_cocos2d_GFXIndirectBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXTextureInfo_proto;
extern se::Class* __jsb_cocos2d_GFXTextureInfo_class;

bool js_register_cocos2d_GFXTextureInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXTextureViewInfo_proto;
extern se::Class* __jsb_cocos2d_GFXTextureViewInfo_class;

bool js_register_cocos2d_GFXTextureViewInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXSamplerInfo_proto;
extern se::Class* __jsb_cocos2d_GFXSamplerInfo_class;

bool js_register_cocos2d_GFXSamplerInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXShaderMacro_proto;
extern se::Class* __jsb_cocos2d_GFXShaderMacro_class;

bool js_register_cocos2d_GFXShaderMacro(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXUniform_proto;
extern se::Class* __jsb_cocos2d_GFXUniform_class;

bool js_register_cocos2d_GFXUniform(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXUniformBlock_proto;
extern se::Class* __jsb_cocos2d_GFXUniformBlock_class;

bool js_register_cocos2d_GFXUniformBlock(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXUniformSampler_proto;
extern se::Class* __jsb_cocos2d_GFXUniformSampler_class;

bool js_register_cocos2d_GFXUniformSampler(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXShaderStage_proto;
extern se::Class* __jsb_cocos2d_GFXShaderStage_class;

bool js_register_cocos2d_GFXShaderStage(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXShaderInfo_proto;
extern se::Class* __jsb_cocos2d_GFXShaderInfo_class;

bool js_register_cocos2d_GFXShaderInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXAttribute_proto;
extern se::Class* __jsb_cocos2d_GFXAttribute_class;

bool js_register_cocos2d_GFXAttribute(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXInputAssemblerInfo_proto;
extern se::Class* __jsb_cocos2d_GFXInputAssemblerInfo_class;

bool js_register_cocos2d_GFXInputAssemblerInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXColorAttachment_proto;
extern se::Class* __jsb_cocos2d_GFXColorAttachment_class;

bool js_register_cocos2d_GFXColorAttachment(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXDepthStencilAttachment_proto;
extern se::Class* __jsb_cocos2d_GFXDepthStencilAttachment_class;

bool js_register_cocos2d_GFXDepthStencilAttachment(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXSubPass_proto;
extern se::Class* __jsb_cocos2d_GFXSubPass_class;

bool js_register_cocos2d_GFXSubPass(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXRenderPassInfo_proto;
extern se::Class* __jsb_cocos2d_GFXRenderPassInfo_class;

bool js_register_cocos2d_GFXRenderPassInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXFramebufferInfo_proto;
extern se::Class* __jsb_cocos2d_GFXFramebufferInfo_class;

bool js_register_cocos2d_GFXFramebufferInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXBinding_proto;
extern se::Class* __jsb_cocos2d_GFXBinding_class;

bool js_register_cocos2d_GFXBinding(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXBindingLayoutInfo_proto;
extern se::Class* __jsb_cocos2d_GFXBindingLayoutInfo_class;

bool js_register_cocos2d_GFXBindingLayoutInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXBindingUnit_proto;
extern se::Class* __jsb_cocos2d_GFXBindingUnit_class;

bool js_register_cocos2d_GFXBindingUnit(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXPushConstantRange_proto;
extern se::Class* __jsb_cocos2d_GFXPushConstantRange_class;

bool js_register_cocos2d_GFXPushConstantRange(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXPipelineLayoutInfo_proto;
extern se::Class* __jsb_cocos2d_GFXPipelineLayoutInfo_class;

bool js_register_cocos2d_GFXPipelineLayoutInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXInputState_proto;
extern se::Class* __jsb_cocos2d_GFXInputState_class;

bool js_register_cocos2d_GFXInputState(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXRasterizerState_proto;
extern se::Class* __jsb_cocos2d_GFXRasterizerState_class;

bool js_register_cocos2d_GFXRasterizerState(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXDepthStencilState_proto;
extern se::Class* __jsb_cocos2d_GFXDepthStencilState_class;

bool js_register_cocos2d_GFXDepthStencilState(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXBlendTarget_proto;
extern se::Class* __jsb_cocos2d_GFXBlendTarget_class;

bool js_register_cocos2d_GFXBlendTarget(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXBlendState_proto;
extern se::Class* __jsb_cocos2d_GFXBlendState_class;

bool js_register_cocos2d_GFXBlendState(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXPipelineStateInfo_proto;
extern se::Class* __jsb_cocos2d_GFXPipelineStateInfo_class;

bool js_register_cocos2d_GFXPipelineStateInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXCommandBufferInfo_proto;
extern se::Class* __jsb_cocos2d_GFXCommandBufferInfo_class;

bool js_register_cocos2d_GFXCommandBufferInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXQueueInfo_proto;
extern se::Class* __jsb_cocos2d_GFXQueueInfo_class;

bool js_register_cocos2d_GFXQueueInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXFormatInfo_proto;
extern se::Class* __jsb_cocos2d_GFXFormatInfo_class;

bool js_register_cocos2d_GFXFormatInfo(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXMemoryStatus_proto;
extern se::Class* __jsb_cocos2d_GFXMemoryStatus_class;

bool js_register_cocos2d_GFXMemoryStatus(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GFXContext_proto;
extern se::Class* __jsb_cocos2d_GFXContext_class;

bool js_register_cocos2d_GFXContext(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXContext_sharedContext);
SE_DECLARE_FUNC(js_gfx_GFXContext_colorFormat);
SE_DECLARE_FUNC(js_gfx_GFXContext_detphStencilFormat);
SE_DECLARE_FUNC(js_gfx_GFXContext_device);
SE_DECLARE_FUNC(js_gfx_GFXContext_initialize);
SE_DECLARE_FUNC(js_gfx_GFXContext_destroy);
SE_DECLARE_FUNC(js_gfx_GFXContext_vsyncMode);
SE_DECLARE_FUNC(js_gfx_GFXContext_present);
SE_DECLARE_FUNC(js_gfx_GFXContext_GFXContext);

extern se::Object* __jsb_cocos2d_GFXWindow_proto;
extern se::Class* __jsb_cocos2d_GFXWindow_class;

bool js_register_cocos2d_GFXWindow(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXWindow_depthStencilTexView);
SE_DECLARE_FUNC(js_gfx_GFXWindow_renderPass);
SE_DECLARE_FUNC(js_gfx_GFXWindow_isOffscreen);
SE_DECLARE_FUNC(js_gfx_GFXWindow_detphStencilFormat);
SE_DECLARE_FUNC(js_gfx_GFXWindow_height);
SE_DECLARE_FUNC(js_gfx_GFXWindow_colorTexView);
SE_DECLARE_FUNC(js_gfx_GFXWindow_initialize);
SE_DECLARE_FUNC(js_gfx_GFXWindow_destroy);
SE_DECLARE_FUNC(js_gfx_GFXWindow_framebuffer);
SE_DECLARE_FUNC(js_gfx_GFXWindow_colorFormat);
SE_DECLARE_FUNC(js_gfx_GFXWindow_width);
SE_DECLARE_FUNC(js_gfx_GFXWindow_resize);
SE_DECLARE_FUNC(js_gfx_GFXWindow_GFXWindow);

extern se::Object* __jsb_cocos2d_GFXBuffer_proto;
extern se::Class* __jsb_cocos2d_GFXBuffer_class;

bool js_register_cocos2d_GFXBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_count);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_memUsage);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_usage);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_bufferView);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_update);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_flags);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_initialize);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_destroy);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_stride);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_resize);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_size);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_GFXBuffer);

extern se::Object* __jsb_cocos2d_GFXTexture_proto;
extern se::Class* __jsb_cocos2d_GFXTexture_class;

bool js_register_cocos2d_GFXTexture(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXTexture_arrayLayer);
SE_DECLARE_FUNC(js_gfx_GFXTexture_format);
SE_DECLARE_FUNC(js_gfx_GFXTexture_buffer);
SE_DECLARE_FUNC(js_gfx_GFXTexture_mipLevel);
SE_DECLARE_FUNC(js_gfx_GFXTexture_height);
SE_DECLARE_FUNC(js_gfx_GFXTexture_usage);
SE_DECLARE_FUNC(js_gfx_GFXTexture_depth);
SE_DECLARE_FUNC(js_gfx_GFXTexture_flags);
SE_DECLARE_FUNC(js_gfx_GFXTexture_samples);
SE_DECLARE_FUNC(js_gfx_GFXTexture_initialize);
SE_DECLARE_FUNC(js_gfx_GFXTexture_destroy);
SE_DECLARE_FUNC(js_gfx_GFXTexture_type);
SE_DECLARE_FUNC(js_gfx_GFXTexture_width);
SE_DECLARE_FUNC(js_gfx_GFXTexture_resize);
SE_DECLARE_FUNC(js_gfx_GFXTexture_size);
SE_DECLARE_FUNC(js_gfx_GFXTexture_GFXTexture);

extern se::Object* __jsb_cocos2d_GFXTextureView_proto;
extern se::Class* __jsb_cocos2d_GFXTextureView_class;

bool js_register_cocos2d_GFXTextureView(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_baseLevel);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_format);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_levelCount);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_texture);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_layerCount);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_initialize);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_destroy);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_baseLayer);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_type);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_GFXTextureView);

extern se::Object* __jsb_cocos2d_GFXSampler_proto;
extern se::Class* __jsb_cocos2d_GFXSampler_class;

bool js_register_cocos2d_GFXSampler(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXSampler_max_lod);
SE_DECLARE_FUNC(js_gfx_GFXSampler_initialize);
SE_DECLARE_FUNC(js_gfx_GFXSampler_destroy);
SE_DECLARE_FUNC(js_gfx_GFXSampler_mip_filter);
SE_DECLARE_FUNC(js_gfx_GFXSampler_GFXSampler);

extern se::Object* __jsb_cocos2d_GFXShader_proto;
extern se::Class* __jsb_cocos2d_GFXShader_class;

bool js_register_cocos2d_GFXShader(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXShader_name);
SE_DECLARE_FUNC(js_gfx_GFXShader_initialize);
SE_DECLARE_FUNC(js_gfx_GFXShader_destroy);
SE_DECLARE_FUNC(js_gfx_GFXShader_hash);
SE_DECLARE_FUNC(js_gfx_GFXShader_GFXShader);

extern se::Object* __jsb_cocos2d_GFXInputAssembler_proto;
extern se::Class* __jsb_cocos2d_GFXInputAssembler_class;

bool js_register_cocos2d_GFXInputAssembler(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_vertexBuffers);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_firstInstance);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_initialize);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_setIndexCount);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_vertexOffset);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_setFirstInstance);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_destroy);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_setVertexOffset);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_firstVertex);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_instanceCount);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_vertexCount);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_attributes);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_setFirstVertex);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_firstIndex);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_indirectBuffer);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_indexCount);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_setVertexCount);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_indexBuffer);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_setFirstIndex);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_setInstanceCount);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_GFXInputAssembler);

extern se::Object* __jsb_cocos2d_GFXRenderPass_proto;
extern se::Class* __jsb_cocos2d_GFXRenderPass_class;

bool js_register_cocos2d_GFXRenderPass(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_initialize);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_destroy);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_GFXRenderPass);

extern se::Object* __jsb_cocos2d_GFXFramebuffer_proto;
extern se::Class* __jsb_cocos2d_GFXFramebuffer_class;

bool js_register_cocos2d_GFXFramebuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_depthStencilView);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_isOffscreen);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_renderPass);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_initialize);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_destroy);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_colorViews);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_GFXFramebuffer);

extern se::Object* __jsb_cocos2d_GFXBindingLayout_proto;
extern se::Class* __jsb_cocos2d_GFXBindingLayout_class;

bool js_register_cocos2d_GFXBindingLayout(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_bindTextureView);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_bindBuffer);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_bindSampler);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_update);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_initialize);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_destroy);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_GFXBindingLayout);

extern se::Object* __jsb_cocos2d_GFXPipelineLayout_proto;
extern se::Class* __jsb_cocos2d_GFXPipelineLayout_class;

bool js_register_cocos2d_GFXPipelineLayout(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_layouts);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_initialize);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_destroy);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_GFXPipelineLayout);

extern se::Object* __jsb_cocos2d_GFXPipelineState_proto;
extern se::Class* __jsb_cocos2d_GFXPipelineState_class;

bool js_register_cocos2d_GFXPipelineState(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_primitive);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_renderPass);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_rasterizerState);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_dynamicStates);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_shader);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_inputState);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_blendState);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_pipelineLayout);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_initialize);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_destroy);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_depthStencilState);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_GFXPipelineState);

extern se::Object* __jsb_cocos2d_GFXCommandBuffer_proto;
extern se::Class* __jsb_cocos2d_GFXCommandBuffer_class;

bool js_register_cocos2d_GFXCommandBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_draw);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_setBlendConstants);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_setDepthBound);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_copyBufferToTexture);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_setLineWidth);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_updateBuffer);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_end);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_setStencilWriteMask);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_setStencilCompareMask);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_bindInputAssembler);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_allocator);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_bindPipelineState);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_destroy);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_type);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_setViewport);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_setDepthBias);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_begin);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_numDrawCalls);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_bindBindingLayout);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_endRenderPass);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_initialize);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_setScissor);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_execute);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_numTris);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_beginRenderPass);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_GFXCommandBuffer);

extern se::Object* __jsb_cocos2d_GFXQueue_proto;
extern se::Class* __jsb_cocos2d_GFXQueue_class;

bool js_register_cocos2d_GFXQueue(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXQueue_submit);
SE_DECLARE_FUNC(js_gfx_GFXQueue_initialize);
SE_DECLARE_FUNC(js_gfx_GFXQueue_destroy);
SE_DECLARE_FUNC(js_gfx_GFXQueue_type);
SE_DECLARE_FUNC(js_gfx_GFXQueue_GFXQueue);

extern se::Object* __jsb_cocos2d_GLES2Device_proto;
extern se::Class* __jsb_cocos2d_GLES2Device_class;

bool js_register_cocos2d_GLES2Device(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2Device_use_discard_framebuffer);
SE_DECLARE_FUNC(js_gfx_GLES2Device_use_instanced_arrays);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createCommandAllocator);
SE_DECLARE_FUNC(js_gfx_GLES2Device_use_vao);
SE_DECLARE_FUNC(js_gfx_GLES2Device_use_draw_instanced);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createCommandBuffer);
SE_DECLARE_FUNC(js_gfx_GLES2Device_present);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createTexture);
SE_DECLARE_FUNC(js_gfx_GLES2Device_destroy);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createFramebuffer);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createRenderPass);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createWindow);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createShader);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createInputAssembler);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createSampler);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createBuffer);
SE_DECLARE_FUNC(js_gfx_GLES2Device_initialize);
SE_DECLARE_FUNC(js_gfx_GLES2Device_resize);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createQueue);
SE_DECLARE_FUNC(js_gfx_GLES2Device_checkExtension);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createBindingLayout);
SE_DECLARE_FUNC(js_gfx_GLES2Device_createTextureView);
SE_DECLARE_FUNC(js_gfx_GLES2Device_GLES2Device);

#endif //#if (USE_GFX_RENDERER > 0) && (CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX || CC_PLATFORM == CC_PLATFORM_WINDOWS)
