/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "GFXBarrier.h"
#include <algorithm>
#include <array>

namespace cc {

namespace gfx {

namespace {

template <unsigned char... indices>
constexpr uint64_t setbit() {
    return ((1ULL << indices) | ... | 0ULL);
}

template <typename T, size_t... indices>
constexpr uint64_t setbits(const std::integer_sequence<T, indices...>& intSeq) {
    std::ignore = intSeq;
    return setbit<indices...>();
}

template <std::size_t N>
constexpr uint64_t setbits() {
    using index_seq = std::make_index_sequence<N>;
    return setbits(index_seq{});
}

template <unsigned char first, unsigned char end>
constexpr uint64_t setbitBetween() {
    static_assert(first >= end);
    return setbits<first>() ^ setbits<end>();
}

template <uint32_t N>
constexpr uint8_t highestBitPosOffset() {
    if constexpr (N == 0) {
        return 0;
    } else {
        return highestBitPosOffset<(N >> 1)>() + 1;
    }
}

enum class ResourceType : uint32_t {
    UNKNOWN,
    BUFFER,
    TEXTURE,
};

enum class CommonUsage : uint32_t {
    NONE = 0,
    COPY_SRC = 1 << 1,
    COPY_DST = 1 << 2,
    ROM = 1 << 3, // sampled or UNIFORM
    STORAGE = 1 << 4,
    IB_OR_CA = 1 << 5,
    VB_OR_DS = 1 << 6,
    INDIRECT_OR_INPUT = 1 << 7,
    SHADING_RATE = 1 << 8,

    LAST_ONE = SHADING_RATE,
};
CC_ENUM_BITWISE_OPERATORS(CommonUsage);

constexpr CommonUsage textureUsageToCommonUsage(TextureUsage usage) {
    CommonUsage res{0};
    if (hasFlag(usage, TextureUsage::TRANSFER_SRC)) {
        res |= CommonUsage::COPY_SRC;
    }
    if (hasFlag(usage, TextureUsage::TRANSFER_DST)) {
        res |= CommonUsage::COPY_DST;
    }
    if (hasFlag(usage, TextureUsage::SAMPLED)) {
        res |= CommonUsage::ROM;
    }
    if (hasFlag(usage, TextureUsage::STORAGE)) {
        res |= CommonUsage::STORAGE;
    }
    if (hasFlag(usage, TextureUsage::COLOR_ATTACHMENT)) {
        res |= CommonUsage::IB_OR_CA;
    }
    if (hasFlag(usage, TextureUsage::DEPTH_STENCIL_ATTACHMENT)) {
        res |= CommonUsage::VB_OR_DS;
    }
    if (hasFlag(usage, TextureUsage::INPUT_ATTACHMENT)) {
        res |= CommonUsage::INDIRECT_OR_INPUT;
    }
    if (hasFlag(usage, TextureUsage::SHADING_RATE)) {
        res |= CommonUsage::SHADING_RATE;
    }
    return res;
}

constexpr CommonUsage bufferUsageToCommonUsage(BufferUsage usage) {
    CommonUsage res{0};
    if (hasFlag(usage, BufferUsage::NONE)) {
        res |= CommonUsage::NONE;
    }
    if (hasFlag(usage, BufferUsage::TRANSFER_SRC)) {
        res |= CommonUsage::COPY_SRC;
    }
    if (hasFlag(usage, BufferUsage::TRANSFER_DST)) {
        res |= CommonUsage::COPY_DST;
    }
    if (hasFlag(usage, BufferUsage::UNIFORM)) {
        res |= CommonUsage::ROM;
    }
    if (hasFlag(usage, BufferUsage::STORAGE)) {
        res |= CommonUsage::STORAGE;
    }
    if (hasFlag(usage, BufferUsage::INDEX)) {
        res |= CommonUsage::IB_OR_CA;
    }
    if (hasFlag(usage, BufferUsage::VERTEX)) {
        res |= CommonUsage::VB_OR_DS;
    }
    if (hasFlag(usage, BufferUsage::INDIRECT)) {
        res |= CommonUsage::INDIRECT_OR_INPUT;
    }
    return res;
}

struct AccessElem {
    uint32_t mask{0xFFFFFFFF};
    uint32_t key{0xFFFFFFFF};
    AccessFlags access{AccessFlags::NONE};
    uint32_t mutex{0x0}; // optional mutually exclusive flag
};

#define OPERABLE(val) static_cast<std::underlying_type<decltype(val)>::type>(val)

constexpr uint8_t COMMON_USAGE_COUNT = highestBitPosOffset<OPERABLE(CommonUsage::LAST_ONE)>();
constexpr uint8_t SHADER_STAGE_RESERVE_COUNT = 6;
constexpr uint8_t RESOURCE_TYPE_COUNT = 2;
constexpr uint8_t MEM_TYPE_COUNT = 2;
constexpr uint8_t ACCESS_TYPE_COUNT = 2;

constexpr auto CMN_NONE = OPERABLE(CommonUsage::NONE);
constexpr auto CMN_COPY_SRC = OPERABLE(CommonUsage::COPY_SRC);
constexpr auto CMN_COPY_DST = OPERABLE(CommonUsage::COPY_DST);
constexpr auto CMN_ROM = OPERABLE(CommonUsage::ROM);
constexpr auto CMN_STORAGE = OPERABLE(CommonUsage::STORAGE);
constexpr auto CMN_IB_OR_CA = OPERABLE(CommonUsage::IB_OR_CA);
constexpr auto CMN_VB_OR_DS = OPERABLE(CommonUsage::VB_OR_DS);
constexpr auto CMN_INDIRECT_OR_INPUT = OPERABLE(CommonUsage::INDIRECT_OR_INPUT);
constexpr auto CMN_SHADING_RATE = OPERABLE(CommonUsage::SHADING_RATE);

constexpr auto SHADER_STAGE_BIT_POPS = COMMON_USAGE_COUNT;
constexpr auto SHADERSTAGE_NONE = 0;
constexpr auto SHADERSTAGE_VERT = 1 << (0 + SHADER_STAGE_BIT_POPS);
constexpr auto SHADERSTAGE_CTRL = 1 << (1 + SHADER_STAGE_BIT_POPS);
constexpr auto SHADERSTAGE_EVAL = 1 << (2 + SHADER_STAGE_BIT_POPS);
constexpr auto SHADERSTAGE_GEOM = 1 << (3 + SHADER_STAGE_BIT_POPS);
constexpr auto SHADERSTAGE_FRAG = 1 << (4 + SHADER_STAGE_BIT_POPS);
constexpr auto SHADERSTAGE_COMP = 1 << (5 + SHADER_STAGE_BIT_POPS);

constexpr auto RESOURCE_TYPE_BIT_POS = COMMON_USAGE_COUNT + SHADER_STAGE_RESERVE_COUNT;
constexpr auto RES_TEXTURE = OPERABLE(ResourceType::TEXTURE) << RESOURCE_TYPE_BIT_POS;
constexpr auto RES_BUFFER = OPERABLE(ResourceType::BUFFER) << RESOURCE_TYPE_BIT_POS;

constexpr auto MEM_TYPE_BIT_POS = COMMON_USAGE_COUNT + SHADER_STAGE_RESERVE_COUNT + RESOURCE_TYPE_COUNT;
constexpr auto MEM_HOST = OPERABLE(MemoryUsage::HOST) << MEM_TYPE_BIT_POS;
constexpr auto MEM_DEVICE = OPERABLE(MemoryUsage::DEVICE) << MEM_TYPE_BIT_POS;

constexpr auto ACCESS_TYPE_BIT_POS = COMMON_USAGE_COUNT + SHADER_STAGE_RESERVE_COUNT + RESOURCE_TYPE_COUNT + MEM_TYPE_COUNT;
constexpr auto ACCESS_WRITE = OPERABLE(MemoryAccess::WRITE_ONLY) << ACCESS_TYPE_BIT_POS;
constexpr auto ACCESS_READ = OPERABLE(MemoryAccess::READ_ONLY) << ACCESS_TYPE_BIT_POS;

constexpr uint8_t USED_BIT_COUNT = COMMON_USAGE_COUNT + SHADER_STAGE_RESERVE_COUNT + RESOURCE_TYPE_COUNT + MEM_TYPE_COUNT + ACCESS_TYPE_COUNT;
// 20 and above :reserved
// 18 ~ 19: MemoryAccess
// 16 ~ 17: MemoryUsage
// 14 ~ 15: ResourceType
// 8 ~ 13: ShaderStageFlags
// 0 ~ 7: CommonUsage

constexpr uint32_t CARE_NONE = 0x0;
constexpr uint32_t CARE_CMNUSAGE = setbitBetween<SHADER_STAGE_BIT_POPS, 0>();
constexpr uint32_t CARE_SHADERSTAGE = setbitBetween<RESOURCE_TYPE_BIT_POS, SHADER_STAGE_BIT_POPS>();
constexpr uint32_t CARE_RESTYPE = setbitBetween<MEM_TYPE_BIT_POS, RESOURCE_TYPE_BIT_POS>();
constexpr uint32_t CARE_MEMUSAGE = setbitBetween<ACCESS_TYPE_BIT_POS, MEM_TYPE_BIT_POS>();
constexpr uint32_t CARE_MEMACCESS = setbitBetween<USED_BIT_COUNT, ACCESS_TYPE_BIT_POS>();

constexpr uint32_t IGNORE_NONE = 0xFFFFFFFF;
constexpr uint32_t IGNORE_CMNUSAGE = ~CARE_CMNUSAGE;
constexpr uint32_t IGNORE_SHADERSTAGE = ~CARE_SHADERSTAGE;
constexpr uint32_t IGNORE_RESTYPE = ~CARE_RESTYPE;
constexpr uint32_t IGNORE_MEMUSAGE = ~CARE_MEMUSAGE;
constexpr uint32_t IGNORE_MEMACCESS = ~CARE_MEMACCESS;

constexpr AccessElem ACCESS_MAP[] = {
    {CARE_MEMACCESS,
     0x0,
     AccessFlags::NONE},

    {CARE_MEMUSAGE,
     0x0,
     AccessFlags::NONE},

    {CARE_RESTYPE | CARE_CMNUSAGE,
     RES_BUFFER | CMN_INDIRECT_OR_INPUT,
     AccessFlags::INDIRECT_BUFFER},

    {CARE_RESTYPE | CARE_CMNUSAGE,
     RES_BUFFER | CMN_IB_OR_CA,
     AccessFlags::INDEX_BUFFER}, // buffer usage indicates what it is, so shader stage ignored.

    {CARE_RESTYPE | CARE_CMNUSAGE,
     ACCESS_READ | RES_BUFFER | CMN_VB_OR_DS,
     AccessFlags::VERTEX_BUFFER}, // ditto

    {IGNORE_MEMUSAGE,
     ACCESS_READ | RES_BUFFER | SHADERSTAGE_VERT | CMN_ROM,
     AccessFlags::VERTEX_SHADER_READ_UNIFORM_BUFFER},

    {IGNORE_MEMUSAGE,
     ACCESS_READ | RES_TEXTURE | SHADERSTAGE_VERT | CMN_ROM,
     AccessFlags::VERTEX_SHADER_READ_TEXTURE},

    {IGNORE_MEMUSAGE & IGNORE_RESTYPE,
     ACCESS_READ | SHADERSTAGE_VERT | CMN_STORAGE,
     AccessFlags::VERTEX_SHADER_READ_OTHER},

    {IGNORE_MEMUSAGE,
     ACCESS_READ | RES_BUFFER | SHADERSTAGE_FRAG | CMN_ROM,
     AccessFlags::FRAGMENT_SHADER_READ_UNIFORM_BUFFER},

    {CARE_MEMACCESS | CARE_RESTYPE | CARE_SHADERSTAGE | CARE_CMNUSAGE,
     ACCESS_READ | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_ROM,
     AccessFlags::FRAGMENT_SHADER_READ_TEXTURE,
     CMN_STORAGE | CMN_VB_OR_DS},

    {IGNORE_MEMUSAGE,
     ACCESS_READ | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_IB_OR_CA | CMN_INDIRECT_OR_INPUT,
     AccessFlags::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT},

    {IGNORE_MEMUSAGE,
     ACCESS_READ | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_VB_OR_DS | CMN_INDIRECT_OR_INPUT,
     AccessFlags::FRAGMENT_SHADER_READ_DEPTH_STENCIL_INPUT_ATTACHMENT},

    {IGNORE_MEMUSAGE & IGNORE_RESTYPE,
     ACCESS_READ | SHADERSTAGE_FRAG | CMN_STORAGE,
     AccessFlags::FRAGMENT_SHADER_READ_OTHER,
     CMN_SHADING_RATE},

    //{IGNORE_MEMUSAGE,
    // ACCESS_READ | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_IB_OR_CA,
    // AccessFlags::COLOR_ATTACHMENT_READ},

    {CARE_MEMACCESS | CARE_RESTYPE | CARE_CMNUSAGE,
     ACCESS_READ | RES_TEXTURE | CMN_VB_OR_DS | CMN_ROM,
     AccessFlags::DEPTH_STENCIL_ATTACHMENT_READ},

    {IGNORE_MEMUSAGE,
     ACCESS_READ | RES_BUFFER | SHADERSTAGE_COMP | CMN_ROM,
     AccessFlags::COMPUTE_SHADER_READ_UNIFORM_BUFFER},

    {IGNORE_MEMUSAGE,
     ACCESS_READ | RES_TEXTURE | SHADERSTAGE_COMP | CMN_ROM,
     AccessFlags::COMPUTE_SHADER_READ_TEXTURE},

    // shading rate has its own flag
    {CARE_MEMACCESS | CARE_SHADERSTAGE | CARE_CMNUSAGE,
     ACCESS_READ | SHADERSTAGE_COMP | CMN_STORAGE,
     AccessFlags::COMPUTE_SHADER_READ_OTHER},

    {CARE_MEMACCESS | CARE_CMNUSAGE,
     ACCESS_READ | CMN_COPY_SRC,
     AccessFlags::TRANSFER_READ},

    {CARE_MEMACCESS | CARE_MEMUSAGE,
     ACCESS_READ | MEM_HOST,
     AccessFlags::HOST_READ},

    {CARE_MEMACCESS | CARE_SHADERSTAGE | CARE_CMNUSAGE,
     ACCESS_READ | SHADERSTAGE_FRAG | CMN_SHADING_RATE,
     AccessFlags::SHADING_RATE},

    //{CARE_CMNUSAGE | CARE_RESTYPE,
    // RES_TEXTURE | CMN_NONE,
    // AccessFlags::PRESENT},

    {CARE_MEMACCESS | CARE_SHADERSTAGE | CARE_CMNUSAGE,
     ACCESS_WRITE | SHADERSTAGE_VERT | CMN_STORAGE,
     AccessFlags::VERTEX_SHADER_WRITE},

    {CARE_MEMACCESS | CARE_SHADERSTAGE | CARE_CMNUSAGE,
     ACCESS_WRITE | SHADERSTAGE_FRAG | CMN_STORAGE,
     AccessFlags::FRAGMENT_SHADER_WRITE},

    {IGNORE_MEMUSAGE,
     ACCESS_WRITE | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_IB_OR_CA,
     AccessFlags::COLOR_ATTACHMENT_WRITE},

    {IGNORE_NONE,
     ACCESS_WRITE | MEM_DEVICE | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_VB_OR_DS,
     AccessFlags::DEPTH_STENCIL_ATTACHMENT_WRITE},

    {CARE_MEMACCESS | CARE_SHADERSTAGE | CARE_CMNUSAGE,
     ACCESS_WRITE | SHADERSTAGE_COMP | CMN_STORAGE,
     AccessFlags::COMPUTE_SHADER_WRITE},

    {CARE_MEMACCESS | CARE_CMNUSAGE,
     ACCESS_WRITE | CMN_COPY_DST,
     AccessFlags::TRANSFER_WRITE},

    {CARE_MEMACCESS | CARE_MEMUSAGE,
     ACCESS_WRITE | MEM_HOST,
     AccessFlags::HOST_WRITE},
};

constexpr bool validateAccess(ResourceType type, CommonUsage usage, MemoryAccess access, ShaderStageFlags visibility) {
    bool res = true;
    if (type == ResourceType::BUFFER) {
        uint32_t conflicts[] = {
            hasFlag(usage, CommonUsage::ROM) && hasFlag(access, MemoryAccess::WRITE_ONLY),                                       // uniform has write access.
            hasAnyFlags(usage, CommonUsage::IB_OR_CA | CommonUsage::VB_OR_DS) && !hasFlag(visibility, ShaderStageFlags::VERTEX), // color/ds/input not in fragment
            hasAllFlags(usage, CommonUsage::ROM | CommonUsage::STORAGE),                                                         // storage ^ sampled
            hasFlag(usage, CommonUsage::COPY_SRC) && hasAllFlags(MemoryAccess::READ_ONLY, access),                               // transfer src ==> read_only
            hasFlag(usage, CommonUsage::COPY_DST) && hasAllFlags(MemoryAccess::WRITE_ONLY, access),                              // transfer dst ==> write_only
            hasAllFlags(usage, CommonUsage::COPY_SRC | CommonUsage::COPY_DST),                                                   // both src and dst
            hasFlag(usage, CommonUsage::VB_OR_DS) && hasAnyFlags(usage, CommonUsage::IB_OR_CA | CommonUsage::INDIRECT_OR_INPUT),
            hasFlag(usage, CommonUsage::IB_OR_CA) && hasAnyFlags(usage, CommonUsage::VB_OR_DS | CommonUsage::INDIRECT_OR_INPUT),
            hasFlag(usage, CommonUsage::INDIRECT_OR_INPUT) && hasAnyFlags(usage, CommonUsage::IB_OR_CA | CommonUsage::VB_OR_DS),
            // exlusive
        };
        res = !(*std::max_element(std::begin(conflicts), std::end(conflicts)));
    } else if (type == ResourceType::TEXTURE) {
        uint32_t conflicts[] = {
            hasAnyFlags(usage, CommonUsage::IB_OR_CA | CommonUsage::VB_OR_DS | CommonUsage::INDIRECT_OR_INPUT) && !hasFlag(visibility, ShaderStageFlags::FRAGMENT), // color/ds/input not in fragment
            hasFlag(usage, CommonUsage::INDIRECT_OR_INPUT) && !hasFlag(access, MemoryAccess::READ_ONLY),                                                            // input needs read
            hasAllFlags(usage, CommonUsage::IB_OR_CA | CommonUsage::STORAGE),                                                                                       // storage ^ sampled
            hasFlag(usage, CommonUsage::COPY_SRC) && !hasAllFlags(MemoryAccess::READ_ONLY, access),                                                                 // transfer src ==> read_only
            hasFlag(usage, CommonUsage::COPY_DST) && !hasAllFlags(MemoryAccess::WRITE_ONLY, access),
            hasFlag(usage, CommonUsage::INDIRECT_OR_INPUT) && !hasAnyFlags(usage, CommonUsage::IB_OR_CA | CommonUsage::VB_OR_DS), // input needs to specify color or ds                                                                    // transfer dst ==> write_only
            hasAllFlags(usage, CommonUsage::COPY_SRC | CommonUsage::COPY_DST),                                                    // both src and dst
        };
        res = !(*std::max_element(std::begin(conflicts), std::end(conflicts)));
    }
    return res;
}

constexpr AccessFlags getAccessFlagsImpl(
    BufferUsage usage, MemoryUsage memUsage,
    MemoryAccess access,
    ShaderStageFlags visibility) noexcept {
    AccessFlags flags{AccessFlags::NONE};
    CommonUsage cmnUsage = bufferUsageToCommonUsage(usage);
    if (validateAccess(ResourceType::BUFFER, cmnUsage, access, visibility)) {
        uint32_t info = 0xFFFFFFFF;
        info &= ((OPERABLE(access) << ACCESS_TYPE_BIT_POS) | IGNORE_MEMACCESS);
        info &= ((OPERABLE(memUsage) << MEM_TYPE_BIT_POS) | IGNORE_MEMUSAGE);
        info &= ((OPERABLE(ResourceType::TEXTURE) << RESOURCE_TYPE_BIT_POS) | IGNORE_RESTYPE);
        info &= ((OPERABLE(visibility) << SHADER_STAGE_BIT_POPS) | IGNORE_SHADERSTAGE);
        info &= OPERABLE(cmnUsage) | IGNORE_CMNUSAGE;

        for (const auto& elem : ACCESS_MAP) {
            auto testFlag = info & elem.mask;
            // hasKey
            if ((testFlag & elem.key) == elem.key) {
                flags |= elem.access;
            }
        }

    } else {
        flags = INVALID_ACCESS_FLAGS;
    }
    return flags;
}

constexpr AccessFlags getAccessFlagsImpl(
    TextureUsage usage,
    MemoryAccess access,
    ShaderStageFlags visibility) noexcept {
    AccessFlags flags{AccessFlags::NONE};
    CommonUsage cmnUsage = textureUsageToCommonUsage(usage);
    if (validateAccess(ResourceType::TEXTURE, cmnUsage, access, visibility)) {
        if (usage == gfx::TextureUsageBit::NONE) {
            return gfx::AccessFlagBit::PRESENT;
        }
        uint32_t info = 0xFFFFFFFF;
        info &= ((OPERABLE(access) << ACCESS_TYPE_BIT_POS) | IGNORE_MEMACCESS);
        info &= ((OPERABLE(MemoryUsage::DEVICE) << MEM_TYPE_BIT_POS) | IGNORE_MEMUSAGE);
        info &= ((OPERABLE(ResourceType::TEXTURE) << RESOURCE_TYPE_BIT_POS) | IGNORE_RESTYPE);
        info &= ((OPERABLE(visibility) << (SHADER_STAGE_BIT_POPS)) | IGNORE_SHADERSTAGE);
        info &= OPERABLE(cmnUsage) | IGNORE_CMNUSAGE;

        for (const auto& elem : ACCESS_MAP) {
            auto testFlag = info & elem.mask;
            // hasKey && no mutex flag
            if (((testFlag & elem.key) == elem.key) && ((testFlag & elem.mutex) == 0)) {
                flags |= elem.access;
            }
        }
    } else {
        flags = INVALID_ACCESS_FLAGS;
    }

    // CC_ASSERT(flags != INVALID_ACCESS_FLAGS);
    return flags;
}

} // namespace

AccessFlags getAccessFlags(
    BufferUsage usage, MemoryUsage memUsage,
    MemoryAccess access,
    ShaderStageFlags visibility) noexcept {
    return getAccessFlagsImpl(usage, memUsage, access, visibility);
}

AccessFlags getAccessFlags(
    TextureUsage usage,
    MemoryAccess access,
    ShaderStageFlags visibility) noexcept {
    return getAccessFlagsImpl(usage, access, visibility);
}

namespace {

constexpr AccessFlags getDeviceAccessFlagsImpl(
    TextureUsage usage,
    MemoryAccess access,
    ShaderStageFlags visibility) {
    // Special Present Usage
    if (usage == TextureUsage::NONE) {
        return AccessFlags::PRESENT;
    }

    // not read or write access
    if (access == MemoryAccess::NONE) {
        return INVALID_ACCESS_FLAGS;
    }

    // input attachment requires color or depth stencil
    if (hasAnyFlags(usage, TextureUsage::INPUT_ATTACHMENT) &&
        !hasAnyFlags(usage, TextureUsage::COLOR_ATTACHMENT | TextureUsage::DEPTH_STENCIL_ATTACHMENT)) {
        return INVALID_ACCESS_FLAGS;
    }

    const bool bWrite = hasAnyFlags(access, MemoryAccess::WRITE_ONLY);
    const bool bRead = hasAnyFlags(access, MemoryAccess::READ_ONLY);

    if (bWrite) { // single write
        const auto writeMask =
            TextureUsage::TRANSFER_DST |
            TextureUsage::STORAGE |
            TextureUsage::COLOR_ATTACHMENT |
            TextureUsage::DEPTH_STENCIL_ATTACHMENT;

        const auto usage1 = usage & writeMask;
        // see https://stackoverflow.com/questions/51094594/how-to-check-if-exactly-one-bit-is-set-in-an-int
        constexpr auto hasOnebit = [](uint32_t bits) -> bool {
            return bits && !(bits & (bits - 1));
        };
        if (!hasOnebit(static_cast<uint32_t>(usage1))) {
            return INVALID_ACCESS_FLAGS;
        }

        const auto readMask =
            TextureUsage::SAMPLED |
            TextureUsage::TRANSFER_SRC;

        if (hasAnyFlags(usage, readMask)) {
            return INVALID_ACCESS_FLAGS;
        }
    }

    auto flags = AccessFlags::NONE;

    if (hasAnyFlags(usage, TextureUsage::COLOR_ATTACHMENT)) {
        if (hasAnyFlags(visibility, ShaderStageFlags::ALL & ~ShaderStageFlags::FRAGMENT)) {
            return INVALID_ACCESS_FLAGS;
        }
        if (bWrite) {
            flags |= AccessFlags::COLOR_ATTACHMENT_WRITE;
        }
        if (bRead) {
            flags |= AccessFlags::COLOR_ATTACHMENT_READ;
        }
        if (hasAnyFlags(usage, TextureUsage::INPUT_ATTACHMENT)) {
            if (!bRead) {
                return INVALID_ACCESS_FLAGS;
            }
            flags |= AccessFlags::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT;
        }
        if (bWrite) {
            return flags;
        }
    } else if (hasAnyFlags(usage, TextureUsage::DEPTH_STENCIL_ATTACHMENT)) {
        if (hasAnyFlags(visibility, ShaderStageFlags::ALL & ~ShaderStageFlags::FRAGMENT)) {
            return INVALID_ACCESS_FLAGS;
        }
        if (bWrite) {
            flags |= AccessFlags::DEPTH_STENCIL_ATTACHMENT_WRITE;
        }
        if (bRead) {
            flags |= AccessFlags::DEPTH_STENCIL_ATTACHMENT_READ;
        }
        if (hasAnyFlags(usage, TextureUsage::INPUT_ATTACHMENT)) {
            if (!bRead) {
                return INVALID_ACCESS_FLAGS;
            }
            flags |= AccessFlags::FRAGMENT_SHADER_READ_DEPTH_STENCIL_INPUT_ATTACHMENT;
        }
        if (bWrite) {
            return flags;
        }
    } else if (bWrite) {
        if (hasAnyFlags(usage, TextureUsage::SAMPLED)) {
            return INVALID_ACCESS_FLAGS;
        }
        const bool bUnorderedAccess = hasAnyFlags(usage, TextureUsage::STORAGE);
        const bool bCopyTarget = hasAnyFlags(usage, TextureUsage::TRANSFER_DST);
        if (!(bUnorderedAccess ^ bCopyTarget)) {
            return INVALID_ACCESS_FLAGS;
        }
        if (bCopyTarget) {
            if (bRead || hasAnyFlags(usage, TextureUsage::TRANSFER_SRC)) {
                return INVALID_ACCESS_FLAGS; // both copy source and target
            }
            flags |= AccessFlags::TRANSFER_WRITE;
        } else {
            if (hasAnyFlags(visibility, ShaderStageFlags::VERTEX)) {
                flags |= AccessFlags::VERTEX_SHADER_WRITE;
                if (bRead) {
                    flags |= AccessFlags::VERTEX_SHADER_READ_TEXTURE;
                }
            } else if (hasAnyFlags(visibility, ShaderStageFlags::FRAGMENT)) {
                flags |= AccessFlags::FRAGMENT_SHADER_WRITE;
                if (bRead) {
                    flags |= AccessFlags::FRAGMENT_SHADER_READ_TEXTURE;
                }
            } else if (hasAnyFlags(visibility, ShaderStageFlags::COMPUTE)) {
                flags |= AccessFlags::COMPUTE_SHADER_WRITE;
                if (bRead) {
                    flags |= AccessFlags::COMPUTE_SHADER_READ_TEXTURE;
                }
            }
        }
        return flags;
    }

    if (bWrite) {
        return INVALID_ACCESS_FLAGS;
    }

    // ReadOnly
    if (hasAnyFlags(usage, TextureUsage::TRANSFER_SRC)) {
        flags |= AccessFlags::TRANSFER_READ;
    }

    if (hasAnyFlags(usage, TextureUsage::SAMPLED | TextureUsage::STORAGE)) {
        if (hasAnyFlags(visibility, ShaderStageFlags::VERTEX)) {
            flags |= AccessFlags::VERTEX_SHADER_READ_TEXTURE;
        }
        if (hasAnyFlags(visibility, ShaderStageFlags::FRAGMENT)) {
            flags |= AccessFlags::FRAGMENT_SHADER_READ_TEXTURE;
        }
        if (hasAnyFlags(visibility, ShaderStageFlags::COMPUTE)) {
            flags |= AccessFlags::COMPUTE_SHADER_READ_TEXTURE;
        }
    }

    return flags;
}

static_assert(
    (AccessFlags::VERTEX_SHADER_WRITE | AccessFlags::VERTEX_SHADER_READ_OTHER) ==
    getAccessFlagsImpl(
        TextureUsage::STORAGE,
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::VERTEX));

static_assert(
    (AccessFlags::FRAGMENT_SHADER_WRITE | AccessFlags::FRAGMENT_SHADER_READ_OTHER) ==
    getAccessFlagsImpl(
        TextureUsage::STORAGE,
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::COMPUTE_SHADER_WRITE | AccessFlags::COMPUTE_SHADER_READ_OTHER) ==
    getAccessFlagsImpl(
        TextureUsage::STORAGE,
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::COMPUTE));

static_assert(
    INVALID_ACCESS_FLAGS ==
    getAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT | TextureUsage::STORAGE,
        MemoryAccess::READ_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    INVALID_ACCESS_FLAGS ==
    getAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT | TextureUsage::SAMPLED | TextureUsage::STORAGE,
        MemoryAccess::READ_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::TRANSFER_WRITE | AccessFlags::COLOR_ATTACHMENT_WRITE) ==
    getAccessFlagsImpl(
        TextureUsage::TRANSFER_DST | TextureUsage::COLOR_ATTACHMENT,
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::ALL));

////////////////////////////////////

// VERTEX_SHADER_WRITE
static_assert(
    AccessFlags::VERTEX_SHADER_WRITE ==
    getDeviceAccessFlagsImpl(
        TextureUsage::STORAGE,
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::VERTEX));

static_assert(
    (AccessFlags::VERTEX_SHADER_WRITE | AccessFlags::VERTEX_SHADER_READ_TEXTURE) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::STORAGE,
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::VERTEX));

static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::STORAGE | TextureUsage::SAMPLED, // both storage write and sampling
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::VERTEX));

static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::SAMPLED, // Sampled cannot be write
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::VERTEX));

// FRAGMENT_SHADER_WRITE
static_assert(
    AccessFlags::FRAGMENT_SHADER_WRITE ==
    getDeviceAccessFlagsImpl(
        TextureUsage::STORAGE,
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::FRAGMENT_SHADER_WRITE | AccessFlags::FRAGMENT_SHADER_READ_TEXTURE) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::STORAGE,
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::FRAGMENT));

// COLOR_ATTACHMENT_WRITE
static_assert(
    AccessFlags::COLOR_ATTACHMENT_WRITE ==
    getDeviceAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT,
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT,
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::VERTEX)); // not fragment stage

static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT | TextureUsage::SAMPLED, // both color attachment and sampled texture
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::COLOR_ATTACHMENT_WRITE | AccessFlags::COLOR_ATTACHMENT_READ) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT,
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::FRAGMENT));

static_assert(
    AccessFlags::COLOR_ATTACHMENT_READ ==
    getDeviceAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT,
        MemoryAccess::READ_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::COLOR_ATTACHMENT_READ | AccessFlags::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT,
        MemoryAccess::READ_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::COLOR_ATTACHMENT_WRITE | AccessFlags::COLOR_ATTACHMENT_READ | AccessFlags::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT,
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::FRAGMENT));

static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT,
        MemoryAccess::WRITE_ONLY, // INPUT_ATTACHMENT needs read access
        ShaderStageFlags::FRAGMENT));

// DEPTH_STENCIL_ATTACHMENT_WRITE
static_assert(
    AccessFlags::DEPTH_STENCIL_ATTACHMENT_WRITE ==
    getDeviceAccessFlagsImpl(
        TextureUsage::DEPTH_STENCIL_ATTACHMENT,
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::DEPTH_STENCIL_ATTACHMENT,
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::VERTEX)); // not fragment stage

static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::DEPTH_STENCIL_ATTACHMENT | TextureUsage::SAMPLED, // both color attachment and sampled texture
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::DEPTH_STENCIL_ATTACHMENT_WRITE | AccessFlags::DEPTH_STENCIL_ATTACHMENT_READ) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::DEPTH_STENCIL_ATTACHMENT,
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::FRAGMENT));

static_assert(
    AccessFlags::DEPTH_STENCIL_ATTACHMENT_READ ==
    getDeviceAccessFlagsImpl(
        TextureUsage::DEPTH_STENCIL_ATTACHMENT,
        MemoryAccess::READ_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::DEPTH_STENCIL_ATTACHMENT_READ | AccessFlags::FRAGMENT_SHADER_READ_DEPTH_STENCIL_INPUT_ATTACHMENT) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::DEPTH_STENCIL_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT,
        MemoryAccess::READ_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::DEPTH_STENCIL_ATTACHMENT_WRITE | AccessFlags::DEPTH_STENCIL_ATTACHMENT_READ | AccessFlags::FRAGMENT_SHADER_READ_DEPTH_STENCIL_INPUT_ATTACHMENT) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::DEPTH_STENCIL_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT,
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::FRAGMENT));

static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::DEPTH_STENCIL_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT,
        MemoryAccess::WRITE_ONLY, // INPUT_ATTACHMENT needs read access
        ShaderStageFlags::FRAGMENT));

// COMPUTE_SHADER_WRITE
static_assert(
    AccessFlags::COMPUTE_SHADER_WRITE ==
    getDeviceAccessFlagsImpl(
        TextureUsage::STORAGE,
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::COMPUTE));
static_assert(
    (AccessFlags::COMPUTE_SHADER_WRITE | AccessFlags::COMPUTE_SHADER_READ_TEXTURE) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::STORAGE,
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::COMPUTE));
static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::STORAGE | TextureUsage::SAMPLED, // cannot be sampled
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::COMPUTE));
static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::STORAGE | TextureUsage::SAMPLED, // cannot be sampled
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::COMPUTE));

// TRANSFER_WRITE
static_assert(
    AccessFlags::TRANSFER_WRITE ==
    getDeviceAccessFlagsImpl(
        TextureUsage::TRANSFER_DST,
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::ALL)); // ShaderStageFlags not used

static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::TRANSFER_DST,
        MemoryAccess::READ_WRITE,
        ShaderStageFlags::ALL)); // ShaderStageFlags not used

static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::TRANSFER_DST | TextureUsage::TRANSFER_SRC, // both source and target
        MemoryAccess::READ_WRITE,                                // both read and write
        ShaderStageFlags::ALL));

static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::TRANSFER_DST | TextureUsage::TRANSFER_SRC, // both source and target
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::ALL));

static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::TRANSFER_DST | TextureUsage::COLOR_ATTACHMENT, // cannot be sampled
        MemoryAccess::WRITE_ONLY,
        ShaderStageFlags::ALL));

// Read
// COLOR_ATTACHMENT_READ
static_assert(
    INVALID_ACCESS_FLAGS ==
    getDeviceAccessFlagsImpl(
        TextureUsage::INPUT_ATTACHMENT, // INPUT_ATTACHMENT needs COLOR_ATTACHMENT or DEPTH_STENCIL_ATTACHMENT
        MemoryAccess::READ_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::COLOR_ATTACHMENT_READ | AccessFlags::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT | AccessFlags::FRAGMENT_SHADER_READ_TEXTURE) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT | TextureUsage::SAMPLED,
        MemoryAccess::READ_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::COLOR_ATTACHMENT_READ | AccessFlags::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT | AccessFlags::FRAGMENT_SHADER_READ_TEXTURE) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT | TextureUsage::STORAGE,
        MemoryAccess::READ_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::COLOR_ATTACHMENT_READ | AccessFlags::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT | AccessFlags::FRAGMENT_SHADER_READ_TEXTURE) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT | TextureUsage::SAMPLED | TextureUsage::STORAGE,
        MemoryAccess::READ_ONLY,
        ShaderStageFlags::FRAGMENT));

static_assert(
    (AccessFlags::COLOR_ATTACHMENT_READ | AccessFlags::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT | AccessFlags::TRANSFER_READ) ==
    getDeviceAccessFlagsImpl(
        TextureUsage::COLOR_ATTACHMENT | TextureUsage::INPUT_ATTACHMENT | TextureUsage::TRANSFER_SRC,
        MemoryAccess::READ_ONLY,
        ShaderStageFlags::FRAGMENT));

} // namespace

AccessFlags getDeviceAccessFlags(
    TextureUsage usage,
    MemoryAccess access,
    ShaderStageFlags visibility) {
    return getDeviceAccessFlagsImpl(usage, access, visibility);
}

} // namespace gfx

} // namespace cc
