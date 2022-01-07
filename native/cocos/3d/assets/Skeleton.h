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

#include "core/assets/Asset.h"

namespace cc {

/**
 * @en The skeleton asset. It stores the path related to [[SkinnedMeshRenderer.skinningRoot]] of all bones and its bind pose matrix.
 * @zh 骨骼资源。骨骼资源记录了每个关节（相对于 [[SkinnedMeshRenderer.skinningRoot]]）的路径以及它的绑定姿势矩阵。
 */
class Skeleton final : public Asset {
public:
    using Super          = Asset;
    Skeleton()           = default;
    ~Skeleton() override = default;
    /**
     * @en The path of all bones, the length always equals the length of [[bindposes]]
     * @zh 所有关节的路径。该数组的长度始终与 [[bindposes]] 的长度相同。
     */
    inline const std::vector<std::string> &getJoints() const {
        return _joints;
    }

    inline void setJoints(const std::vector<std::string> &value) {
        _joints = value;
    }

    /**
     * @en The bind poses matrix of all bones, the length always equals the length of [[joints]]
     * @zh 所有关节的绑定姿势矩阵。该数组的长度始终与 [[joints]] 的长度相同。
     */
    const std::vector<Mat4> &getBindposes() const {
        return _bindposes;
    }

    void setBindposes(const std::vector<Mat4> &value) {
        _bindposes = value;
    }

    /**
     * @en Gets the inverse bind poses matrix
     * @zh 获取反向绑定姿势矩阵
     */
    const std::vector<Mat4> &getInverseBindposes();

    /**
     * @en Gets the hash of the skeleton asset
     * @zh 获取骨骼资源的哈希值
     */
    uint64_t getHash();
    void     setHash(uint64_t hash) { _hash = hash; }

    inline double getHashForJS() {
        return static_cast<double>(getHash());
    }

    bool destroy() override;
    bool validate() const override;

private:
    std::vector<std::string>        _joints;
    std::vector<Mat4>               _bindposes;
    cc::optional<std::vector<Mat4>> _invBindposes;
    uint64_t                        _hash{0};
};

} // namespace cc
