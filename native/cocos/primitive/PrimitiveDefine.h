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

#include <vector>
#include "cocos/base/Optional.h"

#include "renderer/gfx-base/GFXDef.h"

#include "math/Vec3.h"
#include "math/Vec4.h"

namespace cc {

/**
 * @en
 * The definition of the parameter for building a primitive geometry.
 * @zh
 * 几何体参数选项。
 */
struct IGeometryOptions {
    /**
     * @en
     * Whether to include normal. Default to true.
     * @zh
     * 是否包含法线。默认为true。
     */
    bool includeNormal{true};

    /**
     * @en
     * Whether to include uv. Default to true.
     * @zh
     * 是否包含UV。默认为true。
     */
    bool includeUV{true};
};

/**
 * @en
 * The definition of the geometry, this struct can build a mesh.
 * @zh
 * 几何体信息。
 */
struct IGeometry {
    /**
     * @en
     * Vertex positions.
     * @zh
     * 顶点位置。
     */
    std::vector<float> positions;

    /**
     * @en
     * Vertex normals.
     * @zh
     * 顶点法线。
     */
    cc::optional<std::vector<float>> normals;

    /**
     * @en
     * Texture coordinates.
     * @zh
     * 纹理坐标。
     */
    cc::optional<std::vector<float>> uvs;

    /**
     * @en
     * Vertex Tangents.
     * @zh
     * 顶点切线。
     */
    cc::optional<std::vector<float>> tangents;

    /**
     * @en
     * Vertex colors.
     * @zh
     * 顶点颜色。
     */
    cc::optional<std::vector<float>> colors;

    /**
     * @en
     * specify vertex attributes, use (positions|normals|uvs|colors) as keys
     * @zh
     * 顶点属性。
     */
    cc::optional<gfx::AttributeList> attributes;

    struct CustomAttribute {
        gfx::Attribute     attr;
        std::vector<float> values;
    };

    cc::optional<std::vector<CustomAttribute>> customAttributes;

    /**
     * @en
     * Bounding sphere radius.
     * @zh
     * 包围球半径。
     */
    cc::optional<float> boundingRadius;

    /**
     * @en
     * Min position.
     * @zh
     * 最小位置。
     */
    cc::optional<Vec3> minPos;

    /**
     * @en
     * Max position.
     * @zh
     * 最大位置。
     */
    cc::optional<Vec3> maxPos;

    /**
     * @en
     * Geometry indices, if one needs indexed-draw.
     * @zh
     * 几何索引，当使用索引绘制时。
     */
    cc::optional<std::vector<uint32_t>> indices; //cjh uint16_t ?

    /**
     * @en
     * Topology of the geometry vertices. Default is TRIANGLE_LIST.
     * @zh
     * 几何顶点的拓扑图元。默认值是TRIANGLE_LIST。
     */
    cc::optional<gfx::PrimitiveMode> primitiveMode;

    /**
     * @en
     * whether rays casting from the back face of this geometry could collide with it
     * @zh
     * 是否是双面，用于判断来自于几何体背面的射线检测。
     */
    cc::optional<bool> doubleSided;
};

} // namespace cc
