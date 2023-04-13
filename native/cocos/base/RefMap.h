/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

#include "base/Log.h"
#include "base/Random.h"
#include "base/RefCounted.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"

namespace cc {

/**
 * Similar to ccstd::unordered_map, but it will manage reference count automatically internally.
 * Which means it will invoke RefCounted::addRef() when adding an element, and invoke RefCounted::release() when removing an element.
 * @warning The element should be `RefCounted` or its sub-class.
 */
template <class K, class V>
class RefMap {
public:
    // ------------------------------------------
    // Iterators
    // ------------------------------------------

    /** Iterator, can be used to loop the Map. */
    using iterator = typename ccstd::unordered_map<K, V>::iterator;
    /** Const iterator, can be used to loop the Map. */
    using const_iterator = typename ccstd::unordered_map<K, V>::const_iterator;

    /** Return iterator to beginning. */
    iterator begin() { return _data.begin(); }
    /** Return const_iterator to beginning. */
    const_iterator begin() const { return _data.begin(); }

    /** Return iterator to end.*/
    iterator end() { return _data.end(); }
    /** Return const_iterator to end.*/
    const_iterator end() const { return _data.end(); }

    /** Return const_iterator to beginning.*/
    const_iterator cbegin() const { return _data.cbegin(); }
    /** Return const_iterator to end.*/
    const_iterator cend() const { return _data.cend(); }

    /** Default constructor */
    RefMap<K, V>() {
        static_assert(std::is_convertible<V, RefCounted *>::value, "Invalid Type for cc::Map<K, V>!");
    }

    /** Constructor with capacity. */
    explicit RefMap<K, V>(uint32_t capacity) {
        static_assert(std::is_convertible<V, RefCounted *>::value, "Invalid Type for cc::Map<K, V>!");
        _data.reserve(capacity);
    }

    /** Copy constructor. */
    RefMap<K, V>(const RefMap<K, V> &other) {
        static_assert(std::is_convertible<V, RefCounted *>::value, "Invalid Type for cc::Map<K, V>!");
        _data = other._data;
        addRefForAllObjects();
    }

    /** Move constructor. */
    RefMap<K, V>(RefMap<K, V> &&other) noexcept {
        static_assert(std::is_convertible<V, RefCounted *>::value, "Invalid Type for cc::Map<K, V>!");
        _data = std::move(other._data);
    }

    /**
     * Destructor.
     * It will release all objects in map.
     */
    ~RefMap<K, V>() {
        clear();
    }

    /** Sets capacity of the map. */
    void reserve(uint32_t capacity) {
        _data.reserve(capacity);
    }

    /** Returns the number of buckets in the Map container. */
    uint32_t bucketCount() const {
        return static_cast<uint32_t>(_data.bucket_count());
    }

    /** Returns the number of elements in bucket n. */
    uint32_t bucketSize(uint32_t n) const {
        return static_cast<uint32_t>(_data.bucket_size(n));
    }

    /** Returns the bucket number where the element with key k is located. */
    uint32_t bucket(const K &k) const {
        return _data.bucket(k);
    }

    /** The number of elements in the map. */
    uint32_t size() const {
        return static_cast<uint32_t>(_data.size());
    }

    /**
     * Returns a bool value indicating whether the map container is empty, i.e. whether its size is 0.
     *  @note This function does not modify the content of the container in any way.
     *        To clear the content of an array object, member function unordered_map::clear exists.
     */
    bool empty() const {
        return _data.empty();
    }

    /** Returns all keys in the map. */
    ccstd::vector<K> keys() const {
        ccstd::vector<K> keys;

        if (!_data.empty()) {
            keys.reserve(_data.size());

            for (const auto &element : _data) {
                keys.push_back(element.first);
            }
        }
        return keys;
    }

    /** Returns all keys that matches the object. */
    ccstd::vector<K> keys(V object) const {
        ccstd::vector<K> keys;

        if (!_data.empty()) {
            keys.reserve(_data.size() / 10);

            for (const auto &element : _data) {
                if (element.second == object) {
                    keys.push_back(element.first);
                }
            }
        }

        keys.shrink_to_fit();

        return keys;
    }

    /**
     * Returns a reference to the mapped value of the element with key k in the map.
     *
     *  @note If key does not match the key of any element in the container, the function return nullptr.
     *  @param key Key value of the element whose mapped value is accessed.
     *       Member type K is the keys for the elements in the container. defined in Map<K, V> as an alias of its first template parameter (Key).
     */
    V at(const K &key) {
        auto iter = _data.find(key);
        if (iter != _data.end()) {
            return iter->second;
        }
        return nullptr;
    }

    /**
     * Searches the container for an element with 'key' as key and returns an iterator to it if found,
     *         otherwise it returns an iterator to Map<K, V>::end (the element past the end of the container).
     *
     * @param key Key to be searched for.
     *        Member type 'K' is the type of the keys for the elements in the container,
     *        defined in Map<K, V> as an alias of its first template parameter (Key).
     */
    const_iterator find(const K &key) const {
        return _data.find(key);
    }

    iterator find(const K &key) {
        return _data.find(key);
    }

    /**
     * Inserts new elements in the map.
     *
     * @note If the container has already contained the key, this function will erase the old pair(key, object)  and insert the new pair.
     * @param key The key to be inserted.
     * @param object The object to be inserted.
     */
    void insert(const K &key, V object) {
        CC_ASSERT_NOT_NULL(object);
        object->addRef();
        erase(key);
        _data.insert(std::make_pair(key, object));
    }

    /**
     * Removes an element with an iterator from the Map<K, V> container.
     *
     * @param position Iterator pointing to a single element to be removed from the Map<K, V>.
     *        Member type const_iterator is a forward iterator type.
     */
    iterator erase(const_iterator position) {
        CC_ASSERT(position != _data.cend());
        position->second->release();
        return _data.erase(position);
    }

    /**
     * Removes an element with an iterator from the Map<K, V> container.
     *
     * @param k Key of the element to be erased.
     *        Member type 'K' is the type of the keys for the elements in the container,
     *        defined in Map<K, V> as an alias of its first template parameter (Key).
     */
    size_t erase(const K &k) {
        auto iter = _data.find(k);
        if (iter != _data.end()) {
            iter->second->release();
            _data.erase(iter);
            return 1;
        }
        return 0;
    }

    /**
     * Removes some elements with a vector which contains keys in the map.
     *
     * @param keys Keys of elements to be erased.
     */
    void erase(const ccstd::vector<K> &keys) {
        for (const auto &key : keys) {
            this->erase(key);
        }
    }

    /**
     * All the elements in the Map<K,V> container are dropped:
     *  their reference count will be decreased, and they are removed from the container,
     *  leaving it with a size of 0.
     */
    void clear() {
        for (const auto &element : _data) {
            element.second->release();
        }

        _data.clear();
    }

    /**
     * Gets a random object in the map.
     * @return Returns the random object if the map isn't empty, otherwise it returns nullptr.
     */
    V getRandomObject() const {
        if (!_data.empty()) {
            auto randIdx = RandomHelper::randomInt<int>(0, static_cast<int>(_data.size()) - 1);
            const_iterator randIter = _data.begin();
            std::advance(randIter, randIdx);
            return randIter->second;
        }
        return nullptr;
    }

    /** Copy assignment operator. */
    RefMap<K, V> &operator=(const RefMap<K, V> &other) {
        if (this != &other) {
            clear();
            _data = other._data;
            addRefForAllObjects();
        }
        return *this;
    }

    /** Move assignment operator. */
    RefMap<K, V> &operator=(RefMap<K, V> &&other) noexcept {
        if (this != &other) {
            clear();
            _data = std::move(other._data);
        }
        return *this;
    }

private:
    /** Retains all the objects in the map */
    void addRefForAllObjects() {
        for (const auto &element : _data) {
            element.second->addRef();
        }
    }

    ccstd::unordered_map<K, V> _data;
};

} // namespace cc
