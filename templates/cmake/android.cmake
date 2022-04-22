

macro(cc_android_before_target target_name)
    set(CC_ALL_SOURCES ${CC_COMMON_SOURCES} ${CC_PROJ_SOURCES})
endmacro()


macro(cc_android_after_target target_name)
    target_compile_definitions(${target_name} PRIVATE
        GAME_NAME="${APP_NAME}"
    )
    target_link_libraries(${target_name}
        "-Wl,--whole-archive" cocos_jni "-Wl,--no-whole-archive"
        ${ENGINE_NAME}
    )
    target_include_directories(${target_name} PRIVATE
        ${CC_PROJECT_DIR}/../common/Classes
    )
endmacro()