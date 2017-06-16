/**
 * @module creator
 */
var cc = cc || {};

/**
 * @class Scale9SpriteV2
 */
cc.Scale9SpriteV2 = {

/**
 * @method setTexture
* @param {cc.Texture2D|String} texture2d
* @return {bool|bool}
*/
setTexture : function(
str 
)
{
    return false;
},

/**
 * @method getFillType
 * @return {creator::Scale9SpriteV2::FillType}
 */
getFillType : function (
)
{
    return creator::Scale9SpriteV2::FillType;
},

/**
 * @method isTrimmedContentSizeEnabled
 * @return {bool}
 */
isTrimmedContentSizeEnabled : function (
)
{
    return false;
},

/**
 * @method getState
 * @return {creator::Scale9SpriteV2::State}
 */
getState : function (
)
{
    return creator::Scale9SpriteV2::State;
},

/**
 * @method setState
 * @param {creator::Scale9SpriteV2::State} arg0
 */
setState : function (
state 
)
{
},

/**
 * @method setInsetBottom
 * @param {float} arg0
 */
setInsetBottom : function (
float 
)
{
},

/**
 * @method setFillRange
 * @param {float} arg0
 */
setFillRange : function (
float 
)
{
},

/**
 * @method getFillStart
 * @return {float}
 */
getFillStart : function (
)
{
    return 0;
},

/**
 * @method getFillRange
 * @return {float}
 */
getFillRange : function (
)
{
    return 0;
},

/**
 * @method setInsetTop
 * @param {float} arg0
 */
setInsetTop : function (
float 
)
{
},

/**
 * @method setRenderingType
 * @param {creator::Scale9SpriteV2::RenderingType} arg0
 */
setRenderingType : function (
renderingtype 
)
{
},

/**
 * @method setDistortionOffset
 * @param {vec2_object} arg0
 */
setDistortionOffset : function (
vec2 
)
{
},

/**
 * @method setFillCenter
* @param {float|vec2_object} float
* @param {float} float
*/
setFillCenter : function(
float,
float 
)
{
},

/**
 * @method setSpriteFrame
* @param {cc.SpriteFrame|String} spriteframe
* @return {bool|bool}
*/
setSpriteFrame : function(
str 
)
{
    return false;
},

/**
 * @method getBlendFunc
 * @return {cc.BlendFunc}
 */
getBlendFunc : function (
)
{
    return cc.BlendFunc;
},

/**
 * @method initWithTexture
* @param {String|cc.Texture2D} str
* @return {bool|bool}
*/
initWithTexture : function(
texture2d 
)
{
    return false;
},

/**
 * @method getInsetLeft
 * @return {float}
 */
getInsetLeft : function (
)
{
    return 0;
},

/**
 * @method getInsetBottom
 * @return {float}
 */
getInsetBottom : function (
)
{
    return 0;
},

/**
 * @method setDistortionTiling
 * @param {vec2_object} arg0
 */
setDistortionTiling : function (
vec2 
)
{
},

/**
 * @method getRenderingType
 * @return {creator::Scale9SpriteV2::RenderingType}
 */
getRenderingType : function (
)
{
    return creator::Scale9SpriteV2::RenderingType;
},

/**
 * @method setFillStart
 * @param {float} arg0
 */
setFillStart : function (
float 
)
{
},

/**
 * @method getInsetRight
 * @return {float}
 */
getInsetRight : function (
)
{
    return 0;
},

/**
 * @method setBlendFunc
* @param {unsigned int|cc.BlendFunc} int
* @param {unsigned int} int
*/
setBlendFunc : function(
int,
int 
)
{
},

/**
 * @method getFillCenter
 * @return {vec2_object}
 */
getFillCenter : function (
)
{
    return cc.Vec2;
},

/**
 * @method getInsetTop
 * @return {float}
 */
getInsetTop : function (
)
{
    return 0;
},

/**
 * @method setInsetLeft
 * @param {float} arg0
 */
setInsetLeft : function (
float 
)
{
},

/**
 * @method initWithSpriteFrame
* @param {String|cc.SpriteFrame} str
* @return {bool|bool}
*/
initWithSpriteFrame : function(
spriteframe 
)
{
    return false;
},

/**
 * @method setFillType
 * @param {creator::Scale9SpriteV2::FillType} arg0
 */
setFillType : function (
filltype 
)
{
},

/**
 * @method setInsetRight
 * @param {float} arg0
 */
setInsetRight : function (
float 
)
{
},

/**
 * @method enableTrimmedContentSize
 * @param {bool} arg0
 */
enableTrimmedContentSize : function (
bool 
)
{
},

/**
 * @method Scale9SpriteV2
 * @constructor
 */
Scale9SpriteV2 : function (
)
{
},

};

/**
 * @class GraphicsNode
 */
cc.GraphicsNode = {

/**
 * @method quadraticCurveTo
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 */
quadraticCurveTo : function (
float, 
float, 
float, 
float 
)
{
},

/**
 * @method moveTo
 * @param {float} arg0
 * @param {float} arg1
 */
moveTo : function (
float, 
float 
)
{
},

/**
 * @method lineTo
 * @param {float} arg0
 * @param {float} arg1
 */
lineTo : function (
float, 
float 
)
{
},

/**
 * @method stroke
 */
stroke : function (
)
{
},

/**
 * @method arc
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 * @param {float} arg4
 * @param {bool} arg5
 */
arc : function (
float, 
float, 
float, 
float, 
float, 
bool 
)
{
},

/**
 * @method setLineJoin
 * @param {creator::LineJoin} arg0
 */
setLineJoin : function (
linejoin 
)
{
},

/**
 * @method close
 */
close : function (
)
{
},

/**
 * @method ellipse
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 */
ellipse : function (
float, 
float, 
float, 
float 
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
 * @method fill
 */
fill : function (
)
{
},

/**
 * @method getStrokeColor
 * @return {color4f_object}
 */
getStrokeColor : function (
)
{
    return cc.Color4F;
},

/**
 * @method setLineCap
 * @param {creator::LineCap} arg0
 */
setLineCap : function (
linecap 
)
{
},

/**
 * @method circle
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 */
circle : function (
float, 
float, 
float 
)
{
},

/**
 * @method roundRect
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 * @param {float} arg4
 */
roundRect : function (
float, 
float, 
float, 
float, 
float 
)
{
},

/**
 * @method draw
 * @param {cc.Renderer} arg0
 * @param {mat4_object} arg1
 * @param {unsigned int} arg2
 */
draw : function (
renderer, 
mat4, 
int 
)
{
},

/**
 * @method bezierCurveTo
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 * @param {float} arg4
 * @param {float} arg5
 */
bezierCurveTo : function (
float, 
float, 
float, 
float, 
float, 
float 
)
{
},

/**
 * @method arcTo
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 * @param {float} arg4
 */
arcTo : function (
float, 
float, 
float, 
float, 
float 
)
{
},

/**
 * @method fillRect
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 */
fillRect : function (
float, 
float, 
float, 
float 
)
{
},

/**
 * @method onDraw
 * @param {mat4_object} arg0
 * @param {unsigned int} arg1
 */
onDraw : function (
mat4, 
int 
)
{
},

/**
 * @method setFillColor
 * @param {color4f_object} arg0
 */
setFillColor : function (
color4f 
)
{
},

/**
 * @method getFillColor
 * @return {color4f_object}
 */
getFillColor : function (
)
{
    return cc.Color4F;
},

/**
 * @method beginPath
 */
beginPath : function (
)
{
},

/**
 * @method setDeviceRatio
 * @param {float} arg0
 */
setDeviceRatio : function (
float 
)
{
},

/**
 * @method rect
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 */
rect : function (
float, 
float, 
float, 
float 
)
{
},

/**
 * @method getMiterLimit
 * @return {float}
 */
getMiterLimit : function (
)
{
    return 0;
},

/**
 * @method getLineJoin
 * @return {creator::LineJoin}
 */
getLineJoin : function (
)
{
    return creator::LineJoin;
},

/**
 * @method getLineCap
 * @return {creator::LineCap}
 */
getLineCap : function (
)
{
    return creator::LineCap;
},

/**
 * @method setMiterLimit
 * @param {float} arg0
 */
setMiterLimit : function (
float 
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
 * @method getDeviceRatio
 * @return {float}
 */
getDeviceRatio : function (
)
{
    return 0;
},

/**
 * @method getLineWidth
 * @return {float}
 */
getLineWidth : function (
)
{
    return 0;
},

/**
 * @method setStrokeColor
 * @param {color4f_object} arg0
 */
setStrokeColor : function (
color4f 
)
{
},

/**
 * @method create
 * @return {creator::GraphicsNode}
 */
create : function (
)
{
    return creator::GraphicsNode;
},

/**
 * @method GraphicsNode
 * @constructor
 */
GraphicsNode : function (
)
{
},

};

/**
 * @class PhysicsDebugDraw
 */
cc.PhysicsDebugDraw = {

/**
 * @method getDrawer
 * @return {creator::GraphicsNode}
 */
getDrawer : function (
)
{
    return creator::GraphicsNode;
},

/**
 * @method ClearDraw
 */
ClearDraw : function (
)
{
},

/**
 * @method AddDrawerToNode
 * @param {cc.Node} arg0
 */
AddDrawerToNode : function (
node 
)
{
},

/**
 * @method PhysicsDebugDraw
 * @constructor
 */
PhysicsDebugDraw : function (
)
{
},

};

/**
 * @class PhysicsWorldManifoldWrapper
 */
cc.PhysicsWorldManifoldWrapper = {

/**
 * @method getSeparation
 * @param {int} arg0
 * @return {float}
 */
getSeparation : function (
int 
)
{
    return 0;
},

/**
 * @method getX
 * @param {int} arg0
 * @return {float}
 */
getX : function (
int 
)
{
    return 0;
},

/**
 * @method getY
 * @param {int} arg0
 * @return {float}
 */
getY : function (
int 
)
{
    return 0;
},

/**
 * @method getCount
 * @return {int}
 */
getCount : function (
)
{
    return 0;
},

/**
 * @method getNormalY
 * @return {float}
 */
getNormalY : function (
)
{
    return 0;
},

/**
 * @method getNormalX
 * @return {float}
 */
getNormalX : function (
)
{
    return 0;
},

/**
 * @method PhysicsWorldManifoldWrapper
 * @constructor
 */
PhysicsWorldManifoldWrapper : function (
)
{
},

};

/**
 * @class PhysicsUtils
 */
cc.PhysicsUtils = {

/**
 * @method addB2Body
 * @param {b2Body} arg0
 */
addB2Body : function (
b2body 
)
{
},

/**
 * @method syncNode
 */
syncNode : function (
)
{
},

/**
 * @method removeB2Body
 * @param {b2Body} arg0
 */
removeB2Body : function (
b2body 
)
{
},

/**
 * @method getContactManifoldWrapper
 * @param {b2Contact} arg0
 * @return {creator::PhysicsManifoldWrapper}
 */
getContactManifoldWrapper : function (
b2contact 
)
{
    return creator::PhysicsManifoldWrapper;
},

/**
 * @method getContactWorldManifoldWrapper
 * @param {b2Contact} arg0
 * @return {creator::PhysicsWorldManifoldWrapper}
 */
getContactWorldManifoldWrapper : function (
b2contact 
)
{
    return creator::PhysicsWorldManifoldWrapper;
},

/**
 * @method PhysicsUtils
 * @constructor
 */
PhysicsUtils : function (
)
{
},

};

/**
 * @class PhysicsContactImpulse
 */
cc.PhysicsContactImpulse = {

/**
 * @method getCount
 * @return {int}
 */
getCount : function (
)
{
    return 0;
},

/**
 * @method getNormalImpulse
 * @param {int} arg0
 * @return {float}
 */
getNormalImpulse : function (
int 
)
{
    return 0;
},

/**
 * @method getTangentImpulse
 * @param {int} arg0
 * @return {float}
 */
getTangentImpulse : function (
int 
)
{
    return 0;
},

/**
 * @method PhysicsContactImpulse
 * @constructor
 */
PhysicsContactImpulse : function (
)
{
},

};

/**
 * @class PhysicsContactListener
 */
cc.PhysicsContactListener = {

/**
 * @method unregisterContactFixture
 * @param {b2Fixture} arg0
 */
unregisterContactFixture : function (
b2fixture 
)
{
},

/**
 * @method registerContactFixture
 * @param {b2Fixture} arg0
 */
registerContactFixture : function (
b2fixture 
)
{
},

/**
 * @method PhysicsContactListener
 * @constructor
 */
PhysicsContactListener : function (
)
{
},

};

/**
 * @class PhysicsAABBQueryCallback
 */
cc.PhysicsAABBQueryCallback = {

/**
 * @method init
* @param {b2Vec2} b2vec2
*/
init : function(
b2vec2 
)
{
},

/**
 * @method getFixture
 * @return {b2Fixture}
 */
getFixture : function (
)
{
    return b2Fixture;
},

/**
 * @method PhysicsAABBQueryCallback
 * @constructor
 */
PhysicsAABBQueryCallback : function (
)
{
},

};

/**
 * @class PhysicsRayCastCallback
 */
cc.PhysicsRayCastCallback = {

/**
 * @method getType
 * @return {int}
 */
getType : function (
)
{
    return 0;
},

/**
 * @method init
 * @param {int} arg0
 */
init : function (
int 
)
{
},

/**
 * @method getFractions
 * @return {Array}
 */
getFractions : function (
)
{
    return new Array();
},

/**
 * @method PhysicsRayCastCallback
 * @constructor
 */
PhysicsRayCastCallback : function (
)
{
},

};

/**
 * @class CameraNode
 */
cc.CameraNode = {

/**
 * @method removeTarget
 * @param {cc.Node} arg0
 */
removeTarget : function (
node 
)
{
},

/**
 * @method setTransform
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 * @param {float} arg4
 * @param {float} arg5
 */
setTransform : function (
float, 
float, 
float, 
float, 
float, 
float 
)
{
},

/**
 * @method getVisibleRect
 * @return {rect_object}
 */
getVisibleRect : function (
)
{
    return cc.Rect;
},

/**
 * @method containsNode
 * @param {cc.Node} arg0
 * @return {bool}
 */
containsNode : function (
node 
)
{
    return false;
},

/**
 * @method addTarget
 * @param {cc.Node} arg0
 */
addTarget : function (
node 
)
{
},

/**
 * @method getInstance
 * @return {creator::CameraNode}
 */
getInstance : function (
)
{
    return creator::CameraNode;
},

/**
 * @method CameraNode
 * @constructor
 */
CameraNode : function (
)
{
},

};
