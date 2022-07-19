# the minimum version of CMake.

cmake_minimum_required(VERSION 3.8)

option(APP_NAME "Project Name" "CocosGame")
project(${APP_NAME} CXX)

set(CC_PROJECT_DIR ${CMAKE_CURRENT_LIST_DIR})
set(CC_LIB_NAME cocos)
set(CC_PROJ_SOURCES)
set(CC_COMMON_SOURCES)
set(CC_ALL_SOURCES)

include(${CC_PROJECT_DIR}/../common/CMakeLists.txt)

cc_ohos_before_target(${CC_LIB_NAME})
add_library(${CC_LIB_NAME} SHARED ${CC_ALL_SOURCES})
cc_ohos_after_target(${CC_LIB_NAME})