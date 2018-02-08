LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

path := $(LOCAL_PATH)

LOCAL_MODULE := newrenderer

LOCAL_MODULE_FILENAME := libnewrenderer

LOCAL_SRC_FILES := $(LOCAL_PATH)/Types.cpp \
                   $(LOCAL_PATH)/gfx/DeviceGraphics.cpp \
                   $(LOCAL_PATH)/gfx/FrameBuffer.cpp \
                   $(LOCAL_PATH)/gfx/GFX.cpp \
                   $(LOCAL_PATH)/gfx/GFXUtils.cpp \
                   $(LOCAL_PATH)/gfx/GraphicsHandle.cpp \
                   $(LOCAL_PATH)/gfx/IndexBuffer.cpp \
                   $(LOCAL_PATH)/gfx/Program.cpp \
                   $(LOCAL_PATH)/gfx/RenderBuffer.cpp \
                   $(LOCAL_PATH)/gfx/RenderTarget.cpp \
                   $(LOCAL_PATH)/gfx/State.cpp \
                   $(LOCAL_PATH)/gfx/Texture.cpp \
                   $(LOCAL_PATH)/gfx/Texture2D.cpp \
                   $(LOCAL_PATH)/gfx/VertexBuffer.cpp \
                   $(LOCAL_PATH)/gfx/VertexFormat.cpp \
                   $(LOCAL_PATH)/renderer/BaseRenderer.cpp \
                   $(LOCAL_PATH)/renderer/Camera.cpp \
                   $(LOCAL_PATH)/renderer/Config.cpp \
                   $(LOCAL_PATH)/renderer/Effect.cpp \
                   $(LOCAL_PATH)/renderer/InputAssembler.cpp \
                   $(LOCAL_PATH)/renderer/Light.cpp \
                   $(LOCAL_PATH)/renderer/Model.cpp \
                   $(LOCAL_PATH)/renderer/Pass.cpp \
                   $(LOCAL_PATH)/renderer/ProgramLib.cpp \
                   $(LOCAL_PATH)/renderer//Scene.cpp \
                   $(LOCAL_PATH)/renderer/Technique.cpp \
                   $(LOCAL_PATH)/renderer/View.cpp \
                   $(LOCAL_PATH)/renderer/ForwardRenderer.cpp

LOCAL_C_INCLUDES := $(LOCAL_PATH)
LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)

LOCAL_EXPORT_LDLIBS := -lGLESv2

LOCAL_WHOLE_STATIC_LIBRARIES := cocos2dx_static

include $(BUILD_STATIC_LIBRARY)

$(call import-add-path, $(path))
$(call import-module, ../cocos)
