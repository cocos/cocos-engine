set(TARGET_NAME GFXVulkan)

message(STATUS "Target: ${TARGET_NAME}...")
# ---------------------------------------------------------------------
# set include files

set(INCLUDE_FILES
  ${GFX_EXTERNAL_PATH}/khronos
  ${COCOS_EXTERNAL_PATH}/win32/include/glslang
  ${COCOS_SRC_PATH}/renderer/core
  ${COCOS_SRC_PATH}/renderer/gfx-vulkan
)

add_definitions("-DVK_NO_PROTOTYPES")

if(WIN32)
	add_definitions("-DVK_USE_PLATFORM_WIN32_KHR")
	add_definitions("-DNOMINMAX")
elseif(COCOS_PLATFORM_IOS)
	add_definitions("-DVK_USE_PLATFORM_IOS_MVK")
elseif(COCOS_PLATFORM_OSX)
	add_definitions("-DVK_USE_PLATFORM_MACOS_MVK")
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

set(ALL_FILES ${HEADER_FILES} ${SOURCE_CPP_FILES} ${SOURCE_C_FILES})

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
else()
	add_library(${TARGET_NAME} SHARED ${HEADER_FILES} ${ALL_FILES})
endif()

target_link_libraries(${TARGET_NAME} Core glslang SPIRV)

set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME CCGFXVulkan)
set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME_DEBUG CCGFXVulkan_d)

use_precompiled_header("${CMAKE_CURRENT_SOURCE_DIR}/VKStd.h" "${CMAKE_CURRENT_SOURCE_DIR}/VKStd.cpp" SOURCE_CPP_FILES)

message(STATUS "${TARGET_NAME} configuration completed.")

target_compile_definitions(${TARGET_NAME} PUBLIC
    $<$<CONFIG:Debug>:COCOS2D_DEBUG=1>
)
