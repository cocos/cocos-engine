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
#include "primitive/Primitive.h"
#include "3d/misc/CreateMesh.h"
#include "core/assets/RenderingSubMesh.h"

namespace cc {

Primitive::Primitive(PrimitiveType type) : type(type) {
}

Primitive::~Primitive() = default;

void Primitive::onLoaded() {
    reset(MeshUtils::createMeshInfo(createGeometry(type)));
}

IGeometry createGeometry(PrimitiveType type, const ccstd::optional<PrimitiveOptions> &options) {
    switch (type) {
        case PrimitiveType::BOX: {
            return options.has_value() ? box(ccstd::get<IBoxOptions>(options.value())) : box();
            break;
        }
        case PrimitiveType::SPHERE: {
            return options.has_value() ? sphere(0.5F, ccstd::get<ISphereOptions>(options.value())) : sphere();
            break;
        }
        case PrimitiveType::CYLINDER: {
            return options.has_value() ? cylinder(0.5F, 0.5F, 2, ccstd::get<4>(options.value())) : cylinder();
            break;
        }
        case PrimitiveType::CONE: {
            return options.has_value() ? cone(0.5F, 1.0F, ccstd::get<5>(options.value())) : cone();
            break;
        }
        case PrimitiveType::CAPSULE: {
            return options.has_value() ? capsule(0.5F, 0.5F, 2, ccstd::get<ICapsuleOptions>(options.value())) : capsule();
            break;
        }
        case PrimitiveType::TORUS: {
            return options.has_value() ? torus(0.4F, 0.1F, ccstd::get<ITorusOptions>(options.value())) : torus();
            break;
        }
        case PrimitiveType::PLANE: {
            return options.has_value() ? quad(ccstd::get<IGeometryOptions>(options.value())) : plane();
            break;
        }
        case PrimitiveType::QUAD: {
            return options.has_value() ? quad(ccstd::get<IGeometryOptions>(options.value())) : quad();
            break;
        }
        default:
            break;
    }
    return box();
}

} // namespace cc
