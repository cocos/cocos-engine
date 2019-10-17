inline SoAMaskF SoABoolMask::GetMask(bool x)
{
	return x;
}

inline SoAMaskF SoABoolMask::GetMask(bool b[1])
{
    return b[0];
}

inline bool SoABoolMask::AllBitsSet(bool mask0[1], bool mask1[1])
{
    return (*mask0 & *mask1) == true;
}

inline ui32 SoABoolMask::GetScalarMask(SoAMaskF mask)
{
    return static_cast<ui32>( mask );
}