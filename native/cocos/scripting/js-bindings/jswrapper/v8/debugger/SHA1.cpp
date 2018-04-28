/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=8 sts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

//#include "mozilla/Assertions.h"
//#include "mozilla/EndianUtils.h"
#include "SHA1.h"

#if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR

#include <string.h>
#include <assert.h>

#if defined(_MSC_VER)
#  include <stdlib.h>
#  pragma intrinsic(_byteswap_ushort)
#  pragma intrinsic(_byteswap_ulong)
#  pragma intrinsic(_byteswap_uint64)
#endif

#define MOZ_ASSERT(cond, ...) assert(cond)

//using se::NativeEndian;
using se::SHA1Sum;

namespace {

#if defined(_WIN64)
#  if defined(_M_X64) || defined(_M_AMD64) || defined(_AMD64_)
#    define MOZ_LITTLE_ENDIAN 1
#  else
#    error "CPU type is unknown"
#  endif
#elif defined(_WIN32)
#  if defined(_M_IX86)
#    define MOZ_LITTLE_ENDIAN 1
#  elif defined(_M_ARM)
#    define MOZ_LITTLE_ENDIAN 1
#  else
#    error "CPU type is unknown"
#  endif
#elif defined(__APPLE__) || defined(__powerpc__) || defined(__ppc__)
#  if __LITTLE_ENDIAN__
#    define MOZ_LITTLE_ENDIAN 1
#  elif __BIG_ENDIAN__
#    define MOZ_BIG_ENDIAN 1
#  endif
#elif defined(__GNUC__) && \
defined(__BYTE_ORDER__) && \
defined(__ORDER_LITTLE_ENDIAN__) && \
defined(__ORDER_BIG_ENDIAN__)
    /*
     * Some versions of GCC provide architecture-independent macros for
     * this.  Yes, there are more than two values for __BYTE_ORDER__.
     */
#  if __BYTE_ORDER__ == __ORDER_LITTLE_ENDIAN__
#    define MOZ_LITTLE_ENDIAN 1
#  elif __BYTE_ORDER__ == __ORDER_BIG_ENDIAN__
#    define MOZ_BIG_ENDIAN 1
#  else
#    error "Can't handle mixed-endian architectures"
#  endif
    /*
     * We can't include useful headers like <endian.h> or <sys/isa_defs.h>
     * here because they're not present on all platforms.  Instead we have
     * this big conditional that ideally will catch all the interesting
     * cases.
     */
#elif defined(__sparc) || defined(__sparc__) || \
defined(_POWER) || defined(__hppa) || \
defined(_MIPSEB) || defined(__ARMEB__) || \
defined(__s390__) || defined(__AARCH64EB__) || \
(defined(__sh__) && defined(__LITTLE_ENDIAN__)) || \
(defined(__ia64) && defined(__BIG_ENDIAN__))
#  define MOZ_BIG_ENDIAN 1
#elif defined(__i386) || defined(__i386__) || \
defined(__x86_64) || defined(__x86_64__) || \
defined(_MIPSEL) || defined(__ARMEL__) || \
defined(__alpha__) || defined(__AARCH64EL__) || \
(defined(__sh__) && defined(__BIG_ENDIAN__)) || \
(defined(__ia64) && !defined(__BIG_ENDIAN__))
#  define MOZ_LITTLE_ENDIAN 1
#endif

#if MOZ_BIG_ENDIAN
#  define MOZ_LITTLE_ENDIAN 0
#elif MOZ_LITTLE_ENDIAN
#  define MOZ_BIG_ENDIAN 0
#else
#  error "Cannot determine endianness"
#endif

#if defined(__clang__)
#  if __has_builtin(__builtin_bswap16)
#    define MOZ_HAVE_BUILTIN_BYTESWAP16 __builtin_bswap16
#  endif
#elif defined(__GNUC__)
#  define MOZ_HAVE_BUILTIN_BYTESWAP16 __builtin_bswap16
#elif defined(_MSC_VER)
#  define MOZ_HAVE_BUILTIN_BYTESWAP16 _byteswap_ushort
#endif

enum Endianness { Little, Big };

#if MOZ_BIG_ENDIAN
#  define MOZ_NATIVE_ENDIANNESS Big
#else
#  define MOZ_NATIVE_ENDIANNESS Little
#endif

/*
 * We need wrappers here because free functions with default template
 * arguments and/or partial specialization of function templates are not
 * supported by all the compilers we use.
 */
template<typename T, size_t Size = sizeof(T)>
struct Swapper;

template<typename T>
struct Swapper<T, 2>
{
    static T swap(T aValue)
    {
#if defined(MOZ_HAVE_BUILTIN_BYTESWAP16)
        return MOZ_HAVE_BUILTIN_BYTESWAP16(aValue);
#else
        return T(((aValue & 0x00ff) << 8) | ((aValue & 0xff00) >> 8));
#endif
    }
};

template<typename T>
struct Swapper<T, 4>
{
    static T swap(T aValue)
    {
#if defined(__clang__) || defined(__GNUC__)
        return T(__builtin_bswap32(aValue));
#elif defined(_MSC_VER)
        return T(_byteswap_ulong(aValue));
#else
        return T(((aValue & 0x000000ffU) << 24) |
                 ((aValue & 0x0000ff00U) << 8) |
                 ((aValue & 0x00ff0000U) >> 8) |
                 ((aValue & 0xff000000U) >> 24));
#endif
    }
};

template<typename T>
struct Swapper<T, 8>
{
    static inline T swap(T aValue)
    {
#if defined(__clang__) || defined(__GNUC__)
        return T(__builtin_bswap64(aValue));
#elif defined(_MSC_VER)
        return T(_byteswap_uint64(aValue));
#else
        return T(((aValue & 0x00000000000000ffULL) << 56) |
                 ((aValue & 0x000000000000ff00ULL) << 40) |
                 ((aValue & 0x0000000000ff0000ULL) << 24) |
                 ((aValue & 0x00000000ff000000ULL) << 8) |
                 ((aValue & 0x000000ff00000000ULL) >> 8) |
                 ((aValue & 0x0000ff0000000000ULL) >> 24) |
                 ((aValue & 0x00ff000000000000ULL) >> 40) |
                 ((aValue & 0xff00000000000000ULL) >> 56));
#endif
    }
};

template<Endianness ThisEndian>
class Endian
{
public:
    template<typename T>
    static T swapToBigEndian(T aValue)
    {
        return maybeSwap<ThisEndian, Big>(aValue);
    }

private:

    /**
     * Return |aValue| converted from SourceEndian encoding to DestEndian
     * encoding.
     */
    template<Endianness SourceEndian, Endianness DestEndian, typename T>
    static inline T maybeSwap(T aValue)
    {
        if (SourceEndian == DestEndian) {
            return aValue;
        }
        return Swapper<T>::swap(aValue);
    }
};

class NativeEndian final : public Endian<MOZ_NATIVE_ENDIANNESS>
{
private:
    typedef Endian<MOZ_NATIVE_ENDIANNESS> super;

public:
    using super::swapToBigEndian;
};

} // namespace {

static inline uint32_t
SHA_ROTL(uint32_t aT, uint32_t aN)
{
  MOZ_ASSERT(aN < 32);
  return (aT << aN) | (aT >> (32 - aN));
}

static void
shaCompress(volatile unsigned* aX, const uint32_t* aBuf);

#define SHA_F1(X, Y, Z) ((((Y) ^ (Z)) & (X)) ^ (Z))
#define SHA_F2(X, Y, Z) ((X) ^ (Y) ^ (Z))
#define SHA_F3(X, Y, Z) (((X) & (Y)) | ((Z) & ((X) | (Y))))
#define SHA_F4(X, Y, Z) ((X) ^ (Y) ^ (Z))

#define SHA_MIX(n, a, b, c)    XW(n) = SHA_ROTL(XW(a) ^ XW(b) ^ XW(c) ^XW(n), 1)

SHA1Sum::SHA1Sum()
  : mSize(0), mDone(false)
{
  // Initialize H with constants from FIPS180-1.
  mH[0] = 0x67452301L;
  mH[1] = 0xefcdab89L;
  mH[2] = 0x98badcfeL;
  mH[3] = 0x10325476L;
  mH[4] = 0xc3d2e1f0L;
}

/*
 * Explanation of H array and index values:
 *
 * The context's H array is actually the concatenation of two arrays
 * defined by SHA1, the H array of state variables (5 elements),
 * and the W array of intermediate values, of which there are 16 elements.
 * The W array starts at H[5], that is W[0] is H[5].
 * Although these values are defined as 32-bit values, we use 64-bit
 * variables to hold them because the AMD64 stores 64 bit values in
 * memory MUCH faster than it stores any smaller values.
 *
 * Rather than passing the context structure to shaCompress, we pass
 * this combined array of H and W values.  We do not pass the address
 * of the first element of this array, but rather pass the address of an
 * element in the middle of the array, element X.  Presently X[0] is H[11].
 * So we pass the address of H[11] as the address of array X to shaCompress.
 * Then shaCompress accesses the members of the array using positive AND
 * negative indexes.
 *
 * Pictorially: (each element is 8 bytes)
 * H | H0 H1 H2 H3 H4 W0 W1 W2 W3 W4 W5 W6 W7 W8 W9 Wa Wb Wc Wd We Wf |
 * X |-11-10 -9 -8 -7 -6 -5 -4 -3 -2 -1 X0 X1 X2 X3 X4 X5 X6 X7 X8 X9 |
 *
 * The byte offset from X[0] to any member of H and W is always
 * representable in a signed 8-bit value, which will be encoded
 * as a single byte offset in the X86-64 instruction set.
 * If we didn't pass the address of H[11], and instead passed the
 * address of H[0], the offsets to elements H[16] and above would be
 * greater than 127, not representable in a signed 8-bit value, and the
 * x86-64 instruction set would encode every such offset as a 32-bit
 * signed number in each instruction that accessed element H[16] or
 * higher.  This results in much bigger and slower code.
 */
#define H2X 11 /* X[0] is H[11], and H[0] is X[-11] */
#define W2X  6 /* X[0] is W[6],  and W[0] is X[-6]  */

/*
 *  SHA: Add data to context.
 */
void
SHA1Sum::update(const void* aData, uint32_t aLen)
{
  MOZ_ASSERT(!mDone, "SHA1Sum can only be used to compute a single hash.");

  const uint8_t* data = static_cast<const uint8_t*>(aData);

  if (aLen == 0) {
    return;
  }

  /* Accumulate the byte count. */
  unsigned int lenB = static_cast<unsigned int>(mSize) & 63U;

  mSize += aLen;

  /* Read the data into W and process blocks as they get full. */
  unsigned int togo;
  if (lenB > 0) {
    togo = 64U - lenB;
    if (aLen < togo) {
      togo = aLen;
    }
    memcpy(mU.mB + lenB, data, togo);
    aLen -= togo;
    data += togo;
    lenB = (lenB + togo) & 63U;
    if (!lenB) {
      shaCompress(&mH[H2X], mU.mW);
    }
  }

  while (aLen >= 64U) {
    aLen -= 64U;
    shaCompress(&mH[H2X], reinterpret_cast<const uint32_t*>(data));
    data += 64U;
  }

  if (aLen > 0) {
    memcpy(mU.mB, data, aLen);
  }
}


/*
 *  SHA: Generate hash value
 */
void
SHA1Sum::finish(SHA1Sum::Hash& aHashOut)
{
  MOZ_ASSERT(!mDone, "SHA1Sum can only be used to compute a single hash.");

  uint64_t size = mSize;
  uint32_t lenB = uint32_t(size) & 63;

  static const uint8_t bulk_pad[64] =
    { 0x80,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 };

  /* Pad with a binary 1 (e.g. 0x80), then zeroes, then length in bits. */
  update(bulk_pad, (((55 + 64) - lenB) & 63) + 1);
  MOZ_ASSERT((uint32_t(mSize) & 63) == 56);

  /* Convert size from bytes to bits. */
  size <<= 3;
  mU.mW[14] = NativeEndian::swapToBigEndian(uint32_t(size >> 32));
  mU.mW[15] = NativeEndian::swapToBigEndian(uint32_t(size));
  shaCompress(&mH[H2X], mU.mW);

  /* Output hash. */
  mU.mW[0] = NativeEndian::swapToBigEndian(mH[0]);
  mU.mW[1] = NativeEndian::swapToBigEndian(mH[1]);
  mU.mW[2] = NativeEndian::swapToBigEndian(mH[2]);
  mU.mW[3] = NativeEndian::swapToBigEndian(mH[3]);
  mU.mW[4] = NativeEndian::swapToBigEndian(mH[4]);
  memcpy(aHashOut, mU.mW, 20);
  mDone = true;
}

/*
 *  SHA: Compression function, unrolled.
 *
 * Some operations in shaCompress are done as 5 groups of 16 operations.
 * Others are done as 4 groups of 20 operations.
 * The code below shows that structure.
 *
 * The functions that compute the new values of the 5 state variables
 * A-E are done in 4 groups of 20 operations (or you may also think
 * of them as being done in 16 groups of 5 operations).  They are
 * done by the SHA_RNDx macros below, in the right column.
 *
 * The functions that set the 16 values of the W array are done in
 * 5 groups of 16 operations.  The first group is done by the
 * LOAD macros below, the latter 4 groups are done by SHA_MIX below,
 * in the left column.
 *
 * gcc's optimizer observes that each member of the W array is assigned
 * a value 5 times in this code.  It reduces the number of store
 * operations done to the W array in the context (that is, in the X array)
 * by creating a W array on the stack, and storing the W values there for
 * the first 4 groups of operations on W, and storing the values in the
 * context's W array only in the fifth group.  This is undesirable.
 * It is MUCH bigger code than simply using the context's W array, because
 * all the offsets to the W array in the stack are 32-bit signed offsets,
 * and it is no faster than storing the values in the context's W array.
 *
 * The original code for sha_fast.c prevented this creation of a separate
 * W array in the stack by creating a W array of 80 members, each of
 * whose elements is assigned only once. It also separated the computations
 * of the W array values and the computations of the values for the 5
 * state variables into two separate passes, W's, then A-E's so that the
 * second pass could be done all in registers (except for accessing the W
 * array) on machines with fewer registers.  The method is suboptimal
 * for machines with enough registers to do it all in one pass, and it
 * necessitates using many instructions with 32-bit offsets.
 *
 * This code eliminates the separate W array on the stack by a completely
 * different means: by declaring the X array volatile.  This prevents
 * the optimizer from trying to reduce the use of the X array by the
 * creation of a MORE expensive W array on the stack. The result is
 * that all instructions use signed 8-bit offsets and not 32-bit offsets.
 *
 * The combination of this code and the -O3 optimizer flag on GCC 3.4.3
 * results in code that is 3 times faster than the previous NSS sha_fast
 * code on AMD64.
 */
static void
shaCompress(volatile unsigned* aX, const uint32_t* aBuf)
{
  unsigned A, B, C, D, E;

#define XH(n) aX[n - H2X]
#define XW(n) aX[n - W2X]

#define K0 0x5a827999L
#define K1 0x6ed9eba1L
#define K2 0x8f1bbcdcL
#define K3 0xca62c1d6L

#define SHA_RND1(a, b, c, d, e, n) \
  a = SHA_ROTL(b, 5) + SHA_F1(c, d, e) + a + XW(n) + K0; c = SHA_ROTL(c, 30)
#define SHA_RND2(a, b, c, d, e, n) \
  a = SHA_ROTL(b, 5) + SHA_F2(c, d, e) + a + XW(n) + K1; c = SHA_ROTL(c, 30)
#define SHA_RND3(a, b, c, d, e, n) \
  a = SHA_ROTL(b, 5) + SHA_F3(c, d, e) + a + XW(n) + K2; c = SHA_ROTL(c, 30)
#define SHA_RND4(a, b, c, d, e, n) \
  a = SHA_ROTL(b ,5) + SHA_F4(c, d, e) + a + XW(n) + K3; c = SHA_ROTL(c, 30)

#define LOAD(n) XW(n) = NativeEndian::swapToBigEndian(aBuf[n])

  A = XH(0);
  B = XH(1);
  C = XH(2);
  D = XH(3);
  E = XH(4);

  LOAD(0);		   SHA_RND1(E,A,B,C,D, 0);
  LOAD(1);		   SHA_RND1(D,E,A,B,C, 1);
  LOAD(2);		   SHA_RND1(C,D,E,A,B, 2);
  LOAD(3);		   SHA_RND1(B,C,D,E,A, 3);
  LOAD(4);		   SHA_RND1(A,B,C,D,E, 4);
  LOAD(5);		   SHA_RND1(E,A,B,C,D, 5);
  LOAD(6);		   SHA_RND1(D,E,A,B,C, 6);
  LOAD(7);		   SHA_RND1(C,D,E,A,B, 7);
  LOAD(8);		   SHA_RND1(B,C,D,E,A, 8);
  LOAD(9);		   SHA_RND1(A,B,C,D,E, 9);
  LOAD(10);		   SHA_RND1(E,A,B,C,D,10);
  LOAD(11);		   SHA_RND1(D,E,A,B,C,11);
  LOAD(12);		   SHA_RND1(C,D,E,A,B,12);
  LOAD(13);		   SHA_RND1(B,C,D,E,A,13);
  LOAD(14);		   SHA_RND1(A,B,C,D,E,14);
  LOAD(15);		   SHA_RND1(E,A,B,C,D,15);

  SHA_MIX( 0, 13,  8,  2); SHA_RND1(D,E,A,B,C, 0);
  SHA_MIX( 1, 14,  9,  3); SHA_RND1(C,D,E,A,B, 1);
  SHA_MIX( 2, 15, 10,  4); SHA_RND1(B,C,D,E,A, 2);
  SHA_MIX( 3,  0, 11,  5); SHA_RND1(A,B,C,D,E, 3);

  SHA_MIX( 4,  1, 12,  6); SHA_RND2(E,A,B,C,D, 4);
  SHA_MIX( 5,  2, 13,  7); SHA_RND2(D,E,A,B,C, 5);
  SHA_MIX( 6,  3, 14,  8); SHA_RND2(C,D,E,A,B, 6);
  SHA_MIX( 7,  4, 15,  9); SHA_RND2(B,C,D,E,A, 7);
  SHA_MIX( 8,  5,  0, 10); SHA_RND2(A,B,C,D,E, 8);
  SHA_MIX( 9,  6,  1, 11); SHA_RND2(E,A,B,C,D, 9);
  SHA_MIX(10,  7,  2, 12); SHA_RND2(D,E,A,B,C,10);
  SHA_MIX(11,  8,  3, 13); SHA_RND2(C,D,E,A,B,11);
  SHA_MIX(12,  9,  4, 14); SHA_RND2(B,C,D,E,A,12);
  SHA_MIX(13, 10,  5, 15); SHA_RND2(A,B,C,D,E,13);
  SHA_MIX(14, 11,  6,  0); SHA_RND2(E,A,B,C,D,14);
  SHA_MIX(15, 12,  7,  1); SHA_RND2(D,E,A,B,C,15);

  SHA_MIX( 0, 13,  8,  2); SHA_RND2(C,D,E,A,B, 0);
  SHA_MIX( 1, 14,  9,  3); SHA_RND2(B,C,D,E,A, 1);
  SHA_MIX( 2, 15, 10,  4); SHA_RND2(A,B,C,D,E, 2);
  SHA_MIX( 3,  0, 11,  5); SHA_RND2(E,A,B,C,D, 3);
  SHA_MIX( 4,  1, 12,  6); SHA_RND2(D,E,A,B,C, 4);
  SHA_MIX( 5,  2, 13,  7); SHA_RND2(C,D,E,A,B, 5);
  SHA_MIX( 6,  3, 14,  8); SHA_RND2(B,C,D,E,A, 6);
  SHA_MIX( 7,  4, 15,  9); SHA_RND2(A,B,C,D,E, 7);

  SHA_MIX( 8,  5,  0, 10); SHA_RND3(E,A,B,C,D, 8);
  SHA_MIX( 9,  6,  1, 11); SHA_RND3(D,E,A,B,C, 9);
  SHA_MIX(10,  7,  2, 12); SHA_RND3(C,D,E,A,B,10);
  SHA_MIX(11,  8,  3, 13); SHA_RND3(B,C,D,E,A,11);
  SHA_MIX(12,  9,  4, 14); SHA_RND3(A,B,C,D,E,12);
  SHA_MIX(13, 10,  5, 15); SHA_RND3(E,A,B,C,D,13);
  SHA_MIX(14, 11,  6,  0); SHA_RND3(D,E,A,B,C,14);
  SHA_MIX(15, 12,  7,  1); SHA_RND3(C,D,E,A,B,15);

  SHA_MIX( 0, 13,  8,  2); SHA_RND3(B,C,D,E,A, 0);
  SHA_MIX( 1, 14,  9,  3); SHA_RND3(A,B,C,D,E, 1);
  SHA_MIX( 2, 15, 10,  4); SHA_RND3(E,A,B,C,D, 2);
  SHA_MIX( 3,  0, 11,  5); SHA_RND3(D,E,A,B,C, 3);
  SHA_MIX( 4,  1, 12,  6); SHA_RND3(C,D,E,A,B, 4);
  SHA_MIX( 5,  2, 13,  7); SHA_RND3(B,C,D,E,A, 5);
  SHA_MIX( 6,  3, 14,  8); SHA_RND3(A,B,C,D,E, 6);
  SHA_MIX( 7,  4, 15,  9); SHA_RND3(E,A,B,C,D, 7);
  SHA_MIX( 8,  5,  0, 10); SHA_RND3(D,E,A,B,C, 8);
  SHA_MIX( 9,  6,  1, 11); SHA_RND3(C,D,E,A,B, 9);
  SHA_MIX(10,  7,  2, 12); SHA_RND3(B,C,D,E,A,10);
  SHA_MIX(11,  8,  3, 13); SHA_RND3(A,B,C,D,E,11);

  SHA_MIX(12,  9,  4, 14); SHA_RND4(E,A,B,C,D,12);
  SHA_MIX(13, 10,  5, 15); SHA_RND4(D,E,A,B,C,13);
  SHA_MIX(14, 11,  6,  0); SHA_RND4(C,D,E,A,B,14);
  SHA_MIX(15, 12,  7,  1); SHA_RND4(B,C,D,E,A,15);

  SHA_MIX( 0, 13,  8,  2); SHA_RND4(A,B,C,D,E, 0);
  SHA_MIX( 1, 14,  9,  3); SHA_RND4(E,A,B,C,D, 1);
  SHA_MIX( 2, 15, 10,  4); SHA_RND4(D,E,A,B,C, 2);
  SHA_MIX( 3,  0, 11,  5); SHA_RND4(C,D,E,A,B, 3);
  SHA_MIX( 4,  1, 12,  6); SHA_RND4(B,C,D,E,A, 4);
  SHA_MIX( 5,  2, 13,  7); SHA_RND4(A,B,C,D,E, 5);
  SHA_MIX( 6,  3, 14,  8); SHA_RND4(E,A,B,C,D, 6);
  SHA_MIX( 7,  4, 15,  9); SHA_RND4(D,E,A,B,C, 7);
  SHA_MIX( 8,  5,  0, 10); SHA_RND4(C,D,E,A,B, 8);
  SHA_MIX( 9,  6,  1, 11); SHA_RND4(B,C,D,E,A, 9);
  SHA_MIX(10,  7,  2, 12); SHA_RND4(A,B,C,D,E,10);
  SHA_MIX(11,  8,  3, 13); SHA_RND4(E,A,B,C,D,11);
  SHA_MIX(12,  9,  4, 14); SHA_RND4(D,E,A,B,C,12);
  SHA_MIX(13, 10,  5, 15); SHA_RND4(C,D,E,A,B,13);
  SHA_MIX(14, 11,  6,  0); SHA_RND4(B,C,D,E,A,14);
  SHA_MIX(15, 12,  7,  1); SHA_RND4(A,B,C,D,E,15);

  XH(0) += A;
  XH(1) += B;
  XH(2) += C;
  XH(3) += D;
  XH(4) += E;
}

#endif // #if (SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8) && SE_ENABLE_INSPECTOR
