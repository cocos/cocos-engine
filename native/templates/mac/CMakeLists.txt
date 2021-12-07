cmake_minimum_required(VERSION 3.8)

set(APP_NAME "CocosGame" CACHE STRING "Project Name")
project(${APP_NAME} CXX)

include(${CMAKE_CURRENT_LIST_DIR}/../common/CMakeLists.txt)

set(CMAKE_OSX_DEPLOYMENT_TARGET ${TARGET_OSX_VERSION})

if("${TARGET_OSX_VERSION}" VERSION_GREATER_EQUAL "11.0")
    add_definitions(-DMAC_MEMORY_LESS_TEXTURE_SUPPORT=1)
endif()

set(LIB_NAME ${APP_NAME}-desktop)

set(UI_RESOURCES)
set(PROJ_SOURCES)
set(PROJ_COMMON_SOURCES
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/Game.h
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/Game.cpp
)


set(UI_RESOURCES
    ${CMAKE_CURRENT_LIST_DIR}/Assets.xcassets
    ${CMAKE_CURRENT_LIST_DIR}/Icon.icns
)
list(APPEND PROJ_SOURCES
    #${CMAKE_CURRENT_LIST_DIR}/main.m
    #${CMAKE_CURRENT_LIST_DIR}/ViewController.mm
    #${CMAKE_CURRENT_LIST_DIR}/ViewController.h
    #${CMAKE_CURRENT_LIST_DIR}/AppDelegate.mm
    #${CMAKE_CURRENT_LIST_DIR}/AppDelegate.h
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
)

set(EXECUTABLE_NAME ${LIB_NAME}) # referenced in Info.plist
set(PRODUCT_NAME ${APP_NAME})
# set(MACOSX_BUNDLE_GUI_IDENTIFIER org.cocos2dx.hellojavascript.mac)
set_target_properties(${LIB_NAME} PROPERTIES
    MACOSX_DEPLOYMENT_TARGET ${TARGET_OSX_VERSION}
    OSX_ARCHITECTURES "x86_64;arm64"
    XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH YES
    XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_APPICON_NAME "AppIcon"
    XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_LAUNCHSTORYBOARD_NAME "LaunchScreen"
    MACOSX_BUNDLE 1
    RESOURCE "${UI_RESOURCES}"
    MACOSX_BUNDLE_INFO_PLIST "${CMAKE_CURRENT_LIST_DIR}/Info.plist"
    XCODE_ATTRIBUTE_SKIP_INSTALL NO
    XCODE_ATTRIBUTE_INSTALL_PATH "$(LOCAL_APPS_DIR)"
)

option(ENABLE_SANDBOX "enable sandbox with entitlements.plist" ON)
if(ENABLE_SANDBOX)
    set_target_properties(${LIB_NAME} PROPERTIES
        XCODE_ATTRIBUTE_CODE_SIGN_ENTITLEMENTS "${CMAKE_CURRENT_LIST_DIR}/entitlements.plist"
    )
endif()

if(CUSTOM_COPY_RESOURCE_HOOK)
add_custom_command(TARGET ${LIB_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E make_directory $<TARGET_FILE_DIR:${LIB_NAME}>/../Resources
    COMMAND ${CMAKE_COMMAND} -E copy_directory ${RES_DIR}/assets $<TARGET_FILE_DIR:${LIB_NAME}>/../Resources
)
endif()

get_property(gles2_loc TARGET GLESv2 PROPERTY IMPORTED_LOCATION)
get_property(egl_loc TARGET EGL PROPERTY IMPORTED_LOCATION)
add_custom_command(TARGET ${LIB_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E make_directory $<TARGET_FILE_DIR:${LIB_NAME}>/../Frameworks
    COMMAND ${CMAKE_COMMAND} -E copy ${gles2_loc} $<TARGET_FILE_DIR:${LIB_NAME}>/../Frameworks
    COMMAND ${CMAKE_COMMAND} -E copy ${egl_loc} $<TARGET_FILE_DIR:${LIB_NAME}>/../Frameworks
)
