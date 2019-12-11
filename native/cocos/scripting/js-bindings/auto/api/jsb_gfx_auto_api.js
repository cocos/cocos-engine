/**
 * @module gfx
 */
var gfx = gfx || {};

/**
 * @class GFXDevice
 */
gfx.GFXDevice = {

/**
 * @method height
 * @return {unsigned int}
 */
height : function (
)
{
    return 0;
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
 * @method api
 * @return {cc.GFXAPI}
 */
api : function (
)
{
    return 0;
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
 * @method width
 * @return {unsigned int}
 */
width : function (
)
{
    return 0;
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
 * @method window
 * @return {cc.GFXWindow}
 */
window : function (
)
{
    return cc.GFXWindow;
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
 * @method cmd_allocator
 * @return {cc.GFXCommandAllocator}
 */
cmd_allocator : function (
)
{
    return cc.GFXCommandAllocator;
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
 * @method mem_status
* @return {cc.GFXMemoryStatus|cc.GFXMemoryStatus}
*/
mem_status : function(
)
{
    return cc.GFXMemoryStatus;
},

/**
 * @method HasFeature
 * @param {cc.GFXFeature} arg0
 * @return {bool}
 */
HasFeature : function (
gfxfeature 
)
{
    return false;
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
 * @method CreateGFXPipelineState
 * @param {cc.GFXPipelineStateInfo} arg0
 * @return {cc.GFXPipelineState}
 */
CreateGFXPipelineState : function (
gfxpipelinestateinfo 
)
{
    return cc.GFXPipelineState;
},

/**
 * @method queue
 * @return {cc.GFXQueue}
 */
queue : function (
)
{
    return cc.GFXQueue;
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
 * @method context
 * @return {cc.GFXContext}
 */
context : function (
)
{
    return cc.GFXContext;
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
 * @method CreateGFXPipelieLayout
 * @param {cc.GFXPipelineLayoutInfo} arg0
 * @return {cc.GFXPipelineLayout}
 */
CreateGFXPipelieLayout : function (
gfxpipelinelayoutinfo 
)
{
    return cc.GFXPipelineLayout;
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
 * @method GFXDevice
 * @constructor
 */
GFXDevice : function (
)
{
},

};

/**
 * @class GFXContext
 */
gfx.GFXContext = {

/**
 * @method shared_ctx
 * @return {cc.GFXContext}
 */
shared_ctx : function (
)
{
    return cc.GFXContext;
},

/**
 * @method color_fmt
 * @return {cc.GFXFormat}
 */
color_fmt : function (
)
{
    return 0;
},

/**
 * @method vsync_mode
 * @return {cc.GFXVsyncMode}
 */
vsync_mode : function (
)
{
    return 0;
},

/**
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
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
 * @method Present
 */
Present : function (
)
{
},

/**
 * @method depth_stencil_fmt
 * @return {cc.GFXFormat}
 */
depth_stencil_fmt : function (
)
{
    return 0;
},

/**
 * @method GFXContext
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXContext : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXWindow
 */
gfx.GFXWindow = {

/**
 * @method depth_stencil_tex_view
 * @return {cc.GFXTextureView}
 */
depth_stencil_tex_view : function (
)
{
    return cc.GFXTextureView;
},

/**
 * @method render_pass
 * @return {cc.GFXRenderPass}
 */
render_pass : function (
)
{
    return cc.GFXRenderPass;
},

/**
 * @method native_width
 * @return {unsigned int}
 */
native_width : function (
)
{
    return 0;
},

/**
 * @method native_height
 * @return {unsigned int}
 */
native_height : function (
)
{
    return 0;
},

/**
 * @method title
 * @return {String}
 */
title : function (
)
{
    return ;
},

/**
 * @method color_fmt
 * @return {cc.GFXFormat}
 */
color_fmt : function (
)
{
    return 0;
},

/**
 * @method top
 * @return {int}
 */
top : function (
)
{
    return 0;
},

/**
 * @method depth_stencil_texture
 * @return {cc.GFXTexture}
 */
depth_stencil_texture : function (
)
{
    return cc.GFXTexture;
},

/**
 * @method color_texture
 * @return {cc.GFXTexture}
 */
color_texture : function (
)
{
    return cc.GFXTexture;
},

/**
 * @method is_offscreen
 * @return {bool}
 */
is_offscreen : function (
)
{
    return false;
},

/**
 * @method height
 * @return {unsigned int}
 */
height : function (
)
{
    return 0;
},

/**
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

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
 * @method framebuffer
 * @return {cc.GFXFramebuffer}
 */
framebuffer : function (
)
{
    return cc.GFXFramebuffer;
},

/**
 * @method depth_stencil_fmt
 * @return {cc.GFXFormat}
 */
depth_stencil_fmt : function (
)
{
    return 0;
},

/**
 * @method color_tex_view
 * @return {cc.GFXTextureView}
 */
color_tex_view : function (
)
{
    return cc.GFXTextureView;
},

/**
 * @method width
 * @return {unsigned int}
 */
width : function (
)
{
    return 0;
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
 * @method left
 * @return {int}
 */
left : function (
)
{
    return 0;
},

/**
 * @method GFXWindow
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXWindow : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXBuffer
 */
gfx.GFXBuffer = {

/**
 * @method count
 * @return {unsigned int}
 */
count : function (
)
{
    return 0;
},

/**
 * @method memUsage
 * @return {cc.GFXMemoryUsageBit}
 */
memUsage : function (
)
{
    return 0;
},

/**
 * @method usage
 * @return {cc.GFXBufferUsageBit}
 */
usage : function (
)
{
    return 0;
},

/**
 * @method buffer
 * @return {unsigned char}
 */
buffer : function (
)
{
    return 0;
},

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
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

/**
 * @method flags
 * @return {cc.GFXBufferFlagBit}
 */
flags : function (
)
{
    return 0;
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
 * @method stride
 * @return {unsigned int}
 */
stride : function (
)
{
    return 0;
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
 * @method size
 * @return {unsigned int}
 */
size : function (
)
{
    return 0;
},

/**
 * @method GFXBuffer
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXBuffer : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXTexture
 */
gfx.GFXTexture = {

/**
 * @method array_layer
 * @return {unsigned int}
 */
array_layer : function (
)
{
    return 0;
},

/**
 * @method format
 * @return {cc.GFXFormat}
 */
format : function (
)
{
    return 0;
},

/**
 * @method buffer
 * @return {unsigned char}
 */
buffer : function (
)
{
    return 0;
},

/**
 * @method height
 * @return {unsigned int}
 */
height : function (
)
{
    return 0;
},

/**
 * @method usage
 * @return {cc.GFXTextureUsageBit}
 */
usage : function (
)
{
    return 0;
},

/**
 * @method depth
 * @return {unsigned int}
 */
depth : function (
)
{
    return 0;
},

/**
 * @method flags
 * @return {cc.GFXTextureFlagBit}
 */
flags : function (
)
{
    return 0;
},

/**
 * @method mip_level
 * @return {unsigned int}
 */
mip_level : function (
)
{
    return 0;
},

/**
 * @method samples
 * @return {cc.GFXSampleCount}
 */
samples : function (
)
{
    return 0;
},

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
 * @method type
 * @return {cc.GFXTextureType}
 */
type : function (
)
{
    return 0;
},

/**
 * @method width
 * @return {unsigned int}
 */
width : function (
)
{
    return 0;
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
 * @method size
 * @return {unsigned int}
 */
size : function (
)
{
    return 0;
},

/**
 * @method GFXTexture
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXTexture : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXTextureView
 */
gfx.GFXTextureView = {

/**
 * @method level_count
 * @return {unsigned int}
 */
level_count : function (
)
{
    return 0;
},

/**
 * @method format
 * @return {cc.GFXFormat}
 */
format : function (
)
{
    return 0;
},

/**
 * @method texture
 * @return {cc.GFXTexture}
 */
texture : function (
)
{
    return cc.GFXTexture;
},

/**
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

/**
 * @method layer_count
 * @return {unsigned int}
 */
layer_count : function (
)
{
    return 0;
},

/**
 * @method base_level
 * @return {unsigned int}
 */
base_level : function (
)
{
    return 0;
},

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
 * @method base_layer
 * @return {unsigned int}
 */
base_layer : function (
)
{
    return 0;
},

/**
 * @method type
 * @return {cc.GFXTextureViewType}
 */
type : function (
)
{
    return 0;
},

/**
 * @method GFXTextureView
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXTextureView : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXSampler
 */
gfx.GFXSampler = {

/**
 * @method cmp_func
 * @return {cc.GFXComparisonFunc}
 */
cmp_func : function (
)
{
    return 0;
},

/**
 * @method min_filter
 * @return {cc.GFXFilter}
 */
min_filter : function (
)
{
    return 0;
},

/**
 * @method name
 * @return {String}
 */
name : function (
)
{
    return ;
},

/**
 * @method address_u
 * @return {cc.GFXAddress}
 */
address_u : function (
)
{
    return 0;
},

/**
 * @method border_color
 * @return {cc.GFXColor}
 */
border_color : function (
)
{
    return cc.GFXColor;
},

/**
 * @method max_anisotropy
 * @return {unsigned int}
 */
max_anisotropy : function (
)
{
    return 0;
},

/**
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

/**
 * @method address_v
 * @return {cc.GFXAddress}
 */
address_v : function (
)
{
    return 0;
},

/**
 * @method address_w
 * @return {cc.GFXAddress}
 */
address_w : function (
)
{
    return 0;
},

/**
 * @method min_lod
 * @return {unsigned int}
 */
min_lod : function (
)
{
    return 0;
},

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
 * @method mag_filter
 * @return {cc.GFXFilter}
 */
mag_filter : function (
)
{
    return 0;
},

/**
 * @method mip_lod_bias
 * @return {float}
 */
mip_lod_bias : function (
)
{
    return 0;
},

/**
 * @method max_lod
 * @return {unsigned int}
 */
max_lod : function (
)
{
    return 0;
},

/**
 * @method mip_filter
 * @return {cc.GFXFilter}
 */
mip_filter : function (
)
{
    return 0;
},

/**
 * @method GFXSampler
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXSampler : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXShader
 */
gfx.GFXShader = {

/**
 * @method hash
 * @return {unsigned int}
 */
hash : function (
)
{
    return 0;
},

/**
 * @method name
 * @return {String}
 */
name : function (
)
{
    return ;
},

/**
 * @method samplers
 * @return {Array}
 */
samplers : function (
)
{
    return new Array();
},

/**
 * @method blocks
 * @return {Array}
 */
blocks : function (
)
{
    return new Array();
},

/**
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

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
 * @method stages
 * @return {Array}
 */
stages : function (
)
{
    return new Array();
},

/**
 * @method GFXShader
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXShader : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXInputAssembler
 */
gfx.GFXInputAssembler = {

/**
 * @method set_first_vertex
 * @param {unsigned int} arg0
 */
set_first_vertex : function (
int 
)
{
},

/**
 * @method set_vertex_offset
 * @param {unsigned int} arg0
 */
set_vertex_offset : function (
int 
)
{
},

/**
 * @method vertex_count
 * @return {unsigned int}
 */
vertex_count : function (
)
{
    return 0;
},

/**
 * @method first_instance
 * @return {unsigned int}
 */
first_instance : function (
)
{
    return 0;
},

/**
 * @method set_index_count
 * @param {unsigned int} arg0
 */
set_index_count : function (
int 
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
 * @method first_index
 * @return {unsigned int}
 */
first_index : function (
)
{
    return 0;
},

/**
 * @method first_vertex
 * @return {unsigned int}
 */
first_vertex : function (
)
{
    return 0;
},

/**
 * @method vertex_buffers
 * @return {Array}
 */
vertex_buffers : function (
)
{
    return new Array();
},

/**
 * @method set_vertex_count
 * @param {unsigned int} arg0
 */
set_vertex_count : function (
int 
)
{
},

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
 * @method set_first_instance
 * @param {unsigned int} arg0
 */
set_first_instance : function (
int 
)
{
},

/**
 * @method set_instance_count
 * @param {unsigned int} arg0
 */
set_instance_count : function (
int 
)
{
},

/**
 * @method vertex_offset
 * @return {unsigned int}
 */
vertex_offset : function (
)
{
    return 0;
},

/**
 * @method instance_count
 * @return {unsigned int}
 */
instance_count : function (
)
{
    return 0;
},

/**
 * @method attributes
 * @return {Array}
 */
attributes : function (
)
{
    return new Array();
},

/**
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

/**
 * @method set_first_index
 * @param {unsigned int} arg0
 */
set_first_index : function (
int 
)
{
},

/**
 * @method index_count
 * @return {unsigned int}
 */
index_count : function (
)
{
    return 0;
},

/**
 * @method indirect_buffer
 * @return {cc.GFXBuffer}
 */
indirect_buffer : function (
)
{
    return cc.GFXBuffer;
},

/**
 * @method index_buffer
 * @return {cc.GFXBuffer}
 */
index_buffer : function (
)
{
    return cc.GFXBuffer;
},

/**
 * @method GFXInputAssembler
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXInputAssembler : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXRenderPass
 */
gfx.GFXRenderPass = {

/**
 * @method depth_stencil_attachment
 * @return {cc.GFXDepthStencilAttachment}
 */
depth_stencil_attachment : function (
)
{
    return cc.GFXDepthStencilAttachment;
},

/**
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

/**
 * @method sub_passes
 * @return {Array}
 */
sub_passes : function (
)
{
    return new Array();
},

/**
 * @method color_attachments
 * @return {Array}
 */
color_attachments : function (
)
{
    return new Array();
},

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
 * @method GFXRenderPass
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXRenderPass : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXFramebuffer
 */
gfx.GFXFramebuffer = {

/**
 * @method color_views
 * @return {Array}
 */
color_views : function (
)
{
    return new Array();
},

/**
 * @method is_offscreen
 * @return {bool}
 */
is_offscreen : function (
)
{
    return false;
},

/**
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

/**
 * @method depth_stencil_view
 * @return {cc.GFXTextureView}
 */
depth_stencil_view : function (
)
{
    return cc.GFXTextureView;
},

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
 * @method render_pass
 * @return {cc.GFXRenderPass}
 */
render_pass : function (
)
{
    return cc.GFXRenderPass;
},

/**
 * @method GFXFramebuffer
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXFramebuffer : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXBindingLayout
 */
gfx.GFXBindingLayout = {

/**
 * @method BindTextureView
 * @param {unsigned int} arg0
 * @param {cc.GFXTextureView} arg1
 */
BindTextureView : function (
int, 
gfxtextureview 
)
{
},

/**
 * @method BindBuffer
 * @param {unsigned int} arg0
 * @param {cc.GFXBuffer} arg1
 */
BindBuffer : function (
int, 
gfxbuffer 
)
{
},

/**
 * @method BindSampler
 * @param {unsigned int} arg0
 * @param {cc.GFXSampler} arg1
 */
BindSampler : function (
int, 
gfxsampler 
)
{
},

/**
 * @method Update
 */
Update : function (
)
{
},

/**
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

/**
 * @method binding_units
 * @return {Array}
 */
binding_units : function (
)
{
    return new Array();
},

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
 * @method GFXBindingLayout
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXBindingLayout : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXPipelineLayout
 */
gfx.GFXPipelineLayout = {

/**
 * @method push_constant_ranges
 * @return {Array}
 */
push_constant_ranges : function (
)
{
    return new Array();
},

/**
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

/**
 * @method layouts
 * @return {Array}
 */
layouts : function (
)
{
    return new Array();
},

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
 * @method GFXPipelineLayout
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXPipelineLayout : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXPipelineState
 */
gfx.GFXPipelineState = {

/**
 * @method primitive
 * @return {cc.GFXPrimitiveMode}
 */
primitive : function (
)
{
    return 0;
},

/**
 * @method layout
 * @return {cc.GFXPipelineLayout}
 */
layout : function (
)
{
    return cc.GFXPipelineLayout;
},

/**
 * @method rs
 * @return {cc.GFXRasterizerState}
 */
rs : function (
)
{
    return cc.GFXRasterizerState;
},

/**
 * @method dynamic_states
 * @return {Array}
 */
dynamic_states : function (
)
{
    return new Array();
},

/**
 * @method is
 * @return {cc.GFXInputState}
 */
is : function (
)
{
    return cc.GFXInputState;
},

/**
 * @method bs
 * @return {cc.GFXBlendState}
 */
bs : function (
)
{
    return cc.GFXBlendState;
},

/**
 * @method shader
 * @return {cc.GFXShader}
 */
shader : function (
)
{
    return cc.GFXShader;
},

/**
 * @method dss
 * @return {cc.GFXDepthStencilState}
 */
dss : function (
)
{
    return cc.GFXDepthStencilState;
},

/**
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

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
 * @method render_pass
 * @return {cc.GFXRenderPass}
 */
render_pass : function (
)
{
    return cc.GFXRenderPass;
},

/**
 * @method GFXPipelineState
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXPipelineState : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXCommandAllocator
 */
gfx.GFXCommandAllocator = {

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
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

/**
 * @method GFXCommandAllocator
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXCommandAllocator : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXCommandBuffer
 */
gfx.GFXCommandBuffer = {

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
 * @method num_tris
 * @return {unsigned int}
 */
num_tris : function (
)
{
    return 0;
},

/**
 * @method allocator
 * @return {cc.GFXCommandAllocator}
 */
allocator : function (
)
{
    return cc.GFXCommandAllocator;
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
 * @method type
 * @return {cc.GFXCommandBufferType}
 */
type : function (
)
{
    return 0;
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
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
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
 * @method num_draw_calls
 * @return {unsigned int}
 */
num_draw_calls : function (
)
{
    return 0;
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
 * @method GFXCommandBuffer
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXCommandBuffer : function (
gfxdevice 
)
{
},

};

/**
 * @class GFXQueue
 */
gfx.GFXQueue = {

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
 * @method device
 * @return {cc.GFXDevice}
 */
device : function (
)
{
    return cc.GFXDevice;
},

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
 * @method type
 * @return {cc.GFXQueueType}
 */
type : function (
)
{
    return 0;
},

/**
 * @method GFXQueue
 * @constructor
 * @param {cc.GFXDevice} arg0
 */
GFXQueue : function (
gfxdevice 
)
{
},

};
