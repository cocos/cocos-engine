#pragma once

#include <unordered_set>
#include "boost/container/pmr/polymorphic_allocator.hpp"

namespace ccstd {
using std::unordered_set;

namespace pmr {
template <
    class Key,
    class Hash = std::hash<Key>,
    class KeyEqual = std::equal_to<Key>>
using unordered_set = std::unordered_set<Key, Hash, KeyEqual, boost::container::pmr::polymorphic_allocator<Key>>;
}
} // namespace ccstd
