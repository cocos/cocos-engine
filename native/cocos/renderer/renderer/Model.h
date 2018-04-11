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

#include <vector>
#include "base/CCVector.h"
#include "base/CCValue.h"
#include "math/Mat4.h"
#include "../Macro.h"

RENDERER_BEGIN

class Effect;
class InputAssembler;
class Model;
class INode;

struct DrawItem
{
    INode* node = nullptr;
    Model* model = nullptr;
    InputAssembler* ia = nullptr;
    Effect* effect = nullptr;
    ValueMap* defines;
};

class Model : public Ref
{
public:
    Model();
    
    inline uint32_t getInputAssemblerCount() const { return (uint32_t)_inputAssemblers.size(); }
    
    inline bool isDynamicIA() const { return _dynamicIA; }
    inline void setDynamicIA(bool value) { _dynamicIA =  value; }
    
    inline uint32_t getDrawItemCount() const { return _dynamicIA ? 1 :  (uint32_t)_inputAssemblers.size(); }
    inline void setWorldMatix(const Mat4& matrix) { _worldMatrix = matrix; }
    inline const Mat4& getWorldMatrix() const { return _worldMatrix; }
    
    inline void setViewId(int val) { _viewID = val; }
    inline int getViewId() const { return _viewID; }
    
    void addInputAssembler(InputAssembler* ia);
    void clearInputAssemblers();
    void addEffect(Effect* effect);
    void clearEffects();
    void extractDrawItem(DrawItem& out, uint32_t index) const;

    inline INode* getNode() const { return _node; }
    inline void setNode(INode* node) { _node = node; }

private:
    ~Model();
    // Record world matrix instead of Node.
    INode* _node = nullptr;
    Mat4 _worldMatrix;
    Vector<Effect*> _effects;
    Vector<InputAssembler*> _inputAssemblers;
    std::vector<ValueMap> _defines;
    bool _dynamicIA = false;
    int _viewID = -1;
};

RENDERER_END
