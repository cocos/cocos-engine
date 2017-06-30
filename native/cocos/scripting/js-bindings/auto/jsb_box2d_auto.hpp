#include "base/ccConfig.h"
#ifndef __box2dclasses_h__
#define __box2dclasses_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_b2Draw_class;
extern JS::PersistentRootedObject *jsb_b2Draw_prototype;

bool js_box2dclasses_b2Draw_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2Draw_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2Draw(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2Draw_AppendFlags(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Draw_DrawTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Draw_ClearFlags(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Draw_DrawPolygon(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Draw_ClearDraw(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Draw_DrawSolidPolygon(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Draw_DrawCircle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Draw_SetFlags(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Draw_DrawSegment(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Draw_DrawSolidCircle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Draw_GetFlags(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2Shape_class;
extern JS::PersistentRootedObject *jsb_b2Shape_prototype;

bool js_box2dclasses_b2Shape_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2Shape_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2Shape(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2Shape_ComputeMass(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Shape_Clone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Shape_GetType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Shape_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Shape_ComputeAABB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Shape_GetChildCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Shape_TestPoint(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2CircleShape_class;
extern JS::PersistentRootedObject *jsb_b2CircleShape_prototype;

bool js_box2dclasses_b2CircleShape_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2CircleShape_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2CircleShape(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2CircleShape_ComputeMass(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2CircleShape_GetVertex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2CircleShape_Clone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2CircleShape_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2CircleShape_ComputeAABB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2CircleShape_GetVertexCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2CircleShape_GetChildCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2CircleShape_TestPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2CircleShape_GetSupportVertex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2CircleShape_GetSupport(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2CircleShape_b2CircleShape(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2EdgeShape_class;
extern JS::PersistentRootedObject *jsb_b2EdgeShape_prototype;

bool js_box2dclasses_b2EdgeShape_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2EdgeShape_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2EdgeShape(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2EdgeShape_Set(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2EdgeShape_ComputeMass(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2EdgeShape_Clone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2EdgeShape_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2EdgeShape_ComputeAABB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2EdgeShape_GetChildCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2EdgeShape_TestPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2EdgeShape_b2EdgeShape(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2ChainShape_class;
extern JS::PersistentRootedObject *jsb_b2ChainShape_prototype;

bool js_box2dclasses_b2ChainShape_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2ChainShape_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2ChainShape(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2ChainShape_ComputeMass(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ChainShape_Clear(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ChainShape_TestPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ChainShape_GetChildEdge(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ChainShape_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ChainShape_ComputeAABB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ChainShape_GetChildCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ChainShape_SetPrevVertex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ChainShape_SetNextVertex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ChainShape_Clone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ChainShape_b2ChainShape(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2PolygonShape_class;
extern JS::PersistentRootedObject *jsb_b2PolygonShape_prototype;

bool js_box2dclasses_b2PolygonShape_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2PolygonShape_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2PolygonShape(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2PolygonShape_ComputeMass(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PolygonShape_GetVertex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PolygonShape_Clone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PolygonShape_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PolygonShape_ComputeAABB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PolygonShape_GetVertexCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PolygonShape_GetChildCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PolygonShape_TestPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PolygonShape_Validate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PolygonShape_b2PolygonShape(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2Body_class;
extern JS::PersistentRootedObject *jsb_b2Body_prototype;

bool js_box2dclasses_b2Body_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2Body_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2Body(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2Body_GetAngle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_IsSleepingAllowed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetAngularDamping(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetActive(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetGravityScale(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetAngularVelocity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetFixtureList(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_ApplyForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetLocalPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetLinearVelocity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetLinearVelocity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetNext(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetSleepingAllowed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetMass(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetAngularVelocity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetMassData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_ResetMassData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_ApplyForceToCenter(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_ApplyTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_IsAwake(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetMassData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetTransform(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetWorldCenter(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetAngularDamping(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_ApplyLinearImpulse(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_IsFixedRotation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetLocalCenter(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetWorldVector(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetContactList(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetWorldPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetAwake(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetLinearDamping(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_IsBullet(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetWorld(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetLocalVector(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetLinearDamping(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetBullet(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetGravityScale(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_DestroyFixture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetInertia(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_IsActive(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_SetFixedRotation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_ApplyAngularImpulse(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Body_GetPosition(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2Fixture_class;
extern JS::PersistentRootedObject *jsb_b2Fixture_prototype;

bool js_box2dclasses_b2Fixture_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2Fixture_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2Fixture(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2Fixture_GetRestitution(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_SetFilterData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_SetFriction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_GetShape(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_SetRestitution(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_GetBody(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_GetNext(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_GetFriction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_SetDensity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_GetMassData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_SetSensor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_GetAABB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_TestPoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_Refilter(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_GetFilterData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_IsSensor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_GetType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Fixture_GetDensity(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2ContactListener_class;
extern JS::PersistentRootedObject *jsb_b2ContactListener_prototype;

bool js_box2dclasses_b2ContactListener_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2ContactListener_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2ContactListener(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2ContactListener_EndContact(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ContactListener_PreSolve(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ContactListener_BeginContact(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2ContactListener_PostSolve(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2QueryCallback_class;
extern JS::PersistentRootedObject *jsb_b2QueryCallback_prototype;

bool js_box2dclasses_b2QueryCallback_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2QueryCallback_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2QueryCallback(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2QueryCallback_ReportFixture(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2RayCastCallback_class;
extern JS::PersistentRootedObject *jsb_b2RayCastCallback_prototype;

bool js_box2dclasses_b2RayCastCallback_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2RayCastCallback_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2RayCastCallback(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2RayCastCallback_ReportFixture(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2World_class;
extern JS::PersistentRootedObject *jsb_b2World_prototype;

bool js_box2dclasses_b2World_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2World_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2World(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2World_ShiftOrigin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_QueryAABB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_SetSubStepping(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetTreeQuality(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetTreeHeight(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetProfile(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetTreeBalance(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetSubStepping(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_SetContactListener(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_DrawDebugData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_SetContinuousPhysics(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_SetGravity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetBodyCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetAutoClearForces(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetContinuousPhysics(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetJointList(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetBodyList(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_SetDestructionListener(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_DestroyJoint(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetJointCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_Step(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_ClearForces(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetWarmStarting(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_SetAllowSleeping(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_DestroyBody(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetAllowSleeping(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetProxyCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_RayCast(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_IsLocked(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetContactList(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_SetDebugDraw(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_SetAutoClearForces(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetGravity(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_GetContactCount(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_SetWarmStarting(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_SetContactFilter(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2World_b2World(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2Contact_class;
extern JS::PersistentRootedObject *jsb_b2Contact_prototype;

bool js_box2dclasses_b2Contact_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2Contact_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2Contact(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2Contact_GetNext(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_SetEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_GetWorldManifold(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_GetRestitution(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_ResetFriction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_GetFriction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_IsTouching(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_IsEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_GetFixtureB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_SetFriction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_GetFixtureA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_GetChildIndexA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_GetChildIndexB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_SetTangentSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_GetTangentSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_SetRestitution(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_GetManifold(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_Evaluate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Contact_ResetRestitution(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2Joint_class;
extern JS::PersistentRootedObject *jsb_b2Joint_prototype;

bool js_box2dclasses_b2Joint_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2Joint_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2Joint(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2Joint_GetNext(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Joint_GetBodyA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Joint_GetBodyB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Joint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Joint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Joint_ShiftOrigin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Joint_GetType(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Joint_GetCollideConnected(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Joint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Joint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Joint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2Joint_IsActive(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2DistanceJoint_class;
extern JS::PersistentRootedObject *jsb_b2DistanceJoint_prototype;

bool js_box2dclasses_b2DistanceJoint_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2DistanceJoint_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2DistanceJoint(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2DistanceJoint_SetDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2DistanceJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2DistanceJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2DistanceJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2DistanceJoint_SetFrequency(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2DistanceJoint_GetLength(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2DistanceJoint_GetDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2DistanceJoint_GetFrequency(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2DistanceJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2DistanceJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2DistanceJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2DistanceJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2DistanceJoint_SetLength(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2FrictionJoint_class;
extern JS::PersistentRootedObject *jsb_b2FrictionJoint_prototype;

bool js_box2dclasses_b2FrictionJoint_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2FrictionJoint_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2FrictionJoint(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2FrictionJoint_SetMaxTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2FrictionJoint_GetMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2FrictionJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2FrictionJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2FrictionJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2FrictionJoint_SetMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2FrictionJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2FrictionJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2FrictionJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2FrictionJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2FrictionJoint_GetMaxTorque(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2GearJoint_class;
extern JS::PersistentRootedObject *jsb_b2GearJoint_prototype;

bool js_box2dclasses_b2GearJoint_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2GearJoint_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2GearJoint(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2GearJoint_GetJoint1(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2GearJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2GearJoint_GetJoint2(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2GearJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2GearJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2GearJoint_SetRatio(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2GearJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2GearJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2GearJoint_GetRatio(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2MotorJoint_class;
extern JS::PersistentRootedObject *jsb_b2MotorJoint_prototype;

bool js_box2dclasses_b2MotorJoint_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2MotorJoint_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2MotorJoint(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2MotorJoint_SetMaxTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_GetCorrectionFactor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_SetMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_SetLinearOffset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_GetMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_SetAngularOffset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_GetAngularOffset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_GetLinearOffset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_GetMaxTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MotorJoint_SetCorrectionFactor(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2MouseJoint_class;
extern JS::PersistentRootedObject *jsb_b2MouseJoint_prototype;

bool js_box2dclasses_b2MouseJoint_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2MouseJoint_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2MouseJoint(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2MouseJoint_SetDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_SetFrequency(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_GetDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_SetTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_SetMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_GetFrequency(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_GetTarget(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_GetMaxForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2MouseJoint_ShiftOrigin(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2PrismaticJoint_class;
extern JS::PersistentRootedObject *jsb_b2PrismaticJoint_prototype;

bool js_box2dclasses_b2PrismaticJoint_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2PrismaticJoint_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2PrismaticJoint(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2PrismaticJoint_GetLocalAxisA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetLowerLimit(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_SetMotorSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetMotorSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_SetMaxMotorForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_EnableLimit(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_IsMotorEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetMaxMotorForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetJointSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_EnableMotor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetReferenceAngle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetMotorForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetJointTranslation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_IsLimitEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_SetLimits(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetUpperLimit(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PrismaticJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2PulleyJoint_class;
extern JS::PersistentRootedObject *jsb_b2PulleyJoint_prototype;

bool js_box2dclasses_b2PulleyJoint_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2PulleyJoint_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2PulleyJoint(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2PulleyJoint_GetCurrentLengthA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PulleyJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PulleyJoint_GetGroundAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PulleyJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PulleyJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PulleyJoint_GetGroundAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PulleyJoint_GetLengthB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PulleyJoint_GetLengthA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PulleyJoint_GetCurrentLengthB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PulleyJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PulleyJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PulleyJoint_ShiftOrigin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2PulleyJoint_GetRatio(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2RevoluteJoint_class;
extern JS::PersistentRootedObject *jsb_b2RevoluteJoint_prototype;

bool js_box2dclasses_b2RevoluteJoint_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2RevoluteJoint_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2RevoluteJoint(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2RevoluteJoint_GetLowerLimit(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_SetMotorSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetJointAngle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetMotorSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetMotorTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_IsLimitEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_EnableLimit(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_IsMotorEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_SetMaxMotorTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetJointSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_EnableMotor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetReferenceAngle(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_SetLimits(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetMaxMotorTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetUpperLimit(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RevoluteJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2RopeJoint_class;
extern JS::PersistentRootedObject *jsb_b2RopeJoint_prototype;

bool js_box2dclasses_b2RopeJoint_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2RopeJoint_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2RopeJoint(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2RopeJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RopeJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RopeJoint_GetMaxLength(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RopeJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RopeJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RopeJoint_SetMaxLength(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RopeJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RopeJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RopeJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2RopeJoint_GetLimitState(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2WeldJoint_class;
extern JS::PersistentRootedObject *jsb_b2WeldJoint_prototype;

bool js_box2dclasses_b2WeldJoint_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2WeldJoint_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2WeldJoint(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2WeldJoint_SetDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WeldJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WeldJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WeldJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WeldJoint_SetFrequency(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WeldJoint_GetDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WeldJoint_GetFrequency(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WeldJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WeldJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WeldJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WeldJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WeldJoint_GetReferenceAngle(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_b2WheelJoint_class;
extern JS::PersistentRootedObject *jsb_b2WheelJoint_prototype;

bool js_box2dclasses_b2WheelJoint_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_box2dclasses_b2WheelJoint_finalize(JSContext *cx, JSObject *obj);
void js_register_box2dclasses_b2WheelJoint(JSContext *cx, JS::HandleObject global);
void register_all_box2dclasses(JSContext* cx, JS::HandleObject obj);
bool js_box2dclasses_b2WheelJoint_IsMotorEnabled(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetMotorSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetReactionTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_Dump(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_SetSpringDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetSpringFrequencyHz(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetJointTranslation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetSpringDampingRatio(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetLocalAxisA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_SetSpringFrequencyHz(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetLocalAnchorA(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_SetMotorSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetLocalAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_SetMaxMotorTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetAnchorB(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetReactionForce(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetMotorTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetJointSpeed(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_GetMaxMotorTorque(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_box2dclasses_b2WheelJoint_EnableMotor(JSContext *cx, uint32_t argc, JS::Value *vp);

#endif // __box2dclasses_h__
