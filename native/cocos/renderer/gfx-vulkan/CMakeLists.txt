set(TARGET_NAME GFXVulkan)

message(STATUS "Target: ${TARGET_NAME}...")
# ---------------------------------------------------------------------
# set include files

set(INCLUDE_FILES
  ${GFX_EXTERNAL_PATH}/khronos
  ${GFX_EXTERNAL_PATH}/boost
  ${GFX_EXTERNAL_PATH}/tbb/include
  ${GFX_EXTERNAL_PATH}/concurrentqueue
  ${COCOS_EXTERNAL_PATH}/win32/include/glslang
  ${COCOS_SRC_PATH}/renderer/core
  ${COCOS_SRC_PATH}/renderer/gfx-vulkan
)

add_definitions("-DVK_NO_PROTOTYPES")

if(WIN32)
	add_definitions("-DVK_USE_PLATFORM_WIN32_KHR")
	add_definitions("-DNOMINMAX")
elseif(COCOS_PLATFORM_IOS OR COCOS_PLATFORM_OSX)
	add_definitions("-DVK_USE_PLATFORM_METAL_EXT")
elseif(COCOS_PLATFORM_ANDROID)
	add_definitions("-DVK_USE_PLATFORM_ANDROID_KHR")
else()
	add_definitions("-DVK_USE_PLATFORM_XLIB_KHR")
endif()

include_directories( ${INCLUDE_FILES} )

# ---------------------------------------------------------------------

file(GLOB_RECURSE HEADER_FILES *.h)
file(GLOB_RECURSE SOURCE_CPP_FILES *.cpp *.cc)
file(GLOB_RECURSE SOURCE_C_FILES *.c)

if(COCOS_PLATFORM_IOS OR COCOS_PLATFORM_OSX)
	file(GLOB_RECURSE SOURCE_MM_FILES *.m *.mm)
endif()

set(ALL_FILES
	${HEADER_FILES}
	${SOURCE_CPP_FILES}
	${SOURCE_C_FILES}
	${CC_BASE_HEADERS}
	${CC_BASE_SOURCES}
    ${COCOS_SRC_PATH}/base/StringUtil.h
    ${COCOS_SRC_PATH}/base/StringUtil.cpp
	)

if(COCOS_PLATFORM_IOS OR COCOS_PLATFORM_OSX)
	set(ALL_FILES ${ALL_FILES} ${SOURCE_MM_FILES})
endif()

add_definitions("-DCC_VK_EXPORTS")
if(WIN32)
	add_definitions("-DGLEW_BUILD")
endif()
if(COCOS_UNICODE)
	add_definitions("-DUNICODE -D_UNICODE")
endif()

if (COCOS_STATIC)
	add_library(${TARGET_NAME} STATIC ${HEADER_FILES} ${ALL_FILES})
	set(TBB_LIBRARIES tbb_static tbbmalloc_static tbbmalloc_proxy_static)
else()
	add_library(${TARGET_NAME} SHARED ${HEADER_FILES} ${ALL_FILES})
	set(TBB_LIBRARIES tbb tbbmalloc tbbmalloc_proxy)
endif()

target_link_libraries(${TARGET_NAME} Core glslang OGLCompiler OSDependent SPIRV glslang-default-resource-limits ${TBB_LIBRARIES})

set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME CCGFXVulkan)
set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME_DEBUG CCGFXVulkan_d)

use_precompiled_header("${CMAKE_CURRENT_SOURCE_DIR}/VKStd.h" "${CMAKE_CURRENT_SOURCE_DIR}/VKStd.cpp" SOURCE_CPP_FILES)

message(STATUS "${TARGET_NAME} configuration completed.")

target_compile_definitions(${TARGET_NAME} PUBLIC
    $<$<CONFIG:Debug>:CC_DEBUG=1>
)
