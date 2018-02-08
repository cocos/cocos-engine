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

#include "Types.h"

RENDERER_BEGIN

const char* ATTRIB_NAME_POSITION = "a_position";
const char* ATTRIB_NAME_NORMAL = "a_normal";
const char* ATTRIB_NAME_TANGENT = "a_tangent";
const char* ATTRIB_NAME_BITANGENT = "a_bitangent";
const char* ATTRIB_NAME_WEIGHTS = "a_weights";
const char* ATTRIB_NAME_JOINTS = "a_joints";
const char* ATTRIB_NAME_COLOR = "a_color";
const char* ATTRIB_NAME_COLOR0 = "a_color0";
const char* ATTRIB_NAME_COLOR1 = "a_color1";
const char* ATTRIB_NAME_UV = "a_uv";
const char* ATTRIB_NAME_UV0 = "a_uv0";
const char* ATTRIB_NAME_UV1 = "a_uv1";
const char* ATTRIB_NAME_UV2 = "a_uv2";
const char* ATTRIB_NAME_UV3 = "a_uv3";
const char* ATTRIB_NAME_UV4 = "a_uv4";
const char* ATTRIB_NAME_UV5 = "a_uv5";
const char* ATTRIB_NAME_UV6 = "a_uv6";
const char* ATTRIB_NAME_UV7 = "a_uv7";

Rect Rect::ZERO;

Rect::Rect()
{}

Rect::Rect(float x, float y, float w, float h)
: x(x)
, y(y)
, w(w)
, h(h)
{}

void Rect::set(float x, float y, float w, float h)
{
    this->x = x;
    this->y = y;
    this->w = w;
    this->h = h;
}

RENDERER_END
