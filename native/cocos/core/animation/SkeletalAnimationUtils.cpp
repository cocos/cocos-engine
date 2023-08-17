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

#include "core/animation/SkeletalAnimationUtils.h"
#include "core/scene-graph/Node.h"

namespace cc {

namespace {
ccstd::vector<IJointTransform *> stack;
ccstd::unordered_map<ccstd::string, IJointTransform *> pool;
} // namespace

Mat4 getWorldMatrix(IJointTransform *transform, int32_t stamp) {
    uint32_t i = 0;
    Mat4 *res = nullptr;
    while (transform != nullptr) {
        if ((transform->stamp == stamp || transform->stamp + 1 == stamp) && !transform->node->getChangedFlags()) {
            res = &transform->world;
            transform->stamp = stamp;
            break;
        }
        transform->stamp = stamp;
        stack.resize(i + 1);
        stack[i++] = transform;
        transform = transform->parent;
    }
    while (i > 0) {
        transform = stack[--i];
        stack[i] = nullptr;
        const auto *node = transform->node;
        CC_ASSERT_NOT_NULL(node);
        Mat4::fromRTS(node->getRotation(), node->getPosition(), node->getScale(), &transform->local);
        if (res != nullptr) {
            Mat4::multiply(*res, transform->local, &transform->world);
        } else {
            transform->world = transform->local;
        }
        res = &transform->world;
    }
    return res != nullptr ? *res : Mat4::IDENTITY;
}

IJointTransform *getTransform(Node *node, Node *root) {
    IJointTransform *joint = nullptr;
    uint32_t i = 0;
    while (node != root) {
        const ccstd::string &id = node->getUuid();
        auto iter = pool.find(id);
        if (iter != pool.end()) {
            joint = iter->second;
            break;
        }
        // TODO(): object reuse
        joint = ccnew IJointTransform;
        joint->node = node;
        pool[id] = joint;
        stack.resize(i + 1);
        stack[i++] = joint;
        node = node->getParent();
        joint = nullptr;
    }
    IJointTransform *child;
    while (i > 0) {
        child = stack[--i];
        stack[i] = nullptr;
        child->parent = joint;
        joint = child;
    }
    return joint;
}

void deleteTransform(Node *node) {
    IJointTransform *transform = nullptr;
    auto iter = pool.find(node->getUuid());
    if (iter != pool.end()) {
        transform = iter->second;
    }

    while (transform != nullptr) {
        iter = pool.find(transform->node->getUuid());
        if (iter != pool.end()) {
            pool.erase(iter);
        }
        transform = transform->parent;
    }
}

} // namespace cc
