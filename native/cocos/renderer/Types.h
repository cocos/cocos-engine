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

#include <new>
#include <stdint.h>
#include <stdio.h>
#include <assert.h>
#include <string>
#include "base/CCValue.h"

#include "Macro.h"
#include "platform/CCGL.h"

RENDERER_BEGIN

enum ClearFlag : uint8_t
{
    NONE        = 0x00,      // No clear flags.
    COLOR       = 0x01,      // Clear color.
    DEPTH       = 0x02,      // Clear depth.
    STENCIL     = 0x04       // Clear stencil.
};

enum class ComparisonFunc : uint16_t
{
    NEVER               = GL_NEVER,
    LESS                = GL_LESS,
    EQUAL               = GL_EQUAL,
    LESS_EQUAL          = GL_LEQUAL,
    GREATER             = GL_GREATER,
    NOT_EQUAL           = GL_NOTEQUAL,
    GREATOR_EQUAL       = GL_GEQUAL,
    ALWAYS              = GL_ALWAYS
};
typedef ComparisonFunc DepthFunc;
typedef ComparisonFunc StencilFunc;
typedef ComparisonFunc SamplerFunc;

enum class StencilOp : uint16_t
{
    ZERO                    = GL_ZERO,
    KEEP                    = GL_KEEP,
    REPLACE                 = GL_REPLACE,
    INCR                    = GL_INCR,
    DECR                    = GL_DECR,
    INVERT                  = GL_INVERT,
    
    // Does these two belongs to stencil operation?
    INCR_WRAP                = GL_INCR_WRAP,
    DECR_WRAP                = GL_DECR_WRAP
};

enum class BlendFactor : uint16_t
{
    ZERO                        = GL_ZERO,
    ONE                         = GL_ONE,
    SRC_COLOR                   = GL_SRC_COLOR,
    ONE_MINUS_SRC_COLOR         = GL_ONE_MINUS_SRC_COLOR,
    SRC_ALPHA                   = GL_SRC_ALPHA,
    ONE_MINUS_SRC_ALPHA         = GL_ONE_MINUS_SRC_ALPHA,
    DST_ALPHA                   = GL_DST_ALPHA,
    ONE_MINUS_DST_ALPHA         = GL_ONE_MINUS_DST_ALPHA,
    DST_COLOR                   = GL_DST_COLOR,
    ONE_MINUS_DST_COLOR         = GL_ONE_MINUS_DST_COLOR,
    SRC_ALPHA_SATURATE          = GL_SRC_ALPHA_SATURATE,
    
    CONSTANT_COLOR              = GL_CONSTANT_COLOR,
    ONE_MINUS_CONSTANT_COLOR    = GL_ONE_MINUS_CONSTANT_COLOR,
    CONSTANT_ALPHA              = GL_CONSTANT_ALPHA,
    ONE_MINUS_CONSTANT_ALPHA    = GL_ONE_MINUS_CONSTANT_ALPHA
};
enum class BlendOp : uint16_t
{
    ADD                 = GL_FUNC_ADD,
    SUBTRACT            = GL_FUNC_SUBTRACT,
    REVERSE_SUBTRACT    = GL_FUNC_REVERSE_SUBTRACT
};

enum class CullMode : uint16_t
{
    NONE                    = GL_NONE,
    BACK                    = GL_BACK,
    FRONT                   = GL_FRONT,
    FRONT_AND_BACK          = GL_FRONT_AND_BACK
};

enum class PrimitiveType : uint16_t
{
    POINTS                  = GL_POINTS,
    LINES                   = GL_LINES,
    LINE_LOOP               = GL_LINE_LOOP,
    LINE_STRIP              = GL_LINE_STRIP,
    TRIANGLES               = GL_TRIANGLES,
    TRIANGLE_STRIP          = GL_TRIANGLE_STRIP,
    TRIANGLE_FAN            = GL_TRIANGLE_FAN
};

enum class Usage : uint16_t
{
    STATIC = GL_STATIC_DRAW,
    DYNAMIC = GL_DYNAMIC_DRAW,
    STREAM = GL_STREAM_DRAW
};

enum class IndexFormat : uint16_t
{
    UINT8 = GL_UNSIGNED_BYTE,
    UINT16 = GL_UNSIGNED_SHORT,
    UINT32 = GL_UNSIGNED_INT// (OES_element_index_uint)
};

// vertex attribute semantic

extern const char* ATTRIB_NAME_POSITION;
extern const char* ATTRIB_NAME_NORMAL;
extern const char* ATTRIB_NAME_TANGENT;
extern const char* ATTRIB_NAME_BITANGENT;
extern const char* ATTRIB_NAME_WEIGHTS;
extern const char* ATTRIB_NAME_JOINTS;
extern const char* ATTRIB_NAME_COLOR;
extern const char* ATTRIB_NAME_COLOR0;
extern const char* ATTRIB_NAME_COLOR1;
extern const char* ATTRIB_NAME_UV;
extern const char* ATTRIB_NAME_UV0;
extern const char* ATTRIB_NAME_UV1;
extern const char* ATTRIB_NAME_UV2;
extern const char* ATTRIB_NAME_UV3;
extern const char* ATTRIB_NAME_UV4;
extern const char* ATTRIB_NAME_UV5;
extern const char* ATTRIB_NAME_UV6;
extern const char* ATTRIB_NAME_UV7;

// vertex attribute type
enum class AttribType : uint16_t
{
    INVALID = 0,
    INT8 = GL_BYTE,
    UINT8 = GL_UNSIGNED_BYTE,
    INT16 = GL_SHORT,
    UINT16 = GL_UNSIGNED_SHORT,
    INT32 = GL_INT,
    UINT32 = GL_UNSIGNED_INT,
    FLOAT32 = GL_FLOAT
};

enum class UniformElementType : uint8_t
{
    FLOAT,
    INT
};

enum class ProjectionType : uint8_t
{
    PERSPECTIVE,
    ORTHOGRAPHIC
};

struct Define
{
    std::string key;
    Value value;
};
typedef std::vector<Define> DefineVector;

struct Rect
{
    Rect();
    Rect(float x, float y, float w, float h);
    
    void set(float x, float y, float w, float h);
    
    float x = 0;
    float y = 0;
    float w = 0;
    float h = 0;

    static Rect ZERO;
};

RENDERER_END
