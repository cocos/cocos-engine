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
#include <unordered_map>
#include "cocos/base/Optional.h"

#include "3d/assets/Skeleton.h"
#include "core/TypedArray.h"
#include "core/geometry/AABB.h"
#include "core/scene-graph/Node.h"
#include "gfx-base/GFXDef-common.h"
#include "renderer/core/TextureBufferPool.h"
#include "renderer/gfx-base/GFXBuffer.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {

class Mesh;

struct IChunkContent {
    int32_t              skeleton{0}; // TODO(xwx): int or uint or float?
    std::vector<int32_t> clips;       // TODO(xwx): int or uint?
};

struct ICustomJointTextureLayout {
    uint32_t                   textureLength{0};
    std::vector<IChunkContent> contents;
};

struct IInternalJointAnimInfo {
    cc::optional<Mat4>              downstream;         // downstream default pose, if present
    cc::optional<std::vector<Mat4>> curveData;          // the nearest animation curve, if present
    index_t                         bindposeIdx{0};     // index of the actual bindpose to use
    cc::optional<Mat4>              bindposeCorrection; // correction factor from the original bindpose
};

struct IJointTextureHandle {
    uint32_t                                                  pixelOffset{0};
    uint32_t                                                  refCount{0};
    uint64_t                                                  clipHash{0};
    uint64_t                                                  skeletonHash{0};
    bool                                                      readyToBeDeleted{false};
    ITextureBufferHandle                                      handle;
    std::unordered_map<uint32_t, std::vector<geometry::AABB>> bounds;
    cc::optional<std::vector<IInternalJointAnimInfo>>         animInfos;
};

class JointTexturePool : public RefCounted {
public:
    JointTexturePool() = default;
    explicit JointTexturePool(gfx::Device *device);
    ~JointTexturePool() override = default;

    inline float getPixelsPerJoint() const { return _pixelsPerJoint; }

    void clear();

    void registerCustomTextureLayouts(const std::vector<ICustomJointTextureLayout> &layouts);

    /**
     * @en
     * Get joint texture for the default pose.
     * @zh
     * 获取默认姿势的骨骼贴图。
     */
    cc::optional<IJointTextureHandle> getDefaultPoseTexture(Skeleton *skeleton, Mesh *mesh, Node *skinningRoot);

    /**
     * @en
     * Get joint texture for the specified animation clip.
     * @zh
     * 获取指定动画片段的骨骼贴图。
     */
    // cc::optional<IJointTextureHandle> getSequencePoseTexture(Skeleton *skeleton, AnimationClip *clip, Mesh *mesh, Node *skinningRoot);

    void releaseHandle(IJointTextureHandle &handle);

    void releaseSkeleton(Skeleton *skeleton);

    // void releaseAnimationClip (AnimationClip* clip); // TODO(xwx): AnimationClip not define

private:
    // const IInternalJointAnimInfo &createAnimInfos(Skeleton *skeleton, AnimationClip *clip, Node *skinningRoot); // TODO(xwx): AnimationClip not define

    gfx::Device *                                     _device{nullptr};
    IntrusivePtr<TextureBufferPool>                   _pool;
    std::unordered_map<uint64_t, IJointTextureHandle> _textureBuffers;
    uint32_t                                          _formatSize{0};
    float                                             _pixelsPerJoint{0}; // TODO(xwx): int or float?
    IntrusivePtr<TextureBufferPool>                   _customPool;
    std::unordered_map<uint64_t, index_t>             _chunkIdxMap; // hash -> chunkIdx

    CC_DISALLOW_COPY_MOVE_ASSIGN(JointTexturePool);
};

struct IAnimInfo {
    gfx::Buffer *buffer{nullptr};
    Float32Array data;
    const float *curFrame{nullptr};    // Only used in JSB
    uint32_t     frameDataBytes{0};    // Only used in JSB
    uint8_t *    dirtyForJSB{nullptr}; // Only used in JSB
    bool         dirty{false};
};

class JointAnimationInfo : public RefCounted {
public:
    JointAnimationInfo();
    explicit JointAnimationInfo(gfx::Device *device);
    ~JointAnimationInfo() override = default;

    IAnimInfo               getData(const std::string &nodeID = "-1");
    void                    destroy(const std::string &nodeID);
    static const IAnimInfo &switchClip(IAnimInfo &info /*, AnimationClip *clip */);
    void                    clear();

private:
    std::unordered_map<std::string, IAnimInfo> _pool; // pre node
    gfx::Device *                              _device{nullptr};

    CC_DISALLOW_COPY_MOVE_ASSIGN(JointAnimationInfo);
};

} // namespace cc
