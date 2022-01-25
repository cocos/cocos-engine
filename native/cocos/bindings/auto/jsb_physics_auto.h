/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/bindings/auto/jsb_scene_auto.h"
#include "cocos/physics/PhysicsSDK.h"

extern se::Object* __jsb_cc_physics_RevoluteJoint_proto;
extern se::Class* __jsb_cc_physics_RevoluteJoint_class;

bool js_register_cc_physics_RevoluteJoint(se::Object* obj);
bool register_all_physics(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::physics::RevoluteJoint);
SE_DECLARE_FUNC(js_physics_RevoluteJoint_getImpl);
SE_DECLARE_FUNC(js_physics_RevoluteJoint_initialize);
SE_DECLARE_FUNC(js_physics_RevoluteJoint_onDestroy);
SE_DECLARE_FUNC(js_physics_RevoluteJoint_onDisable);
SE_DECLARE_FUNC(js_physics_RevoluteJoint_onEnable);
SE_DECLARE_FUNC(js_physics_RevoluteJoint_setAxis);
SE_DECLARE_FUNC(js_physics_RevoluteJoint_setConnectedBody);
SE_DECLARE_FUNC(js_physics_RevoluteJoint_setEnableCollision);
SE_DECLARE_FUNC(js_physics_RevoluteJoint_setPivotA);
SE_DECLARE_FUNC(js_physics_RevoluteJoint_setPivotB);
SE_DECLARE_FUNC(js_physics_RevoluteJoint_RevoluteJoint);

extern se::Object* __jsb_cc_physics_DistanceJoint_proto;
extern se::Class* __jsb_cc_physics_DistanceJoint_class;

bool js_register_cc_physics_DistanceJoint(se::Object* obj);
bool register_all_physics(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::physics::DistanceJoint);
SE_DECLARE_FUNC(js_physics_DistanceJoint_getImpl);
SE_DECLARE_FUNC(js_physics_DistanceJoint_initialize);
SE_DECLARE_FUNC(js_physics_DistanceJoint_onDestroy);
SE_DECLARE_FUNC(js_physics_DistanceJoint_onDisable);
SE_DECLARE_FUNC(js_physics_DistanceJoint_onEnable);
SE_DECLARE_FUNC(js_physics_DistanceJoint_setConnectedBody);
SE_DECLARE_FUNC(js_physics_DistanceJoint_setEnableCollision);
SE_DECLARE_FUNC(js_physics_DistanceJoint_setPivotA);
SE_DECLARE_FUNC(js_physics_DistanceJoint_setPivotB);
SE_DECLARE_FUNC(js_physics_DistanceJoint_DistanceJoint);

extern se::Object* __jsb_cc_physics_RigidBody_proto;
extern se::Class* __jsb_cc_physics_RigidBody_class;

bool js_register_cc_physics_RigidBody(se::Object* obj);
bool register_all_physics(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::physics::RigidBody);
SE_DECLARE_FUNC(js_physics_RigidBody_applyForce);
SE_DECLARE_FUNC(js_physics_RigidBody_applyImpulse);
SE_DECLARE_FUNC(js_physics_RigidBody_applyLocalForce);
SE_DECLARE_FUNC(js_physics_RigidBody_applyLocalImpulse);
SE_DECLARE_FUNC(js_physics_RigidBody_applyLocalTorque);
SE_DECLARE_FUNC(js_physics_RigidBody_applyTorque);
SE_DECLARE_FUNC(js_physics_RigidBody_clearForces);
SE_DECLARE_FUNC(js_physics_RigidBody_clearState);
SE_DECLARE_FUNC(js_physics_RigidBody_clearVelocity);
SE_DECLARE_FUNC(js_physics_RigidBody_getAngularVelocity);
SE_DECLARE_FUNC(js_physics_RigidBody_getGroup);
SE_DECLARE_FUNC(js_physics_RigidBody_getImpl);
SE_DECLARE_FUNC(js_physics_RigidBody_getLinearVelocity);
SE_DECLARE_FUNC(js_physics_RigidBody_getMask);
SE_DECLARE_FUNC(js_physics_RigidBody_getNodeHandle);
SE_DECLARE_FUNC(js_physics_RigidBody_getSleepThreshold);
SE_DECLARE_FUNC(js_physics_RigidBody_initialize);
SE_DECLARE_FUNC(js_physics_RigidBody_isAwake);
SE_DECLARE_FUNC(js_physics_RigidBody_isSleeping);
SE_DECLARE_FUNC(js_physics_RigidBody_isSleepy);
SE_DECLARE_FUNC(js_physics_RigidBody_onDestroy);
SE_DECLARE_FUNC(js_physics_RigidBody_onDisable);
SE_DECLARE_FUNC(js_physics_RigidBody_onEnable);
SE_DECLARE_FUNC(js_physics_RigidBody_setAllowSleep);
SE_DECLARE_FUNC(js_physics_RigidBody_setAngularDamping);
SE_DECLARE_FUNC(js_physics_RigidBody_setAngularFactor);
SE_DECLARE_FUNC(js_physics_RigidBody_setAngularVelocity);
SE_DECLARE_FUNC(js_physics_RigidBody_setGroup);
SE_DECLARE_FUNC(js_physics_RigidBody_setLinearDamping);
SE_DECLARE_FUNC(js_physics_RigidBody_setLinearFactor);
SE_DECLARE_FUNC(js_physics_RigidBody_setLinearVelocity);
SE_DECLARE_FUNC(js_physics_RigidBody_setMask);
SE_DECLARE_FUNC(js_physics_RigidBody_setMass);
SE_DECLARE_FUNC(js_physics_RigidBody_setSleepThreshold);
SE_DECLARE_FUNC(js_physics_RigidBody_setType);
SE_DECLARE_FUNC(js_physics_RigidBody_sleep);
SE_DECLARE_FUNC(js_physics_RigidBody_useCCD);
SE_DECLARE_FUNC(js_physics_RigidBody_useGravity);
SE_DECLARE_FUNC(js_physics_RigidBody_wakeUp);
SE_DECLARE_FUNC(js_physics_RigidBody_RigidBody);

extern se::Object* __jsb_cc_physics_SphereShape_proto;
extern se::Class* __jsb_cc_physics_SphereShape_class;

bool js_register_cc_physics_SphereShape(se::Object* obj);
bool register_all_physics(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::physics::SphereShape);
SE_DECLARE_FUNC(js_physics_SphereShape_getAABB);
SE_DECLARE_FUNC(js_physics_SphereShape_getBoundingSphere);
SE_DECLARE_FUNC(js_physics_SphereShape_getGroup);
SE_DECLARE_FUNC(js_physics_SphereShape_getImpl);
SE_DECLARE_FUNC(js_physics_SphereShape_getMask);
SE_DECLARE_FUNC(js_physics_SphereShape_initialize);
SE_DECLARE_FUNC(js_physics_SphereShape_onDestroy);
SE_DECLARE_FUNC(js_physics_SphereShape_onDisable);
SE_DECLARE_FUNC(js_physics_SphereShape_onEnable);
SE_DECLARE_FUNC(js_physics_SphereShape_setAsTrigger);
SE_DECLARE_FUNC(js_physics_SphereShape_setCenter);
SE_DECLARE_FUNC(js_physics_SphereShape_setGroup);
SE_DECLARE_FUNC(js_physics_SphereShape_setMask);
SE_DECLARE_FUNC(js_physics_SphereShape_setMaterial);
SE_DECLARE_FUNC(js_physics_SphereShape_setRadius);
SE_DECLARE_FUNC(js_physics_SphereShape_updateEventListener);
SE_DECLARE_FUNC(js_physics_SphereShape_SphereShape);

extern se::Object* __jsb_cc_physics_BoxShape_proto;
extern se::Class* __jsb_cc_physics_BoxShape_class;

bool js_register_cc_physics_BoxShape(se::Object* obj);
bool register_all_physics(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::physics::BoxShape);
SE_DECLARE_FUNC(js_physics_BoxShape_getAABB);
SE_DECLARE_FUNC(js_physics_BoxShape_getBoundingSphere);
SE_DECLARE_FUNC(js_physics_BoxShape_getGroup);
SE_DECLARE_FUNC(js_physics_BoxShape_getImpl);
SE_DECLARE_FUNC(js_physics_BoxShape_getMask);
SE_DECLARE_FUNC(js_physics_BoxShape_initialize);
SE_DECLARE_FUNC(js_physics_BoxShape_onDestroy);
SE_DECLARE_FUNC(js_physics_BoxShape_onDisable);
SE_DECLARE_FUNC(js_physics_BoxShape_onEnable);
SE_DECLARE_FUNC(js_physics_BoxShape_setAsTrigger);
SE_DECLARE_FUNC(js_physics_BoxShape_setCenter);
SE_DECLARE_FUNC(js_physics_BoxShape_setGroup);
SE_DECLARE_FUNC(js_physics_BoxShape_setMask);
SE_DECLARE_FUNC(js_physics_BoxShape_setMaterial);
SE_DECLARE_FUNC(js_physics_BoxShape_setSize);
SE_DECLARE_FUNC(js_physics_BoxShape_updateEventListener);
SE_DECLARE_FUNC(js_physics_BoxShape_BoxShape);

extern se::Object* __jsb_cc_physics_CapsuleShape_proto;
extern se::Class* __jsb_cc_physics_CapsuleShape_class;

bool js_register_cc_physics_CapsuleShape(se::Object* obj);
bool register_all_physics(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::physics::CapsuleShape);
SE_DECLARE_FUNC(js_physics_CapsuleShape_getAABB);
SE_DECLARE_FUNC(js_physics_CapsuleShape_getBoundingSphere);
SE_DECLARE_FUNC(js_physics_CapsuleShape_getGroup);
SE_DECLARE_FUNC(js_physics_CapsuleShape_getImpl);
SE_DECLARE_FUNC(js_physics_CapsuleShape_getMask);
SE_DECLARE_FUNC(js_physics_CapsuleShape_initialize);
SE_DECLARE_FUNC(js_physics_CapsuleShape_onDestroy);
SE_DECLARE_FUNC(js_physics_CapsuleShape_onDisable);
SE_DECLARE_FUNC(js_physics_CapsuleShape_onEnable);
SE_DECLARE_FUNC(js_physics_CapsuleShape_setAsTrigger);
SE_DECLARE_FUNC(js_physics_CapsuleShape_setCenter);
SE_DECLARE_FUNC(js_physics_CapsuleShape_setCylinderHeight);
SE_DECLARE_FUNC(js_physics_CapsuleShape_setDirection);
SE_DECLARE_FUNC(js_physics_CapsuleShape_setGroup);
SE_DECLARE_FUNC(js_physics_CapsuleShape_setMask);
SE_DECLARE_FUNC(js_physics_CapsuleShape_setMaterial);
SE_DECLARE_FUNC(js_physics_CapsuleShape_setRadius);
SE_DECLARE_FUNC(js_physics_CapsuleShape_updateEventListener);
SE_DECLARE_FUNC(js_physics_CapsuleShape_CapsuleShape);

extern se::Object* __jsb_cc_physics_PlaneShape_proto;
extern se::Class* __jsb_cc_physics_PlaneShape_class;

bool js_register_cc_physics_PlaneShape(se::Object* obj);
bool register_all_physics(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::physics::PlaneShape);
SE_DECLARE_FUNC(js_physics_PlaneShape_getAABB);
SE_DECLARE_FUNC(js_physics_PlaneShape_getBoundingSphere);
SE_DECLARE_FUNC(js_physics_PlaneShape_getGroup);
SE_DECLARE_FUNC(js_physics_PlaneShape_getImpl);
SE_DECLARE_FUNC(js_physics_PlaneShape_getMask);
SE_DECLARE_FUNC(js_physics_PlaneShape_initialize);
SE_DECLARE_FUNC(js_physics_PlaneShape_onDestroy);
SE_DECLARE_FUNC(js_physics_PlaneShape_onDisable);
SE_DECLARE_FUNC(js_physics_PlaneShape_onEnable);
SE_DECLARE_FUNC(js_physics_PlaneShape_setAsTrigger);
SE_DECLARE_FUNC(js_physics_PlaneShape_setCenter);
SE_DECLARE_FUNC(js_physics_PlaneShape_setConstant);
SE_DECLARE_FUNC(js_physics_PlaneShape_setGroup);
SE_DECLARE_FUNC(js_physics_PlaneShape_setMask);
SE_DECLARE_FUNC(js_physics_PlaneShape_setMaterial);
SE_DECLARE_FUNC(js_physics_PlaneShape_setNormal);
SE_DECLARE_FUNC(js_physics_PlaneShape_updateEventListener);
SE_DECLARE_FUNC(js_physics_PlaneShape_PlaneShape);

extern se::Object* __jsb_cc_physics_TrimeshShape_proto;
extern se::Class* __jsb_cc_physics_TrimeshShape_class;

bool js_register_cc_physics_TrimeshShape(se::Object* obj);
bool register_all_physics(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::physics::TrimeshShape);
SE_DECLARE_FUNC(js_physics_TrimeshShape_getAABB);
SE_DECLARE_FUNC(js_physics_TrimeshShape_getBoundingSphere);
SE_DECLARE_FUNC(js_physics_TrimeshShape_getGroup);
SE_DECLARE_FUNC(js_physics_TrimeshShape_getImpl);
SE_DECLARE_FUNC(js_physics_TrimeshShape_getMask);
SE_DECLARE_FUNC(js_physics_TrimeshShape_initialize);
SE_DECLARE_FUNC(js_physics_TrimeshShape_onDestroy);
SE_DECLARE_FUNC(js_physics_TrimeshShape_onDisable);
SE_DECLARE_FUNC(js_physics_TrimeshShape_onEnable);
SE_DECLARE_FUNC(js_physics_TrimeshShape_setAsTrigger);
SE_DECLARE_FUNC(js_physics_TrimeshShape_setCenter);
SE_DECLARE_FUNC(js_physics_TrimeshShape_setGroup);
SE_DECLARE_FUNC(js_physics_TrimeshShape_setMask);
SE_DECLARE_FUNC(js_physics_TrimeshShape_setMaterial);
SE_DECLARE_FUNC(js_physics_TrimeshShape_setMesh);
SE_DECLARE_FUNC(js_physics_TrimeshShape_updateEventListener);
SE_DECLARE_FUNC(js_physics_TrimeshShape_useConvex);
SE_DECLARE_FUNC(js_physics_TrimeshShape_TrimeshShape);

extern se::Object* __jsb_cc_physics_CylinderShape_proto;
extern se::Class* __jsb_cc_physics_CylinderShape_class;

bool js_register_cc_physics_CylinderShape(se::Object* obj);
bool register_all_physics(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::physics::CylinderShape);
SE_DECLARE_FUNC(js_physics_CylinderShape_getAABB);
SE_DECLARE_FUNC(js_physics_CylinderShape_getBoundingSphere);
SE_DECLARE_FUNC(js_physics_CylinderShape_getGroup);
SE_DECLARE_FUNC(js_physics_CylinderShape_getImpl);
SE_DECLARE_FUNC(js_physics_CylinderShape_getMask);
SE_DECLARE_FUNC(js_physics_CylinderShape_initialize);
SE_DECLARE_FUNC(js_physics_CylinderShape_onDestroy);
SE_DECLARE_FUNC(js_physics_CylinderShape_onDisable);
SE_DECLARE_FUNC(js_physics_CylinderShape_onEnable);
SE_DECLARE_FUNC(js_physics_CylinderShape_setAsTrigger);
SE_DECLARE_FUNC(js_physics_CylinderShape_setCenter);
SE_DECLARE_FUNC(js_physics_CylinderShape_setConvex);
SE_DECLARE_FUNC(js_physics_CylinderShape_setCylinder);
SE_DECLARE_FUNC(js_physics_CylinderShape_setGroup);
SE_DECLARE_FUNC(js_physics_CylinderShape_setMask);
SE_DECLARE_FUNC(js_physics_CylinderShape_setMaterial);
SE_DECLARE_FUNC(js_physics_CylinderShape_updateEventListener);
SE_DECLARE_FUNC(js_physics_CylinderShape_CylinderShape);

extern se::Object* __jsb_cc_physics_ConeShape_proto;
extern se::Class* __jsb_cc_physics_ConeShape_class;

bool js_register_cc_physics_ConeShape(se::Object* obj);
bool register_all_physics(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::physics::ConeShape);
SE_DECLARE_FUNC(js_physics_ConeShape_getAABB);
SE_DECLARE_FUNC(js_physics_ConeShape_getBoundingSphere);
SE_DECLARE_FUNC(js_physics_ConeShape_getGroup);
SE_DECLARE_FUNC(js_physics_ConeShape_getImpl);
SE_DECLARE_FUNC(js_physics_ConeShape_getMask);
SE_DECLARE_FUNC(js_physics_ConeShape_initialize);
SE_DECLARE_FUNC(js_physics_ConeShape_onDestroy);
SE_DECLARE_FUNC(js_physics_ConeShape_onDisable);
SE_DECLARE_FUNC(js_physics_ConeShape_onEnable);
SE_DECLARE_FUNC(js_physics_ConeShape_setAsTrigger);
SE_DECLARE_FUNC(js_physics_ConeShape_setCenter);
SE_DECLARE_FUNC(js_physics_ConeShape_setCone);
SE_DECLARE_FUNC(js_physics_ConeShape_setConvex);
SE_DECLARE_FUNC(js_physics_ConeShape_setGroup);
SE_DECLARE_FUNC(js_physics_ConeShape_setMask);
SE_DECLARE_FUNC(js_physics_ConeShape_setMaterial);
SE_DECLARE_FUNC(js_physics_ConeShape_updateEventListener);
SE_DECLARE_FUNC(js_physics_ConeShape_ConeShape);

extern se::Object* __jsb_cc_physics_TerrainShape_proto;
extern se::Class* __jsb_cc_physics_TerrainShape_class;

bool js_register_cc_physics_TerrainShape(se::Object* obj);
bool register_all_physics(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::physics::TerrainShape);
SE_DECLARE_FUNC(js_physics_TerrainShape_getAABB);
SE_DECLARE_FUNC(js_physics_TerrainShape_getBoundingSphere);
SE_DECLARE_FUNC(js_physics_TerrainShape_getGroup);
SE_DECLARE_FUNC(js_physics_TerrainShape_getImpl);
SE_DECLARE_FUNC(js_physics_TerrainShape_getMask);
SE_DECLARE_FUNC(js_physics_TerrainShape_initialize);
SE_DECLARE_FUNC(js_physics_TerrainShape_onDestroy);
SE_DECLARE_FUNC(js_physics_TerrainShape_onDisable);
SE_DECLARE_FUNC(js_physics_TerrainShape_onEnable);
SE_DECLARE_FUNC(js_physics_TerrainShape_setAsTrigger);
SE_DECLARE_FUNC(js_physics_TerrainShape_setCenter);
SE_DECLARE_FUNC(js_physics_TerrainShape_setGroup);
SE_DECLARE_FUNC(js_physics_TerrainShape_setMask);
SE_DECLARE_FUNC(js_physics_TerrainShape_setMaterial);
SE_DECLARE_FUNC(js_physics_TerrainShape_setTerrain);
SE_DECLARE_FUNC(js_physics_TerrainShape_updateEventListener);
SE_DECLARE_FUNC(js_physics_TerrainShape_TerrainShape);

extern se::Object* __jsb_cc_physics_World_proto;
extern se::Class* __jsb_cc_physics_World_class;

bool js_register_cc_physics_World(se::Object* obj);
bool register_all_physics(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::physics::World);
SE_DECLARE_FUNC(js_physics_World_createConvex);
SE_DECLARE_FUNC(js_physics_World_createHeightField);
SE_DECLARE_FUNC(js_physics_World_createMaterial);
SE_DECLARE_FUNC(js_physics_World_createTrimesh);
SE_DECLARE_FUNC(js_physics_World_destroy);
SE_DECLARE_FUNC(js_physics_World_emitEvents);
SE_DECLARE_FUNC(js_physics_World_getContactEventPairs);
SE_DECLARE_FUNC(js_physics_World_getTriggerEventPairs);
SE_DECLARE_FUNC(js_physics_World_raycast);
SE_DECLARE_FUNC(js_physics_World_raycastClosest);
SE_DECLARE_FUNC(js_physics_World_raycastClosestResult);
SE_DECLARE_FUNC(js_physics_World_raycastResult);
SE_DECLARE_FUNC(js_physics_World_setAllowSleep);
SE_DECLARE_FUNC(js_physics_World_setCollisionMatrix);
SE_DECLARE_FUNC(js_physics_World_setGravity);
SE_DECLARE_FUNC(js_physics_World_step);
SE_DECLARE_FUNC(js_physics_World_syncSceneToPhysics);
SE_DECLARE_FUNC(js_physics_World_syncSceneWithCheck);
SE_DECLARE_FUNC(js_physics_World_World);

