cmake_minimum_required(VERSION 3.10)

if (NOT CMAKE_BUILD_TYPE OR CMAKE_BUILD_TYPE STREQUAL "")
    set(CMAKE_BUILD_TYPE "Release" CACHE STRING "" FORCE)
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)


set(PROJECT_NAME "pipeline" CACHE STRING "Project Name")
project(${PROJECT_NAME})

set(ENGINE_ROOT_DIR ${CMAKE_CURRENT_LIST_DIR}/../..)

if(NOT EXTERNAL_LIBS_PROCESSED)
set(EXTERNAL_LIBS_PROCESSED 1)
add_definitions(-DBOOST_HAS_PTHREADS)
include_directories(${ENGINE_ROOT_DIR}/external/sources)
include(${ENGINE_ROOT_DIR}/cmake/predefine.cmake)
include(${ENGINE_ROOT_DIR}/external/CMakeLists.txt)
endif()

add_definitions(-DBOOST_NO_CXX98_FUNCTION_BASE)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wno-nonportable-include-path -fwasm-exceptions")
set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -g3 -D_DEBUG=1 -Wno-unused -O0")
set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -DNDEBUG=1 -O3")

AUX_SOURCE_DIRECTORY(
    ${ENGINE_ROOT_DIR}/cocos/base/threading
    COCOS_BASE_THREAD
)
list(FILTER COCOS_BASE_THREAD EXCLUDE REGEX "[\\w+]*.mm")

AUX_SOURCE_DIRECTORY(
    ${ENGINE_ROOT_DIR}/cocos/base
    COCOS_BASE
)
list(FILTER COCOS_BASE EXCLUDE REGEX "ZipUtils.*")


file(GLOB_RECURSE COCOS_BASE_STD
    "../../../../cocos/base/std/*.cpp"
    "../../../../cocos/base/std/*.c"
    "../../../../cocos/base/std/*.cxx"
    "../../../../cocos/base/std/*.h")

AUX_SOURCE_DIRECTORY(
    ${ENGINE_ROOT_DIR}/cocos/scene
    COCOS_SCENE
)

AUX_SOURCE_DIRECTORY(
    ${ENGINE_ROOT_DIR}/cocos/math
    COCOS_MATH
)

AUX_SOURCE_DIRECTORY(
    ${ENGINE_ROOT_DIR}/cocos/core
    COCOS_CORE
)
list(FILTER COCOS_CORE EXCLUDE REGEX "Root")

AUX_SOURCE_DIRECTORY(
    ${ENGINE_ROOT_DIR}/cocos/core/assets
    COCOS_CORE_ASSETS
)
list(FILTER COCOS_CORE_ASSETS EXCLUDE REGEX "FreeTypeFont")
list(FILTER COCOS_CORE_ASSETS EXCLUDE REGEX "EffectAsset")

# AUX_SOURCE_DIRECTORY(
#     ${ENGINE_ROOT_DIR}/cocos/core/geometry
#     COCOS_CORE_GEOMETRY
# )

set(COCOS_CORE_GEOMETRY
    ${ENGINE_ROOT_DIR}/cocos/core/geometry/AABB.h
    ${ENGINE_ROOT_DIR}/cocos/core/geometry/AABB.cpp
    ${ENGINE_ROOT_DIR}/cocos/core/geometry/Sphere.h
    ${ENGINE_ROOT_DIR}/cocos/core/geometry/Sphere.cpp
    ${ENGINE_ROOT_DIR}/cocos/core/geometry/Frustum.h
    ${ENGINE_ROOT_DIR}/cocos/core/geometry/Frustum.cpp
    ${ENGINE_ROOT_DIR}/cocos/core/geometry/Plane.h
    ${ENGINE_ROOT_DIR}/cocos/core/geometry/Plane.cpp
)

AUX_SOURCE_DIRECTORY(
    ${ENGINE_ROOT_DIR}/cocos/core/data
    COCOS_CORE_DATA
)
list(FILTER COCOS_CORE_DATA EXCLUDE REGEX "JSBNativeDataHolder")

AUX_SOURCE_DIRECTORY(
    ${ENGINE_ROOT_DIR}/cocos/core/utils
    COCOS_CORE_UTILS
)

AUX_SOURCE_DIRECTORY(
    ${ENGINE_ROOT_DIR}/cocos/utils
    COCOS_UTILS
)

set(PIPELINE
./pipeline/Define.cpp
./pipeline/Define.h
./pipeline/PipelineSceneData.h
./pipeline/PipelineSceneData.cpp
./pipeline/PipelineStateManager.h
./pipeline/PipelineStateManager.cpp
./pipeline/GlobalDescriptorSetManager.h
./pipeline/GlobalDescriptorSetManager.cpp
./pipeline/InstancedBuffer.h
./pipeline/InstancedBuffer.cpp
)

set(SHADOW
./pipeline/shadow/CSMLayers.h
./pipeline/shadow/CSMLayers.cpp
)

file(GLOB PIPELINE_CUSTOM ./pipeline/custom/*.cpp ./pipeline/custom/*.h)
list(FILTER PIPELINE_CUSTOM EXCLUDE REGEX "RenderCommonJsb")


file(GLOB PIPELINE_CORE ./core/*.h ./core/*.cpp)


set(NATIVE_SRC
    ${COCOS_BASE}
    ${COCOS_BASE_STD}
    ${COCOS_CORE}
    # ${COCOS_CORE_ASSETS}
    ${COCOS_CORE_DATA}
    ${COCOS_CORE_UTILS}
    ${COCOS_CORE_GEOMETRY}
    ${COCOS_UTILS}
    ${COCOS_MATH}
    ${COCOS_BASE_THREAD}
    ${RENDERER}
    ${PIPELINE_CORE}
    ${PIPELINE_CUSTOM}
    ${PIPELINE}
    ${COCOS_SCENE}
    ${SHADOW}
)

add_subdirectory(gfx-wgpu)

add_executable(${PROJECT_NAME} ${NATIVE_SRC})

add_dependencies(${PROJECT_NAME} webgpu boost_container)

target_link_libraries(${PROJECT_NAME}
    PUBLIC -Wl,--whole-archive webgpu -Wl,--no-whole-archive
    PUBLIC boost_container
)

target_include_directories(
	${PROJECT_NAME} PRIVATE "${CMAKE_CURRENT_LIST_DIR}/include"
	${CC_EXTERNAL_INCLUDES}
    ${CMAKE_CURRENT_LIST_DIR}
	${ENGINE_ROOT_DIR}
	${ENGINE_ROOT_DIR}/cocos
    ${ENGINE_ROOT_DIR}/cocos/base
	${ENGINE_ROOT_DIR}/cocos/renderer
	${ENGINE_ROOT_DIR}/cocos/platform
	${ENGINE_ROOT_DIR}/cocos/renderer/core
    ${ENGINE_ROOT_DIR}/external/sources
	${CC_EXTERNAL_PRIVATE_INCLUDES}
)


set(EMS_LINK_FLAGS
"-flto --bind --no-entry -O3 -s USE_ES6_IMPORT_META=0 -s EXPORT_ES6=1  -s MODULARIZE=1 -s EXPORT_NAME='pipelineWasm' -s ENVIRONMENT=web -s USE_WEBGPU=1 -s WASM=1 -s NO_EXIT_RUNTIME=1 -s LLD_REPORT_UNDEFINED -s ALLOW_MEMORY_GROWTH=1 -fwasm-exceptions"
)

if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    string(APPEND EMS_LINK_FLAGS " -g -s ASSERTIONS=2")
endif()

set_target_properties(${PROJECT_NAME} PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${ENGINE_ROOT_DIR}/external/emscripten/pipeline)

set_target_properties(${PROJECT_NAME} PROPERTIES CXX_STANDARD 17 LINK_FLAGS ${EMS_LINK_FLAGS})
