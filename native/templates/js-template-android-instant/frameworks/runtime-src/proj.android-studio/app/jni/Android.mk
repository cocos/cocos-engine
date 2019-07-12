LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs

ifeq ($(USE_ARM_MODE),1)
LOCAL_ARM_MODE := arm
endif

LOCAL_SRC_FILES := hellojavascript/main.cpp \
				   ../../../Classes/AppDelegate.cpp \
				   ../../../Classes/jsb_module_register.cpp \

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../../Classes


LOCAL_STATIC_LIBRARIES := cocos2dx_static

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2

include $(BUILD_SHARED_LIBRARY)

ifeq ($(TARGET_ARCH_ABI),armeabi-v7a)
     LOCAL_WHOLE_STATIC_LIBRARIES += android_support
endif

$(call import-module, cocos)
