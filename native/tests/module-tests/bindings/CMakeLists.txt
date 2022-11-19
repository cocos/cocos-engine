


set(LIB_NAME test-bindings)

add_executable(test-bindings test-bindings.cpp)
target_link_libraries(test-bindings PUBLIC ccbindings)
target_include_directories(test-bindings PRIVATE 
    ${CMAKE_CURRENT_LIST_DIR}/../../..
    ${CMAKE_CURRENT_LIST_DIR}/../../../cocos
)

if(MSVC)
    foreach(item ${WINDOWS_DLLS})
        get_filename_component(filename ${item} NAME)
        get_filename_component(abs ${item} ABSOLUTE)
        add_custom_command(TARGET ${LIB_NAME} POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy_if_different ${abs} $<TARGET_FILE_DIR:${LIB_NAME}>/${filename}
        )
    endforeach()
    foreach(item ${V8_DLLS})
            get_filename_component(filename ${item} NAME)
            add_custom_command(TARGET ${LIB_NAME} POST_BUILD
                COMMAND ${CMAKE_COMMAND} -E copy_if_different ${V8_DIR}/$<IF:$<BOOL:$<CONFIG:RELEASE>>,Release,Debug>/${filename} $<TARGET_FILE_DIR:${LIB_NAME}>/${filename}
            )
        endforeach()
    target_link_options(${LIB_NAME} PRIVATE /SUBSYSTEM:CONSOLE)
endif()


if(IOS)
    set_target_properties(test-bindings PROPERTIES
        XCODE_ATTRIBUTE_ENABLE_BITCODE "NO"
    )
endif()