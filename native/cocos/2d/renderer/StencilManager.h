#pragma once
#include <cocos/base/TypeDef.h>
#include <cocos/core/ArrayBuffer.h>
#include <cocos/core/assets/Material.h>
#include <stack>
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
    //uint32_t depthTest{1};  // @ts-boolean
    //uint32_t depthWrite{1}; // @ts-boolean
    //ComparisonFunc depthFunc{ComparisonFunc::LESS};
    uint32_t stencilTest; // @ts-boolean
    gfx::ComparisonFunc func;
    uint32_t stencilMask;
    uint32_t writeMask;
    gfx::StencilOp failOp;
    gfx::StencilOp zFailOp;
    gfx::StencilOp passOp;
    uint32_t ref;
};

class StencilManager final {
public:
    StencilManager();
    ~StencilManager();

    //void reset();
    //void destroy();

    inline StencilStage getStencilStage() { return _stage; }

    gfx::DepthStencilState* getDepthStencilState(StencilStage stage, Material* mat);
    void setDepthStencilStateFromStage(StencilStage stage);

    inline uint32_t getWriteMask() { return 1 << (_maskStackSize - 1); }
    inline uint32_t getExitWriteMask() { return 1 << _maskStackSize; }
    inline uint32_t getStencilRef() {
        uint32_t result = 0;
        for (uint32_t i = 0; i < _maskStackSize; i++) {
            result += (0x00000001 << i);
        }
        return result;
    }

public:
    void setStencilStage(uint32_t stageIndex);
    inline const ArrayBuffer& getStencilSharedBufferForJS() const { return *_stencilSharedBuffer; }

private:
    StencilEntity _stencilPattern{};
    se::Object* _seArrayBufferObject{nullptr};
    ArrayBuffer::Ptr _stencilSharedBuffer{nullptr};

    StencilStage _stage{StencilStage::DISABLED};

    uint32_t _maskStackSize{0};

    ccstd::unordered_map<uint32_t, gfx::DepthStencilState*> _cacheStateMap{};
    ccstd::unordered_map<uint32_t, gfx::DepthStencilState*> _cacheStateMapWithDepth{};
};
} // namespace cc
