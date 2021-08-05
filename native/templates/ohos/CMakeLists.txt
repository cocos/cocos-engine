# the minimum version of CMake.

cmake_minimum_required(VERSION 3.8)

option(APP_NAME "Project Name" "CocosGame")
project(${APP_NAME} CXX)

set(CMAKE_CXX_FLAGS_DEBUG  "-Werror=return-type")

include(${COMMON_DIR}/CMakeLists.txt)

set(LIB_NAME cocos)


set(PROJ_SOURCES
    ${COMMON_DIR}/Classes/Game.h
    ${COMMON_DIR}/Classes/Game.cpp
    ${CMAKE_CURRENT_LIST_DIR}/entry/src/main/cpp/main.cpp
)


add_library(${LIB_NAME} SHARED ${PROJ_SOURCES})

target_link_libraries(${LIB_NAME}
    "-Wl,--whole-archive" cocos2d_jni "-Wl,--no-whole-archive"
    cocos2d
)

target_include_directories(${LIB_NAME} PRIVATE
    ${COMMON_DIR}/Classes
)

