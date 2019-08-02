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

#include <stdio.h>
#include "../Macro.h"
#include "Technique.h"
#include "base/CCValue.h"

RENDERER_BEGIN

class CustomProperties
{
public:
    using Property = Technique::Parameter;
    
    CustomProperties();
    ~CustomProperties();
    
    void setProperty(const std::string name, const Property& property);
    const Property& getProperty(std::string name) const;
    void define(const std::string& name, const Value& value);
    Value getDefine(const std::string& name) const;
    std::unordered_map<std::string, Property>* extractProperties();
    ValueMap* extractDefines();
    const double getHash() const {return _hash; };
    
    const std::string& getDefinesKey() { return _definesKey; };
private:
    
    std::unordered_map<std::string, Property> _properties;
    ValueMap _defines;
    double _hash = 0;
    bool _dirty = false;
    
    void generateDefinesKey();
    std::string _definesKey;
};

RENDERER_END
