/****************************************************************************
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
****************************************************************************/

#pragma once

#define USE_STD_UNORDERED_MAP 1

#include <vector>

#if USE_STD_UNORDERED_MAP
    #include <unordered_map>
#else
    #include <map>
#endif

#include "base/Log.h"
#include "base/Random.h"
#include "base/RefCounted.h"

namespace cc {

/**
 * Similar to std::unordered_map, but it will manage reference count automatically internally.
 * Which means it will invoke Ref::retain() when adding an element, and invoke Ref::release() when removing an element.
 * @warning The element should be `Ref` or its sub-class.
 * @js NA
 * @lua NA
 */
template <class K, class V>
class Map {
public:
#if USE_STD_UNORDERED_MAP
    using RefMap = std::unordered_map<K, V>;
#else
    typedef std::map<K, V> RefMap;
#endif

    // ------------------------------------------
    // Iterators
    // ------------------------------------------

    /** Iterator, can be used to loop the Map. */
    using iterator = typename RefMap::iterator;
    /** Const iterator, can be used to loop the Map. */
    using const_iterator = typename RefMap::const_iterator;

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
    Map<K, V>()
    : _data() {
        static_assert(std::is_convertible<V, RefCounted *>::value, "Invalid Type for cc::Map<K, V>!");
    }

    /** Constructor with capacity. */
    explicit Map<K, V>(ssize_t capacity)
    : _data() {
        static_assert(std::is_convertible<V, RefCounted *>::value, "Invalid Type for cc::Map<K, V>!");
        _data.reserve(capacity);
    }

    /** Copy constructor. */
    Map<K, V>(const Map<K, V> &other) {
        static_assert(std::is_convertible<V, RefCounted *>::value, "Invalid Type for cc::Map<K, V>!");
        _data = other._data;
        addRefForAllObjects();
    }

    /** Move constructor. */
    Map<K, V>(Map<K, V> &&other) noexcept {
        static_assert(std::is_convertible<V, RefCounted *>::value, "Invalid Type for cc::Map<K, V>!");
        _data = std::move(other._data);
    }

    /**
     * Destructor.
     * It will release all objects in map.
     */
    ~Map<K, V>() {
        clear();
    }

    /** Sets capacity of the map. */
    void reserve(ssize_t capacity) {
#if USE_STD_UNORDERED_MAP
        _data.reserve(capacity);
#endif
    }

    /** Returns the number of buckets in the Map container. */
    ssize_t bucketCount() const {
#if USE_STD_UNORDERED_MAP
        return _data.bucket_count();
#else
        return 0;
#endif
    }

    /** Returns the number of elements in bucket n. */
    ssize_t bucketSize(ssize_t n) const {
#if USE_STD_UNORDERED_MAP
        return _data.bucket_size(n);
#else
        return 0;
#endif
    }

    /** Returns the bucket number where the element with key k is located. */
    ssize_t bucket(const K &k) const {
#if USE_STD_UNORDERED_MAP
        return _data.bucket(k);
#else
        return 0;
#endif
    }

    /** The number of elements in the map. */
    ssize_t size() const {
        return _data.size();
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
    std::vector<K> keys() const {
        std::vector<K> keys;

        if (!_data.empty()) {
            keys.reserve(_data.size());

            for (auto iter = _data.cbegin(); iter != _data.cend(); ++iter) {
                keys.push_back(iter->first);
            }
        }
        return keys;
    }

    /** Returns all keys that matches the object. */
    std::vector<K> keys(V object) const {
        std::vector<K> keys;

        if (!_data.empty()) {
            keys.reserve(_data.size() / 10);

            for (auto iter = _data.cbegin(); iter != _data.cend(); ++iter) {
                if (iter->second == object) {
                    keys.push_back(iter->first);
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
        CCASSERT(object != nullptr, "Object is nullptr!");
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
        CCASSERT(position != _data.cend(), "Invalid iterator!");
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
    void erase(const std::vector<K> &keys) {
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
        for (auto iter = _data.cbegin(); iter != _data.cend(); ++iter) {
            iter->second->release();
        }

        _data.clear();
    }

    /**
     * Gets a random object in the map.
     * @return Returns the random object if the map isn't empty, otherwise it returns nullptr.
     */
    V getRandomObject() const {
        if (!_data.empty()) {
            auto           randIdx  = RandomHelper::randomInt<int>(0, static_cast<int>(_data.size()) - 1);
            const_iterator randIter = _data.begin();
            std::advance(randIter, randIdx);
            return randIter->second;
        }
        return nullptr;
    }

    /** Copy assignment operator. */
    Map<K, V> &operator=(const Map<K, V> &other) {
        if (this != &other) {
            clear();
            _data = other._data;
            addRefForAllObjects();
        }
        return *this;
    }

    /** Move assignment operator. */
    Map<K, V> &operator=(Map<K, V> &&other) noexcept {
        if (this != &other) {
            clear();
            _data = std::move(other._data);
        }
        return *this;
    }

protected:
    /** Retains all the objects in the map */
    void addRefForAllObjects() {
        for (auto iter = _data.begin(); iter != _data.end(); ++iter) {
            iter->second->addRef();
        }
    }

    RefMap _data;
};

} // namespace cc
