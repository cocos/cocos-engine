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

#include "3d/assets/MorphRendering.h"
#include "3d/assets/Types.h"
#include "cocos/base/Optional.h"
#include "core/assets/Asset.h"
#include "core/geometry/AABB.h"
#include "math/Mat4.h"
#include "math/Vec3.h"
#include "renderer/gfx-base/GFXDef.h"

namespace cc {

class Skeleton;
class RenderingSubMesh;

/**
 * @en Mesh asset
 * @zh 网格资源。
 */
class Mesh : public Asset {
public:
    using Super = Asset;

    using IBufferView = IMeshBufferView;

    /**
     * @en Vertex bundle, it describes a set of interleaved vertex attributes and their values.
     * @zh 顶点块。顶点块描述了一组**交错排列**（interleaved）的顶点属性并存储了顶点属性的实际数据。<br>
     * 交错排列是指在实际数据的缓冲区中，每个顶点的所有属性总是依次排列，并总是出现在下一个顶点的所有属性之前。
     */
    struct IVertexBundle {
        cc::optional<uint8_t> _padding; // NOTE: avoid jsb cache map
        /**
         * @en The actual value for all vertex attributes.
         * You must use DataView to access the data.
         * @zh 所有顶点属性的实际数据块。
         * 你必须使用 DataView 来读取数据。
         * 因为不能保证所有属性的起始偏移都按 TypedArray 要求的字节对齐。
         */
        IBufferView view;

        /**
         * @en All attributes included in the bundle
         * @zh 包含的所有顶点属性。
         */
        gfx::AttributeList attributes;
    };

    /**
     * @en Sub mesh contains a list of primitives with the same type (Point, Line or Triangle)
     * @zh 子网格。子网格由一系列相同类型的图元组成（例如点、线、面等）。
     */
    struct ISubMesh {
        /**
         * @en The vertex bundle references used by the sub mesh.
         * @zh 此子网格引用的顶点块，索引至网格的顶点块数组。
         */
        std::vector<uint32_t> vertexBundelIndices;

        /**
         * @en The primitive mode of the sub mesh
         * @zh 此子网格的图元类型。
         */
        gfx::PrimitiveMode primitiveMode;

        /**
         * @en The index data of the sub mesh
         * @zh 此子网格使用的索引数据。
         */
        cc::optional<IBufferView> indexView;

        /**
         * @en The joint map index in [[IStruct.jointMaps]]. Could be absent
         * @zh 此子网格使用的关节索引映射表在 [[IStruct.jointMaps]] 中的索引。
         * 如未定义或指向的映射表不存在，则默认 VB 内所有关节索引数据直接对应骨骼资源数据。
         */
        cc::optional<uint32_t> jointMapIndex;
    };

    /**
     * @en The structure of the mesh
     * @zh 描述了网格的结构。
     */
    struct IStruct {
        /**
         * @en All vertex bundles of the mesh
         * @zh 此网格所有的顶点块。
         */
        std::vector<IVertexBundle> vertexBundles;

        /**
         * @en All sub meshes
         * @zh 此网格的所有子网格。
         */
        std::vector<ISubMesh> primitives;

        /**
         * @en The minimum position of all vertices in the mesh
         * @zh （各分量都）小于等于此网格任何顶点位置的最大位置。
         */
        cc::optional<Vec3> minPosition;

        /**
         * @en The maximum position of all vertices in the mesh
         * @zh （各分量都）大于等于此网格任何顶点位置的最小位置。
         */
        cc::optional<Vec3> maxPosition;

        /**
         * @en The joint index map list.
         * @zh 此网格使用的关节索引映射关系列表，数组长度应为子模型中实际使用到的所有关节，
         * 每个元素都对应一个原骨骼资源里的索引，按子模型 VB 内的实际索引排列。
         */
        cc::optional<std::vector<std::vector<index_t>>> jointMaps;

        /**
         * @en The morph information of the mesh
         * @zh 网格的形变数据
         */
        cc::optional<Morph> morph;
    };

    struct ICreateInfo {
        /**
         * @en Mesh structure
         * @zh 网格结构。
         */
        IStruct structInfo;

        /**
         * @en Mesh binary data
         * @zh 网格二进制数据。
         */
        Uint8Array data;
    };

    Mesh() = default;
    ~Mesh() override;

    cc::any getNativeAsset() const override;
    void    setNativeAsset(const cc::any &obj) override;

    void setAssetData(cc::ArrayBuffer *data) {
        _data = Uint8Array(data);
    }
    const Uint8Array &getAssetData() {
        return _data;
    }

    /**
     * @en The sub meshes count of the mesh.
     * @zh 此网格的子网格数量。
     * @deprecated Please use [[renderingSubMeshes.length]] instead
     */
    uint32_t getSubMeshCount() const;

    /**
     * @en The minimum position of all vertices in the mesh
     * @zh （各分量都）小于等于此网格任何顶点位置的最大位置。
     * @deprecated Please use [[struct.minPosition]] instead
     */
    const Vec3 &getMinPosition() const;

    /**
     * @en The maximum position of all vertices in the mesh
     * @zh （各分量都）大于等于此网格任何顶点位置的最大位置。
     * @deprecated Please use [[struct.maxPosition]] instead
     */
    const Vec3 &getMaxPosition() const;

    /**
     * @en The struct of the mesh
     * @zh 此网格的结构。
     */
    inline const IStruct &getStruct() const {
        return _struct;
    }

    inline void setStruct(const IStruct &input) {
        _struct = input;
    }

    inline Uint8Array &getData() {
        return _data;
    }

    inline void setData(const Uint8Array &data) {
        _data = data;
    }

    /**
     * @en The hash of the mesh
     * @zh 此网格的哈希值。
     */
    uint64_t getHash();

    inline double getHashForJS() {
        return static_cast<double>(getHash());
    }

    /**
     * @en Set the hash of the mesh
     * @zh 设置此网格的哈希值。
     */
    void setHash(uint64_t hash) { _hash = hash; }

    using JointBufferIndicesType = std::vector<index_t>;
    /**
     * The index of the joint buffer of all sub meshes in the joint map buffers
     */
    const JointBufferIndicesType &getJointBufferIndices();

    using RenderingSubMeshList = std::vector<IntrusivePtr<RenderingSubMesh>>;
    /**
     * @en The sub meshes for rendering. Mesh could be split into different sub meshes for rendering.
     * @zh 此网格创建的渲染网格。
     */
    inline const RenderingSubMeshList &getRenderingSubMeshes() {
        initialize();
        return _renderingSubMeshes;
    }

    void onLoaded() override {
        initialize();
    }

    void initialize();

    /**
     * @en Destroy the mesh and release all related GPU resources
     * @zh 销毁此网格，并释放它占有的所有 GPU 资源。
     */
    bool destroy() override {
        destroyRenderingMesh();
        return Super::destroy();
    }

    /**
     * @en Release all related GPU resources
     * @zh 释放此网格占有的所有 GPU 资源。
     */
    void destroyRenderingMesh();

    /**
     * @en Reset the struct and data of the mesh
     * @zh 重置此网格的结构和数据。
     * @param struct The new struct
     * @param data The new data
     * @deprecated Will be removed in v3.0.0, please use [[reset]] instead
     */
    void assign(const IStruct &structInfo, const Uint8Array &data);

    /**
     * @en Reset the mesh with mesh creation information
     * @zh 重置此网格。
     * @param info Mesh creation information including struct and data
     */
    void reset(ICreateInfo &&info);

    using BoneSpaceBounds = std::vector<IntrusivePtr<geometry::AABB>>;
    /**
     * @en Get [[AABB]] bounds in the skeleton's bone space
     * @zh 获取骨骼变换空间内下的 [[AABB]] 包围盒
     * @param skeleton
     */
    BoneSpaceBounds getBoneSpaceBounds(Skeleton *skeleton);

    /**
     * @en Merge the given mesh into the current mesh
     * @zh 合并指定的网格到此网格中。
     * @param mesh The mesh to be merged
     * @param worldMatrix The world matrix of the given mesh
     * @param [validate=false] Whether to validate the mesh
     * @returns Check the mesh state and return the validation result.
     */
    bool merge(Mesh *mesh, const Mat4 *worldMatrix = nullptr, bool validate = false);

    /**
     * @en Validation for whether the given mesh can be merged into the current mesh.
     * To pass the validation, it must satisfy either of these two requirements:
     * - When the current mesh have no data
     * - When the two mesh have the same vertex bundle count, the same sub meshes count, and the same sub mesh layout.
     *
     * Same mesh layout means:
     * - They have the same primitive type and reference to the same amount vertex bundle with the same indices.
     * - And they all have or don't have index view
     * @zh 验证指定网格是否可以合并至当前网格。
     *
     * 当满足以下条件之一时，指定网格可以合并至当前网格：
     *  - 当前网格无数据而待合并网格有数据；
     *  - 它们的顶点块数目相同且对应顶点块的布局一致，并且它们的子网格数目相同且对应子网格的布局一致。
     *
     * 两个顶点块布局一致当且仅当：
     *  - 它们具有相同数量的顶点属性且对应的顶点属性具有相同的属性格式。
     *
     * 两个子网格布局一致，当且仅当：
     *  - 它们具有相同的图元类型并且引用相同数量、相同索引的顶点块；并且，
     *  - 要么都需要索引绘制，要么都不需要索引绘制。
     * @param mesh The other mesh to be validated
     */
    bool validateMergingMesh(Mesh *mesh);

    /**
     * @en Read the requested attribute of the given sub mesh
     * @zh 读取子网格的指定属性。
     * @param primitiveIndex Sub mesh index
     * @param attributeName Attribute name
     * @returns Return null if not found or can't read, otherwise, will create a large enough typed array to contain all data of the attribute,
     * the array type will match the data type of the attribute.
     */
    TypedArray readAttribute(index_t primitiveIndex, const char *attributeName);

    /**
     * @en Read the requested attribute of the given sub mesh and fill into the given buffer.
     * @zh 读取子网格的指定属性到目标缓冲区中。
     * @param primitiveIndex Sub mesh index
     * @param attributeName Attribute name
     * @param buffer The target array buffer
     * @param stride Byte distance between two attributes in the target buffer
     * @param offset The offset of the first attribute in the target buffer
     * @returns Return false if failed to access attribute, return true otherwise.
     */
    bool copyAttribute(index_t primitiveIndex, const char *attributeName, ArrayBuffer *buffer, uint32_t stride, uint32_t offset);

    /**
     * @en Read the indices data of the given sub mesh
     * @zh 读取子网格的索引数据。
     * @param primitiveIndex Sub mesh index
     * @returns Return null if not found or can't read, otherwise, will create a large enough typed array to contain all indices data,
     * the array type will use the corresponding stride size.
     */
    IBArray readIndices(index_t primitiveIndex);

    /**
     * @en Read the indices data of the given sub mesh and fill into the given array
     * @zh 读取子网格的索引数据到目标数组中。
     * @param primitiveIndex Sub mesh index
     * @param outputArray The target output array
     * @returns Return false if failed to access the indices data, return true otherwise.
     */
    bool copyIndices(index_t primitiveIndex, TypedArray &outputArray);

private:
    using AccessorType = std::function<void(const IVertexBundle &vertexBundle, int32_t iAttribute)>;

    void accessAttribute(index_t primitiveIndex, const char *attributeName, const AccessorType &accessor);

    gfx::BufferList createVertexBuffers(gfx::Device *gfxDevice, ArrayBuffer *data);

    void initDefault(const cc::optional<std::string> &uuid) override;
    bool validate() const override;

    static TypedArray createTypedArrayWithGFXFormat(gfx::Format format, uint32_t count);

public:
    IntrusivePtr<MorphRendering> morphRendering;

private:
    IStruct    _struct;
    uint64_t   _hash{0};
    Uint8Array _data;

    bool _initialized{false};

    RenderingSubMeshList _renderingSubMeshes;

    std::unordered_map<uint64_t, BoneSpaceBounds> _boneSpaceBounds;

    JointBufferIndicesType _jointBufferIndices;

    friend class MeshDeserializer;

    CC_DISALLOW_COPY_MOVE_ASSIGN(Mesh);
};

} // namespace cc
