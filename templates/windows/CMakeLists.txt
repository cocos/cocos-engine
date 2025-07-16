cmake_minimum_required(VERSION 3.18)

set(APP_NAME "CocosGame" CACHE STRING "Project Name")
project(${APP_NAME} CXX)
set(CC_PROJECT_DIR ${CMAKE_CURRENT_LIST_DIR})
set(CC_UI_RESOURCES)
set(CC_PROJ_SOURCES)
set(CC_COMMON_SOURCES)
set(CC_ALL_SOURCES)
include(${CC_PROJECT_DIR}/../common/CMakeLists.txt)
set(EXECUTABLE_NAME ${APP_NAME})

cc_windows_before_target(${EXECUTABLE_NAME})
add_executable(${EXECUTABLE_NAME}
    ${CC_ALL_SOURCES}
)
cc_windows_after_target(${EXECUTABLE_NAME})