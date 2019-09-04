/**
 * @module gfx
 */
var gfx = gfx || {};

/**
 * @class GraphicsHandle
 */
gfx.GraphicsHandle = {

/**
 * @method getHandle
 * @return {unsigned int}
 */
getHandle : function (
)
{
    return 0;
},

/**
 * @method GraphicsHandle
 * @constructor
 */
GraphicsHandle : function (
)
{
},

};

/**
 * @class IndexBuffer
 */
gfx.IndexBuffer = {

/**
 * @method setBytes
 * @param {unsigned int} arg0
 */
setBytes : function (
int 
)
{
},

/**
 * @method getUsage
 * @return {cc.renderer::Usage}
 */
getUsage : function (
)
{
    return 0;
},

/**
 * @method setFormat
 * @param {cc.renderer::IndexFormat} arg0
 */
setFormat : function (
indexformat 
)
{
},

/**
 * @method setCount
 * @param {unsigned int} arg0
 */
setCount : function (
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
 * @method setUsage
 * @param {cc.renderer::Usage} arg0
 */
setUsage : function (
usage 
)
{
},

/**
 * @method getCount
 * @return {unsigned int}
 */
getCount : function (
)
{
    return 0;
},

/**
 * @method setBytesPerIndex
 * @param {unsigned int} arg0
 */
setBytesPerIndex : function (
int 
)
{
},

/**
 * @method getBytes
 * @return {unsigned int}
 */
getBytes : function (
)
{
    return 0;
},

/**
 * @method IndexBuffer
 * @constructor
 */
IndexBuffer : function (
)
{
},

};

/**
 * @class VertexBuffer
 */
gfx.VertexBuffer = {

/**
 * @method setBytes
 * @param {unsigned int} arg0
 */
setBytes : function (
int 
)
{
},

/**
 * @method getUsage
 * @return {cc.renderer::Usage}
 */
getUsage : function (
)
{
    return 0;
},

/**
 * @method setCount
 * @param {unsigned int} arg0
 */
setCount : function (
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
 * @method setUsage
 * @param {cc.renderer::Usage} arg0
 */
setUsage : function (
usage 
)
{
},

/**
 * @method getCount
 * @return {unsigned int}
 */
getCount : function (
)
{
    return 0;
},

/**
 * @method getBytes
 * @return {unsigned int}
 */
getBytes : function (
)
{
    return 0;
},

/**
 * @method VertexBuffer
 * @constructor
 */
VertexBuffer : function (
)
{
},

};

/**
 * @class DeviceGraphics
 */
gfx.Device = {

/**
 * @method setBlendFuncSeparate
 * @param {cc.renderer::BlendFactor} arg0
 * @param {cc.renderer::BlendFactor} arg1
 * @param {cc.renderer::BlendFactor} arg2
 * @param {cc.renderer::BlendFactor} arg3
 */
setBlendFuncSeparate : function (
blendfactor, 
blendfactor, 
blendfactor, 
blendfactor 
)
{
},

/**
 * @method enableBlend
 */
enableBlend : function (
)
{
},

/**
 * @method setPrimitiveType
 * @param {cc.renderer::PrimitiveType} arg0
 */
setPrimitiveType : function (
primitivetype 
)
{
},

/**
 * @method setBlendEquationSeparate
 * @param {cc.renderer::BlendOp} arg0
 * @param {cc.renderer::BlendOp} arg1
 */
setBlendEquationSeparate : function (
blendop, 
blendop 
)
{
},

/**
 * @method setIndexBuffer
 * @param {cc.renderer::IndexBuffer} arg0
 */
setIndexBuffer : function (
indexbuffer 
)
{
},

/**
 * @method setProgram
 * @param {cc.renderer::Program} arg0
 */
setProgram : function (
program 
)
{
},

/**
 * @method setFrameBuffer
 * @param {cc.renderer::FrameBuffer} arg0
 */
setFrameBuffer : function (
framebuffer 
)
{
},

/**
 * @method setStencilFunc
 * @param {cc.renderer::ComparisonFunc} arg0
 * @param {int} arg1
 * @param {unsigned int} arg2
 */
setStencilFunc : function (
comparisonfunc, 
int, 
int 
)
{
},

/**
 * @method setBlendColor
* @param {unsigned char|unsigned int} char
* @param {unsigned char} char
* @param {unsigned char} char
* @param {unsigned char} char
*/
setBlendColor : function(
char,
char,
char,
char 
)
{
},

/**
 * @method setScissor
 * @param {int} arg0
 * @param {int} arg1
 * @param {int} arg2
 * @param {int} arg3
 */
setScissor : function (
int, 
int, 
int, 
int 
)
{
},

/**
 * @method setVertexBuffer
 * @param {int} arg0
 * @param {cc.renderer::VertexBuffer} arg1
 * @param {int} arg2
 */
setVertexBuffer : function (
int, 
vertexbuffer, 
int 
)
{
},

/**
 * @method enableDepthWrite
 */
enableDepthWrite : function (
)
{
},

/**
 * @method getCapacity
 * @return {cc.renderer::DeviceGraphics::Capacity}
 */
getCapacity : function (
)
{
    return cc.renderer::DeviceGraphics::Capacity;
},

/**
 * @method setStencilOpBack
 * @param {cc.renderer::StencilOp} arg0
 * @param {cc.renderer::StencilOp} arg1
 * @param {cc.renderer::StencilOp} arg2
 * @param {unsigned int} arg3
 */
setStencilOpBack : function (
stencilop, 
stencilop, 
stencilop, 
int 
)
{
},

/**
 * @method setViewport
 * @param {int} arg0
 * @param {int} arg1
 * @param {int} arg2
 * @param {int} arg3
 */
setViewport : function (
int, 
int, 
int, 
int 
)
{
},

/**
 * @method draw
 * @param {unsigned int} arg0
 * @param {int} arg1
 */
draw : function (
int, 
int 
)
{
},

/**
 * @method setDepthFunc
 * @param {cc.renderer::ComparisonFunc} arg0
 */
setDepthFunc : function (
comparisonfunc 
)
{
},

/**
 * @method enableDepthTest
 */
enableDepthTest : function (
)
{
},

/**
 * @method resetDrawCalls
 */
resetDrawCalls : function (
)
{
},

/**
 * @method getDrawCalls
 * @return {unsigned int}
 */
getDrawCalls : function (
)
{
    return 0;
},

/**
 * @method setBlendEquation
 * @param {cc.renderer::BlendOp} arg0
 */
setBlendEquation : function (
blendop 
)
{
},

/**
 * @method setStencilFuncFront
 * @param {cc.renderer::ComparisonFunc} arg0
 * @param {int} arg1
 * @param {unsigned int} arg2
 */
setStencilFuncFront : function (
comparisonfunc, 
int, 
int 
)
{
},

/**
 * @method setStencilOpFront
 * @param {cc.renderer::StencilOp} arg0
 * @param {cc.renderer::StencilOp} arg1
 * @param {cc.renderer::StencilOp} arg2
 * @param {unsigned int} arg3
 */
setStencilOpFront : function (
stencilop, 
stencilop, 
stencilop, 
int 
)
{
},

/**
 * @method setStencilFuncBack
 * @param {cc.renderer::ComparisonFunc} arg0
 * @param {int} arg1
 * @param {unsigned int} arg2
 */
setStencilFuncBack : function (
comparisonfunc, 
int, 
int 
)
{
},

/**
 * @method setBlendFunc
 * @param {cc.renderer::BlendFactor} arg0
 * @param {cc.renderer::BlendFactor} arg1
 */
setBlendFunc : function (
blendfactor, 
blendfactor 
)
{
},

/**
 * @method setCullMode
 * @param {cc.renderer::CullMode} arg0
 */
setCullMode : function (
cullmode 
)
{
},

/**
 * @method ext
 * @param {String} arg0
 * @return {bool}
 */
ext : function (
str 
)
{
    return false;
},

/**
 * @method setStencilOp
 * @param {cc.renderer::StencilOp} arg0
 * @param {cc.renderer::StencilOp} arg1
 * @param {cc.renderer::StencilOp} arg2
 * @param {unsigned int} arg3
 */
setStencilOp : function (
stencilop, 
stencilop, 
stencilop, 
int 
)
{
},

/**
 * @method enableStencilTest
 */
enableStencilTest : function (
)
{
},

/**
 * @method getInstance
 * @return {cc.renderer::DeviceGraphics}
 */
getInstance : function (
)
{
    return cc.renderer::DeviceGraphics;
},

};

/**
 * @class FrameBuffer
 */
gfx.FrameBuffer = {

/**
 * @method getHeight
 * @return {int}
 */
getHeight : function (
)
{
    return 0;
},

/**
 * @method getWidth
 * @return {int}
 */
getWidth : function (
)
{
    return 0;
},

/**
 * @method destroy
 */
destroy : function (
)
{
},

/**
 * @method FrameBuffer
 * @constructor
 */
FrameBuffer : function (
)
{
},

};

/**
 * @class RenderTarget
 */
gfx.RenderTarget = {

};

/**
 * @class RenderBuffer
 */
gfx.RenderBuffer = {

/**
 * @method init
 * @param {cc.renderer::DeviceGraphics} arg0
 * @param {cc.renderer::RenderBuffer::Format} arg1
 * @param {unsigned short} arg2
 * @param {unsigned short} arg3
 * @return {bool}
 */
init : function (
devicegraphics, 
format, 
short, 
short 
)
{
    return false;
},

/**
 * @method create
 * @param {cc.renderer::DeviceGraphics} arg0
 * @param {cc.renderer::RenderBuffer::Format} arg1
 * @param {unsigned short} arg2
 * @param {unsigned short} arg3
 * @return {cc.renderer::RenderBuffer}
 */
create : function (
devicegraphics, 
format, 
short, 
short 
)
{
    return cc.renderer::RenderBuffer;
},

/**
 * @method RenderBuffer
 * @constructor
 */
RenderBuffer : function (
)
{
},

};

/**
 * @class Texture
 */
gfx.Texture = {

/**
 * @method getWidth
 * @return {unsigned short}
 */
getWidth : function (
)
{
    return 0;
},

/**
 * @method getHeight
 * @return {unsigned short}
 */
getHeight : function (
)
{
    return 0;
},

/**
 * @method getTarget
 * @return {unsigned int}
 */
getTarget : function (
)
{
    return 0;
},

};

/**
 * @class Texture2D
 */
gfx.Texture2D = {

/**
 * @method updateImage
 * @param {cc.renderer::Texture::ImageOption} arg0
 */
updateImage : function (
imageoption 
)
{
},

/**
 * @method init
 * @param {cc.renderer::DeviceGraphics} arg0
 * @param {cc.renderer::Texture::Options} arg1
 * @return {bool}
 */
init : function (
devicegraphics, 
options 
)
{
    return false;
},

/**
 * @method updateSubImage
 * @param {cc.renderer::Texture::SubImageOption} arg0
 */
updateSubImage : function (
subimageoption 
)
{
},

/**
 * @method update
 * @param {cc.renderer::Texture::Options} arg0
 */
update : function (
options 
)
{
},

/**
 * @method Texture2D
 * @constructor
 */
Texture2D : function (
)
{
},

};

/**
 * @class Program
 */
gfx.Program = {

/**
 * @method getID
 * @return {unsigned int}
 */
getID : function (
)
{
    return 0;
},

/**
 * @method init
 * @param {cc.renderer::DeviceGraphics} arg0
 * @param {char} arg1
 * @param {char} arg2
 * @return {bool}
 */
init : function (
devicegraphics, 
char, 
char 
)
{
    return false;
},

/**
 * @method link
 */
link : function (
)
{
},

/**
 * @method Program
 * @constructor
 */
Program : function (
)
{
},

};
