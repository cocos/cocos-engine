set(TARGET_NAME GFXGL)

message(STATUS "Target: ${TARGET_NAME}...")

# ---------------------------------------------------------------------
# set include files

set(INCLUDE_FILES 
  ${COCOS_EXTERNAL_PATH}/glsl_optimizer/src
  ${COCOS_EXTERNAL_PATH}/glsl_optimizer/src/mesa
  ${COCOS_SRC_PATH}/Core
  ${COCOS_SRC_PATH}/${TARGET_NAME}
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

set(GLEW_FILES
	${COCOS_SRC_PATH}/${TARGET_NAME}/gl/glew.h
	${COCOS_SRC_PATH}/${TARGET_NAME}/gl/wglew.h)
	
source_group("gl" FILES ${GLEW_FILES})

add_definitions("-DCOCOS_GL_EXPORTS -DGLEW_BUILD")
if(COCOS_UNICODE)
	add_definitions("-DUNICODE -D_UNICODE")
endif()

if (COCOS_STATIC)
	add_library(${TARGET_NAME} STATIC ${HEADER_FILES} ${SOURCE_CPP_FILES} ${SOURCE_C_FILES})
else()
	add_library(${TARGET_NAME} SHARED ${HEADER_FILES} ${SOURCE_CPP_FILES} ${SOURCE_C_FILES})
endif()

set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME CCGFXGL)
set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME_DEBUG CCGFXGL_d)

use_precompiled_header("${CMAKE_CURRENT_SOURCE_DIR}/GLStd.h" "${CMAKE_CURRENT_SOURCE_DIR}/GLStd.cpp" SOURCE_CPP_FILES)

message(STATUS "${TARGET_NAME} configuration completed.") 
