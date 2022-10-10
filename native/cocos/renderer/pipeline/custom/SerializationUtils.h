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
#include <map>
#include <memory>
#include <string>
#include <type_traits>
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
    ar.writeNumber(static_cast<double>(v));
}

template <class T,
          std::enable_if_t<
              std::is_enum_v<T> || std::is_integral_v<T> || std::is_floating_point_v<T>,
              bool> = false>
void load(InputArchive& ar, T& v) {
    v = static_cast<T>(ar.readNumber());
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

// gfx
inline void save(OutputArchive& ar, const gfx::Color& v) {
    ar.writeNumber(v.x);
    ar.writeNumber(v.y);
    ar.writeNumber(v.z);
    ar.writeNumber(v.w);
}

inline void load(InputArchive& ar, gfx::Color& v) {
    v.x = static_cast<float>(ar.readNumber());
    v.y = static_cast<float>(ar.readNumber());
    v.z = static_cast<float>(ar.readNumber());
    v.w = static_cast<float>(ar.readNumber());
}

} // namespace render

} // namespace cc
