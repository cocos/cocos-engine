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
#include <list>
#include "base/CCVector.h"
#include "base/CCValue.h"
#include "base/ccCArray.h"
#include "math/Mat4.h"
#include "../Macro.h"
#include "InputAssembler.h"
#include "../gfx/DeviceGraphics.h"
#include "CustomProperties.hpp"
#include "../scene/NodeProxy.hpp"

RENDERER_BEGIN

class Effect;
class InputAssembler;
class Model;

/**
 * @addtogroup renderer
 * @{
 */

struct DrawItem
{
    Model* model = nullptr;
    InputAssembler* ia = nullptr;
    Effect* effect = nullptr;
    std::vector<ValueMap*>* defines = nullptr;
    size_t definesKeyHash = 0;
    std::vector<std::unordered_map<std::string, Effect::Property>*>* uniforms = nullptr;
};

class Model;

class ModelPool
{
public:
    static Model* getOrCreateModel();
    static void returnModel(Model*);
    
private:
    static ccCArray* _pool;;
};

/**
 *  @brief Model contains InputAssembler, effect, culling mask and model matrix.
 */
class Model
{
public:
    /**
     *  @brief The default constructor.
     */
    Model();
    /**
     *  @brief The default destructor.
     */
    ~Model();
    /**
     *  @brief Sets model matrix.
     */
    inline void setWorldMatix(const Mat4& matrix) { _worldMatrix = matrix; }
    /**
     *  @brief Gets mode matrix.
     */
    inline const Mat4& getWorldMatrix() const { return _worldMatrix; }
    /**
     *  @brief Sets culling mask.
     */
    inline void setCullingMask(int val) { _cullingMask = val; }
    /**
     *  @brief Gets culling mask.
     */
    inline int getCullingMask() const { return _cullingMask; }
    /**
     *  @brief Adds a input assembler.
     */
    void setInputAssembler(const InputAssembler& ia);
    /**
     *  @brief Adds an effect.
     */
    void setEffect(Effect* effect, CustomProperties* customProperties);
    /**
     *  @brief Set user key.
     */
    inline void setUserKey(int key) { _userKey = key; };
    /**
     *  @brief Set node.
     */
    void setNode(NodeProxy* node);
    /**
     *  @brief Get node.
     */
    inline const NodeProxy* getNode() const { return _node; };
    /**
     *  @brief Extract draw item for the given index during rendering process.
     */
    void extractDrawItem(DrawItem& out) const;
    /**
     *  @brief Resets models.
     */
    void reset();
private:
    friend class ModelPool;
    
    NodeProxy* _node = nullptr;
    Mat4 _worldMatrix;
    Effect* _effect = nullptr;
    
    InputAssembler _inputAssembler;
    std::vector<ValueMap*> _definesList;
    std::vector<std::unordered_map<std::string, Effect::Property>*> _uniforms;
    bool _dynamicIA = false;
    int _cullingMask = -1;
    int _userKey = -1;
    
    size_t _definesKeyHash = 0;
};

// end of renderer group
/// @}

RENDERER_END
