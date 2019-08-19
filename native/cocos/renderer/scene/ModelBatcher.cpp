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

#include "ModelBatcher.hpp"
#include "RenderFlow.hpp"
#include "StencilManager.hpp"
#include "assembler/RenderDataList.hpp"
#include "NodeProxy.hpp"

RENDERER_BEGIN

#define INIT_MODEL_LENGTH 16

ModelBatcher::ModelBatcher(RenderFlow* flow)
: _flow(flow)
, _modelOffset(0)
, _cullingMask(0)
, _walking(false)
, _currEffect(nullptr)
, _buffer(nullptr)
, _useModel(false)
, _customProps(nullptr)
, _node(nullptr)
{
    for (int i = 0; i < INIT_MODEL_LENGTH; i++)
    {
        _modelPool.push_back(new Model());
    }

    _stencilMgr = StencilManager::getInstance();
}

ModelBatcher::~ModelBatcher()
{
    setCurrentEffect(nullptr);
    setNode(nullptr);
    
    for (int i = 0; i < _modelPool.size(); i++)
    {
        auto model = _modelPool[i];
        delete model;
    }
    _modelPool.clear();
    
    for (auto iter = _buffers.begin(); iter != _buffers.end(); ++iter)
    {
        MeshBuffer *buffer = iter->second;
        delete buffer;
    }
    _buffers.clear();
}

void ModelBatcher::reset()
{
    for (int i = 0; i < _modelOffset; ++i)
    {
        Model* model = _modelPool[i];
        model->reset();
    }
    _flow->getRenderScene()->removeModels();
    _modelOffset = 0;
    
    for (auto iter : _buffers)
    {
        iter.second->reset();
    }
    _buffer = nullptr;
    
    _commitState = CommitState::None;
    setCurrentEffect(nullptr);
    setNode(nullptr);
    _ia.clear();
    _cullingMask = 0;
    _walking = false;
    _useModel = false;
    
    _modelMat.set(Mat4::IDENTITY);
    _stencilMgr->reset();
}

void ModelBatcher::changeCommitState(CommitState state)
{
    if (_commitState == state) return;
    switch(_commitState)
    {
        case CommitState::Custom:
            flushIA();
            break;
        case CommitState::Common:
            flush();
            break;
        default:
            break;
    }
    setCurrentEffect(nullptr);
    setCustomProperties(nullptr);
    _commitState = state;
}

void ModelBatcher::commit(NodeProxy* node, Assembler* assembler)
{
    changeCommitState(CommitState::Common);
    
    VertexFormat* vfmt = assembler->getVertexFormat();
    if (!vfmt)
    {
        return;
    }
    
    bool useModel = assembler->getUseModel();
    bool ignoreWorldMatrix = assembler->isIgnoreWorldMatrix();
    const Mat4& nodeWorldMat = node->getWorldMatrix();
    const Mat4& worldMat = useModel && !ignoreWorldMatrix ? nodeWorldMat : Mat4::IDENTITY;
    int cullingMask = node->getCullingMask();
    
    auto asmDirty = assembler->isDirty(AssemblerBase::VERTICES_OPACITY_CHANGED);
    auto nodeDirty = node->isDirty(RenderFlow::NODE_OPACITY_CHANGED);
    auto needUpdateOpacity = (asmDirty || nodeDirty) && !assembler->isIgnoreOpacityFlag();
    
    for (std::size_t i = 0, l = assembler->getIACount(); i < l; ++i)
    {
        assembler->beforeFillBuffers(i);
        
        Effect* effect = assembler->getEffect(i);
        CustomProperties* customProp = assembler->getCustomProperties();
        if (!effect) continue;

        if (_currEffect == nullptr ||
            _currEffect->getHash() != effect->getHash() ||
            _cullingMask != cullingMask || useModel)
        {
            // Break auto batch
            flush();
            
            setNode(_useModel ? node : nullptr);
            setCurrentEffect(effect);
            setCustomProperties(customProp);
            _modelMat.set(worldMat);
            _useModel = useModel;
            _cullingMask = cullingMask;
        }
        
        if (needUpdateOpacity)
        {
            assembler->updateOpacity(i, node->getRealOpacity());
        }
        
        MeshBuffer* buffer = _buffer;
        if (!_buffer || vfmt != _buffer->_vertexFmt)
        {
            buffer = getBuffer(vfmt);
        }
        assembler->fillBuffers(node, buffer, i);
    }
}

void ModelBatcher::commitIA(NodeProxy* node, CustomAssembler* assembler)
{
    changeCommitState(CommitState::Custom);

    Effect* effect = assembler->getEffect(0);
    if (!effect) return;

    auto customIA = assembler->getIA(0);
    if (!customIA) return;
    
    std::size_t iaCount = assembler->getIACount();
    int cullingMask = node->getCullingMask();
    bool useModel = assembler->getUseModel();
    const Mat4& worldMat = useModel ? node->getWorldMatrix() : Mat4::IDENTITY;
    
    if (_currEffect == nullptr ||
    _currEffect->getHash() != effect->getHash() ||
    _cullingMask != cullingMask || useModel ||
    !_ia.isMergeable(*customIA))
    {
        flushIA();
        
        setNode(_useModel ? node : nullptr);
        setCurrentEffect(effect);
        _modelMat.set(worldMat);
        _useModel = useModel;
        _cullingMask = cullingMask;
        
        _ia.setVertexBuffer(customIA->getVertexBuffer());
        _ia.setIndexBuffer(customIA->getIndexBuffer());
        _ia.setStart(customIA->getStart());
        _ia.setCount(0);
    }
    
    for (std::size_t i = 0; i < iaCount; i++ )
    {
        customIA = assembler->getIA(i);
        effect = assembler->getEffect(i);
        if (!effect) continue;
        
        if (i > 0)
        {
            flushIA();
            
            setNode(_useModel ? node : nullptr);
            setCurrentEffect(effect);
            _modelMat.set(worldMat);
            _useModel = useModel;
            _cullingMask = cullingMask;
            
            _ia.setVertexBuffer(customIA->getVertexBuffer());
            _ia.setIndexBuffer(customIA->getIndexBuffer());
            _ia.setStart(customIA->getStart());
            _ia.setCount(0);
        }
        
        _ia.setCount(_ia.getCount() + customIA->getCount());
    }
}

void ModelBatcher::flushIA()
{
    if (_commitState != CommitState::Custom)
    {
        return;
    }
    
    if (!_walking || !_currEffect || _ia.getCount() <= 0)
    {
        _ia.clear();
        return;
    }
    
    // Stencil manager process
    _stencilMgr->handleEffect(_currEffect);
    
    // Generate model
    Model* model = nullptr;
    if (_modelOffset >= _modelPool.size())
    {
        model = new Model();
        _modelPool.push_back(model);
    }
    else
    {
        model = _modelPool[_modelOffset];
    }
    _modelOffset++;
    model->setWorldMatix(_modelMat);
    model->setCullingMask(_cullingMask);
    model->setEffect(_currEffect, _customProps);
    model->setNode(_node);
    model->setInputAssembler(_ia);
    
    _ia.clear();
    
    _flow->getRenderScene()->addModel(model);
}

void ModelBatcher::flush()
{
    if (_commitState != CommitState::Common)
    {
        return;
    }
    
    if (!_walking || !_currEffect || !_buffer)
    {
        return;
    }
    
    int indexStart = _buffer->getIndexStart();
    int indexOffset = _buffer->getIndexOffset();
    int indexCount = indexOffset - indexStart;
    if (indexCount <= 0)
    {
        return;
    }
    
    _ia.setVertexBuffer(_buffer->getVertexBuffer());
    _ia.setIndexBuffer(_buffer->getIndexBuffer());
    _ia.setStart(indexStart);
    _ia.setCount(indexCount);
    
    // Stencil manager process
    _stencilMgr->handleEffect(_currEffect);
    
    // Generate model
    Model* model = nullptr;
    if (_modelOffset >= _modelPool.size())
    {
        model = new Model();
        _modelPool.push_back(model);
    }
    else
    {
        model = _modelPool[_modelOffset];
    }
    _modelOffset++;
    model->setWorldMatix(_modelMat);
    model->setCullingMask(_cullingMask);
    model->setEffect(_currEffect, _customProps);
    model->setNode(_node);
    model->setInputAssembler(_ia);
    
    _ia.clear();

    _flow->getRenderScene()->addModel(model);
    
    _buffer->updateOffset();
}

void ModelBatcher::startBatch()
{
    reset();
    _walking = true;
}

void ModelBatcher::terminateBatch()
{
    flush();
    flushIA();
    
    for (auto iter : _buffers)
    {
        iter.second->uploadData();
    }
    
    _walking = false;
}

void ModelBatcher::setNode(NodeProxy* node)
{
    if (_node == node)
    {
        return;
    }
    CC_SAFE_RELEASE(_node);
    _node = node;
    CC_SAFE_RETAIN(_node);
}

void ModelBatcher::setCurrentEffect(Effect* effect)
{
    if (_currEffect == effect)
    {
        return;
    }
    CC_SAFE_RELEASE(_currEffect);
    _currEffect = effect;
    CC_SAFE_RETAIN(_currEffect);
};

MeshBuffer* ModelBatcher::getBuffer(VertexFormat* fmt)
{
    MeshBuffer* buffer = nullptr;
    auto iter = _buffers.find(fmt);
    if (iter == _buffers.end())
    {
        buffer = new MeshBuffer(this, fmt);
        _buffers.emplace(fmt, buffer);
    }
    else
    {
        buffer = iter->second;
    }
    return buffer;
}

RENDERER_END
