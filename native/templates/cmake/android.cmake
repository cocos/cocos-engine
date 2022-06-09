

macro(cc_android_before_target target_name)
    list(APPEND CC_ALL_SOURCES ${CC_COMMON_SOURCES} ${CC_PROJ_SOURCES})
    cc_common_before_target(${target_name})
endmacro()


macro(cc_android_after_target target_name)
    
    target_link_libraries(${target_name}
        "-Wl,--whole-archive" cocos2d_jni "-Wl,--no-whole-archive"
        cocos2d
    )
    target_include_directories(${target_name} PRIVATE
        ${CC_PROJECT_DIR}/../common/Classes
    )
    cc_common_after_target(${target_name})
endmacro()