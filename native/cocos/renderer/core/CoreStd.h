/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#ifndef CC_CORE_CORE_STD_H_
#define CC_CORE_CORE_STD_H_

#include "base/Macros.h"

// STD including
#include <stdio.h>
#include <stdlib.h>
#include <wchar.h>
#include <math.h>
#include <float.h>
#include <assert.h>
#include <time.h>
#include <limits>

// STL including
#include <array>
#include <string>
#include <vector>
#include <list>
#include <queue>
#include <deque>
#include <set>
#include <map>
#include <unordered_map>
#include <algorithm>
#include <exception>
#include <functional>
#include <cmath>
#include <atomic>
#include <mutex>
#include <thread>
#include <cstdint>

#include "base/TypeDef.h"
#include "base/memory/Memory.h"
#include "math/Math.h"
#include "base/Log.h"
#include "base/Object.h"
#include "gfx/GFXObject.h"

#define CC_JOB_SYSTEM_TASKFLOW 1
#define CC_JOB_SYSTEM_TBB      2

#define CC_JOB_SYSTEM CC_JOB_SYSTEM_TASKFLOW

#endif // CC_CORE_CORE_STD_H_
