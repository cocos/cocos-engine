
macro(cc_linux_before_target target_name)
    add_definitions(-DV8_COMPRESS_POINTERS) #TODO move defination to external/v8

    cc_include_resources(${RES_DIR}/data CC_ASSET_FILES)

    source_group(TREE ${RES_DIR}/data PREFIX "Resources" FILES ${CC_ASSET_FILES})
    source_group(TREE ${CC_PROJECT_DIR} PREFIX "Source Files" FILES ${CC_PROJ_SOURCES})
    source_group(TREE ${CC_PROJECT_DIR}/../common PREFIX "Source Files" FILES ${CC_COMMON_SOURCES})

    list(APPEND CC_PROJ_SOURCES
        ${CC_PROJECT_DIR}/main.cpp
        ${CC_UI_RESOURCES}
    )
	
    set(CMAKE_BUILD_WITH_INSTALL_RPATH TRUE) 
    set(CMAKE_INSTALL_RPATH "\${ORIGIN}")
    list(APPEND CC_ALL_SOURCES ${CC_PROJ_SOURCES} 
        ${CC_COMMON_SOURCES}
        ${CC_ASSET_FILES}
    )
    cc_common_before_target(${target_name})
endmacro()

macro(cc_linux_after_target target_name)
    set_target_properties(${target_name} PROPERTIES
        COMPILE_FLAGS "-pthread"
        LINK_FLAGS "-pthread -lsndio ")

    target_link_libraries(${target_name} dl ${ENGINE_NAME})

    target_include_directories(${target_name} PRIVATE
        ${CC_PROJECT_DIR}/../common/Classes
    )

    
    if(EXISTS ${RES_DIR}/data/jsb-adapter)
        set(bin_dir ${CMAKE_CURRENT_BINARY_DIR})
        add_custom_target(copy_resource ALL
            COMMAND ${CMAKE_COMMAND} -E echo "Copying resources to ${bin_dir}"
            COMMAND ${CMAKE_COMMAND} -E make_directory ${bin_dir}/Resources
            COMMAND cp -r ${RES_DIR}/data/* ${bin_dir}/Resources/
            COMMAND ${CMAKE_COMMAND} -E echo "Copying resources done!"
        )
        add_dependencies(${target_name} copy_resource)
        set_target_properties(copy_resource PROPERTIES FOLDER Utils)
    endif()

    cc_common_after_target(${target_name})
endmacro()