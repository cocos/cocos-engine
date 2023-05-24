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

#include "3d/assets/Skeleton.h"

#include <iomanip>
#include <sstream>

#include "base/std/hash/hash.h"

namespace cc {

const ccstd::vector<Mat4> &Skeleton::getInverseBindposes() {
    if (!_invBindposes.has_value()) {
        _invBindposes = ccstd::vector<Mat4>{};
        for (const auto &bindpose : _bindposes) {
            _invBindposes.value().emplace_back(bindpose.getInversed());
        }
    }
    return *_invBindposes;
}

ccstd::hash_t Skeleton::getHash() {
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
        ccstd::string str{sstr.str()};
        ccstd::hash_t seed = 666;
        ccstd::hash_range(seed, str.begin(), str.end());
        _hash = seed;
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
