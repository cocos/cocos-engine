cmake_minimum_required(VERSION 2.8)

set(APP_NAME "webgpu" CACHE STRING "Project Name")
project(${APP_NAME}_wasm)

message(${CMAKE_BUILD_TYPE})
if (NOT CMAKE_BUILD_TYPE OR CMAKE_BUILD_TYPE STREQUAL "")
    set(CMAKE_BUILD_TYPE "Release" CACHE STRING "" FORCE)
endif()

set(ENGINE_ROOT_DIR ${CMAKE_CURRENT_LIST_DIR}/../../..)

include(${ENGINE_ROOT_DIR}/cmake/predefine.cmake)

include (${ENGINE_ROOT_DIR}/external/CMakeLists.txt)

add_definitions(-DBOOST_NO_CXX98_FUNCTION_BASE)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++17 -Wno-nonportable-include-path -fno-exceptions")
set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -g3 -D_DEBUG=1 -Wno-unused -O0 -std=c++17")
set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -DNDEBUG=1 -O3 -std=c++17")

message(${CMAKE_BUILD_TYPE})

AUX_SOURCE_DIRECTORY(
    ./states
    WGPU_STATES_SRC
)

AUX_SOURCE_DIRECTORY(
    .
    WGPU_IMPL_SRC
)

set(WGPU_SRC
    ${WGPU_STATES_SRC}
    ${WGPU_IMPL_SRC}
)

AUX_SOURCE_DIRECTORY(
    ../../../cocos/base/threading
    COCOS_BASE_THREAD
)
list(FILTER COCOS_BASE_THREAD EXCLUDE REGEX "[\\w+]*.mm")

AUX_SOURCE_DIRECTORY(
    ../../../cocos/base
    COCOS_BASE
)
list(FILTER COCOS_BASE EXCLUDE REGEX "ZipUtils.*")

AUX_SOURCE_DIRECTORY(
    ../../../cocos/renderer/gfx-base
    GFX_BASE
)
list(FILTER GFX_BASE EXCLUDE REGEX "[\\w+]*SPIRVUtils.cpp")

AUX_SOURCE_DIRECTORY(
    ../../../cocos/renderer/gfx-base/states
    GFX_BASE_STATES
)

AUX_SOURCE_DIRECTORY(
    ../../../cocos/renderer/gfx-agent
    GFX_AGENT
)

AUX_SOURCE_DIRECTORY(
    ../../../cocos/renderer/gfx-validator
    GFX_VALIDATOR
)

AUX_SOURCE_DIRECTORY(
    ../../../cocos/renderer/gfx-empty
    GFX_EMPTY
)

# AUX_SOURCE_DIRECTORY(
#     ../../../cocos/renderer/pipeline
#     PIPELINE
# )

set(RENDERER
    ../../../cocos/renderer/GFXDeviceManager.h
    ${GFX_BASE}
    ${GFX_AGENT}
    ${GFX_VALIDATOR}
    ${GFX_EMPTY}
    ${GFX_BASE_STATES}
    #${PIPELINE}
)

set(NATIVE_SRC
    ${COCOS_BASE}
    ${COCOS_BASE_THREAD}
    ${RENDERER}
    ${WGPU_SRC}
)

AUX_SOURCE_DIRECTORY(
    ./
    WASM_EXPORTS
)

add_executable(${APP_NAME}_wasm ${WASM_EXPORTS} ${NATIVE_SRC})

target_include_directories(
	${APP_NAME}_wasm PRIVATE "${CMAKE_CURRENT_LIST_DIR}/include"
	${CC_EXTERNAL_INCLUDES}
    ${CMAKE_CURRENT_LIST_DIR}
	${ENGINE_ROOT_DIR}
	${ENGINE_ROOT_DIR}/cocos
    ${ENGINE_ROOT_DIR}/cocos/base
	${ENGINE_ROOT_DIR}/cocos/renderer
	${ENGINE_ROOT_DIR}/cocos/platform
	${ENGINE_ROOT_DIR}/cocos/renderer/core
	${CC_EXTERNAL_PRIVATE_INCLUDES}
)

# message(${WGPU_EMS_EXTERNAL_LIBS})
target_link_libraries(
    ${APP_NAME}_wasm PRIVATE PUBLIC
    # ${WGPU_EMS_EXTERNAL_LIBS}
)

set(EMS_LINK_FLAGS
"-flto --bind --no-entry -O3 -s USE_ES6_IMPORT_META=0 -s EXPORT_ES6=1 -s MODULARIZE=1 -s EXPORT_NAME='wasmDevice' -s ENVIRONMENT=web -s WASM=1 -s USE_WEBGPU=1 -s NO_EXIT_RUNTIME=1 -s LLD_REPORT_UNDEFINED -s ALLOW_MEMORY_GROWTH=1"
)

if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    string(APPEND EMS_LINK_FLAGS " -g -s ASSERTIONS=2")
endif()

set_target_properties(${APP_NAME}_wasm PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${ENGINE_ROOT_DIR}/external/emscripten/webgpu)

set_target_properties(${APP_NAME}_wasm PROPERTIES CXX_STANDARD 17 LINK_FLAGS ${EMS_LINK_FLAGS})
