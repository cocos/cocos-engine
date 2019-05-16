/**
 * @module renderer
 */
var renderer = renderer || {};

/**
 * @class ProgramLib
 */
renderer.ProgramLib = {

/**
 * @method getProgram
 * @param {String} arg0
 * @param {map_object} arg1
 * @param {int} arg2
 * @return {cc.renderer::Program}
 */
getProgram : function (
str, 
map, 
int 
)
{
    return cc.renderer::Program;
},

/**
 * @method define
 * @param {String} arg0
 * @param {String} arg1
 * @param {String} arg2
 * @param {Array} arg3
 */
define : function (
str, 
str, 
str, 
array 
)
{
},

/**
 * @method getKey
 * @param {String} arg0
 * @param {int} arg1
 * @return {unsigned int}
 */
getKey : function (
str, 
int 
)
{
    return 0;
},

/**
 * @method ProgramLib
 * @constructor
 * @param {cc.renderer::DeviceGraphics} arg0
 * @param {Array} arg1
 */
ProgramLib : function (
devicegraphics, 
array 
)
{
},

};

/**
 * @class BaseRenderer
 */
renderer.Base = {

/**
 * @method getProgramLib
 * @return {cc.renderer::ProgramLib}
 */
getProgramLib : function (
)
{
    return cc.renderer::ProgramLib;
},

/**
 * @method init
* @param {cc.renderer::DeviceGraphics|cc.renderer::DeviceGraphics} devicegraphics
* @param {Array|Array} array
* @param {cc.renderer::Texture2D} texture2d
* @return {bool|bool}
*/
init : function(
devicegraphics,
array,
texture2d 
)
{
    return false;
},

/**
 * @method BaseRenderer
 * @constructor
 */
BaseRenderer : function (
)
{
},

};

/**
 * @class View
 */
renderer.View = {

/**
 * @method View
 * @constructor
 */
View : function (
)
{
},

};

/**
 * @class NodeProxy
 */
renderer.NodeProxy = {

/**
 * @method addChild
 * @param {cc.renderer::NodeProxy} arg0
 */
addChild : function (
nodeproxy 
)
{
},

/**
 * @method removeAllChildren
 */
removeAllChildren : function (
)
{
},

/**
 * @method addHandle
 * @param {String} arg0
 * @param {cc.renderer::SystemHandle} arg1
 */
addHandle : function (
str, 
systemhandle 
)
{
},

/**
 * @method getChildren
 * @return {Array}
 */
getChildren : function (
)
{
    return new Array();
},

/**
 * @method removeHandle
 * @param {String} arg0
 */
removeHandle : function (
str 
)
{
},

/**
 * @method setCullingMask
 * @param {int} arg0
 */
setCullingMask : function (
int 
)
{
},

/**
 * @method setChildrenOrderDirty
 */
setChildrenOrderDirty : function (
)
{
},

/**
 * @method setParent
 * @param {cc.renderer::NodeProxy} arg0
 */
setParent : function (
nodeproxy 
)
{
},

/**
 * @method getName
 * @return {String}
 */
getName : function (
)
{
    return ;
},

/**
 * @method setOpacity
 * @param {unsigned char} arg0
 */
setOpacity : function (
char 
)
{
},

/**
 * @method getRealOpacity
 * @return {unsigned char}
 */
getRealOpacity : function (
)
{
    return 0;
},

/**
 * @method getOpacity
 * @return {unsigned char}
 */
getOpacity : function (
)
{
    return 0;
},

/**
 * @method setName
 * @param {String} arg0
 */
setName : function (
str 
)
{
},

/**
 * @method updateRealOpacity
 */
updateRealOpacity : function (
)
{
},

/**
 * @method getCullingMask
 * @return {int}
 */
getCullingMask : function (
)
{
    return 0;
},

/**
 * @method reset
 */
reset : function (
)
{
},

/**
 * @method getParent
 * @return {cc.renderer::NodeProxy}
 */
getParent : function (
)
{
    return cc.renderer::NodeProxy;
},

/**
 * @method removeChild
 * @param {cc.renderer::NodeProxy} arg0
 */
removeChild : function (
nodeproxy 
)
{
},

/**
 * @method set3DNode
 * @param {bool} arg0
 */
set3DNode : function (
bool 
)
{
},

/**
 * @method setLocalZOrder
 * @param {int} arg0
 */
setLocalZOrder : function (
int 
)
{
},

/**
 * @method getChildrenCount
 * @return {unsigned int}
 */
getChildrenCount : function (
)
{
    return 0;
},

/**
 * @method getHandle
 * @param {String} arg0
 * @return {cc.renderer::SystemHandle}
 */
getHandle : function (
str 
)
{
    return cc.renderer::SystemHandle;
},

/**
 * @method NodeProxy
 * @constructor
 */
NodeProxy : function (
)
{
},

};

/**
 * @class Camera
 */
renderer.Camera = {

/**
 * @method getDepth
 * @return {float}
 */
getDepth : function (
)
{
    return 0;
},

/**
 * @method setFov
 * @param {float} arg0
 */
setFov : function (
float 
)
{
},

/**
 * @method getFrameBuffer
 * @return {cc.renderer::FrameBuffer}
 */
getFrameBuffer : function (
)
{
    return cc.renderer::FrameBuffer;
},

/**
 * @method setStencil
 * @param {int} arg0
 */
setStencil : function (
int 
)
{
},

/**
 * @method setPriority
 * @param {int} arg0
 */
setPriority : function (
int 
)
{
},

/**
 * @method getOrthoHeight
 * @return {float}
 */
getOrthoHeight : function (
)
{
    return 0;
},

/**
 * @method setCullingMask
 * @param {int} arg0
 */
setCullingMask : function (
int 
)
{
},

/**
 * @method getStencil
 * @return {int}
 */
getStencil : function (
)
{
    return 0;
},

/**
 * @method setType
 * @param {cc.renderer::ProjectionType} arg0
 */
setType : function (
projectiontype 
)
{
},

/**
 * @method getPriority
 * @return {int}
 */
getPriority : function (
)
{
    return 0;
},

/**
 * @method setFar
 * @param {float} arg0
 */
setFar : function (
float 
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
 * @method setRect
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 */
setRect : function (
float, 
float, 
float, 
float 
)
{
},

/**
 * @method setClearFlags
 * @param {unsigned char} arg0
 */
setClearFlags : function (
char 
)
{
},

/**
 * @method getFar
 * @return {float}
 */
getFar : function (
)
{
    return 0;
},

/**
 * @method getType
 * @return {cc.renderer::ProjectionType}
 */
getType : function (
)
{
    return 0;
},

/**
 * @method getCullingMask
 * @return {int}
 */
getCullingMask : function (
)
{
    return 0;
},

/**
 * @method setNear
 * @param {float} arg0
 */
setNear : function (
float 
)
{
},

/**
 * @method setStages
 * @param {Array} arg0
 */
setStages : function (
array 
)
{
},

/**
 * @method setOrthoHeight
 * @param {float} arg0
 */
setOrthoHeight : function (
float 
)
{
},

/**
 * @method setDepth
 * @param {float} arg0
 */
setDepth : function (
float 
)
{
},

/**
 * @method getStages
 * @return {Array}
 */
getStages : function (
)
{
    return new Array();
},

/**
 * @method getFov
 * @return {float}
 */
getFov : function (
)
{
    return 0;
},

/**
 * @method setColor
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 */
setColor : function (
float, 
float, 
float, 
float 
)
{
},

/**
 * @method setWorldMatrix
 * @param {mat4_object} arg0
 */
setWorldMatrix : function (
mat4 
)
{
},

/**
 * @method getNear
 * @return {float}
 */
getNear : function (
)
{
    return 0;
},

/**
 * @method getClearFlags
 * @return {unsigned char}
 */
getClearFlags : function (
)
{
    return 0;
},

/**
 * @method Camera
 * @constructor
 */
Camera : function (
)
{
},

};

/**
 * @class ForwardRenderer
 */
renderer.ForwardRenderer = {

/**
 * @method renderCamera
 * @param {cc.renderer::Camera} arg0
 * @param {cc.renderer::Scene} arg1
 */
renderCamera : function (
camera, 
scene 
)
{
},

/**
 * @method init
 * @param {cc.renderer::DeviceGraphics} arg0
 * @param {Array} arg1
 * @param {cc.renderer::Texture2D} arg2
 * @param {int} arg3
 * @param {int} arg4
 * @return {bool}
 */
init : function (
devicegraphics, 
array, 
texture2d, 
int, 
int 
)
{
    return false;
},

/**
 * @method render
 * @param {cc.renderer::Scene} arg0
 */
render : function (
scene 
)
{
},

/**
 * @method ForwardRenderer
 * @constructor
 */
ForwardRenderer : function (
)
{
},

};

/**
 * @class Effect
 */
renderer.EffectNative = {

/**
 * @method getProperty
 * @param {String} arg0
 * @return {cc.renderer::Technique::Parameter}
 */
getProperty : function (
str 
)
{
    return cc.renderer::Technique::Parameter;
},

/**
 * @method getTechnique
 * @param {String} arg0
 * @return {cc.renderer::Technique}
 */
getTechnique : function (
str 
)
{
    return cc.renderer::Technique;
},

/**
 * @method getDefine
 * @param {String} arg0
 * @return {cc.Value}
 */
getDefine : function (
str 
)
{
    return cc.Value;
},

/**
 * @method getHash
 * @return {double}
 */
getHash : function (
)
{
    return 0;
},

/**
 * @method updateHash
 * @param {double} arg0
 */
updateHash : function (
double 
)
{
},

/**
 * @method clear
 */
clear : function (
)
{
},

/**
 * @method define
 * @param {String} arg0
 * @param {cc.Value} arg1
 */
define : function (
str, 
value 
)
{
},

/**
 * @method Effect
 * @constructor
 */
Effect : function (
)
{
},

};

/**
 * @class Light
 */
renderer.Light = {

/**
 * @method getShadowScale
 * @return {float}
 */
getShadowScale : function (
)
{
    return 0;
},

/**
 * @method getRange
 * @return {float}
 */
getRange : function (
)
{
    return 0;
},

/**
 * @method setShadowResolution
 * @param {unsigned int} arg0
 */
setShadowResolution : function (
int 
)
{
},

/**
 * @method getFrustumEdgeFalloff
 * @return {unsigned int}
 */
getFrustumEdgeFalloff : function (
)
{
    return 0;
},

/**
 * @method setSpotExp
 * @param {float} arg0
 */
setSpotExp : function (
float 
)
{
},

/**
 * @method setShadowType
 * @param {cc.renderer::Light::ShadowType} arg0
 */
setShadowType : function (
shadowtype 
)
{
},

/**
 * @method setType
 * @param {cc.renderer::Light::LightType} arg0
 */
setType : function (
lighttype 
)
{
},

/**
 * @method getViewProjMatrix
 * @return {mat4_object}
 */
getViewProjMatrix : function (
)
{
    return cc.Mat4;
},

/**
 * @method getShadowBias
 * @return {float}
 */
getShadowBias : function (
)
{
    return 0;
},

/**
 * @method getShadowDarkness
 * @return {unsigned int}
 */
getShadowDarkness : function (
)
{
    return 0;
},

/**
 * @method getSpotAngle
 * @return {float}
 */
getSpotAngle : function (
)
{
    return 0;
},

/**
 * @method getSpotExp
 * @return {float}
 */
getSpotExp : function (
)
{
    return 0;
},

/**
 * @method getViewPorjMatrix
 * @return {mat4_object}
 */
getViewPorjMatrix : function (
)
{
    return cc.Mat4;
},

/**
 * @method getType
 * @return {cc.renderer::Light::LightType}
 */
getType : function (
)
{
    return 0;
},

/**
 * @method getIntensity
 * @return {float}
 */
getIntensity : function (
)
{
    return 0;
},

/**
 * @method getShadowMaxDepth
 * @return {float}
 */
getShadowMaxDepth : function (
)
{
    return 0;
},

/**
 * @method getWorldMatrix
 * @return {mat4_object}
 */
getWorldMatrix : function (
)
{
    return cc.Mat4;
},

/**
 * @method getShadowMap
 * @return {cc.renderer::Texture2D}
 */
getShadowMap : function (
)
{
    return cc.renderer::Texture2D;
},

/**
 * @method getColor
 * @return {cc.Color3F}
 */
getColor : function (
)
{
    return cc.Color3F;
},

/**
 * @method setIntensity
 * @param {float} arg0
 */
setIntensity : function (
float 
)
{
},

/**
 * @method getShadowMinDepth
 * @return {float}
 */
getShadowMinDepth : function (
)
{
    return 0;
},

/**
 * @method setShadowMinDepth
 * @param {float} arg0
 */
setShadowMinDepth : function (
float 
)
{
},

/**
 * @method update
 * @param {cc.renderer::DeviceGraphics} arg0
 */
update : function (
devicegraphics 
)
{
},

/**
 * @method setShadowDarkness
 * @param {unsigned int} arg0
 */
setShadowDarkness : function (
int 
)
{
},

/**
 * @method setWorldMatrix
 * @param {mat4_object} arg0
 */
setWorldMatrix : function (
mat4 
)
{
},

/**
 * @method setSpotAngle
 * @param {float} arg0
 */
setSpotAngle : function (
float 
)
{
},

/**
 * @method setRange
 * @param {float} arg0
 */
setRange : function (
float 
)
{
},

/**
 * @method setShadowScale
 * @param {float} arg0
 */
setShadowScale : function (
float 
)
{
},

/**
 * @method setColor
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 */
setColor : function (
float, 
float, 
float 
)
{
},

/**
 * @method setShadowMaxDepth
 * @param {float} arg0
 */
setShadowMaxDepth : function (
float 
)
{
},

/**
 * @method setFrustumEdgeFalloff
 * @param {unsigned int} arg0
 */
setFrustumEdgeFalloff : function (
int 
)
{
},

/**
 * @method getShadowType
 * @return {cc.renderer::Light::ShadowType}
 */
getShadowType : function (
)
{
    return 0;
},

/**
 * @method getShadowResolution
 * @return {unsigned int}
 */
getShadowResolution : function (
)
{
    return 0;
},

/**
 * @method setShadowBias
 * @param {float} arg0
 */
setShadowBias : function (
float 
)
{
},

/**
 * @method Light
 * @constructor
 */
Light : function (
)
{
},

};

/**
 * @class Pass
 */
renderer.PassNative = {

/**
 * @method getStencilTest
 * @return {bool}
 */
getStencilTest : function (
)
{
    return false;
},

/**
 * @method setStencilBack
 */
setStencilBack : function (
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
 * @method setBlend
 */
setBlend : function (
)
{
},

/**
 * @method setProgramName
 * @param {String} arg0
 */
setProgramName : function (
str 
)
{
},

/**
 * @method disableStencilTest
 */
disableStencilTest : function (
)
{
},

/**
 * @method setStencilFront
 */
setStencilFront : function (
)
{
},

/**
 * @method setDepth
 */
setDepth : function (
)
{
},

/**
 * @method Pass
 * @constructor
* @param {String} str
*/
Pass : function(
str 
)
{
},

};

/**
 * @class Scene
 */
renderer.Scene = {

/**
 * @method reset
 */
reset : function (
)
{
},

/**
 * @method getCameraCount
 * @return {unsigned int}
 */
getCameraCount : function (
)
{
    return 0;
},

/**
 * @method addCamera
 * @param {cc.renderer::Camera} arg0
 */
addCamera : function (
camera 
)
{
},

/**
 * @method removeCamera
 * @param {cc.renderer::Camera} arg0
 */
removeCamera : function (
camera 
)
{
},

/**
 * @method getLightCount
 * @return {unsigned int}
 */
getLightCount : function (
)
{
    return 0;
},

/**
 * @method getCamera
 * @param {unsigned int} arg0
 * @return {cc.renderer::Camera}
 */
getCamera : function (
int 
)
{
    return cc.renderer::Camera;
},

/**
 * @method getLight
 * @param {unsigned int} arg0
 * @return {cc.renderer::Light}
 */
getLight : function (
int 
)
{
    return cc.renderer::Light;
},

/**
 * @method getCameras
 * @return {Array}
 */
getCameras : function (
)
{
    return new Array();
},

/**
 * @method sortCameras
 */
sortCameras : function (
)
{
},

/**
 * @method addView
 * @param {cc.renderer::View} arg0
 */
addView : function (
view 
)
{
},

/**
 * @method setDebugCamera
 * @param {cc.renderer::Camera} arg0
 */
setDebugCamera : function (
camera 
)
{
},

/**
 * @method removeView
 * @param {cc.renderer::View} arg0
 */
removeView : function (
view 
)
{
},

/**
 * @method addLight
 * @param {cc.renderer::Light} arg0
 */
addLight : function (
light 
)
{
},

/**
 * @method removeLight
 * @param {cc.renderer::Light} arg0
 */
removeLight : function (
light 
)
{
},

/**
 * @method Scene
 * @constructor
 */
Scene : function (
)
{
},

};

/**
 * @class MeshBuffer
 */
renderer.MeshBuffer = {

/**
 * @method reset
 */
reset : function (
)
{
},

/**
 * @method getVertexOffset
 * @return {unsigned int}
 */
getVertexOffset : function (
)
{
    return 0;
},

/**
 * @method getIndexBuffer
 * @return {cc.renderer::IndexBuffer}
 */
getIndexBuffer : function (
)
{
    return cc.renderer::IndexBuffer;
},

/**
 * @method updateOffset
 */
updateOffset : function (
)
{
},

/**
 * @method getIndexStart
 * @return {unsigned int}
 */
getIndexStart : function (
)
{
    return 0;
},

/**
 * @method getIndexOffset
 * @return {unsigned int}
 */
getIndexOffset : function (
)
{
    return 0;
},

/**
 * @method request
 * @param {unsigned int} arg0
 * @param {unsigned int} arg1
 * @param {cc.renderer::MeshBuffer::OffsetInfo} arg2
 * @return {bool}
 */
request : function (
int, 
int, 
offsetinfo 
)
{
    return false;
},

/**
 * @method requestStatic
 * @param {unsigned int} arg0
 * @param {unsigned int} arg1
 * @param {cc.renderer::MeshBuffer::OffsetInfo} arg2
 * @return {bool}
 */
requestStatic : function (
int, 
int, 
offsetinfo 
)
{
    return false;
},

/**
 * @method uploadData
 */
uploadData : function (
)
{
},

/**
 * @method getVertexBuffer
 * @return {cc.renderer::VertexBuffer}
 */
getVertexBuffer : function (
)
{
    return cc.renderer::VertexBuffer;
},

/**
 * @method getByteOffset
 * @return {unsigned int}
 */
getByteOffset : function (
)
{
    return 0;
},

/**
 * @method getVertexStart
 * @return {unsigned int}
 */
getVertexStart : function (
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
 * @method MeshBuffer
 * @constructor
 * @param {cc.renderer::ModelBatcher} arg0
 * @param {cc.renderer::VertexFormat} arg1
 */
MeshBuffer : function (
modelbatcher, 
vertexformat 
)
{
},

};

/**
 * @class RenderHandle
 */
renderer.RenderHandle = {

/**
 * @method setMeshCount
 * @param {unsigned int} arg0
 */
setMeshCount : function (
int 
)
{
},

/**
 * @method setVertexFormat
 * @param {cc.renderer::VertexFormat} arg0
 */
setVertexFormat : function (
vertexformat 
)
{
},

/**
 * @method updateOpacity
 * @param {int} arg0
 * @param {unsigned char} arg1
 */
updateOpacity : function (
int, 
char 
)
{
},

/**
 * @method handle
 * @param {cc.renderer::NodeProxy} arg0
 * @param {cc.renderer::ModelBatcher} arg1
 * @param {cc.renderer::Scene} arg2
 */
handle : function (
nodeproxy, 
modelbatcher, 
scene 
)
{
},

/**
 * @method postHandle
 * @param {cc.renderer::NodeProxy} arg0
 * @param {cc.renderer::ModelBatcher} arg1
 * @param {cc.renderer::Scene} arg2
 */
postHandle : function (
nodeproxy, 
modelbatcher, 
scene 
)
{
},

/**
 * @method getUseModel
 * @return {bool}
 */
getUseModel : function (
)
{
    return false;
},

/**
 * @method setUseModel
 * @param {bool} arg0
 */
setUseModel : function (
bool 
)
{
},

/**
 * @method enabled
 * @return {bool}
 */
enabled : function (
)
{
    return false;
},

/**
 * @method disable
 */
disable : function (
)
{
},

/**
 * @method fillBuffers
 * @param {cc.renderer::MeshBuffer} arg0
 * @param {int} arg1
 * @param {mat4_object} arg2
 */
fillBuffers : function (
meshbuffer, 
int, 
mat4 
)
{
},

/**
 * @method enable
 */
enable : function (
)
{
},

/**
 * @method getMeshCount
 * @return {unsigned int}
 */
getMeshCount : function (
)
{
    return 0;
},

/**
 * @method getVertexFormat
 * @return {cc.renderer::VertexFormat}
 */
getVertexFormat : function (
)
{
    return cc.renderer::VertexFormat;
},

/**
 * @method getEffect
 * @param {unsigned int} arg0
 * @return {cc.renderer::Effect}
 */
getEffect : function (
int 
)
{
    return cc.renderer::Effect;
},

/**
 * @method RenderHandle
 * @constructor
 */
RenderHandle : function (
)
{
},

};

/**
 * @class CustomRenderHandle
 */
renderer.CustomRenderHandle = {

/**
 * @method reset
 */
reset : function (
)
{
},

/**
 * @method getIACount
 * @return {unsigned int}
 */
getIACount : function (
)
{
    return 0;
},

/**
 * @method getEffectCount
 * @return {unsigned int}
 */
getEffectCount : function (
)
{
    return 0;
},

/**
 * @method adjustIA
 * @param {unsigned int} arg0
 * @return {cc.renderer::InputAssembler}
 */
adjustIA : function (
int 
)
{
    return cc.renderer::InputAssembler;
},

/**
 * @method clearNativeEffect
 */
clearNativeEffect : function (
)
{
},

/**
 * @method postHandle
 * @param {cc.renderer::NodeProxy} arg0
 * @param {cc.renderer::ModelBatcher} arg1
 * @param {cc.renderer::Scene} arg2
 */
postHandle : function (
nodeproxy, 
modelbatcher, 
scene 
)
{
},

/**
 * @method getUseModel
 * @return {bool}
 */
getUseModel : function (
)
{
    return false;
},

/**
 * @method setUseModel
 * @param {bool} arg0
 */
setUseModel : function (
bool 
)
{
},

/**
 * @method disable
 */
disable : function (
)
{
},

/**
 * @method renderIA
 * @param {unsigned int} arg0
 * @param {cc.renderer::ModelBatcher} arg1
 * @param {cc.renderer::NodeProxy} arg2
 */
renderIA : function (
int, 
modelbatcher, 
nodeproxy 
)
{
},

/**
 * @method enable
 */
enable : function (
)
{
},

/**
 * @method handle
 * @param {cc.renderer::NodeProxy} arg0
 * @param {cc.renderer::ModelBatcher} arg1
 * @param {cc.renderer::Scene} arg2
 */
handle : function (
nodeproxy, 
modelbatcher, 
scene 
)
{
},

/**
 * @method updateNativeEffect
 * @param {unsigned int} arg0
 * @param {cc.renderer::Effect} arg1
 */
updateNativeEffect : function (
int, 
effect 
)
{
},

/**
 * @method getEffect
 * @param {unsigned int} arg0
 * @return {cc.renderer::Effect}
 */
getEffect : function (
int 
)
{
    return cc.renderer::Effect;
},

/**
 * @method CustomRenderHandle
 * @constructor
 */
CustomRenderHandle : function (
)
{
},

};

/**
 * @class ModelBatcher
 */
renderer.ModelBatcher = {

/**
 * @method reset
 */
reset : function (
)
{
},

/**
 * @method getBuffer
 * @param {cc.renderer::VertexFormat} arg0
 * @return {cc.renderer::MeshBuffer}
 */
getBuffer : function (
vertexformat 
)
{
    return cc.renderer::MeshBuffer;
},

/**
 * @method startBatch
 */
startBatch : function (
)
{
},

/**
 * @method setCurrentBuffer
 * @param {cc.renderer::MeshBuffer} arg0
 */
setCurrentBuffer : function (
meshbuffer 
)
{
},

/**
 * @method getFlow
 * @return {cc.renderer::RenderFlow}
 */
getFlow : function (
)
{
    return cc.renderer::RenderFlow;
},

/**
 * @method commitIA
 * @param {cc.renderer::NodeProxy} arg0
 * @param {cc.renderer::CustomRenderHandle} arg1
 */
commitIA : function (
nodeproxy, 
customrenderhandle 
)
{
},

/**
 * @method getCurrentBuffer
 * @return {cc.renderer::MeshBuffer}
 */
getCurrentBuffer : function (
)
{
    return cc.renderer::MeshBuffer;
},

/**
 * @method flush
 */
flush : function (
)
{
},

/**
 * @method commit
 * @param {cc.renderer::NodeProxy} arg0
 * @param {cc.renderer::RenderHandle} arg1
 */
commit : function (
nodeproxy, 
renderhandle 
)
{
},

/**
 * @method flushIA
 * @param {cc.renderer::InputAssembler} arg0
 */
flushIA : function (
inputassembler 
)
{
},

/**
 * @method terminateBatch
 */
terminateBatch : function (
)
{
},

/**
 * @method ModelBatcher
 * @constructor
 * @param {cc.renderer::RenderFlow} arg0
 */
ModelBatcher : function (
renderflow 
)
{
},

};

/**
 * @class RenderFlow
 */
renderer.RenderFlow = {

/**
 * @method getRenderScene
 * @return {cc.renderer::Scene}
 */
getRenderScene : function (
)
{
    return cc.renderer::Scene;
},

/**
 * @method getModelBatcher
 * @return {cc.renderer::ModelBatcher}
 */
getModelBatcher : function (
)
{
    return cc.renderer::ModelBatcher;
},

/**
 * @method getDevice
 * @return {cc.renderer::DeviceGraphics}
 */
getDevice : function (
)
{
    return cc.renderer::DeviceGraphics;
},

/**
 * @method render
 * @param {cc.renderer::NodeProxy} arg0
 */
render : function (
nodeproxy 
)
{
},

/**
 * @method RenderFlow
 * @constructor
 * @param {cc.renderer::DeviceGraphics} arg0
 * @param {cc.renderer::Scene} arg1
 * @param {cc.renderer::ForwardRenderer} arg2
 */
RenderFlow : function (
devicegraphics, 
scene, 
forwardrenderer 
)
{
},

};

/**
 * @class GraphicsRenderHandle
 */
renderer.GraphicsRenderHandle = {

/**
 * @method setMeshCount
 * @param {unsigned int} arg0
 */
setMeshCount : function (
int 
)
{
},

/**
 * @method updateIA
 * @param {unsigned int} arg0
 * @param {int} arg1
 * @param {int} arg2
 */
updateIA : function (
int, 
int, 
int 
)
{
},

/**
 * @method getMeshCount
 * @return {unsigned int}
 */
getMeshCount : function (
)
{
    return 0;
},

/**
 * @method GraphicsRenderHandle
 * @constructor
 */
GraphicsRenderHandle : function (
)
{
},

};

/**
 * @class MaskRenderHandle
 */
renderer.MaskRenderHandle = {

/**
 * @method setMaskInverted
 * @param {bool} arg0
 */
setMaskInverted : function (
bool 
)
{
},

/**
 * @method setImageStencil
 * @param {bool} arg0
 */
setImageStencil : function (
bool 
)
{
},

/**
 * @method setClearSubHandle
 * @param {cc.renderer::GraphicsRenderHandle} arg0
 */
setClearSubHandle : function (
graphicsrenderhandle 
)
{
},

/**
 * @method getMaskInverted
 * @return {bool}
 */
getMaskInverted : function (
)
{
    return false;
},

/**
 * @method setRenderSubHandle
 * @param {cc.renderer::GraphicsRenderHandle} arg0
 */
setRenderSubHandle : function (
graphicsrenderhandle 
)
{
},

/**
 * @method MaskRenderHandle
 * @constructor
 */
MaskRenderHandle : function (
)
{
},

};
