/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/Macros.h"
#include "base/RefCounted.h"
#include "base/std/container/array.h"
#include "core/geometry/AABB.h"
#include "math/Vec3.h"

namespace cc {
namespace scene {

class Camera;
class Model;
class Octree;

constexpr int OCTREE_CHILDREN_NUM = 8;
constexpr int DEFAULT_OCTREE_DEPTH = 8;
const Vec3 DEFAULT_WORLD_MIN_POS = {-1024.0F, -1024.0F, -1024.0F};
const Vec3 DEFAULT_WORLD_MAX_POS = {1024.0F, 1024.0F, 1024.0F};
const float OCTREE_BOX_EXPAND_SIZE = 10.0F;
constexpr int USE_MULTI_THRESHOLD = 1024; // use parallel culling if greater than this value

class CC_DLL OctreeInfo final : public RefCounted {
public:
    OctreeInfo() = default;
    ~OctreeInfo() override = default;
    /**
     * @en Whether activate octree
     * @zh 是否启用八叉树加速剔除？
     */
    void setEnabled(bool val);
    inline bool isEnabled() const { return _enabled; }

    /**
     * @en min pos of scene bounding box
     * @zh 场景包围盒最小值
     */
    void setMinPos(const Vec3 &val);
    inline const Vec3 &getMinPos() const { return _minPos; }

    /**
     * @en max pos of scene bounding box
     * @zh 场景包围盒最大值
     */
    void setMaxPos(const Vec3 &val);
    inline const Vec3 &getMaxPos() const { return _maxPos; }

    /**
     * @en depth of octree
     * @zh 八叉树深度
     */
    void setDepth(uint32_t val);
    inline uint32_t getDepth() const { return _depth; }

    void activate(Octree *resource);

    // JS deserialization require the properties to be public
    // private:
    bool _enabled{false};
    Vec3 _minPos{DEFAULT_WORLD_MIN_POS};
    Vec3 _maxPos{DEFAULT_WORLD_MAX_POS};
    uint32_t _depth{DEFAULT_OCTREE_DEPTH};

private:
    Octree *_resource{nullptr};
};

// Axis aligned bounding box
struct CC_DLL BBox final {
    cc::Vec3 min;
    cc::Vec3 max;

    BBox() = default;

    explicit BBox(const geometry::AABB &aabb)
    : min(aabb.getCenter() - aabb.getHalfExtents()), max(aabb.getCenter() + aabb.getHalfExtents()) {
    }

    BBox(const cc::Vec3 &minPos, const cc::Vec3 &maxPos)
    : min(minPos), max(maxPos) {
    }

    inline cc::Vec3 getCenter() const {
        return (min + max) * 0.5F;
    }

    inline bool operator==(const BBox &box) const {
        return min == box.min && max == box.max;
    }

    inline bool contain(const cc::Vec3 &point) const {
        return !(point.x > max.x || point.x < min.x ||
                 point.y > max.y || point.y < min.y ||
                 point.z > max.z || point.z < min.z);
    }

    inline bool contain(const BBox &box) const {
        return contain(box.min) && contain(box.max);
    }

    inline bool intersect(const BBox &box) const {
        return !(min.x > box.max.x || max.x < box.min.x ||
                 min.y > box.max.y || max.y < box.min.y ||
                 min.z > box.max.z || max.z < box.min.z);
    }
};

/**
 * OctreeNode class
 */
class CC_DLL OctreeNode final {
private:
    OctreeNode(Octree *owner, OctreeNode *parent);
    ~OctreeNode();

    inline void setBox(const BBox &aabb) { _aabb = aabb; }
    inline void setDepth(uint32_t depth) { _depth = depth; }
    inline void setIndex(uint32_t index) { _index = index; }

    inline Octree *getOwner() const { return _owner; }
    inline const BBox &getBox() const { return _aabb; }
    BBox getChildBox(uint32_t index) const;
    OctreeNode *getOrCreateChild(uint32_t index);
    void deleteChild(uint32_t index);
    void insert(Model *model);
    void add(Model *model);
    void remove(Model *model);
    void onRemoved();
    void gatherModels(ccstd::vector<Model *> &results) const;
    void doQueryVisibility(const Camera *camera, const geometry::Frustum &frustum, bool isShadow, ccstd::vector<const Model *> &results) const;
    void queryVisibilityParallelly(const Camera *camera, const geometry::Frustum &frustum, bool isShadow, ccstd::vector<const Model *> &results) const;
    void queryVisibilitySequentially(const Camera *camera, const geometry::Frustum &frustum, bool isShadow, ccstd::vector<const Model *> &results) const;

    Octree *_owner{nullptr};
    OctreeNode *_parent{nullptr};
    ccstd::array<OctreeNode *, OCTREE_CHILDREN_NUM> _children{};
    ccstd::vector<Model *> _models;
    BBox _aabb{};
    uint32_t _depth{0};
    uint32_t _index{0};

    friend class Octree;
};

/**
 * Octree class
 */
class CC_DLL Octree final {
public:
    Octree();
    ~Octree();

    void initialize(const OctreeInfo &info);

    /**
     * @en Whether activate octree
     * @zh 是否启用八叉树加速剔除？
     */
    void setEnabled(bool val);
    inline bool isEnabled() const { return _enabled; }

    /**
     * @en min pos of scene bounding box
     * @zh 场景包围盒最小值
     */
    void setMinPos(const Vec3 &val);
    inline const Vec3 &getMinPos() const { return _minPos; }

    /**
     * @en max pos of scene bounding box
     * @zh 场景包围盒最大值
     */
    void setMaxPos(const Vec3 &val);
    inline const Vec3 &getMaxPos() const { return _maxPos; }

    // reinsert all models in the tree when you change the aabb or max depth in editor
    void resize(const Vec3 &minPos, const Vec3 &maxPos, uint32_t maxDepth);

    // insert a model to tree.
    void insert(Model *model);

    // remove a model from tree.
    void remove(Model *model);

    // update model's location in the tree.
    void update(Model *model);

    /**
     * @en depth of octree
     * @zh 八叉树深度
     */
    void setMaxDepth(uint32_t val);
    // return octree depth
    inline uint32_t getMaxDepth() const { return _maxDepth; }

    // view frustum culling
    void queryVisibility(const Camera *camera, const geometry::Frustum &frustum, bool isShadow, ccstd::vector<const Model *> &results) const;

private:
    bool isInside(Model *model) const;
    bool isOutside(Model *model) const;

    OctreeNode *_root{nullptr};
    uint32_t _maxDepth{DEFAULT_OCTREE_DEPTH};
    uint32_t _totalCount{0};

    bool _enabled{false};
    Vec3 _minPos;
    Vec3 _maxPos;
};

} // namespace scene
} // namespace cc
