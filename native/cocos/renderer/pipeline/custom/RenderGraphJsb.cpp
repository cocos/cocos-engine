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
#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/renderer/pipeline/custom/JsbConversion.h"
#include "cocos/renderer/pipeline/custom/RenderGraphJsb.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"

bool nativevalue_to_se(const cc::render::RasterView &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value        tmp;

    nativevalue_to_se(from.slotName, tmp, ctx);
    obj->setProperty("slotName", tmp);

    nativevalue_to_se(from.accessType, tmp, ctx);
    obj->setProperty("accessType", tmp);

    nativevalue_to_se(from.attachmentType, tmp, ctx);
    obj->setProperty("attachmentType", tmp);

    nativevalue_to_se(from.loadOp, tmp, ctx);
    obj->setProperty("loadOp", tmp);

    nativevalue_to_se(from.storeOp, tmp, ctx);
    obj->setProperty("storeOp", tmp);

    nativevalue_to_se(from.clearFlags, tmp, ctx);
    obj->setProperty("clearFlags", tmp);

    nativevalue_to_se(from.clearColor, tmp, ctx);
    obj->setProperty("clearColor", tmp);

    to.setObject(obj);
    return true;
}

bool nativevalue_to_se(const cc::render::ComputeView &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value        tmp;

    nativevalue_to_se(from.name, tmp, ctx);
    obj->setProperty("name", tmp);

    nativevalue_to_se(from.accessType, tmp, ctx);
    obj->setProperty("accessType", tmp);

    nativevalue_to_se(from.clearFlags, tmp, ctx);
    obj->setProperty("clearFlags", tmp);

    nativevalue_to_se(from.clearColor, tmp, ctx);
    obj->setProperty("clearColor", tmp);

    nativevalue_to_se(from.clearValueType, tmp, ctx);
    obj->setProperty("clearValueType", tmp);

    to.setObject(obj);
    return true;
}

bool nativevalue_to_se(const cc::render::CopyPair &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value        tmp;

    nativevalue_to_se(from.source, tmp, ctx);
    obj->setProperty("source", tmp);

    nativevalue_to_se(from.target, tmp, ctx);
    obj->setProperty("target", tmp);

    nativevalue_to_se(from.mipLevels, tmp, ctx);
    obj->setProperty("mipLevels", tmp);

    nativevalue_to_se(from.numSlices, tmp, ctx);
    obj->setProperty("numSlices", tmp);

    nativevalue_to_se(from.sourceMostDetailedMip, tmp, ctx);
    obj->setProperty("sourceMostDetailedMip", tmp);

    nativevalue_to_se(from.sourceFirstSlice, tmp, ctx);
    obj->setProperty("sourceFirstSlice", tmp);

    nativevalue_to_se(from.sourcePlaneSlice, tmp, ctx);
    obj->setProperty("sourcePlaneSlice", tmp);

    nativevalue_to_se(from.targetMostDetailedMip, tmp, ctx);
    obj->setProperty("targetMostDetailedMip", tmp);

    nativevalue_to_se(from.targetFirstSlice, tmp, ctx);
    obj->setProperty("targetFirstSlice", tmp);

    nativevalue_to_se(from.targetPlaneSlice, tmp, ctx);
    obj->setProperty("targetPlaneSlice", tmp);

    to.setObject(obj);
    return true;
}

bool nativevalue_to_se(const cc::render::MovePair &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value        tmp;

    nativevalue_to_se(from.source, tmp, ctx);
    obj->setProperty("source", tmp);

    nativevalue_to_se(from.target, tmp, ctx);
    obj->setProperty("target", tmp);

    nativevalue_to_se(from.mipLevels, tmp, ctx);
    obj->setProperty("mipLevels", tmp);

    nativevalue_to_se(from.numSlices, tmp, ctx);
    obj->setProperty("numSlices", tmp);

    nativevalue_to_se(from.targetMostDetailedMip, tmp, ctx);
    obj->setProperty("targetMostDetailedMip", tmp);

    nativevalue_to_se(from.targetFirstSlice, tmp, ctx);
    obj->setProperty("targetFirstSlice", tmp);

    nativevalue_to_se(from.targetPlaneSlice, tmp, ctx);
    obj->setProperty("targetPlaneSlice", tmp);

    to.setObject(obj);
    return true;
}

template <>
bool sevalue_to_native<cc::render::RasterView>(const se::Value &from, cc::render::RasterView *to, se::Object *ctx) { // NOLINT
    SE_PRECONDITION2(from.isObject(), false, " Convert parameter to RasterView failed !");

    auto *obj = const_cast<se::Object *>(from.toObject());
    bool ok = true;
    se::Value field;
    obj->getProperty("slotName", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->slotName), ctx);
    }
    obj->getProperty("accessType", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->accessType), ctx);
    }
    obj->getProperty("attachmentType", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->attachmentType), ctx);
    }
    obj->getProperty("loadOp", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->loadOp), ctx);
    }
    obj->getProperty("storeOp", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->storeOp), ctx);
    }
    obj->getProperty("clearFlags", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->clearFlags), ctx);
    }
    obj->getProperty("clearColor", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->clearColor), ctx);
    }
    return ok;
}

template <>
bool sevalue_to_native<cc::render::ComputeView>(const se::Value &from, cc::render::ComputeView *to, se::Object *ctx) { // NOLINT
    SE_PRECONDITION2(from.isObject(), false, " Convert parameter to ComputeView failed !");

    auto *obj = const_cast<se::Object *>(from.toObject());
    bool ok = true;
    se::Value field;
    obj->getProperty("name", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->name), ctx);
    }
    obj->getProperty("accessType", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->accessType), ctx);
    }
    obj->getProperty("clearFlags", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->clearFlags), ctx);
    }
    obj->getProperty("clearColor", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->clearColor), ctx);
    }
    obj->getProperty("clearValueType", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->clearValueType), ctx);
    }
    return ok;
}

template <>
bool sevalue_to_native<cc::render::CopyPair>(const se::Value &from, cc::render::CopyPair *to, se::Object *ctx) { // NOLINT
    SE_PRECONDITION2(from.isObject(), false, " Convert parameter to CopyPair failed !");

    auto *obj = const_cast<se::Object *>(from.toObject());
    bool ok = true;
    se::Value field;
    obj->getProperty("source", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->source), ctx);
    }
    obj->getProperty("target", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->target), ctx);
    }
    obj->getProperty("mipLevels", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mipLevels), ctx);
    }
    obj->getProperty("numSlices", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->numSlices), ctx);
    }
    obj->getProperty("sourceMostDetailedMip", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->sourceMostDetailedMip), ctx);
    }
    obj->getProperty("sourceFirstSlice", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->sourceFirstSlice), ctx);
    }
    obj->getProperty("sourcePlaneSlice", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->sourcePlaneSlice), ctx);
    }
    obj->getProperty("targetMostDetailedMip", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->targetMostDetailedMip), ctx);
    }
    obj->getProperty("targetFirstSlice", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->targetFirstSlice), ctx);
    }
    obj->getProperty("targetPlaneSlice", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->targetPlaneSlice), ctx);
    }
    return ok;
}

template <>
bool sevalue_to_native<cc::render::MovePair>(const se::Value &from, cc::render::MovePair *to, se::Object *ctx) { // NOLINT
    SE_PRECONDITION2(from.isObject(), false, " Convert parameter to MovePair failed !");

    auto *obj = const_cast<se::Object *>(from.toObject());
    bool ok = true;
    se::Value field;
    obj->getProperty("source", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->source), ctx);
    }
    obj->getProperty("target", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->target), ctx);
    }
    obj->getProperty("mipLevels", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mipLevels), ctx);
    }
    obj->getProperty("numSlices", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->numSlices), ctx);
    }
    obj->getProperty("targetMostDetailedMip", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->targetMostDetailedMip), ctx);
    }
    obj->getProperty("targetFirstSlice", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->targetFirstSlice), ctx);
    }
    obj->getProperty("targetPlaneSlice", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->targetPlaneSlice), ctx);
    }
    return ok;
}

// clang-format on
