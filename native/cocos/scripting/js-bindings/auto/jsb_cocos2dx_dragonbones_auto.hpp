#include "base/ccConfig.h"
#ifndef __cocos2dx_dragonbones_h__
#define __cocos2dx_dragonbones_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_dragonBones_BaseObject_class;
extern JS::PersistentRootedObject *jsb_dragonBones_BaseObject_prototype;

bool js_cocos2dx_dragonbones_BaseObject_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_BaseObject_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_BaseObject(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_BaseObject_getClassTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_BaseObject_returnToPool(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_BaseObject_clearPool(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_BaseObject_setMaxCount(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_Matrix_class;
extern JS::PersistentRootedObject *jsb_dragonBones_Matrix_prototype;

bool js_cocos2dx_dragonbones_Matrix_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_Matrix_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_Matrix(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_Matrix_Matrix(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_Transform_class;
extern JS::PersistentRootedObject *jsb_dragonBones_Transform_prototype;

bool js_cocos2dx_dragonbones_Transform_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_Transform_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_Transform(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_Transform_getRotation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Transform_setRotation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Transform_normalizeRadian(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Transform_Transform(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_TextureData_class;
extern JS::PersistentRootedObject *jsb_dragonBones_TextureData_prototype;

bool js_cocos2dx_dragonbones_TextureData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_TextureData_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_TextureData(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_TextureData_generateRectangle(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_TextureAtlasData_class;
extern JS::PersistentRootedObject *jsb_dragonBones_TextureAtlasData_prototype;

bool js_cocos2dx_dragonbones_TextureAtlasData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_TextureAtlasData_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_TextureAtlasData(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_TextureAtlasData_addTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_TextureAtlasData_generateTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_TextureAtlasData_getTexture(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_AnimationData_class;
extern JS::PersistentRootedObject *jsb_dragonBones_AnimationData_prototype;

bool js_cocos2dx_dragonbones_AnimationData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_AnimationData_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_AnimationData(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_AnimationData_getClassTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationData_getBoneTimeline(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationData_AnimationData(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_BoneData_class;
extern JS::PersistentRootedObject *jsb_dragonBones_BoneData_prototype;

bool js_cocos2dx_dragonbones_BoneData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_BoneData_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_BoneData(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_BoneData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_BoneData_BoneData(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_SlotData_class;
extern JS::PersistentRootedObject *jsb_dragonBones_SlotData_prototype;

bool js_cocos2dx_dragonbones_SlotData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_SlotData_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_SlotData(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_SlotData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_SlotData_generateColor(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_SlotData_SlotData(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_SkinData_class;
extern JS::PersistentRootedObject *jsb_dragonBones_SkinData_prototype;

bool js_cocos2dx_dragonbones_SkinData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_SkinData_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_SkinData(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_SkinData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_SkinData_SkinData(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_ArmatureData_class;
extern JS::PersistentRootedObject *jsb_dragonBones_ArmatureData_prototype;

bool js_cocos2dx_dragonbones_ArmatureData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_ArmatureData_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_ArmatureData(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_ArmatureData_getBone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_ArmatureData_getAnimation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_ArmatureData_getSlot(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_ArmatureData_getSkin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_ArmatureData_getDefaultSkin(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_ArmatureData_getDefaultAnimation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_ArmatureData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_ArmatureData_ArmatureData(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_DragonBonesData_class;
extern JS::PersistentRootedObject *jsb_dragonBones_DragonBonesData_prototype;

bool js_cocos2dx_dragonbones_DragonBonesData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_DragonBonesData_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_DragonBonesData(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_DragonBonesData_getArmatureNames(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_DragonBonesData_addArmature(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_DragonBonesData_getArmature(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_DragonBonesData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_DragonBonesData_DragonBonesData(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_EventObject_class;
extern JS::PersistentRootedObject *jsb_dragonBones_EventObject_prototype;

bool js_cocos2dx_dragonbones_EventObject_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_EventObject_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_EventObject(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_EventObject_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_EventObject_EventObject(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_Armature_class;
extern JS::PersistentRootedObject *jsb_dragonBones_Armature_prototype;

bool js_cocos2dx_dragonbones_Armature_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_Armature_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_Armature(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_Armature_getSlot(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature__bufferAction(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_getCacheFrameRate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_getName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_dispose(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_addSlot(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_invalidUpdate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_getBoneByDisplay(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_setCacheFrameRate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_removeSlot(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_addBone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_advanceTime(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_getBone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_getParent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_getSlotByDisplay(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_removeBone(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_replaceTexture(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Armature_Armature(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_Animation_class;
extern JS::PersistentRootedObject *jsb_dragonBones_Animation_prototype;

bool js_cocos2dx_dragonbones_Animation_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_Animation_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_Animation(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_Animation_isPlaying(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_getAnimationNames(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_fadeIn(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_isCompleted(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_reset(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_play(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_getState(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_stop(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_getLastAnimationName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_getLastAnimationState(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_gotoAndPlayByTime(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_gotoAndPlayByProgress(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_hasAnimation(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_gotoAndStopByTime(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_gotoAndStopByProgress(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_gotoAndPlayByFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_gotoAndStopByFrame(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Animation_Animation(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_TransformObject_class;
extern JS::PersistentRootedObject *jsb_dragonBones_TransformObject_prototype;

bool js_cocos2dx_dragonbones_TransformObject_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_TransformObject_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_TransformObject(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_TransformObject__setArmature(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_TransformObject__setParent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_TransformObject_getParent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_TransformObject_getArmature(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_Bone_class;
extern JS::PersistentRootedObject *jsb_dragonBones_Bone_prototype;

bool js_cocos2dx_dragonbones_Bone_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_Bone_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_Bone(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_Bone_getIK(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Bone_getIKChainIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Bone_contains(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Bone_getIKChain(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Bone_getVisible(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Bone_setVisible(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Bone_invalidUpdate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Bone_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Bone_Bone(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_Slot_class;
extern JS::PersistentRootedObject *jsb_dragonBones_Slot_prototype;

bool js_cocos2dx_dragonbones_Slot_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_Slot_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_Slot(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_Slot_getChildArmature(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Slot_invalidUpdate(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Slot_setDisplayIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Slot_setChildArmature(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_Slot_getDisplayIndex(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_BaseFactory_class;
extern JS::PersistentRootedObject *jsb_dragonBones_BaseFactory_prototype;

bool js_cocos2dx_dragonbones_BaseFactory_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_BaseFactory_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_BaseFactory(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_BaseFactory_removeDragonBonesData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_BaseFactory_removeTextureAtlasData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_BaseFactory_parseDragonBonesData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_BaseFactory_clear(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_BaseFactory_addDragonBonesData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_BaseFactory_buildArmature(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_BaseFactory_addTextureAtlasData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_BaseFactory_getDragonBonesData(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_WorldClock_class;
extern JS::PersistentRootedObject *jsb_dragonBones_WorldClock_prototype;

bool js_cocos2dx_dragonbones_WorldClock_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_WorldClock_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_WorldClock(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_WorldClock_clear(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_WorldClock_contains(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_WorldClock_advanceTime(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_WorldClock_WorldClock(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_AnimationState_class;
extern JS::PersistentRootedObject *jsb_dragonBones_AnimationState_prototype;

bool js_cocos2dx_dragonbones_AnimationState_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_AnimationState_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_AnimationState(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_AnimationState_setCurrentTime(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_removeBoneMask(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_getGroup(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_getCurrentPlayTimes(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_getName(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_getCurrentTime(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_getTotalTime(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_removeAllBoneMask(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_getLayer(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_isCompleted(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_play(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_fadeOut(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_stop(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_isPlaying(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_addBoneMask(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_containsBoneMask(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_AnimationState_AnimationState(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_CCTextureData_class;
extern JS::PersistentRootedObject *jsb_dragonBones_CCTextureData_prototype;

bool js_cocos2dx_dragonbones_CCTextureData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_CCTextureData_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_CCTextureData(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_CCTextureData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCTextureData_CCTextureData(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_CCTextureAtlasData_class;
extern JS::PersistentRootedObject *jsb_dragonBones_CCTextureAtlasData_prototype;

bool js_cocos2dx_dragonbones_CCTextureAtlasData_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_CCTextureAtlasData_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_CCTextureAtlasData(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_CCTextureAtlasData_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCTextureAtlasData_CCTextureAtlasData(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_CCArmatureDisplay_class;
extern JS::PersistentRootedObject *jsb_dragonBones_CCArmatureDisplay_prototype;

bool js_cocos2dx_dragonbones_CCArmatureDisplay_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_CCArmatureDisplay_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_CCArmatureDisplay(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_CCArmatureDisplay_advanceTimeBySelf(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCArmatureDisplay_removeEvent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCArmatureDisplay_dispose(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCArmatureDisplay_hasEventCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCArmatureDisplay_setEventCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCArmatureDisplay_clearEventCallback(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCArmatureDisplay_addEvent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCArmatureDisplay_hasEvent(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCArmatureDisplay_getArmature(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCArmatureDisplay_create(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_DBCCSprite_class;
extern JS::PersistentRootedObject *jsb_dragonBones_DBCCSprite_prototype;

bool js_cocos2dx_dragonbones_DBCCSprite_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_DBCCSprite_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_DBCCSprite(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_DBCCSprite_create(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_CCSlot_class;
extern JS::PersistentRootedObject *jsb_dragonBones_CCSlot_prototype;

bool js_cocos2dx_dragonbones_CCSlot_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_CCSlot_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_CCSlot(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_CCSlot_getClassTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCSlot_getTypeIndex(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCSlot_CCSlot(JSContext *cx, uint32_t argc, JS::Value *vp);

extern JSClass  *jsb_dragonBones_CCFactory_class;
extern JS::PersistentRootedObject *jsb_dragonBones_CCFactory_prototype;

bool js_cocos2dx_dragonbones_CCFactory_constructor(JSContext *cx, uint32_t argc, JS::Value *vp);
void js_cocos2dx_dragonbones_CCFactory_finalize(JSContext *cx, JSObject *obj);
void js_register_cocos2dx_dragonbones_CCFactory(JSContext *cx, JS::HandleObject global);
void register_all_cocos2dx_dragonbones(JSContext* cx, JS::HandleObject obj);
bool js_cocos2dx_dragonbones_CCFactory_getTextureDisplay(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCFactory_getSoundEventManater(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCFactory_buildArmatureDisplay(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCFactory_parseTextureAtlasData(JSContext *cx, uint32_t argc, JS::Value *vp);
bool js_cocos2dx_dragonbones_CCFactory_CCFactory(JSContext *cx, uint32_t argc, JS::Value *vp);

#endif // __cocos2dx_dragonbones_h__
