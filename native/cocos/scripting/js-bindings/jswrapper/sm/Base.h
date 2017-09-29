#pragma once

#ifndef UINT64_C
#define UINT64_C(value) __CONCAT(value, ULL)
#endif

#include "jsapi.h"
#include "jsfriendapi.h"
#include "js/Initialization.h"
#include "js/Conversions.h"

#include <string>
#include <vector>
#include <unordered_map>
#include <chrono>
#include <functional>
#include <assert.h>

#include "HelperMacros.h"
