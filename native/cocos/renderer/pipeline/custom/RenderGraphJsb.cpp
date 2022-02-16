// clang-format off
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
