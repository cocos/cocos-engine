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

#include "Technique.h"
#include "Config.h"
#include "Pass.h"
#include "gfx/Texture.h"
#include "gfx/Texture.h"

RENDERER_BEGIN

// implementation of Parameter

uint8_t Technique::Parameter::elementsOfType[] = {
    1, // INT
    2, // INT2
    3, // INT3
    4, // INT4
    1, // FLOAT
    2, // FLOAT2
    3, // FLOAT3
    4, // FLOAT4
    3, // COLOR3
    4, // COLOR4
    4, // MAT2
    9, // MAT3
    16,// MAT4
    1, // TEXTURE_2D
    1, // TEXTURE_CUBE
    0, // UNKNOWN
};

uint8_t Technique::Parameter::getElements(Type type)
{
    return Parameter::elementsOfType[(int)type];
}

Technique::Parameter::Parameter()
{}

Technique::Parameter::Parameter(const std::string& name, Type type)
: _name(name)
, _type(type)
, _count(1)
{
    if (Type::TEXTURE_2D == _type ||
        Type::TEXTURE_CUBE == _type ||
        Type::UNKNOWN == _type)
        return;
    
    uint8_t elements = Parameter::getElements(type);
    switch (type)
    {
        case Type::INT:
        case Type::INT2:
        case Type::INT3:
        case Type::INT4:
            _bytes = sizeof(int) * elements;
            break;
        case Type::FLOAT:
        case Type::FLOAT2:
        case Type::FLOAT3:
        case Type::FLOAT4:
        case Type::COLOR3:
        case Type::COLOR4:
        case Type::MAT2:
        case Type::MAT3:
        case Type::MAT4:
            _bytes = sizeof(float) * elements;
            break;
        default:
            break;
    }
    
    _value = malloc(_bytes);
    memset(_value, 0, _bytes);
    if (Type::COLOR4 == _type)
        *((float*)(_value) + 3) = 1.0f;
}

Technique::Parameter::Parameter(const std::string& name, Type type, int* value, uint8_t count)
: _name(name)
, _type(type)
, _count(count)
{
    uint8_t bytes = sizeof(int);
    switch (_type)
    {
        case Type::INT:
            bytes *= _count;
            break;
        case Type::INT2:
            bytes *= 2 * _count;
            break;
        case Type::INT3:
            bytes *= 3 * _count;
            break;
        case Type::INT4:
            bytes *= 4 * _count;
            break;
        default:
            RENDERER_LOGW("This constructor only supports INT/INT2/INT3/INT4.");
            return;
            break;
    }
    
    if (value)
    {
        _value = malloc(bytes);
        if (_value)
            memcpy(_value, value, bytes);
    }
}

Technique::Parameter::Parameter(const std::string& name, Type type, float* value, uint8_t count)
: _name(name)
, _type(type)
, _count(count)
{
    uint16_t bytes = sizeof(float);
    switch (_type)
    {
        case Type::FLOAT:
            bytes *= _count;
            break;
        case Type::FLOAT2:
            bytes *= 2 * _count;
            break;
        case Type::FLOAT3:
            bytes *= 3 * _count;
            break;
        case Type::FLOAT4:
            bytes *= 4 * _count;
            break;
        case Type::MAT2:
            bytes *= 4 * _count;
            break;
        case Type::MAT3:
            bytes *= 9 * _count;
            break;
        case Type::MAT4:
            bytes *= 16 * _count;
            break;
        case Type::COLOR4:
            bytes *= 4 * _count;
            break;
        case Type::COLOR3:
            bytes *= 3 * _count;
            break;
            
        default:
            RENDERER_LOGW("This constructor only supports FLAOT/FLOAT2/FLOAT3/FLOAT4/MAT2/MAT3/MAT4/COLOR3/COLOR4.");
            return;
            break;
    }
    
    if (value)
    {
        _bytes = bytes;
        _value = malloc(_bytes);
        if (_value)
            memcpy(_value, value, _bytes);
    }
}

Technique::Parameter::Parameter(const std::string& name, Type type, Texture* value)
: _name(name)
, _count(1)
, _type(type)
{
    assert(_type == Type::TEXTURE_2D || _type == Type::TEXTURE_CUBE);
    if (value)
    {
        _value = value;
        value->retain();
    }
}

Technique::Parameter::Parameter(const std::string& name, Type type, const std::vector<Texture*>& textures)
: _name(name)
, _count(textures.size())
, _type(type)
{
    assert(_type == Type::TEXTURE_2D || _type == Type::TEXTURE_CUBE);
    if (textures.empty())
        return;
    
    size_t size = textures.size();
    _value = malloc(sizeof(void*) * size);
    void** valArr = (void**)_value;
    for (size_t i = 0; i < size; ++i)
    {
        Texture* tex = textures[i];
        valArr[i] = tex;
        if (tex)
            tex->retain();
    }
}

Technique::Parameter::Parameter(Parameter&& rh)
{
    if (this == &rh)
        return;
    
    freeValue();
    
    _name = rh._name;
    _type = rh._type;
    _value = rh._value;
    _count = rh._count;
    _bytes = rh._bytes;
    
    rh._value = nullptr;
}

Technique::Parameter::Parameter(const Parameter& rh)
{
    freeValue();
    copyValue(rh);
}

Technique::Parameter::~Parameter()
{
    freeValue();
}

Technique::Parameter& Technique::Parameter::operator=(const Parameter& rh)
{
    if (this == &rh)
        return *this;

    freeValue();
    copyValue(rh);
    
    return *this;
}

std::vector<Texture*> Technique::Parameter::getTextureArray() const
{
    std::vector<Texture*> ret;
    if (Type::TEXTURE_2D != _type &&
        Type::TEXTURE_CUBE != _type)
        return ret;
    
    Texture** texture = (Texture**)_value;
    for (int i = 0; i < _count; ++i)
    {
        ret.push_back(texture[i]);
    }
    
    return ret;
}

Texture* Technique::Parameter::getTexture() const
{
    assert(_type == Technique::Parameter::Type::TEXTURE_2D || _type == Technique::Parameter::Type::TEXTURE_CUBE);
    assert(_count == 1);
    return static_cast<Texture*>(_value);
}

void Technique::Parameter::setTexture(renderer::Texture *texture)
{
    if (_value == texture)
        return;
    
    freeValue();
    _value = malloc(sizeof(void*));
    _value = texture;
    RENDERER_SAFE_RETAIN(texture);
    
    _type = Type::TEXTURE_2D;
    _count = 1;
}

void Technique::Parameter::copyValue(const Parameter& rh)
{
    _name = rh._name;
    _type = rh._type;
    _count = rh._count;
    _bytes = rh._bytes;

    if (Type::TEXTURE_2D == _type ||
        Type::TEXTURE_CUBE == _type)
    {
        if (_count == 1)
        {
            _value = rh._value;
            RENDERER_SAFE_RETAIN((Texture*)_value);
        }
        else
        {
            if (_count > 0)
                _value = malloc(_count * sizeof(void*));
            
            Texture** texture = (Texture**)_value;
            for (uint8_t i = 0; i < _count; ++i)
            {
                RENDERER_SAFE_RETAIN(texture[i]);
            }
        }
    }
    else
    {
        if (_count > 0)
        {
            _value = malloc(_bytes);
            memcpy(_value, rh._value, _bytes);
        }
    }
}

void Technique::Parameter::freeValue()
{
    if (_value)
    {
        if (Type::TEXTURE_2D == _type ||
            Type::TEXTURE_CUBE == _type)
        {
            if (_count == 1)
            {
                CC_SAFE_RELEASE((Texture*)_value);
                _value = nullptr;
                return;
            }
            else
            {
                Texture** textures = static_cast<Texture**>(_value);
                for (int i = 0; i < _count; ++i)
                {
                    Texture* texture = textures[i];
                    RENDERER_SAFE_RELEASE(texture);
                }
            }
        }
        
        free(_value);
        _value = nullptr;
    }
}

// implementation of Technique

uint32_t Technique::_genID = 0;

Technique::Technique(const std::vector<std::string>& stages,
                     const std::vector<Parameter>& parameters,
                     const Vector<Pass*>& passes,
                     int layer)
: _id(_genID++)
, _stageIDs(Config::getStageIDs(stages))
, _parameters(parameters)
, _passes(passes)
, _layer(layer)
{
//    RENDERER_LOGD("Technique construction: %p", this);
}

Technique::~Technique()
{
//    RENDERER_LOGD("Technique destruction: %p", this);
}

void Technique::setStages(const std::vector<std::string>& stages)
{
    _stageIDs = Config::getStageIDs(stages);
}

void Technique::setPass(int index, Pass* pass)
{
    _passes.insert(index, pass);
}

RENDERER_END
