macro(cc_ios_before_target app_name)
    include(${CC_PROJECT_DIR}/../common/CMakeLists.txt)
    set(CC_UI_RESOURCES
        ${CC_PROJECT_DIR}/LaunchScreenBackground.png
        ${CC_PROJECT_DIR}/Images.xcassets
        ${CC_PROJECT_DIR}/Base.lproj/Localizable.strings
        ${CC_PROJECT_DIR}/Base.lproj/LaunchScreen.storyboard
    )
    list(APPEND CC_PROJ_SOURCES
        ${CC_UI_RESOURCES}
    ) 
    if (USE_PORTRAIT)
        configure_file(${CC_PROJECT_DIR}/LaunchScreenBackgroundPortrait.png ${CC_PROJECT_DIR}/LaunchScreenBackground.png COPYONLY)
    else()
        configure_file(${CC_PROJECT_DIR}/LaunchScreenBackgroundLandscape.png ${CC_PROJECT_DIR}/LaunchScreenBackground.png COPYONLY)
    endif()



    if(NOT CUSTOM_COPY_RESOURCE_HOOK)
        cc_include_resources(${RES_DIR}/data CC_ASSET_FILES)
    endif()
    source_group(TREE ${RES_DIR}/data PREFIX "Resources" FILES ${CC_ASSET_FILES})
    source_group(TREE ${CC_PROJECT_DIR} PREFIX "Source Files" FILES ${CC_PROJ_SOURCES})
    source_group(TREE ${CC_PROJECT_DIR}/../common PREFIX "Source Files" FILES ${CC_PROJ_COMMON_SOURCES})

    set(CC_ALL_SOURCES ${CC_PROJ_SOURCES} ${CC_ASSET_FILES} ${CC_PROJ_COMMON_SOURCES})
endmacro()

macro(cc_ios_post_target target_name)
    set_target_properties(${LIB_NAME} PROPERTIES 
        MACOSX_BUNDLE 1
        MACOSX_BUNDLE_INFO_PLIST "${CC_PROJECT_DIR}/Info.plist"
        RESOURCE "${CC_UI_RESOURCES}"
        MACOSX_DEPLOYMENT_TARGET "${TARGET_IOS_VERSION}"
        XCODE_ATTRIBUTE_IPHONEOS_DEPLOYMENT_TARGET "${TARGET_IOS_VERSION}"
        XCODE_ATTRIBUTE_DEVELOPMENT_TEAM "${DEVELOPMENT_TEAM}"
        OSX_ARCHITECTURES "arm64;x86_64"
        XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "iPhone Developer"
        XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_APPICON_NAME "AppIcon"
        XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_LAUNCHSTORYBOARD_NAME "LaunchScreen"
        XCODE_ATTRIBUTE_ENABLE_BITCODE NO
        XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH YES
        IOS_INSTALL_COMBINED YES
        XCODE_ATTRIBUTE_SKIP_INSTALL NO
        XCODE_ATTRIBUTE_INSTALL_PATH "$(LOCAL_APPS_DIR)"
    )
    target_link_libraries(target_name cocos2d)

    target_compile_definitions(target_name PRIVATE
        GAME_NAME="${APP_NAME}"
    )

    target_include_directories(target_name PRIVATE
        ${CC_PROJECT_DIR}/../common/Classes
        ${CC_PROJECT_DIR}/service
    )
endmacro()


macro(cc_mac_before_target target_name)
    set(CC_UI_RESOURCES
        ${CC_PROJECT_DIR}/Assets.xcassets
        ${CC_PROJECT_DIR}/Icon.icns
    )
    if("${TARGET_OSX_VERSION}" VERSION_GREATER_EQUAL "11.0")
        add_definitions(-DMAC_MEMORY_LESS_TEXTURE_SUPPORT=1)
    endif()
    set(CC_COMMON_SOURCES
        ${CC_PROJECT_DIR}/../common/Classes/Game.h
        ${CC_PROJECT_DIR}/../common/Classes/Game.cpp
    )
    list(APPEND CC_PROJ_SOURCES
        ${CC_UI_RESOURCES}
    )
    if(NOT CUSTOM_COPY_RESOURCE_HOOK)
        cc_include_resources(${RES_DIR}/data CC_ASSET_FILES)
    endif()

    ## values used in Info.plist templates
    set(EXECUTABLE_NAME app_name)
    set(PRODUCT_NAME app_name)

    set(CC_ALL_SOURCES ${CC_PROJ_SOURCES} ${CC_ASSET_FILES} ${CC_PROJ_COMMON_SOURCES})
endmacro()


macro(cc_mac_after_target target_name)
    target_compile_definitions(${EXECUTABLE_NAME} PRIVATE
        GAME_NAME="${APP_NAME}"
    )
    source_group(TREE ${RES_DIR}/data PREFIX "Resources" FILES ${CC_ASSET_FILES})
    source_group(TREE ${CC_PROJECT_DIR} PREFIX "Source Files" FILES ${CC_PROJ_SOURCES})
    source_group(TREE ${CC_PROJECT_DIR}/../common PREFIX "Source Files" FILES ${CC_COMMON_SOURCES})

    target_link_libraries(${EXECUTABLE_NAME} cocos2d)
    target_include_directories(${EXECUTABLE_NAME} PRIVATE
        ${CC_PROJECT_DIR}/../common/Classes
    )

    # set(MACOSX_BUNDLE_GUI_IDENTIFIER org.cocos2dx.hellojavascript.mac)
    set_target_properties(${EXECUTABLE_NAME} PROPERTIES
        MACOSX_DEPLOYMENT_TARGET ${TARGET_OSX_VERSION}
        OSX_ARCHITECTURES "x86_64;arm64"
        XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH YES
        XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_APPICON_NAME "AppIcon"
        XCODE_ATTRIBUTE_ASSETCATALOG_COMPILER_LAUNCHSTORYBOARD_NAME "LaunchScreen"
        MACOSX_BUNDLE 1
        RESOURCE "${CC_UI_RESOURCES}"
        MACOSX_BUNDLE_INFO_PLIST "${CC_PROJECT_DIR}/Info.plist"
        XCODE_ATTRIBUTE_SKIP_INSTALL NO
        XCODE_ATTRIBUTE_INSTALL_PATH "$(LOCAL_APPS_DIR)"
    )

    if(ENABLE_SANDBOX)
        set_target_properties(${EXECUTABLE_NAME} PROPERTIES
            XCODE_ATTRIBUTE_CODE_SIGN_ENTITLEMENTS "${CC_PROJECT_DIR}/entitlements.plist"
        )
    endif()

endmacro()