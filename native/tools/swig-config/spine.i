// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// spine at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="spine") spine

// Disable some swig warnings, find warning number reference here ( https://www.swig.org/Doc4.1/Warnings.html )
#pragma SWIG nowarn=503,302,401,317,402

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "editor-support/spine-creator-support/spine-cocos2dx.h"
%}

// Insert code at the beginning of generated source file (.cpp)
%{
#include "bindings/auto/jsb_2d_auto.h"
#include "bindings/auto/jsb_assets_auto.h"
#include "bindings/auto/jsb_cocos_auto.h"
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
%ignore cc::RefCounted;
%ignore *::rtti;
%ignore spine::SkeletonCache::SegmentData;
%ignore spine::SkeletonCache::BoneData;
%ignore spine::SkeletonCache::FrameData;
%ignore spine::SkeletonCache::AnimationData;
%ignore spine::Skin::AttachmentMap;

%ignore spine::Polygon::Polygon;
%ignore spine::Polygon::_vertices;
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
%ignore spine::SkeletonRenderer::requestDrawInfo;
%ignore spine::SkeletonRenderer::requestMaterial;
%ignore spine::SkeletonAnimation::createWithData;
%ignore spine::SkeletonAnimation::onTrackEntryEvent;
%ignore spine::SkeletonAnimation::onAnimationStateEvent;
%ignore spine::TrackEntry::setListener;
%ignore spine::AnimationState::setListener;
%ignore spine::Attachment::getRTTI;
%ignore spine::AttachmentTimeline::getRTTI;
%ignore spine::BoundingBoxAttachment::getRTTI;
%ignore spine::Bone::getRTTI;
%ignore spine::Bone::worldToLocal(float, float, float&, float&);
%ignore spine::Bone::localToWorld(float, float, float&, float&);
%ignore spine::ClippingAttachment::getRTTI;
%ignore spine::ColorTimeline::getRTTI;
%ignore spine::CurveTimeline::getRTTI;
%ignore spine::DeformTimeline::getVertices;
%ignore spine::DeformTimeline::getRTTI;
%ignore spine::DrawOrderTimeline::getDrawOrders;
%ignore spine::DrawOrderTimeline::getRTTI;
%ignore spine::EventTimeline::getRTTI;
%ignore spine::IkConstraint::getRTTI;
%ignore spine::IkConstraint::apply(Bone&, float, float, bool, bool, bool, float);
%ignore spine::IkConstraint::apply(Bone&, Bone&, float, float, int, bool, float, float);
%ignore spine::IkConstraintTimeline::getRTTI;
%ignore spine::MeshAttachment::getRTTI;
%ignore spine::PathAttachment::getRTTI;
%ignore spine::PathConstraint::getRTTI;
%ignore spine::PathConstraintMixTimeline::getRTTI;
%ignore spine::PathConstraintPositionTimeline::getRTTI;
%ignore spine::PathConstraintSpacingTimeline::getRTTI;
%ignore spine::PointAttachment::getRTTI;
%ignore spine::RegionAttachment::getRTTI;
%ignore spine::RotateTimeline::getRTTI;
%ignore spine::ScaleTimeline::getRTTI;
%ignore spine::ShearTimeline::getRTTI;
%ignore spine::Skin::findAttachmentsForSlot;
%ignore spine::Skin::findNamesForSlot;
%ignore spine::Timeline::getRTTI;
%ignore spine::TransformConstraint::getRTTI;
%ignore spine::TransformConstraintTimeline::getRTTI;
%ignore spine::TranslateTimeline::getRTTI;
%ignore spine::TwoColorTimeline::getRTTI;
%ignore spine::VertexEffect::transform;
%ignore spine::JitterVertexEffect::begin;
%ignore spine::JitterVertexEffect::transform;
%ignore spine::JitterVertexEffect::end;
%ignore spine::SwirlVertexEffect::begin;
%ignore spine::SwirlVertexEffect::transform;
%ignore spine::SwirlVertexEffect::end;
%ignore spine::VertexAttachment::getRTTI;
%ignore spine::SkeletonDataMgr::destroyInstance;
%ignore spine::SkeletonDataMgr::hasSkeletonData;
%ignore spine::SkeletonDataMgr::setSkeletonData;
%ignore spine::SkeletonDataMgr::retainByUUID;
%ignore spine::SkeletonDataMgr::releaseByUUID;
%ignore spine::SkeletonCacheAnimation::render;
%ignore spine::SkeletonCacheAnimation::requestDrawInfo;
%ignore spine::SkeletonCacheAnimation::requestMaterial;

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

%rename(getAttachmentsForSlot) spine::Skin::findAttachmentsForSlot;
%rename(frames) spine::TranslateTimeline::_frames;
%rename(boneIndex) spine::TranslateTimeline::_boneIndex;
%rename(frames) spine::TwoColorTimeline::_frames;
%rename(frames) spine::IkConstraintTimeline::_frames;
%rename(ikConstraintIndex) spine::IkConstraintTimeline::_ikConstraintIndex;
%rename(frames) spine::TransformConstraintTimeline::_frames;
%rename(transformConstraintIndex) spine::TransformConstraintTimeline::_transformConstraintIndex;
%rename(frames) spine::PathConstraintPositionTimeline::_frames;
%rename(pathConstraintIndex) spine::PathConstraintPositionTimeline::_pathConstraintIndex;
%rename(frames) spine::PathConstraintMixTimeline::_frames;
%rename(pathConstraintIndex) spine::PathConstraintMixTimeline::_pathConstraintIndex;
%rename(events) spine::AnimationState::_events;
%rename(queue) spine::AnimationState::_queue;
%rename(animationsChanged) spine::AnimationState::_animationsChanged;
%rename(trackEntryPool) spine::AnimationState::_trackEntryPool;
%rename(next) spine::TrackEntry::_next;
%rename(mixingFrom) spine::TrackEntry::_mixingFrom;
%rename(mixingTo) spine::TrackEntry::_mixingTo;
%rename(listener) spine::TrackEntry::_listener;
%rename(nextAnimationLast) spine::TrackEntry::_nextAnimationLast;
%rename(trackLast) spine::TrackEntry::_trackLast;
%rename(nextTrackLast) spine::TrackEntry::_nextTrackLast;
%rename(interruptAlpha) spine::TrackEntry::_interruptAlpha;
%rename(totalAlpha) spine::TrackEntry::_totalAlpha;
%rename(timelineMode) spine::TrackEntry::_timelineMode;
%rename(timelineHoldMix) spine::TrackEntry::_timelineHoldMix;
%rename(timelinesRotation) spine::TrackEntry::_timelinesRotation;
%rename(drainDisabled) spine::EventQueue::_drainDisabled;
%rename(animState) spine::EventQueue::_state;
%rename(setMixWith) spine::AnimationStateData::setMix;
%rename(TextureAtlas) spine::Atlas;
%rename(arotation) spine::Bone::_arotation;
%rename(sorted) spine::Bone::_sorted;
%rename(spaces) spine::PathConstraint::_spaces;
%rename(positions) spine::PathConstraint::_positions;
%rename(world) spine::PathConstraint::_world;
%rename(curves) spine::PathConstraint::_curves;
%rename(lengths) spine::PathConstraint::_lengths;
%rename(segments) spine::PathConstraint::_segments;
%rename(attachmentLoader) spine::SkeletonBinary::_attachmentLoader;
%rename(minX) spine::SkeletonBounds::_minX;
%rename(minY) spine::SkeletonBounds::_minY;
%rename(maxX) spine::SkeletonBounds::_maxX;
%rename(maxY) spine::SkeletonBounds::_maxY;
%rename(boundingBoxes) spine::SkeletonBounds::_boundingBoxes;
%rename(polygons) spine::SkeletonBounds::_polygons;
%rename(attachmentLoader) spine::SkeletonJson::_attachmentLoader;
%rename(JitterEffect) spine::JitterVertexEffect;
%rename(SwirlEffect) spine::SwirlVertexEffect;

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

%attribute(spine::Animation, ccstd::string&, name, getName);
%attribute(spine::Animation, ccstd::vector<spine::Timeline*>&, timelines, getTimelines);
%attribute(spine::Animation, float, duration, getDuration, setDuration);

%attribute(spine::RotateTimeline, int, boneIndex, getBoneIndex, setBoneIndex);
%attribute(spine::RotateTimeline, ccstd::vector<float>&, frames, getFrames);

%attribute(spine::ColorTimeline, int, slotIndex, getSlotIndex, setSlotIndex);
%attribute(spine::ColorTimeline, ccstd::vector<float>&, frames, getFrames);

%attribute(spine::TwoColorTimeline, int, slotIndex, getSlotIndex, setSlotIndex);

%attribute(spine::AttachmentTimeline, size_t, slotIndex, getSlotIndex, setSlotIndex);
%attribute(spine::AttachmentTimeline, ccstd::vector<float>&, frames, getFrames);
%attribute(spine::AttachmentTimeline, ccstd::vector<ccstd::string>&, attachmentNames, getAttachmentNames);

%attribute(spine::DeformTimeline, int, slotIndex, getSlotIndex, setSlotIndex);
%attribute(spine::DeformTimeline, ccstd::vector<float>&, frames, getFrames);
%attribute(spine::DeformTimeline, ccstd::vector<float>&, frameVertices, getVertices);
%attribute(spine::DeformTimeline, spine::VertexAttachment*, attachment, getAttachment);

%attribute(spine::EventTimeline, ccstd::vector<float>&, frames, getFrames);
%attribute(spine::EventTimeline, ccstd::vector<spine::Event*>&, events, getEvents);

%attribute(spine::DrawOrderTimeline, ccstd::vector<float>&, frames, getFrames);
%attribute(spine::DrawOrderTimeline, ccstd::vector<ccstd::vector<int>>&, drawOrders, getDrawOrders);

%attribute(spine::AnimationState, spine::AnimationStateData*, data, getData);
%attribute(spine::AnimationState, ccstd::vector<spine::TrackEntry*>&, tracks, getTracks);
%attribute(spine::AnimationState, float, timeScale, getTimeScale, setTimeScale);

%attribute(spine::TrackEntry, spine::Animation*, animation, getAnimation);
%attribute(spine::TrackEntry, int, trackIndex, getTrackIndex);
%attribute(spine::TrackEntry, bool, loop, getLoop, setLoop);
%attribute(spine::TrackEntry, bool, holdPrevious, getHoldPrevious, setHoldPrevious);
%attribute(spine::TrackEntry, float, eventThreshold, getEventThreshold, setEventThreshold);
%attribute(spine::TrackEntry, float, attachmentThreshold, getAttachmentThreshold, setAttachmentThreshold);
%attribute(spine::TrackEntry, float, drawOrderThreshold, getDrawOrderThreshold, setDrawOrderThreshold);
%attribute(spine::TrackEntry, float, animationStart, getAnimationStart, setAnimationStart);
%attribute(spine::TrackEntry, float, animationEnd, getAnimationEnd, setAnimationEnd);
%attribute(spine::TrackEntry, float, animationLast, getAnimationLast, setAnimationLast);
%attribute(spine::TrackEntry, float, delay, getDelay, setDelay);
%attribute(spine::TrackEntry, float, trackTime, getTrackTime, setTrackTime);
%attribute(spine::TrackEntry, float, trackEnd, getTrackEnd, setTrackEnd);
%attribute(spine::TrackEntry, float, timeScale, getTimeScale, setTimeScale);
%attribute(spine::TrackEntry, float, alpha, getAlpha, setAlpha);
%attribute(spine::TrackEntry, float, mixTime, getMixTime, setMixTime);
%attribute(spine::TrackEntry, float, mixDuration, getMixDuration, setMixDuration);
%attribute(spine::TrackEntry, spine::MixBlend, mixBlend, getMixBlend, setMixBlend);

%attribute(spine::AnimationStateData, spine::SkeletonData*, skeletonData, getSkeletonData);
%attribute(spine::AnimationStateData, float, defaultMix, getDefaultMix, setDefaultMix);

%attribute(spine::Bone, spine::BoneData&, data, getData);
%attribute(spine::Bone, spine::Skeleton&, skeleton, getSkeleton);
%attribute(spine::Bone, spine::Bone&, parent, getParent);
%attribute(spine::Bone, ccstd::vector<spine::Bone*>, children, getChildren);
%attribute(spine::Bone, float, x, getX, setX);
%attribute(spine::Bone, float, y, getY, setY);
%attribute(spine::Bone, float, rotation, getRotation, setRotation);
%attribute(spine::Bone, float, scaleX, getScaleX, setScaleX);
%attribute(spine::Bone, float, scaleY, getScaleY, setScaleY);
%attribute(spine::Bone, float, shearX, getShearX, setShearX);
%attribute(spine::Bone, float, shearY, getShearY, setShearY);
%attribute(spine::Bone, float, ax, getAX, setAX);
%attribute(spine::Bone, float, ay, getAY, setAY);
%attribute(spine::Bone, float, ascaleX, getAScaleX, setAScaleX);
%attribute(spine::Bone, float, ascaleY, getAScaleY, setAScaleY);
%attribute(spine::Bone, float, ashearX, getAShearX, setAShearX);
%attribute(spine::Bone, float, ashearY, getAShearY, setAShearY);
%attribute(spine::Bone, bool, appliedValid, isAppliedValid, setAppliedValid);
%attribute(spine::Bone, float, a, getA, setA);
%attribute(spine::Bone, float, b, getB, setB);
%attribute(spine::Bone, float, c, getC, setC);
%attribute(spine::Bone, float, d, getD, setD);
%attribute(spine::Bone, float, worldX, getWorldX, setWorldX);
%attribute(spine::Bone, float, worldY, getWorldY, setWorldY);
%attribute(spine::Bone, bool, active, isActive, setActive);

%attribute(spine::BoneData, int, index, getIndex);
%attribute(spine::BoneData, ccstd::string&, name, getName);
%attribute(spine::BoneData, spine::BoneData&, parent, getParent);
%attribute(spine::BoneData, float, length, getLength, setLength);
%attribute(spine::BoneData, float, x, getX, setX);
%attribute(spine::BoneData, float, y, getY, setY);
%attribute(spine::BoneData, float, rotation, getRotation, setRotation);
%attribute(spine::BoneData, float, scaleX, getScaleX, setScaleX);
%attribute(spine::BoneData, float, scaleY, getScaleY, setScaleY);
%attribute(spine::BoneData, float, shearX, getShearX, setShearX);
%attribute(spine::BoneData, float, shearY, getShearY, setShearY);
%attribute(spine::BoneData, spine::TransformMode, transformMode, getTransformMode, setTransformMode);
%attribute(spine::BoneData, bool, skinRequired, isSkinRequired, setSkinRequired);

%attribute(spine::ConstraintData, ccstd::string&, name, getName);
%attribute(spine::ConstraintData, size_t, order, getOrder, setOrder);
%attribute(spine::ConstraintData, bool, skinRequired, isSkinRequired, setSkinRequired);

%attribute(spine::Event, spine::EventData&, data, getData);
%attribute(spine::Event, int, intValue, getIntValue, setIntValue);
%attribute(spine::Event, float, floatValue, getFloatValue, setFloatValue);
%attribute(spine::Event, ccstd::string&, stringValue, getStringValue, setStringValue);
%attribute(spine::Event, float, time, getTime);
%attribute(spine::Event, float, volume, getVolume, setVolume);
%attribute(spine::Event, float, balance, getBalance, setBalance);

%attribute(spine::EventData, ccstd::string&, name, getName);
%attribute(spine::EventData, int, intValue, getIntValue, setIntValue);
%attribute(spine::EventData, float, floatValue, getFloatValue, setFloatValue);
%attribute(spine::EventData, ccstd::string&, stringValue, getStringValue, setStringValue);
%attribute(spine::EventData, float, volume, getVolume, setVolume);
%attribute(spine::EventData, float, balance, getBalance, setBalance);
%attribute(spine::EventData, ccstd::string&, audioPath, getAudioPath, setAudioPath);

%attribute(spine::IkConstraint, spine::IkConstraintData&, data, getData);
%attribute(spine::IkConstraint, ccstd::vector<spine::Bone*>&, bones, getBones);
%attribute(spine::IkConstraint, spine::Bone*, target, getTarget, setTarget);
%attribute(spine::IkConstraint, int, bendDirection, getBendDirection, setBendDirection);
%attribute(spine::IkConstraint, bool, compress, getCompress, setCompress);
%attribute(spine::IkConstraint, bool, stretch, getStretch, setStretch);
%attribute(spine::IkConstraint, float, mix, getMix, setMix);
%attribute(spine::IkConstraint, float, softness, getSoftness, setSoftness);
%attribute(spine::IkConstraint, bool, active, isActive, setActive);

%attribute(spine::IkConstraintData, ccstd::vector<spine::BoneData*>&, bones, getBones);
%attribute(spine::IkConstraintData, spine::BoneData*, target, getTarget);
%attribute(spine::IkConstraintData, int, bendDirection, getBendDirection, setBendDirection);
%attribute(spine::IkConstraintData, bool, compress, getCompress, setCompress);
%attribute(spine::IkConstraintData, bool, stretch, getStretch, setStretch);
%attribute(spine::IkConstraintData, bool, uniform, getUniform, setUniform);
%attribute(spine::IkConstraintData, float, mix, getMix, setMix);
%attribute(spine::IkConstraintData, float, softness, getSoftness, setSoftness);

%attribute(spine::PathConstraint, spine::PathConstraintData&, data, getData);
%attribute(spine::PathConstraint, ccstd::vector<spine::Bone*>&, bones, getBones);
%attribute(spine::PathConstraint, spine::Slot*, target, getTarget, setTarget);
%attribute(spine::PathConstraint, float, position, getPosition, setPosition);
%attribute(spine::PathConstraint, float, spacing, getSpacing, setSpacing);
%attribute(spine::PathConstraint, float, rotateMix, getRotateMix, setRotateMix);
%attribute(spine::PathConstraint, float, translateMix, getTranslateMix, setTranslateMix);
%attribute(spine::PathConstraint, bool, active, isActive, setActive);

%attribute(spine::PathConstraintData, ccstd::vector<spine::BoneData*>&, bones, getBones);
%attribute(spine::PathConstraintData, spine::SlotData*, target, getTarget, setTarget);
%attribute(spine::PathConstraintData, spine::PositionMode, positionMode, getPositionMode, setPositionMode);
%attribute(spine::PathConstraintData, spine::SpacingMode, spacingMode, getSpacingMode, setSpacingMode);
%attribute(spine::PathConstraintData, spine::RotateMode, rotateMode, getRotateMode, setRotateMode);
%attribute(spine::PathConstraintData, float, offsetRotation, getOffsetRotation, setOffsetRotation);
%attribute(spine::PathConstraintData, float, position, getPosition, setPosition);
%attribute(spine::PathConstraintData, float, spacing, getSpacing, setSpacing);
%attribute(spine::PathConstraintData, float, rotateMix, getRotateMix, setRotateMix);
%attribute(spine::PathConstraintData, float, translateMix, getTranslateMix, setTranslateMix);

%attribute(spine::Skeleton, spine::SkeletonData*, data, getData);
%attribute(spine::Skeleton, ccstd::vector<spine::Bone*>, bones, getBones);
%attribute(spine::Skeleton, ccstd::vector<spine::Slot*>, slots, getSlots);
%attribute(spine::Skeleton, ccstd::vector<spine::Slot*>, drawOrder, getDrawOrder);
%attribute(spine::Skeleton, ccstd::vector<spine::IkConstraint*>, ikConstraints, getIkConstraints);
%attribute(spine::Skeleton, ccstd::vector<spine::TransformConstraint*>, transformConstraints, getTransformConstraints);
%attribute(spine::Skeleton, ccstd::vector<spine::PathConstraint*>, pathConstraints, getPathConstraints);
%attribute(spine::Skeleton, ccstd::vector<spine::Updatable*>, _updateCache, getUpdateCacheList);
%attribute(spine::Skeleton, spine::Skin*, skin, setSkin);
%attribute(spine::Skeleton, spine::Color&, color, getColor);
%attribute(spine::Skeleton, float, time, getTime, setTime);
%attribute(spine::Skeleton, float, scaleX, getScaleX, setScaleX);
%attribute(spine::Skeleton, float, scaleY, getScaleY, setScaleY);
%attribute(spine::Skeleton, float, x, getX, setX);
%attribute(spine::Skeleton, float, y, getY, setY);

%attribute(spine::SkeletonBinary, float, scale, setScale);

%attribute(spine::SkeletonClipping, ccstd::vector<float>&, clippedVertices, getClippedVertices);
%attribute(spine::SkeletonClipping, ccstd::vector<unsigned short>&, clippedTriangles, getClippedTriangles);

%attribute(spine::SkeletonData, ccstd::string&, name, getName, setName);
%attribute(spine::SkeletonData, ccstd::vector<spine::BoneData*>&, bones, getBones);
%attribute(spine::SkeletonData, ccstd::vector<spine::SlotData*>&, slots, getSlots);
%attribute(spine::SkeletonData, ccstd::vector<spine::Skin*>&, skins, getSkins);
%attribute(spine::SkeletonData, spine::Skin*, defaultSkin, getDefaultSkin, setDefaultSkin);
%attribute(spine::SkeletonData, ccstd::vector<spine::EventData*>&, events, getEvents);
%attribute(spine::SkeletonData, ccstd::vector<spine::Animation*>&, animations, getAnimations);
%attribute(spine::SkeletonData, ccstd::vector<spine::IkConstraintData*>&, ikConstraints, getIkConstraints);
%attribute(spine::SkeletonData, ccstd::vector<spine::TransformConstraintData*>&, transformConstraints, getTransformConstraints);
%attribute(spine::SkeletonData, ccstd::vector<spine::PathConstraintData*>&, pathConstraints, getPathConstraints);
%attribute(spine::SkeletonData, float, x, getX, setX);
%attribute(spine::SkeletonData, float, y, getY, setY);
%attribute(spine::SkeletonData, float, width, getWidth, setWidth);
%attribute(spine::SkeletonData, float, height, getHeight, setHeight);
%attribute(spine::SkeletonData, ccstd::string&, version, getVersion, setVersion);
%attribute(spine::SkeletonData, ccstd::string&, hash, getHash, setHash);
%attribute(spine::SkeletonData, float, fps, getFps, setFps);
%attribute(spine::SkeletonData, ccstd::string&, imagesPath, getImagesPath, setImagesPath);
%attribute(spine::SkeletonData, ccstd::string&, audioPath, getAudioPath, setAudioPath);

%attribute(spine::SkeletonJson, float, scale, setScale);

%attribute(spine::Skin, ccstd::string&, name, getName);
%attribute(spine::Skin, ccstd::vector<BoneData*>&, bones, getBones);
%attribute(spine::Skin, ccstd::vector<ConstraintData*>&, constraints, getConstraints);

%attribute(spine::Slot, spine::SlotData&, data, getData);
%attribute(spine::Slot, spine::Bone&, bone, getBone);
%attribute(spine::Slot, spine::Color&, color, getColor);
%attribute(spine::Slot, spine::Color&, darkColor, getDarkColor);
%attribute(spine::Slot, spine::Attachment*, attachment, getAttachment, setAttachment);
%attribute(spine::Slot, ccstd::vector<float>&, deform, getDeform);

%attribute(spine::SlotData, int, index, getIndex);
%attribute(spine::SlotData, ccstd::string&, name, getName);
%attribute(spine::SlotData, spine::boneData&, boneData, getBoneData);
%attribute(spine::SlotData, spine::Color&, color, getColor);
%attribute(spine::SlotData, spine::Color&, darkColor, getDarkColor);
%attribute(spine::SlotData, ccstd::string&, attachmentName, getAttachmentName, setAttachmentName);
%attribute(spine::SlotData, spine::BlendMode, blendMode, getBlendMode, setBlendMode);

%attribute(spine::TransformConstraint, spine::TransformConstraintData&, data, getData);
%attribute(spine::TransformConstraint, ccstd::vector<spine::Bone*>&, bones, getBones);
%attribute(spine::TransformConstraint, spine::Bone*, target, getTarget, setTarget);
%attribute(spine::TransformConstraint, float, rotateMix, getRotateMix, setRotateMix);
%attribute(spine::TransformConstraint, float, translateMix, getTranslateMix, setTranslateMix);
%attribute(spine::TransformConstraint, float, scaleMix, getScaleMix, setScaleMix);
%attribute(spine::TransformConstraint, float, shearMix, getShearMix, setShearMix);
%attribute(spine::TransformConstraint, bool, active, isActive, setActive);

%attribute(spine::TransformConstraintData, ccstd::vector<spine::BoneData*>&, bones, getBones);
%attribute(spine::TransformConstraintData, spine::BoneData*, target, getTarget);
%attribute(spine::TransformConstraintData, float, rotateMix, getRotateMix);
%attribute(spine::TransformConstraintData, float, translateMix, getTranslateMix);
%attribute(spine::TransformConstraintData, float, scaleMix, getScaleMix);
%attribute(spine::TransformConstraintData, float, shearMix, getShearMix);
%attribute(spine::TransformConstraintData, float, offsetRotation, getOffsetRotation);
%attribute(spine::TransformConstraintData, float, offsetX, getOffsetX);
%attribute(spine::TransformConstraintData, float, offsetY, getOffsetY);
%attribute(spine::TransformConstraintData, float, offsetScaleX, getOffsetScaleX);
%attribute(spine::TransformConstraintData, float, offsetScaleY, getOffsetScaleY);
%attribute(spine::TransformConstraintData, float, offsetShearY, getOffsetShearY);
%attribute(spine::TransformConstraintData, bool, relative, isRelative);
%attribute(spine::TransformConstraintData, bool, local, isLocal);

%attribute(spine::Attachment, ccstd::string&, name, getName);

%attribute(spine::VertexAttachment, int, id, getId);
%attribute(spine::VertexAttachment, ccstd::vector<size_t>&, bones, getBones);
%attribute(spine::VertexAttachment, ccstd::vector<float>&, vertices, getVertices);
%attribute(spine::VertexAttachment, size_t, worldVerticesLength, getWorldVerticesLength, setWorldVerticesLength);
%attribute(spine::VertexAttachment, spine::VertexAttachment*, deformAttachment, getDeformAttachment, setDeformAttachment);

%attribute(spine::ClippingAttachment, spine::SlotData*, endSlot, getEndSlot, setEndSlot);

%attribute(spine::MeshAttachment, ccstd::string&, path, getPath, setPath);
%attribute(spine::MeshAttachment, ccstd::vector<float>&, regionUVs, getRegionUVs);
%attribute(spine::MeshAttachment, ccstd::vector<float>&, uvs, getUVs);
%attribute(spine::MeshAttachment, ccstd::vector<unsigned short>&, triangles, getTriangles);
%attribute(spine::MeshAttachment, spine::Color&, color, getColor);
%attribute(spine::MeshAttachment, float, width, getWidth, setWidth);
%attribute(spine::MeshAttachment, float, height, getHeight, setHeight);
%attribute(spine::MeshAttachment, int, hullLength, getHullLength, setHullLength);
%attribute(spine::MeshAttachment, ccstd::vector<unsigned short>&, edges, getEdges);

// ----- Import Section ------
// Brief: Import header files which are depended by 'Include Section'
// Note: 
//   %import "your_header_file.h" will not generate code for that header file
//
%import "base/Macros.h"
%import "base/RefCounted.h"
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
%include "editor-support/spine/VertexAttachment.h"
%include "editor-support/spine/BoundingBoxAttachment.h"
%include "editor-support/spine/Bone.h"
%include "editor-support/spine/BoneData.h"
%include "editor-support/spine/ClippingAttachment.h"
%include "editor-support/spine/Color.h"
%include "editor-support/spine/CurveTimeline.h"
%include "editor-support/spine/ColorTimeline.h"
%include "editor-support/spine/DeformTimeline.h"
%include "editor-support/spine/DrawOrderTimeline.h"
%include "editor-support/spine/Event.h"
%include "editor-support/spine/EventData.h"
%include "editor-support/spine/EventTimeline.h"
%include "editor-support/spine/ConstraintData.h"
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
%include "editor-support/spine/TranslateTimeline.h"
%include "editor-support/spine/TwoColorTimeline.h"
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
%include "editor-support/spine/VertexEffect.h"

%include "editor-support/spine-creator-support/VertexEffectDelegate.h"
%include "editor-support/spine-creator-support/SkeletonRenderer.h"
%include "editor-support/spine-creator-support/SkeletonAnimation.h"
%include "editor-support/spine-creator-support/SkeletonDataMgr.h"
%include "editor-support/spine-creator-support/SkeletonCacheAnimation.h"
%include "editor-support/spine-creator-support/SkeletonCacheMgr.h"

%extend spine::IkConstraint {
    void apply1(Bone *bone, float targetX, float targetY, bool compress, bool stretch, bool uniform, float alpha) {
        IkConstraint::apply(*bone, targetX, targetY, compress, stretch, uniform, alpha);
    }

    void apply2(Bone *parent, Bone *child, float targetX, float targetY, int bendDir, bool stretch, float softness, float alpha) {
        IkConstraint::apply(*parent, *child, targetX, targetY, bendDir, stretch, softness, alpha);
    }
};