#pragma once
#include <cocos/base/Macros.h>
#include <utility>

namespace cc {

namespace gsl {

// narrow_cast(): a searchable way to do narrowing casts of values
template <class T, class U>
constexpr T narrow_cast(U &&u) noexcept { // NOLINT
    return static_cast<T>(std::forward<U>(u));
}

#define CC_EXPECTS(cond) CC_ASSERT(cond) // NOLINT

#define CC_ENSURES(cond) CC_ASSERT(cond) // NOLINT

} // namespace gsl

} // namespace cc
