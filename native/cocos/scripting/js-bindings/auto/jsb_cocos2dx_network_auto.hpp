#pragma once
#include "base/ccConfig.h"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cocos2d_network_Downloader_proto;
extern se::Class* __jsb_cocos2d_network_Downloader_class;

bool js_register_cocos2d_network_Downloader(se::Object* obj);
bool register_all_cocos2dx_network(se::Object* obj);
SE_DECLARE_FUNC(js_cocos2dx_network_Downloader_setOnTaskError);
SE_DECLARE_FUNC(js_cocos2dx_network_Downloader_setOnTaskProgress);
SE_DECLARE_FUNC(js_cocos2dx_network_Downloader_createDownloadFileTask);
SE_DECLARE_FUNC(js_cocos2dx_network_Downloader_setOnFileTaskSuccess);
SE_DECLARE_FUNC(js_cocos2dx_network_Downloader_Downloader);

