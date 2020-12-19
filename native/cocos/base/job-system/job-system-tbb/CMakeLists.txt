set(TARGET_NAME TBBJobSystem)

message(STATUS "Target: ${TARGET_NAME}...")
# ---------------------------------------------------------------------
# set include files

set(INCLUDE_FILES
  ${GFX_EXTERNAL_PATH}/tbb/include
  ${COCOS_SRC_PATH}
  ${COCOS_SRC_PATH}/base
  ${COCOS_SRC_PATH}/renderer/core
)

include_directories( ${INCLUDE_FILES} )

# ---------------------------------------------------------------------

file(GLOB_RECURSE HEADER_FILES *.h)
file(GLOB_RECURSE SOURCE_CPP_FILES *.cpp *.cc)
file(GLOB_RECURSE SOURCE_C_FILES *.c)

if(COCOS_PLATFORM_IOS OR COCOS_PLATFORM_OSX)
	file(GLOB_RECURSE SOURCE_MM_FILES *.m *.mm)
endif()

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

set(ALL_FILES
	${CC_BASE_HEADERS}
	${CC_BASE_SOURCES}
	${HEADER_FILES}
	${SOURCE_CPP_FILES}
	${SOURCE_C_FILES}
)

if(COCOS_PLATFORM_IOS OR COCOS_PLATFORM_OSX)
	set(ALL_FILES ${ALL_FILES} ${SOURCE_MM_FILES})
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

target_link_libraries(${TARGET_NAME} ${TBB_LIBRARIES})

set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME CCTBBJobSystem)
set_target_properties(${TARGET_NAME} PROPERTIES OUTPUT_NAME_DEBUG CCTBBJobSystem_d)

message(STATUS "${TARGET_NAME} configuration completed.")

target_compile_definitions(${TARGET_NAME} PUBLIC
    $<$<CONFIG:Debug>:CC_DEBUG=1>
)
