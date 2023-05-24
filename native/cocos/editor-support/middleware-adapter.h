/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include <functional>
#include "MiddlewareMacro.h"
#include "base/RefCounted.h"
#include "math/Geometry.h"
#include "math/Vec3.h"

MIDDLEWARE_BEGIN

struct Color4B {
    Color4B(uint8_t r, uint8_t g, uint8_t b, uint8_t a);
    Color4B();
    bool operator==(const Color4B &right) const;
    bool operator!=(const Color4B &right) const;
    Color4B &operator=(const Color4B &right);

    uint8_t r = 0;
    uint8_t g = 0;
    uint8_t b = 0;
    uint8_t a = 0;

    static const Color4B WHITE;
};

struct Color4F {
    Color4F(float r, float g, float b, float a);
    Color4F();
    bool operator==(const Color4F &right) const;
    bool operator!=(const Color4F &right) const;
    Color4F &operator=(const Color4B &right);

    float r = 0.0F;
    float g = 0.0F;
    float b = 0.0F;
    float a = 0.0F;

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
struct V3F_T2F_C4B { //NOLINT
    // vertices (3F)
    cc::Vec3 vertex;

    // tex coords (2F)
    Tex2F texCoord;

    // colors (4F)
    Color4B color;
};

/**
 *  Vertex Format with x y u v color1 color2.
 */
struct V3F_T2F_C4B_C4B { // NOLINT
    // vertices (3F)
    cc::Vec3 vertex;

    // tex coords (2F)
    Tex2F texCoord;

    // colors (4F)
    Color4B color;

    // colors (4F)
    Color4B color2;
};

struct Triangles {
    /**Vertex data pointer.*/
    V3F_T2F_C4B *verts = nullptr;
    /**Index data pointer.*/
    unsigned short *indices = nullptr; // NOLINT
    /**The number of vertices.*/
    int vertCount = 0;
    /**The number of indices.*/
    int indexCount = 0;
};

struct TwoColorTriangles {
    /**Vertex data pointer.*/
    V3F_T2F_C4B_C4B *verts = nullptr;
    /**Index data pointer.*/
    unsigned short *indices = nullptr; //NOLINT
    /**The number of vertices.*/
    int vertCount = 0;
    /**The number of indices.*/
    int indexCount = 0;
};

///////////////////////////////////////////////////////////////////////
// adapt to editor texture,this is a texture delegate,not real texture
///////////////////////////////////////////////////////////////////////
class Texture2D : public cc::RefCounted {
public:
    Texture2D();
    ~Texture2D() override;
    /**
     Extension to set the Min / Mag filter
     */
    struct TexParams { // NOLINT
        uint32_t minFilter;
        uint32_t magFilter;
        uint32_t wrapS;
        uint32_t wrapT;
    };

    /**
     * set texture param callback
     */
    using texParamCallback = std::function<void(int32_t, uint32_t, uint32_t, uint32_t, uint32_t)>;

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

    void setRealTexture(void *texturePtr);
    void *getRealTexture() const;

private:
    /** width in pixels */
    int _pixelsWide = 0;

    /** height in pixels */
    int _pixelsHigh = 0;

    /** js texture */
    int _realTextureIndex = 0;

    texParamCallback _texParamCallback = nullptr;
    void *_texturePtr = nullptr;
};

///////////////////////////////////////////////////////////////////////
// adapt to editor sprite frame
///////////////////////////////////////////////////////////////////////
class SpriteFrame : public cc::RefCounted {
public:
    static SpriteFrame *createWithTexture(Texture2D *pobTexture, const cc::Rect &rect);
    static SpriteFrame *createWithTexture(Texture2D *pobTexture, const cc::Rect &rect, bool rotated, const cc::Vec2 &offset, const cc::Size &originalSize);

    SpriteFrame();
    ~SpriteFrame() override;

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
    cc::Vec2 _anchorPoint;
    cc::Rect _rectInPixels;
    bool _rotated = false;
    cc::Vec2 _offsetInPixels;
    cc::Size _originalSizeInPixels;
    Texture2D *_texture = nullptr;
};
MIDDLEWARE_END
