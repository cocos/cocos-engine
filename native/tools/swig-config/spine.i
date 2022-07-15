// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// spine at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="spine") spine

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "editor-support/spine-creator-support/spine-cocos2dx.h"
%}

// Insert code at the beginning of generated source file (.cpp)
%{
#include "bindings/auto/jsb_spine_auto.h"
using namespace spine;
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
%ignore *::rtti;
%ignore spine::SkeletonCache::SegmentData;
%ignore spine::SkeletonCache::BoneData;
%ignore spine::SkeletonCache::FrameData;
%ignore spine::SkeletonCache::AnimationData;
%ignore spine::Skin::AttachmentMap;

%ignore spine::Animation::Animation;
%ignore spine::TrackEntry::TrackEntry;
%ignore spine::AnimationState::AnimationState;
%ignore spine::AnimationStateData::AnimationStateData;
%ignore spine::Attachment::Attachment;
%ignore spine::AttachmentTimeline::AttachmentTimeline;
%ignore spine::BoundingBoxAttachment::BoundingBoxAttachment;
%ignore spine::Bone::Bone;
%ignore spine::BoneData::BoneData;
%ignore spine::ClippingAttachment::ClippingAttachment;
%ignore spine::Color::Color;
%ignore spine::ColorTimeline::ColorTimeline;
%ignore spine::CurveTimeline::CurveTimeline;
%ignore spine::DeformTimeline::DeformTimeline;
%ignore spine::DrawOrderTimeline::DrawOrderTimeline;
%ignore spine::Event::Event;
%ignore spine::EventData::EventData;
%ignore spine::EventTimeline::EventTimeline;
%ignore spine::IkConstraint::IkConstraint;
%ignore spine::IkConstraintData::IkConstraintData;
%ignore spine::IkConstraintTimeline::IkConstraintTimeline;
%ignore spine::MeshAttachment::MeshAttachment;
%ignore spine::Polygon::Polygon;
%ignore spine::Polygon::_vertices;
%ignore spine::PathAttachment::PathAttachment;
%ignore spine::PathConstraint::PathConstraint;
%ignore spine::PathConstraintData::PathConstraintData;
%ignore spine::PathConstraintMixTimeline::PathConstraintMixTimeline;
%ignore spine::PathConstraintPositionTimeline::PathConstraintPositionTimeline;
%ignore spine::PathConstraintSpacingTimeline::PathConstraintSpacingTimeline;
%ignore spine::PointAttachment::PointAttachment;
%ignore spine::RegionAttachment::RegionAttachment;
%ignore spine::RotateTimeline::RotateTimeline;
%ignore spine::ScaleTimeline::ScaleTimeline;
%ignore spine::ShearTimeline::ShearTimeline;
%ignore spine::Skeleton::Skeleton;
%ignore spine::Slot::Slot;
%ignore spine::Skin::Skin;
%ignore spine::SlotData::SlotData;
%ignore spine::SkeletonBounds::SkeletonBounds;
%ignore spine::SkeletonData::SkeletonData;
%ignore spine::Timeline::Timeline;
%ignore spine::TransformConstraint::TransformConstraint;
%ignore spine::TransformConstraintData::TransformConstraintData;
%ignore spine::TransformConstraintTimeline::TransformConstraintTimeline;
%ignore spine::TranslateTimeline::TranslateTimeline;
%ignore spine::TwoColorTimeline::TwoColorTimeline;
%ignore spine::VertexAttachment::VertexAttachment;
%ignore spine::VertexEffect::VertexEffect;
%ignore spine::JitterVertexEffect::JitterVertexEffect;
%ignore spine::SwirlVertexEffect::SwirlVertexEffect;
%ignore spine::ConstraintData::ConstraintData;

%ignore spine::SkeletonRenderer::create;
%ignore spine::SkeletonRenderer::initWithJsonFile;
%ignore spine::SkeletonRenderer::initWithBinaryFile;
%ignore spine::SkeletonRenderer::createWithData;
%ignore spine::SkeletonRenderer::initWithData;
%ignore spine::SkeletonRenderer::createWithSkeleton;
%ignore spine::SkeletonRenderer::createWithFile;
%ignore spine::SkeletonRenderer::getRenderOrder;
%ignore spine::SkeletonAnimation::createWithData;
%ignore spine::SkeletonAnimation::onTrackEntryEvent;
%ignore spine::SkeletonAnimation::onAnimationStateEvent;
%ignore spine::Animation::apply;
%ignore spine::TrackEntry::setListener;
%ignore spine::AnimationState::apply;
%ignore spine::AnimationState::setListener;
%ignore spine::Attachment::getRTTI;
%ignore spine::AttachmentTimeline::apply;
%ignore spine::AttachmentTimeline::getRTTI;
%ignore spine::BoundingBoxAttachment::getRTTI;
%ignore spine::Bone::worldToLocal;
%ignore spine::Bone::localToWorld;
%ignore spine::Bone::getRTTI;
%ignore spine::ClippingAttachment::getRTTI;
%ignore spine::Color::set;
%ignore spine::Color::add;
%ignore spine::ColorTimeline::apply;
%ignore spine::ColorTimeline::getRTTI;
%ignore spine::CurveTimeline::apply;
%ignore spine::CurveTimeline::getRTTI;
%ignore spine::DeformTimeline::apply;
%ignore spine::DeformTimeline::setFrame;
%ignore spine::DeformTimeline::getVertices;
%ignore spine::DeformTimeline::getRTTI;
%ignore spine::DrawOrderTimeline::apply;
%ignore spine::DrawOrderTimeline::setFrame;
%ignore spine::DrawOrderTimeline::getDrawOrders;
%ignore spine::DrawOrderTimeline::getRTTI;
%ignore spine::EventTimeline::apply;
%ignore spine::EventTimeline::getRTTI;
%ignore spine::IkConstraint::apply;
%ignore spine::IkConstraint::getRTTI;
%ignore spine::IkConstraintTimeline::apply;
%ignore spine::IkConstraintTimeline::getRTTI;
%ignore spine::MeshAttachment::getRTTI;
%ignore spine::PathAttachment::getRTTI;
%ignore spine::PathConstraint::getRTTI;
%ignore spine::PathConstraintMixTimeline::apply;
%ignore spine::PathConstraintMixTimeline::getRTTI;
%ignore spine::PathConstraintPositionTimeline::apply;
%ignore spine::PathConstraintPositionTimeline::getRTTI;
%ignore spine::PathConstraintSpacingTimeline::apply;
%ignore spine::PathConstraintSpacingTimeline::getRTTI;
%ignore spine::PointAttachment::computeWorldPosition;
%ignore spine::PointAttachment::getRTTI;
%ignore spine::PointAttachment::computeWorldRotation;
%ignore spine::RegionAttachment::computeWorldVertices;
%ignore spine::RegionAttachment::getRTTI;
%ignore spine::RotateTimeline::apply;
%ignore spine::RotateTimeline::getRTTI;
%ignore spine::ScaleTimeline::apply;
%ignore spine::ScaleTimeline::getRTTI;
%ignore spine::ShearTimeline::apply;
%ignore spine::ShearTimeline::getRTTI;
%ignore spine::Skeleton::getBounds;
%ignore spine::Skin::getAttachments;
%ignore spine::Skin::findAttachmentsForSlot;
%ignore spine::Skin::findNamesForSlot;
%ignore spine::SkeletonBounds::update;
%ignore spine::SkeletonBounds::aabbIntersectsSkeleton;
%ignore spine::Timeline::apply;
%ignore spine::Timeline::getRTTI;
%ignore spine::TransformConstraint::getRTTI;
%ignore spine::TransformConstraintTimeline::apply;
%ignore spine::TransformConstraintTimeline::getRTTI;
%ignore spine::TranslateTimeline::apply;
%ignore spine::TranslateTimeline::getRTTI;
%ignore spine::TwoColorTimeline::apply;
%ignore spine::TwoColorTimeline::getRTTI;
%ignore spine::VertexEffect::begin;
%ignore spine::VertexEffect::transform;
%ignore spine::VertexEffect::end;
%ignore spine::JitterVertexEffect::begin;
%ignore spine::JitterVertexEffect::transform;
%ignore spine::JitterVertexEffect::end;
%ignore spine::SwirlVertexEffect::begin;
%ignore spine::SwirlVertexEffect::transform;
%ignore spine::SwirlVertexEffect::end;
%ignore spine::VertexAttachment::computeWorldVertices;
%ignore spine::VertexAttachment::getBones;
%ignore spine::VertexAttachment::getRTTI;
%ignore spine::SkeletonDataMgr::destroyInstance;
%ignore spine::SkeletonDataMgr::hasSkeletonData;
%ignore spine::SkeletonDataMgr::setSkeletonData;
%ignore spine::SkeletonDataMgr::retainByUUID;
%ignore spine::SkeletonDataMgr::releaseByUUID;
%ignore spine::SkeletonCacheAnimation::render;
%ignore spine::SkeletonCacheAnimation::getRenderOrder;

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
%rename(create) spine::SkeletonAnimation::createWithFile;
%rename(setCompleteListenerNative) spine::SkeletonAnimation::setCompleteListener;
%rename(setTrackCompleteListenerNative) spine::SkeletonAnimation::setTrackCompleteListener;
%rename(create) spine::SkeletonRenderer::createWithFile;

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

// ----- Import Section ------
// Brief: Import header files which are depended by 'Include Section'
// Note: 
//   %import "your_header_file.h" will not generate code for that header file
//
%import "editor-support/spine/dll.h"
%import "editor-support/spine/RTTI.h"
%import "editor-support/spine/SpineString.h"
%import "editor-support/spine/Vector.h"

// ----- Include Section ------
// Brief: Include header files in which classes and methods will be bound
%include "editor-support/spine/MixBlend.h"
%include "editor-support/spine/MixDirection.h"
%include "editor-support/spine/TransformMode.h"
%include "editor-support/spine/PositionMode.h"
%include "editor-support/spine/SpacingMode.h"
%include "editor-support/spine/RotateMode.h"
%include "editor-support/spine/BlendMode.h"
%include "editor-support/spine/Timeline.h"
%include "editor-support/spine/Animation.h"
%include "editor-support/spine/AnimationState.h"
%include "editor-support/spine/AnimationStateData.h"
%include "editor-support/spine/Attachment.h"
%include "editor-support/spine/AttachmentTimeline.h"
%include "editor-support/spine/BoundingBoxAttachment.h"
%include "editor-support/spine/Bone.h"
%include "editor-support/spine/BoneData.h"
%include "editor-support/spine/ClippingAttachment.h"
%include "editor-support/spine/Color.h"
%include "editor-support/spine/ColorTimeline.h"
%include "editor-support/spine/CurveTimeline.h"
%include "editor-support/spine/DeformTimeline.h"
%include "editor-support/spine/DrawOrderTimeline.h"
%include "editor-support/spine/Event.h"
%include "editor-support/spine/EventData.h"
%include "editor-support/spine/EventTimeline.h"
%include "editor-support/spine/IkConstraint.h"
%include "editor-support/spine/IkConstraintData.h"
%include "editor-support/spine/IkConstraintTimeline.h"
%include "editor-support/spine/MeshAttachment.h"
%include "editor-support/spine/PathAttachment.h"
%include "editor-support/spine/PathConstraint.h"
%include "editor-support/spine/PathConstraintData.h"
%include "editor-support/spine/PathConstraintMixTimeline.h"
%include "editor-support/spine/PathConstraintPositionTimeline.h"
%include "editor-support/spine/PathConstraintSpacingTimeline.h"
%include "editor-support/spine/PointAttachment.h"
%include "editor-support/spine/RegionAttachment.h"
%include "editor-support/spine/RotateTimeline.h"
%include "editor-support/spine/ScaleTimeline.h"
%include "editor-support/spine/ShearTimeline.h"
%include "editor-support/spine/Skeleton.h"
%include "editor-support/spine/Slot.h"
%include "editor-support/spine/Skin.h"
%include "editor-support/spine/SkeletonBounds.h"
%include "editor-support/spine/SkeletonData.h"
%include "editor-support/spine/SlotData.h"

%include "editor-support/spine/TransformConstraint.h"
%include "editor-support/spine/TransformConstraintData.h"
%include "editor-support/spine/TransformConstraintTimeline.h"
%include "editor-support/spine/TranslateTimeline.h"
%include "editor-support/spine/TwoColorTimeline.h"
%include "editor-support/spine/VertexAttachment.h"
%include "editor-support/spine/VertexEffect.h"
%include "editor-support/spine/ConstraintData.h"

%include "editor-support/spine-creator-support/VertexEffectDelegate.h"
%include "editor-support/spine-creator-support/SkeletonRenderer.h"
%include "editor-support/spine-creator-support/SkeletonAnimation.h"
%include "editor-support/spine-creator-support/SkeletonDataMgr.h"
// %include "editor-support/spine-creator-support/SkeletonCache.h"
%include "editor-support/spine-creator-support/SkeletonCacheAnimation.h"
%include "editor-support/spine-creator-support/SkeletonCacheMgr.h"