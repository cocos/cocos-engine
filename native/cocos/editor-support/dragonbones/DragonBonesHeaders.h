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
#ifndef DRAGONBONES_HEADERS_H
#define DRAGONBONES_HEADERS_H

// core
#include "core/BaseObject.h"
#include "core/DragonBones.h"

// geom
#include "geom/ColorTransform.h"
#include "geom/Matrix.h"
#include "geom/Point.h"
#include "geom/Rectangle.h"
#include "geom/Transform.h"

// model
#include "model/AnimationConfig.h"
#include "model/AnimationData.h"
#include "model/ArmatureData.h"
#include "model/BoundingBoxData.h"
#include "model/CanvasData.h"
#include "model/ConstraintData.h"
#include "model/DisplayData.h"
#include "model/DragonBonesData.h"
#include "model/SkinData.h"
#include "model/TextureAtlasData.h"
#include "model/UserData.h"

// armature
#include "armature/Armature.h"
#include "armature/Bone.h"
#include "armature/Constraint.h"
#include "armature/DeformVertices.h"
#include "armature/IArmatureProxy.h"
#include "armature/Slot.h"
#include "armature/TransformObject.h"

// animation
#include "animation/Animation.h"
#include "animation/AnimationState.h"
#include "animation/BaseTimelineState.h"
#include "animation/IAnimatable.h"
#include "animation/TimelineState.h"
#include "animation/WorldClock.h"

// event
#include "event/EventObject.h"
#include "event/IEventDispatcher.h"

#ifndef EGRET_WASM

    // parser
    #include "parser/BinaryDataParser.h"
    #include "parser/DataParser.h"
    #include "parser/JSONDataParser.h"

    // factory
    #include "factory/BaseFactory.h"
#endif // EGRET_WASM

#endif // DRAGONBONES_HEADERS_H
