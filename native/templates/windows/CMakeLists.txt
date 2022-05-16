cmake_minimum_required(VERSION 3.8)

set(ENGINE_NAME "cocos_engine" CACHE STRING "Project Name")
set(APP_NAME "test-cases-3d")
project(${APP_NAME} CXX)
set(CC_PROJECT_DIR ${CMAKE_CURRENT_LIST_DIR})
set(CC_UI_RESOURCES)
set(CC_PROJ_SOURCES)
set(CC_COMMON_SOURCES)
set(CC_ALL_SOURCES)
include(${CC_PROJECT_DIR}/../common/CMakeLists.txt)
set(EXECUTABLE_NAME ${ENGINE_NAME})

cc_windows_before_target(${EXECUTABLE_NAME})
add_library(${EXECUTABLE_NAME} SHARED
    ${CC_ALL_SOURCES}
)
target_compile_definitions(${EXECUTABLE_NAME} PUBLIC
    EXPORT_MAIN
)
cc_windows_after_target(${EXECUTABLE_NAME})

add_executable(${APP_NAME}
    ${CMAKE_CURRENT_LIST_DIR}/main.cpp
)
target_link_libraries(${APP_NAME} PUBLIC ${EXECUTABLE_NAME})