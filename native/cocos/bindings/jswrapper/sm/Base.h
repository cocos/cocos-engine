/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#ifndef UINT64_C
    #define UINT64_C(value) __CONCAT(value, ULL)
#endif

#include "jsapi.h"
#include "jsfriendapi.h"

#include "js/Array.h"
#include "js/ArrayBuffer.h"
#include "js/BigInt.h"
#include "js/BuildId.h"
#include "js/CompilationAndEvaluation.h"
#include "js/ContextOptions.h"
#include "js/Conversions.h"
#include "js/Equality.h"
#include "js/GCAPI.h"
#include "js/Initialization.h"
#include "js/JSON.h"
#include "js/LocaleSensitive.h"
#include "js/MemoryMetrics.h"
#include "js/SourceText.h"
#include "js/Warnings.h"
#include "js/experimental/TypedData.h"

#include "mozilla/Unused.h"

#include "../PrivateObject.h"
#include "HelperMacros.h"

#include <assert.h>
#include <chrono>
#include <functional>
#include <initializer_list>
#include <unordered_map>
#include <vector>
#include "base/std/container/string.h"
