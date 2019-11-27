set(TARGET_NAME GFXMetal)

message(STATUS "Target: ${TARGET_NAME}...")
# ---------------------------------------------------------------------
# set include files

set(INCLUDE_FILES 
  ${GFX_EXTERNAL_PATH}/glsl_optimizer/src
  ${GFX_EXTERNAL_PATH}/glsl_optimizer/src/mesa
  ${COCOS_SRC_PATH}/renderer/core
  ${COCOS_SRC_PATH}/renderer/gfx-metal
)

include_directories( ${INCLUDE_FILES} )

if(COCOS_PLATFORM_WIN32)
link_libraries(
  glu32.lib
  opengl32.lib
)
endif()

# ---------------------------------------------------------------------

file(GLOB_RECURSE HEADER_FILES *.h)
file(GLOB_RECURSE SOURCE_CPP_FILES *.cpp *.cc)
file(GLOB_RECURSE SOURCE_C_FILES *.c)
file(GLOB_RECURSE SOURCE_OBJC_FILES *.m *.mm)

add_definitions("-DCC_MTL_EXPORTS")
if(COCOS_UNICODE)
	add_definitions("-DUNICODE -D_UNICODE")
endif()

if (COCOS_STATIC)
	add_library(${TARGET_NAME} STATIC ${HEADER_FILES} ${SOURCE_CPP_FILES} ${SOURCE_C_FILES} ${SOURCE_OBJC_FILES})
else()
	add_library(${TARGET_NAME} SHARED ${HEADER_FILES} ${SOURCE_CPP_FILES} ${SOURCE_C_FILES} ${SOURCE_OBJC_FILES})
endif()

set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME CCGFXMetal)
set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME_DEBUG CCGFXMetal_d)

use_precompiled_header("${CMAKE_CURRENT_SOURCE_DIR}/MetalStd.h" "${CMAKE_CURRENT_SOURCE_DIR}/MetalStd.cpp" SOURCE_CPP_FILES)

message(STATUS "${TARGET_NAME} configuration completed.") 
