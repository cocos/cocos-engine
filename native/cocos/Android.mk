LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := cocos2dx_static
LOCAL_MODULE_FILENAME := libcocos2d

LOCAL_ARM_MODE := arm

ifeq ($(TARGET_ARCH_ABI),armeabi-v7a)
MATHNEONFILE := math/MathUtil.cpp.neon
else
MATHNEONFILE := math/MathUtil.cpp
endif

LOCAL_SRC_FILES := \
cocos2d.cpp \
platform/CCFileUtils.cpp \
platform/CCImage.cpp \
platform/CCSAXParser.cpp \
$(MATHNEONFILE) \
math/CCGeometry.cpp \
math/CCVertex.cpp \
math/Mat4.cpp \
math/Quaternion.cpp \
math/Vec2.cpp \
math/Vec3.cpp \
math/Vec4.cpp \
math/Mat3.cpp \
base/CCAutoreleasePool.cpp \
base/CCData.cpp \
base/CCRef.cpp \
base/CCValue.cpp \
base/CCThreadPool.cpp \
base/ZipUtils.cpp \
base/base64.cpp \
base/ccCArray.cpp \
base/ccRandom.cpp \
base/ccUTF8.cpp \
base/ccUtils.cpp \
base/etc1.cpp \
base/etc2.cpp \
base/pvr.cpp \
base/CCLog.cpp \
base/CCScheduler.cpp \
base/csscolorparser.cpp \
storage/local-storage/LocalStorage-android.cpp \
network/CCDownloader.cpp \
network/CCDownloader-android.cpp \
network/Uri.cpp \
network/HttpClient-android.cpp \
scripting/js-bindings/auto/jsb_cocos2dx_auto.cpp \
scripting/js-bindings/auto/jsb_cocos2dx_extension_auto.cpp \
scripting/js-bindings/auto/jsb_cocos2dx_network_auto.cpp \
scripting/js-bindings/auto/jsb_gfx_auto.cpp \
scripting/js-bindings/manual/JavaScriptJavaBridge.cpp \
scripting/js-bindings/manual/jsb_classtype.cpp \
scripting/js-bindings/manual/jsb_conversions.cpp \
scripting/js-bindings/manual/jsb_cocos2dx_manual.cpp \
scripting/js-bindings/manual/jsb_global.cpp \
scripting/js-bindings/manual/jsb_xmlhttprequest.cpp \
scripting/js-bindings/manual/jsb_cocos2dx_network_manual.cpp \
scripting/js-bindings/manual/jsb_gfx_manual.cpp \
scripting/js-bindings/manual/jsb_platform_android.cpp \
scripting/js-bindings/jswrapper/config.cpp \
scripting/js-bindings/jswrapper/HandleObject.cpp \
scripting/js-bindings/jswrapper/MappingUtils.cpp \
scripting/js-bindings/jswrapper/RefCounter.cpp \
scripting/js-bindings/jswrapper/Value.cpp \
scripting/js-bindings/jswrapper/State.cpp \
scripting/js-bindings/jswrapper/v8/Class.cpp \
scripting/js-bindings/jswrapper/v8/Object.cpp \
scripting/js-bindings/jswrapper/v8/ObjectWrap.cpp \
scripting/js-bindings/jswrapper/v8/ScriptEngine.cpp \
scripting/js-bindings/jswrapper/v8/Utils.cpp \
scripting/js-bindings/event/EventDispatcher.cpp \
../external/sources/xxtea/xxtea.cpp \
../external/sources/tinyxml2/tinyxml2.cpp \
../external/sources/unzip/ioapi_mem.cpp \
../external/sources/unzip/ioapi.cpp \
../external/sources/unzip/unzip.cpp \
../external/sources/ConvertUTF/ConvertUTFWrapper.cpp \
../external/sources/ConvertUTF/ConvertUTF.c \
ui/edit-box/EditBox-android.cpp

# v8 debugger source files, always enable it
LOCAL_SRC_FILES += \
scripting/js-bindings/jswrapper/v8/debugger/SHA1.cpp \
scripting/js-bindings/jswrapper/v8/debugger/util.cc \
scripting/js-bindings/jswrapper/v8/debugger/env.cc \
scripting/js-bindings/jswrapper/v8/debugger/inspector_agent.cc \
scripting/js-bindings/jswrapper/v8/debugger/inspector_io.cc \
scripting/js-bindings/jswrapper/v8/debugger/inspector_socket.cc \
scripting/js-bindings/jswrapper/v8/debugger/inspector_socket_server.cc \
scripting/js-bindings/jswrapper/v8/debugger/node.cc \
scripting/js-bindings/jswrapper/v8/debugger/node_debug_options.cc \
scripting/js-bindings/jswrapper/v8/debugger/http_parser.c
LOCAL_STATIC_LIBRARIES += v8_inspector
LOCAL_STATIC_LIBRARIES += cocos_extension_static

ifeq ($(USE_GFX_RENDERER),1)
LOCAL_SRC_FILES += \
renderer/core/CoreStd.cc \
renderer/core/gfx/GFXObject.cc \
renderer/core/gfx/GFXBindingLayout.cc \
renderer/core/gfx/GFXDevice.cc \
renderer/core/gfx/GFXRenderPass.cc \
renderer/core/gfx/GFXBuffer.cc \
renderer/core/gfx/GFXFramebuffer.cc \
renderer/core/gfx/GFXSampler.cc \
renderer/core/gfx/GFXCommandAllocator.cc \
renderer/core/gfx/GFXInputAssembler.cc \
renderer/core/gfx/GFXShader.cc \
renderer/core/gfx/GFXCommandBuffer.cc \
renderer/core/gfx/GFXPipelineLayout.cc \
renderer/core/gfx/GFXTexture.cc \
renderer/core/gfx/GFXContext.cc \
renderer/core/gfx/GFXPipelineState.cc \
renderer/core/gfx/GFXTextureView.cc \
renderer/core/gfx/GFXDef.cc \
renderer/core/gfx/GFXQueue.cc \
renderer/core/gfx/GFXWindow.cc \
renderer/gfx-gles2/GLES2BindingLayout.cc \
renderer/gfx-gles2/GLES2Device.cc \
renderer/gfx-gles2/GLES2RenderPass.cc \
renderer/gfx-gles2/GLES2Buffer.cc \
renderer/gfx-gles2/GLES2Framebuffer.cc \
renderer/gfx-gles2/GLES2Sampler.cc \
renderer/gfx-gles2/GLES2CommandAllocator.cc \
renderer/gfx-gles2/GLES2InputAssembler.cc \
renderer/gfx-gles2/GLES2Shader.cc \
renderer/gfx-gles2/GLES2CommandBuffer.cc \
renderer/gfx-gles2/GLES2PipelineLayout.cc \
renderer/gfx-gles2/GLES2Texture.cc \
renderer/gfx-gles2/GLES2Context.cc \
renderer/gfx-gles2/GLES2PipelineState.cc \
renderer/gfx-gles2/GLES2TextureView.cc \
renderer/gfx-gles2/GLES2Queue.cc \
renderer/gfx-gles2/GLES2Window.cc \
renderer/gfx-gles2/GLES2Std.cc \
renderer/gfx-gles2/GLES2Commands.cc \
renderer/gfx-gles2/gles2w.c \
renderer/core/kernel/Assertion.cc \
renderer/core/kernel/Log.cc \
renderer/core/kernel/UTFString.cc \
renderer/core/memory/AllocatedObj.cc \
renderer/core/memory/JeAlloc.cc \
renderer/core/memory/Memory.cc \
renderer/core/memory/MemTracker.cc \
renderer/core/memory/NedPooling.cc \
renderer/core/math/CCCoreMath.cc \
renderer/core/util/StringUtil.cc
endif # USE_GFX_RENDERER

# ifeq ($(USE_VIDEO),1)
# LOCAL_SRC_FILES += \
# ui/videoplayer/VideoPlayer-android.cpp \
# scripting/js-bindings/auto/jsb_video_auto.cpp
# endif # USE_VIDEO

# ifeq ($(USE_WEB_VIEW),1)
# LOCAL_SRC_FILES += \
# ui/webview/WebViewImpl-android.cpp \
# scripting/js-bindings/auto/jsb_webview_auto.cpp
# endif # USE_WEB_VIEW

ifeq ($(USE_AUDIO),1)
LOCAL_SRC_FILES += \
scripting/js-bindings/auto/jsb_cocos2dx_audioengine_auto.cpp
LOCAL_STATIC_LIBRARIES += audioengine_static
endif # USE_AUDIO

ifeq ($(USE_SOCKET),1)
LOCAL_SRC_FILES += \
network/SocketIO.cpp \
network/WebSocket-libwebsockets.cpp \
scripting/js-bindings/manual/jsb_socketio.cpp \
scripting/js-bindings/manual/jsb_websocket.cpp

LOCAL_STATIC_LIBRARIES += libwebsockets_static
LOCAL_STATIC_LIBRARIES += cocos_ssl_static
LOCAL_STATIC_LIBRARIES += cocos_crypto_static
endif # USE_SOCKET

# libuv is used by v8 debugger & libwebsockets
LOCAL_STATIC_LIBRARIES += uv_static

LOCAL_C_INCLUDES := $(LOCAL_PATH) \
                    $(LOCAL_PATH)/.. \
                    $(LOCAL_PATH)/platform \
                    $(LOCAL_PATH)/../external/android/$(TARGET_ARCH_ABI)/include \
                    $(LOCAL_PATH)/../external/sources \
                    $(LOCAL_PATH)/renderer \
                    $(LOCAL_PATH)/scripting/js-bindings/manual \
                    $(LOCAL_PATH)/scripting/js-bindings/manual/platform/android \
                    $(LOCAL_PATH)/scripting/js-bindings/auto \
                    $(LOCAL_PATH)/renderer/core

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH) \
                    $(LOCAL_PATH)/.. \
                    $(LOCAL_PATH)/platform \
                    $(LOCAL_PATH)/base \
                    $(LOCAL_PATH)/network \
                    $(LOCAL_PATH)/../external/android/$(TARGET_ARCH_ABI)/include \
                    $(LOCAL_PATH)/../external/sources \
                    $(LOCAL_PATH)/renderer

LOCAL_STATIC_LIBRARIES += cocos_png_static
LOCAL_STATIC_LIBRARIES += cocos_jpeg_static

LOCAL_STATIC_LIBRARIES += cocos_webp_static
LOCAL_STATIC_LIBRARIES += cocos_zlib_static
LOCAL_STATIC_LIBRARIES += v8_static
LOCAL_STATIC_LIBRARIES += android_native_app_glue

LOCAL_WHOLE_STATIC_LIBRARIES := cocos2dxandroid_static
LOCAL_WHOLE_STATIC_LIBRARIES += cpufeatures

# define the macro to compile through support/zip_support/ioapi.c
LOCAL_CFLAGS := -DUSE_FILE32API -fexceptions

# Issues #9968
#ifeq ($(TARGET_ARCH_ABI),armeabi-v7a)
#    LOCAL_CFLAGS += -DHAVE_NEON=1
#endif

LOCAL_CPPFLAGS := -Wno-deprecated-declarations
LOCAL_EXPORT_CFLAGS   := -DUSE_FILE32API
LOCAL_EXPORT_CPPFLAGS := -Wno-deprecated-declarations

include $(BUILD_STATIC_LIBRARY)


#==============================================================
#$(call import-module,.)
$(call import-module,android)
$(call import-module,platform/android)
$(call import-module,audio/android)
$(call import-module,extensions)
$(call import-module,android/cpufeatures)
$(call import-module, android/native_app_glue)