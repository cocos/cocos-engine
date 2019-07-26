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

#include "../Macro.h"
#include "../Types.h"

#include "GraphicsHandle.h"

#include <string>
#include <vector>

RENDERER_BEGIN

/**
 * @addtogroup gfx
 * @{
 */

class DeviceGraphics;

/**
 * Program class manages the internal GL shader program.
 */
class Program final: public GraphicsHandle
{
public:
    /**
     * Describes vertex attribute informations used in the program
     * @struct Attribute
     */
    struct Attribute
    {
        /**
         * Attribute name
         */
        std::string name;
        /**
         * Number of components per attribute
         */
        GLsizei size;
        /**
         * Attribute location
         */
        GLuint location;
        /**
         * Attribute type
         */
        GLenum type;
    };

    /**
     * Describes uniform informations used in the program
     * @struct Uniform
     */
    struct Uniform
    {
        /**
         * Uniform name
         */
        std::string name;
        
        /**
         * Uniform hash name
         */
        size_t hashName;
        /**
         * The length of the array for uniforms declared as arrays, default value is 1
         */
        GLsizei size;
        /**
         * Uniform location
         */
        GLint location;
        /**
         * Uniform type
         */
        GLenum type;
        /**
         * Sets the uniform value
         */
        void setUniform(const void* value, UniformElementType elementType) const;
        /**
         * Sets the callback which will be called when uniform updated
         */
        using SetUniformCallback = void (*)(GLint, GLsizei, const void*, UniformElementType); // location, count, value, elementType
    private:
        SetUniformCallback _callback;
        friend class Program;
    };

    /**
     * Creates a Program with device and shader sources
     */
    RENDERER_DEFINE_CREATE_METHOD_3(Program, init, DeviceGraphics*, const char*, const char*)
    Program();
    virtual ~Program();

    /**
     * Initializes a Program with device and program sources
     * @param[in] device DeviceGraphics pointer
     * @param[in] vertSource Vertex shader program
     * @param[in] fragSource Fragment shader program
     */
    bool init(DeviceGraphics* device, const char* vertSource, const char* fragSource);
    /**
     * Gets the id of program
     */
    inline uint32_t getID() const { return _id; }
    /**
     * Gets the attibutes used in the program
     */
    inline const std::vector<Attribute>& getAttributes() const { return _attributes; }
    /**
     * Gets the uniforms used in the program
     */
    inline const std::vector<Uniform>& getUniforms() const { return _uniforms; }
    /**
     * Indicates whether the program is successfully linked
     */
    inline bool isLinked() const { return _linked; }
    /**
     * Link the program with its shader sources
     */
    void link();
    
    inline size_t getHash() const { return _hash; }
    inline void setHash(size_t hash) { _hash = hash; }
private:
    DeviceGraphics* _device;
    std::vector<Attribute> _attributes;
    std::vector<Uniform> _uniforms;
    std::string _vertSource;
    std::string _fragSource;
    uint32_t _id;
    bool _linked;
    size_t _hash = 0;
};

// end of gfx group
/// @}

RENDERER_END
