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
#include "ParallelTask.hpp"

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

#define NODE_LEVEL_INVALID 0xffffffff

class RenderFlow
{
public:
    
    enum RenderFlowFlag {
        // sync js render flag
        
        DONOTHING = 1 << 0,
        BREAK_FLOW = 1 << 1,
        LOCAL_TRANSFORM = 1 << 2,
        WORLD_TRANSFORM = 1 << 3,
        TRANSFORM = LOCAL_TRANSFORM | WORLD_TRANSFORM,
        UPDATE_RENDER_DATA = 1 << 4,
        OPACITY = 1 << 5,
        COLOR = 1 << 6,
        RENDER = 1 << 7,
        CHILDREN = 1 << 8,
        POST_RENDER = 1 << 9,
        FINAL = 1 << 10,
        
        PRE_CALCULATE_VERTICES = 1 << 28,
        // native render flag
        REORDER_CHILDREN = 1 << 29,
        // world matrix changed
        WORLD_TRANSFORM_CHANGED = 1 << 30,
        // cascade opacity changed
        NODE_OPACITY_CHANGED = 1 << 31,
    };

    enum ParallelStage {
        NONE = 1 << 0,
        LOCAL_MAT = 1 << 1,
        WORLD_MAT = 1 << 2,
        CALC_VERTICES = 1 << 3,
    };
    
    struct LevelInfo{
        uint32_t* dirty = nullptr;
        uint32_t* parentDirty = nullptr;
        cocos2d::Mat4* parentWorldMat = nullptr;
        uint8_t* parentRealOpacity = nullptr;
        cocos2d::Mat4* localMat = nullptr;
        cocos2d::Mat4* worldMat = nullptr;
        uint8_t* opacity = nullptr;
        uint8_t* realOpacity = nullptr;
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
    void render(NodeProxy* scene, float deltaTime);
    /**
     *  @brief Visit a node tree.
     */
    void visit(NodeProxy* rootNode);
    /**
     *  @brief Calculate local matrix.
     *  @param[in] tid It must rather than -1 if enable multiple thread.
     */
    void calculateLocalMatrix(int tid = -1);
    /**
     *  @brief Calculate world matrix.
     */
    void calculateWorldMatrix();
    /**
     *  @brief Calculate world matrix by level.
     *  @param[in] tid Thread id.
     *  @param[level] level Node level.
     */
    void calculateLevelWorldMatrix(int tid = -1, int stage = -1);
    /**
     *  @brief remove node level
     */
    void removeNodeLevel(std::size_t level, cocos2d::Mat4* worldMat);
    /**
     *  @brief insert node level
     */
    void insertNodeLevel(std::size_t level, const LevelInfo& levelInfo);
private:
    
    static RenderFlow *_instance;
    
    ModelBatcher* _batcher = nullptr;
    Scene* _scene = nullptr;
    DeviceGraphics* _device = nullptr;
    ForwardRenderer* _forward = nullptr;
    std::size_t _curLevel = 0;
    std::vector<std::vector<LevelInfo>> _levelInfoArr;

    ParallelStage _parallelStage = ParallelStage::NONE;
    ParallelTask* _paralleTask = nullptr;
};

// end of scene group
/// @}

RENDERER_END
