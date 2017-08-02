/**
 * @module box2dclasses
 */
var b2 = b2 || {};

/**
 * @class b2Draw
 */
b2.Draw = {

/**
 * @method AppendFlags
 * @param {unsigned int} arg0
 */
AppendFlags : function (
int 
)
{
},

/**
 * @method DrawTransform
 * @param {b2Transform} arg0
 */
DrawTransform : function (
b2transform 
)
{
},

/**
 * @method ClearFlags
 * @param {unsigned int} arg0
 */
ClearFlags : function (
int 
)
{
},

/**
 * @method DrawPolygon
 * @param {b2Vec2} arg0
 * @param {int} arg1
 * @param {b2Color} arg2
 */
DrawPolygon : function (
b2vec2, 
int, 
b2color 
)
{
},

/**
 * @method ClearDraw
 */
ClearDraw : function (
)
{
},

/**
 * @method DrawSolidPolygon
 * @param {b2Vec2} arg0
 * @param {int} arg1
 * @param {b2Color} arg2
 */
DrawSolidPolygon : function (
b2vec2, 
int, 
b2color 
)
{
},

/**
 * @method DrawCircle
 * @param {b2Vec2} arg0
 * @param {float} arg1
 * @param {b2Color} arg2
 */
DrawCircle : function (
b2vec2, 
float, 
b2color 
)
{
},

/**
 * @method SetFlags
 * @param {unsigned int} arg0
 */
SetFlags : function (
int 
)
{
},

/**
 * @method DrawSegment
 * @param {b2Vec2} arg0
 * @param {b2Vec2} arg1
 * @param {b2Color} arg2
 */
DrawSegment : function (
b2vec2, 
b2vec2, 
b2color 
)
{
},

/**
 * @method DrawSolidCircle
 * @param {b2Vec2} arg0
 * @param {float} arg1
 * @param {b2Vec2} arg2
 * @param {b2Color} arg3
 */
DrawSolidCircle : function (
b2vec2, 
float, 
b2vec2, 
b2color 
)
{
},

/**
 * @method GetFlags
 * @return {unsigned int}
 */
GetFlags : function (
)
{
    return 0;
},

};

/**
 * @class b2Shape
 */
b2.Shape = {

/**
 * @method ComputeMass
 * @param {b2MassData} arg0
 * @param {float} arg1
 */
ComputeMass : function (
b2massdata, 
float 
)
{
},

/**
 * @method Clone
 * @param {b2BlockAllocator} arg0
 * @return {b2Shape}
 */
Clone : function (
b2blockallocator 
)
{
    return b2Shape;
},

/**
 * @method GetType
 * @return {b2Shape::Type}
 */
GetType : function (
)
{
    return b2Shape::Type;
},

/**
 * @method RayCast
 * @param {b2RayCastOutput} arg0
 * @param {b2RayCastInput} arg1
 * @param {b2Transform} arg2
 * @param {int} arg3
 * @return {bool}
 */
RayCast : function (
b2raycastoutput, 
b2raycastinput, 
b2transform, 
int 
)
{
    return false;
},

/**
 * @method ComputeAABB
 * @param {b2AABB} arg0
 * @param {b2Transform} arg1
 * @param {int} arg2
 */
ComputeAABB : function (
b2aabb, 
b2transform, 
int 
)
{
},

/**
 * @method GetChildCount
 * @return {int}
 */
GetChildCount : function (
)
{
    return 0;
},

/**
 * @method TestPoint
 * @param {b2Transform} arg0
 * @param {b2Vec2} arg1
 * @return {bool}
 */
TestPoint : function (
b2transform, 
b2vec2 
)
{
    return false;
},

};

/**
 * @class b2CircleShape
 */
b2.CircleShape = {

/**
 * @method ComputeMass
 * @param {b2MassData} arg0
 * @param {float} arg1
 */
ComputeMass : function (
b2massdata, 
float 
)
{
},

/**
 * @method GetVertex
 * @param {int} arg0
 * @return {b2Vec2}
 */
GetVertex : function (
int 
)
{
    return b2Vec2;
},

/**
 * @method Clone
 * @param {b2BlockAllocator} arg0
 * @return {b2Shape}
 */
Clone : function (
b2blockallocator 
)
{
    return b2Shape;
},

/**
 * @method RayCast
 * @param {b2RayCastOutput} arg0
 * @param {b2RayCastInput} arg1
 * @param {b2Transform} arg2
 * @param {int} arg3
 * @return {bool}
 */
RayCast : function (
b2raycastoutput, 
b2raycastinput, 
b2transform, 
int 
)
{
    return false;
},

/**
 * @method ComputeAABB
 * @param {b2AABB} arg0
 * @param {b2Transform} arg1
 * @param {int} arg2
 */
ComputeAABB : function (
b2aabb, 
b2transform, 
int 
)
{
},

/**
 * @method GetVertexCount
 * @return {int}
 */
GetVertexCount : function (
)
{
    return 0;
},

/**
 * @method GetChildCount
 * @return {int}
 */
GetChildCount : function (
)
{
    return 0;
},

/**
 * @method TestPoint
 * @param {b2Transform} arg0
 * @param {b2Vec2} arg1
 * @return {bool}
 */
TestPoint : function (
b2transform, 
b2vec2 
)
{
    return false;
},

/**
 * @method GetSupportVertex
 * @param {b2Vec2} arg0
 * @return {b2Vec2}
 */
GetSupportVertex : function (
b2vec2 
)
{
    return b2Vec2;
},

/**
 * @method GetSupport
 * @param {b2Vec2} arg0
 * @return {int}
 */
GetSupport : function (
b2vec2 
)
{
    return 0;
},

/**
 * @method b2CircleShape
 * @constructor
 */
b2CircleShape : function (
)
{
},

};

/**
 * @class b2EdgeShape
 */
b2.EdgeShape = {

/**
 * @method Set
 * @param {b2Vec2} arg0
 * @param {b2Vec2} arg1
 */
Set : function (
b2vec2, 
b2vec2 
)
{
},

/**
 * @method ComputeMass
 * @param {b2MassData} arg0
 * @param {float} arg1
 */
ComputeMass : function (
b2massdata, 
float 
)
{
},

/**
 * @method Clone
 * @param {b2BlockAllocator} arg0
 * @return {b2Shape}
 */
Clone : function (
b2blockallocator 
)
{
    return b2Shape;
},

/**
 * @method RayCast
 * @param {b2RayCastOutput} arg0
 * @param {b2RayCastInput} arg1
 * @param {b2Transform} arg2
 * @param {int} arg3
 * @return {bool}
 */
RayCast : function (
b2raycastoutput, 
b2raycastinput, 
b2transform, 
int 
)
{
    return false;
},

/**
 * @method ComputeAABB
 * @param {b2AABB} arg0
 * @param {b2Transform} arg1
 * @param {int} arg2
 */
ComputeAABB : function (
b2aabb, 
b2transform, 
int 
)
{
},

/**
 * @method GetChildCount
 * @return {int}
 */
GetChildCount : function (
)
{
    return 0;
},

/**
 * @method TestPoint
 * @param {b2Transform} arg0
 * @param {b2Vec2} arg1
 * @return {bool}
 */
TestPoint : function (
b2transform, 
b2vec2 
)
{
    return false;
},

/**
 * @method b2EdgeShape
 * @constructor
 */
b2EdgeShape : function (
)
{
},

};

/**
 * @class b2ChainShape
 */
b2.ChainShape = {

/**
 * @method ComputeMass
 * @param {b2MassData} arg0
 * @param {float} arg1
 */
ComputeMass : function (
b2massdata, 
float 
)
{
},

/**
 * @method Clear
 */
Clear : function (
)
{
},

/**
 * @method TestPoint
 * @param {b2Transform} arg0
 * @param {b2Vec2} arg1
 * @return {bool}
 */
TestPoint : function (
b2transform, 
b2vec2 
)
{
    return false;
},

/**
 * @method GetChildEdge
 * @param {b2EdgeShape} arg0
 * @param {int} arg1
 */
GetChildEdge : function (
b2edgeshape, 
int 
)
{
},

/**
 * @method RayCast
 * @param {b2RayCastOutput} arg0
 * @param {b2RayCastInput} arg1
 * @param {b2Transform} arg2
 * @param {int} arg3
 * @return {bool}
 */
RayCast : function (
b2raycastoutput, 
b2raycastinput, 
b2transform, 
int 
)
{
    return false;
},

/**
 * @method ComputeAABB
 * @param {b2AABB} arg0
 * @param {b2Transform} arg1
 * @param {int} arg2
 */
ComputeAABB : function (
b2aabb, 
b2transform, 
int 
)
{
},

/**
 * @method GetChildCount
 * @return {int}
 */
GetChildCount : function (
)
{
    return 0;
},

/**
 * @method SetPrevVertex
 * @param {b2Vec2} arg0
 */
SetPrevVertex : function (
b2vec2 
)
{
},

/**
 * @method SetNextVertex
 * @param {b2Vec2} arg0
 */
SetNextVertex : function (
b2vec2 
)
{
},

/**
 * @method Clone
 * @param {b2BlockAllocator} arg0
 * @return {b2Shape}
 */
Clone : function (
b2blockallocator 
)
{
    return b2Shape;
},

/**
 * @method b2ChainShape
 * @constructor
 */
b2ChainShape : function (
)
{
},

};

/**
 * @class b2PolygonShape
 */
b2.PolygonShape = {

/**
 * @method ComputeMass
 * @param {b2MassData} arg0
 * @param {float} arg1
 */
ComputeMass : function (
b2massdata, 
float 
)
{
},

/**
 * @method GetVertex
 * @param {int} arg0
 * @return {b2Vec2}
 */
GetVertex : function (
int 
)
{
    return b2Vec2;
},

/**
 * @method Clone
 * @param {b2BlockAllocator} arg0
 * @return {b2Shape}
 */
Clone : function (
b2blockallocator 
)
{
    return b2Shape;
},

/**
 * @method RayCast
 * @param {b2RayCastOutput} arg0
 * @param {b2RayCastInput} arg1
 * @param {b2Transform} arg2
 * @param {int} arg3
 * @return {bool}
 */
RayCast : function (
b2raycastoutput, 
b2raycastinput, 
b2transform, 
int 
)
{
    return false;
},

/**
 * @method ComputeAABB
 * @param {b2AABB} arg0
 * @param {b2Transform} arg1
 * @param {int} arg2
 */
ComputeAABB : function (
b2aabb, 
b2transform, 
int 
)
{
},

/**
 * @method GetVertexCount
 * @return {int}
 */
GetVertexCount : function (
)
{
    return 0;
},

/**
 * @method GetChildCount
 * @return {int}
 */
GetChildCount : function (
)
{
    return 0;
},

/**
 * @method TestPoint
 * @param {b2Transform} arg0
 * @param {b2Vec2} arg1
 * @return {bool}
 */
TestPoint : function (
b2transform, 
b2vec2 
)
{
    return false;
},

/**
 * @method Validate
 * @return {bool}
 */
Validate : function (
)
{
    return false;
},

/**
 * @method b2PolygonShape
 * @constructor
 */
b2PolygonShape : function (
)
{
},

};

/**
 * @class b2Body
 */
b2.Body = {

/**
 * @method GetAngle
 * @return {float}
 */
GetAngle : function (
)
{
    return 0;
},

/**
 * @method IsSleepingAllowed
 * @return {bool}
 */
IsSleepingAllowed : function (
)
{
    return false;
},

/**
 * @method SetAngularDamping
 * @param {float} arg0
 */
SetAngularDamping : function (
float 
)
{
},

/**
 * @method SetActive
 * @param {bool} arg0
 */
SetActive : function (
bool 
)
{
},

/**
 * @method SetGravityScale
 * @param {float} arg0
 */
SetGravityScale : function (
float 
)
{
},

/**
 * @method GetAngularVelocity
 * @return {float}
 */
GetAngularVelocity : function (
)
{
    return 0;
},

/**
 * @method GetFixtureList
* @return {b2Fixture|b2Fixture}
*/
GetFixtureList : function(
)
{
    return b2Fixture;
},

/**
 * @method ApplyForce
 * @param {b2Vec2} arg0
 * @param {b2Vec2} arg1
 * @param {bool} arg2
 */
ApplyForce : function (
b2vec2, 
b2vec2, 
bool 
)
{
},

/**
 * @method GetLocalPoint
 * @param {b2Vec2} arg0
 * @return {b2Vec2}
 */
GetLocalPoint : function (
b2vec2 
)
{
    return b2Vec2;
},

/**
 * @method SetLinearVelocity
 * @param {b2Vec2} arg0
 */
SetLinearVelocity : function (
b2vec2 
)
{
},

/**
 * @method GetLinearVelocity
 * @return {b2Vec2}
 */
GetLinearVelocity : function (
)
{
    return b2Vec2;
},

/**
 * @method GetNext
* @return {b2Body|b2Body}
*/
GetNext : function(
)
{
    return b2Body;
},

/**
 * @method SetSleepingAllowed
 * @param {bool} arg0
 */
SetSleepingAllowed : function (
bool 
)
{
},

/**
 * @method SetTransform
 * @param {b2Vec2} arg0
 * @param {float} arg1
 */
SetTransform : function (
b2vec2, 
float 
)
{
},

/**
 * @method GetMass
 * @return {float}
 */
GetMass : function (
)
{
    return 0;
},

/**
 * @method SetAngularVelocity
 * @param {float} arg0
 */
SetAngularVelocity : function (
float 
)
{
},

/**
 * @method GetMassData
 * @param {b2MassData} arg0
 */
GetMassData : function (
b2massdata 
)
{
},

/**
 * @method GetLinearVelocityFromWorldPoint
 * @param {b2Vec2} arg0
 * @return {b2Vec2}
 */
GetLinearVelocityFromWorldPoint : function (
b2vec2 
)
{
    return b2Vec2;
},

/**
 * @method ResetMassData
 */
ResetMassData : function (
)
{
},

/**
 * @method ApplyForceToCenter
 * @param {b2Vec2} arg0
 * @param {bool} arg1
 */
ApplyForceToCenter : function (
b2vec2, 
bool 
)
{
},

/**
 * @method ApplyTorque
 * @param {float} arg0
 * @param {bool} arg1
 */
ApplyTorque : function (
float, 
bool 
)
{
},

/**
 * @method IsAwake
 * @return {bool}
 */
IsAwake : function (
)
{
    return false;
},

/**
 * @method SetType
 * @param {b2BodyType} arg0
 */
SetType : function (
b2bodytype 
)
{
},

/**
 * @method SetMassData
 * @param {b2MassData} arg0
 */
SetMassData : function (
b2massdata 
)
{
},

/**
 * @method GetTransform
 * @return {b2Transform}
 */
GetTransform : function (
)
{
    return b2Transform;
},

/**
 * @method GetWorldCenter
 * @return {b2Vec2}
 */
GetWorldCenter : function (
)
{
    return b2Vec2;
},

/**
 * @method GetAngularDamping
 * @return {float}
 */
GetAngularDamping : function (
)
{
    return 0;
},

/**
 * @method ApplyLinearImpulse
 * @param {b2Vec2} arg0
 * @param {b2Vec2} arg1
 * @param {bool} arg2
 */
ApplyLinearImpulse : function (
b2vec2, 
b2vec2, 
bool 
)
{
},

/**
 * @method IsFixedRotation
 * @return {bool}
 */
IsFixedRotation : function (
)
{
    return false;
},

/**
 * @method GetLocalCenter
 * @return {b2Vec2}
 */
GetLocalCenter : function (
)
{
    return b2Vec2;
},

/**
 * @method GetWorldVector
 * @param {b2Vec2} arg0
 * @return {b2Vec2}
 */
GetWorldVector : function (
b2vec2 
)
{
    return b2Vec2;
},

/**
 * @method GetLinearVelocityFromLocalPoint
 * @param {b2Vec2} arg0
 * @return {b2Vec2}
 */
GetLinearVelocityFromLocalPoint : function (
b2vec2 
)
{
    return b2Vec2;
},

/**
 * @method GetContactList
* @return {b2ContactEdge|b2ContactEdge}
*/
GetContactList : function(
)
{
    return b2ContactEdge;
},

/**
 * @method GetWorldPoint
 * @param {b2Vec2} arg0
 * @return {b2Vec2}
 */
GetWorldPoint : function (
b2vec2 
)
{
    return b2Vec2;
},

/**
 * @method SetAwake
 * @param {bool} arg0
 */
SetAwake : function (
bool 
)
{
},

/**
 * @method GetLinearDamping
 * @return {float}
 */
GetLinearDamping : function (
)
{
    return 0;
},

/**
 * @method IsBullet
 * @return {bool}
 */
IsBullet : function (
)
{
    return false;
},

/**
 * @method GetWorld
* @return {b2World|b2World}
*/
GetWorld : function(
)
{
    return b2World;
},

/**
 * @method GetLocalVector
 * @param {b2Vec2} arg0
 * @return {b2Vec2}
 */
GetLocalVector : function (
b2vec2 
)
{
    return b2Vec2;
},

/**
 * @method SetLinearDamping
 * @param {float} arg0
 */
SetLinearDamping : function (
float 
)
{
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method SetBullet
 * @param {bool} arg0
 */
SetBullet : function (
bool 
)
{
},

/**
 * @method GetType
 * @return {b2BodyType}
 */
GetType : function (
)
{
    return b2BodyType;
},

/**
 * @method GetGravityScale
 * @return {float}
 */
GetGravityScale : function (
)
{
    return 0;
},

/**
 * @method DestroyFixture
 * @param {b2Fixture} arg0
 */
DestroyFixture : function (
b2fixture 
)
{
},

/**
 * @method GetInertia
 * @return {float}
 */
GetInertia : function (
)
{
    return 0;
},

/**
 * @method IsActive
 * @return {bool}
 */
IsActive : function (
)
{
    return false;
},

/**
 * @method SetFixedRotation
 * @param {bool} arg0
 */
SetFixedRotation : function (
bool 
)
{
},

/**
 * @method ApplyAngularImpulse
 * @param {float} arg0
 * @param {bool} arg1
 */
ApplyAngularImpulse : function (
float, 
bool 
)
{
},

/**
 * @method GetPosition
 * @return {b2Vec2}
 */
GetPosition : function (
)
{
    return b2Vec2;
},

};

/**
 * @class b2Fixture
 */
b2.Fixture = {

/**
 * @method GetRestitution
 * @return {float}
 */
GetRestitution : function (
)
{
    return 0;
},

/**
 * @method SetFilterData
 * @param {b2Filter} arg0
 */
SetFilterData : function (
b2filter 
)
{
},

/**
 * @method SetFriction
 * @param {float} arg0
 */
SetFriction : function (
float 
)
{
},

/**
 * @method GetShape
* @return {b2Shape|b2Shape}
*/
GetShape : function(
)
{
    return b2Shape;
},

/**
 * @method SetRestitution
 * @param {float} arg0
 */
SetRestitution : function (
float 
)
{
},

/**
 * @method GetBody
* @return {b2Body|b2Body}
*/
GetBody : function(
)
{
    return b2Body;
},

/**
 * @method GetNext
* @return {b2Fixture|b2Fixture}
*/
GetNext : function(
)
{
    return b2Fixture;
},

/**
 * @method GetFriction
 * @return {float}
 */
GetFriction : function (
)
{
    return 0;
},

/**
 * @method SetDensity
 * @param {float} arg0
 */
SetDensity : function (
float 
)
{
},

/**
 * @method GetMassData
 * @param {b2MassData} arg0
 */
GetMassData : function (
b2massdata 
)
{
},

/**
 * @method SetSensor
 * @param {bool} arg0
 */
SetSensor : function (
bool 
)
{
},

/**
 * @method GetAABB
 * @param {int} arg0
 * @return {b2AABB}
 */
GetAABB : function (
int 
)
{
    return b2AABB;
},

/**
 * @method TestPoint
 * @param {b2Vec2} arg0
 * @return {bool}
 */
TestPoint : function (
b2vec2 
)
{
    return false;
},

/**
 * @method RayCast
 * @param {b2RayCastOutput} arg0
 * @param {b2RayCastInput} arg1
 * @param {int} arg2
 * @return {bool}
 */
RayCast : function (
b2raycastoutput, 
b2raycastinput, 
int 
)
{
    return false;
},

/**
 * @method Refilter
 */
Refilter : function (
)
{
},

/**
 * @method Dump
 * @param {int} arg0
 */
Dump : function (
int 
)
{
},

/**
 * @method GetFilterData
 * @return {b2Filter}
 */
GetFilterData : function (
)
{
    return b2Filter;
},

/**
 * @method IsSensor
 * @return {bool}
 */
IsSensor : function (
)
{
    return false;
},

/**
 * @method GetType
 * @return {b2Shape::Type}
 */
GetType : function (
)
{
    return b2Shape::Type;
},

/**
 * @method GetDensity
 * @return {float}
 */
GetDensity : function (
)
{
    return 0;
},

};

/**
 * @class b2ContactListener
 */
b2.b2ContactListener = {

/**
 * @method EndContact
 * @param {b2Contact} arg0
 */
EndContact : function (
b2contact 
)
{
},

/**
 * @method PreSolve
 * @param {b2Contact} arg0
 * @param {b2Manifold} arg1
 */
PreSolve : function (
b2contact, 
b2manifold 
)
{
},

/**
 * @method BeginContact
 * @param {b2Contact} arg0
 */
BeginContact : function (
b2contact 
)
{
},

/**
 * @method PostSolve
 * @param {b2Contact} arg0
 * @param {b2ContactImpulse} arg1
 */
PostSolve : function (
b2contact, 
b2contactimpulse 
)
{
},

};

/**
 * @class b2QueryCallback
 */
b2.b2QueryCallback = {

/**
 * @method ReportFixture
 * @param {b2Fixture} arg0
 * @return {bool}
 */
ReportFixture : function (
b2fixture 
)
{
    return false;
},

};

/**
 * @class b2RayCastCallback
 */
b2.b2RayCastCallback = {

/**
 * @method ReportFixture
 * @param {b2Fixture} arg0
 * @param {b2Vec2} arg1
 * @param {b2Vec2} arg2
 * @param {float} arg3
 * @return {float}
 */
ReportFixture : function (
b2fixture, 
b2vec2, 
b2vec2, 
float 
)
{
    return 0;
},

};

/**
 * @class b2World
 */
b2.World = {

/**
 * @method ShiftOrigin
 * @param {b2Vec2} arg0
 */
ShiftOrigin : function (
b2vec2 
)
{
},

/**
 * @method QueryAABB
 * @param {b2QueryCallback} arg0
 * @param {b2AABB} arg1
 */
QueryAABB : function (
b2querycallback, 
b2aabb 
)
{
},

/**
 * @method SetSubStepping
 * @param {bool} arg0
 */
SetSubStepping : function (
bool 
)
{
},

/**
 * @method GetTreeQuality
 * @return {float}
 */
GetTreeQuality : function (
)
{
    return 0;
},

/**
 * @method GetTreeHeight
 * @return {int}
 */
GetTreeHeight : function (
)
{
    return 0;
},

/**
 * @method GetProfile
 * @return {b2Profile}
 */
GetProfile : function (
)
{
    return b2Profile;
},

/**
 * @method GetTreeBalance
 * @return {int}
 */
GetTreeBalance : function (
)
{
    return 0;
},

/**
 * @method GetSubStepping
 * @return {bool}
 */
GetSubStepping : function (
)
{
    return false;
},

/**
 * @method SetContactListener
 * @param {b2ContactListener} arg0
 */
SetContactListener : function (
b2contactlistener 
)
{
},

/**
 * @method DrawDebugData
 */
DrawDebugData : function (
)
{
},

/**
 * @method SetContinuousPhysics
 * @param {bool} arg0
 */
SetContinuousPhysics : function (
bool 
)
{
},

/**
 * @method SetGravity
 * @param {b2Vec2} arg0
 */
SetGravity : function (
b2vec2 
)
{
},

/**
 * @method GetBodyCount
 * @return {int}
 */
GetBodyCount : function (
)
{
    return 0;
},

/**
 * @method GetAutoClearForces
 * @return {bool}
 */
GetAutoClearForces : function (
)
{
    return false;
},

/**
 * @method GetContinuousPhysics
 * @return {bool}
 */
GetContinuousPhysics : function (
)
{
    return false;
},

/**
 * @method GetJointList
* @return {b2Joint|b2Joint}
*/
GetJointList : function(
)
{
    return b2Joint;
},

/**
 * @method GetBodyList
* @return {b2Body|b2Body}
*/
GetBodyList : function(
)
{
    return b2Body;
},

/**
 * @method SetDestructionListener
 * @param {b2DestructionListener} arg0
 */
SetDestructionListener : function (
b2destructionlistener 
)
{
},

/**
 * @method DestroyJoint
 * @param {b2Joint} arg0
 */
DestroyJoint : function (
b2joint 
)
{
},

/**
 * @method GetJointCount
 * @return {int}
 */
GetJointCount : function (
)
{
    return 0;
},

/**
 * @method Step
 * @param {float} arg0
 * @param {int} arg1
 * @param {int} arg2
 */
Step : function (
float, 
int, 
int 
)
{
},

/**
 * @method ClearForces
 */
ClearForces : function (
)
{
},

/**
 * @method GetWarmStarting
 * @return {bool}
 */
GetWarmStarting : function (
)
{
    return false;
},

/**
 * @method SetAllowSleeping
 * @param {bool} arg0
 */
SetAllowSleeping : function (
bool 
)
{
},

/**
 * @method DestroyBody
 * @param {b2Body} arg0
 */
DestroyBody : function (
b2body 
)
{
},

/**
 * @method GetAllowSleeping
 * @return {bool}
 */
GetAllowSleeping : function (
)
{
    return false;
},

/**
 * @method GetProxyCount
 * @return {int}
 */
GetProxyCount : function (
)
{
    return 0;
},

/**
 * @method RayCast
 * @param {b2RayCastCallback} arg0
 * @param {b2Vec2} arg1
 * @param {b2Vec2} arg2
 */
RayCast : function (
b2raycastcallback, 
b2vec2, 
b2vec2 
)
{
},

/**
 * @method IsLocked
 * @return {bool}
 */
IsLocked : function (
)
{
    return false;
},

/**
 * @method SetDebugDraw
 * @param {b2Draw} arg0
 */
SetDebugDraw : function (
b2draw 
)
{
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method SetAutoClearForces
 * @param {bool} arg0
 */
SetAutoClearForces : function (
bool 
)
{
},

/**
 * @method GetGravity
 * @return {b2Vec2}
 */
GetGravity : function (
)
{
    return b2Vec2;
},

/**
 * @method GetContactCount
 * @return {int}
 */
GetContactCount : function (
)
{
    return 0;
},

/**
 * @method SetWarmStarting
 * @param {bool} arg0
 */
SetWarmStarting : function (
bool 
)
{
},

/**
 * @method SetContactFilter
 * @param {b2ContactFilter} arg0
 */
SetContactFilter : function (
b2contactfilter 
)
{
},

/**
 * @method b2World
 * @constructor
 * @param {b2Vec2} arg0
 */
b2World : function (
b2vec2 
)
{
},

};

/**
 * @class b2Contact
 */
b2.Contact = {

/**
 * @method GetNext
* @return {b2Contact|b2Contact}
*/
GetNext : function(
)
{
    return b2Contact;
},

/**
 * @method SetEnabled
 * @param {bool} arg0
 */
SetEnabled : function (
bool 
)
{
},

/**
 * @method GetWorldManifold
 * @param {b2WorldManifold} arg0
 */
GetWorldManifold : function (
b2worldmanifold 
)
{
},

/**
 * @method GetRestitution
 * @return {float}
 */
GetRestitution : function (
)
{
    return 0;
},

/**
 * @method ResetFriction
 */
ResetFriction : function (
)
{
},

/**
 * @method GetFriction
 * @return {float}
 */
GetFriction : function (
)
{
    return 0;
},

/**
 * @method IsTouching
 * @return {bool}
 */
IsTouching : function (
)
{
    return false;
},

/**
 * @method IsEnabled
 * @return {bool}
 */
IsEnabled : function (
)
{
    return false;
},

/**
 * @method GetFixtureB
* @return {b2Fixture|b2Fixture}
*/
GetFixtureB : function(
)
{
    return b2Fixture;
},

/**
 * @method SetFriction
 * @param {float} arg0
 */
SetFriction : function (
float 
)
{
},

/**
 * @method GetFixtureA
* @return {b2Fixture|b2Fixture}
*/
GetFixtureA : function(
)
{
    return b2Fixture;
},

/**
 * @method GetChildIndexA
 * @return {int}
 */
GetChildIndexA : function (
)
{
    return 0;
},

/**
 * @method GetChildIndexB
 * @return {int}
 */
GetChildIndexB : function (
)
{
    return 0;
},

/**
 * @method SetTangentSpeed
 * @param {float} arg0
 */
SetTangentSpeed : function (
float 
)
{
},

/**
 * @method GetTangentSpeed
 * @return {float}
 */
GetTangentSpeed : function (
)
{
    return 0;
},

/**
 * @method SetRestitution
 * @param {float} arg0
 */
SetRestitution : function (
float 
)
{
},

/**
 * @method GetManifold
* @return {b2Manifold|b2Manifold}
*/
GetManifold : function(
)
{
    return b2Manifold;
},

/**
 * @method Evaluate
 * @param {b2Manifold} arg0
 * @param {b2Transform} arg1
 * @param {b2Transform} arg2
 */
Evaluate : function (
b2manifold, 
b2transform, 
b2transform 
)
{
},

/**
 * @method ResetRestitution
 */
ResetRestitution : function (
)
{
},

};

/**
 * @class b2Joint
 */
b2.Joint = {

/**
 * @method GetNext
* @return {b2Joint|b2Joint}
*/
GetNext : function(
)
{
    return b2Joint;
},

/**
 * @method GetBodyA
 * @return {b2Body}
 */
GetBodyA : function (
)
{
    return b2Body;
},

/**
 * @method GetBodyB
 * @return {b2Body}
 */
GetBodyB : function (
)
{
    return b2Body;
},

/**
 * @method GetReactionTorque
 * @param {float} arg0
 * @return {float}
 */
GetReactionTorque : function (
float 
)
{
    return 0;
},

/**
 * @method GetAnchorA
 * @return {b2Vec2}
 */
GetAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method ShiftOrigin
 * @param {b2Vec2} arg0
 */
ShiftOrigin : function (
b2vec2 
)
{
},

/**
 * @method GetType
 * @return {b2JointType}
 */
GetType : function (
)
{
    return b2JointType;
},

/**
 * @method GetCollideConnected
 * @return {bool}
 */
GetCollideConnected : function (
)
{
    return false;
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method GetAnchorB
 * @return {b2Vec2}
 */
GetAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionForce
 * @param {float} arg0
 * @return {b2Vec2}
 */
GetReactionForce : function (
float 
)
{
    return b2Vec2;
},

/**
 * @method IsActive
 * @return {bool}
 */
IsActive : function (
)
{
    return false;
},

};

/**
 * @class b2DistanceJoint
 */
b2.b2DistanceJoint = {

/**
 * @method SetDampingRatio
 * @param {float} arg0
 */
SetDampingRatio : function (
float 
)
{
},

/**
 * @method GetAnchorA
 * @return {b2Vec2}
 */
GetAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionTorque
 * @param {float} arg0
 * @return {float}
 */
GetReactionTorque : function (
float 
)
{
    return 0;
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method SetFrequency
 * @param {float} arg0
 */
SetFrequency : function (
float 
)
{
},

/**
 * @method GetLength
 * @return {float}
 */
GetLength : function (
)
{
    return 0;
},

/**
 * @method GetDampingRatio
 * @return {float}
 */
GetDampingRatio : function (
)
{
    return 0;
},

/**
 * @method GetFrequency
 * @return {float}
 */
GetFrequency : function (
)
{
    return 0;
},

/**
 * @method GetLocalAnchorA
 * @return {b2Vec2}
 */
GetLocalAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetLocalAnchorB
 * @return {b2Vec2}
 */
GetLocalAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetAnchorB
 * @return {b2Vec2}
 */
GetAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionForce
 * @param {float} arg0
 * @return {b2Vec2}
 */
GetReactionForce : function (
float 
)
{
    return b2Vec2;
},

/**
 * @method SetLength
 * @param {float} arg0
 */
SetLength : function (
float 
)
{
},

};

/**
 * @class b2FrictionJoint
 */
b2.b2FrictionJoint = {

/**
 * @method SetMaxTorque
 * @param {float} arg0
 */
SetMaxTorque : function (
float 
)
{
},

/**
 * @method GetMaxForce
 * @return {float}
 */
GetMaxForce : function (
)
{
    return 0;
},

/**
 * @method GetAnchorA
 * @return {b2Vec2}
 */
GetAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionTorque
 * @param {float} arg0
 * @return {float}
 */
GetReactionTorque : function (
float 
)
{
    return 0;
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method SetMaxForce
 * @param {float} arg0
 */
SetMaxForce : function (
float 
)
{
},

/**
 * @method GetLocalAnchorA
 * @return {b2Vec2}
 */
GetLocalAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetLocalAnchorB
 * @return {b2Vec2}
 */
GetLocalAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetAnchorB
 * @return {b2Vec2}
 */
GetAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionForce
 * @param {float} arg0
 * @return {b2Vec2}
 */
GetReactionForce : function (
float 
)
{
    return b2Vec2;
},

/**
 * @method GetMaxTorque
 * @return {float}
 */
GetMaxTorque : function (
)
{
    return 0;
},

};

/**
 * @class b2GearJoint
 */
b2.b2GearJoint = {

/**
 * @method GetJoint1
 * @return {b2Joint}
 */
GetJoint1 : function (
)
{
    return b2Joint;
},

/**
 * @method GetAnchorA
 * @return {b2Vec2}
 */
GetAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetJoint2
 * @return {b2Joint}
 */
GetJoint2 : function (
)
{
    return b2Joint;
},

/**
 * @method GetReactionTorque
 * @param {float} arg0
 * @return {float}
 */
GetReactionTorque : function (
float 
)
{
    return 0;
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method SetRatio
 * @param {float} arg0
 */
SetRatio : function (
float 
)
{
},

/**
 * @method GetAnchorB
 * @return {b2Vec2}
 */
GetAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionForce
 * @param {float} arg0
 * @return {b2Vec2}
 */
GetReactionForce : function (
float 
)
{
    return b2Vec2;
},

/**
 * @method GetRatio
 * @return {float}
 */
GetRatio : function (
)
{
    return 0;
},

};

/**
 * @class b2MotorJoint
 */
b2.b2MotorJoint = {

/**
 * @method SetMaxTorque
 * @param {float} arg0
 */
SetMaxTorque : function (
float 
)
{
},

/**
 * @method GetAnchorA
 * @return {b2Vec2}
 */
GetAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionTorque
 * @param {float} arg0
 * @return {float}
 */
GetReactionTorque : function (
float 
)
{
    return 0;
},

/**
 * @method GetCorrectionFactor
 * @return {float}
 */
GetCorrectionFactor : function (
)
{
    return 0;
},

/**
 * @method SetMaxForce
 * @param {float} arg0
 */
SetMaxForce : function (
float 
)
{
},

/**
 * @method SetLinearOffset
 * @param {b2Vec2} arg0
 */
SetLinearOffset : function (
b2vec2 
)
{
},

/**
 * @method GetMaxForce
 * @return {float}
 */
GetMaxForce : function (
)
{
    return 0;
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method SetAngularOffset
 * @param {float} arg0
 */
SetAngularOffset : function (
float 
)
{
},

/**
 * @method GetAnchorB
 * @return {b2Vec2}
 */
GetAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionForce
 * @param {float} arg0
 * @return {b2Vec2}
 */
GetReactionForce : function (
float 
)
{
    return b2Vec2;
},

/**
 * @method GetAngularOffset
 * @return {float}
 */
GetAngularOffset : function (
)
{
    return 0;
},

/**
 * @method GetLinearOffset
 * @return {b2Vec2}
 */
GetLinearOffset : function (
)
{
    return b2Vec2;
},

/**
 * @method GetMaxTorque
 * @return {float}
 */
GetMaxTorque : function (
)
{
    return 0;
},

/**
 * @method SetCorrectionFactor
 * @param {float} arg0
 */
SetCorrectionFactor : function (
float 
)
{
},

};

/**
 * @class b2MouseJoint
 */
b2.b2MouseJoint = {

/**
 * @method SetDampingRatio
 * @param {float} arg0
 */
SetDampingRatio : function (
float 
)
{
},

/**
 * @method GetAnchorA
 * @return {b2Vec2}
 */
GetAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionTorque
 * @param {float} arg0
 * @return {float}
 */
GetReactionTorque : function (
float 
)
{
    return 0;
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method SetFrequency
 * @param {float} arg0
 */
SetFrequency : function (
float 
)
{
},

/**
 * @method GetDampingRatio
 * @return {float}
 */
GetDampingRatio : function (
)
{
    return 0;
},

/**
 * @method SetTarget
 * @param {b2Vec2} arg0
 */
SetTarget : function (
b2vec2 
)
{
},

/**
 * @method SetMaxForce
 * @param {float} arg0
 */
SetMaxForce : function (
float 
)
{
},

/**
 * @method GetFrequency
 * @return {float}
 */
GetFrequency : function (
)
{
    return 0;
},

/**
 * @method GetTarget
 * @return {b2Vec2}
 */
GetTarget : function (
)
{
    return b2Vec2;
},

/**
 * @method GetMaxForce
 * @return {float}
 */
GetMaxForce : function (
)
{
    return 0;
},

/**
 * @method GetAnchorB
 * @return {b2Vec2}
 */
GetAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionForce
 * @param {float} arg0
 * @return {b2Vec2}
 */
GetReactionForce : function (
float 
)
{
    return b2Vec2;
},

/**
 * @method ShiftOrigin
 * @param {b2Vec2} arg0
 */
ShiftOrigin : function (
b2vec2 
)
{
},

};

/**
 * @class b2PrismaticJoint
 */
b2.b2PrismaticJoint = {

/**
 * @method GetLocalAxisA
 * @return {b2Vec2}
 */
GetLocalAxisA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetLowerLimit
 * @return {float}
 */
GetLowerLimit : function (
)
{
    return 0;
},

/**
 * @method GetAnchorA
 * @return {b2Vec2}
 */
GetAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetLocalAnchorA
 * @return {b2Vec2}
 */
GetLocalAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method SetMotorSpeed
 * @param {float} arg0
 */
SetMotorSpeed : function (
float 
)
{
},

/**
 * @method GetLocalAnchorB
 * @return {b2Vec2}
 */
GetLocalAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetMotorSpeed
 * @return {float}
 */
GetMotorSpeed : function (
)
{
    return 0;
},

/**
 * @method SetMaxMotorForce
 * @param {float} arg0
 */
SetMaxMotorForce : function (
float 
)
{
},

/**
 * @method EnableLimit
 * @param {bool} arg0
 */
EnableLimit : function (
bool 
)
{
},

/**
 * @method IsMotorEnabled
 * @return {bool}
 */
IsMotorEnabled : function (
)
{
    return false;
},

/**
 * @method GetReactionForce
 * @param {float} arg0
 * @return {b2Vec2}
 */
GetReactionForce : function (
float 
)
{
    return b2Vec2;
},

/**
 * @method GetMaxMotorForce
 * @return {float}
 */
GetMaxMotorForce : function (
)
{
    return 0;
},

/**
 * @method GetJointSpeed
 * @return {float}
 */
GetJointSpeed : function (
)
{
    return 0;
},

/**
 * @method EnableMotor
 * @param {bool} arg0
 */
EnableMotor : function (
bool 
)
{
},

/**
 * @method GetReferenceAngle
 * @return {float}
 */
GetReferenceAngle : function (
)
{
    return 0;
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method GetMotorForce
 * @param {float} arg0
 * @return {float}
 */
GetMotorForce : function (
float 
)
{
    return 0;
},

/**
 * @method GetJointTranslation
 * @return {float}
 */
GetJointTranslation : function (
)
{
    return 0;
},

/**
 * @method IsLimitEnabled
 * @return {bool}
 */
IsLimitEnabled : function (
)
{
    return false;
},

/**
 * @method GetReactionTorque
 * @param {float} arg0
 * @return {float}
 */
GetReactionTorque : function (
float 
)
{
    return 0;
},

/**
 * @method SetLimits
 * @param {float} arg0
 * @param {float} arg1
 */
SetLimits : function (
float, 
float 
)
{
},

/**
 * @method GetUpperLimit
 * @return {float}
 */
GetUpperLimit : function (
)
{
    return 0;
},

/**
 * @method GetAnchorB
 * @return {b2Vec2}
 */
GetAnchorB : function (
)
{
    return b2Vec2;
},

};

/**
 * @class b2PulleyJoint
 */
b2.b2PulleyJoint = {

/**
 * @method GetCurrentLengthA
 * @return {float}
 */
GetCurrentLengthA : function (
)
{
    return 0;
},

/**
 * @method GetAnchorA
 * @return {b2Vec2}
 */
GetAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetGroundAnchorB
 * @return {b2Vec2}
 */
GetGroundAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionTorque
 * @param {float} arg0
 * @return {float}
 */
GetReactionTorque : function (
float 
)
{
    return 0;
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method GetGroundAnchorA
 * @return {b2Vec2}
 */
GetGroundAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetLengthB
 * @return {float}
 */
GetLengthB : function (
)
{
    return 0;
},

/**
 * @method GetLengthA
 * @return {float}
 */
GetLengthA : function (
)
{
    return 0;
},

/**
 * @method GetCurrentLengthB
 * @return {float}
 */
GetCurrentLengthB : function (
)
{
    return 0;
},

/**
 * @method GetAnchorB
 * @return {b2Vec2}
 */
GetAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionForce
 * @param {float} arg0
 * @return {b2Vec2}
 */
GetReactionForce : function (
float 
)
{
    return b2Vec2;
},

/**
 * @method ShiftOrigin
 * @param {b2Vec2} arg0
 */
ShiftOrigin : function (
b2vec2 
)
{
},

/**
 * @method GetRatio
 * @return {float}
 */
GetRatio : function (
)
{
    return 0;
},

};

/**
 * @class b2RevoluteJoint
 */
b2.b2RevoluteJoint = {

/**
 * @method GetLowerLimit
 * @return {float}
 */
GetLowerLimit : function (
)
{
    return 0;
},

/**
 * @method GetAnchorA
 * @return {b2Vec2}
 */
GetAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetLocalAnchorA
 * @return {b2Vec2}
 */
GetLocalAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method SetMotorSpeed
 * @param {float} arg0
 */
SetMotorSpeed : function (
float 
)
{
},

/**
 * @method GetLocalAnchorB
 * @return {b2Vec2}
 */
GetLocalAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetJointAngle
 * @return {float}
 */
GetJointAngle : function (
)
{
    return 0;
},

/**
 * @method GetMotorSpeed
 * @return {float}
 */
GetMotorSpeed : function (
)
{
    return 0;
},

/**
 * @method GetMotorTorque
 * @param {float} arg0
 * @return {float}
 */
GetMotorTorque : function (
float 
)
{
    return 0;
},

/**
 * @method IsLimitEnabled
 * @return {bool}
 */
IsLimitEnabled : function (
)
{
    return false;
},

/**
 * @method EnableLimit
 * @param {bool} arg0
 */
EnableLimit : function (
bool 
)
{
},

/**
 * @method IsMotorEnabled
 * @return {bool}
 */
IsMotorEnabled : function (
)
{
    return false;
},

/**
 * @method GetReactionForce
 * @param {float} arg0
 * @return {b2Vec2}
 */
GetReactionForce : function (
float 
)
{
    return b2Vec2;
},

/**
 * @method SetMaxMotorTorque
 * @param {float} arg0
 */
SetMaxMotorTorque : function (
float 
)
{
},

/**
 * @method GetJointSpeed
 * @return {float}
 */
GetJointSpeed : function (
)
{
    return 0;
},

/**
 * @method EnableMotor
 * @param {bool} arg0
 */
EnableMotor : function (
bool 
)
{
},

/**
 * @method GetReferenceAngle
 * @return {float}
 */
GetReferenceAngle : function (
)
{
    return 0;
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method SetLimits
 * @param {float} arg0
 * @param {float} arg1
 */
SetLimits : function (
float, 
float 
)
{
},

/**
 * @method GetMaxMotorTorque
 * @return {float}
 */
GetMaxMotorTorque : function (
)
{
    return 0;
},

/**
 * @method GetReactionTorque
 * @param {float} arg0
 * @return {float}
 */
GetReactionTorque : function (
float 
)
{
    return 0;
},

/**
 * @method GetUpperLimit
 * @return {float}
 */
GetUpperLimit : function (
)
{
    return 0;
},

/**
 * @method GetAnchorB
 * @return {b2Vec2}
 */
GetAnchorB : function (
)
{
    return b2Vec2;
},

};

/**
 * @class b2RopeJoint
 */
b2.b2RopeJoint = {

/**
 * @method GetAnchorA
 * @return {b2Vec2}
 */
GetAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionTorque
 * @param {float} arg0
 * @return {float}
 */
GetReactionTorque : function (
float 
)
{
    return 0;
},

/**
 * @method GetMaxLength
 * @return {float}
 */
GetMaxLength : function (
)
{
    return 0;
},

/**
 * @method GetLocalAnchorA
 * @return {b2Vec2}
 */
GetLocalAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method SetMaxLength
 * @param {float} arg0
 */
SetMaxLength : function (
float 
)
{
},

/**
 * @method GetLocalAnchorB
 * @return {b2Vec2}
 */
GetLocalAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetAnchorB
 * @return {b2Vec2}
 */
GetAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionForce
 * @param {float} arg0
 * @return {b2Vec2}
 */
GetReactionForce : function (
float 
)
{
    return b2Vec2;
},

/**
 * @method GetLimitState
 * @return {b2LimitState}
 */
GetLimitState : function (
)
{
    return b2LimitState;
},

};

/**
 * @class b2WeldJoint
 */
b2.b2WeldJoint = {

/**
 * @method SetDampingRatio
 * @param {float} arg0
 */
SetDampingRatio : function (
float 
)
{
},

/**
 * @method GetAnchorA
 * @return {b2Vec2}
 */
GetAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionTorque
 * @param {float} arg0
 * @return {float}
 */
GetReactionTorque : function (
float 
)
{
    return 0;
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method SetFrequency
 * @param {float} arg0
 */
SetFrequency : function (
float 
)
{
},

/**
 * @method GetDampingRatio
 * @return {float}
 */
GetDampingRatio : function (
)
{
    return 0;
},

/**
 * @method GetFrequency
 * @return {float}
 */
GetFrequency : function (
)
{
    return 0;
},

/**
 * @method GetLocalAnchorA
 * @return {b2Vec2}
 */
GetLocalAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetLocalAnchorB
 * @return {b2Vec2}
 */
GetLocalAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetAnchorB
 * @return {b2Vec2}
 */
GetAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionForce
 * @param {float} arg0
 * @return {b2Vec2}
 */
GetReactionForce : function (
float 
)
{
    return b2Vec2;
},

/**
 * @method GetReferenceAngle
 * @return {float}
 */
GetReferenceAngle : function (
)
{
    return 0;
},

};

/**
 * @class b2WheelJoint
 */
b2.b2WheelJoint = {

/**
 * @method IsMotorEnabled
 * @return {bool}
 */
IsMotorEnabled : function (
)
{
    return false;
},

/**
 * @method GetMotorSpeed
 * @return {float}
 */
GetMotorSpeed : function (
)
{
    return 0;
},

/**
 * @method GetAnchorA
 * @return {b2Vec2}
 */
GetAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionTorque
 * @param {float} arg0
 * @return {float}
 */
GetReactionTorque : function (
float 
)
{
    return 0;
},

/**
 * @method Dump
 */
Dump : function (
)
{
},

/**
 * @method SetSpringDampingRatio
 * @param {float} arg0
 */
SetSpringDampingRatio : function (
float 
)
{
},

/**
 * @method GetSpringFrequencyHz
 * @return {float}
 */
GetSpringFrequencyHz : function (
)
{
    return 0;
},

/**
 * @method GetJointTranslation
 * @return {float}
 */
GetJointTranslation : function (
)
{
    return 0;
},

/**
 * @method GetSpringDampingRatio
 * @return {float}
 */
GetSpringDampingRatio : function (
)
{
    return 0;
},

/**
 * @method GetLocalAxisA
 * @return {b2Vec2}
 */
GetLocalAxisA : function (
)
{
    return b2Vec2;
},

/**
 * @method SetSpringFrequencyHz
 * @param {float} arg0
 */
SetSpringFrequencyHz : function (
float 
)
{
},

/**
 * @method GetLocalAnchorA
 * @return {b2Vec2}
 */
GetLocalAnchorA : function (
)
{
    return b2Vec2;
},

/**
 * @method SetMotorSpeed
 * @param {float} arg0
 */
SetMotorSpeed : function (
float 
)
{
},

/**
 * @method GetLocalAnchorB
 * @return {b2Vec2}
 */
GetLocalAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method SetMaxMotorTorque
 * @param {float} arg0
 */
SetMaxMotorTorque : function (
float 
)
{
},

/**
 * @method GetAnchorB
 * @return {b2Vec2}
 */
GetAnchorB : function (
)
{
    return b2Vec2;
},

/**
 * @method GetReactionForce
 * @param {float} arg0
 * @return {b2Vec2}
 */
GetReactionForce : function (
float 
)
{
    return b2Vec2;
},

/**
 * @method GetMotorTorque
 * @param {float} arg0
 * @return {float}
 */
GetMotorTorque : function (
float 
)
{
    return 0;
},

/**
 * @method GetJointSpeed
 * @return {float}
 */
GetJointSpeed : function (
)
{
    return 0;
},

/**
 * @method GetMaxMotorTorque
 * @return {float}
 */
GetMaxMotorTorque : function (
)
{
    return 0;
},

/**
 * @method EnableMotor
 * @param {bool} arg0
 */
EnableMotor : function (
bool 
)
{
},

};
