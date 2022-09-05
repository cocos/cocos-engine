
/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "ImmutableState.h"
#include <vector>
#include "DevicePassResourceTable.h"
#include "gfx-base/GFXDef-common.h"
#include "pipeline/custom/GslUtils.h"

namespace cc {
namespace framegraph {

using gfx::AccessFlags;
using gfx::BufferUsage;
using gfx::hasFlag;
using gfx::MemoryAccess;
using gfx::MemoryUsage;
using gfx::PassType;
using gfx::ShaderStageFlags;
using gfx::TextureUsage;

namespace {
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

std::vector<AccessElem> accessMap = {
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
};
} // namespace

std::pair<gfx::GFXObject*, gfx::GFXObject*> getBarrier(const ResourceBarrier& barrierInfo, const DevicePassResourceTable* dictPtr) noexcept {
    std::pair<gfx::GFXObject*, gfx::GFXObject*> res;

    const auto& dict = *dictPtr;
    if (barrierInfo.resourceType == ResourceType::BUFFER) {
        gfx::Buffer* gfxBuffer{nullptr};
        if (hasFlag(barrierInfo.endStatus.access, MemoryAccess::WRITE_ONLY)) {
            gfxBuffer = dict.getWrite(static_cast<BufferHandle>(barrierInfo.handle));
        } else {
            gfxBuffer = dict.getRead(static_cast<BufferHandle>(barrierInfo.handle));
        }
        gfx::BufferBarrierInfo info;

        auto getGFXAccess = [&gfxBuffer](const AccessStatus& status) {
            auto usage = gfxBuffer->getUsage();
            auto memUsage = gfxBuffer->getMemUsage();

            uint32_t info = 0xFFFFFFFF;
            info &= (OPERABLE(status.access) << 20 | IGNORE_MEMACCESS);
            info &= (OPERABLE(memUsage) << 18 | IGNORE_MEMUSAGE);
            info &= (1 << (OPERABLE(status.passType) + 12) | IGNORE_PASSTYPE);
            info &= (1 << (OPERABLE(ResourceType::BUFFER) + 10) | IGNORE_RESTYPE);
            switch (status.visibility) {
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
            for (const auto& elem : accessMap) {
                auto testFlag = info & elem.mask;
                //hasKey
                if ((testFlag & elem.key) == elem.key) {
                    flags |= elem.access;
                }
            }
            return flags;
        };

        info.prevAccesses = getGFXAccess(barrierInfo.beginStatus);
        info.nextAccesses = getGFXAccess(barrierInfo.endStatus);
        info.offset = static_cast<uint32_t>(barrierInfo.bufferRange.base);
        info.size = static_cast<uint32_t>(barrierInfo.bufferRange.len);
        info.type = barrierInfo.barrierType;

        res.first = gfx::Device::getInstance()->getBufferBarrier(info);
        res.second = gfxBuffer;
    } else if (barrierInfo.resourceType == ResourceType::TEXTURE) {
        gfx::Texture* gfxTexture{nullptr};
        if (hasFlag(barrierInfo.beginStatus.access, MemoryAccess::WRITE_ONLY)) {
            gfxTexture = dict.getWrite(static_cast<TextureHandle>(barrierInfo.handle));
        } else {
            gfxTexture = dict.getRead(static_cast<TextureHandle>(barrierInfo.handle));
        }
        gfx::TextureBarrierInfo info;

        auto getGFXAccess = [&gfxTexture](const AccessStatus& status) {
            auto usage = gfxTexture->getInfo().usage;

            uint32_t info = 0xFFFFFFFF;
            info &= (OPERABLE(status.access) << 20 | IGNORE_MEMACCESS);
            info &= MEM_DEVICE;
            info &= (1 << (OPERABLE(status.passType) + 12) | IGNORE_PASSTYPE);
            info &= (1 << (OPERABLE(ResourceType::BUFFER) + 10) | IGNORE_RESTYPE);
            switch (status.visibility) {
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
            for (const auto& elem : accessMap) {
                auto testFlag = info & elem.mask;
                //hasKey
                if ((testFlag & elem.key) == elem.key) {
                    flags |= elem.access;
                }
            }
            return flags;
        };

        info.type = barrierInfo.barrierType;
        info.prevAccesses = getGFXAccess(barrierInfo.beginStatus);
        info.nextAccesses = getGFXAccess(barrierInfo.endStatus);
        info.baseMipLevel = static_cast<uint32_t>(barrierInfo.mipRange.base);
        info.levelCount = static_cast<uint32_t>(barrierInfo.mipRange.len);
        info.baseSlice = static_cast<uint32_t>(barrierInfo.layerRange.base);
        info.sliceCount = static_cast<uint32_t>(barrierInfo.layerRange.len);

        res.first = gfx::Device::getInstance()->getTextureBarrier(info);
        res.second = gfxTexture;
    }

    return res;
}

} // namespace framegraph
} // namespace cc
