set(TARGET_NAME Core)

message(STATUS "Target: ${TARGET_NAME}...")

# ---------------------------------------------
# set cocos base files

set(CC_BASE_HEADERS
    ${COCOS_SRC_PATH}/base/TypeDef.h
    ${COCOS_SRC_PATH}/base/Log.h
    ${COCOS_SRC_PATH}/base/Object.h
    ${COCOS_SRC_PATH}/base/memory/Memory.h
    ${COCOS_SRC_PATH}/math/Math.h
)

set(CC_BASE_SOURCES
    ${COCOS_SRC_PATH}/base/Log.cpp
    ${COCOS_SRC_PATH}/base/memory/Memory.cpp
    ${COCOS_SRC_PATH}/math/Math.cpp
)

# ---------------------------------------------------------------------
# set include files

set(INCLUDE_FILES
  ${GFX_EXTERNAL_PATH}/nedmalloc
  ${GFX_EXTERNAL_PATH}/tommyds
  ${GFX_EXTERNAL_PATH}/concurrentqueue
  ${GFX_EXTERNAL_PATH}/taskflow
  ${COCOS_SRC_PATH}/base
  ${COCOS_SRC_PATH}/renderer/core
)

if(COCOS_PLATFORM_WIN32)
  list(APPEND INCLUDE_FILES ${GFX_EXTERNAL_PATH}/jemalloc/include-win)
  list(APPEND INCLUDE_FILES ${GFX_EXTERNAL_PATH}/jemalloc/include-win/msvc_compat)
else()
  list(APPEND INCLUDE_FILES ${GFX_EXTERNAL_PATH}/jemalloc/include-linux)
endif()

include_directories( ${INCLUDE_FILES} )

if(COCOS_PLATFORM_WIN32)
link_libraries(
  glu32.lib
  opengl32.lib
)
endif()

# ---------------------------------------------------------------------

file(GLOB_RECURSE HEADER_FILES *.h *.hpp)
file(GLOB_RECURSE SOURCE_CPP_FILES *.cpp *.cc)
file(GLOB_RECURSE SOURCE_C_FILES *.c)
if(COCOS_PLATFORM_IOS)
	file(GLOB_RECURSE SOURCE_MM_FILES *.mm)
	file(GLOB_RECURSE SOURCE_M_FILES *.m)
endif()

macro(GROUP_FILES src_files out_del_files)
	set(del_files " ")
	set(cur_dir ${CMAKE_CURRENT_SOURCE_DIR})
	foreach(src_file ${${src_files}})
		string(REGEX REPLACE ${cur_dir}/\(.*\) \\1 sgbd_fpath ${src_file})
		string(REGEX REPLACE "\(.*\)/.*" \\1 sgbd_group_name ${sgbd_fpath})
		string(COMPARE EQUAL ${sgbd_fpath} ${sgbd_group_name} sgbd_nogroup)

		string(REPLACE "\\" "/" sgbd_group_name ${sgbd_group_name})

		if(sgbd_nogroup)
			set(sgbd_group_name "/")
		endif(sgbd_nogroup)

		set(SRC_OK TRUE)
		if(src_file MATCHES ".*Win32/.*")
			if(NOT COCOS_PLATFORM_WIN32)
				set(SRC_OK FALSE)
			endif()
		elseif(src_file MATCHES ".*Android/.*")
			if(NOT COCOS_PLATFORM_ANDROID)
				set(SRC_OK FALSE)
			endif()
		elseif(src_file MATCHES ".*iOS/.*")
			if(NOT COCOS_PLATFORM_IOS)
				set(SRC_OK FALSE)
			endif()
		endif()

		if(SRC_OK)
			#if(${COCOS_PLATFORM_WIN32})
				string(REPLACE "/" "\\" sgbd_group_name ${sgbd_group_name})
			#endif()
			source_group(${sgbd_group_name} FILES ${src_file})
		else()
			set(del_files ${del_files} ${src_file})
		endif()

	endforeach(src_file)

	set(${out_del_files} ${del_files})
endmacro(GROUP_FILES)

set(ALL_FILES
	${CC_BASE_HEADERS}
	${CC_BASE_SOURCES}
	${HEADER_FILES}
	${SOURCE_CPP_FILES}
	${SOURCE_C_FILES}
)
if(COCOS_PLATFORM_IOS)
	set(ALL_FILES ${ALL_FILES} ${SOURCE_MM_FILES})
	set(ALL_FILES ${ALL_FILES} ${SOURCE_M_FILES})
endif()

GROUP_FILES(ALL_FILES DEL_FILES)

foreach(del_file ${DEL_FILES})
	list(REMOVE_ITEM ALL_FILES ${del_file})
	list(REMOVE_ITEM SOURCE_CPP_FILES ${del_file})
	list(REMOVE_ITEM SOURCE_C_FILES ${del_file})
	list(REMOVE_ITEM HEADER_FILES ${del_file})
endforeach(del_file)

# ---------------------------------------------------------------------

add_definitions("-DCC_CORE_EXPORTS")
if(COCOS_UNICODE)
	add_definitions("-DUNICODE -D_UNICODE")
endif()

if (COCOS_STATIC)
	add_library(${TARGET_NAME} STATIC ${CC_BASE_HEADERS} ${CC_BASE_SOURCES} ${HEADER_FILES} ${SOURCE_CPP_FILES} ${SOURCE_C_FILES})
else()
	add_library(${TARGET_NAME} SHARED ${CC_BASE_HEADERS} ${CC_BASE_SOURCES} ${HEADER_FILES} ${SOURCE_CPP_FILES} ${SOURCE_C_FILES})
endif()

if (COCOS_PLATFORM_WIN32)
	target_link_libraries(${TARGET_NAME} ${COCOS_EXTERNAL_TARGETS} Winmm.lib)
else()
	target_link_libraries(${TARGET_NAME} ${COCOS_EXTERNAL_TARGETS})
endif()
target_link_libraries(${TARGET_NAME} TFJobSystem Threading)

if(MSVC)
    set_property(TARGET ${TARGET_NAME} PROPERTY LINK_FLAGS "/SUBSYSTEM:WINDOWS")
    target_compile_options(${TARGET_NAME} PUBLIC /MP)
	target_link_directories(${TARGET_NAME} PUBLIC ${COCOS_EXTERNAL_PATH}/win32/libs)
endif()

set(COCOS_EXTERNAL_INCLUDE_PATH)
if(COCOS_PLATFORM_WIN32)
	set(COCOS_EXTERNAL_INCLUDE_PATH  ${COCOS_EXTERNAL_INCLUDE_PATH} ${COCOS_EXTERNAL_PATH}/win32/include)
elseif(COCOS_PLATFORM_IOS)
	# set(COCOS_EXTERNAL_INCLUDE_PATH ${COCOS_EXTERNAL_PATH}/ios/include)
endif()


target_include_directories(${TARGET_NAME} PUBLIC
	${COCOS_SRC_PATH}/renderer
	${COCOS_SRC_PATH}
	${COCOS_SRC_PATH}/..
	${COCOS_SRC_PATH}/base
	${COCOS_EXTERNAL_INCLUDE_PATH}
)

set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME CCCore)
set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME_DEBUG CCCore_d)

use_precompiled_header("${CMAKE_CURRENT_SOURCE_DIR}/CoreStd.h" "${CMAKE_CURRENT_SOURCE_DIR}/CoreStd.cpp" SOURCE_CPP_FILES)

message(STATUS "${TARGET_NAME} configuration completed.")

target_compile_definitions(${TARGET_NAME} PUBLIC
    $<$<CONFIG:Debug>:CC_DEBUG=1>
)
