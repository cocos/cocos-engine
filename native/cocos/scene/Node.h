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

#include "math/Mat4.h"
#include "math/Quaternion.h"
#include "math/Vec3.h"
#include "math/Vec4.h"

namespace cc {
namespace scene {

// This struct defines the memory layout shared between JS and C++.
// TODO(minggo) add more data.
struct NodeLayout {
    uint32_t flagsChanged{0};
    uint32_t layer{0};
    cc::Vec3 worldScale;
    cc::Vec3 worldPosition;
    cc::Vec4 worldRotation;
    cc::Mat4 worldMatrix;
};

class Node final {
public:
    Node()             = default;
    Node(const Node &) = delete;
    Node(Node &&)      = delete;
    ~Node()            = default;
    Node &operator=(const Node &) = delete;
    Node &operator=(Node &&) = delete;

    void initWithData(uint8_t *data);
    void updateWorldTransform();

    //    inline void setFlagsChanged(bool value) { _flagsChanged = value; }
    //    inline void setLayer(uint32_t layer) { _layer = layer; }
    //    inline void setWorldMatrix(const Mat4 &matrix) { _worldMatrix = matrix; }
    //    inline void setWorldPosition(const Vec3 &pos) { _worldPosition = pos; }
    //    inline void setWorldRotation(const Quaternion &rotation) { _worldRotation = rotation; }
    //    inline void setWorldScale(const Vec3 &scale) { _worldScale = scale; }

    inline uint32_t    getFlagsChanged() const { return _nodeLayout->flagsChanged; }
    inline uint32_t    getLayer() const { return _nodeLayout->layer; }
    inline const Mat4 &getWorldMatrix() const { return _nodeLayout->worldMatrix; }
    inline const Vec3 &getWorldPosition() const { return _nodeLayout->worldPosition; }
    inline const Vec4 &getWorldRotation() const { return _nodeLayout->worldRotation; }
    inline const Vec3 &getWorldScale() const { return _nodeLayout->worldScale; }

private:
    NodeLayout *_nodeLayout{nullptr};
    bool        _dirtyFlags{false};
    bool        _hasChangeFlags{false};
    Node *      _parent{nullptr};
    Vec3        _lPos;
    Quaternion  _lScale;
};

} // namespace scene
} // namespace cc
