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
#include "cocos/base/std/hash/hash.h"
#include "cocos/base/std/variant.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"

namespace cc {

namespace render {

enum class UpdateFrequency;
enum class ParameterType;

struct RasterTag;
struct ComputeTag;
struct CopyTag;
struct MoveTag;
struct RaytraceTag;

enum class ResourceResidency;
enum class QueueHint;
enum class ResourceDimension;
enum class ResourceFlags : uint32_t;

struct BufferTag;
struct TextureTag;

enum class TaskType;
enum class SceneFlags : uint32_t;
enum class LightingMode : uint32_t;
enum class AttachmentType;
enum class AccessType;

struct RasterView;

enum class ClearValueType;

struct ComputeView;
struct LightInfo;

} // namespace render

} // namespace cc

namespace ccstd {

template <>
struct hash<cc::render::RasterView> {
    size_t operator()(const cc::render::RasterView& v) const noexcept;
};

template <>
struct hash<cc::render::ComputeView> {
    size_t operator()(const cc::render::ComputeView& v) const noexcept;
};

} // namespace ccstd

// clang-format on
