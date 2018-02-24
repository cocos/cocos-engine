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
    
    static DeviceGraphics* getInstance();
    
    void setScaleFactor(float value);
    
    inline const Capacity& getCapacity() const { return _caps; }
    bool supportGLExtension(const std::string& extension) const;

    void setFrameBuffer(const FrameBuffer* fb);
    void setViewport(int x, int y, int w, int h);
    void setScissor(int x, int y, int w, int h);
    
    void clear(uint8_t flags, Color4F *color, double depth, int32_t stencil);
    
    void enableBlend();
    void enableDepthTest();
    void enableDepthWrite();
    void enableStencilTest();
    
    void setStencilFunc(StencilFunc func, int ref, unsigned int mask);
    void setStencilFuncFront(StencilFunc func, int ref, unsigned int mask);
    void setStencilFuncBack(StencilFunc func, int ref, unsigned int mask);
    
    void setStencilOp(StencilOp failOp, StencilOp zFailOp, StencilOp zPassOp, unsigned int writeMask);
    void setStencilOpFront(StencilOp failOp, StencilOp zFailOp, StencilOp zPassOp, unsigned int writeMask);
    void setStencilOpBack(StencilOp failOp, StencilOp zFailOp, StencilOp zPassOp, unsigned int writeMask);
    
    void setDepthFunc(DepthFunc func);
    
    void setBlendColor(uint32_t rgba);
    void setBlendColor(uint8_t r, uint8_t g, uint8_t b, uint8_t a);
    void setBlendFunc(BlendFactor src, BlendFactor dst);
    void setBlendFuncSeparate(BlendFactor srcRGB, BlendFactor dstRGB, BlendFactor srcAlpha, BlendFactor dstAlpha);
    void setBlendEquation(BlendOp mode);
    void setBlendEquationSeparate(BlendOp modeRGB, BlendOp modeAlpha);
    
    void setCullMode(CullMode mode);
    
    void setVertexBuffer(int stream, VertexBuffer* buffer, int start = 0);
    void setIndexBuffer(IndexBuffer *buffer);
    void setProgram(Program *program);
    void setTexture(const std::string& name, Texture* texture, int slot);
    void setTextureArray(const std::string& name, const std::vector<Texture*>& textures, const std::vector<int>& slots);
    
    void setUniformi(const std::string& name, int i1);
    void setUniformi(const std::string& name, int i1, int i2);
    void setUniformi(const std::string& name, int i1, int i2, int i3);
    void setUniformi(const std::string& name, int i1, int i2, int i3, int i4);
    void setUniformiv(const std::string& name, size_t count, const int* value);
    void setUniformf(const std::string& name, float f1);
    void setUniformf(const std::string& name, float f1, float f2);
    void setUniformf(const std::string& name, float f1, float f2, float f3);
    void setUniformf(const std::string& name, float f1, float f2, float f3, float f4);
    void setUniformfv(const std::string& name, size_t count, const float* value);
    void setUniformVec2(const std::string& name, const cocos2d::Vec2& value);
    void setUniformVec3(const std::string& name, const cocos2d::Vec3& value);
    void setUniformVec4(const std::string& name, const cocos2d::Vec4& value);
    void setUniformMat2(const std::string& name, float* value);
    void setUniformMat3(const std::string& name, float* value);
    void setUniformMat4(const std::string& name, float* value);
    void setUniformMat4(const std::string& name, const cocos2d::Mat4& value);
    void setUniform(const std::string& name, const void* v, size_t bytes, UniformElementType elementType);

    void setPrimitiveType(PrimitiveType type);
    
    void draw(size_t base, GLsizei count);
    
private:
    
    struct Uniform
    {
        Uniform(const void* v, size_t bytes, UniformElementType elementType_);
        Uniform(Uniform&& h);
        Uniform();
        ~Uniform();

        Uniform& operator=(Uniform&& h);

        void setValue(const void* v, size_t bytes);

        void* value;
        bool dirty;
        UniformElementType elementType;
    private:
        // Disable copy operator
        Uniform& operator=(const Uniform& o);
    };
    
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
    
    int _scaleFactor = 1.f;
    
    int _defaultFbo;
    
    Capacity _caps;
    char* _glExtensions;
    
    FrameBuffer *_frameBuffer;
    std::vector<int> _enabledAtrributes;
    std::vector<int> _newAttributes;
    std::unordered_map<std::string, Uniform> _uniforms;
    
    State _nextState;
    State _currentState;
    
    friend class IndexBuffer;
    friend class Texture2D;
};

RENDERER_END
