/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include "cocos/renderer/pipeline/custom/LayoutGraphNames.h"
#include "cocos/renderer/pipeline/custom/RenderExampleTypes.h"
#include "cocos/renderer/pipeline/custom/RenderGraphNames.h"

namespace cc {

namespace render {

namespace example {

inline const char* getName(DependencyType e) noexcept {
    switch (e) {
        case DependencyType::ORDER: return "ORDER";
        case DependencyType::DATA: return "DATA";
    }
    return "";
}
inline const char* getName(const RenderPassNode& /*v*/) noexcept { return "RenderPassNode"; }
inline const char* getName(const RenderPassTraits& /*v*/) noexcept { return "RenderPassTraits"; }
inline const char* getName(const RenderDependencyGraph& /*v*/) noexcept { return "RenderDependencyGraph"; }
inline const char* getName(const RenderValueNode& /*v*/) noexcept { return "RenderValueNode"; }
inline const char* getName(const RenderValueGraph& /*v*/) noexcept { return "RenderValueGraph"; }
inline const char* getName(const RenderCompiler& /*v*/) noexcept { return "RenderCompiler"; }

} // namespace example

} // namespace render

} // namespace cc

// clang-format on
