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

#include "../../Macro.h"
#include <stdint.h>
#include "base/CCVector.h"
#include "../../renderer/Effect.h"
#include "scripting/js-bindings/jswrapper/Object.hpp"

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
    
    enum AssemblerFlag {
        VERTICES_OPACITY_CHANGED = 1 << 0,
        VERTICES_DIRTY = 1 << 1,
    };
    
    AssemblerBase();
    
    virtual ~AssemblerBase();
    
    /**
     *  @brief Callback which will be invoked before visiting child nodes.
     *  @param[in] node The node being processed.
     *  @param[in] batcher
     *  @param[in] scene
     */
    virtual void handle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) {}
    /**
     *  @brief Callback which will be invoked after visiting child nodes.
     *  @param[in] node The node being processed.
     *  @param[in] batcher
     *  @param[in] scene
     */
    virtual void postHandle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) {}
    
    /**
     *  @brief Gets whether the current handle should use model matrix uniform during rendering
     */
    bool getUseModel() const
    {
        return _useModel;
    }
    
    /**
     *  @brief Sets whether the current handle should use model matrix uniform during rendering
     */
    void setUseModel(bool useModel)
    {
        _useModel = useModel;
    }
    
    /**
     *  @brief Sync script dirty flag.
     */
    void setDirty(se_object_ptr jsDirty);
    
    /**
     *  @brief Changes dirty flag.
     */
    void enableDirty(uint32_t flag)
    {
        if (_dirty)
        {
            *_dirty |= flag;
        }
    }
    
    /**
     *  @brief Changes dirty flag.
     */
    void disableDirty(uint32_t flag)
    {
        if (_dirty)
        {
            *_dirty &= ~flag;
        }
    }
    
    /**
     *  @brief Is flag dirty.
     */
    bool isDirty(uint32_t flag)
    {
        if (_dirty)
        {
            return *_dirty & flag;
        }
        return false;
    }
    
    /**
     *  @brief Resets data.
     */
    virtual void reset() {}
protected:
    se::Object* _jsDirty = nullptr;
    uint32_t* _dirty = nullptr;
    std::size_t _dirtyLen = 0;
    
    bool _useModel = false;
};

// end of scene group
/// @}

RENDERER_END
