// clang-format off
#pragma once
#include "base/Config.h"
#include <type_traits>
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/network/Downloader.h"

bool register_all_network(se::Object *obj);                   // NOLINT

JSB_REGISTER_OBJECT_TYPE(cc::network::DownloaderHints);
JSB_REGISTER_OBJECT_TYPE(cc::network::Downloader);


extern se::Object *__jsb_cc_network_DownloaderHints_proto; // NOLINT
extern se::Class * __jsb_cc_network_DownloaderHints_class; // NOLINT

bool js_register_cc_network_DownloaderHints(se::Object *obj); // NOLINT

template <>
bool sevalue_to_native(const se::Value &, cc::network::DownloaderHints *, se::Object *ctx); //NOLINT

extern se::Object *__jsb_cc_network_Downloader_proto; // NOLINT
extern se::Class * __jsb_cc_network_Downloader_class; // NOLINT

bool js_register_cc_network_Downloader(se::Object *obj); // NOLINT

SE_DECLARE_FUNC(js_network_Downloader_setOnTaskProgress);
SE_DECLARE_FUNC(js_network_Downloader_Downloader);
// clang-format on