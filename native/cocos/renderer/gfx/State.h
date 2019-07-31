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
#include <vector>
#include "../Macro.h"
#include "../Types.h"

RENDERER_BEGIN

class VertexBuffer;
class IndexBuffer;
class Program;
class Texture;

/**
 * @addtogroup gfx
 * @{
 */

/**
 * State class save the GL states used in one draw call.
 * It will be used to compare between the previous states and the current states, so that we know which GL states should be updated.
 * User shouldn't be using this Class directly. Instead, they should set the states in Pass of material system.
 * @see `Pass`
 */
struct State final
{
    /**
     * Constructor
     */
    State();
    ~State();

    /**
     * Reset all states to default values
     */
    void reset();

    /**
     @name Blend
     @{
     */
    /**
     * Indicates blending enabled or not
     */
    bool blend;
    /**
     * Indicates the RGB blend equation and alpha blend equation settings are separate or not
     */
    bool blendSeparation;
    /**
     * The blending color
     */
    uint32_t blendColor;
    /**
     * The blending equation
     */
    BlendOp blendEq;
    /**
     * The blending equation for alpha channel
     */
    BlendOp blendAlphaEq;
    /**
     * The blending source factor
     */
    BlendFactor blendSrc;
    /**
     * The blending destination factor
     */
    BlendFactor blendDst;
    /**
     * The blending source factor for alpha
     */
    BlendFactor blendSrcAlpha;
    /**
     * The blending destination factor for alpha
     */
    BlendFactor blendDstAlpha;
    /**
     end of Blend
     @}
     */
    
    /**
     @name Depth
     @{
     */
    /**
     * Indicates depth test enabled or not
     */
    bool depthTest;
    /**
     * Indicates depth writing enabled or not
     */
    bool depthWrite;
    /**
     * The depth comparison function
     */
    DepthFunc depthFunc;
    /**
     end of Depth
     @}
     */
    
    /**
     @name Stencil
     @{
     */
    /**
     * Indicates stencil test enabled or not
     */
    bool stencilTest;
    /**
     * Indicates stencil test function for front and back is set separatly or not
     */
    bool stencilSeparation;
    /**
     * The front face function for stencil test
     */
    StencilFunc stencilFuncFront;
    /**
     * The front reference value for stencil test
     */
    int32_t stencilRefFront;
    /**
     * The front mask value to AND with the reference value and store the result into stencil buffer when test is done
     */
    uint32_t stencilMaskFront;
    /**
     * The function to use when the stencil test fails for front face
     */
    StencilOp stencilFailOpFront;
    /**
     * The function to use when the stencil test passes but the depth test fails for front face
     */
    StencilOp stencilZFailOpFront;
    /**
     * The function to use when both the stencil and the depth test pass for front face.
     * Or when the stencil test passes and there is no depth buffer or depth testing is disabled.
     */
    StencilOp stencilZPassOpFront;
    /**
     * The bit mask to enable or disable writing of individual bits in the front stencil planes
     */
    uint32_t stencilWriteMaskFront;
    /**
     * The back face function for stencil test
     */
    StencilFunc stencilFuncBack;
    /**
     * The back reference value for stencil test
     */
    int32_t stencilRefBack;
    /**
     * The back mask value to AND with the reference value and store the result into stencil buffer when test is done
     */
    uint32_t stencilMaskBack;
    /**
     * The function to use when the stencil test fails for back face
     */
    StencilOp stencilFailOpBack;
    /**
     * The function to use when the stencil test passes but the depth test fails for back face
     */
    StencilOp stencilZFailOpBack;
    /**
     * The function to use when both the stencil and the depth test pass for back face.
     * Or when the stencil test passes and there is no depth buffer or depth testing is disabled.
     */
    StencilOp stencilZPassOpBack;
    /**
     * The bit mask to enable or disable writing of individual bits in the back stencil planes
     */
    uint32_t stencilWriteMaskBack;
    /**
     end of Stencil
     @}
     */
    
    /**
     * Specifies whether front-facing or back-facing polygons are candidates for culling.
     */
    CullMode cullMode;
    
    /**
     * Specifies the primitive type for rendering
     */
    PrimitiveType primitiveType;
    
    int32_t maxStream;

    /**
     * Specifies the vertex buffer
     */
    void setVertexBuffer(size_t index, VertexBuffer* vertBuf);
    /**
     * Gets the vertex buffer
     */
    VertexBuffer* getVertexBuffer(size_t index) const;

    /**
     * Specifies the vertex buffer offset
     */
    void setVertexBufferOffset(size_t index, int32_t offset);
    /**
     * Gets the vertex buffer offset
     */
    int32_t getVertexBufferOffset(size_t index) const;

    /**
     * Specifies the index buffer
     */
    void setIndexBuffer(IndexBuffer* indexBuf);
    /**
     * Gets the index buffer
     */
    IndexBuffer* getIndexBuffer() const;

    /**
     * Sets the texture for specific texture unit
     */
    void setTexture(size_t index, Texture* texture);
    /**
     * Gets the specific texture unit
     */
    Texture* getTexture(size_t index) const;
    
    /**
     * Gets all texture units
     */
    const std::vector<Texture*>& getTextureUnits() const { return _textureUnits; }

    /**
     * Sets the program used for rendering
     */
    void setProgram(Program* program);
    /**
     * Gets the program used for rendering
     */
    Program* getProgram() const;

private:
    std::vector<VertexBuffer*> _vertexBuffers;
    std::vector<int32_t> _vertexBufferOffsets;
    IndexBuffer *_indexBuffer = nullptr;
    std::vector<Texture*> _textureUnits;
    Program *_program = nullptr;
};

// end of gfx group
/// @}

RENDERER_END
