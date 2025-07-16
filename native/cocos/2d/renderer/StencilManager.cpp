/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "StencilManager.h"
#include "2d/renderer/RenderEntity.h"

namespace cc {
namespace {
StencilManager* instance = nullptr;
}

StencilManager* StencilManager::getInstance() {
    if (instance == nullptr) {
        instance = new StencilManager();
    }
    return instance;
}

StencilManager::~StencilManager() {
    for (auto pair : _cacheStateMap) {
        CC_SAFE_DELETE(pair.second);
    }

    for (auto pair : _cacheStateMapWithDepth) {
        CC_SAFE_DELETE(pair.second);
    }
}

StencilStage StencilManager::clear(RenderEntity* entity) { // NOLINT(readability-convert-member-functions-to-static)
    bool inverted = entity->getIsMaskInverted();
    return inverted ? StencilStage::CLEAR_INVERTED : StencilStage::CLEAR;
}

void StencilManager::enterLevel(RenderEntity* entity) { // NOLINT(readability-convert-member-functions-to-static)
    bool inverted = entity->getIsMaskInverted();
    entity->setEnumStencilStage(inverted ? StencilStage::ENTER_LEVEL_INVERTED : StencilStage::ENTER_LEVEL);
}

gfx::DepthStencilState* StencilManager::getDepthStencilState(StencilStage stage, Material* mat) {
    uint32_t key = 0;
    bool depthTest = false;
    bool depthWrite = false;
    gfx::ComparisonFunc depthFunc = gfx::ComparisonFunc::LESS;
    auto* cacheMap = &_cacheStateMap;

    if (mat && !mat->getPasses()->empty()) {
        IntrusivePtr<scene::Pass>& pass = mat->getPasses()->at(0);
        const gfx::DepthStencilState* dss = pass->getDepthStencilState();
        uint32_t depthTestValue = 0;
        uint32_t depthWriteValue = 0;
        if (dss->depthTest) {
            depthTestValue = 1;
        }
        if (dss->depthWrite) {
            depthWriteValue = 1;
        }
        key = (depthTestValue) | (depthWriteValue << 1) | (static_cast<uint32_t>(dss->depthFunc) << 2) | (static_cast<uint32_t>(stage) << 6) | (_maskStackSize << 9);

        depthTest = dss->depthTest;
        depthWrite = static_cast<uint32_t>(dss->depthWrite);
        depthFunc = dss->depthFunc;
        cacheMap = &_cacheStateMapWithDepth;

    } else {
        key = ((static_cast<uint32_t>(stage)) << 16) | (_maskStackSize);
    }

    auto iter = cacheMap->find(key);
    if (iter != cacheMap->end()) {
        return iter->second;
    }

    setDepthStencilStateFromStage(stage);

    auto* depthStencilState = ccnew gfx::DepthStencilState();
    depthStencilState->depthTest = depthTest;
    depthStencilState->depthWrite = depthWrite;
    depthStencilState->depthFunc = depthFunc;
    depthStencilState->stencilTestFront = _stencilPattern.stencilTest;
    depthStencilState->stencilFuncFront = _stencilPattern.func;
    depthStencilState->stencilReadMaskFront = _stencilPattern.stencilMask;
    depthStencilState->stencilWriteMaskFront = _stencilPattern.writeMask;
    depthStencilState->stencilFailOpFront = _stencilPattern.failOp;
    depthStencilState->stencilZFailOpFront = _stencilPattern.zFailOp;
    depthStencilState->stencilPassOpFront = _stencilPattern.passOp;
    depthStencilState->stencilRefFront = _stencilPattern.ref;
    depthStencilState->stencilTestBack = _stencilPattern.stencilTest;
    depthStencilState->stencilFuncBack = _stencilPattern.func;
    depthStencilState->stencilReadMaskBack = _stencilPattern.stencilMask;
    depthStencilState->stencilWriteMaskBack = _stencilPattern.writeMask;
    depthStencilState->stencilFailOpBack = _stencilPattern.failOp;
    depthStencilState->stencilZFailOpBack = _stencilPattern.zFailOp;
    depthStencilState->stencilPassOpBack = _stencilPattern.passOp;
    depthStencilState->stencilRefBack = _stencilPattern.ref;

    const auto& pair = std::pair<uint32_t, gfx::DepthStencilState*>(key, depthStencilState);
    cacheMap->insert(pair);

    return depthStencilState;
}

void StencilManager::setDepthStencilStateFromStage(StencilStage stage) {
    StencilEntity& pattern = _stencilPattern;

    if (stage == StencilStage::DISABLED) {
        pattern.stencilTest = false;
        pattern.func = gfx::ComparisonFunc::ALWAYS;
        pattern.failOp = gfx::StencilOp::KEEP;
        pattern.stencilMask = pattern.writeMask = 0xffff;
        pattern.ref = 1;
    } else {
        pattern.stencilTest = true;
        if (stage == StencilStage::ENABLED) {
            pattern.func = gfx::ComparisonFunc::EQUAL;
            pattern.failOp = gfx::StencilOp::KEEP;
            pattern.stencilMask = pattern.ref = getStencilRef();
            pattern.writeMask = getWriteMask();
        } else if (stage == StencilStage::CLEAR) {
            pattern.func = gfx::ComparisonFunc::NEVER;
            pattern.failOp = gfx::StencilOp::ZERO;
            pattern.writeMask = getWriteMask();
            pattern.stencilMask = getWriteMask();
            pattern.ref = getWriteMask();
        } else if (stage == StencilStage::CLEAR_INVERTED) {
            pattern.func = gfx::ComparisonFunc::NEVER;
            pattern.failOp = gfx::StencilOp::REPLACE;
            pattern.writeMask = pattern.stencilMask = pattern.ref = getWriteMask();
        } else if (stage == StencilStage::ENTER_LEVEL) {
            pattern.func = gfx::ComparisonFunc::NEVER;
            pattern.failOp = gfx::StencilOp::REPLACE;
            pattern.writeMask = pattern.stencilMask = pattern.ref = getWriteMask();
        } else if (stage == StencilStage::ENTER_LEVEL_INVERTED) {
            pattern.func = gfx::ComparisonFunc::NEVER;
            pattern.failOp = gfx::StencilOp::ZERO;
            pattern.writeMask = pattern.stencilMask = pattern.ref = getWriteMask();
        }
    }
}

void StencilManager::setStencilStage(uint32_t stageIndex) {
    _stage = static_cast<StencilStage>(stageIndex);
}
} // namespace cc
