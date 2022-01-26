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

#include "3d/assets/Skeleton.h"

#include <iomanip>
#include <sstream>

#include "boost/container_hash/hash.hpp"

namespace cc {

const std::vector<Mat4> &Skeleton::getInverseBindposes() {
    if (!_invBindposes.has_value()) {
        _invBindposes = std::vector<Mat4>{};
        for (const auto &bindpose : _bindposes) {
            _invBindposes.value().emplace_back(bindpose.getInversed());
        }
    }
    return *_invBindposes;
}

uint64_t Skeleton::getHash() {
    // hashes should already be computed offline, but if not, make one
    if (!_hash) {
        std::stringstream sstr;
        for (const auto &ibm : _bindposes) {
            sstr << std::fixed << std::setprecision(2)
                 << ibm.m[0] << " " << ibm.m[1] << " " << ibm.m[2] << " " << ibm.m[3] << " "
                 << ibm.m[4] << " " << ibm.m[5] << " " << ibm.m[6] << " " << ibm.m[7] << " "
                 << ibm.m[8] << " " << ibm.m[9] << " " << ibm.m[10] << " " << ibm.m[11] << " "
                 << ibm.m[12] << " " << ibm.m[13] << " " << ibm.m[14] << " " << ibm.m[15] << "\n";
        }
        std::string str{sstr.str()};
        std::size_t seed = 666;
        boost::hash_range(seed, str.begin(), str.end());
        _hash = static_cast<uint32_t>(seed);
    }
    return _hash;
}

bool Skeleton::destroy() {
    //cjh TODO:    (legacyCC.director.root?.dataPoolManager as DataPoolManager)?.releaseSkeleton(this);
    return Super::destroy();
}

bool Skeleton::validate() const {
    return !_joints.empty() && !_bindposes.empty();
}

} // namespace cc
