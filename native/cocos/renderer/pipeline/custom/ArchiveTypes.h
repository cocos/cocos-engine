/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include <boost/container/pmr/memory_resource.hpp>
#include <string_view>
#include "cocos/renderer/pipeline/custom/ArchiveFwd.h"

namespace cc {

namespace render {

class OutputArchive {
public:
    OutputArchive() noexcept = default;
    OutputArchive(OutputArchive&& rhs) = delete;
    OutputArchive(OutputArchive const& rhs) = delete;
    OutputArchive& operator=(OutputArchive&& rhs) = delete;
    OutputArchive& operator=(OutputArchive const& rhs) = delete;
    virtual ~OutputArchive() noexcept = default;

    virtual void writeBool(bool value) = 0;
    virtual void writeNumber(double value) = 0;
    virtual void writeString(std::string_view value) = 0;
    virtual boost::container::pmr::memory_resource* scratch() const noexcept = 0;
};

class InputArchive {
public:
    InputArchive() noexcept = default;
    InputArchive(InputArchive&& rhs) = delete;
    InputArchive(InputArchive const& rhs) = delete;
    InputArchive& operator=(InputArchive&& rhs) = delete;
    InputArchive& operator=(InputArchive const& rhs) = delete;
    virtual ~InputArchive() noexcept = default;

    virtual bool readBool() = 0;
    virtual double readNumber() = 0;
    virtual std::string_view readString() = 0;
    virtual boost::container::pmr::memory_resource* scratch() const noexcept = 0;
};

} // namespace render

} // namespace cc

// clang-format on
