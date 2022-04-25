
macro(cc_include_resources ARG_RES_ROOT ASSET_FILES)
    set(all_files_local)
    foreach(res ${ARG_RES_ROOT})
        set(res_list)
        if(NOT EXISTS ${res})
            continue()
        endif()

        if(IS_DIRECTORY ${res})
            file(GLOB_RECURSE res_list "${res}/*")
        else()
            set(res_list ${res})
        endif()
        foreach(res ${res_list})
            get_filename_component(res_abs ${res} ABSOLUTE)
            file(RELATIVE_PATH res_rel ${ARG_RES_ROOT} ${res_abs})
            get_filename_component(res_dir ${res_rel} PATH)
            set_source_files_properties(${res_abs} PROPERTIES
                                        MACOSX_PACKAGE_LOCATION "Resources/${res_dir}/"
                                        HEADER_FILE_ONLY 1
                                        )
            list(APPEND all_files_local ${res_abs})
        endforeach()
    endforeach()
    set(${ASSET_FILES} ${all_files_local})
endmacro()

macro(cc_load_hooks prefix_name)
    file(GLOB hook_files ${CC_PROJECT_DIR}/${prefix_name}*.cmake)
    message(STATUS "Searching hook files ${prefix_name}*.cmake in ${CC_PROJECT_DIR}")
    foreach(hook ${hook_files}) 
        get_filename_component(hook_abs ${hook} ABSOLUTE)
        get_filename_component(hook_name ${hook} NAME)
        message(STATUS "::Loading ${hook_name}")
        include(${hook_abs})
    endforeach()
endmacro()


macro(cc_common_after_target target_name)
    target_compile_definitions(${target_name} PRIVATE
        GAME_NAME="${APP_NAME}"
    )
    if(XXTEAKEY)
        target_compile_definitions(${target_name} PRIVATE
            SCRIPT_XXTEAKEY="${XXTEAKEY}"
        )
    endif()
    cc_load_hooks("Post-")
endmacro()

macro(cc_common_before_target target_name)
    set(CC_TARGET_NAME ${target_name})
    if(NOT CC_TARGET_NAME)
        message(FATAL_ERROR "CC_TARGET_NAME is not set!")
    endif()
    cc_load_hooks("Pre-")
endmacro()