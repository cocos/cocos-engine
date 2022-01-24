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

#include <unordered_map>
#include "Handle.h"
#include "base/Macros.h"

namespace cc {
namespace framegraph {

template <typename KeyType, typename ValueType, ValueType InvalidValue>
class Blackboard final {
public:
    Blackboard()                       = default;
    ~Blackboard()                      = default;
    Blackboard(const Blackboard &)     = delete;
    Blackboard(Blackboard &&) noexcept = delete;
    Blackboard &operator=(const Blackboard &) = delete;
    Blackboard &operator=(Blackboard &&) noexcept = delete;

    inline ValueType &operator[](const KeyType &name) noexcept;
    inline void       put(const KeyType &name, ValueType handle) noexcept;
    inline ValueType  get(const KeyType &name) const noexcept;
    inline void       clear() noexcept;
    inline bool       has(const KeyType &name) const noexcept;

private:
    using Container = std::unordered_map<KeyType, ValueType, typename KeyType::Hasher>;
    Container _container;
};

//////////////////////////////////////////////////////////////////////////

template <typename KeyType, typename ValueType, ValueType InvalidValue>
ValueType &Blackboard<KeyType, ValueType, InvalidValue>::operator[](const KeyType &name) noexcept {
    const auto it = _container.find(name);
    return (it == _container.end() ? _container.emplace(name, InvalidValue).first : it)->second;
}

template <typename KeyType, typename ValueType, ValueType InvalidValue>
void Blackboard<KeyType, ValueType, InvalidValue>::put(const KeyType &name, ValueType const handle) noexcept {
    _container[name] = handle;
}

template <typename KeyType, typename ValueType, ValueType InvalidValue>
ValueType Blackboard<KeyType, ValueType, InvalidValue>::get(const KeyType &name) const noexcept {
    const auto it = _container.find(name);
    return it == _container.end() ? InvalidValue : it->second;
}

template <typename KeyType, typename ValueType, ValueType InvalidValue>
void Blackboard<KeyType, ValueType, InvalidValue>::clear() noexcept {
    _container.clear();
}

template <typename KeyType, typename ValueType, ValueType InvalidValue>
bool Blackboard<KeyType, ValueType, InvalidValue>::has(const KeyType &name) const noexcept {
    return _container.find(name) != _container.end();
}

} // namespace framegraph
} // namespace cc
