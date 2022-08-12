# the minimum version of CMake.

cmake_minimum_required(VERSION 3.8)

option(APP_NAME "Project Name" "test-cases")
project(${APP_NAME} CXX)

set(CMAKE_CXX_FLAGS_DEBUG  "-Werror=return-type")


include(${COMMON_DIR}/CMakeLists.txt)