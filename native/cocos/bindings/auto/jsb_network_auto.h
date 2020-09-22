#pragma once
#include "base/Config.h"

#include "cocos/bindings/jswrapper/SeApi.h"

extern se::Object* __jsb_cc_network_Downloader_proto;
extern se::Class* __jsb_cc_network_Downloader_class;

bool js_register_cc_network_Downloader(se::Object* obj);
bool register_all_network(se::Object* obj);
SE_DECLARE_FUNC(js_network_Downloader_setOnTaskProgress);
SE_DECLARE_FUNC(js_network_Downloader_Downloader);

