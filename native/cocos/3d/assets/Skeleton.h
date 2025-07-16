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

#include "core/assets/Asset.h"

namespace cc {

/**
 * @en The skeleton asset. It stores the path related to [[SkinnedMeshRenderer.skinningRoot]] of all bones and its bind pose matrix.
 * @zh 骨骼资源。骨骼资源记录了每个关节（相对于 [[SkinnedMeshRenderer.skinningRoot]]）的路径以及它的绑定姿势矩阵。
 */
class Skeleton final : public Asset {
public:
    using Super = Asset;
    Skeleton() = default;
    ~Skeleton() override = default;
    /**
     * @en The path of all bones, the length always equals the length of [[bindposes]]
     * @zh 所有关节的路径。该数组的长度始终与 [[bindposes]] 的长度相同。
     */
    inline const ccstd::vector<ccstd::string> &getJoints() const {
        return _joints;
    }

    inline void setJoints(const ccstd::vector<ccstd::string> &value) {
        _joints = value;
    }

    /**
     * @en The bind poses matrix of all bones, the length always equals the length of [[joints]]
     * @zh 所有关节的绑定姿势矩阵。该数组的长度始终与 [[joints]] 的长度相同。
     */
    const ccstd::vector<Mat4> &getBindposes() const {
        return _bindposes;
    }

    void setBindposes(const ccstd::vector<Mat4> &value) {
        _bindposes = value;
    }

    /**
     * @en Gets the inverse bind poses matrix
     * @zh 获取反向绑定姿势矩阵
     */
    const ccstd::vector<Mat4> &getInverseBindposes();

    /**
     * @en Gets the hash of the skeleton asset
     * @zh 获取骨骼资源的哈希值
     */
    ccstd::hash_t getHash();
    void setHash(ccstd::hash_t hash) { _hash = hash; }

    bool destroy() override;
    bool validate() const override;

private:
    ccstd::vector<ccstd::string> _joints;
    ccstd::vector<Mat4> _bindposes;
    ccstd::optional<ccstd::vector<Mat4>> _invBindposes;
    ccstd::hash_t _hash{0U};
};

} // namespace cc
