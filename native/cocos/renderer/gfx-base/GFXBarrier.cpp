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
    // 0
    {CARE_MEMACCESS,
     0x0,
     AccessFlags::NONE},

    // 1
    {CARE_MEMUSAGE,
     0x0,
     AccessFlags::NONE},

    // 2
    {IGNORE_PASSTYPE & IGNORE_SHADERSTAGE,
     ACCESS_READ | MEM_DEVICE | RES_BUFFER | CMN_INDIRECT_OR_INPUT,
     AccessFlags::INDIRECT_BUFFER},

    // 3
    {IGNORE_SHADERSTAGE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_BUFFER | CMN_IB_OR_CA,
     AccessFlags::INDEX_BUFFER}, // buffer usage indicates what it is, so shader stage ignored.

    // 4
    {IGNORE_SHADERSTAGE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_BUFFER | CMN_VB_OR_DS,
     AccessFlags::VERTEX_BUFFER}, // ditto

    // 5
    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_BUFFER | SHADERSTAGE_VERT | CMN_ROM,
     AccessFlags::VERTEX_SHADER_READ_UNIFORM_BUFFER},

    // 6
    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_VERT | CMN_ROM,
     AccessFlags::VERTEX_SHADER_READ_TEXTURE},

    // 7
    {IGNORE_RESTYPE & IGNORE_CMNUSAGE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | SHADERSTAGE_VERT,
     AccessFlags::VERTEX_SHADER_READ_OTHER},

    // 8
    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_BUFFER | SHADERSTAGE_FRAG | CMN_ROM,
     AccessFlags::FRAGMENT_SHADER_READ_UNIFORM_BUFFER},

    // 9
    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_ROM,
     AccessFlags::FRAGMENT_SHADER_READ_TEXTURE},

    // 10
    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_IB_OR_CA | CMN_INDIRECT_OR_INPUT,
     AccessFlags::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT},

    // 11
    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_VB_OR_DS | CMN_INDIRECT_OR_INPUT,
     AccessFlags::FRAGMENT_SHADER_READ_DEPTH_STENCIL_INPUT_ATTACHMENT},

    // 12
    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | SHADERSTAGE_FRAG,
     AccessFlags::FRAGMENT_SHADER_READ_OTHER},

    // 13
    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_IB_OR_CA,
     AccessFlags::COLOR_ATTACHMENT_READ},

    // 14
    {IGNORE_NONE,
     ACCESS_READ | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_VB_OR_DS,
     AccessFlags::DEPTH_STENCIL_ATTACHMENT_READ},

    // 15
    {IGNORE_PASSTYPE & IGNORE_SHADERSTAGE | CARE_PASSTYPE,
     ACCESS_READ | MEM_DEVICE | RES_BUFFER | CMN_ROM,
     AccessFlags::COMPUTE_SHADER_READ_UNIFORM_BUFFER},

    // 16
    {IGNORE_PASSTYPE & IGNORE_SHADERSTAGE | CARE_PASSTYPE,
     ACCESS_READ | MEM_DEVICE | RES_TEXTURE | CMN_ROM,
     AccessFlags::COMPUTE_SHADER_READ_TEXTURE},

    // 17
    {CARE_MEMACCESS | CARE_MEMUSAGE | CARE_PASSTYPE,
     ACCESS_READ | MEM_DEVICE,
     AccessFlags::COMPUTE_SHADER_READ_OTHER},

    // 18
    {CARE_MEMACCESS | CARE_MEMUSAGE | CARE_PASSTYPE,
     ACCESS_READ | MEM_DEVICE | PASS_COMPUTE,
     AccessFlags::TRANSFER_READ},

    // 19
    {CARE_MEMACCESS | CARE_MEMUSAGE,
     ACCESS_READ | MEM_HOST,
     AccessFlags::HOST_READ},

    // 20
    {CARE_MEMACCESS | CARE_MEMUSAGE | CARE_PASSTYPE,
     ACCESS_READ | MEM_DEVICE | PASS_PRESENT,
     AccessFlags::PRESENT},

    // 21
    {IGNORE_RESTYPE & IGNORE_CMNUSAGE,
     ACCESS_WRITE | MEM_DEVICE | PASS_RASTER | SHADERSTAGE_VERT,
     AccessFlags::VERTEX_SHADER_WRITE},

    // 22
    {IGNORE_RESTYPE,
     ACCESS_WRITE | MEM_DEVICE | PASS_RASTER | SHADERSTAGE_FRAG,
     AccessFlags::FRAGMENT_SHADER_WRITE},

    // 23
    {IGNORE_NONE,
     ACCESS_WRITE | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_IB_OR_CA,
     AccessFlags::COLOR_ATTACHMENT_WRITE},

    // 24
    {IGNORE_NONE,
     ACCESS_WRITE | MEM_DEVICE | PASS_RASTER | RES_TEXTURE | SHADERSTAGE_FRAG | CMN_VB_OR_DS,
     AccessFlags::DEPTH_STENCIL_ATTACHMENT_WRITE},

    // 25
    {CARE_MEMACCESS | CARE_MEMUSAGE | CARE_PASSTYPE,
     ACCESS_WRITE | MEM_DEVICE,
     AccessFlags::COMPUTE_SHADER_WRITE},

    // 26
    {CARE_MEMACCESS | CARE_MEMUSAGE | CARE_PASSTYPE,
     ACCESS_WRITE | MEM_DEVICE | PASS_COPY,
     AccessFlags::TRANSFER_WRITE},

    // 27
    {CARE_MEMACCESS | CARE_MEMUSAGE,
     ACCESS_WRITE | MEM_HOST,
     AccessFlags::HOST_WRITE},
}};

} // namespace

AccessFlags getAccessFlags(BufferUsage usage, MemoryUsage memUsage,
    ShaderStageFlagBit visibility,
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
        //hasKey
        if ((testFlag & elem.key) == elem.key) {
            flags |= elem.access;
        }
    }
    return flags;
}

AccessFlags getAccessFlags(TextureUsage usage,
    ShaderStageFlagBit visibility,
    MemoryAccessBit access,
    PassType passType) noexcept {
    uint32_t info = 0xFFFFFFFF;
    info &= (OPERABLE(access) << 20 | IGNORE_MEMACCESS);
    info &= MEM_DEVICE | IGNORE_MEMUSAGE;
    info &= (1 << (OPERABLE(passType) + 12) | IGNORE_PASSTYPE);
    info &= (1 << (OPERABLE(ResourceType::TEXTURE) + 10) | IGNORE_RESTYPE);
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
        //hasKey
        if (testFlag == elem.key) {
            flags |= elem.access;
        }
    }
    return flags;
}

} // namespace gfx

} // namespace cc
