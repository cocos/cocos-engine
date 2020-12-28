set(TARGET_NAME GFXMetal)

message(STATUS "Target: ${TARGET_NAME}...")

# ---------------------------------------------------------------------
# set include files

set(INCLUDE_FILES
    ${GFX_EXTERNAL_PATH}/khronos
    ${GFX_EXTERNAL_PATH}/boost
    ${GFX_EXTERNAL_PATH}/concurrentqueue
    ${COCOS_SRC_PATH}/base
    ${COCOS_SRC_PATH}/renderer/core
    ${COCOS_SRC_PATH}/renderer/gfx-metal
)

include_directories( ${INCLUDE_FILES} )

# ---------------------------------------------------------------------

file(GLOB_RECURSE HEADER_FILES *.h)
file(GLOB_RECURSE SOURCE_CPP_FILES *.cpp *.cc)
file(GLOB_RECURSE SOURCE_C_FILES *.c)
file(GLOB_RECURSE SOURCE_OBJC_FILES *.m *.mm)
set(ALL_FILES ${HEADER_FILES} ${SOURCE_CPP_FILES} ${SOURCE_C_FILES} ${SOURCE_OBJC_FILES})

if(COCOS_UNICODE)
	add_definitions("-DUNICODE -D_UNICODE")
endif()

if (COCOS_STATIC)
	add_library(${TARGET_NAME} STATIC ${HEADER_FILES} ${ALL_FILES})
else()
	add_library(${TARGET_NAME} SHARED ${HEADER_FILES} ${ALL_FILES})
endif()

target_compile_definitions(${TARGET_NAME} PRIVATE CC_USE_METAL)
find_library(COREFOUNDATION_FRAMEWORK CoreFoundation)
find_library(FOUNDATION_FRAMEWORK Foundation)
find_library(METAL_LIBRARY Metal)
find_library(METALKIT_LIBRARY MetalKit)
set(glslang_libs_name glslang OGLCompiler OSDependent SPIRV glslang-default-resource-limits)
set(spirv-cross_libs_name spirv-cross-core spirv-cross-glsl spirv-cross-msl)
target_link_libraries(${TARGET_NAME} Core ${COREFOUNDATION_FRAMEWORK} ${FOUNDATION_FRAMEWORK} ${METAL_LIBRARY} ${METALKIT_LIBRARY} ${glslang_libs_name} ${spirv-cross_libs_name})

target_include_directories(${TARGET_NAME} PUBLIC ${COCOS_EXTERNAL_PATH}/mac/include)

set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME CCGFXMetal)
set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME_DEBUG CCGFXMetal_d)

use_precompiled_header("${CMAKE_CURRENT_SOURCE_DIR}/MTLStd.h" "${CMAKE_CURRENT_SOURCE_DIR}/MTLStd.cpp" ${SOURCE_CPP_FILES} ${SOURCE_OBJC_FILES} ${SOURCE_C_FILES})

message(STATUS "${TARGET_NAME} configuration completed.")

target_compile_definitions(${TARGET_NAME} PUBLIC
    $<$<CONFIG:Debug>:CC_DEBUG=1>
)
