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

#pragma once

#include "DevicePassResourceTable.h"

namespace cc {
namespace framegraph {

class Executable {
public:
    Executable() noexcept              = default;
    virtual ~Executable()              = default;
    Executable(const Executable &)     = delete;
    Executable(Executable &&) noexcept = delete;
    Executable &operator=(const Executable &) = delete;
    Executable &operator=(Executable &&) noexcept = delete;

    virtual void execute(const DevicePassResourceTable &resourceTable) noexcept = 0;
};

template <typename Data, typename ExecuteMethodType>
class CallbackPass final : public Executable {
public:
    using ExecuteMethod = std::remove_reference_t<ExecuteMethodType>;

    explicit CallbackPass(ExecuteMethod &execute) noexcept;
    explicit CallbackPass(ExecuteMethod &&execute) noexcept;

    void               execute(const DevicePassResourceTable &resourceTable) noexcept override;
    inline const Data &getData() const noexcept { return _data; }
    inline Data &      getData() noexcept { return _data; }

private:
    Data          _data;
    ExecuteMethod _execute;
};

//////////////////////////////////////////////////////////////////////////

template <typename Data, typename ExecuteMethod>
CallbackPass<Data, ExecuteMethod>::CallbackPass(ExecuteMethod &execute) noexcept
: Executable(),
  _execute(execute) {
}

template <typename Data, typename ExecuteMethod>
CallbackPass<Data, ExecuteMethod>::CallbackPass(ExecuteMethod &&execute) noexcept
: Executable(),
  _execute(execute) {
}

template <typename Data, typename ExecuteMethod>
void CallbackPass<Data, ExecuteMethod>::execute(const DevicePassResourceTable &resourceTable) noexcept {
    _execute(_data, resourceTable);
}

} // namespace framegraph
} // namespace cc
