LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE := creator_static

LOCAL_MODULE_FILENAME := libcreator

LOCAL_SRC_FILES := CCScale9Sprite.cpp \
    CCGraphicsNode.cpp \
    Triangulate.cpp \
    CCPhysicsDebugDraw.cpp \
    CCPhysicsUtils.cpp \
    CCPhysicsAABBQueryCallback.cpp \
    CCPhysicsContactListener.cpp \
    CCPhysicsRayCastCallback.cpp \
    CCCameraNode.cpp

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/..

LOCAL_C_INCLUDES := $(LOCAL_PATH)/..

LOCAL_STATIC_LIBRARIES := cocos2dx_internal_static

include $(BUILD_STATIC_LIBRARY)
