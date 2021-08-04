#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/network/Downloader.h"

extern se::Object* __jsb_cc_network_DownloaderHints_proto;
extern se::Class* __jsb_cc_network_DownloaderHints_class;

bool js_register_cc_network_DownloaderHints(se::Object* obj);
bool register_all_network(se::Object* obj);

template<>
bool sevalue_to_native(const se::Value &, cc::network::DownloaderHints *, se::Object *ctx);
JSB_REGISTER_OBJECT_TYPE(cc::network::DownloaderHints);

extern se::Object* __jsb_cc_network_Downloader_proto;
extern se::Class* __jsb_cc_network_Downloader_class;

bool js_register_cc_network_Downloader(se::Object* obj);
bool register_all_network(se::Object* obj);

JSB_REGISTER_OBJECT_TYPE(cc::network::Downloader);
SE_DECLARE_FUNC(js_network_Downloader_setOnTaskProgress);
SE_DECLARE_FUNC(js_network_Downloader_Downloader);

