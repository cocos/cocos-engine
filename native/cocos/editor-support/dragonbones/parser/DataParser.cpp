#include "DataParser.h"

DRAGONBONES_NAMESPACE_BEGIN

const char* DataParser::DATA_VERSION_2_3 = "2.3";
const char* DataParser::DATA_VERSION_3_0 = "3.0";
const char* DataParser::DATA_VERSION_4_0 = "4.0";
const char* DataParser::DATA_VERSION_4_5 = "4.5";
const char* DataParser::DATA_VERSION_5_0 = "5.0";
const char* DataParser::DATA_VERSION_5_5 = "5.5";
const char* DataParser::DATA_VERSION = DataParser::DATA_VERSION_5_5;

const std::vector<std::string> DataParser::DATA_VERSIONS
{ 
    DataParser::DATA_VERSION_4_0,
    DataParser::DATA_VERSION_4_5,
    DataParser::DATA_VERSION_5_0,
    DataParser::DATA_VERSION_5_5
};

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
const char* DataParser::USER_DATA = "userData";
const char* DataParser::ARMATURE = "armature";
const char* DataParser::BONE = "bone";
const char* DataParser::SLOT = "slot";
const char* DataParser::CONSTRAINT = "constraint";
const char* DataParser::IK = "ik";
const char* DataParser::SKIN = "skin";
const char* DataParser::DISPLAY = "display";
const char* DataParser::ANIMATION = "animation";
const char* DataParser::Z_ORDER = "zOrder";
const char* DataParser::FFD = "ffd";
const char* DataParser::FRAME = "frame";
const char* DataParser::TRANSLATE_FRAME = "translateFrame";
const char* DataParser::ROTATE_FRAME = "rotateFrame";
const char* DataParser::SCALE_FRAME = "scaleFrame";
const char* DataParser::DISPLAY_FRAME = "displayFrame";
const char* DataParser::COLOR_FRAME = "colorFrame";
const char* DataParser::DEFAULT_ACTIONS = "defaultActions";
const char* DataParser::ACTIONS = "actions";
const char* DataParser::EVENTS = "events";
const char* DataParser::INTS = "ints";
const char* DataParser::FLOATS = "floats";
const char* DataParser::STRINGS = "strings";
const char* DataParser::CANVAS = "canvas";

const char* DataParser::TRANSFORM = "transform";
const char* DataParser::PIVOT = "pivot";
const char* DataParser::AABB = "aabb";
const char* DataParser::COLOR = "color";

const char* DataParser::VERSION = "version";
const char* DataParser::COMPATIBLE_VERSION = "compatibleVersion";
const char* DataParser::FRAME_RATE = "frameRate";
const char* DataParser::TYPE = "type";
const char* DataParser::SUB_TYPE = "subType";
const char* DataParser::NAME = "name";
const char* DataParser::PARENT = "parent";
const char* DataParser::TARGET = "target";
const char* DataParser::STAGE = "stage";
const char* DataParser::SHARE = "share";
const char* DataParser::PATH = "path";
const char* DataParser::LENGTH = "length";
const char* DataParser::DISPLAY_INDEX = "displayIndex";
const char* DataParser::BLEND_MODE = "blendMode";
const char* DataParser::INHERIT_TRANSLATION = "inheritTranslation";
const char* DataParser::INHERIT_ROTATION = "inheritRotation";
const char* DataParser::INHERIT_SCALE = "inheritScale";
const char* DataParser::INHERIT_REFLECTION = "inheritReflection";
const char* DataParser::INHERIT_ANIMATION = "inheritAnimation";
const char* DataParser::INHERIT_DEFORM = "inheritDeform";
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
const char* DataParser::CLOCK_WISE = "clockwise";
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
const char* DataParser::VALUE = "value";
const char* DataParser::ROTATE = "rotate";
const char* DataParser::SKEW = "skew";

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

const char* DataParser::GOTO_AND_PLAY = "gotoAndPlay";

const char* DataParser::DEFAULT_NAME = "default";

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
    else if (lower == "boundingbox")
    {
        return DisplayType::BoundingBox;
    }

    return DisplayType::Image;
}

BoundingBoxType DataParser::_getBoundingBoxType(const std::string & value)
{
    auto lower = value;
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);

    if (lower == "rectangle")
    {
        return BoundingBoxType::Rectangle;
    }
    else if (lower == "ellipse")
    {
        return BoundingBoxType::Ellipse;
    }
    else if (lower == "polygon")
    {
        return BoundingBoxType::Polygon;
    }

    return BoundingBoxType::Rectangle;
}

ActionType DataParser::_getActionType(const std::string& value)
{
    auto lower = value;
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);

    if (lower == "play")
    {
        return ActionType::Play;
    }
    else if (lower == "frame")
    {
        return ActionType::Frame;
    }
    else if (lower == "sound")
    {
        return ActionType::Sound;
    }

    return ActionType::Play;
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

DRAGONBONES_NAMESPACE_END
