/****************************************************************************
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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
#include <utility>
#include "base/std/hash/hash_fwd.hpp"
#include "boost/container/pmr/polymorphic_allocator.hpp"

namespace ccstd {
using std::unordered_map;
using std::unordered_multimap;

namespace pmr {
template <
    class Key,
    class T,
    class Hash = ccstd::hash<Key>,
    class Pred = std::equal_to<Key>>
using unordered_map = std::unordered_map<Key, T, Hash, Pred, boost::container::pmr::polymorphic_allocator<std::pair<const Key, T>>>;

template <
    class Key,
    class T,
    class Hash = ccstd::hash<Key>,
    class Pred = std::equal_to<Key>>
using unordered_multimap =std::unordered_multimap<Key, T, Hash, Pred, boost::container::pmr::polymorphic_allocator<std::pair<const Key, T>>>; 
}
} // namespace ccstd
