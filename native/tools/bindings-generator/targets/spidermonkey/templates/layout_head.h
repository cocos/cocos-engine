// clang-format off
#pragma once

#if $macro_judgement
$macro_judgement
#end if
\#include <type_traits>
\#include "cocos/bindings/jswrapper/SeApi.h"
\#include "cocos/bindings/manual/jsb_conversions.h"
#if $hpp_headers
#for header in $hpp_headers
\#include "${header}"
#end for
#end if

bool register_all_${prefix}(se::Object *obj);                   // NOLINT

// placeholder for jsb_register_types
