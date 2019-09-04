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

#include <stdint.h>
#include <string>
#include <vector>
#include <unordered_map>
#include "base/ccTypes.h"
#include "base/CCRef.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "math/Vec4.h"
#include "math/Mat4.h"
#include "../Macro.h"
#include "../Types.h"
#include "State.h"

RENDERER_BEGIN

class FrameBuffer;
class VertexBuffer;
class IndexBuffer;
class Program;
class Texture;

/**
 * @addtogroup gfx
 * @{
 */

/**
 * DeviceGraphics is a direct abstraction for OpenGL APIs.
 * This fundamental class takes responsibility for all GL states management and GL call invocations.
 */
class DeviceGraphics final : public Ref
{
public:
    struct Capacity
    {
        int maxVextexTextures;
        int maxFragUniforms;
        int maxTextureUnits;
        int maxVertexAttributes;
        int maxDrawBuffers;
        int maxColorAttatchments;
    };
    
    struct Uniform
    {
        Uniform(const void* v, size_t bytes, UniformElementType elementType_);
        Uniform(Uniform&& h);
        Uniform();
        ~Uniform();
        
        Uniform& operator=(Uniform&& h);
        
        void setValue(const void* v, size_t bytes);
        
        void* value = nullptr;
        size_t bytes = 0;
        
        bool dirty;
        UniformElementType elementType;
        
    private:
        // Disable copy operator
        Uniform& operator=(const Uniform& o);
    };
    
    /**
     * Returns a shared instance of the director.
     */
    static DeviceGraphics* getInstance();
    
    /**
     * Checks whether a gl extension is supported
     */
    bool ext(const std::string& extension) const;

    /**
     * Sets the target FrameBuffer
     */
    void setFrameBuffer(const FrameBuffer* fb);
    /**
     * Sets viewport with x, y, width and height
     */
    void setViewport(int x, int y, int w, int h);
    /**
     * Sets scissor clipping area
     */
    void setScissor(int x, int y, int w, int h);

    /**
     * Clear with flags, including color, depth and stencil,
     * you should also specify the color, depth and stencil value to use.
     */
    void clear(uint8_t flags, Color4F *color, double depth, int32_t stencil);

    /**
     * Enables blend in GL state
     */
    void enableBlend();
    /**
     * Enables depth test in GL state
     */
    void enableDepthTest();
    /**
     * Enables depth write in GL state
     */
    void enableDepthWrite();
    /**
     * Enables stencil test in GL state
     */
    void enableStencilTest();

    /**
     * Sets both the front and back function and reference value for stencil testing
     */
    void setStencilFunc(StencilFunc func, int ref, unsigned int mask);
    /**
     * Sets the front function and reference value for stencil testing
     */
    void setStencilFuncFront(StencilFunc func, int ref, unsigned int mask);
    /**
     * Sets the back function and reference value for stencil testing
     */
    void setStencilFuncBack(StencilFunc func, int ref, unsigned int mask);

    /**
     * Sets both the front and back-facing stencil test actions
     */
    void setStencilOp(StencilOp failOp, StencilOp zFailOp, StencilOp zPassOp, unsigned int writeMask);
    /**
     * Sets the front stencil test actions
     */
    void setStencilOpFront(StencilOp failOp, StencilOp zFailOp, StencilOp zPassOp, unsigned int writeMask);
    /**
     * Sets the back stencil test actions
     */
    void setStencilOpBack(StencilOp failOp, StencilOp zFailOp, StencilOp zPassOp, unsigned int writeMask);

    /**
     * Specifies the depth comparison function, which sets the conditions under which the pixel will be drawn.
     */
    void setDepthFunc(DepthFunc func);

    /**
     * Sets the source and destination blending factors with all channel packed into a 32bit unsigned int
     */
    void setBlendColor(uint32_t rgba);
    /**
     * Sets the source and destination blending factors with separate color channel values
     */
    void setBlendColor(uint8_t r, uint8_t g, uint8_t b, uint8_t a);
    /**
     * Sets which function is used for blending pixel arithmetic
     */
    void setBlendFunc(BlendFactor src, BlendFactor dst);
    /**
     * Sets which function is used for blending pixel arithmetic for RGB and alpha components separately
     */
    void setBlendFuncSeparate(BlendFactor srcRGB, BlendFactor dstRGB, BlendFactor srcAlpha, BlendFactor dstAlpha);
    /**
     * Sets both the RGB blend equation and alpha blend equation to a single equation.
     */
    void setBlendEquation(BlendOp mode);
    /**
     * Sets the RGB blend equation and alpha blend equation separately.
     */
    void setBlendEquationSeparate(BlendOp modeRGB, BlendOp modeAlpha);

    /**
     * Specifies whether or not front and/or back-facing polygons can be culled.
     */
    void setCullMode(CullMode mode);

    /**
     * Sets the vertex buffer
     */
    void setVertexBuffer(int stream, VertexBuffer* buffer, int start = 0);
    /**
     * Sets the index buffer
     */
    void setIndexBuffer(IndexBuffer *buffer);
    /**
     * Sets a linked program
     */
    void setProgram(Program *program);
    /**
     * Sets a texture into a GL texture slot then set to the specified uniform
     */
    void setTexture(size_t hashName, Texture* texture, int slot);
    /**
     * Sets textures array into GL texture slots then set to the specified uniform
     */
    void setTextureArray(size_t hashName, const std::vector<Texture*>& textures, const std::vector<int>& slots);

    /**
     * Sets a integer to the specified uniform
     */
    void setUniformi(size_t hashName, int i1);
    /**
     * Sets two integers to the specified uniform
     */
    void setUniformi(size_t hashName, int i1, int i2);
    /**
     * Sets three integers to the specified uniform
     */
    void setUniformi(size_t hashName, int i1, int i2, int i3);
    /**
     * Sets four integers to the specified uniform
     */
    void setUniformi(size_t hashName, int i1, int i2, int i3, int i4);
    /**
     * Sets a vector of integers to the specified uniform
     */
    void setUniformiv(size_t hashName, size_t count, const int* value);
    /**
     * Sets a float to the specified uniform
     */
    void setUniformf(size_t hashName, float f1);
    /**
     * Sets two floats to the specified uniform
     */
    void setUniformf(size_t hashName, float f1, float f2);
    /**
     * Sets three floats to the specified uniform
     */
    void setUniformf(size_t hashName, float f1, float f2, float f3);
    /**
     * Sets four floats to the specified uniform
     */
    void setUniformf(size_t hashName, float f1, float f2, float f3, float f4);
    /**
     * Sets a vector of floats to the specified uniform
     */
    void setUniformfv(size_t hashName, size_t count, const float* value);
    /**
     * Sets a Vec2 to the specified uniform
     */
    void setUniformVec2(size_t hashName, const cocos2d::Vec2& value);
    /**
     * Sets a Vec3 to the specified uniform
     */
    void setUniformVec3(size_t hashName, const cocos2d::Vec3& value);
    /**
     * Sets a Vec4 to the specified uniform
     */
    void setUniformVec4(size_t hashName, const cocos2d::Vec4& value);
    /**
     * Sets a 2x2 matrix to the specified uniform
     */
    void setUniformMat2(size_t hashName, float* value);
    /**
     * Sets a 3x3 matrix to the specified uniform
     */
    void setUniformMat3(size_t hashName, float* value);
    /**
     * Sets a 4x4 matrix specified by float pointer to the given uniform
     */
    void setUniformMat4(size_t hashName, float* value);
    /**
     * Sets a Mat4 object to the given uniform
     */
    void setUniformMat4(size_t hashName, const cocos2d::Mat4& value);
    /**
     * Sets data specified by data pointer, type and bytes to the given uniform
     */
    void setUniform(size_t hashName, const void* v, size_t bytes, UniformElementType elementType);

    /**
     * Sets the primitive type for draw calls
     */
    void setPrimitiveType(PrimitiveType type);

    /**
     * Draw elements using the current gl states
     */
    void draw(size_t base, GLsizei count);

    /**
     * Resets the draw call counter to 0
     */
    void resetDrawCalls() { _drawCalls = 0; };
    /**
     * Gets current draw call counts
     */
    uint32_t getDrawCalls() const { return _drawCalls; };
    
    inline const Capacity& getCapacity() const { return _caps; }
    
private:
    DeviceGraphics();
    ~DeviceGraphics();
    CC_DISALLOW_COPY_ASSIGN_AND_MOVE(DeviceGraphics);
    
    inline void initStates();
    inline void initCaps();
    void restoreTexture(uint32_t index);
    void restoreIndexBuffer();

    inline void commitBlendStates();
    inline void commitDepthStates();
    inline void commitStencilStates();
    inline void commitCullMode();
    inline void commitVertexBuffer();
    inline void commitTextures();

    int _vx;
    int _vy;
    int _vw;
    int _vh;
    
    int _sx;
    int _sy;
    int _sw;
    int _sh;
    
    uint32_t _drawCalls = 0;

    int _defaultFbo;
    
    Capacity _caps;
    char* _glExtensions;
    
    FrameBuffer *_frameBuffer;
    std::vector<int> _enabledAtrributes;
    std::vector<int> _newAttributes;
    std::unordered_map<size_t, Uniform> _uniforms;
    
    State* _nextState;
    State* _currentState;
    
    friend class IndexBuffer;
    friend class Texture2D;
};

// end of gfx group
/// @}

RENDERER_END
