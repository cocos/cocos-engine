cmake_minimum_required(VERSION 3.8)

set(APP_NAME HelloJavascript)
project(${APP_NAME} CXX)

enable_language(C ASM)

set(CMAKE_CXX_STANDARD 14)
option(USE_SE_V8                "USE V8 JavaScript Engine"          ON)
option(USE_V8_DEBUGGER          "Enable Chrome Remote inspector"    ON)
option(USE_SOCKET               "Enable WebSocket & SocketIO"       ON)
option(USE_AUDIO                "Enable Audio"                      ON)     #Enable AudioEngine
option(USE_EDIT_BOX             "Enable EditBox"                    ON)
option(USE_SE_JSC               "USE JavaScriptCore on MacOSX/iOS"  OFF)
option(USE_VIDEO                "Enable VideoPlayer Component"      ON)
option(USE_WEBVIEW              "Enable WebView Component"          ON)
option(USE_DRAGONBONES          "Enable Dragonbones"                OFF)
option(USE_SPINE                "Enable Spine"                      OFF)
option(USE_WEBSOCKET_SERVER     "Enable WebSocket Server"           OFF)


if(USE_SE_JSC AND APPLE)
    set(USE_SE_V8 OFF)
    set(USE_V8_DEBUGGER OFF)
endif()

set(DEVELOPMENT_TEAM "" CACHE STRING "APPLE Developtment Team")
set(RES_DIR "" CACHE STRING          "Resource path")

if(CMAKE_OSX_SYSROOT STREQUAL "iphonesimulator")
    set(TARGET_IOS_VERSION "9.0")
else()
    set(TARGET_IOS_VERSION "8.0")
endif()
set(TARGET_OSX_VERSION "10.10")

if(RES_DIR)
    include(${RES_DIR}/proj/cfg.cmake)
endif()

set(cocosdir "${COCOS_ROOT}")
if(NOT cocosdir)
    message(FATAL_ERROR "COCOS_ROOT is not set!")
endif()
include(${cocosdir}/CMakeLists.txt)


if(ANDROID)
    set(LIB_NAME cocos)
    set(PLATFORM_DIR_NAME "android")
elseif(MACOSX)
    set(LIB_NAME ${APP_NAME}-desktop)
    set(PLATFORM_DIR_NAME "mac")
elseif(IOS)
    set(LIB_NAME ${APP_NAME}-mobile)
    set(PLATFORM_DIR_NAME "ios")
    if(CMAKE_OSX_SYSROOT STREQUAL "iphonesimulator")
        set(LIB_NAME ${LIB_NAME}-sim)
    endif()
elseif(WINDOWS)
    set(LIB_NAME ${APP_NAME})
    set(PLATFORM_DIR_NAME "windows")
endif()

if(EXISTS ${CMAKE_CURRENT_LIST_DIR}/../${PLATFORM_DIR_NAME})
    set(PROJ_SRC_DIR ${CMAKE_CURRENT_LIST_DIR}/../${PLATFORM_DIR_NAME}/proj)
else()
    if(WINDOWS)
        set(PROJ_SRC_DIR ${CMAKE_CURRENT_LIST_DIR}/../platforms/win32) ## FIXME
    else()
        set(PROJ_SRC_DIR ${CMAKE_CURRENT_LIST_DIR}/../platforms/${PLATFORM_DIR_NAME})
    endif()
endif()
set(GAME_RES_ROOT ${CMAKE_CURRENT_LIST_DIR}/../${PLATFORM_DIR_NAME})

if(RES_DIR)
    set(GAME_RES_ROOT ${RES_DIR}/assets)
    set(PROJ_SRC_DIR ${RES_DIR}/proj)
    message(STATUS "Use resource diretory ${RES_DIR}")
endif()

set(UI_RESOURCES)
set(PROJ_SOURCES)
set(PROJ_EXTRA_SOURCE)
set(PROJ_COMMON_SOURCES
    Classes/Game.h
    Classes/Game.cpp
)

if(NOT EXISTS ${CMAKE_CURRENT_LIST_DIR}/Classes/jsb_module_register.cpp)
    file(COPY "${cocosdir}/cocos/bindings/manual/jsb_module_register.cpp"
        DESTINATION ${CMAKE_CURRENT_LIST_DIR}/Classes/)
endif()
list(APPEND PROJ_COMMON_SOURCES ${CMAKE_CURRENT_LIST_DIR}/Classes/jsb_module_register.cpp)


if(WINDOWS)
    set(UI_RESOURCES
        ${PROJ_SRC_DIR}/game.rc
    )
    list(APPEND PROJ_SOURCES
        ${PROJ_SRC_DIR}/AppDelegate.h
        ${PROJ_SRC_DIR}/AppDelegate.cpp
        ${PROJ_SRC_DIR}/main.h
        ${PROJ_SRC_DIR}/main.cpp
        ${PROJ_SRC_DIR}/resource.h
        ${UI_RESOURCES}
    )
elseif(MACOSX)
    set(UI_RESOURCES
        ${PROJ_SRC_DIR}/Assets.xcassets
        ${PROJ_SRC_DIR}/Icon.icns
    )
    list(APPEND PROJ_SOURCES
        ${PROJ_SRC_DIR}/main.m
        ${PROJ_SRC_DIR}/ViewController.mm
        ${PROJ_SRC_DIR}/ViewController.h
        ${PROJ_SRC_DIR}/AppDelegate.mm
        ${PROJ_SRC_DIR}/AppDelegate.h
        ${UI_RESOURCES}
    )
elseif(IOS)

    set(UI_RESOURCES
        ${PROJ_SRC_DIR}/LaunchScreenBackground.png
        ${PROJ_SRC_DIR}/Images.xcassets
        ${PROJ_SRC_DIR}/Base.lproj/Localizable.strings
        ${PROJ_SRC_DIR}/Base.lproj/LaunchScreen.storyboard
    )

    list(APPEND PROJ_SOURCES
        ${PROJ_SRC_DIR}/AppDelegate.mm
        ${PROJ_SRC_DIR}/AppDelegate.h
        ${PROJ_SRC_DIR}/main.m
        ${PROJ_SRC_DIR}/ViewController.mm
        ${PROJ_SRC_DIR}/ViewController.h
        ${UI_RESOURCES}
    )
elseif(ANDROID)
    list(APPEND PROJ_SOURCES
        ${PROJ_SRC_DIR}/jni/main.cpp
    )
endif()

set(asset_files)
foreach(res ${GAME_RES_ROOT})
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

if(ANDROID)
    add_library(${LIB_NAME} SHARED ${PROJ_SOURCES} ${PROJ_EXTRA_SOURCE} ${PROJ_COMMON_SOURCES})
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u ANativeActivity_onCreate")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosActivity_onCreateNative")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosActivity_onSurfaceCreateNative")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosActivity_onStartNative")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosActivity_onPauseNative")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosActivity_onResumeNative")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosActivity_onStopNative")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosActivity_onLowMemoryNative")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosActivity_onWindowFocusChangedNative")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosActivity_onSurfaceChangedNative")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosActivity_onSurfaceDestroyNative")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosTouchHandler_handleActionDown")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosTouchHandler_handleActionUp")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosTouchHandler_handleActionMove")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosTouchHandler_handleActionCancel")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosKeyCodeHandler_handleKeyDown")
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS " -u Java_com_cocos_lib_CocosKeyCodeHandler_handleKeyUp")
elseif(APPLE OR MSVC)
    add_executable(${LIB_NAME} ${PROJ_SOURCES} ${asset_files} ${PROJ_EXTRA_SOURCE} ${PROJ_COMMON_SOURCES})
    source_group(TREE ${GAME_RES_ROOT} PREFIX "Resources" FILES ${asset_files})
else()
    add_executable(${LIB_NAME} ${PROJ_SOURCES} ${PROJ_EXTRA_SOURCE} ${PROJ_COMMON_SOURCES})
endif()

target_link_libraries(${LIB_NAME} cocos2d)
target_include_directories(${LIB_NAME} PRIVATE
    Classes
)

source_group(TREE ${PROJ_SRC_DIR} PREFIX "Source Files" FILES ${PROJ_SOURCES})
source_group(TREE ${CMAKE_CURRENT_LIST_DIR} PREFIX "Source Files" FILES ${PROJ_COMMON_SOURCES})

if(APPLE)
    set_target_properties(${LIB_NAME} PROPERTIES MACOSX_BUNDLE 1)
    set_target_properties(${LIB_NAME} PROPERTIES RESOURCE "${UI_RESOURCES}")
    set(EXECUTABLE_NAME ${LIB_NAME}) # referenced in Info.plist
    set(PRODUCT_NAME ${APP_NAME})
    if(MACOSX)
        set(CMAKE_OSX_DEPLOYMENT_TARGET ${TARGET_OSX_VERSION})
        set(MACOSX_BUNDLE_GUI_IDENTIFIER org.cocos2dx.hellojavascript.mac)
        set_target_properties(${LIB_NAME} PROPERTIES MACOSX_BUNDLE_INFO_PLIST "${PROJ_SRC_DIR}/Info.plist")
        set_target_properties(${LIB_NAME} PROPERTIES
            MACOSX_DEPLOYMENT_TARGET ${TARGET_OSX_VERSION}
        )
        get_property(gles2_loc TARGET GLESv2 PROPERTY IMPORTED_LOCATION)
        get_property(egl_loc TARGET EGL PROPERTY IMPORTED_LOCATION)
        add_custom_command(TARGET ${LIB_NAME} POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E make_directory $<TARGET_FILE_DIR:${LIB_NAME}>/../Frameworks
            COMMAND ${CMAKE_COMMAND} -E copy ${gles2_loc} $<TARGET_FILE_DIR:${LIB_NAME}>/../Frameworks
            COMMAND ${CMAKE_COMMAND} -E copy ${egl_loc} $<TARGET_FILE_DIR:${LIB_NAME}>/../Frameworks
        )
    elseif(IOS)
        set(MACOSX_BUNDLE_GUI_IDENTIFIER org.cocos2dx.hellojavascript.ios)

        target_include_directories(${LIB_NAME} PRIVATE ${PROJ_SRC_DIR}/service )

        set_target_properties(${LIB_NAME} PROPERTIES MACOSX_BUNDLE_INFO_PLIST "${PROJ_SRC_DIR}/Info.plist")
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_DEVELOPMENT_TEAM "${DEVELOPMENT_TEAM}")
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "iPhone Developer")
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_APPICON_NAME "AppIcon")
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_LAUNCHSTORYBOARD_NAME "LaunchScreen")
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_IPHONEOS_DEPLOYMENT_TARGET ${TARGET_IOS_VERSION})
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_ENABLE_BITCODE "NO")
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH "YES")
    endif()

elseif(WINDOWS)

    if(EXISTS ${GAME_RES_ROOT}/jsb-adapter)
        set(bin_dir ${CMAKE_CURRENT_BINARY_DIR}/${CMAKE_CFG_INTDIR})
        add_custom_target(copy_resource ALL
            COMMAND ${CMAKE_COMMAND} -E echo "Copying resources to ${bin_dir}"
            COMMAND ${CMAKE_COMMAND} -E make_directory ${bin_dir}/Resources
            COMMAND robocopy "${GAME_RES_ROOT}/" "${bin_dir}/Resources/" /MIR || (exit 0)
            COMMAND ${CMAKE_COMMAND} -E echo "Copying resources done!"
        )
        add_dependencies(${LIB_NAME} copy_resource)
        set_target_properties(copy_resource PROPERTIES FOLDER Utils)
    endif()

    target_include_directories(${LIB_NAME} PRIVATE
        ${GAME_RES_ROOT}/proj
    )

    if(MSVC)
        foreach(item ${WIN32_DLLS})
            get_filename_component(filename ${item} NAME)
            get_filename_component(abs ${item} ABSOLUTE)
            add_custom_command(TARGET ${LIB_NAME} POST_BUILD
                COMMAND ${CMAKE_COMMAND} -E copy_if_different ${abs} $<TARGET_FILE_DIR:${LIB_NAME}>/${filename}
            )
        endforeach()
        target_link_options(${LIB_NAME} PRIVATE /SUBSYSTEM:WINDOWS)
    endif()
endif()
