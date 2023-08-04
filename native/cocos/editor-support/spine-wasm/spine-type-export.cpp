#include <spine/spine.h>
#include "spine-wasm.h"
#include "spine-skeleton-instance.h"
#include <emscripten/bind.h>
#include <memory>
#include <vector>
#include <functional>

using namespace emscripten;
using namespace spine;

namespace {
std::string STRING_SP2STD(const spine::String& str) {
    std::string stdStr(str.buffer(), str.length());
    return stdStr;
}


const spine::String STRING_STD2SP(const std::string& str) {
    const spine::String spString(str.c_str());
    return spString;
}

template <typename T>
std::vector<T> VECTOR_SP2STD(Vector<T> &container) {
    int count = container.size();
    std::vector<T> stdVector(count);
    for (int i = 0; i < count; i++) {
        stdVector[i] = container[i];
    }
    return stdVector;
}

template <typename T>
std::vector<T> VECTOR_SP2STD2(Vector<T> container) {
    int count = container.size();
    std::vector<T> stdVector(count);
    for (int i = 0; i < count; i++) {
        stdVector[i] = container[i];
    }
    return stdVector;
}

} // namespace

EMSCRIPTEN_BINDINGS(spine) {
    register_vector<float>("VectorFloat");
    register_vector<BoneData*>("VectorBoneData");
    register_vector<Bone*>("VectorBone");
    register_vector<Skin::AttachmentMap::Entry*>("VectorSkinEntry");
    register_vector<SlotData*>("VectorSlotData");
    register_vector<Slot*>("VectorSlot");
    register_vector<Animation*>("VectorAnimation");
    register_vector<Skin*>("VectorSkin");
    register_vector<EventData*>("VectorEventData");
    register_vector<Event*>("VectorEvent");
    register_vector<ConstraintData*>("VectorConstraintData");
    register_vector<IkConstraint*>("VectorIkConstraint");
    register_vector<PathConstraint*>("VectorPathConstraint");
    register_vector<TransformConstraint*>("VectorTransformConstraint");
    register_vector<IkConstraintData*>("VectorIkConstraintData");
    register_vector<TransformConstraintData*>("VectorTransformConstraintData");
    register_vector<PathConstraintData*>("VectorPathConstraintData");
    register_vector<TrackEntry*>("VectorTrackEntry");

    enum_<TimelineType>("TimelineType")
        .value("rotate", TimelineType_Rotate)
        .value("translate", TimelineType_Translate)
        .value("scale", TimelineType_Scale)
        .value("shear", TimelineType_Shear)
        .value("attachment", TimelineType_Attachment)
        .value("color", TimelineType_Color)
        .value("deform", TimelineType_Deform)
        .value("event", TimelineType_Event)
        .value("drawOrder", TimelineType_DrawOrder)
        .value("ikConstraint", TimelineType_IkConstraint)
        .value("transformConstraint", TimelineType_TransformConstraint)
        .value("pathConstraintPosition", TimelineType_PathConstraintPosition)
        .value("pathConstraintSpacing", TimelineType_PathConstraintSpacing)
        .value("pathConstraintMix", TimelineType_PathConstraintMix)
        .value("twoColor", TimelineType_TwoColor);
    
    enum_<MixDirection>("MixDirection")
        .value("mixIn", MixDirection_In)
        .value("mixOut", MixDirection_Out);

    enum_<MixBlend>("MixBlend")
        .value("setup", MixBlend_Setup)
        .value("first", MixBlend_First)
        .value("replace", MixBlend_Replace)
        .value("add", MixBlend_Add);

    enum_<BlendMode>("BlendMode")
        .value("Normal", BlendMode_Normal)
        .value("Additive", BlendMode_Additive)
        .value("Multiply", BlendMode_Multiply)
        .value("Screen", BlendMode_Screen);

    enum_<EventType>("EventType")
        .value("start", EventType_Start)
        .value("interrupt", EventType_Interrupt)
        .value("end", EventType_End)
        .value("dispose", EventType_Dispose)
        .value("complete", EventType_Complete)
        .value("event", EventType_Event);

    enum_<TransformMode>("TransformMode")
        .value("Normal", TransformMode_Normal)
        .value("OnlyTranslation", TransformMode_OnlyTranslation)
        .value("NoRotationOrReflection", TransformMode_NoRotationOrReflection)
        .value("NoScale", TransformMode_NoScale)
        .value("NoScaleOrReflection", TransformMode_NoScaleOrReflection);

    enum_<PositionMode>("PositionMode")
        .value("Fixed", PositionMode_Fixed)
        .value("Percent", PositionMode_Percent);

    enum_<SpacingMode>("SpacingMode")
        .value("Length", SpacingMode_Length)
        .value("Fixed", SpacingMode_Fixed)
        .value("Percent", SpacingMode_Percent);

    enum_<RotateMode>("RotateMode")
        .value("Tangent", RotateMode_Tangent)
        .value("Chain", RotateMode_Chain)
        .value("ChainScale", RotateMode_ChainScale);

    enum_<TextureFilter>("TextureFilter")
        .value("Unknown", TextureFilter_Unknown)
        .value("Nearest", TextureFilter_Nearest)
        .value("Linear", TextureFilter_Linear)
        .value("MipMap", TextureFilter_MipMap)
        .value("MipMapNearestNearest", TextureFilter_MipMapNearestNearest)
        .value("MipMapLinearNearest", TextureFilter_MipMapLinearNearest)
        .value("MipMapNearestLinear", TextureFilter_MipMapNearestLinear)
        .value("MipMapLinearLinear", TextureFilter_MipMapLinearLinear);

    enum_<TextureWrap>("TextureWrap")
        .value("MirroredRepeat", TextureWrap_MirroredRepeat)
        .value("ClampToEdge", TextureWrap_ClampToEdge)
        .value("Repeat", TextureWrap_Repeat);

    enum_<AttachmentType>("AttachmentType")
        .value("Region", AttachmentType_Region)
        .value("BoundingBox", AttachmentType_Boundingbox)
        .value("Mesh", AttachmentType_Mesh)
        .value("LinkedMesh", AttachmentType_Linkedmesh)
        .value("Path", AttachmentType_Path)
        .value("Point", AttachmentType_Point)
        .value("Clipping", AttachmentType_Clipping);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // class_<Vector>("Vector")
    //     .constructor<>()
    //     .constructor<const Vector &>()
    //     .function("size", &Vector::size);

    // class_<Pool>("Pool")
    //     .constructor<>();

    class_<MathUtil>("MathUtils")
        .class_property("PI", &MathUtil::Pi)
        .class_property("PI2", &MathUtil::Pi_2)
        //.class_property("radiansToDegrees", &MathUtil::radiansToDegrees)
        .class_property("radDeg", &MathUtil::Rad_Deg)
        //.class_property("degreesToRadians", &MathUtil::degreesToRadians)
        .class_function("clamp", &MathUtil::clamp)
        .class_function("cosDeg", &MathUtil::cosDeg)
        .class_function("cosDeg", &MathUtil::cosDeg)
        .class_function("sinDeg", &MathUtil::sinDeg)
        .class_function("signum", &MathUtil::sign);
        //.class_function("toInt", &MathUtil::toInt)
        //.class_function("cbrt", &MathUtil::randomTriangular)
        //.class_function("randomTriangular", &MathUtil::randomTriangular)
        //.class_function("randomTriangularWith", &MathUtil::randomTriangular);

    class_<Color>("Color")
        .constructor<>()
        .constructor<float, float, float, float>()
        .function("set", static_cast<Color&(Color::*)(float, float, float, float)>(&Color::set))
        //.function("setFromColor", static_cast<Color&(Color::*)(const Color&)>(&Color::set)) //no need
        .function("add", static_cast<Color&(Color::*)(float, float, float, float)>(&Color::add))
        .function("clamp", &Color::clamp)
        .property("r", &Color::r)
        .property("g", &Color::g)
        .property("b", &Color::b)
        .property("a", &Color::a);
    
    class_<Interpolation>("Interpolation")
        .function("apply", &Interpolation::apply, pure_virtual());


    class_<Triangulator>("Triangulator")
        .constructor<>()
        .function("triangulate", &Triangulator::triangulate)
        .function("decompose", &Triangulator::decompose, allow_raw_pointers());


    class_<ConstraintData>("ConstraintData")
        .constructor<const String& >()
        .function("getName", optional_override([](ConstraintData &obj) { return STRING_SP2STD(obj.getName());}))
        .function("getOrder", &ConstraintData::getOrder)
        .function("setOrder", &ConstraintData::setOrder)
        .function("getSkinRequired", &ConstraintData::isSkinRequired)
        .function("setSkinRequired", &ConstraintData::setSkinRequired);

    class_<IkConstraintData, base<ConstraintData>>("IkConstraintData")
        .constructor<const String& >()
        .function("getBones", optional_override([](IkConstraintData &obj) { return VECTOR_SP2STD(obj.getBones());}), allow_raw_pointers())
        .function("getTarget", &IkConstraintData::getTarget, allow_raw_pointer<BoneData>())
        .function("setTarget", &IkConstraintData::setTarget, allow_raw_pointer<BoneData>())
        .function("getBendDirection", &IkConstraintData::getBendDirection)
        .function("setBendDirection", &IkConstraintData::setBendDirection)
        .function("getCompress", &IkConstraintData::getCompress)
        .function("setCompress", &IkConstraintData::setCompress)
        .function("getStretch", &IkConstraintData::getStretch)
        .function("setStretch", &IkConstraintData::setStretch)
        .function("getUniform", &IkConstraintData::getUniform)
        .function("setUniform", &IkConstraintData::setUniform)
        .function("getMix", &IkConstraintData::getMix)
        .function("setMix", &IkConstraintData::setMix)
        .function("getSoftness", &IkConstraintData::getSoftness)
        .function("setSoftness", &IkConstraintData::setSoftness);

    class_<PathConstraintData, base<ConstraintData>>("PathConstraintData")
        .constructor<const String& >()
        .function("getBones", optional_override([](PathConstraintData &obj) { return VECTOR_SP2STD(obj.getBones());}), allow_raw_pointers())
        .function("getTarget", &PathConstraintData::getTarget, allow_raw_pointer<SlotData>())
        .function("setTarget", &PathConstraintData::setTarget, allow_raw_pointer<SlotData>())
        .function("getPositionMode", &PathConstraintData::getPositionMode)
        .function("setPositionMode", &PathConstraintData::setPositionMode)
        .function("getSpacingMode", &PathConstraintData::getSpacingMode)
        .function("setSpacingMode", &PathConstraintData::setSpacingMode)
        .function("getRotateMode", &PathConstraintData::getRotateMode)
        .function("setRotateMode", &PathConstraintData::setRotateMode)
        .function("getOffsetRotation", &PathConstraintData::getOffsetRotation)
        .function("setOffsetRotation", &PathConstraintData::setOffsetRotation)
        .function("getPosition", &PathConstraintData::getPosition)
        .function("setPosition", &PathConstraintData::setPosition)
        .function("getSpacing", &PathConstraintData::getSpacing)
        .function("setSpacing", &PathConstraintData::setSpacing)
        .function("getRotateMix", &PathConstraintData::getRotateMix)
        .function("setRotateMix", &PathConstraintData::setRotateMix)
        .function("getTranslateMix", &PathConstraintData::getTranslateMix)
        .function("setTranslateMix", &PathConstraintData::setTranslateMix);

    class_<SkeletonBounds>("SkeletonBounds")
        //.function("getProp_minX", &SkeletonBounds::minX)
        //.function("getProp_minY", &SkeletonBounds::minY)
        //.function("getProp_maxX", &SkeletonBounds::maxX)
        //.function("getProp_maxY", &SkeletonBounds::maxY)
        //.function("getProp_boundingBoxes", &SkeletonBounds::boundingBoxes)
        //.function("getProp_polygons", &SkeletonBounds::polygons)
        .function("update", &SkeletonBounds::update)
        //.function("aabbCompute", &SkeletonBounds::aabbCompute) // private
        .function("aabbContainsPoint", &SkeletonBounds::aabbcontainsPoint)
        .function("aabbIntersectsSegment", &SkeletonBounds::aabbintersectsSegment)
        .function("aabbIntersectsSkeleton", &SkeletonBounds::aabbIntersectsSkeleton)
        //.function("containsPoint", select_overload<void(float, float)>(&SkeletonBounds::containsPoint), allow_raw_pointers())
        //.function("containsPointPolygon", select_overload<void(Polygon*, float, float)>(&SkeletonBounds::containsPoint), allow_raw_pointers())
        //.function("intersectsSegment", select_overload<void(float, float, float, float)>(&SkeletonBounds::intersectsSegment))
        //.function("intersectsSegmentPolygon", select_overload<void(spine::Polygon*, float, float, float, float)>(&SkeletonBounds::intersectsSegment), allow_raw_pointers())
        .function("getPolygon", &SkeletonBounds::getPolygon, allow_raw_pointers())
        .function("getWidth", &SkeletonBounds::getWidth)
        .function("getHeight", &SkeletonBounds::getHeight);

    class_<Event>("Event")
        .constructor<float , const EventData &>()
        .function("getData", &Event::getData)
        .function("getIntValue", &Event::getIntValue)
        .function("getFloatValue", &Event::getFloatValue)
        .function("getStringValue",optional_override([](Event &obj) { return STRING_SP2STD(obj.getStringValue());}))
        .function("getTime", &Event::getTime)
        .function("getVolume", &Event::getVolume)
        .function("getBalance", &Event::getBalance); 

    class_<EventData>("EventData")
        .constructor<const String &>()
        .function("getName", optional_override([](EventData &obj) { return STRING_SP2STD(obj.getName());}))
        .function("getIntValue", &EventData::getIntValue)
        .function("getFloatValue", &EventData::getFloatValue)
        .function("getStringValue", optional_override([](EventData &obj) { return STRING_SP2STD(obj.getStringValue());}))
        .function("getAudioPath", optional_override([](EventData &obj) { return STRING_SP2STD(obj.getAudioPath());}))
        .function("getVolume", &EventData::getVolume)
        .function("getBalance", &EventData::getBalance);
    

    class_<Attachment>("Attachment")
        .function("getName", optional_override([](Attachment &obj) { return STRING_SP2STD(obj.getName());}));

    // pure_virtual and raw pointer 
    class_<VertexAttachment, base<Attachment>>("VertexAttachment")
        //.constructor<const String& >()
        .function("getProp_id", &VertexAttachment::getId)
        .function("getProp_bones", &VertexAttachment::getBones)
        .function("getProp_vertices", &VertexAttachment::getVertices)
        .function("getProp_worldVerticesLength", &VertexAttachment::getWorldVerticesLength)
        .function("getProp_deformAttachment", &VertexAttachment::getDeformAttachment, allow_raw_pointer<VertexAttachment>())
        .function("getProp_name", &VertexAttachment::getName)
        //.function("computeWorldVertices", &VertexAttachment::computeWorldVertices);
        .function("copy", &VertexAttachment::copy, allow_raw_pointer<VertexAttachment>())
        .function("copyTo", &VertexAttachment::copyTo, allow_raw_pointer<VertexAttachment>());

    class_<BoundingBoxAttachment, base<VertexAttachment>>("BoundingBoxAttachment")
        .constructor<const String& >()
        .function("getName", optional_override([](BoundingBoxAttachment &obj) { return STRING_SP2STD(obj.getName());}))
        .function("copy", &BoundingBoxAttachment::copy, allow_raw_pointers());
        //.function("getProp_color", &BoundingBoxAttachment::getColor)

    class_<ClippingAttachment, base<VertexAttachment>>("ClippingAttachment")
        .constructor<const String& >()
        .function("getEndSlot", &ClippingAttachment::getEndSlot, allow_raw_pointer<SlotData>())
        .function("copy", &ClippingAttachment::copy, allow_raw_pointer<Attachment>());
        //.function("getProp_color", &ClippingAttachment::getColor)

    class_<MeshAttachment, base<VertexAttachment>>("MeshAttachment")
        .constructor<const String& >()
        //.function("getProp_region", &MeshAttachment::getRegion)
        .function("getPath", optional_override([](MeshAttachment &obj) { return STRING_SP2STD(obj.getPath());}))
        .function("getRegionUVs", &MeshAttachment::getRegionUVs)
        .function("getUVs", &MeshAttachment::getUVs)
        .function("getTriangles", &MeshAttachment::getTriangles)
        .function("getColor", &MeshAttachment::getColor)
        .function("getWidth", &MeshAttachment::getWidth)
        .function("getHeight", &MeshAttachment::getHeight)
        .function("getHullLength", &MeshAttachment::getHullLength)
        .function("getEdges", &MeshAttachment::getEdges)
        //.function("getProp_tempColor", &MeshAttachment::getTempColor) // no tempColor
        .function("updateUVs", &MeshAttachment::updateUVs)
        .function("getParentMesh", &MeshAttachment::getParentMesh, allow_raw_pointer<MeshAttachment>())
        .function("setParentMesh", &MeshAttachment::setParentMesh, allow_raw_pointer<MeshAttachment>())
        .function("copy", &MeshAttachment::copy, allow_raw_pointer<Attachment>())
        .function("newLinkedMesh", &MeshAttachment::newLinkedMesh, allow_raw_pointer<MeshAttachment>());

    class_<PathAttachment, base<VertexAttachment>>("PathAttachment")
        .constructor<const String& >()
        .function("getLengths", optional_override([](PathAttachment &obj) { return VECTOR_SP2STD(obj.getLengths());}))
        .function("getClosed", &PathAttachment::isClosed)
        .function("getConstantSpeed", &PathAttachment::isConstantSpeed)
        //.function("getProp_color", &MeshAttachment::getColor) // no color
        .function("copy", &PathAttachment::copy, allow_raw_pointers());

    class_<PointAttachment, base<Attachment>>("PointAttachment")
        .constructor<const String& >()
        .function("getX", &PointAttachment::getX)
        .function("getY", &PointAttachment::getY)
        .function("getRotation", &PointAttachment::getRotation)
        //.function("computeWorldPosition", &PointAttachment::computeWorldPosition) //reference type
        .function("computeWorldRotation", &PointAttachment::computeWorldRotation)
        //.function("getProp_color", &PointAttachment::getColor) // no color
        .function("copy", &PointAttachment::copy, allow_raw_pointer<Attachment>());

    //class_<HasRendererObject>("HasRendererObject")
    //    .constructor<>();


    class_<RegionAttachment, base<Attachment>>("RegionAttachment")
        .constructor<const String& >()
        // static U4: number;
        // static V4: number;
        // .......
        .function("getX", &RegionAttachment::getX)
        .function("getY", &RegionAttachment::getY)
        .function("getScaleX", &RegionAttachment::getScaleX)
        .function("getScaleY", &RegionAttachment::getScaleY)
        .function("getRotation", &RegionAttachment::getRotation)
        .function("getWidth", &RegionAttachment::getWidth)
        .function("getHeight", &RegionAttachment::getHeight)
        .function("getColor", &RegionAttachment::getColor)
        .function("getPath", optional_override([](RegionAttachment &obj) { return STRING_SP2STD(obj.getPath());}))
        .function("getRendererObject", &RegionAttachment::getRendererObject, allow_raw_pointer<void>())
        //.function("getProp_region", &PointAttachment::getRegion)
        .function("getOffset", &RegionAttachment::getOffset)
        .function("getUVs", &RegionAttachment::getUVs)
        //.function("getProp_tempColor", &PointAttachment::getTempColor) // have no tempColor
        .function("updateOffset", &RegionAttachment::updateOffset)
        //.function("setRegion", &RegionAttachment::setRegion) // have no setRegion
        .function("copy", &RegionAttachment::copy, allow_raw_pointer<Attachment>());


    // class_<AttachmentLoader>("AttachmentLoader")
    //     .constructor<>()
    //     .function("newClippingAttachment", &AttachmentLoader::newClippingAttachment, pure_virtual(), allow_raw_pointer<ClippingAttachment>())
    //     .function("newPointAttachment", &AttachmentLoader::newPointAttachment, pure_virtual(), allow_raw_pointer<PointAttachment>())
    //     .function("newPathAttachment", &AttachmentLoader::newPathAttachment, pure_virtual(), allow_raw_pointer<PathAttachment>())
    //     .function("newBoundingBoxAttachment", &AttachmentLoader::newBoundingBoxAttachment, pure_virtual(), allow_raw_pointer<BoundingBoxAttachment>())
    //     .function("newMeshAttachment", &AttachmentLoader::newMeshAttachment, pure_virtual(), allow_raw_pointer<MeshAttachment>())
    //     .function("newRegionAttachment", &AttachmentLoader::newRegionAttachment, pure_virtual(), allow_raw_pointer<RegionAttachment>());


    class_<AtlasAttachmentLoader, base<AttachmentLoader>>("AtlasAttachmentLoader")
        .constructor<Atlas* >()
        .function("newRegionAttachment", &AtlasAttachmentLoader::newRegionAttachment, allow_raw_pointer<RegionAttachment>())
        .function("newMeshAttachment", &AtlasAttachmentLoader::newMeshAttachment, allow_raw_pointer<MeshAttachment>())
        .function("newBoundingBoxAttachment", &AtlasAttachmentLoader::newBoundingBoxAttachment, allow_raw_pointer<BoundingBoxAttachment>())
        .function("newPathAttachment", &AtlasAttachmentLoader::newPathAttachment, allow_raw_pointer<PathAttachment>())
        .function("newPointAttachment", &AtlasAttachmentLoader::newPointAttachment, allow_raw_pointer<PointAttachment>())
        .function("newClippingAttachment", &AtlasAttachmentLoader::newClippingAttachment, allow_raw_pointer<ClippingAttachment>());
        //.function("getProp_atlas")

    class_<AtlasPage>("TextureAtlasPage")
        .constructor<const String&>()
        .function("getName", optional_override([](AtlasPage &obj) { return STRING_SP2STD((const String)obj.name);}))
        .property("minFilter", &AtlasPage::minFilter)
        .property("magFilter", &AtlasPage::magFilter)
        .property("uWrap", &AtlasPage::uWrap)
        .property("vWrap", &AtlasPage::vWrap)
        //.property("texture", &AtlasPage::texture) // no texture, use renderer object
        .property("width", &AtlasPage::width)
        .property("height", &AtlasPage::height);

    class_<AtlasRegion>("TextureAtlasRegion")
        //.property("page", &AtlasRegion::page)
        .function("getName", optional_override([](AtlasRegion &obj) { return STRING_SP2STD((const String)obj.name);}))
        .property("x", &AtlasRegion::x)
        .property("y", &AtlasRegion::y)
        .property("index", &AtlasRegion::index)
        .property("rotate", &AtlasRegion::rotate)
        .property("degrees", &AtlasRegion::degrees);
        //.property("texture", &AtlasRegion::height)


    class_<Atlas>("TextureAtlas")
        .constructor<const String&, TextureLoader*, bool>()
        //.function("getProp_pages")
        //.function("getProp_regions")
        .function("findRegion", optional_override([](Atlas &obj, const std::string& name) { return obj.findRegion(STRING_STD2SP(name));}), allow_raw_pointers());
        //.function("dispose");

    class_<PowInterpolation, base<Interpolation>>("Pow")
        .constructor<int>()
        .function("apply", &PowInterpolation::apply);
    
    class_<PowOutInterpolation, base<Interpolation>>("PowOut")
        .constructor<int>()
        .function("apply", &PowInterpolation::apply);
 
    // class_<Vector2>("Vector2")
    //     .constructor<float, float>()
    //     .function("set", static_cast<Vector2&(Vector2::*)(float, float)>(&Vector2::set))
    //     .function("length", &Vector2::length)
    //     .function("normalize", static_cast<Vector2&(Vector2::*)()>(&Vector2::normalize))
    //     .property("x", &Vector2::x)
    //     .property("y", &Vector2::y);

    class_<BoneData>("BoneData")
        .constructor<int, const String&, BoneData *>()
        .function("getIndex", &BoneData::getIndex)
        .function("getName", optional_override([](BoneData &obj) { return STRING_SP2STD(obj.getName());}))
        .function("getParent", &BoneData::getParent, allow_raw_pointer<BoneData>())
        .function("getLength", &BoneData::getLength)
        .function("getX", &BoneData::getX)
        .function("getY", &BoneData::getY)
        .function("getRotation", &BoneData::getRotation)
        .function("getScaleX", &BoneData::getScaleX)
        .function("getScaleY", &BoneData::getScaleY)
        .function("getShearX", &BoneData::getShearX)
        .function("getShearY", &BoneData::getShearY)
        .function("getTransformMode", &BoneData::getTransformMode)
        .function("getSkinRequired", &BoneData::isSkinRequired);
        //.function("getProp_color", &BoneData::isSkinRequired) // have no color
    
    class_<SlotData>("SlotData")
        .constructor<int, const String&, BoneData &>()
        .function("getIndex", &SlotData::getIndex)
        .function("getName", optional_override([](SlotData &obj) { return STRING_SP2STD(obj.getName());}))
        .function("getBoneData", &SlotData::getBoneData)
        .function("getColor", &SlotData::getColor)
        .function("getDarkColor", &SlotData::getDarkColor)
        .function("getBlendMode", &SlotData::getBlendMode);
        
    class_<Updatable>("Updatable")
        .function("update", &Updatable::update, pure_virtual())
        .function("isActive", &Updatable::isActive, pure_virtual());

    class_<IkConstraint, base<Updatable>>("IkConstraint")
        .constructor<IkConstraintData &, Skeleton &>()
        .function("getData",  &IkConstraint::getData)
        .function("getBones", optional_override([](IkConstraint &obj) { return VECTOR_SP2STD(obj.getBones());}), allow_raw_pointers())
        .function("getTarget",  &IkConstraint::getTarget, allow_raw_pointer<Bone>())
        .function("setTarget", &IkConstraint::setTarget, allow_raw_pointer<Bone>())
        .function("getBendDirection",  &IkConstraint::getBendDirection)
        .function("setBendDirection", &IkConstraint::setBendDirection)
        .function("getCompress",  &IkConstraint::getCompress)
        .function("setCompress", &IkConstraint::setCompress)
        .function("getStretch",  &IkConstraint::getStretch)
        .function("setStretch", &IkConstraint::setStretch)
        .function("getMix",  &IkConstraint::getMix)
        .function("setMix", &IkConstraint::setMix)
        .function("getSoftness",  &IkConstraint::getSoftness)
        .function("setSoftness", &IkConstraint::setSoftness)
        .function("getActive",  &IkConstraint::isActive)
        .function("setActive", &IkConstraint::setActive)
        .function("isActive",  &IkConstraint::isActive)
        .function("apply", static_cast<void(IkConstraint::*)()>(&IkConstraint::apply))
        .function("update", &IkConstraint::update)
        //.function("apply1", static_cast<void(Updatable::*)(Bone &, float, float, bool, bool, bool, float)>(&IkConstraint::apply))
        //.function("apply2", static_cast<void(IkConstraint::*)(Bone &, Bone &, float, float, int, bool, float, float)>(&IkConstraint::apply))
        ;

    class_<PathConstraint, base<Updatable>>("PathConstraint")
        .constructor<PathConstraintData&, Skeleton&>()
        // private but no need, just wrap in js
        // static const float EPSILON;
        // static const int NONE;
        // static const int BEFORE;
        // static const int AFTER;
        .function("getData",  &PathConstraint::getData)
        .function("getBones", optional_override([](PathConstraint &obj) { return VECTOR_SP2STD(obj.getBones());}), allow_raw_pointers())
        .function("getTarget",  &PathConstraint::getTarget, allow_raw_pointer<Slot>())
        .function("setTarget", &PathConstraint::setTarget, allow_raw_pointer<Slot>())
        .function("getPosition",  &PathConstraint::getPosition)
        .function("setPosition", &PathConstraint::setPosition)
        .function("getSpacing",  &PathConstraint::getSpacing)
        .function("setSpacing", &PathConstraint::setSpacing)
        .function("getRotateMix",  &PathConstraint::getRotateMix)
        .function("setRotateMix", &PathConstraint::setRotateMix)
        .function("getTranslateMix",  &PathConstraint::getTranslateMix)
        .function("getTranslateMix", &PathConstraint::setTranslateMix)
        //.function("getProp_spaces",  &PathConstraint::spaces)
        //.function("getProp_positions",  &PathConstraint::positions)
        //.function("getProp_world",  &PathConstraint::world)
        //.function("getProp_curves",  &PathConstraint::curves)
        //.function("getProp_lengths",  &PathConstraint::lengths)
        //.function("getProp_segments",  &PathConstraint::segments)
        .function("getActive",  &PathConstraint::isActive)
        .function("isActive",  &PathConstraint::isActive)
        .function("setActive", &PathConstraint::setActive)
        .function("apply",  &PathConstraint::apply)
        .function("update",  &PathConstraint::update)
        //.function("computeWorldPositions",  &PathConstraint::computeWorldPositions)
        //.function("addBeforePosition",  &PathConstraint::addBeforePosition)
        //.function("addAfterPosition",  &PathConstraint::addAfterPosition)
        //.function("addCurvePosition",  &PathConstraint::addCurvePosition) // private
        ;

    class_<TransformConstraintData, base<ConstraintData>>("TransformConstraintData")
        .constructor<const String&>()
        .function("getBones", optional_override([](TransformConstraintData &obj) { return VECTOR_SP2STD(obj.getBones());}), allow_raw_pointers())
        .function("getTarget", &TransformConstraintData::getTarget, allow_raw_pointer<BoneData>())
        .function("getRotateMix", &TransformConstraintData::getRotateMix)
        .function("getTranslateMix", &TransformConstraintData::getTranslateMix)
        .function("getScaleMix", &TransformConstraintData::getScaleMix)
        .function("getShearMix", &TransformConstraintData::getShearMix)
        .function("getOffsetRotation", &TransformConstraintData::getOffsetRotation)
        .function("getOffsetX", &TransformConstraintData::getOffsetX)
        .function("getOffsetY", &TransformConstraintData::getOffsetY)
        .function("getOffsetScaleX", &TransformConstraintData::getOffsetScaleX)
        .function("getOffsetScaleY", &TransformConstraintData::getOffsetScaleY)
        .function("getOffsetShearY", &TransformConstraintData::getOffsetShearY)
        .function("getRelative", &TransformConstraintData::isRelative)
        .function("getLocal", &TransformConstraintData::isLocal);

    class_<TransformConstraint, base<Updatable>>("TransformConstraint")
        .constructor<TransformConstraintData &, Skeleton &>()
        .function("getData", &TransformConstraint::getData)
        .function("getBones", optional_override([](TransformConstraint &obj) { return VECTOR_SP2STD(obj.getBones());}), allow_raw_pointers())
        .function("getTarget", &TransformConstraint::getTarget, allow_raw_pointer<Bone>())
        .function("getRotateMix", &TransformConstraint::getRotateMix)
        .function("getTranslateMix", &TransformConstraint::getTranslateMix)
        .function("getScaleMix", &TransformConstraint::getScaleMix)
        .function("getShearMix", &TransformConstraint::getShearMix)
        //.function("getProp_temp") // no
        .function("getActive", &TransformConstraint::isActive)
        .function("isActive", &TransformConstraint::isActive)
        .function("apply", &TransformConstraint::apply)
        .function("update", &TransformConstraint::update);
        //.function("applyAbsoluteWorld", &TransformConstraint::applyAbsoluteWorld)
        //.function("applyRelativeWorld", &TransformConstraint::applyRelativeWorld)
        //.function("applyAbsoluteLocal", &TransformConstraint::applyAbsoluteLocal)
        //.function("applyRelativeLocal", &TransformConstraint::applyRelativeLocal)


    class_<Bone, base<Updatable>>("Bone")
        .constructor<BoneData &, Skeleton &, Bone *>()
        .function("getData", &Bone::getData)
        .function("getSkeleton", &Bone::getSkeleton)
        .function("getParent", &Bone::getParent, allow_raw_pointers())
        //.function("getProp_children", &Bone::getChildren)
        .function("getX", &Bone::getX)
        .function("getY", &Bone::getY)
        .function("getRotation", &Bone::getRotation)
        .function("getScaleX", &Bone::getScaleX)
        .function("getScaleY", &Bone::getScaleY)
        .function("getShearX", &Bone::getShearX)
        .function("getShearY", &Bone::getShearY)
        .function("getAX", &Bone::getAX)
        .function("getAY", &Bone::getAY)
        .function("getARotation", &Bone::getAppliedRotation)
        .function("getAScaleX", &Bone::getAScaleX)
        .function("getAScaleY", &Bone::getAScaleY)
        .function("getAShearX", &Bone::getAShearX)
        .function("getAShearY", &Bone::getAShearY)
        .function("getAppliedValid", &Bone::isAppliedValid)
        .function("getA", &Bone::getA)
        .function("getB", &Bone::getB)
        .function("getC", &Bone::getC)
        .function("getD", &Bone::getD)
        .function("getWorldY", &Bone::getWorldY)
        .function("getWorldX", &Bone::getWorldX)
        //.function("getProp_sorted", &Bone::getSorted)
        .function("getActive", &Bone::isActive)
        .function("isActive", &Bone::isActive)
        .function("update", &Bone::update)
        .function("updateWorldTransform", select_overload<void()>(&Bone::updateWorldTransform))
        .function("updateWorldTransformWith", select_overload<void(float, float , float, float , float , float , float )>(&Bone::updateWorldTransform))
        .function("setToSetupPose", &Bone::setToSetupPose)
        .function("getWorldRotationX", &Bone::getWorldRotationX)
        .function("getWorldRotationY", &Bone::getWorldRotationY)
        .function("getWorldScaleX", &Bone::getWorldScaleX)
        .function("getWorldScaleY", &Bone::getWorldScaleY)
        //.function("updateAppliedTransform", &Bone::updateAppliedTransform)
        //.function("worldToLocal", &Bone::worldToLocal)
        //.function("localToWorld", &Bone::localToWorld)
        .function("worldToLocalRotation", &Bone::worldToLocalRotation)
        .function("localToWorldRotation", &Bone::localToWorldRotation)
        .function("rotateWorld", &Bone::rotateWorld)
        .function("setX", &Bone::setX)
        .function("setY", &Bone::setY)
        .function("setRotation", &Bone::setRotation)
        .function("setScaleX", &Bone::setScaleX)
        .function("setScaleY", &Bone::setScaleY)
        .function("setShearX", &Bone::setShearX)
        .function("setShearY", &Bone::setShearY)
        .function("setAX", &Bone::setAX)
        .function("setAY", &Bone::setAY)
        .function("setARotation", &Bone::setAppliedRotation)
        .function("setAScaleX", &Bone::setAScaleX)
        .function("setAScaleY", &Bone::setAScaleY)
        .function("setAShearX", &Bone::setAShearX)
        .function("setAShearY", &Bone::setAShearY)
        .function("setAppliedValid", &Bone::setAppliedValid)
        .function("setA", &Bone::setA)
        .function("setB", &Bone::setB)
        .function("setC", &Bone::setC)
        .function("setD", &Bone::setD)
        .function("setWorldX", &Bone::setWorldX)
        .function("setWorldY", &Bone::setWorldY)
        .function("setActive", &Bone::setActive);

    class_<Slot>("Slot")
        .constructor<SlotData &, Bone &>()
        .function("getData", &Slot::getData)
        .function("getBone", &Slot::getBone)
        .function("getColor", &Slot::getColor)
        .function("getDarkColor", &Slot::getDarkColor)
        .function("getDeform", &Slot::getDeform)
        .function("getSkeleton", &Slot::getSkeleton)
        .function("getAttachment", &Slot::getAttachment, allow_raw_pointers())
        .function("setAttachment", &Slot::setAttachment, allow_raw_pointers())
        .function("setAttachmentTime", &Slot::setAttachmentTime)
        .function("getAttachmentTime", &Slot::getAttachmentTime)
        .function("setToSetupPose", &Slot::setToSetupPose);

    class_<Skin>("Skin")
        .constructor<const String&>()
        .function("getName", optional_override([](Skin &obj) { return STRING_SP2STD(obj.getName());}))
        .function("getBones", optional_override([](Skin &obj) { return VECTOR_SP2STD(obj.getBones());}), allow_raw_pointers())
        .function("getConstraints", optional_override([](Skin &obj) { return VECTOR_SP2STD(obj.getConstraints());}), allow_raw_pointers())
        .function("setAttachment", optional_override([](Skin &obj, size_t index, const std::string& name, Attachment *attachment) { return obj.setAttachment(index, STRING_STD2SP(name), attachment); }), allow_raw_pointers())
        .function("addSkin", select_overload<void(Skin *)>(&Skin::addSkin), allow_raw_pointers())
        .function("copySkin", select_overload<void(Skin *)>(&Skin::copySkin), allow_raw_pointers())
        .function("getAttachment", optional_override([](Skin &obj, size_t slotIndex, const std::string& name) { 
            return obj.getAttachment(slotIndex, STRING_STD2SP(name));
        }), allow_raw_pointers())
        .function("getAttachments", optional_override([](Skin &obj) {
            std::vector<Skin::AttachmentMap::Entry*> entriesVector;
            auto entries = obj.getAttachments();
            while (entries.hasNext()) {
                entriesVector.push_back(&entries.next());
            }
            return entriesVector;
        }), allow_raw_pointers())
        .function("removeAttachment", optional_override([](Skin &obj, size_t index, const std::string& name) { obj.removeAttachment(index, STRING_STD2SP(name)); }))
        .function("getAttachmentsForSlot", optional_override([](Skin &obj, size_t index) {
            std::vector<Skin::AttachmentMap::Entry*> entriesVector;
            auto entries = obj.getAttachments();
            while (entries.hasNext()) {
                Skin::AttachmentMap::Entry &entry = entries.next();
                if (entry._slotIndex == index) entriesVector.push_back(&entry);
            }
            return entriesVector;
        }), allow_raw_pointers())
        //.function("clear", &Skin::clear); // have no clear
        //.function("attachAll", &Skin::attachAll)
        ;

    class_<Skin::AttachmentMap::Entry>("SkinEntry")
        .constructor<size_t, const String &, Attachment *>()
        .property("slotIndex", &Skin::AttachmentMap::Entry::_slotIndex)
        .function("getName", optional_override([](Skin::AttachmentMap::Entry &obj) { return STRING_SP2STD((const String)obj._name);}))
        .function("getAttachment", optional_override([](Skin::AttachmentMap::Entry &obj) { return obj._attachment;}), allow_raw_pointers())
        ;

    class_<SkeletonClipping>("SkeletonClipping")
        .constructor<>()
        .function("getClippedVertices", &SkeletonClipping::getClippedVertices)
        .function("getClippedTriangles", &SkeletonClipping::getClippedTriangles)
        .function("getUVs", &SkeletonClipping::getClippedUVs)
        .function("clipStart", &SkeletonClipping::clipStart, allow_raw_pointers())
        .function("clipEndWithSlot", select_overload<void(Slot&)>(&SkeletonClipping::clipEnd))
        .function("clipEnd", select_overload<void()>(&SkeletonClipping::clipEnd))
        .function("isClipping", &SkeletonClipping::isClipping);
        //.function("clipTriangles", &SkeletonClipping::clipTriangles, allow_raw_pointers()); //paramters not match
        //.function("clip", &SkeletonClipping::clip)
        //.class_function("makeClockwise", &SkeletonClipping::makeClockwise)

    class_<SkeletonData>("SkeletonData")
        .constructor<>()
        .function("getName", optional_override([](SkeletonData &obj) { return STRING_SP2STD(obj.getName());}))
        .function("getBones", optional_override([](SkeletonData &obj) { return VECTOR_SP2STD(obj.getBones());}), allow_raw_pointers())
        .function("getSlots", optional_override([](SkeletonData &obj) { return VECTOR_SP2STD(obj.getSlots());}), allow_raw_pointers())
        .function("getSkins", optional_override([](SkeletonData &obj) { return VECTOR_SP2STD(obj.getSkins());}), allow_raw_pointers())
        .function("getDefaultSkin", &SkeletonData::getDefaultSkin, allow_raw_pointer<Skin>())
        .function("getEvents", optional_override([](SkeletonData &obj) { return VECTOR_SP2STD(obj.getEvents());}), allow_raw_pointers())
        .function("getAnimations", optional_override([](SkeletonData &obj) { return VECTOR_SP2STD(obj.getAnimations());}), allow_raw_pointers())
        .function("getIkConstraints", optional_override([](SkeletonData &obj) { return VECTOR_SP2STD(obj.getIkConstraints());}), allow_raw_pointers())
        .function("getTransformConstraints", optional_override([](SkeletonData &obj) { return VECTOR_SP2STD(obj.getTransformConstraints());}), allow_raw_pointers())
        .function("getPathConstraints", optional_override([](SkeletonData &obj) { return VECTOR_SP2STD(obj.getPathConstraints());}), allow_raw_pointers())
        .function("getX", &SkeletonData::getX)
        .function("getY", &SkeletonData::getY)
        .function("getWidth", &SkeletonData::getWidth)
        .function("getHeight", &SkeletonData::getHeight)
        .function("getVersion", optional_override([](SkeletonData &obj) { return STRING_SP2STD(obj.getVersion());}))
        .function("getHash", optional_override([](SkeletonData &obj) { return STRING_SP2STD(obj.getHash());}))
        .function("getFps", &SkeletonData::getFps)
        .function("getImagesPath", optional_override([](SkeletonData &obj) { return STRING_SP2STD(obj.getImagesPath());}))
        .function("getAudioPath",optional_override([](SkeletonData &obj) { return STRING_SP2STD(obj.getAudioPath());}))
        .function("findBone", optional_override([](SkeletonData &obj, const std::string& name) { return obj.findBone(STRING_STD2SP(name));}), allow_raw_pointers())
        .function("findBoneIndex", optional_override([](SkeletonData &obj, const std::string& name) { return obj.findBoneIndex(STRING_STD2SP(name));}))
        .function("findSlot", optional_override([](SkeletonData &obj, const std::string& name) { return obj.findSlot(STRING_STD2SP(name));}), allow_raw_pointers())
        .function("findSlotIndex", optional_override([](SkeletonData &obj, const std::string& name) { return obj.findSlotIndex(STRING_STD2SP(name));}))
        .function("findSkin", optional_override([](SkeletonData &obj, const std::string& name) { return obj.findSkin(STRING_STD2SP(name));}), allow_raw_pointers())
        .function("findEvent", optional_override([](SkeletonData &obj, const std::string& name) { return obj.findEvent(STRING_STD2SP(name));}), allow_raw_pointers())
        .function("findAnimation", optional_override([](SkeletonData &obj, const std::string& name) { return obj.findAnimation(STRING_STD2SP(name));}), allow_raw_pointers())
        .function("findIkConstraint", optional_override([](SkeletonData &obj, const std::string& name) { return obj.findIkConstraint(STRING_STD2SP(name));}), allow_raw_pointers())
        .function("findTransformConstraint", optional_override([](SkeletonData &obj, const std::string& name) { return obj.findTransformConstraint(STRING_STD2SP(name));}), allow_raw_pointers())
        .function("findPathConstraint", optional_override([](SkeletonData &obj, const std::string& name) { return obj.findPathConstraint(STRING_STD2SP(name));}), allow_raw_pointers())
        .function("findPathConstraintIndex", optional_override([](SkeletonData &obj, const std::string& name) { return obj.findPathConstraintIndex(STRING_STD2SP(name));}));

    class_<Timeline>("Timeline")
        // to fix apply
        .function("apply", &Timeline::apply, allow_raw_pointers())
        .function("getPropertyId", &Timeline::getPropertyId);

    class_<CurveTimeline, base<Timeline>>("CurveTimeline")
        // static const float LINEAR;
        // static const float STEPPED;
        // static const float BEZIER;
        // static const int BEZIER_SIZE;
        .function("getPropertyId", &CurveTimeline::getPropertyId, pure_virtual())
        .function("getFrameCount", &CurveTimeline::getFrameCount)
        .function("setLinear", &CurveTimeline::setLinear)
        .function("setStepped", &CurveTimeline::setStepped)
        .function("getCurveType", &CurveTimeline::getCurveType)
        .function("setCurve", &CurveTimeline::setCurve)
        .function("getCurvePercent", &CurveTimeline::getCurvePercent);

    class_<TranslateTimeline, base<CurveTimeline>>("TranslateTimeline")
        .constructor<int>()
        // will wrap in js
        // static const int ENTRIES
        // static const int PREV_TIME;
        // static const int PREV_X;
        // static const int PREV_Y;
        // static const int X;
        // static const int Y;
        //.function("getProp_boneIndex", &TranslateTimeline::getBoneIndex)
        //.function("getProp_frames", &TranslateTimeline::getFrames)
        .function("getPropertyId", &TranslateTimeline::getPropertyId)
        .function("setFrame", &TranslateTimeline::setFrame)
        .function("apply", &TranslateTimeline::apply, allow_raw_pointers());
    
    class_<ScaleTimeline, base<TranslateTimeline>>("ScaleTimeline")
        .constructor<int>()
        .function("getPropertyId", &ScaleTimeline::getPropertyId)
        .function("apply", &ScaleTimeline::apply, allow_raw_pointers());

    class_<ShearTimeline, base<TranslateTimeline>>("ShearTimeline")
        .constructor<int>()
        .function("getPropertyId", &ShearTimeline::getPropertyId)
        .function("apply", &ShearTimeline::apply, allow_raw_pointers());

    class_<RotateTimeline, base<CurveTimeline>>("RotateTimeline")
        .constructor<int>()
        // will wrap in js
        //static const int PREV_TIME = -2;
        //static const int PREV_ROTATION = -1;
        //static const int ROTATION = 1;
        .function("getBoneIndex", &RotateTimeline::getBoneIndex)
        .function("getFrames", optional_override([](RotateTimeline &obj) { return VECTOR_SP2STD(obj.getFrames());}))
        .function("getPropertyId", &RotateTimeline::getPropertyId)
        .function("setFrame", &RotateTimeline::setFrame)
        .function("apply", &RotateTimeline::apply, allow_raw_pointers());

    class_<ColorTimeline, base<CurveTimeline>>("ColorTimeline")
        .constructor<int>()
        // will wrap in js
        // static const int PREV_TIME;
        // static const int PREV_R;
        // static const int PREV_G;
        // static const int PREV_B;
        // static const int PREV_A;
        // static const int R;
        // static const int G;
        // static const int B;
        // static const int A;
        .function("getSlotIndex", &ColorTimeline::getSlotIndex)
        .function("getFrames", optional_override([](ColorTimeline &obj) { return VECTOR_SP2STD(obj.getFrames());}))
        .function("getPropertyId", &ColorTimeline::getPropertyId)
        .function("setFrame", &ColorTimeline::setFrame)
        .function("apply", &ColorTimeline::apply, allow_raw_pointers()); 

    class_<TwoColorTimeline, base<CurveTimeline>>("TwoColorTimeline")
        .constructor<int>()
        // static variables
        .function("getSlotIndex", &TwoColorTimeline::getSlotIndex)
        //.function("getProp_frames", &TwoColorTimeline::getFrames)
        .function("getPropertyId", &TwoColorTimeline::getPropertyId)
        .function("setFrame", &TwoColorTimeline::setFrame)
        .function("apply", &TwoColorTimeline::apply, allow_raw_pointers());

    class_<AttachmentTimeline, base<Timeline>>("AttachmentTimeline")
        .constructor<int>()
        .function("getSlotIndex", &AttachmentTimeline::getSlotIndex)
        .function("getFrames", optional_override([](AttachmentTimeline &obj) { return VECTOR_SP2STD((Vector<float> &)obj.getFrames());}))
        //.function("getProp_attachmentNames", &AttachmentTimeline::getAttachmentNames)
        .function("getPropertyId", &AttachmentTimeline::getPropertyId)
        .function("getFrameCount", &AttachmentTimeline::getFrameCount)
        .function("setFrame", &AttachmentTimeline::setFrame)
        .function("apply", &AttachmentTimeline::apply, allow_raw_pointers());
        //.function("setAttachment", &AttachmentTimeline::setAttachment) //have no setAttachment

    class_<DeformTimeline, base<CurveTimeline>>("DeformTimeline")
        .constructor<int>()
        .function("getSlotIndex", &DeformTimeline::getSlotIndex)
        .function("getAttachment", &DeformTimeline::getAttachment, allow_raw_pointer<VertexAttachment>())
        .function("getFrames", optional_override([](DeformTimeline &obj) { return VECTOR_SP2STD((Vector<float> &)obj.getFrames());}))
        .function("getFrameVertices", &DeformTimeline::getVertices)
        .function("getPropertyId", &DeformTimeline::getPropertyId)
        .function("setFrame", &DeformTimeline::setFrame)
        .function("apply", &DeformTimeline::apply, allow_raw_pointers());

    class_<EventTimeline, base<Timeline>>("EventTimeline")
        .constructor<int>()
        .function("getFrames", optional_override([](EventTimeline &obj) { return VECTOR_SP2STD2(obj.getFrames());}))
        .function("getEvents", optional_override([](EventTimeline &obj) { return VECTOR_SP2STD(obj.getEvents());}), allow_raw_pointers())
        .function("getPropertyId", &EventTimeline::getPropertyId)
        .function("getFrameCount", &EventTimeline::getFrameCount)
        .function("setFrame", &EventTimeline::setFrame, allow_raw_pointers())
        .function("apply", &EventTimeline::apply, allow_raw_pointers());

    class_<DrawOrderTimeline, base<Timeline>>("DrawOrderTimeline")
        .constructor<int>()
        .function("getFrames", optional_override([](DrawOrderTimeline &obj) { return VECTOR_SP2STD(obj.getFrames());}))
        //.function("getProp_drawOrders", &EventTimeline::getDrawOrders)
        .function("getPropertyId", &DrawOrderTimeline::getPropertyId)
        .function("getFrameCount", &DrawOrderTimeline::getFrameCount)
        .function("setFrame", &DrawOrderTimeline::setFrame, allow_raw_pointers())
        .function("apply", &DrawOrderTimeline::apply, allow_raw_pointers());

    class_<IkConstraintTimeline, base<CurveTimeline>>("IkConstraintTimeline")
        .constructor<int>()
        // static variables
        // .function("getProp_ikConstraintIndex", &EventTimeline::getFrames) // private
        // .function("getProp_frames", &IkConstraintTimeline::getFrames)
        .function("getPropertyId", &IkConstraintTimeline::getPropertyId)
        .function("setFrame", &IkConstraintTimeline::setFrame)
        .function("apply", &IkConstraintTimeline::apply, allow_raw_pointers());

    class_<TransformConstraintTimeline, base<CurveTimeline>>("TransformConstraintTimeline")
        .constructor<int>()
        // static variables
        // .function("getProp_ikConstraintIndex", &TransformConstraintTimeline::getFrames) // private
        //.function("getProp_frames", &TransformConstraintTimeline::getFrames)
        .function("getPropertyId", &TransformConstraintTimeline::getPropertyId)
        .function("setFrame", &TransformConstraintTimeline::setFrame)
        .function("apply", &TransformConstraintTimeline::apply, allow_raw_pointers());

    class_<PathConstraintPositionTimeline, base<CurveTimeline>>("PathConstraintPositionTimeline")
        .constructor<int>()
        // static variables
        // .function("getProp_ikConstraintIndex", &TransformConstraintTimeline::getFrames) // private
        //.function("getProp_frames", &TransformConstraintTimeline::getFrames)
        .function("getPropertyId", &PathConstraintPositionTimeline::getPropertyId)
        .function("setFrame", &PathConstraintPositionTimeline::setFrame)
        .function("apply", &PathConstraintPositionTimeline::apply, allow_raw_pointers());

    class_<PathConstraintMixTimeline, base<CurveTimeline>>("PathConstraintMixTimeline")
        .constructor<int>()
        .function("getPropertyId", &PathConstraintMixTimeline::getPropertyId)
        .function("apply", &PathConstraintMixTimeline::apply, allow_raw_pointers());

    class_<TrackEntry>("TrackEntry")
        .constructor<>()
        .function("getAnimation", &TrackEntry::getAnimation, allow_raw_pointer<Animation>())
        .function("getNext", &TrackEntry::getNext, allow_raw_pointer<TrackEntry>())
        .function("getMixingFrom", &TrackEntry::getMixingFrom, allow_raw_pointer<TrackEntry>())
        .function("getMixingTo", &TrackEntry::getMixingTo, allow_raw_pointer<TrackEntry>())
        //.function("getProp_listener", &TrackEntry::listener)
        .function("getTrackIndex", &TrackEntry::getTrackIndex)
        .function("getLoop", &TrackEntry::getLoop)
        .function("setLoop", &TrackEntry::setLoop)
        .function("getHoldPrevious", &TrackEntry::getHoldPrevious)
        .function("setHoldPrevious", &TrackEntry::setHoldPrevious)
        .function("getEventThreshold", &TrackEntry::getEventThreshold)
        .function("setEventThreshold", &TrackEntry::setEventThreshold)
        .function("getAttachmentThreshold", &TrackEntry::getAttachmentThreshold)
        .function("setAttachmentThreshold", &TrackEntry::setAttachmentThreshold)
        .function("getDrawOrderThreshold", &TrackEntry::getDrawOrderThreshold)
        .function("setDrawOrderThreshold", &TrackEntry::setDrawOrderThreshold)
        .function("getAnimationStart", &TrackEntry::getAnimationStart)
        .function("setAnimationStart", &TrackEntry::setAnimationStart)
        .function("getAnimationEnd", &TrackEntry::getAnimationEnd)
        .function("setAnimationEnd", &TrackEntry::setAnimationEnd)
        .function("getAnimationLast", &TrackEntry::getAnimationLast)
        .function("setAnimationLast", &TrackEntry::setAnimationLast)
        //.function("getProp_nextAnimationLast", &TrackEntry::nextAnimationLast)
        .function("getDelay", &TrackEntry::getDelay)
        .function("setDelay", &TrackEntry::setDelay)
        .function("getTrackTime", &TrackEntry::getTrackTime)
        .function("setTrackTime", &TrackEntry::setTrackTime)
        //.function("getProp_trackLast", &TrackEntry::trackLast)
        //.function("getProp_nextTrackLast", &TrackEntry::nextTrackLast)
        .function("getTrackEnd", &TrackEntry::getTrackEnd)
        .function("setTrackEnd", &TrackEntry::setTrackEnd)
        .function("getTimeScale", &TrackEntry::getTimeScale)
        .function("setTimeScale", &TrackEntry::setTimeScale)
        .function("getAlpha", &TrackEntry::getAlpha)
        .function("setAlpha", &TrackEntry::setAlpha)
        .function("getMixTime", &TrackEntry::getMixTime)
        .function("setMixTime", &TrackEntry::setMixTime)
        .function("getMixDuration", &TrackEntry::getMixDuration)
        .function("setMixDuration", &TrackEntry::setMixDuration)
        //.function("getProp_interruptAlpha", &TrackEntry::_interruptAlpha)
        //.function("getProp_totalAlpha", &TrackEntry::getAlpha)
        .function("getMixBlend", &TrackEntry::getMixBlend)
        .function("setMixBlend", &TrackEntry::setMixBlend)
        //.function("getProp_timelineMode", &TrackEntry::timelineMode)
        //.function("getProp_timelineHoldMix", &TrackEntry::timelineHoldMix)
        //.function("getProp_timelinesRotation", &TrackEntry::timelinesRotation)
        //.function("reset", &TrackEntry::reset) //private
        .function("getAnimationTime", &TrackEntry::getAnimationTime)
        .function("isComplete", &TrackEntry::isComplete)
        .function("resetRotationDirections", &TrackEntry::resetRotationDirections);

    class_<AnimationStateData>("AnimationStateData")
        .constructor<SkeletonData *>()
        .function("getDefaultMix", &AnimationStateData::getDefaultMix)
        .function("getSkeletonData", &AnimationStateData::getSkeletonData, allow_raw_pointers())
        .function("setMix", optional_override([](AnimationStateData &obj, const std::string& fromName, const std::string& toName, float duration) { 
            return obj.setMix(STRING_STD2SP(fromName), STRING_STD2SP(toName), duration);}))
        .function("setMixWith", optional_override([](AnimationStateData &obj, Animation* from, Animation* to, float duration) { 
            return obj.setMix(from, to, duration);}), allow_raw_pointers())
        .function("getMix", &AnimationStateData::getMix, allow_raw_pointers());

    class_<AnimationState>("AnimationState")
        .constructor<AnimationStateData *>()
        // static variables
        // .class_function("getProp_emptyAnimation",&AnimationState::getEmptyAnimation, allow_raw_pointers()) // private
        .function("getData", &AnimationState::getData, allow_raw_pointers())
        .function("getTracks", optional_override([](AnimationState &obj) { return VECTOR_SP2STD(obj.getTracks());}), allow_raw_pointers())
        .function("getTimeScale", &AnimationState::getTimeScale)
        .function("setTimeScale", &AnimationState::setTimeScale)
        //.function("getProp_unkeyedState")
        //.function("getProp_events")
        //.function("getProp_listeners")
        //.function("getProp_queue")
        //.function("getProp_queue")
        //.function("getProp_propertyIDs", &AnimationState::getPropertyIDs)
        //.function("getProp_animationsChanged", &AnimationState::getAnimationsChanged)
        //.function("getProp_trackEntryPool", &AnimationState::getTrackEntryPool)
        .function("update", &AnimationState::update)
        //.function("updateMixingFrom", &AnimationState::updateMixingFrom, allow_raw_pointers()) //private
        .function("apply", &AnimationState::apply)
        // .function("applyMixingFrom", &AnimationState::applyMixingFrom, allow_raw_pointers()) //private
        //.function("applyAttachmentTimeline", &AnimationState::applyAttachmentTimeline) // have no
        //.function("setAttachment", &AnimationState::setAttachment) // have no
        // .class_function("applyRotateTimeline", &AnimationState::applyRotateTimeline, allow_raw_pointers())
        // .function("queueEvents", &AnimationState::queueEvents, allow_raw_pointers())
        .function("clearTracks", &AnimationState::clearTracks)
        .function("clearTrack", &AnimationState::clearTrack)
        //.function("setCurrent", &AnimationState::setCurrent, allow_raw_pointers()) // private
        .function("setAnimation", optional_override([](AnimationState &obj, uint32_t trackIndex, const std::string& animName, bool loop) { return obj.setAnimation(trackIndex, STRING_STD2SP(animName), loop);}), allow_raw_pointers())
        .function("setAnimationWith", optional_override([](AnimationState &obj, uint32_t trackIndex, Animation* animation, bool loop) { return obj.setAnimation(trackIndex, animation, loop);}), allow_raw_pointers())
        .function("addAnimation", optional_override([](AnimationState &obj, uint32_t trackIndex, const std::string& animName, bool loop, float delay) { return obj.addAnimation(trackIndex, STRING_STD2SP(animName), loop, delay);}), allow_raw_pointers())
        .function("addAnimationWith", optional_override([](AnimationState &obj, uint32_t trackIndex, Animation* animation, bool loop, float delay) { return obj.addAnimation(trackIndex, animation, loop, delay);}), allow_raw_pointers())
        .function("setEmptyAnimation", &AnimationState::setEmptyAnimation, allow_raw_pointers())
        .function("addEmptyAnimation", &AnimationState::addEmptyAnimation, allow_raw_pointers())
        .function("setEmptyAnimations", &AnimationState::setEmptyAnimations)
        //.function("expandToIndex", &AnimationState::expandToIndex, allow_raw_pointers()) // private        
        //.function("trackEntry", &AnimationState::newTrackEntry, allow_raw_pointers()) // private
        //.function("disposeNext", &AnimationState::disposeNext) // private
        //.function("_animationsChanged", &AnimationState::animationsChanged) // private
        //.function("computeHold", &AnimationState::computeHold, allow_raw_pointer<TrackEntry>()) // private
        .function("getCurrent", &AnimationState::getCurrent, allow_raw_pointer<TrackEntry>());
        //.function("addListener", &AnimationState::addListener)
        //.function("removeListener", &AnimationState::removeListener)
        //.function("clearListeners", &AnimationState::clearListeners) // no have clearListeners
        // .function("clearListenerNotifications", &AnimationState::clearListenerNotifications); // no have clearListenerNotifications

    class_<Animation>("Animation")
        .constructor<const String &, Vector<Timeline *> &, float>()
        .function("getName", optional_override([](Animation &obj) { return STRING_SP2STD(obj.getName());}))
        .function("getTimelines", optional_override([](Animation &obj) { return VECTOR_SP2STD(obj.getTimelines());}))
        //.function("getProp_timelineIds", &Animation::getTimelines)
        .function("getDuration", &Animation::getDuration)
        .function("setDuration", &Animation::setDuration)
        .function("hasTimeline", &Animation::hasTimeline)
        .function("apply", &Animation::apply, allow_raw_pointers())
        // .class_function("binarySearch", &Animation::binarySearch)
        // .class_function("linearSearch", &Animation::linearSearch)
        ;

    // private
    // class_<EventQueue>("EventQueue")
    //     .constructor<AnimationState& , Pool<TrackEntry>& >()
    //     .function("start", &EventQueue::start, allow_raw_pointers())
    //     .function("interrupt", &EventQueue::interrupt, allow_raw_pointers())
    //     .function("end", &EventQueue::end, allow_raw_pointers())
    //     .function("dispose", &EventQueue::dispose, allow_raw_pointers())
    //     .function("complete", &EventQueue::complete, allow_raw_pointers())
    //     .function("event", &EventQueue::event, allow_raw_pointers())
    //     .function("drain", &EventQueue::drain)
    //     //.function("clear")

    // class_<AnimationStateListener>("AnimationStateListener")

    // class_<AnimationStateAdapter>("AnimationStateAdapter")
    

    class_<Skeleton>("Skeleton")
        .constructor<SkeletonData *>()
        .function("getData", &Skeleton::getData, allow_raw_pointer<SkeletonData>())
        .function("getBones", optional_override([](Skeleton &obj) { return VECTOR_SP2STD(obj.getBones());}), allow_raw_pointers())
        .function("getSlots", optional_override([](Skeleton &obj) { return VECTOR_SP2STD(obj.getSlots());}), allow_raw_pointers())
        .function("getDrawOrder", optional_override([](Skeleton &obj) { return VECTOR_SP2STD(obj.getDrawOrder());}), allow_raw_pointers())
        .function("getIkConstraints", optional_override([](Skeleton &obj) { return VECTOR_SP2STD(obj.getIkConstraints());}), allow_raw_pointers())
        .function("getTransformConstraints", optional_override([](Skeleton &obj) { return VECTOR_SP2STD(obj.getTransformConstraints());}), allow_raw_pointers())
        .function("getPathConstraints", optional_override([](Skeleton &obj) { return VECTOR_SP2STD(obj.getPathConstraints());}), allow_raw_pointers())
        .function("getUpdateCacheList", &Skeleton::getUpdateCacheList, allow_raw_pointer<Updatable>())
        //.function("getProp_updateCacheReset", Skeleton::)
        .function("getSkin", &Skeleton::getSkin, allow_raw_pointer<Skin>())
        .function("getColor", &Skeleton::getColor)
        .function("getTime", &Skeleton::getTime)
        .function("getScaleX", &Skeleton::getScaleX)
        .function("getScaleY", &Skeleton::getScaleY)
        .function("getX", &Skeleton::getX)
        .function("getY", &Skeleton::getY)
        .function("updateCache", &Skeleton::updateCache)
        //.function("sortIkConstraint")
        //.function("sortPathConstraint")
        //.function("sortTransformConstraint")
        //.function("sortPathConstraintAttachment")
        //.function("sortPathConstraintAttachmentWith")
        // .function("sortBone", &Skeleton::sortBone, allow_raw_pointer<Bone>())
        // .function("sortReset", &Skeleton::sortReset, allow_raw_pointer<Bone>())
        .function("updateWorldTransform", &Skeleton::updateWorldTransform)
        .function("setToSetupPose", &Skeleton::setToSetupPose)
        .function("setBonesToSetupPose", &Skeleton::setBonesToSetupPose)
        .function("setSlotsToSetupPose", &Skeleton::setSlotsToSetupPose)
        .function("getRootBone", &Skeleton::getRootBone, allow_raw_pointer<Bone>())
        .function("findBone", optional_override([](Skeleton &obj, const std::string& name) { return obj.findBone(STRING_STD2SP(name));}), allow_raw_pointers())
        .function("findBoneIndex", optional_override([](Skeleton &obj, const std::string& name) { return obj.findBoneIndex(STRING_STD2SP(name));}))
        .function("findSlot", optional_override([](Skeleton &obj, const std::string& name) { return obj.findSlot(STRING_STD2SP(name));}), allow_raw_pointers())
        .function("findSlotIndex", optional_override([](Skeleton &obj, const std::string& name) { return obj.findSlotIndex(STRING_STD2SP(name));}))
        .function("setSkinByName", optional_override([](Skeleton &obj, const std::string& name) { return obj.setSkin(STRING_STD2SP(name));}))
        .function("setSkin", static_cast<void(Skeleton::*)(Skin *)>(&Skeleton::setSkin), allow_raw_pointer<Skin>())
        .function("getAttachmentByName", optional_override([](Skeleton &obj, const std::string& slotName, const std::string& attachmentName) { 
            return obj.getAttachment(STRING_STD2SP(slotName), STRING_STD2SP(attachmentName));}), allow_raw_pointers())
        .function("getAttachment", optional_override([](Skeleton &obj, int slotIndex, const std::string& attachmentName) { 
            return obj.getAttachment(slotIndex, STRING_STD2SP(attachmentName));}),allow_raw_pointers())
        .function("setAttachment", optional_override([](Skeleton &obj, const std::string& slotName, const std::string& attachmentName) { 
            return obj.setAttachment(STRING_STD2SP(slotName), STRING_STD2SP(attachmentName));}))
        .function("findIkConstraint", optional_override([](Skeleton &obj, const std::string& name) { return obj.findIkConstraint(STRING_STD2SP(name));}), allow_raw_pointers())
        .function("findTransformConstraint", optional_override([](Skeleton &obj, const std::string& name) { return obj.findTransformConstraint(STRING_STD2SP(name));}), allow_raw_pointers())
        .function("findPathConstraint", optional_override([](Skeleton &obj, const std::string& name) { return obj.findPathConstraint(STRING_STD2SP(name));}), allow_raw_pointers())
        //.function("getBounds", &Skeleton::getBounds)
        .function("update", &Skeleton::update);

    // incomplete
    // class_<SkeletonBinary>("SkeletonBinary")
    //     .constructor<AttachmentLoader*>()
    //     .function("setProp_scale", &SkeletonBinary::setScale);
        //.function("getProp_scale", &SkeletonBinary::getScale)
        //.function("readSkeletonData", &SkeletonBinary::readSkeletonData)
        //.function("setCurve", &SkeletonBinary::setCurve);
    // incomplete

    // class_<SkeletonJson>("SkeletonJson")
    //     .constructor<Atlas*>()
    //     .constructor<AttachmentLoader*>();
        //.function("readSkeletonData", &SkeletonJson::readSkeletonData)
        //.function("getProp_scale", &SkeletonJson::getScale)



    class_<VertexEffect>("VertexEffect")
        .function("begin", &VertexEffect::begin, pure_virtual())
        //.function("transform", &VertexEffect::transform, pure_virtual())
        .function("end", &VertexEffect::end, pure_virtual());

    class_<JitterVertexEffect, base<VertexEffect>>("JitterEffect")
        .constructor<float, float>()
        .function("getJitterX", &JitterVertexEffect::getJitterX)
        .function("setJitterX", &JitterVertexEffect::setJitterX)
        .function("getJitterY", &JitterVertexEffect::getJitterY)
        .function("setJitterY", &JitterVertexEffect::setJitterY)
        .function("begin", &JitterVertexEffect::begin)
        //.function("transform", &JitterVertexEffect::transform)
        .function("end", &JitterVertexEffect::end);

    class_<SwirlVertexEffect, base<VertexEffect>>("SwirlEffect")
        .constructor<float, Interpolation &>()
        .function("getCenterX", &SwirlVertexEffect::getCenterX)
        .function("setCenterX", &SwirlVertexEffect::setCenterX)
        .function("getCenterY", &SwirlVertexEffect::getCenterY)
        .function("setCenterY", &SwirlVertexEffect::setCenterY)
        .function("getRadius", &SwirlVertexEffect::getRadius)
        .function("setRadius", &SwirlVertexEffect::setRadius)
        .function("getAngle", &SwirlVertexEffect::getAngle)
        .function("setAngle", &SwirlVertexEffect::setAngle)
        .function("begin", &SwirlVertexEffect::begin)
        //.function("transform", &SwirlVertexEffect::transform)
        .function("end", &SwirlVertexEffect::end);

    class_<SlotMesh>("SlotMesh")
        .property("vCount", &SlotMesh::vCount)
        .property("iCount", &SlotMesh::iCount)
        .property("blendMode", &SlotMesh::blendMode)
        .property("textureID", &SlotMesh::textureID)
        ;

    register_vector<SlotMesh>("VectorSlotMesh");
    class_<SpineModel>("SpineModel")
        .property("vCount", &SpineModel::vCount)
        .property("iCount", &SpineModel::iCount)
        .property("vPtr", &SpineModel::vPtr)
        .property("iPtr", &SpineModel::iPtr)
        .function("getMeshes", &SpineModel::getMeshes);

    class_<SpineDebugShape>("SpineDebugShape")
        .property("type", &SpineDebugShape::type)
        .property("vOffset", &SpineDebugShape::vOffset)
        .property("vCount", &SpineDebugShape::vCount)
        .property("iOffset", &SpineDebugShape::iOffset)
        .property("iCount", &SpineDebugShape::iCount);

    register_vector<SpineDebugShape>("VectorDebugShape");
    class_<SpineSkeletonInstance>("SkeletonInstance")
        .constructor<>()
        .function("initSkeleton", &SpineSkeletonInstance::initSkeleton, allow_raw_pointers())
        .function("setAnimation", &SpineSkeletonInstance::setAnimation, allow_raw_pointers())
        .function("setSkin", &SpineSkeletonInstance::setSkin)
        .function("updateAnimation", &SpineSkeletonInstance::updateAnimation)
        .function("updateRenderData", &SpineSkeletonInstance::updateRenderData, allow_raw_pointer<SpineModel>())
        .function("setPremultipliedAlpha", &SpineSkeletonInstance::setPremultipliedAlpha)
        .function("setUseTint", &SpineSkeletonInstance::setUseTint)
        .function("setColor", &SpineSkeletonInstance::setColor)
        .function("setJitterEffect", &SpineSkeletonInstance::setJitterEffect, allow_raw_pointer<JitterVertexEffect*>())
        .function("setSwirlEffect", &SpineSkeletonInstance::setSwirlEffect, allow_raw_pointer<SwirlVertexEffect*>())
        .function("clearEffect", &SpineSkeletonInstance::clearEffect)
        .function("getAnimationState", &SpineSkeletonInstance::getAnimationState, allow_raw_pointer<AnimationState>())
        .function("setMix", &SpineSkeletonInstance::setMix)
        .function("setListener", &SpineSkeletonInstance::setListener)
        .function("setDebugMode", &SpineSkeletonInstance::setDebugMode)
        .function("getDebugShapes", &SpineSkeletonInstance::getDebugShapes)
        .function("resizeSlotRegion", &SpineSkeletonInstance::resizeSlotRegion)
        .function("setSlotTexture", &SpineSkeletonInstance::setSlotTexture);
}

EMSCRIPTEN_BINDINGS(cocos_spine) {
    class_<SpineWasmUtil>("SpineWasmUtil")
    .class_function("spineWasmInit", &SpineWasmUtil::spineWasmInit)
    .class_function("spineWasmDestroy", &SpineWasmUtil::spineWasmDestroy)
    .class_function("queryStoreMemory", &SpineWasmUtil::queryStoreMemory)
    .class_function("querySpineSkeletonDataByUUID", &SpineWasmUtil::querySpineSkeletonDataByUUID, allow_raw_pointers())
    .class_function("createSpineSkeletonDataWithJson", &SpineWasmUtil::createSpineSkeletonDataWithJson, allow_raw_pointers())
    .class_function("createSpineSkeletonDataWithBinary", &SpineWasmUtil::createSpineSkeletonDataWithBinary, allow_raw_pointers())
    .class_function("registerSpineSkeletonDataWithUUID", &SpineWasmUtil::registerSpineSkeletonDataWithUUID, allow_raw_pointers())
    .class_function("destroySpineSkeletonDataWithUUID", &SpineWasmUtil::destroySpineSkeletonDataWithUUID)
    .class_function("destroySpineInstance", &SpineWasmUtil::destroySpineInstance, allow_raw_pointers())
    .class_function("getCurrentListenerID", &SpineWasmUtil::getCurrentListenerID)
    .class_function("getCurrentEventType", &SpineWasmUtil::getCurrentEventType)
    .class_function("getCurrentTrackEntry", &SpineWasmUtil::getCurrentTrackEntry, allow_raw_pointers())
    .class_function("getCurrentEvent", &SpineWasmUtil::getCurrentEvent, allow_raw_pointers());
}
