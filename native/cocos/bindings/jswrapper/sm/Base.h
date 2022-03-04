/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

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

#include "js/Initialization.h"
#include "js/Conversions.h"
#include "js/ArrayBuffer.h"
#include "js/JSON.h"
#include "js/Equality.h"
#include "js/Warnings.h"
#include "js/LocaleSensitive.h"
#include "js/ContextOptions.h"
#include "js/CompilationAndEvaluation.h"
#include "js/SourceText.h"
#include "js/GCAPI.h"
#include "js/BuildId.h"
#include "js/MemoryMetrics.h"
#include "js/Array.h"
#include "js/experimental/TypedData.h"
#include "js/BigInt.h"

#include "mozilla/Unused.h"

#include "../PrivateObject.h"
#include "HelperMacros.h"

#include <assert.h>
#include <chrono>
#include <functional>
#include <string>
#include <unordered_map>
#include <vector>
#include <initializer_list>
