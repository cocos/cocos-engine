#ifndef __JS_BASIC_CONVERSIONS_H__
#define __JS_BASIC_CONVERSIONS_H__

#include "jsapi.h"
#include "jsfriendapi.h"

#include "ProtocolIAP.h"
#include "ProtocolAnalytics.h"
#include "ProtocolAds.h"
#include "ProtocolShare.h"
#include "ProtocolSocial.h"
#include "ProtocolUser.h"
#include "ProtocolREC.h"

#ifndef CCLOGINFO
#define CCLOGINFO(...)      
#endif

using namespace anysdk::framework;

namespace anysdk { namespace framework {

// to native
bool jsval_to_TProductInfo(JSContext *cx, JS::HandleValue v, TProductInfo* ret);
bool jsval_to_TIAPDeveloperInfo(JSContext *cx, JS::HandleValue v, TIAPDeveloperInfo* ret);
bool jsval_to_TAdsDeveloperInfo(JSContext *cx, JS::HandleValue v, TAdsDeveloperInfo* ret);
bool jsval_to_TAdsInfo(JSContext *cx, JS::HandleValue v, TAdsInfo* ret);
bool jsval_to_TShareDeveloperInfo(JSContext *cx, JS::HandleValue v, TShareDeveloperInfo* ret);
bool jsval_to_TShareInfo(JSContext *cx, JS::HandleValue v, TShareInfo* ret);
bool jsval_to_TVideoInfo(JSContext *cx, JS::HandleValue v, TVideoInfo* ret);
bool jsval_to_TSocialDeveloperInfo(JSContext *cx, JS::HandleValue v, TSocialDeveloperInfo* ret);
bool jsval_to_TAchievementInfo(JSContext *cx, JS::HandleValue v, TAchievementInfo* ret);
bool jsval_to_TPaymentInfo(JSContext *cx, JS::HandleValue v, std::map<std::string, std::string>* ret);
bool jsval_to_TUserDeveloperInfo(JSContext *cx, JS::HandleValue v, TUserDeveloperInfo* ret);
bool jsval_to_LogEventParamMap(JSContext *cx, JS::HandleValue v, LogEventParamMap** ret);
bool jsval_to_StringMap(JSContext *cx, JS::HandleValue v, StringMap* ret);
bool jsval_to_FBInfo(JSContext *cx, JS::HandleValue v, StringMap* ret);
bool jsval_array_to_string(JSContext *cx, JS::HandleValue v, std::string* ret);
//bool jsval_to_std_map_string_string(JSContext *cx, JS::HandleValue v, std::map<std::string, std::string>* ret);
// from native
jsval TProductInfo_to_jsval(JSContext *cx, TProductInfo& ret);
//jsval TProductList_to_jsval(JSContext *cx, TProductList ret);
jsval LogEventParamMap_to_jsval(JSContext *cx, LogEventParamMap*& ret);

} } // namespace anysdk { namespace framework {

#endif /* __JS_ANYSDK_CONVERSIONS_H__ */
