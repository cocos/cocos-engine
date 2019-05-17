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
#include "RenderHandle.hpp"
#include "NodeProxy.hpp"
#include "../renderer/Effect.h"
#include "base/CCVector.h"
#include "../renderer/InputAssembler.h"

RENDERER_BEGIN

/**
 * @addtogroup scene
 * @{
 */

/**
 *  @brief Custom render handle base class
 *  Render components that manages render buffer directly like spine, dragonBones should extend from this handle type.
 */
class CustomRenderHandle : public SystemHandle
{
public:
    CustomRenderHandle();
    virtual ~CustomRenderHandle();
    
    /**
     *  @brief Submit the InputAssembler for the given index to ModelBatcher
     *  @param[in] index Render data index.
     *  @param[in] batcher The ModelBatcher which will transform render data to Model
     */
    virtual void renderIA(std::size_t index, ModelBatcher* batcher, NodeProxy* node) {};
    
    /**
     *  @brief Gets the material for the given index.
     *  @param[in] index Render data index.
     *  @return Effect pointer.
     */
    inline Effect* getEffect(uint32_t index) const
    {
        if (index >= _effects.size())
        {
            return nullptr;
        }
        return _effects.at(index);
    }
    
    /**
     *  @brief Gets Effect count.
     *  @return Count.
     */
    inline std::size_t getEffectCount() const
    {
        return _effects.size();
    }
    
    /**
     *  @brief Gets input assembler count.
     *  @return Count.
     */
    virtual inline std::size_t getIACount() const
    {
        return _iaCount;
    }
    
    virtual void clearNativeEffect()
    {
        _effects.clear();
    }
    
    /**
     *  @brief Update the material for the given index
     *  @param[in] index Render data index.
     *  @param[in] effect Effect pointer.
     */
    virtual void updateNativeEffect(std::size_t index, Effect* effect);
    
    /**
     *  @brief Gets whether the current handle should use model matrix uniform during rendering
     *  @return useModel
     */
    bool getUseModel() const { return _useModel; };
    
    /**
     *  @brief Sets whether the current handle should use model matrix uniform during rendering
     *  @param[in] useModel
     */
    void setUseModel(bool useModel) { _useModel = useModel; };
    /**
     *  @brief Commit the current render handle to ModelBatcher
     */
    virtual void handle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) override;
    /**
     *  @brief Do nothing
     */
    virtual void postHandle(NodeProxy *node, ModelBatcher* batcher, Scene* scene) override {}
    /**
     *  @brief Resets ia data.
     */
    virtual void reset();
    /**
     *  @brief Adjusts ia data.
     */
    virtual InputAssembler* adjustIA(std::size_t index);
    
    void enable() { _enabled = true; }
    void disable() { _enabled = false; }
protected:
    cocos2d::Vector<Effect*> _effects;
    std::vector<cocos2d::renderer::InputAssembler*> _iaPool;
    std::size_t _iaCount = 0;
    bool _useModel = false;
    bool _enabled = false;
};

// end of scene group
/// @}

RENDERER_END
