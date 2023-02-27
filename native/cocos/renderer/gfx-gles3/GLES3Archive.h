#pragma once

#include <iostream>

namespace cc::gfx {

class BinaryInputArchive {
public:
    BinaryInputArchive(std::istream &stream) : _stream(stream) {}
    ~BinaryInputArchive() noexcept = default;

    bool load(char *data, uint32_t size);

    template <typename T, typename = std::enable_if<std::is_arithmetic_v<T>>>
    bool load(T &val) {
        return load(reinterpret_cast<char*>(std::addressof(val)), sizeof(T));
    }

private:
    std::istream &_stream;
};

class BinaryOutputArchive {
public:
    BinaryOutputArchive(std::ostream &stream) : _stream(stream) {}
    ~BinaryOutputArchive() noexcept = default;

    void save(const char* data, uint32_t size);

    template <typename T, typename = std::enable_if<std::is_arithmetic_v<T>>>
    void save(const T &v) {
        save(reinterpret_cast<const char*>(std::addressof(v)), sizeof(T));
    }

private:
    std::ostream &_stream;
};

} // namespace cc::gfx
