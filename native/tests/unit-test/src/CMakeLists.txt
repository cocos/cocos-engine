set(BINARY ${CMAKE_PROJECT_NAME})

file(GLOB_RECURSE SOURCES LIST_DIRECTORIES true *.h *.cpp)

add_executable(${BINARY} ${SOURCES})

add_test(NAME ${BINARY} COMMAND ${BINARY})

target_link_libraries(${BINARY} PUBLIC gtest ${ENGINE_NAME})
target_include_directories(${BINARY} PUBLIC ${CMAKE_CURRENT_LIST_DIR}/../..)

if(MSVC)
    foreach(item ${WINDOWS_DLLS})
        get_filename_component(filename ${item} NAME)
        get_filename_component(abs ${item} ABSOLUTE)
        add_custom_command(TARGET ${BINARY} POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy_if_different ${abs} $<TARGET_FILE_DIR:${BINARY}>/${filename}
        )
    endforeach()
    foreach(item ${V8_DLLS})
        get_filename_component(filename ${item} NAME)
        add_custom_command(TARGET ${BINARY} POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy_if_different ${V8_DIR}/$<IF:$<BOOL:$<CONFIG:RELEASE>>,Release,Debug>/${filename} $<TARGET_FILE_DIR:${BINARY}>/${filename}
        )
    endforeach()
    target_link_options(${BINARY} PRIVATE /SUBSYSTEM:CONSOLE)
endif()