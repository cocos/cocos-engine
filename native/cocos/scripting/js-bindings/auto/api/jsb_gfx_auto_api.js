/**
 * @module gfx
 */
var gfx = gfx || {};

/**
 * @class GLES2Device
 */
gfx.GLES2Device = {

/**
 * @method use_discard_framebuffer
 * @return {bool}
 */
use_discard_framebuffer : function (
)
{
    return false;
},

/**
 * @method use_instanced_arrays
 * @return {bool}
 */
use_instanced_arrays : function (
)
{
    return false;
},

/**
 * @method CreateGFXTextureView
 * @param {cc.GFXTextureViewInfo} arg0
 * @return {cc.GFXTextureView}
 */
CreateGFXTextureView : function (
gfxtextureviewinfo 
)
{
    return cc.GFXTextureView;
},

/**
 * @method CreateGFXCommandAllocator
 * @param {cc.GFXCommandAllocatorInfo} arg0
 * @return {cc.GFXCommandAllocator}
 */
CreateGFXCommandAllocator : function (
gfxcommandallocatorinfo 
)
{
    return cc.GFXCommandAllocator;
},

/**
 * @method CreateGFXBuffer
 * @param {cc.GFXBufferInfo} arg0
 * @return {cc.GFXBuffer}
 */
CreateGFXBuffer : function (
gfxbufferinfo 
)
{
    return cc.GFXBuffer;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method CreateGFXWindow
 * @param {cc.GFXWindowInfo} arg0
 * @return {cc.GFXWindow}
 */
CreateGFXWindow : function (
gfxwindowinfo 
)
{
    return cc.GFXWindow;
},

/**
 * @method use_vao
 * @return {bool}
 */
use_vao : function (
)
{
    return false;
},

/**
 * @method use_draw_instanced
 * @return {bool}
 */
use_draw_instanced : function (
)
{
    return false;
},

/**
 * @method CreateGFXTexture
 * @param {cc.GFXTextureInfo} arg0
 * @return {cc.GFXTexture}
 */
CreateGFXTexture : function (
gfxtextureinfo 
)
{
    return cc.GFXTexture;
},

/**
 * @method CreateGFXShader
 * @param {cc.GFXShaderInfo} arg0
 * @return {cc.GFXShader}
 */
CreateGFXShader : function (
gfxshaderinfo 
)
{
    return cc.GFXShader;
},

/**
 * @method CreateGFXCommandBuffer
 * @param {cc.GFXCommandBufferInfo} arg0
 * @return {cc.GFXCommandBuffer}
 */
CreateGFXCommandBuffer : function (
gfxcommandbufferinfo 
)
{
    return cc.GFXCommandBuffer;
},

/**
 * @method CheckExtension
 * @param {String} arg0
 * @return {bool}
 */
CheckExtension : function (
str 
)
{
    return false;
},

/**
 * @method Initialize
 * @param {cc.GFXDeviceInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxdeviceinfo 
)
{
    return false;
},

/**
 * @method Resize
 * @param {unsigned int} arg0
 * @param {unsigned int} arg1
 */
Resize : function (
int, 
int 
)
{
},

/**
 * @method CreateGFXSampler
 * @param {cc.GFXSamplerInfo} arg0
 * @return {cc.GFXSampler}
 */
CreateGFXSampler : function (
gfxsamplerinfo 
)
{
    return cc.GFXSampler;
},

/**
 * @method CreateGFXQueue
 * @param {cc.GFXQueueInfo} arg0
 * @return {cc.GFXQueue}
 */
CreateGFXQueue : function (
gfxqueueinfo 
)
{
    return cc.GFXQueue;
},

/**
 * @method CreateGFXRenderPass
 * @param {cc.GFXRenderPassInfo} arg0
 * @return {cc.GFXRenderPass}
 */
CreateGFXRenderPass : function (
gfxrenderpassinfo 
)
{
    return cc.GFXRenderPass;
},

/**
 * @method CreateGFXBindingLayout
 * @param {cc.GFXBindingLayoutInfo} arg0
 * @return {cc.GFXBindingLayout}
 */
CreateGFXBindingLayout : function (
gfxbindinglayoutinfo 
)
{
    return cc.GFXBindingLayout;
},

/**
 * @method Present
 */
Present : function (
)
{
},

/**
 * @method CreateGFXInputAssembler
 * @param {cc.GFXInputAssemblerInfo} arg0
 * @return {cc.GFXInputAssembler}
 */
CreateGFXInputAssembler : function (
gfxinputassemblerinfo 
)
{
    return cc.GFXInputAssembler;
},

/**
 * @method CreateGFXFramebuffer
 * @param {cc.GFXFramebufferInfo} arg0
 * @return {cc.GFXFramebuffer}
 */
CreateGFXFramebuffer : function (
gfxframebufferinfo 
)
{
    return cc.GFXFramebuffer;
},

/**
 * @method GLES2Device
 * @constructor
 */
GLES2Device : function (
)
{
},

};

/**
 * @class GLES2Context
 */
gfx.GLES2Context = {

/**
 * @method egl_config
 * @return {void}
 */
egl_config : function (
)
{
    return void;
},

/**
 * @method minor_ver
 * @return {int}
 */
minor_ver : function (
)
{
    return 0;
},

/**
 * @method CheckExtension
 * @param {String} arg0
 * @return {bool}
 */
CheckExtension : function (
str 
)
{
    return false;
},

/**
 * @method egl_context
 * @return {void}
 */
egl_context : function (
)
{
    return void;
},

/**
 * @method major_ver
 * @return {int}
 */
major_ver : function (
)
{
    return 0;
},

/**
 * @method egl_display
 * @return {void}
 */
egl_display : function (
)
{
    return void;
},

/**
 * @method native_display
 * @return {void}
 */
native_display : function (
)
{
    return void;
},

/**
 * @method MakeCurrent
 * @return {bool}
 */
MakeCurrent : function (
)
{
    return false;
},

/**
 * @method egl_shared_ctx
 * @return {void}
 */
egl_shared_ctx : function (
)
{
    return void;
},

/**
 * @method Initialize
 * @param {cc.GFXContextInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxcontextinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method egl_surface
 * @return {void}
 */
egl_surface : function (
)
{
    return void;
},

/**
 * @method Present
 */
Present : function (
)
{
},

/**
 * @method GLES2Context
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2Context : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2Window
 */
gfx.GLES2Window = {

/**
 * @method Initialize
 * @param {cc.GFXWindowInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxwindowinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method Resize
 * @param {unsigned int} arg0
 * @param {unsigned int} arg1
 */
Resize : function (
int, 
int 
)
{
},

/**
 * @method GLES2Window
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2Window : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2Buffer
 */
gfx.GLES2Buffer = {

/**
 * @method Update
 * @param {void} arg0
 * @param {unsigned int} arg1
 * @param {unsigned int} arg2
 */
Update : function (
void, 
int, 
int 
)
{
},

/**
 * @method gpu_buffer
 * @return {cc.GLES2GPUBuffer}
 */
gpu_buffer : function (
)
{
    return cc.GLES2GPUBuffer;
},

/**
 * @method Initialize
 * @param {cc.GFXBufferInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxbufferinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method Resize
 * @param {unsigned int} arg0
 */
Resize : function (
int 
)
{
},

/**
 * @method GLES2Buffer
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2Buffer : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2Texture
 */
gfx.GLES2Texture = {

/**
 * @method Initialize
 * @param {cc.GFXTextureInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxtextureinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method gpu_texture
 * @return {cc.GLES2GPUTexture}
 */
gpu_texture : function (
)
{
    return cc.GLES2GPUTexture;
},

/**
 * @method Resize
 * @param {unsigned int} arg0
 * @param {unsigned int} arg1
 */
Resize : function (
int, 
int 
)
{
},

/**
 * @method GLES2Texture
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2Texture : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2TextureView
 */
gfx.GLES2TextureView = {

/**
 * @method Initialize
 * @param {cc.GFXTextureViewInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxtextureviewinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method gpu_tex_view
 * @return {cc.GLES2GPUTextureView}
 */
gpu_tex_view : function (
)
{
    return cc.GLES2GPUTextureView;
},

/**
 * @method GLES2TextureView
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2TextureView : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2Sampler
 */
gfx.GLES2Sampler = {

/**
 * @method Initialize
 * @param {cc.GFXSamplerInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxsamplerinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method gpu_sampler
 * @return {cc.GLES2GPUSampler}
 */
gpu_sampler : function (
)
{
    return cc.GLES2GPUSampler;
},

/**
 * @method GLES2Sampler
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2Sampler : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2Shader
 */
gfx.GLES2Shader = {

/**
 * @method Initialize
 * @param {cc.GFXShaderInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxshaderinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method gpu_shader
 * @return {cc.GLES2GPUShader}
 */
gpu_shader : function (
)
{
    return cc.GLES2GPUShader;
},

/**
 * @method GLES2Shader
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2Shader : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2InputAssembler
 */
gfx.GLES2InputAssembler = {

/**
 * @method Initialize
 * @param {cc.GFXInputAssemblerInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxinputassemblerinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method gpu_input_assembler
 * @return {cc.GLES2GPUInputAssembler}
 */
gpu_input_assembler : function (
)
{
    return cc.GLES2GPUInputAssembler;
},

/**
 * @method ExtractCmdDraw
 * @param {cc.GLES2CmdDraw} arg0
 */
ExtractCmdDraw : function (
gles2cmddraw 
)
{
},

/**
 * @method GLES2InputAssembler
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2InputAssembler : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2RenderPass
 */
gfx.GLES2RenderPass = {

/**
 * @method Initialize
 * @param {cc.GFXRenderPassInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxrenderpassinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method gpu_render_pass
 * @return {cc.GLES2GPURenderPass}
 */
gpu_render_pass : function (
)
{
    return cc.GLES2GPURenderPass;
},

/**
 * @method GLES2RenderPass
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2RenderPass : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2Framebuffer
 */
gfx.GLES2Framebuffer = {

/**
 * @method Initialize
 * @param {cc.GFXFramebufferInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxframebufferinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method gpu_fbo
 * @return {cc.GLES2GPUFramebuffer}
 */
gpu_fbo : function (
)
{
    return cc.GLES2GPUFramebuffer;
},

/**
 * @method GLES2Framebuffer
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2Framebuffer : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2BindingLayout
 */
gfx.GLES2BindingLayout = {

/**
 * @method Initialize
 * @param {cc.GFXBindingLayoutInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxbindinglayoutinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method gpu_binding_layout
 * @return {cc.GLES2GPUBindingLayout}
 */
gpu_binding_layout : function (
)
{
    return cc.GLES2GPUBindingLayout;
},

/**
 * @method Update
 */
Update : function (
)
{
},

/**
 * @method GLES2BindingLayout
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2BindingLayout : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2PipelineLayout
 */
gfx.GLES2PipelineLayout = {

/**
 * @method Initialize
 * @param {cc.GFXPipelineLayoutInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxpipelinelayoutinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method gpu_pipeline_layout
 * @return {cc.GLES2GPUPipelineLayout}
 */
gpu_pipeline_layout : function (
)
{
    return cc.GLES2GPUPipelineLayout;
},

/**
 * @method GLES2PipelineLayout
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2PipelineLayout : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2PipelineState
 */
gfx.GLES2PipelineState = {

/**
 * @method Initialize
 * @param {cc.GFXPipelineStateInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxpipelinestateinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method gpu_pso
 * @return {cc.GLES2GPUPipelineState}
 */
gpu_pso : function (
)
{
    return cc.GLES2GPUPipelineState;
},

/**
 * @method GLES2PipelineState
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2PipelineState : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2GPUBuffer
 */
gfx.GLES2GPUBuffer = {

};

/**
 * @class GLES2GPUTexture
 */
gfx.GLES2GPUTexture = {

};

/**
 * @class GLES2GPUTextureView
 */
gfx.GLES2GPUTextureView = {

};

/**
 * @class GLES2GPUSampler
 */
gfx.GLES2GPUSampler = {

};

/**
 * @class GLES2GPUShader
 */
gfx.GLES2GPUShader = {

};

/**
 * @class GLES2GPUInputAssembler
 */
gfx.GLES2GPUInputAssembler = {

};

/**
 * @class GLES2GPURenderPass
 */
gfx.GLES2GPURenderPass = {

};

/**
 * @class GLES2GPUFramebuffer
 */
gfx.GLES2GPUFramebuffer = {

};

/**
 * @class GLES2GPUPipelineLayout
 */
gfx.GLES2GPUPipelineLayout = {

};

/**
 * @class GLES2GPUPipelineState
 */
gfx.GLES2GPUPipelineState = {

};

/**
 * @class GLES2GPUBindingLayout
 */
gfx.GLES2GPUBindingLayout = {

};

/**
 * @class GLES2CmdBeginRenderPass
 */
gfx.GLES2CmdBeginRenderPass = {

/**
 * @method Clear
 */
Clear : function (
)
{
},

/**
 * @method GLES2CmdBeginRenderPass
 * @constructor
 */
GLES2CmdBeginRenderPass : function (
)
{
},

};

/**
 * @class GLES2CmdBindStates
 */
gfx.GLES2CmdBindStates = {

/**
 * @method Clear
 */
Clear : function (
)
{
},

/**
 * @method GLES2CmdBindStates
 * @constructor
 */
GLES2CmdBindStates : function (
)
{
},

};

/**
 * @class GLES2CmdDraw
 */
gfx.GLES2CmdDraw = {

/**
 * @method Clear
 */
Clear : function (
)
{
},

/**
 * @method GLES2CmdDraw
 * @constructor
 */
GLES2CmdDraw : function (
)
{
},

};

/**
 * @class GLES2CmdUpdateBuffer
 */
gfx.GLES2CmdUpdateBuffer = {

/**
 * @method Clear
 */
Clear : function (
)
{
},

/**
 * @method GLES2CmdUpdateBuffer
 * @constructor
 */
GLES2CmdUpdateBuffer : function (
)
{
},

};

/**
 * @class GLES2CmdCopyBufferToTexture
 */
gfx.GLES2CmdCopyBufferToTexture = {

/**
 * @method Clear
 */
Clear : function (
)
{
},

/**
 * @method GLES2CmdCopyBufferToTexture
 * @constructor
 */
GLES2CmdCopyBufferToTexture : function (
)
{
},

};

/**
 * @class GLES2CmdPackage
 */
gfx.GLES2CmdPackage = {

};

/**
 * @class GLES2CommandAllocator
 */
gfx.GLES2CommandAllocator = {

/**
 * @method Initialize
 * @param {cc.GFXCommandAllocatorInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxcommandallocatorinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method ClearCmds
 * @param {cc.GLES2CmdPackage} arg0
 */
ClearCmds : function (
gles2cmdpackage 
)
{
},

/**
 * @method ReleaseCmds
 */
ReleaseCmds : function (
)
{
},

/**
 * @method GLES2CommandAllocator
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2CommandAllocator : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2CommandBuffer
 */
gfx.GLES2CommandBuffer = {

/**
 * @method End
 */
End : function (
)
{
},

/**
 * @method BindInputAssembler
 * @param {cc.GFXInputAssembler} arg0
 */
BindInputAssembler : function (
gfxinputassembler 
)
{
},

/**
 * @method BindPipelineState
 * @param {cc.GFXPipelineState} arg0
 */
BindPipelineState : function (
gfxpipelinestate 
)
{
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method SetDepthBias
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 */
SetDepthBias : function (
float, 
float, 
float 
)
{
},

/**
 * @method Begin
 */
Begin : function (
)
{
},

/**
 * @method BindBindingLayout
 * @param {cc.GFXBindingLayout} arg0
 */
BindBindingLayout : function (
gfxbindinglayout 
)
{
},

/**
 * @method EndRenderPass
 */
EndRenderPass : function (
)
{
},

/**
 * @method CopyBufferToTexture
 * @param {cc.GFXBuffer} arg0
 * @param {cc.GFXTexture} arg1
 * @param {cc.GFXTextureLayout} arg2
 * @param {cc.GFXBufferTextureCopy} arg3
 * @param {unsigned int} arg4
 */
CopyBufferToTexture : function (
gfxbuffer, 
gfxtexture, 
gfxtexturelayout, 
gfxbuffertexturecopy, 
int 
)
{
},

/**
 * @method UpdateBuffer
 * @param {cc.GFXBuffer} arg0
 * @param {void} arg1
 * @param {unsigned int} arg2
 * @param {unsigned int} arg3
 */
UpdateBuffer : function (
gfxbuffer, 
void, 
int, 
int 
)
{
},

/**
 * @method Execute
 * @param {cc.GFXCommandBuffer} arg0
 * @param {unsigned int} arg1
 */
Execute : function (
gfxcommandbuffer, 
int 
)
{
},

/**
 * @method SetStencilWriteMask
 * @param {cc.GFXStencilFace} arg0
 * @param {unsigned int} arg1
 */
SetStencilWriteMask : function (
gfxstencilface, 
int 
)
{
},

/**
 * @method Draw
 * @param {cc.GFXInputAssembler} arg0
 */
Draw : function (
gfxinputassembler 
)
{
},

/**
 * @method BeginRenderPass
 * @param {cc.GFXFramebuffer} arg0
 * @param {cc.GFXRect} arg1
 * @param {cc.GFXClearFlagBit} arg2
 * @param {cc.GFXColor} arg3
 * @param {unsigned int} arg4
 * @param {float} arg5
 * @param {int} arg6
 */
BeginRenderPass : function (
gfxframebuffer, 
gfxrect, 
gfxclearflagbit, 
gfxcolor, 
int, 
float, 
int 
)
{
},

/**
 * @method SetStencilCompareMask
 * @param {cc.GFXStencilFace} arg0
 * @param {int} arg1
 * @param {unsigned int} arg2
 */
SetStencilCompareMask : function (
gfxstencilface, 
int, 
int 
)
{
},

/**
 * @method Initialize
 * @param {cc.GFXCommandBufferInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxcommandbufferinfo 
)
{
    return false;
},

/**
 * @method SetDepthBounds
 * @param {float} arg0
 * @param {float} arg1
 */
SetDepthBounds : function (
float, 
float 
)
{
},

/**
 * @method SetViewport
 * @param {cc.GFXViewport} arg0
 */
SetViewport : function (
gfxviewport 
)
{
},

/**
 * @method SetBlendConstants
 * @param {cc.GFXColor} arg0
 */
SetBlendConstants : function (
gfxcolor 
)
{
},

/**
 * @method SetScissor
 * @param {cc.GFXRect} arg0
 */
SetScissor : function (
gfxrect 
)
{
},

/**
 * @method SetLineWidth
 * @param {float} arg0
 */
SetLineWidth : function (
float 
)
{
},

/**
 * @method GLES2CommandBuffer
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2CommandBuffer : function (
gfxdevice 
)
{
},

};

/**
 * @class GLES2Queue
 */
gfx.GLES2Queue = {

/**
 * @method Initialize
 * @param {cc.GFXQueueInfo} arg0
 * @return {bool}
 */
Initialize : function (
gfxqueueinfo 
)
{
    return false;
},

/**
 * @method Destroy
 */
Destroy : function (
)
{
},

/**
 * @method is_async
 * @return {bool}
 */
is_async : function (
)
{
    return false;
},

/**
 * @method submit
 * @param {cc.GFXCommandBuffer} arg0
 * @param {unsigned int} arg1
 */
submit : function (
gfxcommandbuffer, 
int 
)
{
},

/**
 * @method GLES2Queue
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GLES2Queue : function (
gfxdevice 
)
{
},

};
