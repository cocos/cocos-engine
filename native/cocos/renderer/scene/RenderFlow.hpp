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
#include "NodeProxy.hpp"
#include "ModelBatcher.hpp"
#include "../renderer/Scene.h"
#include "../renderer/ForwardRenderer.h"
#include "../gfx/DeviceGraphics.h"

RENDERER_BEGIN

/**
 * @addtogroup scene
 * @{
 */

/**
 *  @brief This class is responsible for the rendering process.\n
 *  It visits the node tree, let nodes commit their render handles, starts the device level rendering process with ForwardRenderer.\n
 *  JS API: renderer.RenderFlow
 @code
 // You actually shouldn't create RenderFlow by yourself, you can
 let renderFlow = cc.RenderFlow._nativeFlow;
 @endcode
 */
class RenderFlow
{
public:
    
    enum RenderFlowFlag {
        // sync js render flag
        
        BREAK_FLOW = 1 << 0,
        LOCAL_TRANSFORM = 1 << 1,
        WORLD_TRANSFORM = 1 << 2,
        TRANSFORM = LOCAL_TRANSFORM | WORLD_TRANSFORM,
        UPDATE_RENDER_DATA = 1 << 3,
        OPACITY = 1 << 4,
        RENDER = 1 << 5,
        CUSTOM_IA_RENDER = 1 << 6,
        CHILDREN = 1 << 7,
        POST_UPDATE_RENDER_DATA = 1 << 8,
        POST_RENDER = 1 << 9,
        FINAL = 1 << 10,
        
        // native render flag
        REORDER_CHILDREN = 1 << 11,
        // world matrix changed
        WORLD_TRANSFORM_CHANGED = 1 << 12
    };
    
    struct LevelInfo{
        uint32_t* dirty = nullptr;
        cocos2d::Mat4* localMat = nullptr;
        cocos2d::Mat4* worldMat = nullptr;
        cocos2d::Mat4* parentWorldMat = nullptr;
        uint32_t* parentDirty = nullptr;
    };
    
    static RenderFlow *getInstance()
    {
        return _instance;
    }
    
    /*
     *  @brief The constructor.
     *  @param[in] device
     *  @param[in] scene
     *  @param[in] forward
     */
    RenderFlow(DeviceGraphics* device, Scene* scene, ForwardRenderer* forward);
    /*
     *  @brief The destructor.
     */
    ~RenderFlow();
    
    /*
     *  @brief Gets the ModelBatcher which is responsible for collecting render Models.
     */
    ModelBatcher* getModelBatcher() const { return _batcher; };
    /*
     *  @brief Gets the DeviceGraphics using by the current RenderFlow.
     */
    DeviceGraphics* getDevice() const { return _device; };
    /*
     *  @brief Gets the render Scene which manages all render Models.
     */
    Scene* getRenderScene() const { return _scene; };
    /**
     *  @brief Render the scene specified by its root node.
     *  @param[in] scene The root node.
     */
    void render(NodeProxy* scene);
    /**
     *  @brief Visit a node tree.
     */
    void visit(NodeProxy* rootNode);
    /**
     *  @brief Calculate local matrix.
     */
    void calculateLocalMatrix();
    /**
     *  @brief Calculate world matrix.
     */
    void calculateWorldMatrix();
    /**
     *  @brief remove node level
     */
    void removeNodeLevel(uint32_t level, cocos2d::Mat4* worldMat);
    /**
     *  @brief insert node level
     */
    void insertNodeLevel(uint32_t level, const LevelInfo& levelInfo);
private:
    
    static RenderFlow *_instance;
    
    ModelBatcher* _batcher;
    Scene* _scene;
    DeviceGraphics* _device;
    ForwardRenderer* _forward;
    std::vector<std::vector<LevelInfo>> _levelInfoArr;
};

// end of scene group
/// @}

RENDERER_END
