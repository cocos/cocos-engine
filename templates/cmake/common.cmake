
if(POLICY CMP0074)
# https://cmake.org/cmake/help/latest/policy/CMP0074.html
cmake_policy(SET CMP0074 NEW)
endif()

if(POLICY CMP0111)
# https://cmake.org/cmake/help/latest/policy/CMP0111.html
cmake_policy(SET CMP0111 OLD)
endif()

# set(CC_REGISTERED_PLUGINS)

function(cc_plugin_entry)
    set(entry_content)
    list(LENGTH CC_REGISTERED_PLUGINS PLG_CNT)
    if(PLG_CNT GREATER 0)
        message(STATUS "Generating plugin_registry code, total ${PLG_CNT} plugins")
        string(APPEND entry_content "// automatically generated code, do not manually modify\n\n")
        #if(WINDOWS)
        #      string(APPEND entry_content "void cc_windows_load_plugin_dll(const char *)\; // NOLINT\n\n") 
        #endif()
        string(APPEND entry_content "// plugin entry list begin, size ${PLG_CNT}\n")
        foreach(pname ${CC_REGISTERED_PLUGINS})
            # if(WINDOWS)
            #   string(APPEND entry_content "void cc_load_plugin_${pname}(){ // NOLINT\n  cc_windows_load_plugin_dll(\"${pname}\")\;\n}\n") 
            # else()
              string(APPEND entry_content "extern \"C\" void cc_load_plugin_${pname}()\; // NOLINT\n") 
            # endif()
        endforeach()
        string(APPEND entry_content "// plugin entry list end\n")
        string(APPEND entry_content "\n\n//NOLINTNEXTLINE\n")
        string(APPEND entry_content "extern \"C\" void cc_load_all_plugins() {\n") 
        foreach(pname ${CC_REGISTERED_PLUGINS})
            string(APPEND entry_content "    cc_load_plugin_${pname}()\;\n")
        endforeach()
        string(APPEND entry_content "}\n")
        set(GEN_PATH ${CMAKE_CURRENT_BINARY_DIR}/plugin_registry_autogen.cpp)
        set(GEN_PATH_TMP ${GEN_PATH}.tmp)
        file(WRITE ${GEN_PATH_TMP} ${entry_content})
        execute_process(COMMAND ${CMAKE_COMMAND} -E copy_if_different ${GEN_PATH_TMP} ${GEN_PATH})
        file(REMOVE ${GEN_PATH_TMP})
        if(TARGET plugin_registry)
            message(AUTHOR_WARNING "Target library \"plugin_registry\" already exists, skip generating.")
        else()
            add_library(plugin_registry STATIC ${GEN_PATH})
            target_link_libraries(plugin_registry ${CC_REGISTERED_PLUGINS})
        endif()
        set_target_properties(plugin_registry PROPERTIES
            INTERFACE_COMPILE_DEFINITIONS CC_USE_PLUGINS=1 
        )
        target_compile_definitions(${ENGINE_NAME} PUBLIC
            CC_USE_PLUGINS=1 
        )
    else()
        message(STATUS "No plugins are loaded!")
    endif()

endfunction()


function(cc_gen_plugin_cmake_hook)
    set(project_root_dir ${CC_PROJECT_DIR}/../../..)
    set(load_plugin_cmake ${CC_PROJECT_DIR}/Pre-AutoLoadPlulgins.cmake)
    message(STATUS "Try generating ${load_plugin_cmake}")
    file(REMOVE ${load_plugin_cmake})
    list(APPEND CC_PLUGIN_PATH 
        ${project_root_dir}/native 
        ${project_root_dir}/extensions
        )
    set(plugin_args_info ${CMAKE_CURRENT_BINARY_DIR}/plugin_dirs.txt)
    file(WRITE ${plugin_args_info} "# directories for searching native plugins\n")
    foreach(dir ${CC_PLUGIN_PATH})
        get_filename_component(abs_dir ${dir} ABSOLUTE)
        file(APPEND ${plugin_args_info} "${abs_dir}\n")
    endforeach()
    if("${NODE_EXECUTABLE}" STREQUAL "NODE_EXECUTABLE-NOTFOUND")
        message(STATUS "NodeJS is not found in $PATH, skip searching native plugins.")
    else()
        message(STATUS " execute ${NODE_EXECUTABLE} plugin_parser.js")
        execute_process(COMMAND ${NODE_EXECUTABLE} "${COCOS_X_PATH}/cmake/scripts/plugins_parser.js"
            "${plugin_args_info}"
            "${load_plugin_cmake}"
            "${PLATFORM_FOLDER}"
            WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}
            )
    endif()
endfunction()

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
    file(GLOB hook_files ${CC_PROJECT_DIR}/${prefix_name}*.cmake ${CC_PROJECT_DIR}/*${prefix_name}.cmake)
    message(STATUS "Searching hook files ${prefix_name}*.cmake or *${prefix_name}.cmake in ${CC_PROJECT_DIR}")
    foreach(hook ${hook_files}) 
        get_filename_component(hook_abs ${hook} ABSOLUTE)
        get_filename_component(hook_name ${hook} NAME)
        message(STATUS "::Loading ${hook_name}")
        include(${hook_abs})
    endforeach()
endmacro()


macro(cc_common_after_target target_name)

    if(TARGET plugin_registry)
        target_link_libraries(${target_name} plugin_registry)
    endif()

    target_compile_definitions(${target_name} PRIVATE
        GAME_NAME="${CC_EXECUTABLE_NAME}"
    )
    if(XXTEAKEY)
        target_compile_definitions(${target_name} PRIVATE
            SCRIPT_XXTEAKEY="${XXTEAKEY}"
        )
    endif()
    cc_load_hooks("Post")
endmacro()

macro(cc_common_before_target target_name)
    set(CC_TARGET_NAME ${target_name})
    if(NOT CC_TARGET_NAME)
        message(FATAL_ERROR "CC_TARGET_NAME is not set!")
    endif()
    if(NOT SKIP_SCAN_PLUGINS AND USE_PLUGINS)
      cc_gen_plugin_cmake_hook()
    else()
        message(STATUS " Skip search plugins")
    endif()
    cc_load_hooks("Pre")
    if(USE_PLUGINS)
        cc_plugin_entry()
    endif()
endmacro()

