#include "CoreStd.h"

#include "GFXDescriptorSetLayout.h"

namespace cc {
namespace gfx {

DescriptorSetLayout::DescriptorSetLayout(Device *device)
: GFXObject(ObjectType::DESCRIPTOR_SET_LAYOUT), _device(device) {
}

DescriptorSetLayout::~DescriptorSetLayout() {
}

} // namespace gfx
} // namespace cc
