/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include <functional>
#include "MiddlewareMacro.h"
#include "base/Ref.h"
#include "math/Geometry.h"
#include "math/Vec3.h"

MIDDLEWARE_BEGIN

struct Color4B {
    Color4B(uint32_t _r, uint32_t _g, uint32_t _b, uint32_t _a);
    Color4B();
    bool     operator==(const Color4B &right) const;
    bool     operator!=(const Color4B &right) const;
    Color4B &operator=(const Color4B &right);

    uint32_t r = 0;
    uint32_t g = 0;
    uint32_t b = 0;
    uint32_t a = 0;

    static const Color4B WHITE;
};

struct Color4F {
    Color4F(float _r, float _g, float _b, float _a);
    Color4F();
    bool     operator==(const Color4F &right) const;
    bool     operator!=(const Color4F &right) const;
    Color4F &operator=(const Color4B &right);

    float r = 0.0f;
    float g = 0.0f;
    float b = 0.0f;
    float a = 0.0f;

    static const Color4F WHITE;
};

/**
 *  Texture format with u v.
 */
struct Tex2F {
    float u;
    float v;
};

/**
 *  Vertex Format with x y z u v color.
 */
struct V2F_T2F_C4F {
    // vertices (3F)
    cc::Vec3 vertex;

    // tex coords (2F)
    Tex2F texCoord;

    // colors (4F)
    Color4F color;
};

/**
 *  Vertex Format with x y u v color1 color2.
 */
struct V2F_T2F_C4F_C4F {
    // vertices (3F)
    cc::Vec3 vertex;

    // tex coords (2F)
    Tex2F texCoord;

    // colors (4F)
    Color4F color;

    // colors (4F)
    Color4F color2;
};

struct Triangles {
    /**Vertex data pointer.*/
    V2F_T2F_C4F *verts = nullptr;
    /**Index data pointer.*/
    unsigned short *indices = nullptr;
    /**The number of vertices.*/
    int vertCount = 0;
    /**The number of indices.*/
    int indexCount = 0;
};

struct TwoColorTriangles {
    /**Vertex data pointer.*/
    V2F_T2F_C4F_C4F *verts = nullptr;
    /**Index data pointer.*/
    unsigned short *indices = nullptr;
    /**The number of vertices.*/
    int vertCount = 0;
    /**The number of indices.*/
    int indexCount = 0;
};

///////////////////////////////////////////////////////////////////////
// adapt to editor texture,this is a texture delegate,not real texture
///////////////////////////////////////////////////////////////////////
class Texture2D : public cc::Ref {
public:
    Texture2D();
    virtual ~Texture2D();
    /**
     Extension to set the Min / Mag filter
     */
    typedef struct _TexParams {
        uint32_t minFilter;
        uint32_t magFilter;
        uint32_t wrapS;
        uint32_t wrapT;
    } TexParams;

    /**
     * set texture param callback
     */
    typedef std::function<void(int32_t, uint32_t, uint32_t, uint32_t, uint32_t)> texParamCallback;

    /** Sets the min filter, mag filter, wrap s and wrap t texture parameters.
     If the texture size is NPOT (non power of 2), then in can only use GL_CLAMP_TO_EDGE in GL_TEXTURE_WRAP_{S,T}.
         
     @warning Calling this method could allocate additional texture memory.
         
     @since v0.8
     * @code
     * When this function bound into js or lua,the input parameter will be changed
     * In js: var setBlendFunc(var arg1, var arg2, var arg3, var arg4)
     * In lua: local setBlendFunc(local arg1, local arg2, local arg3, local arg4)
     * @endcode
     */
    void setTexParameters(const TexParams &texParams);

    /** Gets the width of the texture in pixels. */
    int getPixelsWide() const;

    /** Gets the height of the texture in pixels. */
    int getPixelsHigh() const;

    /** Gets real texture index */
    int getRealTextureIndex() const;

    /** Sets the width of the texture in pixels. */
    void setPixelsWide(int wide);

    /** Sets the height of the texture in pixels. */
    void setPixelsHigh(int high);

    /** Sets real texture index.*/
    void setRealTextureIndex(int textureIndex);

    /** Sets texture param callback*/
    void setTexParamCallback(const texParamCallback &callback);

private:
    /** width in pixels */
    int _pixelsWide = 0;

    /** height in pixels */
    int _pixelsHigh = 0;

    /** js texture */
    int _realTextureIndex = 0;

    texParamCallback _texParamCallback = nullptr;
};

///////////////////////////////////////////////////////////////////////
// adapt to editor sprite frame
///////////////////////////////////////////////////////////////////////
class SpriteFrame : public cc::Ref {
public:
    static SpriteFrame *createWithTexture(Texture2D *pobTexture, const cc::Rect &rect);
    static SpriteFrame *createWithTexture(Texture2D *pobTexture, const cc::Rect &rect, bool rotated, const cc::Vec2 &offset, const cc::Size &originalSize);

    SpriteFrame();
    virtual ~SpriteFrame();

    /** Initializes a SpriteFrame with a texture, rect in points.
     It is assumed that the frame was not trimmed.
        */
    bool initWithTexture(Texture2D *pobTexture, const cc::Rect &rect);

    /** Initializes a SpriteFrame with a texture, rect, rotated, offset and originalSize in pixels.
     The originalSize is the size in points of the frame before being trimmed.
        */
    bool initWithTexture(Texture2D *pobTexture, const cc::Rect &rect, bool rotated, const cc::Vec2 &offset, const cc::Size &originalSize);

    /** Get texture of the frame.
     *
     * @return The texture of the sprite frame.
     */
    Texture2D *getTexture();
    /** Set texture of the frame, the texture is retained.
     *
     * @param pobTexture The texture of the sprite frame.
     */
    void setTexture(Texture2D *pobTexture);

protected:
    cc::Vec2   _anchorPoint;
    cc::Rect   _rectInPixels;
    bool       _rotated = false;
    cc::Vec2   _offsetInPixels;
    cc::Size   _originalSizeInPixels;
    Texture2D *_texture = nullptr;
};
MIDDLEWARE_END
