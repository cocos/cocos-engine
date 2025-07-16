cmake_minimum_required(VERSION 3.8)

project(module-tests CXX)
enable_language(C ASM)

set(CMAKE_CXX_STANDARD 17)

set(USE_MODULES ON)
include(${CMAKE_CURRENT_LIST_DIR}/../../CMakeLists.txt)

add_subdirectory(log)
add_subdirectory(bindings)
add_subdirectory(math)
add_subdirectory(filesystem)