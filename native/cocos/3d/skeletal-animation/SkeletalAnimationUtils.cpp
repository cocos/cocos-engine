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

#include "3d/skeletal-animation/SkeletalAnimationUtils.h"
#include "3d/assets/Mesh.h"
#include "renderer/pipeline/Define.h"

namespace {
const float INF = std::numeric_limits<float>::infinity();

cc::gfx::Format selectJointsMediumFormat(cc::gfx::Device *device) {
    if (device->hasFeature(cc::gfx::Feature::TEXTURE_FLOAT)) {
        return cc::gfx::Format::RGBA32F;
    }
    return cc::gfx::Format::RGBA8;
}

// Linear Blending Skinning
void uploadJointDataLBS(cc::Float32Array out, uint32_t base, const cc::Mat4 &mat, bool /*firstBone*/) {
    out[base + 0]  = mat.m[0];
    out[base + 1]  = mat.m[1];
    out[base + 2]  = mat.m[2];
    out[base + 3]  = mat.m[12];
    out[base + 4]  = mat.m[4];
    out[base + 5]  = mat.m[5];
    out[base + 6]  = mat.m[6];
    out[base + 7]  = mat.m[13];
    out[base + 8]  = mat.m[8];
    out[base + 9]  = mat.m[9];
    out[base + 10] = mat.m[10];
    out[base + 11] = mat.m[14];
}

cc::Quaternion dq0;
cc::Quaternion dq1;
cc::Vec3       v31;
cc::Quaternion qt1;
cc::Vec3       v32;

float dot(const cc::Quaternion &a, const cc::Quaternion &b) {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
}

void multiplyScalar(const cc::Quaternion &a, float b, cc::Quaternion *out) {
    out->x = a.x * b;
    out->y = a.y * b;
    out->z = a.z * b;
    out->w = a.w * b;
}

// Dual Quaternion Skinning
void uploadJointDataDQS(cc::Float32Array out, uint32_t base, cc::Mat4 &mat, bool firstBone) {
    cc::Mat4::toRTS(qt1, v31, v32, &mat);
    // // sign consistency
    if (firstBone) {
        dq0 = qt1;
    } else if (dot(dq0, qt1) < 0) {
        multiplyScalar(qt1, -1, &qt1);
    }
    // conversion
    dq1.x = v31.x;
    dq1.y = v31.y;
    dq1.z = v31.z;
    dq1.w = 0;
    multiplyScalar(dq1 * qt1, 0.5, &dq1);
    // upload
    out[base + 0]  = qt1.x;
    out[base + 1]  = qt1.y;
    out[base + 2]  = qt1.z;
    out[base + 3]  = qt1.w;
    out[base + 4]  = dq1.x;
    out[base + 5]  = dq1.y;
    out[base + 6]  = dq1.z;
    out[base + 7]  = dq1.w;
    out[base + 8]  = v32.x;
    out[base + 9]  = v32.y;
    out[base + 10] = v32.z;
}

// change here and cc-skinning.chunk to use other skinning algorithms
constexpr auto UPLOAD_JOINT_DATA          = uploadJointDataLBS;
const uint32_t MINIMUM_JOINT_TEXTURE_SIZE = /* EDITOR ? 2040 :*/ 480; // have to be multiples of 12

uint32_t roundUpTextureSize(uint32_t targetLength, uint32_t formatSize) {
    double formatScale = 4 / std::sqrt(formatSize);
    return static_cast<uint32_t>(std::ceil(std::max(MINIMUM_JOINT_TEXTURE_SIZE * formatScale, static_cast<double>(targetLength)) / 12) * 12);
}

const cc::gfx::SamplerInfo JOINT_TEXTURE_SAMPLER_INFO{
    cc::gfx::Filter::POINT,
    cc::gfx::Filter::POINT,
    cc::gfx::Filter::NONE,
    cc::gfx::Address::CLAMP,
    cc::gfx::Address::CLAMP,
    cc::gfx::Address::CLAMP,
};

cc::Mat4 *getWorldTransformUntilRoot(cc::Node *target, cc::Node *root, cc::Mat4 *outMatrix) {
    outMatrix->setIdentity();
    cc::Mat4 mat4;
    while (target != root) {
        cc::Mat4::fromRTS(target->getRotation(), target->getPosition(), target->getScale(), &mat4);
        cc::Mat4::multiply(*outMatrix, mat4, outMatrix);
        target = target->getParent();
    }
    return outMatrix;
}

} // namespace
namespace cc {
JointTexturePool::JointTexturePool(gfx::Device *device) {
    _device            = device;
    const auto &format = selectJointsMediumFormat(_device);
    _formatSize        = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].size;
    _pixelsPerJoint    = 48 / _formatSize;
    _pool              = new TextureBufferPool(device);
    ITextureBufferPoolInfo poolInfo;
    poolInfo.format    = format;
    poolInfo.roundUpFn = roundUpType{roundUpTextureSize};
    _pool->initialize(poolInfo);
    _customPool = new TextureBufferPool(device);
    ITextureBufferPoolInfo customPoolInfo;
    customPoolInfo.format    = format;
    customPoolInfo.roundUpFn = roundUpType{roundUpTextureSize};
    _customPool->initialize(customPoolInfo);
}

void JointTexturePool::clear() {
    CC_SAFE_DESTROY(_pool);
    _textureBuffers.clear();
}

void JointTexturePool::registerCustomTextureLayouts(const std::vector<ICustomJointTextureLayout> &layouts) {
    for (const auto &layout : layouts) {
        auto chunkIdx = static_cast<index_t>(_customPool->createChunk(layout.textureLength));
        for (const auto &content : layout.contents) {
            auto skeleton          = content.skeleton;
            _chunkIdxMap[skeleton] = chunkIdx; // include default pose too
            for (const auto &clip : content.clips) {
                _chunkIdxMap[skeleton ^ clip] = chunkIdx;
            }
        }
    }
}

cc::optional<IJointTextureHandle *> JointTexturePool::getDefaultPoseTexture(Skeleton *skeleton, Mesh *mesh, Node *skinningRoot) {
    uint64_t                            hash = skeleton->getHash() ^ 0; // may not equal to skeleton.hash
    cc::optional<IJointTextureHandle *> texture;
    if (_textureBuffers.find(hash) != _textureBuffers.end()) {
        texture = _textureBuffers[hash];
    }

    const std::vector<std::string> &joints    = skeleton->getJoints();
    const std::vector<Mat4> &       bindPoses = skeleton->getBindposes();
    Float32Array                    textureBuffer;
    bool                            buildTexture = false;
    auto                            jointCount   = static_cast<uint32_t>(joints.size());
    if (!texture.has_value()) {
        uint32_t             bufSize = jointCount * 12;
        ITextureBufferHandle handle;
        if (_chunkIdxMap.find(hash) != _chunkIdxMap.end()) {
            handle = _customPool->alloc(bufSize * Float32Array::BYTES_PER_ELEMENT, _chunkIdxMap[hash]);
        } else {
            handle = _pool->alloc(bufSize * Float32Array::BYTES_PER_ELEMENT);
            return texture;
        }
        IJointTextureHandle *textureHandle = IJointTextureHandle::createJoinTextureHandle();
        textureHandle->pixelOffset         = handle.start / _formatSize;
        textureHandle->refCount            = 1;
        textureHandle->clipHash            = 0;
        textureHandle->skeletonHash        = skeleton->getHash();
        textureHandle->readyToBeDeleted    = false;
        textureHandle->handle              = handle;
        texture                            = textureHandle;
        textureBuffer                      = Float32Array(bufSize);
        buildTexture                       = true;
    } else {
        texture.value()->refCount++;
    }

    geometry::AABB ab1;
    Mat4           mat4;
    Vec3           v34;
    Vec3           v33;
    Vec3           v3Min(-INF, -INF, -INF);
    Vec3           v3Max(-INF, -INF, -INF);
    auto           boneSpaceBounds = mesh->getBoneSpaceBounds(skeleton);
    for (uint32_t j = 0, offset = 0; j < jointCount; ++j, offset += 12) {
        auto *node = skinningRoot->getChildByPath(joints[j]);
        Mat4  mat  = node ? *getWorldTransformUntilRoot(node, skinningRoot, &mat4) : skeleton->getInverseBindposes()[j];
        if (j < boneSpaceBounds.size()) {
            auto *bound = boneSpaceBounds[j].get();
            bound->transform(mat, &ab1);
            ab1.getBoundary(&v33, &v34);
            Vec3::min(v3Min, v33, &v3Min);
            Vec3::max(v3Max, v34, &v3Max);
        }

        if (buildTexture) {
            if (node != nullptr) {
                Mat4::multiply(mat, bindPoses[j], &mat);
            }
            uploadJointDataLBS(textureBuffer, offset, node ? mat : Mat4::IDENTITY, j == 0);
        }
    }

    std::vector<geometry::AABB> bounds;
    texture.value()->bounds[static_cast<uint32_t>(mesh->getHash())] = bounds;
    geometry::AABB::fromPoints(v3Min, v3Max, &bounds[0]);
    if (buildTexture) {
        _pool->update(texture.value()->handle, textureBuffer.buffer());
        _textureBuffers[hash] = texture.value();
    }

    return texture;
}

// TODO(xwx): need to implement this function after define AnimationClip
// cc::optional<IJointTextureHandle> JointTexturePool::getSequencePoseTexture(Skeleton *skeleton,AnimationClip *clip, Mesh *mesh, Node *skinningRoot) {
//     uint64_t                           hash = skeleton->getHash() ^ clip->getHash();
//     cc::optional<IJointTextureHandle> texture;
//     if (_textureBuffers.find(hash) != _textureBuffers.end()) {
//         texture = _textureBuffers[hash];
//         if (texture->bounds.find(mesh->getHash()) != texture->bounds.end()) {
//             texture->refCount++;
//             return texture;
//         }
//     }
//     const std::vector<std::string> &joints    = skeleton->getJoints();
//     const std::vector<Mat4> &       bindPoses = skeleton->getBindposes();
//     // const clipData = SkelAnimDataHub.getOrExtract(clip);
//     // const { frames } = clipData;
//     Float32Array textureBuffer;
//     bool         buildTexture = false;
//     uint32_t     jointCount   = joints.size();
//     if (!texture.has_value()) {
//         uint32_t             bufSize = jointCount * 12;
//         ITextureBufferHandle handle;
//         if (_chunkIdxMap.find(hash) != _chunkIdxMap.end()) {
//             handle = _customPool->alloc(bufSize * sizeof(Float32Array), _chunkIdxMap[hash]); // TODO(xwx): Float32Array.BYTES_PER_ELEMENT == sizeof(Float32Array) ?
//         } else {
//             handle = _pool->alloc(bufSize * sizeof(Float32Array));
//             return texture;
//         }
//         // auto animInfos = createAnimInfos(skeleton, clip, skinningRoot); // TODO(xwx): createAnimInfos not implement

//         texture = IJointTextureHandle{
//             .pixelOffset      = handle.start / _formatSize,
//             .refCount         = 1,
//             .clipHash         = 0,
//             .skeletonHash     = skeleton->getHash(),
//             .readyToBeDeleted = false,
//             .handle           = handle,
//             // .animInfos        = animInfos // TODO(xwx)
//         };
//         textureBuffer.resize(bufSize);
//         buildTexture = true;
//     } else {
//         texture->refCount++;
//     }
//     auto                        boneSpaceBounds = mesh->getBoneSpaceBounds(skeleton);
//     std::vector<geometry::AABB> bounds;
//     texture->bounds[mesh->getHash()] = bounds;

//     // for (uint32_t f = 0; f < frames; ++f) { // TODO(xwx): frames not define
//     //     bounds.emplace_back(geometry::AABB(INF, INF, INF, -INF, -INF, -INF));
//     // }

//     // TODO(xwx) : need to implement when define animInfos
//     // for (uint32_t f = 0, offset = 0; f < frames; ++f) {
//     //     auto bound = bounds[f];
//     //     for (uint32_t j = 0; j < jointCount; ++j, offset += 12) {
//     //         const {
//     //             curveData,
//     //             downstream,
//     //             bindposeIdx,
//     //             bindposeCorrection,
//     //         } = texture.animInfos ![j];
//     //         let mat : Mat4;
//     //         let transformValid = true;
//     //         if (curveData && downstream) { // curve & static two-way combination
//     //             mat = Mat4.multiply(m4_1, curveData[f], downstream);
//     //         } else if (curveData) { // there is a curve directly controlling the joint
//     //             mat = curveData[f];
//     //         } else if (downstream) { // fallback to default pose if no animation curve can be found upstream
//     //             mat = downstream;
//     //         } else { // bottom line: render the original mesh as-is
//     //             mat            = skeleton.inverseBindposes[bindposeIdx];
//     //             transformValid = false;
//     //         }
//     //         if (j < boneSpaceBounds.size()) {
//     //             auto bound     = boneSpaceBounds[j];
//     //             auto tarnsform = bindposeCorrection ? Mat4::multiply(mat, bindposeCorrection, &m42) : mat; // TODO(xwx): mat not define
//     //             ab1.getBoundary(&v33, &v34);
//     //             Vec3::min(bound.center, v33, &bound.center);
//     //             Vec3::max(bound.halfExtents, v34, &bound.halfExtents);
//     //         }

//     //         if (buildTexture) {
//     //             if (transformValid) {
//     //                 Mat4::multiply(mat, bindPoses[bindposIdx], &m41);
//     //                 UPLOAD_JOINT_DATA(textureBuffer, offset, transformValid ? m41 : Mat4::IDENTITY, j == 0);
//     //             }
//     //         }
//     //     }
//     //     AABB::fromPoints(bound.center, bound.halfExtents, &bound);
//     // }
//     if (buildTexture) {
//         // _pool->update(texture->handle, textureBuffer.buffer); // TODO(xwx): ArrayBuffer not implemented
//         _textureBuffers[hash] = texture.value();
//     }
//     return texture;
// }
// }

void JointTexturePool::releaseHandle(IJointTextureHandle *handle) {
    if (handle->refCount > 0) {
        handle->refCount--;
    }
    if (!handle->refCount && handle->readyToBeDeleted) {
        uint64_t hash = handle->skeletonHash ^ handle->clipHash;
        if (_chunkIdxMap.find(hash) != _chunkIdxMap.end()) {
            _customPool->free(handle->handle);
        } else {
            _pool->free(handle->handle);
        }
        if (_textureBuffers[hash] == handle) {
            _textureBuffers.erase(hash);
            CC_SAFE_DELETE(handle);
        }
    }
}

void JointTexturePool::releaseSkeleton(Skeleton *skeleton) {
    for (const auto &texture : _textureBuffers) {
        auto *handle = texture.second;
        if (handle->skeletonHash == skeleton->getHash()) {
            handle->readyToBeDeleted = true;
            if (handle->refCount > 0) {
                // delete handle record immediately so new allocations with the same asset could work
                _textureBuffers.erase(handle->skeletonHash ^ handle->clipHash);
            } else {
                releaseHandle(handle);
            }
        }
    }
}

// TODO(xwx): AnimationClip not define
// public releaseAnimationClip(clip: AnimationClip) {
//     const it = this._textureBuffers.values();
//     let res  = it.next();
//     while (!res.done) {
//         const handle = res.value;
//         if (handle.clipHash == = clip.hash) {
//             handle.readyToBeDeleted = true;
//             if (handle.refCount) {
//                 // delete handle record immediately so new allocations with the same asset could work
//                 this._textureBuffers.delete(handle.skeletonHash ^ handle.clipHash);
//             } else {
//                 this.releaseHandle(handle);
//             }
//         }
//         res = it.next();
//     }
// }

// TODO(xwx): AnimationClip not define
// private _createAnimInfos (skeleton: Skeleton, clip: AnimationClip, skinningRoot: Node) {
//     const animInfos: IInternalJointAnimInfo[] = [];
//     const { joints, bindposes } = skeleton;
//     const jointCount = joints.length;
//     const clipData = SkelAnimDataHub.getOrExtract(clip);
//     for (let j = 0; j < jointCount; j++) {
//         let animPath = joints[j];
//         let source = clipData.joints[animPath];
//         let animNode = skinningRoot.getChildByPath(animPath);
//         let downstream: Mat4 | undefined;
//         let correctionPath: string | undefined;
//         while (!source) {
//             const idx = animPath.lastIndexOf('/');
//             animPath = animPath.substring(0, idx);
//             source = clipData.joints[animPath];
//             if (animNode) {
//                 if (!downstream) { downstream = new Mat4(); }
//                 Mat4.fromRTS(m4_1, animNode.rotation, animNode.position, animNode.scale);
//                 Mat4.multiply(downstream, m4_1, downstream);
//                 animNode = animNode.parent;
//             } else { // record the nearest curve path if no downstream pose is present
//                 correctionPath = animPath;
//             }
//             if (idx < 0) { break; }
//         }
//         // the default behavior, just use the bindpose for current joint directly
//         let bindposeIdx = j;
//         let bindposeCorrection: Mat4 | undefined;
//         /**
//          * It is regularly observed that developers may choose to delete the whole
//          * skeleton node tree for skinning models that only use baked animations
//          * as an effective optimization strategy (substantial improvements on both
//          * package size and runtime efficiency).
//          *
//          * This becomes troublesome in some cases during baking though, e.g. when a
//          * skeleton joint node is not directly controlled by any animation curve,
//          * but its parent nodes are. Due to lack of proper downstream default pose,
//          * the joint transform can not be calculated accurately.
//          *
//          * We address this issue by employing some pragmatic approximation.
//          * Specifically, by multiplying the bindpose of the joint corresponding to
//          * the nearest curve, instead of the actual target joint. This effectively
//          * merges the skinning influence of the 'incomplete' joint into its nearest
//          * parent with accurate transform data.
//          * It gives more visually-plausible results compared to the naive approach
//          * for most cases we've covered.
//          */
//         if (correctionPath !== undefined && source) {
//             // just use the previous joint if the exact path is not found
//             bindposeIdx = j - 1;
//             for (let t = 0; t < jointCount; t++) {
//                 if (joints[t] === correctionPath) {
//                     bindposeIdx = t;
//                     bindposeCorrection = new Mat4();
//                     Mat4.multiply(bindposeCorrection, bindposes[t], skeleton.inverseBindposes[j]);
//                     break;
//                 }
//             }
//         }
//         animInfos.push({
//             curveData: source && source.transforms, downstream, bindposeIdx, bindposeCorrection,
//         });
//     }
//     return animInfos;
// }

IAnimInfo JointAnimationInfo::getData(const std::string &nodeID) {
    if (_pool.find(nodeID) != _pool.end()) {
        return _pool[nodeID];
    }

    auto *buffer = _device->createBuffer(gfx::BufferInfo{
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        pipeline::UBOSkinningAnimation::SIZE,
        pipeline::UBOSkinningAnimation::SIZE,
    });

    Float32Array data;
    buffer->update(data.buffer()->getData());
    IAnimInfo info;
    info.buffer   = buffer;
    info.data     = data;
    info.dirty    = false;
    _pool[nodeID] = info;

    return info;
}

void JointAnimationInfo::destroy(const std::string &nodeID) {
    if (_pool.find(nodeID) != _pool.end()) {
        CC_SAFE_DESTROY_AND_DELETE(_pool[nodeID].buffer);
        _pool.erase(nodeID);
    }
}

const IAnimInfo &JointAnimationInfo::switchClip(IAnimInfo &info /*, AnimationClip *clip */) {
    info.data[0] = 0;
    info.buffer->update(info.data.buffer()->getData());
    info.dirty = false;
    return info;
}

void JointAnimationInfo::clear() {
    for (auto pool : _pool) {
        CC_SAFE_DESTROY_AND_DELETE(pool.second.buffer);
    }
    _pool.clear();
}
} // namespace cc
