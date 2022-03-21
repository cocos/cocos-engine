#pragma once

#include <unordered_set>
#include "boost/container/pmr/polymorphic_allocator.hpp"

namespace ccstd {
template <typename T>
using unordered_set = std::unordered_set<T>;

namespace pmr {
template <typename T>
using unordered_set = std::unordered_set<T, boost::container::pmr::polymorphic_allocator<T>>;
}
} // namespace ccstd
