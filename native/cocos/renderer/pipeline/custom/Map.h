/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
#include <cocos/renderer/pipeline/custom/Utility.h>
#include <boost/container/flat_map.hpp>
#include <boost/container/pmr/flat_map.hpp>
#include <map>
#include <unordered_map>

// for std::less<> the transparent comparator
// see https://stackoverflow.com/questions/20317413/what-are-transparent-comparators

namespace cc {

// map
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
using PmrUnorderedMap = std::unordered_map<
    Key, Value, std::hash<Key>, std::equal_to<Key>,
    boost::container::pmr::polymorphic_allocator<std::pair<const Key, Value>>>;

template <class Key, class Value>
using PmrUnorderedMultiMap = std::unordered_multimap<
    Key, Value, std::hash<Key>, std::equal_to<Key>,
    boost::container::pmr::polymorphic_allocator<std::pair<const Key, Value>>>;

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

} // namespace cc
