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

#include <string>
#include <vector>
#include "platform/CCGL.h"
#include "base/CCVector.h"
#include "base/CCRef.h"
#include "../Macro.h"

RENDERER_BEGIN

class Pass;
class Texture;

class Technique : public Ref
{
public:
    
    class Parameter final
    {
    public:
        enum class Type : uint8_t
        {
            INT = 0,
            INT2,
            INT3,
            INT4,
            FLOAT,
            FLOAT2,
            FLOAT3,
            FLOAT4,
            COLOR3,
            COLOR4,
            MAT2,
            MAT3,
            MAT4,
            TEXTURE_2D,
            TEXTURE_CUBE,
            UNKNOWN
        };
        
        // How many elements of each type, for example:
        // INT -> 1
        // INT2 -> 2
        // MAT4 -> 16
        static uint8_t getElements(Type type);
        
        Parameter();
        Parameter(const std::string& name, Type type, int* value, uint8_t count = 1);
        Parameter(const std::string& name, Type type, float* value, uint8_t count = 1);
        Parameter(const std::string& name, Type type, Texture* texture);
        Parameter(const std::string& name, Type type, const std::vector<Texture*>& textures);
        Parameter(const std::string& name, Type type);
        Parameter(const Parameter& rh);
        Parameter(Parameter&& rh);
        ~Parameter();
        
        Parameter& operator=(const Parameter& rh);
        
        inline Type getType() const { return _type; }
        inline const std::string& getName() const { return _name; }
        inline uint8_t getCount() const { return _count; }
        inline void* getValue() const { return _value; }
        inline uint16_t getBytes() const { return _bytes; };
        
        std::vector<Texture*> getTextureArray() const;
        void setTexture(Texture* texture);
        Texture* getTexture() const;
        
    private:
        static uint8_t elementsOfType[(int)Type::UNKNOWN + 1];
        
        void freeValue();
        void copyValue(const Parameter& rh);
        
        std::string _name = "";
        // how many elements, for example, how many INT2 or how many MAT2
        uint8_t _count = 0;
        Type _type = Type::UNKNOWN;
        void* _value = nullptr;
        
        // It is meaningful if type is not Texture2D or TEXTURE_CUBE.
        uint16_t _bytes = 0;
    };
    
    Technique(const std::vector<std::string>& stages,
              const std::vector<Parameter>& parameters,
              const Vector<Pass*>& passes,
              int layer = 0);

    virtual ~Technique();
    
    void setStages(const std::vector<std::string>& stages);
    
    // Should rename function name in binding codes.
    const Vector<Pass*>& getPasses() const { return _passes; }
    uint32_t getStageIDs() const { return _stageIDs; }
    
    // TODO: add get functions
    const std::vector<Parameter>& getParameters() const { return _parameters; }
    
private:
    static uint32_t _genID;
    
    uint32_t _id = 0;
    uint32_t _stageIDs = 0;
    int _layer = 0;
    std::vector<Parameter> _parameters;
    Vector<Pass*> _passes;
};

RENDERER_END
