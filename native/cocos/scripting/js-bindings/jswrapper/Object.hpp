#pragma once

#include "config.hpp"

#ifdef SCRIPT_ENGINE_SM
#include "sm/Object.hpp"
#endif

#ifdef SCRIPT_ENGINE_V8
#include "v8/Object.hpp"
#endif

#ifdef SCRIPT_ENGINE_JSC
#include "jsc/Object.hpp"
#endif

#ifdef SCRIPT_ENGINE_CHAKRACORE
#include "chakracore/Object.hpp"
#endif

