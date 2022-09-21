


add_executable(test-fs test-fs.cpp)
target_link_libraries(test-fs PUBLIC ccfilesystem)
target_include_directories(test-fs PRIVATE 
    ${CMAKE_CURRENT_LIST_DIR}/../../..
    ${CMAKE_CURRENT_LIST_DIR}/../../../cocos
)

if(IOS)
    set_target_properties(test-fs PROPERTIES
        XCODE_ATTRIBUTE_ENABLE_BITCODE "NO"
    )
endif()