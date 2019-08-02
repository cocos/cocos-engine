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

#include "math/Vec2.h"
#include "base/ccTypes.h"
#include <functional>
#include "MiddlewareMacro.h"
#include "renderer/renderer/Effect.h"

MIDDLEWARE_BEGIN
/**
 *  Texture format with u v.
 */
struct Tex2F
{
    GLfloat u;
    GLfloat v;
};

/**
 *  Vertex Format with x y u v color.
 */
struct V2F_T2F_C4B
{
    // vertices (2F)
    cocos2d::Vec2       vertex;             // 8 bytes
    
    // tex coords (2F)
    Tex2F               texCoord;                 // 8 bytes
    
    // colors (4B)
    cocos2d::Color4B    color;           // 4 bytes
};

/**
 *  Vertex Format with x y u v color1 color2.
 */
struct V2F_T2F_C4B_C4B
{
    // vertices (2F)
    cocos2d::Vec2       vertex;             // 8 bytes
    
    // tex coords (2F)
    Tex2F               texCoord;                 // 8 bytes
    
    // colors (4B)
    cocos2d::Color4B    color;           // 4 bytes
    
    // colors (4B)
    cocos2d::Color4B    color2;          // 4 bytes
};

struct Triangles
{
    /**Vertex data pointer.*/
    V2F_T2F_C4B* verts = nullptr;
    /**Index data pointer.*/
    unsigned short* indices = nullptr;
    /**The number of vertices.*/
    int vertCount = 0;
    /**The number of indices.*/
    int indexCount = 0;
};

struct TwoColorTriangles
{
    /**Vertex data pointer.*/
    V2F_T2F_C4B_C4B* verts = nullptr;
    /**Index data pointer.*/
    unsigned short* indices = nullptr;
    /**The number of vertices.*/
    int vertCount = 0;
    /**The number of indices.*/
    int indexCount = 0;
};

///////////////////////////////////////////////////////////////////////
// adapt to editor texture,this is a texture delegate,not real texture
///////////////////////////////////////////////////////////////////////
class Texture2D : public cocos2d::Ref
{
public:
    Texture2D();
    virtual ~Texture2D();
    /**
     Extension to set the Min / Mag filter
     */
    typedef struct _TexParams
    {
        GLuint    minFilter;
        GLuint    magFilter;
        GLuint    wrapS;
        GLuint    wrapT;
    }TexParams;
    
    /**
     * set texture param callback
     */
    typedef std::function<void(int,GLuint,GLuint,GLuint,GLuint)> texParamCallback;
    
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
    void setTexParameters(const TexParams& texParams);
    
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
    void setTexParamCallback(const texParamCallback& callback);
    
    /** Sets texture native ptr*/
    void setNativeTexture(cocos2d::renderer::Texture* texture);
    
    /** Gets texture native ptr*/
    cocos2d::renderer::Texture* getNativeTexture() const;
private:
    
    /** width in pixels */
    int             _pixelsWide = 0;
    
    /** height in pixels */
    int             _pixelsHigh = 0;
    
    /** js texture */
    int             _realTextureIndex = 0;
    
    texParamCallback _texParamCallback = nullptr;
        
    cocos2d::renderer::Texture* _texture = nullptr;
};

///////////////////////////////////////////////////////////////////////
// adapt to editor sprite frame
///////////////////////////////////////////////////////////////////////
class SpriteFrame : public cocos2d::Ref
{
public:
    static SpriteFrame* createWithTexture(Texture2D* pobTexture, const cocos2d::Rect& rect);
    static SpriteFrame* createWithTexture(Texture2D* pobTexture, const cocos2d::Rect& rect, bool rotated, const cocos2d::Vec2& offset, const cocos2d::Size& originalSize);
    
    SpriteFrame();
    virtual ~SpriteFrame();
    
    /** Initializes a SpriteFrame with a texture, rect in points.
     It is assumed that the frame was not trimmed.
        */
    bool initWithTexture(Texture2D* pobTexture, const cocos2d::Rect& rect);
    
    /** Initializes a SpriteFrame with a texture, rect, rotated, offset and originalSize in pixels.
     The originalSize is the size in points of the frame before being trimmed.
        */
    bool initWithTexture(Texture2D* pobTexture, const cocos2d::Rect& rect, bool rotated, const cocos2d::Vec2& offset, const cocos2d::Size& originalSize);
    
    /** Get texture of the frame.
     *
     * @return The texture of the sprite frame.
     */
    Texture2D* getTexture();
    /** Set texture of the frame, the texture is retained.
     *
     * @param pobTexture The texture of the sprite frame.
     */
    void setTexture(Texture2D* pobTexture);
protected:
    cocos2d::Vec2   _anchorPoint;
    cocos2d::Rect   _rectInPixels;
    bool            _rotated = false;
    cocos2d::Vec2   _offsetInPixels;
    cocos2d::Size   _originalSizeInPixels;
    Texture2D*      _texture = nullptr;
};
MIDDLEWARE_END
