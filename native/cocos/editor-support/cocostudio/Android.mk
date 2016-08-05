LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE := cocostudio_static

LOCAL_MODULE_FILENAME := libcocostudio

LOCAL_ARM_MODE := arm

LOCAL_SRC_FILES := CCActionFrame.cpp \
CCActionFrameEasing.cpp \
CCActionManagerEx.cpp \
CCActionNode.cpp \
CCActionObject.cpp \
CCArmature.cpp \
CCBone.cpp \
CCArmatureAnimation.cpp \
CCProcessBase.cpp \
CCTween.cpp \
CCDatas.cpp \
CCBatchNode.cpp \
CCDecorativeDisplay.cpp \
CCDisplayFactory.cpp \
CCDisplayManager.cpp \
CCSkin.cpp \
CCColliderDetector.cpp \
CCArmatureDataManager.cpp \
CCArmatureDefine.cpp \
CCDataReaderHelper.cpp \
CCSpriteFrameCacheHelper.cpp \
CCTransformHelp.cpp \
CCUtilMath.cpp \
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
CocoStudio.cpp


LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/..

LOCAL_C_INCLUDES := $(LOCAL_PATH)/..

LOCAL_CFLAGS += -fexceptions

LOCAL_STATIC_LIBRARIES := cocos_ui_static
LOCAL_STATIC_LIBRARIES += cocosdenshion_static

include $(BUILD_STATIC_LIBRARY)
