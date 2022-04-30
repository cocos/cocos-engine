

macro(cc_ohos_before_target target_name)
    set(CC_ALL_SOURCES ${CC_COMMON_SOURCES} ${CC_PROJ_SOURCES})
    cc_common_before_target(${target_name})
endmacro()

macro(cc_ohos_after_target target_name)
    
    target_link_libraries(${target_name}
        "-Wl,--whole-archive" cocos_jni "-Wl,--no-whole-archive"
        ${ENGINE_NAME}
    )
    target_include_directories(${target_name} PRIVATE
        ${CC_PROJECT_DIR}/../common/Classes
    )
    cc_common_after_target(${target_name})
endmacro()