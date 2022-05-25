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

#include "base/std/optional.h"

#include "3d/assets/Mesh.h"
#include "primitive/PrimitiveDefine.h"

namespace cc {

struct ICreateMeshOptions {
    /**
     * @en calculate mesh's aabb or not
     * @zh 是否计算模型的包围盒。
     */
    ccstd::optional<bool> calculateBounds;
};

struct ICreateDynamicMeshOptions {
    /**
     * @en max submesh count
     * @zh 最大子模型个数。
     */
    uint32_t maxSubMeshes{1U};

    /**
     * @en max submesh vertex count
     * @zh 子模型最大顶点个数。
     */
    uint32_t maxSubMeshVertices{1024U};

    /**
     * @en max submesh index count
     * @zh 子模型最大索引个数。
     */
    uint32_t maxSubMeshIndices{1024U};
};

/**
 * @en mesh utility class, use to create mesh.
 * @zh 网格工具类，用于创建网格。
 */
class MeshUtils {
public:
    /**
     * @en create a static mesh.
     * @zh 创建一个静态网格。
     */
    static Mesh *createMesh(const IGeometry &geometry, Mesh *out = nullptr, const ICreateMeshOptions &options = {});

    /**
     * @en create a static mesh ICreateInfo.
     * @zh 创建一个静态网格ICreateInfo。
     */
    static Mesh::ICreateInfo createMeshInfo(const IGeometry &geometry, const ICreateMeshOptions &options = {});

    /**
     * @en create a dynamic mesh.
     * @zh 创建一个动态网格。
     */
    static Mesh *createDynamicMesh(index_t primitiveIndex, const IDynamicGeometry &geometry, Mesh *out = nullptr, const ICreateDynamicMeshOptions &options = {});

    /**
     * @en create a dynamic mesh ICreateInfo.
     * @zh 创建一个动态网格ICreateInfo。
     */
    static Mesh::ICreateInfo createDynamicMeshInfo(const IDynamicGeometry &geometry, const ICreateDynamicMeshOptions &options = {});
};

} // namespace cc
