/**
 * @module gfx
 */
var gfx = gfx || {};

/**
 * @class GFXOffset
 */
gfx.GFXOffset = {

};

/**
 * @class GFXRect
 */
gfx.GFXRect = {

};

/**
 * @class GFXExtent
 */
gfx.GFXExtent = {

};

/**
 * @class GFXTextureSubres
 */
gfx.GFXTextureSubres = {

};

/**
 * @class GFXTextureCopy
 */
gfx.GFXTextureCopy = {

};

/**
 * @class GFXBufferTextureCopy
 */
gfx.GFXBufferTextureCopy = {

};

/**
 * @class GFXViewport
 */
gfx.GFXViewport = {

};

/**
 * @class GFXColor
 */
gfx.GFXColor = {

};

/**
 * @class GFXDeviceInfo
 */
gfx.GFXDeviceInfo = {

};

/**
 * @class GFXWindowInfo
 */
gfx.GFXWindowInfo = {

};

/**
 * @class GFXContextInfo
 */
gfx.GFXContextInfo = {

};

/**
 * @class GFXBufferInfo
 */
gfx.GFXBufferInfo = {

};

/**
 * @class GFXDrawInfo
 */
gfx.GFXDrawInfo = {

};

/**
 * @class GFXIndirectBuffer
 */
gfx.GFXIndirectBuffer = {

};

/**
 * @class GFXTextureInfo
 */
gfx.GFXTextureInfo = {

};

/**
 * @class GFXTextureViewInfo
 */
gfx.GFXTextureViewInfo = {

};

/**
 * @class GFXSamplerInfo
 */
gfx.GFXSamplerInfo = {

};

/**
 * @class GFXShaderMacro
 */
gfx.GFXShaderMacro = {

};

/**
 * @class GFXUniform
 */
gfx.GFXUniform = {

};

/**
 * @class GFXUniformBlock
 */
gfx.GFXUniformBlock = {

};

/**
 * @class GFXUniformSampler
 */
gfx.GFXUniformSampler = {

};

/**
 * @class GFXShaderStage
 */
gfx.GFXShaderStage = {

};

/**
 * @class GFXShaderInfo
 */
gfx.GFXShaderInfo = {

};

/**
 * @class GFXAttribute
 */
gfx.GFXAttribute = {

};

/**
 * @class GFXInputAssemblerInfo
 */
gfx.GFXInputAssemblerInfo = {

};

/**
 * @class GFXColorAttachment
 */
gfx.GFXColorAttachment = {

};

/**
 * @class GFXDepthStencilAttachment
 */
gfx.GFXDepthStencilAttachment = {

};

/**
 * @class GFXRenderPassInfo
 */
gfx.GFXRenderPassInfo = {

};

/**
 * @class GFXFramebufferInfo
 */
gfx.GFXFramebufferInfo = {

};

/**
 * @class GFXBinding
 */
gfx.GFXBinding = {

};

/**
 * @class GFXBindingLayoutInfo
 */
gfx.GFXBindingLayoutInfo = {

};

/**
 * @class GFXBindingUnit
 */
gfx.GFXBindingUnit = {

};

/**
 * @class GFXPushConstantRange
 */
gfx.GFXPushConstantRange = {

};

/**
 * @class GFXPipelineLayoutInfo
 */
gfx.GFXPipelineLayoutInfo = {

};

/**
 * @class GFXInputState
 */
gfx.GFXInputState = {

};

/**
 * @class GFXRasterizerState
 */
gfx.GFXRasterizerState = {

};

/**
 * @class GFXDepthStencilState
 */
gfx.GFXDepthStencilState = {

};

/**
 * @class GFXBlendTarget
 */
gfx.GFXBlendTarget = {

};

/**
 * @class GFXBlendState
 */
gfx.GFXBlendState = {

};

/**
 * @class GFXPipelineStateInfo
 */
gfx.GFXPipelineStateInfo = {

};

/**
 * @class GFXCommandBufferInfo
 */
gfx.GFXCommandBufferInfo = {

};

/**
 * @class GFXQueueInfo
 */
gfx.GFXQueueInfo = {

};

/**
 * @class GFXFormatInfo
 */
gfx.GFXFormatInfo = {

};

/**
 * @class GFXMemoryStatus
 */
gfx.GFXMemoryStatus = {

};

/**
 * @class GFXContext
 */
gfx.GFXContext = {

/**
 * @method sharedContext
 * @return {cc.GFXContext}
 */
sharedContext : function (
)
{
    return cc.GFXContext;
},

/**
 * @method colorFormat
 * @return {cc.GFXFormat}
 */
colorFormat : function (
)
{
    return 0;
},

/**
 * @method detphStencilFormat
 * @return {cc.GFXFormat}
 */
detphStencilFormat : function (
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
 * @method initialize
 * @param {cc.GFXContextInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxcontextinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
)
{
},

/**
 * @method vsyncMode
 * @return {cc.GFXVsyncMode}
 */
vsyncMode : function (
)
{
    return 0;
},

/**
 * @method present
 */
present : function (
)
{
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
 * @method depthStencilTexView
 * @return {cc.GFXTextureView}
 */
depthStencilTexView : function (
)
{
    return cc.GFXTextureView;
},

/**
 * @method renderPass
 * @return {cc.GFXRenderPass}
 */
renderPass : function (
)
{
    return cc.GFXRenderPass;
},

/**
 * @method isOffscreen
 * @return {bool}
 */
isOffscreen : function (
)
{
    return false;
},

/**
 * @method detphStencilFormat
 * @return {cc.GFXFormat}
 */
detphStencilFormat : function (
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
 * @method colorTexView
 * @return {cc.GFXTextureView}
 */
colorTexView : function (
)
{
    return cc.GFXTextureView;
},

/**
 * @method initialize
 * @param {cc.GFXWindowInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxwindowinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
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
 * @method colorFormat
 * @return {cc.GFXFormat}
 */
colorFormat : function (
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
 * @method resize
 * @param {unsigned int} arg0
 * @param {unsigned int} arg1
 */
resize : function (
int, 
int 
)
{
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
 * @method bufferView
 * @return {unsigned char}
 */
bufferView : function (
)
{
    return 0;
},

/**
 * @method update
 * @param {void} arg0
 * @param {unsigned int} arg1
 * @param {unsigned int} arg2
 */
update : function (
void, 
int, 
int 
)
{
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
 * @method initialize
 * @param {cc.GFXBufferInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxbufferinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
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
 * @method resize
 * @param {unsigned int} arg0
 */
resize : function (
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
 * @method arrayLayer
 * @return {unsigned int}
 */
arrayLayer : function (
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
 * @method mipLevel
 * @return {unsigned int}
 */
mipLevel : function (
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
 * @method samples
 * @return {cc.GFXSampleCount}
 */
samples : function (
)
{
    return 0;
},

/**
 * @method initialize
 * @param {cc.GFXTextureInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxtextureinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
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
 * @method resize
 * @param {unsigned int} arg0
 * @param {unsigned int} arg1
 */
resize : function (
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
 * @method baseLevel
 * @return {unsigned int}
 */
baseLevel : function (
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
 * @method levelCount
 * @return {unsigned int}
 */
levelCount : function (
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
 * @method layerCount
 * @return {unsigned int}
 */
layerCount : function (
)
{
    return 0;
},

/**
 * @method initialize
 * @param {cc.GFXTextureViewInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxtextureviewinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
)
{
},

/**
 * @method baseLayer
 * @return {unsigned int}
 */
baseLayer : function (
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
 * @method maxLOD
 * @return {unsigned int}
 */
maxLOD : function (
)
{
    return 0;
},

/**
 * @method mipLODBias
 * @return {float}
 */
mipLODBias : function (
)
{
    return 0;
},

/**
 * @method initialize
 * @param {cc.GFXSamplerInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxsamplerinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
)
{
},

/**
 * @method minLOD
 * @return {unsigned int}
 */
minLOD : function (
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
 * @method name
 * @return {String}
 */
name : function (
)
{
    return ;
},

/**
 * @method initialize
 * @param {cc.GFXShaderInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxshaderinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
)
{
},

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
 * @method vertexBuffers
 * @return {Array}
 */
vertexBuffers : function (
)
{
    return new Array();
},

/**
 * @method firstInstance
 * @return {unsigned int}
 */
firstInstance : function (
)
{
    return 0;
},

/**
 * @method initialize
 * @param {cc.GFXInputAssemblerInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxinputassemblerinfo 
)
{
    return false;
},

/**
 * @method setIndexCount
 * @param {unsigned int} arg0
 */
setIndexCount : function (
int 
)
{
},

/**
 * @method vertexOffset
 * @return {unsigned int}
 */
vertexOffset : function (
)
{
    return 0;
},

/**
 * @method setFirstInstance
 * @param {unsigned int} arg0
 */
setFirstInstance : function (
int 
)
{
},

/**
 * @method destroy
 */
destroy : function (
)
{
},

/**
 * @method setVertexOffset
 * @param {unsigned int} arg0
 */
setVertexOffset : function (
int 
)
{
},

/**
 * @method firstVertex
 * @return {unsigned int}
 */
firstVertex : function (
)
{
    return 0;
},

/**
 * @method instanceCount
 * @return {unsigned int}
 */
instanceCount : function (
)
{
    return 0;
},

/**
 * @method vertexCount
 * @return {unsigned int}
 */
vertexCount : function (
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
 * @method setFirstVertex
 * @param {unsigned int} arg0
 */
setFirstVertex : function (
int 
)
{
},

/**
 * @method firstIndex
 * @return {unsigned int}
 */
firstIndex : function (
)
{
    return 0;
},

/**
 * @method indirectBuffer
 * @return {cc.GFXBuffer}
 */
indirectBuffer : function (
)
{
    return cc.GFXBuffer;
},

/**
 * @method indexCount
 * @return {unsigned int}
 */
indexCount : function (
)
{
    return 0;
},

/**
 * @method setVertexCount
 * @param {unsigned int} arg0
 */
setVertexCount : function (
int 
)
{
},

/**
 * @method indexBuffer
 * @return {cc.GFXBuffer}
 */
indexBuffer : function (
)
{
    return cc.GFXBuffer;
},

/**
 * @method setFirstIndex
 * @param {unsigned int} arg0
 */
setFirstIndex : function (
int 
)
{
},

/**
 * @method setInstanceCount
 * @param {unsigned int} arg0
 */
setInstanceCount : function (
int 
)
{
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
 * @method initialize
 * @param {cc.GFXRenderPassInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxrenderpassinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
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
 * @method depthStencilView
 * @return {cc.GFXTextureView}
 */
depthStencilView : function (
)
{
    return cc.GFXTextureView;
},

/**
 * @method isOffscreen
 * @return {bool}
 */
isOffscreen : function (
)
{
    return false;
},

/**
 * @method renderPass
 * @return {cc.GFXRenderPass}
 */
renderPass : function (
)
{
    return cc.GFXRenderPass;
},

/**
 * @method initialize
 * @param {cc.GFXFramebufferInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxframebufferinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
)
{
},

/**
 * @method colorViews
 * @return {Array}
 */
colorViews : function (
)
{
    return new Array();
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
 * @method bindTextureView
 * @param {unsigned int} arg0
 * @param {cc.GFXTextureView} arg1
 */
bindTextureView : function (
int, 
gfxtextureview 
)
{
},

/**
 * @method bindBuffer
 * @param {unsigned int} arg0
 * @param {cc.GFXBuffer} arg1
 */
bindBuffer : function (
int, 
gfxbuffer 
)
{
},

/**
 * @method bindSampler
 * @param {unsigned int} arg0
 * @param {cc.GFXSampler} arg1
 */
bindSampler : function (
int, 
gfxsampler 
)
{
},

/**
 * @method update
 */
update : function (
)
{
},

/**
 * @method initialize
 * @param {cc.GFXBindingLayoutInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxbindinglayoutinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
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
 * @method layouts
 * @return {Array}
 */
layouts : function (
)
{
    return new Array();
},

/**
 * @method initialize
 * @param {cc.GFXPipelineLayoutInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxpipelinelayoutinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
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
 * @method renderPass
 * @return {cc.GFXRenderPass}
 */
renderPass : function (
)
{
    return cc.GFXRenderPass;
},

/**
 * @method rasterizerState
 * @return {cc.GFXRasterizerState}
 */
rasterizerState : function (
)
{
    return cc.GFXRasterizerState;
},

/**
 * @method dynamicStates
 * @return {Array}
 */
dynamicStates : function (
)
{
    return new Array();
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
 * @method inputState
 * @return {cc.GFXInputState}
 */
inputState : function (
)
{
    return cc.GFXInputState;
},

/**
 * @method blendState
 * @return {cc.GFXBlendState}
 */
blendState : function (
)
{
    return cc.GFXBlendState;
},

/**
 * @method pipelineLayout
 * @return {cc.GFXPipelineLayout}
 */
pipelineLayout : function (
)
{
    return cc.GFXPipelineLayout;
},

/**
 * @method initialize
 * @param {cc.GFXPipelineStateInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxpipelinestateinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
)
{
},

/**
 * @method depthStencilState
 * @return {cc.GFXDepthStencilState}
 */
depthStencilState : function (
)
{
    return cc.GFXDepthStencilState;
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
 * @class GFXCommandBuffer
 */
gfx.GFXCommandBuffer = {

/**
 * @method draw
 * @param {cc.GFXInputAssembler} arg0
 */
draw : function (
gfxinputassembler 
)
{
},

/**
 * @method setBlendConstants
 * @param {cc.GFXColor} arg0
 */
setBlendConstants : function (
gfxcolor 
)
{
},

/**
 * @method setDepthBound
 * @param {float} arg0
 * @param {float} arg1
 */
setDepthBound : function (
float, 
float 
)
{
},

/**
 * @method copyBufferToTexture
 * @param {cc.GFXBuffer} arg0
 * @param {cc.GFXTexture} arg1
 * @param {cc.GFXTextureLayout} arg2
 * @param {cc.GFXBufferTextureCopy} arg3
 * @param {unsigned int} arg4
 */
copyBufferToTexture : function (
gfxbuffer, 
gfxtexture, 
gfxtexturelayout, 
gfxbuffertexturecopy, 
int 
)
{
},

/**
 * @method setLineWidth
 * @param {float} arg0
 */
setLineWidth : function (
float 
)
{
},

/**
 * @method updateBuffer
 * @param {cc.GFXBuffer} arg0
 * @param {void} arg1
 * @param {unsigned int} arg2
 * @param {unsigned int} arg3
 */
updateBuffer : function (
gfxbuffer, 
void, 
int, 
int 
)
{
},

/**
 * @method end
 */
end : function (
)
{
},

/**
 * @method setStencilWriteMask
 * @param {cc.GFXStencilFace} arg0
 * @param {unsigned int} arg1
 */
setStencilWriteMask : function (
gfxstencilface, 
int 
)
{
},

/**
 * @method setStencilCompareMask
 * @param {cc.GFXStencilFace} arg0
 * @param {int} arg1
 * @param {unsigned int} arg2
 */
setStencilCompareMask : function (
gfxstencilface, 
int, 
int 
)
{
},

/**
 * @method bindInputAssembler
 * @param {cc.GFXInputAssembler} arg0
 */
bindInputAssembler : function (
gfxinputassembler 
)
{
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
 * @method bindPipelineState
 * @param {cc.GFXPipelineState} arg0
 */
bindPipelineState : function (
gfxpipelinestate 
)
{
},

/**
 * @method destroy
 */
destroy : function (
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
 * @method setViewport
 * @param {cc.GFXViewport} arg0
 */
setViewport : function (
gfxviewport 
)
{
},

/**
 * @method setDepthBias
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 */
setDepthBias : function (
float, 
float, 
float 
)
{
},

/**
 * @method begin
 */
begin : function (
)
{
},

/**
 * @method numDrawCalls
 * @return {unsigned int}
 */
numDrawCalls : function (
)
{
    return 0;
},

/**
 * @method bindBindingLayout
 * @param {cc.GFXBindingLayout} arg0
 */
bindBindingLayout : function (
gfxbindinglayout 
)
{
},

/**
 * @method endRenderPass
 */
endRenderPass : function (
)
{
},

/**
 * @method initialize
 * @param {cc.GFXCommandBufferInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxcommandbufferinfo 
)
{
    return false;
},

/**
 * @method setScissor
 * @param {cc.GFXRect} arg0
 */
setScissor : function (
gfxrect 
)
{
},

/**
 * @method execute
 * @param {cc.GFXCommandBuffer} arg0
 * @param {unsigned int} arg1
 */
execute : function (
gfxcommandbuffer, 
int 
)
{
},

/**
 * @method numTris
 * @return {unsigned int}
 */
numTris : function (
)
{
    return 0;
},

/**
 * @method beginRenderPass
 * @param {cc.GFXFramebuffer} arg0
 * @param {cc.GFXRect} arg1
 * @param {cc.GFXClearFlagBit} arg2
 * @param {cc.GFXColor} arg3
 * @param {unsigned int} arg4
 * @param {float} arg5
 * @param {int} arg6
 */
beginRenderPass : function (
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
 * @method initialize
 * @param {cc.GFXQueueInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxqueueinfo 
)
{
    return false;
},

/**
 * @method destroy
 */
destroy : function (
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

/**
 * @class GLES2Device
 */
gfx.GLES2Device = {

/**
 * @method useInstancedArrays
 * @return {bool}
 */
useInstancedArrays : function (
)
{
    return false;
},

/**
 * @method createCommandAllocator
 * @param {cc.GFXCommandAllocatorInfo} arg0
 * @return {cc.GFXCommandAllocator}
 */
createCommandAllocator : function (
gfxcommandallocatorinfo 
)
{
    return cc.GFXCommandAllocator;
},

/**
 * @method useDrawInstanced
 * @return {bool}
 */
useDrawInstanced : function (
)
{
    return false;
},

/**
 * @method useDiscardFramebuffer
 * @return {bool}
 */
useDiscardFramebuffer : function (
)
{
    return false;
},

/**
 * @method createCommandBuffer
 * @param {cc.GFXCommandBufferInfo} arg0
 * @return {cc.GFXCommandBuffer}
 */
createCommandBuffer : function (
gfxcommandbufferinfo 
)
{
    return cc.GFXCommandBuffer;
},

/**
 * @method present
 */
present : function (
)
{
},

/**
 * @method createTexture
 * @param {cc.GFXTextureInfo} arg0
 * @return {cc.GFXTexture}
 */
createTexture : function (
gfxtextureinfo 
)
{
    return cc.GFXTexture;
},

/**
 * @method destroy
 */
destroy : function (
)
{
},

/**
 * @method createFramebuffer
 * @param {cc.GFXFramebufferInfo} arg0
 * @return {cc.GFXFramebuffer}
 */
createFramebuffer : function (
gfxframebufferinfo 
)
{
    return cc.GFXFramebuffer;
},

/**
 * @method createRenderPass
 * @param {cc.GFXRenderPassInfo} arg0
 * @return {cc.GFXRenderPass}
 */
createRenderPass : function (
gfxrenderpassinfo 
)
{
    return cc.GFXRenderPass;
},

/**
 * @method createWindow
 * @param {cc.GFXWindowInfo} arg0
 * @return {cc.GFXWindow}
 */
createWindow : function (
gfxwindowinfo 
)
{
    return cc.GFXWindow;
},

/**
 * @method createShader
 * @param {cc.GFXShaderInfo} arg0
 * @return {cc.GFXShader}
 */
createShader : function (
gfxshaderinfo 
)
{
    return cc.GFXShader;
},

/**
 * @method createInputAssembler
 * @param {cc.GFXInputAssemblerInfo} arg0
 * @return {cc.GFXInputAssembler}
 */
createInputAssembler : function (
gfxinputassemblerinfo 
)
{
    return cc.GFXInputAssembler;
},

/**
 * @method createSampler
 * @param {cc.GFXSamplerInfo} arg0
 * @return {cc.GFXSampler}
 */
createSampler : function (
gfxsamplerinfo 
)
{
    return cc.GFXSampler;
},

/**
 * @method useVAO
 * @return {bool}
 */
useVAO : function (
)
{
    return false;
},

/**
 * @method createBuffer
 * @param {cc.GFXBufferInfo} arg0
 * @return {cc.GFXBuffer}
 */
createBuffer : function (
gfxbufferinfo 
)
{
    return cc.GFXBuffer;
},

/**
 * @method initialize
 * @param {cc.GFXDeviceInfo} arg0
 * @return {bool}
 */
initialize : function (
gfxdeviceinfo 
)
{
    return false;
},

/**
 * @method resize
 * @param {unsigned int} arg0
 * @param {unsigned int} arg1
 */
resize : function (
int, 
int 
)
{
},

/**
 * @method createQueue
 * @param {cc.GFXQueueInfo} arg0
 * @return {cc.GFXQueue}
 */
createQueue : function (
gfxqueueinfo 
)
{
    return cc.GFXQueue;
},

/**
 * @method checkExtension
 * @param {String} arg0
 * @return {bool}
 */
checkExtension : function (
str 
)
{
    return false;
},

/**
 * @method createBindingLayout
 * @param {cc.GFXBindingLayoutInfo} arg0
 * @return {cc.GFXBindingLayout}
 */
createBindingLayout : function (
gfxbindinglayoutinfo 
)
{
    return cc.GFXBindingLayout;
},

/**
 * @method createTextureView
 * @param {cc.GFXTextureViewInfo} arg0
 * @return {cc.GFXTextureView}
 */
createTextureView : function (
gfxtextureviewinfo 
)
{
    return cc.GFXTextureView;
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
