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

#include "primitive/PrimitiveDefine.h"

namespace cc {

/**
 * @en
 * Translate the geometry.
 * @zh
 * 平移几何体。
 * @param geometry 几何体信息。
 * @param offset 偏移量。
 */
IGeometry translate(IGeometry &geometry, const ccstd::optional<Vec3> &offset);

/**
 * @en
 * Scale the geometry.
 * @zh
 * 缩放几何体。
 * @param geometry 几何体信息。
 * @param value 缩放量。
 */
IGeometry scale(IGeometry &geometry, const ccstd::optional<Vec3> &value);

/**
 * @en
 * Converts geometry to wireframe mode. Only geometry with triangle topology is supported.
 * @zh
 * 将几何体转换为线框模式，仅支持三角形拓扑的几何体。
 * @param geometry 几何体信息。
 */
IGeometry wireframed(IGeometry &geometry);

} // namespace cc
