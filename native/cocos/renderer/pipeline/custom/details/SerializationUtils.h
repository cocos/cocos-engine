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
#include <boost/container/flat_set.hpp>
#include <map>
#include <memory>
#include <set>
#include <string>
#include <type_traits>
#include <unordered_map>
#include <unordered_set>
#include <vector>
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/custom/ArchiveTypes.h"

namespace cc {

namespace render {

// bool
inline void save(OutputArchive& ar, const bool& v) {
    ar.writeBool(v);
}

inline void load(InputArchive& ar, bool& v) {
    v = ar.readBool();
}

// enum, integral, floating_point
template <class T,
          std::enable_if_t<
              std::is_enum_v<T> || std::is_integral_v<T> || std::is_floating_point_v<T>,
              bool> = false>
void save(OutputArchive& ar, const T& v) {
    static_assert(!std::is_enum_v<T> || sizeof(T) <= sizeof(uint32_t)); // enum can only be 1, 2, 4 bytes
    ar.writeNumber(static_cast<double>(v));
}

template <class T,
          std::enable_if_t<
              std::is_integral_v<T> || std::is_floating_point_v<T>,
              bool> = false>
void load(InputArchive& ar, T& v) {
    v = static_cast<T>(ar.readNumber());
}

// Cast from double to enum might not be supported. _MSC_VER(1924)
template <class T,
          std::enable_if_t<
              std::is_enum_v<T>,
              bool> = false>
void load(InputArchive& ar, T& v) {
    v = static_cast<T>(static_cast<typename std::underlying_type<T>::type>(ar.readNumber()));
}

// string
template <class T, class Traits, class Allocator>
void save(OutputArchive& ar, const std::basic_string<T, Traits, Allocator>& v) {
    ar.writeString(v);
}

template <class T, class Traits, class Allocator>
void load(InputArchive& ar, std::basic_string<T, Traits, Allocator>& v) {
    v = ar.readString();
}

// vector
template <class T, class Allocator>
void save(OutputArchive& ar, const std::vector<T, Allocator>& vec) {
    save<uint32_t>(ar, static_cast<uint32_t>(vec.size()));
    for (const auto& v : vec) {
        save(ar, v);
    }
}

template <class T, class Allocator>
void load(InputArchive& ar, std::vector<T, Allocator>& vec) {
    uint32_t sz = 0;
    load(ar, sz);
    vec.resize(sz);
    for (auto& v : vec) {
        load(ar, v);
    }
}

// set
template <class Value, class Less, class Allocator>
void save(OutputArchive& ar, const std::set<Value, Less, Allocator>& set) {
    save<uint32_t>(ar, static_cast<uint32_t>(set.size()));
    for (const auto& value : set) {
        save(ar, value);
    }
}

template <class Value, class Less, class Allocator,
          std::enable_if_t<!std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, std::set<Value, Less, Allocator>& set) {
    uint32_t sz = 0;
    load(ar, sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Value value;
        load(ar, value);
        set.emplace(std::move(value));
    }
}

template <class Value, class Less, class Allocator,
          std::enable_if_t<std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, std::set<Value, Less, Allocator>& set) {
    uint32_t sz = 0;
    load(ar, sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Value value(set.get_allocator());
        load(ar, value);
        set.emplace(std::move(value));
    }
}

// flat_set
template <class Value, class Less, class Allocator>
void save(OutputArchive& ar, const boost::container::flat_set<Value, Less, Allocator>& set) {
    save<uint32_t>(ar, static_cast<uint32_t>(set.size()));
    for (const auto& value : set) {
        save(ar, value);
    }
}

template <class Value, class Less, class Allocator,
          std::enable_if_t<!std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, boost::container::flat_set<Value, Less, Allocator>& set) {
    uint32_t sz = 0;
    load(ar, sz);
    set.reserve(sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Value value;
        load(ar, value);
        set.emplace(std::move(value));
    }
}

template <class Value, class Less, class Allocator,
          std::enable_if_t<std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, boost::container::flat_set<Value, Less, Allocator>& set) {
    uint32_t sz = 0;
    load(ar, sz);
    set.reserve(sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Value value(set.get_allocator());
        load(ar, value);
        set.emplace(std::move(value));
    }
}

// unordered_set
template <class Value, class Hash, class Pred, class Allocator>
void save(OutputArchive& ar, const std::unordered_set<Value, Hash, Pred, Allocator>& set) {
    save<uint32_t>(ar, static_cast<uint32_t>(set.size()));
    for (const auto& value : set) {
        save(ar, value);
    }
}

template <class Value, class Hash, class Pred, class Allocator,
          std::enable_if_t<!std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, std::unordered_set<Value, Hash, Pred, Allocator>& set) {
    uint32_t sz = 0;
    load(ar, sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Value value;
        load(ar, value);
        set.emplace(std::move(value));
    }
}

template <class Value, class Hash, class Pred, class Allocator,
          std::enable_if_t<std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, std::unordered_set<Value, Hash, Pred, Allocator>& set) {
    uint32_t sz = 0;
    load(ar, sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Value value(set.get_allocator());
        load(ar, value);
        set.emplace(std::move(value));
    }
}

// map
template <class Key, class Value, class Less, class Allocator>
void save(OutputArchive& ar, const std::map<Key, Value, Less, Allocator>& map) {
    save<uint32_t>(ar, static_cast<uint32_t>(map.size()));
    for (const auto& [key, value] : map) {
        save(ar, key);
        save(ar, value);
    }
}

template <class Key, class Value, class Less, class Allocator,
          std::enable_if_t<!std::uses_allocator_v<Key, Allocator>, bool> = false,
          std::enable_if_t<!std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, std::map<Key, Value, Less, Allocator>& map) {
    uint32_t sz = 0;
    load(ar, sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Key key;
        Value value;
        load(ar, key);
        load(ar, value);
        map.emplace(std::move(key), std::move(value));
    }
}

template <class Key, class Value, class Less, class Allocator,
          std::enable_if_t<std::uses_allocator_v<Key, Allocator>, bool> = false,
          std::enable_if_t<!std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, std::map<Key, Value, Less, Allocator>& map) {
    uint32_t sz = 0;
    load(ar, sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Key key(map.get_allocator());
        Value value;
        load(ar, key);
        load(ar, value);
        map.emplace(std::move(key), std::move(value));
    }
}

template <class Key, class Value, class Less, class Allocator,
          std::enable_if_t<!std::uses_allocator_v<Key, Allocator>, bool> = false,
          std::enable_if_t<std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, std::map<Key, Value, Less, Allocator>& map) {
    uint32_t sz = 0;
    load(ar, sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Key key;
        Value value(map.get_allocator());
        load(ar, key);
        load(ar, value);
        map.emplace(std::move(key), std::move(value));
    }
}

template <class Key, class Value, class Less, class Allocator,
          std::enable_if_t<std::uses_allocator_v<Key, Allocator>, bool> = false,
          std::enable_if_t<std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, std::map<Key, Value, Less, Allocator>& map) {
    uint32_t sz = 0;
    load(ar, sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Key key(map.get_allocator());
        Value value(map.get_allocator());
        load(ar, key);
        load(ar, value);
        map.emplace(std::move(key), std::move(value));
    }
}

// flat_map
template <class Key, class Value, class Less, class Allocator>
void save(OutputArchive& ar, const boost::container::flat_map<Key, Value, Less, Allocator>& map) {
    save<uint32_t>(ar, static_cast<uint32_t>(map.size()));
    for (const auto& [key, value] : map) {
        save(ar, key);
        save(ar, value);
    }
}

template <class Key, class Value, class Less, class Allocator,
          std::enable_if_t<!std::uses_allocator_v<Key, Allocator>, bool> = false,
          std::enable_if_t<!std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, boost::container::flat_map<Key, Value, Less, Allocator>& map) {
    uint32_t sz = 0;
    load(ar, sz);
    map.reserve(sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Key key;
        Value value;
        load(ar, key);
        load(ar, value);
        map.emplace(std::move(key), std::move(value));
    }
}

template <class Key, class Value, class Less, class Allocator,
          std::enable_if_t<std::uses_allocator_v<Key, Allocator>, bool> = false,
          std::enable_if_t<!std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, boost::container::flat_map<Key, Value, Less, Allocator>& map) {
    uint32_t sz = 0;
    load(ar, sz);
    map.reserve(sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Key key(map.get_allocator());
        Value value;
        load(ar, key);
        load(ar, value);
        map.emplace(std::move(key), std::move(value));
    }
}

template <class Key, class Value, class Less, class Allocator,
          std::enable_if_t<!std::uses_allocator_v<Key, Allocator>, bool> = false,
          std::enable_if_t<std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, boost::container::flat_map<Key, Value, Less, Allocator>& map) {
    uint32_t sz = 0;
    load(ar, sz);
    map.reserve(sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Key key;
        Value value(map.get_allocator());
        load(ar, key);
        load(ar, value);
        map.emplace(std::move(key), std::move(value));
    }
}

template <class Key, class Value, class Less, class Allocator,
          std::enable_if_t<std::uses_allocator_v<Key, Allocator>, bool> = false,
          std::enable_if_t<std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, boost::container::flat_map<Key, Value, Less, Allocator>& map) {
    uint32_t sz = 0;
    load(ar, sz);
    map.reserve(sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Key key(map.get_allocator());
        Value value(map.get_allocator());
        load(ar, key);
        load(ar, value);
        map.emplace(std::move(key), std::move(value));
    }
}

// unordered_map
template <class Key, class Value, class Hash, class Pred, class Allocator>
void save(OutputArchive& ar, const std::unordered_map<Key, Value, Hash, Pred, Allocator>& map) {
    save<uint32_t>(ar, static_cast<uint32_t>(map.size()));
    for (const auto& [key, value] : map) {
        save(ar, key);
        save(ar, value);
    }
}

template <class Key, class Value, class Hash, class Pred, class Allocator,
          std::enable_if_t<!std::uses_allocator_v<Key, Allocator>, bool> = false,
          std::enable_if_t<!std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, std::unordered_map<Key, Value, Hash, Pred, Allocator>& map) {
    uint32_t sz = 0;
    load(ar, sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Key key;
        Value value;
        load(ar, key);
        load(ar, value);
        map.emplace(std::move(key), std::move(value));
    }
}

template <class Key, class Value, class Hash, class Pred, class Allocator,
          std::enable_if_t<std::uses_allocator_v<Key, Allocator>, bool> = false,
          std::enable_if_t<!std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, std::unordered_map<Key, Value, Hash, Pred, Allocator>& map) {
    uint32_t sz = 0;
    load(ar, sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Key key(map.get_allocator());
        Value value;
        load(ar, key);
        load(ar, value);
        map.emplace(std::move(key), std::move(value));
    }
}

template <class Key, class Value, class Hash, class Pred, class Allocator,
          std::enable_if_t<!std::uses_allocator_v<Key, Allocator>, bool> = false,
          std::enable_if_t<std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, std::unordered_map<Key, Value, Hash, Pred, Allocator>& map) {
    uint32_t sz = 0;
    load(ar, sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Key key;
        Value value(map.get_allocator());
        load(ar, key);
        load(ar, value);
        map.emplace(std::move(key), std::move(value));
    }
}

template <class Key, class Value, class Hash, class Pred, class Allocator,
          std::enable_if_t<std::uses_allocator_v<Key, Allocator>, bool> = false,
          std::enable_if_t<std::uses_allocator_v<Value, Allocator>, bool> = false>
void load(InputArchive& ar, std::unordered_map<Key, Value, Hash, Pred, Allocator>& map) {
    uint32_t sz = 0;
    load(ar, sz);
    for (uint32_t i = 0; i != sz; ++i) {
        Key key(map.get_allocator());
        Value value(map.get_allocator());
        load(ar, key);
        load(ar, value);
        map.emplace(std::move(key), std::move(value));
    }
}

// gfx
inline void save(OutputArchive& ar, const gfx::Color& v) {
    save(ar, v.x);
    save(ar, v.y);
    save(ar, v.z);
    save(ar, v.w);
}

inline void load(InputArchive& ar, gfx::Color& v) {
    load(ar, v.x);
    load(ar, v.y);
    load(ar, v.z);
    load(ar, v.w);
}

inline void save(OutputArchive& ar, const gfx::Uniform& v) {
    save(ar, v.name);
    save(ar, v.type);
    save(ar, v.count);
}

inline void load(InputArchive& ar, gfx::Uniform& v) {
    load(ar, v.name);
    load(ar, v.type);
    load(ar, v.count);
}

inline void save(OutputArchive& ar, const gfx::UniformBlock& v) {
    save(ar, v.set);
    save(ar, v.binding);
    save(ar, v.name);
    save(ar, v.members);
    save(ar, v.count);
}

inline void load(InputArchive& ar, gfx::UniformBlock& v) {
    load(ar, v.set);
    load(ar, v.binding);
    load(ar, v.name);
    load(ar, v.members);
    load(ar, v.count);
}

inline void save(OutputArchive& ar, const gfx::DescriptorSetLayoutBinding& v) {
    save(ar, v.binding);
    save(ar, v.descriptorType);
    save(ar, v.count);
    save(ar, v.stageFlags);
    // skip immutableSamplers: SamplerList
}

inline void load(InputArchive& ar, gfx::DescriptorSetLayoutBinding& v) {
    load(ar, v.binding);
    load(ar, v.descriptorType);
    load(ar, v.count);
    load(ar, v.stageFlags);
    // skip immutableSamplers: SamplerList
}

inline void save(OutputArchive& ar, const gfx::DescriptorSetLayoutInfo& v) {
    save(ar, v.bindings);
}

inline void load(InputArchive& ar, gfx::DescriptorSetLayoutInfo& v) {
    load(ar, v.bindings);
}

} // namespace render

} // namespace cc
