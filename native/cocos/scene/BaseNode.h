/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
#include "math/Mat3.h"
#include "math/Mat4.h"
#include "math/Quaternion.h"
#include "math/Vec3.h"
#include "math/Vec4.h"

namespace cc {
namespace scene {
class BaseNode {
public:
    BaseNode()                 = default;
    BaseNode(const BaseNode &) = delete;
    BaseNode(BaseNode &&)      = delete;
    virtual ~BaseNode()        = default;
    BaseNode &operator=(const BaseNode &) = delete;
    BaseNode &operator=(const BaseNode &&) = delete;

    virtual inline void updateWorldTransform() {}
    virtual inline void updateWorldRTMatrix() {}

    virtual inline void setWorldPosition(float x, float y, float z) {}
    virtual inline void setWorldRotation(float x, float y, float z, float w) {}
    void                setParent(BaseNode *parent);

    inline void addChild(BaseNode *node) { _children.emplace_back(node); }
    inline void removeChild(BaseNode *node) {
        auto iter = std::find(_children.begin(), _children.end(), node);
        if (iter != _children.end()) {
            _children.erase(iter);
        }
    }

    virtual inline void setFlagsChanged(uint32_t value) {}
    virtual inline void setDirtyFlag(uint32_t value) {}
    virtual inline void setLayer(uint32_t layer) {}
    virtual inline void setWorldMatrix(const Mat4 &matrix) {}
    virtual inline void setWorldPosition(const Vec3 &pos) {}
    virtual inline void setWorldRotation(const Quaternion &rotation) {}
    virtual inline void setWorldScale(const Vec3 &scale) {}
    virtual inline void setLocalPosition(const Vec3 &pos) {}
    virtual inline void setLocalPosition(float x, float y, float z) {}
    virtual inline void setLocalRotation(const Quaternion &rotation) {}
    virtual inline void setLocalRotation(float x, float y, float z, float w) {}
    virtual inline void setLocalScale(const Vec3 &scale) {}

    inline const std::vector<BaseNode *> &getChilds() { return _children; }
    inline BaseNode *                     getParent() const { return _parent; }
    virtual inline uint32_t               getFlagsChanged() const { return _flagChange; }
    virtual inline uint32_t               getLayer() const { return _layer; }
    virtual inline uint32_t               getDirtyFlag() const { return _dirtyFlag; }
    virtual inline const Vec3 &           getPosition() const { return _localPosition; }
    virtual inline const Vec3 &           getScale() const { return _localScale; }
    virtual inline const Quaternion &     getRotation() const { return _localRotation; }
    virtual inline const Mat4 &           getWorldMatrix() const { return _worldMatrix; }
    virtual inline const Vec3 &           getWorldPosition() const { return _worldPosition; }
    virtual inline const Quaternion &     getWorldRotation() const { return _worldRotation; }
    virtual inline const Vec3 &           getWorldScale() const { return _worldScale; }
    virtual inline const Mat4 &           getWorldRTMatrix() const { return _rtMat; }

protected:
    std::vector<BaseNode *> _children;
    BaseNode *              _parent{nullptr};
    uint32_t                _flagChange{0};
    uint32_t                _dirtyFlag{0};
    uint32_t                _layer{0};
    cc::Vec3                _worldScale{Vec3::ONE};
    cc::Vec3                _worldPosition{Vec3::ZERO};
    cc::Quaternion          _worldRotation{Quaternion::identity()};
    Mat4                    _rtMat{Mat4::IDENTITY};
    cc::Mat4                _worldMatrix{Mat4::IDENTITY};
    cc::Vec3                _localScale{Vec3::ONE};
    cc::Vec3                _localPosition{Vec3::ZERO};
    cc::Quaternion          _localRotation{Quaternion::identity()};
};
} // namespace scene
} // namespace cc