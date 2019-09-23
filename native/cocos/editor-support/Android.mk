LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE := editor_support_static

LOCAL_MODULE_FILENAME := libeditorsupport

LOCAL_ARM_MODE := arm

LOCAL_SRC_FILES := \
../scripting/js-bindings/manual/jsb_helper.cpp \
IOBuffer.cpp \
MeshBuffer.cpp \
middleware-adapter.cpp \
TypedArrayPool.cpp \
IOTypedArray.cpp \
MiddlewareManager.cpp \
../scripting/js-bindings/auto/jsb_cocos2dx_editor_support_auto.cpp

ifeq ($(USE_PARTICLE),1)
LOCAL_SRC_FILES += \
particle/ParticleSimulator.cpp \
../scripting/js-bindings/auto/jsb_cocos2dx_particle_auto.cpp
endif # USE_PARTICLE

ifeq ($(USE_SPINE),1)
LOCAL_SRC_FILES += \
spine/Animation.cpp \
spine/AnimationState.cpp \
spine/AnimationStateData.cpp \
spine/Atlas.cpp \
spine/AtlasAttachmentLoader.cpp \
spine/Attachment.cpp \
spine/AttachmentLoader.cpp \
spine/AttachmentTimeline.cpp \
spine/Bone.cpp \
spine/BoneData.cpp \
spine/BoundingBoxAttachment.cpp \
spine/ClippingAttachment.cpp \
spine/ColorTimeline.cpp \
spine/Constraint.cpp \
spine/CurveTimeline.cpp \
spine/DeformTimeline.cpp \
spine/DrawOrderTimeline.cpp \
spine/Event.cpp \
spine/EventData.cpp \
spine/EventTimeline.cpp \
spine/Extension.cpp \
spine/IkConstraint.cpp \
spine/IkConstraintData.cpp \
spine/IkConstraintTimeline.cpp \
spine/Json.cpp \
spine/LinkedMesh.cpp \
spine/MathUtil.cpp \
spine/MeshAttachment.cpp \
spine/PathAttachment.cpp \
spine/PathConstraint.cpp \
spine/PathConstraintData.cpp \
spine/PathConstraintMixTimeline.cpp \
spine/PathConstraintPositionTimeline.cpp \
spine/PathConstraintSpacingTimeline.cpp \
spine/PointAttachment.cpp \
spine/RegionAttachment.cpp \
spine/RotateTimeline.cpp \
spine/RTTI.cpp \
spine/ScaleTimeline.cpp \
spine/ShearTimeline.cpp \
spine/Skeleton.cpp \
spine/SkeletonBinary.cpp \
spine/SkeletonBounds.cpp \
spine/SkeletonClipping.cpp \
spine/SkeletonData.cpp \
spine/SkeletonJson.cpp \
spine/Skin.cpp \
spine/Slot.cpp \
spine/SlotData.cpp \
spine/SpineObject.cpp \
spine/TextureLoader.cpp \
spine/Timeline.cpp \
spine/TransformConstraint.cpp \
spine/TransformConstraintData.cpp \
spine/TransformConstraintTimeline.cpp \
spine/TranslateTimeline.cpp \
spine/Triangulator.cpp \
spine/TwoColorTimeline.cpp \
spine/Updatable.cpp \
spine/VertexAttachment.cpp \
spine/VertexEffect.cpp \
spine-creator-support/AttachmentVertices.cpp \
spine-creator-support/SkeletonAnimation.cpp \
spine-creator-support/SkeletonDataMgr.cpp \
spine-creator-support/SkeletonRenderer.cpp \
spine-creator-support/spine-cocos2dx.cpp \
spine-creator-support/VertexEffectDelegate.cpp \
spine-creator-support/SkeletonCacheMgr.cpp \
spine-creator-support/SkeletonCache.cpp \
spine-creator-support/SkeletonCacheAnimation.cpp \
../scripting/js-bindings/manual/jsb_spine_manual.cpp \
../scripting/js-bindings/auto/jsb_cocos2dx_spine_auto.cpp
endif # USE_SPINE

ifeq ($(USE_DRAGONBONES),1)
LOCAL_SRC_FILES += \
dragonbones/animation/Animation.cpp \
dragonbones/animation/AnimationState.cpp \
dragonbones/animation/BaseTimelineState.cpp \
dragonbones/animation/TimelineState.cpp \
dragonbones/animation/WorldClock.cpp \
dragonbones/armature/Armature.cpp \
dragonbones/armature/Bone.cpp \
dragonbones/armature/Constraint.cpp \
dragonbones/armature/DeformVertices.cpp \
dragonbones/armature/Slot.cpp \
dragonbones/armature/TransformObject.cpp \
dragonbones/core/BaseObject.cpp \
dragonbones/core/DragonBones.cpp \
dragonbones/event/EventObject.cpp \
dragonbones/factory/BaseFactory.cpp \
dragonbones/geom/Point.cpp \
dragonbones/geom/Transform.cpp \
dragonbones/model/AnimationConfig.cpp \
dragonbones/model/AnimationData.cpp \
dragonbones/model/ArmatureData.cpp \
dragonbones/model/BoundingBoxData.cpp \
dragonbones/model/CanvasData.cpp \
dragonbones/model/ConstraintData.cpp \
dragonbones/model/DisplayData.cpp \
dragonbones/model/DragonBonesData.cpp \
dragonbones/model/SkinData.cpp \
dragonbones/model/TextureAtlasData.cpp \
dragonbones/model/UserData.cpp \
dragonbones/parser/DataParser.cpp \
dragonbones/parser/BinaryDataParser.cpp \
dragonbones/parser/JSONDataParser.cpp \
dragonbones-creator-support/CCArmatureDisplay.cpp \
dragonbones-creator-support/CCFactory.cpp \
dragonbones-creator-support/CCSlot.cpp \
dragonbones-creator-support/CCTextureAtlasData.cpp \
dragonbones-creator-support/ArmatureCache.cpp \
dragonbones-creator-support/ArmatureCacheMgr.cpp \
dragonbones-creator-support/CCArmatureCacheDisplay.cpp \
../scripting/js-bindings/manual/jsb_dragonbones_manual.cpp \
../scripting/js-bindings/auto/jsb_cocos2dx_dragonbones_auto.cpp
endif # USE_DRAGONBONES

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH) \
						   $(LOCAL_PATH)/.. \
						   $(LOCAL_PATH)/../..

LOCAL_C_INCLUDES := $(LOCAL_PATH)/.. \
					$(LOCAL_PATH)/../.. \
                    $(LOCAL_PATH)/../../external/android/$(TARGET_ARCH_ABI)/include/v8 \
					$(LOCAL_PATH)/../../external/sources/ 

include $(BUILD_STATIC_LIBRARY)