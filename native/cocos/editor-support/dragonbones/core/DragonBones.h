/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
#ifndef DRAGONBONES_H
#define DRAGONBONES_H

#include <cmath>
#include <cstdint>
#include <string>
#include <algorithm>
#include <vector>
#include <map>
#include <tuple>
#include <functional>
#include <sstream>
#include <assert.h>
// dragonBones assert
#define DRAGONBONES_ASSERT(cond, msg) \
do { \
    assert(cond); \
} while (0)

// namespace dragonBones {}
#define DRAGONBONES_NAMESPACE_BEGIN namespace dragonBones {
#define DRAGONBONES_NAMESPACE_END }

// using dragonBones namespace
#define DRAGONBONES_USING_NAME_SPACE using namespace dragonBones

#define ABSTRACT_CLASS(CLASS) \
public:\
    CLASS(){}\
    virtual ~CLASS(){};

#define BIND_CLASS_TYPE(CLASS) \
public:\
    static std::size_t getTypeIndex()\
    {\
        static const auto typeIndex = typeid(CLASS).hash_code();\
        return typeIndex;\
    }\
    virtual std::size_t getClassTypeIndex() const override\
    {\
        return CLASS::getTypeIndex();\
    }\

#define BIND_CLASS_TYPE_A(CLASS) \
public:\
    static std::size_t getTypeIndex()\
    {\
        static const auto typeIndex = typeid(CLASS).hash_code();\
        return typeIndex;\
    }\
    virtual std::size_t getClassTypeIndex() const override\
    {\
        return CLASS::getTypeIndex();\
    }\
public:\
    CLASS(){_onClear();}\
    ~CLASS(){_onClear();}\
private:\
    CLASS(const CLASS&);\
    void operator=(const CLASS&)

#define BIND_CLASS_TYPE_B(CLASS) \
public:\
    static std::size_t getTypeIndex()\
    {\
        static const auto typeIndex = typeid(CLASS).hash_code();\
        return typeIndex;\
    }\
    virtual std::size_t getClassTypeIndex() const override\
    {\
        return CLASS::getTypeIndex();\
    }\
private:\
    CLASS(const CLASS&);\
    void operator=(const CLASS&)

#define DRAGONBONES_DISALLOW_COPY_AND_ASSIGN(CLASS) \
private:\
    CLASS(const CLASS&);\
    void operator=(const CLASS&);

DRAGONBONES_NAMESPACE_BEGIN

/**
 * @internal
 */
enum class BinaryOffset
{
    WeigthBoneCount = 0,
    WeigthFloatOffset = 1,
    WeigthBoneIndices = 2,

    MeshVertexCount = 0,
    MeshTriangleCount = 1,
    MeshFloatOffset = 2,
    MeshWeightOffset = 3,
    MeshVertexIndices = 4,

    TimelineScale = 0,
    TimelineOffset = 1,
    TimelineKeyFrameCount = 2,
    TimelineFrameValueCount = 3,
    TimelineFrameValueOffset = 4,
    TimelineFrameOffset = 5,

    FramePosition = 0,
    FrameTweenType = 1,
    FrameTweenEasingOrCurveSampleCount = 2,
    FrameCurveSamples = 3,

    DeformVertexOffset = 0,
    DeformCount = 1,
    DeformValueCount = 2,
    DeformValueOffset = 3,
    DeformFloatOffset = 4
};

/**
 * @internal
 */
enum class ArmatureType
{
    Armature = 0,
    MovieClip = 1,
    Stage = 2
};

/**
 * - Offset mode.
 * @version DragonBones 5.5
 * @language en_US
 */
/**
 * - 偏移模式。
 * @version DragonBones 5.5
 * @language zh_CN
 */
enum class OffsetMode {
    None,
    Additive,
    Override
};

/**
 * @private
 */
enum class DisplayType 
{
    Image = 0, 
    Armature = 1, 
    Mesh = 2,
    BoundingBox = 3,
    Path = 4
};

/**
 * - Bounding box type.
 * @version DragonBones 5.0
 * @language en_US
 */
/**
 * - 边界框类型。
 * @version DragonBones 5.0
 * @language zh_CN
 */
enum class BoundingBoxType
{
    Rectangle = 0,
    Ellipse = 1,
    Polygon = 2
};

/**
 * @internal
 */
enum class ActionType {
    Play = 0,
    Frame = 10,
    Sound = 11
};

/**
 * @internal
 */
enum class BlendMode 
{
    Normal = 0,
    Add = 1,
    Alpha = 2,
    Darken = 3,
    Difference = 4,
    Erase = 5,
    HardLight = 6,
    Invert = 7,
    Layer = 8,
    Lighten = 9,
    Multiply = 10,
    Overlay = 11,
    Screen = 12,
    Subtract = 13
};

/**
 * @internal
 */
enum class TweenType {
    None = 0,
    Line = 1,
    Curve = 2,
    QuadIn = 3,
    QuadOut = 4,
    QuadInOut = 5
};

/**
 * @internal
 */
enum class TimelineType {
    Action = 0,
    ZOrder = 1,

    BoneAll = 10,

    BoneTranslate = 11,
    BoneRotate = 12,
    BoneScale = 13,

    SlotDisplay = 20,
    SlotColor = 21,
    SlotDeform = 22,

    IKConstraint = 30,

    AnimationTime = 40,
    AnimationWeight = 41
};

/**
 * - Animation fade out mode.
 * @version DragonBones 4.5
 * @language en_US
 */
/**
 * - 动画淡出模式。
 * @version DragonBones 4.5
 * @language zh_CN
 */
enum class AnimationFadeOutMode {
    /**
     * - Do not fade out of any animation states.
     * @language en_US
     */
    /**
     * - 不淡出任何的动画状态。
     * @language zh_CN
     */
    None,
    /**
     * - Fade out the animation states of the same layer.
     * @language en_US
     */
    /**
     * - 淡出同层的动画状态。
     * @language zh_CN
     */
    SameLayer,
    /**
     * - Fade out the animation states of the same group.
     * @language en_US
     */
    /**
     * - 淡出同组的动画状态。
     * @language zh_CN
     */
    SameGroup,
    /**
     * - Fade out the animation states of the same layer and group.
     * @language en_US
     */
    /**
     * - 淡出同层并且同组的动画状态。
     * @language zh_CN
     */
    SameLayerAndGroup,
    /**
     * - Fade out of all animation states.
     * @language en_US
     */
    /**
     * - 淡出所有的动画状态。
     * @language zh_CN
     */
    All,
    /**
     * - Does not replace the animation state with the same name.
     * @language en_US
     */
    /**
     * - 不替换同名的动画状态。
     * @language zh_CN
     */
    Single
};

enum class TextureFormat
{
    DEFAULT,
    RGBA8888,
    BGRA8888,
    RGBA4444,
    RGB888,
    RGB565,
    RGBA5551
};

template <class T>
std::string to_string(const T& value)
{
    std::ostringstream stream;
    stream << value;
    return stream.str();
}

template<class T>
inline int indexOf(const std::vector<T>& vector, const T& value)
{
    for (std::size_t i = 0, l = vector.size(); i < l; ++i)
    {
        if (vector[i] == value)
        {
            return (int) i;
        }
    }
    
    return -1;
}

template<class T>
inline T* mapFind(const std::map<std::string, T*>& map, const std::string& key)
{
    auto iterator = map.find(key);
    return (iterator != map.end()) ? iterator->second : nullptr;
}

template<class T>
inline T* mapFindB(std::map<std::string, T>& map, const std::string& key)
{
    auto iterator = map.find(key);
    return (iterator != map.end()) ? &iterator->second : nullptr;
}

class Matrix;
class Transform;
class ColorTransform;
class Point;
class Rectangle;

class BaseObject;

class UserData;
class ActionData;
class DragonBonesData;
class ArmatureData;
class CanvasData;
class BoneData;
class SlotData;
class SkinData;
class ConstraintData;
class IKConstraintData;
class DisplayData;
class ImageDisplayData;
class ArmatureDisplayData;
class MeshDisplayData;
class VerticesData;
class WeightData;
class BoundingBoxDisplayData;
class BoundingBoxData;
class RectangleBoundingBoxData;
class EllipseBoundingBoxData;
class PolygonBoundingBoxData;
class AnimationData;
class TimelineData;
class AnimationConfig;
class TextureAtlasData;
class TextureData;

class IArmatureProxy;
class Armature;
class TransformObject;
class Bone;
class Slot;
class Constraint;
class IKConstraint;
class DeformVertices;

class IAnimatable;
class WorldClock;
class Animation;
class AnimationState;
class BonePose;
class BlendState;
class TimelineState;
class TweenTimelineState;
class BoneTimelineState;
class SlotTimelineState;
class ConstraintTimelineState;
class ActionTimelineState;
class ZOrderTimelineState;
class BoneAllTimelineState;
class SlotDislayTimelineState;
class SlotColorTimelineState;
class DeformTimelineState;
class IKConstraintTimelineState;

class IEventDispatcher;
class EventObject;

class DataParser;
class JSONDataParser;
class BinaryDataParser;

class BaseFactory;
class BuildArmaturePackage;

/**
 * @private
 */
class DragonBones 
{
    DRAGONBONES_DISALLOW_COPY_AND_ASSIGN(DragonBones)

public:
    static const std::string VEISION;

    static bool yDown;
    static bool debug;
    static bool debugDraw;
    static bool webAssembly;
    static bool checkInPool;
    
private:
    std::vector<BaseObject*> _objects;
    std::vector<EventObject*> _events;
    WorldClock* _clock;
    IEventDispatcher* _eventManager;

public:
    DragonBones(IEventDispatcher* eventManager);
    virtual ~DragonBones();
    
    void advanceTime(float passedTime);
    void bufferEvent(EventObject* value);
    void bufferObject(BaseObject* object);
    
    WorldClock* getClock();
    IEventDispatcher* getEventManager() const
    {
        return _eventManager;
    }
};

DRAGONBONES_NAMESPACE_END

#endif // DRAGONBONES_H
