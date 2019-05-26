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

RENDERER_BEGIN

#define INIT_IA_LENGTH 16
#define INIT_MODEL_LENGTH 16

ModelBatcher::ModelBatcher(RenderFlow* flow)
: _flow(flow)
, _iaOffset(0)
, _modelOffset(0)
, _cullingMask(0)
, _walking(false)
, _currEffect(nullptr)
, _buffer(nullptr)
{
    for (int i = 0; i < INIT_IA_LENGTH; i++)
    {
        _iaPool.push_back(new InputAssembler());
    }
    
    for (int i = 0; i < INIT_MODEL_LENGTH; i++)
    {
        _modelPool.push_back(new Model());
    }

    _stencilMgr = StencilManager::getInstance();
}

ModelBatcher::~ModelBatcher()
{
    for (int i = 0; i < _iaPool.size(); i++)
    {
        auto ia = _iaPool[i];
        delete ia;
    }
    _iaPool.clear();
    
    for (int i = 0; i < _modelPool.size(); i++)
    {
        auto model = _modelPool[i];
        delete model;
    }
    _modelPool.clear();
    
    for (auto iter = _buffers.begin(); iter != _buffers.end(); ++iter)
    {
        MeshBuffer *buffer = iter->second;
        buffer->destroy();
        delete buffer;
    }
    _buffers.clear();
}

void ModelBatcher::reset()
{
    _iaOffset = 0;
    _modelOffset = 0;
    
    for (int i = 0; i < _batchedModel.size(); ++i)
    {
        Model* model = _batchedModel[i];
        model->clearInputAssemblers();
        model->clearEffects();
        _flow->getRenderScene()->removeModel(model);
    }
    _batchedModel.clear();
    
    for (auto iter : _buffers)
    {
        iter.second->reset();
    }
    _buffer = nullptr;
    
    _cullingMask = 0;
    _currEffect = nullptr;
    _walking = false;
    
    _modelMat.set(Mat4::IDENTITY);
    
    _stencilMgr->reset();
}

void ModelBatcher::commit(NodeProxy* node, RenderHandle* handle)
{
    // pre check
    VertexFormat* vfmt = handle->getVertexFormat();
    if (vfmt == nullptr)
    {
        return;
    }
    bool useModel = handle->getUseModel();
    for (uint32_t i = 0, l = handle->getMeshCount(); i < l; ++i)
    {
        Effect* effect = handle->getEffect((uint32_t)i);
        if (!effect) continue;
        int cullingMask = node->getCullingMask();
        const Mat4& worldMat = useModel ? Mat4::IDENTITY : node->getWorldMatrix();
        if (_currEffect == nullptr ||
            _currEffect->getHash() != effect->getHash() ||
            _cullingMask != cullingMask)
        {
            // Break auto batch
            flush();
            
            if (useModel)
            {
                _modelMat.set(worldMat);
            }
            _currEffect = effect;
            _cullingMask = cullingMask;
        }
        
        MeshBuffer* buffer = _buffer;
        if (!_buffer || vfmt != _buffer->_vertexFmt)
        {
            buffer = getBuffer(vfmt);
        }
        auto dirtyFlag = handle->getDirtyFlag();
        if (dirtyFlag & SystemHandle::OPACITY)
        {
            handle->updateOpacity(i, node->getRealOpacity());
        }
        handle->fillBuffers(buffer, i, worldMat);
    }
}

void ModelBatcher::commitIA(NodeProxy* node, CustomRenderHandle* handle)
{
    flush();
    
    for (std::size_t i = 0, n = handle->getIACount(); i < n; i++ )
    {
        const Mat4& worldMat = handle->getUseModel() ? node->getWorldMatrix() : Mat4::IDENTITY;
        Effect* effect = handle->getEffect((uint32_t)i);
        if (!effect) continue;
        _currEffect = effect;
        _cullingMask = node->getCullingMask();
        _modelMat.set(worldMat);
        handle->renderIA(i, this, node);
    }
}

void ModelBatcher::flushIA(InputAssembler* customIA)
{
    if (!_walking || _currEffect == nullptr || customIA == nullptr || customIA->getCount() <= 0)
    {
        return;
    }
    
    // Generate IA
    InputAssembler* ia = nullptr;
    if (_iaOffset >= _iaPool.size())
    {
        ia = new InputAssembler();
        _iaPool.push_back(ia);
    }
    else
    {
        ia = _iaPool[_iaOffset];
    }
    _iaOffset++;
    ia->setVertexBuffer(customIA->getVertexBuffer());
    ia->setIndexBuffer(customIA->getIndexBuffer());
    ia->setStart(customIA->getStart());
    ia->setCount(customIA->getCount());

    // Stencil manager process
    _stencilMgr->handleEffect(_currEffect);
    
    // Generate model
    Model* model = nullptr;
    _modelPool[_modelOffset];
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
    model->addEffect(_currEffect);
    model->addInputAssembler(*ia);
    _batchedModel.push_back(model);
    
    _flow->getRenderScene()->addModel(model);
}

void ModelBatcher::startBatch()
{
    reset();
    _walking = true;
}

void ModelBatcher::flush()
{
    if (_buffer == nullptr)
    {
        return;
    }
    int indexStart = _buffer->getIndexStart();
    int indexOffset = _buffer->getIndexOffset();
    int indexCount = indexOffset - indexStart;
    if (!_walking || _currEffect == nullptr || indexCount <= 0)
    {
        return;
    }
    
    // Generate IA
    InputAssembler* ia = nullptr;
    if (_iaOffset >= _iaPool.size())
    {
        ia = new InputAssembler();
        _iaPool.push_back(ia);
    }
    else
    {
        ia = _iaPool[_iaOffset];
    }
    _iaOffset++;
    ia->setVertexBuffer(_buffer->getVertexBuffer());
    ia->setIndexBuffer(_buffer->getIndexBuffer());
    ia->setStart(indexStart);
    ia->setCount(indexCount);
    
    // Stencil manager process
    _stencilMgr->handleEffect(_currEffect);
    
    // Generate model
    Model* model = nullptr;
    _modelPool[_modelOffset];
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
    model->addEffect(_currEffect);
    model->addInputAssembler(*ia);
    _batchedModel.push_back(model);
    
    _flow->getRenderScene()->addModel(model);
    
    _buffer->updateOffset();
}

void ModelBatcher::terminateBatch()
{
    flush();
    
    for (auto iter : _buffers)
    {
        iter.second->uploadData();
    }
    
    _walking = false;
}

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
