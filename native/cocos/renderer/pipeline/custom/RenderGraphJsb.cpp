// clang-format off
#include "cocos/bindings/auto/jsb_gfx_auto.h"
#include "cocos/renderer/pipeline/custom/JsbConversion.h"
#include "cocos/renderer/pipeline/custom/RenderGraphJsb.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"

bool nativevalue_to_se(const cc::render::RasterView &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value        tmp;

    nativevalue_to_se(from.mSlotName, tmp, ctx);
    obj->setProperty("slotName", tmp);

    nativevalue_to_se(from.mAccessType, tmp, ctx);
    obj->setProperty("accessType", tmp);

    nativevalue_to_se(from.mAttachmentType, tmp, ctx);
    obj->setProperty("attachmentType", tmp);

    nativevalue_to_se(from.mLoadOp, tmp, ctx);
    obj->setProperty("loadOp", tmp);

    nativevalue_to_se(from.mStoreOp, tmp, ctx);
    obj->setProperty("storeOp", tmp);

    nativevalue_to_se(from.mClearFlags, tmp, ctx);
    obj->setProperty("clearFlags", tmp);

    nativevalue_to_se(from.mClearColor, tmp, ctx);
    obj->setProperty("clearColor", tmp);

    to.setObject(obj);
    return true;
}

bool nativevalue_to_se(const cc::render::ComputeView &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value        tmp;

    nativevalue_to_se(from.mName, tmp, ctx);
    obj->setProperty("name", tmp);

    nativevalue_to_se(from.mAccessType, tmp, ctx);
    obj->setProperty("accessType", tmp);

    nativevalue_to_se(from.mClearFlags, tmp, ctx);
    obj->setProperty("clearFlags", tmp);

    nativevalue_to_se(from.mClearColor, tmp, ctx);
    obj->setProperty("clearColor", tmp);

    nativevalue_to_se(from.mClearValueType, tmp, ctx);
    obj->setProperty("clearValueType", tmp);

    to.setObject(obj);
    return true;
}

bool nativevalue_to_se(const cc::render::CopyPair &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value        tmp;

    nativevalue_to_se(from.mSource, tmp, ctx);
    obj->setProperty("source", tmp);

    nativevalue_to_se(from.mTarget, tmp, ctx);
    obj->setProperty("target", tmp);

    nativevalue_to_se(from.mMipLevels, tmp, ctx);
    obj->setProperty("mipLevels", tmp);

    nativevalue_to_se(from.mNumSlices, tmp, ctx);
    obj->setProperty("numSlices", tmp);

    nativevalue_to_se(from.mSourceMostDetailedMip, tmp, ctx);
    obj->setProperty("sourceMostDetailedMip", tmp);

    nativevalue_to_se(from.mSourceFirstSlice, tmp, ctx);
    obj->setProperty("sourceFirstSlice", tmp);

    nativevalue_to_se(from.mSourcePlaneSlice, tmp, ctx);
    obj->setProperty("sourcePlaneSlice", tmp);

    nativevalue_to_se(from.mTargetMostDetailedMip, tmp, ctx);
    obj->setProperty("targetMostDetailedMip", tmp);

    nativevalue_to_se(from.mTargetFirstSlice, tmp, ctx);
    obj->setProperty("targetFirstSlice", tmp);

    nativevalue_to_se(from.mTargetPlaneSlice, tmp, ctx);
    obj->setProperty("targetPlaneSlice", tmp);

    to.setObject(obj);
    return true;
}

bool nativevalue_to_se(const cc::render::MovePair &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value        tmp;

    nativevalue_to_se(from.mSource, tmp, ctx);
    obj->setProperty("source", tmp);

    nativevalue_to_se(from.mTarget, tmp, ctx);
    obj->setProperty("target", tmp);

    nativevalue_to_se(from.mMipLevels, tmp, ctx);
    obj->setProperty("mipLevels", tmp);

    nativevalue_to_se(from.mNumSlices, tmp, ctx);
    obj->setProperty("numSlices", tmp);

    nativevalue_to_se(from.mTargetMostDetailedMip, tmp, ctx);
    obj->setProperty("targetMostDetailedMip", tmp);

    nativevalue_to_se(from.mTargetFirstSlice, tmp, ctx);
    obj->setProperty("targetFirstSlice", tmp);

    nativevalue_to_se(from.mTargetPlaneSlice, tmp, ctx);
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
        ok &= sevalue_to_native(field, &(to->mSlotName), ctx);
    }
    obj->getProperty("accessType", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mAccessType), ctx);
    }
    obj->getProperty("attachmentType", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mAttachmentType), ctx);
    }
    obj->getProperty("loadOp", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mLoadOp), ctx);
    }
    obj->getProperty("storeOp", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mStoreOp), ctx);
    }
    obj->getProperty("clearFlags", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mClearFlags), ctx);
    }
    obj->getProperty("clearColor", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mClearColor), ctx);
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
        ok &= sevalue_to_native(field, &(to->mName), ctx);
    }
    obj->getProperty("accessType", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mAccessType), ctx);
    }
    obj->getProperty("clearFlags", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mClearFlags), ctx);
    }
    obj->getProperty("clearColor", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mClearColor), ctx);
    }
    obj->getProperty("clearValueType", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mClearValueType), ctx);
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
        ok &= sevalue_to_native(field, &(to->mSource), ctx);
    }
    obj->getProperty("target", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mTarget), ctx);
    }
    obj->getProperty("mipLevels", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mMipLevels), ctx);
    }
    obj->getProperty("numSlices", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mNumSlices), ctx);
    }
    obj->getProperty("sourceMostDetailedMip", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mSourceMostDetailedMip), ctx);
    }
    obj->getProperty("sourceFirstSlice", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mSourceFirstSlice), ctx);
    }
    obj->getProperty("sourcePlaneSlice", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mSourcePlaneSlice), ctx);
    }
    obj->getProperty("targetMostDetailedMip", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mTargetMostDetailedMip), ctx);
    }
    obj->getProperty("targetFirstSlice", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mTargetFirstSlice), ctx);
    }
    obj->getProperty("targetPlaneSlice", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mTargetPlaneSlice), ctx);
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
        ok &= sevalue_to_native(field, &(to->mSource), ctx);
    }
    obj->getProperty("target", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mTarget), ctx);
    }
    obj->getProperty("mipLevels", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mMipLevels), ctx);
    }
    obj->getProperty("numSlices", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mNumSlices), ctx);
    }
    obj->getProperty("targetMostDetailedMip", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mTargetMostDetailedMip), ctx);
    }
    obj->getProperty("targetFirstSlice", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mTargetFirstSlice), ctx);
    }
    obj->getProperty("targetPlaneSlice", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->mTargetPlaneSlice), ctx);
    }
    return ok;
}
