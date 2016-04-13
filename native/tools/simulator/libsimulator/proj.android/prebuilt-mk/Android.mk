LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE := cocos2d_simulator_static

LOCAL_MODULE_FILENAME := libsimulator

LOCAL_SRC_FILES := ../../../../../prebuilt/android/$(TARGET_ARCH_ABI)/libsimulator.a


LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/../../lib \
$(LOCAL_PATH)/../../lib/protobuf-lite



LOCAL_WHOLE_STATIC_LIBRARIES := cocos2dx_static

include $(PREBUILT_STATIC_LIBRARY)
