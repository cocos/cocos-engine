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

bool sevalue_to_native(const se::Value &from, cc::render::RasterView *to, se::Object *ctx) { // NOLINT
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

bool sevalue_to_native(const se::Value &from, cc::render::ComputeView *to, se::Object *ctx) { // NOLINT
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

bool sevalue_to_native(const se::Value &from, cc::render::CopyPair *to, se::Object *ctx) { // NOLINT
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

bool sevalue_to_native(const se::Value &from, cc::render::MovePair *to, se::Object *ctx) { // NOLINT
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
