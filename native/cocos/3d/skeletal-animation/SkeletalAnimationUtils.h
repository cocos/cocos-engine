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
#include "base/std/container/unordered_map.h"
#include "base/std/optional.h"

#include "3d/assets/Skeleton.h"
#include "core/TypedArray.h"
#include "core/geometry/AABB.h"
#include "gfx-base/GFXDef-common.h"
#include "renderer/core/TextureBufferPool.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {

class Node;
class Mesh;

// _chunkIdxMap[key] = skeleton ^ clips[i]
struct IChunkContent {
    uint32_t skeleton{0U};
    ccstd::vector<uint32_t> clips;
};

struct ICustomJointTextureLayout {
    uint32_t textureLength{0};
    ccstd::vector<IChunkContent> contents;
};

struct IInternalJointAnimInfo {
    ccstd::optional<Mat4> downstream;               // downstream default pose, if present
    ccstd::optional<ccstd::vector<Mat4>> curveData; // the nearest animation curve, if present
    index_t bindposeIdx{0};                         // index of the actual bindpose to use
    ccstd::optional<Mat4> bindposeCorrection;       // correction factor from the original bindpose
};

class IJointTextureHandle {
public:
    uint32_t pixelOffset{0};
    uint32_t refCount{0};
    ccstd::hash_t clipHash{0U};
    ccstd::hash_t skeletonHash{0U};
    bool readyToBeDeleted{false};
    ITextureBufferHandle handle;
    ccstd::unordered_map<uint32_t, ccstd::vector<geometry::AABB>> bounds;
    ccstd::optional<ccstd::vector<IInternalJointAnimInfo>> animInfos;

    static IJointTextureHandle *createJoinTextureHandle() {
        return ccnew IJointTextureHandle();
    }

private:
    IJointTextureHandle() = default;
};

class JointTexturePool : public RefCounted {
public:
    JointTexturePool() = default;
    explicit JointTexturePool(gfx::Device *device);
    ~JointTexturePool() override = default;

    inline uint32_t getPixelsPerJoint() const { return _pixelsPerJoint; }

    void clear();

    void registerCustomTextureLayouts(const ccstd::vector<ICustomJointTextureLayout> &layouts);

    /**
     * @en
     * Get joint texture for the default pose.
     * @zh
     * 获取默认姿势的骨骼贴图。
     */
    ccstd::optional<IJointTextureHandle *> getDefaultPoseTexture(Skeleton *skeleton, Mesh *mesh, Node *skinningRoot);

    /**
     * @en
     * Get joint texture for the specified animation clip.
     * @zh
     * 获取指定动画片段的骨骼贴图。
     */
    // ccstd::optional<IJointTextureHandle> getSequencePoseTexture(Skeleton *skeleton, AnimationClip *clip, Mesh *mesh, Node *skinningRoot);

    void releaseHandle(IJointTextureHandle *handle);

    void releaseSkeleton(Skeleton *skeleton);

    // void releaseAnimationClip (AnimationClip* clip); // TODO(xwx): AnimationClip not define

private:
    // const IInternalJointAnimInfo &createAnimInfos(Skeleton *skeleton, AnimationClip *clip, Node *skinningRoot); // TODO(xwx): AnimationClip not define

    gfx::Device *_device{nullptr};
    IntrusivePtr<TextureBufferPool> _pool;
    ccstd::unordered_map<ccstd::hash_t, IJointTextureHandle *> _textureBuffers;
    uint32_t _formatSize{0};
    uint32_t _pixelsPerJoint{0};
    IntrusivePtr<TextureBufferPool> _customPool;
    ccstd::unordered_map<ccstd::hash_t, index_t> _chunkIdxMap; // hash -> chunkIdx

    CC_DISALLOW_COPY_MOVE_ASSIGN(JointTexturePool);
};

struct IAnimInfo {
    gfx::Buffer *buffer{nullptr};
    Float32Array data;
    const float *curFrame{nullptr}; // Only used in JSB
    uint32_t frameDataBytes{0};     // Only used in JSB
    uint8_t *dirtyForJSB{nullptr};  // Only used in JSB
    bool dirty{false};
};

class JointAnimationInfo : public RefCounted {
public:
    JointAnimationInfo() = default;
    explicit JointAnimationInfo(gfx::Device *device);
    ~JointAnimationInfo() override = default;

    IAnimInfo getData(const ccstd::string &nodeID = "-1");
    void destroy(const ccstd::string &nodeID);
    static const IAnimInfo &switchClip(IAnimInfo &info /*, AnimationClip *clip */);
    void clear();

private:
    ccstd::unordered_map<ccstd::string, IAnimInfo> _pool; // pre node
    gfx::Device *_device{nullptr};

    CC_DISALLOW_COPY_MOVE_ASSIGN(JointAnimationInfo);
};

} // namespace cc
