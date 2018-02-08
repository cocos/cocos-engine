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
#include "base/CCRef.h"
#include "base/CCValue.h"
#include "../Macro.h"
#include "Technique.h"

RENDERER_BEGIN

class Effect : public Ref
{
public:
    
    typedef Technique::Parameter Property;
    
    Effect(const Vector<Technique*>& techniques,
           const std::unordered_map<std::string, Property>& properties,
           const std::vector<ValueMap>& defineTemplates);

    virtual ~Effect();
    
    void clear();
    
    Technique* getTechnique(const std::string& stage) const;
    
    Value getDefineValue(const std::string& name) const;
    void setDefineValue(const std::string& name, const Value& value);
    ValueMap* extractDefines(ValueMap& out) const;
    
    const Property& getProperty(const std::string& name) const;
    void setProperty(const std::string& name, const Property& property);
    
private:
    Vector<Technique*> _techniques;
    std::vector<ValueMap> _defineTemplates;
    std::unordered_map<std::string, Property> _properties;
};

RENDERER_END
