#pragma once
#include <cocos/renderer/pipeline/custom/LayoutGraphTypes.h>
#include <cocos/renderer/pipeline/custom/RenderCommonNames.h>

namespace cc {

namespace render {

inline const char* getName(const Constant& /*v*/) noexcept { return "Constant"; }
inline const char* getName(const ConstantBuffer& /*v*/) noexcept { return "ConstantBuffer"; }
inline const char* getName(const DescriptorBlock& /*v*/) noexcept { return "DescriptorBlock"; }
inline const char* getName(const DescriptorArray& /*v*/) noexcept { return "DescriptorArray"; }
inline const char* getName(const UnboundedDescriptor& /*v*/) noexcept { return "UnboundedDescriptor"; }
inline const char* getName(const DescriptorTable& /*v*/) noexcept { return "DescriptorTable"; }
inline const char* getName(const DescriptorSet& /*v*/) noexcept { return "DescriptorSet"; }
inline const char* getName(const LayoutData& /*v*/) noexcept { return "LayoutData"; }
inline const char* getName(const ShaderProgramData& /*v*/) noexcept { return "ShaderProgramData"; }
inline const char* getName(const GroupNodeData& /*v*/) noexcept { return "GroupNodeData"; }
inline const char* getName(const ShaderNodeData& /*v*/) noexcept { return "ShaderNodeData"; }
inline const char* getName(const Group_& /*v*/) noexcept { return "Group"; }
inline const char* getName(const Shader_& /*v*/) noexcept { return "Shader"; }
inline const char* getName(const LayoutGraph& /*v*/) noexcept { return "LayoutGraph"; }

} // namespace render

} // namespace cc
