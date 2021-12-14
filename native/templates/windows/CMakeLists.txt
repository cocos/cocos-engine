cmake_minimum_required(VERSION 3.8)

set(APP_NAME "CocosGame" CACHE STRING "Project Name")
project(${APP_NAME} CXX)

include(${CMAKE_CURRENT_LIST_DIR}/../common/CMakeLists.txt)

set(LIB_NAME ${APP_NAME})

set(UI_RESOURCES)
set(PROJ_SOURCES)
set(PROJ_COMMON_SOURCES
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/Game.h
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes/Game.cpp
)

set(UI_RESOURCES
    ${CMAKE_CURRENT_LIST_DIR}/game.rc
)
list(APPEND PROJ_SOURCES

    ${CMAKE_CURRENT_LIST_DIR}/resource.h
    ${UI_RESOURCES}
)

include_resources(${RES_DIR}/assets)

add_executable(${LIB_NAME}
    ${PROJ_SOURCES}
    ${PROJ_COMMON_SOURCES}
    ${ASSET_FILES}
)
source_group(TREE ${RES_DIR}/assets PREFIX "Resources" FILES ${ASSET_FILES})
source_group(TREE ${CMAKE_CURRENT_LIST_DIR} PREFIX "Source Files" FILES ${PROJ_SOURCES})
source_group(TREE ${CMAKE_CURRENT_LIST_DIR}/../common PREFIX "Source Files" FILES ${PROJ_COMMON_SOURCES})


target_link_libraries(${LIB_NAME} cocos2d)
target_include_directories(${LIB_NAME} PRIVATE
    ${CMAKE_CURRENT_LIST_DIR}/../common/Classes
    ${RES_DIR}/assets/proj
)

set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT ${LIB_NAME})

if(EXISTS ${RES_DIR}/assets/jsb-adapter)
    set(bin_dir ${CMAKE_CURRENT_BINARY_DIR}/${CMAKE_CFG_INTDIR})
    add_custom_target(copy_resource ALL
        COMMAND ${CMAKE_COMMAND} -E echo "Copying resources to ${bin_dir}"
        COMMAND ${CMAKE_COMMAND} -E make_directory ${bin_dir}/Resources
        COMMAND robocopy "${RES_DIR}/assets/" "${bin_dir}/Resources/" /MIR || (exit 0)
        COMMAND ${CMAKE_COMMAND} -E echo "Copying resources done!"
    )
    add_dependencies(${LIB_NAME} copy_resource)
    set_target_properties(copy_resource PROPERTIES FOLDER Utils)
endif()

if(MSVC)
    foreach(item ${WIN32_DLLS})
        get_filename_component(filename ${item} NAME)
        get_filename_component(abs ${item} ABSOLUTE)
        add_custom_command(TARGET ${LIB_NAME} POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy_if_different ${abs} $<TARGET_FILE_DIR:${LIB_NAME}>/${filename}
        )
    endforeach()
    if(${CMAKE_SIZEOF_VOID_P} STREQUAL "4")
        target_link_options(${LIB_NAME} PRIVATE /SUBSYSTEM:WINDOWS /LARGEADDRESSAWARE)
    else()
        target_link_options(${LIB_NAME} PRIVATE /SUBSYSTEM:WINDOWS)
    endif()
endif()
