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
