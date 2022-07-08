/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include <stack>
#include "base/Macros.h"
#include "base/TypeDef.h"
#include "core/ArrayBuffer.h"
#include "core/assets/Material.h"
#include "renderer/gfx-base/GFXDef-common.h"
#include "scene/Pass.h"

namespace cc {
enum class StencilStage {
    // Stencil disabled
    DISABLED = 0,
    // Clear stencil buffer
    CLEAR = 1,
    // Entering a new level, should handle new stencil
    ENTER_LEVEL = 2,
    // In content
    ENABLED = 3,
    // Exiting a level, should restore old stencil or disable
    EXIT_LEVEL = 4,
    // Clear stencil buffer & USE INVERTED
    CLEAR_INVERTED = 5,
    // Entering a new level & USE INVERTED
    ENTER_LEVEL_INVERTED = 6
};

struct StencilEntity {
    uint32_t stencilTest{0};
    gfx::ComparisonFunc func{gfx::ComparisonFunc::ALWAYS};
    uint32_t stencilMask{0};
    uint32_t writeMask{0};
    gfx::StencilOp failOp{gfx::StencilOp::KEEP};
    gfx::StencilOp zFailOp{gfx::StencilOp::KEEP};
    gfx::StencilOp passOp{gfx::StencilOp::KEEP};
    uint32_t ref{0};
};

class StencilManager final {
public:
    static StencilManager* getInstance();
    StencilManager();
    ~StencilManager();

    inline StencilStage getStencilStage() const { return _stage; }

    gfx::DepthStencilState* getDepthStencilState(StencilStage stage, Material* mat = nullptr);
    void setDepthStencilStateFromStage(StencilStage stage);

    inline uint32_t getWriteMask() const {
        return 1 << (_maskStackSize - 1);
    }
    inline uint32_t getExitWriteMask() const {
        return 1 << _maskStackSize;
    }
    inline uint32_t getStencilRef() const {
        uint32_t result = 0;
        for (uint32_t i = 0; i < _maskStackSize; i++) {
            result += (1 << i);
        }
        return result;
    }
    inline uint32_t getStencilHash(StencilStage stage) const {
        return ((static_cast<uint32_t>(stage)) << 8) | _maskStackSize;
    }

    void setStencilStage(uint32_t stageIndex);
    inline const ArrayBuffer& getStencilSharedBufferForJS() const { return *_stencilSharedBuffer; }

private:
    CC_DISALLOW_COPY_MOVE_ASSIGN(StencilManager);

    StencilEntity _stencilPattern;
    ArrayBuffer::Ptr _stencilSharedBuffer;

    StencilStage _stage{StencilStage::DISABLED};

    uint32_t _maskStackSize{0};

    ccstd::unordered_map<uint32_t, gfx::DepthStencilState*> _cacheStateMap;
    ccstd::unordered_map<uint32_t, gfx::DepthStencilState*> _cacheStateMapWithDepth;
};
} // namespace cc
