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
bool jsval_to_LogEventParamMap(JSContext *cx, JS::HandleValue v, LogEventParamMap** ret);
bool jsval_to_StringMap(JSContext *cx, JS::HandleValue v, StringMap* ret);
// from native
//jsval TProductList_to_jsval(JSContext *cx, TProductList ret);
bool LogEventParamMap_to_jsval(JSContext *cx, LogEventParamMap*& map, JS::MutableHandleValue ret);

} } // namespace anysdk { namespace framework {

#endif /* __JS_ANYSDK_CONVERSIONS_H__ */
