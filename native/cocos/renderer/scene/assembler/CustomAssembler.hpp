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

#pragma once

#include "AssemblerBase.hpp"
#include <vector>
#include "../../renderer/InputAssembler.h"

RENDERER_BEGIN

/**
 * @addtogroup scene
 * @{
 */

/**
 *  @brief Custom render handle base class
 *  Render components that manages render buffer directly like spine, dragonBones should extend from this handle type.
 */
class CustomAssembler : public AssemblerBase
{
public:
    CustomAssembler();
    virtual ~CustomAssembler();
    
    /**
     *  @brief Updates InputAssembler indices range
     *  @param[in] index InputAssembler index.
     *  @param[in] start Indices buffer start pos
     *  @param[in] count Indices count
     */
    virtual void updateIARange(std::size_t index, int start, int count);
    /**
     *  @brief Updates InputAssembler indices and vertices buffer
     *  @param[in] index InputAssembler index.
     *  @param[in] vb Vertices buffer pointer
     *  @param[in] ib Indices buffer pointer
     */
    virtual void updateIABuffer(std::size_t index, cocos2d::renderer::VertexBuffer* vb, cocos2d::renderer::IndexBuffer* ib);
    
    /**
     *  @brief Gets input assembler by index
     *  @param[in] index.
     */
    InputAssembler* getIA(std::size_t index) const;
    
    /**
     *  @brief Gets input assembler count.
     *  @return Count.
     */
    virtual inline std::size_t getIACount() const
    {
        return _iaCount;
    }
    
    /**
     *  @brief Commit the current render handle to ModelBatcher
     */
    virtual void handle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) override;
    /**
     *  @brief Do nothing
     */
    virtual void postHandle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) override {}
    /**
     *  @brief Resets ia data.
     */
    virtual void reset() override;
    /**
     *  @brief Adjusts ia data.
     */
    virtual InputAssembler* adjustIA(std::size_t index);
    
    /**
     *  @brief Update the material for the given index.
     *  @param[in] index Render data index.
     *  @param[in] effect Effect pointer.
     */
    virtual void updateEffect(std::size_t index, Effect* effect);
    
    /**
     *  @brief Gets the material for the given index.
     *  @param[in] index Render data index.
     *  @return Effect pointer.
     */
    inline Effect* getEffect(std::size_t index) const
    {
        if (index >= _effects.size())
        {
            return nullptr;
        }
        return _effects.at(index);
    }
    
    /**
     *  @brief Clears all effect.
     *  @return Count.
     */
    virtual void clearEffect()
    {
        _effects.clear();
    }
protected:
    std::vector<cocos2d::renderer::InputAssembler*> _iaPool;
    cocos2d::Vector<Effect*> _effects;
    std::size_t _iaCount = 0;
};

// end of scene group
/// @}

RENDERER_END
