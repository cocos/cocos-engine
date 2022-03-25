cmake_minimum_required(VERSION 3.8)

set(APP_NAME "CocosGame" CACHE STRING "Project Name")
option(ENABLE_SANDBOX "enable sandbox  entitlements.plist" ON)

project(${APP_NAME} CXX)

set(CMAKE_OSX_DEPLOYMENT_TARGET ${TARGET_OSX_VERSION})
set(CC_PROJECT_DIR ${CMAKE_CURRENT_LIST_DIR})
set(CC_UI_RESOURCES)
set(CC_PROJ_SOURCES)
set(CC_ASSET_FILES)
set(CC_COMMON_SOURCES)
set(CC_ALL_SOURCES)
include(${CC_PROJECT_DIR}/../common/CMakeLists.txt)
set(EXECUTABLE_NAME ${APP_NAME}-desktop)

cc_mac_before_target(${EXECUTABLE_NAME})
add_executable(${EXECUTABLE_NAME} ${CC_ALL_SOURCES})
cc_mac_after_target(${EXECUTABLE_NAME})