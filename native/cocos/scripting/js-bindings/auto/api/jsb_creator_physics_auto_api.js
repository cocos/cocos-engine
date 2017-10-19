/**
 * @module creator_physics
 */
var cc = cc || {};

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
 * @class PhysicsManifoldWrapper
 */
cc.PhysicsManifoldWrapper = {

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
 * @method getLocalNormalY
 * @return {float}
 */
getLocalNormalY : function (
)
{
    return 0;
},

/**
 * @method getLocalNormalX
 * @return {float}
 */
getLocalNormalX : function (
)
{
    return 0;
},

/**
 * @method getLocalPointY
 * @return {float}
 */
getLocalPointY : function (
)
{
    return 0;
},

/**
 * @method getLocalPointX
 * @return {float}
 */
getLocalPointX : function (
)
{
    return 0;
},

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
 * @method getCount
 * @return {int}
 */
getCount : function (
)
{
    return 0;
},

/**
 * @method PhysicsManifoldWrapper
 * @constructor
 */
PhysicsManifoldWrapper : function (
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
