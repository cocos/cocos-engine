/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include <boost/variant2/variant.hpp>
#include "cocos/renderer/pipeline/custom/RenderCommonFwd.h"

namespace cc {

namespace render {

struct Constant;
struct ConstantBuffer;

using DescriptorType = boost::variant2::variant<CBufferTag, RWBufferTag, RWTextureTag, BufferTag, TextureTag, SamplerTag>;

struct DescriptorBlock;
struct DescriptorArray;
struct UnboundedDescriptor;
struct DescriptorTable;
struct DescriptorSet;
struct LayoutData;
struct ShaderProgramData;
struct GroupNodeData;
struct ShaderNodeData;
struct GroupTag;
struct ShaderTag;
struct LayoutGraphData;

} // namespace render

} // namespace cc

// clang-format on
