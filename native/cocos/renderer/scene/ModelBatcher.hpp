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

#include <map>

#include "../Macro.h"
#include "assembler/Assembler.hpp"
#include "assembler/CustomAssembler.hpp"
#include "MeshBuffer.hpp"
#include "../renderer/Renderer.h"
#include "math/CCMath.h"

RENDERER_BEGIN

class RenderFlow;
class StencilManager;

/**
 * @addtogroup scene
 * @{
 */

/**
 *  @brief ModelBatcher is responsible for transforming node's render handles into final render datas.
 *  It collects render data, batches different render handle together into Models and submits to render Scene.
 */
class ModelBatcher
{
public:
    
    enum CommitState {
        None,
        Common,
        Custom,
    };
    
    /**
     *  @brief The constructor.
     */
    ModelBatcher(RenderFlow* flow);
    /**
     *  @brief The destructor.
     */
    ~ModelBatcher();
    /**
     *  @brief Reset all render buffer.
     */
    void reset();
    
    /**
     *  @brief Commit a render handle to the model batcher
     *  @param[in] node The node which owns the render handle
     *  @param[in] handle The render handle contains render datas
     */
    void commit(NodeProxy* node, Assembler* handle);
    /**
     *  @brief Commit a custom render handle to the model batcher
     *  @param[in] node The node which owns the render handle
     *  @param[in] handle The custom render handle contains render datas
     */
    void commitIA(NodeProxy* node, CustomAssembler* handle);
    
    /**
     *  @brief This method should be invoked before commit any render handles each frame.
     * It notifies the model batcher to get ready for constructing Models
     */
    void startBatch();
    /**
     *  @brief Flush all cached render data into a new Model and add the Model to render Scene.
     */
    void flush();
    /**
     *  @brief Finished Custom input assmebler batch and add the Model to render Scene.
     */
    void flushIA();
    /**
     *  @brief Add new input assembler into current input assembler.
     */
    void flushIA(InputAssembler* customIA);
    /**
     *  @brief This method should be invoked after committed all render handles each frame.
     */
    void terminateBatch();
    
    /**
     *  @brief Gets a suitable MeshBuffer for the given VertexFormat.
     *  Render datas arranged in different VertexFormat can't share the same buffer.
     *  @param[in] fmt The VertexFormat
     */
    MeshBuffer* getBuffer(VertexFormat* fmt);
    /**
     *  @brief Gets the current MeshBuffer.
     */
    const MeshBuffer* getCurrentBuffer() const { return _buffer; };
    /**
     *  @brief Sets the current MeshBuffer.
     *  @param[in] buffer
     */
    void setCurrentBuffer(MeshBuffer* buffer) { _buffer = buffer; };
    /**
     *  @brief Gets the global RenderFlow pointer.
     */
    RenderFlow* getFlow() const { return _flow; };
    
    void setCullingMask(int cullingMask) { _cullingMask = cullingMask; }
    void setCurrentEffect(Effect* effect);
    void setUseModel(bool useModel) { _useModel = useModel; }
    void setCustomProperties(CustomProperties* props) { _customProps = props; };
private:
    void changeCommitState(CommitState state);
private:
    int _modelOffset = 0;
    int _cullingMask = 0;
    bool _useModel = false;
    bool _walking = false;
    cocos2d::Mat4 _modelMat;
    CommitState _commitState = CommitState::None;

    NodeProxy* _node = nullptr;
    
    MeshBuffer* _buffer = nullptr;
    Effect* _currEffect = nullptr;
    RenderFlow* _flow = nullptr;
    CustomProperties* _customProps = nullptr;

    StencilManager* _stencilMgr = nullptr;
    
    InputAssembler _ia;
    std::vector<Model*> _modelPool;
    std::unordered_map<VertexFormat*, MeshBuffer*> _buffers;
};

// end of scene group
/// @}

RENDERER_END
