

set(CC_PLATFORM_MAC_IOS 1)
set(CC_PLATFORM_WINDOWS 2)
set(CC_PLATFORM_ANDROID 3)
set(CC_PLATFORM_MAC_OSX 4)
set(CC_PLATFORM 1)

if(${CMAKE_SYSTEM_NAME} MATCHES "Windows")
    set(WINDOWS TRUE)
    set(PLATFORM_FOLDER win32)
    set(CC_PLATFORM ${CC_PLATFORM_WINDOWS})
elseif(${CMAKE_SYSTEM_NAME} MATCHES "Android")
    set(PLATFORM_FOLDER android)
    set(ANDROID TRUE)
    set(CC_PLATFORM ${CC_PLATFORM_ANDROID})
elseif(${CMAKE_SYSTEM_NAME} MATCHES "Darwin")
    set(APPLE TRUE)
    set(MACOSX TRUE)
    set(PLATFORM_FOLDER mac)
    set(CC_PLATFORM ${CC_PLATFORM_MAC_OSX})
elseif(${CMAKE_SYSTEM_NAME} MATCHES "iOS")
    set(APPLE TRUE)
    set(IOS TRUE)
    set(PLATFORM_FOLDER ios)
    set(CC_PLATFORM ${CC_PLATFORM_MAC_IOS})
else()
    message(FATAL_ERROR "Unsupported platform, CMake will exit")
    return()
endif()

# platform macros

add_definitions(-DCC_PLATFORM_WINDOWS=${CC_PLATFORM_WINDOWS} )
add_definitions(-DCC_PLATFORM_MAC_OSX=${CC_PLATFORM_MAC_OSX} )
add_definitions(-DCC_PLATFORM_MAC_IOS=${CC_PLATFORM_MAC_IOS} )
add_definitions(-DCC_PLATFORM_ANDROID=${CC_PLATFORM_ANDROID} )
add_definitions(-DCC_PLATFORM=${CC_PLATFORM})

# generators that are capable of organizing into a hierarchy of folders
set_property(GLOBAL PROPERTY USE_FOLDERS ON)
# simplify generator condition, please use them everywhere
if(CMAKE_GENERATOR STREQUAL Xcode)
    set(XCODE TRUE)
elseif(CMAKE_GENERATOR MATCHES Visual)
    set(VS TRUE)
endif()


# set c++ standard
set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

################################# engine source code ##################################

set(CWD ${CMAKE_CURRENT_LIST_DIR})
set(COCOS2D_SOURCE_LIST)

macro(cocos_source_files)
    set(list_var "${ARGN}")
    foreach(src IN LISTS list_var)
        set(fp "${CWD}/${src}")
        if(EXISTS ${fp})
            list(APPEND COCOS2D_SOURCE_LIST "${CWD}/${src}")
        else()
            message(FATAL_ERROR "Cocos souce file not exists: ${src} in ${CWD}")
        endif()
    endforeach()
endmacro()

################################# set_if_undefined ###################################

macro(set_if_undefined varname value)
    if(NOT DEFINED ${varname})
        set(${varname} ${value})
    endif()
endmacro()

################################# inspect_values ###################################

function(inspect_values)
    set(list_var "${ARGN}")
    foreach(src IN LISTS list_var)
        set(opv ${${src}})
        message(STATUS "OPTION ${src}:\t${opv}")
    endforeach()
endfunction()


################################# options ############################################

# default fallback options 
set_if_undefined(USE_SE_V8                ON)
set_if_undefined(USE_V8_DEBUGGER          ON)
set_if_undefined(USE_SOCKET               ON)
set_if_undefined(USE_AUDIO                ON)
set_if_undefined(USE_EDIT_BOX             ON)
set_if_undefined(USE_SE_JSC               OFF)
set_if_undefined(USE_VIDEO                ON)
set_if_undefined(USE_WEBVIEW              ON)
set_if_undefined(USE_MIDDLEWARE           ON)
set_if_undefined(USE_DRAGONBONES          ON)
set_if_undefined(USE_SPINE                ON)
set_if_undefined(USE_WEBSOCKET_SERVER     OFF)

if(ANDROID OR WINDOWS)
    set_if_undefined(CC_USE_GLES3 ON)
    set_if_undefined(CC_USE_VULKAN OFF)
    set_if_undefined(CC_USE_GLES2 OFF)
    set_if_undefined(CC_USE_METAL OFF)
elseif(MACOSX OR IOS)
    set_if_undefined(CC_USE_METAL ON)
    set_if_undefined(CC_USE_VULKAN OFF)
    set_if_undefined(CC_USE_GLES3 OFF)
    set_if_undefined(CC_USE_GLES2 OFF)
endif()

if(USE_SE_JSC)
    set(USE_SE_V8 OFF)
    set(USE_V8_DEBUGGER OFF)
endif()

if(NOT USE_SOCKET)
    set(USE_WEBSOCKET_SERVER OFF)
endif()

## disable videoplay on non-mobile platforms
if(NOT ANDROID AND NOT IOS)
    set(USE_VIDEO OFF)
    set(USE_WEBVIEW OFF)
endif()

## disable middleware when dragonbones and spine are disabled
if(NOT USE_DRAGONBONES AND NOT USE_SPINE)
	set(USE_MIDDLEWARE OFF)
endif()

if(USE_DRAGONBONES OR USE_SPINE)
	set(USE_MIDDLEWARE ON)
endif()


################################# list all option values ##############################

inspect_values(
    CC_USE_METAL
    CC_USE_GLES3
    CC_USE_GLES2
    USE_SE_V8
    USE_V8_DEBUGGER
    USE_SOCKET
    USE_AUDIO
    USE_EDIT_BOX
    USE_SE_JSC
    USE_VIDEO
    USE_WEBVIEW
    USE_MIDDLEWARE
    USE_DRAGONBONES
    USE_SPINE
    USE_WEBSOCKET_SERVER
    USE_SE_V8
    USE_V8_DEBUGGER
)

################################# external source code ################################


if(NOT EXISTS ${CMAKE_CURRENT_LIST_DIR}/external/CMakeLists.txt)
    message(FATAL_ERROR "Please download external libraries!")
endif()

include(${CMAKE_CURRENT_LIST_DIR}/external/CMakeLists.txt)

##### audio
if(USE_AUDIO)
    cocos_source_files(
        cocos/audio/AudioEngine.cpp
        cocos/audio/include/AudioEngine.h
        cocos/audio/include/Export.h
    )
    if(WINDOWS)
        cocos_source_files(
            cocos/audio/win32/AudioCache.cpp
            cocos/audio/win32/AudioCache.h
            cocos/audio/win32/AudioDecoder.cpp
            cocos/audio/win32/AudioDecoder.h
            cocos/audio/win32/AudioDecoderManager.cpp
            cocos/audio/win32/AudioDecoderManager.h
            cocos/audio/win32/AudioDecoderMp3.cpp
            cocos/audio/win32/AudioDecoderMp3.h
            cocos/audio/win32/AudioDecoderOgg.cpp
            cocos/audio/win32/AudioDecoderOgg.h
            cocos/audio/win32/AudioEngine-win32.cpp
            cocos/audio/win32/AudioEngine-win32.h
            cocos/audio/win32/AudioMacros.h
            cocos/audio/win32/AudioPlayer.cpp
            cocos/audio/win32/AudioPlayer.h
        )
    elseif(ANDROID)
        cocos_source_files(
            cocos/audio/android/AssetFd.cpp
            cocos/audio/android/AssetFd.h
            cocos/audio/android/audio.h
            cocos/audio/android/AudioBufferProvider.h
            cocos/audio/android/AudioDecoder.cpp
            cocos/audio/android/AudioDecoder.h
            cocos/audio/android/AudioDecoderMp3.cpp
            cocos/audio/android/AudioDecoderMp3.h
            cocos/audio/android/AudioDecoderOgg.cpp
            cocos/audio/android/AudioDecoderOgg.h
            cocos/audio/android/AudioDecoderProvider.cpp
            cocos/audio/android/AudioDecoderProvider.h
            cocos/audio/android/AudioDecoderSLES.cpp
            cocos/audio/android/AudioDecoderSLES.h
            cocos/audio/android/AudioDecoderWav.cpp
            cocos/audio/android/AudioDecoderWav.h
            cocos/audio/android/AudioEngine-inl.cpp
            cocos/audio/android/AudioEngine-inl.h
            cocos/audio/android/AudioMixer.cpp
            cocos/audio/android/AudioMixer.h
            cocos/audio/android/AudioMixerController.cpp
            cocos/audio/android/AudioMixerController.h
            cocos/audio/android/AudioMixerOps.h
            cocos/audio/android/AudioPlayerProvider.cpp
            cocos/audio/android/AudioPlayerProvider.h
            cocos/audio/android/AudioResampler.cpp
            cocos/audio/android/AudioResampler.h
            cocos/audio/android/AudioResamplerCubic.cpp
            cocos/audio/android/AudioResamplerCubic.h
            cocos/audio/android/AudioResamplerPublic.h
            cocos/audio/android/audio_utils/format.c
            cocos/audio/android/audio_utils/include/audio_utils/format.h
            cocos/audio/android/audio_utils/include/audio_utils/minifloat.h
            cocos/audio/android/audio_utils/include/audio_utils/primitives.h
            cocos/audio/android/audio_utils/minifloat.cpp
            cocos/audio/android/audio_utils/primitives.c
            cocos/audio/android/audio_utils/private/private.h
            cocos/audio/android/cutils/bitops.h
            cocos/audio/android/cutils/log.h
            cocos/audio/android/IAudioPlayer.h
            cocos/audio/android/ICallerThreadUtils.h
            cocos/audio/android/IVolumeProvider.h
            cocos/audio/android/mp3reader.cpp
            cocos/audio/android/mp3reader.h
            cocos/audio/android/OpenSLHelper.h
            cocos/audio/android/PcmAudioPlayer.cpp
            cocos/audio/android/PcmAudioPlayer.h
            cocos/audio/android/PcmAudioService.cpp
            cocos/audio/android/PcmAudioService.h
            cocos/audio/android/PcmBufferProvider.cpp
            cocos/audio/android/PcmBufferProvider.h
            cocos/audio/android/PcmData.cpp
            cocos/audio/android/PcmData.h
            cocos/audio/android/tinysndfile.cpp
            cocos/audio/android/tinysndfile.h
            cocos/audio/android/Track.cpp
            cocos/audio/android/Track.h
            cocos/audio/android/UrlAudioPlayer.cpp
            cocos/audio/android/UrlAudioPlayer.h
            cocos/audio/android/utils/Compat.h
            cocos/audio/android/utils/Errors.h
            cocos/audio/android/utils/Utils.cpp
            cocos/audio/android/utils/Utils.h
        )
    elseif(APPLE)
        cocos_source_files(
            cocos/audio/apple/AudioDecoder.h
            cocos/audio/apple/AudioPlayer.mm
            cocos/audio/apple/AudioDecoder.mm
            cocos/audio/apple/AudioPlayer.h
            cocos/audio/apple/AudioEngine-inl.mm
            cocos/audio/apple/AudioMacros.h
            cocos/audio/apple/AudioCache.mm
            cocos/audio/apple/AudioCache.h
            cocos/audio/apple/AudioEngine-inl.h
        )
    endif()

endif()

##### base
cocos_source_files(
    cocos/base/astc.cpp
    cocos/base/astc.h
    cocos/base/base64.cpp
    cocos/base/base64.h
    cocos/base/CachedArray.h
    cocos/base/AutoreleasePool.cpp
    cocos/base/AutoreleasePool.h
    cocos/base/Array.cpp
    cocos/base/Array.h
    cocos/base/Config.h
    cocos/base/Data.cpp
    cocos/base/Data.h
    cocos/base/Macros.h
    cocos/base/Map.h
    cocos/base/Random.cpp
    cocos/base/Random.h
    cocos/base/Ref.cpp
    cocos/base/Ref.h
    cocos/base/Scheduler.cpp
    cocos/base/Scheduler.h
    cocos/base/ThreadPool.cpp
    cocos/base/ThreadPool.h
    cocos/base/UTF8.cpp
    cocos/base/UTF8.h
    cocos/base/Utils.cpp
    cocos/base/Utils.h
    cocos/base/Value.cpp
    cocos/base/Value.h
    cocos/base/Vector.h
    cocos/base/csscolorparser.cpp
    cocos/base/csscolorparser.h
    cocos/base/etc1.cpp
    cocos/base/etc1.h
    cocos/base/etc2.cpp
    cocos/base/etc2.h
    cocos/base/Log.cpp
    cocos/base/Log.h
    cocos/base/memory/AllocatedObj.cpp
    cocos/base/memory/AllocatedObj.h
    cocos/base/memory/JeAlloc.cpp
    cocos/base/memory/JeAlloc.h
    cocos/base/memory/MemDef.h
    cocos/base/memory/Memory.cpp
    cocos/base/memory/Memory.h
    cocos/base/memory/MemTracker.cpp
    cocos/base/memory/MemTracker.h
    cocos/base/memory/NedPooling.cpp
    cocos/base/memory/NedPooling.h
    cocos/base/memory/StdAlloc.h
    cocos/base/memory/StlAlloc.h
    cocos/base/Object.h
    cocos/base/TypeDef.h
    cocos/base/uthash.h
    cocos/base/StringUtil.cpp
    cocos/base/StringUtil.h
    cocos/base/UTFString.cpp
    cocos/base/UTFString.h
    cocos/base/ZipUtils.cpp
    cocos/base/ZipUtils.h
)

##### math
cocos_source_files(
    cocos/math/Geometry.cpp
    cocos/math/Geometry.h
    cocos/math/Math.h
    cocos/math/Math.cpp
    cocos/math/MathBase.h
    cocos/math/Vertex.cpp
    cocos/math/Vertex.h
    cocos/math/Mat3.cpp
    cocos/math/Mat3.h
    cocos/math/Mat4.cpp
    cocos/math/Mat4.h
    cocos/math/Mat4.inl
    cocos/math/MathUtil.cpp
    cocos/math/MathUtil.h
    cocos/math/MathUtil.inl
    cocos/math/MathUtilNeon.inl
    cocos/math/MathUtilNeon64.inl
    cocos/math/MathUtilSSE.inl
    cocos/math/Quaternion.cpp
    cocos/math/Quaternion.h
    cocos/math/Quaternion.inl
    cocos/math/Vec2.cpp
    cocos/math/Vec2.h
    cocos/math/Vec2.inl
    cocos/math/Vec3.cpp
    cocos/math/Vec3.h
    cocos/math/Vec3.inl
    cocos/math/Vec4.cpp
    cocos/math/Vec4.h
    cocos/math/Vec4.inl
)

##### network
cocos_source_files(
    cocos/network/Downloader.cpp
    cocos/network/Downloader.h
    cocos/network/DownloaderImpl.h
    cocos/network/HttpClient.h
    cocos/network/HttpCookie.cpp
    cocos/network/HttpCookie.h
    cocos/network/HttpRequest.h
    cocos/network/HttpResponse.h
    cocos/network/Uri.cpp
    cocos/network/Uri.h
    )

if(USE_SOCKET)
    cocos_source_files(
        cocos/network/WebSocket.h
        cocos/network/SocketIO.cpp
        cocos/network/SocketIO.h
    )
endif()

if(NOT IOS AND USE_WEBSOCKET_SERVER)
    cocos_source_files(
        cocos/network/WebSocketServer.h
        cocos/network/WebSocketServer.cpp
    )
endif()

if(APPLE)
    cocos_source_files(
        cocos/network/DownloaderImpl-apple.h
        cocos/network/DownloaderImpl-apple.mm
        cocos/network/HttpAsynConnection-apple.h
        cocos/network/HttpAsynConnection-apple.m
        cocos/network/HttpClient-apple.mm
    )
    if(USE_SOCKET)
        cocos_source_files(
            cocos/network/WebSocket-apple.mm
        )
        set_source_files_properties(${CWD}/cocos/network/WebSocket-apple.mm PROPERTIES
            COMPILE_FLAGS -fobjc-arc
        )
    endif()
endif()

if(ANDROID)
    cocos_source_files(
        cocos/network/Downloader-android.cpp
        cocos/network/Downloader-android.h
        cocos/network/HttpClient-android.cpp
    )
endif()

if(NOT APPLE AND USE_SOCKET)
    cocos_source_files(
        cocos/network/WebSocket-libwebsockets.cpp
    )
endif()

if(WINDOWS)
    cocos_source_files(
        cocos/network/Downloader-curl.cpp
        cocos/network/Downloader-curl.h
    )
endif()

if(WINDOWS OR MACOSX)
    cocos_source_files(
        cocos/network/HttpClient.cpp
    )
endif()


##### platform
cocos_source_files(
    cocos/platform/Application.h
    cocos/platform/Application.cpp
    cocos/platform/CanvasRenderingContext2D.h
    cocos/platform/Device.h
    cocos/platform/FileUtils.cpp
    cocos/platform/FileUtils.h
    cocos/platform/Image.cpp
    cocos/platform/Image.h
    cocos/platform/SAXParser.cpp
    cocos/platform/SAXParser.h
    cocos/platform/StdC.h
)
if(WINDOWS)
    cocos_source_files(
        cocos/platform/win32/Application-win32.cpp
        cocos/platform/win32/CanvasRenderingContext2D-win32.cpp
        cocos/platform/win32/Device-win32.cpp
        cocos/platform/win32/FileUtils-win32.cpp
        cocos/platform/win32/FileUtils-win32.h
        cocos/platform/win32/Utils-win32.cpp
        cocos/platform/win32/Utils-win32.h
        cocos/platform/win32/View-win32.cpp
        cocos/platform/win32/View-win32.h
        cocos/platform/win32/compat
        cocos/platform/win32/compat/stdint.h
        cocos/platform/win32/inet_pton_mingw.cpp
        cocos/platform/win32/inet_pton_mingw.h
    )
elseif(ANDROID)
    cocos_source_files(
        cocos/platform/android/Application-android.cpp
        cocos/platform/android/CanvasRenderingContext2D-android.cpp
        cocos/platform/android/Device-android.cpp
        cocos/platform/android/FileUtils-android.cpp
        cocos/platform/android/FileUtils-android.h
        cocos/platform/android/View.cpp
        cocos/platform/android/View.h
    )
    set(CC_JNI_SRC_FILES
        ${CWD}/cocos/platform/android/jni/JniCocosActivity.cpp
        ${CWD}/cocos/platform/android/jni/JniCocosActivity.h
        ${CWD}/cocos/platform/android/jni/JniCocosTouchHandler.cpp
        ${CWD}/cocos/platform/android/jni/JniCocosKeyCodeHandler.cpp
        ${CWD}/cocos/platform/android/jni/JniCocosSurfaceView.cpp
        ${CWD}/cocos/platform/android/jni/JniCocosOrientationHelper.cpp
        ${CWD}/cocos/platform/android/jni/JniHelper.cpp
        ${CWD}/cocos/platform/android/jni/JniHelper.h
        ${CWD}/cocos/platform/android/jni/JniImp.cpp
        ${CWD}/cocos/platform/android/jni/JniImp.h
    )
elseif(APPLE)
    cocos_source_files(
        cocos/platform/apple/FileUtils-apple.h
        cocos/platform/apple/Device-apple.mm
        cocos/platform/apple/FileUtils-apple.mm
        cocos/platform/apple/CanvasRenderingContext2D-apple.mm
        cocos/platform/apple/Device-apple.h
    )
    #bad struct
    cocos_source_files(
        cocos/platform/ios/Reachability.h
        cocos/platform/ios/Reachability.cpp
    )
    if(MACOSX)
        cocos_source_files(
            cocos/platform/mac/View.h
            cocos/platform/mac/KeyCodeHelper.h
            cocos/platform/mac/View.mm
            cocos/platform/mac/Device-mac.mm
            cocos/platform/mac/Application-mac.mm
            cocos/platform/mac/KeyCodeHelper.cpp
        )
    elseif(IOS)
        cocos_source_files(
            cocos/platform/ios/View.h
            cocos/platform/ios/View.mm
            cocos/platform/ios/Application-ios.mm
            cocos/platform/ios/Device-ios.mm
        )
    endif()
endif()

##### renderer
cocos_source_files(
    cocos/renderer/core/Core.h
    cocos/renderer/core/CoreStd.cpp
    cocos/renderer/core/CoreStd.h
    cocos/renderer/core/gfx/GFXObject.h
    cocos/renderer/core/gfx/GFXObject.cpp
    cocos/renderer/core/gfx/GFXBuffer.cpp
    cocos/renderer/core/gfx/GFXBuffer.h
    cocos/renderer/core/gfx/GFXCommand.h
    cocos/renderer/core/gfx/GFXCommandBuffer.cpp
    cocos/renderer/core/gfx/GFXCommandBuffer.h
    cocos/renderer/core/gfx/GFXCommandPool.h
    cocos/renderer/core/gfx/GFXContext.cpp
    cocos/renderer/core/gfx/GFXContext.h
    cocos/renderer/core/gfx/GFXDef.cpp
    cocos/renderer/core/gfx/GFXDef.h
    cocos/renderer/core/gfx/GFXDevice.cpp
    cocos/renderer/core/gfx/GFXDevice.h
    cocos/renderer/core/gfx/GFXFramebuffer.cpp
    cocos/renderer/core/gfx/GFXFramebuffer.h
    cocos/renderer/core/gfx/GFXInputAssembler.cpp
    cocos/renderer/core/gfx/GFXInputAssembler.h
    cocos/renderer/core/gfx/GFXDescriptorSet.cpp
    cocos/renderer/core/gfx/GFXDescriptorSet.h
    cocos/renderer/core/gfx/GFXDescriptorSetLayout.cpp
    cocos/renderer/core/gfx/GFXDescriptorSetLayout.h
    cocos/renderer/core/gfx/GFXPipelineLayout.cpp
    cocos/renderer/core/gfx/GFXPipelineLayout.h
    cocos/renderer/core/gfx/GFXPipelineState.cpp
    cocos/renderer/core/gfx/GFXPipelineState.h
    cocos/renderer/core/gfx/GFXQueue.cpp
    cocos/renderer/core/gfx/GFXQueue.h
    cocos/renderer/core/gfx/GFXRenderPass.cpp
    cocos/renderer/core/gfx/GFXRenderPass.h
    cocos/renderer/core/gfx/GFXSampler.cpp
    cocos/renderer/core/gfx/GFXSampler.h
    cocos/renderer/core/gfx/GFXShader.cpp
    cocos/renderer/core/gfx/GFXShader.h
    cocos/renderer/core/gfx/GFXTexture.cpp
    cocos/renderer/core/gfx/GFXTexture.h
    cocos/renderer/core/gfx/GFXFence.h
    cocos/renderer/core/gfx/GFXFence.cpp
    cocos/renderer/pipeline/BatchedBuffer.cpp
    cocos/renderer/pipeline/BatchedBuffer.h
    cocos/renderer/pipeline/Define.h
    cocos/renderer/pipeline/Define.cpp
    cocos/renderer/pipeline/InstancedBuffer.cpp
    cocos/renderer/pipeline/InstancedBuffer.h
    cocos/renderer/pipeline/PipelineStateManager.cpp
    cocos/renderer/pipeline/PipelineStateManager.h
    cocos/renderer/pipeline/RenderAdditiveLightQueue.cpp
    cocos/renderer/pipeline/RenderAdditiveLightQueue.h
    cocos/renderer/pipeline/RenderBatchedQueue.cpp
    cocos/renderer/pipeline/RenderBatchedQueue.h
    cocos/renderer/pipeline/RenderFlow.cpp
    cocos/renderer/pipeline/RenderFlow.h
    cocos/renderer/pipeline/RenderInstancedQueue.cpp
    cocos/renderer/pipeline/RenderInstancedQueue.h
    cocos/renderer/pipeline/RenderPipeline.cpp
    cocos/renderer/pipeline/RenderPipeline.h
    cocos/renderer/pipeline/RenderQueue.cpp
    cocos/renderer/pipeline/RenderQueue.h
    cocos/renderer/pipeline/RenderStage.cpp
    cocos/renderer/pipeline/RenderStage.h
    cocos/renderer/pipeline/PlanarShadowQueue.cpp
    cocos/renderer/pipeline/PlanarShadowQueue.h
    cocos/renderer/pipeline/ShadowMapBatchedQueue.cpp
    cocos/renderer/pipeline/ShadowMapBatchedQueue.h
    cocos/renderer/pipeline/PipelineUBO.cpp
    cocos/renderer/pipeline/PipelineUBO.h
    cocos/renderer/pipeline/PipelineSceneData.cpp
    cocos/renderer/pipeline/PipelineSceneData.h
    cocos/renderer/pipeline/forward/ForwardFlow.cpp
    cocos/renderer/pipeline/forward/ForwardFlow.h
    cocos/renderer/pipeline/forward/ForwardPipeline.cpp
    cocos/renderer/pipeline/forward/ForwardPipeline.h
    cocos/renderer/pipeline/forward/ForwardStage.cpp
    cocos/renderer/pipeline/forward/ForwardStage.h
    cocos/renderer/pipeline/SceneCulling.cpp
    cocos/renderer/pipeline/SceneCulling.h
    cocos/renderer/pipeline/forward/UIPhase.cpp
    cocos/renderer/pipeline/forward/UIPhase.h
    cocos/renderer/pipeline/deferred/DeferredPipeline.cpp
    cocos/renderer/pipeline/deferred/DeferredPipeline.h
    cocos/renderer/pipeline/deferred/GbufferFlow.cpp
    cocos/renderer/pipeline/deferred/GbufferFlow.h
    cocos/renderer/pipeline/deferred/GbufferStage.cpp
    cocos/renderer/pipeline/deferred/GbufferStage.h
    cocos/renderer/pipeline/deferred/LightingFlow.cpp
    cocos/renderer/pipeline/deferred/LightingFlow.h
    cocos/renderer/pipeline/deferred/LightingStage.cpp
    cocos/renderer/pipeline/deferred/LightingStage.h
    cocos/renderer/pipeline/deferred/PostprocessStage.cpp
    cocos/renderer/pipeline/deferred/PostprocessStage.h
    cocos/renderer/pipeline/shadow/ShadowFlow.cpp
    cocos/renderer/pipeline/shadow/ShadowFlow.h
    cocos/renderer/pipeline/shadow/ShadowStage.cpp
    cocos/renderer/pipeline/shadow/ShadowStage.h
    cocos/renderer/pipeline/helper/DefineMap.h
    cocos/renderer/pipeline/helper/DefineMap.cpp
    cocos/renderer/pipeline/helper/SharedMemory.h
    cocos/renderer/pipeline/helper/SharedMemory.cpp
)

if(CC_USE_GLES2)
    cocos_source_files(
        cocos/renderer/gfx-gles2/GFXGLES2.h
        cocos/renderer/gfx-gles2/GLES2Buffer.cpp
        cocos/renderer/gfx-gles2/GLES2Buffer.h
        cocos/renderer/gfx-gles2/GLES2CommandBuffer.cpp
        cocos/renderer/gfx-gles2/GLES2CommandBuffer.h
        cocos/renderer/gfx-gles2/GLES2Commands.cpp
        cocos/renderer/gfx-gles2/GLES2Commands.h
        cocos/renderer/gfx-gles2/GLES2Context.h
        cocos/renderer/gfx-gles2/GLES2Device.cpp
        cocos/renderer/gfx-gles2/GLES2Device.h
        cocos/renderer/gfx-gles2/GLES2Framebuffer.cpp
        cocos/renderer/gfx-gles2/GLES2Framebuffer.h
        cocos/renderer/gfx-gles2/GLES2GPUObjects.h
        cocos/renderer/gfx-gles2/GLES2InputAssembler.cpp
        cocos/renderer/gfx-gles2/GLES2InputAssembler.h
        cocos/renderer/gfx-gles2/GLES2DescriptorSet.cpp
        cocos/renderer/gfx-gles2/GLES2DescriptorSet.h
        cocos/renderer/gfx-gles2/GLES2DescriptorSetLayout.cpp
        cocos/renderer/gfx-gles2/GLES2DescriptorSetLayout.h
        cocos/renderer/gfx-gles2/GLES2PipelineLayout.cpp
        cocos/renderer/gfx-gles2/GLES2PipelineLayout.h
        cocos/renderer/gfx-gles2/GLES2PipelineState.cpp
        cocos/renderer/gfx-gles2/GLES2PipelineState.h
        cocos/renderer/gfx-gles2/GLES2PrimaryCommandBuffer.cpp
        cocos/renderer/gfx-gles2/GLES2PrimaryCommandBuffer.h
        cocos/renderer/gfx-gles2/GLES2Queue.cpp
        cocos/renderer/gfx-gles2/GLES2Queue.h
        cocos/renderer/gfx-gles2/GLES2RenderPass.cpp
        cocos/renderer/gfx-gles2/GLES2RenderPass.h
        cocos/renderer/gfx-gles2/GLES2Sampler.cpp
        cocos/renderer/gfx-gles2/GLES2Sampler.h
        cocos/renderer/gfx-gles2/GLES2Shader.cpp
        cocos/renderer/gfx-gles2/GLES2Shader.h
        cocos/renderer/gfx-gles2/GLES2Std.cpp
        cocos/renderer/gfx-gles2/GLES2Std.h
        cocos/renderer/gfx-gles2/GLES2Texture.cpp
        cocos/renderer/gfx-gles2/GLES2Texture.h
        cocos/renderer/gfx-gles2/gles2w.h
        cocos/renderer/gfx-gles2/GLES2Fence.h
        cocos/renderer/gfx-gles2/GLES2Fence.cpp
    )

    if(APPLE)
        cocos_source_files(
            cocos/renderer/gfx-gles2/GLES2Context.mm
            cocos/renderer/gfx-gles2/gles2w.mm
        )
    else()
        cocos_source_files(
            cocos/renderer/gfx-gles2/GLES2Context.cpp
            cocos/renderer/gfx-gles2/gles2w.c
        )
    endif()

endif()

if(CC_USE_GLES3)
    cocos_source_files(
        cocos/renderer/gfx-gles3/GFXGLES3.h
        cocos/renderer/gfx-gles3/GLES3Buffer.cpp
        cocos/renderer/gfx-gles3/GLES3Buffer.h
        cocos/renderer/gfx-gles3/GLES3CommandBuffer.cpp
        cocos/renderer/gfx-gles3/GLES3CommandBuffer.h
        cocos/renderer/gfx-gles3/GLES3Commands.cpp
        cocos/renderer/gfx-gles3/GLES3Commands.h
        cocos/renderer/gfx-gles3/GLES3Context.cpp
        cocos/renderer/gfx-gles3/GLES3Context.h
        cocos/renderer/gfx-gles3/GLES3Device.cpp
        cocos/renderer/gfx-gles3/GLES3Device.h
        cocos/renderer/gfx-gles3/GLES3Framebuffer.cpp
        cocos/renderer/gfx-gles3/GLES3Framebuffer.h
        cocos/renderer/gfx-gles3/GLES3GPUObjects.h
        cocos/renderer/gfx-gles3/GLES3InputAssembler.cpp
        cocos/renderer/gfx-gles3/GLES3InputAssembler.h
        cocos/renderer/gfx-gles3/GLES3DescriptorSet.cpp
        cocos/renderer/gfx-gles3/GLES3DescriptorSet.h
        cocos/renderer/gfx-gles3/GLES3DescriptorSetLayout.cpp
        cocos/renderer/gfx-gles3/GLES3DescriptorSetLayout.h
        cocos/renderer/gfx-gles3/GLES3PipelineLayout.cpp
        cocos/renderer/gfx-gles3/GLES3PipelineLayout.h
        cocos/renderer/gfx-gles3/GLES3PipelineState.cpp
        cocos/renderer/gfx-gles3/GLES3PipelineState.h
        cocos/renderer/gfx-gles3/GLES3PrimaryCommandBuffer.cpp
        cocos/renderer/gfx-gles3/GLES3PrimaryCommandBuffer.h
        cocos/renderer/gfx-gles3/GLES3Queue.cpp
        cocos/renderer/gfx-gles3/GLES3Queue.h
        cocos/renderer/gfx-gles3/GLES3RenderPass.cpp
        cocos/renderer/gfx-gles3/GLES3RenderPass.h
        cocos/renderer/gfx-gles3/GLES3Sampler.cpp
        cocos/renderer/gfx-gles3/GLES3Sampler.h
        cocos/renderer/gfx-gles3/GLES3Shader.cpp
        cocos/renderer/gfx-gles3/GLES3Shader.h
        cocos/renderer/gfx-gles3/GLES3Std.cpp
        cocos/renderer/gfx-gles3/GLES3Std.h
        cocos/renderer/gfx-gles3/GLES3Texture.cpp
        cocos/renderer/gfx-gles3/GLES3Texture.h
        cocos/renderer/gfx-gles3/gles3w.h
        cocos/renderer/gfx-gles3/GLES3Fence.h
        cocos/renderer/gfx-gles3/GLES3Fence.cpp
    )
    if(APPLE)
        cocos_source_files(
            cocos/renderer/gfx-gles3/gles3w.mm
        )
    else()
        cocos_source_files(
            cocos/renderer/gfx-gles3/gles3w.c
        )
    endif()
    if(IOS)
        cocos_source_files(
            cocos/renderer/gfx-gles3/GLES3Context.mm
        )
    endif()
endif()

if(CC_USE_METAL)
    cocos_source_files(
        cocos/renderer/gfx-metal/GFXMTL.h
        cocos/renderer/gfx-metal/MTLBuffer.h
        cocos/renderer/gfx-metal/MTLBuffer.mm
        cocos/renderer/gfx-metal/MTLCommandBuffer.h
        cocos/renderer/gfx-metal/MTLCommandBuffer.mm
        cocos/renderer/gfx-metal/MTLContext.h
        cocos/renderer/gfx-metal/MTLContext.mm
        cocos/renderer/gfx-metal/MTLDevice.h
        cocos/renderer/gfx-metal/MTLDevice.mm
        cocos/renderer/gfx-metal/MTLFramebuffer.mm
        cocos/renderer/gfx-metal/MTLFramebuffer.h
        cocos/renderer/gfx-metal/MTLGPUObjects.h
        cocos/renderer/gfx-metal/MTLInputAssembler.h
        cocos/renderer/gfx-metal/MTLInputAssembler.mm
        cocos/renderer/gfx-metal/MTLDescriptorSetLayout.h
        cocos/renderer/gfx-metal/MTLDescriptorSetLayout.mm
        cocos/renderer/gfx-metal/MTLPipelineLayout.h
        cocos/renderer/gfx-metal/MTLPipelineLayout.mm
        cocos/renderer/gfx-metal/MTLPipelineState.h
        cocos/renderer/gfx-metal/MTLPipelineState.mm
        cocos/renderer/gfx-metal/MTLDescriptorSet.h
        cocos/renderer/gfx-metal/MTLDescriptorSet.mm
        cocos/renderer/gfx-metal/MTLQueue.h
        cocos/renderer/gfx-metal/MTLQueue.mm
        cocos/renderer/gfx-metal/MTLRenderPass.h
        cocos/renderer/gfx-metal/MTLRenderPass.mm
        cocos/renderer/gfx-metal/MTLSampler.h
        cocos/renderer/gfx-metal/MTLSampler.mm
        cocos/renderer/gfx-metal/MTLShader.h
        cocos/renderer/gfx-metal/MTLShader.mm
        cocos/renderer/gfx-metal/MTLStd.cpp
        cocos/renderer/gfx-metal/MTLStd.h
        cocos/renderer/gfx-metal/MTLTexture.h
        cocos/renderer/gfx-metal/MTLTexture.mm
        cocos/renderer/gfx-metal/MTLUtils.h
        cocos/renderer/gfx-metal/MTLUtils.mm
        cocos/renderer/gfx-metal/MTLFence.h
        cocos/renderer/gfx-metal/MTLFence.mm
        cocos/renderer/gfx-metal/MTLRenderCommandEncoder.h
        cocos/renderer/gfx-metal/MTLConfig.h
        cocos/renderer/gfx-metal/MTLSemaphore.h
    )
endif()

if(CC_USE_VULKAN)

    cocos_source_files(
        cocos/renderer/gfx-vulkan/GFXVulkan.h
        cocos/renderer/gfx-vulkan/vk_mem_alloc.h
        cocos/renderer/gfx-vulkan/VKBuffer.cpp
        cocos/renderer/gfx-vulkan/VKBuffer.h
        cocos/renderer/gfx-vulkan/VKCommandBuffer.cpp
        cocos/renderer/gfx-vulkan/VKCommandBuffer.h
        cocos/renderer/gfx-vulkan/VKCommands.cpp
        cocos/renderer/gfx-vulkan/VKCommands.h
        cocos/renderer/gfx-vulkan/VKContext.cpp
        cocos/renderer/gfx-vulkan/VKContext.h
        cocos/renderer/gfx-vulkan/VKDevice.cpp
        cocos/renderer/gfx-vulkan/VKDevice.h
        cocos/renderer/gfx-vulkan/VKFramebuffer.cpp
        cocos/renderer/gfx-vulkan/VKFramebuffer.h
        cocos/renderer/gfx-vulkan/VKGPUObjects.h
        cocos/renderer/gfx-vulkan/VKInputAssembler.cpp
        cocos/renderer/gfx-vulkan/VKInputAssembler.h
        cocos/renderer/gfx-vulkan/VKDescriptorSet.cpp
        cocos/renderer/gfx-vulkan/VKDescriptorSet.h
        cocos/renderer/gfx-vulkan/VKDescriptorSetLayout.cpp
        cocos/renderer/gfx-vulkan/VKDescriptorSetLayout.h
        cocos/renderer/gfx-vulkan/VKPipelineLayout.cpp
        cocos/renderer/gfx-vulkan/VKPipelineLayout.h
        cocos/renderer/gfx-vulkan/VKPipelineState.cpp
        cocos/renderer/gfx-vulkan/VKPipelineState.h
        cocos/renderer/gfx-vulkan/VKQueue.cpp
        cocos/renderer/gfx-vulkan/VKQueue.h
        cocos/renderer/gfx-vulkan/VKRenderPass.cpp
        cocos/renderer/gfx-vulkan/VKRenderPass.h
        cocos/renderer/gfx-vulkan/VKSampler.cpp
        cocos/renderer/gfx-vulkan/VKSampler.h
        cocos/renderer/gfx-vulkan/VKShader.cpp
        cocos/renderer/gfx-vulkan/VKShader.h
        cocos/renderer/gfx-vulkan/VKSPIRV.h
        cocos/renderer/gfx-vulkan/VKStd.cpp
        cocos/renderer/gfx-vulkan/VKStd.h
        cocos/renderer/gfx-vulkan/VKTexture.cpp
        cocos/renderer/gfx-vulkan/VKTexture.h
        cocos/renderer/gfx-vulkan/VKUtils.h
        cocos/renderer/gfx-vulkan/VKFence.h
        cocos/renderer/gfx-vulkan/VKFence.cpp
        cocos/renderer/gfx-vulkan/volk.h
        cocos/renderer/gfx-vulkan/volk.c
    )
endif()

##### script bindings
######## dop
cocos_source_files(
    cocos/bindings/dop/BufferPool.cpp
    cocos/bindings/dop/BufferPool.h
    cocos/bindings/dop/ObjectPool.cpp
    cocos/bindings/dop/ObjectPool.h
    cocos/bindings/dop/jsb_dop.cpp
    cocos/bindings/dop/jsb_dop.h
    cocos/bindings/dop/PoolType.h
    cocos/bindings/dop/BufferAllocator.h
    cocos/bindings/dop/BufferAllocator.cpp
)

######## auto
cocos_source_files(
    cocos/bindings/auto/jsb_cocos_auto.cpp
    cocos/bindings/auto/jsb_cocos_auto.h
    cocos/bindings/auto/jsb_extension_auto.cpp
    cocos/bindings/auto/jsb_extension_auto.h
    cocos/bindings/auto/jsb_gfx_auto.cpp
    cocos/bindings/auto/jsb_gfx_auto.h
    cocos/bindings/auto/jsb_network_auto.cpp
    cocos/bindings/auto/jsb_network_auto.h
    cocos/bindings/auto/jsb_pipeline_auto.cpp
    cocos/bindings/auto/jsb_pipeline_auto.h
)

if(USE_AUDIO)
    cocos_source_files(
        cocos/bindings/auto/jsb_audio_auto.cpp
        cocos/bindings/auto/jsb_audio_auto.h
    )
endif()

if(USE_VIDEO)
    cocos_source_files(
        cocos/bindings/auto/jsb_video_auto.cpp
        cocos/bindings/auto/jsb_video_auto.h
    )
endif()

if(USE_WEBVIEW)
    cocos_source_files(
        cocos/bindings/auto/jsb_webview_auto.cpp
        cocos/bindings/auto/jsb_webview_auto.h
    )
endif()

if(USE_MIDDLEWARE)
    cocos_source_files(
        cocos/editor-support/IOBuffer.cpp
        cocos/editor-support/IOBuffer.h
        cocos/editor-support/IOTypedArray.cpp
        cocos/editor-support/IOTypedArray.h
        cocos/editor-support/MeshBuffer.cpp
        cocos/editor-support/MeshBuffer.h
        cocos/editor-support/middleware-adapter.cpp
        cocos/editor-support/middleware-adapter.h
        cocos/editor-support/MiddlewareMacro.h
        cocos/editor-support/MiddlewareManager.cpp
        cocos/editor-support/MiddlewareManager.h
        cocos/editor-support/SharedBufferManager.cpp
        cocos/editor-support/SharedBufferManager.h
        cocos/editor-support/TypedArrayPool.cpp
        cocos/editor-support/TypedArrayPool.h
        cocos/bindings/auto/jsb_editor_support_auto.cpp
        cocos/bindings/auto/jsb_editor_support_auto.h
    )

    if(USE_SPINE)
        cocos_source_files(
            cocos/editor-support/spine/Animation.cpp
            cocos/editor-support/spine/Animation.h
            cocos/editor-support/spine/AnimationState.cpp
            cocos/editor-support/spine/AnimationState.h
            cocos/editor-support/spine/AnimationStateData.cpp
            cocos/editor-support/spine/AnimationStateData.h
            cocos/editor-support/spine/Atlas.cpp
            cocos/editor-support/spine/Atlas.h
            cocos/editor-support/spine/AtlasAttachmentLoader.cpp
            cocos/editor-support/spine/AtlasAttachmentLoader.h
            cocos/editor-support/spine/Attachment.cpp
            cocos/editor-support/spine/Attachment.h
            cocos/editor-support/spine/AttachmentLoader.cpp
            cocos/editor-support/spine/AttachmentLoader.h
            cocos/editor-support/spine/AttachmentTimeline.cpp
            cocos/editor-support/spine/AttachmentTimeline.h
            cocos/editor-support/spine/AttachmentType.h
            cocos/editor-support/spine/BlendMode.h
            cocos/editor-support/spine/Bone.cpp
            cocos/editor-support/spine/Bone.h
            cocos/editor-support/spine/BoneData.cpp
            cocos/editor-support/spine/BoneData.h
            cocos/editor-support/spine/BoundingBoxAttachment.cpp
            cocos/editor-support/spine/BoundingBoxAttachment.h
            cocos/editor-support/spine/ClippingAttachment.cpp
            cocos/editor-support/spine/ClippingAttachment.h
            cocos/editor-support/spine/Color.h
            cocos/editor-support/spine/ColorTimeline.cpp
            cocos/editor-support/spine/ColorTimeline.h
            cocos/editor-support/spine/Constraint.cpp
            cocos/editor-support/spine/Constraint.h
            cocos/editor-support/spine/ConstraintData.cpp
            cocos/editor-support/spine/ConstraintData.h
            cocos/editor-support/spine/ContainerUtil.h
            cocos/editor-support/spine/CurveTimeline.cpp
            cocos/editor-support/spine/CurveTimeline.h
            cocos/editor-support/spine/Debug.h
            cocos/editor-support/spine/DeformTimeline.cpp
            cocos/editor-support/spine/DeformTimeline.h
            cocos/editor-support/spine/dll.h
            cocos/editor-support/spine/DrawOrderTimeline.cpp
            cocos/editor-support/spine/DrawOrderTimeline.h
            cocos/editor-support/spine/Event.cpp
            cocos/editor-support/spine/Event.h
            cocos/editor-support/spine/EventData.cpp
            cocos/editor-support/spine/EventData.h
            cocos/editor-support/spine/EventTimeline.cpp
            cocos/editor-support/spine/EventTimeline.h
            cocos/editor-support/spine/Extension.cpp
            cocos/editor-support/spine/Extension.h
            cocos/editor-support/spine/HashMap.h
            cocos/editor-support/spine/HasRendererObject.h
            cocos/editor-support/spine/IkConstraint.cpp
            cocos/editor-support/spine/IkConstraint.h
            cocos/editor-support/spine/IkConstraintData.cpp
            cocos/editor-support/spine/IkConstraintData.h
            cocos/editor-support/spine/IkConstraintTimeline.cpp
            cocos/editor-support/spine/IkConstraintTimeline.h
            cocos/editor-support/spine/Json.cpp
            cocos/editor-support/spine/Json.h
            cocos/editor-support/spine/LinkedMesh.cpp
            cocos/editor-support/spine/LinkedMesh.h
            cocos/editor-support/spine/MathUtil.cpp
            cocos/editor-support/spine/MathUtil.h
            cocos/editor-support/spine/MeshAttachment.cpp
            cocos/editor-support/spine/MeshAttachment.h
            cocos/editor-support/spine/MixBlend.h
            cocos/editor-support/spine/MixDirection.h
            cocos/editor-support/spine/PathAttachment.cpp
            cocos/editor-support/spine/PathAttachment.h
            cocos/editor-support/spine/PathConstraint.cpp
            cocos/editor-support/spine/PathConstraint.h
            cocos/editor-support/spine/PathConstraintData.cpp
            cocos/editor-support/spine/PathConstraintData.h
            cocos/editor-support/spine/PathConstraintMixTimeline.cpp
            cocos/editor-support/spine/PathConstraintMixTimeline.h
            cocos/editor-support/spine/PathConstraintPositionTimeline.cpp
            cocos/editor-support/spine/PathConstraintPositionTimeline.h
            cocos/editor-support/spine/PathConstraintSpacingTimeline.cpp
            cocos/editor-support/spine/PathConstraintSpacingTimeline.h
            cocos/editor-support/spine/PointAttachment.cpp
            cocos/editor-support/spine/PointAttachment.h
            cocos/editor-support/spine/Pool.h
            cocos/editor-support/spine/PositionMode.h
            cocos/editor-support/spine/RegionAttachment.cpp
            cocos/editor-support/spine/RegionAttachment.h
            cocos/editor-support/spine/RotateMode.h
            cocos/editor-support/spine/RotateTimeline.cpp
            cocos/editor-support/spine/RotateTimeline.h
            cocos/editor-support/spine/RTTI.cpp
            cocos/editor-support/spine/RTTI.h
            cocos/editor-support/spine/ScaleTimeline.cpp
            cocos/editor-support/spine/ScaleTimeline.h
            cocos/editor-support/spine/ShearTimeline.cpp
            cocos/editor-support/spine/ShearTimeline.h
            cocos/editor-support/spine/Skeleton.cpp
            cocos/editor-support/spine/Skeleton.h
            cocos/editor-support/spine/SkeletonBinary.cpp
            cocos/editor-support/spine/SkeletonBinary.h
            cocos/editor-support/spine/SkeletonBounds.cpp
            cocos/editor-support/spine/SkeletonBounds.h
            cocos/editor-support/spine/SkeletonClipping.cpp
            cocos/editor-support/spine/SkeletonClipping.h
            cocos/editor-support/spine/SkeletonData.cpp
            cocos/editor-support/spine/SkeletonData.h
            cocos/editor-support/spine/SkeletonJson.cpp
            cocos/editor-support/spine/SkeletonJson.h
            cocos/editor-support/spine/Skin.cpp
            cocos/editor-support/spine/Skin.h
            cocos/editor-support/spine/Slot.cpp
            cocos/editor-support/spine/Slot.h
            cocos/editor-support/spine/SlotData.cpp
            cocos/editor-support/spine/SlotData.h
            cocos/editor-support/spine/SpacingMode.h
            cocos/editor-support/spine/spine.h
            cocos/editor-support/spine/SpineObject.cpp
            cocos/editor-support/spine/SpineObject.h
            cocos/editor-support/spine/SpineString.h
            cocos/editor-support/spine/TextureLoader.cpp
            cocos/editor-support/spine/TextureLoader.h
            cocos/editor-support/spine/Timeline.cpp
            cocos/editor-support/spine/Timeline.h
            cocos/editor-support/spine/TimelineType.h
            cocos/editor-support/spine/TransformConstraint.cpp
            cocos/editor-support/spine/TransformConstraint.h
            cocos/editor-support/spine/TransformConstraintData.cpp
            cocos/editor-support/spine/TransformConstraintData.h
            cocos/editor-support/spine/TransformConstraintTimeline.cpp
            cocos/editor-support/spine/TransformConstraintTimeline.h
            cocos/editor-support/spine/TransformMode.h
            cocos/editor-support/spine/TranslateTimeline.cpp
            cocos/editor-support/spine/TranslateTimeline.h
            cocos/editor-support/spine/Triangulator.cpp
            cocos/editor-support/spine/Triangulator.h
            cocos/editor-support/spine/TwoColorTimeline.cpp
            cocos/editor-support/spine/TwoColorTimeline.h
            cocos/editor-support/spine/Updatable.cpp
            cocos/editor-support/spine/Updatable.h
            cocos/editor-support/spine/Vector.h
            cocos/editor-support/spine/VertexAttachment.cpp
            cocos/editor-support/spine/VertexAttachment.h
            cocos/editor-support/spine/VertexEffect.cpp
            cocos/editor-support/spine/VertexEffect.h
            cocos/editor-support/spine/Vertices.h
            cocos/editor-support/spine-creator-support/AttachmentVertices.cpp
            cocos/editor-support/spine-creator-support/AttachmentVertices.h
            cocos/editor-support/spine-creator-support/SkeletonAnimation.cpp
            cocos/editor-support/spine-creator-support/SkeletonAnimation.h
            cocos/editor-support/spine-creator-support/SkeletonCache.cpp
            cocos/editor-support/spine-creator-support/SkeletonCache.h
            cocos/editor-support/spine-creator-support/SkeletonCacheAnimation.cpp
            cocos/editor-support/spine-creator-support/SkeletonCacheAnimation.h
            cocos/editor-support/spine-creator-support/SkeletonCacheMgr.cpp
            cocos/editor-support/spine-creator-support/SkeletonCacheMgr.h
            cocos/editor-support/spine-creator-support/SkeletonDataMgr.cpp
            cocos/editor-support/spine-creator-support/SkeletonDataMgr.h
            cocos/editor-support/spine-creator-support/SkeletonRenderer.cpp
            cocos/editor-support/spine-creator-support/SkeletonRenderer.h
            cocos/editor-support/spine-creator-support/spine-cocos2dx.cpp
            cocos/editor-support/spine-creator-support/spine-cocos2dx.h
            cocos/editor-support/spine-creator-support/VertexEffectDelegate.cpp
            cocos/editor-support/spine-creator-support/VertexEffectDelegate.h
            cocos/bindings/auto/jsb_spine_auto.cpp
            cocos/bindings/auto/jsb_spine_auto.h
            cocos/bindings/manual/jsb_spine_manual.cpp
            cocos/bindings/manual/jsb_spine_manual.h
        )
    endif()

    if(USE_DRAGONBONES)
        cocos_source_files(
            cocos/editor-support/dragonbones/DragonBonesHeaders.h
            cocos/editor-support/dragonbones/animation/Animation.cpp
            cocos/editor-support/dragonbones/animation/Animation.h
            cocos/editor-support/dragonbones/animation/AnimationState.cpp
            cocos/editor-support/dragonbones/animation/AnimationState.h
            cocos/editor-support/dragonbones/animation/BaseTimelineState.cpp
            cocos/editor-support/dragonbones/animation/BaseTimelineState.h
            cocos/editor-support/dragonbones/animation/IAnimatable.h
            cocos/editor-support/dragonbones/animation/TimelineState.cpp
            cocos/editor-support/dragonbones/animation/TimelineState.h
            cocos/editor-support/dragonbones/animation/WorldClock.cpp
            cocos/editor-support/dragonbones/animation/WorldClock.h
            cocos/editor-support/dragonbones/armature/Armature.cpp
            cocos/editor-support/dragonbones/armature/Armature.h
            cocos/editor-support/dragonbones/armature/Bone.cpp
            cocos/editor-support/dragonbones/armature/Bone.h
            cocos/editor-support/dragonbones/armature/Constraint.cpp
            cocos/editor-support/dragonbones/armature/Constraint.h
            cocos/editor-support/dragonbones/armature/DeformVertices.cpp
            cocos/editor-support/dragonbones/armature/DeformVertices.h
            cocos/editor-support/dragonbones/armature/IArmatureProxy.h
            cocos/editor-support/dragonbones/armature/Slot.cpp
            cocos/editor-support/dragonbones/armature/Slot.h
            cocos/editor-support/dragonbones/armature/TransformObject.cpp
            cocos/editor-support/dragonbones/armature/TransformObject.h
            cocos/editor-support/dragonbones/core/BaseObject.cpp
            cocos/editor-support/dragonbones/core/BaseObject.h
            cocos/editor-support/dragonbones/core/DragonBones.cpp
            cocos/editor-support/dragonbones/core/DragonBones.h
            cocos/editor-support/dragonbones/event/EventObject.cpp
            cocos/editor-support/dragonbones/event/EventObject.h
            cocos/editor-support/dragonbones/event/IEventDispatcher.h
            cocos/editor-support/dragonbones/factory/BaseFactory.cpp
            cocos/editor-support/dragonbones/factory/BaseFactory.h
            cocos/editor-support/dragonbones/geom/ColorTransform.h
            cocos/editor-support/dragonbones/geom/Matrix.h
            cocos/editor-support/dragonbones/geom/Point.cpp
            cocos/editor-support/dragonbones/geom/Point.h
            cocos/editor-support/dragonbones/geom/Rectangle.h
            cocos/editor-support/dragonbones/geom/Transform.cpp
            cocos/editor-support/dragonbones/geom/Transform.h
            cocos/editor-support/dragonbones/model/AnimationConfig.cpp
            cocos/editor-support/dragonbones/model/AnimationConfig.h
            cocos/editor-support/dragonbones/model/AnimationData.cpp
            cocos/editor-support/dragonbones/model/AnimationData.h
            cocos/editor-support/dragonbones/model/ArmatureData.cpp
            cocos/editor-support/dragonbones/model/ArmatureData.h
            cocos/editor-support/dragonbones/model/BoundingBoxData.cpp
            cocos/editor-support/dragonbones/model/BoundingBoxData.h
            cocos/editor-support/dragonbones/model/CanvasData.cpp
            cocos/editor-support/dragonbones/model/CanvasData.h
            cocos/editor-support/dragonbones/model/ConstraintData.cpp
            cocos/editor-support/dragonbones/model/ConstraintData.h
            cocos/editor-support/dragonbones/model/DisplayData.cpp
            cocos/editor-support/dragonbones/model/DisplayData.h
            cocos/editor-support/dragonbones/model/DragonBonesData.cpp
            cocos/editor-support/dragonbones/model/DragonBonesData.h
            cocos/editor-support/dragonbones/model/SkinData.cpp
            cocos/editor-support/dragonbones/model/SkinData.h
            cocos/editor-support/dragonbones/model/TextureAtlasData.cpp
            cocos/editor-support/dragonbones/model/TextureAtlasData.h
            cocos/editor-support/dragonbones/model/UserData.cpp
            cocos/editor-support/dragonbones/model/UserData.h
            cocos/editor-support/dragonbones/parser/BinaryDataParser.cpp
            cocos/editor-support/dragonbones/parser/BinaryDataParser.h
            cocos/editor-support/dragonbones/parser/DataParser.cpp
            cocos/editor-support/dragonbones/parser/DataParser.h
            cocos/editor-support/dragonbones/parser/JSONDataParser.cpp
            cocos/editor-support/dragonbones/parser/JSONDataParser.h
            cocos/editor-support/dragonbones-creator-support/ArmatureCache.cpp
            cocos/editor-support/dragonbones-creator-support/ArmatureCache.h
            cocos/editor-support/dragonbones-creator-support/ArmatureCacheMgr.cpp
            cocos/editor-support/dragonbones-creator-support/ArmatureCacheMgr.h
            cocos/editor-support/dragonbones-creator-support/CCArmatureCacheDisplay.cpp
            cocos/editor-support/dragonbones-creator-support/CCArmatureCacheDisplay.h
            cocos/editor-support/dragonbones-creator-support/CCArmatureDisplay.cpp
            cocos/editor-support/dragonbones-creator-support/CCArmatureDisplay.h
            cocos/editor-support/dragonbones-creator-support/CCDragonBonesHeaders.h
            cocos/editor-support/dragonbones-creator-support/CCFactory.cpp
            cocos/editor-support/dragonbones-creator-support/CCFactory.h
            cocos/editor-support/dragonbones-creator-support/CCSlot.cpp
            cocos/editor-support/dragonbones-creator-support/CCSlot.h
            cocos/editor-support/dragonbones-creator-support/CCTextureAtlasData.cpp
            cocos/editor-support/dragonbones-creator-support/CCTextureAtlasData.h
            cocos/bindings/auto/jsb_dragonbones_auto.cpp
            cocos/bindings/auto/jsb_dragonbones_auto.h
            cocos/bindings/manual/jsb_dragonbones_manual.cpp
            cocos/bindings/manual/jsb_dragonbones_manual.h
        )
    endif()
endif()

######## manual
cocos_source_files(
    cocos/bindings/manual/jsb_classtype.cpp
    cocos/bindings/manual/jsb_classtype.h
    #cocos/bindings/manual/jsb_extension_manual.cpp
    #cocos/bindings/manual/jsb_extension_manual.h
    cocos/bindings/manual/jsb_cocos_manual.cpp
    cocos/bindings/manual/jsb_cocos_manual.h
    cocos/bindings/manual/jsb_conversions.cpp
    cocos/bindings/manual/jsb_conversions.h
    cocos/bindings/manual/jsb_gfx_manual.cpp
    cocos/bindings/manual/jsb_gfx_manual.h
    cocos/bindings/manual/jsb_global.cpp
    cocos/bindings/manual/jsb_global.h
    cocos/bindings/manual/jsb_helper.cpp
    cocos/bindings/manual/jsb_helper.h
    cocos/bindings/manual/jsb_module_register.h
    cocos/bindings/manual/jsb_platform.h
    cocos/bindings/manual/jsb_network_manual.cpp
    cocos/bindings/manual/jsb_network_manual.h
    cocos/bindings/manual/jsb_xmlhttprequest.cpp
    cocos/bindings/manual/jsb_xmlhttprequest.h
    cocos/bindings/manual/jsb_pipeline_manual.h
    cocos/bindings/manual/jsb_pipeline_manual.cpp
)

if(USE_SOCKET)
    cocos_source_files(
        cocos/bindings/manual/jsb_socketio.cpp
        cocos/bindings/manual/jsb_socketio.h
        cocos/bindings/manual/jsb_websocket.cpp
        cocos/bindings/manual/jsb_websocket.h
    )
endif()

if(NOT IOS AND USE_WEBSOCKET_SERVER)
    cocos_source_files(
        cocos/bindings/manual/jsb_websocket_server.cpp
        cocos/bindings/manual/jsb_websocket_server.h
    )
endif()

if(ANDROID)
    cocos_source_files(
        cocos/bindings/manual/jsb_platform_android.cpp
        cocos/bindings/manual/JavaScriptJavaBridge.cpp
        cocos/bindings/manual/JavaScriptJavaBridge.h
    )
elseif(APPLE)
    cocos_source_files(
        cocos/bindings/manual/jsb_platfrom_apple.mm
        cocos/bindings/manual/JavaScriptObjCBridge.h
        cocos/bindings/manual/JavaScriptObjCBridge.mm
    )
elseif(WIN32)
    cocos_source_files(
        cocos/bindings/manual/jsb_platfrom_win32.cpp
    )
endif()

if(CC_USE_GLES2)
    cocos_source_files(
        cocos/bindings/auto/jsb_gles2_auto.h
        cocos/bindings/auto/jsb_gles2_auto.cpp
    )
endif()

if(CC_USE_GLES3)
    cocos_source_files(
        cocos/bindings/auto/jsb_gles3_auto.h
        cocos/bindings/auto/jsb_gles3_auto.cpp
    )
endif()

if(CC_USE_METAL)
    cocos_source_files(
        cocos/bindings/auto/jsb_mtl_auto.h
        cocos/bindings/auto/jsb_mtl_auto.cpp
    )
endif()

if(CC_USE_VULKAN)
    cocos_source_files(
        cocos/bindings/auto/jsb_vk_auto.h
        cocos/bindings/auto/jsb_vk_auto.cpp
    )
endif()

if(USE_SE_V8)
    cocos_source_files(
        cocos/bindings/jswrapper/v8/Base.h
        cocos/bindings/jswrapper/v8/Class.cpp
        cocos/bindings/jswrapper/v8/Class.h
        cocos/bindings/jswrapper/v8/HelperMacros.h
        cocos/bindings/jswrapper/v8/Object.cpp
        cocos/bindings/jswrapper/v8/Object.h
        cocos/bindings/jswrapper/v8/ObjectWrap.cpp
        cocos/bindings/jswrapper/v8/ObjectWrap.h
        cocos/bindings/jswrapper/v8/ScriptEngine.cpp
        cocos/bindings/jswrapper/v8/ScriptEngine.h
        cocos/bindings/jswrapper/v8/SeApi.h
        cocos/bindings/jswrapper/v8/Utils.cpp
        cocos/bindings/jswrapper/v8/Utils.h
    )
    if(USE_V8_DEBUGGER)
    cocos_source_files(
        cocos/bindings/jswrapper/v8/debugger/base64.h
        cocos/bindings/jswrapper/v8/debugger/env.cpp
        cocos/bindings/jswrapper/v8/debugger/env.h
        cocos/bindings/jswrapper/v8/debugger/http_parser.c
        cocos/bindings/jswrapper/v8/debugger/http_parser.h
        cocos/bindings/jswrapper/v8/debugger/inspector_agent.cpp
        cocos/bindings/jswrapper/v8/debugger/inspector_agent.h
        cocos/bindings/jswrapper/v8/debugger/inspector_io.cpp
        cocos/bindings/jswrapper/v8/debugger/inspector_io.h
        cocos/bindings/jswrapper/v8/debugger/inspector_socket.cpp
        cocos/bindings/jswrapper/v8/debugger/inspector_socket.h
        cocos/bindings/jswrapper/v8/debugger/inspector_socket_server.cpp
        cocos/bindings/jswrapper/v8/debugger/inspector_socket_server.h
        cocos/bindings/jswrapper/v8/debugger/node.cpp
        cocos/bindings/jswrapper/v8/debugger/node.h
        cocos/bindings/jswrapper/v8/debugger/node_debug_options.cpp
        cocos/bindings/jswrapper/v8/debugger/node_debug_options.h
        cocos/bindings/jswrapper/v8/debugger/node_mutex.h
        cocos/bindings/jswrapper/v8/debugger/SHA1.cpp
        cocos/bindings/jswrapper/v8/debugger/SHA1.h
        cocos/bindings/jswrapper/v8/debugger/util-inl.h
        cocos/bindings/jswrapper/v8/debugger/util.cpp
        cocos/bindings/jswrapper/v8/debugger/util.h
        cocos/bindings/jswrapper/v8/debugger/v8_inspector_protocol_json.h
    )
    endif()
endif()

if(USE_SE_JSC)
    cocos_source_files(
        cocos/bindings/jswrapper/jsc/Class.h
        cocos/bindings/jswrapper/jsc/EJConvert.h
        cocos/bindings/jswrapper/jsc/HelperMacros.h
        cocos/bindings/jswrapper/jsc/Utils.cpp
        cocos/bindings/jswrapper/jsc/EJConvertTypedArray.h
        cocos/bindings/jswrapper/jsc/PlatformUtils.h
        cocos/bindings/jswrapper/jsc/EJConvertTypedArray.m
        cocos/bindings/jswrapper/jsc/EJConvert.m
        cocos/bindings/jswrapper/jsc/Object.h
        cocos/bindings/jswrapper/jsc/Object.mm
        cocos/bindings/jswrapper/jsc/ScriptEngine.h
        cocos/bindings/jswrapper/jsc/ScriptEngine.mm
        cocos/bindings/jswrapper/jsc/PlatformUtils.mm
        cocos/bindings/jswrapper/jsc/SeApi.h
        cocos/bindings/jswrapper/jsc/Class.cpp
        cocos/bindings/jswrapper/jsc/Utils.h
        cocos/bindings/jswrapper/jsc/Base.h
    )
endif()

cocos_source_files(
    cocos/bindings/jswrapper/config.cpp
    cocos/bindings/jswrapper/config.h
    cocos/bindings/jswrapper/HandleObject.cpp
    cocos/bindings/jswrapper/HandleObject.h
    cocos/bindings/jswrapper/MappingUtils.cpp
    cocos/bindings/jswrapper/MappingUtils.h
    cocos/bindings/jswrapper/Object.h
    cocos/bindings/jswrapper/RefCounter.cpp
    cocos/bindings/jswrapper/RefCounter.h
    cocos/bindings/jswrapper/SeApi.h
    cocos/bindings/jswrapper/State.cpp
    cocos/bindings/jswrapper/State.h
    cocos/bindings/jswrapper/Value.cpp
    cocos/bindings/jswrapper/Value.h
)

cocos_source_files(
    cocos/bindings/event/CustomEventTypes.h
    cocos/bindings/event/EventDispatcher.cpp
    cocos/bindings/event/EventDispatcher.h
)

#### storage
cocos_source_files(
    cocos/storage/local-storage/LocalStorage.cpp
    cocos/storage/local-storage/LocalStorage.h
)

if(ANDROID)
    cocos_source_files(
        cocos/storage/local-storage/LocalStorage-android.cpp
    )
endif()

#### ui
if(USE_EDIT_BOX)
    cocos_source_files(
        cocos/ui/edit-box/EditBox.h
    )
endif()

if(ANDROID OR IOS)
    if(USE_VIDEO)
        cocos_source_files(
            cocos/ui/videoplayer/VideoPlayer.h
        )
    endif()
    if(USE_WEBVIEW)
        cocos_source_files(
            cocos/ui/webview/WebViewImpl-android.h
            cocos/ui/webview/WebViewImpl-ios.h
            cocos/ui/webview/WebView-inl.h
            cocos/ui/webview/WebView.h
        )
    endif()
endif()

if(ANDROID)
    if(USE_EDIT_BOX)
        cocos_source_files(
            cocos/ui/edit-box/EditBox-android.cpp
        )
    endif()
    if(USE_VIDEO)
        cocos_source_files(
            cocos/ui/videoplayer/VideoPlayer-android.cpp
        )
    endif()
    if(USE_WEBVIEW)
        cocos_source_files(
            cocos/ui/webview/WebViewImpl-android.cpp
        )
    endif()
elseif(MACOSX)
    if(USE_EDIT_BOX)
        cocos_source_files(
            cocos/ui/edit-box/EditBox-mac.mm
        )
    endif()
elseif(IOS)
    if(USE_EDIT_BOX)
        cocos_source_files(
            cocos/ui/edit-box/EditBox-ios.mm
        )
    endif()
    if(USE_VIDEO)
        cocos_source_files(
            cocos/ui/videoplayer/VideoPlayer-ios.mm
        )
    endif()
    if(USE_WEBVIEW)
       cocos_source_files(
           cocos/ui/webview/WebViewImpl-ios.mm
       )
   endif()
elseif(WIN32)
    if(USE_EDIT_BOX)
        cocos_source_files(
            cocos/ui/edit-box/EditBox-win32.cpp
        )
    endif()
endif()

##### extensions

cocos_source_files(
    extensions/assets-manager/AssetsManagerEx.cpp
    extensions/assets-manager/AssetsManagerEx.h
    extensions/assets-manager/AsyncTaskPool.cpp
    extensions/assets-manager/AsyncTaskPool.h
    extensions/assets-manager/EventAssetsManagerEx.cpp
    extensions/assets-manager/EventAssetsManagerEx.h
    extensions/assets-manager/Manifest.cpp
    extensions/assets-manager/Manifest.h
    extensions/cocos-ext.h
    extensions/ExtensionExport.h
    extensions/ExtensionMacros.h
)

list(APPEND COCOS2D_SOURCE_LIST ${CC_EXTERNAL_SROUCES})

add_library(cocos2d ${COCOS2D_SOURCE_LIST})

if(ANDROID)
    add_library(cocos2d_jni STATIC ${CC_JNI_SRC_FILES})
    target_include_directories(cocos2d_jni PUBLIC
        ${CWD}
        ${CWD}/cocos
    )
    target_link_libraries(cocos2d_jni PUBLIC
        android_platform
        android
        log
    )
endif()

# setup default flags
target_compile_definitions(cocos2d PUBLIC
    $<IF:$<BOOL:${USE_VIDEO}>,USE_VIDEO=1,USE_VIDEO=0>
    $<IF:$<BOOL:${USE_WEBVIEW}>,USE_WEBVIEW=1,USE_WEBVIEW=0>
    $<IF:$<BOOL:${USE_AUDIO}>,USE_AUDIO=1,USE_AUDIO=0>
    $<IF:$<BOOL:${USE_SOCKET}>,USE_SOCKET=1,USE_SOCKET=0>
    $<IF:$<BOOL:${USE_WEBSOCKET_SERVER}>,USE_WEBSOCKET_SERVER=1,USE_WEBSOCKET_SERVER=0>
    $<IF:$<BOOL:${USE_EDIT_BOX}>,CC_USE_EDITBOX=1,CC_USE_EDITBOX=0>
    $<IF:$<BOOL:${USE_V8_DEBUGGER}>,USE_V8_DEBUGGER=1,USE_V8_DEBUGGER=0>
    $<IF:$<BOOL:${USE_MIDDLEWARE}>,USE_MIDDLEWARE=1,USE_MIDDLEWARE=0>
    $<IF:$<BOOL:${USE_SPINE}>,USE_SPINE=1,USE_SPINE=0>
    $<IF:$<BOOL:${USE_DRAGONBONES}>,USE_DRAGONBONES=1,USE_DRAGONBONES=0>
    $<$<BOOL:${USE_SE_JSC}>:SCRIPT_ENGINE_TYPE=3>
    $<$<CONFIG:Debug>:CC_DEBUG=1>
)

if(CC_USE_VULKAN)

    target_compile_definitions(cocos2d PUBLIC VK_NO_PROTOTYPES)
    target_compile_definitions(cocos2d PUBLIC CC_USE_VULKAN)

    if(WIN32)
        target_compile_definitions(cocos2d PUBLIC VK_USE_PLATFORM_WIN32_KHR)
    elseif(ANDROID)
        target_compile_definitions(cocos2d PUBLIC VK_USE_PLATFORM_ANDROID_KHR)
    elseif(IOS)
        target_compile_definitions(cocos2d PUBLIC VK_USE_PLATFORM_IOS_MVK)
    elseif(MACOSX)
        target_compile_definitions(cocos2d PUBLIC VK_USE_PLATFORM_MACOS_MVK)
    else()
        target_compile_definitions(cocos2d PUBLIC VK_USE_PLATFORM_XCB_KHR)
    endif()
endif()

if(CC_USE_METAL)
    target_compile_definitions(cocos2d PUBLIC CC_USE_METAL)
endif()

if(CC_USE_GLES3)
    target_compile_definitions(cocos2d PUBLIC CC_USE_GLES3)
endif()

if(CC_USE_GLES2)
    target_compile_definitions(cocos2d PUBLIC CC_USE_GLES2)
endif()

target_include_directories(cocos2d
    PUBLIC
        ${CC_EXTERNAL_INCLUDES}
        ${CWD}
        ${CWD}/cocos
        ${CWD}/cocos/renderer
        ${CWD}/cocos/platform
        ${CWD}/cocos/renderer/core
        ${CWD}/external/sources/khronos
        ${CWD}/cocos/editor-support
        $<$<BOOL:USE_SE_JSC>:${CWD}/cocos/bindings/jswrapper>
    PRIVATE
        ${CC_EXTERNAL_PRIVATE_INCLUDES}
)

if(WIN32)
    target_link_libraries(cocos2d PUBLIC
        ws2_32 userenv psapi winmm Version Iphlpapi opengl32
        ${CC_EXTERNAL_LIBS}
    )

    target_compile_definitions(cocos2d PUBLIC
        CC_STATIC
        WIN32
        _WIN32
        _WINDOWS
        NOMINMAX
        UNICODE
        _UNICODE
        _CRT_SECURE_NO_WARNINGS
        _SCL_SECURE_NO_WARNINGS
        _USRLIBSIMSTATIC
        SE_ENABLE_INSPECTOR
    )

endif()

if(ANDROID)
    find_library(LIB_EGL NAMES EGL)
    find_library(LIB_GLESv2 NAMES GLESv2)
    target_link_libraries(cocos2d PUBLIC
        android
        log
        OpenSLES
        ${LIB_EGL}
        ${LIB_GLESv2}
        GLESv2
        ${CC_EXTERNAL_LIBS}
    )
endif()

if(APPLE)

    target_compile_options(cocos2d PRIVATE
        -Wno-objc-method-access
    )

    target_include_directories(cocos2d PUBLIC
        ${CWD}/cocos/platform/ios
    )
    target_link_libraries(cocos2d PUBLIC
        "-liconv"
        "-framework AudioToolbox"
        "-framework Foundation"
        "-framework OpenAL"
        "-framework GameController"
        "-framework Metal"
        "-framework MetalKit"
        "-lsqlite3"
        "-framework Security"
        "-framework SystemConfiguration"
        ${CC_EXTERNAL_LIBS}
    )
    if(MACOSX)
        target_link_libraries(cocos2d PUBLIC
            "-framework OpenGL"
            "-framework AppKit"
        )
        target_compile_definitions(cocos2d PUBLIC
            CC_KEYBOARD_SUPPORT
            )
    elseif(IOS)
        target_link_libraries(cocos2d PUBLIC
            "-framework QuartzCore"
            "-framework UIKit"
            "-framework AVKit"
            "-framework WebKit"
            "-framework CoreMotion"
            "-framework CFNetwork"
            "-framework CoreMedia"
            "-framework CoreText"
            "-framework CoreGraphics"
            "-framework AVFoundation"
            "-lz"
            "-framework OpenGLES"
            "-framework JavaScriptCore"
        )
        set_property(TARGET cocos2d PROPERTY XCODE_ATTRIBUTE_IPHONEOS_DEPLOYMENT_TARGET ${TARGET_IOS_VERSION})
        set_property(TARGET cocos2d PROPERTY XCODE_ATTRIBUTE_ENABLE_BITCODE "NO")
        set_property(TARGET cocos2d PROPERTY XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH "YES")
    endif()

endif()

source_group(TREE ${CWD} PREFIX "Source Files" FILES ${COCOS2D_SOURCE_LIST})


if(MSVC)
    file(GLOB_RECURSE WIN32_DLLS
        ${CWD}/external/win32/libs/*.dll
        ${CWD}/external/win32/libs/Debug/*.dll
    )
    target_compile_options(cocos2d PUBLIC /MP)
endif()

#if(COMMAND target_precompile_headers)
    #target_precompile_headers(cocos2d PUBLIC
        #$<$<COMPILE_LANGUAGE:CXX>:${CWD}/cocos/cocos2d.h>
    #)
#endif()
