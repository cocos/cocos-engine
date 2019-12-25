
add_library(crypto STATIC IMPORTED GLOBAL)
set_target_properties(crypto PROPERTIES
  IMPORTED_LOCATION ${platform_spec_path}/libcrypto.a
)

add_library(freetype STATIC IMPORTED GLOBAL)
set_target_properties(freetype PROPERTIES
  IMPORTED_LOCATION ${platform_spec_path}/libfreetype.a
)

add_library(jpeg STATIC IMPORTED GLOBAL)
set_target_properties(jpeg PROPERTIES
  IMPORTED_LOCATION ${platform_spec_path}/libjpeg.a
)

add_library(png STATIC IMPORTED GLOBAL)
set_target_properties(png PROPERTIES
  IMPORTED_LOCATION ${platform_spec_path}/libpng.a
)

add_library(ssl STATIC IMPORTED GLOBAL)
set_target_properties(ssl PROPERTIES
  IMPORTED_LOCATION ${platform_spec_path}/libssl.a
)

add_library(tiff STATIC IMPORTED GLOBAL)
set_target_properties(tiff PROPERTIES
  IMPORTED_LOCATION ${platform_spec_path}/libtiff.a
)

add_library(uv STATIC IMPORTED GLOBAL)
set_target_properties(uv PROPERTIES
  IMPORTED_LOCATION ${platform_spec_path}/libuv.a
  INTERFACE_INCLUDE_DIRECTORIES ${platform_spec_path}/include/uv
)

add_library(webp STATIC IMPORTED GLOBAL)
set_target_properties(webp PROPERTIES
  IMPORTED_LOCATION ${platform_spec_path}/libwebp.a
)

add_library(websockets STATIC IMPORTED GLOBAL)
set_target_properties(websockets PROPERTIES
  IMPORTED_LOCATION ${platform_spec_path}/libwebsockets.a
)

add_library(z STATIC IMPORTED GLOBAL)
set_target_properties(z PROPERTIES
  IMPORTED_LOCATION ${platform_spec_path}/libz.a
  INTERFACE_INCLUDE_DIRECTORIES ${platform_spec_path}/include/zlib
)


set(se_libs_name)

if(USE_SE_V8)
    set(V8_LIBS
      # v8_inspector 
        v8_snapshot 
        v8_compiler
        v8_libsampler 
        v8_base_without_compiler
        v8_libplatform 
        v8_libbase 
    )

    add_library(v8_libbase STATIC IMPORTED GLOBAL)
    set_target_properties(v8_libbase PROPERTIES
      IMPORTED_LOCATION ${platform_spec_path}/v8/libv8_libbase.a
    )


    add_library(v8_libplatform STATIC IMPORTED GLOBAL)
    set_target_properties(v8_libplatform PROPERTIES
      IMPORTED_LOCATION ${platform_spec_path}/v8/libv8_libplatform.a
    )

    add_library(v8_libsampler STATIC IMPORTED GLOBAL)
    set_target_properties(v8_libsampler PROPERTIES
      IMPORTED_LOCATION ${platform_spec_path}/v8/libv8_libsampler.a
    )

    add_library(v8_snapshot STATIC IMPORTED GLOBAL)
    set_target_properties(v8_snapshot PROPERTIES
      IMPORTED_LOCATION ${platform_spec_path}/v8/libv8_snapshot.a
    )

    add_library(v8_inspector STATIC IMPORTED GLOBAL)
    set_target_properties(v8_inspector PROPERTIES
      IMPORTED_LOCATION ${platform_spec_path}/v8/libinspector.a
    )

    add_library(v8_compiler STATIC IMPORTED GLOBAL)
    set_target_properties(v8_compiler PROPERTIES
      IMPORTED_LOCATION ${platform_spec_path}/v8/libv8_compiler.a
    )

    add_library(v8_base_without_compiler STATIC IMPORTED GLOBAL)
    set_target_properties(v8_base_without_compiler PROPERTIES
      IMPORTED_LOCATION ${platform_spec_path}/v8/libv8_base_without_compiler.a
    )


    set(V8_ARCHIVE_DIR ${CMAKE_CURRENT_BINARY_DIR}/v8_tmp)

    if(NOT EXISTS ${V8_ARCHIVE_DIR}) 
        file(MAKE_DIRECTORY ${V8_ARCHIVE_DIR})
    endif()

    if(NOT EXISTS ${V8_ARCHIVE_DIR}/v8_static.a)

        execute_process(
            COMMAND ${CMAKE_COMMAND} -E make_directory ${V8_ARCHIVE_DIR}
            COMMAND ${CMAKE_AR} -x ${platform_spec_path}/v8/libv8_libbase.a
            COMMAND ${CMAKE_AR} -x ${platform_spec_path}/v8/libv8_libplatform.a
            COMMAND ${CMAKE_AR} -x ${platform_spec_path}/v8/libv8_libsampler.a
            COMMAND ${CMAKE_AR} -x ${platform_spec_path}/v8/libv8_snapshot.a
            COMMAND ${CMAKE_AR} -x ${platform_spec_path}/v8/libv8_compiler.a
            COMMAND ${CMAKE_AR} -x ${platform_spec_path}/v8/libv8_base_without_compiler.a
            WORKING_DIRECTORY ${V8_ARCHIVE_DIR}
        )

        file(GLOB v8_obj_files ${V8_ARCHIVE_DIR}/*.o)
        set(v8_obj_files_args "")
        set(V8_FILELIST ${V8_ARCHIVE_DIR}/v8_link_input_list.txt)
        foreach(obj_file ${v8_obj_files})
            string(APPEND v8_obj_files_args " \"${obj_file}\"")
        endforeach()
        file(WRITE ${V8_FILELIST} ${v8_obj_files_args})
        execute_process(
            COMMAND ${CMAKE_AR} -qcs ${V8_ARCHIVE_DIR}/v8_static.a @${V8_FILELIST}
            WORKING_DIRECTORY ${V8_ARCHIVE_DIR}
        )
    endif()


    add_library(v8_static STATIC IMPORTED GLOBAL)
    set_target_properties(v8_static PROPERTIES
      IMPORTED_LOCATION ${V8_ARCHIVE_DIR}/v8_static.a
      INTERFACE_INCLUDE_DIRECTORIES ${platform_spec_path}/include/v8
    )

    set(se_libs_name v8_static)

endif()

if(USE_SOCKET)
    list(APPEND CC_EXTERNAL_LIBS
        websockets
        ssl
        crypto
    )
endif()

if(USE_TIFF)
    list(APPEND CC_EXTERNAL_LIBS
        tiff
    )
endif()

if(USE_SE_V8 AND USE_V8_DEBUGGER)
    list(APPEND CC_EXTERNAL_LIBS
        v8_inspector
    )
endif()

list(APPEND CC_EXTERNAL_LIBS
    freetype
    jpeg
    png
    uv
    webp
    OpenSLES
    ${se_libs_name}
    z
)


list(APPEND CC_EXTERNAL_INCLUDES
  ${platform_spec_path}/include
)