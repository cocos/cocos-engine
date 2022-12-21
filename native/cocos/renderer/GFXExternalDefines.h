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

#if CC_EDITOR
    #if defined(CC_USE_GLES3) || defined(CC_USE_GLES2)
// by enabling this render target texture is multisampled
static constexpr bool MSAA_RT{false};
// by enabling this use egl config onscreen msaa
static constexpr bool MSAA_SWAPCHAIN{true};
// by enabling this rendertarget is able to `move` to swapchain
static constexpr bool MOVE_TO_SWAPCHAIN{true};
    #else
static constexpr bool MSAA_RT{true};
static constexpr bool MSAA_SWAPCHAIN{false};
static constexpr bool MOVE_TO_SWAPCHAIN{false};
    #endif
#else

// note Metal requires resolve target has same format as msaa texture,
// if you try to resolve to swapchain, make sure msaa texture format consistent with swapchain.
static constexpr bool MSAA_RT{false};
static constexpr bool MSAA_SWAPCHAIN{false};
static constexpr bool MOVE_TO_SWAPCHAIN{true};
#endif

#if defined(CC_USE_GLES3) || defined(CC_USE_GLES2)
// gl msaa rt needs a resolve target, while gl swapchain is memoryless(default fbo not a texture target),
// so move is banned when msaa_rt is ON.
static_assert(!(MSAA_RT && MOVE_TO_SWAPCHAIN));
    #ifdef CC_USE_GLES2
// present in frame graph performs a fbo(rbo) -> fbo(default)
// gles2 no blitFramebuffer, same time read from render buffer is not allowed
static_assert(MOVE_TO_SWAPCHAIN ^ MSAA_RT);
    #endif
#endif

} // namespace cc
