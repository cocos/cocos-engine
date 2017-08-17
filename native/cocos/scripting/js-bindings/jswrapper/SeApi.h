#pragma once

#include "config.hpp"

#ifdef SCRIPT_ENGINE_SM
#include "sm/SeApi.h"
#endif

#ifdef SCRIPT_ENGINE_V8
#include "v8/SeApi.h"
#endif

#ifdef SCRIPT_ENGINE_JSC
#include "jsc/SeApi.h"
#endif

#ifdef SCRIPT_ENGINE_CHAKRACORE
#include "chakracore/SeApi.h"
#endif

#include "Value.hpp"
#include "Object.hpp"
#include "State.hpp"
#include "HandleObject.hpp"
#include "MappingUtils.hpp"
