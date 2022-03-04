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

#pragma once

#include <deque>
#include <list>
#include <map>
#include <queue>
#include <set>
#include <string>
#include <unordered_map>
#include <unordered_set>

namespace cc {

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

using String = std::string;
using WString = std::wstring;
using StringArray = vector<String>;

} // namespace cc
