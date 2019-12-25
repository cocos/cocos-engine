


set(CC_EXTERNAL_SROUCES
  ${CMAKE_CURRENT_LIST_DIR}/tinyxml2/tinyxml2.cpp
  ${CMAKE_CURRENT_LIST_DIR}/tinyxml2/tinyxml2.h

  ${CMAKE_CURRENT_LIST_DIR}/xxtea/xxtea.cpp
  ${CMAKE_CURRENT_LIST_DIR}/xxtea/xxtea.h

  ${CMAKE_CURRENT_LIST_DIR}/unzip/crypt.h
  ${CMAKE_CURRENT_LIST_DIR}/unzip/ioapi.cpp
  ${CMAKE_CURRENT_LIST_DIR}/unzip/ioapi.h
  ${CMAKE_CURRENT_LIST_DIR}/unzip/ioapi_mem.cpp
  ${CMAKE_CURRENT_LIST_DIR}/unzip/ioapi_mem.h
  ${CMAKE_CURRENT_LIST_DIR}/unzip/unzip.cpp
  ${CMAKE_CURRENT_LIST_DIR}/unzip/unzip.h

  
  ${CMAKE_CURRENT_LIST_DIR}/ConvertUTF/ConvertUTF.c
  ${CMAKE_CURRENT_LIST_DIR}/ConvertUTF/ConvertUTF.h
  ${CMAKE_CURRENT_LIST_DIR}/ConvertUTF/ConvertUTFWrapper.cpp
)

if(ANDROID)

  include(${CMAKE_CURRENT_LIST_DIR}/pvmp3dec/CMakeLists.txt)
  include(${CMAKE_CURRENT_LIST_DIR}/tremolo/CMakeLists.txt)

  list(APPEND CC_EXTERNAL_LIBS 
    pvmp3dec
    vorbisidec
  )

  if(ANDROID_NDK)
    list(APPEND CC_EXTERNAL_SROUCES
      ${ANDROID_NDK}/sources/android/cpufeatures/cpu-features.c
    )
    list(APPEND CC_EXTERNAL_INCLUDES
      ${ANDROID_NDK}/sources/android/cpufeatures
    )
  endif()

elseif(WINDOWS)
  set_source_files_properties(${CMAKE_CURRENT_LIST_DIR}/ConvertUTF/ConvertUTF.c PROPERTIES
    LANGUAGE C
  )
elseif(APPLE)
  if(USE_SOCKET)
      include(${CMAKE_CURRENT_LIST_DIR}/SocketRocket/CMakeLists.txt)
      list(APPEND CC_EXTERNAL_LIBS
          SocketRocket
      )
  endif()
endif()

list(APPEND CC_EXTERNAL_INCLUDES
 ${CMAKE_CURRENT_LIST_DIR}
)