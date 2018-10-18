#pragma once
#include "base/ccConfig.h"
#if (USE_NET_WORK > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cocos2d_network_Downloader_proto;
extern se::Class* __jsb_cocos2d_network_Downloader_class;

bool js_register_cocos2d_network_Downloader(se::Object* obj);
bool register_all_network(se::Object* obj);
SE_DECLARE_FUNC(js_network_Downloader_setOnTaskError);
SE_DECLARE_FUNC(js_network_Downloader_setOnTaskProgress);
SE_DECLARE_FUNC(js_network_Downloader_setOnFileTaskSuccess);
SE_DECLARE_FUNC(js_network_Downloader_Downloader);

#endif //#if (USE_NET_WORK > 0) && (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
