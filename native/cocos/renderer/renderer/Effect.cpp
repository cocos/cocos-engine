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

std::map<std::string,std::size_t> Effect::_defineBitOrder;
std::vector<std::string> Effect::_sharedDefineList;

Effect::Effect()
: _hash(0)
, _definesKey(0)
{}

void Effect::init(const Vector<Technique*>& techniques,
               const std::unordered_map<std::string, Property>& properties,
               const std::vector<ValueMap>& defineTemplates)
{
    _techniques = techniques;
    _properties = properties;
    _defineTemplates = defineTemplates;
    
    for (const auto defineTemplate: _defineTemplates)
        _cachedNameValues.emplace(defineTemplate.at("name").asString(),
                                  defineTemplate.at("value"));
    generateKey();
}

Effect::~Effect()
{
//    RENDERER_LOGD("Effect destruction: %p", this);
    clear();
}

void Effect::clear()
{
    _techniques.clear();
    _defineTemplates.clear();
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
    for (const auto& def : _defineTemplates)
    {
        if (name == def.at("name").asString())
            return def.at("value");
    }
    
    RENDERER_LOGW("Failed to set define %s, define not found.", name.c_str());
    return Value::Null;
}

void Effect::define(const std::string& name, const Value& value)
{
    for (auto& def : _defineTemplates)
    {
        if (name == def.at("name").asString())
        {
            def["value"] = value;
            if (_cachedNameValues[name] != value)
            {
                _cachedNameValues[name] = value;
                generateKey();
            }
            return;
        }
    };
}

ValueMap* Effect::extractDefines()
{
    return &_cachedNameValues;
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

void Effect::_updateDefineBitOrder(const ValueMap& nameValues)
{
    for (auto& tmplDefs : nameValues)
    {
        if (_defineBitOrder.find(tmplDefs.first) == _defineBitOrder.end())
        {
            _sharedDefineList.push_back(tmplDefs.first);
            _defineBitOrder[tmplDefs.first] = _sharedDefineList.size();
        }
    }
}

void Effect::generateKey()
{
    // Update global order when has new define.
    _updateDefineBitOrder(_cachedNameValues);
    
    _definesKey = 0;
    for (auto& tmplDefs : _cachedNameValues) {
        uint32_t value = tmplDefs.second.asUnsignedInt();
        CCASSERT(value <= 1,"Define value can't greater than 1");
        value <<= _defineBitOrder[tmplDefs.first];
        _definesKey |= value;
    }
    
    // Reserve 8 bit for the OR operation with program id in ProgramLib.
    _definesKey <<= 8;
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
    _defineTemplates = effect->_defineTemplates;
    _cachedNameValues = effect->_cachedNameValues;
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
