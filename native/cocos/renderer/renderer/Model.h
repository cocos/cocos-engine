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
    ValueMap* defines = nullptr;
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
     *  @brief Gets input assembler count.
     */
    inline uint32_t getInputAssemblerCount() const { return (uint32_t)_inputAssemblers.size(); }
    /**
     *  @brief Indicates whether the model's data is in dynamic input assembler.
     */
    inline bool isDynamicIA() const { return _dynamicIA; }
    /**
     *  @brief Sets whether the model's data is in dynamic input assembler.
     */
    inline void setDynamicIA(bool value) { _dynamicIA =  value; }
    /**
     *  @brief Gets draw item count.
     */
    inline uint32_t getDrawItemCount() const { return _dynamicIA ? 1 :  (uint32_t)_inputAssemblers.size(); }
    /**
     *  @brief Sets model matrix.
     */
    inline void setWorldMatix(const Mat4& matrix) { _worldMatrix = std::move(matrix); }
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
    void addInputAssembler(const InputAssembler& ia);
    /**
     *  @brief Clears all input assemblers.
     */
    void clearInputAssemblers();
    /**
     *  @brief Adds an effect.
     */
    void addEffect(Effect* effect);
    /**
     *  @brief Clears all effects.
     */
    void clearEffects();
    /**
     *  @brief Extract draw item for the given index during rendering process.
     */
    void extractDrawItem(DrawItem& out, uint32_t index) const;

private:
    friend class ModelPool;
    void reset();
    
    Mat4 _worldMatrix;
    ccCArray* _effects = ccCArrayNew(2);
    
    std::vector<InputAssembler> _inputAssemblers;
    std::vector<ValueMap*> _defines;
    bool _dynamicIA = false;
    int _cullingMask = -1;
};

// end of renderer group
/// @}

RENDERER_END
