/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include <boost/functional/hash.hpp>

#include "base/CoreStd.h"

#include "../GFXQueue.h"
#include "GFXTextureBarrier.h"
#include "base/Utils.h"

namespace cc {
namespace gfx {

TextureBarrier::TextureBarrier(const TextureBarrierInfo &info, size_t hash)
: GFXObject(ObjectType::TEXTURE_BARRIER) {
    _info = info;
    _hash = hash;
}

size_t TextureBarrier::computeHash(const TextureBarrierInfo &info) {
    size_t seed = 5;
    boost::hash_combine(seed, info.prevAccesses);
    boost::hash_combine(seed, info.nextAccesses);
    boost::hash_combine(seed, info.discardContents);
    boost::hash_combine(seed, info.srcQueue);
    boost::hash_combine(seed, info.dstQueue);
    return seed;
}

} // namespace gfx
} // namespace cc
