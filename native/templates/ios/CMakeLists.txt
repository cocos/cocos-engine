cmake_minimum_required(VERSION 3.8)
set(CMAKE_SYSTEM_NAME iOS)
set(APP_NAME "CocosGame"  CACHE STRING "Project Name")
project(${APP_NAME} CXX)

include(${CMAKE_CURRENT_LIST_DIR}/../common/CMakeLists.txt)

set(LIB_NAME ${APP_NAME}-mobile)

set(UI_RESOURCES)
set(PROJ_SOURCES)
set(PROJ_COMMON_SOURCES
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/Game.h
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/Game.cpp
)
if (USE_PORTRAIT)
    configure_file(${CMAKE_CURRENT_LIST_DIR}/LaunchScreenBackgroundPortrait.png ${CMAKE_CURRENT_LIST_DIR}/LaunchScreenBackground.png COPYONLY)
else()
    configure_file(${CMAKE_CURRENT_LIST_DIR}/LaunchScreenBackgroundLandscape.png ${CMAKE_CURRENT_LIST_DIR}/LaunchScreenBackground.png COPYONLY)
endif()

set(UI_RESOURCES
    ${CMAKE_CURRENT_LIST_DIR}/LaunchScreenBackground.png
    ${CMAKE_CURRENT_LIST_DIR}/Images.xcassets
    ${CMAKE_CURRENT_LIST_DIR}/Base.lproj/Localizable.strings
    ${CMAKE_CURRENT_LIST_DIR}/Base.lproj/LaunchScreen.storyboard
)

list(APPEND PROJ_SOURCES
    ${CMAKE_CURRENT_LIST_DIR}/AppDelegate.mm
    ${CMAKE_CURRENT_LIST_DIR}/AppDelegate.h
    ${CMAKE_CURRENT_LIST_DIR}/service/SDKWrapper.m
    ${CMAKE_CURRENT_LIST_DIR}/service/SDKWrapper.h
    ${CMAKE_CURRENT_LIST_DIR}/main.m
    ${CMAKE_CURRENT_LIST_DIR}/ViewController.mm
    ${CMAKE_CURRENT_LIST_DIR}/ViewController.h
    ${UI_RESOURCES}
)
if(NOT CUSTOM_COPY_RESOURCE_HOOK)
    include_resources(${RES_DIR}/assets)
endif()

add_executable(${LIB_NAME} ${PROJ_SOURCES} ${ASSET_FILES} ${PROJ_COMMON_SOURCES})
source_group(TREE ${RES_DIR}/assets PREFIX "Resources" FILES ${ASSET_FILES})
source_group(TREE ${CMAKE_CURRENT_LIST_DIR} PREFIX "Source Files" FILES ${PROJ_SOURCES})
source_group(TREE ${CMAKE_CURRENT_LIST_DIR}/../common PREFIX "Source Files" FILES ${PROJ_COMMON_SOURCES})

target_link_libraries(${LIB_NAME} cocos2d)
target_include_directories(${LIB_NAME} PRIVATE
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes
    ${CMAKE_CURRENT_LIST_DIR}/service
)

set(EXECUTABLE_NAME ${LIB_NAME}) # referenced in Info.plist
set(PRODUCT_NAME ${APP_NAME})

set_target_properties(${LIB_NAME} PROPERTIES 
    MACOSX_BUNDLE_INFO_PLIST "${CMAKE_CURRENT_LIST_DIR}/Info.plist"
    MACOSX_BUNDLE 1
    RESOURCE "${UI_RESOURCES}"
    OSX_ARCHITECTURES "arm64;x86_64"
    MACOSX_DEPLOYMENT_TARGET ${TARGET_IOS_VERSION}
    XCODE_ATTRIBUTE_DEVELOPMENT_TEAM "${DEVELOPMENT_TEAM}"
    XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "iPhone Developer"
    XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_APPICON_NAME "AppIcon"
    XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_LAUNCHSTORYBOARD_NAME "LaunchScreen"
    XCODE_ATTRIBUTE_IPHONEOS_DEPLOYMENT_TARGET ${TARGET_IOS_VERSION}
    XCODE_ATTRIBUTE_ENABLE_BITCODE NO
    XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH YES
    IOS_INSTALL_COMBINED YES
    XCODE_ATTRIBUTE_SKIP_INSTALL NO
    XCODE_ATTRIBUTE_INSTALL_PATH "$(LOCAL_APPS_DIR)"
)

if(CUSTOM_COPY_RESOURCE_HOOK)
add_custom_command(TARGET ${LIB_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory ${RES_DIR}/assets $<TARGET_FILE_DIR:${LIB_NAME}>
    )
endif()
