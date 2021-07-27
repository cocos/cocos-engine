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
#include "math/Mat3.h"
#include "math/Mat4.h"
#include "math/Quaternion.h"
#include "math/Vec3.h"
#include "math/Vec4.h"

namespace cc {
namespace scene {
enum class TransformBit;
// This struct defines the memory layout shared between JS and C++.
struct NodeLayout {
    uint32_t       dirtyFlag{0};
    uint32_t       layer{0};
    cc::Vec3       worldScale;
    cc::Vec3       worldPosition;
    cc::Quaternion worldRotation;
    cc::Mat4       worldMatrix;
    cc::Vec3       localScale;
    cc::Vec3       localPosition;
    cc::Quaternion localRotation;
};

class Node final {
public:
    Node()             = default;
    Node(const Node &) = delete;
    Node(Node &&)      = delete;
    ~Node()            = default;
    Node &operator=(const Node &) = delete;
    Node &operator=(Node &&) = delete;

    void initWithData(uint8_t *, uint8_t *);
    void invalidateChildren(TransformBit dirtyBit);

    void updateWorldTransform();
    void updateWorldRTMatrix();

    void setWorldPosition(float x, float y, float z);
    void setWorldRotation(float x, float y, float z, float w);
    void setParent(Node *parent);

    inline void addChild(Node *node) { _children.emplace_back(node); }

    inline void removeChild(Node *node) {
        auto iter = std::find(_children.begin(), _children.end(), node);
        if (iter != _children.end()) {
            _children.erase(iter);
        }
    }

    inline void setFlagsChanged(uint32_t value) { *_flagChunk = value; }
    inline void setDirtyFlag(uint32_t value) { _nodeLayout->dirtyFlag = value; }
    inline void setLayer(uint32_t layer) { _nodeLayout->layer = layer; }
    inline void setWorldMatrix(const Mat4 &matrix) { _nodeLayout->worldMatrix.set(matrix); }
    inline void setWorldPosition(const Vec3 &pos) { setWorldPosition(pos.x, pos.y, pos.z); }
    inline void setWorldRotation(const Quaternion &rotation) { setWorldRotation(rotation.x, rotation.y, rotation.z, rotation.w); }
    inline void setWorldScale(const Vec3 &scale) { _nodeLayout->worldScale.set(scale); }
    inline void setLocalPosition(const Vec3 &pos) { _nodeLayout->localPosition.set(pos); }
    inline void setLocalPosition(float x, float y, float z) { _nodeLayout->localPosition.set(x, y, z); }
    inline void setLocalRotation(const Quaternion &rotation) { _nodeLayout->localRotation.set(rotation); }
    inline void setLocalRotation(float x, float y, float z, float w) { _nodeLayout->localRotation.set(x, y, z, w); }
    inline void setLocalScale(const Vec3 &scale) { _nodeLayout->localScale.set(scale); }

    inline Node *            getParent() const { return _parent; }
    inline uint32_t          getFlagsChanged() const { return *_flagChunk; }
    inline uint32_t          getLayer() const { return _nodeLayout->layer; }
    inline uint32_t          getDirtyFlag() const { return _nodeLayout->dirtyFlag; }
    inline const Vec3 &      getPosition() const { return _nodeLayout->localPosition; }
    inline const Vec3 &      getScale() const { return _nodeLayout->localScale; }
    inline const Quaternion &getRotation() const { return _nodeLayout->localRotation; }
    inline const NodeLayout *getNodeLayout() const { return _nodeLayout; };
    inline const Mat4 &      getWorldMatrix() const { return _nodeLayout->worldMatrix; }
    inline const Vec3 &      getWorldPosition() const { return _nodeLayout->worldPosition; }
    inline const Quaternion &getWorldRotation() const { return _nodeLayout->worldRotation; }
    inline const Vec3 &      getWorldScale() const { return _nodeLayout->worldScale; }
    inline const Mat4 &      getWorldRTMatrix() const { return _rtMat; };

private:
    NodeLayout *        _nodeLayout{nullptr};
    Node *              _parent{nullptr};
    Mat4                _rtMat;
    uint32_t *          _flagChunk{nullptr};
    std::vector<Node *> _children;
    std::vector<Node *> _computeNodes;
};

} // namespace scene
} // namespace cc
