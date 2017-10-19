LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs

ifeq ($(COCOS_SIMULATOR_BUILD),1)
LOCAL_ARM_MODE := arm
endif

LOCAL_SRC_FILES := hellojavascript/main.cpp \
				   ../../Classes/AppDelegate.cpp \
				   ../../Classes/ide-support/RuntimeJsImpl.cpp \
				   ../../../../../../cocos/scripting/js-bindings/manual/jsb_module_register.cpp

LOCAL_C_INCLUDES := \
$(LOCAL_PATH)/../../Classes \
$(LOCAL_PATH)/../../../../../../external \
$(LOCAL_PATH)/../../../../../../tools/simulator/libsimulator/lib \
$(LOCAL_PATH)/../../../../../../tools/simulator/libsimulator/lib/protobuf-lite

LOCAL_STATIC_LIBRARIES := cocos2d_simulator_static
LOCAL_STATIC_LIBRARIES += cocos2d_js_static

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2 -DCOCOS2D_JAVASCRIPT

include $(BUILD_SHARED_LIBRARY)

$(call import-module,scripting/js-bindings/proj.android)
$(call import-module,tools/simulator/libsimulator/proj.android)
