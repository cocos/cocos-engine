/**
 * @module renderer
 */
var renderer = renderer || {};

/**
 * @class ProgramLib
 */
renderer.ProgramLib = {

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
 * @class CustomProperties
 */
renderer.CustomProperties = {

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
 * @method CustomProperties
 * @constructor
 */
CustomProperties : function (
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
 * @method getProgramName
 * @return {String}
 */
getProgramName : function (
)
{
    return ;
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
 * @method setStencilTest
 * @param {bool} arg0
 */
setStencilTest : function (
bool 
)
{
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
 * @method setCullMode
 * @param {cc.renderer::CullMode} arg0
 */
setCullMode : function (
cullmode 
)
{
},

/**
 * @method setStencil
 */
setStencil : function (
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
 * @method copy
 * @param {cc.renderer::Effect} arg0
 */
copy : function (
effect 
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
 * @class AssemblerBase
 */
renderer.AssemblerBase = {

/**
 * @method disableDirty
 * @param {unsigned int} arg0
 */
disableDirty : function (
int 
)
{
},

/**
 * @method reset
 */
reset : function (
)
{
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
 * @method isDirty
 * @param {unsigned int} arg0
 * @return {bool}
 */
isDirty : function (
int 
)
{
    return false;
},

/**
 * @method setDirty
 * @param {se::Object} arg0
 */
setDirty : function (
object 
)
{
},

/**
 * @method AssemblerBase
 * @constructor
 */
AssemblerBase : function (
)
{
},

};

/**
 * @class MemPool
 */
renderer.MemPool = {

/**
 * @method removeCommonData
 * @param {unsigned int} arg0
 */
removeCommonData : function (
int 
)
{
},

/**
 * @method updateCommonData
 * @param {unsigned int} arg0
 * @param {se::Object} arg1
 * @param {se::Object} arg2
 */
updateCommonData : function (
int, 
object, 
object 
)
{
},

/**
 * @method MemPool
 * @constructor
 */
MemPool : function (
)
{
},

};

/**
 * @class NodeProxy
 */
renderer.NodeProxy = {

/**
 * @method disableVisit
 */
disableVisit : function (
)
{
},

/**
 * @method notifyUpdateParent
 */
notifyUpdateParent : function (
)
{
},

/**
 * @method destroyImmediately
 */
destroyImmediately : function (
)
{
},

/**
 * @method enableVisit
 */
enableVisit : function (
)
{
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
 * @method clearAssembler
 */
clearAssembler : function (
)
{
},

/**
 * @method setAssembler
 * @param {cc.renderer::AssemblerBase} arg0
 */
setAssembler : function (
assemblerbase 
)
{
},

/**
 * @method NodeProxy
 * @constructor
 * @param {unsigned int} arg0
 * @param {unsigned int} arg1
 * @param {String} arg2
 * @param {String} arg3
 */
NodeProxy : function (
int, 
int, 
str, 
str 
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
 * @class Light
 */
renderer.Light = {

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
 * @method setShadowFrustumSize
 * @param {float} arg0
 */
setShadowFrustumSize : function (
float 
)
{
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
 * @method getPositionUniform
 * @return {vec3_object}
 */
getPositionUniform : function (
)
{
    return cc.Vec3;
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
 * @return {float}
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
 * @method getDirectionUniform
 * @return {vec3_object}
 */
getDirectionUniform : function (
)
{
    return cc.Vec3;
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
 * @method setShadowDepthScale
 * @param {float} arg0
 */
setShadowDepthScale : function (
float 
)
{
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
 * @method getColorUniform
 * @return {vec3_object}
 */
getColorUniform : function (
)
{
    return cc.Vec3;
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
 * @param {float} arg0
 */
setShadowDarkness : function (
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
 * @method getShadowResolution
 * @return {unsigned int}
 */
getShadowResolution : function (
)
{
    return 0;
},

/**
 * @method getShadowDepthScale
 * @return {float}
 */
getShadowDepthScale : function (
)
{
    return 0;
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
 * @class Scene
 */
renderer.Scene = {

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
 * @method removeView
 * @param {cc.renderer::View} arg0
 */
removeView : function (
view 
)
{
},

/**
 * @method getLights
 * @return {Array}
 */
getLights : function (
)
{
    return new Array();
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
 * @method addCamera
 * @param {cc.renderer::Camera} arg0
 */
addCamera : function (
camera 
)
{
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
 * @method addLight
 * @param {cc.renderer::Light} arg0
 */
addLight : function (
light 
)
{
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
 * @method setDebugCamera
 * @param {cc.renderer::Camera} arg0
 */
setDebugCamera : function (
camera 
)
{
},

/**
 * @method reset
 */
reset : function (
)
{
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
 * @method addView
 * @param {cc.renderer::View} arg0
 */
addView : function (
view 
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
 * @class NodeMemPool
 */
renderer.NodeMemPool = {

/**
 * @method removeNodeData
 * @param {unsigned int} arg0
 */
removeNodeData : function (
int 
)
{
},

/**
 * @method updateNodeData
 * @param {unsigned int} arg0
 * @param {se::Object} arg1
 * @param {se::Object} arg2
 * @param {se::Object} arg3
 * @param {se::Object} arg4
 * @param {se::Object} arg5
 * @param {se::Object} arg6
 * @param {se::Object} arg7
 * @param {se::Object} arg8
 * @param {se::Object} arg9
 * @param {se::Object} arg10
 */
updateNodeData : function (
int, 
object, 
object, 
object, 
object, 
object, 
object, 
object, 
object, 
object, 
object 
)
{
},

/**
 * @method NodeMemPool
 * @constructor
 */
NodeMemPool : function (
)
{
},

};

/**
 * @class RenderDataList
 */
renderer.RenderDataList = {

/**
 * @method updateMesh
 * @param {unsigned int} arg0
 * @param {se::Object} arg1
 * @param {se::Object} arg2
 */
updateMesh : function (
int, 
object, 
object 
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
 * @method RenderDataList
 * @constructor
 */
RenderDataList : function (
)
{
},

};

/**
 * @class Assembler
 */
renderer.Assembler = {

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
 * @method isIgnoreOpacityFlag
 * @return {bool}
 */
isIgnoreOpacityFlag : function (
)
{
    return false;
},

/**
 * @method ignoreWorldMatrix
 */
ignoreWorldMatrix : function (
)
{
},

/**
 * @method updateVerticesRange
 * @param {unsigned int} arg0
 * @param {int} arg1
 * @param {int} arg2
 */
updateVerticesRange : function (
int, 
int, 
int 
)
{
},

/**
 * @method setRenderDataList
 * @param {cc.renderer::RenderDataList} arg0
 */
setRenderDataList : function (
renderdatalist 
)
{
},

/**
 * @method updateMeshIndex
 * @param {unsigned int} arg0
 * @param {int} arg1
 */
updateMeshIndex : function (
int, 
int 
)
{
},

/**
 * @method updateEffect
 * @param {unsigned int} arg0
 * @param {cc.renderer::Effect} arg1
 */
updateEffect : function (
int, 
effect 
)
{
},

/**
 * @method getCustomProperties
 * @return {cc.renderer::CustomProperties}
 */
getCustomProperties : function (
)
{
    return cc.renderer::CustomProperties;
},

/**
 * @method updateIndicesRange
 * @param {unsigned int} arg0
 * @param {int} arg1
 * @param {int} arg2
 */
updateIndicesRange : function (
int, 
int, 
int 
)
{
},

/**
 * @method ignoreOpacityFlag
 */
ignoreOpacityFlag : function (
)
{
},

/**
 * @method setCustomProperties
 * @param {cc.renderer::CustomProperties} arg0
 */
setCustomProperties : function (
customproperties 
)
{
},

/**
 * @method Assembler
 * @constructor
 */
Assembler : function (
)
{
},

};

/**
 * @class CustomAssembler
 */
renderer.CustomAssembler = {

/**
 * @method clearEffect
 */
clearEffect : function (
)
{
},

/**
 * @method updateEffect
 * @param {unsigned int} arg0
 * @param {cc.renderer::Effect} arg1
 */
updateEffect : function (
int, 
effect 
)
{
},

/**
 * @method updateIABuffer
 * @param {unsigned int} arg0
 * @param {cc.renderer::VertexBuffer} arg1
 * @param {cc.renderer::IndexBuffer} arg2
 */
updateIABuffer : function (
int, 
vertexbuffer, 
indexbuffer 
)
{
},

/**
 * @method CustomAssembler
 * @constructor
 */
CustomAssembler : function (
)
{
},

};

/**
 * @class RenderFlow
 */
renderer.RenderFlow = {

/**
 * @method render
 * @param {cc.renderer::NodeProxy} arg0
 * @param {float} arg1
 */
render : function (
nodeproxy, 
float 
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
 * @class AssemblerSprite
 */
renderer.AssemblerSprite = {

/**
 * @method setLocalData
 * @param {se::Object} arg0
 */
setLocalData : function (
object 
)
{
},

};

/**
 * @class SimpleSprite2D
 */
renderer.SimpleSprite2D = {

/**
 * @method SimpleSprite2D
 * @constructor
 */
SimpleSprite2D : function (
)
{
},

};

/**
 * @class MaskAssembler
 */
renderer.MaskAssembler = {

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
 * @param {cc.renderer::Assembler} arg0
 */
setClearSubHandle : function (
assembler 
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
 * @param {cc.renderer::Assembler} arg0
 */
setRenderSubHandle : function (
assembler 
)
{
},

/**
 * @method MaskAssembler
 * @constructor
 */
MaskAssembler : function (
)
{
},

};

/**
 * @class TiledMapAssembler
 */
renderer.TiledMapAssembler = {

/**
 * @method updateNodes
 * @param {unsigned int} arg0
 * @param {Array} arg1
 */
updateNodes : function (
int, 
array 
)
{
},

/**
 * @method clearNodes
 * @param {unsigned int} arg0
 */
clearNodes : function (
int 
)
{
},

/**
 * @method TiledMapAssembler
 * @constructor
 */
TiledMapAssembler : function (
)
{
},

};

/**
 * @class SlicedSprite2D
 */
renderer.SlicedSprite2D = {

/**
 * @method SlicedSprite2D
 * @constructor
 */
SlicedSprite2D : function (
)
{
},

};
