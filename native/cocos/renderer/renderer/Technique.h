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

namespace se {
    class Object;
    class HandleObject;
}

RENDERER_BEGIN

class Pass;
class Texture;

/**
 * @addtogroup renderer
 * @{
 */

/**
 * @brief Technique is a important part of Effect, it contains a selective uniform parameters and all passes of effect.\n
 * JS API: renderer.Technique
 * @code
 * let pass = new renderer.Pass('sprite');
 * pass.setDepth(false, false);
 * pass.setCullMode(gfx.CULL_NONE);
 * let technique = new renderer.Technique(
 *     ['transparent'],
 *     [
 *         { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
 *         { name: 'color', type: renderer.PARAM_COLOR4 }
 *     ],
 *     [
 *         pass
 *     ]
 * );
 * @endcode
 */
class Technique : public Ref
{
public:
    /*
     *  @brief Uniform parameter of Technique, defines the uniform name and type
     */
    class Parameter final
    {
    public:
        enum class Type : uint8_t
        {
            INT = 5,
            INT2 = 6,
            INT3 = 7,
            INT4 = 8,
            FLOAT = 13,
            FLOAT2 = 14,
            FLOAT3 = 15,
            FLOAT4 = 16,
            COLOR3 = 99,
            COLOR4 = 100,
            MAT2 = 18,
            MAT3 = 22,
            MAT4 = 26,
            TEXTURE_2D = 29,
            TEXTURE_CUBE = 31,
            UNKNOWN = 0
        };
        
        // How many elements of each type, for example:
        // INT -> 1
        // INT2 -> 2
        // MAT4 -> 16
        static uint8_t getElements(Type type);
        
        /*
         *  @brief The default constructor.
         */
        Parameter();
        /*
         *  @brief Constructor with integer.
         */
        Parameter(const std::string& name, Type type, int* value, uint8_t count = 1);
        /*
         *  @brief Constructor with float.
         */
        Parameter(const std::string& name, Type type, float* value, uint8_t count = 1);
        /*
         *  @brief Constructor with Object.
         */
        Parameter(const std::string& name, Type type, se::Object* value);
        /*
         *  @brief Constructor with texture.
         */
        Parameter(const std::string& name, Type type, Texture* texture);
        /*
         *  @brief Constructor with texture array.
         */
        Parameter(const std::string& name, Type type, const std::vector<Texture*>& textures);
        Parameter(const std::string& name, Type type);
        Parameter(const Parameter& rh);
        Parameter(Parameter&& rh);
        ~Parameter();
        
        Parameter& operator=(const Parameter& rh);
        bool operator==(const Parameter& rh);
        
        /*
         *  @brief Gets the uniform type.
         */
        inline Type getType() const { return _type; }
        /*
         *  @brief Gets the uniform name.
         */
        inline const std::string& getName() const { return _name; }
        inline const size_t getHashName() const { return _hashName; }
        /*
         *  @brief Gets the counts of uniform components.
         */
        inline uint8_t getCount() const { return _count; }
        /*
         *  @brief Gets parameter value.
         */
        inline void* getValue() const
        {
            if(_jsValue != nullptr)
            {
                return _shareValue;
            }
            return _value;
        };
        /*
         *  @brief Gets bytes occupied by primitive uniform parameter.
         */
        inline uint16_t getBytes() const { return _bytes; };
        /*
         *  @brief Gets directly value.
         */
        inline bool getDirectly() const { return _directly; }
        /*
         *  @brief Sets directly value.
         */
        inline void setDirectly(bool value) { _directly = value; };
        /*
         *  @brief Gets the texture array.
         */
        std::vector<Texture*> getTextureArray() const;
        /*
         *  @brief Set the typed array.
         */
        void setShareValue(se::Object* jsValue);
        /*
         *  @brief Sets the texture pointer.
         */
        void setTexture(Texture* texture);
        /*
         *  @brief Gets the texture pointer.
         */
        Texture* getTexture() const;
        
        uint8_t* _shareValue = nullptr;
        se::Object* _jsValue = nullptr;
    private:
        
        void freeValue();
        void copyValue(const Parameter& rh);
        
        std::string _name = "";
        size_t _hashName = 0;
        
        // how many elements, for example, how many INT2 or how many MAT2
        uint8_t _count = 0;
        Type _type = Type::UNKNOWN;
        void* _value = nullptr;
        
        // It is meaningful if type is not Texture2D or TEXTURE_CUBE.
        uint16_t _bytes = 0;
        bool _directly = false;
    };
    
    /**
     *  @brief Constructor.
     *  @param[in] stages All stages it belongs to.
     *  @param[in] parameters All uniform parameters.
     *  @param[in] passes All passes.
     */
    Technique(const std::vector<std::string>& stages,
              const Vector<Pass*>& passes,
              int layer = 0);
    
    /*
     *  @brief The default constructor.
     */
    Technique();
    /*
     *  @brief The default destructor.
     */
    ~Technique();
    
    /**
     *  @brief Sets the stages it belongs to.
     */
    void setStages(const std::vector<std::string>& stages);
    /*
     *  @brief Sets the pass to the given index.
     */
    void setPass(int index, Pass* pass);
    /*
     *  @brief Gets all passes.
     */
    const Vector<Pass*>& getPasses() const { return _passes; }
    /*
     *  @brief Gets all stageID.
     */
    uint32_t getStageIDs() const { return _stageIDs; }
    /**
     *  @brief Deep copy from other techique.
     */
    void copy(const Technique& tech);
    /**
     *  @brief Get layer.
     */
    inline const int getLayer() const {return _layer; };
    
private:
    static uint32_t _genID;
    
    uint32_t _id = 0;
    uint32_t _stageIDs = 0;
    int _layer = 0;
    Vector<Pass*> _passes;
};

// end of renderer group
/// @}

RENDERER_END
