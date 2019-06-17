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
 * @class AssemblerBase
 */
renderer.AssemblerBase = {

/**
 * @method reset
 */
reset : function (
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
 * @method getDirtyFlag
 * @return {unsigned int}
 */
getDirtyFlag : function (
)
{
    return 0;
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
 * @method notifyDirty
 * @param {unsigned int} arg0
 */
notifyDirty : function (
int 
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
 * @method getChildren
 * @return {Array}
 */
getChildren : function (
)
{
    return new Array();
},

/**
 * @method disableVisit
 */
disableVisit : function (
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
 * @method addAssembler
 * @param {String} arg0
 * @param {cc.renderer::AssemblerBase} arg1
 */
addAssembler : function (
str, 
assemblerbase 
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
 * @method getAssembler
 * @param {String} arg0
 * @return {cc.renderer::AssemblerBase}
 */
getAssembler : function (
str 
)
{
    return cc.renderer::AssemblerBase;
},

/**
 * @method getChildByName
 * @param {String} arg0
 * @return {cc.renderer::NodeProxy}
 */
getChildByName : function (
str 
)
{
    return cc.renderer::NodeProxy;
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
 * @method visit
 * @param {cc.renderer::ModelBatcher} arg0
 * @param {cc.renderer::Scene} arg1
 */
visit : function (
modelbatcher, 
scene 
)
{
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
 * @method updateMatrix
* @param {mat4_object} mat4
*/
updateMatrix : function(
mat4 
)
{
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
 * @method enableVisit
 */
enableVisit : function (
)
{
},

/**
 * @method enableUpdateWorldMatrix
 */
enableUpdateWorldMatrix : function (
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
 * @method updateFromJS
 */
updateFromJS : function (
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
 * @method disaleUpdateWorldMatrix
 */
disaleUpdateWorldMatrix : function (
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
 * @method removeAssembler
 * @param {String} arg0
 */
removeAssembler : function (
str 
)
{
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
 * @class RenderDataList
 */
renderer.RenderDataList = {

/**
 * @method getRenderData
 * @param {unsigned int} arg0
 * @return {cc.renderer::RenderData}
 */
getRenderData : function (
int 
)
{
    return cc.renderer::RenderData;
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
 * @method getIACount
 * @return {unsigned int}
 */
getIACount : function (
)
{
    return 0;
},

/**
 * @method ignoreWorldMatrix
 */
ignoreWorldMatrix : function (
)
{
},

/**
 * @method updateOpacity
 * @param {unsigned int} arg0
 * @param {unsigned char} arg1
 */
updateOpacity : function (
int, 
char 
)
{
},

/**
 * @method isOpacityAlwaysDirty
 * @return {bool}
 */
isOpacityAlwaysDirty : function (
)
{
    return false;
},

/**
 * @method isIgnoreWorldMatrix
 * @return {bool}
 */
isIgnoreWorldMatrix : function (
)
{
    return false;
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
 * @method fillBuffers
 * @param {cc.renderer::MeshBuffer} arg0
 * @param {unsigned int} arg1
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
 * @method enableOpacityAlwaysDirty
 */
enableOpacityAlwaysDirty : function (
)
{
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
 * @method getIACount
 * @return {unsigned int}
 */
getIACount : function (
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
 * @method updateIARange
 * @param {unsigned int} arg0
 * @param {int} arg1
 * @param {int} arg2
 */
updateIARange : function (
int, 
int, 
int 
)
{
},

/**
 * @method clearEffect
 */
clearEffect : function (
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
 */
render : function (
nodeproxy 
)
{
},

/**
 * @method visit
 * @param {cc.renderer::NodeProxy} arg0
 */
visit : function (
nodeproxy 
)
{
},

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
 * @method setLayerMoveXY
 * @param {float} arg0
 * @param {float} arg1
 */
setLayerMoveXY : function (
float, 
float 
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
