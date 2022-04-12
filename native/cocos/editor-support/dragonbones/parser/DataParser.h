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
#ifndef DRAGONBONES_DATA_PARSER_H
#define DRAGONBONES_DATA_PARSER_H

#include "../core/DragonBones.h"
#include "../model/UserData.h"
#include "../model/DragonBonesData.h"
#include "../model/ArmatureData.h"
#include "../model/CanvasData.h"
#include "../model/ConstraintData.h"
#include "../model/SkinData.h"
#include "../model/DisplayData.h"
#include "../model/BoundingBoxData.h"
#include "../model/AnimationData.h"
#include "../model/TextureAtlasData.h"

DRAGONBONES_NAMESPACE_BEGIN
/**
 * @internal
 */
class DataParser
{
    ABSTRACT_CLASS(DataParser)

protected:
    static const char* DATA_VERSION_2_3;
    static const char* DATA_VERSION_3_0;
    static const char* DATA_VERSION_4_0;
    static const char* DATA_VERSION_4_5;
    static const char* DATA_VERSION_5_0;
    static const char* DATA_VERSION_5_5;
    static const char* DATA_VERSION;

    static const std::vector<std::string> DATA_VERSIONS;

    static const char* TEXTURE_ATLAS;
    static const char* SUB_TEXTURE;
    static const char* FORMAT;
    static const char* IMAGE_PATH;
    static const char* WIDTH;
    static const char* HEIGHT;
    static const char* ROTATED;
    static const char* FRAME_X;
    static const char* FRAME_Y;
    static const char* FRAME_WIDTH;
    static const char* FRAME_HEIGHT;

    static const char* DRADON_BONES;
    static const char* USER_DATA;
    static const char* ARMATURE;
    static const char* BONE;
    static const char* SLOT;
    static const char* CONSTRAINT;
    static const char* IK;
    static const char* SKIN;
    static const char* DISPLAY;
    static const char* ANIMATION;
    static const char* Z_ORDER;
    static const char* FFD;
    static const char* FRAME;
    static const char* TRANSLATE_FRAME;
    static const char* ROTATE_FRAME;
    static const char* SCALE_FRAME;
    static const char* DISPLAY_FRAME;
    static const char* COLOR_FRAME;
    static const char* DEFAULT_ACTIONS;
    static const char* ACTIONS;
    static const char* EVENTS;
    static const char* INTS;
    static const char* FLOATS;
    static const char* STRINGS;
    static const char* CANVAS;

    static const char* PIVOT;
    static const char* TRANSFORM;
    static const char* AABB;
    static const char* COLOR;

    static const char* VERSION;
    static const char* COMPATIBLE_VERSION;
    static const char* FRAME_RATE;
    static const char* TYPE;
    static const char* SUB_TYPE;
    static const char* NAME;
    static const char* PARENT;
    static const char* TARGET;
    static const char* STAGE;
    static const char* SHARE;
    static const char* PATH;
    static const char* LENGTH;
    static const char* DISPLAY_INDEX;
    static const char* BLEND_MODE;
    static const char* INHERIT_TRANSLATION;
    static const char* INHERIT_ROTATION;
    static const char* INHERIT_SCALE;
    static const char* INHERIT_REFLECTION;
    static const char* INHERIT_ANIMATION;
    static const char* INHERIT_DEFORM;
    static const char* BEND_POSITIVE;
    static const char* CHAIN;
    static const char* WEIGHT;

    static const char* FADE_IN_TIME;
    static const char* PLAY_TIMES;
    static const char* SCALE;
    static const char* OFFSET;
    static const char* POSITION;
    static const char* DURATION;
    static const char* TWEEN_EASING;
    static const char* TWEEN_ROTATE;
    static const char* TWEEN_SCALE;
    static const char* CLOCK_WISE;
    static const char* CURVE;
    static const char* EVENT;
    static const char* SOUND;
    static const char* ACTION;

    static const char* X;
    static const char* Y;
    static const char* SKEW_X;
    static const char* SKEW_Y;
    static const char* SCALE_X;
    static const char* SCALE_Y;
    static const char* VALUE;
    static const char* ROTATE;
    static const char* SKEW;

    static const char* ALPHA_OFFSET;
    static const char* RED_OFFSET;
    static const char* GREEN_OFFSET;
    static const char* BLUE_OFFSET;
    static const char* ALPHA_MULTIPLIER;
    static const char* RED_MULTIPLIER;
    static const char* GREEN_MULTIPLIER;
    static const char* BLUE_MULTIPLIER;

    static const char* UVS;
    static const char* VERTICES;
    static const char* TRIANGLES;
    static const char* WEIGHTS;
    static const char* SLOT_POSE;
    static const char* BONE_POSE;

    static const char* GOTO_AND_PLAY;

    static const char* DEFAULT_NAME;

    static TextureFormat _getTextureFormat(const std::string& value);
    static ArmatureType _getArmatureType(const std::string& value);
    static DisplayType _getDisplayType(const std::string& value);
    static BoundingBoxType _getBoundingBoxType(const std::string& value);
    static ActionType _getActionType(const std::string& value);
    static BlendMode _getBlendMode(const std::string& value);

public:
    virtual DragonBonesData* parseDragonBonesData(const char* rawData, float scale = 1.0f) = 0;
    virtual bool parseTextureAtlasData(const char* rawData, TextureAtlasData& textureAtlasData, float scale = 1.0f) = 0;
};

DRAGONBONES_NAMESPACE_END
#endif // DRAGONBONES_DATA_PARSER_H
