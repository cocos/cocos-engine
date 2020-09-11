#include "jsb_gfx_manual.h"
#include "bindings/auto/jsb_gfx_auto.h"
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "bindings/manual/jsb_global.h"

#if !(defined(CC_USE_GLES2) || defined(CC_USE_GLES3) || defined(CC_USE_VULKAN) || defined(CC_USE_METAL))
    #error "gfx backend is not defined!"
#endif

#ifdef CC_USE_VULKAN
    #include "renderer/gfx-vulkan/GFXVulkan.h"
    #include "bindings/auto/jsb_vk_auto.h"
#endif

#ifdef CC_USE_METAL
    #include "renderer/gfx-metal/GFXMTL.h"
    #include "bindings/auto/jsb_mtl_auto.h"
#endif

#ifdef CC_USE_GLES3
    #include "renderer/gfx-gles3/GFXGLES3.h"
    #include "bindings/auto/jsb_gles3_auto.h"
#endif

#ifdef CC_USE_GLES2
    #include "renderer/gfx-gles2/GFXGLES2.h"
    #include "bindings/auto/jsb_gles2_auto.h"
#endif

#include <fstream>
#include <sstream>

#define GFX_MAX_VERTEX_ATTRIBUTES 16
#define GFX_MAX_TEXTURE_UNITS     16
#define GFX_MAX_ATTACHMENTS       4
#define GFX_MAX_BUFFER_BINDINGS   24
#define GFX_INVALID_BINDING       ((uint8_t)-1)
#define GFX_INVALID_HANDLE        ((uint)-1)

se::Object *__jsb_cc_gfx_BindingMappingInfo_proto = nullptr;
se::Class *__jsb_cc_gfx_BindingMappingInfo_class = nullptr;

SE_DECLARE_FINALIZE_FUNC(js_cc_gfx_BindingMappingInfo_finalize)

static bool js_gfx_BindingMappingInfo_constructor(se::State &s) {
    CC_UNUSED bool ok = true;
    const auto &args = s.args();
    size_t argc = args.size();

    if (argc == 0) {
        cc::gfx::BindingMappingInfo *cobj = JSB_ALLOC(cc::gfx::BindingMappingInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    } else if (argc == 1 && args[0].isObject()) {

        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::BindingMappingInfo *cobj = JSB_ALLOC(cc::gfx::BindingMappingInfo);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);

        json->getProperty("bufferOffsets", &field);
        if (!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &cobj->bufferOffsets);
        }

        json->getProperty("samplerOffsets", &field);
        if (!field.isUndefined()) {
            ok &= seval_to_std_vector(field, &cobj->samplerOffsets);
        }

        json->getProperty("flexibleSet", &field);
        if (!field.isUndefined()) {
            ok &= seval_to_uint32(field, &cobj->flexibleSet);
        }

        if (!ok) {
            JSB_FREE(cobj);
            SE_REPORT_ERROR("Argument convertion error");
            return false;
        }

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_BindingMappingInfo_constructor, __jsb_cc_gfx_BindingMappingInfo_class, js_cc_gfx_BindingMappingInfo_finalize)

static bool js_cc_gfx_BindingMappingInfo_finalize(se::State &s) {
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end()) {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::BindingMappingInfo *cobj = (cc::gfx::BindingMappingInfo *)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cc_gfx_BindingMappingInfo_finalize)

bool js_register_gfx_BindingMappingInfo(se::Object *obj) {
    auto cls = se::Class::create("BindingMappingInfo", obj, nullptr, _SE(js_gfx_BindingMappingInfo_constructor));

    cls->defineFinalizeFunction(_SE(js_cc_gfx_BindingMappingInfo_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::BindingMappingInfo>(cls);

    __jsb_cc_gfx_BindingMappingInfo_proto = cls->getProto();
    __jsb_cc_gfx_BindingMappingInfo_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool js_gfx_Device_copyBuffersToTexture(se::State &s) {
    cc::gfx::Device *cobj = (cc::gfx::Device *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_copyBuffersToTexture : Invalid Native Object");

    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cc::gfx::BufferDataList arg0;
        cc::gfx::Texture *arg1 = nullptr;
        cc::gfx::BufferTextureCopyList arg2;
        if (args[0].isObject()) {
            se::Object *dataObj = args[0].toObject();
            SE_PRECONDITION2(dataObj->isArray(), false, "Buffers must be an array!");
            uint32_t length = 0;
            dataObj->getArrayLength(&length);
            arg0.resize(length);

            se::Value value;
            for (uint32_t i = 0; i < length; ++i) {
                if (dataObj->getArrayElement(i, &value)) {
                    uint8_t *ptr = nullptr;
                    CC_UNUSED size_t dataLength = 0;
                    se::Object *obj = value.toObject();
                    if (obj->isArrayBuffer()) {
                        ok = obj->getArrayBufferData(&ptr, &dataLength);
                        SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
                    } else if (obj->isTypedArray()) {
                        ok = obj->getTypedArrayData(&ptr, &dataLength);
                        SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
                    } else {
                        assert(false);
                    }
                    arg0[i] = ptr;
                }
            }
        }
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_std_vector(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_copyBuffersToTexture : Error processing arguments");
        cobj->copyBuffersToTexture(arg0, arg1, arg2);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_copyBuffersToTexture)

bool js_gfx_Device_copyTexImagesToTexture(se::State &s) {
    cc::gfx::Device *cobj = (cc::gfx::Device *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_copyBuffersToTexture : Invalid Native Object");

    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cc::gfx::BufferDataList arg0;
        cc::gfx::Texture *arg1 = nullptr;
        cc::gfx::BufferTextureCopyList arg2;
        if (args[0].isObject()) {
            se::Object *dataObj = args[0].toObject();
            SE_PRECONDITION2(dataObj->isArray(), false, "Buffers must be an array!");
            uint32_t length = 0;
            dataObj->getArrayLength(&length);
            arg0.resize(length);

            se::Value value;
            for (uint32_t i = 0; i < length; ++i) {
                if (dataObj->getArrayElement(i, &value)) {
                    CC_UNUSED size_t dataLength = 0;
                    cc::Data bufferData;
                    ok &= seval_to_Data(value, &bufferData);
                    arg0[i] = bufferData.takeBuffer();
                }
            }
        } else {
            ok &= false;
        }
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_std_vector(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_Device_copyBuffersToTexture : Error processing arguments");
        cobj->copyBuffersToTexture(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_copyTexImagesToTexture)

static bool js_gfx_Device_createBuffer(se::State &s) {
    cc::gfx::Device *cobj = (cc::gfx::Device *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createBuffer : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();

    if (argc == 2) {
        cc::gfx::Buffer *buffer = nullptr;

        bool createBufferView = false;
        seval_to_boolean(args[1], &createBufferView);

        if (createBufferView) {
            auto bufferViewInfo = (cc::gfx::BufferViewInfo *)(args[0].toObject()->getPrivateData());
            buffer = cobj->createBuffer(*bufferViewInfo);
        } else {
            auto bufferInfo = (cc::gfx::BufferInfo *)(args[0].toObject()->getPrivateData());
            buffer = cobj->createBuffer(*bufferInfo);
        }

        CC_UNUSED bool ok = native_ptr_to_seval(buffer, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createBuffer : Error processing arguments");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createBuffer)

static bool js_gfx_Device_createTexture(se::State &s) {
    cc::gfx::Device *cobj = (cc::gfx::Device *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Device_createTexture : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();

    if (argc == 2) {
        cc::gfx::Texture *texture = nullptr;

        bool createTextureView = false;
        seval_to_boolean(args[1], &createTextureView);

        if (createTextureView) {
            auto textureViewInfo = (cc::gfx::TextureViewInfo *)(args[0].toObject()->getPrivateData());
            texture = cobj->createTexture(*textureViewInfo);
        } else {
            auto textureInfo = (cc::gfx::TextureInfo *)(args[0].toObject()->getPrivateData());
            texture = cobj->createTexture(*textureInfo);
        }

        CC_UNUSED bool ok = native_ptr_to_seval(texture, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Device_createTexture : Error processing arguments");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createTexture)

static bool js_gfx_Buffer_initialize(se::State &s) {
    CC_UNUSED bool ok = true;
    cc::gfx::Buffer *cobj = (cc::gfx::Buffer *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Buffer_initialize : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();

    if (argc == 2) {
        bool initWithBufferViewInfo = false;
        seval_to_boolean(args[1], &initWithBufferViewInfo);

        if (initWithBufferViewInfo) {
            auto bufferViewInfo = (cc::gfx::BufferViewInfo *)(args[0].toObject()->getPrivateData());
            ok &= cobj->initialize(*bufferViewInfo);
        } else {
            auto bufferInfo = (cc::gfx::BufferInfo *)(args[0].toObject()->getPrivateData());
            ok &= cobj->initialize(*bufferInfo);
        }

        ok &= boolean_to_seval(ok, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Buffer_initialize : Error processing arguments");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Buffer_initialize)

static bool js_gfx_Texture_initialize(se::State &s) {
    CC_UNUSED bool ok = true;
    cc::gfx::Texture *cobj = (cc::gfx::Texture *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_Texture_initialize : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();

    if (argc == 2) {
        bool initWithTextureViewInfo = false;
        seval_to_boolean(args[1], &initWithTextureViewInfo);

        if (initWithTextureViewInfo) {
            auto textureViewInfo = (cc::gfx::TextureViewInfo *)(args[0].toObject()->getPrivateData());
            ok &= cobj->initialize(*textureViewInfo);
        } else {
            auto textureInfo = (cc::gfx::TextureInfo *)(args[0].toObject()->getPrivateData());
            ok &= cobj->initialize(*textureInfo);
        }

        ok &= boolean_to_seval(ok, &s.rval());
        SE_PRECONDITION2(ok, false, "js_gfx_Texture_initialize : Error processing arguments");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Texture_initialize)

static bool js_gfx_GFXBuffer_update(se::State &s) {
    cc::gfx::Buffer *cobj = (cc::gfx::Buffer *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBuffer_update : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;

    uint8_t *arg0 = nullptr;
    CC_UNUSED size_t dataLength = 0;
    se::Object *obj = args[0].toObject();
    if (obj->isArrayBuffer()) {
        ok = obj->getArrayBufferData(&arg0, &dataLength);
        SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
    } else if (obj->isTypedArray()) {
        ok = obj->getTypedArrayData(&arg0, &dataLength);
        SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
    } else {
        ok = false;
    }

    if (argc == 1) {
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_update : Error processing arguments");
        cobj->update(arg0, 0, static_cast<uint>(dataLength));
        return true;
    }
    if (argc == 2) {
        unsigned int arg1 = 0;
        ok &= seval_to_uint32(args[1], (uint32_t *)&arg1);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_update : Error processing arguments");
        cobj->update(arg0, arg1, static_cast<uint>(dataLength));
        return true;
    }
    if (argc == 3) {
        unsigned int arg1 = 0;
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[1], (uint32_t *)&arg1);
        ok &= seval_to_uint32(args[2], (uint32_t *)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_GFXBuffer_update : Error processing arguments");
        cobj->update(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_update)

se::Object *__jsb_cocos2d_SubPass_proto = nullptr;
se::Class *__jsb_cocos2d_SubPass_class = nullptr;

static bool js_gfx_SubPass_get_bind_point(se::State &s) {
    cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPass_get_bind_point : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= int32_to_seval((int)cobj->bindPoint, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubPass_get_bind_point)

static bool js_gfx_SubPass_set_bind_point(se::State &s) {
    const auto &args = s.args();
    cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPass_set_bind_point : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::PipelineBindPoint arg0 = cc::gfx::PipelineBindPoint::GRAPHICS;
    do {
        int32_t tmp = 0;
        ok &= seval_to_int32(args[0], &tmp);
        arg0 = (cc::gfx::PipelineBindPoint)tmp;
    } while (false);
    SE_PRECONDITION2(ok, false, "js_gfx_SubPass_set_bind_point : Error processing new value");
    cobj->bindPoint = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubPass_set_bind_point)

static bool js_gfx_SubPass_get_inputs(se::State &s) {
    cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPass_get_inputs : Invalid Native Object");

    se::Value jsret;
    se::HandleObject obj(se::Object::createArrayObject(GFX_MAX_ATTACHMENTS));
    for (uint8_t i = 0; i < GFX_MAX_ATTACHMENTS; ++i) {
        obj->setArrayElement(i, se::Value(cobj->inputs[i]));
    }
    jsret.setObject(obj);
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubPass_get_inputs)

static bool js_gfx_SubPass_set_inputs(se::State &s) {
    const auto &args = s.args();
    cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPass_set_inputs : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= seval_to_Uint8Array(args[0], cobj->inputs);
    SE_PRECONDITION2(ok, false, "js_gfx_SubPass_set_inputs : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubPass_set_inputs)

static bool js_gfx_SubPass_get_colors(se::State &s) {
    cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPass_get_colors : Invalid Native Object");

    se::Value jsret;
    se::HandleObject obj(se::Object::createArrayObject(GFX_MAX_ATTACHMENTS));
    for (uint8_t i = 0; i < GFX_MAX_ATTACHMENTS; ++i) {
        obj->setArrayElement(i, se::Value(cobj->colors[i]));
    }
    jsret.setObject(obj);
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubPass_get_colors)

static bool js_gfx_SubPass_set_colors(se::State &s) {
    const auto &args = s.args();
    cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPass_set_colors : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= seval_to_Uint8Array(args[0], cobj->colors);
    SE_PRECONDITION2(ok, false, "js_gfx_SubPass_set_colors : Error processing new value");
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubPass_set_colors)

static bool js_gfx_SubPass_get_resolves(se::State &s) {
    cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPass_get_resolves : Invalid Native Object");

    se::Value jsret;
    se::HandleObject obj(se::Object::createArrayObject(GFX_MAX_ATTACHMENTS));
    for (uint8_t i = 0; i < GFX_MAX_ATTACHMENTS; ++i) {
        obj->setArrayElement(i, se::Value(cobj->resolves[i]));
    }
    jsret.setObject(obj);
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubPass_get_resolves)

static bool js_gfx_SubPass_set_resolves(se::State &s) {
    const auto &args = s.args();
    cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPass_set_resolves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= seval_to_Uint8Array(args[0], cobj->resolves);
    SE_PRECONDITION2(ok, false, "js_gfx_SubPass_set_resolves : Error processing new value");

    return true;
}
SE_BIND_PROP_SET(js_gfx_SubPass_set_resolves)

static bool js_gfx_SubPass_get_depth_stencil(se::State &s) {
    cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPass_get_depth_stencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value jsret;
    ok &= uint8_to_seval((unsigned char)cobj->depthStencil, &jsret);
    s.rval() = jsret;
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubPass_get_depth_stencil)

static bool js_gfx_SubPass_set_depth_stencil(se::State &s) {
    const auto &args = s.args();
    cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPass_set_depth_stencil : Invalid Native Object");

    CC_UNUSED bool ok = true;
    uint8_t arg0;
    ok &= seval_to_uint8(args[0], (uint8_t *)&arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_SubPass_set_depth_stencil : Error processing new value");
    cobj->depthStencil = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_SubPass_set_depth_stencil)

static bool js_gfx_SubPass_get_preserves(se::State &s) {
    cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPass_get_preserves : Invalid Native Object");

    se::Value jsret;
    se::HandleObject obj(se::Object::createArrayObject(GFX_MAX_ATTACHMENTS));
    for (uint8_t i = 0; i < GFX_MAX_ATTACHMENTS; ++i) {
        obj->setArrayElement(i, se::Value(cobj->preserves[i]));
    }
    jsret.setObject(obj);
    return true;
}
SE_BIND_PROP_GET(js_gfx_SubPass_get_preserves)

static bool js_gfx_SubPass_set_preserves(se::State &s) {
    const auto &args = s.args();
    cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_SubPass_set_preserves : Invalid Native Object");

    CC_UNUSED bool ok = true;
    ok &= seval_to_Uint8Array(args[0], cobj->preserves);
    SE_PRECONDITION2(ok, false, "js_gfx_SubPass_set_preserves : Error processing new value");

    return true;
}
SE_BIND_PROP_SET(js_gfx_SubPass_set_preserves)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_SubPass_finalize)

static bool js_gfx_SubPass_constructor(se::State &s) {
    CC_UNUSED bool ok = true;
    const auto &args = s.args();
    size_t argc = args.size();

    if (argc == 0) {
        cc::gfx::SubPass *cobj = JSB_ALLOC(cc::gfx::SubPass);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
        return true;
    } else if (argc == 1 && args[0].isObject()) {
        se::Object *json = args[0].toObject();
        se::Value field;

        cc::gfx::SubPass *cobj = JSB_ALLOC(cc::gfx::SubPass);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);

        cc::gfx::PipelineBindPoint arg0 = cc::gfx::PipelineBindPoint::GRAPHICS;
        json->getProperty("bind_point", &field);
        if (field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".bind_point\" is undefined!");
            return false;
        }
        do {
            int32_t tmp = 0;
            ok &= seval_to_int32(field, &tmp);
            arg0 = (cc::gfx::PipelineBindPoint)tmp;
        } while (false);
        cobj->bindPoint = arg0;

        json->getProperty("inputs", &field);
        if (field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".inputs\" is undefined!");
            return false;
        }
        ok &= seval_to_Uint8Array(field, cobj->inputs);
        SE_PRECONDITION2(ok, false, "js_gfx_SubPass_constructor : Error processing inputs value");

        json->getProperty("colors", &field);
        if (field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".colors\" is undefined!");
            return false;
        }
        ok &= seval_to_Uint8Array(field, cobj->colors);
        SE_PRECONDITION2(ok, false, "js_gfx_SubPass_constructor : Error processing colors value");

        json->getProperty("resolves", &field);
        if (field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".resolves\" is undefined!");
            return false;
        }
        ok &= seval_to_Uint8Array(field, cobj->resolves);
        SE_PRECONDITION2(ok, false, "js_gfx_SubPass_constructor : Error processing resolves value");

        json->getProperty("depth_stencil", &field);
        if (field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".depth_stencil\" is undefined!");
            return false;
        }
        ok &= seval_to_uint8(field, (uint8_t *)&cobj->depthStencil);
        SE_PRECONDITION2(ok, false, "js_gfx_SubPass_constructor : Error processing depth_stencil value");

        json->getProperty("preserves", &field);
        if (field.isUndefined()) {
            SE_REPORT_ERROR("argument Field \".preserves\" is undefined!");
            return false;
        }
        ok &= seval_to_Uint8Array(field, cobj->preserves);
        SE_PRECONDITION2(ok, false, "js_gfx_SubPass_constructor : Error processing preserves value");

        return true;
    } else if (argc == 6) {
        cc::gfx::SubPass *cobj = JSB_ALLOC(cc::gfx::SubPass);
        s.thisObject()->setPrivateData(cobj);
        se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);

        cc::gfx::PipelineBindPoint arg0 = cc::gfx::PipelineBindPoint::GRAPHICS;
        do {
            int32_t tmp = 0;
            ok &= seval_to_int32(args[0], &tmp);
            arg0 = (cc::gfx::PipelineBindPoint)tmp;
        } while (false);
        cobj->bindPoint = arg0;

        ok &= seval_to_Uint8Array(args[1], (uint8_t *)&cobj->inputs);
        SE_PRECONDITION2(ok, false, "js_gfx_SubPass_constructor : Error processing inputs value");

        ok &= seval_to_Uint8Array(args[2], (uint8_t *)&cobj->colors);
        SE_PRECONDITION2(ok, false, "js_gfx_SubPass_constructor : Error processing colors value");

        ok &= seval_to_Uint8Array(args[3], (uint8_t *)&cobj->resolves);
        SE_PRECONDITION2(ok, false, "js_gfx_SubPass_constructor : Error processing resolves value");

        ok &= seval_to_uint8(args[4], (uint8_t *)&cobj->depthStencil);
        SE_PRECONDITION2(ok, false, "js_gfx_SubPass_constructor : Error processing depth_stencil value");

        ok &= seval_to_Uint8Array(args[5], (uint8_t *)&cobj->preserves);
        SE_PRECONDITION2(ok, false, "js_gfx_SubPass_constructor : Error processing preserves value");

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_CTOR(js_gfx_SubPass_constructor, __jsb_cocos2d_SubPass_class, js_cocos2d_SubPass_finalize)

static bool js_cocos2d_SubPass_finalize(se::State &s) {
    CC_LOG_INFO("jsbindings: finalizing JS object %p (cc::SubPass)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end()) {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        cc::gfx::SubPass *cobj = (cc::gfx::SubPass *)s.nativeThisObject();
        JSB_FREE(cobj);
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_SubPass_finalize)

bool js_register_gfx_SubPass(se::Object *obj) {
    auto cls = se::Class::create("SubPass", obj, nullptr, _SE(js_gfx_SubPass_constructor));

    cls->defineProperty("bindPoint", _SE(js_gfx_SubPass_get_bind_point), _SE(js_gfx_SubPass_set_bind_point));
    cls->defineProperty("inputs", _SE(js_gfx_SubPass_get_inputs), _SE(js_gfx_SubPass_set_inputs));
    cls->defineProperty("colors", _SE(js_gfx_SubPass_get_colors), _SE(js_gfx_SubPass_set_colors));
    cls->defineProperty("resolves", _SE(js_gfx_SubPass_get_resolves), _SE(js_gfx_SubPass_set_resolves));
    cls->defineProperty("depthStencil", _SE(js_gfx_SubPass_get_depth_stencil), _SE(js_gfx_SubPass_set_depth_stencil));
    cls->defineProperty("preserves", _SE(js_gfx_SubPass_get_preserves), _SE(js_gfx_SubPass_set_preserves));
    cls->defineFinalizeFunction(_SE(js_cocos2d_SubPass_finalize));
    cls->install();
    JSBClassType::registerClass<cc::gfx::SubPass>(cls);

    __jsb_cocos2d_SubPass_proto = cls->getProto();
    __jsb_cocos2d_SubPass_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

static bool js_gfx_BlendState_get_targets(se::State &s) {
    cc::gfx::BlendState *cobj = (cc::gfx::BlendState *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_get_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    se::Value *jsTargets = &s.rval();

    cc::gfx::BlendTargetList &targets = cobj->targets;
    se::HandleObject arr(se::Object::createArrayObject(targets.size()));
    jsTargets->setObject(arr);

    uint32_t i = 0;
    for (const auto &target : targets) {
        se::Value out = se::Value::Null;
        native_ptr_to_seval(target, &out);
        arr->setArrayElement(i, out);

        ++i;
    }
    return true;
}
SE_BIND_PROP_GET(js_gfx_BlendState_get_targets)

static bool js_gfx_BlendState_set_targets(se::State &s) {
    const auto &args = s.args();
    cc::gfx::BlendState *cobj = (cc::gfx::BlendState *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_GFXBlendState_set_targets : Invalid Native Object");

    CC_UNUSED bool ok = true;
    cc::gfx::BlendTargetList arg0;
    ok &= seval_to_std_vector(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_gfx_GFXBlendState_set_targets : Error processing new value");
    cobj->targets = arg0;
    return true;
}
SE_BIND_PROP_SET(js_gfx_BlendState_set_targets)

static bool js_gfx_CommandBuffer_execute(se::State &s) {
    cc::gfx::CommandBuffer *cobj = (cc::gfx::CommandBuffer *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_execute : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cc::gfx::CommandBufferList cmdBufs;
        unsigned int count = 0;
        ok &= seval_to_uint32(args[1], (uint32_t *)&count);

        se::Object *jsarr = args[0].toObject();
        assert(jsarr->isArray());
        uint32_t len = 0;
        ok &= jsarr->getArrayLength(&len);
        if (len < count) {
            ok = false;
        }
        if (ok) {
            cmdBufs.resize(count);

            se::Value tmp;
            for (uint32_t i = 0; i < count; ++i) {
                ok = jsarr->getArrayElement(i, &tmp);
                if (!ok || !tmp.isObject()) {
                    cmdBufs.clear();
                    break;
                }

                cc::gfx::CommandBuffer *cmdBuf = (cc::gfx::CommandBuffer *)tmp.toObject()->getPrivateData();
                cmdBufs[i] = cmdBuf;
            }
        }

        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_execute : Error processing arguments");
        cobj->execute(cmdBufs, count);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_execute)

static bool js_gfx_CommandBuffer_copyBuffersToTexture(se::State &s) {
    cc::gfx::CommandBuffer *cobj = (cc::gfx::CommandBuffer *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_copyBuffersToTexture : Invalid Native Object");

    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cc::gfx::BufferDataList arg0;
        cc::gfx::Texture *arg1 = nullptr;
        cc::gfx::BufferTextureCopyList arg2;
        if (args[0].isObject()) {
            se::Object *dataObj = args[0].toObject();
            SE_PRECONDITION2(dataObj->isArray(), false, "Buffers must be an array!");
            uint32_t length = 0;
            dataObj->getArrayLength(&length);
            arg0.resize(length);

            se::Value value;
            for (uint32_t i = 0; i < length; ++i) {
                if (dataObj->getArrayElement(i, &value)) {
                    uint8_t *ptr = nullptr;
                    CC_UNUSED size_t dataLength = 0;
                    se::Object *obj = value.toObject();
                    if (obj->isArrayBuffer()) {
                        ok = obj->getArrayBufferData(&ptr, &dataLength);
                        SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
                    } else if (obj->isTypedArray()) {
                        ok = obj->getTypedArrayData(&ptr, &dataLength);
                        SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
                    } else {
                        assert(false);
                    }
                    arg0[i] = ptr;
                }
            }
        }
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_std_vector(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_copyBuffersToTexture : Error processing arguments");
        cobj->copyBuffersToTexture(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_copyBuffersToTexture)

static bool js_gfx_InputAssembler_extractDrawInfo(se::State &s) {
    cc::gfx::InputAssembler *cobj = (cc::gfx::InputAssembler *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_InputAssembler_extractDrawInfo : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    if (argc == 1) {
        cc::gfx::DrawInfo nativeDrawInfo;
        cobj->extractDrawInfo(nativeDrawInfo);

        se::Object *drawInfo = args[0].toObject();
        se::Value attrValue(nativeDrawInfo.vertexCount);
        drawInfo->setProperty("vertexCount", attrValue);

        attrValue.setUint32(nativeDrawInfo.firstVertex);
        drawInfo->setProperty("firstVertex", attrValue);

        attrValue.setUint32(nativeDrawInfo.indexCount);
        drawInfo->setProperty("indexCount", attrValue);

        attrValue.setUint32(nativeDrawInfo.firstIndex);
        drawInfo->setProperty("firstIndex", attrValue);

        attrValue.setUint32(nativeDrawInfo.vertexOffset);
        drawInfo->setProperty("vertexOffset", attrValue);

        attrValue.setUint32(nativeDrawInfo.instanceCount);
        drawInfo->setProperty("instanceCount", attrValue);

        attrValue.setUint32(nativeDrawInfo.firstInstance);
        drawInfo->setProperty("firstInstance", attrValue);

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_gfx_InputAssembler_extractDrawInfo)

bool register_all_gfx_manual(se::Object *obj) {
    __jsb_cc_gfx_Device_proto->defineFunction("copyBuffersToTexture", _SE(js_gfx_Device_copyBuffersToTexture));
    __jsb_cc_gfx_Device_proto->defineFunction("copyTexImagesToTexture", _SE(js_gfx_Device_copyTexImagesToTexture));

    __jsb_cc_gfx_Device_proto->defineFunction("createBuffer", _SE(js_gfx_Device_createBuffer));
    __jsb_cc_gfx_Device_proto->defineFunction("createTexture", _SE(js_gfx_Device_createTexture));

    __jsb_cc_gfx_Buffer_proto->defineFunction("update", _SE(js_gfx_GFXBuffer_update));

    __jsb_cc_gfx_BlendState_proto->defineProperty("targets", _SE(js_gfx_BlendState_get_targets), _SE(js_gfx_BlendState_set_targets));

    __jsb_cc_gfx_CommandBuffer_proto->defineFunction("execute", _SE(js_gfx_CommandBuffer_execute));
    __jsb_cc_gfx_CommandBuffer_proto->defineFunction("copyBuffersToTexture", _SE(js_gfx_CommandBuffer_copyBuffersToTexture));

    __jsb_cc_gfx_InputAssembler_proto->defineFunction("extractDrawInfo", _SE(js_gfx_InputAssembler_extractDrawInfo));

    __jsb_cc_gfx_Buffer_proto->defineFunction("initialize", _SE(js_gfx_Buffer_initialize));
    __jsb_cc_gfx_Texture_proto->defineFunction("initialize", _SE(js_gfx_Texture_initialize));

    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("gfx", &nsVal)) {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("gfx", nsVal);
    }
    se::Object *ns = nsVal.toObject();

    js_register_gfx_BindingMappingInfo(ns);
    js_register_gfx_SubPass(ns);

#ifdef CC_USE_VULKAN
    register_all_vk(obj);
#endif
#ifdef CC_USE_GLES3
    register_all_gles3(obj);
#endif
#ifdef CC_USE_GLES2
    register_all_gles2(obj);
#endif
#ifdef CC_USE_METAL
    register_all_mtl(obj);
#endif

    return true;
}
