LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE := cocos_network_static

LOCAL_MODULE_FILENAME := libnetwork

LOCAL_ARM_MODE := arm

LOCAL_SRC_FILES := HttpClient-android.cpp \
SocketIO.cpp \
WebSocket-libwebsockets.cpp \
CCDownloader.cpp \
CCDownloader-android.cpp \
Uri.cpp

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH) \
						   $(LOCAL_PATH)/.. \
                    	   $(LOCAL_PATH)/../../external/sources

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../external/websockets/include/android \
					$(LOCAL_PATH)/.. \
                    $(LOCAL_PATH)/../../external/sources

# LOCAL_STATIC_LIBRARIES := cocos2dx_internal_static
LOCAL_STATIC_LIBRARIES += libwebsockets_static
LOCAL_STATIC_LIBRARIES += cocos_ssl_static
LOCAL_STATIC_LIBRARIES += cocos_crypto_static

include $(BUILD_STATIC_LIBRARY)
