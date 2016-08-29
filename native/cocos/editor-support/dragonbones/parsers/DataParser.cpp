#include "DataParser.h"
#include "../animation/BaseTimelineState.h"

DRAGONBONES_NAMESPACE_BEGIN

const char* DataParser::DATA_VERSION_2_3 = "2.3";
const char* DataParser::DATA_VERSION_3_0 = "3.0";
const char* DataParser::DATA_VERSION_4_0 = "4.0";
const char* DataParser::DATA_VERSION = "4.5";

const char* DataParser::TEXTURE_ATLAS = "TextureAtlas";
const char* DataParser::SUB_TEXTURE = "SubTexture";
const char* DataParser::FORMAT = "format";
const char* DataParser::IMAGE_PATH = "imagePath";
const char* DataParser::WIDTH = "width";
const char* DataParser::HEIGHT = "height";
const char* DataParser::ROTATED = "rotated";
const char* DataParser::FRAME_X = "frameX";
const char* DataParser::FRAME_Y = "frameY";
const char* DataParser::FRAME_WIDTH = "frameWidth";
const char* DataParser::FRAME_HEIGHT = "frameHeight";

const char* DataParser::DRADON_BONES = "dragonBones";
const char* DataParser::ARMATURE = "armature";
const char* DataParser::BONE = "bone";
const char* DataParser::IK = "ik";
const char* DataParser::SLOT = "slot";
const char* DataParser::SKIN = "skin";
const char* DataParser::DISPLAY = "display";
const char* DataParser::FFD = "ffd";
const char* DataParser::ANIMATION = "animation";
const char* DataParser::FRAME = "frame";
const char* DataParser::TRANSFORM = "transform";
const char* DataParser::PIVOT = "pivot";
const char* DataParser::COLOR = "color";
const char* DataParser::FILTER = "filter";

const char* DataParser::VERSION = "version";
const char* DataParser::IS_GLOBAL = "isGlobal";
const char* DataParser::FRAME_RATE = "frameRate";
const char* DataParser::TYPE = "type";
const char* DataParser::NAME = "name";
const char* DataParser::PARENT = "parent";
const char* DataParser::LENGTH = "length";
const char* DataParser::DATA = "data";
const char* DataParser::DISPLAY_INDEX = "displayIndex";
const char* DataParser::Z_ORDER = "z";
const char* DataParser::BLEND_MODE = "blendMode";
const char* DataParser::INHERIT_TRANSLATION = "inheritTranslation";
const char* DataParser::INHERIT_ROTATION = "inheritRotation";
const char* DataParser::INHERIT_SCALE = "inheritScale";
const char* DataParser::TARGET = "target";
const char* DataParser::BEND_POSITIVE = "bendPositive";
const char* DataParser::CHAIN = "chain";
const char* DataParser::WEIGHT = "weight";

const char* DataParser::FADE_IN_TIME = "fadeInTime";
const char* DataParser::PLAY_TIMES = "playTimes";
const char* DataParser::SCALE = "scale";
const char* DataParser::OFFSET = "offset";
const char* DataParser::POSITION = "position";
const char* DataParser::DURATION = "duration";
const char* DataParser::TWEEN_EASING = "tweenEasing";
const char* DataParser::TWEEN_ROTATE = "tweenRotate";
const char* DataParser::TWEEN_SCALE = "tweenScale";
const char* DataParser::CURVE = "curve";
const char* DataParser::EVENT = "event";
const char* DataParser::SOUND = "sound";
const char* DataParser::ACTION = "action";

const char* DataParser::X = "x";
const char* DataParser::Y = "y";
const char* DataParser::SKEW_X = "skX";
const char* DataParser::SKEW_Y = "skY";
const char* DataParser::SCALE_X = "scX";
const char* DataParser::SCALE_Y = "scY";

const char* DataParser::ALPHA_OFFSET = "aO";
const char* DataParser::RED_OFFSET = "rO";
const char* DataParser::GREEN_OFFSET = "gO";
const char* DataParser::BLUE_OFFSET = "bO";
const char* DataParser::ALPHA_MULTIPLIER = "aM";
const char* DataParser::RED_MULTIPLIER = "rM";
const char* DataParser::GREEN_MULTIPLIER = "gM";
const char* DataParser::BLUE_MULTIPLIER = "bM";

const char* DataParser::UVS = "uvs";
const char* DataParser::VERTICES = "vertices";
const char* DataParser::TRIANGLES = "triangles";
const char* DataParser::WEIGHTS = "weights";
const char* DataParser::SLOT_POSE = "slotPose";
const char* DataParser::BONE_POSE = "bonePose";

const char* DataParser::TWEEN = "tween";
const char* DataParser::KEY = "key";

const char* DataParser::COLOR_TRANSFORM = "colorTransform";
const char* DataParser::TIMELINE = "timeline";
const char* DataParser::PIVOT_X = "pX";
const char* DataParser::PIVOT_Y = "pY";
const char* DataParser::LOOP = "loop";
const char* DataParser::AUTO_TWEEN = "autoTween";
const char* DataParser::HIDE = "hide";

TextureFormat DataParser::_getTextureFormat(const std::string& value)
{
    auto lower = value;
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);

    if (lower == "rgba8888")
    {
        return TextureFormat::RGBA8888;
    }
    else if (lower == "bgra8888")
    {
        return TextureFormat::BGRA8888;
    }
    else if (lower == "rgba4444")
    {
        return TextureFormat::RGBA4444;
    }
    else if (lower == "rgb888")
    {
        return TextureFormat::RGB888;
    }
    else if (lower == "rgb565")
    {
        return TextureFormat::RGB565;
    }
    else if (lower == "rgba5551")
    {
        return TextureFormat::RGBA5551;
    }

    return TextureFormat::DEFAULT;
}

ArmatureType DataParser::_getArmatureType(const std::string& value)
{
    auto lower = value;
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);

    if (lower == "armature")
    {
        return ArmatureType::Armature;
    }
    else if (lower == "movieClip")
    {
        return ArmatureType::MovieClip;
    }
    else if (lower == "stage")
    {
        return ArmatureType::Stage;
    }

    return ArmatureType::Armature;
}

DisplayType DataParser::_getDisplayType(const std::string& value)
{
    auto lower = value;
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);

    if (lower == "image")
    {
        return DisplayType::Image;
    }
    else if (lower == "armature")
    {
        return DisplayType::Armature;
    }
    else if (lower == "mesh")
    {
        return DisplayType::Mesh;
    }

    return DisplayType::Image;
}

BlendMode DataParser::_getBlendMode(const std::string& value)
{
    auto lower = value;
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);

    if (lower == "normal")
    {
        return BlendMode::Normal;
    }
    else if (lower == "add")
    {
        return BlendMode::Add;
    }
    else if (lower == "alpha")
    {
        return BlendMode::Alpha;
    }
    else if (lower == "darken")
    {
        return BlendMode::Darken;
    }
    else if (lower == "difference")
    {
        return BlendMode::Difference;
    }
    else if (lower == "erase")
    {
        return BlendMode::Erase;
    }
    else if (lower == "hardlight")
    {
        return BlendMode::HardLight;
    }
    else if (lower == "invert")
    {
        return BlendMode::Invert;
    }
    else if (lower == "layer")
    {
        return BlendMode::Layer;
    }
    else if (lower == "lighten")
    {
        return BlendMode::Lighten;
    }
    else if (lower == "multiply")
    {
        return BlendMode::Multiply;
    }
    else if (lower == "overlay")
    {
        return BlendMode::Overlay;
    }
    else if (lower == "screen")
    {
        return BlendMode::Screen;
    }
    else if (lower == "subtract")
    {
        return BlendMode::Subtract;
    }

    return BlendMode::Normal;
}

ActionType DataParser::_getActionType(const std::string& value)
{
    auto lower = value;
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);

    if (lower == "fadeIn")
    {
        return ActionType::FadeIn;
    }
    else if (lower == "play")
    {
        return ActionType::Play;
    }
    else if (lower == "stop")
    {
        return ActionType::Stop;
    }
    else if (lower == "gotoandplay")
    {
        return ActionType::GotoAndPlay;
    }
    else if (lower == "gotoandstop")
    {
        return ActionType::GotoAndStop;
    }
    else if (lower == "fadeout")
    {
        return ActionType::FadeOut;
    }

    return ActionType::FadeIn;
}

DataParser::DataParser() :
    _data(nullptr),
    _armature(nullptr),
    _skin(nullptr),
    _slotDisplayDataSet(nullptr),
    _mesh(nullptr),
    _animation(nullptr),
    _timeline(nullptr),

    _armatureScale(1.f),
    _helpPoint(),
    _rawBones()
{}
DataParser::~DataParser() {}

void DataParser::_getTimelineFrameMatrix(const AnimationData& animation, BoneTimelineData& timeline, float position, Transform& transform) const
{
    const auto frameIndex = unsigned(position * animation.frameCount / animation.duration);
    if (timeline.frames.size() == 1 || frameIndex >= timeline.frames.size()) 
    {
        transform = timeline.frames[0]->transform; // copy
    }
    else 
    {
        const auto frame = timeline.frames[frameIndex];
        auto tweenProgress = 0.f;

        if (frame->duration > 0.f && frame->tweenEasing != NO_TWEEN) 
        {
            tweenProgress = (position - frame->position) / frame->duration;
            if (frame->tweenEasing != 0.f) 
            {
                tweenProgress = TweenTimelineState<BoneFrameData, BoneTimelineData>::_getEasingValue(tweenProgress, frame->tweenEasing);
            }
        }
        else if (!frame->curve.empty()) 
        {
            tweenProgress = (position - frame->position) / frame->duration;
            tweenProgress = TweenTimelineState<BoneFrameData, BoneTimelineData>::_getCurveEasingValue(tweenProgress, frame->curve);
        }

        transform = frame->next->transform; // copy
        transform.minus(frame->transform);

        transform.x = frame->transform.x + transform.x * tweenProgress;
        transform.y = frame->transform.y + transform.y * tweenProgress;
        transform.skewX = frame->transform.skewX + transform.skewX * tweenProgress;
        transform.skewY = frame->transform.skewY + transform.skewY * tweenProgress;
        transform.scaleX = frame->transform.scaleX + transform.scaleX * tweenProgress;
        transform.scaleY = frame->transform.scaleY + transform.scaleY * tweenProgress;
        transform.add(timeline.originTransform);
    }
}

void DataParser::_globalToLocal(ArmatureData* armature) const
{
    auto bones = armature->getSortedBones();
    bones.reserve(bones.size());

    for (const auto bone : bones) 
    {
        if (bone->parent) 
        {
            bone->parent->transform.toMatrix(_helpMatrix);
            _helpMatrix.transformPoint(bone->transform.x, bone->transform.y, _helpPoint);
            bone->transform.x = _helpPoint.x;
            bone->transform.y = _helpPoint.y;
            bone->transform.setRotation(
                bone->transform.getRotation() + 
                (bone->transform.getRotation() - bone->parent->transform.getRotation())
            );
        }
    }

    for (const auto& animationPair : armature->animations) 
    {
        const auto animation = animationPair.second;
        for (const auto& timelinePair : animation->boneTimelines) 
        {
            const auto timeline = timelinePair.second;
            if (timeline->bone->parent) 
            {
                const auto parentTimeline = animation->getBoneTimeline(timeline->bone->parent->name);

                for (const auto frame : timeline->frames) 
                {
                    _getTimelineFrameMatrix(*animation, *parentTimeline, frame->position, _helpTransform);
                    frame->transform.add(timeline->originTransform);
                    _helpTransform.toMatrix(_helpMatrix);
                    _helpMatrix.transformPoint(frame->transform.x, frame->transform.y, _helpPoint);
                    frame->transform.x = _helpPoint.x;
                    frame->transform.y = _helpPoint.y;
                    frame->transform.setRotation(
                        frame->transform.getRotation() +
                        (frame->transform.getRotation() - _helpTransform.getRotation())
                    );
                }
            }

            _helpTransform = timeline->originTransform; // copy
            auto isFirstFrame = true;
            for (const auto frame : timeline->frames) 
            {
                frame->transform.add(_helpTransform);
                frame->transform.minus(timeline->bone->transform);

                if (isFirstFrame) 
                {
                    isFirstFrame = false;
                    timeline->originTransform = frame->transform; // copy
                    frame->transform.identity();
                }
                else 
                {
                    frame->transform.minus(timeline->originTransform);
                }
            }
        }
    }
}

DRAGONBONES_NAMESPACE_END