#pragma once
#include "base/ccConfig.h"
#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cc_GFXDevice_proto;
extern se::Class* __jsb_cc_GFXDevice_class;

bool js_register_cc_GFXDevice(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXDevice_height);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXTextureView);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXCommandAllocator);
SE_DECLARE_FUNC(js_gfx_GFXDevice_api);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXBuffer);
SE_DECLARE_FUNC(js_gfx_GFXDevice_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXWindow);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXShader);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXTexture);
SE_DECLARE_FUNC(js_gfx_GFXDevice_width);
SE_DECLARE_FUNC(js_gfx_GFXDevice_window);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXCommandBuffer);
SE_DECLARE_FUNC(js_gfx_GFXDevice_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXDevice_Resize);
SE_DECLARE_FUNC(js_gfx_GFXDevice_cmd_allocator);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXSampler);
SE_DECLARE_FUNC(js_gfx_GFXDevice_mem_status);
SE_DECLARE_FUNC(js_gfx_GFXDevice_HasFeature);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXQueue);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXRenderPass);
SE_DECLARE_FUNC(js_gfx_GFXDevice_queue);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXBindingLayout);
SE_DECLARE_FUNC(js_gfx_GFXDevice_Present);
SE_DECLARE_FUNC(js_gfx_GFXDevice_context);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXInputAssembler);
SE_DECLARE_FUNC(js_gfx_GFXDevice_CreateGFXFramebuffer);
SE_DECLARE_FUNC(js_gfx_GFXDevice_GFXDevice);

extern se::Object* __jsb_cc_GFXContext_proto;
extern se::Class* __jsb_cc_GFXContext_class;

bool js_register_cc_GFXContext(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXContext_shared_ctx);
SE_DECLARE_FUNC(js_gfx_GFXContext_color_fmt);
SE_DECLARE_FUNC(js_gfx_GFXContext_vsync_mode);
SE_DECLARE_FUNC(js_gfx_GFXContext_device);
SE_DECLARE_FUNC(js_gfx_GFXContext_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXContext_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXContext_Present);
SE_DECLARE_FUNC(js_gfx_GFXContext_depth_stencil_fmt);
SE_DECLARE_FUNC(js_gfx_GFXContext_GFXContext);

extern se::Object* __jsb_cc_GFXWindow_proto;
extern se::Class* __jsb_cc_GFXWindow_class;

bool js_register_cc_GFXWindow(se::Object* obj);
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

extern se::Object* __jsb_cc_GFXBuffer_proto;
extern se::Class* __jsb_cc_GFXBuffer_class;

bool js_register_cc_GFXBuffer(se::Object* obj);
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

extern se::Object* __jsb_cc_GFXTexture_proto;
extern se::Class* __jsb_cc_GFXTexture_class;

bool js_register_cc_GFXTexture(se::Object* obj);
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

extern se::Object* __jsb_cc_GFXTextureView_proto;
extern se::Class* __jsb_cc_GFXTextureView_class;

bool js_register_cc_GFXTextureView(se::Object* obj);
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

extern se::Object* __jsb_cc_GFXSampler_proto;
extern se::Class* __jsb_cc_GFXSampler_class;

bool js_register_cc_GFXSampler(se::Object* obj);
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

extern se::Object* __jsb_cc_GFXShader_proto;
extern se::Class* __jsb_cc_GFXShader_class;

bool js_register_cc_GFXShader(se::Object* obj);
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

extern se::Object* __jsb_cc_GFXInputAssembler_proto;
extern se::Class* __jsb_cc_GFXInputAssembler_class;

bool js_register_cc_GFXInputAssembler(se::Object* obj);
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

extern se::Object* __jsb_cc_GFXRenderPass_proto;
extern se::Class* __jsb_cc_GFXRenderPass_class;

bool js_register_cc_GFXRenderPass(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_depth_stencil_attachment);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_device);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_sub_passes);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_color_attachments);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXRenderPass_GFXRenderPass);

extern se::Object* __jsb_cc_GFXFramebuffer_proto;
extern se::Class* __jsb_cc_GFXFramebuffer_class;

bool js_register_cc_GFXFramebuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_color_views);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_is_offscreen);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_device);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_depth_stencil_view);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_render_pass);
SE_DECLARE_FUNC(js_gfx_GFXFramebuffer_GFXFramebuffer);

extern se::Object* __jsb_cc_GFXBindingLayout_proto;
extern se::Class* __jsb_cc_GFXBindingLayout_class;

bool js_register_cc_GFXBindingLayout(se::Object* obj);
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

extern se::Object* __jsb_cc_GFXPipelineLayout_proto;
extern se::Class* __jsb_cc_GFXPipelineLayout_class;

bool js_register_cc_GFXPipelineLayout(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_push_constant_ranges);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_device);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_layouts);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXPipelineLayout_GFXPipelineLayout);

extern se::Object* __jsb_cc_GFXPipelineState_proto;
extern se::Class* __jsb_cc_GFXPipelineState_class;

bool js_register_cc_GFXPipelineState(se::Object* obj);
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

extern se::Object* __jsb_cc_GFXCommandAllocator_proto;
extern se::Class* __jsb_cc_GFXCommandAllocator_class;

bool js_register_cc_GFXCommandAllocator(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXCommandAllocator_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXCommandAllocator_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXCommandAllocator_device);
SE_DECLARE_FUNC(js_gfx_GFXCommandAllocator_GFXCommandAllocator);

extern se::Object* __jsb_cc_GFXCommandBuffer_proto;
extern se::Class* __jsb_cc_GFXCommandBuffer_class;

bool js_register_cc_GFXCommandBuffer(se::Object* obj);
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

extern se::Object* __jsb_cc_GFXQueue_proto;
extern se::Class* __jsb_cc_GFXQueue_class;

bool js_register_cc_GFXQueue(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GFXQueue_submit);
SE_DECLARE_FUNC(js_gfx_GFXQueue_device);
SE_DECLARE_FUNC(js_gfx_GFXQueue_Initialize);
SE_DECLARE_FUNC(js_gfx_GFXQueue_Destroy);
SE_DECLARE_FUNC(js_gfx_GFXQueue_type);
SE_DECLARE_FUNC(js_gfx_GFXQueue_GFXQueue);

#endif //#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
