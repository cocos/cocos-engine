
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