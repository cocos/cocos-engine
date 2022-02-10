set(BINARY ${CMAKE_PROJECT_NAME})

file(GLOB_RECURSE SOURCES LIST_DIRECTORIES true *.h *.cpp)

add_executable(${BINARY} ${SOURCES})

add_test(NAME ${BINARY} COMMAND ${BINARY})

target_link_libraries(${BINARY} PUBLIC gtest ${ENGINE_NAME})
target_include_directories(${BINARY} PUBLIC ${CMAKE_CURRENT_LIST_DIR}/../..)
