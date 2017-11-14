LOCAL_PATH := $(call my-dir)
#==============================================================
include $(CLEAR_VARS)

LOCAL_MODULE := cocos2d_js_static
LOCAL_MODULE_FILENAME := libjscocos2d

LOCAL_ARM_MODE := arm

LOCAL_SRC_FILES := \
					../jswrapper/RefCounter.cpp \
					../jswrapper/State.cpp \
					../jswrapper/Value.cpp \
					../jswrapper/HandleObject.cpp \
					../jswrapper/MappingUtils.cpp \
					../jswrapper/sm/Class.cpp \
					../jswrapper/sm/ScriptEngine.cpp \
					../jswrapper/sm/Object.cpp \
					../jswrapper/sm/Utils.cpp \
					../jswrapper/v8/Class.cpp \
					../jswrapper/v8/Object.cpp \
					../jswrapper/v8/ObjectWrap.cpp \
					../jswrapper/v8/ScriptEngine.cpp \
					../jswrapper/v8/Utils.cpp \
					../jswrapper/v8/env.cc \
					../jswrapper/v8/inspector_agent.cc \
					../jswrapper/v8/inspector_io.cc \
					../jswrapper/v8/inspector_socket.cc \
					../jswrapper/v8/inspector_socket_server.cc \
					../jswrapper/v8/node.cc \
					../jswrapper/v8/node_debug_options.cc \
					../jswrapper/v8/util.cc \
					../jswrapper/v8/http_parser.c \
					../jswrapper/v8/SHA1.cpp \
					../auto/jsb_box2d_auto.cpp \
					../auto/jsb_cocos2dx_audioengine_auto.cpp \
					../auto/jsb_cocos2dx_auto.cpp \
					../auto/jsb_cocos2dx_dragonbones_auto.cpp \
					../auto/jsb_cocos2dx_experimental_video_auto.cpp \
					../auto/jsb_cocos2dx_experimental_webView_auto.cpp \
					../auto/jsb_cocos2dx_extension_auto.cpp \
					../auto/jsb_cocos2dx_network_auto.cpp \
					../auto/jsb_cocos2dx_spine_auto.cpp \
					../auto/jsb_cocos2dx_ui_auto.cpp \
					../auto/jsb_creator_auto.cpp \
					../auto/jsb_creator_camera_auto.cpp \
					../auto/jsb_creator_graphics_auto.cpp \
					../auto/jsb_creator_physics_auto.cpp \
					../manual/BaseJSAction.cpp \
					../manual/JavaScriptJavaBridge.cpp \
					../manual/ScriptingCore.cpp \
					../manual/jsb_helper.cpp \
					../manual/jsb_box2d_manual.cpp \
					../manual/jsb_classtype.cpp \
					../manual/jsb_cocos2dx_extension_manual.cpp \
					../manual/jsb_cocos2dx_manual.cpp \
					../manual/jsb_conversions.cpp \
					../manual/jsb_creator_manual.cpp \
					../manual/jsb_creator_physics_manual.cpp \
					../manual/jsb_dragonbones_manual.cpp \
					../manual/jsb_global.cpp \
					../manual/jsb_node.cpp \
					../manual/jsb_opengl_functions.cpp \
					../manual/jsb_opengl_manual.cpp \
					../manual/jsb_opengl_node.cpp \
					../manual/jsb_opengl_registration.cpp \
					../manual/jsb_socketio.cpp \
					../manual/jsb_spine_manual.cpp \
					../manual/jsb_websocket.cpp \
					../manual/jsb_xmlhttprequest.cpp

LOCAL_CFLAGS := -DHAVE_INSPECTOR

LOCAL_EXPORT_CFLAGS := 

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../manual \
                    $(LOCAL_PATH)/../manual/cocostudio \
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
                    $(LOCAL_PATH)/../../../editor-support/cocosbuilder \
                    $(LOCAL_PATH)/../../../editor-support/cocostudio \
                    $(LOCAL_PATH)/../../../editor-support/creator



LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/../manual \
                           $(LOCAL_PATH)/../auto \
                           $(LOCAL_PATH)/../../../audio/include 

LOCAL_EXPORT_LDLIBS := -lz

LOCAL_STATIC_LIBRARIES := cocos2dx_static
# LOCAL_STATIC_LIBRARIES += spidermonkey_static
LOCAL_STATIC_LIBRARIES += uv_static
LOCAL_STATIC_LIBRARIES += v8_static

include $(BUILD_STATIC_LIBRARY)
#==============================================================
$(call import-module,cocos)
