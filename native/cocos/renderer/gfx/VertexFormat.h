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
#include <unordered_map>

#include "base/CCRef.h"
#include "../Types.h"

RENDERER_BEGIN

/**
 * @addtogroup gfx
 * @{
 */

/**
 * The vertex format defines the attributes and their data layout in the VertexBuffer\n
 * JS API: gfx.VertexFormat
 @code
 let vertexFmt = new gfx.VertexFormat([
     { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
     { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
     { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 4, normalize: true },
 ]);
 @endcode
 */
class VertexFormat : public Ref
{
public:
    /*
     * Informations used to define an attribute in vertex data layout.
     * @struct Info
     */
    struct Info
    {
        /*
         * Constructor
         * @param[in] name Attribute name
         * @param[in] type Data type of each component
         * @param[in] num Number of components per attribute
         * @param[in] normalized Whether integer data values should be normalized into a certain range when being casted to a float
         */
        Info(const std::string& name, AttribType type, uint32_t num, bool normalize = false)
        : _name(name)
        , _num(num)
        , _type(type)
        , _normalize(normalize)
        {
        }
        std::string _name;
        uint32_t _num;
        AttribType _type;
        bool _normalize;
    };

    static Info INFO_END;

    /*
     * Element describes informations of an attribute
     * @struct Info
     */
    struct Element
    {
        Element()
        : offset(0)
        , stride(0)
        , stream(-1)
        , num(0)
        , bytes(0)
        , type(AttribType::INVALID)
        , normalize(false)
        {}

        inline bool isValid() const
        {
            return type != AttribType::INVALID;
        }

        /*
         * Name of the attribute
         */
        std::string name;
        /*
         * Byte offset in each vertex data
         */
        size_t offset;
        /*
         * Specifies the offset in bytes between the beginning of consecutive vertex attributes
         */
        uint32_t stride;
        int32_t stream;
        /*
         * Number of components per attribute unit
         */
        uint32_t num;
        /*
         * Total bytes per attribute unit
         */
        uint32_t bytes;
        /*
         * Data type of each component
         */
        AttribType type;
        /*
         * Specifies whether integer data values should be normalized into a certain range when being casted to a float
         */
        bool normalize;
    };

    /*
     * Default constructor
     */
    VertexFormat();
    /**
     * Constructor with specific attribute informations
     * @param[in] infos Array of all elements informations
     */
    VertexFormat(const std::vector<Info>& infos);
    /*
     * Copy constructor
     */
    VertexFormat(const VertexFormat& o);
    /*
     * Move constructor
     */
    VertexFormat(VertexFormat&& o);

    VertexFormat& operator=(const VertexFormat& o);
    VertexFormat& operator=(VertexFormat&& o);

    /**
     * Gets all attribute names
     */
    const std::vector<std::string>& getAttributeNames() const { return _names; };
    /**
     * Getes an attribute element by name
     */
    const Element* getElement(const std::string& attrName) const;
    
    /**
     * Gets total byte size of a vertex
     */
    uint32_t getBytes() const { return _bytes; };
    
    /*
     * Builtin VertexFormat with 2d position, uv, color, color0 attributes
     */
    static VertexFormat* XY_UV_Two_Color;
    /*
     * Builtin VertexFormat with 2d position, uv, color attributes
     */
    static VertexFormat* XY_UV_Color;
    /*
     * Builtin VertexFormat with 2d position, color attributes
     */
    static VertexFormat* XY_Color;

private:
    std::vector<std::string> _names;
    std::unordered_map<std::string, Element> _attr2el;
#if GFX_DEBUG > 0
    std::vector<Element> _elements;
#endif
    uint32_t _bytes;

    friend class VertexBuffer;
};

// end of gfx group
/// @}

RENDERER_END
