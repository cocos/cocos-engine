#pragma once
#include <cocos/renderer/pipeline/custom/GslUtils.h>
#include <boost/algorithm/string/predicate.hpp>
#include <boost/utility/string_view.hpp>

namespace cc {

namespace impl {

template <class CharT, class Allocator>
inline void cleanPath(std::basic_string<CharT, std::char_traits<CharT>, Allocator> &str) noexcept {
    using string_t                = std::basic_string<CharT, std::char_traits<CharT>, Allocator>;
    constexpr CharT slash[]       = {'/', '\0'};
    constexpr CharT doubleSlash[] = {'/', '/', '\0'};

    Expects(!str.empty());
    Expects(boost::algorithm::starts_with(str, boost::string_view(slash)));
    Expects(str.find(doubleSlash) == string_t::npos);
    Expects([&]() { // NOLINT
        bool valid = true;
        for (uint8_t c : str) {
            if (c < uint8_t('.'))
                valid = false;
        }
        return valid;
    }());

    { // remove all /./
        constexpr CharT current[] = {'/', '.', '/', '\0'};

        auto pos = str.rfind(current);
        while (pos != string_t::npos) {
            str.erase(pos, 2);
            pos = str.rfind(current);
        }
        // remove tailing /.
        constexpr CharT ending[] = {'/', '.', '\0'};
        if (boost::algorithm::ends_with(str, boost::string_view(ending))) {
            str.resize(str.size() - 2);
        }
    }

    // try remove /..
    constexpr std::array<CharT, 4> previous = {CharT('/'), CharT('.'), CharT('.'), CharT('\0')};
    auto                           pos      = str.find(previous.data());
    while (pos != string_t::npos) {
        if (pos == 0) {
            // root element has not parent path
            str = {}; // slash;
            return;
        }
        auto beg = str.rfind(slash, pos - 1);
        Expects(beg != string_t::npos);
        str.erase(beg, pos - beg + previous.size() - 1);
    }
}

} // namespace impl

} // namespace cc
