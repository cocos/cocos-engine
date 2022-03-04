cmake_minimum_required(VERSION 3.8)

option(APP_NAME "Project Name" "CocosGame")
project(${APP_NAME} CXX)

include(${CMAKE_CURRENT_LIST_DIR}/../common/CMakeLists.txt)


set(LIB_NAME cocos)

set(PROJ_SOURCES
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/Game.h
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/Game.cpp
)


add_library(${LIB_NAME} SHARED ${PROJ_SOURCES})

target_link_libraries(${LIB_NAME}
    "-Wl,--whole-archive" cocos_jni "-Wl,--no-whole-archive"
    ${ENGINE_NAME}
)

target_include_directories(${LIB_NAME} PRIVATE
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes
)
