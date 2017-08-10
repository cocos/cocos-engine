LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)

LOCAL_MODULE := creator_static

LOCAL_MODULE_FILENAME := libcreator

LOCAL_SRC_FILES := CCScale9Sprite.cpp \
    CCGraphicsNode.cpp \
    Triangulate.cpp \
    physics/CCPhysicsDebugDraw.cpp \
    physics/CCPhysicsUtils.cpp \
    physics/CCPhysicsAABBQueryCallback.cpp \
    physics/CCPhysicsContactListener.cpp \
    physics/CCPhysicsRayCastCallback.cpp \
    physics/CCPhysicsManifoldWrapper.cpp \
    physics/CCPhysicsWorldManifoldWrapper.cpp \
    physics/CCPhysicsContactImpulse.cpp \
    CCCameraNode.cpp

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/.. \
                           $(LOCAL_PATH)/../.. \
                           $(LOCAL_PATH)/../../../external/sources

LOCAL_C_INCLUDES := $(LOCAL_PATH)/.. \
                    $(LOCAL_PATH)/../.. \
                    $(LOCAL_PATH)/../../../external/sources

# LOCAL_STATIC_LIBRARIES := cocos2dx_internal_static

include $(BUILD_STATIC_LIBRARY)
