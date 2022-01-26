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
#include "core/DragonBones.h"
#include "core/BaseObject.h"

// geom
#include "geom/Matrix.h"
#include "geom/Transform.h"
#include "geom/ColorTransform.h"
#include "geom/Point.h"
#include "geom/Rectangle.h"

// model
#include "model/TextureAtlasData.h"
#include "model/UserData.h"
#include "model/DragonBonesData.h"
#include "model/ArmatureData.h"
#include "model/ConstraintData.h"
#include "model/CanvasData.h"
#include "model/SkinData.h"
#include "model/DisplayData.h"
#include "model/BoundingBoxData.h"
#include "model/AnimationData.h"
#include "model/AnimationConfig.h"

// armature
#include "armature/IArmatureProxy.h"
#include "armature/Armature.h"
#include "armature/TransformObject.h"
#include "armature/Bone.h"
#include "armature/Slot.h"
#include "armature/Constraint.h"
#include "armature/DeformVertices.h"

// animation
#include "animation/IAnimatable.h"
#include "animation/WorldClock.h"
#include "animation/Animation.h"
#include "animation/AnimationState.h"
#include "animation/BaseTimelineState.h"
#include "animation/TimelineState.h"

// event
#include "event/EventObject.h"
#include "event/IEventDispatcher.h"

#ifndef EGRET_WASM

// parser
#include "parser/DataParser.h"
#include "parser/JSONDataParser.h"
#include "parser/BinaryDataParser.h"

// factory
#include "factory/BaseFactory.h"
#endif // EGRET_WASM

#endif // DRAGONBONES_HEADERS_H
