#include "jsb_gfx_manual.h"
#include "bindings/auto/jsb_gfx_auto.h"
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "bindings/manual/jsb_global.h"

#if !(defined(CC_USE_GLES2) || defined(CC_USE_GLES3) || defined(CC_USE_VULKAN) || defined(CC_USE_METAL))
    #error "gfx backend is not defined!"
#endif

#ifdef CC_USE_VULKAN
    #include "bindings/auto/jsb_vk_auto.h"
    #include "renderer/gfx-vulkan/GFXVulkan.h"
#endif

#ifdef CC_USE_METAL
    #include "bindings/auto/jsb_mtl_auto.h"
    #include "renderer/gfx-metal/GFXMTL.h"
#endif

#ifdef CC_USE_GLES3
    #include "bindings/auto/jsb_gles3_auto.h"
    #include "renderer/gfx-gles3/GFXGLES3.h"
#endif

#ifdef CC_USE_GLES2
    #include "bindings/auto/jsb_gles2_auto.h"
    #include "renderer/gfx-gles2/GFXGLES2.h"
#endif

#include <fstream>
#include <sstream>

#define GFX_MAX_VERTEX_ATTRIBUTES 16
#define GFX_MAX_TEXTURE_UNITS     16
#define GFX_MAX_ATTACHMENTS       4
#define GFX_MAX_BUFFER_BINDINGS   24
#define GFX_INVALID_BINDING       ((uint8_t)-1)
#define GFX_INVALID_HANDLE        ((uint)-1)

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
                    if (value.isObject()) {
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
                    } else {
                        unsigned long address = 0;
                        seval_to_ulong(value, &address);
                        ptr = (uint8_t *)address;
                    }
                    
                    arg0[i] = ptr;
                }
            }
        }
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
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
                    if (value.isObject()) {
                        CC_UNUSED size_t dataLength = 0;
                        uint8_t *address = nullptr;
                        value.toObject()->getTypedArrayData(&address, &dataLength);
                        arg0[i] = address;
                    } else {
                        unsigned long dataPtr = 0;
                        seval_to_ulong(value, &dataPtr);
                        arg0[i] = (uint8_t *)dataPtr;
                    }
                }
            }
        } else {
            ok &= false;
        }
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
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
            cc::gfx::BufferViewInfo bufferViewInfo;
            sevalue_to_native(args[0], &bufferViewInfo, s.thisObject());
            buffer = cobj->createBuffer(bufferViewInfo);
        } else {
            cc::gfx::BufferInfo bufferInfo;
            sevalue_to_native(args[0], &bufferInfo, s.thisObject());
            buffer = cobj->createBuffer(bufferInfo);
        }
        se::NonRefNativePtrCreatedByCtorMap::emplace(buffer);

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
            cc::gfx::TextureInfo textureInfo;
            sevalue_to_native(args[0], &textureInfo, s.thisObject());
            texture = cobj->createTexture(textureInfo);
        }
        se::NonRefNativePtrCreatedByCtorMap::emplace(texture);

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

static bool js_gfx_CommandBuffer_updateBuffer(se::State &s) {
    cc::gfx::CommandBuffer *cobj = (cc::gfx::CommandBuffer *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_gfx_CommandBuffer_updateBuffer : Invalid Native Object");

    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;

    cc::gfx::Buffer *arg0 = nullptr;
    SE_PRECONDITION2(args[0].isObject(), false, "js_gfx_CommandBuffer_updateBuffer : Invalid Native Object");
    arg0 = (cc::gfx::Buffer *)args[0].toObject()->getPrivateData();

    uint8_t *arg1 = nullptr;
    CC_UNUSED size_t dataLength = 0;
    se::Object *obj = args[1].toObject();
    if (obj->isArrayBuffer()) {
        ok = obj->getArrayBufferData(&arg1, &dataLength);
        SE_PRECONDITION2(ok, false, "getArrayBufferData failed!");
    } else if (obj->isTypedArray()) {
        ok = obj->getTypedArrayData(&arg1, &dataLength);
        SE_PRECONDITION2(ok, false, "getTypedArrayData failed!");
    } else {
        ok = false;
    }

    if (argc == 2) {
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_updateBuffer : Error processing arguments");
        cobj->updateBuffer(arg0, arg1, static_cast<uint>(dataLength), 0);
        return true;
    }
    if (argc == 3) {
        unsigned int arg2 = 0;
        ok &= seval_to_uint32(args[2], (uint32_t *)&arg2);
        SE_PRECONDITION2(ok, false, "js_gfx_CommandBuffer_updateBuffer : Error processing arguments");
        cobj->updateBuffer(arg0, arg1, static_cast<uint>(dataLength), arg2);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_updateBuffer)

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
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_gfx_InputAssembler_extractDrawInfo)

bool register_all_gfx_manual(se::Object *obj) {
    __jsb_cc_gfx_Device_proto->defineFunction("copyBuffersToTexture", _SE(js_gfx_Device_copyBuffersToTexture));
    __jsb_cc_gfx_Device_proto->defineFunction("copyTexImagesToTexture", _SE(js_gfx_Device_copyTexImagesToTexture));

    __jsb_cc_gfx_Device_proto->defineFunction("createBuffer", _SE(js_gfx_Device_createBuffer));
    __jsb_cc_gfx_Device_proto->defineFunction("createTexture", _SE(js_gfx_Device_createTexture));

    __jsb_cc_gfx_Buffer_proto->defineFunction("update", _SE(js_gfx_GFXBuffer_update));

    __jsb_cc_gfx_CommandBuffer_proto->defineFunction("execute", _SE(js_gfx_CommandBuffer_execute));
    __jsb_cc_gfx_CommandBuffer_proto->defineFunction("updateBuffer", _SE(js_gfx_CommandBuffer_updateBuffer));
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

//    js_register_gfx_SubPass(ns);

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
