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

#pragma once

#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "math/Mat4.h"
#include "renderer/gfx-base/GFXTexture.h"

namespace cc {

class Node;

struct IJointTransform : RefCounted {
    Node *node{nullptr};
    Mat4 local;
    Mat4 world;
    int stamp{-1};
    IntrusivePtr<IJointTransform> parent;
};

struct RealTimeJointTexture {
    ~RealTimeJointTexture() {
        CC_SAFE_DELETE_ARRAY(buffer);
        for (auto &texture : textures) {
            texture->destroy();
        }
    }
    std::vector<IntrusivePtr<gfx::Texture>> textures;
    float *buffer = nullptr;
};

Mat4 getWorldMatrix(IJointTransform *transform, int32_t stamp);

IJointTransform *getTransform(Node *node, Node *root);

void deleteTransform(Node *node);

} // namespace cc
