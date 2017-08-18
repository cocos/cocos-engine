#pragma once

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

#include "ProtocolIAP.h"
#include "ProtocolAnalytics.h"
#include "ProtocolAds.h"
#include "ProtocolShare.h"
#include "ProtocolSocial.h"
#include "ProtocolUser.h"
#include "ProtocolREC.h"

// to native
bool seval_to_TVideoInfo(const se::Value& v, anysdk::framework::TVideoInfo* ret);

