/*
 * Copyright (c) 2012 Zynga Inc.
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


#ifndef __js_bindings_box2d_manual
#define __js_bindings_box2d_manual

#include "jsapi.h"
#include "scripting/js-bindings/manual/js_bindings_config.h"
#include "scripting/js-bindings/manual/js_manual_conversions.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"

#include "Box2D/Box2D.h"


// conversions


bool jsval_to_b2Vec2( JSContext *cx, JS::HandleValue vp, b2Vec2 *ret );
bool jsval_to_b2AABB( JSContext *cx, JS::HandleValue vp, b2AABB *ret );
bool jsval_to_b2FixtureDef( JSContext *cx, JS::HandleValue vp, b2FixtureDef *ret );
bool jsval_to_b2BodyDef( JSContext *cx, JS::HandleValue vp, b2BodyDef *ret );
bool jsval_to_b2JointDef( JSContext *cx, JS::HandleValue vp, b2JointType type, b2JointDef *ret );

bool b2Vec2_to_jsval(JSContext *cx, const b2Vec2& v, JS::MutableHandleValue ret);
bool b2Manifold_to_jsval(JSContext* cx, const b2Manifold* v, JS::MutableHandleValue ret);
bool b2ContactImpulse_to_jsval(JSContext* cx, const b2ContactImpulse* v, JS::MutableHandleValue ret);
bool array_of_b2Fixture_to_jsval(JSContext* cx, const std::vector<b2Fixture*>& fixtures, JS::MutableHandleValue ret);
bool array_of_b2Vec2_to_jsval(JSContext* cx, const std::vector<b2Vec2>& vs, JS::MutableHandleValue ret);
bool b2AABB_to_jsval(JSContext* cx, const b2AABB& v, JS::MutableHandleValue ret);

void register_all_box2dclasses_manual(JSContext* cx, JS::HandleObject obj);

#endif // __js_bindings_box2d_manual
