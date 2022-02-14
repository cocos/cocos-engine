#pragma once
#include <cocos/renderer/pipeline/custom/RenderCommonFwd.h>
#include <boost/variant2/variant.hpp>

namespace cc {

namespace render {

struct Constant;
struct ConstantBuffer;

using DescriptorType = boost::variant2::variant<CBuffer_, RWBuffer_, RWTexture_, Buffer_, Texture_, Sampler_>;

struct DescriptorBlock;
struct DescriptorArray;
struct UnboundedDescriptor;
struct DescriptorTable;
struct DescriptorSet;
struct LayoutData;
struct ShaderProgramData;
struct GroupNodeData;
struct ShaderNodeData;
struct Group_;
struct Shader_;
struct LayoutGraph;

} // namespace render

} // namespace cc
