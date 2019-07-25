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
#include <unordered_map>
#include <map>
#include "base/CCRef.h"
#include "base/CCValue.h"
#include "../Macro.h"
#include "Technique.h"
#include "Pass.h"

RENDERER_BEGIN

/**
 * @addtogroup renderer
 * @{
 */

/**
 * @brief Fundamental class of material system, contains techniques, shader template define settings and uniform properties.\n
 * JS API: renderer.Effect
 * @code
 * let pass = new renderer.Pass('sprite');
 * pass.setDepth(false, false);
 * pass.setCullMode(gfx.CULL_NONE);
 * let mainTech = new renderer.Technique(
 *     ['transparent'],
 *     [
 *         { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
 *         { name: 'color', type: renderer.PARAM_COLOR4 }
 *     ],
 *     [
 *         pass
 *     ]
 * );
 * let effect = new renderer.Effect(
 *     [
 *         mainTech
 *     ],
 *     {
 *         'color': {r: 1, g: 1, b: 1, a: 1}
 *     },
 *     [
 *         { name: 'useTexture', value: true },
 *         { name: 'useModel', value: false },
 *         { name: 'alphaTest', value: false },
 *         { name: 'useColor', value: true }
 *     ]
 * );
 * @endcode
 */
class Effect : public Ref
{
public:
    using Property = Technique::Parameter;
    
    /*
     * @brief The default constructor.
     */
    Effect();
    /*
     *  @brief The default destructor.
     */
    ~Effect();
    
    /*
     * @brief Initialize with techniques, properties and define settings.
     * @param[in] techniques All techniques in an array
     * @param[in] properties All properties in a map
     * @param[in] defineTemplates All defines and their value in a map
     */
    void init(const Vector<Technique*>& techniques,
              const std::unordered_map<std::string, Property>& properties,
              const std::vector<ValueMap>& defineTemplates);
    /**
     *  @brief Clears techniques and define list.
     */
    void clear();
    
    /**
     *  @brief Gets technique by stage.
     */
    Technique* getTechnique(const std::string& stage) const;
    /*
     *  @brief Gets all techniques.
     */
    const Vector<Technique*>& getTechniques() const { return _techniques; }
    /**
     *  @brief Gets define property value by name.
     */
    Value getDefine(const std::string& name) const;
    /**
     *  @brief Sets a define's value.
     */
    void define(const std::string& name, const Value& value);
    
    /*
     *  @brief Extracts all defines.
     */
    ValueMap* extractDefines();
    /*
     *  @brief Extracts all propertyps.
     */
    std::unordered_map<std::string, Property>* extractProperties();
    /**
     *  @brief Gets uniform property value by name.
     */
    const Property& getProperty(const std::string& name) const;
    /**
     *  @brief Sets uniform property value by name.
     */
    void setProperty(const std::string& name, const Property& property);
    /*
     *  @brief Gets all uniform properties.
     */
    const std::unordered_map<std::string, Property>& getProperties() const { return _properties; }
    /**
     *  @brief Updates hash.
     */
    void updateHash(double hash) { _hash = hash; };
    /**
     *  @brief Gets hash.
     */
    double getHash() const { return _hash; };
    
    /**
     *  @brief Sets cull mode.
     *  @param[in] cullMode Cull front or back or both.
     */
    void setCullMode(CullMode cullMode);
    /**
     *  @brief Sets blend mode.
     *  @param[in] blendEq RGB blend equation.
     *  @param[in] blendSrc Src RGB blend factor.
     *  @param[in] blendDst Dst RGB blend factor.
     *  @param[in] blendAlphaEq Alpha blend equation.
     *  @param[in] blendSrcAlpha Src Alpha blend equation.
     *  @param[in] blendDstAlpha Dst Alpha blend equation.
     *  @param[in] blendColor Blend constant color value.
     */
    void setBlend(BlendOp blendEq = BlendOp::ADD,
                  BlendFactor blendSrc = BlendFactor::ONE,
                  BlendFactor blendDst = BlendFactor::ZERO,
                  BlendOp blendAlphaEq = BlendOp::ADD,
                  BlendFactor blendSrcAlpha = BlendFactor::ONE,
                  BlendFactor blendDstAlpha = BlendFactor::ZERO,
                  uint32_t blendColor = 0xffffffff);
    /**
     *  @brief Sets stencil front-facing function, reference, mask, fail operation, write mask.
     */
    void setStencil(StencilFunc stencilFunc = StencilFunc::ALWAYS,
                         uint32_t stencilRef = 0,
                         uint8_t stencilMask = 0xff,
                         StencilOp stencilFailOp = StencilOp::KEEP,
                         StencilOp stencilZFailOp = StencilOp::KEEP,
                         StencilOp stencilZPassOp = StencilOp::KEEP,
                         uint8_t stencilWriteMask = 0xff);
    /*
     *  @brief Sets stencil test enabled or not.
     */
    void setStencilTest(bool value);

    /*
     *  @brief Gets the define key for the current define settings.
     */
    const std::string& getDefinesKey() { return _definesKey; };
    /**
     *  @brief Deep copy from other effect.
     */
    void copy(const Effect* effect);
private:
    double _hash;
    std::string _definesKey;
    Vector<Technique*> _techniques;
    ValueMap _defines;
    std::unordered_map<std::string, Property> _properties;
    
    void generateDefinesKey();
    
};

// end of renderer group
/// @}

RENDERER_END
