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
#include "cocos/renderer/pipeline/custom/JsbConversion.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphJsb.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"

bool nativevalue_to_se(const cc::render::UniformBlockDB &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value        tmp;

    nativevalue_to_se(from.values, tmp, ctx);
    obj->setProperty("values", tmp);

    to.setObject(obj);
    return true;
}

bool nativevalue_to_se(const cc::render::Descriptor &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value        tmp;

    nativevalue_to_se(from.type, tmp, ctx);
    obj->setProperty("type", tmp);

    nativevalue_to_se(from.count, tmp, ctx);
    obj->setProperty("count", tmp);

    to.setObject(obj);
    return true;
}

bool nativevalue_to_se(const cc::render::DescriptorBlock &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value        tmp;

    nativevalue_to_se(from.descriptors, tmp, ctx);
    obj->setProperty("descriptors", tmp);

    nativevalue_to_se(from.uniformBlocks, tmp, ctx);
    obj->setProperty("uniformBlocks", tmp);

    nativevalue_to_se(from.capacity, tmp, ctx);
    obj->setProperty("capacity", tmp);

    nativevalue_to_se(from.count, tmp, ctx);
    obj->setProperty("count", tmp);

    to.setObject(obj);
    return true;
}

bool nativevalue_to_se(const cc::render::DescriptorBlockIndex &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject obj(se::Object::createPlainObject());
    se::Value        tmp;

    nativevalue_to_se(from.updateFrequency, tmp, ctx);
    obj->setProperty("updateFrequency", tmp);

    nativevalue_to_se(from.parameterType, tmp, ctx);
    obj->setProperty("parameterType", tmp);

    nativevalue_to_se(from.descriptorType, tmp, ctx);
    obj->setProperty("descriptorType", tmp);

    nativevalue_to_se(from.visibility, tmp, ctx);
    obj->setProperty("visibility", tmp);

    to.setObject(obj);
    return true;
}

template <>
bool sevalue_to_native<cc::render::UniformBlockDB>(const se::Value &from, cc::render::UniformBlockDB *to, se::Object *ctx) { // NOLINT
    SE_PRECONDITION2(from.isObject(), false, " Convert parameter to UniformBlockDB failed !");

    auto *obj = const_cast<se::Object *>(from.toObject());
    bool ok = true;
    se::Value field;
    obj->getProperty("values", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->values), ctx);
    }
    return ok;
}

template <>
bool sevalue_to_native<cc::render::Descriptor>(const se::Value &from, cc::render::Descriptor *to, se::Object *ctx) { // NOLINT
    SE_PRECONDITION2(from.isObject(), false, " Convert parameter to Descriptor failed !");

    auto *obj = const_cast<se::Object *>(from.toObject());
    bool ok = true;
    se::Value field;
    obj->getProperty("type", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->type), ctx);
    }
    obj->getProperty("count", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    return ok;
}

template <>
bool sevalue_to_native<cc::render::DescriptorBlock>(const se::Value &from, cc::render::DescriptorBlock *to, se::Object *ctx) { // NOLINT
    SE_PRECONDITION2(from.isObject(), false, " Convert parameter to DescriptorBlock failed !");

    auto *obj = const_cast<se::Object *>(from.toObject());
    bool ok = true;
    se::Value field;
    obj->getProperty("descriptors", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->descriptors), ctx);
    }
    obj->getProperty("uniformBlocks", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->uniformBlocks), ctx);
    }
    obj->getProperty("capacity", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->capacity), ctx);
    }
    obj->getProperty("count", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->count), ctx);
    }
    return ok;
}

template <>
bool sevalue_to_native<cc::render::DescriptorBlockIndex>(const se::Value &from, cc::render::DescriptorBlockIndex *to, se::Object *ctx) { // NOLINT
    SE_PRECONDITION2(from.isObject(), false, " Convert parameter to DescriptorBlockIndex failed !");

    auto *obj = const_cast<se::Object *>(from.toObject());
    bool ok = true;
    se::Value field;
    obj->getProperty("updateFrequency", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->updateFrequency), ctx);
    }
    obj->getProperty("parameterType", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->parameterType), ctx);
    }
    obj->getProperty("descriptorType", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->descriptorType), ctx);
    }
    obj->getProperty("visibility", &field, true);
    if(!field.isNullOrUndefined()) {
        ok &= sevalue_to_native(field, &(to->visibility), ctx);
    }
    return ok;
}

// clang-format on
