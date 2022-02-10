/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include "3d/assets/Types.h"
#include "base/Vector.h"
#include "cocos/base/Variant.h"
#include "core/TypedArray.h"
#include "core/assets/Asset.h"
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
    cc::optional<IBArray> indices;

    /**
     * @en Whether the geometry is treated as double sided
     * @zh 是否将图元按双面对待。
     */
    cc::optional<bool> doubleSided;

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
    uint32_t   stride{0};
    uint32_t   count{0};
    Uint8Array buffer;
};

namespace gfx {
class Buffer;
}
/**
 * @en Sub mesh for rendering which contains all geometry data, it can be used to create [[InputAssembler]].
 * @zh 包含所有顶点数据的渲染子网格，可以用来创建 [[InputAssembler]]。
 */
class RenderingSubMesh final : public Asset {
public:
    RenderingSubMesh(const gfx::BufferList &   vertexBuffers,
                     const gfx::AttributeList &attributes,
                     gfx::PrimitiveMode        primitiveMode);

    RenderingSubMesh(const gfx::BufferList &   vertexBuffers,
                     const gfx::AttributeList &attributes,
                     gfx::PrimitiveMode        primitiveMode,
                     gfx::Buffer *             indexBuffer);

    RenderingSubMesh(const gfx::BufferList &   vertexBuffers,
                     const gfx::AttributeList &attributes,
                     gfx::PrimitiveMode        primitiveMode,
                     gfx::Buffer *             indexBuffer,
                     gfx::Buffer *             indirectBuffer);

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
     * @en Primitive mode used by the sub mesh
     * @zh 图元类型。
     */
    inline gfx::PrimitiveMode getPrimitiveMode() const { return _primitiveMode; }

    /**
     * @en Flatted vertex buffers
     * @zh 扁平化的顶点缓冲区。
     */
    inline const std::vector<IFlatBuffer> &getFlatBuffers() const { return _flatBuffers; }
    inline void                            setFlatBuffers(const std::vector<IFlatBuffer> &flatBuffers) { _flatBuffers = flatBuffers; }

    void genFlatBuffers();

    inline const gfx::InputAssemblerInfo &getIaInfo() const { return _iaInfo; }
    inline gfx::InputAssemblerInfo &      getIaInfo() { return _iaInfo; }

    /**
     * @en The vertex buffer for joint after mapping
     * @zh 骨骼索引按映射表处理后的顶点缓冲。
     */
    const gfx::BufferList &getJointMappedBuffers();

    bool destroy() override;

    /**
     * @en Adds a vertex attribute input called 'a_vertexId' into this sub-mesh.
     * This is useful if you want to simulate `gl_VertexId` in WebGL context prior to 2.0.
     * Once you call this function, the vertex attribute is permanently added.
     * Subsequent calls to this function take no effect.
     * @param device Device used to create related rendering resources.
     */
    void enableVertexIdChannel(gfx::Device *device);

    inline void  setMesh(Mesh *mesh) { _mesh = mesh; }
    inline Mesh *getMesh() const { return _mesh; }

    inline void                          setSubMeshIdx(uint32_t idx) { _subMeshIdx = idx; }
    inline const cc::optional<uint32_t> &getSubMeshIdx() const { return _subMeshIdx; }

private:
    gfx::Buffer *allocVertexIdBuffer(gfx::Device *device);

    // Mesh will includes RenderingSubMesh, so use Mesh* here.
    Mesh *                 _mesh{nullptr};
    cc::optional<uint32_t> _subMeshIdx;

    std::vector<IFlatBuffer> _flatBuffers;

    // As gfx::InputAssemblerInfo needs the data structure, so not use IntrusivePtr.
    Vector<gfx::Buffer *> _jointMappedBuffers;

    std::vector<uint32_t> _jointMappedBufferIndices;

    cc::optional<VertexIdChannel> _vertexIdChannel;

    cc::optional<IGeometricInfo> _geometricInfo;

    // As gfx::InputAssemblerInfo needs the data structure, so not use IntrusivePtr.
    Vector<gfx::Buffer *> _vertexBuffers;

    gfx::AttributeList _attributes;

    IntrusivePtr<gfx::Buffer> _indexBuffer;

    IntrusivePtr<gfx::Buffer> _indirectBuffer;

    gfx::PrimitiveMode _primitiveMode{gfx::PrimitiveMode::TRIANGLE_LIST};

    gfx::InputAssemblerInfo _iaInfo;

    CC_DISALLOW_COPY_MOVE_ASSIGN(RenderingSubMesh);
};

} // namespace cc
