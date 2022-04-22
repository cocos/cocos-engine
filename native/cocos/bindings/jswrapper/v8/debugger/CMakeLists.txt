cmake_minimum_required(VERSION 3.8)

project(v8_debugger CXX)


add_library(v8_debugger
    base64.h
    env.cpp
    env.h
    http_parser.cpp
    http_parser.h
    inspector_agent.cpp
    inspector_agent.h
    inspector_io.cpp
    inspector_io.h
    inspector_socket.cpp
    inspector_socket.h
    inspector_socket_server.cpp
    inspector_socket_server.h
    node.cpp
    node.h
    node_debug_options.cpp
    node_debug_options.h
    node_mutex.h
    SHA1.cpp
    SHA1.h
    util-inl.h
    util.cpp
    util.h
    v8_inspector_protocol_json.h
)

target_link_libraries(v8_debugger PUBLIC ${se_libs_name} uv ${ZLIB})
target_compile_definitions(v8_debugger PUBLIC
    $<$<CONFIG:Debug>:SE_ENABLE_INSPECTOR=1>
    $<$<CONFIG:Debug>:SE_DEBUG=1>
    $<$<CONFIG:Debug>:HAVE_INSPECTOR=1>
)
