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
#include "base/std/optional.h"

#include "3d/assets/Mesh.h"
#include "base/std/variant.h"
#include "primitive/Box.h"
#include "primitive/Capsule.h"
#include "primitive/Circle.h"
#include "primitive/Cone.h"
#include "primitive/Cylinder.h"
#include "primitive/Plane.h"
#include "primitive/Quad.h"
#include "primitive/Sphere.h"
#include "primitive/Torus.h"

#include "primitive/PrimitiveDefine.h"
namespace cc {

using PrimitiveOptions = ccstd::variant<IGeometryOptions, IBoxOptions, ICapsuleOptions, ICircleOptions, ICylinderOptions, IConeOptions, IPlaneOptions, ISphereOptions, ITorusOptions>;
enum class PrimitiveType {
    BOX = 0,
    SPHERE = 1,
    CYLINDER = 2,
    CONE = 3,
    CAPSULE = 4,
    TORUS = 5,
    PLANE = 6,
    QUAD = 7,
};

/**
 * @en
 * Basic primitive mesh, this can be generate some primitive mesh at runtime.
 * @zh
 * 基础图形网格，可以在运行时构建一些基础的网格。
 */
class Primitive : public Mesh {
public:
    /**
     * @en
     * The type of the primitive mesh, set it before you call onLoaded.
     * @zh
     * 此基础图形网格的类型，请在 onLoaded 调用之前设置。
     */
    //    @type(PrimitiveType)
    PrimitiveType type{PrimitiveType::BOX};

    /**
     * @en
     * The option for build the primitive mesh, set it before you call onLoaded.
     * @zh
     * 创建此基础图形网格的可选参数，请在 onLoaded 调用之前设置。
     */
    //    @serializable
    //    @editable
    Record<ccstd::string, float> info; //cjh float?

    explicit Primitive(PrimitiveType type = PrimitiveType::BOX);
    ~Primitive() override;
    /**
     * @en
     * Construct the primitive mesh with `type` and `info`.
     * @zh
     * 根据`type`和`info`构建相应的网格。
     */
    void onLoaded() override;

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(Primitive);
};

IGeometry createGeometry(PrimitiveType type, const ccstd::optional<PrimitiveOptions> &options = ccstd::nullopt);

} // namespace cc
