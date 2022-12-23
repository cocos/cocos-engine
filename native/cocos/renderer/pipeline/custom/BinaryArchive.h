/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
#include <cstdint>
#include <istream>
#include <ostream>
#include "cocos/base/std/container/string.h"
#include "cocos/renderer/pipeline/custom/ArchiveTypes.h"

namespace cc {

namespace render {

class BinaryOutputArchive final : public OutputArchive {
public:
    BinaryOutputArchive(std::ostream& os, boost::container::pmr::memory_resource* scratch)
    : _os(os), _scratch(scratch) {}

    void writeBool(bool value) override {
        uint8_t v = value ? 1 : 0;
        _os.write(reinterpret_cast<const char*>(&v), sizeof(v));
    }
    void writeNumber(double value) override {
        _os.write(reinterpret_cast<const char*>(&value), sizeof(value));
    }
    void writeString(std::string_view value) override {
        writeNumber(static_cast<double>(value.size()));
        _os.write(value.data(), static_cast<std::streamsize>(value.size()));
    }
    boost::container::pmr::memory_resource* scratch() const noexcept override {
        return _scratch;
    }

private:
    std::ostream& _os;
    boost::container::pmr::memory_resource* _scratch;
};

class BinaryInputArchive final : public InputArchive {
public:
    BinaryInputArchive(std::istream& is, boost::container::pmr::memory_resource* scratch)
    : _is(is), _temp(scratch) {}

    bool readBool() override {
        uint8_t v;
        _is.read(reinterpret_cast<char*>(&v), sizeof(v));
        return v != 0;
    }
    double readNumber() override {
        double v;
        _is.read(reinterpret_cast<char*>(&v), sizeof(v));
        return v;
    }
    std::string_view readString() override {
        double size = readNumber();
        _temp.resize(static_cast<size_t>(size));
        _is.read(_temp.data(), static_cast<std::streamsize>(size));
        return _temp;
    }
    boost::container::pmr::memory_resource* scratch() const noexcept override {
        return _temp.get_allocator().resource();
    }

private:
    std::istream& _is;
    ccstd::pmr::string _temp;
};

} // namespace render

} // namespace cc
