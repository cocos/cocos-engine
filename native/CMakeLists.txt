

include(${CMAKE_CURRENT_LIST_DIR}/cmake/predefine.cmake)

################################# engine source code ##################################
set(CWD ${CMAKE_CURRENT_LIST_DIR})
set(COCOS2D_SOURCE_LIST)

# Should be enable someday in the future
# set(CMAKE_CXX_FLAGS "${WERROR_FLAGS}")

################################# options ############################################
# default fallback options
cc_set_if_undefined(USE_SE_V8                ON)
cc_set_if_undefined(USE_V8_DEBUGGER          ON)
cc_set_if_undefined(USE_SOCKET               ON)
cc_set_if_undefined(USE_AUDIO                ON)
cc_set_if_undefined(USE_EDIT_BOX             ON)
cc_set_if_undefined(USE_SE_JSC               OFF)
cc_set_if_undefined(USE_VIDEO                ON)
cc_set_if_undefined(USE_WEBVIEW              ON)
cc_set_if_undefined(USE_MIDDLEWARE           ON)
cc_set_if_undefined(USE_DRAGONBONES          ON)
cc_set_if_undefined(USE_SPINE                ON)
cc_set_if_undefined(USE_WEBSOCKET_SERVER     OFF)
cc_set_if_undefined(USE_JOB_SYSTEM_TASKFLOW  OFF)
cc_set_if_undefined(USE_JOB_SYSTEM_TBB       OFF)
cc_set_if_undefined(USE_PHYSICS_PHYSX        OFF)
cc_set_if_undefined(USE_MODULES              OFF)


if(ANDROID OR WINDOWS)
    cc_set_if_undefined(CC_USE_GLES3 ON)
    cc_set_if_undefined(CC_USE_VULKAN OFF)
    cc_set_if_undefined(CC_USE_GLES2 OFF)
    cc_set_if_undefined(CC_USE_METAL OFF)
elseif(MACOSX OR IOS)
    cc_set_if_undefined(CC_USE_METAL ON)
    cc_set_if_undefined(CC_USE_VULKAN OFF)
    cc_set_if_undefined(CC_USE_GLES3 OFF)
    cc_set_if_undefined(CC_USE_GLES2 OFF)
elseif(OHOS)
    cc_set_if_undefined(CC_USE_METAL OFF)
    cc_set_if_undefined(CC_USE_VULKAN OFF)
    cc_set_if_undefined(CC_USE_GLES3 ON)
    cc_set_if_undefined(CC_USE_GLES2 OFF)
endif()

if(USE_PHYSICS_PHYSX)
    if (ANDROID AND CMAKE_ANDROID_ARCH_ABI MATCHES x86)
        set(USE_PHYSICS_PHYSX OFF)
        message(AUTHOR_WARNING "Native PhysX does not support Google Android X86")
    elseif(MACOSX AND CMAKE_OSX_ARCHITECTURES MATCHES arm64)
        set(USE_PHYSICS_PHYSX OFF)
        message(AUTHOR_WARNING "Currently Native PhysX not support MacOS arm64")
    endif()
endif()

if(USE_SE_JSC)
    set(USE_SE_V8 OFF)
    set(USE_V8_DEBUGGER OFF)
endif()

if(NOT USE_SOCKET)
    set(USE_WEBSOCKET_SERVER OFF)
endif()

if(OHOS)
    set(CC_USE_GLES2 OFF)
endif()

## disable videoplay on non-mobile platforms
if(NOT ANDROID AND NOT IOS AND NOT OHOS)
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

if(USE_JOB_SYSTEM_TASKFLOW AND USE_JOB_SYSTEM_TBB)
    set(USE_JOB_SYSTEM_TASKFLOW ON)
    set(USE_JOB_SYSTEM_TBB      OFF)
endif()

# if(USE_JOB_SYSTEM_TASKFLOW)
#     set(CMAKE_CXX_STANDARD 17)
#     set(TARGET_IOS_VERSION "12.0"  CACHE STRING "Target iOS version" FORCE)
# endif()

################################# list all option values ##############################

cc_inspect_values(
    USE_MODULES
    CC_USE_METAL
    CC_USE_GLES3
    CC_USE_GLES2
    CC_USE_VULKAN
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
    USE_PHYSICS_PHYSX
    USE_JOB_SYSTEM_TBB
    USE_JOB_SYSTEM_TASKFLOW
)

################################# external source code ################################


if(NOT EXISTS ${CMAKE_CURRENT_LIST_DIR}/external/CMakeLists.txt)
    message(FATAL_ERROR "Please download external libraries! File ${CMAKE_CURRENT_LIST_DIR}/external/CMakeLists.txt not exists!")
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
            cocos/audio/oalsoft/AudioCache.cpp
            cocos/audio/oalsoft/AudioCache.h
            cocos/audio/oalsoft/AudioDecoder.cpp
            cocos/audio/oalsoft/AudioDecoder.h
            cocos/audio/oalsoft/AudioDecoderManager.cpp
            cocos/audio/oalsoft/AudioDecoderManager.h
            cocos/audio/oalsoft/AudioDecoderMp3.cpp
            cocos/audio/oalsoft/AudioDecoderMp3.h
            cocos/audio/oalsoft/AudioDecoderOgg.cpp
            cocos/audio/oalsoft/AudioDecoderOgg.h
            cocos/audio/oalsoft/AudioEngine-soft.cpp
            cocos/audio/oalsoft/AudioEngine-soft.h
            cocos/audio/oalsoft/AudioMacros.h
            cocos/audio/oalsoft/AudioPlayer.cpp
            cocos/audio/oalsoft/AudioPlayer.h
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
     elseif(OHOS)
        cocos_source_files(
            cocos/audio/oalsoft/AudioCache.cpp
            cocos/audio/oalsoft/AudioCache.h
            cocos/audio/oalsoft/AudioDecoderManager.cpp
            cocos/audio/oalsoft/AudioDecoderManager.h
            cocos/audio/oalsoft/AudioDecoder.cpp
            cocos/audio/oalsoft/AudioDecoder.h
            cocos/audio/oalsoft/AudioDecoderMp3.cpp
            cocos/audio/oalsoft/AudioDecoderMp3.h
            cocos/audio/oalsoft/AudioDecoderOgg.cpp
            cocos/audio/oalsoft/AudioDecoderOgg.h
            cocos/audio/oalsoft/AudioEngine-soft.cpp
            cocos/audio/oalsoft/AudioEngine-soft.h
            cocos/audio/oalsoft/AudioMacros.h
            cocos/audio/oalsoft/AudioPlayer.cpp
            cocos/audio/oalsoft/AudioPlayer.h

            cocos/audio/ohos/AudioDecoderWav.h
            cocos/audio/ohos/AudioDecoderWav.cpp
            # cocos/audio/ohos/AudioDecoderMp3.h
            # cocos/audio/ohos/AudioDecoderMp3.cpp
            cocos/audio/ohos/FsCallback.h
            cocos/audio/ohos/FsCallback.cpp

            cocos/audio/android/tinysndfile.cpp
            cocos/audio/android/tinysndfile.h
            cocos/audio/android/audio_utils/primitives.c
        )
    elseif(APPLE)
        cocos_source_files(
                         cocos/audio/apple/AudioDecoder.h
                         cocos/audio/apple/AudioPlayer.mm
                         cocos/audio/apple/AudioDecoder.mm
                         cocos/audio/apple/AudioPlayer.h
            NO_WERROR    cocos/audio/apple/AudioEngine-inl.mm
                         cocos/audio/apple/AudioMacros.h
                         cocos/audio/apple/AudioCache.mm
                         cocos/audio/apple/AudioCache.h
                         cocos/audio/apple/AudioEngine-inl.h
        )
    endif()

endif()

##### base
cocos_source_files(
    cocos/base/Agent.h
    cocos/base/astc.cpp
    cocos/base/astc.h
    cocos/base/AutoreleasePool.cpp
    cocos/base/AutoreleasePool.h
    cocos/base/base64.cpp
    cocos/base/base64.h
    cocos/base/CachedArray.h
    cocos/base/Config.h
    cocos/base/CoreStd.h
    cocos/base/csscolorparser.cpp
    cocos/base/csscolorparser.h
    cocos/base/etc1.cpp
    cocos/base/etc1.h
    cocos/base/etc2.cpp
    cocos/base/etc2.h
    cocos/base/IndexHandle.h
    cocos/base/Locked.h
    cocos/base/Macros.h
    cocos/base/Map.h
    cocos/base/Object.h
    cocos/base/Random.h
    cocos/base/Ref.cpp
    cocos/base/Ref.h
    cocos/base/Scheduler.cpp
    cocos/base/Scheduler.h
    cocos/base/StringHandle.cpp
    cocos/base/StringHandle.h
    cocos/base/StringPool.h
    cocos/base/StringUtil.cpp
    cocos/base/StringUtil.h
    cocos/base/ThreadPool.cpp
    cocos/base/ThreadPool.h
    cocos/base/TypeDef.h
    cocos/base/Vector.h
)

############ module log
cocos_source_files(MODULE cclog
    cocos/base/Log.cpp
    cocos/base/Log.h
)

############ module log
cocos_source_files(MODULE ccunzip
    cocos/base/ZipUtils.cpp
    cocos/base/ZipUtils.h
)

##### memory
cocos_source_files(
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
)

##### threading
cocos_source_files(
                 cocos/base/threading/ConditionVariable.h
                 cocos/base/threading/ConditionVariable.cpp
                 cocos/base/threading/Event.h
                 cocos/base/threading/MessageQueue.h
                 cocos/base/threading/MessageQueue.cpp
                 cocos/base/threading/Semaphore.h
                 cocos/base/threading/Semaphore.cpp
                 cocos/base/threading/ThreadPool.h
                 cocos/base/threading/ThreadPool.cpp
                 cocos/base/threading/ThreadSafeCounter.h
                 cocos/base/threading/ThreadSafeLinearAllocator.h
                 cocos/base/threading/ThreadSafeLinearAllocator.cpp
)
if(APPLE)
cocos_source_files(
                 cocos/base/threading/AutoReleasePool.h
                 cocos/base/threading/AutoReleasePool-apple.mm
)
else()
cocos_source_files(
                 cocos/base/threading/AutoReleasePool.h
                 cocos/base/threading/AutoReleasePool.cpp
)
endif()

##### job system
cocos_source_files(
    cocos/base/job-system/JobSystem.h
)

if(USE_JOB_SYSTEM_TASKFLOW)
    cocos_source_files(
        cocos/base/job-system/job-system-taskflow/TFJobGraph.h
        cocos/base/job-system/job-system-taskflow/TFJobGraph.cpp
        cocos/base/job-system/job-system-taskflow/TFJobSystem.h
        cocos/base/job-system/job-system-taskflow/TFJobSystem.cpp
    )
elseif(USE_JOB_SYSTEM_TBB)
    cocos_source_files(
        cocos/base/job-system/job-system-tbb/TBBJobGraph.h
        cocos/base/job-system/job-system-tbb/TBBJobGraph.cpp
        cocos/base/job-system/job-system-tbb/TBBJobSystem.h
        cocos/base/job-system/job-system-tbb/TBBJobSystem.cpp
    )
else() 
    cocos_source_files(
        cocos/base/job-system/job-system-dummy/DummyJobGraph.h
        cocos/base/job-system/job-system-dummy/DummyJobGraph.cpp
        cocos/base/job-system/job-system-dummy/DummyJobSystem.h
        cocos/base/job-system/job-system-dummy/DummyJobSystem.cpp
    )
endif()

######### module math
cocos_source_files(MODULE ccmath
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
        NO_WERROR    cocos/network/SocketIO.cpp
                     cocos/network/SocketIO.h
    )
endif()

if(NOT IOS AND USE_WEBSOCKET_SERVER)
    cocos_source_files(
                     cocos/network/WebSocketServer.h
        NO_WERROR    cocos/network/WebSocketServer.cpp
    )
endif()

if(APPLE)
    cocos_source_files(
                     cocos/network/DownloaderImpl-apple.h
                     cocos/network/DownloaderImpl-apple.mm
                     cocos/network/HttpAsynConnection-apple.h
        NO_WERROR    cocos/network/HttpAsynConnection-apple.m
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

if(ANDROID OR OHOS)
    cocos_source_files(
        cocos/network/Downloader-java.cpp
        cocos/network/Downloader-java.h
        cocos/network/HttpClient-java.cpp
    )
endif()

if(NOT APPLE AND USE_SOCKET)
    cocos_source_files(
        NO_WERROR    cocos/network/WebSocket-libwebsockets.cpp
    )
endif()

if(WINDOWS)
    cocos_source_files(
        NO_WERROR    cocos/network/Downloader-curl.cpp
                     cocos/network/Downloader-curl.h
    )
endif()

if(WINDOWS OR MACOSX)
    cocos_source_files(
        NO_WERROR    cocos/network/HttpClient.cpp
    )
endif()


##### platform
cocos_source_files(
    cocos/platform/Application.h
    cocos/platform/Application.cpp
    cocos/platform/CanvasRenderingContext2D.h
    cocos/platform/Device.h
    cocos/platform/Image.cpp
    cocos/platform/Image.h
    cocos/platform/StdC.h
)

########## module utils
cocos_source_files(MODULE ccutils
    cocos/base/Data.cpp
    cocos/base/Data.h
    cocos/base/Value.cpp
    cocos/base/Value.h
    cocos/base/UTF8.cpp
    cocos/base/UTF8.h
    cocos/platform/SAXParser.cpp
    cocos/platform/SAXParser.h
    cocos/base/Utils.cpp
    cocos/base/Utils.h
)

########## module ccfilesystem
cocos_source_files(MODULE ccfilesystem
    cocos/platform/FileUtils.cpp
    cocos/platform/FileUtils.h
)

if(WINDOWS)
    cocos_source_files(MODULE ccutils
        cocos/platform/win32/Utils-win32.cpp
        cocos/platform/win32/Utils-win32.h
    )
endif()

if(WINDOWS)
    cocos_source_files(
        NO_WERROR    cocos/platform/win32/Application-win32.cpp
        NO_WERROR    cocos/platform/win32/CanvasRenderingContext2D-win32.cpp
                     cocos/platform/win32/Device-win32.cpp
                     cocos/platform/win32/View-win32.cpp
                     cocos/platform/win32/View-win32.h
                     cocos/platform/win32/compat
                     cocos/platform/win32/compat/stdint.h
                     cocos/platform/win32/inet_pton_mingw.cpp
                     cocos/platform/win32/inet_pton_mingw.h
    )
    cocos_source_files(MODULE ccfilesystem
        cocos/platform/win32/FileUtils-win32.cpp
        cocos/platform/win32/FileUtils-win32.h
    )
elseif(ANDROID)
    cocos_source_files(
        cocos/platform/android/Application-android.cpp
        cocos/platform/java/CanvasRenderingContext2D-java.cpp
        cocos/platform/android/Device-android.cpp
        cocos/platform/android/View.cpp
        cocos/platform/android/View.h
    )
    set(CC_JNI_SRC_FILES
        ${CWD}/cocos/platform/android/jni/JniCocosActivity.cpp
        ${CWD}/cocos/platform/android/jni/JniCocosActivity.h
        ${CWD}/cocos/platform/java/jni/JniCocosTouchHandler.cpp
        ${CWD}/cocos/platform/java/jni/JniCocosKeyCodeHandler.cpp
        ${CWD}/cocos/platform/android/jni/JniCocosSurfaceView.cpp
        ${CWD}/cocos/platform/java/jni/JniCocosOrientationHelper.cpp
        ${CWD}/cocos/platform/java/jni/JniHelper.cpp
        ${CWD}/cocos/platform/java/jni/JniHelper.h
        ${CWD}/cocos/platform/java/jni/JniImp.cpp
        ${CWD}/cocos/platform/java/jni/JniImp.h
    )
    
    cocos_source_files(MODULE ccfilesystem
        cocos/platform/android/FileUtils-android.cpp
        cocos/platform/android/FileUtils-android.h
    )
elseif(OHOS)
    cocos_source_files(
        cocos/platform/ohos/Application-ohos.cpp
        cocos/platform/java/CanvasRenderingContext2D-java.cpp
        cocos/platform/ohos/Device-ohos.cpp
        cocos/platform/ohos/View.cpp
        cocos/platform/ohos/View.h
    )
    set(CC_JNI_SRC_FILES
        ${CWD}/cocos/platform/ohos/jni/JniCocosAbility.cpp
        ${CWD}/cocos/platform/ohos/jni/JniCocosAbility.h
        ${CWD}/cocos/platform/java/jni/JniHelper.cpp
        ${CWD}/cocos/platform/java/jni/JniHelper.h
        ${CWD}/cocos/platform/java/jni/JniImp.cpp
        ${CWD}/cocos/platform/java/jni/JniImp.h
        ${CWD}/cocos/platform/java/jni/JniCocosTouchHandler.cpp
        ${CWD}/cocos/platform/java/jni/JniCocosKeyCodeHandler.cpp
        ${CWD}/cocos/platform/java/jni/JniCocosOrientationHelper.cpp
        ${CWD}/cocos/platform/ohos/jni/AbilityConsts.h
    )
    cocos_source_files(MODULE ccfilesystem
        cocos/platform/ohos/FileUtils-ohos.cpp
        cocos/platform/ohos/FileUtils-ohos.h
    )
elseif(APPLE)
    cocos_source_files(
                     cocos/platform/apple/Device-apple.mm
                     cocos/platform/apple/CanvasRenderingContext2D-apple.mm
                     cocos/platform/apple/Device-apple.h
    )
    # bad structure
    cocos_source_files(
                     cocos/platform/ios/Reachability.h
                     cocos/platform/ios/Reachability.cpp
    )
    
    cocos_source_files(MODULE ccfilesystem
        cocos/platform/apple/FileUtils-apple.h
        cocos/platform/apple/FileUtils-apple.mm
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
            NO_WERROR    cocos/platform/ios/View.mm     # CAMetalLayer bug for apple
                         cocos/platform/ios/Application-ios.mm
                         cocos/platform/ios/Device-ios.mm
        )
    endif()
endif()

##### renderer
cocos_source_files(
                 cocos/renderer/GFXDeviceManager.h

                 cocos/renderer/gfx-base/GFXObject.h
                 cocos/renderer/gfx-base/GFXObject.cpp
                 cocos/renderer/gfx-base/GFXBase.h
                 cocos/renderer/gfx-base/GFXBuffer.cpp
                 cocos/renderer/gfx-base/GFXBuffer.h
                 cocos/renderer/gfx-base/GFXCommandBuffer.cpp
                 cocos/renderer/gfx-base/GFXCommandBuffer.h
                 cocos/renderer/gfx-base/GFXContext.cpp
                 cocos/renderer/gfx-base/GFXContext.h
                 cocos/renderer/gfx-base/GFXDef.cpp
                 cocos/renderer/gfx-base/GFXDef.h
                 cocos/renderer/gfx-base/GFXDef-common.h
                 cocos/renderer/gfx-base/GFXDevice.cpp
                 cocos/renderer/gfx-base/GFXDevice.h
                 cocos/renderer/gfx-base/GFXFramebuffer.cpp
                 cocos/renderer/gfx-base/GFXFramebuffer.h
                 cocos/renderer/gfx-base/GFXGlobalBarrier.cpp
                 cocos/renderer/gfx-base/GFXGlobalBarrier.h
                 cocos/renderer/gfx-base/GFXInputAssembler.cpp
                 cocos/renderer/gfx-base/GFXInputAssembler.h
                 cocos/renderer/gfx-base/GFXDescriptorSet.cpp
                 cocos/renderer/gfx-base/GFXDescriptorSet.h
                 cocos/renderer/gfx-base/GFXDescriptorSetLayout.cpp
                 cocos/renderer/gfx-base/GFXDescriptorSetLayout.h
                 cocos/renderer/gfx-base/GFXPipelineLayout.cpp
                 cocos/renderer/gfx-base/GFXPipelineLayout.h
                 cocos/renderer/gfx-base/GFXPipelineState.cpp
                 cocos/renderer/gfx-base/GFXPipelineState.h
                 cocos/renderer/gfx-base/GFXQueue.cpp
                 cocos/renderer/gfx-base/GFXQueue.h
                 cocos/renderer/gfx-base/GFXRenderPass.cpp
                 cocos/renderer/gfx-base/GFXRenderPass.h
                 cocos/renderer/gfx-base/GFXSampler.cpp
                 cocos/renderer/gfx-base/GFXSampler.h
                 cocos/renderer/gfx-base/GFXShader.cpp
                 cocos/renderer/gfx-base/GFXShader.h
                 cocos/renderer/gfx-base/GFXTexture.cpp
                 cocos/renderer/gfx-base/GFXTexture.h
                 cocos/renderer/gfx-base/GFXTextureBarrier.cpp
                 cocos/renderer/gfx-base/GFXTextureBarrier.h

                 cocos/renderer/gfx-agent/BufferAgent.h
                 cocos/renderer/gfx-agent/BufferAgent.cpp
                 cocos/renderer/gfx-agent/CommandBufferAgent.h
                 cocos/renderer/gfx-agent/CommandBufferAgent.cpp
                 cocos/renderer/gfx-agent/DescriptorSetAgent.h
                 cocos/renderer/gfx-agent/DescriptorSetAgent.cpp
                 cocos/renderer/gfx-agent/DescriptorSetLayoutAgent.h
                 cocos/renderer/gfx-agent/DescriptorSetLayoutAgent.cpp
                 cocos/renderer/gfx-agent/DeviceAgent.h
                 cocos/renderer/gfx-agent/DeviceAgent.cpp
                 cocos/renderer/gfx-agent/FramebufferAgent.h
                 cocos/renderer/gfx-agent/FramebufferAgent.cpp
                 cocos/renderer/gfx-agent/InputAssemblerAgent.h
                 cocos/renderer/gfx-agent/InputAssemblerAgent.cpp
                 cocos/renderer/gfx-agent/PipelineLayoutAgent.h
                 cocos/renderer/gfx-agent/PipelineLayoutAgent.cpp
                 cocos/renderer/gfx-agent/PipelineStateAgent.h
                 cocos/renderer/gfx-agent/PipelineStateAgent.cpp
                 cocos/renderer/gfx-agent/QueueAgent.h
                 cocos/renderer/gfx-agent/QueueAgent.cpp
                 cocos/renderer/gfx-agent/RenderPassAgent.h
                 cocos/renderer/gfx-agent/RenderPassAgent.cpp
                 cocos/renderer/gfx-agent/SamplerAgent.h
                 cocos/renderer/gfx-agent/SamplerAgent.cpp
                 cocos/renderer/gfx-agent/ShaderAgent.h
                 cocos/renderer/gfx-agent/ShaderAgent.cpp
                 cocos/renderer/gfx-agent/TextureAgent.h
                 cocos/renderer/gfx-agent/TextureAgent.cpp

                 cocos/renderer/gfx-validator/BufferValidator.h
                 cocos/renderer/gfx-validator/BufferValidator.cpp
                 cocos/renderer/gfx-validator/CommandBufferValidator.h
                 cocos/renderer/gfx-validator/CommandBufferValidator.cpp
                 cocos/renderer/gfx-validator/DescriptorSetValidator.h
                 cocos/renderer/gfx-validator/DescriptorSetValidator.cpp
                 cocos/renderer/gfx-validator/DescriptorSetLayoutValidator.h
                 cocos/renderer/gfx-validator/DescriptorSetLayoutValidator.cpp
                 cocos/renderer/gfx-validator/DeviceValidator.h
                 cocos/renderer/gfx-validator/DeviceValidator.cpp
                 cocos/renderer/gfx-validator/FramebufferValidator.h
                 cocos/renderer/gfx-validator/FramebufferValidator.cpp
                 cocos/renderer/gfx-validator/InputAssemblerValidator.h
                 cocos/renderer/gfx-validator/InputAssemblerValidator.cpp
                 cocos/renderer/gfx-validator/PipelineLayoutValidator.h
                 cocos/renderer/gfx-validator/PipelineLayoutValidator.cpp
                 cocos/renderer/gfx-validator/PipelineStateValidator.h
                 cocos/renderer/gfx-validator/PipelineStateValidator.cpp
                 cocos/renderer/gfx-validator/QueueValidator.h
                 cocos/renderer/gfx-validator/QueueValidator.cpp
                 cocos/renderer/gfx-validator/RenderPassValidator.h
                 cocos/renderer/gfx-validator/RenderPassValidator.cpp
                 cocos/renderer/gfx-validator/SamplerValidator.h
                 cocos/renderer/gfx-validator/SamplerValidator.cpp
                 cocos/renderer/gfx-validator/ShaderValidator.h
                 cocos/renderer/gfx-validator/ShaderValidator.cpp
                 cocos/renderer/gfx-validator/TextureValidator.h
                 cocos/renderer/gfx-validator/TextureValidator.cpp
                 cocos/renderer/gfx-validator/ValidationUtils.h
                 cocos/renderer/gfx-validator/ValidationUtils.cpp

                 cocos/renderer/gfx-empty/EmptyBuffer.h
                 cocos/renderer/gfx-empty/EmptyBuffer.cpp
                 cocos/renderer/gfx-empty/EmptyCommandBuffer.h
                 cocos/renderer/gfx-empty/EmptyCommandBuffer.cpp
                 cocos/renderer/gfx-empty/EmptyContext.h
                 cocos/renderer/gfx-empty/EmptyContext.cpp
                 cocos/renderer/gfx-empty/EmptyDescriptorSet.h
                 cocos/renderer/gfx-empty/EmptyDescriptorSet.cpp
                 cocos/renderer/gfx-empty/EmptyDescriptorSetLayout.h
                 cocos/renderer/gfx-empty/EmptyDescriptorSetLayout.cpp
                 cocos/renderer/gfx-empty/EmptyDevice.h
                 cocos/renderer/gfx-empty/EmptyDevice.cpp
                 cocos/renderer/gfx-empty/EmptyFramebuffer.h
                 cocos/renderer/gfx-empty/EmptyFramebuffer.cpp
                 cocos/renderer/gfx-empty/EmptyInputAssembler.h
                 cocos/renderer/gfx-empty/EmptyInputAssembler.cpp
                 cocos/renderer/gfx-empty/EmptyPipelineLayout.h
                 cocos/renderer/gfx-empty/EmptyPipelineLayout.cpp
                 cocos/renderer/gfx-empty/EmptyPipelineState.h
                 cocos/renderer/gfx-empty/EmptyPipelineState.cpp
                 cocos/renderer/gfx-empty/EmptyQueue.h
                 cocos/renderer/gfx-empty/EmptyQueue.cpp
                 cocos/renderer/gfx-empty/EmptyRenderPass.h
                 cocos/renderer/gfx-empty/EmptyRenderPass.cpp
                 cocos/renderer/gfx-empty/EmptySampler.h
                 cocos/renderer/gfx-empty/EmptySampler.cpp
                 cocos/renderer/gfx-empty/EmptyShader.h
                 cocos/renderer/gfx-empty/EmptyShader.cpp
                 cocos/renderer/gfx-empty/EmptyTexture.h
                 cocos/renderer/gfx-empty/EmptyTexture.cpp

                 cocos/renderer/pipeline/BatchedBuffer.cpp
                 cocos/renderer/pipeline/BatchedBuffer.h
                 cocos/renderer/pipeline/Define.h
                 cocos/renderer/pipeline/Define.cpp
                 cocos/renderer/pipeline/GlobalDescriptorSetManager.h
                 cocos/renderer/pipeline/GlobalDescriptorSetManager.cpp
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
                 cocos/renderer/pipeline/deferred/ReflectionComp.cpp
                 cocos/renderer/pipeline/deferred/ReflectionComp.h
                 cocos/renderer/pipeline/shadow/ShadowFlow.cpp
                 cocos/renderer/pipeline/shadow/ShadowFlow.h
                 cocos/renderer/pipeline/shadow/ShadowStage.cpp
                 cocos/renderer/pipeline/shadow/ShadowStage.h
                 cocos/renderer/pipeline/helper/DefineMap.h
                 cocos/renderer/pipeline/helper/DefineMap.cpp
)

##### scene
cocos_source_files(
                 cocos/scene/AABB.h
                 cocos/scene/AABB.cpp
                 cocos/scene/BakedSkinningModel.h
                 cocos/scene/BakedSkinningModel.cpp
                 cocos/scene/Camera.h
                 cocos/scene/Define.h
                 cocos/scene/Define.cpp
                 cocos/scene/DirectionalLight.h
                 cocos/scene/DirectionalLight.cpp
                 cocos/scene/DrawBatch2D.h
                 cocos/scene/Frustum.h
                 cocos/scene/Frustum.cpp
                 cocos/scene/Light.h
                 cocos/scene/Light.cpp
                 cocos/scene/Model.h
                 cocos/scene/Model.cpp
                 cocos/scene/MorphModel.h
                 cocos/scene/Node.h
                 cocos/scene/Node.cpp
                 cocos/scene/Pass.h
                 cocos/scene/Pass.cpp
                 cocos/scene/RenderScene.h
                 cocos/scene/RenderScene.cpp
                 cocos/scene/RenderWindow.h
                 cocos/scene/SkinningModel.h
                 cocos/scene/SkinningModel.cpp
                 cocos/scene/Sphere.h
                 cocos/scene/Sphere.cpp
                 cocos/scene/SphereLight.h
                 cocos/scene/SphereLight.cpp
                 cocos/scene/SpotLight.h
                 cocos/scene/SpotLight.cpp
                 cocos/scene/SubModel.h
                 cocos/scene/SubModel.cpp
)

if(CC_USE_GLES2 OR CC_USE_GLES3)
    cocos_source_files(
        cocos/renderer/gfx-gles-common/GLESCommandPool.h
        cocos/renderer/gfx-gles-common/eglw.cpp
        cocos/renderer/gfx-gles-common/gles2w.cpp
    )
    if(CC_USE_GLES3)
        cocos_source_files(
            cocos/renderer/gfx-gles-common/gles3w.cpp
        )
    endif()
endif()

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
                     cocos/renderer/gfx-gles2/GLES2Context.cpp
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
                     cocos/renderer/gfx-gles2/GLES2Wrangler.h
    )

    if(APPLE)
        cocos_source_files(
            NO_WERROR    cocos/renderer/gfx-gles2/GLES2Wrangler.mm
        )
    else()
        cocos_source_files(
                         cocos/renderer/gfx-gles2/GLES2Wrangler.cpp
        )
    endif()
    if(IOS)
        cocos_source_files(
            NO_WERROR    cocos/renderer/gfx-gles2/GLES2Context.mm
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
                     cocos/renderer/gfx-gles3/GLES3GlobalBarrier.cpp
                     cocos/renderer/gfx-gles3/GLES3GlobalBarrier.h
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
                     cocos/renderer/gfx-gles3/GLES3Wrangler.h
    )
    if(APPLE)
        cocos_source_files(
            NO_WERROR    cocos/renderer/gfx-gles3/GLES3Wrangler.mm
        )
    else()
        cocos_source_files(
                         cocos/renderer/gfx-gles3/GLES3Wrangler.cpp
        )
    endif()
    if(IOS)
        cocos_source_files(
            NO_WERROR    cocos/renderer/gfx-gles3/GLES3Context.mm
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
        NO_WERROR    cocos/renderer/gfx-metal/MTLContext.mm     # CAMetalLayer bug for apple
                     cocos/renderer/gfx-metal/MTLDevice.h
        NO_WERROR    cocos/renderer/gfx-metal/MTLDevice.mm      # CAMetalLayer bug for apple
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
                     cocos/renderer/gfx-metal/MTLRenderCommandEncoder.h
                     cocos/renderer/gfx-metal/MTLComputeCommandEncoder.h
                     cocos/renderer/gfx-metal/MTLCommandEncoder.h
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
                     cocos/renderer/gfx-vulkan/VKGlobalBarrier.cpp
                     cocos/renderer/gfx-vulkan/VKGlobalBarrier.h
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
                     cocos/renderer/gfx-vulkan/VKTextureBarrier.cpp
                     cocos/renderer/gfx-vulkan/VKTextureBarrier.h
                     cocos/renderer/gfx-vulkan/VKUtils.cpp
                     cocos/renderer/gfx-vulkan/VKUtils.h
                     cocos/renderer/gfx-vulkan/volk.c
                     cocos/renderer/gfx-vulkan/volk.h
    )

    if(ANDROID)
        set_source_files_properties(
            ${CWD}/cocos/renderer/gfx-vulkan/VKDevice.cpp
            PROPERTIES
                # supress warning on Android
                COMPILE_FLAGS -Wno-nullability-completeness
        )
    endif()
endif()

cocos_source_files(
                 cocos/renderer/frame-graph/Blackboard.h
                 cocos/renderer/frame-graph/CallbackPass.h
                 cocos/renderer/frame-graph/DevicePass.cpp
                 cocos/renderer/frame-graph/DevicePass.h
                 cocos/renderer/frame-graph/DevicePassResourceTable.cpp
                 cocos/renderer/frame-graph/DevicePassResourceTable.h
                 cocos/renderer/frame-graph/FrameGraph.cpp
                 cocos/renderer/frame-graph/FrameGraph.h
                 cocos/renderer/frame-graph/Handle.h
                 cocos/renderer/frame-graph/PassInsertPointManager.cpp
                 cocos/renderer/frame-graph/PassInsertPointManager.h
                 cocos/renderer/frame-graph/PassNode.cpp
                 cocos/renderer/frame-graph/PassNode.h
                 cocos/renderer/frame-graph/PassNodeBuilder.cpp
                 cocos/renderer/frame-graph/PassNodeBuilder.h
                 cocos/renderer/frame-graph/RenderTargetAttachment.h
                 cocos/renderer/frame-graph/Resource.h
                 cocos/renderer/frame-graph/ResourceAllocator.h
                 cocos/renderer/frame-graph/ResourceEntry.h
                 cocos/renderer/frame-graph/ResourceNode.h
                 cocos/renderer/frame-graph/VirtualResource.cpp
                 cocos/renderer/frame-graph/VirtualResource.h
)

##### physics

if(USE_PHYSICS_PHYSX)
    cocos_source_files(
        cocos/physics/PhysicsSDK.h
        cocos/physics/PhysicsSelector.h
        cocos/physics/sdk/World.h
        cocos/physics/sdk/World.cpp
        cocos/physics/sdk/Shape.h
        cocos/physics/sdk/Shape.cpp
        cocos/physics/sdk/RigidBody.h
        cocos/physics/sdk/RigidBody.cpp
        cocos/physics/sdk/Joint.h
        cocos/physics/sdk/Joint.cpp
        cocos/physics/spec/IBody.h
        cocos/physics/spec/IJoint.h
        cocos/physics/spec/ILifecycle.h
        cocos/physics/spec/IShape.h
        cocos/physics/spec/IWorld.h
        cocos/physics/physx/PhysX.h
        cocos/physics/physx/PhysXInc.h
        cocos/physics/physx/PhysXUtils.h
        cocos/physics/physx/PhysXUtils.cpp
        cocos/physics/physx/PhysXWorld.h
        cocos/physics/physx/PhysXWorld.cpp
        cocos/physics/physx/PhysXFilterShader.h
        cocos/physics/physx/PhysXFilterShader.cpp
        cocos/physics/physx/PhysXEventManager.h
        cocos/physics/physx/PhysXEventManager.cpp
        cocos/physics/physx/PhysXSharedBody.h
        cocos/physics/physx/PhysXSharedBody.cpp
        cocos/physics/physx/PhysXRigidBody.h
        cocos/physics/physx/PhysXRigidBody.cpp
        cocos/physics/physx/shapes/PhysXShape.h
        cocos/physics/physx/shapes/PhysXShape.cpp
        cocos/physics/physx/shapes/PhysXSphere.h
        cocos/physics/physx/shapes/PhysXSphere.cpp
        cocos/physics/physx/shapes/PhysXBox.h
        cocos/physics/physx/shapes/PhysXBox.cpp
        cocos/physics/physx/shapes/PhysXPlane.h
        cocos/physics/physx/shapes/PhysXPlane.cpp
        cocos/physics/physx/shapes/PhysXCapsule.h
        cocos/physics/physx/shapes/PhysXCapsule.cpp
        cocos/physics/physx/shapes/PhysXCone.h
        cocos/physics/physx/shapes/PhysXCone.cpp
        cocos/physics/physx/shapes/PhysXCylinder.h
        cocos/physics/physx/shapes/PhysXCylinder.cpp
        cocos/physics/physx/shapes/PhysXTerrain.h
        cocos/physics/physx/shapes/PhysXTerrain.cpp
        cocos/physics/physx/shapes/PhysXTrimesh.h
        cocos/physics/physx/shapes/PhysXTrimesh.cpp
        cocos/physics/physx/joints/PhysXJoint.h
        cocos/physics/physx/joints/PhysXJoint.cpp
        cocos/physics/physx/joints/PhysXRevolute.h
        cocos/physics/physx/joints/PhysXRevolute.cpp
        cocos/physics/physx/joints/PhysXDistance.h
        cocos/physics/physx/joints/PhysXDistance.cpp
        cocos/bindings/auto/jsb_physics_auto.cpp
        cocos/bindings/auto/jsb_physics_auto.h
    )
endif()

##### script bindings
######## dop
cocos_source_files(
    NO_WERROR    cocos/bindings/dop/BufferPool.cpp
                 cocos/bindings/dop/BufferPool.h
    NO_WERROR    cocos/bindings/dop/jsb_dop.cpp
                 cocos/bindings/dop/jsb_dop.h
                 cocos/bindings/dop/PoolType.h
                 cocos/bindings/dop/BufferAllocator.h
    NO_WERROR    cocos/bindings/dop/BufferAllocator.cpp
)

######## auto
cocos_source_files(
    NO_WERROR    cocos/bindings/auto/jsb_cocos_auto.cpp
                 cocos/bindings/auto/jsb_cocos_auto.h
    NO_WERROR    cocos/bindings/auto/jsb_extension_auto.cpp
                 cocos/bindings/auto/jsb_extension_auto.h
    NO_WERROR    cocos/bindings/auto/jsb_gfx_auto.cpp
                 cocos/bindings/auto/jsb_gfx_auto.h
    NO_WERROR    cocos/bindings/auto/jsb_network_auto.cpp
                 cocos/bindings/auto/jsb_network_auto.h
    NO_WERROR    cocos/bindings/auto/jsb_pipeline_auto.cpp
                 cocos/bindings/auto/jsb_pipeline_auto.h
    NO_WERROR    cocos/bindings/auto/jsb_scene_auto.cpp
                 cocos/bindings/auto/jsb_scene_auto.h
)

if(USE_AUDIO)
    cocos_source_files(
        NO_WERROR    cocos/bindings/auto/jsb_audio_auto.cpp
                     cocos/bindings/auto/jsb_audio_auto.h
    )
endif()

if(USE_VIDEO)
    cocos_source_files(
        NO_WERROR    cocos/bindings/auto/jsb_video_auto.cpp
                     cocos/bindings/auto/jsb_video_auto.h
    )
endif()

if(USE_WEBVIEW)
    cocos_source_files(
        NO_WERROR    cocos/bindings/auto/jsb_webview_auto.cpp
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
        NO_WERROR    cocos/bindings/auto/jsb_editor_support_auto.cpp
                     cocos/bindings/auto/jsb_editor_support_auto.h
    )

    if(USE_SPINE)
        cocos_source_files(
            NO_WERROR    cocos/editor-support/spine/Animation.cpp
                         cocos/editor-support/spine/Animation.h
            NO_WERROR    cocos/editor-support/spine/AnimationState.cpp
                         cocos/editor-support/spine/AnimationState.h
            NO_WERROR    cocos/editor-support/spine/AnimationStateData.cpp
                         cocos/editor-support/spine/AnimationStateData.h
            NO_WERROR    cocos/editor-support/spine/Atlas.cpp
                         cocos/editor-support/spine/Atlas.h
            NO_WERROR    cocos/editor-support/spine/AtlasAttachmentLoader.cpp
                         cocos/editor-support/spine/AtlasAttachmentLoader.h
            NO_WERROR    cocos/editor-support/spine/Attachment.cpp
                         cocos/editor-support/spine/Attachment.h
            NO_WERROR    cocos/editor-support/spine/AttachmentLoader.cpp
                         cocos/editor-support/spine/AttachmentLoader.h
            NO_WERROR    cocos/editor-support/spine/AttachmentTimeline.cpp
                         cocos/editor-support/spine/AttachmentTimeline.h
                         cocos/editor-support/spine/AttachmentType.h
                         cocos/editor-support/spine/BlendMode.h
            NO_WERROR    cocos/editor-support/spine/Bone.cpp
                         cocos/editor-support/spine/Bone.h
            NO_WERROR    cocos/editor-support/spine/BoneData.cpp
                         cocos/editor-support/spine/BoneData.h
            NO_WERROR    cocos/editor-support/spine/BoundingBoxAttachment.cpp
                         cocos/editor-support/spine/BoundingBoxAttachment.h
            NO_WERROR    cocos/editor-support/spine/ClippingAttachment.cpp
                         cocos/editor-support/spine/ClippingAttachment.h
                         cocos/editor-support/spine/Color.h
            NO_WERROR    cocos/editor-support/spine/ColorTimeline.cpp
                         cocos/editor-support/spine/ColorTimeline.h
            NO_WERROR    cocos/editor-support/spine/Constraint.cpp
                         cocos/editor-support/spine/Constraint.h
            NO_WERROR    cocos/editor-support/spine/ConstraintData.cpp
                         cocos/editor-support/spine/ConstraintData.h
                         cocos/editor-support/spine/ContainerUtil.h
            NO_WERROR    cocos/editor-support/spine/CurveTimeline.cpp
                         cocos/editor-support/spine/CurveTimeline.h
                         cocos/editor-support/spine/Debug.h
            NO_WERROR    cocos/editor-support/spine/DeformTimeline.cpp
                         cocos/editor-support/spine/DeformTimeline.h
                         cocos/editor-support/spine/dll.h
            NO_WERROR    cocos/editor-support/spine/DrawOrderTimeline.cpp
                         cocos/editor-support/spine/DrawOrderTimeline.h
            NO_WERROR    cocos/editor-support/spine/Event.cpp
                         cocos/editor-support/spine/Event.h
            NO_WERROR    cocos/editor-support/spine/EventData.cpp
                         cocos/editor-support/spine/EventData.h
            NO_WERROR    cocos/editor-support/spine/EventTimeline.cpp
                         cocos/editor-support/spine/EventTimeline.h
            NO_WERROR    cocos/editor-support/spine/Extension.cpp
                         cocos/editor-support/spine/Extension.h
                         cocos/editor-support/spine/HashMap.h
                         cocos/editor-support/spine/HasRendererObject.h
            NO_WERROR    cocos/editor-support/spine/IkConstraint.cpp
                         cocos/editor-support/spine/IkConstraint.h
            NO_WERROR    cocos/editor-support/spine/IkConstraintData.cpp
                         cocos/editor-support/spine/IkConstraintData.h
            NO_WERROR    cocos/editor-support/spine/IkConstraintTimeline.cpp
                         cocos/editor-support/spine/IkConstraintTimeline.h
            NO_WERROR    cocos/editor-support/spine/Json.cpp
                         cocos/editor-support/spine/Json.h
            NO_WERROR    cocos/editor-support/spine/LinkedMesh.cpp
                         cocos/editor-support/spine/LinkedMesh.h
            NO_WERROR    cocos/editor-support/spine/MathUtil.cpp
                         cocos/editor-support/spine/MathUtil.h
            NO_WERROR    cocos/editor-support/spine/MeshAttachment.cpp
                         cocos/editor-support/spine/MeshAttachment.h
                         cocos/editor-support/spine/MixBlend.h
                         cocos/editor-support/spine/MixDirection.h
            NO_WERROR    cocos/editor-support/spine/PathAttachment.cpp
                         cocos/editor-support/spine/PathAttachment.h
            NO_WERROR    cocos/editor-support/spine/PathConstraint.cpp
                         cocos/editor-support/spine/PathConstraint.h
            NO_WERROR    cocos/editor-support/spine/PathConstraintData.cpp
                         cocos/editor-support/spine/PathConstraintData.h
            NO_WERROR    cocos/editor-support/spine/PathConstraintMixTimeline.cpp
                         cocos/editor-support/spine/PathConstraintMixTimeline.h
            NO_WERROR    cocos/editor-support/spine/PathConstraintPositionTimeline.cpp
                         cocos/editor-support/spine/PathConstraintPositionTimeline.h
            NO_WERROR    cocos/editor-support/spine/PathConstraintSpacingTimeline.cpp
                         cocos/editor-support/spine/PathConstraintSpacingTimeline.h
            NO_WERROR    cocos/editor-support/spine/PointAttachment.cpp
                         cocos/editor-support/spine/PointAttachment.h
                         cocos/editor-support/spine/Pool.h
                         cocos/editor-support/spine/PositionMode.h
            NO_WERROR    cocos/editor-support/spine/RegionAttachment.cpp
                         cocos/editor-support/spine/RegionAttachment.h
                         cocos/editor-support/spine/RotateMode.h
            NO_WERROR    cocos/editor-support/spine/RotateTimeline.cpp
                         cocos/editor-support/spine/RotateTimeline.h
            NO_WERROR    cocos/editor-support/spine/RTTI.cpp
                         cocos/editor-support/spine/RTTI.h
            NO_WERROR    cocos/editor-support/spine/ScaleTimeline.cpp
                         cocos/editor-support/spine/ScaleTimeline.h
            NO_WERROR    cocos/editor-support/spine/ShearTimeline.cpp
                         cocos/editor-support/spine/ShearTimeline.h
            NO_WERROR    cocos/editor-support/spine/Skeleton.cpp
                         cocos/editor-support/spine/Skeleton.h
            NO_WERROR    cocos/editor-support/spine/SkeletonBinary.cpp
                         cocos/editor-support/spine/SkeletonBinary.h
            NO_WERROR    cocos/editor-support/spine/SkeletonBounds.cpp
                         cocos/editor-support/spine/SkeletonBounds.h
            NO_WERROR    cocos/editor-support/spine/SkeletonClipping.cpp
                         cocos/editor-support/spine/SkeletonClipping.h
            NO_WERROR    cocos/editor-support/spine/SkeletonData.cpp
                         cocos/editor-support/spine/SkeletonData.h
            NO_WERROR    cocos/editor-support/spine/SkeletonJson.cpp
                         cocos/editor-support/spine/SkeletonJson.h
            NO_WERROR    cocos/editor-support/spine/Skin.cpp
                         cocos/editor-support/spine/Skin.h
            NO_WERROR    cocos/editor-support/spine/Slot.cpp
                         cocos/editor-support/spine/Slot.h
            NO_WERROR    cocos/editor-support/spine/SlotData.cpp
                         cocos/editor-support/spine/SlotData.h
                         cocos/editor-support/spine/SpacingMode.h
                         cocos/editor-support/spine/spine.h
            NO_WERROR    cocos/editor-support/spine/SpineObject.cpp
                         cocos/editor-support/spine/SpineObject.h
                         cocos/editor-support/spine/SpineString.h
            NO_WERROR    cocos/editor-support/spine/TextureLoader.cpp
                         cocos/editor-support/spine/TextureLoader.h
            NO_WERROR    cocos/editor-support/spine/Timeline.cpp
                         cocos/editor-support/spine/Timeline.h
                         cocos/editor-support/spine/TimelineType.h
            NO_WERROR    cocos/editor-support/spine/TransformConstraint.cpp
                         cocos/editor-support/spine/TransformConstraint.h
            NO_WERROR    cocos/editor-support/spine/TransformConstraintData.cpp
                         cocos/editor-support/spine/TransformConstraintData.h
            NO_WERROR    cocos/editor-support/spine/TransformConstraintTimeline.cpp
                         cocos/editor-support/spine/TransformConstraintTimeline.h
                         cocos/editor-support/spine/TransformMode.h
            NO_WERROR    cocos/editor-support/spine/TranslateTimeline.cpp
                         cocos/editor-support/spine/TranslateTimeline.h
            NO_WERROR    cocos/editor-support/spine/Triangulator.cpp
                         cocos/editor-support/spine/Triangulator.h
            NO_WERROR    cocos/editor-support/spine/TwoColorTimeline.cpp
                         cocos/editor-support/spine/TwoColorTimeline.h
            NO_WERROR    cocos/editor-support/spine/Updatable.cpp
                         cocos/editor-support/spine/Updatable.h
                         cocos/editor-support/spine/Vector.h
            NO_WERROR    cocos/editor-support/spine/VertexAttachment.cpp
                         cocos/editor-support/spine/VertexAttachment.h
            NO_WERROR    cocos/editor-support/spine/VertexEffect.cpp
                         cocos/editor-support/spine/VertexEffect.h
                         cocos/editor-support/spine/Vertices.h
            NO_WERROR    cocos/editor-support/spine-creator-support/AttachmentVertices.cpp
                         cocos/editor-support/spine-creator-support/AttachmentVertices.h
            NO_WERROR    cocos/editor-support/spine-creator-support/SkeletonAnimation.cpp
                         cocos/editor-support/spine-creator-support/SkeletonAnimation.h
            NO_WERROR    cocos/editor-support/spine-creator-support/SkeletonCache.cpp
                         cocos/editor-support/spine-creator-support/SkeletonCache.h
            NO_WERROR    cocos/editor-support/spine-creator-support/SkeletonCacheAnimation.cpp
                         cocos/editor-support/spine-creator-support/SkeletonCacheAnimation.h
            NO_WERROR    cocos/editor-support/spine-creator-support/SkeletonCacheMgr.cpp
                         cocos/editor-support/spine-creator-support/SkeletonCacheMgr.h
            NO_WERROR    cocos/editor-support/spine-creator-support/SkeletonDataMgr.cpp
                         cocos/editor-support/spine-creator-support/SkeletonDataMgr.h
            NO_WERROR    cocos/editor-support/spine-creator-support/SkeletonRenderer.cpp
                         cocos/editor-support/spine-creator-support/SkeletonRenderer.h
            NO_WERROR    cocos/editor-support/spine-creator-support/spine-cocos2dx.cpp
                         cocos/editor-support/spine-creator-support/spine-cocos2dx.h
            NO_WERROR    cocos/editor-support/spine-creator-support/VertexEffectDelegate.cpp
                         cocos/editor-support/spine-creator-support/VertexEffectDelegate.h
            NO_WERROR    cocos/bindings/auto/jsb_spine_auto.cpp
                         cocos/bindings/auto/jsb_spine_auto.h
            NO_WERROR    cocos/bindings/manual/jsb_spine_manual.cpp
                         cocos/bindings/manual/jsb_spine_manual.h
        )
    endif()

    if(USE_DRAGONBONES)
        cocos_source_files(
                         cocos/editor-support/dragonbones/DragonBonesHeaders.h
            NO_WERROR    cocos/editor-support/dragonbones/animation/Animation.cpp
                         cocos/editor-support/dragonbones/animation/Animation.h
            NO_WERROR    cocos/editor-support/dragonbones/animation/AnimationState.cpp
                         cocos/editor-support/dragonbones/animation/AnimationState.h
            NO_WERROR    cocos/editor-support/dragonbones/animation/BaseTimelineState.cpp
                         cocos/editor-support/dragonbones/animation/BaseTimelineState.h
                         cocos/editor-support/dragonbones/animation/IAnimatable.h
            NO_WERROR    cocos/editor-support/dragonbones/animation/TimelineState.cpp
                         cocos/editor-support/dragonbones/animation/TimelineState.h
            NO_WERROR    cocos/editor-support/dragonbones/animation/WorldClock.cpp
                         cocos/editor-support/dragonbones/animation/WorldClock.h
            NO_WERROR    cocos/editor-support/dragonbones/armature/Armature.cpp
                         cocos/editor-support/dragonbones/armature/Armature.h
            NO_WERROR    cocos/editor-support/dragonbones/armature/Bone.cpp
                         cocos/editor-support/dragonbones/armature/Bone.h
            NO_WERROR    cocos/editor-support/dragonbones/armature/Constraint.cpp
                         cocos/editor-support/dragonbones/armature/Constraint.h
            NO_WERROR    cocos/editor-support/dragonbones/armature/DeformVertices.cpp
                         cocos/editor-support/dragonbones/armature/DeformVertices.h
                         cocos/editor-support/dragonbones/armature/IArmatureProxy.h
            NO_WERROR    cocos/editor-support/dragonbones/armature/Slot.cpp
                         cocos/editor-support/dragonbones/armature/Slot.h
            NO_WERROR    cocos/editor-support/dragonbones/armature/TransformObject.cpp
                         cocos/editor-support/dragonbones/armature/TransformObject.h
            NO_WERROR    cocos/editor-support/dragonbones/core/BaseObject.cpp
                         cocos/editor-support/dragonbones/core/BaseObject.h
            NO_WERROR    cocos/editor-support/dragonbones/core/DragonBones.cpp
                         cocos/editor-support/dragonbones/core/DragonBones.h
            NO_WERROR    cocos/editor-support/dragonbones/event/EventObject.cpp
                         cocos/editor-support/dragonbones/event/EventObject.h
                         cocos/editor-support/dragonbones/event/IEventDispatcher.h
            NO_WERROR    cocos/editor-support/dragonbones/factory/BaseFactory.cpp
                         cocos/editor-support/dragonbones/factory/BaseFactory.h
                         cocos/editor-support/dragonbones/geom/ColorTransform.h
                         cocos/editor-support/dragonbones/geom/Matrix.h
            NO_WERROR    cocos/editor-support/dragonbones/geom/Point.cpp
                         cocos/editor-support/dragonbones/geom/Point.h
                         cocos/editor-support/dragonbones/geom/Rectangle.h
            NO_WERROR    cocos/editor-support/dragonbones/geom/Transform.cpp
                         cocos/editor-support/dragonbones/geom/Transform.h
            NO_WERROR    cocos/editor-support/dragonbones/model/AnimationConfig.cpp
                         cocos/editor-support/dragonbones/model/AnimationConfig.h
            NO_WERROR    cocos/editor-support/dragonbones/model/AnimationData.cpp
                         cocos/editor-support/dragonbones/model/AnimationData.h
            NO_WERROR    cocos/editor-support/dragonbones/model/ArmatureData.cpp
                         cocos/editor-support/dragonbones/model/ArmatureData.h
            NO_WERROR    cocos/editor-support/dragonbones/model/BoundingBoxData.cpp
                         cocos/editor-support/dragonbones/model/BoundingBoxData.h
            NO_WERROR    cocos/editor-support/dragonbones/model/CanvasData.cpp
                         cocos/editor-support/dragonbones/model/CanvasData.h
            NO_WERROR    cocos/editor-support/dragonbones/model/ConstraintData.cpp
                         cocos/editor-support/dragonbones/model/ConstraintData.h
            NO_WERROR    cocos/editor-support/dragonbones/model/DisplayData.cpp
                         cocos/editor-support/dragonbones/model/DisplayData.h
            NO_WERROR    cocos/editor-support/dragonbones/model/DragonBonesData.cpp
                         cocos/editor-support/dragonbones/model/DragonBonesData.h
            NO_WERROR    cocos/editor-support/dragonbones/model/SkinData.cpp
                         cocos/editor-support/dragonbones/model/SkinData.h
            NO_WERROR    cocos/editor-support/dragonbones/model/TextureAtlasData.cpp
                         cocos/editor-support/dragonbones/model/TextureAtlasData.h
            NO_WERROR    cocos/editor-support/dragonbones/model/UserData.cpp
                         cocos/editor-support/dragonbones/model/UserData.h
            NO_WERROR    cocos/editor-support/dragonbones/parser/BinaryDataParser.cpp
                         cocos/editor-support/dragonbones/parser/BinaryDataParser.h
            NO_WERROR    cocos/editor-support/dragonbones/parser/DataParser.cpp
                         cocos/editor-support/dragonbones/parser/DataParser.h
            NO_WERROR    cocos/editor-support/dragonbones/parser/JSONDataParser.cpp
                         cocos/editor-support/dragonbones/parser/JSONDataParser.h
            NO_WERROR    cocos/editor-support/dragonbones-creator-support/ArmatureCache.cpp
                         cocos/editor-support/dragonbones-creator-support/ArmatureCache.h
            NO_WERROR    cocos/editor-support/dragonbones-creator-support/ArmatureCacheMgr.cpp
                         cocos/editor-support/dragonbones-creator-support/ArmatureCacheMgr.h
            NO_WERROR    cocos/editor-support/dragonbones-creator-support/CCArmatureCacheDisplay.cpp
                         cocos/editor-support/dragonbones-creator-support/CCArmatureCacheDisplay.h
            NO_WERROR    cocos/editor-support/dragonbones-creator-support/CCArmatureDisplay.cpp
                         cocos/editor-support/dragonbones-creator-support/CCArmatureDisplay.h
                         cocos/editor-support/dragonbones-creator-support/CCDragonBonesHeaders.h
            NO_WERROR    cocos/editor-support/dragonbones-creator-support/CCFactory.cpp
                         cocos/editor-support/dragonbones-creator-support/CCFactory.h
            NO_WERROR    cocos/editor-support/dragonbones-creator-support/CCSlot.cpp
                         cocos/editor-support/dragonbones-creator-support/CCSlot.h
            NO_WERROR    cocos/editor-support/dragonbones-creator-support/CCTextureAtlasData.cpp
                         cocos/editor-support/dragonbones-creator-support/CCTextureAtlasData.h
            NO_WERROR    cocos/bindings/auto/jsb_dragonbones_auto.cpp
                         cocos/bindings/auto/jsb_dragonbones_auto.h
            NO_WERROR    cocos/bindings/manual/jsb_dragonbones_manual.cpp
                         cocos/bindings/manual/jsb_dragonbones_manual.h
        )
    endif()
endif()

######## manual
cocos_source_files(
    NO_WERROR    cocos/bindings/manual/jsb_classtype.cpp
                 cocos/bindings/manual/jsb_classtype.h
    #NO_WERROR   cocos/bindings/manual/jsb_extension_manual.cpp
                 #cocos/bindings/manual/jsb_extension_manual.h
    NO_WERROR    cocos/bindings/manual/jsb_cocos_manual.cpp
                 cocos/bindings/manual/jsb_cocos_manual.h
    NO_WERROR    cocos/bindings/manual/jsb_conversions.cpp
                 cocos/bindings/manual/jsb_conversions.h
    NO_WERROR    cocos/bindings/manual/jsb_gfx_manual.cpp
                 cocos/bindings/manual/jsb_gfx_manual.h
    NO_WERROR    cocos/bindings/manual/jsb_global.cpp
                 cocos/bindings/manual/jsb_global.h
    NO_WERROR    cocos/bindings/manual/jsb_global_init.cpp
                 cocos/bindings/manual/jsb_global_init.h
    NO_WERROR    cocos/bindings/manual/jsb_helper.cpp
                 cocos/bindings/manual/jsb_helper.h
                 cocos/bindings/manual/jsb_module_register.h
                 cocos/bindings/manual/jsb_platform.h
    NO_WERROR    cocos/bindings/manual/jsb_scene_manual.cpp
    NO_WERROR    cocos/bindings/manual/jsb_scene_manual_ext.cpp
                 cocos/bindings/manual/jsb_scene_manual.h
    NO_WERROR    cocos/bindings/manual/jsb_network_manual.cpp
                 cocos/bindings/manual/jsb_network_manual.h
    NO_WERROR    cocos/bindings/manual/jsb_xmlhttprequest.cpp
                 cocos/bindings/manual/jsb_xmlhttprequest.h
                 cocos/bindings/manual/jsb_pipeline_manual.h
    NO_WERROR    cocos/bindings/manual/jsb_pipeline_manual.cpp
)

if(USE_SOCKET)
    cocos_source_files(
        NO_WERROR    cocos/bindings/manual/jsb_socketio.cpp
                     cocos/bindings/manual/jsb_socketio.h
        NO_WERROR    cocos/bindings/manual/jsb_websocket.cpp
                     cocos/bindings/manual/jsb_websocket.h
    )
endif()

if(NOT IOS AND USE_WEBSOCKET_SERVER)
    cocos_source_files(
        NO_WERROR    cocos/bindings/manual/jsb_websocket_server.cpp
                     cocos/bindings/manual/jsb_websocket_server.h
    )
endif()

if(ANDROID)
    cocos_source_files(
                     cocos/bindings/manual/jsb_platform_android.cpp
                     cocos/bindings/manual/JavaScriptJavaBridge.cpp
                     cocos/bindings/manual/JavaScriptJavaBridge.h
    )
elseif(OHOS)
    cocos_source_files(
        cocos/bindings/manual/jsb_platform_ohos.cpp
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
        NO_WERROR    cocos/bindings/manual/jsb_platfrom_win32.cpp
    )
endif()

############# module bindings 
if(USE_SE_V8)
    cocos_source_files(MODULE ccbindings
                     cocos/bindings/jswrapper/v8/Base.h
                     cocos/bindings/jswrapper/v8/Class.cpp
                     cocos/bindings/jswrapper/v8/Class.h
                     cocos/bindings/jswrapper/v8/HelperMacros.h
                     cocos/bindings/jswrapper/v8/HelperMacros.cpp
                     cocos/bindings/jswrapper/v8/Object.cpp
                     cocos/bindings/jswrapper/v8/Object.h
                     cocos/bindings/jswrapper/v8/ObjectWrap.cpp
                     cocos/bindings/jswrapper/v8/ObjectWrap.h
        NO_WERROR    cocos/bindings/jswrapper/v8/ScriptEngine.cpp
                     cocos/bindings/jswrapper/v8/ScriptEngine.h
                     cocos/bindings/jswrapper/v8/SeApi.h
                     cocos/bindings/jswrapper/v8/Utils.cpp
                     cocos/bindings/jswrapper/v8/Utils.h
    )
    if(USE_V8_DEBUGGER)
    cocos_source_files(MODULE ccbindings
                     cocos/bindings/jswrapper/v8/debugger/base64.h
        NO_WERROR    cocos/bindings/jswrapper/v8/debugger/env.cpp
                     cocos/bindings/jswrapper/v8/debugger/env.h
        NO_WERROR    cocos/bindings/jswrapper/v8/debugger/http_parser.cpp
                     cocos/bindings/jswrapper/v8/debugger/http_parser.h
        NO_WERROR    cocos/bindings/jswrapper/v8/debugger/inspector_agent.cpp
                     cocos/bindings/jswrapper/v8/debugger/inspector_agent.h
        NO_WERROR    cocos/bindings/jswrapper/v8/debugger/inspector_io.cpp
                     cocos/bindings/jswrapper/v8/debugger/inspector_io.h
        NO_WERROR    cocos/bindings/jswrapper/v8/debugger/inspector_socket.cpp
                     cocos/bindings/jswrapper/v8/debugger/inspector_socket.h
        NO_WERROR    cocos/bindings/jswrapper/v8/debugger/inspector_socket_server.cpp
                     cocos/bindings/jswrapper/v8/debugger/inspector_socket_server.h
        NO_WERROR    cocos/bindings/jswrapper/v8/debugger/node.cpp
                     cocos/bindings/jswrapper/v8/debugger/node.h
        NO_WERROR    cocos/bindings/jswrapper/v8/debugger/node_debug_options.cpp
                     cocos/bindings/jswrapper/v8/debugger/node_debug_options.h
                     cocos/bindings/jswrapper/v8/debugger/node_mutex.h
        NO_WERROR    cocos/bindings/jswrapper/v8/debugger/SHA1.cpp
                     cocos/bindings/jswrapper/v8/debugger/SHA1.h
                     cocos/bindings/jswrapper/v8/debugger/util-inl.h
        NO_WERROR    cocos/bindings/jswrapper/v8/debugger/util.cpp
                     cocos/bindings/jswrapper/v8/debugger/util.h
                     cocos/bindings/jswrapper/v8/debugger/v8_inspector_protocol_json.h
    )
    endif()
endif()

if(USE_SE_JSC)
    cocos_source_files(MODULE ccbindings
                     cocos/bindings/jswrapper/jsc/Class.h
                     cocos/bindings/jswrapper/jsc/EJConvert.h
                     cocos/bindings/jswrapper/jsc/HelperMacros.h
        NO_WERROR    cocos/bindings/jswrapper/jsc/Utils.cpp
                     cocos/bindings/jswrapper/jsc/EJConvertTypedArray.h
                     cocos/bindings/jswrapper/jsc/PlatformUtils.h
        NO_WERROR    cocos/bindings/jswrapper/jsc/EJConvertTypedArray.m
        NO_WERROR    cocos/bindings/jswrapper/jsc/EJConvert.m
                     cocos/bindings/jswrapper/jsc/Object.h
        NO_WERROR    cocos/bindings/jswrapper/jsc/Object.mm
                     cocos/bindings/jswrapper/jsc/ScriptEngine.h
        NO_WERROR    cocos/bindings/jswrapper/jsc/ScriptEngine.mm
        NO_WERROR    cocos/bindings/jswrapper/jsc/PlatformUtils.mm
                     cocos/bindings/jswrapper/jsc/SeApi.h
        NO_WERROR    cocos/bindings/jswrapper/jsc/Class.cpp
                     cocos/bindings/jswrapper/jsc/Utils.h
                     cocos/bindings/jswrapper/jsc/Base.h
    )
endif()

cocos_source_files(MODULE ccbindings
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

if(ANDROID OR IOS OR OHOS)
    if(USE_VIDEO)
        cocos_source_files(
                         cocos/ui/videoplayer/VideoPlayer.h
        )
    endif()
    if(USE_WEBVIEW)
        cocos_source_files(
                         cocos/ui/webview/WebViewImpl-java.h
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
                         cocos/ui/videoplayer/VideoPlayer-java.cpp
        )
    endif()
    if(USE_WEBVIEW)
        cocos_source_files(
                         cocos/ui/webview/WebViewImpl-android.cpp
        )
    endif()
elseif(OHOS)
    if(USE_EDIT_BOX)
        cocos_source_files(
            cocos/ui/edit-box/EditBox-ohos.cpp
        )
    endif()
    if(USE_VIDEO)
        cocos_source_files(
            cocos/ui/videoplayer/VideoPlayer-java.cpp
        )
    endif()
    if(USE_WEBVIEW)
        cocos_source_files(
            cocos/ui/webview/WebViewImpl-ohos.cpp
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
            NO_WERROR    cocos/ui/webview/WebViewImpl-ios.mm
       )
   endif()
elseif(WIN32)
    if(USE_EDIT_BOX)
        cocos_source_files(
            NO_WERROR    cocos/ui/edit-box/EditBox-win32.cpp
        )
    endif()
endif()

##### extensions

cocos_source_files(
    NO_WERROR    extensions/assets-manager/AssetsManagerEx.cpp
                 extensions/assets-manager/AssetsManagerEx.h
    NO_WERROR    extensions/assets-manager/AsyncTaskPool.cpp
                 extensions/assets-manager/AsyncTaskPool.h
    NO_WERROR    extensions/assets-manager/EventAssetsManagerEx.cpp
                 extensions/assets-manager/EventAssetsManagerEx.h
    NO_WERROR    extensions/assets-manager/Manifest.cpp
                 extensions/assets-manager/Manifest.h
                 extensions/cocos-ext.h
                 extensions/ExtensionExport.h
                 extensions/ExtensionMacros.h
)

list(APPEND COCOS2D_SOURCE_LIST ${CC_EXTERNAL_SOURCES})


if(USE_MODULES)
    add_library(ccmath ${ccmath_SOURCE_LIST})
    add_library(cclog ${cclog_SOURCE_LIST})
    add_library(ccfilesystem ${ccfilesystem_SOURCE_LIST} ${CC_TINYDIR_SOURCES})
    add_library(ccutils ${ccutils_SOURCE_LIST} ${CC_FS_SOURCES})
    add_library(ccunzip ${ccunzip_SOURCE_LIST} ${CC_UNZIP_SOURCES})
    add_library(ccbindings ${ccbindings_SOURCE_LIST})

    target_include_directories(ccmath PRIVATE
        ${CWD}/cocos
    )
    target_include_directories(ccunzip PRIVATE
        ${CWD}/external/sources/unzip
        ${CWD}/external/sources
        ${CWD}/cocos
    )
    target_include_directories(cclog PRIVATE
        ${CWD}/cocos
    )
    target_include_directories(ccfilesystem PRIVATE
        ${CWD}
        ${CWD}/cocos
        ${CWD}/external/sources
    )
    target_include_directories(ccutils PRIVATE
        ${CWD}/cocos
        ${CWD}/external/sources
    )
    target_include_directories(ccbindings PRIVATE
        ${CWD}/cocos
        ${CWD}
        ${CC_EXTERNAL_INCLUDES}
    )
    target_link_libraries(ccunzip PUBLIC
        ${ZLIB}
    )
    target_link_libraries(ccfilesystem PUBLIC 
        ccunzip 
        ccutils
        cclog
    )
    target_link_libraries(ccbindings PUBLIC 
        ccfilesystem
        cclog
        ${se_libs_name}
        uv
    )
    if(ANDROID)
        target_link_libraries(ccmath PUBLIC
            android_platform
        )
        target_link_libraries(cclog PUBLIC
            log
        )
        target_link_libraries(ccfilesystem PUBLIC
            cocos2d_jni
        )
    elseif(OHOS)
        target_link_libraries(cclog PUBLIC
            hilog_ndk.z
        )
        target_link_libraries(ccfilesystem PUBLIC
            cocos2d_jni
            rawfile.z
        )
    elseif(APPLE)
        target_link_libraries(ccfilesystem PUBLIC
        "-framework Foundation"
        "-framework SystemConfiguration"
        )
    endif()
else()
    list(APPEND COCOS2D_SOURCE_LIST
        ${ccmath_SOURCE_LIST}
        ${cclog_SOURCE_LIST}
        ${ccfilesystem_SOURCE_LIST}
        ${ccunzip_SOURCE_LIST}
        ${ccbindings_SOURCE_LIST}
        ${ccutils_SOURCE_LIST}
        ${CC_UNZIP_SOURCES}
        ${CC_TINYDIR_SOURCES}
    )
endif()

add_library(cocos2d ${COCOS2D_SOURCE_LIST})

if(USE_MODULES)
    target_link_libraries(cocos2d PUBLIC
        ccmath
        cclog
        ccfilesystem
        ccunzip
        ccbindings
        ccutils
    )
endif()


if(ANDROID OR OHOS)
    cc_enable_werror("${CC_JNI_SRC_FILES}")
    add_library(cocos2d_jni STATIC ${CC_JNI_SRC_FILES})
    target_include_directories(cocos2d_jni PUBLIC
        ${CWD}
        ${CWD}/cocos
    )
    if(ANDROID)
        target_link_libraries(cocos2d_jni PUBLIC
            android_platform
            android
            log
        )
    endif()
endif()

################################# cc_apply_definations ###################################
function(cc_apply_definations target)
    target_compile_definitions(${target} PUBLIC
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
        $<IF:$<BOOL:${USE_JOB_SYSTEM_TBB}>,USE_JOB_SYSTEM_TBB=1,USE_JOB_SYSTEM_TBB=0>
        $<IF:$<BOOL:${USE_JOB_SYSTEM_TASKFLOW}>,USE_JOB_SYSTEM_TASKFLOW=1,USE_JOB_SYSTEM_TASKFLOW=0>
        $<IF:$<BOOL:${USE_PHYSICS_PHYSX}>,USE_PHYSICS_PHYSX=1,USE_PHYSICS_PHYSX=0>
        $<$<BOOL:${USE_SE_JSC}>:SCRIPT_ENGINE_TYPE=3>
        $<$<CONFIG:Debug>:CC_DEBUG=1>
    )
endfunction()

# setup default flags
cc_apply_definations(cocos2d)

if(USE_MODULES)
    cc_apply_definations(ccmath)
    cc_apply_definations(cclog)
    cc_apply_definations(ccfilesystem)
    cc_apply_definations(ccunzip)
    cc_apply_definations(ccbindings)
    cc_apply_definations(ccutils)
endif()

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
        ${CWD}/cocos/editor-support
        $<$<BOOL:USE_SE_JSC>:${CWD}/cocos/bindings/jswrapper>
    PRIVATE
        ${CC_EXTERNAL_PRIVATE_INCLUDES}
)

target_compile_definitions(cocos2d
    PRIVATE
        ${CC_EXTERNAL_PRIVATE_DEFINITIONS}
)
if(NOT OHOS)
    target_include_directories(cocos2d PUBLIC 
        ${CWD}/external/sources/EGL
        ${CWD}/external/sources/khronos
    )
endif()


if(WIN32)
    target_link_libraries(cocos2d PUBLIC
        ws2_32 userenv psapi winmm Iphlpapi
        ${CC_EXTERNAL_LIBS}
    )
    cc_win32_definations(cocos2d)

    if(USE_MODULES)
        cc_win32_definations(ccmath)
        cc_win32_definations(cclog)
        cc_win32_definations(ccunzip)
        cc_win32_definations(ccfilesystem)
        cc_win32_definations(ccutils)
        cc_win32_definations(ccbindings)

        target_link_libraries(ccutils PUBLIC
            ws2_32 psapi userenv Iphlpapi
        )
        target_link_libraries(ccbindings PUBLIC
            ws2_32
        )
    endif()


endif()

if(ANDROID)
    target_compile_options(cocos2d PRIVATE
        -Wno-comment # nested block comments are actually useful sometimes
    )

    find_library(LIB_EGL NAMES EGL)
    find_library(LIB_GLESv2 NAMES GLESv2)
    target_link_libraries(cocos2d PUBLIC
        android
        OpenSLES
        ${LIB_EGL}
        ${LIB_GLESv2}
        GLESv2
        ${CC_EXTERNAL_LIBS}
    )
endif()

if(OHOS)
    target_link_libraries(cocos2d PUBLIC
        EGL
        GLESv3
        zgraphic.z
        rawfile.z
        z
        OpenSLES
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
        "-framework QuartzCore"
        "-framework MetalPerformanceShaders"
        "-lsqlite3"
        "-framework Security"
        "-framework SystemConfiguration"
        ${CC_EXTERNAL_LIBS}
    )
    set_target_properties(cocos2d PROPERTIES
        XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH "YES"
        OSX_ARCHITECTURES "arm64;x86_64"
        ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/archives
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
            "-framework MetalPerformanceShaders"
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
    endif()

endif()

source_group(TREE ${CWD} PREFIX "Source Files" FILES ${COCOS2D_SOURCE_LIST})


if(MSVC)
    if(${CMAKE_SIZEOF_VOID_P} STREQUAL "4")
        file(GLOB_RECURSE WIN32_DLLS
            ${CWD}/external/win32/libs/*.dll
            ${CWD}/external/win32/libs/Debug/*.dll
        )
    else()
        file(GLOB_RECURSE WIN32_DLLS
            ${CWD}/external/win64/libs/*.dll
            ${CWD}/external/win64/libs/Debug/*.dll
        )
    endif()
    target_compile_options(cocos2d PUBLIC /MP)
endif()
