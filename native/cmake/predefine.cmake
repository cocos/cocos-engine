
set(CC_PLATFORM_MAC_IOS 1)
set(CC_PLATFORM_WINDOWS 2)
set(CC_PLATFORM_ANDROID 3)
set(CC_PLATFORM_MAC_OSX 4)
set(CC_PLATFORM_OHOS    5)
set(CC_PLATFORM 1)

if(${CMAKE_SYSTEM_NAME} MATCHES "Windows")
    set(WINDOWS TRUE)
    set(PLATFORM_FOLDER win32)
    set(CC_PLATFORM ${CC_PLATFORM_WINDOWS})
elseif(${CMAKE_SYSTEM_NAME} MATCHES "Android")
    set(PLATFORM_FOLDER android)
    set(ANDROID TRUE)
    set(CC_PLATFORM ${CC_PLATFORM_ANDROID})
elseif(${CMAKE_SYSTEM_NAME} MATCHES "Darwin")
    set(APPLE TRUE)
    set(MACOSX TRUE)
    set(PLATFORM_FOLDER mac)
    set(CC_PLATFORM ${CC_PLATFORM_MAC_OSX})
elseif(${CMAKE_SYSTEM_NAME} MATCHES "iOS")
    set(APPLE TRUE)
    set(IOS TRUE)
    set(PLATFORM_FOLDER ios)
    set(CC_PLATFORM ${CC_PLATFORM_MAC_IOS})
elseif(OHOS)
    set(OHOS TRUE)
    set(CC_PLATFORM ${CC_PLATFORM_OHOS})
    add_definitions(-D__OHOS__=1)
    set(PLATFORM_FOLDER ohos)
else()
    message(FATAL_ERROR "Unsupported platform '${CMAKE_SYSTEM_NAME}', CMake will exit!")
    return()
endif()

# platform macros
add_definitions(-DCC_PLATFORM_WINDOWS=${CC_PLATFORM_WINDOWS})
add_definitions(-DCC_PLATFORM_MAC_OSX=${CC_PLATFORM_MAC_OSX})
add_definitions(-DCC_PLATFORM_MAC_IOS=${CC_PLATFORM_MAC_IOS})
add_definitions(-DCC_PLATFORM_ANDROID=${CC_PLATFORM_ANDROID})
add_definitions(-DCC_PLATFORM_OHOS=${CC_PLATFORM_OHOS})
add_definitions(-DCC_PLATFORM=${CC_PLATFORM})

# simplify generator condition, please use them everywhere
if(CMAKE_GENERATOR STREQUAL Xcode)
    set(XCODE TRUE)
elseif(CMAKE_GENERATOR MATCHES Visual)
    set(VS TRUE)
endif()

# generators that are capable of organizing into a hierarchy of folders
set_property(GLOBAL PROPERTY USE_FOLDERS ON)

# set c++ standard
set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)


if("$ENV{COCOS_ENGINE_DEV}" EQUAL "1")
    set(WERROR_FLAGS "-Werror")
    if ("${CMAKE_CXX_COMPILER_ID}" STREQUAL "MSVC")
        set(WERROR_FLAGS "/WX")
    endif()
    message(STATUS "Enable NO_WERROR")
else()
    set(WERROR_FLAGS "")
    message(STATUS "Ignore NO_WERROR")
endif()


function(cc_enable_werror source_list)
    foreach(src IN LISTS source_list)
        if("${src}" MATCHES "\\.(cpp|mm|c|m)\$")
            set_source_files_properties("${src}" PROPERTIES
                COMPILE_FLAGS "${WERROR_FLAGS}"
            )
        endif()
    endforeach()
endfunction()

################################# cc_set_if_undefined ###################################
macro(cc_set_if_undefined varname value)
    if(NOT DEFINED ${varname})
        set(${varname} ${value})
    endif()
endmacro()


################################# cocos_source_files ###################################
macro(cocos_source_files)
    set(list_var "${ARGN}")
    set(TWAE ON)
    set(ACCEPT_MN OFF)
    set(MODULE_NAME "COCOS2D")
    foreach(src IN LISTS list_var)
        if(ACCEPT_MN) 
            set(MODULE_NAME "${src}")
            set(ACCEPT_MN OFF)
        elseif("NO_WERROR" STREQUAL "${src}")
            set(TWAE OFF)
        elseif("MODULE" STREQUAL "${src}")
            set(ACCEPT_MN ON)
        else()
            set(fp "${CWD}/${src}")
            if(EXISTS ${fp})
                if("${src}" MATCHES "\\.(cpp|mm|c|m)\$" AND TWAE)
                     set_source_files_properties("${CWD}/${src}" PROPERTIES
                         COMPILE_FLAGS "${WERROR_FLAGS}"
                     )
                endif()
                list(APPEND ${MODULE_NAME}_SOURCE_LIST "${CWD}/${src}")
            else()
                message(FATAL_ERROR "Cocos souce file not exists: ${src} in ${CWD}")
            endif()
            set(TWAE ON)
        endif()
    endforeach()
endmacro()

################################# inspect_values ###################################
function(cc_inspect_values)
    set(list_var "${ARGN}")
    foreach(src IN LISTS list_var)
        set(opv ${${src}})
        message(STATUS "OPTION ${src}:\t${opv}")
    endforeach()
endfunction()


function(cc_win32_definations target)
    target_compile_definitions(${target} PUBLIC
        CC_STATIC
        WIN32
        _WIN32
        _WINDOWS
        NOMINMAX
        UNICODE
        _UNICODE
        _USE_MATH_DEFINES
        _CRT_SECURE_NO_WARNINGS
        _SCL_SECURE_NO_WARNINGS
        _USRLIBSIMSTATIC
        SE_ENABLE_INSPECTOR
    )
endfunction()
