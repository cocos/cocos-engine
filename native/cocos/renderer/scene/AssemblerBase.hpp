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

#include "../Macro.h"
#include <stdint.h>
#include "base/CCVector.h"
#include "../renderer/Effect.h"

RENDERER_BEGIN

class NodeProxy;
class ModelBatcher;
class Scene;

/**
 * @addtogroup scene
 * @{
 */

/**
 * @brief Base class for all assembler
 * A assembler could take actions during node visit process, before and after all children visit.
 */
class AssemblerBase: public cocos2d::Ref
{
public:
    
    AssemblerBase();
    
    virtual ~AssemblerBase();
    
    /**
     *  @brief Callback which will be invoked before visiting child nodes.
     *  @param[in] node The node being processed.
     *  @param[in] batcher
     *  @param[in] scene
     */
    virtual void handle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) {};
    /**
     *  @brief Callback which will be invoked after visiting child nodes.
     *  @param[in] node The node being processed.
     *  @param[in] batcher
     *  @param[in] scene
     */
    virtual void postHandle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) {};
    
    /**
     *  @brief Update the material for the given index.
     *  @param[in] index Render data index.
     *  @param[in] effect Effect pointer.
     */
    virtual void updateNativeEffect(std::size_t index, Effect* effect);
    
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
     *  @brief Gets Effect count.
     *  @return Count.
     */
    inline std::size_t getEffectCount() const
    {
        return _effects.size();
    }
    
    /**
     *  @brief Clears all effect.
     *  @return Count.
     */
    virtual void clearNativeEffect()
    {
        _effects.clear();
    }
    
    /**
     *  @brief Gets whether the current handle should use model matrix uniform during rendering
     */
    bool getUseModel() const
    {
        return _useModel;
    };
    
    /**
     *  @brief Sets whether the current handle should use model matrix uniform during rendering
     */
    void setUseModel(bool useModel)
    {
        _useModel = useModel;
    };
    
    /**
     *  @brief Notify dirty flag.
     *  @param[in] node The node being processed.
     *  @param[in] flag
     */
    virtual void notifyDirty(uint32_t flag)
    {
        _dirtyFlag |= flag;
    }
    
    /**
     *  @brief Gets dirty flag.
     */
    uint32_t getDirtyFlag() const
    {
        return _dirtyFlag;
    }
    
    /**
     *  @brief Enables assembler.
     */
    virtual void enable();
    
    /**
     *  @brief Disables assembler.
     */
    virtual void disable();
    
    /**
     *  @brief Is assembler enabled.
     *  @return _enabled
     */
    bool enabled() const { return _enabled; };
    
public:
    static const int TRANSFORM = 1 << 0;
    static const int OPACITY = 1 << 1;
    static const int COLOR = 1 << 2;
    static const int CHILDREN = 1 << 3;
    
protected:
    uint32_t _dirtyFlag = 0;
    bool _enabled = false;
    bool _useModel = false;
    cocos2d::Vector<Effect*> _effects;
};

// end of scene group
/// @}

RENDERER_END
