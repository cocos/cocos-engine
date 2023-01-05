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

// Conditions outside GFX module better defined here.
namespace cc {

// MSAA_SWAPCHAIN: msaa swapchain
// RESOLVE_FORMAT_COMPATIBLE: is texture format differs between msaa and resolve allowed?

#if CC_EDITOR
    #if defined(CC_USE_GLES3) || defined(CC_USE_GLES2)

// by enabling this use egl config onscreen msaa
static constexpr bool MSAA_SWAPCHAIN{false};
    #else
static constexpr bool MSAA_SWAPCHAIN{true};
    #endif
#else
static constexpr bool MSAA_SWAPCHAIN{false};
#endif

#ifdef CC_USE_METAL
// note Metal requires resolve target has same format as msaa texture,
// if you try to resolve to swapchain, make sure msaa texture format consistent with swapchain.
static constexpr bool RESOLVE_FORMAT_COMPATIBLE{false};
#else
static constexpr bool RESOLVE_FORMAT_COMPATIBLE{true};
#endif

} // namespace cc
