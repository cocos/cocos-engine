#include "GFXBarrier.h"
#include <array>

namespace cc {

namespace gfx {

namespace {

enum class ResourceType : uint32_t {
    UNKNOWN,
    BUFFER,
    TEXTURE,
};

enum class CommonUsage : uint32_t {
    NONE = 0,
    COPY_SRC = 1 << 0,
    COPY_DST = 1 << 1,
    ROM = 1 << 2, // sampled or UNIFORM
    STORAGE = 1 << 3,
    IB_OR_CA = 1 << 4,
    VB_OR_DS = 1 << 5,
    INDIRECT_OR_INPUT = 1 << 6,
};
CC_ENUM_BITWISE_OPERATORS(CommonUsage);

struct AccessElem {
    uint32_t mask{0xFFFFFFFF};
    uint32_t key{0xFFFFFFFF};
    AccessFlags access{AccessFlags::NONE};
};

// 23 and above :reserved
// 21 ~ 22: MemoryAccess
// 19 ~ 20: MemoryUsage
// 13 ~ 18: PassType
// 11 ~ 12: ResourceType
// 9 ~ 10: ShaderStageFlags
// 0 ~ 8: CommonUsage
constexpr uint32_t IGNORE_MEMACCESS = 0b0011111111111111111111;
constexpr uint32_t IGNORE_MEMUSAGE = 0b1100111111111111111111;
constexpr uint32_t IGNORE_PASSTYPE = 0b1111000000111111111111;
constexpr uint32_t IGNORE_RESTYPE = 0b1111111111001111111111;
constexpr uint32_t IGNORE_SHADERSTAGE = 0b1111111111110011111111;
constexpr uint32_t IGNORE_CMNUSAGE = 0b1111111111111100000000;
constexpr uint32_t IGNORE_NONE = 0xFFFFFFFF;

constexpr uint32_t CARE_MEMACCESS = ~IGNORE_MEMACCESS;
constexpr uint32_t CARE_MEMUSAGE = ~IGNORE_MEMUSAGE;
constexpr uint32_t CARE_PASSTYPE = ~IGNORE_PASSTYPE;
constexpr uint32_t CARE_RESTYPE = ~IGNORE_RESTYPE;
constexpr uint32_t CARE_SHADERSTAGE = ~IGNORE_SHADERSTAGE;
constexpr uint32_t CARE_CMNUSAGE = ~IGNORE_CMNUSAGE;
constexpr uint32_t CARE_NONE = ~IGNORE_NONE;

#define OPERABLE(val) static_cast<std::underlying_type<decltype(val)>::type>(val)

constexpr auto ACCESS_READ = OPERABLE(MemoryAccess::READ_ONLY) << 20;
constexpr auto ACCESS_WRITE = OPERABLE(MemoryAccess::WRITE_ONLY) << 20;
constexpr auto MEM_DEVICE = OPERABLE(MemoryUsage::DEVICE) << 18;
constexpr auto MEM_HOST = OPERABLE(MemoryUsage::HOST) << 18;
constexpr auto PASS_RASTER = 1 << (OPERABLE(PassType::RASTER) + 12);
constexpr auto PASS_COMPUTE = 1 << (OPERABLE(PassType::COMPUTE) + 12);
constexpr auto PASS_COPY = 1 << (OPERABLE(PassType::COPY) + 12);
constexpr auto PASS_MOVE = 1 << (OPERABLE(PassType::MOVE) + 12);
constexpr auto PASS_RAYTRACE = 1 << (OPERABLE(PassType::RAYTRACE) + 12);
constexpr auto PASS_PRESENT = 1 << (OPERABLE(PassType::PRESENT) + 12);
constexpr auto RES_BUFFER = 1 << (OPERABLE(ResourceType::BUFFER) + 10);
constexpr auto RES_TEXTURE = 1 << (OPERABLE(ResourceType::TEXTURE) + 10);
constexpr auto SHADERSTAGE_VERT = 1 << 8;
constexpr auto SHADERSTAGE_FRAG = 1 << 9;
constexpr auto CMN_COPY_SRC = OPERABLE(CommonUsage::COPY_SRC);
constexpr auto CMN_COPY_DST = OPERABLE(CommonUsage::COPY_DST);
constexpr auto CMN_ROM = OPERABLE(CommonUsage::ROM);
constexpr auto CMN_STORAGE = OPERABLE(CommonUsage::STORAGE);
constexpr auto CMN_IB_OR_CA = OPERABLE(CommonUsage::IB_OR_CA);
constexpr auto CMN_VB_OR_DS = OPERABLE(CommonUsage::VB_OR_DS);
constexpr auto CMN_INDIRECT_OR_INPUT = OPERABLE(CommonUsage::INDIRECT_OR_INPUT);

constexpr std::array<AccessElem, 28> ACCESS_MAP = {{
    {CARE_MEMACCESS,
     0x0,
     AccessFlags::NONE},

    {CARE_MEMUSAGE,
     0x0,
     AccessFlags::NONE},

    {IGNORE_PASSTYPE & IGNORE_SHADERSTAGE,
     ACCESS_READ | MEM_DEVICE | RES_BUFFER | CMN_INDIRECT_OR_INPUT,
     AccessFlags::INDIRECT_BUFFER},

    {IGNORE_SHADERSTAGE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_BUFFER | CMN_IB_OR_CA,
     AccessFlags::INDEX_BUFFER}, // buffer usage indicates what it is, so shader stage ignored.

    {IGNORE_SHADERSTAGE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_BUFFER | CMN_VB_OR_DS,
     AccessFlags::VERTEX_BUFFER}, // ditto

    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_BUFFER | SHADERSTAGE_VERT | CMN_ROM,
     AccessFlags::VERTEX_SHADER_READ_UNIFORM_BUFFER},

    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_VERT | CMN_ROM,
     AccessFlags::VERTEX_SHADER_READ_TEXTURE},

    {IGNORE_RESTYPE & IGNORE_CMNUSAGE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | SHADERSTAGE_VERT,
     AccessFlags::VERTEX_SHADER_READ_OTHER},

    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_BUFFER | SHADERSTAGE_FRAG | CMN_ROM,
     AccessFlags::FRAGMENT_SHADER_READ_UNIFORM_BUFFER},

    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_ROM,
     AccessFlags::FRAGMENT_SHADER_READ_TEXTURE},

    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_IB_OR_CA | CMN_INDIRECT_OR_INPUT,
     AccessFlags::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT},

    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_VB_OR_DS | CMN_INDIRECT_OR_INPUT,
     AccessFlags::FRAGMENT_SHADER_READ_DEPTH_STENCIL_INPUT_ATTACHMENT},

    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | SHADERSTAGE_FRAG,
     AccessFlags::FRAGMENT_SHADER_READ_OTHER},

    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_IB_OR_CA,
     AccessFlags::COLOR_ATTACHMENT_READ},

    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_VB_OR_DS,
     AccessFlags::DEPTH_STENCIL_ATTACHMENT_READ},

    {IGNORE_PASSTYPE & IGNORE_SHADERSTAGE,
     ACCESS_READ | MEM_DEVICE | RES_BUFFER | CMN_ROM,
     AccessFlags::COMPUTE_SHADER_READ_UNIFORM_BUFFER},

    {IGNORE_PASSTYPE & IGNORE_SHADERSTAGE,
     ACCESS_READ | MEM_DEVICE | RES_TEXTURE | CMN_ROM,
     AccessFlags::COMPUTE_SHADER_READ_TEXTURE},

    {CARE_MEMACCESS | CARE_MEMUSAGE,
     ACCESS_READ | MEM_DEVICE,
     AccessFlags::COMPUTE_SHADER_READ_OTHER},

    {CARE_MEMACCESS | CARE_MEMUSAGE | CARE_PASSTYPE,
     ACCESS_READ | MEM_DEVICE | PASS_COMPUTE,
     AccessFlags::TRANSFER_READ},

    {CARE_MEMACCESS | CARE_MEMUSAGE,
     ACCESS_READ | MEM_HOST,
     AccessFlags::HOST_READ},

    {CARE_MEMACCESS | CARE_MEMUSAGE | CARE_PASSTYPE,
     ACCESS_READ | MEM_DEVICE | PASS_PRESENT,
     AccessFlags::PRESENT},

    {IGNORE_RESTYPE & IGNORE_CMNUSAGE,
     ACCESS_WRITE | MEM_DEVICE | PASS_RASTER | SHADERSTAGE_VERT,
     AccessFlags::VERTEX_SHADER_WRITE},

    {IGNORE_RESTYPE & IGNORE_CMNUSAGE,
     ACCESS_WRITE | MEM_DEVICE | PASS_RASTER | SHADERSTAGE_FRAG,
     AccessFlags::FRAGMENT_SHADER_WRITE},

    {IGNORE_NONE,
     ACCESS_WRITE | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_IB_OR_CA,
     AccessFlags::COLOR_ATTACHMENT_WRITE},

    {IGNORE_NONE,
     ACCESS_WRITE | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_VB_OR_DS,
     AccessFlags::DEPTH_STENCIL_ATTACHMENT_WRITE},

    {CARE_MEMACCESS | CARE_MEMUSAGE,
     ACCESS_WRITE | MEM_DEVICE,
     AccessFlags::COMPUTE_SHADER_WRITE},

    {CARE_MEMACCESS | CARE_MEMUSAGE | CARE_PASSTYPE,
     ACCESS_WRITE | MEM_DEVICE | PASS_COPY,
     AccessFlags::TRANSFER_WRITE},

    {CARE_MEMACCESS | CARE_MEMUSAGE,
     ACCESS_WRITE | MEM_HOST,
     AccessFlags::HOST_WRITE},
}};

} // namespace

AccessFlags getAccessFlags(
    BufferUsage usage, MemoryUsage memUsage,
    ShaderStageFlags visibility,
    MemoryAccessBit access,
    PassType passType) noexcept {
    uint32_t info = 0xFFFFFFFF;
    info &= (OPERABLE(access) << 20 | IGNORE_MEMACCESS);
    info &= (OPERABLE(memUsage) << 18 | IGNORE_MEMUSAGE);
    info &= (1 << (OPERABLE(passType) + 12) | IGNORE_PASSTYPE);
    info &= (1 << (OPERABLE(ResourceType::BUFFER) + 10) | IGNORE_RESTYPE);
    switch (visibility) {
        case ShaderStageFlags::NONE:
            info &= IGNORE_SHADERSTAGE;
            break;
        case ShaderStageFlags::VERTEX:
            info &= ((1 << 8) | IGNORE_SHADERSTAGE);
            break;
        case ShaderStageFlags::FRAGMENT:
            info &= ((1 << 9) | IGNORE_SHADERSTAGE);
            break;
        default:
            info |= ((0b11 << 8) | IGNORE_SHADERSTAGE);
    }
    info &= OPERABLE(usage) | IGNORE_CMNUSAGE;

    AccessFlags flags{AccessFlags::NONE};
    for (const auto& elem : ACCESS_MAP) {
        auto testFlag = info & elem.mask;
        // hasKey
        if ((testFlag & elem.key) == elem.key) {
            flags |= elem.access;
        }
    }
    return flags;
}

AccessFlags getAccessFlags(
    TextureUsage usage,
    ShaderStageFlags visibility,
    MemoryAccessBit access,
    PassType passType) noexcept {
    uint32_t info = 0xFFFFFFFF;
    info &= (OPERABLE(access) << 20 | IGNORE_MEMACCESS);
    info &= MEM_DEVICE;
    info &= (1 << (OPERABLE(passType) + 12) | IGNORE_PASSTYPE);
    info &= (1 << (OPERABLE(ResourceType::BUFFER) + 10) | IGNORE_RESTYPE);
    switch (visibility) {
        case ShaderStageFlags::NONE:
            info &= IGNORE_SHADERSTAGE;
            break;
        case ShaderStageFlags::VERTEX:
            info &= ((1 << 8) | IGNORE_SHADERSTAGE);
            break;
        case ShaderStageFlags::FRAGMENT:
            info &= ((1 << 9) | IGNORE_SHADERSTAGE);
            break;
        default:
            info |= ((0b11 << 8) | IGNORE_SHADERSTAGE);
    }
    info &= OPERABLE(usage) | IGNORE_CMNUSAGE;

    AccessFlags flags{AccessFlags::NONE};
    for (const auto& elem : ACCESS_MAP) {
        auto testFlag = info & elem.mask;
        // hasKey
        if ((testFlag & elem.key) == elem.key) {
            flags |= elem.access;
        }
    }
    return flags;
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
