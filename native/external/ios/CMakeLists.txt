
add_library(crypto STATIC IMPORTED GLOBAL)
set_target_properties(crypto PROPERTIES
  IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/libs/libcrypto.a
)

add_library(freetype STATIC IMPORTED GLOBAL)
set_target_properties(freetype PROPERTIES
  IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/libs/libfreetype.a
)

add_library(jpeg STATIC IMPORTED GLOBAL)
set_target_properties(jpeg PROPERTIES
  IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/libs/libjpeg.a
)

add_library(png STATIC IMPORTED GLOBAL)
set_target_properties(png PROPERTIES
  IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/libs/libpng.a
)

add_library(ssl STATIC IMPORTED GLOBAL)
set_target_properties(ssl PROPERTIES
  IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/libs/libssl.a
)

add_library(tiff STATIC IMPORTED GLOBAL)
set_target_properties(tiff PROPERTIES
  IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/libs/libtiff.a
)

add_library(uv STATIC IMPORTED GLOBAL)
set_target_properties(uv PROPERTIES
  IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/libs/libuv_a.a
  INTERFACE_INCLUDE_DIRECTORIES ${CMAKE_CURRENT_LIST_DIR}/include/uv
)

add_library(webp STATIC IMPORTED GLOBAL)
set_target_properties(webp PROPERTIES
  IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/libs/libwebp.a
)

add_library(v8_monolith STATIC IMPORTED GLOBAL)
set_target_properties(v8_monolith PROPERTIES
    IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/libs/libv8_monolith.a
    INTERFACE_INCLUDE_DIRECTORIES ${CMAKE_CURRENT_LIST_DIR}/include/v8
)

# add_library(inspector STATIC IMPORTED GLOBAL)
# set_target_properties(inspector PROPERTIES
#     IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/libs/libinspector.a
# )

add_library(js_static STATIC IMPORTED GLOBAL)
set_target_properties(js_static PROPERTIES
    IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/libs/libjs_static.a
    INTERFACE_INCLUDE_DIRECTORIES ${CMAKE_CURRENT_LIST_DIR}/include/spidermonkey
)

add_library(mozglue STATIC IMPORTED GLOBAL)
set_target_properties(mozglue PROPERTIES
    IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/libs/libmozglue.a
)

set(se_libs_name)

if(USE_SE_V8)
    list(APPEND se_libs_name 
        v8_monolith
        uv
        )
#    if(USE_V8_DEBUGGER)
#        list(APPEND se_libs_name)
#    endif()
endif()

if(USE_SE_SM)
    list(APPEND se_libs_name 
        js_static
        mozglue
    )

endif()

if(USE_SE_JSC)
    find_library(JAVASCRIPT_CORE_LIBRARY JavaScriptCore REQUIRED)
    set(se_libs_name ${JAVASCRIPT_CORE_LIBRARY})
endif()


if(USE_TIFF)
    list(APPEND CC_EXTERNAL_LIBS 
        tiff
    )
endif()

list(APPEND CC_EXTERNAL_INCLUDES 
    ${CMAKE_CURRENT_LIST_DIR}/include
)

list(APPEND CC_EXTERNAL_LIBS
    freetype
    jpeg
    png
    webp
    ${se_libs_name}
    crypto
    ssl
)
