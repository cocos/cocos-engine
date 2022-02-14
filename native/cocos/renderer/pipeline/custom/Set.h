/*
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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
*/

#pragma once
#include <cocos/renderer/pipeline/custom/Utility.h>
#include <boost/container/flat_set.hpp>
#include <boost/container/pmr/flat_set.hpp>
#include <set>
#include <unordered_set>

// for std::less<> the transparent comparator
// see https://stackoverflow.com/questions/20317413/what-are-transparent-comparators

namespace cc {

// set
template <class Value>
using TransparentSet = std::set<Value, std::less<>>;

template <class Value>
using TransparentMultiSet = std::multiset<Value, std::less<>>;

template <class Value>
using PmrTransparentSet = std::set<
    Value, std::less<>,
    boost::container::pmr::polymorphic_allocator<Value>>;

template <class Value>
using PmrTransparentMultiSet = std::multiset<
    Value, std::less<>,
    boost::container::pmr::polymorphic_allocator<Value>>;

// flat_set
template <class Value>
using FlatSet = boost::container::flat_set<Value, std::less<>>;

template <class Value>
using FlatMultiSet = boost::container::flat_multiset<Value, std::less<>>;

template <class Value>
using PmrFlatSet = boost::container::pmr::flat_set<Value, std::less<>>;

template <class Value>
using PmrFlatMultiSet = boost::container::pmr::flat_multiset<Value, std::less<>>;

// unordered_set
template <class Value>
using PmrUnorderedSet = std::unordered_set<
    Value, std::hash<Value>, std::equal_to<Value>,
    boost::container::pmr::polymorphic_allocator<Value>>;

template <class Value>
using PmrUnorderedMultiSet = std::unordered_multiset<
    Value, std::hash<Value>, std::equal_to<Value>,
    boost::container::pmr::polymorphic_allocator<Value>>;

// transparent string unordered_set
template <class Value>
using UnorderedStringSet = std::unordered_set<
    Value,
    TransparentStringHash<typename Value::value_type>, std::equal_to<>>;

template <class Value>
using UnorderedStringMultiSet = std::unordered_multiset<
    Value,
    TransparentStringHash<typename Value::value_type>, std::equal_to<>>;

template <class Value>
using PmrUnorderedStringSet = std::unordered_set<
    Value,
    TransparentStringHash<typename Value::value_type>, std::equal_to<>,
    boost::container::pmr::polymorphic_allocator<Value>>;

template <class Value>
using PmrUnorderedStringMultiSet = std::unordered_multiset<
    Value,
    TransparentStringHash<typename Value::value_type>, std::equal_to<>,
    boost::container::pmr::polymorphic_allocator<Value>>;

} // namespace cc
