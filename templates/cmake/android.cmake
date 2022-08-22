

macro(cc_android_before_target target_name)
    list(APPEND CC_ALL_SOURCES ${CC_COMMON_SOURCES} ${CC_PROJ_SOURCES})

    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fsigned-char -ffunction-sections -fdata-sections -fstrict-aliasing")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fsigned-char -ffunction-sections -fdata-sections -fstrict-aliasing -frtti -fexceptions")

    if("${ANDROID_ABI}" STREQUAL "armeabi-v7a")
        set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -mfpu=neon-fp16")
        set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -mfpu=neon-fp16")
    endif()

    set(CMAKE_C_FLAGS_DEBUG "${CMAKE_C_FLAGS_DEBUG} -fvisibility=default -fno-omit-frame-pointer")
    set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -fvisibility=default -fno-omit-frame-pointer")
    if(NOT DEFINED HIDE_SYMBOLS OR HIDE_SYMBOLS) # hidden by default
        set(CMAKE_C_FLAGS_RELEASE "${CMAKE_C_FLAGS_RELEASE} -fvisibility=hidden")
        set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -fvisibility=hidden -fvisibility-inlines-hidden")
    endif()
    cc_common_before_target(${target_name})
endmacro()


macro(cc_android_after_target target_name)
    
    target_link_libraries(${target_name}
        "-Wl,--whole-archive" cocos_jni "-Wl,--no-whole-archive"
        ${ENGINE_NAME}
    )

    set_target_properties(${target_name} PROPERTIES LINK_FLAGS " -Wl,--gc-sections")

    target_include_directories(${target_name} PRIVATE
        ${CC_PROJECT_DIR}/../common/Classes
    )
    cc_common_after_target(${target_name})
endmacro()