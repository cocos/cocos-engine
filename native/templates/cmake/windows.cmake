
function(cc_win32_definations target)
    target_compile_definitions(${target} PUBLIC
        CC_STATIC
        WIN32
        _WIN32
        _WINDOWS
        NOMINMAX
        UNICODE
        _UNICODE
        _USE_MATH_DEFINES
        _CRT_SECURE_NO_WARNINGS
        _SCL_SECURE_NO_WARNINGS
        _USRLIBSIMSTATIC
        SE_ENABLE_INSPECTOR
    )
endfunction()


macro(cc_windows_before_target target_name)
    set(CC_UI_RESOURCES
        ${CC_PROJECT_DIR}/game.rc
    )
    list(APPEND CC_PROJ_SOURCES
        ${CC_PROJECT_DIR}/cc_main.h
        ${CC_PROJECT_DIR}/sdlmain.cpp
        ${CC_PROJECT_DIR}/resource.h
        ${CC_UI_RESOURCES}
    )
    cc_include_resources(${RES_DIR}/data CC_ASSET_FILES)
    set(CC_ALL_SOURCES ${CC_PROJ_SOURCES} ${CC_COMMON_SOURCES} ${CC_ASSET_FILES})
    cc_common_before_target(${target_name})
endmacro()


macro(cc_windows_after_target target_name)
        
    source_group(TREE ${RES_DIR}/data PREFIX "Resources" FILES ${CC_ASSET_FILES})
    source_group(TREE ${CC_PROJECT_DIR} PREFIX "Source Files" FILES ${CC_PROJ_SOURCES})
    source_group(TREE ${CC_PROJECT_DIR}/../common PREFIX "Source Files" FILES ${CC_COMMON_SOURCES})
    
    
    target_link_libraries(${target_name} cocos2d)
    target_include_directories(${target_name} PRIVATE
        ${CC_PROJECT_DIR}/../common/Classes
    )

    set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT ${target_name})
    cc_common_after_target(${target_name})
    if(EXISTS ${RES_DIR}/data/jsb-adapter)
        set(bin_dir ${CMAKE_CURRENT_BINARY_DIR}/${CMAKE_CFG_INTDIR})
        add_custom_target(copy_resource ALL
            COMMAND ${CMAKE_COMMAND} -E echo "Copying resources to ${bin_dir}"
            COMMAND ${CMAKE_COMMAND} -E make_directory ${bin_dir}/Resources
            COMMAND robocopy "${RES_DIR}/data/" "${bin_dir}/Resources/" /MIR || (exit 0)
            COMMAND ${CMAKE_COMMAND} -E echo "Copying resources done!"
        )
        add_dependencies(${target_name} copy_resource)
        set_target_properties(copy_resource PROPERTIES FOLDER Utils)
    endif()

    if(MSVC)
        foreach(item ${WIN32_DLLS})
            get_filename_component(filename ${item} NAME)
            get_filename_component(abs ${item} ABSOLUTE)
            add_custom_command(TARGET ${target_name} POST_BUILD
                COMMAND ${CMAKE_COMMAND} -E copy_if_different ${abs} $<TARGET_FILE_DIR:${target_name}>/${filename}
            )
        endforeach()
        if(${CMAKE_SIZEOF_VOID_P} STREQUAL "4")
            target_link_options(${target_name} PRIVATE /SUBSYSTEM:WINDOWS /LARGEADDRESSAWARE)
        else()
            target_link_options(${target_name} PRIVATE /SUBSYSTEM:WINDOWS)
        endif()
    endif()

endmacro()
