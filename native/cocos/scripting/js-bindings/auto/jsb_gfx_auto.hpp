#pragma once
#include "base/ccConfig.h"
#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

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

extern se::Object* __jsb_cocos2d_GLES2Context_proto;
extern se::Class* __jsb_cocos2d_GLES2Context_class;

bool js_register_cocos2d_GLES2Context(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2Context_egl_config);
SE_DECLARE_FUNC(js_gfx_GLES2Context_minor_ver);
SE_DECLARE_FUNC(js_gfx_GLES2Context_CheckExtension);
SE_DECLARE_FUNC(js_gfx_GLES2Context_egl_context);
SE_DECLARE_FUNC(js_gfx_GLES2Context_major_ver);
SE_DECLARE_FUNC(js_gfx_GLES2Context_egl_display);
SE_DECLARE_FUNC(js_gfx_GLES2Context_native_display);
SE_DECLARE_FUNC(js_gfx_GLES2Context_MakeCurrent);
SE_DECLARE_FUNC(js_gfx_GLES2Context_egl_shared_ctx);
SE_DECLARE_FUNC(js_gfx_GLES2Context_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2Context_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2Context_egl_surface);
SE_DECLARE_FUNC(js_gfx_GLES2Context_Present);
SE_DECLARE_FUNC(js_gfx_GLES2Context_GLES2Context);

extern se::Object* __jsb_cocos2d_GLES2Window_proto;
extern se::Class* __jsb_cocos2d_GLES2Window_class;

bool js_register_cocos2d_GLES2Window(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2Window_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2Window_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2Window_Resize);
SE_DECLARE_FUNC(js_gfx_GLES2Window_GLES2Window);

extern se::Object* __jsb_cocos2d_GLES2Buffer_proto;
extern se::Class* __jsb_cocos2d_GLES2Buffer_class;

bool js_register_cocos2d_GLES2Buffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2Buffer_Update);
SE_DECLARE_FUNC(js_gfx_GLES2Buffer_gpu_buffer);
SE_DECLARE_FUNC(js_gfx_GLES2Buffer_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2Buffer_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2Buffer_Resize);
SE_DECLARE_FUNC(js_gfx_GLES2Buffer_GLES2Buffer);

extern se::Object* __jsb_cocos2d_GLES2Texture_proto;
extern se::Class* __jsb_cocos2d_GLES2Texture_class;

bool js_register_cocos2d_GLES2Texture(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2Texture_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2Texture_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2Texture_gpu_texture);
SE_DECLARE_FUNC(js_gfx_GLES2Texture_Resize);
SE_DECLARE_FUNC(js_gfx_GLES2Texture_GLES2Texture);

extern se::Object* __jsb_cocos2d_GLES2TextureView_proto;
extern se::Class* __jsb_cocos2d_GLES2TextureView_class;

bool js_register_cocos2d_GLES2TextureView(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2TextureView_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2TextureView_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2TextureView_gpu_tex_view);
SE_DECLARE_FUNC(js_gfx_GLES2TextureView_GLES2TextureView);

extern se::Object* __jsb_cocos2d_GLES2Sampler_proto;
extern se::Class* __jsb_cocos2d_GLES2Sampler_class;

bool js_register_cocos2d_GLES2Sampler(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2Sampler_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2Sampler_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2Sampler_gpu_sampler);
SE_DECLARE_FUNC(js_gfx_GLES2Sampler_GLES2Sampler);

extern se::Object* __jsb_cocos2d_GLES2Shader_proto;
extern se::Class* __jsb_cocos2d_GLES2Shader_class;

bool js_register_cocos2d_GLES2Shader(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2Shader_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2Shader_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2Shader_gpu_shader);
SE_DECLARE_FUNC(js_gfx_GLES2Shader_GLES2Shader);

extern se::Object* __jsb_cocos2d_GLES2InputAssembler_proto;
extern se::Class* __jsb_cocos2d_GLES2InputAssembler_class;

bool js_register_cocos2d_GLES2InputAssembler(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2InputAssembler_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2InputAssembler_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2InputAssembler_gpu_input_assembler);
SE_DECLARE_FUNC(js_gfx_GLES2InputAssembler_ExtractCmdDraw);
SE_DECLARE_FUNC(js_gfx_GLES2InputAssembler_GLES2InputAssembler);

extern se::Object* __jsb_cocos2d_GLES2RenderPass_proto;
extern se::Class* __jsb_cocos2d_GLES2RenderPass_class;

bool js_register_cocos2d_GLES2RenderPass(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2RenderPass_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2RenderPass_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2RenderPass_gpu_render_pass);
SE_DECLARE_FUNC(js_gfx_GLES2RenderPass_GLES2RenderPass);

extern se::Object* __jsb_cocos2d_GLES2Framebuffer_proto;
extern se::Class* __jsb_cocos2d_GLES2Framebuffer_class;

bool js_register_cocos2d_GLES2Framebuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2Framebuffer_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2Framebuffer_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2Framebuffer_gpu_fbo);
SE_DECLARE_FUNC(js_gfx_GLES2Framebuffer_GLES2Framebuffer);

extern se::Object* __jsb_cocos2d_GLES2BindingLayout_proto;
extern se::Class* __jsb_cocos2d_GLES2BindingLayout_class;

bool js_register_cocos2d_GLES2BindingLayout(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2BindingLayout_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2BindingLayout_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2BindingLayout_gpu_binding_layout);
SE_DECLARE_FUNC(js_gfx_GLES2BindingLayout_Update);
SE_DECLARE_FUNC(js_gfx_GLES2BindingLayout_GLES2BindingLayout);

extern se::Object* __jsb_cocos2d_GLES2PipelineLayout_proto;
extern se::Class* __jsb_cocos2d_GLES2PipelineLayout_class;

bool js_register_cocos2d_GLES2PipelineLayout(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2PipelineLayout_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2PipelineLayout_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2PipelineLayout_gpu_pipeline_layout);
SE_DECLARE_FUNC(js_gfx_GLES2PipelineLayout_GLES2PipelineLayout);

extern se::Object* __jsb_cocos2d_GLES2PipelineState_proto;
extern se::Class* __jsb_cocos2d_GLES2PipelineState_class;

bool js_register_cocos2d_GLES2PipelineState(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2PipelineState_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2PipelineState_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2PipelineState_gpu_pso);
SE_DECLARE_FUNC(js_gfx_GLES2PipelineState_GLES2PipelineState);

extern se::Object* __jsb_cocos2d_GLES2GPUBuffer_proto;
extern se::Class* __jsb_cocos2d_GLES2GPUBuffer_class;

bool js_register_cocos2d_GLES2GPUBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GLES2GPUTexture_proto;
extern se::Class* __jsb_cocos2d_GLES2GPUTexture_class;

bool js_register_cocos2d_GLES2GPUTexture(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GLES2GPUTextureView_proto;
extern se::Class* __jsb_cocos2d_GLES2GPUTextureView_class;

bool js_register_cocos2d_GLES2GPUTextureView(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GLES2GPUSampler_proto;
extern se::Class* __jsb_cocos2d_GLES2GPUSampler_class;

bool js_register_cocos2d_GLES2GPUSampler(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GLES2GPUShader_proto;
extern se::Class* __jsb_cocos2d_GLES2GPUShader_class;

bool js_register_cocos2d_GLES2GPUShader(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GLES2GPUInputAssembler_proto;
extern se::Class* __jsb_cocos2d_GLES2GPUInputAssembler_class;

bool js_register_cocos2d_GLES2GPUInputAssembler(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GLES2GPURenderPass_proto;
extern se::Class* __jsb_cocos2d_GLES2GPURenderPass_class;

bool js_register_cocos2d_GLES2GPURenderPass(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GLES2GPUFramebuffer_proto;
extern se::Class* __jsb_cocos2d_GLES2GPUFramebuffer_class;

bool js_register_cocos2d_GLES2GPUFramebuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GLES2GPUPipelineLayout_proto;
extern se::Class* __jsb_cocos2d_GLES2GPUPipelineLayout_class;

bool js_register_cocos2d_GLES2GPUPipelineLayout(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GLES2GPUPipelineState_proto;
extern se::Class* __jsb_cocos2d_GLES2GPUPipelineState_class;

bool js_register_cocos2d_GLES2GPUPipelineState(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GLES2GPUBindingLayout_proto;
extern se::Class* __jsb_cocos2d_GLES2GPUBindingLayout_class;

bool js_register_cocos2d_GLES2GPUBindingLayout(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GLES2CmdBeginRenderPass_proto;
extern se::Class* __jsb_cocos2d_GLES2CmdBeginRenderPass_class;

bool js_register_cocos2d_GLES2CmdBeginRenderPass(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2CmdBeginRenderPass_Clear);
SE_DECLARE_FUNC(js_gfx_GLES2CmdBeginRenderPass_GLES2CmdBeginRenderPass);

extern se::Object* __jsb_cocos2d_GLES2CmdBindStates_proto;
extern se::Class* __jsb_cocos2d_GLES2CmdBindStates_class;

bool js_register_cocos2d_GLES2CmdBindStates(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2CmdBindStates_Clear);
SE_DECLARE_FUNC(js_gfx_GLES2CmdBindStates_GLES2CmdBindStates);

extern se::Object* __jsb_cocos2d_GLES2CmdDraw_proto;
extern se::Class* __jsb_cocos2d_GLES2CmdDraw_class;

bool js_register_cocos2d_GLES2CmdDraw(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2CmdDraw_Clear);
SE_DECLARE_FUNC(js_gfx_GLES2CmdDraw_GLES2CmdDraw);

extern se::Object* __jsb_cocos2d_GLES2CmdUpdateBuffer_proto;
extern se::Class* __jsb_cocos2d_GLES2CmdUpdateBuffer_class;

bool js_register_cocos2d_GLES2CmdUpdateBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2CmdUpdateBuffer_Clear);
SE_DECLARE_FUNC(js_gfx_GLES2CmdUpdateBuffer_GLES2CmdUpdateBuffer);

extern se::Object* __jsb_cocos2d_GLES2CmdCopyBufferToTexture_proto;
extern se::Class* __jsb_cocos2d_GLES2CmdCopyBufferToTexture_class;

bool js_register_cocos2d_GLES2CmdCopyBufferToTexture(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2CmdCopyBufferToTexture_Clear);
SE_DECLARE_FUNC(js_gfx_GLES2CmdCopyBufferToTexture_GLES2CmdCopyBufferToTexture);

extern se::Object* __jsb_cocos2d_GLES2CmdPackage_proto;
extern se::Class* __jsb_cocos2d_GLES2CmdPackage_class;

bool js_register_cocos2d_GLES2CmdPackage(se::Object* obj);
bool register_all_gfx(se::Object* obj);

extern se::Object* __jsb_cocos2d_GLES2CommandAllocator_proto;
extern se::Class* __jsb_cocos2d_GLES2CommandAllocator_class;

bool js_register_cocos2d_GLES2CommandAllocator(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2CommandAllocator_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2CommandAllocator_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2CommandAllocator_ClearCmds);
SE_DECLARE_FUNC(js_gfx_GLES2CommandAllocator_ReleaseCmds);
SE_DECLARE_FUNC(js_gfx_GLES2CommandAllocator_GLES2CommandAllocator);

extern se::Object* __jsb_cocos2d_GLES2CommandBuffer_proto;
extern se::Class* __jsb_cocos2d_GLES2CommandBuffer_class;

bool js_register_cocos2d_GLES2CommandBuffer(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_End);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_BindInputAssembler);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_BindPipelineState);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_SetDepthBias);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_Begin);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_BindBindingLayout);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_EndRenderPass);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_CopyBufferToTexture);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_UpdateBuffer);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_Execute);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_SetStencilWriteMask);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_Draw);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_BeginRenderPass);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_SetStencilCompareMask);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_SetDepthBounds);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_SetViewport);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_SetBlendConstants);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_SetScissor);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_SetLineWidth);
SE_DECLARE_FUNC(js_gfx_GLES2CommandBuffer_GLES2CommandBuffer);

extern se::Object* __jsb_cocos2d_GLES2Queue_proto;
extern se::Class* __jsb_cocos2d_GLES2Queue_class;

bool js_register_cocos2d_GLES2Queue(se::Object* obj);
bool register_all_gfx(se::Object* obj);
SE_DECLARE_FUNC(js_gfx_GLES2Queue_Initialize);
SE_DECLARE_FUNC(js_gfx_GLES2Queue_Destroy);
SE_DECLARE_FUNC(js_gfx_GLES2Queue_is_async);
SE_DECLARE_FUNC(js_gfx_GLES2Queue_submit);
SE_DECLARE_FUNC(js_gfx_GLES2Queue_GLES2Queue);

#endif //#if (USE_GFX_RENDERER > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
