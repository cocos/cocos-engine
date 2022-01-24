/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "base/Macros.h"

// STD includes
#include <cassert>
#include <cfloat>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <cwchar>
#include <limits>

// STL includes
#include <algorithm>
#include <array>
#include <atomic>
#include <cstdint>
#include <deque>
#include <exception>
#include <functional>
#include <list>
#include <map>
#include <mutex>
#include <queue>
#include <set>
#include <string>
#include <thread>
#include <unordered_map>
#include <vector>

#include "base/CachedArray.h"
#include "base/Log.h"
#include "base/Object.h"
#include "base/StringUtil.h"
#include "base/TypeDef.h"
#include "base/memory/Memory.h"

#include "math/Math.h"

#define CC_JOB_SYSTEM_TASKFLOW 1
#define CC_JOB_SYSTEM_TBB      2

#if USE_JOB_SYSTEM_TBB
    #define CC_JOB_SYSTEM CC_JOB_SYSTEM_TBB
#elif USE_JOB_SYSTEM_TASKFLOW
    #define CC_JOB_SYSTEM CC_JOB_SYSTEM_TASKFLOW
#endif
