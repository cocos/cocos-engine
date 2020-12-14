
if (${COCOS_STATIC})
    set(TBB_BUILD_STATIC ON)
    set(TBB_BUILD_SHARED OFF)
else()
    set(TBB_BUILD_STATIC OFF)
    set(TBB_BUILD_SHARED ON)
endif()
set(TBB_BUILD_TESTS OFF)
add_subdirectory(${GFX_EXTERNAL_PATH}/tbb ${CMAKE_BINARY_DIR}/tbb)

add_subdirectory(job-system)
add_subdirectory(threading)
