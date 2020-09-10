#pragma once
\#include "base/Config.h"
#if $macro_judgement
$macro_judgement
#end if 

\#include "cocos/bindings/jswrapper/SeApi.h"
#if $hpp_headers
#for header in $hpp_headers
\#include "${header}"
#end for
#end if 
