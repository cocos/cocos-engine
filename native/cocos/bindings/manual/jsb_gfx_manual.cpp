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

#include "jsb_gfx_manual.h"
#include "bindings/auto/jsb_gfx_auto.h"
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "bindings/manual/jsb_global.h"
#include "core/data/JSBNativeDataHolder.h"

#include <fstream>
#include <sstream>

bool js_gfx_Device_copyBuffersToTexture(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::gfx::Device *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

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
                            CC_ABORT();
                        }
                    } else {
                        ptr = reinterpret_cast<uint8_t *>(value.asPtr()); // NOLINT(performance-no-int-to-ptr) script engine bad API design
                    }

                    arg0[i] = ptr;
                }
            }
        }
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->copyBuffersToTexture(arg0, arg1, arg2);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_copyBuffersToTexture)

bool js_gfx_Device_copyTextureToBuffers(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::gfx::Device *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cc::gfx::Texture *arg0 = nullptr;
        ccstd::vector<uint8_t *> arg1;
        cc::gfx::BufferTextureCopyList arg2;
        if (args[1].isObject()) {
            se::Object *dataObj = args[1].toObject();
            SE_PRECONDITION2(dataObj->isArray(), false, "Buffers must be an array!");
            uint32_t length = 0;
            dataObj->getArrayLength(&length);
            arg1.resize(length);

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
                            CC_ABORT();
                        }
                    } else {
                        ptr = reinterpret_cast<uint8_t *>(value.asPtr()); // NOLINT(performance-no-int-to-ptr) script engine bad API design
                    }

                    arg1[i] = ptr;
                }
            }
        }
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->copyTextureToBuffers(arg0, arg1.data(), arg2.data(), cc::utils::toUint(arg2.size()));
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_copyTextureToBuffers)

bool js_gfx_Device_copyTexImagesToTexture(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::gfx::Device *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

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
                        uint8_t *buffer{nullptr};
                        if (value.toObject()->isTypedArray()) {
                            value.toObject()->getTypedArrayData(&buffer, &dataLength);
                        } else if (value.toObject()->isArrayBuffer()) {
                            value.toObject()->getArrayBufferData(&buffer, &dataLength);
                        } else {
                            auto *dataHolder = static_cast<cc::JSBNativeDataHolder *>(value.toObject()->getPrivateData());
                            CC_ASSERT_NOT_NULL(dataHolder);
                            buffer = dataHolder->getData();
                        }
                        arg0[i] = buffer;
                    } else {
                        CC_ABORT();
                    }
                }
            }
        } else {
            ok &= false;
        }
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= sevalue_to_native(args[2], &arg2, s.thisObject());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->copyBuffersToTexture(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_copyTexImagesToTexture)

static bool js_gfx_Device_createBuffer(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::gfx::Device *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();

    if (argc == 2) {
        cc::gfx::Buffer *buffer = nullptr;

        bool createBufferView = false;
        sevalue_to_native(args[1], &createBufferView);

        if (createBufferView) {
            cc::gfx::BufferViewInfo bufferViewInfo;
            sevalue_to_native(args[0], &bufferViewInfo, s.thisObject());
            buffer = cobj->createBuffer(bufferViewInfo);
        } else {
            cc::gfx::BufferInfo bufferInfo;
            sevalue_to_native(args[0], &bufferInfo, s.thisObject());
            buffer = cobj->createBuffer(bufferInfo);
        }
        CC_UNUSED bool ok = native_ptr_to_seval(buffer, &s.rval());
        s.rval().toObject()->getPrivateObject()->tryAllowDestroyInGC();
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createBuffer)

static bool js_gfx_Device_createTexture(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::gfx::Device *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();

    if (argc == 2) {
        cc::gfx::Texture *texture = nullptr;
        bool createTextureView = false;
        sevalue_to_native(args[1], &createTextureView);
        if (createTextureView) {
            cc::gfx::TextureViewInfo textureViewInfo;
            sevalue_to_native(args[0], &textureViewInfo, s.thisObject());
            texture = cobj->createTexture(textureViewInfo);
        } else {
            cc::gfx::TextureInfo textureInfo;
            sevalue_to_native(args[0], &textureInfo, s.thisObject());
            texture = cobj->createTexture(textureInfo);
        }
        CC_UNUSED bool ok = native_ptr_to_seval(texture, &s.rval());
        s.rval().toObject()->getPrivateObject()->tryAllowDestroyInGC();
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Device_createTexture)

static bool js_gfx_Buffer_initialize(se::State &s) { // NOLINT(readability-identifier-naming)
    CC_UNUSED bool ok = true;
    auto *cobj = static_cast<cc::gfx::Buffer *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();

    if (argc == 2) {
        bool initWithBufferViewInfo = false;
        sevalue_to_native(args[1], &initWithBufferViewInfo);

        if (initWithBufferViewInfo) {
            cc::gfx::BufferViewInfo bufferViewInfo;
            sevalue_to_native(args[0], &bufferViewInfo, s.thisObject());
            cobj->initialize(bufferViewInfo);
        } else {
            cc::gfx::BufferInfo bufferInfo;
            sevalue_to_native(args[0], &bufferInfo, s.thisObject());
            cobj->initialize(bufferInfo);
        }

        ok &= nativevalue_to_se(ok, s.rval());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Buffer_initialize)

static bool js_gfx_Texture_initialize(se::State &s) { // NOLINT(readability-identifier-naming)
    CC_UNUSED bool ok = true;
    auto *cobj = static_cast<cc::gfx::Texture *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();

    if (argc == 2) {
        bool initWithTextureViewInfo = false;
        sevalue_to_native(args[1], &initWithTextureViewInfo);

        if (initWithTextureViewInfo) {
            cc::gfx::TextureViewInfo textureViewInfo;
            sevalue_to_native(args[0], &textureViewInfo, s.thisObject());
            cobj->initialize(textureViewInfo);
        } else {
            cc::gfx::TextureInfo textureInfo;
            sevalue_to_native(args[0], &textureInfo, s.thisObject());
            cobj->initialize(textureInfo);
        }

        ok &= nativevalue_to_se(ok, s.rval());
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_gfx_Texture_initialize)

static bool js_gfx_GFXBuffer_update(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::gfx::Buffer *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->update(arg0, static_cast<uint32_t>(dataLength));
        return true;
    }
    if (argc == 2) {
        unsigned int arg1 = 0;
        ok &= sevalue_to_native(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->update(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_GFXBuffer_update)

static bool js_gfx_CommandBuffer_execute(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::gfx::CommandBuffer *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cc::gfx::CommandBufferList cmdBufs;
        unsigned int count = 0;
        ok &= sevalue_to_native(args[1], &count);

        se::Object *jsarr = args[0].toObject();
        CC_ASSERT(jsarr->isArray());
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
                auto *cmdBuf = static_cast<cc::gfx::CommandBuffer *>(tmp.toObject()->getPrivateData());
                cmdBufs[i] = cmdBuf;
            }
        }

        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->execute(cmdBufs, count);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_execute)

static bool js_gfx_CommandBuffer_updateBuffer(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::gfx::CommandBuffer *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;

    cc::gfx::Buffer *arg0 = nullptr;
    SE_PRECONDITION2(args[0].isObject(), false, "Invalid Native Object");
    arg0 = static_cast<cc::gfx::Buffer *>(args[0].toObject()->getPrivateData());

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
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->updateBuffer(arg0, arg1, static_cast<uint32_t>(dataLength));
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_updateBuffer)

static bool js_gfx_CommandBuffer_copyBuffersToTexture(se::State &s) { // NOLINT(readability-identifier-naming)
    auto *cobj = static_cast<cc::gfx::CommandBuffer *>(s.nativeThisObject());
    SE_PRECONDITION2(cobj, false, "Invalid Native Object");

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
                        CC_ABORT();
                    }
                    arg0[i] = ptr;
                }
            }
        }
        ok &= seval_to_native_ptr(args[1], &arg1);
        ok &= seval_to_std_vector(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        cobj->copyBuffersToTexture(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_gfx_CommandBuffer_copyBuffersToTexture)

bool js_gfx_get_deviceInstance(se::State &s) { // NOLINT(readability-identifier-naming)
    nativevalue_to_se(cc::gfx::Device::getInstance(), s.rval(), nullptr);
    return true;
}
SE_BIND_PROP_GET(js_gfx_get_deviceInstance)

bool register_all_gfx_manual(se::Object *obj) {
    __jsb_cc_gfx_Device_proto->defineFunction("copyBuffersToTexture", _SE(js_gfx_Device_copyBuffersToTexture));
    __jsb_cc_gfx_Device_proto->defineFunction("copyTextureToBuffers", _SE(js_gfx_Device_copyTextureToBuffers));
    __jsb_cc_gfx_Device_proto->defineFunction("copyTexImagesToTexture", _SE(js_gfx_Device_copyTexImagesToTexture));

    __jsb_cc_gfx_Device_proto->defineFunction("createBuffer", _SE(js_gfx_Device_createBuffer));
    __jsb_cc_gfx_Device_proto->defineFunction("createTexture", _SE(js_gfx_Device_createTexture));

    __jsb_cc_gfx_Buffer_proto->defineFunction("update", _SE(js_gfx_GFXBuffer_update));

    __jsb_cc_gfx_CommandBuffer_proto->defineFunction("execute", _SE(js_gfx_CommandBuffer_execute));
    __jsb_cc_gfx_CommandBuffer_proto->defineFunction("updateBuffer", _SE(js_gfx_CommandBuffer_updateBuffer));
    __jsb_cc_gfx_CommandBuffer_proto->defineFunction("copyBuffersToTexture", _SE(js_gfx_CommandBuffer_copyBuffersToTexture));

    __jsb_cc_gfx_Buffer_proto->defineFunction("initialize", _SE(js_gfx_Buffer_initialize));
    __jsb_cc_gfx_Texture_proto->defineFunction("initialize", _SE(js_gfx_Texture_initialize));

    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("gfx", &nsVal)) {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("gfx", nsVal);
    }

    return true;
}
