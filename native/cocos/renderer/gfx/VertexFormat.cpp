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

#include "VertexFormat.h"

RENDERER_BEGIN

static uint32_t attrTypeBytes(AttribType attrType)
{
    if (attrType == AttribType::INT8) {
        return 1;
    } else if (attrType == AttribType::UINT8) {
        return 1;
    } else if (attrType == AttribType::INT16) {
        return 2;
    } else if (attrType == AttribType::UINT16) {
        return 2;
    } else if (attrType == AttribType::INT32) {
        return 4;
    } else if (attrType == AttribType::UINT32) {
        return 4;
    } else if (attrType == AttribType::FLOAT32) {
        return 4;
    }

    RENDERER_LOGW("Unknown ATTR_TYPE: %u", (uint32_t)attrType);
    return 0;
}

VertexFormat* VertexFormat::XY_UV_Two_Color = new VertexFormat(std::vector<Info>({
    Info(ATTRIB_NAME_POSITION, AttribType::FLOAT32, 2),
    Info(ATTRIB_NAME_UV0, AttribType::FLOAT32, 2),
    Info(ATTRIB_NAME_COLOR, AttribType::UINT8, 4, true),
    Info(ATTRIB_NAME_COLOR0, AttribType::UINT8, 4, true)
}));

VertexFormat* VertexFormat::XY_UV_Color = new VertexFormat(std::vector<Info>({
    Info(ATTRIB_NAME_POSITION, AttribType::FLOAT32, 2),
    Info(ATTRIB_NAME_UV0, AttribType::FLOAT32, 2),
    Info(ATTRIB_NAME_COLOR, AttribType::UINT8, 4, true)
}));

VertexFormat* VertexFormat::XY_Color = new VertexFormat(std::vector<Info>({
    Info(ATTRIB_NAME_POSITION, AttribType::FLOAT32, 2),
    Info(ATTRIB_NAME_COLOR, AttribType::UINT8, 4, true)
}));

VertexFormat::VertexFormat()
{
}

VertexFormat::VertexFormat(const std::vector<Info>& infos)
{
    _bytes = 0;
#if GFX_DEBUG > 0
    std::vector<Element*> _elements;
    std::vector<Element*>& elements = _elements;
#else
    std::vector<Element*> elements;
#endif

    uint32_t offset = 0;
    for (size_t i = 0, len = infos.size(); i < len; ++i)
    {
        const auto& info = infos[i];
        Element el;
        el.name = info._name;
        el.offset = offset;
        el.stride = 0;
        el.stream = -1;
        el.type = info._type;
        el.num = info._num;
        el.normalize = info._normalize;
        el.bytes = info._num * attrTypeBytes(info._type);

        _names.push_back(el.name);
        _attr2el[el.name] = el;
        elements.push_back(&_attr2el[el.name]);

        _bytes += el.bytes;
        offset += el.bytes;
    }

    for (size_t i = 0, len = elements.size(); i < len; ++i)
    {
        auto& el = elements[i];
        el->stride = _bytes;
    }
}

VertexFormat::VertexFormat(const VertexFormat& o)
{
    if (this != &o)
        *this = o;
}

VertexFormat::VertexFormat(VertexFormat&& o)
{
    if (this != &o)
        *this = std::move(o);
}

VertexFormat& VertexFormat::operator=(const VertexFormat& o)
{
    if (this != &o)
    {
        _names = o._names;
        _attr2el = o._attr2el;
#if GFX_DEBUG > 0
        _elements = o._elements;
        _bytes = o._bytes;
#endif
    }
    return *this;
}

VertexFormat& VertexFormat::operator=(VertexFormat&& o)
{
    if (this != &o)
    {
        _names = std::move(o._names);
        _attr2el = std::move(o._attr2el);
#if GFX_DEBUG > 0
        _elements = std::move(o._elements);
        _bytes = o._bytes;
        o._bytes = 0;
#endif
    }
    return *this;
}

const VertexFormat::Element* VertexFormat::getElement(const std::string& attrName) const
{
    static const Element* INVALID_ELEMENT_VALUE = nullptr;
    const auto& iter = _attr2el.find(attrName);
    if (iter != _attr2el.end())
    {
        return &iter->second;
    }
    return INVALID_ELEMENT_VALUE;
}

RENDERER_END
