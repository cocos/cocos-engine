#ifndef __JS_BASIC_CONVERSIONS_H__
#define __JS_BASIC_CONVERSIONS_H__

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

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

// to native
bool seval_to_TVideoInfo(const se::Value& v, anysdk::framework::TVideoInfo* ret);


#endif /* __JS_ANYSDK_CONVERSIONS_H__ */
