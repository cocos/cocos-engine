/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "base/CoreStd.h"
#include "base/Utils.h"

#include "GFXDef.h"
#include "GFXTexture.h"
#include "gfx-base/GFXDef-common.h"

namespace std {
std::size_t hash<cc::gfx::RenderPassInfo>::operator()(const cc::gfx::RenderPassInfo& info) const {
    static auto computeAttachmentHash = [](const cc::gfx::ColorAttachment& attachment, uint32_t& seed) {
        seed ^= toNumber(attachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= toNumber(attachment.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= toNumber(attachment.loadOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= toNumber(attachment.storeOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        for (cc::gfx::AccessType type : attachment.beginAccesses) {
            seed ^= toNumber(type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
        for (cc::gfx::AccessType type : attachment.endAccesses) {
            seed ^= toNumber(type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
    };
    static auto computeDSAttachmentHash = [](const cc::gfx::DepthStencilAttachment& attachment, uint32_t& seed) {
        seed ^= toNumber(attachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= toNumber(attachment.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= toNumber(attachment.depthLoadOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= toNumber(attachment.depthStoreOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= toNumber(attachment.stencilLoadOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= toNumber(attachment.stencilStoreOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        for (auto type : attachment.beginAccesses) {
            seed ^= toNumber(type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
        for (auto type : attachment.endAccesses) {
            seed ^= toNumber(type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
    };
    uint32_t seed = 0;
    if (!info.subpasses.empty()) {
        for (const auto& subpass : info.subpasses) {
            for (const uint32_t iaIndex : subpass.inputs) {
                if (iaIndex >= info.colorAttachments.size()) break;
                const auto& ia = info.colorAttachments[iaIndex];
                seed += cc::utils::toUint(4 + ia.beginAccesses.size() + ia.endAccesses.size());
            }
            for (const uint32_t caIndex : subpass.colors) {
                if (caIndex >= info.colorAttachments.size()) break;
                const auto& ca = info.colorAttachments[caIndex];
                seed += cc::utils::toUint(4 + ca.beginAccesses.size() + ca.endAccesses.size());
            }
            for (const uint32_t raIndex : subpass.resolves) {
                if (raIndex >= info.colorAttachments.size()) break;
                const auto& ra = info.colorAttachments[raIndex];
                seed += cc::utils::toUint(4 + ra.beginAccesses.size() + ra.endAccesses.size());
            }
            for (const uint32_t paIndex : subpass.preserves) {
                if (paIndex >= info.colorAttachments.size()) break;
                const auto& pa = info.colorAttachments[paIndex];
                seed += cc::utils::toUint(4 + pa.beginAccesses.size() + pa.endAccesses.size());
            }
            if (subpass.depthStencil != cc::gfx::INVALID_BINDING) {
                if (subpass.depthStencil < info.colorAttachments.size()) {
                    const auto& ds = info.colorAttachments[subpass.depthStencil];
                    seed += cc::utils::toUint(4 + ds.beginAccesses.size() + ds.endAccesses.size());
                } else {
                    const auto& ds = info.depthStencilAttachment;
                    seed += cc::utils::toUint(6 + ds.beginAccesses.size() + ds.endAccesses.size());
                }
            }
        }
        for (const auto& subpass : info.subpasses) {
            for (const uint32_t iaIndex : subpass.inputs) {
                if (iaIndex >= info.colorAttachments.size()) break;
                computeAttachmentHash(info.colorAttachments[iaIndex], seed);
            }
            for (const uint32_t caIndex : subpass.colors) {
                if (caIndex >= info.colorAttachments.size()) break;
                computeAttachmentHash(info.colorAttachments[caIndex], seed);
            }
            for (const uint32_t raIndex : subpass.resolves) {
                if (raIndex >= info.colorAttachments.size()) break;
                computeAttachmentHash(info.colorAttachments[raIndex], seed);
            }
            for (const uint32_t paIndex : subpass.preserves) {
                if (paIndex >= info.colorAttachments.size()) break;
                computeAttachmentHash(info.colorAttachments[paIndex], seed);
            }
            if (subpass.depthStencil != cc::gfx::INVALID_BINDING) {
                if (subpass.depthStencil < info.colorAttachments.size()) {
                    computeAttachmentHash(info.colorAttachments[subpass.depthStencil], seed);
                } else {
                    computeDSAttachmentHash(info.depthStencilAttachment, seed);
                }
            }
        }
    } else {
        for (const auto& ca : info.colorAttachments) {
            seed += cc::utils::toUint(4 + ca.beginAccesses.size() + ca.endAccesses.size());
        }
        seed += cc::utils::toUint(6 + info.depthStencilAttachment.beginAccesses.size() + info.depthStencilAttachment.endAccesses.size());

        for (const auto& ca : info.colorAttachments) {
            computeAttachmentHash(ca, seed);
        }
        computeDSAttachmentHash(info.depthStencilAttachment, seed);
    }

    return seed;
}

std::size_t hash<cc::gfx::FramebufferInfo>::operator()(const cc::gfx::FramebufferInfo& info) const {
    auto seed = cc::utils::toUint(info.colorTextures.size() * 2 + (info.depthStencilTexture ? 2 : 0));
    for (const auto* attachment : info.colorTextures) {
        seed ^= attachment->getHash() + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= attachment->getTypedID() + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }
    if (info.depthStencilTexture) {
        seed ^= info.depthStencilTexture->getHash() + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= info.depthStencilTexture->getTypedID() + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }
    return seed;
}

std::size_t hash<cc::gfx::TextureInfo>::operator()(const cc::gfx::TextureInfo& info) const {
    uint32_t seed = 10;
    seed ^= toNumber(info.type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= toNumber(info.usage) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= toNumber(info.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= toNumber(info.flags) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= toNumber(info.samples) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= info.width + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= info.height + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= info.depth + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= info.layerCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= info.levelCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    return seed;
}

std::size_t hash<cc::gfx::TextureViewInfo>::operator()(const cc::gfx::TextureViewInfo& info) const {
    uint32_t seed = 7;
    seed ^= info.texture->getHash() + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= toNumber(info.type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= toNumber(info.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= info.baseLevel + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= info.levelCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= info.baseLayer + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= info.layerCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    return seed;
}

std::size_t hash<cc::gfx::BufferInfo>::operator()(const cc::gfx::BufferInfo& info) const {
    uint32_t seed = 4;
    seed ^= toNumber(info.usage) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= toNumber(info.memUsage) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= toNumber(info.flags) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= info.size + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    return seed;
}
} // namespace std

namespace cc {
namespace gfx {

bool operator==(const ColorAttachment& lhs, const ColorAttachment& rhs) {
    return lhs.format == rhs.format &&
           lhs.sampleCount == rhs.sampleCount &&
           lhs.loadOp == rhs.loadOp &&
           lhs.storeOp == rhs.storeOp &&
           lhs.isGeneralLayout == rhs.isGeneralLayout &&
           lhs.beginAccesses == rhs.beginAccesses &&
           lhs.endAccesses == rhs.endAccesses;
}

bool operator==(const DepthStencilAttachment& lhs, const DepthStencilAttachment& rhs) {
    return lhs.format == rhs.format &&
           lhs.sampleCount == rhs.sampleCount &&
           lhs.depthLoadOp == rhs.depthLoadOp &&
           lhs.depthStoreOp == rhs.depthStoreOp &&
           lhs.stencilLoadOp == rhs.stencilLoadOp &&
           lhs.stencilStoreOp == rhs.stencilStoreOp &&
           lhs.isGeneralLayout == rhs.isGeneralLayout &&
           lhs.beginAccesses == rhs.beginAccesses &&
           lhs.endAccesses == rhs.endAccesses;
}

bool operator==(const SubpassInfo& lhs, const SubpassInfo& rhs) {
    return lhs.colors == rhs.colors &&
           lhs.resolves == rhs.resolves &&
           lhs.inputs == rhs.inputs &&
           lhs.preserves == rhs.preserves &&
           lhs.depthStencil == rhs.depthStencil &&
           lhs.depthStencilResolve == rhs.depthStencilResolve &&
           lhs.depthResolveMode == rhs.depthResolveMode &&
           lhs.stencilResolveMode == rhs.stencilResolveMode;
}

bool operator==(const SubpassDependency& lhs, const SubpassDependency& rhs) {
    return lhs.srcAccesses == rhs.srcAccesses &&
           lhs.dstAccesses == rhs.dstAccesses &&
           lhs.srcSubpass == rhs.srcSubpass &&
           lhs.dstSubpass == rhs.dstSubpass;
}

bool operator==(const RenderPassInfo& lhs, const RenderPassInfo& rhs) {
    return lhs.colorAttachments == rhs.colorAttachments &&
           lhs.depthStencilAttachment == rhs.depthStencilAttachment &&
           lhs.subpasses == rhs.subpasses &&
           lhs.dependencies == rhs.dependencies;
}

bool operator==(const FramebufferInfo& lhs, const FramebufferInfo& rhs) {
    return lhs.renderPass == rhs.renderPass &&
           lhs.colorTextures == rhs.colorTextures &&
           lhs.depthStencilTexture == rhs.depthStencilTexture;
}

bool operator==(const TextureInfo& lhs, const TextureInfo& rhs) {
    return !memcmp(&lhs, &rhs, sizeof(TextureInfo));
}

bool operator==(const TextureViewInfo& lhs, const TextureViewInfo& rhs) {
    return !memcmp(&lhs, &rhs, sizeof(TextureViewInfo));
}

bool operator==(const BufferInfo& lhs, const BufferInfo& rhs) {
    return !memcmp(&lhs, &rhs, sizeof(BufferInfo));
}

const FormatInfo GFX_FORMAT_INFOS[] = {
    {"UNKNOWN", 0, 0, FormatType::NONE, false, false, false, false},
    {"A8", 1, 1, FormatType::UNORM, true, false, false, false},
    {"L8", 1, 1, FormatType::UNORM, false, false, false, false},
    {"LA8", 1, 2, FormatType::UNORM, false, false, false, false},

    {"R8", 1, 1, FormatType::UNORM, false, false, false, false},
    {"R8SN", 1, 1, FormatType::SNORM, false, false, false, false},
    {"R8UI", 1, 1, FormatType::UINT, false, false, false, false},
    {"R8I", 1, 1, FormatType::INT, false, false, false, false},
    {"R16F", 2, 1, FormatType::FLOAT, false, false, false, false},
    {"R16UI", 2, 1, FormatType::UINT, false, false, false, false},
    {"R16I", 2, 1, FormatType::INT, false, false, false, false},
    {"R32F", 4, 1, FormatType::FLOAT, false, false, false, false},
    {"R32UI", 4, 1, FormatType::UINT, false, false, false, false},
    {"R32I", 4, 1, FormatType::INT, false, false, false, false},

    {"RG8", 2, 2, FormatType::UNORM, false, false, false, false},
    {"RG8SN", 2, 2, FormatType::SNORM, false, false, false, false},
    {"RG8UI", 2, 2, FormatType::UINT, false, false, false, false},
    {"RG8I", 2, 2, FormatType::INT, false, false, false, false},
    {"RG16F", 4, 2, FormatType::FLOAT, false, false, false, false},
    {"RG16UI", 4, 2, FormatType::UINT, false, false, false, false},
    {"RG16I", 4, 2, FormatType::INT, false, false, false, false},
    {"RG32F", 8, 2, FormatType::FLOAT, false, false, false, false},
    {"RG32UI", 8, 2, FormatType::UINT, false, false, false, false},
    {"RG32I", 8, 2, FormatType::INT, false, false, false, false},

    {"RGB8", 3, 3, FormatType::UNORM, false, false, false, false},
    {"SRGB8", 3, 3, FormatType::UNORM, false, false, false, false},
    {"RGB8SN", 3, 3, FormatType::SNORM, false, false, false, false},
    {"RGB8UI", 3, 3, FormatType::UINT, false, false, false, false},
    {"RGB8I", 3, 3, FormatType::INT, false, false, false, false},
    {"RGB16F", 6, 3, FormatType::FLOAT, false, false, false, false},
    {"RGB16UI", 6, 3, FormatType::UINT, false, false, false, false},
    {"RGB16I", 6, 3, FormatType::INT, false, false, false, false},
    {"RGB32F", 12, 3, FormatType::FLOAT, false, false, false, false},
    {"RGB32UI", 12, 3, FormatType::UINT, false, false, false, false},
    {"RGB32I", 12, 3, FormatType::INT, false, false, false, false},

    {"RGBA8", 4, 4, FormatType::UNORM, true, false, false, false},
    {"BGRA8", 4, 4, FormatType::UNORM, true, false, false, false},
    {"SRGB8_A8", 4, 4, FormatType::UNORM, true, false, false, false},
    {"RGBA8SN", 4, 4, FormatType::SNORM, true, false, false, false},
    {"RGBA8UI", 4, 4, FormatType::UINT, true, false, false, false},
    {"RGBA8I", 4, 4, FormatType::INT, true, false, false, false},
    {"RGBA16F", 8, 4, FormatType::FLOAT, true, false, false, false},
    {"RGBA16UI", 8, 4, FormatType::UINT, true, false, false, false},
    {"RGBA16I", 8, 4, FormatType::INT, true, false, false, false},
    {"RGBA32F", 16, 4, FormatType::FLOAT, true, false, false, false},
    {"RGBA32UI", 16, 4, FormatType::UINT, true, false, false, false},
    {"RGBA32I", 16, 4, FormatType::INT, true, false, false, false},

    {"R5G6B5", 2, 3, FormatType::UNORM, false, false, false, false},
    {"R11G11B10F", 4, 3, FormatType::FLOAT, false, false, false, false},
    {"RGB5A1", 2, 4, FormatType::UNORM, true, false, false, false},
    {"RGBA4", 2, 4, FormatType::UNORM, true, false, false, false},
    {"RGB10A2", 2, 4, FormatType::UNORM, true, false, false, false},
    {"RGB10A2UI", 2, 4, FormatType::UINT, true, false, false, false},
    {"RGB9E5", 2, 4, FormatType::FLOAT, true, false, false, false},

    {"DEPTH", 4, 1, FormatType::FLOAT, false, true, false, false},
    {"DEPTH_STENCIL", 5, 2, FormatType::FLOAT, false, true, true, false},

    {"BC1", 1, 3, FormatType::UNORM, false, false, false, true},
    {"BC1_ALPHA", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC1_SRGB", 1, 3, FormatType::UNORM, false, false, false, true},
    {"BC1_SRGB_ALPHA", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC2", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC2_SRGB", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC3", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC3_SRGB", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC4", 1, 1, FormatType::UNORM, false, false, false, true},
    {"BC4_SNORM", 1, 1, FormatType::SNORM, false, false, false, true},
    {"BC5", 1, 2, FormatType::UNORM, false, false, false, true},
    {"BC5_SNORM", 1, 2, FormatType::SNORM, false, false, false, true},
    {"BC6H_UF16", 1, 3, FormatType::UFLOAT, false, false, false, true},
    {"BC6H_SF16", 1, 3, FormatType::FLOAT, false, false, false, true},
    {"BC7", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC7_SRGB", 1, 4, FormatType::UNORM, true, false, false, true},

    {"ETC_RGB8", 1, 3, FormatType::UNORM, false, false, false, true},
    {"ETC2_RGB8", 1, 3, FormatType::UNORM, false, false, false, true},
    {"ETC2_SRGB8", 1, 3, FormatType::UNORM, false, false, false, true},
    {"ETC2_RGB8_A1", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ETC2_SRGB8_A1", 1, 4, FormatType::UNORM, true, false, false, true},
    {"EAC_R11", 1, 1, FormatType::UNORM, false, false, false, true},
    {"EAC_R11SN", 1, 1, FormatType::SNORM, false, false, false, true},
    {"EAC_RG11", 2, 2, FormatType::UNORM, false, false, false, true},
    {"EAC_RG11SN", 2, 2, FormatType::SNORM, false, false, false, true},

    {"PVRTC_RGB2", 2, 3, FormatType::UNORM, false, false, false, true},
    {"PVRTC_RGBA2", 2, 4, FormatType::UNORM, true, false, false, true},
    {"PVRTC_RGB4", 2, 3, FormatType::UNORM, false, false, false, true},
    {"PVRTC_RGBA4", 2, 4, FormatType::UNORM, true, false, false, true},
    {"PVRTC2_2BPP", 2, 4, FormatType::UNORM, true, false, false, true},
    {"PVRTC2_4BPP", 2, 4, FormatType::UNORM, true, false, false, true},

    {"ASTC_RGBA_4X4", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_5X4", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_5X5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_6X5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_6X6", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_8X5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_8X6", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_8X8", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_10X5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_10X6", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_10X8", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_10X10", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_12X10", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_12X12", 1, 4, FormatType::UNORM, true, false, false, true},

    {"ASTC_SRGBA_4X4", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_5X4", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_5X5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_6X5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_6X6", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_8X5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_8X6", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_8X8", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_10X5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_10X6", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_10X8", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_10X10", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_12X10", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_12X12", 1, 4, FormatType::UNORM, true, false, false, true},
};

bool isCombinedImageSampler(Type type) { return type >= Type::SAMPLER1D && type <= Type::SAMPLER_CUBE; }
bool isSampledImage(Type type) { return type >= Type::TEXTURE1D && type <= Type::TEXTURE_CUBE; }
bool isStorageImage(Type type) { return type >= Type::IMAGE1D && type <= Type::IMAGE_CUBE; }

uint32_t ceilDiv(uint32_t x, uint32_t y) { return (x - 1) / y + 1; }

uint32_t formatSize(Format format, uint32_t width, uint32_t height, uint32_t depth) {
    if (!GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].isCompressed) {
        return (width * height * depth * GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].size);
    }
    switch (format) {
        case Format::BC1:
        case Format::BC1_ALPHA:
        case Format::BC1_SRGB:
        case Format::BC1_SRGB_ALPHA:
            return ceilDiv(width, 4) * ceilDiv(height, 4) * 8 * depth;
        case Format::BC2:
        case Format::BC2_SRGB:
        case Format::BC3:
        case Format::BC3_SRGB:
        case Format::BC4:
        case Format::BC4_SNORM:
        case Format::BC6H_SF16:
        case Format::BC6H_UF16:
        case Format::BC7:
        case Format::BC7_SRGB:
            return ceilDiv(width, 4) * ceilDiv(height, 4) * 16 * depth;
        case Format::BC5:
        case Format::BC5_SNORM:
            return ceilDiv(width, 4) * ceilDiv(height, 4) * 32 * depth;

        case Format::ETC_RGB8:
        case Format::ETC2_RGB8:
        case Format::ETC2_SRGB8:
        case Format::ETC2_RGB8_A1:
        case Format::EAC_R11:
        case Format::EAC_R11SN:
            return ceilDiv(width, 4) * ceilDiv(height, 4) * 8 * depth;
        case Format::ETC2_RGBA8:
        case Format::ETC2_SRGB8_A1:
        case Format::EAC_RG11:
        case Format::EAC_RG11SN:
            return ceilDiv(width, 4) * ceilDiv(height, 4) * 16 * depth;

        case Format::PVRTC_RGB2:
        case Format::PVRTC_RGBA2:
        case Format::PVRTC2_2BPP:
            return ceilDiv(std::max(width, 16U) * std::max(height, 8U), 4) * depth;
        case Format::PVRTC_RGB4:
        case Format::PVRTC_RGBA4:
        case Format::PVRTC2_4BPP:
            return ceilDiv(std::max(width, 16U) * std::max(height, 8U), 2) * depth;

        case Format::ASTC_RGBA_4X4:
        case Format::ASTC_SRGBA_4X4:
            return ceilDiv(width, 4) * ceilDiv(height, 4) * 16 * depth;
        case Format::ASTC_RGBA_5X4:
        case Format::ASTC_SRGBA_5X4:
            return ceilDiv(width, 5) * ceilDiv(height, 4) * 16 * depth;
        case Format::ASTC_RGBA_5X5:
        case Format::ASTC_SRGBA_5X5:
            return ceilDiv(width, 5) * ceilDiv(height, 5) * 16 * depth;
        case Format::ASTC_RGBA_6X5:
        case Format::ASTC_SRGBA_6X5:
            return ceilDiv(width, 6) * ceilDiv(height, 5) * 16 * depth;
        case Format::ASTC_RGBA_6X6:
        case Format::ASTC_SRGBA_6X6:
            return ceilDiv(width, 6) * ceilDiv(height, 6) * 16 * depth;
        case Format::ASTC_RGBA_8X5:
        case Format::ASTC_SRGBA_8X5:
            return ceilDiv(width, 8) * ceilDiv(height, 5) * 16 * depth;
        case Format::ASTC_RGBA_8X6:
        case Format::ASTC_SRGBA_8X6:
            return ceilDiv(width, 8) * ceilDiv(height, 6) * 16 * depth;
        case Format::ASTC_RGBA_8X8:
        case Format::ASTC_SRGBA_8X8:
            return ceilDiv(width, 8) * ceilDiv(height, 8) * 16 * depth;
        case Format::ASTC_RGBA_10X5:
        case Format::ASTC_SRGBA_10X5:
            return ceilDiv(width, 10) * ceilDiv(height, 5) * 16 * depth;
        case Format::ASTC_RGBA_10X6:
        case Format::ASTC_SRGBA_10X6:
            return ceilDiv(width, 10) * ceilDiv(height, 6) * 16 * depth;
        case Format::ASTC_RGBA_10X8:
        case Format::ASTC_SRGBA_10X8:
            return ceilDiv(width, 10) * ceilDiv(height, 8) * 16 * depth;
        case Format::ASTC_RGBA_10X10:
        case Format::ASTC_SRGBA_10X10:
            return ceilDiv(width, 10) * ceilDiv(height, 10) * 16 * depth;
        case Format::ASTC_RGBA_12X10:
        case Format::ASTC_SRGBA_12X10:
            return ceilDiv(width, 12) * ceilDiv(height, 10) * 16 * depth;
        case Format::ASTC_RGBA_12X12:
        case Format::ASTC_SRGBA_12X12:
            return ceilDiv(width, 12) * ceilDiv(height, 12) * 16 * depth;
        default:
            return 0;
    }
}

const uint32_t GFX_TYPE_SIZES[] = {
    0,  // UNKNOWN
    4,  // BOOL
    8,  // BOOL2
    12, // BOOL3
    16, // BOOL4
    4,  // INT
    8,  // INT2
    12, // INT3
    16, // INT4
    4,  // UINT
    8,  // UINT2
    12, // UINT3
    16, // UINT4
    4,  // FLOAT
    8,  // FLOAT2
    12, // FLOAT3
    16, // FLOAT4
    16, // MAT2
    24, // MAT2X3
    32, // MAT2X4
    24, // MAT3X2
    36, // MAT3
    48, // MAT3X4
    32, // MAT4X2
    48, // MAT4X3
    64, // MAT4
    4,  // SAMPLER1D
    4,  // SAMPLER1D_ARRAY
    4,  // SAMPLER2D
    4,  // SAMPLER2D_ARRAY
    4,  // SAMPLER3D
    4,  // SAMPLER_CUBE
};

uint32_t formatSurfaceSize(Format format, uint32_t width, uint32_t height, uint32_t depth, uint32_t mips) {
    uint32_t size = 0;

    for (uint32_t i = 0; i < mips; ++i) {
        size += formatSize(format, width, height, depth);
        width  = std::max(width >> 1, 1U);
        height = std::max(height >> 1, 1U);
    }

    return size;
}

} // namespace gfx
} // namespace cc
