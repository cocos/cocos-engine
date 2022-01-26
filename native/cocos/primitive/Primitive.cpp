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
#include "primitive/Primitive.h"
#include "3d/misc/CreateMesh.h"
#include "core/assets/RenderingSubMesh.h"

namespace cc {

Primitive::Primitive(PrimitiveType type) : type(type) {
}

Primitive::~Primitive() = default;

void Primitive::onLoaded() {
    reset(createMeshInfo(createGeometry(type)));
}

IGeometry createGeometry(PrimitiveType type, const cc::optional<PrimitiveOptions> &options) {
    switch (type) {
        case PrimitiveType::BOX: {
            return options.has_value() ? box(cc::get<IBoxOptions>(options.value())) : box();
            break;
        }
        case PrimitiveType::SPHERE: {
            return sphere(); //TODO(xwx): now for test, need to add options usage
            break;
        }
        case PrimitiveType::CYLINDER: {
            return cylinder(); //TODO(xwx): now for test, need to add options usage
            break;
        }
        case PrimitiveType::CONE: {
            return cone(); //TODO(xwx): now for test, need to add options usage
            break;
        }
        case PrimitiveType::CAPSULE: {
            return capsule(); //TODO(xwx): now for test, need to add options usage
            break;
        }
        case PrimitiveType::TORUS: {
            return torus(); //TODO(xwx): now for test, need to add options usage
            break;
        }
        case PrimitiveType::PLANE: {
            return options.has_value() ? quad(cc::get<IGeometryOptions>(options.value())) : plane();
            break;
        }
        case PrimitiveType::QUAD: {
            return options.has_value() ? quad(cc::get<IGeometryOptions>(options.value())) : quad();
            break;
        }
        default:
            break;
    }
    return box();
}

} // namespace cc
