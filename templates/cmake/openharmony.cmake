macro(cc_openharmony_before_target target_name)
    list(APPEND CC_COMMON_SOURCES
        ${COCOS_X_PATH}/cocos/platform/openharmony/napi/NapiInit.cpp
    )
    set(CC_ALL_SOURCES ${CC_COMMON_SOURCES} ${CC_PROJ_SOURCES})
    cc_common_before_target(${target_name})
endmacro()

macro(cc_openharmony_after_target target_name)
    
    target_link_libraries(${target_name}
        ${ENGINE_NAME}
    )

    target_link_options(${target_name} PRIVATE -Wl,--gc-sections)

    if("${CMAKE_BUILD_TYPE}" STREQUAL "Release")
        target_link_options(${target_name} PRIVATE -Wl,-s)
    endif()

    target_include_directories(${target_name} PRIVATE
        ${CC_PROJECT_DIR}/../common/Classes
    )
    cc_common_after_target(${target_name})
endmacro()