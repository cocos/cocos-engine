#pragma once

#include <set>
#include "boost/container/pmr/polymorphic_allocator.hpp"

namespace ccstd {
template <
    class Key,
    class Compare = std::less<Key>>
using set = std::set<Key, Compare>;

namespace pmr {
template <
    class Key,
    class Compare = std::less<Key>>
using set = std::set<Key, Compare, boost::container::pmr::polymorphic_allocator<Key>>;
}
} // namespace ccstd
