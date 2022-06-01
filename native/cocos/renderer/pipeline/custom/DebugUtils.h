#pragma once
#include <sstream>
#include "base/std/container/string.h"
#include "boost/utility/string_view.hpp"

namespace cc {

namespace render {

template <class String>
class Indent {
public:
    explicit Indent(String& indent)
    : mIndent(&indent) {
        mIndent->append("    ");
    }
    ~Indent() {
        reset();
    }
    Indent(Indent&& rhs) noexcept
    : mIndent(rhs.mIndent) {
        rhs.mIndent = nullptr;
    }
    Indent& operator=(Indent&& rhs) noexcept {
        mIndent = rhs.mIndent;
        rhs.mIndent = nullptr;
        return *this;
    }
    void reset() {
        if (mIndent) {
            mIndent->erase(mIndent->size() - 4);
            mIndent = nullptr;
        }
    }
    String* mIndent = nullptr;
};

inline Indent<ccstd::string> indent(ccstd::string& str) {
    return Indent<ccstd::string>(str);
}

inline Indent<ccstd::pmr::string> indent(ccstd::pmr::string& str) {
    return Indent<ccstd::pmr::string>(str);
}

inline void copyString(std::ostream& os,
                       boost::string_view space, boost::string_view str, // NOLINT(bugprone-easily-swappable-parameters)
                       bool append = false) {
    std::istringstream iss{ccstd::string(str)};
    ccstd::string line;
    int count = 0;
    while (std::getline(iss, line)) {
        if (line.empty()) {
            os << '\n';
        } else if (line[0] == '#') {
            os << line << '\n';
        } else {
            if (append) {
                if (count == 0) {
                    os << line;
                } else {
                    os << '\n'
                       << space << line;
                }
            } else {
                os << space << line << '\n';
            }
        }
        ++count;
    }
}

inline void copyString(std::ostream& os, boost::string_view str) {
    std::istringstream iss{ccstd::string(str)};
    ccstd::string line;
    while (std::getline(iss, line)) {
        if (line.empty()) {
            os << '\n';
        } else {
            os << line << '\n';
        }
    }
}

inline void copyCppString(std::ostream& os,
    boost::string_view space, boost::string_view str, // NOLINT(bugprone-easily-swappable-parameters)
    bool append = false) {
    std::istringstream iss{ccstd::string(str)};
    ccstd::string line;
    int count = 0;
    while (std::getline(iss, line)) {
        if (line.empty()) {
            os << '\n';
        } else if (line[0] == '#') {
            os << line << '\n';
        } else if (*line.rbegin() == ':') {
            os << space.substr(0, std::max(size_t(4), space.size()) - 4) << line << "\n";
        } else {
            if (append) {
                if (count == 0) {
                    os << line;
                } else {
                    os << '\n'
                       << space << line;
                }
            } else {
                os << space << line << '\n';
            }
        }
        ++count;
    }
}

} // namespace render

} // namespace cc

#define OSS oss << space

#define INDENT(...)   auto ind_##__VA_ARGS__ = indent(space)
#define UNINDENT(...) ind_##__VA_ARGS__.reset()

#define INDENT_BEG() space.append("    ")
#define INDENT_END() space.erase(std::max(space.size(), size_t(4)) - 4)
