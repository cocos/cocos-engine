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

#include "3d/assets/Mesh.h"
#include "3d/assets/Morph.h"
#include "3d/assets/Skeleton.h"
#include "3d/misc/BufferBlob.h"
#include "3d/misc/CreateMesh.h"
#include "base/std/hash/hash.h"
#include "core/DataView.h"
#include "core/assets/RenderingSubMesh.h"
#include "core/platform/Debug.h"
#include "math/Quaternion.h"
#include "math/Utils.h"
#include "renderer/gfx-base/GFXDevice.h"

#include <algorithm>
#include <numeric>

#define CC_OPTIMIZE_MESH_DATA 0

namespace cc {

namespace {

uint32_t getOffset(const gfx::AttributeList &attributes, index_t attributeIndex) {
    uint32_t result = 0;
    for (index_t i = 0; i < attributeIndex; ++i) {
        const auto &attribute = attributes[i];
        result += gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attribute.format)].size;
    }
    return result;
}

//
uint32_t getComponentByteLength(gfx::Format format) {
    const auto &info = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(format)];
    return info.size / info.count;
}

using DataReaderCallback = std::function<TypedArrayElementType(uint32_t)>;

DataReaderCallback getReader(const DataView &dataView, gfx::Format format) {
    const auto &info = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(format)];
    const uint32_t stride = info.size / info.count;

    switch (info.type) {
        case gfx::FormatType::UNORM: {
            switch (stride) {
                case 1: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getUint8(offset); };
                case 2: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getUint16(offset); };
                case 4: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getUint32(offset); };
                default:
                    break;
            }
            break;
        }
        case gfx::FormatType::SNORM: {
            switch (stride) {
                case 1: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getInt8(offset); };
                case 2: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getInt16(offset); };
                case 4: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getInt32(offset); };
                default:
                    break;
            }
            break;
        }
        case gfx::FormatType::INT: {
            switch (stride) {
                case 1: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getInt8(offset); };
                case 2: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getInt16(offset); };
                case 4: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getInt32(offset); };
                default:
                    break;
            }
            break;
        }
        case gfx::FormatType::UINT: {
            switch (stride) {
                case 1: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getUint8(offset); };
                case 2: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getUint16(offset); };
                case 4: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getUint32(offset); };
                default:
                    break;
            }
            break;
        }
        case gfx::FormatType::FLOAT: {
            switch (stride) {
                case 2: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getUint16(offset); };
                case 4: return [&](uint32_t offset) -> TypedArrayElementType { return dataView.getFloat32(offset); };
                default:
                    break;
            }
            break;
        }
        default:
            break;
    }

    return nullptr;
}

using DataWritterCallback = std::function<void(uint32_t, TypedArrayElementType)>;

DataWritterCallback getWriter(DataView &dataView, gfx::Format format) {
    const auto &info = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(format)];
    const uint32_t stride = info.size / info.count;

    switch (info.type) {
        case gfx::FormatType::UNORM: {
            switch (stride) {
                case 1: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setUint8(offset, ccstd::get<uint8_t>(value)); };
                case 2: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setUint16(offset, ccstd::get<uint16_t>(value)); };
                case 4: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setUint32(offset, ccstd::get<uint32_t>(value)); };
                default:
                    break;
            }
            break;
        }
        case gfx::FormatType::SNORM: {
            switch (stride) {
                case 1: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setInt8(offset, ccstd::get<int8_t>(value)); };
                case 2: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setInt16(offset, ccstd::get<int8_t>(value)); };
                case 4: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setInt32(offset, ccstd::get<int8_t>(value)); };
                default:
                    break;
            }
            break;
        }
        case gfx::FormatType::INT: {
            switch (stride) {
                case 1: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setInt8(offset, ccstd::get<int8_t>(value)); };
                case 2: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setInt16(offset, ccstd::get<int16_t>(value)); };
                case 4: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setInt32(offset, ccstd::get<int32_t>(value)); };
                default:
                    break;
            }
            break;
        }
        case gfx::FormatType::UINT: {
            switch (stride) {
                case 1: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setUint8(offset, ccstd::get<uint8_t>(value)); };
                case 2: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setUint16(offset, ccstd::get<uint16_t>(value)); };
                case 4: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setUint32(offset, ccstd::get<uint32_t>(value)); };
                default:
                    break;
            }
            break;
        }
        case gfx::FormatType::FLOAT: {
            switch (stride) {
                case 2: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setUint16(offset, ccstd::get<uint16_t>(value)); };
                case 4: return [&](uint32_t offset, const TypedArrayElementType &value) { dataView.setFloat32(offset, ccstd::get<float>(value)); };
                default:
                    break;
            }
            break;
        }
        default:
            break;
    }

    return nullptr;
}

#if CC_OPTIMIZE_MESH_DATA
void checkAttributesNeedConvert(const gfx::AttributeList &orignalAttributes,         // in
                                gfx::AttributeList &attributes,                      // in-out
                                ccstd::vector<uint32_t> &attributeIndicsNeedConvert, // in-out
                                uint32_t &dstStride) {                               // in-out
    attributeIndicsNeedConvert.clear();
    attributeIndicsNeedConvert.reserve(orignalAttributes.size());

    uint32_t attributeIndex = 0;
    for (auto &attribute : attributes) {
        /*
         NOTE: The size of RGB16F is 6 bytes, some Android devices may require 4 bytes alignment for attribute and Metal must require 4 bytes alignment.
                Mesh will not be displayed correctly if setting non 4 bytes alignment (RGB16F is 6 bytes) on those devices.
                And currently we depend on gfx::GFX_FORMAT_INFOS[format].size a lot, so we disable optimize NORMAL data temporarily before we find a better solution.

        if (attribute.name == gfx::ATTR_NAME_NORMAL) {
            if (attribute.format == gfx::Format::RGB32F) {
                attributeIndicsNeedConvert.emplace_back(attributeIndex);
                attribute.format = gfx::Format::RGB16F;
    #if (CC_PLATFORM == CC_PLATFORM_IOS) || (CC_PLATFORM == CC_PLATFORM_MACOS)
                dstStride -= 4; // NOTE: Metal needs 4 bytes alignment
    #else
                dstStride -= 6;
    #endif
            }
        } else */

        if (attribute.name == gfx::ATTR_NAME_TEX_COORD || attribute.name == gfx::ATTR_NAME_TEX_COORD1 || attribute.name == gfx::ATTR_NAME_TEX_COORD2 || attribute.name == gfx::ATTR_NAME_TEX_COORD3 || attribute.name == gfx::ATTR_NAME_TEX_COORD4 || attribute.name == gfx::ATTR_NAME_TEX_COORD5 || attribute.name == gfx::ATTR_NAME_TEX_COORD6 || attribute.name == gfx::ATTR_NAME_TEX_COORD7 || attribute.name == gfx::ATTR_NAME_TEX_COORD8) {
            if (attribute.format == gfx::Format::RG32F) {
                attributeIndicsNeedConvert.emplace_back(attributeIndex);
                attribute.format = gfx::Format::RG16F;
                dstStride -= 4;
            }
        } else if (attribute.name == gfx::ATTR_NAME_TANGENT) {
            if (attribute.format == gfx::Format::RGBA32F) {
                attributeIndicsNeedConvert.emplace_back(attributeIndex);
                attribute.format = gfx::Format::RGBA16F;
                dstStride -= 8;
            }
        }
        ++attributeIndex;
    }
}

void convertRGBA32FToRGBA16F(const float *src, uint16_t *dst) {
    dst[0] = utils::rawHalfAsUint16(utils::floatToHalf(src[0]));
    dst[1] = utils::rawHalfAsUint16(utils::floatToHalf(src[1]));
    dst[2] = utils::rawHalfAsUint16(utils::floatToHalf(src[2]));
    dst[3] = utils::rawHalfAsUint16(utils::floatToHalf(src[3]));
}

void convertRGB32FToRGB16F(const float *src, uint16_t *dst) {
    dst[0] = utils::rawHalfAsUint16(utils::floatToHalf(src[0]));
    dst[1] = utils::rawHalfAsUint16(utils::floatToHalf(src[1]));
    dst[2] = utils::rawHalfAsUint16(utils::floatToHalf(src[2]));
}

void convertRG32FToRG16F(const float *src, uint16_t *dst) {
    dst[0] = utils::rawHalfAsUint16(utils::floatToHalf(src[0]));
    dst[1] = utils::rawHalfAsUint16(utils::floatToHalf(src[1]));
}

#endif // #if CC_OPTIMIZE_MESH_DATA

} // namespace

void MeshUtils::dequantizeMesh(Mesh::IStruct &structInfo, Uint8Array &data) {
    BufferBlob bufferBlob;
    bufferBlob.setNextAlignment(0);

    using DataReaderCallback = std::function<TypedArrayElementType(uint32_t)>;
    using DataWritterCallback = std::function<void(uint32_t, TypedArrayElementType)>;

    const auto transformVertex =
        [](const DataReaderCallback &reader,
           const DataWritterCallback &writer,
           uint32_t count,
           uint32_t components,
           uint32_t componentSize,
           uint32_t readerStride,
           uint32_t writerStride) -> void {
        for (uint32_t i = 0; i < count; ++i) {
            for (uint32_t j = 0; j < components; ++j) {
                const auto inputOffset = readerStride * i + componentSize * j;
                const auto outputOffset = writerStride * i + componentSize * j;
                writer(outputOffset, reader(inputOffset));
            }
        }
    };

    const auto dequantizeHalf =
        [](const DataReaderCallback &reader,
           const DataWritterCallback &writer,
           uint32_t count,
           uint32_t components,
           uint32_t readerStride,
           uint32_t writerStride) -> void {
        for (uint32_t i = 0; i < count; ++i) {
            for (uint32_t j = 0; j < components; ++j) {
                const auto inputOffset = readerStride * i + 2 * j;
                const auto outputOffset = writerStride * i + 4 * j;
                const auto val = mathutils::halfToFloat(ccstd::get<uint16_t>(reader(inputOffset)));
                writer(outputOffset, val);
            }
        }
    };

    for (auto &bundle : structInfo.vertexBundles) {
        auto &view = bundle.view;
        auto &attrs = bundle.attributes;
        auto oldAttrs = attrs;
        std::vector<uint32_t> strides;
        std::vector<bool> dequantizes;
        std::vector<DataReaderCallback> readers;
        strides.reserve(attrs.size());
        dequantizes.reserve(attrs.size());
        readers.reserve(attrs.size());
        for (uint32_t i = 0; i < attrs.size(); ++i) {
            auto &attr = attrs[i];
            auto inputView = DataView(data.buffer(), view.offset + getOffset(oldAttrs, i));
            auto reader = getReader(inputView, attr.format);
            auto dequantize = true;
            switch (attr.format) {
                case gfx::Format::R16F:
                    attr.format = gfx::Format::R32F;
                    break;
                case gfx::Format::RG16F:
                    attr.format = gfx::Format::RG32F;
                    break;
                case gfx::Format::RGB16F:
                    attr.format = gfx::Format::RGB32F;
                    break;
                case gfx::Format::RGBA16F:
                    attr.format = gfx::Format::RGBA32F;
                    break;
                default:
                    dequantize = false;
                    break;
            }
            strides.push_back(gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attr.format)].size);
            dequantizes.push_back(dequantize);
            readers.push_back(reader);
        }
        auto netStride = std::accumulate(strides.begin(), strides.end(), 0U);
        auto vertData = Uint8Array(view.count * netStride);
        for (uint32_t i = 0; i < attrs.size(); i++) {
            const auto &attr = attrs[i];
            const auto &reader = readers[i];
            auto outputView = DataView(vertData.buffer(), getOffset(attrs, i));
            auto writer = getWriter(outputView, attr.format);
            const auto &dequantize = dequantizes[i];
            const auto &formatInfo = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attr.format)];
            if (dequantize) {
                dequantizeHalf(
                    reader,
                    writer,
                    view.count,
                    formatInfo.count,
                    view.stride,
                    netStride);
            } else {
                transformVertex(
                    reader,
                    writer,
                    view.count,
                    formatInfo.count,
                    formatInfo.size / formatInfo.count,
                    view.stride,
                    netStride);
            }
        }

        bufferBlob.setNextAlignment(netStride);
        Mesh::IBufferView vertexView;
        vertexView.offset = bufferBlob.getLength();
        vertexView.length = view.count * netStride;
        vertexView.count = view.count;
        vertexView.stride = netStride;
        bundle.view = vertexView;
        bufferBlob.addBuffer(vertData.buffer());
    }

    for (auto &primitive : structInfo.primitives) {
        if (!primitive.indexView.has_value()) {
            continue;
        }
        auto &view = *primitive.indexView;
        auto *buffer = ccnew ArrayBuffer(data.buffer()->getData() + view.offset, view.length);
        bufferBlob.setNextAlignment(view.stride);
        Mesh::IBufferView indexView;
        indexView.offset = bufferBlob.getLength();
        indexView.length = view.length;
        indexView.count = view.count;
        indexView.stride = view.stride;
        primitive.indexView = indexView;
        bufferBlob.addBuffer(buffer);
    }

    structInfo.quantized = false;

    data = Uint8Array(bufferBlob.getCombined());
}

Mesh::~Mesh() = default;

ccstd::any Mesh::getNativeAsset() const {
    return _data; //cjh FIXME: need copy? could be _data pointer?
}

void Mesh::setNativeAsset(const ccstd::any &obj) {
    auto *p = ccstd::any_cast<ArrayBuffer *>(obj);
    if (p != nullptr) {
        _data = Uint8Array(p);
    }
}

uint32_t Mesh::getSubMeshCount() const {
    return static_cast<uint32_t>(_renderingSubMeshes.size());
}

const Vec3 *Mesh::getMinPosition() const {
    return _struct.minPosition.has_value() ? &_struct.minPosition.value() : nullptr;
}

const Vec3 *Mesh::getMaxPosition() const {
    return _struct.maxPosition.has_value() ? &_struct.maxPosition.value() : nullptr;
}

ccstd::hash_t Mesh::getHash() {
    if (_hash == 0U) {
        ccstd::hash_t seed = 666;
        if (_data.buffer()) {
            ccstd::hash_range(seed, _data.buffer()->getData(), _data.buffer()->getData() + _data.length());
            _hash = seed;
        } else {
            ccstd::hash_combine<ccstd::hash_t>(_hash, seed);
        }
    }

    return _hash;
}

const Mesh::JointBufferIndicesType &Mesh::getJointBufferIndices() {
    if (!_jointBufferIndices.empty()) {
        return _jointBufferIndices;
    }

    _jointBufferIndices.reserve(_struct.primitives.size());
    for (auto &p : _struct.primitives) {
        _jointBufferIndices.emplace_back(p.jointMapIndex.has_value() ? p.jointMapIndex.value() : 0);
    }

    return _jointBufferIndices;
}

void Mesh::initialize() {
    if (_initialized) {
        return;
    }

    _initialized = true;

    if (_struct.compressed) {
        // decompress
        MeshUtils::inflateMesh(_struct, _data);
    }
    if (_struct.encoded) {
        // decode
        MeshUtils::decodeMesh(_struct, _data);
    }
    if (_struct.quantized && !hasFlag(gfx::Device::getInstance()->getFormatFeatures(gfx::Format::RG16F), gfx::FormatFeature::VERTEX_ATTRIBUTE)) {
        MeshUtils::dequantizeMesh(_struct, _data);
    }

    if (_struct.dynamic.has_value()) {
        auto *device = gfx::Device::getInstance();
        gfx::BufferList vertexBuffers;

        for (const auto &vertexBundle : _struct.vertexBundles) {
            auto *vertexBuffer = device->createBuffer({gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
                                                       gfx::MemoryUsageBit::DEVICE,
                                                       vertexBundle.view.length,
                                                       vertexBundle.view.stride});
            vertexBuffers.emplace_back(vertexBuffer);
        }

        for (auto i = 0U; i < _struct.primitives.size(); i++) {
            const auto &primitive = _struct.primitives[i];
            const auto &indexView = primitive.indexView;
            gfx::Buffer *indexBuffer = nullptr;

            if (indexView.has_value()) {
                indexBuffer = device->createBuffer({gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
                                                    gfx::MemoryUsageBit::DEVICE,
                                                    indexView.value().length,
                                                    indexView.value().stride});
            }

            gfx::BufferList subVBs;
            subVBs.reserve(primitive.vertexBundelIndices.size());
            for (const auto &idx : primitive.vertexBundelIndices) {
                subVBs.emplace_back(vertexBuffers[idx]);
            }

            gfx::AttributeList attributes;
            for (const auto idx : primitive.vertexBundelIndices) {
                const auto &vertexBundle = _struct.vertexBundles[idx];
                for (const auto &attr : vertexBundle.attributes) {
                    attributes.emplace_back(attr);
                }
            }

            auto *subMesh = ccnew RenderingSubMesh(subVBs, attributes, primitive.primitiveMode, indexBuffer);
            subMesh->setDrawInfo(gfx::DrawInfo());
            subMesh->setMesh(this);
            subMesh->setSubMeshIdx(static_cast<uint32_t>(i));

            _renderingSubMeshes.emplace_back(subMesh);
        }
    } else {
        if (!_data.buffer()) {
            return;
        }

        auto &buffer = _data;
        gfx::Device *gfxDevice = gfx::Device::getInstance();
        RefVector<gfx::Buffer *> vertexBuffers{createVertexBuffers(gfxDevice, buffer.buffer())};
        RefVector<gfx::Buffer *> indexBuffers;
        ccstd::vector<IntrusivePtr<RenderingSubMesh>> subMeshes;

        for (size_t i = 0; i < _struct.primitives.size(); i++) {
            auto &prim = _struct.primitives[i];
            if (prim.vertexBundelIndices.empty()) {
                continue;
            }

            gfx::Buffer *indexBuffer = nullptr;
            if (prim.indexView.has_value()) {
                const auto &idxView = prim.indexView.value();

                uint32_t dstStride = idxView.stride;
                uint32_t dstSize = idxView.length;
                if (dstStride == 4) {
                    uint32_t vertexCount = _struct.vertexBundles[prim.vertexBundelIndices[0]].view.count;
#if CC_OPTIMIZE_MESH_DATA
                    if (vertexCount < 65536) {
                        dstStride >>= 1; // Reduce to short.
                        dstSize >>= 1;
                    } else if (!gfxDevice->hasFeature(gfx::Feature::ELEMENT_INDEX_UINT)) {
                        continue; // Ignore this primitive
                    }
#else
                    if (!gfxDevice->hasFeature(gfx::Feature::ELEMENT_INDEX_UINT)) {
                        if (vertexCount >= 65536) {
                            CC_LOG_WARNING("Device does not support UINT element index type and vertexCount (%u) is larger than ushort", vertexCount);
                            continue;
                        }

                        dstStride >>= 1; // Reduce to short.
                        dstSize >>= 1;
                    }
#endif
                }

                indexBuffer = gfxDevice->createBuffer(gfx::BufferInfo{
                    gfx::BufferUsageBit::INDEX,
                    gfx::MemoryUsageBit::DEVICE,
                    dstSize,
                    dstStride,
                });
                indexBuffers.pushBack(indexBuffer);

                const uint8_t *ib = buffer.buffer()->getData() + idxView.offset;
                if (idxView.stride != dstStride) {
                    uint32_t ib16BitLength = idxView.length >> 1;
                    auto *ib16Bit = static_cast<uint16_t *>(CC_MALLOC(ib16BitLength));
                    const auto *ib32Bit = reinterpret_cast<const uint32_t *>(ib);
                    for (uint32_t j = 0, len = idxView.count; j < len; ++j) {
                        ib16Bit[j] = ib32Bit[j];
                    }

                    indexBuffer->update(ib16Bit, ib16BitLength);
                    CC_FREE(ib16Bit);
                } else {
                    indexBuffer->update(ib);
                }
            }

            gfx::BufferList vbReference;
            vbReference.reserve(prim.vertexBundelIndices.size());
            for (const auto &idx : prim.vertexBundelIndices) {
                vbReference.emplace_back(vertexBuffers.at(idx));
            }

            gfx::AttributeList gfxAttributes;
            if (!prim.vertexBundelIndices.empty()) {
                uint32_t idx = prim.vertexBundelIndices[0];
                const IVertexBundle &vertexBundle = _struct.vertexBundles[idx];
                const gfx::AttributeList &attrs = vertexBundle.attributes;
                gfxAttributes.resize(attrs.size());
                for (size_t j = 0; j < attrs.size(); ++j) {
                    const auto &attr = attrs[j];
                    gfxAttributes[j] = gfx::Attribute{attr.name, attr.format, attr.isNormalized, attr.stream, attr.isInstanced, attr.location};
                }
            }

            auto *subMesh = ccnew RenderingSubMesh(vbReference, gfxAttributes, prim.primitiveMode, indexBuffer);
            subMesh->setMesh(this);
            subMesh->setSubMeshIdx(static_cast<uint32_t>(i));

            subMeshes.emplace_back(subMesh);
        }

        _renderingSubMeshes = subMeshes;

        if (_struct.morph.has_value()) {
            morphRendering = createMorphRendering(this, gfxDevice);
        }

        _isMeshDataUploaded = true;
#if !CC_EDITOR
        if (!_allowDataAccess) {
            releaseData();
        }
#endif
    }
}

void Mesh::destroyRenderingMesh() {
    if (!_renderingSubMeshes.empty()) {
        for (auto &submesh : _renderingSubMeshes) {
            submesh->destroy();
        }
        _renderingSubMeshes.clear();
        _initialized = false;
        _isMeshDataUploaded = false;
    }
}

void Mesh::assign(const IStruct &structInfo, const Uint8Array &data) {
    reset({structInfo, data});
}

void Mesh::reset(ICreateInfo &&info) {
    destroyRenderingMesh();
    _struct = std::move(info.structInfo);
    _data = std::move(info.data);
    _hash = 0;
}

Mesh::BoneSpaceBounds Mesh::getBoneSpaceBounds(Skeleton *skeleton) {
    auto iter = _boneSpaceBounds.find(skeleton->getHash());
    if (iter != _boneSpaceBounds.end()) {
        return iter->second;
    }
    Vec3 v32;
    BoneSpaceBounds &bounds = _boneSpaceBounds[skeleton->getHash()];
    ccstd::vector<bool> valid;
    const auto &bindposes = skeleton->getBindposes();
    valid.reserve(bindposes.size());
    for (size_t i = 0; i < bindposes.size(); i++) {
        bounds.emplace_back(ccnew geometry::AABB{
            std::numeric_limits<float>::infinity(), std::numeric_limits<float>::infinity(), std::numeric_limits<float>::infinity(),
            -std::numeric_limits<float>::infinity(), -std::numeric_limits<float>::infinity(), -std::numeric_limits<float>::infinity()});
        valid.emplace_back(false);
    }
    const auto &primitives = _struct.primitives;
    for (index_t p = 0; p < primitives.size(); p++) {
        const auto joints = readAttribute(p, gfx::ATTR_NAME_JOINTS);
        const auto weights = readAttribute(p, gfx::ATTR_NAME_WEIGHTS);
        const auto positions = readAttribute(p, gfx::ATTR_NAME_POSITION);
        if (joints.index() == 0 || weights.index() == 0 || positions.index() == 0) {
            continue;
        }

        uint32_t vertCount = std::min({getTypedArrayLength(joints) / 4,
                                       getTypedArrayLength(weights) / 4,
                                       getTypedArrayLength(positions) / 3});
        for (uint32_t i = 0; i < vertCount; i++) {
            Vec3 v31{
                getTypedArrayValue<float>(positions, 3 * i + 0),
                getTypedArrayValue<float>(positions, 3 * i + 1),
                getTypedArrayValue<float>(positions, 3 * i + 2)};

            for (uint32_t j = 0; j < 4; ++j) {
                const uint32_t idx = 4 * i + j;
                const auto joint = getTypedArrayValue<int32_t>(joints, idx);

                if (std::fabs(getTypedArrayValue<float>(weights, idx)) < FLT_EPSILON || joint >= bindposes.size()) {
                    continue;
                }

                Vec3::transformMat4(v31, bindposes[joint], &v32);
                valid[joint] = true;
                auto &b = bounds[joint];
                Vec3::min(b->center, v32, &b->center);
                Vec3::max(b->halfExtents, v32, &b->halfExtents);
            }
        }
    }
    for (size_t i = 0; i < bindposes.size(); i++) {
        auto &b = bounds[i];
        if (!valid[i]) {
            bounds[i] = {};
        } else {
            geometry::AABB::fromPoints(b->center, b->halfExtents, b);
        }
    }
    return bounds;
}

bool Mesh::merge(Mesh *mesh, const Mat4 *worldMatrix /* = nullptr */, bool validate /* = false*/) {
    if (validate) {
        if (!validateMergingMesh(mesh)) {
            return false;
        }
    }

    Vec3 vec3Temp;
    Quaternion rotate;
    geometry::AABB boundingBox;
    if (worldMatrix != nullptr) {
        worldMatrix->getRotation(&rotate);
    }
    if (!_initialized) {
        auto structInfo = mesh->_struct; //NOTE: Need copy struct, so don't use referece
        Uint8Array data{mesh->_data.slice()};
        if (worldMatrix != nullptr) {
            if (structInfo.maxPosition.has_value() && structInfo.minPosition.has_value()) {
                Vec3::add(structInfo.maxPosition.value(), structInfo.minPosition.value(), &boundingBox.center);
                boundingBox.center.scale(0.5F);
                Vec3::subtract(structInfo.maxPosition.value(), structInfo.minPosition.value(), &boundingBox.halfExtents);
                boundingBox.halfExtents.scale(0.5F);

                boundingBox.transform(*worldMatrix, &boundingBox);
                Vec3::add(boundingBox.center, boundingBox.halfExtents, &structInfo.maxPosition.value());
                Vec3::subtract(boundingBox.center, boundingBox.halfExtents, &structInfo.minPosition.value());
            }
            for (auto &vtxBdl : structInfo.vertexBundles) {
                for (int j = 0; j < vtxBdl.attributes.size(); j++) {
                    if (vtxBdl.attributes[j].name == gfx::ATTR_NAME_POSITION || vtxBdl.attributes[j].name == gfx::ATTR_NAME_NORMAL) {
                        const gfx::Format format = vtxBdl.attributes[j].format;

                        DataView inputView(data.buffer(), vtxBdl.view.offset + getOffset(vtxBdl.attributes, j));

                        auto reader = getReader(inputView, format);
                        if (reader == nullptr) {
                            continue;
                        }

                        auto writer = getWriter(inputView, format);
                        if (writer == nullptr) {
                            continue;
                        }

                        const uint32_t vertexCount = vtxBdl.view.count;

                        const uint32_t vertexStride = vtxBdl.view.stride;
                        const uint32_t attrComponentByteLength = getComponentByteLength(format);
                        for (uint32_t vtxIdx = 0; vtxIdx < vertexCount; vtxIdx++) {
                            const uint32_t xOffset = vtxIdx * vertexStride;
                            const uint32_t yOffset = xOffset + attrComponentByteLength;
                            const uint32_t zOffset = yOffset + attrComponentByteLength;
                            vec3Temp.set(
                                getTypedArrayElementValue<float>(reader(xOffset)),
                                getTypedArrayElementValue<float>(reader(yOffset)),
                                getTypedArrayElementValue<float>(reader(zOffset)));
                            const auto &attrName = vtxBdl.attributes[j].name;

                            if (attrName == gfx::ATTR_NAME_POSITION) {
                                vec3Temp.transformMat4(vec3Temp, *worldMatrix);
                            } else if (attrName == gfx::ATTR_NAME_NORMAL) {
                                vec3Temp.transformQuat(rotate);
                            }

                            writer(xOffset, vec3Temp.x);
                            writer(yOffset, vec3Temp.y);
                            writer(zOffset, vec3Temp.z);
                        }
                    }
                }
            }
        }
        reset({structInfo, data});
        initialize();
        return true;
    }

    // merge buffer
    BufferBlob bufferBlob;

    // merge vertex buffer
    uint32_t vertCount = 0;
    uint32_t vertStride = 0;

    uint32_t srcAttrOffset = 0;
    uint32_t srcVBOffset = 0;
    uint32_t dstVBOffset = 0;
    uint32_t attrSize = 0;

    bool hasAttr = false;

    ccstd::vector<Mesh::IVertexBundle> vertexBundles;
    vertexBundles.resize(_struct.vertexBundles.size());

    for (size_t i = 0; i < _struct.vertexBundles.size(); ++i) {
        Uint8Array dstAttrView;

        const auto &bundle = _struct.vertexBundles[i];
        auto &dstBundle = mesh->_struct.vertexBundles[i];

        vertStride = bundle.view.stride;
        vertCount = bundle.view.count + dstBundle.view.count;

        auto *vb = ccnew ArrayBuffer(vertCount * vertStride);
        Uint8Array vbView(vb);

        Uint8Array srcVBView = _data.subarray(bundle.view.offset, bundle.view.offset + bundle.view.length);
        Uint8Array dstVBView = mesh->_data.subarray(dstBundle.view.offset, dstBundle.view.offset + dstBundle.view.length);

        vbView.set(srcVBView);

        srcAttrOffset = 0;
        for (const auto &attr : bundle.attributes) {
            dstVBOffset = 0;
            hasAttr = false;
            for (const auto &dstAttr : dstBundle.attributes) {
                if (attr.name == dstAttr.name && attr.format == dstAttr.format) {
                    hasAttr = true;
                    break;
                }
                dstVBOffset += gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(dstAttr.format)].size;
            }
            if (hasAttr) {
                attrSize = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attr.format)].size;
                srcVBOffset = bundle.view.length + srcAttrOffset;
                for (uint32_t v = 0; v < dstBundle.view.count; ++v) {
                    // Important note: the semantics of subarray are different in typescript and native
                    dstAttrView = dstVBView.subarray(dstBundle.view.offset + dstVBOffset, dstBundle.view.offset + dstVBOffset + attrSize);
                    vbView.set(dstAttrView, srcVBOffset);
                    if ((attr.name == gfx::ATTR_NAME_POSITION || attr.name == gfx::ATTR_NAME_NORMAL) && worldMatrix != nullptr) {
                        Float32Array f32Temp(vbView.buffer(), srcVBOffset, 3);
                        vec3Temp.set(f32Temp[0], f32Temp[1], f32Temp[2]);
                        if (attr.name == gfx::ATTR_NAME_POSITION) {
                            vec3Temp.transformMat4(vec3Temp, *worldMatrix);
                        } else if (attr.name == gfx::ATTR_NAME_NORMAL) {
                            vec3Temp.transformQuat(rotate);
                        }

                        f32Temp[0] = vec3Temp.x;
                        f32Temp[1] = vec3Temp.y;
                        f32Temp[2] = vec3Temp.z;
                    }
                    srcVBOffset += bundle.view.stride;
                    dstVBOffset += dstBundle.view.stride;
                }
            }
            srcAttrOffset += gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attr.format)].size;
        }

        auto &vertexBundle = vertexBundles[i];
        vertexBundle.attributes = bundle.attributes,
        vertexBundle.view.offset = bufferBlob.getLength();
        vertexBundle.view.length = vb->byteLength();
        vertexBundle.view.count = vertCount;
        vertexBundle.view.stride = vertStride;

        bufferBlob.addBuffer(vb);
    }

    // merge index buffer
    uint32_t idxCount = 0;
    uint32_t idxStride = 2;

    ccstd::vector<Mesh::ISubMesh> primitives;
    primitives.resize(_struct.primitives.size());

    for (size_t i = 0; i < _struct.primitives.size(); ++i) {
        const auto &prim = _struct.primitives[i];
        auto &dstPrim = mesh->_struct.primitives[i];

        primitives[i].primitiveMode = prim.primitiveMode;
        primitives[i].vertexBundelIndices = prim.vertexBundelIndices;

        uint32_t vertBatchCount = 0;
        for (const uint32_t bundleIdx : prim.vertexBundelIndices) {
            vertBatchCount = std::max(vertBatchCount, _struct.vertexBundles[bundleIdx].view.count);
        }

        if (prim.indexView.has_value() && dstPrim.indexView.has_value()) {
            idxCount = prim.indexView.value().count;
            idxCount += dstPrim.indexView.value().count;

            if (idxCount < 256) {
                idxStride = 1;
            } else if (idxCount < 65536) {
                idxStride = 2;
            } else {
                idxStride = 4;
            }

            auto *ib = ccnew ArrayBuffer(idxCount * idxStride);

            TypedArray ibView;
            TypedArray srcIBView;
            TypedArray dstIBView;

            if (idxStride == 2) {
                ibView = Uint16Array(ib);
            } else if (idxStride == 1) {
                ibView = Uint8Array(ib);
            } else { // Uint32
                ibView = Uint32Array(ib);
            }

            // merge src indices
            if (prim.indexView.value().stride == 2) {
                srcIBView = Uint16Array(_data.buffer(), prim.indexView.value().offset, prim.indexView.value().count);
            } else if (prim.indexView.value().stride == 1) {
                srcIBView = Uint8Array(_data.buffer(), prim.indexView.value().offset, prim.indexView.value().count);
            } else { // Uint32
                srcIBView = Uint32Array(_data.buffer(), prim.indexView.value().offset, prim.indexView.value().count);
            }
            //
            if (idxStride == prim.indexView.value().stride) {
                switch (idxStride) {
                    case 2:
                        ccstd::get<Uint16Array>(ibView).set(ccstd::get<Uint16Array>(srcIBView));
                        break;
                    case 1:
                        ccstd::get<Uint8Array>(ibView).set(ccstd::get<Uint8Array>(srcIBView));
                        break;
                    default:
                        ccstd::get<Uint32Array>(ibView).set(ccstd::get<Uint32Array>(srcIBView));
                        break;
                }
            } else {
                for (uint32_t n = 0; n < prim.indexView.value().count; ++n) {
                    if (idxStride == 2) {
                        ccstd::get<Uint16Array>(ibView)[n] = static_cast<uint16_t>(getTypedArrayValue<uint32_t>(srcIBView, n));
                    } else if (idxStride == 1) {
                        ccstd::get<Uint8Array>(ibView)[n] = static_cast<uint8_t>(getTypedArrayValue<uint32_t>(srcIBView, n));
                    } else {
                        ccstd::get<Uint32Array>(ibView)[n] = getTypedArrayValue<uint32_t>(srcIBView, n);
                    }
                }
            }

            // merge dst indices
            uint32_t indexViewStride = dstPrim.indexView.value().stride;
            if (indexViewStride == 2) {
                dstIBView = Uint16Array(mesh->_data.buffer(), dstPrim.indexView.value().offset, dstPrim.indexView->count);
            } else if (indexViewStride == 1) {
                dstIBView = Uint8Array(mesh->_data.buffer(), dstPrim.indexView.value().offset, dstPrim.indexView->count);
            } else { // Uint32
                dstIBView = Uint32Array(mesh->_data.buffer(), dstPrim.indexView.value().offset, dstPrim.indexView->count);
            }
            for (uint32_t n = 0; n < dstPrim.indexView.value().count; ++n) {
                if (idxStride == 2) {
                    ccstd::get<Uint16Array>(ibView)[prim.indexView->count + n] =
                        vertBatchCount + static_cast<uint16_t>(getTypedArrayValue<uint32_t>(dstIBView, n));
                } else if (idxStride == 1) {
                    ccstd::get<Uint8Array>(ibView)[prim.indexView->count + n] =
                        vertBatchCount + static_cast<uint8_t>(getTypedArrayValue<uint32_t>(dstIBView, n));
                } else {
                    ccstd::get<Uint32Array>(ibView)[prim.indexView->count + n] =
                        vertBatchCount + getTypedArrayValue<uint32_t>(dstIBView, n);
                }
            }

            IBufferView indexView;
            indexView.offset = bufferBlob.getLength();
            indexView.length = ib->byteLength();
            indexView.count = idxCount;
            indexView.stride = idxStride;
            primitives[i].indexView = indexView;

            bufferBlob.setNextAlignment(idxStride);
            bufferBlob.addBuffer(ib);
        }
    }

    // Create mesh struct.
    Mesh::IStruct meshStruct;
    meshStruct.vertexBundles = vertexBundles;
    meshStruct.primitives = primitives;
    meshStruct.minPosition = _struct.minPosition;
    meshStruct.maxPosition = _struct.maxPosition;

    if (meshStruct.minPosition && mesh->_struct.minPosition && meshStruct.maxPosition && mesh->_struct.maxPosition) {
        if (worldMatrix != nullptr) {
            if (mesh->_struct.maxPosition.has_value() && mesh->_struct.minPosition.has_value()) {
                Vec3::add(mesh->_struct.maxPosition.value(), mesh->_struct.minPosition.value(), &boundingBox.center);
            }
            boundingBox.center.scale(0.5F);
            if (mesh->_struct.maxPosition.has_value() && mesh->_struct.minPosition.has_value()) {
                Vec3::subtract(mesh->_struct.maxPosition.value(), mesh->_struct.minPosition.value(), &boundingBox.halfExtents);
            }
            boundingBox.halfExtents.scale(0.5F);
            boundingBox.transform(*worldMatrix, &boundingBox);

            Vec3::add(boundingBox.center, boundingBox.halfExtents, &vec3Temp);
            Vec3::max(meshStruct.maxPosition.value(), vec3Temp, &meshStruct.maxPosition.value());
            Vec3::subtract(boundingBox.center, boundingBox.halfExtents, &vec3Temp);
            Vec3::min(meshStruct.minPosition.value(), vec3Temp, &meshStruct.minPosition.value());
        } else {
            Vec3::min(meshStruct.minPosition.value(), mesh->_struct.minPosition.value(), &meshStruct.minPosition.value());
            Vec3::max(meshStruct.maxPosition.value(), mesh->_struct.maxPosition.value(), &meshStruct.maxPosition.value());
        }
    }

    // Create mesh.
    reset({std::move(meshStruct),
           std::move(Uint8Array(bufferBlob.getCombined()))});
    initialize();
    return true;
}

bool Mesh::validateMergingMesh(Mesh *mesh) {
    // dynamic mesh is not allowed to merge.
    if (_struct.dynamic.has_value() || mesh->_struct.dynamic.has_value()) {
        return false;
    }

    // validate vertex bundles
    if (_struct.vertexBundles.size() != mesh->_struct.vertexBundles.size()) {
        return false;
    }

    for (size_t i = 0; i < _struct.vertexBundles.size(); ++i) {
        const auto &bundle = _struct.vertexBundles[i];
        auto &dstBundle = mesh->_struct.vertexBundles[i];

        if (bundle.attributes.size() != dstBundle.attributes.size()) {
            return false;
        }
        for (size_t j = 0; j < bundle.attributes.size(); ++j) {
            if (bundle.attributes[j].format != dstBundle.attributes[j].format) {
                return false;
            }
        }
    }

    // validate primitives
    if (_struct.primitives.size() != mesh->_struct.primitives.size()) {
        return false;
    }
    for (size_t i = 0; i < _struct.primitives.size(); ++i) {
        const auto &prim = _struct.primitives[i];
        auto &dstPrim = mesh->_struct.primitives[i];
        if (prim.vertexBundelIndices.size() != dstPrim.vertexBundelIndices.size()) {
            return false;
        }
        for (size_t j = 0; j < prim.vertexBundelIndices.size(); ++j) {
            if (prim.vertexBundelIndices[j] != dstPrim.vertexBundelIndices[j]) {
                return false;
            }
        }
        if (prim.primitiveMode != dstPrim.primitiveMode) {
            return false;
        }

        if (prim.indexView.has_value()) {
            if (!dstPrim.indexView.has_value()) {
                return false;
            }
        } else if (dstPrim.indexView.has_value()) {
            return false;
        }
    }

    return true;
}

TypedArray Mesh::readAttribute(index_t primitiveIndex, const char *attributeName) {
    TypedArray result;
    accessAttribute(primitiveIndex, attributeName, [&](const IVertexBundle &vertexBundle, uint32_t iAttribute) {
        const uint32_t vertexCount = vertexBundle.view.count;
        const gfx::Format format = vertexBundle.attributes[iAttribute].format;
        if (vertexCount == 0) {
            return;
        }

        DataView inputView(_data.buffer(), vertexBundle.view.offset + getOffset(vertexBundle.attributes, static_cast<index_t>(iAttribute)));

        const auto &formatInfo = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(format)];

        auto reader = getReader(inputView, format);
        if (reader == nullptr) {
            return;
        }

        const uint32_t componentCount = formatInfo.count;
        result = createTypedArrayWithGFXFormat(format, vertexCount * componentCount);
        const uint32_t inputStride = vertexBundle.view.stride;
        for (uint32_t iVertex = 0; iVertex < vertexCount; ++iVertex) {
            for (uint32_t iComponent = 0; iComponent < componentCount; ++iComponent) {
                TypedArrayElementType element = reader(inputStride * iVertex + getTypedArrayBytesPerElement(result) * iComponent);
                setTypedArrayValue(result, componentCount * iVertex + iComponent, element);
            }
        }
    });
    return result;
}

bool Mesh::copyAttribute(index_t primitiveIndex, const char *attributeName, ArrayBuffer *buffer, uint32_t stride, uint32_t offset) {
    bool written = false;
    accessAttribute(primitiveIndex, attributeName, [&](const IVertexBundle &vertexBundle, uint32_t iAttribute) {
        const uint32_t vertexCount = vertexBundle.view.count;
        if (vertexCount == 0) {
            written = true;
            return;
        }
        const gfx::Format format = vertexBundle.attributes[iAttribute].format;

        DataView inputView(_data.buffer(), vertexBundle.view.offset + getOffset(vertexBundle.attributes, static_cast<index_t>(iAttribute)));

        DataView outputView(buffer, offset);

        const auto &formatInfo = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(format)];

        auto reader = getReader(inputView, format);
        if (reader == nullptr) {
            return;
        }

        auto writer = getWriter(outputView, format);
        if (writer == nullptr) {
            return;
        }

        const uint32_t componentCount = formatInfo.count;

        const uint32_t inputStride = vertexBundle.view.stride;
        const uint32_t inputComponentByteLength = getComponentByteLength(format);
        const uint32_t outputStride = stride;
        const uint32_t outputComponentByteLength = inputComponentByteLength;
        for (uint32_t iVertex = 0; iVertex < vertexCount; ++iVertex) {
            for (uint32_t iComponent = 0; iComponent < componentCount; ++iComponent) {
                const uint32_t inputOffset = inputStride * iVertex + inputComponentByteLength * iComponent;
                const uint32_t outputOffset = outputStride * iVertex + outputComponentByteLength * iComponent;
                writer(outputOffset, reader(inputOffset));
            }
        }
        written = true;
    });
    return written;
}

IBArray Mesh::readIndices(index_t primitiveIndex) {
    if (primitiveIndex >= _struct.primitives.size()) {
        return {};
    }
    const auto &primitive = _struct.primitives[primitiveIndex];
    if (!primitive.indexView.has_value()) {
        return {};
    }
    const uint32_t stride = primitive.indexView.value().stride;
    const uint32_t count = primitive.indexView.value().count;
    const uint32_t byteOffset = primitive.indexView.value().offset;
    IBArray ret;
    if (stride == 1) {
        ret = Uint8Array(_data.buffer(), byteOffset, count);
    } else if (stride == 2) {
        ret = Uint16Array(_data.buffer(), byteOffset, count);
    } else {
        ret = Uint32Array(_data.buffer(), byteOffset, count);
    }

    return ret;
}

bool Mesh::copyIndices(index_t primitiveIndex, TypedArray &outputArray) {
    if (primitiveIndex >= _struct.primitives.size()) {
        return false;
    }
    const auto &primitive = _struct.primitives[primitiveIndex];
    if (!primitive.indexView.has_value()) {
        return false;
    }

    const uint32_t indexCount = primitive.indexView.value().count;
    const gfx::Format indexFormat = primitive.indexView.value().stride == 1 ? gfx::Format::R8UI
                                                                            : (primitive.indexView.value().stride == 2 ? gfx::Format::R16UI
                                                                                                                       : gfx::Format::R32UI);
    DataView view(_data.buffer());
    auto reader = getReader(view, indexFormat);
    for (uint32_t i = 0; i < indexCount; ++i) {
        TypedArrayElementType element = reader(primitive.indexView.value().offset + gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(indexFormat)].size * i);
        setTypedArrayValue(outputArray, i, element);
    }
    return true;
}

const gfx::FormatInfo *Mesh::readAttributeFormat(index_t primitiveIndex, const char *attributeName) {
    const gfx::FormatInfo *result = nullptr;

    accessAttribute(primitiveIndex, attributeName, [&](const IVertexBundle &vertexBundle, uint32_t iAttribute) {
        const gfx::Format format = vertexBundle.attributes[iAttribute].format;
        result = &gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(format)];
    });

    return result;
}

void Mesh::updateSubMesh(index_t primitiveIndex, const IDynamicGeometry &geometry) {
    if (!_struct.dynamic.has_value()) {
        return;
    }

    if (primitiveIndex >= _struct.primitives.size()) {
        return;
    }

    ccstd::vector<const Float32Array *> buffers;
    if (!geometry.positions.empty()) {
        buffers.push_back(&geometry.positions);
    }

    if (geometry.normals.has_value() && !geometry.normals.value().empty()) {
        buffers.push_back(&geometry.normals.value());
    }

    if (geometry.uvs.has_value() && !geometry.uvs.value().empty()) {
        buffers.push_back(&geometry.uvs.value());
    }

    if (geometry.tangents.has_value() && !geometry.tangents.value().empty()) {
        buffers.push_back(&geometry.tangents.value());
    }

    if (geometry.colors.has_value() && !geometry.colors.value().empty()) {
        buffers.push_back(&geometry.colors.value());
    }

    if (geometry.customAttributes.has_value()) {
        for (const auto &ca : geometry.customAttributes.value()) {
            buffers.push_back(&ca.values);
        }
    }

    auto &dynamic = _struct.dynamic.value();
    auto &info = dynamic.info;
    auto &primitive = _struct.primitives[primitiveIndex];
    auto &subMesh = _renderingSubMeshes[primitiveIndex];
    auto &drawInfo = subMesh->getDrawInfo().value();

    // update _data & buffer
    for (auto index = 0U; index < buffers.size(); index++) {
        const auto &vertices = *buffers[index];
        auto &bundle = _struct.vertexBundles[primitive.vertexBundelIndices[index]];
        const auto stride = bundle.view.stride;
        const auto vertexCount = vertices.byteLength() / stride;
        const auto updateSize = vertices.byteLength();
        auto *dstBuffer = _data.buffer()->getData() + bundle.view.offset;
        const auto *srcBuffer = vertices.buffer()->getData() + vertices.byteOffset();
        auto *vertexBuffer = subMesh->getVertexBuffers()[index];
        CC_ASSERT_LE(vertexCount, info.maxSubMeshVertices);

        if (updateSize > 0U) {
            std::memcpy(dstBuffer, srcBuffer, updateSize);
            vertexBuffer->update(srcBuffer, updateSize);
        }

        bundle.view.count = vertexCount;
        drawInfo.vertexCount = vertexCount;
    }

    if (primitive.indexView.has_value()) {
        auto &indexView = primitive.indexView.value();
        const auto &stride = indexView.stride;
        const auto indexCount = (stride == sizeof(uint16_t)) ? geometry.indices16.value().length() : geometry.indices32.value().length();
        const auto updateSize = indexCount * stride;
        auto *dstBuffer = _data.buffer()->getData() + indexView.offset;
        const auto *srcBuffer = (stride == sizeof(uint16_t)) ? geometry.indices16.value().buffer()->getData() + geometry.indices16.value().byteOffset()
                                                             : geometry.indices32.value().buffer()->getData() + geometry.indices32.value().byteOffset();
        auto *indexBuffer = subMesh->getIndexBuffer();
        CC_ASSERT_LE(indexCount, info.maxSubMeshIndices);

        if (updateSize > 0U) {
            std::memcpy(dstBuffer, srcBuffer, updateSize);
            indexBuffer->update(srcBuffer, updateSize);
        }

        indexView.count = indexCount;
        drawInfo.indexCount = indexCount;
    }

    // update bound
    if (geometry.minPos.has_value() && geometry.maxPos.has_value()) {
        Vec3 minPos = geometry.minPos.value();
        Vec3 maxPos = geometry.maxPos.value();

        geometry::AABB box;
        geometry::AABB::fromPoints(minPos, maxPos, &box);
        dynamic.bounds[primitiveIndex] = box;

        Vec3 subMin;
        Vec3 subMax;
        for (const auto &bound : dynamic.bounds) {
            if (bound.isValid()) {
                bound.getBoundary(&subMin, &subMax);
                Vec3::min(minPos, subMin, &minPos);
                Vec3::max(maxPos, subMax, &maxPos);
            }
        }

        _struct.minPosition = minPos;
        _struct.maxPosition = maxPos;
    }

    subMesh->invalidateGeometricInfo();
}

void Mesh::accessAttribute(index_t primitiveIndex, const char *attributeName, const AccessorType &accessor) {
    if (primitiveIndex >= _struct.primitives.size()) {
        return;
    }

    auto &primitive = _struct.primitives[primitiveIndex];
    for (const auto &vertexBundleIndex : primitive.vertexBundelIndices) {
        const auto &vertexBundle = _struct.vertexBundles[vertexBundleIndex];
        auto iter = std::find_if(vertexBundle.attributes.begin(), vertexBundle.attributes.end(), [&](const auto &a) -> bool { return a.name == attributeName; });
        if (iter == vertexBundle.attributes.end()) {
            continue;
        }
        accessor(vertexBundle, static_cast<int>(iter - vertexBundle.attributes.begin()));
        break;
    }
}

void Mesh::tryConvertVertexData() {
#if CC_OPTIMIZE_MESH_DATA
    if (!hasFlag(gfx::Device::getInstance()->getFormatFeatures(gfx::Format::RG16F), gfx::FormatFeature::VERTEX_ATTRIBUTE)) {
        CC_LOG_DEBUG("Does not support half float vertex attribute!");
        return;
    }

    uint8_t *data = _data.buffer()->getData();
    ccstd::vector<uint32_t> attributeIndicsNeedConvert;

    for (auto &vertexBundle : _struct.vertexBundles) {
        // NOTE: Don't use reference here since we need to copy attributes
        const auto orignalAttributes = vertexBundle.attributes;

        auto &attributes = vertexBundle.attributes;
        auto &view = vertexBundle.view;
        uint32_t offset = view.offset;
        uint32_t length = view.length;
        uint32_t count = view.count;
        const uint32_t stride = view.stride;
        uint32_t dstStride = stride;

        CC_ASSERT_EQ(count * stride, length);

        checkAttributesNeedConvert(orignalAttributes, attributes, attributeIndicsNeedConvert, dstStride);
        if (attributeIndicsNeedConvert.empty()) {
            return;
        }

        for (uint32_t i = 0; i < count; ++i) {
            uint8_t *srcIndex = data + offset + i * stride;
            uint8_t *dstIndex = data + offset + i * dstStride;
            uint32_t wroteBytes = 0;

            for (size_t attributeIndex = 0, len = orignalAttributes.size(); attributeIndex < len; ++attributeIndex) {
                const auto &attribute = orignalAttributes[attributeIndex];
                const auto &formatInfo = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attribute.format)];
                const auto iter = std::find(attributeIndicsNeedConvert.cbegin(), attributeIndicsNeedConvert.cend(), attributeIndex);

                if (iter == attributeIndicsNeedConvert.end()) {
                    memmove(dstIndex, srcIndex, formatInfo.size);

                    dstIndex += formatInfo.size;
                    wroteBytes += formatInfo.size;
                    srcIndex += formatInfo.size;
                    continue;
                }

                const float *pValue = reinterpret_cast<const float *>(srcIndex);
                uint16_t *pDst = reinterpret_cast<uint16_t *>(dstIndex);
                uint32_t advance = (formatInfo.size >> 1);

                switch (attribute.format) {
                    case gfx::Format::RGB32F: {
                        convertRGB32FToRGB16F(pValue, pDst);
    #if (CC_PLATFORM == CC_PLATFORM_IOS) || (CC_PLATFORM == CC_PLATFORM_MACOS)
                        // NOTE: Metal needs 4 bytes alignment
                        pDst[3] = 0;
                        advance += (advance % 4);
    #endif

                    } break;
                    case gfx::Format::RG32F: {
                        convertRG32FToRG16F(pValue, pDst);
                    } break;
                    case gfx::Format::RGBA32F: {
                        convertRGBA32FToRGBA16F(pValue, pDst);
                    } break;
                    default:
                        CC_ABORT();
                        break;
                }

                dstIndex += advance;
                wroteBytes += advance;
                srcIndex += formatInfo.size;
            }

            CC_ASSERT_EQ(wroteBytes, dstStride);
        }

        // update stride & length
        view.stride = dstStride;
        view.length = view.stride * view.count;
    }
#endif
}

gfx::BufferList Mesh::createVertexBuffers(gfx::Device *gfxDevice, ArrayBuffer *data) {
    tryConvertVertexData();

    gfx::BufferList buffers;
    buffers.reserve(_struct.vertexBundles.size());
    for (const auto &vertexBundle : _struct.vertexBundles) {
        auto *vertexBuffer = gfxDevice->createBuffer({gfx::BufferUsageBit::VERTEX,
                                                      gfx::MemoryUsageBit::DEVICE,
                                                      vertexBundle.view.length,
                                                      vertexBundle.view.stride});

        vertexBuffer->update(data->getData() + vertexBundle.view.offset, vertexBundle.view.length);
        buffers.emplace_back(vertexBuffer);
    }
    return buffers;
}

void Mesh::initDefault(const ccstd::optional<ccstd::string> &uuid) {
    Super::initDefault(uuid);
    reset({});
}

void Mesh::setAllowDataAccess(bool allowDataAccess) {
    _allowDataAccess = allowDataAccess;
#if !CC_EDITOR
    if (_isMeshDataUploaded && !_allowDataAccess) {
        releaseData();
    }
#endif
}

void Mesh::releaseData() {
    _data.clear();
}

TypedArray Mesh::createTypedArrayWithGFXFormat(gfx::Format format, uint32_t count) {
    const auto &info = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(format)];
    const uint32_t stride = info.size / info.count;

    switch (info.type) {
        case gfx::FormatType::UNORM:
        case gfx::FormatType::UINT: {
            switch (stride) {
                case 1: return Uint8Array(count);
                case 2: return Uint16Array(count);
                case 4: return Uint32Array(count);
                default:
                    break;
            }
            break;
        }
        case gfx::FormatType::SNORM:
        case gfx::FormatType::INT: {
            switch (stride) {
                case 1: return Int8Array(count);
                case 2: return Int16Array(count);
                case 4: return Int32Array(count);
                default:
                    break;
            }
            break;
        }
        case gfx::FormatType::FLOAT: {
            switch (stride) {
                case 2: return Uint16Array(count);
                case 4: return Float32Array(count);
                default:
                    break;
            }
            break;
        }
        default:
            break;
    }

    return Float32Array(count);
}

} // namespace cc
