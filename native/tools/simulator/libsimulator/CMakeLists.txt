
set(libsimulator_name simulator)
set(LIBSIMULATOR_SOURCE_LIST)

macro(libsimulator_source_files)
    set(list_var "${ARGN}")
    foreach(src IN LISTS list_var)
        set(fp "${CMAKE_CURRENT_LIST_DIR}/${src}")
        if(EXISTS ${fp})
            list(APPEND LIBSIMULATOR_SOURCE_LIST "${CMAKE_CURRENT_LIST_DIR}/${src}")
        else()
            message(FATAL_ERROR "Cocos souce file not exists: ${src} in ${CWD}")
        endif()
    endforeach()
endmacro()

libsimulator_source_files(
    lib/network/CCHTTPRequest.cpp
    lib/network/CCHTTPRequest.h
    lib/network/CCHTTPRequestDelegate.h
)
libsimulator_source_files(
    lib/ProjectConfig/ProjectConfig.cpp
    lib/ProjectConfig/ProjectConfig.h
    lib/ProjectConfig/SimulatorConfig.cpp
    lib/ProjectConfig/SimulatorConfig.h
)
libsimulator_source_files(
    lib/protobuf-lite/config.h
    lib/protobuf-lite/google/protobuf/extension_set.cc
    lib/protobuf-lite/google/protobuf/extension_set.h
    lib/protobuf-lite/google/protobuf/generated_message_util.cc
    lib/protobuf-lite/google/protobuf/generated_message_util.h
    lib/protobuf-lite/google/protobuf/io/coded_stream_inl.h
    lib/protobuf-lite/google/protobuf/io/coded_stream.cc
    lib/protobuf-lite/google/protobuf/io/coded_stream.h
    lib/protobuf-lite/google/protobuf/io/zero_copy_stream_impl_lite.cc
    lib/protobuf-lite/google/protobuf/io/zero_copy_stream_impl_lite.h
    lib/protobuf-lite/google/protobuf/io/zero_copy_stream_impl.h
    lib/protobuf-lite/google/protobuf/io/zero_copy_stream.cc
    lib/protobuf-lite/google/protobuf/io/zero_copy_stream.h
    lib/protobuf-lite/google/protobuf/message_lite.cc
    lib/protobuf-lite/google/protobuf/message_lite.h
    lib/protobuf-lite/google/protobuf/repeated_field.cc
    lib/protobuf-lite/google/protobuf/repeated_field.h
    lib/protobuf-lite/google/protobuf/stubs/atomicops_internals_arm_gcc.h
    lib/protobuf-lite/google/protobuf/stubs/atomicops_internals_atomicword_compat.h
    lib/protobuf-lite/google/protobuf/stubs/atomicops_internals_generic_gcc.h
    lib/protobuf-lite/google/protobuf/stubs/atomicops_internals_macosx.h
    lib/protobuf-lite/google/protobuf/stubs/atomicops_internals_x86_gcc.cc
    lib/protobuf-lite/google/protobuf/stubs/atomicops_internals_x86_gcc.h
    lib/protobuf-lite/google/protobuf/stubs/atomicops_internals_x86_msvc.cc
    lib/protobuf-lite/google/protobuf/stubs/atomicops_internals_x86_msvc.h
    lib/protobuf-lite/google/protobuf/stubs/atomicops.h
    lib/protobuf-lite/google/protobuf/stubs/common.cc
    lib/protobuf-lite/google/protobuf/stubs/common.h
    lib/protobuf-lite/google/protobuf/stubs/hash.h
    lib/protobuf-lite/google/protobuf/stubs/map-util.h
    lib/protobuf-lite/google/protobuf/stubs/once.cc
    lib/protobuf-lite/google/protobuf/stubs/once.h
    lib/protobuf-lite/google/protobuf/stubs/platform_macros.h
    lib/protobuf-lite/google/protobuf/stubs/stl_util.h
    lib/protobuf-lite/google/protobuf/stubs/stringprintf.cc
    lib/protobuf-lite/google/protobuf/stubs/stringprintf.h
    lib/protobuf-lite/google/protobuf/stubs/template_util.h
    lib/protobuf-lite/google/protobuf/stubs/type_traits.h
    lib/protobuf-lite/google/protobuf/wire_format_lite_inl.h
    lib/protobuf-lite/google/protobuf/wire_format_lite.cc
    lib/protobuf-lite/google/protobuf/wire_format_lite.h
)
libsimulator_source_files(
    lib/runtime/ConfigParser.cpp
    lib/runtime/ConfigParser.h
    #error lib/runtime/ConnectWaitLayer.cpp
    #error lib/runtime/ConnectWaitLayer.h
    #error lib/runtime/ConsoleCommand.cpp
    #error lib/runtime/ConsoleCommand.h
    lib/runtime/FileServer.cpp
    lib/runtime/FileServer.h
    lib/runtime/Landscape_png.cpp
    lib/runtime/PlayDisable_png.cpp
    lib/runtime/PlayEnable_png.cpp
    lib/runtime/Portrait_png.cpp
    lib/runtime/Protos.pb.cc
    lib/runtime/Protos.pb.h
    lib/runtime/ResData.h
    lib/runtime/Runtime.cpp
    lib/runtime/Runtime.h
    lib/runtime/RuntimeProtocol.cpp
    lib/runtime/RuntimeProtocol.h
    lib/runtime/Shine_png.cpp
    lib/runtime/VisibleRect.cpp
    lib/runtime/VisibleRect.h
)
libsimulator_source_files(
    lib/CustomAppEvent.cpp
    lib/CustomAppEvent.h
    lib/AppLang.cpp
    lib/AppLang.h
    lib/cocos2dx_extra.h
    lib/DeviceEx.h
    lib/PlayerEditBoxServiceProtocol.h
    lib/PlayerFileDialogServiceProtocol.h
    lib/PlayerMacros.h
    lib/PlayerMenuServiceProtocol.cpp
    lib/PlayerMenuServiceProtocol.h
    lib/PlayerMessageBoxServiceProtocol.h
    lib/PlayerProtocol.cpp
    lib/PlayerProtocol.h
    lib/PlayerServiceProtocol.cpp
    lib/PlayerServiceProtocol.h
    lib/PlayerSettings.cpp
    lib/PlayerSettings.h
    lib/PlayerTaskServiceProtocol.cpp
    lib/PlayerTaskServiceProtocol.h
    lib/PlayerUtils.cpp
    lib/PlayerUtils.h
    lib/SimulatorExport.h
)

if(MACOSX)
    libsimulator_source_files(
        #error lib/runtime/Widget_mac.mm
        #error lib/runtime/Widget_mac.h
    )
    libsimulator_source_files(
        lib/platform/mac/DeviceEx-mac.mm
        lib/platform/mac/openudid/OpenUDIDMac.h
        lib/platform/mac/openudid/OpenUDIDMac.m
        lib/platform/mac/PlayerEditBoxServiceMac.h
        lib/platform/mac/PlayerEditBoxServiceMac.mm
        lib/platform/mac/PlayerFileDialogServiceMac.h
        lib/platform/mac/PlayerFileDialogServiceMac.mm
        lib/platform/mac/PlayerMac.h
        lib/platform/mac/PlayerMac.mm
        lib/platform/mac/PlayerMenuServiceMac.h
        lib/platform/mac/PlayerMenuServiceMac.mm
        lib/platform/mac/PlayerMessageBoxServiceMac.h
        lib/platform/mac/PlayerMessageBoxServiceMac.mm
        lib/platform/mac/PlayerTaskServiceMac.h
        lib/platform/mac/PlayerTaskServiceMac.mm
        lib/platform/mac/Runtime_ios-mac.mm
    )
elseif(WINDOWS)
    libsimulator_source_files(
        lib/platform/win32/DeviceEx-win32.cpp
        lib/platform/win32/PlayerEditBoxServiceWin.cpp
        lib/platform/win32/PlayerEditBoxServiceWin.h
        lib/platform/win32/PlayerFileDialogServiceWin.cpp
        lib/platform/win32/PlayerFileDialogServiceWin.h
        lib/platform/win32/PlayerMenuServiceWin.cpp
        lib/platform/win32/PlayerMenuServiceWin.h
        lib/platform/win32/PlayerMessageBoxServiceWin.cpp
        lib/platform/win32/PlayerMessageBoxServiceWin.h
        lib/platform/win32/PlayerTaskServiceWin.cpp
        lib/platform/win32/PlayerTaskServiceWin.h
        lib/platform/win32/PlayerWin.cpp
        lib/platform/win32/PlayerWin.h
        #lib/platform/win32/SimulatorWin.cpp
        proj.win32/Runtime_win32.cpp
        proj.win32/stdafx.cpp
        proj.win32/stdafx.h
        proj.win32/targetver.h
    )
endif()


add_library(${libsimulator_name} ${LIBSIMULATOR_SOURCE_LIST})

target_compile_definitions(${libsimulator_name}
    PRIVATE $<IF:$<CONFIG:Debug>,CC_DEBUG=1,CC_DEBUG=0>
)

if(WINDOWS)
    target_compile_definitions(${libsimulator_name}
        PRIVATE _SILENCE_STDEXT_HASH_DEPRECATION_WARNINGS
        PUBLIC _USRLIBSIMSTATIC
        PUBLIC _USRDLL
        # PUBLIC NOMINMAX
    )
    target_include_directories(${libsimulator_name} PRIVATE 
        ${CMAKE_CURRENT_LIST_DIR}/proj.win32
        ${CMAKE_CURRENT_LIST_DIR}/../simulator/frameworks/runtime-src/proj.win32
        PRIVATE ${CMAKE_CURRENT_LIST_DIR}/../../../external/win32/include
        PRIVATE ${CMAKE_CURRENT_LIST_DIR}/../../../external/win32/include/v8
        PRIVATE ${CMAKE_CURRENT_LIST_DIR}/../../../external/win32/include/zlib
    )
    if(COMMAND target_precompile_headers)
        target_precompile_headers(${libsimulator_name}
            PRIVATE ${CMAKE_CURRENT_LIST_DIR}/proj.win32/stdafx.h
        )
    endif()
    
    target_compile_options(${ENGINE_NAME} PUBLIC /MP)
elseif(APPLE)
    target_include_directories(${libsimulator_name} PRIVATE 
        PRIVATE ${CMAKE_CURRENT_LIST_DIR}/../../../external/mac/include/v8
    )
endif()

target_include_directories(${libsimulator_name}
    PUBLIC ${CMAKE_CURRENT_LIST_DIR}/lib
    PUBLIC ${CMAKE_CURRENT_LIST_DIR}/lib/protobuf-lite
    PRIVATE ${CMAKE_CURRENT_LIST_DIR}/lib/runtime
    PRIVATE ${CMAKE_CURRENT_LIST_DIR}/../../..
    PRIVATE ${CMAKE_CURRENT_LIST_DIR}/../../../cocos
    PRIVATE ${CMAKE_CURRENT_LIST_DIR}/../../../external/sources
)

set_property(TARGET ${libsimulator_name} PROPERTY
    CXX_STANDARD 14
)

source_group(TREE ${CMAKE_CURRENT_LIST_DIR} PREFIX "Source Files" FILES ${LIBSIMULATOR_SOURCE_LIST})

if(MACOSX)
    find_library(AppKitLibrary AppKit)
    target_link_libraries(${libsimulator_name} ${AppKitLibrary})
endif()

