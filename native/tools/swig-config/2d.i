// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// native2d at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="n2d") native2d

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "2d/renderer/RenderDrawInfo.h"
#include "2d/renderer/UIMeshBuffer.h"
#include "2d/renderer/Batcher2d.h"
#include "2d/renderer/RenderEntity.h"
#include "2d/renderer/UIModelProxy.h"
%}

// Insert code at the beginning of generated source file (.cpp)
%{
#include "bindings/auto/jsb_2d_auto.h"
#include "bindings/auto/jsb_scene_auto.h"
#include "bindings/auto/jsb_gfx_auto.h"
#include "bindings/auto/jsb_assets_auto.h"
%}

// ----- Ignore Section ------
// Brief: Classes, methods or attributes need to be ignored
//
// Usage:
//
//  %ignore your_namespace::your_class_name;
//  %ignore your_namespace::your_class_name::your_method_name;
//  %ignore your_namespace::your_class_name::your_attribute_name;
//
// Note:
//  1. 'Ignore Section' should be placed before attribute definition and %import/%include
//  2. namespace is needed
//

%ignore UserData;

%ignore cc::UIMeshBuffer::requireFreeIA;
%ignore cc::UIMeshBuffer::createNewIA;
%ignore cc::UIMeshBuffer::recycleIA;
%ignore cc::UIMeshBuffer::resetIA;
%ignore cc::UIMeshBuffer::parseLayout;
%ignore cc::UIMeshBuffer::getByteOffset;
%ignore cc::UIMeshBuffer::setByteOffset;
%ignore cc::UIMeshBuffer::getVertexOffset;
%ignore cc::UIMeshBuffer::setVertexOffset;
%ignore cc::UIMeshBuffer::getIndexOffset;
%ignore cc::UIMeshBuffer::setIndexOffset;
%ignore cc::UIMeshBuffer::getDirty;
%ignore cc::UIMeshBuffer::setDirty;
%ignore cc::UIMeshBuffer::getAttributes;

%ignore cc::RenderDrawInfo::getBatcher;
%ignore cc::RenderDrawInfo::setBatcher;
%ignore cc::RenderDrawInfo::parseAttrLayout;
%ignore cc::RenderDrawInfo::getRender2dLayout;
%ignore cc::RenderDrawInfo::getStride;
%ignore cc::RenderDrawInfo::getSize;
%ignore cc::RenderDrawInfo::getEnumDrawInfoType;
%ignore cc::RenderDrawInfo::resetMeshIA;

%ignore cc::Batcher2d::addVertDirtyRenderer;
%ignore cc::Batcher2d::getMeshBuffer;
%ignore cc::Batcher2d::getDevice;
%ignore cc::Batcher2d::updateDescriptorSet;
%ignore cc::Batcher2d::fillBuffersAndMergeBatches;
%ignore cc::Batcher2d::walk;
%ignore cc::Batcher2d::generateBatch;
%ignore cc::Batcher2d::resetRenderStates;
%ignore cc::Batcher2d::handleDrawInfo;
%ignore cc::Batcher2d::handleComponentDraw;
%ignore cc::Batcher2d::handleModelDraw;
%ignore cc::Batcher2d::handleIADraw;
%ignore cc::Batcher2d::handleSubNode;

%ignore cc::RenderEntity::getDynamicRenderDrawInfo;
%ignore cc::RenderEntity::getDynamicRenderDrawInfos;
%ignore cc::RenderEntity::getRenderEntityType;
%ignore cc::RenderEntity::getColorDirty;
%ignore cc::RenderEntity::getColor;
%ignore cc::RenderEntity::isEnabled;
%ignore cc::RenderEntity::getEnumStencilStage;
%ignore cc::RenderEntity::setEnumStencilStage;
%ignore cc::RenderEntity::getVBColorDirty;
%ignore cc::RenderEntity::setVBColorDirty;

// ----- Rename Section ------
// Brief: Classes, methods or attributes needs to be renamed
//
// Usage:
//
//  %rename(rename_to_name) your_namespace::original_class_name;
//  %rename(rename_to_name) your_namespace::original_class_name::method_name;
//  %rename(rename_to_name) your_namespace::original_class_name::attribute_name;
//
// Note:
//  1. 'Rename Section' should be placed before attribute definition and %import/%include
//  2. namespace is needed


// ----- Module Macro Section ------
// Brief: Generated code should be wrapped inside a macro
// Usage:
//  1. Configure for class
//    %module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::GeometryRenderer;
//  2. Configure for member function or attribute
//    %module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::RenderPipeline::geometryRenderer;
// Note: Should be placed before 'Attribute Section'

// Write your code bellow


// ----- Attribute Section ------
// Brief: Define attributes ( JS properties with getter and setter )
// Usage:
//  1. Define an attribute without setter
//    %attribute(your_namespace::your_class_name, cpp_member_variable_type, js_property_name, cpp_getter_name)
//  2. Define an attribute with getter and setter
//    %attribute(your_namespace::your_class_name, cpp_member_variable_type, js_property_name, cpp_getter_name, cpp_setter_name)
//  3. Define an attribute without getter
//    %attribute_writeonly(your_namespace::your_class_name, cpp_member_variable_type, js_property_name, cpp_setter_name)
//
// Note:
//  1. Don't need to add 'const' prefix for cpp_member_variable_type
//  2. The return type of getter should keep the same as the type of setter's parameter
//  3. If using reference, add '&' suffix for cpp_member_variable_type to avoid generated code using value assignment
//  4. 'Attribute Section' should be placed before 'Import Section' and 'Include Section'
//
%attribute(cc::UIMeshBuffer, float*, vData, getVData, setVData);
%attribute(cc::UIMeshBuffer, uint16_t*, iData, getIData, setIData);
%attribute(cc::UIMeshBuffer, bool, useLinkData, getUseLinkData, setUseLinkData);

%attribute(cc::RenderDrawInfo, float*, vbBuffer, getVbBuffer, setVbBuffer);
%attribute(cc::RenderDrawInfo, uint16_t*, ibBuffer, getIbBuffer, setIbBuffer);
%attribute(cc::RenderDrawInfo, float*, vDataBuffer, getVDataBuffer, setVDataBuffer);
%attribute(cc::RenderDrawInfo, uint16_t*, iDataBuffer, getIDataBuffer, setIDataBuffer);
%attribute(cc::RenderDrawInfo, cc::Material*, material, getMaterial, setMaterial);
%attribute(cc::RenderDrawInfo, cc::gfx::Texture*, texture, getTexture, setTexture);
%attribute(cc::RenderDrawInfo, cc::gfx::Sampler*, sampler, getSampler, setSampler);
%attribute(cc::RenderDrawInfo, cc::scene::Model*, model, getModel, setModel);
%attribute(cc::RenderDrawInfo, cc::Node*, subNode, getSubNode, setSubNode);

%attribute(cc::RenderEntity, cc::Node*, node, getNode, setNode);
%attribute(cc::RenderEntity, uint32_t, staticDrawInfoSize, getStaticDrawInfoSize, setStaticDrawInfoSize);
%attribute(cc::RenderEntity, uint32_t, stencilStage, getStencilStage, setStencilStage);

// ----- Import Section ------
// Brief: Import header files which are depended by 'Include Section'
// Note:
//   %import "your_header_file.h" will not generate code for that header file
//
%import "base/Macros.h"
%import "base/TypeDef.h"
%import "base/Ptr.h"
%import "base/memory/Memory.h"
%import "base/RefCounted.h"

%import "renderer/gfx-base/GFXObject.h"
%import "renderer/gfx-base/GFXDef-common.h"
%import "renderer/gfx-base/GFXInputAssembler.h"

%import "core/data/Object.h"
%import "core/assets/Asset.h"
%import "core/assets/Material.h"
%import "core/scene-graph/Node.h"

%import "2d/renderer/StencilManager.h"
%import "math/Color.h"

// ----- Include Section ------
// Brief: Include header files in which classes and methods will be bound
%include "2d/renderer/UIMeshBuffer.h"
%include "2d/renderer/RenderDrawInfo.h"
%include "2d/renderer/RenderEntity.h"
%include "2d/renderer/UIModelProxy.h"
%include "2d/renderer/Batcher2d.h"
