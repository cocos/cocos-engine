/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "bindings/auto/jsb_assets_auto.h"
#include "core/assets/Material.h"
#include "core/assets/SimpleTexture.h"
#include "core/assets/TextureBase.h"
#include "core/data/JSBNativeDataHolder.h"
#include "jsb_scene_manual.h"

#ifndef JSB_ALLOC
    #define JSB_ALLOC(kls, ...) new (std::nothrow) kls(__VA_ARGS__)
#endif

#ifndef JSB_FREE
    #define JSB_FREE(ptr) delete ptr
#endif

static bool js_assets_ImageAsset_setData(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::ImageAsset>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    if (argc == 1) {
        uint8_t *data{nullptr};
        if (args[0].isObject()) {
            if (args[0].toObject()->isTypedArray()) {
                args[0].toObject()->getTypedArrayData(&data, nullptr);
            } else if (args[0].toObject()->isArrayBuffer()) {
                args[0].toObject()->getArrayBufferData(&data, nullptr);
            } else {
                auto *dataHolder = static_cast<cc::JSBNativeDataHolder *>(args[0].toObject()->getPrivateData());
                CC_ASSERT_NOT_NULL(dataHolder);
                data = dataHolder->getData();
            }
        } else {
            CC_ABORTF("setData with '%s'", args[0].toStringForce().c_str());
        }
        cobj->setData(data);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_assets_ImageAsset_setData) // NOLINT(readability-identifier-naming)

static bool js_assets_SimpleTexture_registerListeners(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::SimpleTexture>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    auto *thisObj = s.thisObject();

    cobj->on<cc::SimpleTexture::TextureUpdated>([thisObj](cc::SimpleTexture * /*emitter*/, cc::gfx::Texture *texture) {
        se::AutoHandleScope hs;
        se::Value arg0;
        nativevalue_to_se(texture, arg0, nullptr);
        se::ScriptEngine::getInstance()->callFunction(thisObj, "_onGFXTextureUpdated", 1, &arg0);
    });

    cobj->on<cc::SimpleTexture::AfterAssignImage>([thisObj](cc::SimpleTexture * /*emitter*/, cc::ImageAsset *image) {
        se::AutoHandleScope hs;
        se::Value arg0;
        nativevalue_to_se(image, arg0, nullptr);
        se::ScriptEngine::getInstance()->callFunction(thisObj, "_onAfterAssignImage", 1, &arg0);
    });

    return true;
}
SE_BIND_FUNC(js_assets_SimpleTexture_registerListeners) // NOLINT(readability-identifier-naming)

static bool js_assets_TextureBase_registerGFXSamplerUpdatedListener(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::TextureBase>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    auto *thisObj = s.thisObject();
    cobj->on<cc::TextureBase::SamplerUpdated>([thisObj](cc::TextureBase * /*emitter*/, cc::gfx::Sampler *sampler) {
        se::AutoHandleScope hs;
        se::Value arg0;
        nativevalue_to_se(sampler, arg0, nullptr);
        se::ScriptEngine::getInstance()->callFunction(thisObj, "_onGFXSamplerUpdated", 1, &arg0);
    });

    return true;
}
SE_BIND_FUNC(js_assets_TextureBase_registerGFXSamplerUpdatedListener) // NOLINT(readability-identifier-naming)

static bool js_assets_Material_registerPassesUpdatedListener(se::State &s) // NOLINT(readability-identifier-naming)
{
    auto *cobj = SE_THIS_OBJECT<cc::Material>(s);
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    auto *thisObj = s.thisObject();
    cobj->on<cc::Material::PassesUpdated>([thisObj](cc::Material * /*emitter*/) {
        se::AutoHandleScope hs;
        se::ScriptEngine::getInstance()->callFunction(thisObj, "_onPassesUpdated", 0, nullptr);
    });

    return true;
}
SE_BIND_FUNC(js_assets_Material_registerPassesUpdatedListener) // NOLINT(readability-identifier-naming)

bool register_all_assets_manual(se::Object *obj) // NOLINT(readability-identifier-naming)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("jsb", &nsVal)) {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("jsb", nsVal);
    }

    __jsb_cc_ImageAsset_proto->defineFunction("setData", _SE(js_assets_ImageAsset_setData));
    __jsb_cc_SimpleTexture_proto->defineFunction("_registerListeners", _SE(js_assets_SimpleTexture_registerListeners));
    __jsb_cc_TextureBase_proto->defineFunction("_registerGFXSamplerUpdatedListener", _SE(js_assets_TextureBase_registerGFXSamplerUpdatedListener));
    __jsb_cc_Material_proto->defineFunction("_registerPassesUpdatedListener", _SE(js_assets_Material_registerPassesUpdatedListener));

    return true;
}
