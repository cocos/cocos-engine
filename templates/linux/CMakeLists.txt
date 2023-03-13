cmake_minimum_required(VERSION 3.8)

set(APP_NAME "game" CACHE STRING "Project Name")
#set(CMAKE_C_COMPILER "/usr/bin/clang")
#set(CMAKE_CXX_COMPILER "/usr/bin/clang++")

project(${APP_NAME} CXX)

set(CC_PROJECT_DIR ${CMAKE_CURRENT_LIST_DIR})
set(CC_PROJ_SOURCES)
set(CC_COMMON_SOURCES)
set(CC_ALL_SOURCES)
include(${CC_PROJECT_DIR}/../common/CMakeLists.txt)
set(EXECUTABLE_NAME ${APP_NAME})
#set(CMAKE_SYSTEM_NAME Linux)

cc_linux_before_target(${EXECUTABLE_NAME})
add_executable(${EXECUTABLE_NAME} ${CC_ALL_SOURCES})
cc_linux_after_target(${EXECUTABLE_NAME})
