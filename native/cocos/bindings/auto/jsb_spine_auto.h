#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/editor-support/spine-creator-support/spine-cocos2dx.h"

extern se::Object* __jsb_spine_Animation_proto;
extern se::Class* __jsb_spine_Animation_class;

bool js_register_spine_Animation(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::Animation);
SE_DECLARE_FUNC(js_spine_Animation_getDuration);
SE_DECLARE_FUNC(js_spine_Animation_getName);
SE_DECLARE_FUNC(js_spine_Animation_getTimelines);
SE_DECLARE_FUNC(js_spine_Animation_hasTimeline);
SE_DECLARE_FUNC(js_spine_Animation_setDuration);

extern se::Object* __jsb_spine_TrackEntry_proto;
extern se::Class* __jsb_spine_TrackEntry_class;

bool js_register_spine_TrackEntry(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::TrackEntry);
SE_DECLARE_FUNC(js_spine_TrackEntry_getAlpha);
SE_DECLARE_FUNC(js_spine_TrackEntry_getAnimation);
SE_DECLARE_FUNC(js_spine_TrackEntry_getAnimationEnd);
SE_DECLARE_FUNC(js_spine_TrackEntry_getAnimationLast);
SE_DECLARE_FUNC(js_spine_TrackEntry_getAnimationStart);
SE_DECLARE_FUNC(js_spine_TrackEntry_getAnimationTime);
SE_DECLARE_FUNC(js_spine_TrackEntry_getAttachmentThreshold);
SE_DECLARE_FUNC(js_spine_TrackEntry_getDelay);
SE_DECLARE_FUNC(js_spine_TrackEntry_getDrawOrderThreshold);
SE_DECLARE_FUNC(js_spine_TrackEntry_getEventThreshold);
SE_DECLARE_FUNC(js_spine_TrackEntry_getHoldPrevious);
SE_DECLARE_FUNC(js_spine_TrackEntry_getLoop);
SE_DECLARE_FUNC(js_spine_TrackEntry_getMixBlend);
SE_DECLARE_FUNC(js_spine_TrackEntry_getMixDuration);
SE_DECLARE_FUNC(js_spine_TrackEntry_getMixTime);
SE_DECLARE_FUNC(js_spine_TrackEntry_getMixingFrom);
SE_DECLARE_FUNC(js_spine_TrackEntry_getMixingTo);
SE_DECLARE_FUNC(js_spine_TrackEntry_getNext);
SE_DECLARE_FUNC(js_spine_TrackEntry_getTimeScale);
SE_DECLARE_FUNC(js_spine_TrackEntry_getTrackEnd);
SE_DECLARE_FUNC(js_spine_TrackEntry_getTrackIndex);
SE_DECLARE_FUNC(js_spine_TrackEntry_getTrackTime);
SE_DECLARE_FUNC(js_spine_TrackEntry_isComplete);
SE_DECLARE_FUNC(js_spine_TrackEntry_resetRotationDirections);
SE_DECLARE_FUNC(js_spine_TrackEntry_setAlpha);
SE_DECLARE_FUNC(js_spine_TrackEntry_setAnimationEnd);
SE_DECLARE_FUNC(js_spine_TrackEntry_setAnimationLast);
SE_DECLARE_FUNC(js_spine_TrackEntry_setAnimationStart);
SE_DECLARE_FUNC(js_spine_TrackEntry_setAttachmentThreshold);
SE_DECLARE_FUNC(js_spine_TrackEntry_setDelay);
SE_DECLARE_FUNC(js_spine_TrackEntry_setDrawOrderThreshold);
SE_DECLARE_FUNC(js_spine_TrackEntry_setEventThreshold);
SE_DECLARE_FUNC(js_spine_TrackEntry_setHoldPrevious);
SE_DECLARE_FUNC(js_spine_TrackEntry_setLoop);
SE_DECLARE_FUNC(js_spine_TrackEntry_setMixBlend);
SE_DECLARE_FUNC(js_spine_TrackEntry_setMixDuration);
SE_DECLARE_FUNC(js_spine_TrackEntry_setMixTime);
SE_DECLARE_FUNC(js_spine_TrackEntry_setTimeScale);
SE_DECLARE_FUNC(js_spine_TrackEntry_setTrackEnd);
SE_DECLARE_FUNC(js_spine_TrackEntry_setTrackTime);

extern se::Object* __jsb_spine_AnimationState_proto;
extern se::Class* __jsb_spine_AnimationState_class;

bool js_register_spine_AnimationState(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::AnimationState);
SE_DECLARE_FUNC(js_spine_AnimationState_addAnimation);
SE_DECLARE_FUNC(js_spine_AnimationState_addEmptyAnimation);
SE_DECLARE_FUNC(js_spine_AnimationState_clearTrack);
SE_DECLARE_FUNC(js_spine_AnimationState_clearTracks);
SE_DECLARE_FUNC(js_spine_AnimationState_disableQueue);
SE_DECLARE_FUNC(js_spine_AnimationState_enableQueue);
SE_DECLARE_FUNC(js_spine_AnimationState_getCurrent);
SE_DECLARE_FUNC(js_spine_AnimationState_getData);
SE_DECLARE_FUNC(js_spine_AnimationState_getTimeScale);
SE_DECLARE_FUNC(js_spine_AnimationState_getTracks);
SE_DECLARE_FUNC(js_spine_AnimationState_setAnimation);
SE_DECLARE_FUNC(js_spine_AnimationState_setEmptyAnimation);
SE_DECLARE_FUNC(js_spine_AnimationState_setEmptyAnimations);
SE_DECLARE_FUNC(js_spine_AnimationState_setTimeScale);
SE_DECLARE_FUNC(js_spine_AnimationState_update);

extern se::Object* __jsb_spine_AnimationStateData_proto;
extern se::Class* __jsb_spine_AnimationStateData_class;

bool js_register_spine_AnimationStateData(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::AnimationStateData);
SE_DECLARE_FUNC(js_spine_AnimationStateData_getDefaultMix);
SE_DECLARE_FUNC(js_spine_AnimationStateData_getMix);
SE_DECLARE_FUNC(js_spine_AnimationStateData_getSkeletonData);
SE_DECLARE_FUNC(js_spine_AnimationStateData_setDefaultMix);
SE_DECLARE_FUNC(js_spine_AnimationStateData_setMix);

extern se::Object* __jsb_spine_Attachment_proto;
extern se::Class* __jsb_spine_Attachment_class;

bool js_register_spine_Attachment(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::Attachment);
SE_DECLARE_FUNC(js_spine_Attachment_copy);
SE_DECLARE_FUNC(js_spine_Attachment_dereference);
SE_DECLARE_FUNC(js_spine_Attachment_getName);
SE_DECLARE_FUNC(js_spine_Attachment_getRefCount);
SE_DECLARE_FUNC(js_spine_Attachment_reference);

extern se::Object* __jsb_spine_Timeline_proto;
extern se::Class* __jsb_spine_Timeline_class;

bool js_register_spine_Timeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::Timeline);
SE_DECLARE_FUNC(js_spine_Timeline_getPropertyId);

extern se::Object* __jsb_spine_AttachmentTimeline_proto;
extern se::Class* __jsb_spine_AttachmentTimeline_class;

bool js_register_spine_AttachmentTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::AttachmentTimeline);
SE_DECLARE_FUNC(js_spine_AttachmentTimeline_getAttachmentNames);
SE_DECLARE_FUNC(js_spine_AttachmentTimeline_getFrameCount);
SE_DECLARE_FUNC(js_spine_AttachmentTimeline_getFrames);
SE_DECLARE_FUNC(js_spine_AttachmentTimeline_getPropertyId);
SE_DECLARE_FUNC(js_spine_AttachmentTimeline_getSlotIndex);
SE_DECLARE_FUNC(js_spine_AttachmentTimeline_setFrame);
SE_DECLARE_FUNC(js_spine_AttachmentTimeline_setSlotIndex);

extern se::Object* __jsb_spine_Bone_proto;
extern se::Class* __jsb_spine_Bone_class;

bool js_register_spine_Bone(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::Bone);
SE_DECLARE_FUNC(js_spine_Bone_getA);
SE_DECLARE_FUNC(js_spine_Bone_getAScaleX);
SE_DECLARE_FUNC(js_spine_Bone_getAScaleY);
SE_DECLARE_FUNC(js_spine_Bone_getAShearX);
SE_DECLARE_FUNC(js_spine_Bone_getAShearY);
SE_DECLARE_FUNC(js_spine_Bone_getAX);
SE_DECLARE_FUNC(js_spine_Bone_getAY);
SE_DECLARE_FUNC(js_spine_Bone_getAppliedRotation);
SE_DECLARE_FUNC(js_spine_Bone_getB);
SE_DECLARE_FUNC(js_spine_Bone_getC);
SE_DECLARE_FUNC(js_spine_Bone_getChildren);
SE_DECLARE_FUNC(js_spine_Bone_getD);
SE_DECLARE_FUNC(js_spine_Bone_getData);
SE_DECLARE_FUNC(js_spine_Bone_getParent);
SE_DECLARE_FUNC(js_spine_Bone_getRotation);
SE_DECLARE_FUNC(js_spine_Bone_getScaleX);
SE_DECLARE_FUNC(js_spine_Bone_getScaleY);
SE_DECLARE_FUNC(js_spine_Bone_getShearX);
SE_DECLARE_FUNC(js_spine_Bone_getShearY);
SE_DECLARE_FUNC(js_spine_Bone_getSkeleton);
SE_DECLARE_FUNC(js_spine_Bone_getWorldRotationX);
SE_DECLARE_FUNC(js_spine_Bone_getWorldRotationY);
SE_DECLARE_FUNC(js_spine_Bone_getWorldScaleX);
SE_DECLARE_FUNC(js_spine_Bone_getWorldScaleY);
SE_DECLARE_FUNC(js_spine_Bone_getWorldToLocalRotationX);
SE_DECLARE_FUNC(js_spine_Bone_getWorldToLocalRotationY);
SE_DECLARE_FUNC(js_spine_Bone_getWorldX);
SE_DECLARE_FUNC(js_spine_Bone_getWorldY);
SE_DECLARE_FUNC(js_spine_Bone_getX);
SE_DECLARE_FUNC(js_spine_Bone_getY);
SE_DECLARE_FUNC(js_spine_Bone_isActive);
SE_DECLARE_FUNC(js_spine_Bone_isAppliedValid);
SE_DECLARE_FUNC(js_spine_Bone_rotateWorld);
SE_DECLARE_FUNC(js_spine_Bone_setA);
SE_DECLARE_FUNC(js_spine_Bone_setAScaleX);
SE_DECLARE_FUNC(js_spine_Bone_setAScaleY);
SE_DECLARE_FUNC(js_spine_Bone_setAShearX);
SE_DECLARE_FUNC(js_spine_Bone_setAShearY);
SE_DECLARE_FUNC(js_spine_Bone_setAX);
SE_DECLARE_FUNC(js_spine_Bone_setAY);
SE_DECLARE_FUNC(js_spine_Bone_setActive);
SE_DECLARE_FUNC(js_spine_Bone_setAppliedRotation);
SE_DECLARE_FUNC(js_spine_Bone_setAppliedValid);
SE_DECLARE_FUNC(js_spine_Bone_setB);
SE_DECLARE_FUNC(js_spine_Bone_setC);
SE_DECLARE_FUNC(js_spine_Bone_setD);
SE_DECLARE_FUNC(js_spine_Bone_setRotation);
SE_DECLARE_FUNC(js_spine_Bone_setScaleX);
SE_DECLARE_FUNC(js_spine_Bone_setScaleY);
SE_DECLARE_FUNC(js_spine_Bone_setShearX);
SE_DECLARE_FUNC(js_spine_Bone_setShearY);
SE_DECLARE_FUNC(js_spine_Bone_setToSetupPose);
SE_DECLARE_FUNC(js_spine_Bone_setWorldX);
SE_DECLARE_FUNC(js_spine_Bone_setWorldY);
SE_DECLARE_FUNC(js_spine_Bone_setX);
SE_DECLARE_FUNC(js_spine_Bone_setY);
SE_DECLARE_FUNC(js_spine_Bone_update);
SE_DECLARE_FUNC(js_spine_Bone_updateWorldTransform);
SE_DECLARE_FUNC(js_spine_Bone_setYDown);
SE_DECLARE_FUNC(js_spine_Bone_isYDown);

extern se::Object* __jsb_spine_BoneData_proto;
extern se::Class* __jsb_spine_BoneData_class;

bool js_register_spine_BoneData(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::BoneData);
SE_DECLARE_FUNC(js_spine_BoneData_getIndex);
SE_DECLARE_FUNC(js_spine_BoneData_getLength);
SE_DECLARE_FUNC(js_spine_BoneData_getName);
SE_DECLARE_FUNC(js_spine_BoneData_getParent);
SE_DECLARE_FUNC(js_spine_BoneData_getRotation);
SE_DECLARE_FUNC(js_spine_BoneData_getScaleX);
SE_DECLARE_FUNC(js_spine_BoneData_getScaleY);
SE_DECLARE_FUNC(js_spine_BoneData_getShearX);
SE_DECLARE_FUNC(js_spine_BoneData_getShearY);
SE_DECLARE_FUNC(js_spine_BoneData_getTransformMode);
SE_DECLARE_FUNC(js_spine_BoneData_getX);
SE_DECLARE_FUNC(js_spine_BoneData_getY);
SE_DECLARE_FUNC(js_spine_BoneData_isSkinRequired);
SE_DECLARE_FUNC(js_spine_BoneData_setLength);
SE_DECLARE_FUNC(js_spine_BoneData_setRotation);
SE_DECLARE_FUNC(js_spine_BoneData_setScaleX);
SE_DECLARE_FUNC(js_spine_BoneData_setScaleY);
SE_DECLARE_FUNC(js_spine_BoneData_setShearX);
SE_DECLARE_FUNC(js_spine_BoneData_setShearY);
SE_DECLARE_FUNC(js_spine_BoneData_setSkinRequired);
SE_DECLARE_FUNC(js_spine_BoneData_setTransformMode);
SE_DECLARE_FUNC(js_spine_BoneData_setX);
SE_DECLARE_FUNC(js_spine_BoneData_setY);

extern se::Object* __jsb_spine_VertexAttachment_proto;
extern se::Class* __jsb_spine_VertexAttachment_class;

bool js_register_spine_VertexAttachment(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::VertexAttachment);
SE_DECLARE_FUNC(js_spine_VertexAttachment_copyTo);
SE_DECLARE_FUNC(js_spine_VertexAttachment_getDeformAttachment);
SE_DECLARE_FUNC(js_spine_VertexAttachment_getId);
SE_DECLARE_FUNC(js_spine_VertexAttachment_getVertices);
SE_DECLARE_FUNC(js_spine_VertexAttachment_getWorldVerticesLength);
SE_DECLARE_FUNC(js_spine_VertexAttachment_setDeformAttachment);
SE_DECLARE_FUNC(js_spine_VertexAttachment_setWorldVerticesLength);

extern se::Object* __jsb_spine_BoundingBoxAttachment_proto;
extern se::Class* __jsb_spine_BoundingBoxAttachment_class;

bool js_register_spine_BoundingBoxAttachment(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::BoundingBoxAttachment);
SE_DECLARE_FUNC(js_spine_BoundingBoxAttachment_copy);

extern se::Object* __jsb_spine_ClippingAttachment_proto;
extern se::Class* __jsb_spine_ClippingAttachment_class;

bool js_register_spine_ClippingAttachment(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::ClippingAttachment);
SE_DECLARE_FUNC(js_spine_ClippingAttachment_copy);
SE_DECLARE_FUNC(js_spine_ClippingAttachment_getEndSlot);
SE_DECLARE_FUNC(js_spine_ClippingAttachment_setEndSlot);

extern se::Object* __jsb_spine_Color_proto;
extern se::Class* __jsb_spine_Color_class;

bool js_register_spine_Color(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::Color);
SE_DECLARE_FUNC(js_spine_Color_clamp);

extern se::Object* __jsb_spine_CurveTimeline_proto;
extern se::Class* __jsb_spine_CurveTimeline_class;

bool js_register_spine_CurveTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::CurveTimeline);
SE_DECLARE_FUNC(js_spine_CurveTimeline_getCurvePercent);
SE_DECLARE_FUNC(js_spine_CurveTimeline_getCurveType);
SE_DECLARE_FUNC(js_spine_CurveTimeline_getFrameCount);
SE_DECLARE_FUNC(js_spine_CurveTimeline_getPropertyId);
SE_DECLARE_FUNC(js_spine_CurveTimeline_setCurve);
SE_DECLARE_FUNC(js_spine_CurveTimeline_setLinear);
SE_DECLARE_FUNC(js_spine_CurveTimeline_setStepped);

extern se::Object* __jsb_spine_ColorTimeline_proto;
extern se::Class* __jsb_spine_ColorTimeline_class;

bool js_register_spine_ColorTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::ColorTimeline);
SE_DECLARE_FUNC(js_spine_ColorTimeline_getFrames);
SE_DECLARE_FUNC(js_spine_ColorTimeline_getPropertyId);
SE_DECLARE_FUNC(js_spine_ColorTimeline_getSlotIndex);
SE_DECLARE_FUNC(js_spine_ColorTimeline_setFrame);
SE_DECLARE_FUNC(js_spine_ColorTimeline_setSlotIndex);

extern se::Object* __jsb_spine_ConstraintData_proto;
extern se::Class* __jsb_spine_ConstraintData_class;

bool js_register_spine_ConstraintData(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::ConstraintData);
SE_DECLARE_FUNC(js_spine_ConstraintData_getName);
SE_DECLARE_FUNC(js_spine_ConstraintData_getOrder);
SE_DECLARE_FUNC(js_spine_ConstraintData_isSkinRequired);
SE_DECLARE_FUNC(js_spine_ConstraintData_setOrder);
SE_DECLARE_FUNC(js_spine_ConstraintData_setSkinRequired);

extern se::Object* __jsb_spine_DeformTimeline_proto;
extern se::Class* __jsb_spine_DeformTimeline_class;

bool js_register_spine_DeformTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::DeformTimeline);
SE_DECLARE_FUNC(js_spine_DeformTimeline_getAttachment);
SE_DECLARE_FUNC(js_spine_DeformTimeline_getFrames);
SE_DECLARE_FUNC(js_spine_DeformTimeline_getPropertyId);
SE_DECLARE_FUNC(js_spine_DeformTimeline_getSlotIndex);
SE_DECLARE_FUNC(js_spine_DeformTimeline_setAttachment);
SE_DECLARE_FUNC(js_spine_DeformTimeline_setSlotIndex);

extern se::Object* __jsb_spine_DrawOrderTimeline_proto;
extern se::Class* __jsb_spine_DrawOrderTimeline_class;

bool js_register_spine_DrawOrderTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::DrawOrderTimeline);
SE_DECLARE_FUNC(js_spine_DrawOrderTimeline_getFrameCount);
SE_DECLARE_FUNC(js_spine_DrawOrderTimeline_getFrames);
SE_DECLARE_FUNC(js_spine_DrawOrderTimeline_getPropertyId);

extern se::Object* __jsb_spine_Event_proto;
extern se::Class* __jsb_spine_Event_class;

bool js_register_spine_Event(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::Event);
SE_DECLARE_FUNC(js_spine_Event_getBalance);
SE_DECLARE_FUNC(js_spine_Event_getData);
SE_DECLARE_FUNC(js_spine_Event_getFloatValue);
SE_DECLARE_FUNC(js_spine_Event_getIntValue);
SE_DECLARE_FUNC(js_spine_Event_getStringValue);
SE_DECLARE_FUNC(js_spine_Event_getTime);
SE_DECLARE_FUNC(js_spine_Event_getVolume);
SE_DECLARE_FUNC(js_spine_Event_setBalance);
SE_DECLARE_FUNC(js_spine_Event_setFloatValue);
SE_DECLARE_FUNC(js_spine_Event_setIntValue);
SE_DECLARE_FUNC(js_spine_Event_setStringValue);
SE_DECLARE_FUNC(js_spine_Event_setVolume);

extern se::Object* __jsb_spine_EventData_proto;
extern se::Class* __jsb_spine_EventData_class;

bool js_register_spine_EventData(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::EventData);
SE_DECLARE_FUNC(js_spine_EventData_getAudioPath);
SE_DECLARE_FUNC(js_spine_EventData_getBalance);
SE_DECLARE_FUNC(js_spine_EventData_getFloatValue);
SE_DECLARE_FUNC(js_spine_EventData_getIntValue);
SE_DECLARE_FUNC(js_spine_EventData_getName);
SE_DECLARE_FUNC(js_spine_EventData_getStringValue);
SE_DECLARE_FUNC(js_spine_EventData_getVolume);
SE_DECLARE_FUNC(js_spine_EventData_setAudioPath);
SE_DECLARE_FUNC(js_spine_EventData_setBalance);
SE_DECLARE_FUNC(js_spine_EventData_setFloatValue);
SE_DECLARE_FUNC(js_spine_EventData_setIntValue);
SE_DECLARE_FUNC(js_spine_EventData_setStringValue);
SE_DECLARE_FUNC(js_spine_EventData_setVolume);

extern se::Object* __jsb_spine_EventTimeline_proto;
extern se::Class* __jsb_spine_EventTimeline_class;

bool js_register_spine_EventTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::EventTimeline);
SE_DECLARE_FUNC(js_spine_EventTimeline_getEvents);
SE_DECLARE_FUNC(js_spine_EventTimeline_getFrameCount);
SE_DECLARE_FUNC(js_spine_EventTimeline_getFrames);
SE_DECLARE_FUNC(js_spine_EventTimeline_getPropertyId);
SE_DECLARE_FUNC(js_spine_EventTimeline_setFrame);

extern se::Object* __jsb_spine_IkConstraint_proto;
extern se::Class* __jsb_spine_IkConstraint_class;

bool js_register_spine_IkConstraint(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::IkConstraint);
SE_DECLARE_FUNC(js_spine_IkConstraint_getBendDirection);
SE_DECLARE_FUNC(js_spine_IkConstraint_getBones);
SE_DECLARE_FUNC(js_spine_IkConstraint_getCompress);
SE_DECLARE_FUNC(js_spine_IkConstraint_getData);
SE_DECLARE_FUNC(js_spine_IkConstraint_getMix);
SE_DECLARE_FUNC(js_spine_IkConstraint_getOrder);
SE_DECLARE_FUNC(js_spine_IkConstraint_getSoftness);
SE_DECLARE_FUNC(js_spine_IkConstraint_getStretch);
SE_DECLARE_FUNC(js_spine_IkConstraint_getTarget);
SE_DECLARE_FUNC(js_spine_IkConstraint_isActive);
SE_DECLARE_FUNC(js_spine_IkConstraint_setActive);
SE_DECLARE_FUNC(js_spine_IkConstraint_setBendDirection);
SE_DECLARE_FUNC(js_spine_IkConstraint_setCompress);
SE_DECLARE_FUNC(js_spine_IkConstraint_setMix);
SE_DECLARE_FUNC(js_spine_IkConstraint_setSoftness);
SE_DECLARE_FUNC(js_spine_IkConstraint_setStretch);
SE_DECLARE_FUNC(js_spine_IkConstraint_setTarget);
SE_DECLARE_FUNC(js_spine_IkConstraint_update);

extern se::Object* __jsb_spine_IkConstraintData_proto;
extern se::Class* __jsb_spine_IkConstraintData_class;

bool js_register_spine_IkConstraintData(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::IkConstraintData);
SE_DECLARE_FUNC(js_spine_IkConstraintData_getBendDirection);
SE_DECLARE_FUNC(js_spine_IkConstraintData_getBones);
SE_DECLARE_FUNC(js_spine_IkConstraintData_getCompress);
SE_DECLARE_FUNC(js_spine_IkConstraintData_getMix);
SE_DECLARE_FUNC(js_spine_IkConstraintData_getSoftness);
SE_DECLARE_FUNC(js_spine_IkConstraintData_getStretch);
SE_DECLARE_FUNC(js_spine_IkConstraintData_getTarget);
SE_DECLARE_FUNC(js_spine_IkConstraintData_getUniform);
SE_DECLARE_FUNC(js_spine_IkConstraintData_setBendDirection);
SE_DECLARE_FUNC(js_spine_IkConstraintData_setCompress);
SE_DECLARE_FUNC(js_spine_IkConstraintData_setMix);
SE_DECLARE_FUNC(js_spine_IkConstraintData_setSoftness);
SE_DECLARE_FUNC(js_spine_IkConstraintData_setStretch);
SE_DECLARE_FUNC(js_spine_IkConstraintData_setTarget);
SE_DECLARE_FUNC(js_spine_IkConstraintData_setUniform);

extern se::Object* __jsb_spine_IkConstraintTimeline_proto;
extern se::Class* __jsb_spine_IkConstraintTimeline_class;

bool js_register_spine_IkConstraintTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::IkConstraintTimeline);
SE_DECLARE_FUNC(js_spine_IkConstraintTimeline_getPropertyId);
SE_DECLARE_FUNC(js_spine_IkConstraintTimeline_setFrame);

extern se::Object* __jsb_spine_MeshAttachment_proto;
extern se::Class* __jsb_spine_MeshAttachment_class;

bool js_register_spine_MeshAttachment(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::MeshAttachment);
SE_DECLARE_FUNC(js_spine_MeshAttachment_copy);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getColor);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getEdges);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getHeight);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getHullLength);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getParentMesh);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getPath);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionDegrees);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionHeight);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionOffsetX);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionOffsetY);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionOriginalHeight);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionOriginalWidth);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionRotate);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionU);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionU2);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionUVs);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionV);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionV2);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getRegionWidth);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getTriangles);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getUVs);
SE_DECLARE_FUNC(js_spine_MeshAttachment_getWidth);
SE_DECLARE_FUNC(js_spine_MeshAttachment_newLinkedMesh);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setHeight);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setHullLength);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setParentMesh);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setPath);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setRegionDegrees);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setRegionHeight);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setRegionOffsetX);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setRegionOffsetY);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setRegionOriginalHeight);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setRegionOriginalWidth);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setRegionRotate);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setRegionU);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setRegionU2);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setRegionV);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setRegionV2);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setRegionWidth);
SE_DECLARE_FUNC(js_spine_MeshAttachment_setWidth);
SE_DECLARE_FUNC(js_spine_MeshAttachment_updateUVs);

extern se::Object* __jsb_spine_PathAttachment_proto;
extern se::Class* __jsb_spine_PathAttachment_class;

bool js_register_spine_PathAttachment(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::PathAttachment);
SE_DECLARE_FUNC(js_spine_PathAttachment_copy);
SE_DECLARE_FUNC(js_spine_PathAttachment_getLengths);
SE_DECLARE_FUNC(js_spine_PathAttachment_isClosed);
SE_DECLARE_FUNC(js_spine_PathAttachment_isConstantSpeed);
SE_DECLARE_FUNC(js_spine_PathAttachment_setClosed);
SE_DECLARE_FUNC(js_spine_PathAttachment_setConstantSpeed);

extern se::Object* __jsb_spine_PathConstraint_proto;
extern se::Class* __jsb_spine_PathConstraint_class;

bool js_register_spine_PathConstraint(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::PathConstraint);
SE_DECLARE_FUNC(js_spine_PathConstraint_apply);
SE_DECLARE_FUNC(js_spine_PathConstraint_getBones);
SE_DECLARE_FUNC(js_spine_PathConstraint_getData);
SE_DECLARE_FUNC(js_spine_PathConstraint_getOrder);
SE_DECLARE_FUNC(js_spine_PathConstraint_getPosition);
SE_DECLARE_FUNC(js_spine_PathConstraint_getRotateMix);
SE_DECLARE_FUNC(js_spine_PathConstraint_getSpacing);
SE_DECLARE_FUNC(js_spine_PathConstraint_getTarget);
SE_DECLARE_FUNC(js_spine_PathConstraint_getTranslateMix);
SE_DECLARE_FUNC(js_spine_PathConstraint_isActive);
SE_DECLARE_FUNC(js_spine_PathConstraint_setActive);
SE_DECLARE_FUNC(js_spine_PathConstraint_setPosition);
SE_DECLARE_FUNC(js_spine_PathConstraint_setRotateMix);
SE_DECLARE_FUNC(js_spine_PathConstraint_setSpacing);
SE_DECLARE_FUNC(js_spine_PathConstraint_setTarget);
SE_DECLARE_FUNC(js_spine_PathConstraint_setTranslateMix);
SE_DECLARE_FUNC(js_spine_PathConstraint_update);

extern se::Object* __jsb_spine_PathConstraintData_proto;
extern se::Class* __jsb_spine_PathConstraintData_class;

bool js_register_spine_PathConstraintData(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::PathConstraintData);
SE_DECLARE_FUNC(js_spine_PathConstraintData_getBones);
SE_DECLARE_FUNC(js_spine_PathConstraintData_getOffsetRotation);
SE_DECLARE_FUNC(js_spine_PathConstraintData_getPosition);
SE_DECLARE_FUNC(js_spine_PathConstraintData_getPositionMode);
SE_DECLARE_FUNC(js_spine_PathConstraintData_getRotateMix);
SE_DECLARE_FUNC(js_spine_PathConstraintData_getRotateMode);
SE_DECLARE_FUNC(js_spine_PathConstraintData_getSpacing);
SE_DECLARE_FUNC(js_spine_PathConstraintData_getSpacingMode);
SE_DECLARE_FUNC(js_spine_PathConstraintData_getTarget);
SE_DECLARE_FUNC(js_spine_PathConstraintData_getTranslateMix);
SE_DECLARE_FUNC(js_spine_PathConstraintData_setOffsetRotation);
SE_DECLARE_FUNC(js_spine_PathConstraintData_setPosition);
SE_DECLARE_FUNC(js_spine_PathConstraintData_setPositionMode);
SE_DECLARE_FUNC(js_spine_PathConstraintData_setRotateMix);
SE_DECLARE_FUNC(js_spine_PathConstraintData_setRotateMode);
SE_DECLARE_FUNC(js_spine_PathConstraintData_setSpacing);
SE_DECLARE_FUNC(js_spine_PathConstraintData_setSpacingMode);
SE_DECLARE_FUNC(js_spine_PathConstraintData_setTarget);
SE_DECLARE_FUNC(js_spine_PathConstraintData_setTranslateMix);

extern se::Object* __jsb_spine_PathConstraintMixTimeline_proto;
extern se::Class* __jsb_spine_PathConstraintMixTimeline_class;

bool js_register_spine_PathConstraintMixTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::PathConstraintMixTimeline);
SE_DECLARE_FUNC(js_spine_PathConstraintMixTimeline_getPropertyId);

extern se::Object* __jsb_spine_PathConstraintPositionTimeline_proto;
extern se::Class* __jsb_spine_PathConstraintPositionTimeline_class;

bool js_register_spine_PathConstraintPositionTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::PathConstraintPositionTimeline);
SE_DECLARE_FUNC(js_spine_PathConstraintPositionTimeline_getPropertyId);
SE_DECLARE_FUNC(js_spine_PathConstraintPositionTimeline_setFrame);

extern se::Object* __jsb_spine_PathConstraintSpacingTimeline_proto;
extern se::Class* __jsb_spine_PathConstraintSpacingTimeline_class;

bool js_register_spine_PathConstraintSpacingTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::PathConstraintSpacingTimeline);
SE_DECLARE_FUNC(js_spine_PathConstraintSpacingTimeline_getPropertyId);

extern se::Object* __jsb_spine_PointAttachment_proto;
extern se::Class* __jsb_spine_PointAttachment_class;

bool js_register_spine_PointAttachment(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::PointAttachment);
SE_DECLARE_FUNC(js_spine_PointAttachment_copy);
SE_DECLARE_FUNC(js_spine_PointAttachment_getRotation);
SE_DECLARE_FUNC(js_spine_PointAttachment_getX);
SE_DECLARE_FUNC(js_spine_PointAttachment_getY);
SE_DECLARE_FUNC(js_spine_PointAttachment_setRotation);
SE_DECLARE_FUNC(js_spine_PointAttachment_setX);
SE_DECLARE_FUNC(js_spine_PointAttachment_setY);

extern se::Object* __jsb_spine_RegionAttachment_proto;
extern se::Class* __jsb_spine_RegionAttachment_class;

bool js_register_spine_RegionAttachment(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::RegionAttachment);
SE_DECLARE_FUNC(js_spine_RegionAttachment_copy);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getColor);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getHeight);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getOffset);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getPath);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getRegionHeight);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getRegionOffsetX);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getRegionOffsetY);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getRegionOriginalHeight);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getRegionOriginalWidth);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getRegionWidth);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getRotation);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getScaleX);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getScaleY);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getUVs);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getWidth);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getX);
SE_DECLARE_FUNC(js_spine_RegionAttachment_getY);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setHeight);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setPath);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setRegionHeight);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setRegionOffsetX);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setRegionOffsetY);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setRegionOriginalHeight);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setRegionOriginalWidth);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setRegionWidth);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setRotation);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setScaleX);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setScaleY);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setUVs);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setWidth);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setX);
SE_DECLARE_FUNC(js_spine_RegionAttachment_setY);
SE_DECLARE_FUNC(js_spine_RegionAttachment_updateOffset);

extern se::Object* __jsb_spine_RotateTimeline_proto;
extern se::Class* __jsb_spine_RotateTimeline_class;

bool js_register_spine_RotateTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::RotateTimeline);
SE_DECLARE_FUNC(js_spine_RotateTimeline_getBoneIndex);
SE_DECLARE_FUNC(js_spine_RotateTimeline_getFrames);
SE_DECLARE_FUNC(js_spine_RotateTimeline_getPropertyId);
SE_DECLARE_FUNC(js_spine_RotateTimeline_setBoneIndex);
SE_DECLARE_FUNC(js_spine_RotateTimeline_setFrame);

extern se::Object* __jsb_spine_TranslateTimeline_proto;
extern se::Class* __jsb_spine_TranslateTimeline_class;

bool js_register_spine_TranslateTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::TranslateTimeline);
SE_DECLARE_FUNC(js_spine_TranslateTimeline_getPropertyId);
SE_DECLARE_FUNC(js_spine_TranslateTimeline_setFrame);

extern se::Object* __jsb_spine_ScaleTimeline_proto;
extern se::Class* __jsb_spine_ScaleTimeline_class;

bool js_register_spine_ScaleTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::ScaleTimeline);
SE_DECLARE_FUNC(js_spine_ScaleTimeline_getPropertyId);

extern se::Object* __jsb_spine_ShearTimeline_proto;
extern se::Class* __jsb_spine_ShearTimeline_class;

bool js_register_spine_ShearTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::ShearTimeline);
SE_DECLARE_FUNC(js_spine_ShearTimeline_getPropertyId);

extern se::Object* __jsb_spine_Skeleton_proto;
extern se::Class* __jsb_spine_Skeleton_class;

bool js_register_spine_Skeleton(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::Skeleton);
SE_DECLARE_FUNC(js_spine_Skeleton_findBone);
SE_DECLARE_FUNC(js_spine_Skeleton_findBoneIndex);
SE_DECLARE_FUNC(js_spine_Skeleton_findIkConstraint);
SE_DECLARE_FUNC(js_spine_Skeleton_findPathConstraint);
SE_DECLARE_FUNC(js_spine_Skeleton_findSlot);
SE_DECLARE_FUNC(js_spine_Skeleton_findSlotIndex);
SE_DECLARE_FUNC(js_spine_Skeleton_findTransformConstraint);
SE_DECLARE_FUNC(js_spine_Skeleton_getAttachment);
SE_DECLARE_FUNC(js_spine_Skeleton_getBones);
SE_DECLARE_FUNC(js_spine_Skeleton_getColor);
SE_DECLARE_FUNC(js_spine_Skeleton_getData);
SE_DECLARE_FUNC(js_spine_Skeleton_getDrawOrder);
SE_DECLARE_FUNC(js_spine_Skeleton_getIkConstraints);
SE_DECLARE_FUNC(js_spine_Skeleton_getPathConstraints);
SE_DECLARE_FUNC(js_spine_Skeleton_getRootBone);
SE_DECLARE_FUNC(js_spine_Skeleton_getScaleX);
SE_DECLARE_FUNC(js_spine_Skeleton_getScaleY);
SE_DECLARE_FUNC(js_spine_Skeleton_getSkin);
SE_DECLARE_FUNC(js_spine_Skeleton_getSlots);
SE_DECLARE_FUNC(js_spine_Skeleton_getTime);
SE_DECLARE_FUNC(js_spine_Skeleton_getTransformConstraints);
SE_DECLARE_FUNC(js_spine_Skeleton_getUpdateCacheList);
SE_DECLARE_FUNC(js_spine_Skeleton_getX);
SE_DECLARE_FUNC(js_spine_Skeleton_getY);
SE_DECLARE_FUNC(js_spine_Skeleton_printUpdateCache);
SE_DECLARE_FUNC(js_spine_Skeleton_setAttachment);
SE_DECLARE_FUNC(js_spine_Skeleton_setBonesToSetupPose);
SE_DECLARE_FUNC(js_spine_Skeleton_setPosition);
SE_DECLARE_FUNC(js_spine_Skeleton_setScaleX);
SE_DECLARE_FUNC(js_spine_Skeleton_setScaleY);
SE_DECLARE_FUNC(js_spine_Skeleton_setSkin);
SE_DECLARE_FUNC(js_spine_Skeleton_setSlotsToSetupPose);
SE_DECLARE_FUNC(js_spine_Skeleton_setTime);
SE_DECLARE_FUNC(js_spine_Skeleton_setToSetupPose);
SE_DECLARE_FUNC(js_spine_Skeleton_setX);
SE_DECLARE_FUNC(js_spine_Skeleton_setY);
SE_DECLARE_FUNC(js_spine_Skeleton_update);
SE_DECLARE_FUNC(js_spine_Skeleton_updateCache);
SE_DECLARE_FUNC(js_spine_Skeleton_updateWorldTransform);

extern se::Object* __jsb_spine_SkeletonBounds_proto;
extern se::Class* __jsb_spine_SkeletonBounds_class;

bool js_register_spine_SkeletonBounds(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::SkeletonBounds);
SE_DECLARE_FUNC(js_spine_SkeletonBounds_aabbcontainsPoint);
SE_DECLARE_FUNC(js_spine_SkeletonBounds_aabbintersectsSegment);
SE_DECLARE_FUNC(js_spine_SkeletonBounds_containsPoint);
SE_DECLARE_FUNC(js_spine_SkeletonBounds_getHeight);
SE_DECLARE_FUNC(js_spine_SkeletonBounds_getPolygon);
SE_DECLARE_FUNC(js_spine_SkeletonBounds_getWidth);
SE_DECLARE_FUNC(js_spine_SkeletonBounds_intersectsSegment);

extern se::Object* __jsb_spine_Polygon_proto;
extern se::Class* __jsb_spine_Polygon_class;

bool js_register_spine_Polygon(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::Polygon);

extern se::Object* __jsb_spine_SkeletonData_proto;
extern se::Class* __jsb_spine_SkeletonData_class;

bool js_register_spine_SkeletonData(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::SkeletonData);
SE_DECLARE_FUNC(js_spine_SkeletonData_findAnimation);
SE_DECLARE_FUNC(js_spine_SkeletonData_findBone);
SE_DECLARE_FUNC(js_spine_SkeletonData_findBoneIndex);
SE_DECLARE_FUNC(js_spine_SkeletonData_findEvent);
SE_DECLARE_FUNC(js_spine_SkeletonData_findIkConstraint);
SE_DECLARE_FUNC(js_spine_SkeletonData_findPathConstraint);
SE_DECLARE_FUNC(js_spine_SkeletonData_findPathConstraintIndex);
SE_DECLARE_FUNC(js_spine_SkeletonData_findSkin);
SE_DECLARE_FUNC(js_spine_SkeletonData_findSlot);
SE_DECLARE_FUNC(js_spine_SkeletonData_findSlotIndex);
SE_DECLARE_FUNC(js_spine_SkeletonData_findTransformConstraint);
SE_DECLARE_FUNC(js_spine_SkeletonData_getAnimations);
SE_DECLARE_FUNC(js_spine_SkeletonData_getAudioPath);
SE_DECLARE_FUNC(js_spine_SkeletonData_getBones);
SE_DECLARE_FUNC(js_spine_SkeletonData_getDefaultSkin);
SE_DECLARE_FUNC(js_spine_SkeletonData_getEvents);
SE_DECLARE_FUNC(js_spine_SkeletonData_getFps);
SE_DECLARE_FUNC(js_spine_SkeletonData_getHash);
SE_DECLARE_FUNC(js_spine_SkeletonData_getHeight);
SE_DECLARE_FUNC(js_spine_SkeletonData_getIkConstraints);
SE_DECLARE_FUNC(js_spine_SkeletonData_getImagesPath);
SE_DECLARE_FUNC(js_spine_SkeletonData_getName);
SE_DECLARE_FUNC(js_spine_SkeletonData_getPathConstraints);
SE_DECLARE_FUNC(js_spine_SkeletonData_getSkins);
SE_DECLARE_FUNC(js_spine_SkeletonData_getSlots);
SE_DECLARE_FUNC(js_spine_SkeletonData_getTransformConstraints);
SE_DECLARE_FUNC(js_spine_SkeletonData_getVersion);
SE_DECLARE_FUNC(js_spine_SkeletonData_getWidth);
SE_DECLARE_FUNC(js_spine_SkeletonData_getX);
SE_DECLARE_FUNC(js_spine_SkeletonData_getY);
SE_DECLARE_FUNC(js_spine_SkeletonData_setAudioPath);
SE_DECLARE_FUNC(js_spine_SkeletonData_setDefaultSkin);
SE_DECLARE_FUNC(js_spine_SkeletonData_setFps);
SE_DECLARE_FUNC(js_spine_SkeletonData_setHash);
SE_DECLARE_FUNC(js_spine_SkeletonData_setHeight);
SE_DECLARE_FUNC(js_spine_SkeletonData_setImagesPath);
SE_DECLARE_FUNC(js_spine_SkeletonData_setName);
SE_DECLARE_FUNC(js_spine_SkeletonData_setVersion);
SE_DECLARE_FUNC(js_spine_SkeletonData_setWidth);
SE_DECLARE_FUNC(js_spine_SkeletonData_setX);
SE_DECLARE_FUNC(js_spine_SkeletonData_setY);

extern se::Object* __jsb_spine_Skin_proto;
extern se::Class* __jsb_spine_Skin_class;

bool js_register_spine_Skin(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::Skin);
SE_DECLARE_FUNC(js_spine_Skin_addSkin);
SE_DECLARE_FUNC(js_spine_Skin_copySkin);
SE_DECLARE_FUNC(js_spine_Skin_getAttachment);
SE_DECLARE_FUNC(js_spine_Skin_getBones);
SE_DECLARE_FUNC(js_spine_Skin_getConstraints);
SE_DECLARE_FUNC(js_spine_Skin_getName);
SE_DECLARE_FUNC(js_spine_Skin_removeAttachment);
SE_DECLARE_FUNC(js_spine_Skin_setAttachment);

extern se::Object* __jsb_spine_Slot_proto;
extern se::Class* __jsb_spine_Slot_class;

bool js_register_spine_Slot(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::Slot);
SE_DECLARE_FUNC(js_spine_Slot_getAttachment);
SE_DECLARE_FUNC(js_spine_Slot_getAttachmentTime);
SE_DECLARE_FUNC(js_spine_Slot_getBone);
SE_DECLARE_FUNC(js_spine_Slot_getColor);
SE_DECLARE_FUNC(js_spine_Slot_getDarkColor);
SE_DECLARE_FUNC(js_spine_Slot_getData);
SE_DECLARE_FUNC(js_spine_Slot_getDeform);
SE_DECLARE_FUNC(js_spine_Slot_getSkeleton);
SE_DECLARE_FUNC(js_spine_Slot_hasDarkColor);
SE_DECLARE_FUNC(js_spine_Slot_setAttachment);
SE_DECLARE_FUNC(js_spine_Slot_setAttachmentTime);
SE_DECLARE_FUNC(js_spine_Slot_setToSetupPose);

extern se::Object* __jsb_spine_SlotData_proto;
extern se::Class* __jsb_spine_SlotData_class;

bool js_register_spine_SlotData(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::SlotData);
SE_DECLARE_FUNC(js_spine_SlotData_getAttachmentName);
SE_DECLARE_FUNC(js_spine_SlotData_getBlendMode);
SE_DECLARE_FUNC(js_spine_SlotData_getBoneData);
SE_DECLARE_FUNC(js_spine_SlotData_getColor);
SE_DECLARE_FUNC(js_spine_SlotData_getDarkColor);
SE_DECLARE_FUNC(js_spine_SlotData_getIndex);
SE_DECLARE_FUNC(js_spine_SlotData_getName);
SE_DECLARE_FUNC(js_spine_SlotData_hasDarkColor);
SE_DECLARE_FUNC(js_spine_SlotData_setAttachmentName);
SE_DECLARE_FUNC(js_spine_SlotData_setBlendMode);
SE_DECLARE_FUNC(js_spine_SlotData_setHasDarkColor);

extern se::Object* __jsb_spine_TransformConstraint_proto;
extern se::Class* __jsb_spine_TransformConstraint_class;

bool js_register_spine_TransformConstraint(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::TransformConstraint);
SE_DECLARE_FUNC(js_spine_TransformConstraint_apply);
SE_DECLARE_FUNC(js_spine_TransformConstraint_getBones);
SE_DECLARE_FUNC(js_spine_TransformConstraint_getData);
SE_DECLARE_FUNC(js_spine_TransformConstraint_getOrder);
SE_DECLARE_FUNC(js_spine_TransformConstraint_getRotateMix);
SE_DECLARE_FUNC(js_spine_TransformConstraint_getScaleMix);
SE_DECLARE_FUNC(js_spine_TransformConstraint_getShearMix);
SE_DECLARE_FUNC(js_spine_TransformConstraint_getTarget);
SE_DECLARE_FUNC(js_spine_TransformConstraint_getTranslateMix);
SE_DECLARE_FUNC(js_spine_TransformConstraint_isActive);
SE_DECLARE_FUNC(js_spine_TransformConstraint_setActive);
SE_DECLARE_FUNC(js_spine_TransformConstraint_setRotateMix);
SE_DECLARE_FUNC(js_spine_TransformConstraint_setScaleMix);
SE_DECLARE_FUNC(js_spine_TransformConstraint_setShearMix);
SE_DECLARE_FUNC(js_spine_TransformConstraint_setTarget);
SE_DECLARE_FUNC(js_spine_TransformConstraint_setTranslateMix);
SE_DECLARE_FUNC(js_spine_TransformConstraint_update);

extern se::Object* __jsb_spine_TransformConstraintData_proto;
extern se::Class* __jsb_spine_TransformConstraintData_class;

bool js_register_spine_TransformConstraintData(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::TransformConstraintData);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_getBones);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_getOffsetRotation);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_getOffsetScaleX);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_getOffsetScaleY);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_getOffsetShearY);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_getOffsetX);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_getOffsetY);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_getRotateMix);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_getScaleMix);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_getShearMix);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_getTarget);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_getTranslateMix);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_isLocal);
SE_DECLARE_FUNC(js_spine_TransformConstraintData_isRelative);

extern se::Object* __jsb_spine_TransformConstraintTimeline_proto;
extern se::Class* __jsb_spine_TransformConstraintTimeline_class;

bool js_register_spine_TransformConstraintTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::TransformConstraintTimeline);
SE_DECLARE_FUNC(js_spine_TransformConstraintTimeline_getPropertyId);
SE_DECLARE_FUNC(js_spine_TransformConstraintTimeline_setFrame);

extern se::Object* __jsb_spine_TwoColorTimeline_proto;
extern se::Class* __jsb_spine_TwoColorTimeline_class;

bool js_register_spine_TwoColorTimeline(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::TwoColorTimeline);
SE_DECLARE_FUNC(js_spine_TwoColorTimeline_getPropertyId);
SE_DECLARE_FUNC(js_spine_TwoColorTimeline_getSlotIndex);
SE_DECLARE_FUNC(js_spine_TwoColorTimeline_setFrame);
SE_DECLARE_FUNC(js_spine_TwoColorTimeline_setSlotIndex);

extern se::Object* __jsb_spine_VertexEffect_proto;
extern se::Class* __jsb_spine_VertexEffect_class;

bool js_register_spine_VertexEffect(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::VertexEffect);

extern se::Object* __jsb_spine_JitterVertexEffect_proto;
extern se::Class* __jsb_spine_JitterVertexEffect_class;

bool js_register_spine_JitterVertexEffect(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::JitterVertexEffect);
SE_DECLARE_FUNC(js_spine_JitterVertexEffect_getJitterX);
SE_DECLARE_FUNC(js_spine_JitterVertexEffect_getJitterY);
SE_DECLARE_FUNC(js_spine_JitterVertexEffect_setJitterX);
SE_DECLARE_FUNC(js_spine_JitterVertexEffect_setJitterY);

extern se::Object* __jsb_spine_SwirlVertexEffect_proto;
extern se::Class* __jsb_spine_SwirlVertexEffect_class;

bool js_register_spine_SwirlVertexEffect(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::SwirlVertexEffect);
SE_DECLARE_FUNC(js_spine_SwirlVertexEffect_getAngle);
SE_DECLARE_FUNC(js_spine_SwirlVertexEffect_getCenterX);
SE_DECLARE_FUNC(js_spine_SwirlVertexEffect_getCenterY);
SE_DECLARE_FUNC(js_spine_SwirlVertexEffect_getRadius);
SE_DECLARE_FUNC(js_spine_SwirlVertexEffect_getWorldX);
SE_DECLARE_FUNC(js_spine_SwirlVertexEffect_getWorldY);
SE_DECLARE_FUNC(js_spine_SwirlVertexEffect_setAngle);
SE_DECLARE_FUNC(js_spine_SwirlVertexEffect_setCenterX);
SE_DECLARE_FUNC(js_spine_SwirlVertexEffect_setCenterY);
SE_DECLARE_FUNC(js_spine_SwirlVertexEffect_setRadius);
SE_DECLARE_FUNC(js_spine_SwirlVertexEffect_setWorldX);
SE_DECLARE_FUNC(js_spine_SwirlVertexEffect_setWorldY);

extern se::Object* __jsb_spine_VertexEffectDelegate_proto;
extern se::Class* __jsb_spine_VertexEffectDelegate_class;

bool js_register_spine_VertexEffectDelegate(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::VertexEffectDelegate);
SE_DECLARE_FUNC(js_spine_VertexEffectDelegate_clear);
SE_DECLARE_FUNC(js_spine_VertexEffectDelegate_getEffectType);
SE_DECLARE_FUNC(js_spine_VertexEffectDelegate_getJitterVertexEffect);
SE_DECLARE_FUNC(js_spine_VertexEffectDelegate_getSwirlVertexEffect);
SE_DECLARE_FUNC(js_spine_VertexEffectDelegate_getVertexEffect);
SE_DECLARE_FUNC(js_spine_VertexEffectDelegate_initJitter);
SE_DECLARE_FUNC(js_spine_VertexEffectDelegate_initSwirlWithPow);
SE_DECLARE_FUNC(js_spine_VertexEffectDelegate_initSwirlWithPowOut);
SE_DECLARE_FUNC(js_spine_VertexEffectDelegate_VertexEffectDelegate);

extern se::Object* __jsb_spine_SkeletonRenderer_proto;
extern se::Class* __jsb_spine_SkeletonRenderer_class;

bool js_register_spine_SkeletonRenderer(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::SkeletonRenderer);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_beginSchedule);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_findBone);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_findSlot);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_getAttachment);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_getBoundingBox);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_getDebugData);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_getParamsBuffer);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_getSharedBufferOffset);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_getSkeleton);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_getTimeScale);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_initWithSkeleton);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_initWithUUID);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_initialize);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_isOpacityModifyRGB);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_onDisable);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_onEnable);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_paused);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_render);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setAttachEnabled);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setAttachment);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setBatchEnabled);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setBonesToSetupPose);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setColor);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setDebugBonesEnabled);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setDebugMeshEnabled);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setDebugSlotsEnabled);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setOpacityModifyRGB);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setSkin);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setSlotsRange);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setSlotsToSetupPose);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setTimeScale);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setToSetupPose);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setUseTint);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_setVertexEffectDelegate);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_stopSchedule);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_update);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_updateWorldTransform);
SE_DECLARE_FUNC(js_spine_SkeletonRenderer_SkeletonRenderer);

extern se::Object* __jsb_spine_SkeletonAnimation_proto;
extern se::Class* __jsb_spine_SkeletonAnimation_class;

bool js_register_spine_SkeletonAnimation(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::SkeletonAnimation);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_addAnimation);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_addEmptyAnimation);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_clearTrack);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_clearTracks);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_findAnimation);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_getCurrent);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_getState);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setAnimation);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setAnimationStateData);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setCompleteListener);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setDisposeListener);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setEmptyAnimation);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setEmptyAnimations);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setEndListener);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setEventListener);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setInterruptListener);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setMix);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setStartListener);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setTrackCompleteListener);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setTrackDisposeListener);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setTrackEndListener);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setTrackEventListener);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setTrackInterruptListener);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setTrackStartListener);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_create);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_createWithJsonFile);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_createWithBinaryFile);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_setGlobalTimeScale);
SE_DECLARE_FUNC(js_spine_SkeletonAnimation_SkeletonAnimation);

extern se::Object* __jsb_spine_SkeletonCacheAnimation_proto;
extern se::Class* __jsb_spine_SkeletonCacheAnimation_class;

bool js_register_spine_SkeletonCacheAnimation(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::SkeletonCacheAnimation);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_addAnimation);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_beginSchedule);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_findAnimation);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_findBone);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_findSlot);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_getAttachment);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_getParamsBuffer);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_getSharedBufferOffset);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_getSkeleton);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_getTimeScale);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_isOpacityModifyRGB);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_onDisable);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_onEnable);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_paused);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setAnimation);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setAttachEnabled);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setAttachment);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setBatchEnabled);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setBonesToSetupPose);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setColor);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setCompleteListener);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setEndListener);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setOpacityModifyRGB);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setSkin);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setSlotsToSetupPose);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setStartListener);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setTimeScale);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setToSetupPose);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_setUseTint);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_stopSchedule);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_update);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_updateAllAnimationCache);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_updateAnimationCache);
SE_DECLARE_FUNC(js_spine_SkeletonCacheAnimation_SkeletonCacheAnimation);

extern se::Object* __jsb_spine_SkeletonCacheMgr_proto;
extern se::Class* __jsb_spine_SkeletonCacheMgr_class;

bool js_register_spine_SkeletonCacheMgr(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::SkeletonCacheMgr);
SE_DECLARE_FUNC(js_spine_SkeletonCacheMgr_buildSkeletonCache);
SE_DECLARE_FUNC(js_spine_SkeletonCacheMgr_removeSkeletonCache);
SE_DECLARE_FUNC(js_spine_SkeletonCacheMgr_getInstance);
SE_DECLARE_FUNC(js_spine_SkeletonCacheMgr_destroyInstance);

extern se::Object* __jsb_spine_SkeletonDataMgr_proto;
extern se::Class* __jsb_spine_SkeletonDataMgr_class;

bool js_register_spine_SkeletonDataMgr(se::Object* obj);
bool register_all_spine(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(spine::SkeletonDataMgr);
SE_DECLARE_FUNC(js_spine_SkeletonDataMgr_setDestroyCallback);
SE_DECLARE_FUNC(js_spine_SkeletonDataMgr_getInstance);
SE_DECLARE_FUNC(js_spine_SkeletonDataMgr_SkeletonDataMgr);

