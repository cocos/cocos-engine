enable_language(C ASM)
set(DEVELOPMENT_TEAM    ""  CACHE STRING "APPLE Developtment Team")
set(RES_DIR             ""  CACHE STRING "Resource path")
set(COCOS_X_PATH        ""  CACHE STRING "Path to engine/native/")

set(TARGET_OSX_VERSION "10.14" CACHE STRING "Target MacOSX version" FORCE)
set(TARGET_IOS_VERSION "11.0"  CACHE STRING "Target iOS version" FORCE)

set(CMAKE_CXX_STANDARD 17)
option(USE_SE_V8                "Use V8 JavaScript Engine"              ON)
option(USE_V8_DEBUGGER          "Compile v8 inspector ws server"        ON)
option(USE_SE_DEBUGGER_FORCE    "Force enable debugger in release mode" OFF)
option(USE_SOCKET               "Enable WebSocket & SocketIO"           ON)
option(USE_AUDIO                "Enable Audio"                          ON)     #Enable AudioEngine
option(USE_EDIT_BOX             "Enable EditBox"                        ON)
option(USE_SE_JSC               "Use JavaScriptCore on MacOSX/iOS"      OFF)
option(USE_VIDEO                "Enable VideoPlayer Component"          ON)
option(USE_WEBVIEW              "Enable WebView Component"              ON)
option(USE_MIDDLEWARE           "Enable Middleware"                     ON)
option(USE_DRAGONBONES          "Enable Dragonbones"                    ON)
option(USE_SPINE                "Enable Spine"                          ON)
option(USE_WEBSOCKET_SERVER     "Enable WebSocket Server"               OFF)
option(USE_JOB_SYSTEM_TASKFLOW  "Use taskflow as job system backend"    OFF)
option(USE_JOB_SYSTEM_TBB       "Use tbb as job system backend"         OFF)
option(USE_PHYSICS_PHYSX        "USE PhysX Physics"                     ON)

if(NOT RES_DIR)
    message(FATAL_ERROR "RES_DIR is not set!")
endif()

include(${RES_DIR}/proj/cfg.cmake)

if(NOT COCOS_X_PATH)
    message(FATAL_ERROR "COCOS_X_PATH is not set!")
endif()

include(${COCOS_X_PATH}/CMakeLists.txt)

list(APPEND CC_COMMON_SOURCES
    ${CMAKE_CURRENT_LIST_DIR}/Classes/Game.h
    ${CMAKE_CURRENT_LIST_DIR}/Classes/Game.cpp
)

## add demo classes & glue code
list(APPEND CC_COMMON_SOURCES
    ${CMAKE_CURRENT_LIST_DIR}/Classes/demo/Fruit.h
    ${CMAKE_CURRENT_LIST_DIR}/Classes/demo/Fruit.cpp
    ${CMAKE_CURRENT_LIST_DIR}/Classes/demo/Coconut.h
    ${CMAKE_CURRENT_LIST_DIR}/Classes/demo/Coconut.cpp
    ${CMAKE_CURRENT_LIST_DIR}/Classes/demo/sebind_fruits.h
    ${CMAKE_CURRENT_LIST_DIR}/Classes/demo/sebind_fruits.cpp
)