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

#include "Octree.h"
#include <future>
#include <utility>
#include "scene/Camera.h"
#include "scene/Model.h"

namespace cc {
namespace scene {

void OctreeInfo::setEnabled(bool val) {
    if (_enabled == val) {
        return;
    }
    _enabled = val;
    if (_resource) {
        _resource->setEnabled(val);
    }
}

void OctreeInfo::setMinPos(const Vec3 &val) {
    _minPos = val;
    if (_resource) {
        _resource->setMinPos(val);
    }
}

void OctreeInfo::setMaxPos(const Vec3 &val) {
    _maxPos = val;
    if (_resource) {
        _resource->setMaxPos(val);
    }
}

void OctreeInfo::setDepth(uint32_t val) {
    _depth = val;
    if (_resource) {
        _resource->setMaxDepth(val);
    }
}

void OctreeInfo::activate(Octree *resource) {
    _resource = resource;
    _resource->initialize(*this);
}

/* children layout
        y
        |
        |_ _ _x
       /
     z/

     --------
     / 2  3 /
    / 6  7 /
    ---------
     / 0  1 /
    / 4  5 /
    --------
 **/

/**
 * OctreeNode class
 */
OctreeNode::OctreeNode(Octree *owner, OctreeNode *parent)
: _owner(owner), _parent(parent) {
}

OctreeNode::~OctreeNode() {
    for (auto i = 0; i < OCTREE_CHILDREN_NUM; i++) {
        deleteChild(i);
    }
}

BBox OctreeNode::getChildBox(uint32_t index) const {
    cc::Vec3 min = _aabb.min;
    cc::Vec3 max = _aabb.max;
    const cc::Vec3 center = _aabb.getCenter();

    if (index & 0x1) {
        min.x = center.x;
    } else {
        max.x = center.x;
    }

    if (index & 0x2) {
        min.y = center.y;
    } else {
        max.y = center.y;
    }

    if (index & 0x4) {
        min.z = center.z;
    } else {
        max.z = center.z;
    }

    return {min, max};
}

OctreeNode *OctreeNode::getOrCreateChild(uint32_t index) {
    if (!_children[index]) {
        BBox childBox = getChildBox(index);
        auto *child = _children[index] = ccnew OctreeNode(_owner, this);
        child->setBox(childBox);
        child->setDepth(_depth + 1);
        child->setIndex(index);
    }

    return _children[index];
}

void OctreeNode::deleteChild(uint32_t index) {
    if (_children[index]) {
        delete _children[index];
        _children[index] = nullptr;
    }
}

void OctreeNode::insert(Model *model) { // NOLINT(misc-no-recursion)
    bool split = false;
    if (_depth < _owner->getMaxDepth() - 1) {
        BBox modelBox(*model->getWorldBounds());
        const cc::Vec3 &modelCenter = modelBox.getCenter();
        const cc::Vec3 &nodeCenter = _aabb.getCenter();

        uint32_t index = modelCenter.x < nodeCenter.x ? 0 : 1;
        index += modelCenter.y < nodeCenter.y ? 0 : 2;
        index += modelCenter.z < nodeCenter.z ? 0 : 4;

        BBox childBox = getChildBox(index);
        if (childBox.contain(modelBox)) {
            split = true;

            // insert to child node recursively
            OctreeNode *child = getOrCreateChild(index);
            child->insert(model);
        }
    }

    if (!split) {
        // insert to this node
        OctreeNode *lastNode = model->getOctreeNode();
        if (lastNode != this) {
            add(model);

            if (lastNode) {
                lastNode->remove(model);
            }
        }
    }
}

void OctreeNode::add(Model *model) {
    _models.push_back(model);
    model->setOctreeNode(this);
}

void OctreeNode::remove(Model *model) {
    auto iter = std::find(_models.begin(), _models.end(), model);
    if (iter != _models.end()) {
        _models.erase(iter);
    }

    onRemoved();
}

void OctreeNode::onRemoved() { // NOLINT(misc-no-recursion)
    // delete empty node
    if (!_models.empty()) {
        return;
    }

    for (auto *child : _children) {
        if (child) {
            return;
        }
    }

    // delete recursively
    OctreeNode *parent = _parent;
    if (parent) {
        parent->deleteChild(_index);
        parent->onRemoved();
    }
}

void OctreeNode::gatherModels(ccstd::vector<Model *> &results) const { // NOLINT(misc-no-recursion)
    for (auto *model : _models) {
        results.push_back(model);
    }

    for (auto *child : _children) {
        if (child) {
            child->gatherModels(results);
        }
    }
}

void OctreeNode::doQueryVisibility(const Camera *camera, const geometry::Frustum &frustum, bool isShadow, ccstd::vector<const Model *> &results) const {
    const auto visibility = camera->getVisibility();
    for (auto *model : _models) {
        if (!model->isEnabled()) {
            continue;
        }

        const Node *node = model->getNode();
        if ((node && ((visibility & node->getLayer()) == node->getLayer())) ||
            (visibility & static_cast<uint32_t>(model->getVisFlags()))) {
            const geometry::AABB *modelWorldBounds = model->getWorldBounds();
            if (!modelWorldBounds) {
                continue;
            }

            if (isShadow) {
                if (model->isCastShadow() && modelWorldBounds->aabbFrustum(frustum)) {
                    results.push_back(model);
                }
            } else {
                if (modelWorldBounds->aabbFrustum(frustum)) {
                    results.push_back(model);
                }
            }
        }
    }
}

void OctreeNode::queryVisibilityParallelly(const Camera *camera, const geometry::Frustum &frustum, bool isShadow, ccstd::vector<const Model *> &results) const {
    geometry::AABB box;
    geometry::AABB::fromPoints(_aabb.min, _aabb.max, &box);
    if (!box.aabbFrustum(frustum)) {
        return;
    }

    ccstd::array<std::future<ccstd::vector<const Model *>>, OCTREE_CHILDREN_NUM> futures{};
    for (auto i = 0; i < OCTREE_CHILDREN_NUM; i++) {
        if (_children[i]) {
            futures[i] = std::async(std::launch::async, [=, &frustum] {
                ccstd::vector<const Model *> models;
                _children[i]->queryVisibilitySequentially(camera, frustum, isShadow, models);
                return models;
            });
        }
    }

    doQueryVisibility(camera, frustum, isShadow, results);

    for (auto i = 0; i < OCTREE_CHILDREN_NUM; i++) {
        if (_children[i]) {
            auto models = futures[i].get();
            results.insert(results.end(), models.begin(), models.end());
        }
    }
}

void OctreeNode::queryVisibilitySequentially(const Camera *camera, const geometry::Frustum &frustum, bool isShadow, ccstd::vector<const Model *> &results) const { // NOLINT(misc-no-recursion)
    geometry::AABB box;
    geometry::AABB::fromPoints(_aabb.min, _aabb.max, &box);
    if (!box.aabbFrustum(frustum)) {
        return;
    }

    doQueryVisibility(camera, frustum, isShadow, results);

    // query recursively.
    for (auto *child : _children) {
        if (child) {
            child->queryVisibilitySequentially(camera, frustum, isShadow, results);
        }
    }
}

/**
 * Octree class
 */
Octree::Octree() {
    _root = ccnew OctreeNode(this, nullptr);
}

Octree::~Octree() {
    delete _root;
}

void Octree::initialize(const OctreeInfo &info) {
    const Vec3 expand{OCTREE_BOX_EXPAND_SIZE, OCTREE_BOX_EXPAND_SIZE, OCTREE_BOX_EXPAND_SIZE};
    _minPos = info.getMinPos();
    _maxPos = info.getMaxPos();
    _maxDepth = std::max(info.getDepth(), 1U);
    setEnabled(info.isEnabled());
    _root->setBox(BBox{_minPos - expand, _maxPos});
    _root->setDepth(0);
    _root->setIndex(0);
}

void Octree::setEnabled(bool val) {
    if (_enabled == val) {
        return;
    }
    _enabled = val;
}

void Octree::setMinPos(const Vec3 &val) {
    _minPos = val;
}

void Octree::setMaxPos(const Vec3 &val) {
    _maxPos = val;
}

void Octree::setMaxDepth(uint32_t val) {
    _maxDepth = val;
}

void Octree::resize(const Vec3 &minPos, const Vec3 &maxPos, uint32_t maxDepth) {
    const Vec3 expand{OCTREE_BOX_EXPAND_SIZE, OCTREE_BOX_EXPAND_SIZE, OCTREE_BOX_EXPAND_SIZE};
    BBox rootBox = _root->getBox();
    if ((minPos - expand) == rootBox.min && maxPos == rootBox.max && maxDepth == _maxDepth) {
        return;
    }

    ccstd::vector<Model *> models;
    _root->gatherModels(models);

    delete _root;
    _root = ccnew OctreeNode(this, nullptr);
    _root->setBox(BBox{minPos - expand, maxPos});
    _root->setDepth(0);
    _root->setIndex(0);

    _maxDepth = std::max(maxDepth, 1U);

    for (auto *model : models) {
        model->setOctreeNode(nullptr);
        insert(model);
    }
}

void Octree::insert(Model *model) {
    CC_ASSERT(model);

    if (!model->getWorldBounds()) {
        return;
    }

    if (isOutside(model)) {
        CC_LOG_WARNING("Octree insert: model is outside of the scene bounding box, please modify DEFAULT_WORLD_MIN_POS and DEFAULT_WORLD_MAX_POS.");
        return;
    }

    if (!model->getOctreeNode()) {
        _totalCount++;
    }

    _root->insert(model);
}

void Octree::remove(Model *model) {
    CC_ASSERT(model);

    OctreeNode *node = model->getOctreeNode();
    if (node) {
        node->remove(model);
        model->setOctreeNode(nullptr);
        _totalCount--;
    }
}

void Octree::update(Model *model) {
    insert(model);
}

void Octree::queryVisibility(const Camera *camera, const geometry::Frustum &frustum, bool isShadow, ccstd::vector<const Model *> &results) const {
    if (_totalCount > USE_MULTI_THRESHOLD) {
        _root->queryVisibilityParallelly(camera, frustum, isShadow, results);
    } else {
        _root->queryVisibilitySequentially(camera, frustum, isShadow, results);
    }
}

bool Octree::isInside(Model *model) const {
    const BBox &rootBox = _root->getBox();
    BBox modelBox = BBox(*model->getWorldBounds());

    return rootBox.contain(modelBox);
}

bool Octree::isOutside(Model *model) const {
    const BBox &rootBox = _root->getBox();
    BBox modelBox = BBox(*model->getWorldBounds());

    return !rootBox.intersect(modelBox);
}

} // namespace scene
} // namespace cc
