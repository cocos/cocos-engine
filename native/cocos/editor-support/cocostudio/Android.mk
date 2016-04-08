LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE := cocostudio_static

LOCAL_MODULE_FILENAME := libcocostudio

LOCAL_SRC_FILES := CCActionFrame.cpp \
CCActionFrameEasing.cpp \
CCActionManagerEx.cpp \
CCActionNode.cpp \
CCActionObject.cpp \
CCComAttribute.cpp \
CCComAudio.cpp \
CCComController.cpp \
CCComRender.cpp \
CCInputDelegate.cpp \
DictionaryHelper.cpp \
CocoLoader.cpp \
ActionTimeline/CCFrame.cpp \
ActionTimeline/CCTimeLine.cpp \
ActionTimeline/CCActionTimeline.cpp \
ActionTimeline/CCActionTimelineNode.cpp \
ActionTimeline/CCBoneNode.cpp \
ActionTimeline/CCSkeletonNode.cpp \
ActionTimeline/CCSkinNode.cpp \
WidgetCallBackHandlerProtocol.cpp \
CCComExtensionData.cpp \
CocoStudio.cpp \
Armature/CCArmature.cpp \
Armature/CCBone.cpp \
Armature/CCArmatureAnimation.cpp \
Armature/CCProcessBase.cpp \
Armature/CCTween.cpp \
Armature/CCDatas.cpp \
Armature/CCBatchNode.cpp \
Armature/CCDecorativeDisplay.cpp \
Armature/CCDisplayFactory.cpp \
Armature/CCDisplayManager.cpp \
Armature/CCSkin.cpp \
Armature/CCColliderDetector.cpp \
Armature/CCArmatureDataManager.cpp \
Armature/CCArmatureDefine.cpp \
Armature/CCDataReaderHelper.cpp \
Armature/CCSpriteFrameCacheHelper.cpp \
Armature/CCTransformHelp.cpp \
Armature/CCUtilMath.cpp

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/..

LOCAL_C_INCLUDES := $(LOCAL_PATH)/..

LOCAL_CFLAGS += -fexceptions

LOCAL_STATIC_LIBRARIES := cocos_ui_static
LOCAL_STATIC_LIBRARIES += cocosdenshion_static

include $(BUILD_STATIC_LIBRARY)
