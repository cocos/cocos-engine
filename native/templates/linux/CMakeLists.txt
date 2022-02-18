project(test)
cmake_minimum_required(VERSION 3.8)



set(APP_NAME "game" CACHE STRING "Project Name")
project(${APP_NAME} CXX)

include(${CMAKE_CURRENT_LIST_DIR}/../common/CMakeLists.txt)

set(LIB_NAME ${APP_NAME})

set(UI_RESOURCES)
set(PROJ_SOURCES)

set(CMAKE_C_COMPILER "/usr/bin/clang")
set(CMAKE_CXX_COMPILER "/usr/bin/clang++")
#set(CMAKE_SYSTEM_NAME Linux)

ADD_DEFINITIONS(-DV8_COMPRESS_POINTERS)

set(PROJ_COMMON_SOURCES
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/Game.cpp
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/Game.h
)

include_resources(${RES_DIR}/assets)

add_executable(${APP_NAME} 
    ${PROJ_SOURCES} 
    ${PROJ_COMMON_SOURCES}
    ${ASSET_FILES}
)
source_group(TREE ${RES_DIR}/assets PREFIX "Resources" FILES ${ASSET_FILES})
source_group(TREE ${CMAKE_CURRENT_LIST_DIR} PREFIX "Source Files" FILES ${PROJ_SOURCES})
source_group(TREE ${CMAKE_CURRENT_LIST_DIR}/../common PREFIX "Source Files" FILES ${PROJ_COMMON_SOURCES})

SET(CMAKE_BUILD_WITH_INSTALL_RPATH TRUE) 
SET(CMAKE_INSTALL_RPATH "\${ORIGIN}")

set_target_properties(${APP_NAME} PROPERTIES
COMPILE_FLAGS "-pthread"
LINK_FLAGS "-pthread ")


target_link_libraries(${APP_NAME} dl cocos2d)
target_include_directories(${APP_NAME} PRIVATE
    ${RES_DIR}/assets/proj
)

set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT ${APP_NAME})

if(EXISTS ${RES_DIR}/assets/jsb-adapter)
    set(bin_dir ${CMAKE_CURRENT_BINARY_DIR}/${CMAKE_CFG_INTDIR})
    add_custom_target(copy_resource ALL
        COMMAND ${CMAKE_COMMAND} -E echo "Copying resources to ${bin_dir}"
        COMMAND ${CMAKE_COMMAND} -E make_directory ${bin_dir}/Resources
        COMMAND robocopy "${RES_DIR}/assets/" "${bin_dir}/Resources/" /MIR || (exit 0)
        COMMAND ${CMAKE_COMMAND} -E echo "Copying resources done!"
    )
    add_dependencies(${APP_NAME} copy_resource)
    set_target_properties(copy_resource PROPERTIES FOLDER Utils)
endif()
