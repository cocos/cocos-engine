cmake_minimum_required(VERSION 3.8)
set(APP_NAME "cocos2dDllDemo")
project(${APP_NAME} CXX)

add_library(cocos_engine SHARED IMPORTED GLOBAL)
set_target_properties(cocos_engine PROPERTIES
  IMPORTED_LOCATION ${CMAKE_CURRENT_LIST_DIR}/cocos_engine.dll
  IMPORTED_IMPLIB ${CMAKE_CURRENT_LIST_DIR}/cocos_engine.lib
)


add_executable(${APP_NAME}
    ${CMAKE_CURRENT_LIST_DIR}/main.cpp
    ${CMAKE_CURRENT_LIST_DIR}/cc_main.h
)
target_link_libraries(${APP_NAME} PUBLIC cocos_engine)

add_custom_command(TARGET ${APP_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different ${CMAKE_CURRENT_LIST_DIR}/cocos_engine.dll $<TARGET_FILE_DIR:${APP_NAME}>/cocos_engine.dll
)