cmake_minimum_required(VERSION 3.4.0)
message(STATUS "Add target: SoaTransform...")
message(STATUS "CMake version: ${CMAKE_VERSION}")

option(DG_ENABLE "Enable degug" OFF)
if(DG_ENABLE)
add_definitions("-g")
message(STATUS "set debug mode")
endif()

set(TARGET_NAME transform)
INCLUDE_DIRECTORIES(${CMAKE_CURRENT_BINARY_DIR} ${CMAKE_CURRENT_SOURCE_DIR})
file(GLOB_RECURSE HEADER_FILES *.h)
file(GLOB_RECURSE SOURCE_CPP_FILES  *.cpp)
file(GLOB_RECURSE SOURCE_C_FILES *.c)

#-msse2
add_definitions("-msse -std=c++11")


file(GLOB GLUE_FILES build/glue.cpp)
message(STATUS ${GLUE_FILES})
list(REMOVE_ITEM SOURCE_CPP_FILES ${GLUE_FILES})
message(STATUS ${CMAKE_SYSTEM_NAME} ${CMAKE_INCLUDE_CURRENT_DIR})
#if(${CMAKE_SYSTEM_NAME} MATCHES "Emscripten")
#    ADD_DEFINITIONS(EMS)
#endif(${CMAKE_SYSTEM_NAME} MATCHES "Emscripten")
message(STATUS ${CMAKE_INCLUDE_PATH})
message(STATUS "all cpp : ${SOURCE_CPP_FILES}")
add_library(${TARGET_NAME} SHARED ${HEADER_FILES} ${SOURCE_CPP_FILES} ${SOURCE_C_FILES})
set_target_properties(${TARGET_NAME} PROPERTIES
		OUTPUT_NAME "transform"
	)


message(STATUS "c++ version: ${__cplusplus}")
message(STATUS "c ${CMAKE_C_FLAGS}")
message(STATUS "cxx ${CMAKE_CXX_FLAGS}")
message(STATUS "Configuration completed.") 
