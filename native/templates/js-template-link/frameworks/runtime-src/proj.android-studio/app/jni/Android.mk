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

ifeq ($(USE_ANY_SDK),1)
LOCAL_SRC_FILES += ../../../Classes/anysdk/SDKManager.cpp \
				   ../../../Classes/anysdk/jsb_anysdk_basic_conversions.cpp \
				   ../../../Classes/anysdk/manualanysdkbindings.cpp \
				   ../../../Classes/anysdk/jsb_anysdk_protocols_auto.cpp

LOCAL_C_INCLUDES += $(LOCAL_PATH)/../../../Classes/anysdk

LOCAL_WHOLE_STATIC_LIBRARIES := PluginProtocolStatic
endif


LOCAL_STATIC_LIBRARIES := cocos2d_js_static

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2 -DCOCOS2D_JAVASCRIPT

include $(BUILD_SHARED_LIBRARY)


$(call import-module, scripting/js-bindings/proj.android)
