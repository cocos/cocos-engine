

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

################################# options ############################################

set(CC_USE_METAL OFF)
set(CC_USE_GLES3 ON)
set(CC_USE_GLES2 OFF)

if(ANDROID OR WINDOWS)
    set(CC_USE_VULKAN ON)
    set(CC_USE_GLES3 ON)
    set(CC_USE_GLES2 ON)
elseif(MACOSX)
    set(CC_USE_METAL ON)
    set(CC_USE_GLES3 OFF)
endif()

if(USE_SE_JSC)
    set(USE_SE_V8 OFF)
    set(USE_V8_DEBUGGER OFF)
endif()


## disable videoplay on non-mobile platforms
if(NOT ANDROID AND NOT IOS)
    set(USE_VIDEOPLAYER OFF)
endif()

################################# external source code ################################


include(${CMAKE_CURRENT_LIST_DIR}/external/CMakeLists.txt)

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


cocos_source_files(
    cocos/cocos2d.h
    cocos/cocos2d.cpp
)

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
    cocos/base/utlist.h
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
        cocos/platform/android/jni/JniHelper.cpp
        cocos/platform/android/jni/JniHelper.h
        cocos/platform/android/jni/JniImp.cpp
        cocos/platform/android/jni/JniImp.h
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
    cocos/renderer/core/CoreStd.cc
    cocos/renderer/core/CoreStd.h
    cocos/renderer/core/gfx/GFXObject.h
    cocos/renderer/core/gfx/GFXObject.cc
    cocos/renderer/core/gfx/GFXBuffer.cc
    cocos/renderer/core/gfx/GFXBuffer.h
    cocos/renderer/core/gfx/GFXCommand.h
    cocos/renderer/core/gfx/GFXCommandBuffer.cc
    cocos/renderer/core/gfx/GFXCommandBuffer.h
    cocos/renderer/core/gfx/GFXCommandPool.h
    cocos/renderer/core/gfx/GFXContext.cc
    cocos/renderer/core/gfx/GFXContext.h
    cocos/renderer/core/gfx/GFXDef.cc
    cocos/renderer/core/gfx/GFXDef.h
    cocos/renderer/core/gfx/GFXDevice.cc
    cocos/renderer/core/gfx/GFXDevice.h
    cocos/renderer/core/gfx/GFXFramebuffer.cc
    cocos/renderer/core/gfx/GFXFramebuffer.h
    cocos/renderer/core/gfx/GFXInputAssembler.cc
    cocos/renderer/core/gfx/GFXInputAssembler.h
    cocos/renderer/core/gfx/GFXDescriptorSet.cc
    cocos/renderer/core/gfx/GFXDescriptorSet.h
    cocos/renderer/core/gfx/GFXDescriptorSetLayout.cc
    cocos/renderer/core/gfx/GFXDescriptorSetLayout.h
    cocos/renderer/core/gfx/GFXPipelineLayout.cc
    cocos/renderer/core/gfx/GFXPipelineLayout.h
    cocos/renderer/core/gfx/GFXPipelineState.cc
    cocos/renderer/core/gfx/GFXPipelineState.h
    cocos/renderer/core/gfx/GFXQueue.cc
    cocos/renderer/core/gfx/GFXQueue.h
    cocos/renderer/core/gfx/GFXRenderPass.cc
    cocos/renderer/core/gfx/GFXRenderPass.h
    cocos/renderer/core/gfx/GFXSampler.cc
    cocos/renderer/core/gfx/GFXSampler.h
    cocos/renderer/core/gfx/GFXShader.cc
    cocos/renderer/core/gfx/GFXShader.h
    cocos/renderer/core/gfx/GFXTexture.cc
    cocos/renderer/core/gfx/GFXTexture.h
    cocos/renderer/core/gfx/GFXFence.h
    cocos/renderer/core/gfx/GFXFence.cc
    cocos/renderer/core/math/CoreMath.cc
    cocos/renderer/core/math/CoreMath.h
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
    cocos/renderer/pipeline/RenderView.cpp
    cocos/renderer/pipeline/RenderView.h
    cocos/renderer/pipeline/PlanarShadowQueue.cpp
    cocos/renderer/pipeline/PlanarShadowQueue.h
    cocos/renderer/pipeline/ShadowMapBatchedQueue.cpp
    cocos/renderer/pipeline/ShadowMapBatchedQueue.h
    cocos/renderer/pipeline/forward/ForwardFlow.cpp
    cocos/renderer/pipeline/forward/ForwardFlow.h
    cocos/renderer/pipeline/forward/ForwardPipeline.cpp
    cocos/renderer/pipeline/forward/ForwardPipeline.h
    cocos/renderer/pipeline/forward/ForwardStage.cpp
    cocos/renderer/pipeline/forward/ForwardStage.h
    cocos/renderer/pipeline/forward/SceneCulling.cpp
    cocos/renderer/pipeline/forward/SceneCulling.h
    cocos/renderer/pipeline/shadow/ShadowFlow.cpp
    cocos/renderer/pipeline/shadow/ShadowFlow.h
    cocos/renderer/pipeline/shadow/ShadowStage.cpp
    cocos/renderer/pipeline/shadow/ShadowStage.h
    cocos/renderer/pipeline/ui/UIFlow.h
    cocos/renderer/pipeline/ui/UIFlow.cpp
    cocos/renderer/pipeline/ui/UIStage.h
    cocos/renderer/pipeline/ui/UIStage.cpp
    cocos/renderer/pipeline/helper/DefineMap.h
    cocos/renderer/pipeline/helper/DefineMap.cpp
    cocos/renderer/pipeline/helper/SharedMemory.h
    cocos/renderer/pipeline/helper/SharedMemory.cpp
)

if(CC_USE_GLES2)
    cocos_source_files(
        cocos/renderer/gfx-gles2/GFXGLES2.h
        cocos/renderer/gfx-gles2/GLES2Buffer.cc
        cocos/renderer/gfx-gles2/GLES2Buffer.h
        cocos/renderer/gfx-gles2/GLES2CommandAllocator.cc
        cocos/renderer/gfx-gles2/GLES2CommandAllocator.h
        cocos/renderer/gfx-gles2/GLES2CommandBuffer.cc
        cocos/renderer/gfx-gles2/GLES2CommandBuffer.h
        cocos/renderer/gfx-gles2/GLES2Commands.cc
        cocos/renderer/gfx-gles2/GLES2Commands.h
        cocos/renderer/gfx-gles2/GLES2Context.h
        cocos/renderer/gfx-gles2/GLES2Device.cc
        cocos/renderer/gfx-gles2/GLES2Device.h
        cocos/renderer/gfx-gles2/GLES2Framebuffer.cc
        cocos/renderer/gfx-gles2/GLES2Framebuffer.h
        cocos/renderer/gfx-gles2/GLES2GPUObjects.h
        cocos/renderer/gfx-gles2/GLES2InputAssembler.cc
        cocos/renderer/gfx-gles2/GLES2InputAssembler.h
        cocos/renderer/gfx-gles2/GLES2DescriptorSet.cc
        cocos/renderer/gfx-gles2/GLES2DescriptorSet.h
        cocos/renderer/gfx-gles2/GLES2DescriptorSetLayout.cc
        cocos/renderer/gfx-gles2/GLES2DescriptorSetLayout.h
        cocos/renderer/gfx-gles2/GLES2PipelineLayout.cc
        cocos/renderer/gfx-gles2/GLES2PipelineLayout.h
        cocos/renderer/gfx-gles2/GLES2PipelineState.cc
        cocos/renderer/gfx-gles2/GLES2PipelineState.h
        cocos/renderer/gfx-gles2/GLES2Queue.cc
        cocos/renderer/gfx-gles2/GLES2Queue.h
        cocos/renderer/gfx-gles2/GLES2RenderPass.cc
        cocos/renderer/gfx-gles2/GLES2RenderPass.h
        cocos/renderer/gfx-gles2/GLES2Sampler.cc
        cocos/renderer/gfx-gles2/GLES2Sampler.h
        cocos/renderer/gfx-gles2/GLES2Shader.cc
        cocos/renderer/gfx-gles2/GLES2Shader.h
        cocos/renderer/gfx-gles2/GLES2StateCache.h
        cocos/renderer/gfx-gles2/GLES2Std.cc
        cocos/renderer/gfx-gles2/GLES2Std.h
        cocos/renderer/gfx-gles2/GLES2Texture.cc
        cocos/renderer/gfx-gles2/GLES2Texture.h
        cocos/renderer/gfx-gles2/gles2w.h
        cocos/renderer/gfx-gles2/GLES2Fence.h
        cocos/renderer/gfx-gles2/GLES2Fence.cc
    )

    if(APPLE)
        cocos_source_files(
            cocos/renderer/gfx-gles2/GLES2Context.mm
            cocos/renderer/gfx-gles2/gles2w.mm
        )
    else()
        cocos_source_files(
            cocos/renderer/gfx-gles2/GLES2Context.cc
            cocos/renderer/gfx-gles2/gles2w.c
        )
    endif()

endif()

if(CC_USE_GLES3)
    cocos_source_files(
        cocos/renderer/gfx-gles3/GFXGLES3.h
        cocos/renderer/gfx-gles3/GLES3Buffer.cc
        cocos/renderer/gfx-gles3/GLES3Buffer.h
        cocos/renderer/gfx-gles3/GLES3CommandAllocator.cc
        cocos/renderer/gfx-gles3/GLES3CommandAllocator.h
        cocos/renderer/gfx-gles3/GLES3CommandBuffer.cc
        cocos/renderer/gfx-gles3/GLES3CommandBuffer.h
        cocos/renderer/gfx-gles3/GLES3Commands.cc
        cocos/renderer/gfx-gles3/GLES3Commands.h
        cocos/renderer/gfx-gles3/GLES3Context.cc
        cocos/renderer/gfx-gles3/GLES3Context.h
        cocos/renderer/gfx-gles3/GLES3Device.cc
        cocos/renderer/gfx-gles3/GLES3Device.h
        cocos/renderer/gfx-gles3/GLES3Framebuffer.cc
        cocos/renderer/gfx-gles3/GLES3Framebuffer.h
        cocos/renderer/gfx-gles3/GLES3GPUObjects.h
        cocos/renderer/gfx-gles3/GLES3InputAssembler.cc
        cocos/renderer/gfx-gles3/GLES3InputAssembler.h
        cocos/renderer/gfx-gles3/GLES3DescriptorSet.cc
        cocos/renderer/gfx-gles3/GLES3DescriptorSet.h
        cocos/renderer/gfx-gles3/GLES3DescriptorSetLayout.cc
        cocos/renderer/gfx-gles3/GLES3DescriptorSetLayout.h
        cocos/renderer/gfx-gles3/GLES3PipelineLayout.cc
        cocos/renderer/gfx-gles3/GLES3PipelineLayout.h
        cocos/renderer/gfx-gles3/GLES3PipelineState.cc
        cocos/renderer/gfx-gles3/GLES3PipelineState.h
        cocos/renderer/gfx-gles3/GLES3Queue.cc
        cocos/renderer/gfx-gles3/GLES3Queue.h
        cocos/renderer/gfx-gles3/GLES3RenderPass.cc
        cocos/renderer/gfx-gles3/GLES3RenderPass.h
        cocos/renderer/gfx-gles3/GLES3Sampler.cc
        cocos/renderer/gfx-gles3/GLES3Sampler.h
        cocos/renderer/gfx-gles3/GLES3Shader.cc
        cocos/renderer/gfx-gles3/GLES3Shader.h
        cocos/renderer/gfx-gles3/GLES3StateCache.h
        cocos/renderer/gfx-gles3/GLES3Std.cc
        cocos/renderer/gfx-gles3/GLES3Std.h
        cocos/renderer/gfx-gles3/GLES3Texture.cc
        cocos/renderer/gfx-gles3/GLES3Texture.h
        cocos/renderer/gfx-gles3/gles3w.h
        cocos/renderer/gfx-gles3/GLES3Fence.h
        cocos/renderer/gfx-gles3/GLES3Fence.cc
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
        cocos/renderer/gfx-metal/MTLCommands.h
        cocos/renderer/gfx-metal/MTLCommands.mm
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
        cocos/renderer/gfx-metal/MTLStateCache.h
        cocos/renderer/gfx-metal/MTLStd.cpp
        cocos/renderer/gfx-metal/MTLStd.h
        cocos/renderer/gfx-metal/MTLTexture.h
        cocos/renderer/gfx-metal/MTLTexture.mm
        cocos/renderer/gfx-metal/MTLUtils.h
        cocos/renderer/gfx-metal/MTLUtils.mm
        cocos/renderer/gfx-metal/MTLFence.h
        cocos/renderer/gfx-metal/MTLFence.mm
    )
endif()

if(CC_USE_VULKAN)

    cocos_source_files(
        cocos/renderer/gfx-vulkan/GFXVulkan.h
        cocos/renderer/gfx-vulkan/vk_mem_alloc.h
        cocos/renderer/gfx-vulkan/VKBuffer.cc
        cocos/renderer/gfx-vulkan/VKBuffer.h
        cocos/renderer/gfx-vulkan/VKCommandBuffer.cc
        cocos/renderer/gfx-vulkan/VKCommandBuffer.h
        cocos/renderer/gfx-vulkan/VKCommands.cc
        cocos/renderer/gfx-vulkan/VKCommands.h
        cocos/renderer/gfx-vulkan/VKContext.cc
        cocos/renderer/gfx-vulkan/VKContext.h
        cocos/renderer/gfx-vulkan/VKDevice.cc
        cocos/renderer/gfx-vulkan/VKDevice.h
        cocos/renderer/gfx-vulkan/VKFramebuffer.cc
        cocos/renderer/gfx-vulkan/VKFramebuffer.h
        cocos/renderer/gfx-vulkan/VKGPUObjects.h
        cocos/renderer/gfx-vulkan/VKInputAssembler.cc
        cocos/renderer/gfx-vulkan/VKInputAssembler.h
        cocos/renderer/gfx-vulkan/VKDescriptorSet.cc
        cocos/renderer/gfx-vulkan/VKDescriptorSet.h
        cocos/renderer/gfx-vulkan/VKDescriptorSetLayout.cc
        cocos/renderer/gfx-vulkan/VKDescriptorSetLayout.h
        cocos/renderer/gfx-vulkan/VKPipelineLayout.cc
        cocos/renderer/gfx-vulkan/VKPipelineLayout.h
        cocos/renderer/gfx-vulkan/VKPipelineState.cc
        cocos/renderer/gfx-vulkan/VKPipelineState.h
        cocos/renderer/gfx-vulkan/VKQueue.cc
        cocos/renderer/gfx-vulkan/VKQueue.h
        cocos/renderer/gfx-vulkan/VKRenderPass.cc
        cocos/renderer/gfx-vulkan/VKRenderPass.h
        cocos/renderer/gfx-vulkan/VKSampler.cc
        cocos/renderer/gfx-vulkan/VKSampler.h
        cocos/renderer/gfx-vulkan/VKShader.cc
        cocos/renderer/gfx-vulkan/VKShader.h
        cocos/renderer/gfx-vulkan/VKSPIRV.h
        cocos/renderer/gfx-vulkan/VKStd.cc
        cocos/renderer/gfx-vulkan/VKStd.h
        cocos/renderer/gfx-vulkan/VKTexture.cc
        cocos/renderer/gfx-vulkan/VKTexture.h
        cocos/renderer/gfx-vulkan/VKUtils.h
        cocos/renderer/gfx-vulkan/VKFence.h
        cocos/renderer/gfx-vulkan/VKFence.cc
        cocos/renderer/gfx-vulkan/volk.h
        cocos/renderer/gfx-vulkan/volk.c
    )
endif()

##### script bindings
######## dop
cocos_source_files(
    cocos/scripting/dop/BufferPool.cpp
    cocos/scripting/dop/BufferPool.h
    cocos/scripting/dop/ObjectPool.cpp
    cocos/scripting/dop/ObjectPool.h
    cocos/scripting/dop/jsb_dop.cpp
    cocos/scripting/dop/jsb_dop.h
    cocos/scripting/dop/PoolType.h
    cocos/scripting/dop/ArrayPool.h
    cocos/scripting/dop/ArrayPool.cpp
)

######## auto
cocos_source_files(
    cocos/scripting/js-bindings/auto/jsb_cocos2dx_auto.cpp
    cocos/scripting/js-bindings/auto/jsb_cocos2dx_auto.h
    cocos/scripting/js-bindings/auto/jsb_cocos2dx_extension_auto.cpp
    cocos/scripting/js-bindings/auto/jsb_cocos2dx_extension_auto.h
    cocos/scripting/js-bindings/auto/jsb_gfx_auto.cpp
    cocos/scripting/js-bindings/auto/jsb_gfx_auto.h
    cocos/scripting/js-bindings/auto/jsb_cocos2dx_network_auto.cpp
    cocos/scripting/js-bindings/auto/jsb_cocos2dx_network_auto.h
    cocos/scripting/js-bindings/auto/jsb_pipeline_auto.cpp
    cocos/scripting/js-bindings/auto/jsb_pipeline_auto.h
)

if(USE_AUDIO)
    cocos_source_files(
        cocos/scripting/js-bindings/auto/jsb_cocos2dx_audioengine_auto.cpp
        cocos/scripting/js-bindings/auto/jsb_cocos2dx_audioengine_auto.h
    )
endif()

if(USE_VIDEOPLAYER)
    cocos_source_files(
        cocos/scripting/js-bindings/auto/jsb_video_auto.cpp
        cocos/scripting/js-bindings/auto/jsb_video_auto.h
    )
endif()

######## manual
cocos_source_files(
    cocos/scripting/js-bindings/manual/jsb_classtype.cpp
    cocos/scripting/js-bindings/manual/jsb_classtype.h
    #cocos/scripting/js-bindings/manual/jsb_cocos2dx_extension_manual.cpp
    #cocos/scripting/js-bindings/manual/jsb_cocos2dx_extension_manual.h
    cocos/scripting/js-bindings/manual/jsb_cocos2dx_manual.cpp
    cocos/scripting/js-bindings/manual/jsb_cocos2dx_manual.h
    cocos/scripting/js-bindings/manual/jsb_conversions.cpp
    cocos/scripting/js-bindings/manual/jsb_conversions.h
    cocos/scripting/js-bindings/manual/jsb_gfx_manual.cpp
    cocos/scripting/js-bindings/manual/jsb_gfx_manual.h
    cocos/scripting/js-bindings/manual/jsb_global.cpp
    cocos/scripting/js-bindings/manual/jsb_global.h
    cocos/scripting/js-bindings/manual/jsb_helper.cpp
    cocos/scripting/js-bindings/manual/jsb_helper.h
    # cocos/scripting/js-bindings/manual/jsb_module_register.cpp
    cocos/scripting/js-bindings/manual/jsb_module_register.h
    cocos/scripting/js-bindings/manual/jsb_platform.h
    cocos/scripting/js-bindings/manual/jsb_cocos2dx_network_manual.cpp
    cocos/scripting/js-bindings/manual/jsb_cocos2dx_network_manual.h
    cocos/scripting/js-bindings/manual/jsb_xmlhttprequest.cpp
    cocos/scripting/js-bindings/manual/jsb_xmlhttprequest.h
)

if(USE_SOCKET)
    cocos_source_files(
        cocos/scripting/js-bindings/manual/jsb_socketio.cpp
        cocos/scripting/js-bindings/manual/jsb_socketio.h
        cocos/scripting/js-bindings/manual/jsb_websocket.cpp
        cocos/scripting/js-bindings/manual/jsb_websocket.h
    )
endif()


if(ANDROID)
    cocos_source_files(
        cocos/scripting/js-bindings/manual/jsb_platform_android.cpp
        cocos/scripting/js-bindings/manual/JavaScriptJavaBridge.cpp
        cocos/scripting/js-bindings/manual/JavaScriptJavaBridge.h
    )
elseif(APPLE)
    cocos_source_files(
        cocos/scripting/js-bindings/manual/jsb_platfrom_apple.mm
        cocos/scripting/js-bindings/manual/JavaScriptObjCBridge.h
        cocos/scripting/js-bindings/manual/JavaScriptObjCBridge.mm
    )
elseif(WIN32)
    cocos_source_files(
        cocos/scripting/js-bindings/manual/jsb_platfrom_win32.cpp
    )
endif()

if(CC_USE_GLES2)
    cocos_source_files(
        cocos/scripting/js-bindings/auto/jsb_gles2_auto.h
        cocos/scripting/js-bindings/auto/jsb_gles2_auto.cpp
    )
endif()

if(CC_USE_GLES3)
    cocos_source_files(
        cocos/scripting/js-bindings/auto/jsb_gles3_auto.h
        cocos/scripting/js-bindings/auto/jsb_gles3_auto.cpp
    )
endif()

if(CC_USE_METAL)
    cocos_source_files(
        cocos/scripting/js-bindings/auto/jsb_mtl_auto.h
        cocos/scripting/js-bindings/auto/jsb_mtl_auto.cpp
    )
endif()

if(CC_USE_VULKAN)
    cocos_source_files(
        cocos/scripting/js-bindings/auto/jsb_vk_auto.h
        cocos/scripting/js-bindings/auto/jsb_vk_auto.cpp
    )
endif()

if(USE_SE_V8)
    cocos_source_files(
        cocos/scripting/js-bindings/jswrapper/v8/Base.h
        cocos/scripting/js-bindings/jswrapper/v8/Class.cpp
        cocos/scripting/js-bindings/jswrapper/v8/Class.h
        cocos/scripting/js-bindings/jswrapper/v8/HelperMacros.h
        cocos/scripting/js-bindings/jswrapper/v8/Object.cpp
        cocos/scripting/js-bindings/jswrapper/v8/Object.h
        cocos/scripting/js-bindings/jswrapper/v8/ObjectWrap.cpp
        cocos/scripting/js-bindings/jswrapper/v8/ObjectWrap.h
        cocos/scripting/js-bindings/jswrapper/v8/ScriptEngine.cpp
        cocos/scripting/js-bindings/jswrapper/v8/ScriptEngine.h
        cocos/scripting/js-bindings/jswrapper/v8/SeApi.h
        cocos/scripting/js-bindings/jswrapper/v8/Utils.cpp
        cocos/scripting/js-bindings/jswrapper/v8/Utils.h
    )
    if(USE_V8_DEBUGGER)
    cocos_source_files(
        cocos/scripting/js-bindings/jswrapper/v8/debugger/base64.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/env.cpp
        cocos/scripting/js-bindings/jswrapper/v8/debugger/env.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/http_parser.c
        cocos/scripting/js-bindings/jswrapper/v8/debugger/http_parser.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/inspector_agent.cpp
        cocos/scripting/js-bindings/jswrapper/v8/debugger/inspector_agent.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/inspector_io.cpp
        cocos/scripting/js-bindings/jswrapper/v8/debugger/inspector_io.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/inspector_socket.cpp
        cocos/scripting/js-bindings/jswrapper/v8/debugger/inspector_socket.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/inspector_socket_server.cpp
        cocos/scripting/js-bindings/jswrapper/v8/debugger/inspector_socket_server.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/node.cpp
        cocos/scripting/js-bindings/jswrapper/v8/debugger/node.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/node_debug_options.cpp
        cocos/scripting/js-bindings/jswrapper/v8/debugger/node_debug_options.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/node_mutex.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/SHA1.cpp
        cocos/scripting/js-bindings/jswrapper/v8/debugger/SHA1.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/util-inl.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/util.cpp
        cocos/scripting/js-bindings/jswrapper/v8/debugger/util.h
        cocos/scripting/js-bindings/jswrapper/v8/debugger/v8_inspector_protocol_json.h
    )
    endif()
endif()

if(USE_SE_JSC)
    cocos_source_files(
        cocos/scripting/js-bindings/jswrapper/jsc/Class.h
        cocos/scripting/js-bindings/jswrapper/jsc/EJConvert.h
        cocos/scripting/js-bindings/jswrapper/jsc/HelperMacros.h
        cocos/scripting/js-bindings/jswrapper/jsc/Utils.cpp
        cocos/scripting/js-bindings/jswrapper/jsc/EJConvertTypedArray.h
        cocos/scripting/js-bindings/jswrapper/jsc/PlatformUtils.h
        cocos/scripting/js-bindings/jswrapper/jsc/EJConvertTypedArray.m
        cocos/scripting/js-bindings/jswrapper/jsc/EJConvert.m
        cocos/scripting/js-bindings/jswrapper/jsc/Object.h
        cocos/scripting/js-bindings/jswrapper/jsc/Object.mm
        cocos/scripting/js-bindings/jswrapper/jsc/ScriptEngine.h
        cocos/scripting/js-bindings/jswrapper/jsc/ScriptEngine.mm
        cocos/scripting/js-bindings/jswrapper/jsc/PlatformUtils.mm
        cocos/scripting/js-bindings/jswrapper/jsc/SeApi.h
        cocos/scripting/js-bindings/jswrapper/jsc/Class.cpp
        cocos/scripting/js-bindings/jswrapper/jsc/Utils.h
        cocos/scripting/js-bindings/jswrapper/jsc/Base.h
    )
endif()

cocos_source_files(
    cocos/scripting/js-bindings/jswrapper/config.cpp
    cocos/scripting/js-bindings/jswrapper/config.h
    cocos/scripting/js-bindings/jswrapper/HandleObject.cpp
    cocos/scripting/js-bindings/jswrapper/HandleObject.h
    cocos/scripting/js-bindings/jswrapper/MappingUtils.cpp
    cocos/scripting/js-bindings/jswrapper/MappingUtils.h
    cocos/scripting/js-bindings/jswrapper/Object.h
    cocos/scripting/js-bindings/jswrapper/RefCounter.cpp
    cocos/scripting/js-bindings/jswrapper/RefCounter.h
    cocos/scripting/js-bindings/jswrapper/SeApi.h
    cocos/scripting/js-bindings/jswrapper/State.cpp
    cocos/scripting/js-bindings/jswrapper/State.h
    cocos/scripting/js-bindings/jswrapper/Value.cpp
    cocos/scripting/js-bindings/jswrapper/Value.h
)

cocos_source_files(
    cocos/scripting/js-bindings/event/CustomEventTypes.h
    cocos/scripting/js-bindings/event/EventDispatcher.cpp
    cocos/scripting/js-bindings/event/EventDispatcher.h
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
    if(USE_VIDEOPLAYER)
        cocos_source_files(
            cocos/ui/videoplayer/VideoPlayer.h
        )
    endif()
endif()

if(ANDROID)
    if(USE_EDIT_BOX)
        cocos_source_files(
            cocos/ui/edit-box/EditBox-android.cpp
        )
    endif()
    if(USE_VIDEOPLAYER)
        cocos_source_files(
            cocos/ui/videoplayer/VideoPlayer-android.cpp
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
    if(USE_VIDEOPLAYER)
        cocos_source_files(
            cocos/ui/videoplayer/VideoPlayer-ios.mm
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

# setup default flags
target_compile_definitions(cocos2d PUBLIC
    $<$<NOT:$<BOOL:${USE_VIDEO}>>:USE_VIDEO=0>
    $<$<NOT:$<BOOL:${USE_AUDIO}>>:USE_AUDIO=0>
    $<$<NOT:$<BOOL:${USE_SOCKET}>>:USE_SOCKET=0>
    $<$<NOT:$<BOOL:${USE_EDIT_BOX}>>:CC_USE_EDITBOX=0>
    $<$<NOT:$<BOOL:${USE_V8_DEBUGGER}>>:USE_V8_DEBUGGER=0>
    $<$<BOOL:${USE_SE_JSC}>:SCRIPT_ENGINE_TYPE=3>
    $<$<CONFIG:Debug>:CC_DEBUG=1>
)

if(CC_USE_VULKAN)

    target_compile_definitions(cocos2d PUBLIC VK_NO_PROTOTYPES)

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

elseif(CC_USE_METAL)
    target_compile_definitions(cocos2d PUBLIC USE_METAL)
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
        $<$<BOOL:USE_SE_JSC>:${CWD}/cocos/scripting/js-bindings/jswrapper>
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
    find_library(ICONV_LIBRARY iconv)
    find_library(AUDIOTOOLBOX_LIBRARY AudioToolBox)
    find_library(FOUNDATION_LIBRARY Foundation)
    find_library(OPENAL_LIBRARY OpenAL)
    find_library(GAMECONTROLLER_LIBRARY GameController)
    find_library(METAL_LIBRARY Metal)
    find_library(METALLIT_LIBRARY MetalKit)
    find_library(SQLITE3_LIBRARY SQLite3)
    find_library(SECURITY_LIBRARY Security)
    find_library(SystemConfiguration_LIBRARY SystemConfiguration)
    target_link_libraries(cocos2d PUBLIC
        ${ICONV_LIBRARY}
        ${AUDIOTOOLBOX_LIBRARY}
        ${FOUNDATION_LIBRARY}
        ${OPENAL_LIBRARY}
        ${GAMECONTROLLER_LIBRARY}
        ${METAL_LIBRARY}
        ${METALLIT_LIBRARY}
        ${SQLITE3_LIBRARY}
        ${SECURITY_LIBRARY}
        ${SystemConfiguration_LIBRARY}
        ${CC_EXTERNAL_LIBS}
    )
    if(MACOSX)
        find_library(OPENGL_LIBRARY OpenGL)
        find_library(APPKIT_LIBRARY AppKit)
        target_link_libraries(cocos2d PUBLIC
            ${OPENGL_LIBRARY}
            ${APPKIT_LIBRARY}
        )
        target_compile_definitions(cocos2d PUBLIC
            CC_KEYBOARD_SUPPORT
            )
    elseif(IOS)
        find_library(QUARTZCORE_LIBRARY QuartzCore)
        find_library(UIKIT_LIBRARY UIKit)
        find_library(CORE_MOTION_LIBRARY CoreMotion)
        find_library(CFNETWORK_LIBRARY CFNetwork)
        find_library(CORE_MEDIA_LIBRARY CoreMedia)
        find_library(CORE_TEXT_LIBRARY CoreText)
        find_library(CORE_GRAPHICS_LIBRARY CoreGraphics)
        find_library(AV_FOUNDATION_LIBRARY AVFoundation)
        find_library(ZLIB_LIBRARY z)
        find_library(OPENGLES_LIBRARY OpenGLES)
        find_library(JAVASCRIPTCORE_LIBRARY JavaScriptCore)
        target_link_libraries(cocos2d PUBLIC
            ${QUARTZCORE_LIBRARY}
            ${UIKIT_LIBRARY}
            ${CFNETWORK_LIBRARY}
            ${ZLIB_LIBRARY}
            ${CORE_GRAPHICS_LIBRARY}
            ${AV_FOUNDATION_LIBRARY}
            ${CORE_TEXT_LIBRARY}
            ${CORE_MOTION_LIBRARY}
            ${OPENGLES_LIBRARY}
            ${JAVASCRIPTCORE_LIBRARY}
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

if(COMMAND target_precompile_headers)
    target_precompile_headers(cocos2d PUBLIC
        $<$<COMPILE_LANGUAGE:CXX>:${CWD}/cocos/cocos2d.h>
    )
endif()
