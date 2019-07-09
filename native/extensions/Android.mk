LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE    := cocos_extension_static

LOCAL_MODULE_FILENAME := libextension

ifeq ($(USE_ARM_MODE),1)
LOCAL_ARM_MODE := arm
endif

LOCAL_SRC_FILES := \
assets-manager/Manifest.cpp \
assets-manager/AssetsManagerEx.cpp \
assets-manager/CCEventAssetsManagerEx.cpp \
assets-manager/CCAsyncTaskPool.cpp \

LOCAL_CXXFLAGS += -fexceptions

LOCAL_C_INCLUDES := $(LOCAL_PATH)/. \
                    $(LOCAL_PATH)/.. \
                    $(LOCAL_PATH)/../cocos \
                    $(LOCAL_PATH)/../cocos/platform \
                    $(LOCAL_PATH)/../external/sources \
                    $(LOCAL_PATH)/../external/android/$(TARGET_ARCH_ABI)/include/v8/libc++

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/. \
                           $(LOCAL_PATH)/..

ifeq ($(TARGET_ARCH_ABI),armeabi-v7a)
	LOCAL_WHOLE_STATIC_LIBRARIES += android_support
endif
                    
include $(BUILD_STATIC_LIBRARY)
