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
assets-manager/CCEventListenerAssetsManagerEx.cpp \

LOCAL_STATIC_LIBRARIES := cis
LOCAL_STATIC_LIBRARIES += cocos_chipmunk_static

LOCAL_CXXFLAGS += -fexceptions

LOCAL_C_INCLUDES := $(LOCAL_PATH)

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/. \
                           $(LOCAL_PATH)/.. \
                           $(LOCAL_PATH)/GUI/CCControlExtension \
                           $(LOCAL_PATH)/GUI/CCScrollView 
                    
include $(BUILD_STATIC_LIBRARY)
