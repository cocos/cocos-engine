/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
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

#include "StencilManager.hpp"
#include "../Types.h"
#include "../renderer/Technique.h"
#include "../renderer/Pass.h"

RENDERER_BEGIN

static const std::string techStage = "opaque";
StencilManager* StencilManager::_instance = nullptr;

StencilManager::StencilManager ()
: _stage(Stage::DISABLED)
{
}

void StencilManager::reset ()
{
    // reset stack and stage
    _maskStack.clear();
    _stage = Stage::DISABLED;
}

Effect* StencilManager::handleEffect (Effect* effect)
{
    Technique* tech = effect->getTechnique(techStage);
    if (!tech) return effect;
    Vector<Pass*>& passes = (Vector<Pass*>&)tech->getPasses();
    if (_stage == Stage::DISABLED)
    {
        for (const auto& pass : passes)
        {
            if (pass->getStencilTest()) {
                pass->disableStencilTest();
            }
        }
        return effect;
    }
    
    auto size = _maskStack.size();
    if (size == 0 || size == size_t(-1))
    {
        return effect;
    }
    
    uint32_t ref;
    uint8_t stencilMask, writeMask;
    bool mask;
    StencilFunc func;
    StencilOp failOp = StencilOp::KEEP;
    const StencilOp& zFailOp = StencilOp::KEEP;
    const StencilOp& zPassOp = StencilOp::KEEP;
    
    if (_stage == Stage::ENABLED)
    {
        mask = _maskStack.back();
        func = StencilFunc::EQUAL;
        failOp = StencilOp::KEEP;
        ref = getStencilRef();
        stencilMask = ref;
        writeMask = getWriteMask();
    }
    else {
        if (_stage == Stage::CLEAR) {
            mask = _maskStack.back();
            func = StencilFunc::NEVER;
            failOp = mask ? StencilOp::REPLACE : StencilOp::ZERO;
            ref = getWriteMask();
            stencilMask = ref;
            writeMask = ref;
        }
        else if (_stage == Stage::ENTER_LEVEL) {
            mask = _maskStack.back();
            // Fill stencil mask
            func = StencilFunc::NEVER;
            failOp = mask ? StencilOp::ZERO : StencilOp::REPLACE;
            ref = getWriteMask();
            stencilMask = ref;
            writeMask = ref;
        }
    }
    
    for (const auto& pass : passes) {
        pass->setStencilFront(func, ref, stencilMask, failOp, zFailOp, zPassOp, writeMask);
        pass->setStencilBack(func, ref, stencilMask, failOp, zFailOp, zPassOp, writeMask);
    }
    return effect;
}

void StencilManager::pushMask (bool mask)
{
    if (_maskStack.size() + 1 > _maxLevel)
    {
        cocos2d::log("StencilManager:pushMask _maxLevel:%d is out of range", _maxLevel);
    }
    _maskStack.push_back(mask);
}
    
void StencilManager::clear ()
{
    _stage = Stage::CLEAR;
}
    
void StencilManager::enterLevel ()
{
    _stage = Stage::ENTER_LEVEL;
}
    
void StencilManager::enableMask ()
{
    _stage = Stage::ENABLED;
}
    
void StencilManager::exitMask ()
{
    if (_maskStack.size() == 0) {
        cocos2d::log("StencilManager:exitMask _maskStack:%lu size is 0", _maskStack.size());
    }
    _maskStack.pop_back();
    if (_maskStack.size() == 0) {
        _stage = Stage::DISABLED;
    }
    else {
        _stage = Stage::ENABLED;
    }
}

uint8_t StencilManager::getWriteMask ()
{
    return 0x01 << (_maskStack.size() - 1);
}
    
uint8_t StencilManager::getExitWriteMask ()
{
    return 0x01 << _maskStack.size();
}
    
uint32_t StencilManager::getStencilRef ()
{
    int32_t result = 0;
    size_t size = _maskStack.size();
    for (int i = 0; i < size; ++i) {
        result += (0x01 << i);
    }
    return result;
}
    
uint32_t StencilManager::getInvertedRef ()
{
    int32_t result = 0;
    size_t size = _maskStack.size();
    for (int i = 0; i < size - 1; ++i)
    {
        result += (0x01 << i);
    }
    return result;
}

RENDERER_END
