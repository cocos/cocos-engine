LOCAL_PATH := $(call my-dir)
#==============================================================
include $(CLEAR_VARS)

LOCAL_MODULE := cocos2d_js_static
LOCAL_MODULE_FILENAME := libjscocos2d

LOCAL_ARM_MODE := arm

LOCAL_SRC_FILES := ../auto/jsb_cocos2dx_extension_auto.cpp \
                   ../auto/jsb_cocos2dx_experimental_webView_auto.cpp \
                   ../auto/jsb_cocos2dx_experimental_video_auto.cpp \
                   ../auto/jsb_cocos2dx_spine_auto.cpp \
                   ../auto/jsb_cocos2dx_dragonbones_auto.cpp \
                   ../auto/jsb_cocos2dx_auto.cpp \
                   ../auto/jsb_cocos2dx_audioengine_auto.cpp \
                   ../auto/jsb_cocos2dx_ui_auto.cpp \
                   ../auto/jsb_cocos2dx_network_auto.cpp \
                   ../auto/jsb_creator_auto.cpp \
                   ../auto/jsb_box2d_auto.cpp \
                   ../manual/ScriptingCore.cpp \
                   ../manual/cocos2d_specifics.cpp \
                   ../manual/js_manual_conversions.cpp \
                   ../manual/BaseJSAction.cpp \
                   ../manual/creator/js_bindings_creator_manual.cpp \
                   ../manual/box2d/js_bindings_box2d_manual.cpp \
                   ../manual/js_bindings_opengl.cpp \
                   ../manual/jsb_opengl_functions.cpp \
                   ../manual/jsb_opengl_manual.cpp \
                   ../manual/jsb_opengl_registration.cpp \
                   ../manual/jsb_event_dispatcher_manual.cpp \
                   ../manual/js_module_register.cpp \
                   ../manual/experimental/jsb_cocos2dx_experimental_video_manual.cpp \
                   ../manual/experimental/jsb_cocos2dx_experimental_webView_manual.cpp \
                   ../manual/extension/jsb_cocos2dx_extension_manual.cpp \
                   ../manual/localstorage/js_bindings_system_functions.cpp \
                   ../manual/localstorage/js_bindings_system_registration.cpp \
                   ../manual/network/jsb_socketio.cpp \
                   ../manual/network/jsb_websocket.cpp \
                   ../manual/network/XMLHTTPRequest.cpp \
                   ../manual/network/js_network_manual.cpp \
                   ../manual/spine/jsb_cocos2dx_spine_manual.cpp \
                   ../manual/dragonbones/jsb_cocos2dx_dragonbones_manual.cpp \
                   ../manual/ui/jsb_cocos2dx_ui_manual.cpp \
                   ../manual/platform/android/CCJavascriptJavaBridge.cpp

LOCAL_CFLAGS := -DCOCOS2D_JAVASCRIPT

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_JAVASCRIPT

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../manual \
                    $(LOCAL_PATH)/../manual/spine \
                    $(LOCAL_PATH)/../manual/platform/android \
                    $(LOCAL_PATH)/../auto \
                    $(LOCAL_PATH)/../../../2d \
                    $(LOCAL_PATH)/../../../base \
                    $(LOCAL_PATH)/../../../ui \
                    $(LOCAL_PATH)/../../../audio/include \
                    $(LOCAL_PATH)/../../../storage \
                    $(LOCAL_PATH)/../../../../extensions \
                    $(LOCAL_PATH)/../../../editor-support/spine \
                    $(LOCAL_PATH)/../../../editor-support/cocostudio \
                    $(LOCAL_PATH)/../../../editor-support/creator


LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/../manual \
                           $(LOCAL_PATH)/../auto \
                           $(LOCAL_PATH)/../../../audio/include

LOCAL_EXPORT_LDLIBS := -lz

LOCAL_STATIC_LIBRARIES := cocos2dx_static
LOCAL_STATIC_LIBRARIES += spidermonkey_static

include $(BUILD_STATIC_LIBRARY)
#==============================================================
$(call import-module,cocos)
