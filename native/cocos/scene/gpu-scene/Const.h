/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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
#include "base/Macros.h"
#include "base/std/hash/hash_fwd.hpp"

namespace cc {
namespace scene {

/**
 * These values need to be consistent with the compute shader values
 */
constexpr uint32_t CS_HIZ_LOCAL_SIZE = 32;
constexpr uint32_t CS_GPU_CULLING_LOCAL_SIZE = 64;

/**
 * Default objects count in GPUScene
 */
constexpr uint32_t GPU_OBJECT_COUNT_INIT = 10240;

/**
 * Default instances count in GPUScene
 */
constexpr uint32_t GPU_INSTANCE_COUNT_INIT = 10240;

/**
 * Default indirect commands count in GPUScene
 */
constexpr uint32_t GPU_INDIRECT_COUNT_INIT = 4096;

} // namespace scene
} // namespace cc
