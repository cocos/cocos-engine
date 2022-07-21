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
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"

namespace cc {

namespace render {

inline const char* getName(UpdateFrequency e) noexcept {
    switch (e) {
        case UpdateFrequency::PER_INSTANCE: return "PER_INSTANCE";
        case UpdateFrequency::PER_BATCH: return "PER_BATCH";
        case UpdateFrequency::PER_QUEUE: return "PER_QUEUE";
        case UpdateFrequency::PER_PASS: return "PER_PASS";
        case UpdateFrequency::COUNT: return "COUNT";
    }
    return "";
}
inline const char* getName(ParameterType e) noexcept {
    switch (e) {
        case ParameterType::CONSTANTS: return "CONSTANTS";
        case ParameterType::CBV: return "CBV";
        case ParameterType::UAV: return "UAV";
        case ParameterType::SRV: return "SRV";
        case ParameterType::TABLE: return "TABLE";
        case ParameterType::SSV: return "SSV";
    }
    return "";
}
inline const char* getName(const RasterTag& /*v*/) noexcept { return "Raster"; }
inline const char* getName(const ComputeTag& /*v*/) noexcept { return "Compute"; }
inline const char* getName(const CopyTag& /*v*/) noexcept { return "Copy"; }
inline const char* getName(const MoveTag& /*v*/) noexcept { return "Move"; }
inline const char* getName(const RaytraceTag& /*v*/) noexcept { return "Raytrace"; }
inline const char* getName(ResourceResidency e) noexcept {
    switch (e) {
        case ResourceResidency::MANAGED: return "MANAGED";
        case ResourceResidency::MEMORYLESS: return "MEMORYLESS";
        case ResourceResidency::PERSISTENT: return "PERSISTENT";
        case ResourceResidency::EXTERNAL: return "EXTERNAL";
        case ResourceResidency::BACKBUFFER: return "BACKBUFFER";
    }
    return "";
}
inline const char* getName(QueueHint e) noexcept {
    switch (e) {
        case QueueHint::NONE: return "NONE";
        case QueueHint::RENDER_OPAQUE: return "RENDER_OPAQUE";
        case QueueHint::RENDER_CUTOUT: return "RENDER_CUTOUT";
        case QueueHint::RENDER_TRANSPARENT: return "RENDER_TRANSPARENT";
    }
    return "";
}
inline const char* getName(ResourceDimension e) noexcept {
    switch (e) {
        case ResourceDimension::BUFFER: return "BUFFER";
        case ResourceDimension::TEXTURE1D: return "TEXTURE1D";
        case ResourceDimension::TEXTURE2D: return "TEXTURE2D";
        case ResourceDimension::TEXTURE3D: return "TEXTURE3D";
    }
    return "";
}
inline const char* getName(const BufferTag& /*v*/) noexcept { return "Buffer"; }
inline const char* getName(const TextureTag& /*v*/) noexcept { return "Texture"; }
inline const char* getName(TaskType e) noexcept {
    switch (e) {
        case TaskType::SYNC: return "SYNC";
        case TaskType::ASYNC: return "ASYNC";
    }
    return "";
}
inline const char* getName(LightingMode e) noexcept {
    switch (e) {
        case LightingMode::NONE: return "NONE";
        case LightingMode::DEFAULT: return "DEFAULT";
        case LightingMode::CLUSTERED: return "CLUSTERED";
    }
    return "";
}
inline const char* getName(AttachmentType e) noexcept {
    switch (e) {
        case AttachmentType::RENDER_TARGET: return "RENDER_TARGET";
        case AttachmentType::DEPTH_STENCIL: return "DEPTH_STENCIL";
    }
    return "";
}
inline const char* getName(AccessType e) noexcept {
    switch (e) {
        case AccessType::READ: return "READ";
        case AccessType::READ_WRITE: return "READ_WRITE";
        case AccessType::WRITE: return "WRITE";
    }
    return "";
}
inline const char* getName(const RasterView& /*v*/) noexcept { return "RasterView"; }
inline const char* getName(ClearValueType e) noexcept {
    switch (e) {
        case ClearValueType::FLOAT_TYPE: return "FLOAT_TYPE";
        case ClearValueType::INT_TYPE: return "INT_TYPE";
    }
    return "";
}
inline const char* getName(const ComputeView& /*v*/) noexcept { return "ComputeView"; }
inline const char* getName(const LightInfo& /*v*/) noexcept { return "LightInfo"; }

} // namespace render

} // namespace cc

// clang-format on
