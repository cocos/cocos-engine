
include(${COCOS_X_PATH}/cmake/predefine.cmake)

if(NOT DEFINED XR_COMMON_SOURCES)
    set(XR_COMMON_SOURCES)
endif()

if(NOT DEFINED XR_LIBS)
    set(XR_LIBS)
endif()

if(NOT DEFINED XR_COMMON_PATH)
    set(XR_COMMON_PATH ${CMAKE_CURRENT_LIST_DIR}/../../../extensions/xr-plugin/common)
endif()

if(NOT DEFINED XR_LIBRARY_PATH)
    set(XR_LIBRARY_PATH ${CMAKE_CURRENT_LIST_DIR}/../../../extensions/xr-plugin/platforms)
endif()

include(${XR_COMMON_PATH}/xr.cmake)
