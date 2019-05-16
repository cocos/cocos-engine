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

#include <map>

#include "../Macro.h"
#include "RenderHandle.hpp"
#include "CustomRenderHandle.hpp"
#include "MeshBuffer.hpp"
#include "../renderer/Renderer.h"
#include "math/CCMath.h"

RENDERER_BEGIN

class RenderFlow;
class StencilManager;

/**
 * @addtogroup scene
 * @{
 */

/**
 *  @brief ModelBatcher is responsible for transforming node's render handles into final render datas.
 *  It collects render data, batches different render handle together into Models and submits to render Scene.
 */
class ModelBatcher
{
public:
    /**
     *  @brief The constructor.
     */
    ModelBatcher(RenderFlow* flow);
    /**
     *  @brief The destructor.
     */
    ~ModelBatcher();
    /**
     *  @brief Reset all render buffer.
     */
    void reset();
    
    /**
     *  @brief Commit a render handle to the model batcher
     *  @param[in] node The node which owns the render handle
     *  @param[in] handle The render handle contains render datas
     */
    void commit(NodeProxy* node, RenderHandle* handle);
    /**
     *  @brief Commit a custom render handle to the model batcher
     *  @param[in] node The node which owns the render handle
     *  @param[in] handle The custom render handle contains render datas
     */
    void commitIA(NodeProxy* node, CustomRenderHandle* handle);
    
    /**
     *  @brief This method should be invoked before commit any render handles each frame.
     * It notifies the model batcher to get ready for constructing Models
     */
    void startBatch();
    /**
     *  @brief Flush all cached render data into a new Model and add the Model to render Scene.
     */
    void flush();
    /**
     *  @brief Construct a new Model from custom input assembler provided by CustomRenderHandle and add the Model to render Scene.
     */
    void flushIA(InputAssembler* customIA);
    /**
     *  @brief This method should be invoked after committed all render handles each frame.
     */
    void terminateBatch();
    
    /**
     *  @brief Gets a suitable MeshBuffer for the given VertexFormat.
     *  Render datas arranged in different VertexFormat can't share the same buffer.
     *  @param[in] fmt The VertexFormat
     */
    MeshBuffer* getBuffer(VertexFormat* fmt);
    /**
     *  @brief Gets the current MeshBuffer.
     */
    const MeshBuffer* getCurrentBuffer() const { return _buffer; };
    /**
     *  @brief Sets the current MeshBuffer.
     *  @param[in] buffer
     */
    void setCurrentBuffer(MeshBuffer* buffer) { _buffer = buffer; };
    /**
     *  @brief Gets the global RenderFlow pointer.
     */
    RenderFlow* getFlow() const { return _flow; };
    
    void setCurrentEffect(Effect* effect) { _currEffect = effect; };
private:
    int _iaOffset;
    int _modelOffset;
    int _cullingMask;
    bool _walking;
    cocos2d::Mat4 _modelMat;
    
    MeshBuffer* _buffer;
    Effect* _currEffect;
    RenderFlow* _flow;

    StencilManager* _stencilMgr;
    
    std::vector<InputAssembler*> _iaPool;
    std::vector<Model*> _modelPool;
    std::vector<Model*> _batchedModel;
    std::unordered_map<VertexFormat*, MeshBuffer*> _buffers;
};

// end of scene group
/// @}

RENDERER_END
