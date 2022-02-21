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
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/renderer/pipeline/custom/RenderCommonJsb.h"
#include "cocos/renderer/pipeline/custom/RenderGraphFwd.h"

bool nativevalue_to_se(const cc::render::RasterView &from, se::Value &to, se::Object *ctx); // NOLINT

bool nativevalue_to_se(const cc::render::ComputeView &from, se::Value &to, se::Object *ctx); // NOLINT

bool nativevalue_to_se(const cc::render::CopyPair &from, se::Value &to, se::Object *ctx); // NOLINT

bool nativevalue_to_se(const cc::render::MovePair &from, se::Value &to, se::Object *ctx); // NOLINT

// if function overload is used, android build fails
template <>
bool sevalue_to_native(const se::Value &from, cc::render::RasterView *to, se::Object *ctx); // NOLINT

template <>
bool sevalue_to_native(const se::Value &from, cc::render::ComputeView *to, se::Object *ctx); // NOLINT

template <>
bool sevalue_to_native(const se::Value &from, cc::render::CopyPair *to, se::Object *ctx); // NOLINT

template <>
bool sevalue_to_native(const se::Value &from, cc::render::MovePair *to, se::Object *ctx); // NOLINT

// clang-format on
