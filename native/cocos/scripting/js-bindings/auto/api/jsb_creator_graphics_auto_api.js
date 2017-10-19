/**
 * @module creator_graphics
 */
var cc = cc || {};

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
