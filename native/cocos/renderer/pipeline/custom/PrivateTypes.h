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
#include "cocos/renderer/pipeline/custom/PrivateFwd.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceTypes.h"


namespace cc {

namespace render {

class ProgramProxy {
public:
    ProgramProxy() noexcept = default;
    ProgramProxy(ProgramProxy&& rhs) = delete;
    ProgramProxy(ProgramProxy const& rhs) = delete;
    ProgramProxy& operator=(ProgramProxy&& rhs) = delete;
    ProgramProxy& operator=(ProgramProxy const& rhs) = delete;
    virtual ~ProgramProxy() noexcept = default;

    virtual const ccstd::string &getName() const noexcept = 0;
};

class ProgramLibrary {
public:
    ProgramLibrary() noexcept = default;
    ProgramLibrary(ProgramLibrary&& rhs) = delete;
    ProgramLibrary(ProgramLibrary const& rhs) = delete;
    ProgramLibrary& operator=(ProgramLibrary&& rhs) = delete;
    ProgramLibrary& operator=(ProgramLibrary const& rhs) = delete;
    virtual ~ProgramLibrary() noexcept = default;

    virtual void addEffect(EffectAsset *effectAsset) = 0;
    virtual ccstd::pmr::string getKey(uint32_t phaseID, const ccstd::pmr::string &programName, const MacroRecord &defines) const = 0;
    virtual ProgramProxy *getProgramVariant(gfx::Device *device, uint32_t phaseID, const ccstd::string &name, const MacroRecord &defines, const ccstd::pmr::string *key) const = 0;
    ProgramProxy *getProgramVariant(gfx::Device *device, uint32_t phaseID, const ccstd::string &name, const MacroRecord &defines) const {
        return getProgramVariant(device, phaseID, name, defines, nullptr);
    }
};

} // namespace render

} // namespace cc

// clang-format on
