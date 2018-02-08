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

Model::Model()
{
    RENDERER_LOGD("Model construction %p", this);
}

Model::~Model()
{
    RENDERER_LOGD("Model destruction %p", this);
}

void Model::addInputAssembler(InputAssembler* ia)
{
    if (_inputAssemblers.contains(ia))
        return;
    
    _inputAssemblers.pushBack(ia);
}

void Model::clearInputAssemblers()
{
    _inputAssemblers.clear();
}

void Model::addEffect(Effect* effect)
{
    if (_effects.contains(effect))
        return;
    
    _effects.pushBack(effect);
    
    ValueMap defs;
    effect->extractDefines(defs);
    _defines.push_back(std::move(defs));
}

void Model::clearEffects()
{
    _effects.clear();
    _defines.clear();
}

void Model::extractDrawItem(DrawItem& out, uint32_t index) const
{
    if (_dynamicIA)
    {
        out.model = const_cast<Model*>(this);
        out.node = _node;
        out.ia = nullptr;
        out.effect = _effects.at(0);
        out.defines = out.effect->extractDefines(const_cast<ValueMap&>(_defines[0]));
        
        return;
    }
    
    if (index >= _inputAssemblers.size())
    {
        out.model = nullptr;
        out.node = nullptr;
        out.ia = nullptr;
        out.effect = nullptr;
        out.defines = nullptr;
        
        return;
    }
    
    out.model = const_cast<Model*>(this);
    out.node = _node;
    out.ia = _inputAssemblers.at(index);
    
    auto effectsSize = _effects.size();
    if (index >= effectsSize)
        index = (uint32_t)(effectsSize - 1);
    
    out.effect = const_cast<Effect*>(_effects.at(index));
    out.defines = out.effect->extractDefines(const_cast<ValueMap&>(_defines[index]));
}

RENDERER_END
