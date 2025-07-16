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
#include <boost/container/flat_map.hpp>
#include <boost/container/pmr/flat_map.hpp>
#include <map>
#include <unordered_map>
#include "cocos/base/std/container/unordered_map.h"
#include "cocos/renderer/pipeline/custom/details/Pmr.h"
#include "cocos/renderer/pipeline/custom/details/Utility.h"

// for std::less<> the transparent comparator
// see https://stackoverflow.com/questions/20317413/what-are-transparent-comparators

namespace cc {

// map
template <class Key, class Value>
using PmrMap = std::map<
    Key, Value, std::less<Key>,
    boost::container::pmr::polymorphic_allocator<std::pair<const Key, Value>>>;

template <class Key, class Value>
using PmrMultiMap = std::multimap<
    Key, Value, std::less<Key>,
    boost::container::pmr::polymorphic_allocator<std::pair<const Key, Value>>>;

template <class Key, class Value>
using TransparentMap = std::map<Key, Value, std::less<>>;

template <class Key, class Value>
using TransparentMultiMap = std::multimap<Key, Value, std::less<>>;

template <class Key, class Value>
using PmrTransparentMap = std::map<
    Key, Value, std::less<>,
    boost::container::pmr::polymorphic_allocator<std::pair<const Key, Value>>>;

template <class Key, class Value>
using PmrTransparentMultiMap = std::multimap<
    Key, Value, std::less<>,
    boost::container::pmr::polymorphic_allocator<std::pair<const Key, Value>>>;

// flat_map
template <class Key, class Value>
using FlatMap = boost::container::flat_map<Key, Value, std::less<>>;

template <class Key, class Value>
using FlatMultiMap = boost::container::flat_multimap<Key, Value, std::less<>>;

template <class Key, class Value>
using PmrFlatMap = boost::container::pmr::flat_map<Key, Value, std::less<>>;

template <class Key, class Value>
using PmrFlatMultiMap = boost::container::pmr::flat_multimap<Key, Value, std::less<>>;

// unordered_map
template <class Key, class Value>
using PmrUnorderedMap = ccstd::pmr::unordered_map<Key, Value>;

template <class Key, class Value>
using PmrUnorderedMultiMap = ccstd::pmr::unordered_multimap<Key, Value>;

// transparent string unordered_map
template <class Key, class Value>
using UnorderedStringMap = std::unordered_map<
    Key, Value,
    TransparentStringHash<typename Key::value_type>, std::equal_to<>>;

template <class Key, class Value>
using UnorderedStringMultiMap = std::unordered_multimap<
    Key, Value,
    TransparentStringHash<typename Key::value_type>, std::equal_to<>>;

template <class Key, class Value>
using PmrUnorderedStringMap = std::unordered_map<
    Key, Value,
    TransparentStringHash<typename Key::value_type>, std::equal_to<>,
    boost::container::pmr::polymorphic_allocator<std::pair<const Key, Value>>>;

template <class Key, class Value>
using PmrUnorderedStringMultiMap = std::unordered_multimap<
    Key, Value,
    TransparentStringHash<typename Key::value_type>, std::equal_to<>,
    boost::container::pmr::polymorphic_allocator<std::pair<const Key, Value>>>;

template <class Key, class Value, class Allocator, class KeyLike>
inline typename std::map<Key, Value, std::less<>, Allocator>::mapped_type&
at(std::map<Key, Value, std::less<>, Allocator>& m, const KeyLike& key) {
    auto iter = m.find(key);
    if (iter == m.end()) {
        throw std::out_of_range("at(std::map) out of range");
    }
    return iter->second;
}

template <class Key, class Value, class Allocator, class KeyLike>
inline typename std::map<Key, Value, std::less<>, Allocator>::mapped_type const&
at(const std::map<Key, Value, std::less<>, Allocator>& m, const KeyLike& key) {
    auto iter = m.find(key);
    if (iter == m.end()) {
        throw std::out_of_range("at(std::map) out of range");
    }
    return iter->second;
}

template <class Key, class Value, class Allocator, class KeyLike>
inline typename boost::container::flat_map<Key, Value, std::less<>, Allocator>::mapped_type&
at(boost::container::flat_map<Key, Value, std::less<>, Allocator>& m, const KeyLike& key) {
    auto iter = m.find(key);
    if (iter == m.end()) {
        throw std::out_of_range("at(boost::container::flat_map) out of range");
    }
    return iter->second;
}

template <class Key, class Value, class Allocator, class KeyLike>
inline typename boost::container::flat_map<Key, Value, std::less<>, Allocator>::mapped_type const&
at(const boost::container::flat_map<Key, Value, std::less<>, Allocator>& m, const KeyLike& key) {
    auto iter = m.find(key);
    if (iter == m.end()) {
        throw std::out_of_range("at(boost::container::flat_map) out of range");
    }
    return iter->second;
}

} // namespace cc

namespace ccstd {

template <class Key, class T, class Compare, class AllocatorOrContainer>
struct hash<boost::container::flat_map<Key, T, Compare, AllocatorOrContainer>> {
    hash_t operator()(const boost::container::flat_map<Key, T, Compare, AllocatorOrContainer>& val) const noexcept {
        hash_t seed = 0;
        for (const auto& pair : val) {
            hash_combine(seed, pair);
        }
        return seed;
    }
};

} // namespace ccstd
