set(TARGET_NAME GFXGLES3)

message(STATUS "Target: ${TARGET_NAME}...")
# ---------------------------------------------------------------------
# set include files

set(INCLUDE_FILES
  ${GFX_EXTERNAL_PATH}/khronos
  ${GFX_EXTERNAL_PATH}/glsl_optimizer/src
  ${GFX_EXTERNAL_PATH}/glsl_optimizer/src/mesa
  ${GFX_EXTERNAL_PATH}/taskflow
  ${GFX_EXTERNAL_PATH}/boost
  ${GFX_EXTERNAL_PATH}/concurrentqueue
  ${COCOS_SRC_PATH}/renderer/core
  ${COCOS_SRC_PATH}/renderer/gfx-gles3
)

include_directories( ${INCLUDE_FILES} )

# ---------------------------------------------------------------------

file(GLOB_RECURSE HEADER_FILES *.h ../gfx-gles-common/*.h)
file(GLOB_RECURSE SOURCE_CPP_FILES *.cpp *.cc ../gfx-gles-common/*.cpp)
file(GLOB_RECURSE SOURCE_C_FILES *.c)

if(COCOS_PLATFORM_IOS OR COCOS_PLATFORM_OSX)
	file(GLOB_RECURSE SOURCE_MM_FILES *.m *.mm)
endif()

set(ALL_FILES
  ${HEADER_FILES}
  ${SOURCE_CPP_FILES}
  ${SOURCE_C_FILES}
  ${COCOS_SRC_PATH}/base/StringUtil.h
  ${COCOS_SRC_PATH}/base/StringUtil.cpp
  )

if(COCOS_PLATFORM_IOS OR COCOS_PLATFORM_OSX)
	set(ALL_FILES ${ALL_FILES} ${SOURCE_MM_FILES})
endif()

if(COCOS_PLATFORM_IOS OR COCOS_PLATFORM_OSX)
	list(REMOVE_ITEM ALL_FILES "${COCOS_SRC_PATH}/renderer/gfx-gles3/GLES3Wrangler.cpp")
else()
	list(REMOVE_ITEM ALL_FILES "${COCOS_SRC_PATH}/renderer/gfx-gles3/GLES3Wrangler.mm")
endif()

if(COCOS_PLATFORM_OSX)
  list(REMOVE_ITEM ALL_FILES "${COCOS_SRC_PATH}/renderer/gfx-gles3/GLES3Context.mm")
endif()

add_definitions("-DCC_GLES3_EXPORTS")
if(WIN32)
	add_definitions("-DGLEW_BUILD")
endif()
if(COCOS_UNICODE)
	add_definitions("-DUNICODE -D_UNICODE")
endif()

if (COCOS_STATIC)
	add_library(${TARGET_NAME} STATIC ${HEADER_FILES} ${ALL_FILES})
else()
	add_library(${TARGET_NAME} SHARED ${HEADER_FILES} ${ALL_FILES})
endif()

target_link_libraries(${TARGET_NAME} Core GFXGLESCommon)

set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME CCGFXGLES3)
set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME_DEBUG CCGFXGLES3_d)

use_precompiled_header("${CMAKE_CURRENT_SOURCE_DIR}/GLES3Std.h" "${CMAKE_CURRENT_SOURCE_DIR}/GLES3Std.cpp" SOURCE_CPP_FILES)

message(STATUS "${TARGET_NAME} configuration completed.")

target_compile_definitions(${TARGET_NAME} PUBLIC
    $<$<CONFIG:Debug>:CC_DEBUG=1>
)
