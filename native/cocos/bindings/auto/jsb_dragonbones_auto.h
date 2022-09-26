// clang-format off
#pragma once

#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/auto/jsb_cocos_auto.h"
#include "cocos/editor-support/dragonbones-creator-support/CCDragonBonesHeaders.h"

bool register_all_dragonbones(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(dragonBones::BaseObject);
JSB_REGISTER_OBJECT_TYPE(dragonBones::Rectangle);
JSB_REGISTER_OBJECT_TYPE(dragonBones::Matrix);
JSB_REGISTER_OBJECT_TYPE(dragonBones::Transform);
JSB_REGISTER_OBJECT_TYPE(dragonBones::ArmatureData);
JSB_REGISTER_OBJECT_TYPE(dragonBones::BoneData);
JSB_REGISTER_OBJECT_TYPE(dragonBones::SlotData);
JSB_REGISTER_OBJECT_TYPE(dragonBones::AnimationData);
JSB_REGISTER_OBJECT_TYPE(dragonBones::DragonBonesData);
JSB_REGISTER_OBJECT_TYPE(dragonBones::SkinData);
JSB_REGISTER_OBJECT_TYPE(dragonBones::TextureAtlasData);
JSB_REGISTER_OBJECT_TYPE(dragonBones::TextureData);
JSB_REGISTER_OBJECT_TYPE(dragonBones::Armature);
JSB_REGISTER_OBJECT_TYPE(dragonBones::AnimationState);
JSB_REGISTER_OBJECT_TYPE(dragonBones::TransformObject);
JSB_REGISTER_OBJECT_TYPE(dragonBones::Bone);
JSB_REGISTER_OBJECT_TYPE(dragonBones::Slot);
JSB_REGISTER_OBJECT_TYPE(dragonBones::Animation);
JSB_REGISTER_OBJECT_TYPE(dragonBones::WorldClock);
JSB_REGISTER_OBJECT_TYPE(dragonBones::EventObject);
JSB_REGISTER_OBJECT_TYPE(dragonBones::BaseFactory);
JSB_REGISTER_OBJECT_TYPE(dragonBones::CCSlot);
JSB_REGISTER_OBJECT_TYPE(dragonBones::CCArmatureDisplay);
JSB_REGISTER_OBJECT_TYPE(dragonBones::ArmatureCacheMgr);
JSB_REGISTER_OBJECT_TYPE(dragonBones::CCArmatureCacheDisplay);
JSB_REGISTER_OBJECT_TYPE(dragonBones::CCFactory);
JSB_REGISTER_OBJECT_TYPE(dragonBones::CCTextureAtlasData);
JSB_REGISTER_OBJECT_TYPE(dragonBones::CCTextureData);


extern se::Object *__jsb_dragonBones_BaseObject_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_BaseObject_class;    // NOLINT

bool js_register_dragonBones_BaseObject(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_BaseObject_returnToPool);
SE_DECLARE_FUNC(js_dragonbones_BaseObject_clearPool);
SE_DECLARE_FUNC(js_dragonbones_BaseObject_setMaxCount);

extern se::Object *__jsb_dragonBones_Rectangle_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_Rectangle_class;    // NOLINT

bool js_register_dragonBones_Rectangle(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_Rectangle_clear);
SE_DECLARE_FUNC(js_dragonbones_Rectangle_Rectangle);

extern se::Object *__jsb_dragonBones_Matrix_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_Matrix_class;    // NOLINT

bool js_register_dragonBones_Matrix(se::Object *obj); // NOLINT


extern se::Object *__jsb_dragonBones_Transform_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_Transform_class;    // NOLINT

bool js_register_dragonBones_Transform(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_Transform_normalizeRadian);

extern se::Object *__jsb_dragonBones_ArmatureData_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_ArmatureData_class;    // NOLINT

bool js_register_dragonBones_ArmatureData(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_ArmatureData_getAABB);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_getAnimation);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_getAnimationNames);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_getBone);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_getDefaultAnimation);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_getDefaultSkin);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_getMesh);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_getParent);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_getSkin);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_getSlot);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_getType);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_setDefaultAnimation);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_setDefaultSkin);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_setParent);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_setType);
SE_DECLARE_FUNC(js_dragonbones_ArmatureData_sortBones);

extern se::Object *__jsb_dragonBones_BoneData_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_BoneData_class;    // NOLINT

bool js_register_dragonBones_BoneData(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_BoneData_getParent);
SE_DECLARE_FUNC(js_dragonbones_BoneData_getTransfrom);
SE_DECLARE_FUNC(js_dragonbones_BoneData_setParent);

extern se::Object *__jsb_dragonBones_SlotData_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_SlotData_class;    // NOLINT

bool js_register_dragonBones_SlotData(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_SlotData_getBlendMode);
SE_DECLARE_FUNC(js_dragonbones_SlotData_getParent);
SE_DECLARE_FUNC(js_dragonbones_SlotData_setBlendMode);
SE_DECLARE_FUNC(js_dragonbones_SlotData_setParent);

extern se::Object *__jsb_dragonBones_AnimationData_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_AnimationData_class;    // NOLINT

bool js_register_dragonBones_AnimationData(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_AnimationData_getBoneCachedFrameIndices);
SE_DECLARE_FUNC(js_dragonbones_AnimationData_getParent);
SE_DECLARE_FUNC(js_dragonbones_AnimationData_getSlotCachedFrameIndices);
SE_DECLARE_FUNC(js_dragonbones_AnimationData_getZOrderTimeline);
SE_DECLARE_FUNC(js_dragonbones_AnimationData_setParent);

extern se::Object *__jsb_dragonBones_DragonBonesData_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_DragonBonesData_class;    // NOLINT

bool js_register_dragonBones_DragonBonesData(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_DragonBonesData_addArmature);
SE_DECLARE_FUNC(js_dragonbones_DragonBonesData_getArmature);
SE_DECLARE_FUNC(js_dragonbones_DragonBonesData_getArmatureNames);
SE_DECLARE_FUNC(js_dragonbones_DragonBonesData_getFrameIndices);

extern se::Object *__jsb_dragonBones_SkinData_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_SkinData_class;    // NOLINT

bool js_register_dragonBones_SkinData(se::Object *obj); // NOLINT


extern se::Object *__jsb_dragonBones_TextureAtlasData_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_TextureAtlasData_class;    // NOLINT

bool js_register_dragonBones_TextureAtlasData(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_TextureAtlasData_addTexture);
SE_DECLARE_FUNC(js_dragonbones_TextureAtlasData_createTexture);
SE_DECLARE_FUNC(js_dragonbones_TextureAtlasData_getTexture);

extern se::Object *__jsb_dragonBones_TextureData_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_TextureData_class;    // NOLINT

bool js_register_dragonBones_TextureData(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_TextureData_getFrame);
SE_DECLARE_FUNC(js_dragonbones_TextureData_getParent);
SE_DECLARE_FUNC(js_dragonbones_TextureData_getRegion);
SE_DECLARE_FUNC(js_dragonbones_TextureData_setFrame);
SE_DECLARE_FUNC(js_dragonbones_TextureData_setParent);
SE_DECLARE_FUNC(js_dragonbones_TextureData_createRectangle);

extern se::Object *__jsb_dragonBones_Armature_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_Armature_class;    // NOLINT

bool js_register_dragonBones_Armature(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_Armature__addBone);
SE_DECLARE_FUNC(js_dragonbones_Armature__addSlot);
SE_DECLARE_FUNC(js_dragonbones_Armature__bufferAction);
SE_DECLARE_FUNC(js_dragonbones_Armature_advanceTime);
SE_DECLARE_FUNC(js_dragonbones_Armature_containsPoint);
SE_DECLARE_FUNC(js_dragonbones_Armature_dispose);
SE_DECLARE_FUNC(js_dragonbones_Armature_getAnimation);
SE_DECLARE_FUNC(js_dragonbones_Armature_getArmatureData);
SE_DECLARE_FUNC(js_dragonbones_Armature_getBone);
SE_DECLARE_FUNC(js_dragonbones_Armature_getCacheFrameRate);
SE_DECLARE_FUNC(js_dragonbones_Armature_getClock);
SE_DECLARE_FUNC(js_dragonbones_Armature_getEventDispatcher);
SE_DECLARE_FUNC(js_dragonbones_Armature_getFlipX);
SE_DECLARE_FUNC(js_dragonbones_Armature_getFlipY);
SE_DECLARE_FUNC(js_dragonbones_Armature_getName);
SE_DECLARE_FUNC(js_dragonbones_Armature_getParent);
SE_DECLARE_FUNC(js_dragonbones_Armature_getProxy);
SE_DECLARE_FUNC(js_dragonbones_Armature_getSlot);
SE_DECLARE_FUNC(js_dragonbones_Armature_invalidUpdate);
SE_DECLARE_FUNC(js_dragonbones_Armature_render);
SE_DECLARE_FUNC(js_dragonbones_Armature_setCacheFrameRate);
SE_DECLARE_FUNC(js_dragonbones_Armature_setClock);
SE_DECLARE_FUNC(js_dragonbones_Armature_setFlipX);
SE_DECLARE_FUNC(js_dragonbones_Armature_setFlipY);

extern se::Object *__jsb_dragonBones_AnimationState_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_AnimationState_class;    // NOLINT

bool js_register_dragonBones_AnimationState(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_AnimationState_addBoneMask);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_advanceTime);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_containsBoneMask);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_fadeOut);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_getAnimationData);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_getCurrentPlayTimes);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_getCurrentTime);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_getName);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_getTotalTime);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_isCompleted);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_isFadeComplete);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_isFadeIn);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_isFadeOut);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_isPlaying);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_play);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_removeAllBoneMask);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_removeBoneMask);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_setCurrentTime);
SE_DECLARE_FUNC(js_dragonbones_AnimationState_stop);

extern se::Object *__jsb_dragonBones_TransformObject_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_TransformObject_class;    // NOLINT

bool js_register_dragonBones_TransformObject(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_TransformObject_getArmature);
SE_DECLARE_FUNC(js_dragonbones_TransformObject_getGlobal);
SE_DECLARE_FUNC(js_dragonbones_TransformObject_getGlobalTransformMatrix);
SE_DECLARE_FUNC(js_dragonbones_TransformObject_getOffset);
SE_DECLARE_FUNC(js_dragonbones_TransformObject_getOrigin);
SE_DECLARE_FUNC(js_dragonbones_TransformObject_updateGlobalTransform);

extern se::Object *__jsb_dragonBones_Bone_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_Bone_class;    // NOLINT

bool js_register_dragonBones_Bone(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_Bone_contains);
SE_DECLARE_FUNC(js_dragonbones_Bone_getBoneData);
SE_DECLARE_FUNC(js_dragonbones_Bone_getName);
SE_DECLARE_FUNC(js_dragonbones_Bone_getOffsetMode);
SE_DECLARE_FUNC(js_dragonbones_Bone_getParent);
SE_DECLARE_FUNC(js_dragonbones_Bone_getVisible);
SE_DECLARE_FUNC(js_dragonbones_Bone_init);
SE_DECLARE_FUNC(js_dragonbones_Bone_invalidUpdate);
SE_DECLARE_FUNC(js_dragonbones_Bone_setOffsetMode);
SE_DECLARE_FUNC(js_dragonbones_Bone_setVisible);
SE_DECLARE_FUNC(js_dragonbones_Bone_update);
SE_DECLARE_FUNC(js_dragonbones_Bone_updateByConstraint);

extern se::Object *__jsb_dragonBones_Slot_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_Slot_class;    // NOLINT

bool js_register_dragonBones_Slot(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_Slot__setZorder);
SE_DECLARE_FUNC(js_dragonbones_Slot__updateColor);
SE_DECLARE_FUNC(js_dragonbones_Slot_containsPoint);
SE_DECLARE_FUNC(js_dragonbones_Slot_getBoundingBoxData);
SE_DECLARE_FUNC(js_dragonbones_Slot_getChildArmature);
SE_DECLARE_FUNC(js_dragonbones_Slot_getName);
SE_DECLARE_FUNC(js_dragonbones_Slot_getParent);
SE_DECLARE_FUNC(js_dragonbones_Slot_getSlotData);
SE_DECLARE_FUNC(js_dragonbones_Slot_getVisible);
SE_DECLARE_FUNC(js_dragonbones_Slot_invalidUpdate);
SE_DECLARE_FUNC(js_dragonbones_Slot_setChildArmature);
SE_DECLARE_FUNC(js_dragonbones_Slot_setVisible);
SE_DECLARE_FUNC(js_dragonbones_Slot_update);
SE_DECLARE_FUNC(js_dragonbones_Slot_updateTransformAndMatrix);

extern se::Object *__jsb_dragonBones_Animation_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_Animation_class;    // NOLINT

bool js_register_dragonBones_Animation(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_Animation_advanceTime);
SE_DECLARE_FUNC(js_dragonbones_Animation_fadeIn);
SE_DECLARE_FUNC(js_dragonbones_Animation_getAnimationNames);
SE_DECLARE_FUNC(js_dragonbones_Animation_getLastAnimationName);
SE_DECLARE_FUNC(js_dragonbones_Animation_getLastAnimationState);
SE_DECLARE_FUNC(js_dragonbones_Animation_getState);
SE_DECLARE_FUNC(js_dragonbones_Animation_gotoAndPlayByFrame);
SE_DECLARE_FUNC(js_dragonbones_Animation_gotoAndPlayByProgress);
SE_DECLARE_FUNC(js_dragonbones_Animation_gotoAndPlayByTime);
SE_DECLARE_FUNC(js_dragonbones_Animation_gotoAndStopByFrame);
SE_DECLARE_FUNC(js_dragonbones_Animation_gotoAndStopByProgress);
SE_DECLARE_FUNC(js_dragonbones_Animation_gotoAndStopByTime);
SE_DECLARE_FUNC(js_dragonbones_Animation_hasAnimation);
SE_DECLARE_FUNC(js_dragonbones_Animation_init);
SE_DECLARE_FUNC(js_dragonbones_Animation_isCompleted);
SE_DECLARE_FUNC(js_dragonbones_Animation_isPlaying);
SE_DECLARE_FUNC(js_dragonbones_Animation_play);
SE_DECLARE_FUNC(js_dragonbones_Animation_reset);
SE_DECLARE_FUNC(js_dragonbones_Animation_stop);

extern se::Object *__jsb_dragonBones_WorldClock_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_WorldClock_class;    // NOLINT

bool js_register_dragonBones_WorldClock(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_WorldClock_advanceTime);
SE_DECLARE_FUNC(js_dragonbones_WorldClock_clear);
SE_DECLARE_FUNC(js_dragonbones_WorldClock_getClock);
SE_DECLARE_FUNC(js_dragonbones_WorldClock_render);
SE_DECLARE_FUNC(js_dragonbones_WorldClock_setClock);
SE_DECLARE_FUNC(js_dragonbones_WorldClock_getStaticClock);

extern se::Object *__jsb_dragonBones_EventObject_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_EventObject_class;    // NOLINT

bool js_register_dragonBones_EventObject(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_EventObject_getAnimationState);
SE_DECLARE_FUNC(js_dragonbones_EventObject_getArmature);
SE_DECLARE_FUNC(js_dragonbones_EventObject_getBone);
SE_DECLARE_FUNC(js_dragonbones_EventObject_getSlot);

extern se::Object *__jsb_dragonBones_BaseFactory_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_BaseFactory_class;    // NOLINT

bool js_register_dragonBones_BaseFactory(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_BaseFactory_addDragonBonesData);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_addTextureAtlasData);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_buildArmature);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_changeSkin);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_clear);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_getArmatureData);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_getClock);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_getDragonBonesData);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_parseDragonBonesData);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_removeDragonBonesData);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_removeTextureAtlasData);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_replaceAnimation);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_replaceSkin);
SE_DECLARE_FUNC(js_dragonbones_BaseFactory_replaceSlotDisplay);

extern se::Object *__jsb_dragonBones_CCSlot_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_CCSlot_class;    // NOLINT

bool js_register_dragonBones_CCSlot(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_CCSlot_updateWorldMatrix);

extern se::Object *__jsb_dragonBones_CCArmatureDisplay_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_CCArmatureDisplay_class;    // NOLINT

bool js_register_dragonBones_CCArmatureDisplay(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_addDBEventListener);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_convertToRootSpace);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_dbClear);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_dbInit);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_dbRender);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_dbUpdate);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_dispatchDBEvent);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_dispose);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_getAnimation);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_getArmature);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_getDebugData);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_getRootDisplay);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_getSharedBufferOffset);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_hasDBEventListener);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_removeDBEventListener);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_setAttachEnabled);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_setBatchEnabled);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_setColor);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_setDBEventCallback);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_setDebugBonesEnabled);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_setMaterial);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_setOpacityModifyRGB);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_setRenderEntity);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_create);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureDisplay_CCArmatureDisplay);

extern se::Object *__jsb_dragonBones_ArmatureCacheMgr_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_ArmatureCacheMgr_class;    // NOLINT

bool js_register_dragonBones_ArmatureCacheMgr(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_ArmatureCacheMgr_buildArmatureCache);
SE_DECLARE_FUNC(js_dragonbones_ArmatureCacheMgr_removeArmatureCache);
SE_DECLARE_FUNC(js_dragonbones_ArmatureCacheMgr_destroyInstance);
SE_DECLARE_FUNC(js_dragonbones_ArmatureCacheMgr_getInstance);

extern se::Object *__jsb_dragonBones_CCArmatureCacheDisplay_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_CCArmatureCacheDisplay_class;    // NOLINT

bool js_register_dragonBones_CCArmatureCacheDisplay(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_addDBEventListener);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_beginSchedule);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_dispatchDBEvent);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_dispose);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_getAnimation);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_getArmature);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_getSharedBufferOffset);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_getTimeScale);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_onDisable);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_onEnable);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_playAnimation);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_removeDBEventListener);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_render);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_setAttachEnabled);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_setBatchEnabled);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_setColor);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_setDBEventCallback);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_setMaterial);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_setOpacityModifyRGB);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_setRenderEntity);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_setTimeScale);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_stopSchedule);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_update);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_updateAllAnimationCache);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_updateAnimationCache);
SE_DECLARE_FUNC(js_dragonbones_CCArmatureCacheDisplay_CCArmatureCacheDisplay);

extern se::Object *__jsb_dragonBones_CCFactory_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_CCFactory_class;    // NOLINT

bool js_register_dragonBones_CCFactory(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_dragonbones_CCFactory_add);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_buildArmatureDisplay);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_getDragonBones);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_getSoundEventManager);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_getTextureAtlasDataByIndex);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_getTimeScale);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_parseDragonBonesDataByPath);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_remove);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_removeDragonBonesDataByUUID);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_removeTextureAtlasDataByIndex);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_render);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_setTimeScale);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_stopSchedule);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_update);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_destroyFactory);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_getClock);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_getFactory);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_isInit);
SE_DECLARE_FUNC(js_dragonbones_CCFactory_CCFactory);

extern se::Object *__jsb_dragonBones_CCTextureAtlasData_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_CCTextureAtlasData_class;    // NOLINT

bool js_register_dragonBones_CCTextureAtlasData(se::Object *obj); // NOLINT


extern se::Object *__jsb_dragonBones_CCTextureData_proto;   // NOLINT
extern se::Class *__jsb_dragonBones_CCTextureData_class;    // NOLINT

bool js_register_dragonBones_CCTextureData(se::Object *obj); // NOLINT

// clang-format on
