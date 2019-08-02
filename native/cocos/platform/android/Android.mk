LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := cocos2dxandroid_static

LOCAL_MODULE_FILENAME := libcocos2dandroid

LOCAL_SRC_FILES := \
CCDevice-android.cpp \
CCFileUtils-android.cpp \
CCApplication-android.cpp \
CCCanvasRenderingContext2D-android.cpp \
jni/JniImp.cpp \
jni/JniHelper.cpp \

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)

LOCAL_C_INCLUDES := $(LOCAL_PATH) \
                    $(LOCAL_PATH)/.. \
                    $(LOCAL_PATH)/../.. \
                    $(LOCAL_PATH)/../../..

LOCAL_EXPORT_LDLIBS := -lGLESv2 \
                       -lEGL \
                       -llog \
                       -landroid

LOCAL_STATIC_LIBRARIES := v8_static

ifneq ($(filter x86 armeabi-v7a, $(TARGET_ARCH_ABI)),)
	LOCAL_WHOLE_STATIC_LIBRARIES += android_support
endif 

include $(BUILD_STATIC_LIBRARY)

ifneq ($(filter x86 armeabi-v7a, $(TARGET_ARCH_ABI)),)
$(call import-module,android/support)
endif
