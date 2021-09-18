enable_language(C ASM)


set(DEVELOPMENT_TEAM    ""  CACHE STRING "APPLE Developtment Team")
set(RES_DIR             ""  CACHE STRING "Resource path")
set(COCOS_X_PATH        ""  CACHE STRING "Path to cocos2d-x-lite/")

set(TARGET_OSX_VERSION "10.14" CACHE STRING "Target MacOSX version" FORCE)
set(TARGET_IOS_VERSION "10.0"  CACHE STRING "Target iOS version" FORCE)

set(CMAKE_CXX_STANDARD 14)
option(USE_SE_V8                "Use V8 JavaScript Engine"          ON)
option(USE_V8_DEBUGGER          "Enable Chrome Remote inspector"    ON)
option(USE_SOCKET               "Enable WebSocket & SocketIO"       ON)
option(USE_AUDIO                "Enable Audio"                      ON)     #Enable AudioEngine
option(USE_EDIT_BOX             "Enable EditBox"                    ON)
option(USE_SE_JSC               "Use JavaScriptCore on MacOSX/iOS"  OFF)
option(USE_VIDEO                "Enable VideoPlayer Component"      ON)
option(USE_WEBVIEW              "Enable WebView Component"          ON)
option(USE_MIDDLEWARE           "Enable Middleware"                 ON)
option(USE_DRAGONBONES          "Enable Dragonbones"                ON)
option(USE_SPINE                "Enable Spine"                      ON)
option(USE_WEBSOCKET_SERVER     "Enable WebSocket Server"            OFF)
option(USE_JOB_SYSTEM_TASKFLOW  "Use taskflow as job system backend" OFF)
option(USE_JOB_SYSTEM_TBB       "Use tbb as job system backend"      OFF)
option(USE_PHYSICS_PHYSX        "USE PhysX Physics"                  ON)

if(NOT RES_DIR)
    message(FATAL_ERROR "RES_DIR is not set!")
endif()

include(${RES_DIR}/proj/cfg.cmake)

if(NOT COCOS_X_PATH)
    message(FATAL_ERROR "COCOS_X_PATH is not set!")
endif()

include(${COCOS_X_PATH}/CMakeLists.txt)

set(ASSET_FILES)
macro(include_resources ARG_RES_ROOT)
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
            list(APPEND ASSET_FILES ${res_abs})
        endforeach()
    endforeach()
endmacro()
