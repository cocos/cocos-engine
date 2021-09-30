/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.
 
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

#include <array>
#include <vector>
#include "base/Macros.h"
#include "math/Vec3.h"
#include "scene/AABB.h"

namespace cc {
namespace scene {

struct Camera;
class Model;
class Octree;

constexpr int OCTREE_CHILDREN_NUM   = 8;
constexpr int DEFAULT_OCTREE_DEPTH  = 8;
const Vec3    DEFAULT_WORLD_MIN_POS = {-1124.0F, -1124.0F, -1124.0F};
const Vec3    DEFAULT_WORLD_MAX_POS = {1024.0F, 1024.0F, 1024.0F};
constexpr int USE_MULTI_THRESHOLD   = 1024; // use parallel culling if greater than this value

// Axis aligned bounding box
struct CC_DLL BBox {
    cc::Vec3 min;
    cc::Vec3 max;

    explicit BBox(const AABB& aabb)
    : min(aabb.getCenter() - aabb.getHalfExtents()), max(aabb.getCenter() + aabb.getHalfExtents()) {
    }

    BBox(const cc::Vec3& minPos, const cc::Vec3& maxPos)
    : min(minPos), max(maxPos) {
    }

    inline cc::Vec3 getCenter() const {
        return (min + max) * 0.5F;
    }

    inline bool operator==(const BBox& box) const {
        return min == box.min && max == box.max;
    }

    inline bool contain(const cc::Vec3& point) const {
        return !(point.x > max.x || point.x < min.x ||
                 point.y > max.y || point.y < min.y ||
                 point.z > max.z || point.z < min.z);
    }

    inline bool contain(const BBox& box) const {
        return contain(box.min) && contain(box.max);
    }
};

/**
 * OctreeNode class
 */
class CC_DLL OctreeNode {
private:
    OctreeNode(Octree* owner, OctreeNode* parent, BBox aabb, uint32_t depth, uint32_t index);
    ~OctreeNode();

    inline Octree*     getOwner() const { return _owner; }
    inline const BBox& getBox() const { return _aabb; }
    BBox               getChildBox(uint32_t index) const;
    OctreeNode*        getOrCreateChild(uint32_t index);
    void               deleteChild(uint32_t index);
    void               insert(Model* model);
    void               add(Model* model);
    void               remove(Model* model);
    void               onRemoved();
    void               gatherModels(std::vector<Model*>& results) const;
    void               doQueryVisibility(const Camera* camera, const Frustum& frustum, bool isShadow, std::vector<Model*>& results) const;
    void               queryVisibilityParallelly(const Camera* camera, const Frustum& frustum, bool isShadow, std::vector<Model*>& results) const;
    void               queryVisibilitySequentially(const Camera* camera, const Frustum& frustum, bool isShadow, std::vector<Model*>& results) const;

    Octree*                                      _owner{nullptr};
    OctreeNode*                                  _parent{nullptr};
    std::array<OctreeNode*, OCTREE_CHILDREN_NUM> _children{};
    std::vector<Model*>                          _models;
    BBox                                         _aabb;
    uint32_t                                     _depth{0};
    uint32_t                                     _index{0};

    friend class Octree;
};

/**
 * Octree class
 */
class CC_DLL Octree {
public:
    explicit Octree(const Vec3& minPos = DEFAULT_WORLD_MIN_POS, const Vec3& maxPos = DEFAULT_WORLD_MAX_POS, uint32_t maxDepth = DEFAULT_OCTREE_DEPTH);
    ~Octree();

    // reinsert all models in the tree when you change the aabb or max depth in editor
    void resize(const Vec3& minPos, const Vec3& maxPos, uint32_t maxDepth);

    // insert a model to tree.
    void insert(Model* model);

    // remove a model from tree.
    void remove(Model* model);

    // update model's location in the tree.
    void update(Model* model);

    // return octree depth
    inline uint32_t getMaxDepth() const { return _maxDepth; }

    // view frustum culling
    void queryVisibility(const Camera* camera, const Frustum& frustum, bool isShadow, std::vector<Model*>& results) const;

private:
    bool isInside(Model* model) const;

    OctreeNode* _root{nullptr};
    uint32_t    _maxDepth{DEFAULT_OCTREE_DEPTH};
    uint32_t    _totalCount{0};
};

} // namespace scene
} // namespace cc
