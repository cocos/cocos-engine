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

Effect::Effect(const Vector<Technique*>& techniques,
               const std::unordered_map<std::string, Property>& properties,
               const std::vector<ValueMap>& defineTemplates)
: _techniques(techniques)
, _properties(properties)
, _defineTemplates(defineTemplates)
{
    RENDERER_LOGD("Effect construction: %p", this);
}

Effect::~Effect()
{
    RENDERER_LOGD("Effect destruction: %p", this);
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

Value Effect::getDefineValue(const std::string& name) const
{
    for (const auto& def : _defineTemplates)
    {
        if (name == def.at("name").asString())
            return def.at("value");
    }
    
    RENDERER_LOGW("Failed to set define %s, define not found.", name.c_str());
    return Value::Null;
}

void Effect::setDefineValue(const std::string& name, const Value& value)
{
    for (auto& def : _defineTemplates)
    {
        if (name == def.at("name").asString())
        {
            def["value"] = value;
            return;
        }
    }
}

ValueMap* Effect::extractDefines(ValueMap& out) const
{
    for (auto& def : _defineTemplates)
        out[def.at("name").asString()] = def.at("value");
    
    return &out;
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

RENDERER_END
