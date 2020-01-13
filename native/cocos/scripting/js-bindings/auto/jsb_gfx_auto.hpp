#pragma once
#include "base/ccConfig.h"
#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cocos2d_GFXWindow_proto;
extern se::Class* __jsb_cocos2d_GFXWindow_class;

bool js_register_cocos2d_GFXWindow(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXWindow_depth_stencil_tex_view);
SE_DECLARE_FUNC(js_gfx_GFXWindow_render_pass);
SE_DECLARE_FUNC(js_gfx_GFXWindow_native_width);
SE_DECLARE_FUNC(js_gfx_GFXWindow_native_height);
SE_DECLARE_FUNC(js_gfx_GFXWindow_title);
SE_DECLARE_FUNC(js_gfx_GFXWindow_color_fmt);
SE_DECLARE_FUNC(js_gfx_GFXWindow_top);
SE_DECLARE_FUNC(js_gfx_GFXWindow_depth_stencil_texture);
SE_DECLARE_FUNC(js_gfx_GFXWindow_color_texture);
SE_DECLARE_FUNC(js_gfx_GFXWindow_is_offscreen);
SE_DECLARE_FUNC(js_gfx_GFXWindow_height);
SE_DECLARE_FUNC(js_gfx_GFXWindow_device);
SE_DECLARE_FUNC(js_gfx_GFXWindow_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXWindow_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXWindow_framebuffer);
SE_DECLARE_FUNC(js_gfx_GFXWindow_depth_stencil_fmt);
SE_DECLARE_FUNC(js_gfx_GFXWindow_color_tex_view);
SE_DECLARE_FUNC(js_gfx_GFXWindow_width);
SE_DECLARE_FUNC(js_gfx_GFXWindow_Resize);
SE_DECLARE_FUNC(js_gfx_GFXWindow_left);
SE_DECLARE_FUNC(js_gfx_GFXWindow_GFXWindow);

extern se::Object* __jsb_cocos2d_GFXBuffer_proto;
extern se::Class* __jsb_cocos2d_GFXBuffer_class;

bool js_register_cocos2d_GFXBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_count);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_memUsage);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_usage);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_buffer);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_Update);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_device);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_flags);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_stride);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_Resize);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_size);
SE_DECLARE_FUNC(js_gfx_GFXBuffer_GFXBuffer);

extern se::Object* __jsb_cocos2d_GFXTexture_proto;
extern se::Class* __jsb_cocos2d_GFXTexture_class;

bool js_register_cocos2d_GFXTexture(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXTexture_array_layer);
SE_DECLARE_FUNC(js_gfx_GFXTexture_format);
SE_DECLARE_FUNC(js_gfx_GFXTexture_buffer);
SE_DECLARE_FUNC(js_gfx_GFXTexture_height);
SE_DECLARE_FUNC(js_gfx_GFXTexture_usage);
SE_DECLARE_FUNC(js_gfx_GFXTexture_depth);
SE_DECLARE_FUNC(js_gfx_GFXTexture_flags);
SE_DECLARE_FUNC(js_gfx_GFXTexture_mip_level);
SE_DECLARE_FUNC(js_gfx_GFXTexture_samples);
SE_DECLARE_FUNC(js_gfx_GFXTexture_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXTexture_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXTexture_type);
SE_DECLARE_FUNC(js_gfx_GFXTexture_width);
SE_DECLARE_FUNC(js_gfx_GFXTexture_Resize);
SE_DECLARE_FUNC(js_gfx_GFXTexture_size);
SE_DECLARE_FUNC(js_gfx_GFXTexture_GFXTexture);

extern se::Object* __jsb_cocos2d_GFXTextureView_proto;
extern se::Class* __jsb_cocos2d_GFXTextureView_class;

bool js_register_cocos2d_GFXTextureView(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_level_count);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_format);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_texture);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_device);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_layer_count);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_base_level);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_base_layer);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_type);
SE_DECLARE_FUNC(js_gfx_GFXTextureView_GFXTextureView);

extern se::Object* __jsb_cocos2d_GFXSampler_proto;
extern se::Class* __jsb_cocos2d_GFXSampler_class;

bool js_register_cocos2d_GFXSampler(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXSampler_cmp_func);
SE_DECLARE_FUNC(js_gfx_GFXSampler_min_filter);
SE_DECLARE_FUNC(js_gfx_GFXSampler_name);
SE_DECLARE_FUNC(js_gfx_GFXSampler_address_u);
SE_DECLARE_FUNC(js_gfx_GFXSampler_border_color);
SE_DECLARE_FUNC(js_gfx_GFXSampler_max_anisotropy);
SE_DECLARE_FUNC(js_gfx_GFXSampler_device);
SE_DECLARE_FUNC(js_gfx_GFXSampler_address_v);
SE_DECLARE_FUNC(js_gfx_GFXSampler_address_w);
SE_DECLARE_FUNC(js_gfx_GFXSampler_min_lod);
SE_DECLARE_FUNC(js_gfx_GFXSampler_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXSampler_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXSampler_mag_filter);
SE_DECLARE_FUNC(js_gfx_GFXSampler_mip_lod_bias);
SE_DECLARE_FUNC(js_gfx_GFXSampler_max_lod);
SE_DECLARE_FUNC(js_gfx_GFXSampler_mip_filter);
SE_DECLARE_FUNC(js_gfx_GFXSampler_GFXSampler);

extern se::Object* __jsb_cocos2d_GFXShader_proto;
extern se::Class* __jsb_cocos2d_GFXShader_class;

bool js_register_cocos2d_GFXShader(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXShader_hash);
SE_DECLARE_FUNC(js_gfx_GFXShader_name);
SE_DECLARE_FUNC(js_gfx_GFXShader_samplers);
SE_DECLARE_FUNC(js_gfx_GFXShader_blocks);
SE_DECLARE_FUNC(js_gfx_GFXShader_device);
SE_DECLARE_FUNC(js_gfx_GFXShader_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXShader_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXShader_stages);
SE_DECLARE_FUNC(js_gfx_GFXShader_GFXShader);

extern se::Object* __jsb_cocos2d_GFXInputAssembler_proto;
extern se::Class* __jsb_cocos2d_GFXInputAssembler_class;

bool js_register_cocos2d_GFXInputAssembler(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_set_first_vertex);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_set_vertex_offset);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_vertex_count);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_first_instance);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_set_index_count);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_first_index);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_first_vertex);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_vertex_buffers);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_set_vertex_count);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_set_first_instance);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_set_instance_count);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_vertex_offset);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_instance_count);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_attributes);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_device);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_set_first_index);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_index_count);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_indirect_buffer);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_index_buffer);
SE_DECLARE_FUNC(js_gfx_GFXInputAssembler_GFXInputAssembler);

extern se::Object* __jsb_cocos2d_GFXRenderPass_proto;
extern se::Class* __jsb_cocos2d_GFXRenderPass_class;

bool js_register_cocos2d_GFXRenderPass(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_depth_stencil_attachment);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_device);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_sub_passes);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_color_attachments);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_GFXRenderPass);

extern se::Object* __jsb_cocos2d_GFXFramebuffer_proto;
extern se::Class* __jsb_cocos2d_GFXFramebuffer_class;

bool js_register_cocos2d_GFXFramebuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_color_views);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_is_offscreen);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_device);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_depth_stencil_view);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_render_pass);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_GFXFramebuffer);

extern se::Object* __jsb_cocos2d_GFXBindingLayout_proto;
extern se::Class* __jsb_cocos2d_GFXBindingLayout_class;

bool js_register_cocos2d_GFXBindingLayout(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_BindTextureView);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_BindBuffer);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_BindSampler);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_Update);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_device);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_binding_units);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXBindingLayout_GFXBindingLayout);

extern se::Object* __jsb_cocos2d_GFXPipelineLayout_proto;
extern se::Class* __jsb_cocos2d_GFXPipelineLayout_class;

bool js_register_cocos2d_GFXPipelineLayout(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_push_constant_ranges);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_device);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_layouts);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_GFXPipelineLayout);

extern se::Object* __jsb_cocos2d_GFXPipelineState_proto;
extern se::Class* __jsb_cocos2d_GFXPipelineState_class;

bool js_register_cocos2d_GFXPipelineState(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_primitive);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_layout);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_rs);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_dynamic_states);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_is);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_bs);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_shader);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_dss);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_device);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_render_pass);
SE_DECLARE_FUNC(js_gfx_GFXPipelineState_GFXPipelineState);

extern se::Object* __jsb_cocos2d_GFXCommandBuffer_proto;
extern se::Class* __jsb_cocos2d_GFXCommandBuffer_class;

bool js_register_cocos2d_GFXCommandBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_End);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_BindInputAssembler);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_BindPipelineState);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_num_tris);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_allocator);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_SetDepthBias);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_Begin);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_BindBindingLayout);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_EndRenderPass);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_CopyBufferToTexture);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_type);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_UpdateBuffer);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_Execute);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_SetStencilWriteMask);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_Draw);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_BeginRenderPass);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_SetStencilCompareMask);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_SetDepthBounds);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_device);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_SetViewport);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_num_draw_calls);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_SetBlendConstants);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_SetScissor);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_SetLineWidth);
SE_DECLARE_FUNC(js_gfx_GFXCommandBuffer_GFXCommandBuffer);

extern se::Object* __jsb_cocos2d_GFXQueue_proto;
extern se::Class* __jsb_cocos2d_GFXQueue_class;

bool js_register_cocos2d_GFXQueue(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXQueue_submit);
SE_DECLARE_FUNC(js_gfx_GFXQueue_device);
SE_DECLARE_FUNC(js_gfx_GFXQueue_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXQueue_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXQueue_type);
SE_DECLARE_FUNC(js_gfx_GFXQueue_GFXQueue);

extern se::Object* __jsb_cocos2d_GLES2Device_proto;
extern se::Class* __jsb_cocos2d_GLES2Device_class;

bool js_register_cocos2d_GLES2Device(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2Device_use_discard_framebuffer);
SE_DECLARE_FUNC(js_gfx_GLES2Device_use_instanced_arrays);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXTextureView);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXCommandAllocator);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXBuffer);
SE_DECLARE_FUNC(js_gfx_GLES2Device_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXWindow);
SE_DECLARE_FUNC(js_gfx_GLES2Device_use_vao);
SE_DECLARE_FUNC(js_gfx_GLES2Device_use_draw_instanced);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXTexture);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXShader);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXCommandBuffer);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CheckExtension);
SE_DECLARE_FUNC(js_gfx_GLES2Device_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2Device_Resize);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXSampler);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXQueue);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXRenderPass);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXBindingLayout);
SE_DECLARE_FUNC(js_gfx_GLES2Device_Present);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXInputAssembler);
SE_DECLARE_FUNC(js_gfx_GLES2Device_CreateGFXFramebuffer);
SE_DECLARE_FUNC(js_gfx_GLES2Device_GLES2Device);

#endif //#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
