cmake_minimum_required(VERSION 3.8)

set(APP_NAME SimulatorApp)
project(${APP_NAME} CXX)

enable_language(C ASM)
if(APPLE)
    enable_language(OBJC OBJCXX)
endif()

set(CMAKE_CXX_STANDARD 17)
option(USE_SE_V8        "USE V8 JavaScript Engine"          ON)
option(USE_V8_DEBUGGER  "Enable Chrome Remote inspector"    ON)
option(USE_SOCKET       "Enable WebSocket & SocketIO"       ON)
option(USE_AUDIO        "Enable Audio"                      ON)     #Enable AudioEngine
option(USE_EDIT_BOX     "Enable EditBox"                    ON)
option(USE_SE_JSC       "USE JavaScriptCore on MacOSX/iOS"  OFF)
option(USE_VIDEO        "Enable VideoPlayer Component"      ON)
option(USE_WEBVIEW      "Enable WebView Component"          OFF)
option(USE_MIDDLEWARE   "Enable Middleware"                 ON)
option(USE_DRAGONBONES  "Enable Dragonbones"                ON)
option(USE_SPINE        "Enable Spine"                      ON)
option(USE_PHYSICS_PHYSX        "USE PhysX Physics"         ON)

if(USE_SE_JSC AND APPLE)
    set(USE_SE_V8 OFF)
    set(USE_V8_DEBUGGER OFF)
endif()

set(TARGET_OSX_VERSION "10.14")

set(cocosdir ${CMAKE_CURRENT_LIST_DIR}/../../../..)
if(NOT cocosdir)
    message(FATAL_ERROR "COCOS_ROOT is not set!")
endif()

# TODO(v3.6.1): enable all modules and scripts for simulator
set(USE_DEBUG_RENDERER OFF)

include(${cocosdir}/CMakeLists.txt)
include(${cocosdir}/tools/simulator/libsimulator/CMakeLists.txt)



if(MACOSX)
    set(LIB_NAME ${APP_NAME}-Mac)
else()
    set(LIB_NAME ${APP_NAME}-Win32)
endif()



set(GAME_RES_ROOT ${CMAKE_CURRENT_LIST_DIR}/../../)
set(GAME_RES_FILES
    ${GAME_RES_ROOT}/main.js
    ${GAME_RES_ROOT}/project.json
)
set(GAME_RES_FOLDERS
    ${GAME_RES_ROOT}/jsb-adapter
    ${GAME_RES_ROOT}/subpackages
    ${GAME_RES_ROOT}/res
    ${GAME_RES_ROOT}/src
)
set(GAME_RES_ALL
    ${GAME_RES_FILES}
    ${GAME_RES_FOLDERS}
)

set(UI_RESOURCES)
set(PROJ_EXTRA_SOURCE)
set(PROJ_SOURCES
    Classes/Game.cpp
    Classes/Game.h
    Classes/ide-support/CodeIDESupport.h
    Classes/ide-support/RuntimeJsImpl.cpp
    Classes/ide-support/RuntimeJsImpl.h
)



if(WINDOWS)
    set(UI_RESOURCES
        proj.win32/game.rc
        proj.win32/res/game.ico
    )
    list(APPEND PROJ_SOURCES
        proj.win32/main.cpp
        proj.win32/main.h
        proj.win32/resource.h
        proj.win32/SimulatorApp.cpp
        proj.win32/SimulatorApp.h
        # proj.win32/stdafx.cpp
        # proj.win32/stdafx.h
        # proj.win32/targetver.h
        ${UI_RESOURCES}
    )
elseif(MACOSX)
    set(UI_RESOURCES
        SimulatorApp-Mac/Images.xcassets
        proj.ios_mac/mac/Simulator.entitlements
        proj.ios_mac/mac/Base.lproj/ConsoleWindow.xib
        proj.ios_mac/mac/Base.lproj/MainMenu.xib
        proj.ios_mac/mac/en.lproj/MainMenu.xib
        proj.ios_mac/mac/zh-Hans.lproj/ConsoleWindow.strings
        proj.ios_mac/mac/zh-Hans.lproj/MainMenu.xib
    )
    list(APPEND PROJ_SOURCES
        proj.ios_mac/mac/main.mm
        proj.ios_mac/mac/SimulatorApp.h
        proj.ios_mac/mac/SimulatorApp.mm
       # proj.ios_mac/mac/AppDelegate.h
       # proj.ios_mac/mac/AppDelegate.mm
       # proj.ios_mac/mac/ViewController.h
       # proj.ios_mac/mac/ViewController.mm
        proj.ios_mac/mac/ConsoleWindowController.h
        proj.ios_mac/mac/ConsoleWindowController.m
        ${UI_RESOURCES}
    )
endif()

set(asset_files)
foreach(res ${GAME_RES_ALL})
    set(res_list)
    if(NOT EXISTS ${res})
        continue()
    endif()

    if(IS_DIRECTORY ${res})
        file(GLOB_RECURSE res_list "${res}/*")
    else()
        set(res_list ${res})
    endif()
    foreach(res ${res_list})
        get_filename_component(res_abs ${res} ABSOLUTE)
        file(RELATIVE_PATH res_rel ${GAME_RES_ROOT} ${res_abs})
        get_filename_component(res_dir ${res_rel} PATH)
        set_source_files_properties(${res_abs} PROPERTIES
                                    MACOSX_PACKAGE_LOCATION "Resources/${res_dir}/"
                                    HEADER_FILE_ONLY 1
                                    )
        list(APPEND asset_files ${res_abs})
    endforeach()
endforeach()

if(APPLE OR MSVC)
    add_executable(${LIB_NAME} ${PROJ_SOURCES} ${asset_files} ${PROJ_EXTRA_SOURCE})
    source_group(TREE ${GAME_RES_ROOT} PREFIX "Resources" FILES ${asset_files})
else()
    add_executable(${LIB_NAME} ${PROJ_SOURCES} ${PROJ_EXTRA_SOURCE})
endif()

target_link_libraries(${LIB_NAME} ${ENGINE_NAME} simulator)
target_include_directories(${LIB_NAME} PRIVATE
    Classes
)
target_compile_definitions(${LIB_NAME} PRIVATE
    GAME_NAME="${APP_NAME}"
)

source_group(TREE ${CMAKE_CURRENT_LIST_DIR} PREFIX "Source Files" FILES ${PROJ_SOURCES})

if(APPLE)
    set_target_properties(${LIB_NAME} PROPERTIES MACOSX_BUNDLE 1)
    set_target_properties(${LIB_NAME} PROPERTIES RESOURCE "${UI_RESOURCES}")
    set(EXECUTABLE_NAME ${LIB_NAME}) # referenced in Info.plist
    set(PRODUCT_NAME ${APP_NAME})
    if(MACOSX)
        set(CMAKE_OSX_DEPLOYMENT_TARGET ${TARGET_OSX_VERSION})
        set(MACOSX_BUNDLE_GUI_IDENTIFIER org.cocos.hellojavascript.mac)
        set_target_properties(${LIB_NAME} PROPERTIES MACOSX_BUNDLE_INFO_PLIST "${CMAKE_CURRENT_LIST_DIR}/proj.ios_mac/mac/Info.plist")
        set_target_properties(${LIB_NAME} PROPERTIES
            MACOSX_DEPLOYMENT_TARGET ${TARGET_OSX_VERSION}
            XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_APPICON_NAME "AppIcon"
            RESOURCE "${UI_RESOURCES}"
        )
        get_property(gles2_loc TARGET GLESv2 PROPERTY IMPORTED_LOCATION)
        get_property(egl_loc TARGET EGL PROPERTY IMPORTED_LOCATION)
        add_custom_command(TARGET ${LIB_NAME} POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E make_directory $<TARGET_FILE_DIR:${LIB_NAME}>/../Frameworks
            COMMAND ${CMAKE_COMMAND} -E copy ${gles2_loc} $<TARGET_FILE_DIR:${LIB_NAME}>/../Frameworks
            COMMAND ${CMAKE_COMMAND} -E copy ${egl_loc} $<TARGET_FILE_DIR:${LIB_NAME}>/../Frameworks
        )
    endif()

elseif(WINDOWS)

    set_target_properties(${LIB_NAME} PROPERTIES RESOURCE "${UI_RESOURCES}")

    if(EXISTS ${CMAKE_CURRENT_LIST_DIR}/../../jsb-adapter)
        set(bin_dir $<TARGET_FILE_DIR:${LIB_NAME}>)
        add_custom_command(TARGET ${LIB_NAME} PRE_BUILD
            COMMAND ${CMAKE_COMMAND} -E echo "Linking resources for ${LIB_NAME} ..."
            COMMAND ${CMAKE_COMMAND} -E create_symlink ${CMAKE_CURRENT_LIST_DIR}/../../jsb-adapter ${bin_dir}/jsb-adapter
            COMMAND ${CMAKE_COMMAND} -E create_symlink ${CMAKE_CURRENT_LIST_DIR}/../../res ${bin_dir}/res
            COMMAND ${CMAKE_COMMAND} -E create_symlink ${CMAKE_CURRENT_LIST_DIR}/../../src ${bin_dir}/src
            COMMAND ${CMAKE_COMMAND} -E create_symlink ${CMAKE_CURRENT_LIST_DIR}/../../main.js ${bin_dir}/main.js
            COMMAND ${CMAKE_COMMAND} -E create_symlink ${CMAKE_CURRENT_LIST_DIR}/../../project.json ${bin_dir}/project.json
        )
    endif()

    target_include_directories(${LIB_NAME} PRIVATE
        ${CMAKE_CURRENT_LIST_DIR}/proj.win32
    )

    if(MSVC)
        foreach(item ${WINDOWS_DLLS})
            get_filename_component(filename ${item} NAME)
            get_filename_component(abs ${item} ABSOLUTE)
            add_custom_command(TARGET ${LIB_NAME} POST_BUILD
                COMMAND ${CMAKE_COMMAND} -E copy_if_different ${abs} $<TARGET_FILE_DIR:${LIB_NAME}>/${filename}
            )
        endforeach()
        foreach(item ${V8_DLLS})
            get_filename_component(filename ${item} NAME)
            add_custom_command(TARGET ${LIB_NAME} POST_BUILD
                COMMAND ${CMAKE_COMMAND} -E copy_if_different ${V8_DIR}/$<IF:$<BOOL:$<CONFIG:RELEASE>>,Release,Debug>/${filename} $<TARGET_FILE_DIR:${LIB_NAME}>/${filename}
            )
        endforeach()
        target_link_options(${LIB_NAME} PRIVATE /SUBSYSTEM:WINDOWS)
    endif()
endif()
