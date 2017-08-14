#include "jsb_anysdk_basic_conversions.h"

#include "scripting/js-bindings/manual/jsb_conversions.hpp"

bool seval_to_TVideoInfo(const se::Value& v, anysdk::framework::TVideoInfo* ret)
{
    return seval_to_std_map_string_string(v, ret);
}

