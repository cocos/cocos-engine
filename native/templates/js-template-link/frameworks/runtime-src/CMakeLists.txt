cmake_minimum_required(VERSION 3.8)

set(APP_NAME MyGame)
project(${APP_NAME} CXX)

enable_language(C ASM)

set(CMAKE_CXX_STANDARD 14)
option(USE_SE_V8        "USE V8 JavaScript Engine"          ON)
option(USE_V8_DEBUGGER  "Enable Chrome Remote inspector"    ON)
option(USE_SE_JSC       "USE JavaScriptCore on MacOSX/iOS"  OFF)
option(USE_VIDEOPLAYER  "Enable VideoPlayer Component"      OFF)
option(USE_WEBVIEW      "Enable WebView Component"          OFF)
option(USE_SOCKET       "Enable WebSocket & SocketIO"       ON)
option(USE_TIFF         "Support TIFF image format"         ON)
option(USE_AUDIO        "Enable Audio"                      ON)     #Enable AudioEngine

if(USE_SE_JSC AND APPLE)
    set(USE_SE_V8 OFF)
    set(USE_V8_DEBUGGER OFF)
endif()

if(CMAKE_OSX_SYSROOT STREQUAL "iphonesimulator")
    set(TARGET_IOS_VERSION "9.0")
else()
    set(TARGET_IOS_VERSION "8.0")
endif()

set(cocosdir "${COCOS_X_ROOT}")
if(NOT cocosdir)
    message(FATAL_ERROR "COCOS_X_ROOT is not set!")
endif()
include(${cocosdir}/CMakeLists.txt)

if(ANDROID)
    set(LIB_NAME cocos2djs)
elseif(MACOSX)
    set(LIB_NAME ${APP_NAME}-desktop)
elseif(IOS)
    set(LIB_NAME ${APP_NAME}-mobile)
else()
    set(LIB_NAME ${APP_NAME})
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
    Classes/Game.h
    Classes/Game.cpp
)

if(EXISTS  Classes/jsb_module_register.cpp)
    list(APPEND PROJ_SOURCES
        Classes/jsb_module_register.cpp
        )
else()
    list(APPEND PROJ_EXTRA_SOURCE
        "${cocosdir}/cocos/scripting/js-bindings/manual/jsb_module_register.cpp"
        )
    source_group("Source Files\\Classes" FILES ${PROJ_EXTRA_SOURCE})
endif()

if(WINDOWS)
    list(APPEND PROJ_SOURCES
        proj.win32/AppDelegate.h
        proj.win32/AppDelegate.cpp
        proj.win32/main.h
        proj.win32/main.cpp
        proj.win32/resource.h
    )
elseif(MACOSX)
    set(UI_RESOURCES
        proj.ios_mac/mac/Assets.xcassets
       # proj.ios_mac/mac/UserConfigMac.release.xcconfig
       # proj.ios_mac/mac/UserConfigMac.debug.xcconfig
        proj.ios_mac/mac/Icon.icns
    )
    list(APPEND PROJ_SOURCES
        proj.ios_mac/mac/main.m
        proj.ios_mac/mac/ViewController.mm
        proj.ios_mac/mac/ViewController.h
        proj.ios_mac/mac/Prefix.pch
        proj.ios_mac/mac/AppDelegate.mm
        proj.ios_mac/mac/AppDelegate.h
        ${UI_RESOURCES}
    )
elseif(IOS)

    set(UI_RESOURCES
        #proj.ios_mac/ios/zh-Hans.lproj/Localizable.strings
        #proj.ios_mac/ios/UserConfigIOS.release.xcconfig
        #proj.ios_mac/ios/UserConfigIOS.debug.xcconfig
        #proj.ios_mac/ios/Prefix.pch
        proj.ios_mac/ios/LaunchScreenBackground.png
        #proj.ios_mac/ios/Info.plist
        proj.ios_mac/ios/Images.xcassets
        proj.ios_mac/ios/Base.lproj/Localizable.strings
        proj.ios_mac/ios/Base.lproj/LaunchScreen.storyboard
    )

    list(APPEND PROJ_SOURCES
        proj.ios_mac/ios/AppDelegate.mm
        proj.ios_mac/ios/AppDelegate.h
        proj.ios_mac/ios/SDKWrapper.m
        proj.ios_mac/ios/SDKWrapper.h
        proj.ios_mac/ios/service/SDKDelegate.h
        proj.ios_mac/ios/main.m
        proj.ios_mac/ios/ViewController.mm
        proj.ios_mac/ios/ViewController.h
        ${UI_RESOURCES}
    )
elseif(ANDROID)
    list(APPEND PROJ_SOURCES
        proj.android-studio/app/jni/hellojavascript/main.cpp
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

if(ANDROID)
    add_library(${LIB_NAME} SHARED ${PROJ_SOURCES} ${PROJ_EXTRA_SOURCE})
    set_property(TARGET ${LIB_NAME} APPEND_STRING PROPERTY LINK_FLAGS "-u ANativeActivity_onCreate")
elseif(APPLE OR MSVC)
    add_executable(${LIB_NAME} ${PROJ_SOURCES} ${asset_files} ${PROJ_EXTRA_SOURCE})
    source_group(TREE ${GAME_RES_ROOT} PREFIX "Resources" FILES ${asset_files})
else() 
    add_executable(${LIB_NAME} ${PROJ_SOURCES} ${PROJ_EXTRA_SOURCE})
endif()

target_link_libraries(${LIB_NAME} cocos2d)
target_include_directories(${LIB_NAME} PRIVATE 
    Classes
)

source_group(TREE ${CMAKE_CURRENT_LIST_DIR} PREFIX "Source Files" FILES ${PROJ_SOURCES})

if(APPLE)
    set_target_properties(${LIB_NAME} PROPERTIES MACOSX_BUNDLE 1)
    set_target_properties(${LIB_NAME} PROPERTIES RESOURCE "${UI_RESOURCES}")
    if(MACOSX)
        set_target_properties(${LIB_NAME} PROPERTIES MACOSX_BUNDLE_INFO_PLIST "${CMAKE_CURRENT_LIST_DIR}/proj.ios_mac/mac/Info.plist")
        set_target_properties(${LIB_NAME} PROPERTIES
            MACOSX_DEPLOYMENT_TARGET 10.10
        )
        get_property(gles2_loc TARGET GLESv2 PROPERTY IMPORTED_LOCATION)
        get_property(egl_loc TARGET EGL PROPERTY IMPORTED_LOCATION)
        add_custom_command(TARGET ${LIB_NAME} POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E make_directory $<TARGET_FILE_DIR:${LIB_NAME}>/../Frameworks
            COMMAND ${CMAKE_COMMAND} -E copy ${gles2_loc} $<TARGET_FILE_DIR:${LIB_NAME}>/../Frameworks
            COMMAND ${CMAKE_COMMAND} -E copy ${egl_loc} $<TARGET_FILE_DIR:${LIB_NAME}>/../Frameworks
        )
    elseif(IOS)
        set(EXECUTABLE_NAME ${LIB_NAME}) # referenced in Info.plist
        set(PRODUCT_NAME ${APP_NAME})
        set(MACOSX_BUNDLE_GUI_IDENTIFIER org.cocos2dx.test-cases-3d)
        target_include_directories(${LIB_NAME} PRIVATE proj.ios_mac/ios/service )
        set_target_properties(${LIB_NAME} PROPERTIES MACOSX_BUNDLE_INFO_PLIST "${CMAKE_CURRENT_LIST_DIR}/proj.ios_mac/ios/Info.plist")
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_DEVELOPMENT_TEAM "")
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "iPhone Developer")
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_APPICON_NAME "AppIcon")
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_LAUNCHSTORYBOARD_NAME "LaunchScreen")
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_IPHONEOS_DEPLOYMENT_TARGET ${TARGET_IOS_VERSION})
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_ENABLE_BITCODE "NO")
        set_property(TARGET ${LIB_NAME} PROPERTY XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH "YES")
    endif()

elseif(WINDOWS)
    
    if(EXISTS ${CMAKE_CURRENT_LIST_DIR}/../../jsb-adapter)
        add_custom_command(TARGET ${LIB_NAME} POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy_directory ${CMAKE_CURRENT_LIST_DIR}/../../jsb-adapter $<TARGET_FILE_DIR:${LIB_NAME}>/jsb-adapter
            COMMAND ${CMAKE_COMMAND} -E copy_directory ${CMAKE_CURRENT_LIST_DIR}/../../res $<TARGET_FILE_DIR:${LIB_NAME}>/res
            COMMAND ${CMAKE_COMMAND} -E copy_directory ${CMAKE_CURRENT_LIST_DIR}/../../src $<TARGET_FILE_DIR:${LIB_NAME}>/src
            COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_LIST_DIR}/../../main.js $<TARGET_FILE_DIR:${LIB_NAME}>/main.js
            COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_LIST_DIR}/../../project.json $<TARGET_FILE_DIR:${LIB_NAME}>/project.json
        )
    endif()
    
    target_include_directories(${LIB_NAME} PRIVATE 
        ${CMAKE_CURRENT_LIST_DIR}/proj.win32
    )

    if(MSVC) 
        foreach(item ${WIN32_DLLS})
            get_filename_component(filename ${item} NAME)
            get_filename_component(abs ${item} ABSOLUTE)
            add_custom_command(TARGET ${LIB_NAME} POST_BUILD
                COMMAND ${CMAKE_COMMAND} -E copy_if_different ${abs} $<TARGET_FILE_DIR:${LIB_NAME}>/${filename}
            )
        endforeach()
        target_compile_options(${LIB_NAME} PUBLIC /MP)
        target_link_options(${LIB_NAME} PRIVATE /SUBSYSTEM:WINDOWS)
    endif()
endif()

