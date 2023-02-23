# the minimum version of CMake.

cmake_minimum_required(VERSION 3.8)
set(APP_NAME "CocosGame" CACHE STRING "Project Name")
project(${APP_NAME} CXX)
set(CC_PROJECT_DIR ${CMAKE_CURRENT_LIST_DIR})
set(CC_UI_RESOURCES)
set(CC_PROJ_SOURCES)
set(CC_COMMON_SOURCES)
set(CC_ALL_SOURCES)

set(CC_LIB_NAME cocos)
set(CMAKE_CXX_FLAGS_DEBUG  "-Werror=return-type")

include(${CC_PROJECT_DIR}/../common/CMakeLists.txt)

cc_openharmony_before_target(${CC_LIB_NAME})
add_library(${CC_LIB_NAME} SHARED ${CC_ALL_SOURCES})
cc_openharmony_after_target(${CC_LIB_NAME})