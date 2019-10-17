#ifndef __SOABOOLMASK_H___
#define __SOABOOLMASK_H___

#include "SoAMathLib.h"

CC_NAMESPACE_BEGIN

class SoABoolMask
{
public:
    enum
    {
        MASK_NONE           = 0,
        MASK_X              = 1,
        NUM_MASKS           = 2
    };

public:
    inline static SoAMaskF	GetMask(bool x);
    inline static SoAMaskF	GetMask(bool booleans[1]);

    /// Returns true if alls bit in mask0[i] and mask1[i] are set.
    inline static bool		AllBitsSet(bool mask0[1], bool mask1[1]);

    /** Converts a SIMD mask into a mask that fits in 32-bit number
    @remarks
        @See IS_SET_MASK_X & co. to read the mask, since the result may need
        byteswapping in some architectures (i.e. SSE2)
    */
    inline static ui32		GetScalarMask(SoAMaskF mask);
};

#include "SoABoolMask-inl.h"

#define IS_BIT_SET(bit, intMask)	((intMask & (1 << bit)) != 0)

CC_NAMESPACE_END

#endif
