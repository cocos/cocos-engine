/****************************************************************************
 LICENSING AGREEMENT
 
 Xiamen Yaji Software Co., Ltd., (the “Licensor”) grants the user (the “Licensee”) non-exclusive and non-transferable rights to use the software according to the following conditions:
 a.  The Licensee shall pay royalties to the Licensor, and the amount of those royalties and the payment method are subject to separate negotiations between the parties.
 b.  The software is licensed for use rather than sold, and the Licensor reserves all rights over the software that are not expressly granted (whether by implication, reservation or prohibition).
 c.  The open source codes contained in the software are subject to the MIT Open Source Licensing Agreement (see the attached for the details);
 d.  The Licensee acknowledges and consents to the possibility that errors may occur during the operation of the software for one or more technical reasons, and the Licensee shall take precautions and prepare remedies for such events. In such circumstance, the Licensor shall provide software patches or updates according to the agreement between the two parties. The Licensor will not assume any liability beyond the explicit wording of this Licensing Agreement.
 e.  Where the Licensor must assume liability for the software according to relevant laws, the Licensor’s entire liability is limited to the annual royalty payable by the Licensee.
 f.  The Licensor owns the portions listed in the root directory and subdirectory (if any) in the software and enjoys the intellectual property rights over those portions. As for the portions owned by the Licensor, the Licensee shall not:
 - i. Bypass or avoid any relevant technical protection measures in the products or services;
 - ii. Release the source codes to any other parties;
 - iii. Disassemble, decompile, decipher, attack, emulate, exploit or reverse-engineer these portion of code;
 - iv. Apply it to any third-party products or services without Licensor’s permission;
 - v. Publish, copy, rent, lease, sell, export, import, distribute or lend any products containing these portions of code;
 - vi. Allow others to use any services relevant to the technology of these codes;
 - vii. Conduct any other act beyond the scope of this Licensing Agreement.
 g.  This Licensing Agreement terminates immediately if the Licensee breaches this Agreement. The Licensor may claim compensation from the Licensee where the Licensee’s breach causes any damage to the Licensor.
 h.  The laws of the People's Republic of China apply to this Licensing Agreement.
 i.  This Agreement is made in both Chinese and English, and the Chinese version shall prevail the event of conflict.
 ****************************************************************************/

#pragma once

#include "../Macro.h"
#include "SystemHandle.hpp"
#include "MeshBuffer.hpp"
#include "math/CCMath.h"
#include "../renderer/Effect.h"

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
class RenderHandle : public SystemHandle
{
public:
    RenderHandle();
    virtual ~RenderHandle();
    /*
     *  @brief Commit the current render handle to ModelBatcher
     */
    virtual void handle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) override;
    /*
     *  @brief Do nothing
     */
    virtual void postHandle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) override;
    /*
     *  @brief Fills render data in given index to the MeshBuffer
     *  @param[in] buffer The shared mesh buffer
     *  @param[in] index The index of render data to be updated
     *  @param[in] worldMat The world transform matrix
     */
    virtual void fillBuffers(MeshBuffer* buffer, int index, const Mat4& worldMat);
    /*
     *  @brief Update local render buffer opacity
     *  @param[in] index The index of render data to be updated
     *  @param[in] opacity Inherit opacity
     */
    virtual void updateOpacity(int index, uint8_t opacity);

    /**
     *  @brief Gets rendering material for the given index.
     *  @param[in] index The material index.
     *  @return The material pointer.
     */
    Effect* getEffect(uint32_t index);
    
    /**
     *  @brief Gets the count of render datas
     *  @return Count.
     */
    uint32_t getMeshCount() const { return (uint32_t)_datas.size(); };
    /**
     *  @brief Sets the count of render datas
     *  @param[in] count
     */
    void setMeshCount(uint32_t count);
    /**
     *  @brief Update the mesh data for the given index.
     *  @param[in] index Render data index.
     *  @param[in] vertices Vertex data.
     *  @param[in] indices Index data.
     */
    void updateNativeMesh(uint32_t index, se::Object* vertices, se::Object* indices);
    /**
     *  @brief Update the material for the given index.
     *  @param[in] index Render data index.
     *  @param[in] effect Effect pointer.
     */
    void updateNativeEffect(uint32_t index, Effect* effect);
    /**
     *  @brief Gets whether the current handle should use model matrix uniform during rendering
     */
    bool getUseModel() const { return _useModel; };
    /**
     *  @brief Sets whether the current handle should use model matrix uniform during rendering
     */
    void setUseModel(bool useModel) { _useModel = useModel; };
    
    /**
     *  @brief Gets the vertex format.
     */
    VertexFormat* getVertexFormat() const { return _vfmt; };
    /**
     *  @brief Sets the vertex format.
     */
    void setVertexFormat(VertexFormat* vfmt);
    
    void enable();
    void disable();
    bool enabled() const { return _enabled; };
protected:
    struct RenderData {
        RenderData ()
        : vBytes(0)
        , iBytes(0)
        , effect(nullptr)
        , jsVertices(nullptr)
        , jsIndices(nullptr)
        {
            
        }
        ~RenderData ();
        unsigned long vBytes;
        unsigned long iBytes;
        Effect* effect;
        uint8_t* vertices;
        uint8_t* indices;
        se::Object* jsVertices;
        se::Object* jsIndices;
    };
    
protected:
    bool _enabled;
    bool _useModel;
    uint32_t _bytesPerVertex;
    size_t _posOffset;
    size_t _alphaOffset;
    VertexFormat* _vfmt;
    const VertexFormat::Element* _vfPos;
    const VertexFormat::Element* _vfColor;
    std::vector<RenderData> _datas;
};

// end of scene group
/// @}

RENDERER_END
