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

#include "core/assets/RenderingSubMesh.h"
#include <cstdint>
#include "3d/assets/Mesh.h"
#include "3d/misc/Buffer.h"
#include "core/DataView.h"
#include "core/TypedArray.h"
#include "math/Utils.h"
#include "math/Vec3.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {

RenderingSubMesh::RenderingSubMesh(const gfx::BufferList &vertexBuffers,
                                   const gfx::AttributeList &attributes,
                                   gfx::PrimitiveMode primitiveMode)
: RenderingSubMesh(vertexBuffers, attributes, primitiveMode, nullptr, nullptr, true) {
}

RenderingSubMesh::RenderingSubMesh(const gfx::BufferList &vertexBuffers,
                                   const gfx::AttributeList &attributes,
                                   gfx::PrimitiveMode primitiveMode,
                                   gfx::Buffer *indexBuffer)
: RenderingSubMesh(vertexBuffers, attributes, primitiveMode, indexBuffer, nullptr, true) {
}

RenderingSubMesh::RenderingSubMesh(const gfx::BufferList &vertexBuffers,
                                   const gfx::AttributeList &attributes,
                                   gfx::PrimitiveMode primitiveMode,
                                   gfx::Buffer *indexBuffer,
                                   gfx::Buffer *indirectBuffer)
: RenderingSubMesh(vertexBuffers, attributes, primitiveMode, indexBuffer, indirectBuffer, true) {
}

RenderingSubMesh::RenderingSubMesh(const gfx::BufferList &vertexBuffers,
                                   const gfx::AttributeList &attributes,
                                   gfx::PrimitiveMode primitiveMode,
                                   gfx::Buffer *indexBuffer,
                                   gfx::Buffer *indirectBuffer,
                                   bool isOwnerOfIndexBuffer)
: _vertexBuffers(vertexBuffers),
  _attributes(attributes),
  _primitiveMode(primitiveMode),
  _indexBuffer(indexBuffer),
  _indirectBuffer(indirectBuffer),
  _isOwnerOfIndexBuffer(isOwnerOfIndexBuffer) {
    _iaInfo.attributes = attributes;
    _iaInfo.vertexBuffers = vertexBuffers;
    _iaInfo.indexBuffer = indexBuffer;
    _iaInfo.indirectBuffer = indirectBuffer;
}

RenderingSubMesh::~RenderingSubMesh() {
    destroy();
}

const IGeometricInfo &RenderingSubMesh::getGeometricInfo() {
    if (_geometricInfo.has_value()) {
        return _geometricInfo.value();
    }
    // NOLINTNEXTLINE
    static const IGeometricInfo EMPTY_GEOMETRIC_INFO;
    if (_mesh == nullptr) {
        return EMPTY_GEOMETRIC_INFO;
    }

    if (!_subMeshIdx.has_value()) {
        return EMPTY_GEOMETRIC_INFO;
    }

    auto iter = std::find_if(_attributes.cbegin(), _attributes.cend(), [](const gfx::Attribute &element) -> bool {
        return element.name == gfx::ATTR_NAME_POSITION;
    });
    if (iter == _attributes.end()) {
        return EMPTY_GEOMETRIC_INFO;
    }

    const auto &attri = *iter;
    const uint32_t count = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attri.format)].count;

    auto index = static_cast<index_t>(_subMeshIdx.value());
    const auto &positionsVar = _mesh->readAttribute(index, gfx::ATTR_NAME_POSITION);

    Float32Array const *pPositions = nullptr;
    switch (attri.format) {
        case gfx::Format::RG32F:
        case gfx::Format::RGB32F: {
            pPositions = ccstd::get_if<Float32Array>(&positionsVar);
            if (pPositions == nullptr) {
                return EMPTY_GEOMETRIC_INFO;
            }
            break;
        }
        case gfx::Format::RGBA32F: {
            const auto *data = ccstd::get_if<Float32Array>(&positionsVar);
            if (data == nullptr) {
                return EMPTY_GEOMETRIC_INFO;
            }
            const auto count = data->length() / 4;
            auto *pos = ccnew Float32Array(count * 3);
            for (uint32_t i = 0; i < count; i++) {
                const auto dstPtr = i * 3;
                const auto srcPtr = i * 4;
                (*pos)[dstPtr] = (*data)[srcPtr];
                (*pos)[dstPtr + 1] = (*data)[srcPtr + 1];
                (*pos)[dstPtr + 2] = (*data)[srcPtr + 2];
            }
            pPositions = pos;
            break;
        }
        case gfx::Format::RG16F:
        case gfx::Format::RGB16F: {
            const auto *data = ccstd::get_if<Uint16Array>(&positionsVar);
            if (data == nullptr) {
                return EMPTY_GEOMETRIC_INFO;
            }
            auto *pos = ccnew Float32Array(data->length());
            for (uint32_t i = 0; i < data->length(); ++i) {
                (*pos)[i] = mathutils::halfToFloat((*data)[i]);
            }
            pPositions = pos;
            break;
        }
        case gfx::Format::RGBA16F: {
            const auto *data = ccstd::get_if<Uint16Array>(&positionsVar);
            if (data == nullptr) {
                return EMPTY_GEOMETRIC_INFO;
            }
            const auto count = data->length() / 4;
            auto *pos = ccnew Float32Array(count * 3);
            for (uint32_t i = 0; i < count; i++) {
                const auto dstPtr = i * 3;
                const auto srcPtr = i * 4;
                (*pos)[dstPtr] = mathutils::halfToFloat((*data)[srcPtr]);
                (*pos)[dstPtr + 1] = mathutils::halfToFloat((*data)[srcPtr + 1]);
                (*pos)[dstPtr + 2] = mathutils::halfToFloat((*data)[srcPtr + 2]);
            }
            pPositions = pos;
            break;
        }
        default:
            return EMPTY_GEOMETRIC_INFO;
    };

    const auto &positions = *pPositions;
    const auto &indicesVar = _mesh->readIndices(index);

    Vec3 max;
    Vec3 min;

    if (count == 2) {
        max.set(positions[0], positions[1], 0);
        min.set(positions[0], positions[1], 0);
    } else {
        max.set(positions[0], positions[1], positions[2]);
        min.set(positions[0], positions[1], positions[2]);
    }

    for (int i = 0; i < positions.length(); i += static_cast<int>(count)) {
        if (count == 2) {
            max.x = positions[i] > max.x ? positions[i] : max.x;
            max.y = positions[i + 1] > max.y ? positions[i + 1] : max.y;
            min.x = positions[i] < min.x ? positions[i] : min.x;
            min.y = positions[i + 1] < min.y ? positions[i + 1] : min.y;
        } else {
            max.x = positions[i] > max.x ? positions[i] : max.x;
            max.y = positions[i + 1] > max.y ? positions[i + 1] : max.y;
            max.z = positions[i + 2] > max.z ? positions[i + 2] : max.z;
            min.x = positions[i] < min.x ? positions[i] : min.x;
            min.y = positions[i + 1] < min.y ? positions[i + 1] : min.y;
            min.z = positions[i + 2] < min.z ? positions[i + 2] : min.z;
        }
    }

    IGeometricInfo info;
    info.positions = positions;
    info.indices = indicesVar;
    info.boundingBox.max = max;
    info.boundingBox.min = min;

    _geometricInfo = info;
    return _geometricInfo.value();
}

void RenderingSubMesh::genFlatBuffers() {
    if (!_flatBuffers.empty() || _mesh == nullptr || !_subMeshIdx.has_value()) {
        return;
    }

    uint32_t idxCount = 0;
    const auto &prim = _mesh->getStruct().primitives[_subMeshIdx.value()];
    if (prim.indexView.has_value()) {
        idxCount = prim.indexView.value().count;
    }
    for (size_t i = 0; i < prim.vertexBundelIndices.size(); i++) {
        const uint32_t bundleIdx = prim.vertexBundelIndices[i];
        const Mesh::IVertexBundle &vertexBundle = _mesh->getStruct().vertexBundles[bundleIdx];
        const uint32_t vbCount = prim.indexView.has_value() ? prim.indexView.value().count : vertexBundle.view.count;
        const uint32_t vbStride = vertexBundle.view.stride;
        const uint32_t vbSize = vbStride * vbCount;
        Uint8Array view(_mesh->getData().buffer(), vertexBundle.view.offset, vertexBundle.view.length);
        Uint8Array sharedView(prim.indexView.has_value() ? vbSize : vertexBundle.view.length);

        if (!prim.indexView.has_value()) {
            sharedView.set(_mesh->getData().subarray(vertexBundle.view.offset, vertexBundle.view.offset + vertexBundle.view.length));
            _flatBuffers.emplace_back(IFlatBuffer{vbStride, vbCount, sharedView});
            continue;
        }

        IBArray ibView = _mesh->readIndices(static_cast<int>(_subMeshIdx.value()));
        // transform to flat buffer
        for (uint32_t n = 0; n < idxCount; ++n) {
            auto idx = getIBArrayValue<int32_t>(ibView, static_cast<int>(n));
            uint32_t offset = n * vbStride;
            uint32_t srcOffset = idx * vbStride;
            for (uint32_t m = 0; m < vbStride; ++m) {
                sharedView[static_cast<int>(offset + m)] = view[static_cast<int>(srcOffset + m)];
            }
        }
        _flatBuffers.emplace_back(IFlatBuffer{vbStride, vbCount, std::move(sharedView)});
    }
}

void RenderingSubMesh::enableVertexIdChannel(gfx::Device *device) {
    if (_vertexIdChannel.has_value()) {
        return;
    }

    const auto streamIndex = static_cast<uint32_t>(_vertexBuffers.size());
    const auto attributeIndex = static_cast<uint32_t>(_attributes.size());

    gfx::Buffer *vertexIdBuffer = allocVertexIdBuffer(device);
    _vertexBuffers.pushBack(vertexIdBuffer);
    _attributes.push_back({"a_vertexId", gfx::Format::R32F, false, streamIndex, false, 0});

    _iaInfo.attributes = _attributes;
    _iaInfo.vertexBuffers = _vertexBuffers.get();

    _vertexIdChannel = VertexIdChannel{
        streamIndex,
        attributeIndex,
    };
}

bool RenderingSubMesh::destroy() {
    _vertexBuffers.clear();
    _indexBuffer = nullptr;
    _indirectBuffer = nullptr;

    if (!_jointMappedBuffers.empty() && !_jointMappedBufferIndices.empty()) {
        for (uint32_t index : _jointMappedBufferIndices) {
            _jointMappedBuffers.at(index)->destroy();
        }
        _jointMappedBuffers.clear();
        _jointMappedBufferIndices.clear();
    }
    return true;
}

const gfx::BufferList &RenderingSubMesh::getJointMappedBuffers() {
    if (!_jointMappedBuffers.empty()) {
        return _jointMappedBuffers.get();
    }

    auto &buffers = _jointMappedBuffers;
    auto &indices = _jointMappedBufferIndices;

    if (!_mesh || !_subMeshIdx.has_value()) {
        _jointMappedBuffers = _vertexBuffers;
        return _jointMappedBuffers.get();
    }

    const auto &structInfo = _mesh->getStruct();
    const auto &prim = structInfo.primitives[_subMeshIdx.value()];
    if (!structInfo.jointMaps.has_value() || !prim.jointMapIndex.has_value() || structInfo.jointMaps.value()[prim.jointMapIndex.value()].empty()) {
        _jointMappedBuffers = _vertexBuffers;
        return _jointMappedBuffers.get();
    }
    gfx::Format jointFormat = gfx::Format::UNKNOWN;
    int32_t jointOffset = 0;
    gfx::Device *device = gfx::Device::getInstance();
    for (size_t i = 0; i < prim.vertexBundelIndices.size(); i++) {
        const auto &bundle = structInfo.vertexBundles[prim.vertexBundelIndices[i]];
        jointOffset = 0;
        jointFormat = gfx::Format::UNKNOWN;
        for (const auto &attr : bundle.attributes) {
            if (attr.name == gfx::ATTR_NAME_JOINTS) {
                jointFormat = attr.format;
                break;
            }
            jointOffset += static_cast<int32_t>(gfx::GFX_FORMAT_INFOS[static_cast<int32_t>(attr.format)].size);
        }
        if (jointFormat != gfx::Format::UNKNOWN) {
            Uint8Array data{_mesh->getData().buffer(), bundle.view.offset, bundle.view.length};
            DataView dataView(data.slice().buffer());
            const auto &idxMap = structInfo.jointMaps.value()[prim.jointMapIndex.value()];

            mapBuffer(
                dataView, [&](const DataVariant &cur, uint32_t /*idx*/, const DataView & /*view*/) -> DataVariant {
                    if (ccstd::holds_alternative<int32_t>(cur)) {
                        auto iter = std::find(idxMap.begin(), idxMap.end(), ccstd::get<int32_t>(cur));
                        if (iter != idxMap.end()) {
                            return static_cast<int32_t>(iter - idxMap.begin());
                        }
                    }
                    CC_ABORT();
                    return -1;
                },
                jointFormat, jointOffset, bundle.view.length, bundle.view.stride, &dataView);

            auto *buffer = device->createBuffer(gfx::BufferInfo{
                gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
                gfx::MemoryUsageBit::DEVICE,
                bundle.view.length,
                bundle.view.stride});

            buffer->update(dataView.buffer()->getData());
            buffers.pushBack(buffer);
            indices.emplace_back(i);
        } else {
            buffers.pushBack(_vertexBuffers.at(prim.vertexBundelIndices[i]));
        }
    }

    if (_vertexIdChannel) {
        buffers.pushBack(allocVertexIdBuffer(device));
    }
    return buffers.get();
}

gfx::Buffer *RenderingSubMesh::allocVertexIdBuffer(gfx::Device *device) {
    const uint32_t vertexCount = (_vertexBuffers.empty() || _vertexBuffers.at(0)->getStride() == 0)
                                     ? 0
                                     // TODO(minggo): This depends on how stride of a vertex buffer is defined; Consider padding problem.
                                     : _vertexBuffers.at(0)->getSize() / _vertexBuffers.at(0)->getStride();

    ccstd::vector<float> vertexIds(vertexCount);
    for (int iVertex = 0; iVertex < vertexCount; ++iVertex) {
        // `+0.5` because on some platforms, the "fetched integer" may have small error.
        // For example `26` may yield `25.99999`, which is convert to `25` instead of `26` using `int()`.
        vertexIds[iVertex] = static_cast<float>(iVertex) + 0.5F;
    }

    uint32_t vertexIdxByteLength = sizeof(float) * vertexCount;
    gfx::Buffer *vertexIdBuffer = device->createBuffer({
        gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::DEVICE,
        vertexIdxByteLength,
        sizeof(float),
    });
    vertexIdBuffer->update(vertexIds.data(), vertexIdxByteLength);

    return vertexIdBuffer;
}

} // namespace cc
