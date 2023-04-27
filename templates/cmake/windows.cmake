
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
    )
endfunction()


macro(cc_windows_before_target _target_name)

    if(${CMAKE_SIZEOF_VOID_P} STREQUAL "4")
        message(FATAL_ERROR "Win32 architecture is no more supported!!!")
    endif()

    if((NOT DEFINED CC_EXECUTABLE_NAME) OR "${CC_EXECUTABLE_NAME}" STREQUAL "")
        if(${APP_NAME} MATCHES "^[_0-9a-zA-Z-]+$")
            set(CC_EXECUTABLE_NAME ${APP_NAME})
        else()
            set(CC_EXECUTABLE_NAME CocosGame)
        endif()
    endif()

    if(EXECUTABLE_NAME)
        set(EXECUTABLE_NAME ${CC_EXECUTABLE_NAME})
    endif()

    list(APPEND CC_UI_RESOURCES
        ${CC_PROJECT_DIR}/game.rc
    )
    list(APPEND CC_PROJ_SOURCES
        ${CC_PROJECT_DIR}/main.cpp
        ${CC_PROJECT_DIR}/resource.h
        ${CC_UI_RESOURCES}
    )
    cc_include_resources(${RES_DIR}/data CC_ASSET_FILES)
    list(APPEND CC_ALL_SOURCES ${CC_PROJ_SOURCES} ${CC_COMMON_SOURCES} ${CC_ASSET_FILES})
    cc_common_before_target(${CC_EXECUTABLE_NAME})
endmacro()


macro(cc_windows_after_target _target_name)
        
    source_group(TREE ${RES_DIR}/data PREFIX "Resources" FILES ${CC_ASSET_FILES})
    source_group(TREE ${CC_PROJECT_DIR} PREFIX "Source Files" FILES ${CC_PROJ_SOURCES})
    source_group(TREE ${CC_PROJECT_DIR}/../common PREFIX "Source Files" FILES ${CC_COMMON_SOURCES})
    
    
    target_link_libraries(${CC_EXECUTABLE_NAME} ${ENGINE_NAME})
    target_include_directories(${CC_EXECUTABLE_NAME} PRIVATE
        ${CC_PROJECT_DIR}/../common/Classes
    )

    set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT ${CC_EXECUTABLE_NAME})
    cc_common_after_target(${CC_EXECUTABLE_NAME})
    if(EXISTS ${RES_DIR}/data/jsb-adapter)
        set(bin_dir ${CMAKE_CURRENT_BINARY_DIR}/${CMAKE_CFG_INTDIR})
        add_custom_target(copy_resource ALL
            COMMAND ${CMAKE_COMMAND} -E echo "Copying resources to ${bin_dir}"
            COMMAND ${CMAKE_COMMAND} -E make_directory ${bin_dir}/Resources
            COMMAND robocopy "${RES_DIR}/data/" "${bin_dir}/Resources/" /MIR || (exit 0)
            COMMAND ${CMAKE_COMMAND} -E echo "Copying resources done!"
        )
        add_dependencies(${CC_EXECUTABLE_NAME} copy_resource)
        set_target_properties(copy_resource PROPERTIES FOLDER Utils)
    endif()

    if(MSVC)
        foreach(item ${WINDOWS_DLLS})
            get_filename_component(filename ${item} NAME)
            get_filename_component(abs ${item} ABSOLUTE)
            add_custom_command(TARGET ${CC_EXECUTABLE_NAME} POST_BUILD
                COMMAND ${CMAKE_COMMAND} -E copy_if_different ${abs} $<TARGET_FILE_DIR:${CC_EXECUTABLE_NAME}>/${filename}
            )
        endforeach()
        foreach(item ${V8_DLLS})
            get_filename_component(filename ${item} NAME)
            add_custom_command(TARGET ${CC_EXECUTABLE_NAME} POST_BUILD
                COMMAND ${CMAKE_COMMAND} -E copy_if_different ${V8_DIR}/$<IF:$<BOOL:$<CONFIG:RELEASE>>,Release,Debug>/${filename} $<TARGET_FILE_DIR:${CC_EXECUTABLE_NAME}>/${filename}
            )
        endforeach()
        target_link_options(${CC_EXECUTABLE_NAME} PRIVATE /SUBSYSTEM:WINDOWS)
    endif()

endmacro()
