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

#include "../../Macro.h"
#include "AssemblerBase.hpp"
#include "../MeshBuffer.hpp"
#include "math/CCMath.h"
#include "../../renderer/Effect.h"
#include "RenderDataList.hpp"

namespace se {
    class Object;
    class HandleObject;
}

RENDERER_BEGIN

class NodeProxy;
class ModelBatcher;

/**
 * @addtogroup scene
 * @{
 */

/**
 *  @brief The render handle is a system handle which occupies rendering datas.\n
 *  It's kind of a cpp delegate for js RenderComponent and should be created and updated by js RenderComponent.\n
 *  It update local vertex data to world vertex data if necessary, commit all render datas to the shared vertex and index buffer.\n
 *  JS API: renderer.RenderHandle
 @code
 // RenderHandle will be automatically created when create a render component
 let node = new cc.Node();
 let sprite = node.addComponent(cc.Sprite);
 sprite._renderHandle;
 
 // You can also create a RenderHandle by yourself, but you will also need to bind a render component manually
 let renderHandle = new renderer.RenderHandle();
 renderHandle.bind(renderComponent);
 @endcode
 */
class Assembler : public AssemblerBase
{
public:
    
    struct IARenderData {
    public:
        IARenderData()
        {
            
        }
        
        IARenderData(const IARenderData& o)
        {
            meshIndex = o.meshIndex;
            verticesStart = o.verticesStart;
            verticesCount = o.verticesCount;
            indicesStart = o.indicesStart;
            indicesCount = o.indicesCount;
            setEffect(o.getEffect());
        }
        
        ~IARenderData()
        {
            CC_SAFE_RELEASE(_effect);
        }
        
        void setEffect(Effect* effect)
        {
            if (effect == _effect) return;
            CC_SAFE_RELEASE(_effect);
            _effect = effect;
            CC_SAFE_RETAIN(_effect);
        }
        
        Effect* getEffect() const
        {
            return _effect;
        }
    private:
        Effect* _effect = nullptr;
    public:
        int meshIndex = -1;
        int verticesStart = 0;
        int verticesCount = -1;
        int indicesStart = 0;
        int indicesCount = -1;
    };
    
    Assembler();
    virtual ~Assembler();
    /*
     *  @brief Commit the current render handle to ModelBatcher
     */
    virtual void handle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) override;
    /*
     *  @brief Do nothing
     */
    virtual void postHandle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) override {}
    /*
     *  @brief before fill buffers handle
     */
    virtual void beforeFillBuffers(std::size_t index) {}
    /*
     *  @brief Fills render data in given index to the MeshBuffer
     *  @param[in] buffer The shared mesh buffer
     *  @param[in] index The index of render data to be updated
     *  @param[in] worldMat The world transform matrix
     */
    virtual void fillBuffers(MeshBuffer* buffer, std::size_t index, const Mat4& worldMat);
    
    /**
     *  @brief Sets IArenderDataList
     */
    virtual void setRenderDataList(RenderDataList* datas);
    
    /**
     *  @brief Gets the vertex format.
     */
    VertexFormat* getVertexFormat() const { return _vfmt; };
    /**
     *  @brief Sets the vertex format.
     */
    virtual void setVertexFormat(VertexFormat* vfmt);
    
    /*
     *  @brief Update local render buffer opacity
     *  @param[in] index The index of render data to be updated
     *  @param[in] opacity Inherit opacity
     */
    virtual void updateOpacity(std::size_t index, uint8_t opacity);
    
    /**
     *  @brief Enables assembler.
     */
    virtual void enable() override;
    
    /**
     *  @brief Enable opacity always dirty, it will update per frame.
     */
    void enableOpacityAlwaysDirty() { _opacityAlwaysDirty = true; }
    
    /**
     *  @brief Is opacity always dirty.
     *  @return _opacityAlwaysDirty
     */
    bool isOpacityAlwaysDirty() { return _opacityAlwaysDirty; }
    
    /**
     *  @brief Enable ignore world matrix.
     */
    void ignoreWorldMatrix() { _ignoreWorldMatrix = true; }
    
    /**
     *  @brief Is ignore world matrix.
     *  @return _opacityAlwaysDirty
     */
    bool isIgnoreWorldMatrix() { return _ignoreWorldMatrix; }
    
    /**
     *  @brief Updates mesh index
     */
    void updateMeshIndex(std::size_t iaIndex, int meshIndex);
    /**
     *  @brief Updates indices range
     */
    void updateIndicesRange(std::size_t iaIndex, int start, int count);
    
    /**
     *  @brief Updates vertices range
     */
    void updateVerticesRange(std::size_t iaIndex, int start, int count);
    
    /**
     *  @brief Update the material for the given index.
     *  @param[in] iaIndex Render data index.
     *  @param[in] effect Effect pointer.
     */
    virtual void updateEffect(std::size_t iaIndex, Effect* effect);
    
    /**
     *  @brief Resets ia data.
     */
    virtual void reset() override;
    
    /**
     *  @brief Gets the material for the given index.
     *  @param[in] index Render data index.
     *  @return Effect pointer.
     */
    inline Effect* getEffect(std::size_t index) const
    {
        if (index >= _iaDatas.size())
        {
            return nullptr;
        }
        return _iaDatas[index].getEffect();
    }
    
    /**
     *  @brief Gets Effect count.
     *  @return Count.
     */
    inline std::size_t getIACount() const
    {
        return _iaDatas.size();
    }
protected:
    RenderDataList* _datas = nullptr;
    std::vector<IARenderData> _iaDatas;
    
    uint32_t _bytesPerVertex = 0;
    size_t _posOffset = 0;
    size_t _alphaOffset = 0;
    VertexFormat* _vfmt = nullptr;
    const VertexFormat::Element* _vfPos = nullptr;
    const VertexFormat::Element* _vfColor = nullptr;
    
    bool _ignoreWorldMatrix = false;
    bool _opacityAlwaysDirty = false;
};

// end of scene group
/// @}

RENDERER_END
