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

#include "../Types.h"

#include <string>
#include <vector>
#include <unordered_map>

RENDERER_BEGIN

class VertexFormat
{
public:
    struct Info
    {
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

        std::string name;
        size_t offset;
        uint32_t stride;
        int32_t stream;
        uint32_t num;
        uint32_t bytes;
        AttribType type;
        bool normalize;
    };

    VertexFormat();
    VertexFormat(const std::vector<Info>& infos);
    VertexFormat(const VertexFormat& o);
    VertexFormat(VertexFormat&& o);

    VertexFormat& operator=(const VertexFormat& o);
    VertexFormat& operator=(VertexFormat&& o);

    const Element& getElement(const std::string& attrName) const;

private:
    std::unordered_map<std::string, Element> _attr2el;
#if GFX_DEBUG > 0
    std::vector<Element> _elements;
#endif
    uint32_t _bytes;

    friend class VertexBuffer;
};

RENDERER_END
