/****************************************************************************
This source file is part of OGRE
(Object-oriented Graphics Rendering Engine)
For the latest info, see http://www.ogre3d.org/

Copyright (c) 2000-2014 Torus Knot Software Ltd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

#ifndef CC_CORE_STL_ALLOC_H_
#define CC_CORE_STL_ALLOC_H_

#include "MemDef.h"
#include <deque>
#include <list>
#include <map>
#include <queue>
#include <set>
#include <string>
#include <unordered_map>
#include <unordered_set>

namespace cc {

// Base STL allocator class.
template <typename T>
struct STLAllocatorBase {
    // base class for generic allocators
    typedef T value_type;
};

// Base STL allocator class. (const T version).
template <typename T>
struct STLAllocatorBase<const T> {
    // base class for generic allocators for const T
    typedef T value_type;
};

template <typename T, typename AllocPolicy>
class SA : public STLAllocatorBase<T> {
public:
    /// define our types, as per ISO C++
    typedef STLAllocatorBase<T> Base;
    typedef typename Base::value_type value_type;
    typedef value_type *pointer;
    typedef const value_type *const_pointer;
    typedef value_type &reference;
    typedef const value_type &const_reference;
    typedef std::size_t size_type;
    typedef std::ptrdiff_t difference_type;

    /// the standard rebind mechanism
    template <typename U>
    struct rebind {
        typedef SA<U, AllocPolicy> other;
    };

    /// ctor
    inline explicit SA() {}

    /// dtor
    virtual ~SA() {}

    /// copy ctor - done component wise
    inline SA(SA const &) {}

    /// cast
    template <typename U>
    inline SA(SA<U, AllocPolicy> const &) {}

    /// cast
    template <typename U, typename P>
    inline SA(SA<U, P> const &) {}

    // TODO: fix C++17 warning
    //inline pointer allocate(size_type count, typename std::allocator<void>::const_pointer ptr = 0) {
    //    (void)ptr;

    //    // convert request to bytes
    //    register size_type sz = count * sizeof(T);
    //    return static_cast<pointer>(AllocPolicy::AllocateBytes(sz));
    //}

    inline void deallocate(pointer ptr, size_type) {
        AllocPolicy::DeallocateBytes(ptr);
    }

    pointer address(reference x) const {
        return &x;
    }

    const_pointer address(const_reference x) const {
        return &x;
    }

    size_type max_size() const throw() {
        return size_t(-1) / sizeof(T);
    }

#if __cplusplus >= 201103L
    template <typename Up, typename... Args>
    void construct(Up *p, Args &&... args) {
        ::new ((void *)p) Up(std::forward<Args>(args)...);
    }

    template <typename Up>
    void destroy(Up *p) {
        p->~Up();
    }
#else
    void construct(pointer p, const T &val) {
        // call placement new
        ::new ((void *)p) T(val);
    }

    void destroy(pointer p) {
        // do we have to protect against non-classes here?
        // some articles suggest yes, some no
        p->~T();
    }
#endif
};

/// determine equality, can memory from another allocator
/// be released by this allocator, (ISO C++)
template <typename T, typename T2, typename P>
inline bool operator==(SA<T, P> const &, SA<T2, P> const &) {
    // same alloc policy (P), memory can be freed
    return true;
}

/// determine equality, can memory from another allocator
/// be released by this allocator, (ISO C++)
template <typename T, typename P, typename OtherAllocator>
inline bool operator==(SA<T, P> const &, OtherAllocator const &) {
    return false;
}
/// determine equality, can memory from another allocator
/// be released by this allocator, (ISO C++)
template <typename T, typename T2, typename P>
inline bool operator!=(SA<T, P> const &, SA<T2, P> const &) {
    // same alloc policy (P), memory can be freed
    return false;
}

/// determine equality, can memory from another allocator
/// be released by this allocator, (ISO C++)
template <typename T, typename P, typename OtherAllocator>
inline bool operator!=(SA<T, P> const &, OtherAllocator const &) {
    return true;
}

////////////////////////////////////////////////////////////////////
extern CC_DLL SA<char, STLAP> stl_char_allocator;

#define StdStringT(T)          std::basic_string<T, std::char_traits<T>, std::allocator<T>>
#define CustomMemoryStringT(T) std::basic_string<T, std::char_traits<T>, SA<T, STLAP>>

template <typename T>
bool operator<(const CustomMemoryStringT(T) & l, const StdStringT(T) & o) {
    return l.compare(0, l.length(), o.c_str(), o.length()) < 0;
}
template <typename T>
bool operator<(const StdStringT(T) & l, const CustomMemoryStringT(T) & o) {
    return l.compare(0, l.length(), o.c_str(), o.length()) < 0;
}
template <typename T>
bool operator<=(const CustomMemoryStringT(T) & l, const StdStringT(T) & o) {
    return l.compare(0, l.length(), o.c_str(), o.length()) <= 0;
}
template <typename T>
bool operator<=(const StdStringT(T) & l, const CustomMemoryStringT(T) & o) {
    return l.compare(0, l.length(), o.c_str(), o.length()) <= 0;
}
template <typename T>
bool operator>(const CustomMemoryStringT(T) & l, const StdStringT(T) & o) {
    return l.compare(0, l.length(), o.c_str(), o.length()) > 0;
}
template <typename T>
bool operator>(const StdStringT(T) & l, const CustomMemoryStringT(T) & o) {
    return l.compare(0, l.length(), o.c_str(), o.length()) > 0;
}
template <typename T>
bool operator>=(const CustomMemoryStringT(T) & l, const StdStringT(T) & o) {
    return l.compare(0, l.length(), o.c_str(), o.length()) >= 0;
}
template <typename T>
bool operator>=(const StdStringT(T) & l, const CustomMemoryStringT(T) & o) {
    return l.compare(0, l.length(), o.c_str(), o.length()) >= 0;
}

template <typename T>
bool operator==(const CustomMemoryStringT(T) & l, const StdStringT(T) & o) {
    return l.compare(0, l.length(), o.c_str(), o.length()) == 0;
}
template <typename T>
bool operator==(const StdStringT(T) & l, const CustomMemoryStringT(T) & o) {
    return l.compare(0, l.length(), o.c_str(), o.length()) == 0;
}

template <typename T>
bool operator!=(const CustomMemoryStringT(T) & l, const StdStringT(T) & o) {
    return l.compare(0, l.length(), o.c_str(), o.length()) != 0;
}
template <typename T>
bool operator!=(const StdStringT(T) & l, const CustomMemoryStringT(T) & o) {
    return l.compare(0, l.length(), o.c_str(), o.length()) != 0;
}

template <typename T>
CustomMemoryStringT(T) operator+=(const CustomMemoryStringT(T) & l, const StdStringT(T) & o) {
    return CustomMemoryStringT(T)(l) += o.c_str();
}
template <typename T>
CustomMemoryStringT(T) operator+=(const StdStringT(T) & l, const CustomMemoryStringT(T) & o) {
    return CustomMemoryStringT(T)(l.c_str()) += o.c_str();
}

template <typename T>
CustomMemoryStringT(T) operator+(const CustomMemoryStringT(T) & l, const StdStringT(T) & o) {
    return CustomMemoryStringT(T)(l) += o.c_str();
}

template <typename T>
CustomMemoryStringT(T) operator+(const StdStringT(T) & l, const CustomMemoryStringT(T) & o) {
    return CustomMemoryStringT(T)(l.c_str()) += o.c_str();
}

template <typename T>
CustomMemoryStringT(T) operator+(const T *l, const CustomMemoryStringT(T) & o) {
    return CustomMemoryStringT(T)(l) += o;
}

#undef StdStringT
#undef CustomMemoryStringT

#if (CC_STL_MEMORY_ALLOCATOR == CC_STL_MEMORY_ALLOCATOR_CUSTOM)
template <typename T, typename A = SA<T, STLAP>>
using vector = std::vector<T, A>;

template <typename T, typename A = SA<T, STLAP>>
using list = std::list<T, A>;

template <typename T, typename A = SA<T, STLAP>>
using queue = std::queue<T, A>;

template <typename T, typename C = typename vector<T>::type, typename P = std::less<typename C::value_type>>
using priority_queue = std::priority_queue<T, C, P>;

template <typename T, typename A = SA<T, STLAP>>
using deque = std::deque<T, A>;

template <typename T, typename P = std::less<T>, typename A = SA<T, STLAP>>
using set = std::set<T, P, A>;

template <typename K, typename V, typename P = std::less<K>, typename A = SA<std::pair<const K, V>, STLAP>>
using map = std::map<K, V, P, A>;

template <typename K, typename V, typename P = std::less<K>, typename A = SA<std::pair<const K, V>, STLAP>>
using multimap = std::multimap<K, V, P, A>;

template <typename K, typename V, typename H = std::hash<K>, typename P = std::equal_to<K>, typename A = SA<std::pair<const K, V>, STLAP>>
using unordered_map = std::unordered_map<K, V, H, P, A>;

typedef std::basic_string<char, std::char_traits<char>, SA<char, STLAP>> String;
typedef std::basic_string<wchar_t, std::char_traits<wchar_t>, SA<wchar_t, STLAP>> WString;
#else
template <typename T>
using vector = std::vector<T>;

template <typename T>
using list = std::list<T>;

template <typename T>
using queue = std::queue<T>;

template <typename T, typename C = typename vector<T>::type, typename P = std::less<typename C::value_type>>
using priority_queue = std::priority_queue<T, C, P>;

template <typename T>
using deque = std::deque<T>;

template <typename T, typename P = std::less<T>>
using set = std::set<T, P>;

template <typename T, typename P = std::less<T>>
using multiset = std::multiset<T, P>;

template <typename T, typename H = std::hash<T>, typename P = std::equal_to<T>>
using unordered_set = std::unordered_set<T, H, P>;

template <typename T, typename H = std::hash<T>, typename P = std::equal_to<T>>
using unordered_multiset = std::unordered_multiset<T, H, P>;

template <typename K, typename V, typename P = std::less<K>>
using map = std::map<K, V, P>;

template <typename K, typename V, typename P = std::less<K>>
using multimap = std::multimap<K, V, P>;

template <typename K, typename V, typename H = std::hash<K>, typename P = std::equal_to<K>>
using unordered_map = std::unordered_map<K, V, H, P>;

template <typename K, typename V, typename H = std::hash<K>, typename P = std::equal_to<K>>
using unordered_multimap = std::unordered_multimap<K, V, H, P>;

typedef std::string String;
typedef std::wstring WString;
#endif

typedef vector<String> StringArray;

} // namespace cc

#endif // CC_CORE_STL_ALLOC_H_
