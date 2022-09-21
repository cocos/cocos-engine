


add_executable(test-math test-math.cpp)
target_link_libraries(test-math PUBLIC ccmath)
target_include_directories(test-math PRIVATE 
    ${CMAKE_CURRENT_LIST_DIR}/../../..
    ${CMAKE_CURRENT_LIST_DIR}/../../../cocos
)

if(IOS)
    set_target_properties(test-math PROPERTIES
        XCODE_ATTRIBUTE_ENABLE_BITCODE "NO"
    )
endif()