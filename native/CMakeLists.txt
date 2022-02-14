include(${CMAKE_CURRENT_LIST_DIR}/cmake/predefine.cmake)

################################# engine source code ##################################
set(CWD ${CMAKE_CURRENT_LIST_DIR})
set(COCOS_SOURCE_LIST)
set(ENGINE_NAME cocos_engine)

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

add_definitions()

if(NX)
    cc_set_if_undefined(CC_USE_VULKAN ON)
    cc_set_if_undefined(CC_USE_GLES3 OFF)
    cc_set_if_undefined(CC_USE_GLES2 OFF)
elseif(ANDROID OR WINDOWS OR OHOS)
    cc_set_if_undefined(CC_USE_GLES3 ON)
    cc_set_if_undefined(CC_USE_VULKAN OFF)
    cc_set_if_undefined(CC_USE_GLES2 OFF)
elseif(MACOSX OR IOS)
    cc_set_if_undefined(CC_USE_METAL ON)
    cc_set_if_undefined(CC_USE_VULKAN OFF)
    cc_set_if_undefined(CC_USE_GLES3 OFF)
    cc_set_if_undefined(CC_USE_GLES2 OFF)
endif()

if(USE_PHYSICS_PHYSX)
    if (ANDROID AND CMAKE_ANDROID_ARCH_ABI MATCHES x86)
        set(USE_PHYSICS_PHYSX OFF)
        message(AUTHOR_WARNING "Native PhysX does not support Google Android X86")
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

if(USE_JOB_SYSTEM_TASKFLOW)
    set(CMAKE_CXX_STANDARD 17)
    if(IOS AND "${TARGET_IOS_VERSION}" VERSION_LESS "12.0")
        message(FATAL_ERROR "Target iOS version requires 12.0+ when enable taskflow")
    endif()
endif()

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
    elseif(LINUX OR QNX)
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
            NO_WERROR    cocos/audio/apple/AudioPlayer.mm
            NO_WERROR    cocos/audio/apple/AudioDecoder.mm
                         cocos/audio/apple/AudioPlayer.h
            NO_WERROR    cocos/audio/apple/AudioEngine-inl.mm
                         cocos/audio/apple/AudioMacros.h
            NO_WERROR    cocos/audio/apple/AudioCache.mm
                         cocos/audio/apple/AudioCache.h
                         cocos/audio/apple/AudioEngine-inl.h
        )
    endif()

endif()

##### base
cocos_source_files(
    cocos/base/Agent.h
    cocos/base/Any.h
    cocos/base/astc.cpp
    cocos/base/astc.h
    cocos/base/base64.cpp
    cocos/base/base64.h
    cocos/base/CachedArray.h
    cocos/base/Config.h
    cocos/base/CoreStd.h
    cocos/base/csscolorparser.cpp
    cocos/base/csscolorparser.h
    cocos/base/DeferredReleasePool.cpp
    cocos/base/DeferredReleasePool.h
    cocos/base/etc1.cpp
    cocos/base/etc1.h
    cocos/base/etc2.cpp
    cocos/base/etc2.h
    cocos/base/IndexHandle.h
    cocos/base/Locked.h
    cocos/base/Macros.h
    cocos/base/Map.h
    cocos/base/Object.h
    cocos/base/Optional.h
    cocos/base/Ptr.h
    cocos/base/Random.h
    cocos/base/RefCounted.cpp
    cocos/base/RefCounted.h
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
    cocos/base/Variant.h
    cocos/base/Vector.h
)

############ application
cocos_source_files(
    cocos/application/BaseApplication.h
    cocos/application/CocosApplication.h
    cocos/application/CocosApplication.cpp
    cocos/application/ApplicationManager.h
    cocos/application/ApplicationManager.cpp
)

############ engine
cocos_source_files(
    cocos/engine/BaseEngine.cpp
    cocos/engine/BaseEngine.h
    cocos/engine/Engine.cpp
    cocos/engine/Engine.h
)

############ main
if(WINDOWS)
    cocos_source_files(
        cocos/main/main-win32.cpp
    )
elseif(LINUX)
    cocos_source_files(
        cocos/main/main-linux.cpp
    )
elseif(QNX)
    cocos_source_files(
        cocos/main/main-qnx.cpp
    )
elseif(MACOSX)
    cocos_source_files(
        cocos/main/main-mac.mm
    )
elseif(IOS)
    cocos_source_files(
        cocos/main/main-ios.mm
    )
endif()

############ platformex
cocos_source_files(
    cocos/platform/IEventDispatch.h
    cocos/platform/BasePlatform.cpp
    cocos/platform/BasePlatform.h
    cocos/platform/UniversalPlatform.cpp
    cocos/platform/UniversalPlatform.h
)
if(WINDOWS)
    cocos_source_files(
        cocos/platform/win32/WindowsPlatform.cpp
        cocos/platform/win32/WindowsPlatform.h
    )
elseif(LINUX)
    cocos_source_files(
        cocos/platform/linux/LinuxPlatform.cpp
        cocos/platform/linux/LinuxPlatform.h
    )
elseif(QNX)
    cocos_source_files(
        cocos/platform/qnx/QnxPlatform.cpp
        cocos/platform/qnx/QnxPlatform.h
    )
elseif(ANDROID)
    cocos_source_files(
        cocos/platform/android/AndroidPlatform.cpp
        cocos/platform/android/AndroidPlatform.h
    )
elseif(OHOS)
    cocos_source_files(
        cocos/platform/ohos/OhosPlatform.cpp
        cocos/platform/ohos/OhosPlatform.h
    )
elseif(MACOSX)
    cocos_source_files(
        cocos/platform/mac/MacPlatform.mm
        cocos/platform/mac/MacPlatform.h
        cocos/platform/mac/ViewController.h
        cocos/platform/mac/ViewController.mm
        cocos/platform/mac/AppDelegate.h
        cocos/platform/mac/AppDelegate.mm
    )
elseif(IOS)
    cocos_source_files(
        cocos/platform/ios/IOSPlatform.mm
        cocos/platform/ios/IOSPlatform.h
        cocos/platform/ios/AppDelegate.mm
        cocos/platform/ios/AppDelegate.h
        cocos/platform/ios/service/SDKWrapper.m
        cocos/platform/ios/service/SDKWrapper.h
        cocos/platform/ios/ViewController.mm
        cocos/platform/ios/ViewController.h
    )
endif()

############ platform : Abstract interface
cocos_source_files(
    cocos/platform/interfaces/OSInterface.cpp
    cocos/platform/interfaces/OSInterface.h
    cocos/platform/interfaces/OSInterfaceManager.cpp
    cocos/platform/interfaces/OSInterfaceManager.h
)

############ platform : Interface definition
cocos_source_files(
    cocos/platform/interfaces/modules/Device.cpp
    cocos/platform/interfaces/modules/Device.h
    cocos/platform/interfaces/modules/IAccelerometer.cpp
    cocos/platform/interfaces/modules/IAccelerometer.h
    cocos/platform/interfaces/modules/IBattery.cpp
    cocos/platform/interfaces/modules/IBattery.h
    cocos/platform/interfaces/modules/IScreen.cpp
    cocos/platform/interfaces/modules/IScreen.h
    cocos/platform/interfaces/modules/INetwork.cpp
    cocos/platform/interfaces/modules/INetwork.h
    cocos/platform/interfaces/modules/ISystem.cpp
    cocos/platform/interfaces/modules/ISystem.h
    cocos/platform/interfaces/modules/ISystemWindow.cpp
    cocos/platform/interfaces/modules/ISystemWindow.h
    cocos/platform/interfaces/modules/IVibrator.cpp
    cocos/platform/interfaces/modules/IVibrator.h
)

cocos_source_files(
    cocos/platform/interfaces/modules/canvas/CanvasRenderingContext2D.cpp
    cocos/platform/interfaces/modules/canvas/CanvasRenderingContext2D.h
    cocos/platform/interfaces/modules/canvas/ICanvasRenderingContext2D.cpp
    cocos/platform/interfaces/modules/canvas/ICanvasRenderingContext2D.h
)
if(WINDOWS)
    cocos_source_files(
        cocos/platform/win32/modules/CanvasRenderingContext2DDelegate.cpp
        cocos/platform/win32/modules/CanvasRenderingContext2DDelegate.h
    )
elseif(ANDROID OR OHOS)
    cocos_source_files(
        cocos/platform/java/modules/CanvasRenderingContext2DDelegate.cpp
        cocos/platform/java/modules/CanvasRenderingContext2DDelegate.h
    )
elseif(MACOSX OR IOS)
    cocos_source_files(
        cocos/platform/apple/modules/CanvasRenderingContext2DDelegate.mm
        cocos/platform/apple/modules/CanvasRenderingContext2DDelegate.h
    )
elseif(QNX)
    cocos_source_files(
        cocos/platform/qnx/modules/CanvasRenderingContext2DDelegate.cpp
        cocos/platform/qnx/modules/CanvasRenderingContext2DDelegate.h
    )
elseif(LINUX)
    cocos_source_files(
        cocos/platform/linux/modules/CanvasRenderingContext2DDelegate.cpp
        cocos/platform/linux/modules/CanvasRenderingContext2DDelegate.h
    )
endif()

############ platform : Interface implementation of windows

if(WINDOWS)
    cocos_source_files(
        cocos/platform/win32/modules/Accelerometer.cpp
        cocos/platform/win32/modules/Accelerometer.h
        cocos/platform/win32/modules/Battery.cpp
        cocos/platform/win32/modules/Battery.h
        cocos/platform/win32/modules/Screen.cpp
        cocos/platform/win32/modules/Screen.h
        cocos/platform/win32/modules/Network.cpp
        cocos/platform/win32/modules/Network.h
        cocos/platform/win32/modules/Vibrator.cpp
        cocos/platform/win32/modules/Vibrator.h
        cocos/platform/win32/modules/System.cpp
        cocos/platform/win32/modules/System.h
        cocos/platform/win32/modules/SystemWindow.cpp
        cocos/platform/win32/modules/SystemWindow.h
    )
elseif(ANDROID OR OHOS)
    cocos_source_files(
        cocos/platform/java/modules/Accelerometer.cpp
        cocos/platform/java/modules/Accelerometer.h
        cocos/platform/java/modules/Battery.cpp
        cocos/platform/java/modules/Battery.h
        cocos/platform/java/modules/CommonScreen.cpp
        cocos/platform/java/modules/CommonScreen.h
        cocos/platform/java/modules/Network.cpp
        cocos/platform/java/modules/Network.h
        cocos/platform/java/modules/Vibrator.cpp
        cocos/platform/java/modules/Vibrator.h
        cocos/platform/java/modules/CommonSystem.cpp
        cocos/platform/java/modules/CommonSystem.h
        cocos/platform/java/modules/SystemWindow.cpp
        cocos/platform/java/modules/SystemWindow.h
    )
endif()
if(ANDROID)
    cocos_source_files(
        cocos/platform/android/modules/Screen.cpp
        cocos/platform/android/modules/Screen.h
        cocos/platform/android/modules/System.cpp
        cocos/platform/android/modules/System.h
    )
elseif(OHOS)
    cocos_source_files(
        cocos/platform/ohos/modules/Screen.cpp
        cocos/platform/ohos/modules/Screen.h
        cocos/platform/ohos/modules/System.cpp
        cocos/platform/ohos/modules/System.h
    )
elseif(MACOSX)
   cocos_source_files(
    NO_WERROR   cocos/platform/mac/modules/Accelerometer.mm
                cocos/platform/mac/modules/Accelerometer.h
                cocos/platform/mac/modules/Battery.mm
                cocos/platform/mac/modules/Battery.h
    NO_WERROR   cocos/platform/mac/modules/Screen.mm
                cocos/platform/mac/modules/Screen.h
                cocos/platform/mac/modules/Network.mm
                cocos/platform/mac/modules/Network.h
                cocos/platform/mac/modules/Vibrator.mm
                cocos/platform/mac/modules/Vibrator.h
                cocos/platform/mac/modules/System.mm
                cocos/platform/mac/modules/System.h
                cocos/platform/mac/modules/SystemWindow.mm
                cocos/platform/mac/modules/SystemWindow.h
   )
elseif(IOS)
   cocos_source_files(
    NO_WERROR   cocos/platform/ios/modules/Accelerometer.mm
                cocos/platform/ios/modules/Accelerometer.h
                cocos/platform/ios/modules/Battery.mm
                cocos/platform/ios/modules/Battery.h
    NO_WERROR   cocos/platform/ios/modules/Screen.mm
                cocos/platform/ios/modules/Screen.h
                cocos/platform/ios/modules/Network.mm
                cocos/platform/ios/modules/Network.h
                cocos/platform/ios/modules/Vibrator.mm
                cocos/platform/ios/modules/Vibrator.h
                cocos/platform/ios/modules/System.mm
                cocos/platform/ios/modules/System.h
                cocos/platform/ios/modules/SystemWindow.mm
                cocos/platform/ios/modules/SystemWindow.h
   )
elseif(LINUX)
    cocos_source_files(
        cocos/platform/linux/modules/Accelerometer.cpp
        cocos/platform/linux/modules/Accelerometer.h
        cocos/platform/linux/modules/Battery.cpp
        cocos/platform/linux/modules/Battery.h
        cocos/platform/linux/modules/Screen.cpp
        cocos/platform/linux/modules/Screen.h
        cocos/platform/linux/modules/Network.cpp
        cocos/platform/linux/modules/Network.h
        cocos/platform/linux/modules/Vibrate.cpp
        cocos/platform/linux/modules/Vibrate.h
        cocos/platform/linux/modules/System.cpp
        cocos/platform/linux/modules/System.h
        cocos/platform/linux/modules/SystemWindow.cpp
        cocos/platform/linux/modules/SystemWindow.h
    )
elseif(QNX)
    cocos_source_files(
        cocos/platform/qnx/modules/Accelerometer.cpp
        cocos/platform/qnx/modules/Accelerometer.h
        cocos/platform/qnx/modules/Battery.cpp
        cocos/platform/qnx/modules/Battery.h
        cocos/platform/qnx/modules/Screen.cpp
        cocos/platform/qnx/modules/Screen.h
        cocos/platform/qnx/modules/Network.cpp
        cocos/platform/qnx/modules/Network.h
        cocos/platform/qnx/modules/Vibrate.cpp
        cocos/platform/qnx/modules/Vibrate.h
        cocos/platform/qnx/modules/System.cpp
        cocos/platform/qnx/modules/System.h
        cocos/platform/qnx/modules/SystemWindow.cpp
        cocos/platform/qnx/modules/SystemWindow.h
    )
endif()

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
                 cocos/base/memory/MemoryHook.cpp
                 cocos/base/memory/MemoryHook.h
                 cocos/base/memory/CallStack.cpp
                 cocos/base/memory/CallStack.h
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
    cocos/math/Utils.h
    cocos/math/Utils.cpp
    cocos/math/Geometry.cpp
    cocos/math/Geometry.h
    cocos/math/Color.cpp
    cocos/math/Color.h
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

if(WINDOWS OR LINUX OR QNX)
    cocos_source_files(
        NO_WERROR    cocos/network/Downloader-curl.cpp
                     cocos/network/Downloader-curl.h
    )
endif()

if(WINDOWS OR MACOSX OR LINUX OR QNX)
    cocos_source_files(
        NO_WERROR    cocos/network/HttpClient.cpp
    )
endif()


##### platform
cocos_source_files(
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
    cocos/base/Timer.cpp
    cocos/base/Timer.h
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
        ${CWD}/cocos/platform/java/jni/glue/JniNativeGlue.cpp
        ${CWD}/cocos/platform/java/jni/glue/JniNativeGlue.h
        ${CWD}/cocos/platform/java/jni/glue/MessagePipe.cpp
        ${CWD}/cocos/platform/java/jni/glue/MessagePipe.h
    )

    cocos_source_files(MODULE ccfilesystem
        cocos/platform/android/FileUtils-android.cpp
        cocos/platform/android/FileUtils-android.h
    )
elseif(OHOS)
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
        ${CWD}/cocos/platform/java/jni/glue/JniNativeGlue.cpp
        ${CWD}/cocos/platform/java/jni/glue/JniNativeGlue.h
        ${CWD}/cocos/platform/java/jni/glue/MessagePipe.cpp
        ${CWD}/cocos/platform/java/jni/glue/MessagePipe.h
    )
    cocos_source_files(MODULE ccfilesystem
        cocos/platform/ohos/FileUtils-ohos.cpp
        cocos/platform/ohos/FileUtils-ohos.h
    )
elseif(APPLE)
    cocos_source_files(
        cocos/platform/apple/Reachability.h
        cocos/platform/apple/Reachability.cpp
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
            cocos/platform/mac/KeyCodeHelper.cpp
        )
    elseif(IOS)
        cocos_source_files(
                         cocos/platform/ios/View.h
            NO_WERROR    cocos/platform/ios/View.mm     # CAMetalLayer bug for apple
        )
    endif()
elseif(LINUX)
    cocos_source_files(MODULE ccfilesystem
        cocos/platform/linux/FileUtils-linux.cpp
        cocos/platform/linux/FileUtils-linux.h
    )
elseif(QNX)
    cocos_source_files(MODULE ccfilesystem
        cocos/platform/qnx/FileUtils-qnx.cpp
        cocos/platform/qnx/FileUtils-qnx.h
    )
endif()

##### renderer
cocos_source_files(
                 cocos/renderer/core/PassUtils.h
                 cocos/renderer/core/PassUtils.cpp
                 cocos/renderer/core/ProgramLib.h
                 cocos/renderer/core/ProgramLib.cpp
                 cocos/renderer/core/MaterialInstance.h
                 cocos/renderer/core/MaterialInstance.cpp
                 cocos/renderer/core/PassInstance.h
                 cocos/renderer/core/PassInstance.cpp
                 cocos/renderer/core/TextureBufferPool.h
                 cocos/renderer/core/TextureBufferPool.cpp

                 cocos/renderer/GFXDeviceManager.h

                 cocos/renderer/gfx-base/SPIRVUtils.h
                 cocos/renderer/gfx-base/SPIRVUtils.cpp
                 cocos/renderer/gfx-base/GFXObject.h
                 cocos/renderer/gfx-base/GFXObject.cpp
                 cocos/renderer/gfx-base/GFXBuffer.cpp
                 cocos/renderer/gfx-base/GFXBuffer.h
                 cocos/renderer/gfx-base/GFXCommandBuffer.cpp
                 cocos/renderer/gfx-base/GFXCommandBuffer.h
                 cocos/renderer/gfx-base/GFXDef.cpp
                 cocos/renderer/gfx-base/GFXDef.h
                 cocos/renderer/gfx-base/GFXDef-common.h
                 cocos/renderer/gfx-base/GFXDevice.cpp
                 cocos/renderer/gfx-base/GFXDevice.h
                 cocos/renderer/gfx-base/GFXFramebuffer.cpp
                 cocos/renderer/gfx-base/GFXFramebuffer.h
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
                 cocos/renderer/gfx-base/GFXQueryPool.cpp
                 cocos/renderer/gfx-base/GFXQueryPool.h
                 cocos/renderer/gfx-base/GFXRenderPass.cpp
                 cocos/renderer/gfx-base/GFXRenderPass.h
                 cocos/renderer/gfx-base/GFXShader.cpp
                 cocos/renderer/gfx-base/GFXShader.h
                 cocos/renderer/gfx-base/GFXSwapchain.cpp
                 cocos/renderer/gfx-base/GFXSwapchain.h
                 cocos/renderer/gfx-base/GFXTexture.cpp
                 cocos/renderer/gfx-base/GFXTexture.h
                 cocos/renderer/gfx-base/states/GFXGlobalBarrier.cpp
                 cocos/renderer/gfx-base/states/GFXGlobalBarrier.h
                 cocos/renderer/gfx-base/states/GFXSampler.cpp
                 cocos/renderer/gfx-base/states/GFXSampler.h
                 cocos/renderer/gfx-base/states/GFXTextureBarrier.cpp
                 cocos/renderer/gfx-base/states/GFXTextureBarrier.h

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
                 cocos/renderer/gfx-agent/QueryPoolAgent.h
                 cocos/renderer/gfx-agent/QueryPoolAgent.cpp
                 cocos/renderer/gfx-agent/RenderPassAgent.h
                 cocos/renderer/gfx-agent/RenderPassAgent.cpp
                 cocos/renderer/gfx-agent/SwapchainAgent.h
                 cocos/renderer/gfx-agent/SwapchainAgent.cpp
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
                 cocos/renderer/gfx-validator/QueryPoolValidator.h
                 cocos/renderer/gfx-validator/QueryPoolValidator.cpp
                 cocos/renderer/gfx-validator/RenderPassValidator.h
                 cocos/renderer/gfx-validator/RenderPassValidator.cpp
                 cocos/renderer/gfx-validator/ShaderValidator.h
                 cocos/renderer/gfx-validator/ShaderValidator.cpp
                 cocos/renderer/gfx-validator/SwapchainValidator.h
                 cocos/renderer/gfx-validator/SwapchainValidator.cpp
                 cocos/renderer/gfx-validator/TextureValidator.h
                 cocos/renderer/gfx-validator/TextureValidator.cpp
                 cocos/renderer/gfx-validator/ValidationUtils.h
                 cocos/renderer/gfx-validator/ValidationUtils.cpp

                 cocos/renderer/gfx-empty/EmptyBuffer.h
                 cocos/renderer/gfx-empty/EmptyBuffer.cpp
                 cocos/renderer/gfx-empty/EmptyCommandBuffer.h
                 cocos/renderer/gfx-empty/EmptyCommandBuffer.cpp
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
                 cocos/renderer/gfx-empty/EmptyQueryPool.h
                 cocos/renderer/gfx-empty/EmptyQueryPool.cpp
                 cocos/renderer/gfx-empty/EmptyRenderPass.h
                 cocos/renderer/gfx-empty/EmptyRenderPass.cpp
                 cocos/renderer/gfx-empty/EmptyShader.h
                 cocos/renderer/gfx-empty/EmptyShader.cpp
                 cocos/renderer/gfx-empty/EmptySwapchain.h
                 cocos/renderer/gfx-empty/EmptySwapchain.cpp
                 cocos/renderer/gfx-empty/EmptyTexture.h
                 cocos/renderer/gfx-empty/EmptyTexture.cpp

                 cocos/renderer/pipeline/BatchedBuffer.cpp
                 cocos/renderer/pipeline/BatchedBuffer.h
                 cocos/renderer/pipeline/ClusterLightCulling.cpp
                 cocos/renderer/pipeline/ClusterLightCulling.h
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
                 cocos/renderer/pipeline/deferred/DeferredPipeline.cpp
                 cocos/renderer/pipeline/deferred/DeferredPipeline.h
                 cocos/renderer/pipeline/deferred/MainFlow.cpp
                 cocos/renderer/pipeline/deferred/MainFlow.h
                 cocos/renderer/pipeline/deferred/DeferredPipelineSceneData.cpp
                 cocos/renderer/pipeline/deferred/DeferredPipelineSceneData.h
                 cocos/renderer/pipeline/deferred/GbufferStage.cpp
                 cocos/renderer/pipeline/deferred/GbufferStage.h
                 cocos/renderer/pipeline/deferred/LightingStage.cpp
                 cocos/renderer/pipeline/deferred/LightingStage.h
                 cocos/renderer/pipeline/deferred/ReflectionComp.cpp
                 cocos/renderer/pipeline/deferred/ReflectionComp.h
                 cocos/renderer/pipeline/shadow/ShadowFlow.cpp
                 cocos/renderer/pipeline/shadow/ShadowFlow.h
                 cocos/renderer/pipeline/shadow/ShadowStage.cpp
                 cocos/renderer/pipeline/shadow/ShadowStage.h
                 cocos/renderer/pipeline/Enum.h
                 cocos/renderer/pipeline/deferred/BloomStage.cpp
                 cocos/renderer/pipeline/deferred/BloomStage.h
                 cocos/renderer/pipeline/deferred/PostProcessStage.cpp
                 cocos/renderer/pipeline/deferred/PostProcessStage.h
                 cocos/renderer/pipeline/UIPhase.cpp
                 cocos/renderer/pipeline/UIPhase.h
                 cocos/renderer/pipeline/GeometryRenderer.h
                 cocos/renderer/pipeline/GeometryRenderer.cpp
                 cocos/renderer/pipeline/helper/Utils.h
                 cocos/renderer/pipeline/helper/Utils.cpp
                 cocos/renderer/pipeline/custom/LayoutGraphFwd.h
                 cocos/renderer/pipeline/custom/LayoutGraphGraphs.h
                 cocos/renderer/pipeline/custom/LayoutGraphJsb.cpp
                 cocos/renderer/pipeline/custom/LayoutGraphJsb.h
                 cocos/renderer/pipeline/custom/LayoutGraphNames.h
                 cocos/renderer/pipeline/custom/LayoutGraphReflection.cpp
                 cocos/renderer/pipeline/custom/LayoutGraphReflection.h
                 cocos/renderer/pipeline/custom/LayoutGraphTypes.cpp
                 cocos/renderer/pipeline/custom/LayoutGraphTypes.h
                 cocos/renderer/pipeline/custom/RenderCommonFwd.h
                 cocos/renderer/pipeline/custom/RenderCommonJsb.cpp
                 cocos/renderer/pipeline/custom/RenderCommonJsb.h
                 cocos/renderer/pipeline/custom/RenderCommonNames.h
                 cocos/renderer/pipeline/custom/RenderCommonReflection.cpp
                 cocos/renderer/pipeline/custom/RenderCommonReflection.h
                 cocos/renderer/pipeline/custom/RenderCommonTypes.cpp
                 cocos/renderer/pipeline/custom/RenderCommonTypes.h
                 cocos/renderer/pipeline/custom/RenderCompilerFwd.h
                 cocos/renderer/pipeline/custom/RenderCompilerGraphs.h
                 cocos/renderer/pipeline/custom/RenderCompilerImpl.cpp
                 cocos/renderer/pipeline/custom/RenderCompilerNames.h
                 cocos/renderer/pipeline/custom/RenderCompilerReflection.cpp
                 cocos/renderer/pipeline/custom/RenderCompilerReflection.h
                 cocos/renderer/pipeline/custom/RenderCompilerTypes.cpp
                 cocos/renderer/pipeline/custom/RenderCompilerTypes.h
                 cocos/renderer/pipeline/custom/RenderExampleFwd.h
                 cocos/renderer/pipeline/custom/RenderExampleGraphs.h
                 cocos/renderer/pipeline/custom/RenderExampleImpl.cpp
                 cocos/renderer/pipeline/custom/RenderExampleNames.h
                 cocos/renderer/pipeline/custom/RenderExampleReflection.cpp
                 cocos/renderer/pipeline/custom/RenderExampleReflection.h
                 cocos/renderer/pipeline/custom/RenderExampleTypes.cpp
                 cocos/renderer/pipeline/custom/RenderExampleTypes.h
                 cocos/renderer/pipeline/custom/RenderExecutorFwd.h
                 cocos/renderer/pipeline/custom/RenderExecutorGraphs.h
                 cocos/renderer/pipeline/custom/RenderExecutorJsb.cpp
                 cocos/renderer/pipeline/custom/RenderExecutorJsb.h
                 cocos/renderer/pipeline/custom/RenderExecutorNames.h
                 cocos/renderer/pipeline/custom/RenderExecutorReflection.cpp
                 cocos/renderer/pipeline/custom/RenderExecutorReflection.h
                 cocos/renderer/pipeline/custom/RenderExecutorTypes.cpp
                 cocos/renderer/pipeline/custom/RenderExecutorTypes.h
                 cocos/renderer/pipeline/custom/RenderGraphFwd.h
                 cocos/renderer/pipeline/custom/RenderGraphGraphs.h
                 cocos/renderer/pipeline/custom/RenderGraphJsb.cpp
                 cocos/renderer/pipeline/custom/RenderGraphJsb.h
                 cocos/renderer/pipeline/custom/RenderGraphNames.h
                 cocos/renderer/pipeline/custom/RenderGraphReflection.cpp
                 cocos/renderer/pipeline/custom/RenderGraphReflection.h
                 cocos/renderer/pipeline/custom/RenderGraphTypes.cpp
                 cocos/renderer/pipeline/custom/RenderGraphTypes.h
)

##### terrain
#
# cocos_source_files(
#     cocos/terrain/HeightField.cpp
#     cocos/terrain/HeightField.h
#     cocos/terrain/Terrain.cpp
#     cocos/terrain/Terrain.h
#     cocos/terrain/TerrainAsset.cpp
#     cocos/terrain/TerrainAsset.h
#     cocos/terrain/TerrainLod.cpp
#     cocos/terrain/TerrainLod.h
# )


##### scene
cocos_source_files(
                 cocos/scene/Ambient.h
                 cocos/scene/Ambient.cpp
                 cocos/scene/Camera.h
                 cocos/scene/Camera.cpp
                 cocos/scene/Define.h
                 cocos/scene/Define.cpp
                 cocos/scene/DirectionalLight.h
                 cocos/scene/DirectionalLight.cpp
                 cocos/scene/DrawBatch2D.h
                 cocos/scene/Fog.h
                 cocos/scene/Fog.cpp
                 cocos/scene/Light.h
                 cocos/scene/Light.cpp
                 cocos/scene/Model.h
                 cocos/scene/Model.cpp
                 cocos/scene/Pass.h
                 cocos/scene/Pass.cpp
                 cocos/scene/RenderScene.h
                 cocos/scene/RenderScene.cpp
                 cocos/scene/RenderWindow.cpp
                 cocos/scene/RenderWindow.h
                 cocos/scene/Skybox.h
                 cocos/scene/Skybox.cpp
                 cocos/scene/SphereLight.h
                 cocos/scene/SphereLight.cpp
                 cocos/scene/SpotLight.h
                 cocos/scene/SpotLight.cpp
                 cocos/scene/SubModel.h
                 cocos/scene/SubModel.cpp
                 cocos/scene/Octree.h
                 cocos/scene/Octree.cpp
                 cocos/scene/Shadow.h
                 cocos/scene/Shadow.cpp
)

##### primitive
cocos_source_files(
    cocos/primitive/Box.cpp
    cocos/primitive/Box.h
    cocos/primitive/Capsule.cpp
    cocos/primitive/Capsule.h
    cocos/primitive/Circle.cpp
    cocos/primitive/Circle.h
    cocos/primitive/Cone.cpp
    cocos/primitive/Cone.h
    cocos/primitive/Cylinder.cpp
    cocos/primitive/Cylinder.h
    cocos/primitive/Plane.cpp
    cocos/primitive/Plane.h
    cocos/primitive/Primitive.cpp
    cocos/primitive/Primitive.h
    cocos/primitive/PrimitiveDefine.h
    cocos/primitive/PrimitiveUtils.cpp
    cocos/primitive/PrimitiveUtils.h
    cocos/primitive/Quad.cpp
    cocos/primitive/Quad.h
    cocos/primitive/Sphere.cpp
    cocos/primitive/Sphere.h
    cocos/primitive/Torus.cpp
    cocos/primitive/Torus.h
    cocos/primitive/Transform.cpp
    cocos/primitive/Transform.h
)

##### components
cocos_source_files(
    # cocos/core/components/Component.h
    # cocos/core/components/Component.cpp
    # cocos/core/components/RenderableComponent.h
    # cocos/core/components/RenderableComponent.cpp
    # cocos/core/components/CameraComponent.h
    # cocos/core/components/CameraComponent.cpp
    cocos/3d/models/BakedSkinningModel.h
    cocos/3d/models/BakedSkinningModel.cpp
    cocos/3d/models/MorphModel.h
    cocos/3d/models/MorphModel.cpp
    cocos/3d/models/SkinningModel.h
    cocos/3d/models/SkinningModel.cpp
    # cocos/3d/framework/MeshRenderer.h
    # cocos/3d/framework/MeshRenderer.cpp
)

##### animations
cocos_source_files(
    cocos/core/animation/SkeletalAnimationUtils.h
    cocos/core/animation/SkeletalAnimationUtils.cpp
)

##### lights
# cocos_source_files(
#     cocos/3d/lights/LightComponent.h
#     cocos/3d/lights/LightComponent.cpp
#     cocos/3d/lights/DirectionalLightComponent.h
#     cocos/3d/lights/DirectionalLightComponent.cpp
#     cocos/3d/lights/SpotLightComponent.h
#     cocos/3d/lights/SpotLightComponent.cpp
#     cocos/3d/lights/SphereLightComponent.h
#     cocos/3d/lights/SphereLightComponent.cpp
# )

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
                     cocos/renderer/gfx-gles2/GLES2Buffer.cpp
                     cocos/renderer/gfx-gles2/GLES2Buffer.h
                     cocos/renderer/gfx-gles2/GLES2CommandBuffer.cpp
                     cocos/renderer/gfx-gles2/GLES2CommandBuffer.h
                     cocos/renderer/gfx-gles2/GLES2Commands.cpp
                     cocos/renderer/gfx-gles2/GLES2Commands.h
                     cocos/renderer/gfx-gles2/GLES2Device.cpp
                     cocos/renderer/gfx-gles2/GLES2Device.h
                     cocos/renderer/gfx-gles2/GLES2Framebuffer.cpp
                     cocos/renderer/gfx-gles2/GLES2Framebuffer.h
                     cocos/renderer/gfx-gles2/GLES2GPUContext.cpp
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
                     cocos/renderer/gfx-gles2/GLES2QueryPool.cpp
                     cocos/renderer/gfx-gles2/GLES2QueryPool.h
                     cocos/renderer/gfx-gles2/GLES2RenderPass.cpp
                     cocos/renderer/gfx-gles2/GLES2RenderPass.h
                     cocos/renderer/gfx-gles2/GLES2Shader.cpp
                     cocos/renderer/gfx-gles2/GLES2Shader.h
                     cocos/renderer/gfx-gles2/GLES2Swapchain.cpp
                     cocos/renderer/gfx-gles2/GLES2Swapchain.h
                     cocos/renderer/gfx-gles2/GLES2Std.cpp
                     cocos/renderer/gfx-gles2/GLES2Std.h
                     cocos/renderer/gfx-gles2/GLES2Texture.cpp
                     cocos/renderer/gfx-gles2/GLES2Texture.h
                     cocos/renderer/gfx-gles2/GLES2Wrangler.cpp
                     cocos/renderer/gfx-gles2/GLES2Wrangler.h
                     cocos/renderer/gfx-gles2/states/GLES2Sampler.cpp
                     cocos/renderer/gfx-gles2/states/GLES2Sampler.h
    )
endif()

if(CC_USE_GLES3)
    cocos_source_files(
                     cocos/renderer/gfx-gles3/GLES3Buffer.cpp
                     cocos/renderer/gfx-gles3/GLES3Buffer.h
                     cocos/renderer/gfx-gles3/GLES3CommandBuffer.cpp
                     cocos/renderer/gfx-gles3/GLES3CommandBuffer.h
                     cocos/renderer/gfx-gles3/GLES3Commands.cpp
                     cocos/renderer/gfx-gles3/GLES3Commands.h
                     cocos/renderer/gfx-gles3/GLES3Device.cpp
                     cocos/renderer/gfx-gles3/GLES3Device.h
                     cocos/renderer/gfx-gles3/GLES3Framebuffer.cpp
                     cocos/renderer/gfx-gles3/GLES3Framebuffer.h
                     cocos/renderer/gfx-gles3/GLES3GPUContext.cpp
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
                     cocos/renderer/gfx-gles3/GLES3QueryPool.cpp
                     cocos/renderer/gfx-gles3/GLES3QueryPool.h
                     cocos/renderer/gfx-gles3/GLES3RenderPass.cpp
                     cocos/renderer/gfx-gles3/GLES3RenderPass.h
                     cocos/renderer/gfx-gles3/GLES3Shader.cpp
                     cocos/renderer/gfx-gles3/GLES3Shader.h
                     cocos/renderer/gfx-gles3/GLES3Swapchain.cpp
                     cocos/renderer/gfx-gles3/GLES3Swapchain.h
                     cocos/renderer/gfx-gles3/GLES3Std.cpp
                     cocos/renderer/gfx-gles3/GLES3Std.h
                     cocos/renderer/gfx-gles3/GLES3Texture.cpp
                     cocos/renderer/gfx-gles3/GLES3Texture.h
                     cocos/renderer/gfx-gles3/GLES3Wrangler.cpp
                     cocos/renderer/gfx-gles3/GLES3Wrangler.h
                     cocos/renderer/gfx-gles3/states/GLES3GlobalBarrier.cpp
                     cocos/renderer/gfx-gles3/states/GLES3GlobalBarrier.h
                     cocos/renderer/gfx-gles3/states/GLES3Sampler.cpp
                     cocos/renderer/gfx-gles3/states/GLES3Sampler.h
    )
endif()

if(CC_USE_METAL)
    cocos_source_files(
                     cocos/renderer/gfx-metal/MTLBuffer.h
                     cocos/renderer/gfx-metal/MTLBuffer.mm
                     cocos/renderer/gfx-metal/MTLCommandBuffer.h
                     cocos/renderer/gfx-metal/MTLCommandBuffer.mm
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
                     cocos/renderer/gfx-metal/MTLQueryPool.h
                     cocos/renderer/gfx-metal/MTLQueryPool.mm
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
                     cocos/renderer/gfx-metal/MTLSwapchain.h
                     cocos/renderer/gfx-metal/MTLSwapchain.mm
    )
endif()

if(CC_USE_VULKAN)

    cocos_source_files(
                     cocos/renderer/gfx-vulkan/vk_mem_alloc.h
                     cocos/renderer/gfx-vulkan/VKBuffer.cpp
                     cocos/renderer/gfx-vulkan/VKBuffer.h
                     cocos/renderer/gfx-vulkan/VKCommandBuffer.cpp
                     cocos/renderer/gfx-vulkan/VKCommandBuffer.h
                     cocos/renderer/gfx-vulkan/VKCommands.cpp
                     cocos/renderer/gfx-vulkan/VKCommands.h
                     cocos/renderer/gfx-vulkan/VKDevice.cpp
                     cocos/renderer/gfx-vulkan/VKDevice.h
                     cocos/renderer/gfx-vulkan/VKFramebuffer.cpp
                     cocos/renderer/gfx-vulkan/VKFramebuffer.h
                     cocos/renderer/gfx-vulkan/VKGPUContext.cpp
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
                     cocos/renderer/gfx-vulkan/VKQueryPool.cpp
                     cocos/renderer/gfx-vulkan/VKQueryPool.h
                     cocos/renderer/gfx-vulkan/VKRenderPass.cpp
                     cocos/renderer/gfx-vulkan/VKRenderPass.h
                     cocos/renderer/gfx-vulkan/VKShader.cpp
                     cocos/renderer/gfx-vulkan/VKShader.h
                     cocos/renderer/gfx-vulkan/VKStd.cpp
                     cocos/renderer/gfx-vulkan/VKStd.h
                     cocos/renderer/gfx-vulkan/VKSwapchain.cpp
                     cocos/renderer/gfx-vulkan/VKSwapchain.h
                     cocos/renderer/gfx-vulkan/VKTexture.cpp
                     cocos/renderer/gfx-vulkan/VKTexture.h
                     cocos/renderer/gfx-vulkan/VKUtils.cpp
                     cocos/renderer/gfx-vulkan/VKUtils.h
                     cocos/renderer/gfx-vulkan/volk.c
                     cocos/renderer/gfx-vulkan/volk.h
                     cocos/renderer/gfx-vulkan/states/VKGlobalBarrier.cpp
                     cocos/renderer/gfx-vulkan/states/VKGlobalBarrier.h
                     cocos/renderer/gfx-vulkan/states/VKSampler.cpp
                     cocos/renderer/gfx-vulkan/states/VKSampler.h
                     cocos/renderer/gfx-vulkan/states/VKTextureBarrier.cpp
                     cocos/renderer/gfx-vulkan/states/VKTextureBarrier.h
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

if(NX)
    include(${CMAKE_CURRENT_LIST_DIR}/platform-nx/source.cmake)
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
    )
    cocos_source_files(
        cocos/bindings/auto/jsb_physics_auto.cpp
        cocos/bindings/auto/jsb_physics_auto.h
    )
endif()


##### 2d
# cocos_source_files(
#     cocos/2d/framework/UITransform.h
#     cocos/2d/framework/UITransform.cpp
# )

##### 3d
cocos_source_files(
    cocos/3d/assets/Types.h
    cocos/3d/assets/Types.cpp
    cocos/3d/assets/Mesh.h
    cocos/3d/assets/Mesh.cpp
    cocos/3d/assets/Morph.h
    cocos/3d/assets/Morph.cpp
    cocos/3d/assets/MorphRendering.h
    cocos/3d/assets/MorphRendering.cpp
    cocos/3d/assets/Skeleton.h
    cocos/3d/assets/Skeleton.cpp

    cocos/3d/misc/CreateMesh.h
    cocos/3d/misc/CreateMesh.cpp
    cocos/3d/misc/BufferBlob.h
    cocos/3d/misc/BufferBlob.cpp
    cocos/3d/misc/Buffer.h
    cocos/3d/misc/Buffer.cpp

    # cocos/3d/skeletal-animation/DataPoolManager.h
    # cocos/3d/skeletal-animation/DataPoolManager.cpp
    cocos/3d/skeletal-animation/SkeletalAnimationUtils.h
    cocos/3d/skeletal-animation/SkeletalAnimationUtils.cpp
)

##### core

cocos_source_files(
    cocos/core/Any.h
    cocos/core/ArrayBuffer.h

    cocos/core/CoreModuleHeader.h
    cocos/core/DataView.h
    cocos/core/DataView.cpp
    # cocos/core/Director.cpp
    # cocos/core/Director.h
    # cocos/core/Game.cpp
    # cocos/core/Game.h
    cocos/core/Root.cpp
    cocos/core/Root.h

    cocos/core/System.h

    # cocos/core/Scheduler.cpp
    # cocos/core/Scheduler.h
    # cocos/core/SplashScreen.cpp
    # cocos/core/SplashScreen.h
    cocos/core/Types.h
    cocos/core/Types.cpp
    cocos/core/TypedArray.h
    cocos/core/TypedArray.cpp

    # memop
    cocos/core/memop/CachedArray.h
    cocos/core/memop/CachedArray.cpp
    cocos/core/memop/Pool.h
    cocos/core/memop/Pool.cpp
    cocos/core/memop/RecyclePool.h
    cocos/core/memop/RecyclePool.cpp


    # cocos/core/asset-manager/AssetManager.cpp
    # cocos/core/asset-manager/AssetManager.h
    # cocos/core/asset-manager/AssetManagerModuleHeader.h
    # cocos/core/asset-manager/Bundle.cpp
    # cocos/core/asset-manager/Bundle.h
    # cocos/core/asset-manager/Cache.cpp
    # cocos/core/asset-manager/Cache.h
    # cocos/core/asset-manager/CacheManager.cpp
    # cocos/core/asset-manager/CacheManager.h
    # cocos/core/asset-manager/AssetManagerConfig.cpp
    # cocos/core/asset-manager/AssetManagerConfig.h
    # cocos/core/asset-manager/DependMaps.cpp
    # cocos/core/asset-manager/DependMaps.h
    # cocos/core/asset-manager/DependUtil.cpp
    # cocos/core/asset-manager/DependUtil.h
    # cocos/core/asset-manager/Deserialize.cpp
    # cocos/core/asset-manager/Deserialize.h
    # cocos/core/asset-manager/DownloadFile.cpp
    # cocos/core/asset-manager/DownloadFile.h
    # cocos/core/asset-manager/DownloadImage.cpp
    # cocos/core/asset-manager/DownloadImage.h
    # cocos/core/asset-manager/DownloadScript.cpp
    # cocos/core/asset-manager/DownloadScript.h
    # cocos/core/asset-manager/Downloader.cpp
    # cocos/core/asset-manager/Downloader.h
    # cocos/core/asset-manager/Factory.cpp
    # cocos/core/asset-manager/Factory.h
    # cocos/core/asset-manager/Fetch.cpp
    # cocos/core/asset-manager/Fetch.h
    # cocos/core/asset-manager/Helper.cpp
    # cocos/core/asset-manager/Helper.h
    # cocos/core/asset-manager/Load.cpp
    # cocos/core/asset-manager/Load.h
    # cocos/core/asset-manager/PackManager.cpp
    # cocos/core/asset-manager/PackManager.h
    # cocos/core/asset-manager/Parser.cpp
    # cocos/core/asset-manager/Parser.h
    # cocos/core/asset-manager/Pipeline.cpp
    # cocos/core/asset-manager/Pipeline.h
    # cocos/core/asset-manager/PlistParser.cpp
    # cocos/core/asset-manager/PlistParser.h
    # cocos/core/asset-manager/PreProcess.cpp
    # cocos/core/asset-manager/PreProcess.h
    # cocos/core/asset-manager/ReleaseManager.cpp
    # cocos/core/asset-manager/ReleaseManager.h
    # cocos/core/asset-manager/RequestItem.cpp
    # cocos/core/asset-manager/RequestItem.h
    # cocos/core/asset-manager/Shared.cpp
    # cocos/core/asset-manager/Shared.h
    # cocos/core/asset-manager/Task.cpp
    # cocos/core/asset-manager/Task.h
    # cocos/core/asset-manager/UrlTransformer.cpp
    # cocos/core/asset-manager/UrlTransformer.h
    # cocos/core/asset-manager/Utilities.cpp
    # cocos/core/asset-manager/Utilities.h
    # cocos/core/asset-manager/WeakCache.cpp
    # cocos/core/asset-manager/WeakCache.h

    cocos/core/assets/Asset.cpp
    cocos/core/assets/Asset.h
    cocos/core/assets/AssetEnum.cpp
    cocos/core/assets/AssetEnum.h
    cocos/core/assets/AssetsModuleHeader.h
    cocos/core/assets/BufferAsset.cpp
    cocos/core/assets/BufferAsset.h
    cocos/core/assets/EffectAsset.cpp
    cocos/core/assets/EffectAsset.h
    cocos/core/assets/ImageAsset.cpp
    cocos/core/assets/ImageAsset.h
    # cocos/core/assets/JsonAsset.cpp
    # cocos/core/assets/JsonAsset.h
    cocos/core/assets/Material.cpp
    cocos/core/assets/Material.h
    # cocos/core/assets/Prefab.cpp
    # cocos/core/assets/Prefab.h
    cocos/core/assets/RenderTexture.cpp
    cocos/core/assets/RenderTexture.h
    cocos/core/assets/RenderingSubMesh.cpp
    cocos/core/assets/RenderingSubMesh.h
    cocos/core/assets/SceneAsset.cpp
    cocos/core/assets/SceneAsset.h
    cocos/core/assets/SimpleTexture.cpp
    cocos/core/assets/SimpleTexture.h
    cocos/core/assets/TextAsset.cpp
    cocos/core/assets/TextAsset.h
    cocos/core/assets/Texture2D.cpp
    cocos/core/assets/Texture2D.h
    cocos/core/assets/TextureBase.cpp
    cocos/core/assets/TextureBase.h
    cocos/core/assets/TextureCube.cpp
    cocos/core/assets/TextureCube.h

    # builtin
    cocos/core/builtin/BuiltinResMgr.cpp
    cocos/core/builtin/BuiltinResMgr.h
    cocos/core/builtin/ShaderSourceAssembly.cpp
    cocos/core/builtin/ShaderSourceAssembly.h
    # cocos/core/builtin/Effects.cpp # generated
    cocos/core/builtin/Effects.h
    # cocos/core/builtin/shader-sources/glsl1.cpp # generated
    cocos/core/builtin/shader-sources/glsl1.h
    # cocos/core/builtin/shader-sources/glsl3.cpp # generated
    cocos/core/builtin/shader-sources/glsl3.h
    # cocos/core/builtin/shader-sources/glsl4.cpp # generated
    cocos/core/builtin/shader-sources/glsl4.h
    #

    cocos/core/data/Object.cpp
    cocos/core/data/Object.h
    cocos/core/data/deserializer/EffectAssetDeserializer.cpp
    cocos/core/data/deserializer/EffectAssetDeserializer.h
    # cocos/core/data/deserializer/MeshDeserializer.cpp
    # cocos/core/data/deserializer/MeshDeserializer.h
    # cocos/core/data/deserializer/MaterialDeserializer.cpp
    # cocos/core/data/deserializer/MaterialDeserializer.h
    # cocos/core/data/deserializer/ImageAssetDeserializer.cpp
    # cocos/core/data/deserializer/ImageAssetDeserializer.h
    # cocos/core/data/deserializer/TextureBaseDeserializer.h
    # cocos/core/data/deserializer/TextureBaseDeserializer.cpp
    # cocos/core/data/deserializer/Texture2DDeserializer.cpp
    # cocos/core/data/deserializer/Texture2DDeserializer.h
    # cocos/core/data/deserializer/TerrainAssetDeserializer.cpp
    # cocos/core/data/deserializer/TerrainAssetDeserializer.h
    cocos/core/data/deserializer/IAssetDeserializer.h
    cocos/core/data/deserializer/AssetDeserializerFactory.cpp
    cocos/core/data/deserializer/AssetDeserializerFactory.h

    cocos/core/event/CallbacksInvoker.cpp
    cocos/core/event/CallbacksInvoker.h
    cocos/core/event/EventTypesToJS.h
    cocos/core/event/EventTypesToJS.cpp
    # cocos/core/event/Event.cpp
    # cocos/core/event/Event.h
    cocos/core/event/EventModuleHeader.h
    cocos/core/event/EventTarget.cpp
    cocos/core/event/EventTarget.h
    cocos/core/event/EventTargetFactory.cpp
    cocos/core/event/EventTargetFactory.h

    # cocos/core/scene-graph/Find.cpp
    # cocos/core/scene-graph/Find.h
    cocos/core/scene-graph/Layers.h
    cocos/core/scene-graph/Node.cpp
    cocos/core/scene-graph/Node.h
    cocos/core/scene-graph/BaseNode.h
    # cocos/core/scene-graph/ComponentScheduler.h
    # cocos/core/scene-graph/ComponentScheduler.cpp
    # cocos/core/scene-graph/NodeActivator.cpp
    # cocos/core/scene-graph/NodeActivator.h
    cocos/core/scene-graph/NodeEnum.h
    cocos/core/scene-graph/NodeEvent.cpp
    cocos/core/scene-graph/NodeEvent.h
    cocos/core/scene-graph/NodeEventProcessor.cpp
    cocos/core/scene-graph/NodeEventProcessor.h
    # cocos/core/scene-graph/NodeUIProperties.cpp
    # cocos/core/scene-graph/NodeUIProperties.h
    cocos/core/scene-graph/Scene.cpp
    cocos/core/scene-graph/Scene.h
    cocos/core/scene-graph/SceneGlobals.cpp
    cocos/core/scene-graph/SceneGlobals.h
    cocos/core/scene-graph/SceneGraphModuleHeader.h

    cocos/core/utils/IDGenerator.cpp
    cocos/core/utils/IDGenerator.h
    cocos/core/utils/Path.cpp
    cocos/core/utils/Path.h
    cocos/core/utils/MutableForwardIterator.cpp
    cocos/core/utils/MutableForwardIterator.h
    cocos/core/utils/Pool.h
    cocos/core/utils/ImageUtils.h
    cocos/core/utils/ImageUtils.cpp

    # cocos/core/platform/native/SystemInfo.h
    # cocos/core/platform/native/SystemInfo.cpp

    cocos/core/platform/Debug.h
    cocos/core/platform/Debug.cpp
    cocos/core/platform/Macro.h
    cocos/core/platform/Macro.cpp
    # cocos/core/platform/Screen.h
    # cocos/core/platform/Screen.cpp
    # cocos/core/platform/View.h
    # cocos/core/platform/View.cpp
    # cocos/core/platform/VisibleRect.h
    # cocos/core/platform/VisibleRect.cpp

)

cocos_source_files(MODULE ccgeometry
    cocos/core/geometry/AABB.cpp
    cocos/core/geometry/AABB.h
    cocos/core/geometry/Capsule.cpp
    cocos/core/geometry/Capsule.h
    # cocos/core/geometry/Curve.cpp
    # cocos/core/geometry/Curve.h
    cocos/core/geometry/Distance.cpp
    cocos/core/geometry/Distance.h
    cocos/core/geometry/Enums.h
    cocos/core/geometry/Frustum.cpp
    cocos/core/geometry/Frustum.h
    cocos/core/geometry/Intersect.cpp
    cocos/core/geometry/Intersect.h
    cocos/core/geometry/Line.cpp
    cocos/core/geometry/Line.h
    cocos/core/geometry/Obb.cpp
    cocos/core/geometry/Obb.h
    cocos/core/geometry/Plane.cpp
    cocos/core/geometry/Plane.h
    cocos/core/geometry/Ray.cpp
    cocos/core/geometry/Ray.h
    cocos/core/geometry/Spec.cpp
    cocos/core/geometry/Spec.h
    cocos/core/geometry/Sphere.cpp
    cocos/core/geometry/Sphere.h
    cocos/core/geometry/Triangle.cpp
    cocos/core/geometry/Triangle.h

)

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
    NO_WERROR    cocos/bindings/auto/jsb_assets_auto.cpp
                 cocos/bindings/auto/jsb_assets_auto.h
    NO_WERROR    cocos/bindings/auto/jsb_geometry_auto.cpp
                 cocos/bindings/auto/jsb_geometry_auto.h
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
    )

    cocos_source_files(
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

        )
        cocos_source_files(
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

        )
        cocos_source_files(
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
                 cocos/bindings/manual/jsb_conversions.h
    NO_WERROR    cocos/bindings/manual/jsb_conversions_spec.cpp
                 cocos/bindings/manual/jsb_conversions_spec.h
    NO_WERROR    cocos/bindings/manual/jsb_gfx_manual.cpp
                 cocos/bindings/manual/jsb_gfx_manual.h
    NO_WERROR    cocos/bindings/manual/jsb_global.cpp
                 cocos/bindings/manual/jsb_global.h
    NO_WERROR    cocos/bindings/manual/jsb_helper.cpp
                 cocos/bindings/manual/jsb_helper.h
                 cocos/bindings/manual/jsb_module_register.h
    NO_WERROR    cocos/bindings/manual/jsb_module_register.cpp
                 cocos/bindings/manual/jsb_platform.h
    NO_WERROR    cocos/bindings/manual/jsb_scene_manual.cpp
                 cocos/bindings/manual/jsb_scene_manual.h
    NO_WERROR    cocos/bindings/manual/jsb_assets_manual.cpp
                 cocos/bindings/manual/jsb_assets_manual.h
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
                    cocos/platform/apple/JsbBridge.h
                    cocos/platform/apple/JsbBridge.mm
                    cocos/platform/apple/JsbBridgeWrapper.h
                    cocos/platform/apple/JsbBridgeWrapper.mm
    )
elseif(WIN32)
    cocos_source_files(
        NO_WERROR    cocos/bindings/manual/jsb_platfrom_win32.cpp
    )
elseif(LINUX)
    cocos_source_files(
        NO_WERROR    cocos/bindings/manual/jsb_platfrom_linux.cpp
    )
elseif(QNX)
    cocos_source_files(
        NO_WERROR    cocos/bindings/manual/jsb_platfrom_qnx.cpp
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
        NO_WERROR    cocos/bindings/jswrapper/v8/Utils.cpp
                     cocos/bindings/jswrapper/v8/Utils.h
                     cocos/bindings/jswrapper/v8/MissingSymbols.cpp
                     cocos/bindings/jswrapper/v8/MissingSymbols.h
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
                 cocos/bindings/jswrapper/PrivateObject.h
                 cocos/bindings/jswrapper/Value.cpp
                 cocos/bindings/jswrapper/Value.h
                 cocos/bindings/jswrapper/ValueArrayPool.cpp
                 cocos/bindings/jswrapper/ValueArrayPool.h
)

cocos_source_files(
    NO_WERROR    cocos/bindings/manual/jsb_global_init.cpp
                cocos/bindings/manual/jsb_global_init.h
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
             NO_WERROR cocos/ui/edit-box/EditBox-ios.mm
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
elseif(LINUX)
    if(USE_EDIT_BOX)
        cocos_source_files(
            NO_WERROR    cocos/ui/edit-box/EditBox-linux.cpp
        )
    endif()
elseif(QNX)
    if(USE_EDIT_BOX)
        cocos_source_files(
            NO_WERROR    cocos/ui/edit-box/EditBox-linux.cpp
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

list(APPEND COCOS_SOURCE_LIST ${CC_EXTERNAL_SOURCES})


### generate source files


macro(compile_ts file_without_ext)
    add_custom_command(
        OUTPUT ${file_without_ext}.js
        COMMAND ${TSC_EXECUTABLE} --module commonjs ${file_without_ext}.ts
        DEPENDS ${file_without_ext}.ts
        VERBATIM USES_TERMINAL
    )
endmacro()

compile_ts(${CWD}/cocos/core/builtin/effects)
compile_ts(${CWD}/cocos/core/builtin/shader-sources/glsl1)
compile_ts(${CWD}/cocos/core/builtin/shader-sources/glsl3)
compile_ts(${CWD}/cocos/core/builtin/shader-sources/glsl4)

set(CC_GENERATED_FILES
    ${CWD}/cocos/core/builtin/Effects.cpp
    ${CWD}/cocos/core/builtin/DebugInfos.cpp
    ${CWD}/cocos/core/builtin/shader-sources/glsl1.cpp
    ${CWD}/cocos/core/builtin/shader-sources/glsl3.cpp
    ${CWD}/cocos/core/builtin/shader-sources/glsl4.cpp
)

add_custom_target(builtin-res
    COMMAND ${CMAKE_COMMAND} -E echo "Generate builtin resources ..."
    COMMAND ${NODE_EXECUTABLE} ${CWD}/cmake/scripts/glsl_gzip.js
            ${CWD}/cocos/core/builtin/shader-sources/glsl1.js
            glsl1
            ${CWD}/cocos/core/builtin/shader-sources/glsl1.cpp.in
            ${CWD}/cocos/core/builtin/shader-sources/glsl1.cpp
    COMMAND ${NODE_EXECUTABLE} ${CWD}/cmake/scripts/glsl_gzip.js
            ${CWD}/cocos/core/builtin/shader-sources/glsl3.js
            glsl3
            ${CWD}/cocos/core/builtin/shader-sources/glsl3.cpp.in
            ${CWD}/cocos/core/builtin/shader-sources/glsl3.cpp
    COMMAND ${NODE_EXECUTABLE} ${CWD}/cmake/scripts/glsl_gzip.js
            ${CWD}/cocos/core/builtin/shader-sources/glsl4.js
            glsl4
            ${CWD}/cocos/core/builtin/shader-sources/glsl4.cpp.in
            ${CWD}/cocos/core/builtin/shader-sources/glsl4.cpp
    COMMAND ${NODE_EXECUTABLE} ${CWD}/cmake/scripts/effects_gzip.js
            ${CWD}/cocos/core/builtin/effects.js
            effects
            ${CWD}/cocos/core/builtin/Effects.cpp.in
            ${CWD}/cocos/core/builtin/Effects.cpp
    COMMAND ${NODE_EXECUTABLE} ${CWD}/cmake/scripts/gen_debugInfos.js
            ${CWD}/../EngineErrorMap.md
            ${CWD}/cocos/core/builtin/DebugInfos.cpp.in
            ${CWD}/cocos/core/builtin/DebugInfos.cpp
    DEPENDS
            ${CWD}/cocos/core/builtin/shader-sources/glsl1.js
            ${CWD}/cocos/core/builtin/shader-sources/glsl3.js
            ${CWD}/cocos/core/builtin/shader-sources/glsl4.js
            ${CWD}/cocos/core/builtin/shader-sources/glsl1.cpp.in
            ${CWD}/cocos/core/builtin/shader-sources/glsl3.cpp.in
            ${CWD}/cocos/core/builtin/shader-sources/glsl4.cpp.in
            ${CWD}/cocos/core/builtin/effects.js
            ${CWD}/cocos/core/builtin/Effects.cpp.in
            ${CWD}/cocos/core/builtin/DebugInfos.cpp.in
            ${CWD}/cmake/scripts/glsl_gzip.js
            ${CWD}/cmake/scripts/effects_gzip.js
    VERBATIM USES_TERMINAL
)
set_target_properties(builtin-res PROPERTIES FOLDER Utils)


list(APPEND COCOS_SOURCE_LIST ${CC_GENERATED_FILES})

if(USE_MODULES)
    add_library(ccmath ${ccmath_SOURCE_LIST})
    add_library(cclog ${cclog_SOURCE_LIST})
    add_library(ccfilesystem ${ccfilesystem_SOURCE_LIST} ${CC_TINYDIR_SOURCES})
    add_library(ccutils ${ccutils_SOURCE_LIST} ${CC_UTILS_SOURCES})
    add_library(ccunzip ${ccunzip_SOURCE_LIST} ${CC_UNZIP_SOURCES})
    add_library(ccbindings ${ccbindings_SOURCE_LIST})
    add_library(ccgeometry ${ccgeometry_SOURCE_LIST})

    target_include_directories(ccmath PRIVATE
        ${CWD}/cocos
    )
    target_include_directories(ccgeometry PRIVATE
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
        ${CWD}/cocos/bindings/jswrapper
        ${CWD}/cocos/editor-support # TODO: refactor include path
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
    target_link_libraries(ccgeometry PUBLIC
        ccmath
    )
    if(ANDROID)
        target_link_libraries(ccmath PUBLIC
            android_platform
        )
        target_link_libraries(cclog PUBLIC
            log
        )
        target_link_libraries(ccfilesystem PUBLIC
            cocos_jni
        )
    elseif(OHOS)
        target_link_libraries(cclog PUBLIC
            hilog_ndk.z
        )
        target_link_libraries(ccfilesystem PUBLIC
            cocos_jni
            rawfile.z
        )
    elseif(APPLE)
        target_link_libraries(ccfilesystem PUBLIC
        "-framework Foundation"
        "-framework SystemConfiguration"
        )
    endif()
else()
    list(APPEND COCOS_SOURCE_LIST
        ${ccmath_SOURCE_LIST}
        ${ccgeometry_SOURCE_LIST}
        ${cclog_SOURCE_LIST}
        ${ccfilesystem_SOURCE_LIST}
        ${ccunzip_SOURCE_LIST}
        ${ccbindings_SOURCE_LIST}
        ${ccutils_SOURCE_LIST}
        ${CC_UNZIP_SOURCES}
        ${CC_TINYDIR_SOURCES}
    )
endif()

add_library(${ENGINE_NAME} ${COCOS_SOURCE_LIST})

if(USE_MODULES)
    target_link_libraries(${ENGINE_NAME} PUBLIC
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
    add_library(cocos_jni STATIC ${CC_JNI_SRC_FILES})
    target_include_directories(cocos_jni PUBLIC
        ${CWD}
        ${CWD}/cocos
        ${CC_EXTERNAL_INCLUDES}
    )
    if(ANDROID)
        target_link_libraries(cocos_jni PUBLIC
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
        $<IF:$<BOOL:${CC_EDITOR}>,CC_EDITOR=1,CC_EDITOR=0>
        $<$<BOOL:${USE_SE_JSC}>:SCRIPT_ENGINE_TYPE=3>
        $<$<CONFIG:Debug>:CC_DEBUG=1>
    )
endfunction()

# setup default flags
cc_apply_definations(${ENGINE_NAME})

if(USE_MODULES)
    cc_apply_definations(ccmath)
    cc_apply_definations(cclog)
    cc_apply_definations(ccfilesystem)
    cc_apply_definations(ccunzip)
    cc_apply_definations(ccbindings)
    cc_apply_definations(ccutils)
endif()

if(MSVC)
    if(${CMAKE_SIZEOF_VOID_P} STREQUAL "4")
        file(GLOB_RECURSE WIN32_DLLS
            ${CWD}/external/win32/libs/*.dll
            ${CWD}/external/win32/libs/Debug/*.dll
            ${CWD}/external/win32/libs/glslang/*.dll
        )
    else()
        file(GLOB_RECURSE WIN32_DLLS
            ${CWD}/external/win64/libs/*.dll
            ${CWD}/external/win64/libs/Debug/*.dll
            ${CWD}/external/win64/libs/glslang/*.dll
        )
    endif()
    target_compile_options(${ENGINE_NAME} PUBLIC /MP 
        /bigobj
        /wd4018 # signed/unsigned mismatch
        /wd4244 # type conversion data lost
        /wd4267 # conversion from 'size_t' to 'type', possible loss of data
        /wd4305 # truncation from 'type1' to 'type2'
        /wd4309 # truncation of constant value
        /wd4819 # file contains a character that cannot be represented in the current code page
        /wd4996 # deprecated
    )
endif()

if(CC_USE_VULKAN)

    target_compile_definitions(${ENGINE_NAME} PUBLIC VK_NO_PROTOTYPES)
    target_compile_definitions(${ENGINE_NAME} PUBLIC CC_USE_VULKAN)

    if(WIN32)
        target_compile_definitions(${ENGINE_NAME} PUBLIC VK_USE_PLATFORM_WIN32_KHR)
    elseif(NX)
        target_compile_definitions(${ENGINE_NAME} PUBLIC VK_USE_PLATFORM_VI_NN)
    elseif(ANDROID)
        target_compile_definitions(${ENGINE_NAME} PUBLIC VK_USE_PLATFORM_ANDROID_KHR)
    elseif(IOS)
        target_compile_definitions(${ENGINE_NAME} PUBLIC VK_USE_PLATFORM_IOS_MVK)
    elseif(MACOSX)
        target_compile_definitions(${ENGINE_NAME} PUBLIC VK_USE_PLATFORM_MACOS_MVK)
    else()
        target_compile_definitions(${ENGINE_NAME} PUBLIC VK_USE_PLATFORM_XCB_KHR)
    endif()
endif()

if(CC_USE_METAL)
    target_compile_definitions(${ENGINE_NAME} PUBLIC CC_USE_METAL)
endif()

if(CC_USE_GLES3)
    target_compile_definitions(${ENGINE_NAME} PUBLIC CC_USE_GLES3)
endif()

if(CC_USE_GLES2)
    target_compile_definitions(${ENGINE_NAME} PUBLIC CC_USE_GLES2)
endif()

target_include_directories(${ENGINE_NAME}
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

target_compile_definitions(${ENGINE_NAME}
    PRIVATE
        ${CC_EXTERNAL_PRIVATE_DEFINITIONS}
)

if(NOT APPLE)
    target_include_directories(${ENGINE_NAME} PUBLIC
        ${CWD}/external/sources/EGL
    )
endif()

target_include_directories(${ENGINE_NAME} PUBLIC
    ${CWD}/external/sources/khronos
)

if(NX)
    include(${CMAKE_CURRENT_LIST_DIR}/platform-nx/setup.cmake)
elseif(WINDOWS)
    target_link_libraries(${ENGINE_NAME} PUBLIC
        ws2_32 userenv psapi winmm Iphlpapi
        ${CC_EXTERNAL_LIBS}
    )
    cc_win32_definations(${ENGINE_NAME})

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
    target_compile_options(${ENGINE_NAME} PRIVATE
        -Wno-comment # nested block comments are actually useful sometimes
    )

    find_library(LIB_EGL NAMES EGL)
    find_library(LIB_GLESv2 NAMES GLESv2)
    target_link_libraries(${ENGINE_NAME} PUBLIC
        android
        OpenSLES
        ${LIB_EGL}
        ${LIB_GLESv2}
        GLESv2
        ${CC_EXTERNAL_LIBS}
    )
endif()

if(OHOS)
    target_link_libraries(${ENGINE_NAME} PUBLIC
        EGL
        GLESv3
        zgraphic.z
        rawfile.z
        z
        OpenSLES
        hilog_ndk.z
        ${CC_EXTERNAL_LIBS}
    )
endif()

if(APPLE)

    target_compile_options(${ENGINE_NAME} PRIVATE
        -Wno-objc-method-access
    )

    target_include_directories(${ENGINE_NAME} PUBLIC
        ${CWD}/cocos/platform/ios
    )
    target_link_libraries(${ENGINE_NAME} PUBLIC
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
        "$(inherited)"
        ${CC_EXTERNAL_LIBS}
    )
    set_target_properties(${ENGINE_NAME} PROPERTIES
        XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH "YES"
        OSX_ARCHITECTURES "arm64;x86_64"
        ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/archives
    )
    if(MACOSX)
        target_link_libraries(${ENGINE_NAME} PUBLIC
            "-framework OpenGL"
            "-framework AppKit"
        )
        target_compile_definitions(${ENGINE_NAME} PUBLIC
            CC_KEYBOARD_SUPPORT
        )
    elseif(IOS)
        target_link_libraries(${ENGINE_NAME} PUBLIC
            "-framework QuartzCore"
            "-framework MetalPerformanceShaders"
            "-framework UIKit"
            "-framework AVKit"
            "-framework WebKit"
            "-framework CoreVideo"
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
        set_property(TARGET ${ENGINE_NAME} PROPERTY XCODE_ATTRIBUTE_IPHONEOS_DEPLOYMENT_TARGET ${TARGET_IOS_VERSION})
        set_property(TARGET ${ENGINE_NAME} PROPERTY XCODE_ATTRIBUTE_ENABLE_BITCODE "NO")
    endif()

endif()

if(QNX)
    target_link_libraries(${ENGINE_NAME} PUBLIC
        socket
        ssl
        screen
        ${CC_EXTERNAL_LIBS}
    )
elseif(LINUX)
    target_link_libraries(${ENGINE_NAME} PUBLIC
        X11
        ${CC_EXTERNAL_LIBS}
    )
endif()

source_group(TREE ${CWD} PREFIX "Source Files" FILES ${COCOS_SOURCE_LIST})
