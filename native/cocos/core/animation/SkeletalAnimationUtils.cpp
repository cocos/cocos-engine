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

#include "core/animation/SkeletalAnimationUtils.h"
#include "core/scene-graph/Node.h"

namespace cc {

namespace {
std::vector<IJointTransform *>                     stack; //cjh TODO: how to release ?
std::unordered_map<std::string, IJointTransform *> pool;
} // namespace

Mat4 getWorldMatrix(IJointTransform *transform, int32_t stamp) {
    uint32_t i   = 0;
    Mat4 *   res = nullptr;
    while (transform != nullptr) {
        if ((transform->stamp == stamp || transform->stamp + 1 == stamp) && !transform->node->getChangedFlags()) {
            res              = &transform->world;
            transform->stamp = stamp;
            break;
        }
        transform->stamp = stamp;
        stack.resize(i + 1);
        stack[i++] = transform;
        transform  = transform->parent;
    }
    while (i > 0) {
        transform        = stack[--i];
        stack[i]         = nullptr;
        const auto *node = transform->node;
        CC_ASSERT(node != nullptr);
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
    uint32_t         i     = 0;
    while (node != root) {
        const std::string &id   = node->getUuid();
        auto               iter = pool.find(id);
        if (iter != pool.end()) {
            joint = iter->second;
            break;
        }
        // TODO(): object reuse
        joint = pool[id] = new IJointTransform{
            node,
            Mat4(),
            Mat4(),
            -1,
            nullptr};

        stack.resize(i + 1);
        stack[i++] = joint;
        node       = node->getParent();
        joint      = nullptr;
    }
    IJointTransform *child;
    while (i > 0) {
        child         = stack[--i];
        stack[i]      = nullptr;
        child->parent = joint;
        joint         = child;
    }
    return joint;
}

void deleteTransform(Node *node) {
    IJointTransform *transform = nullptr;
    auto             iter      = pool.find(node->getUuid());
    if (iter != pool.end()) {
        transform = iter->second;
    }

    while (transform != nullptr) {
        iter = pool.find(transform->node->getUuid());
        if (iter != pool.end()) {
            //            delete iter->second;
            pool.erase(iter);
        }
        transform = transform->parent;
    }
}

} // namespace cc
