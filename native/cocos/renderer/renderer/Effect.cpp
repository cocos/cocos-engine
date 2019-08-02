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

#include "Effect.h"
#include "Config.h"

RENDERER_BEGIN

Effect::Effect()
: _hash(0)
{}

void Effect::init(const Vector<Technique*>& techniques,
               const std::unordered_map<std::string, Property>& properties,
               const std::vector<ValueMap>& defineTemplates)
{
    _techniques = techniques;
    _properties = properties;
    
    for (const auto& defineTemplate: defineTemplates)
        _defines.emplace(defineTemplate.at("name").asString(),
                                  defineTemplate.at("value"));
    generateDefinesKey();
}

Effect::~Effect()
{
//    RENDERER_LOGD("Effect destruction: %p", this);
    clear();
}

void Effect::clear()
{
    _techniques.clear();
}

Technique* Effect::getTechnique(const std::string& stage) const
{
    int stageID = Config::getStageID(stage);
    if (-1 == stageID)
        return nullptr;
    
    for (const auto& tech : _techniques)
    {
        if (tech->getStageIDs() & stageID)
            return tech;
    }
    
    return nullptr;
}

Value Effect::getDefine(const std::string& name) const
{
    return _defines.at(name);
}

void Effect::define(const std::string& name, const Value& value)
{
    if (_defines[name] != value)
    {
        _defines[name] = value;
        generateDefinesKey();
    }
}

ValueMap* Effect::extractDefines()
{
    return &_defines;
}

std::unordered_map<std::string, Effect::Property>* Effect::extractProperties()
{
    return &_properties;
}

const Effect::Property& Effect::getProperty(const std::string& name) const
{
    static Property EMPTY_PROPERTY;
    if (_properties.end() == _properties.find(name))
        return EMPTY_PROPERTY;
    else
        return _properties.at(name);
}

void Effect::setProperty(const std::string& name, const Property& property)
{
    _properties[name] = property;
}

void Effect::generateDefinesKey()
{
    _definesKey = "";
    for (auto& def : _defines) {
        _definesKey += def.first + std::to_string(def.second.asUnsignedInt());
    }
}

void Effect::copy(const Effect* effect)
{
    _hash = effect->_hash;
    auto& otherTech = effect->_techniques;
    for (auto it = otherTech.begin(); it != otherTech.end(); it ++)
    {
        auto tech = new Technique();
        tech->autorelease();
        tech->copy(**it);
        _techniques.pushBack(tech);
    }
    _defines = effect->_defines;
    _properties = effect->_properties;
    _definesKey = effect->_definesKey;
}

void Effect::setCullMode(CullMode cullMode)
{
    Technique* tech = _techniques.front();
    const Vector<Pass*>& passes = tech->getPasses();
    for (const auto& pass : passes)
    {
        pass->setCullMode(cullMode);
    }
}

void Effect::setBlend(BlendOp blendEq, BlendFactor blendSrc, BlendFactor blendDst, BlendOp blendAlphaEq, BlendFactor blendSrcAlpha, BlendFactor blendDstAlpha, uint32_t blendColor)
{
    Technique* tech = _techniques.front();
    const Vector<Pass*>& passes = tech->getPasses();
    for (const auto& pass : passes)
    {
        pass->setBlend(blendEq, blendSrc, blendDst, blendAlphaEq, blendSrcAlpha, blendDstAlpha, blendColor);
    }
}

void Effect::setStencilTest(bool value)
{
    Technique* tech = _techniques.front();
    const Vector<Pass*>& passes = tech->getPasses();
    for (const auto& pass : passes)
    {
        pass->setStencilTest(value);
    }
}

void Effect::setStencil(StencilFunc stencilFunc, uint32_t stencilRef, uint8_t stencilMask, StencilOp stencilFailOp, StencilOp stencilZFailOp, StencilOp stencilZPassOp, uint8_t stencilWriteMask)
{
    Technique* tech = _techniques.front();
    const Vector<Pass*>& passes = tech->getPasses();
    for (const auto& pass : passes)
    {
        pass->setStencilFront(stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask);
        pass->setStencilBack(stencilFunc, stencilRef, stencilMask, stencilFailOp, stencilZFailOp, stencilZPassOp, stencilWriteMask);
    }
}

RENDERER_END
