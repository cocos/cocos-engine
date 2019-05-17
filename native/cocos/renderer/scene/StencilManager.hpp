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

#include <stdio.h>
#include <vector>
#include "../../base/CCVector.h"
#include "renderer/Effect.h"

RENDERER_BEGIN

/**
 * @addtogroup scene
 * @{
 */

// Stage types
enum class Stage{
    // Stencil disabled
    DISABLED = 0,
    // Clear stencil buffer
    CLEAR = 1,
    // Entering a new level, should handle new stencil
    ENTER_LEVEL = 2,
    // In content
    ENABLED = 3,
    // Exiting a level, should restore old stencil or disable
    EXIT_LEVEL = 4
};

/**
 * The stencil manager post process the Effect in Model to make them apply correct stencil states
 * After activated a stencil mask and before desactivated it, all Models committed in between should apply the stencil's states in the Pass of Effect.
 * This is a singleton class mainly used by ModelBatcher.
 */
class StencilManager
{
public:
    StencilManager();
    ~StencilManager();
    /**
     * Reset all states
     */
    void reset();
    /**
     * Apply correct stencil states to the Effect
     */
    Effect* handleEffect(Effect* effect);
    /**
     * Add a mask to the stack
     */
    void pushMask(bool mask);
    /**
     * Stage for clearing the stencil buffer for the last mask
     */
    void clear();
    /**
     * Enters a new mask level, this stage is for drawing the stencil ref to the stencil buffer.
     */
    void enterLevel();
    /**
     * Enables the current mask, this stage is for applying stencil states defined by the current mask.
     */
    void enableMask();
    /**
     * Exits a mask level
     */
    void exitMask();
    uint8_t getWriteMask();
    uint8_t getExitWriteMask();
    uint32_t getStencilRef();
    uint32_t getInvertedRef();

    static StencilManager* getInstance()
    {
        if (_instance == nullptr)
        {
            _instance = new StencilManager;
        }
        
        return _instance;
    }
private:
    const int _maxLevel = 8;
    std::vector<bool> _maskStack;
    Stage _stage;
    static StencilManager* _instance;
};

// end of scene group
/// @}

RENDERER_END
