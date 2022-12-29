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

#pragma once

#include "3d/assets/Types.h"
#include "base/RefCounted.h"
#include "base/RefVector.h"
#include "base/std/variant.h"
#include "core/TypedArray.h"
#include "core/Types.h"
#include "renderer/gfx-base/GFXDef.h"

namespace cc {

class Mesh;

/**
 * @en The interface of geometric information
 * @zh 几何信息。
 */
struct IGeometricInfo {
    /**
     * @en Vertex positions
     * @zh 顶点位置。
     */
    Float32Array positions;

    /**
     * @en Indices data
     * @zh 索引数据。
     */
    ccstd::optional<IBArray> indices;

    /**
     * @en Whether the geometry is treated as double sided
     * @zh 是否将图元按双面对待。
     */
    ccstd::optional<bool> doubleSided;

    /**
     * @en The bounding box
     * @zh 此几何体的轴对齐包围盒。
     */
    BoundingBox boundingBox;
};

/**
 * @en Flat vertex buffer
 * @zh 扁平化顶点缓冲区
 */
struct IFlatBuffer {
    uint32_t stride{0};
    uint32_t count{0};
    Uint8Array buffer;
};

namespace gfx {
class Buffer;
}
/**
 * @en Sub mesh for rendering which contains all geometry data, it can be used to create [[InputAssembler]].
 * @zh 包含所有顶点数据的渲染子网格，可以用来创建 [[InputAssembler]]。
 */
class RenderingSubMesh : public RefCounted {
public:
    RenderingSubMesh(const gfx::BufferList &vertexBuffers,
                     const gfx::AttributeList &attributes,
                     gfx::PrimitiveMode primitiveMode);

    RenderingSubMesh(const gfx::BufferList &vertexBuffers,
                     const gfx::AttributeList &attributes,
                     gfx::PrimitiveMode primitiveMode,
                     gfx::Buffer *indexBuffer);

    RenderingSubMesh(const gfx::BufferList &vertexBuffers,
                     const gfx::AttributeList &attributes,
                     gfx::PrimitiveMode primitiveMode,
                     gfx::Buffer *indexBuffer,
                     gfx::Buffer *indirectBuffer);

    RenderingSubMesh(const gfx::BufferList &vertexBuffers,
                     const gfx::AttributeList &attributes,
                     gfx::PrimitiveMode primitiveMode,
                     gfx::Buffer *indexBuffer,
                     gfx::Buffer *indirectBuffer,
                     bool isOwnerOfIndexBuffer);

    ~RenderingSubMesh() override;

    /**
      * @en All vertex attributes used by the sub mesh
      * @zh 所有顶点属性。
      */
    inline const gfx::AttributeList &getAttributes() const { return _attributes; }

    /**
     * @en All vertex buffers used by the sub mesh
     * @zh 使用的所有顶点缓冲区。
     */
    inline const gfx::BufferList &getVertexBuffers() const { return _vertexBuffers.get(); }

    /**
     * @en Index buffer used by the sub mesh
     * @zh 使用的索引缓冲区，若未使用则无需指定。
     */
    inline gfx::Buffer *getIndexBuffer() const { return _indexBuffer; }

    /**
     * @en Indirect buffer used by the sub mesh
     * @zh 间接绘制缓冲区。
     */
    inline gfx::Buffer *indirectBuffer() const { return _indirectBuffer; }

    /**
     * @en The geometric info of the sub mesh, used for raycast.
     * @zh （用于射线检测的）几何信息。
     */
    const IGeometricInfo &getGeometricInfo();

    /**
     * @en Invalidate the geometric info of the sub mesh after geometry changed.
     * @zh 网格更新后，设置（用于射线检测的）几何信息为无效，需要重新计算。
     */
    inline void invalidateGeometricInfo() { _geometricInfo.reset(); }

    /**
     * @en Primitive mode used by the sub mesh
     * @zh 图元类型。
     */
    inline gfx::PrimitiveMode getPrimitiveMode() const { return _primitiveMode; }

    /**
     * @en Flatted vertex buffers
     * @zh 扁平化的顶点缓冲区。
     */
    inline const ccstd::vector<IFlatBuffer> &getFlatBuffers() const { return _flatBuffers; }
    inline void setFlatBuffers(const ccstd::vector<IFlatBuffer> &flatBuffers) { _flatBuffers = flatBuffers; }

    void genFlatBuffers();

    inline const gfx::InputAssemblerInfo &getIaInfo() const { return _iaInfo; }
    inline gfx::InputAssemblerInfo &getIaInfo() { return _iaInfo; }

    inline void setDrawInfo(const gfx::DrawInfo &info) { _drawInfo = info; }
    inline ccstd::optional<gfx::DrawInfo> &getDrawInfo() { return _drawInfo; }

    /**
     * @en The vertex buffer for joint after mapping
     * @zh 骨骼索引按映射表处理后的顶点缓冲。
     */
    const gfx::BufferList &getJointMappedBuffers();

    bool destroy();

    /**
     * @en Adds a vertex attribute input called 'a_vertexId' into this sub-mesh.
     * This is useful if you want to simulate `gl_VertexId` in WebGL context prior to 2.0.
     * Once you call this function, the vertex attribute is permanently added.
     * Subsequent calls to this function take no effect.
     * @param device Device used to create related rendering resources.
     */
    void enableVertexIdChannel(gfx::Device *device);

    inline void setMesh(Mesh *mesh) { _mesh = mesh; }
    inline Mesh *getMesh() const { return _mesh; }

    inline void setSubMeshIdx(const ccstd::optional<uint32_t> &idx) { _subMeshIdx = idx; }
    inline const ccstd::optional<uint32_t> &getSubMeshIdx() const { return _subMeshIdx; }

private:
    gfx::Buffer *allocVertexIdBuffer(gfx::Device *device);

    bool _isOwnerOfIndexBuffer{true};

    // Mesh will includes RenderingSubMesh, so use Mesh* here.
    Mesh *_mesh{nullptr};
    ccstd::optional<uint32_t> _subMeshIdx;

    ccstd::vector<IFlatBuffer> _flatBuffers;

    // As gfx::InputAssemblerInfo needs the data structure, so not use IntrusivePtr.
    RefVector<gfx::Buffer *> _jointMappedBuffers;

    ccstd::vector<uint32_t> _jointMappedBufferIndices;

    ccstd::optional<VertexIdChannel> _vertexIdChannel;

    ccstd::optional<IGeometricInfo> _geometricInfo;

    // As gfx::InputAssemblerInfo needs the data structure, so not use IntrusivePtr.
    RefVector<gfx::Buffer *> _vertexBuffers;

    gfx::AttributeList _attributes;

    IntrusivePtr<gfx::Buffer> _indexBuffer;

    IntrusivePtr<gfx::Buffer> _indirectBuffer;

    gfx::PrimitiveMode _primitiveMode{gfx::PrimitiveMode::TRIANGLE_LIST};

    gfx::InputAssemblerInfo _iaInfo;

    ccstd::optional<gfx::DrawInfo> _drawInfo;

    CC_DISALLOW_COPY_MOVE_ASSIGN(RenderingSubMesh);
};

} // namespace cc
