#include "CoreStd.h"

#include "GFXQueue.h"
#include "GFXTextureBarrier.h"

namespace cc {
namespace gfx {

TextureBarrier::TextureBarrier(Device *device)
: GFXObject(ObjectType::TEXTURE_BARRIER), _device(device) {
}

TextureBarrier::~TextureBarrier() {
}

uint TextureBarrier::computeHash(const TextureBarrierInfo &info) {
    uint seed = info.prevAccesses.size() + info.nextAccesses.size() + 3;

    for (const AccessType type : info.prevAccesses) {
        seed ^= (uint)(type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }
    for (const AccessType type : info.nextAccesses) {
        seed ^= (uint)(type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }
    
    seed ^= info.discardContents + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (info.srcQueue ? (uint)info.srcQueue->getType() : 0u) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (info.dstQueue ? (uint)info.dstQueue->getType() : 0u) + 0x9e3779b9 + (seed << 6) + (seed >> 2);

    return seed;
}

} // namespace gfx
} // namespace cc
