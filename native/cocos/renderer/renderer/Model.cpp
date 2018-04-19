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

#include "Model.h"
#include "Effect.h"
#include "InputAssembler.h"

RENDERER_BEGIN

// Implementation of Model pool.

ccCArray* ModelPool::_pool = ccCArrayNew(500);

Model* ModelPool::getOrCreateModel()
{
    Model* model = nullptr;
    if (0 != _pool->num)
    {
        model = static_cast<Model*>(ModelPool::_pool->arr[ModelPool::_pool->num - 1]);
        ccCArrayRemoveValueAtIndex(ModelPool::_pool, ModelPool::_pool->num - 1);
    }
    else
        model = new Model();

    return model;
}

void ModelPool::returnModel(Model *model)
{
    if (ModelPool::_pool->num < ModelPool::_pool->max)
    {
        model->reset();
        ccCArrayAppendValue(ModelPool::_pool, model);
    }
    else
        delete model;
}

// Implementation of Model

Model::Model()
{
//    RENDERER_LOGD("Model construction %p", this);
    
    _inputAssemblers.reserve(500);
}

Model::~Model()
{
    RENDERER_LOGD("Model destruction %p", this);
    reset();
    
    ccCArrayFree(_effects);
}

void Model::addInputAssembler(const InputAssembler& ia)
{
    _inputAssemblers.push_back(std::move(ia));
}

void Model::clearInputAssemblers()
{
    _inputAssemblers.clear();
}

void Model::addEffect(Effect* effect)
{
    if (ccCArrayContainsValue(_effects, effect))
        return;
    
    ccCArrayAppendValue(_effects, effect);
    
    _defines.push_back(effect->extractDefines());
}

void Model::clearEffects()
{
    ccCArrayRemoveAllValues(_effects);
    _defines.clear();
}

void Model::extractDrawItem(DrawItem& out, uint32_t index) const
{
    if (_dynamicIA)
    {
        out.model = const_cast<Model*>(this);
        out.ia = nullptr;
        out.effect = static_cast<Effect*>(_effects->arr[0]);
        out.defines = out.effect->extractDefines();
        
        return;
    }
    
    if (index >= _inputAssemblers.size())
        return;
    
    out.model = const_cast<Model*>(this);
    out.ia = const_cast<InputAssembler*>(&(_inputAssemblers[index]));
    
    auto effectsSize = _effects->num;
    if (index >= effectsSize)
        index = (uint32_t)(effectsSize - 1);
    
    out.effect = static_cast<Effect*>(_effects->arr[index]);

    out.defines = out.effect->extractDefines();
}

void Model::reset()
{
    ccCArrayRemoveAllValues(_effects);
    _inputAssemblers.clear();
    
    _defines.clear();
}

RENDERER_END
