LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE := cocos_ui_static

LOCAL_MODULE_FILENAME := libui

LOCAL_ARM_MODE := arm

LOCAL_SRC_FILES := \
UIWidget.cpp \
CocosGUI.cpp \
UIHelper.cpp \
UIVideoPlayer-android.cpp \
UIScale9Sprite.cpp \
UIWebView.cpp \
UIWebViewImpl-android.cpp \
UIEditBox/UIEditBox.cpp \
UIEditBox/UIEditBoxImpl-android.cpp \
UIEditBox/UIEditBoxImpl-common.cpp \

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/../editor-support

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../editor-support

LOCAL_STATIC_LIBRARIES := cocos_extension_static

include $(BUILD_STATIC_LIBRARY)
