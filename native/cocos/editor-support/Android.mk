LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE := editor_support_static

LOCAL_MODULE_FILENAME := libeditorsupport

LOCAL_ARM_MODE := arm

LOCAL_SRC_FILES := \
../scripting/js-bindings/manual/jsb_helper.cpp \
IOBuffer.cpp \
middleware-adapter.cpp \
TypedArrayPool.cpp \
IOTypedArray.cpp \
MiddlewareManager.cpp \
../scripting/js-bindings/auto/jsb_cocos2dx_editor_support_auto.cpp

ifeq ($(USE_SPINE),1)
LOCAL_SRC_FILES += \
spine/Animation.c \
spine/AnimationState.c \
spine/AnimationStateData.c \
spine/Array.c \
spine/Atlas.c \
spine/AtlasAttachmentLoader.c \
spine/Attachment.c \
spine/AttachmentLoader.c \
spine/Bone.c \
spine/BoneData.c \
spine/BoundingBoxAttachment.c \
spine/ClippingAttachment.c \
spine/Color.c \
spine/Event.c \
spine/EventData.c \
spine/extension.c \
spine/IkConstraint.c \
spine/IkConstraintData.c \
spine/Json.c \
spine/MeshAttachment.c \
spine/PathAttachment.c \
spine/PathConstraint.c \
spine/PathConstraintData.c \
spine/PointAttachment.c \
spine/RegionAttachment.c \
spine/Skeleton.c \
spine/SkeletonBinary.c \
spine/SkeletonBounds.c \
spine/SkeletonClipping.c \
spine/SkeletonData.c \
spine/SkeletonJson.c \
spine/Skin.c \
spine/Slot.c \
spine/SlotData.c \
spine/TransformConstraint.c \
spine/TransformConstraintData.c \
spine/Triangulator.c \
spine/VertexAttachment.c \
spine/VertexEffect.c \
spine-creator-support/AttachmentVertices.cpp \
spine-creator-support/CreatorAttachmentLoader.cpp \
spine-creator-support/SpineAnimation.cpp \
spine-creator-support/SpineRenderer.cpp \
spine-creator-support/spine-cocos2dx.cpp \
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