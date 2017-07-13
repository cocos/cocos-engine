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

#include "jsapi.h"
#include "jsfriendapi.h"
#include "extensions/cocos-ext.h"
#include "scripting/js-bindings/manual/js_bindings_config.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"

#include "scripting/js-bindings/manual/box2d/js_bindings_box2d_manual.h"
#include "scripting/js-bindings/manual/js_manual_conversions.h"

#include "scripting/js-bindings/auto/jsb_box2d_auto.hpp"


USING_NS_CC_EXT;

#pragma mark - conversions

bool jsval_get_b2Vec2( JSContext *cx, JS::RootedObject& obj, const char* name, b2Vec2* v)
{
    JS::RootedValue val(cx);
    bool ok = JS_GetProperty(cx, obj, name, &val);
    JS::RootedObject jsobj(cx);
    ok = JS_ValueToObject(cx, val, &jsobj);
    JSB_PRECONDITION( ok, "Error converting value to object");
    JSB_PRECONDITION( jsobj, "Not a valid JS object");
    
    JS::RootedValue valx(cx);
    JS::RootedValue valy(cx);
    ok &= JS_GetProperty(cx, jsobj, "x", &valx) && valx.isNumber();
    ok &= JS_GetProperty(cx, jsobj, "y", &valy) && valy.isNumber();
    JSB_PRECONDITION( ok, "Error obtaining %s properties", name);
    
    v->x = valx.toNumber();
    v->y = valy.toNumber();
    
    return true;
}

bool jsval_to_b2Vec2( JSContext *cx, JS::HandleValue vp, b2Vec2 *ret )
{
    JS::RootedObject jsobj(cx);
    JS::RootedValue jsv(cx, vp);
    bool ok = JS_ValueToObject(cx, jsv, &jsobj);
    JSB_PRECONDITION( ok, "Error converting value to object");
    JSB_PRECONDITION( jsobj, "Not a valid JS object");

    JS::RootedValue valx(cx);
    JS::RootedValue valy(cx);
    ok = true;
    ok &= JS_GetProperty(cx, jsobj, "x", &valx) && valx.isNumber();
    ok &= JS_GetProperty(cx, jsobj, "y", &valy) && valy.isNumber();
    JSB_PRECONDITION( ok, "Error obtaining point properties");

    ret->x = valx.toNumber();
    ret->y = valy.toNumber();

    return true;
}

bool b2Vec2_to_jsval(JSContext *cx, const b2Vec2& v, JS::MutableHandleValue ret)
{
    JS::RootedObject object(cx, JS_NewPlainObject(cx));
    if (JS_DefineProperty(cx, object, "x", v.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, object, "y", v.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) )
    {
        ret.set(JS::ObjectOrNullValue(object));
        return true;
    }
    return false;
}



bool jsval_to_b2AABB( JSContext *cx, JS::HandleValue vp, b2AABB *ret )
{
    JS::RootedObject jsobj(cx);
    JS::RootedValue jsv(cx, vp);
    bool ok = JS_ValueToObject(cx, jsv, &jsobj);
    JSB_PRECONDITION( ok, "Error converting value to object");
    JSB_PRECONDITION( jsobj, "Not a valid JS object");
    
    ok = jsval_get_b2Vec2(cx, jsobj, "lowerBound", &ret->lowerBound);
    ok &= jsval_get_b2Vec2(cx, jsobj, "upperBound", &ret->upperBound);
    JSB_PRECONDITION( ok, "Error converting value to object");
    
    return true;
}

bool jsval_to_b2FixtureDef( JSContext *cx, JS::HandleValue vp, b2FixtureDef *ret )
{
    JS::RootedObject jsobj(cx);
    JS::RootedValue jsv(cx, vp);
    bool ok = JS_ValueToObject(cx, jsv, &jsobj);
    JSB_PRECONDITION( ok, "Error converting value to object");
    JSB_PRECONDITION( jsobj, "Not a valid JS object");
    
    JS::RootedValue valfriction(cx);
    JS::RootedValue valrestitution(cx);
    JS::RootedValue valdensity(cx);
    JS::RootedValue valisSensor(cx);
    JS::RootedValue valShape(cx);
    
    ok = true;
    ok &= JS_GetProperty(cx, jsobj, "friction", &valfriction);
    ok &= JS_GetProperty(cx, jsobj, "restitution", &valrestitution) && valrestitution.isNumber();
    ok &= JS_GetProperty(cx, jsobj, "density", &valdensity) && valdensity.isNumber();
    ok &= JS_GetProperty(cx, jsobj, "isSensor", &valisSensor) && valisSensor.isBoolean();
    ok &= JS_GetProperty(cx, jsobj, "shape", &valShape);
    JSB_PRECONDITION( ok, "Error obtaining fixture properties");
    
    // filter
    JS::RootedValue valfilter(cx);
    ok &= JS_GetProperty(cx, jsobj, "filter", &valfilter);
    JS::RootedObject js_filter_obj(cx);
    ok = JS_ValueToObject(cx, valfilter, &js_filter_obj);
    JSB_PRECONDITION( ok, "Error converting value to object");
    JSB_PRECONDITION( jsobj, "Not a valid JS object");
    
    JS::RootedValue valcategoryBits(cx);
    JS::RootedValue valgroupIndex(cx);
    JS::RootedValue valmaskBits(cx);
    
    ok &= JS_GetProperty(cx, js_filter_obj, "categoryBits", &valcategoryBits);
    ok &= JS_GetProperty(cx, js_filter_obj, "groupIndex", &valgroupIndex);
    ok &= JS_GetProperty(cx, js_filter_obj, "maskBits", &valmaskBits);
    JSB_PRECONDITION( ok, "Error obtaining fixture filter properties");
    
    double friction = valfriction.isNumber() ? valfriction.toNumber() : 0.2f;
    double restitution = valrestitution.toNumber();
    double density = valdensity.toNumber();
    bool isSensor = valisSensor.toBoolean();
    uint16 categoryBits = valcategoryBits.isInt32() ? valcategoryBits.toInt32() : 0x0001;
    uint16 maskBits = valmaskBits.isInt32() ? valmaskBits.toInt32() : 0xFFFF;
    int16 groupIndex = valgroupIndex.isInt32() ? valgroupIndex.toInt32() : 0;
    
    ret->filter.categoryBits = categoryBits;
    ret->filter.groupIndex = groupIndex;
    ret->filter.maskBits = maskBits;
    ret->friction = friction;
    ret->restitution = restitution;
    ret->density = density;
    ret->isSensor = isSensor;
    
    JS::RootedObject obj(cx, valShape.toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    ret->shape = (b2Shape *)(proxy ? proxy->ptr : nullptr);
    
    return true;
}

bool jsval_to_b2BodyDef( JSContext *cx, JS::HandleValue vp, b2BodyDef *ret )
{
    JS::RootedObject jsobj(cx);
    JS::RootedValue jsv(cx, vp);
    bool ok = JS_ValueToObject(cx, jsv, &jsobj);
    JSB_PRECONDITION( ok, "Error converting value to object");
    JSB_PRECONDITION( jsobj, "Not a valid JS object");
    
    
    ok = true;
    
    // other properties
    JS::RootedValue valangle(cx);
    JS::RootedValue valangularVelocity(cx);
    JS::RootedValue vallinearDamping(cx);
    JS::RootedValue valangularDamping(cx);
    JS::RootedValue valgravityScale(cx);
    JS::RootedValue valallowSleep(cx);
    JS::RootedValue valawake(cx);
    JS::RootedValue valfixedRotation(cx);
    JS::RootedValue valbullet(cx);
    JS::RootedValue valactive(cx);
    JS::RootedValue valtype(cx);
    
    ok &= JS_GetProperty(cx, jsobj, "angle", &valangle) && valangle.isNumber();
    ok &= JS_GetProperty(cx, jsobj, "angularVelocity", &valangularVelocity) && valangularVelocity.isNumber();
    ok &= JS_GetProperty(cx, jsobj, "linearDamping", &vallinearDamping) && vallinearDamping.isNumber();
    ok &= JS_GetProperty(cx, jsobj, "angularDamping", &valangularDamping) && valangularDamping.isNumber();
    ok &= JS_GetProperty(cx, jsobj, "gravityScale", &valgravityScale);
    ok &= JS_GetProperty(cx, jsobj, "allowSleep", &valallowSleep);
    ok &= JS_GetProperty(cx, jsobj, "awake", &valawake);
    ok &= JS_GetProperty(cx, jsobj, "fixedRotation", &valfixedRotation) && valfixedRotation.isBoolean();
    ok &= JS_GetProperty(cx, jsobj, "bullet", &valbullet) && valbullet.isBoolean();
    ok &= JS_GetProperty(cx, jsobj, "active", &valactive);
    ok &= JS_GetProperty(cx, jsobj, "type", &valtype) && valtype.isInt32();
    JSB_PRECONDITION( ok, "Error obtaining body def properties");
    
    // position
    JS::RootedValue valposition(cx);
    ok &= JS_GetProperty(cx, jsobj, "position", &valposition);
    JS::RootedObject js_position_obj(cx);
    ok = JS_ValueToObject(cx, valposition, &js_position_obj);
    JSB_PRECONDITION( ok, "Error converting value to object");
    JSB_PRECONDITION( jsobj, "Not a valid JS object");
    
    JS::RootedValue valx(cx);
    JS::RootedValue valy(cx);
    ok &= JS_GetProperty(cx, js_position_obj, "x", &valx) && valx.isNumber();
    ok &= JS_GetProperty(cx, js_position_obj, "y", &valy) && valy.isNumber();
    
    JSB_PRECONDITION( ok, "Error obtaining body def position properties");
    
    // linearVelocity
    JS::RootedValue valvelocity(cx);
    ok &= JS_GetProperty(cx, jsobj, "linearVelocity", &valvelocity);
    JS::RootedObject js_velocity_obj(cx);
    ok = JS_ValueToObject(cx, valvelocity, &js_velocity_obj);
    JSB_PRECONDITION( ok, "Error converting value to object");
    JSB_PRECONDITION( jsobj, "Not a valid JS object");
    
    JS::RootedValue valVelocityx(cx);
    JS::RootedValue valVelocityy(cx);
    
    ok &= JS_GetProperty(cx, js_velocity_obj, "x", &valVelocityx) && valVelocityx.isNumber();
    ok &= JS_GetProperty(cx, js_velocity_obj, "y", &valVelocityy) && valVelocityy.isNumber();
    
    JSB_PRECONDITION( ok, "Error obtaining body def linearVelocity properties");
    
    double x = valx.toNumber();
    double y = valy.toNumber();
    double velocityx = valVelocityx.toNumber();
    double velocityy = valVelocityy.toNumber();
    double angle = valangle.toNumber();
    double angularVelocity = valangularVelocity.toNumber();
    double linearDamping = vallinearDamping.toNumber();
    double angularDamping = valangularDamping.toNumber();
    double gravityScale = valgravityScale.isNumber() ? valgravityScale.toNumber() : 1.0f;
    bool allowSleep = valallowSleep.isBoolean() ? valallowSleep.toBoolean() : true;
    bool awake = valawake.isBoolean() ? valawake.toBoolean() : true;
    bool fixedRotation = valfixedRotation.toBoolean();
    bool bullet = valbullet.toBoolean();
    bool active = valactive.isBoolean() ? valactive.toBoolean() : true;
    b2BodyType type = (b2BodyType)valtype.toInt32();
    
    ret->position.Set(x, y);
    ret->linearVelocity.Set(velocityx, velocityy);
    ret->angle = angle;
    ret->angularVelocity = angularVelocity;
    ret->linearDamping = linearDamping;
    ret->angularDamping = angularDamping;
    ret->gravityScale = gravityScale;
    ret->allowSleep =allowSleep;
    ret->awake = awake;
    ret->fixedRotation = fixedRotation;
    ret->bullet = bullet;
    ret->active = active;
    ret->type = type;
    
    return true;
}


bool jsval_to_b2JointDef( JSContext *cx, JS::HandleValue vp, b2JointType type, b2JointDef *ret )
{
    JS::RootedObject jsobj(cx);
    JS::RootedValue jsv(cx, vp);
    bool ok = JS_ValueToObject(cx, jsv, &jsobj);
    JSB_PRECONDITION( ok, "Error converting value to object");
    JSB_PRECONDITION( jsobj, "Not a valid JS object");
    
    JS::RootedValue valbodyA(cx);
    JS::RootedValue valbodyB(cx);
    JS::RootedValue valcollideConnected(cx);
    
    ok &= JS_GetProperty(cx, jsobj, "bodyA", &valbodyA);
    ok &= JS_GetProperty(cx, jsobj, "bodyB", &valbodyB);
    ok &= JS_GetProperty(cx, jsobj, "collideConnected", &valcollideConnected) && valcollideConnected.isBoolean();
    JSB_PRECONDITION( ok, "Error obtaining b2JointDef properties");
    
    js_proxy_t *proxy = jsb_get_js_proxy(cx, JS::RootedObject(cx, valbodyA.toObjectOrNull()));
    ret->bodyA = (b2Body *)(proxy ? proxy->ptr : nullptr);
    
    proxy = jsb_get_js_proxy(cx, JS::RootedObject(cx, valbodyB.toObjectOrNull()));
    ret->bodyB = (b2Body *)(proxy ? proxy->ptr : nullptr);
    
    ret->collideConnected = valcollideConnected.toBoolean();
    
    switch (type) {
        case e_distanceJoint:
        {
            b2DistanceJointDef* def = (b2DistanceJointDef*)ret;
            
            JS::RootedValue vallength(cx);
            JS::RootedValue valfrequencyHz(cx);
            JS::RootedValue valdampingRatio(cx);
            
            ok &= JS_GetProperty(cx, jsobj, "length", &vallength) && vallength.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "frequencyHz", &valfrequencyHz) && valfrequencyHz.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "dampingRatio", &valdampingRatio) && valdampingRatio.isNumber();
            JSB_PRECONDITION( ok, "Error obtaining b2DistanceJointDef properties");
            
            def->length = vallength.toNumber();
            def->frequencyHz = valfrequencyHz.toNumber();
            def->dampingRatio = valdampingRatio.toNumber();
            
            break;
        }
        case e_frictionJoint:
        {
            b2FrictionJointDef* def = (b2FrictionJointDef*)ret;
            
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorA", &def->localAnchorA);
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorB", &def->localAnchorB);
            
            JS::RootedValue valmaxForce(cx);
            JS::RootedValue valmaxTorque(cx);
            
            ok &= JS_GetProperty(cx, jsobj, "maxForce", &valmaxForce) && valmaxForce.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "maxTorque", &valmaxTorque) && valmaxTorque.isNumber();
            JSB_PRECONDITION( ok, "Error obtaining b2FrictionJointDef properties");
            
            def->maxForce = valmaxForce.toNumber();
            def->maxTorque = valmaxTorque.toNumber();
            
            break;
        }
        case e_gearJoint:
        {
            b2GearJointDef* def = (b2GearJointDef*)ret;
            
            JS::RootedValue valjoint1(cx);
            JS::RootedValue valjoint2(cx);
            JS::RootedValue valratio(cx);
            
            ok &= JS_GetProperty(cx, jsobj, "valjoint1", &valjoint1);
            ok &= JS_GetProperty(cx, jsobj, "valjoint2", &valjoint2);
            ok &= JS_GetProperty(cx, jsobj, "ratio", &valratio) && valratio.isNumber();
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");
            
            JS::RootedObject joint1obj(cx, valjoint1.toObjectOrNull());
            proxy = jsb_get_js_proxy(cx, joint1obj);
            def->joint1 = (b2Joint *)(proxy ? proxy->ptr : nullptr);
            
            JS::RootedObject joint2obj(cx, valjoint2.toObjectOrNull());
            proxy = jsb_get_js_proxy(cx, joint2obj);
            def->joint2 = (b2Joint *)(proxy ? proxy->ptr : nullptr);
            
            def->ratio = valratio.toNumber();
            
            break;
        }
        case e_motorJoint:
        {
            b2MotorJointDef* def = (b2MotorJointDef*)ret;
            ok &= jsval_get_b2Vec2(cx, jsobj, "linearOffset", &def->linearOffset);
            
            JS::RootedValue valangularOffset(cx);
            JS::RootedValue valmaxForce(cx);
            JS::RootedValue valmaxTorque(cx);
            JS::RootedValue valcorrectionFactor(cx);
            
            ok &= JS_GetProperty(cx, jsobj, "angularOffset", &valangularOffset) && valangularOffset.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "maxForce", &valmaxForce) && valmaxForce.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "maxTorque", &valmaxTorque) && valmaxTorque.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "correctionFactor", &valcorrectionFactor) && valcorrectionFactor.isNumber();
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");
            
            def->angularOffset = valangularOffset.toNumber();
            def->maxForce = valmaxForce.toNumber();
            def->maxTorque = valmaxTorque.toNumber();
            def->correctionFactor = valcorrectionFactor.toNumber();
            
            break;
        }
        case e_mouseJoint:
        {
            b2MouseJointDef* def = (b2MouseJointDef*)ret;
            
            ok &= jsval_get_b2Vec2(cx, jsobj, "target", &def->target);
            
            JS::RootedValue valmaxForce(cx);
            JS::RootedValue valfrequencyHz(cx);
            JS::RootedValue valdampingRatio(cx);
            
            ok &= JS_GetProperty(cx, jsobj, "frequencyHz", &valfrequencyHz) && valfrequencyHz.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "maxForce", &valmaxForce) && valmaxForce.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "dampingRatio", &valdampingRatio) && valdampingRatio.isNumber();
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");
            
            def->frequencyHz = valfrequencyHz.toNumber();
            def->maxForce = valmaxForce.toNumber();
            def->dampingRatio = valdampingRatio.toNumber();
            
            break;
        }
        case e_prismaticJoint:
        {
            b2PrismaticJointDef* def = (b2PrismaticJointDef*)ret;
            
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorA", &def->localAnchorA);
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorB", &def->localAnchorB);
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAxisA", &def->localAxisA);
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");

            JS::RootedValue valreferenceAngle(cx);  
            JS::RootedValue vallowerTranslation(cx);
            JS::RootedValue valupperTranslation(cx);
            JS::RootedValue valmaxMotorForce(cx);
            JS::RootedValue valmotorSpeed(cx);
            JS::RootedValue valenableLimit(cx);
            JS::RootedValue valenableMotor(cx);

            ok &= JS_GetProperty(cx, jsobj, "lowerTranslation", &vallowerTranslation) && vallowerTranslation.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "referenceAngle", &valreferenceAngle) && valreferenceAngle.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "upperTranslation", &valupperTranslation) && valupperTranslation.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "maxMotorForce", &valmaxMotorForce) && valmaxMotorForce.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "motorSpeed", &valmotorSpeed) && valmotorSpeed.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "enableLimit", &valenableLimit) && valenableLimit.isBoolean();
            ok &= JS_GetProperty(cx, jsobj, "enableMotor", &valenableMotor) && valenableMotor.isBoolean();
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");

            def->lowerTranslation = vallowerTranslation.toNumber();
            def->referenceAngle = valreferenceAngle.toNumber();
            def->upperTranslation = valupperTranslation.toNumber();
            def->maxMotorForce = valmaxMotorForce.toNumber();
            def->motorSpeed = valmotorSpeed.toNumber();
            def->enableLimit = valenableLimit.toBoolean();
            def->enableMotor = valenableMotor.toBoolean();

            break;
        }
        case e_pulleyJoint:
        {
            b2PulleyJointDef* def = (b2PulleyJointDef*)ret;
            
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorA", &def->localAnchorA);
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorB", &def->localAnchorB);
            ok &= jsval_get_b2Vec2(cx, jsobj, "groundAnchorA", &def->groundAnchorA);
            ok &= jsval_get_b2Vec2(cx, jsobj, "groundAnchorB", &def->groundAnchorB);
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");

            JS::RootedValue vallengthA(cx);
            JS::RootedValue vallengthB(cx);
            JS::RootedValue valratio(cx);

            ok &= JS_GetProperty(cx, jsobj, "lengthB", &vallengthB) && vallengthB.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "lengthA", &vallengthA) && vallengthA.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "ratio", &valratio) && valratio.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "collideConnected", &valcollideConnected) && valcollideConnected.isBoolean();
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");

            def->lengthB = vallengthB.toNumber();
            def->lengthA = vallengthA.toNumber();
            def->ratio = valratio.toNumber();
            def->collideConnected = valcollideConnected.toBoolean();

            break;
        }
        case e_revoluteJoint:
        {
            b2RevoluteJointDef* def = (b2RevoluteJointDef*)ret;

            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorA", &def->localAnchorA);
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorB", &def->localAnchorB);

            JS::RootedValue valreferenceAngle(cx);  
            JS::RootedValue vallowerAngle(cx);
            JS::RootedValue valupperAngle(cx);
            JS::RootedValue valmaxMotorTorque(cx);
            JS::RootedValue valmotorSpeed(cx);
            JS::RootedValue valenableLimit(cx);
            JS::RootedValue valenableMotor(cx);

            ok &= JS_GetProperty(cx, jsobj, "lowerAngle", &vallowerAngle) && vallowerAngle.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "referenceAngle", &valreferenceAngle) && valreferenceAngle.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "upperAngle", &valupperAngle) && valupperAngle.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "maxMotorTorque", &valmaxMotorTorque) && valmaxMotorTorque.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "motorSpeed", &valmotorSpeed) && valmotorSpeed.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "enableLimit", &valenableLimit) && valenableLimit.isBoolean();
            ok &= JS_GetProperty(cx, jsobj, "enableMotor", &valenableMotor) && valenableMotor.isBoolean();
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");

            def->lowerAngle = vallowerAngle.toNumber();
            def->referenceAngle = valreferenceAngle.toNumber();
            def->upperAngle = valupperAngle.toNumber();
            def->maxMotorTorque = valmaxMotorTorque.toNumber();
            def->motorSpeed = valmotorSpeed.toNumber();
            def->enableLimit = valenableLimit.toBoolean();
            def->enableMotor = valenableMotor.toBoolean();
            
            break;
        }
        case e_ropeJoint:
        {
            b2RopeJointDef* def = (b2RopeJointDef*)ret;
            
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorA", &def->localAnchorA);
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorB", &def->localAnchorB);

            JS::RootedValue valmaxLength(cx);

            ok &= JS_GetProperty(cx, jsobj, "maxLength", &valmaxLength) && valmaxLength.isNumber();
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");

            def->maxLength = valmaxLength.toNumber();

            break;
        }
        case e_weldJoint: 
        {
            b2WeldJointDef* def = (b2WeldJointDef*)ret;

            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorA", &def->localAnchorA);
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorB", &def->localAnchorB);

            JS::RootedValue valreferenceAngle(cx);
            JS::RootedValue valfrequencyHz(cx);
            JS::RootedValue valdampingRatio(cx);
            
            ok &= JS_GetProperty(cx, jsobj, "referenceAngle", &valreferenceAngle) && valreferenceAngle.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "frequencyHz", &valfrequencyHz) && valfrequencyHz.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "dampingRatio", &valdampingRatio) && valdampingRatio.isNumber();
            JSB_PRECONDITION( ok, "Error obtaining b2DistanceJointDef properties");
            
            def->referenceAngle = valreferenceAngle.toNumber();
            def->frequencyHz = valfrequencyHz.toNumber();
            def->dampingRatio = valdampingRatio.toNumber();

            break;
        }
        case e_wheelJoint:
        {
            b2WheelJointDef* def = (b2WheelJointDef*)ret;
            
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorA", &def->localAnchorA);
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorB", &def->localAnchorB);
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAxisA", &def->localAxisA);
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");

            JS::RootedValue valmaxMotorTorque(cx);  
            JS::RootedValue valfrequencyHz(cx);
            JS::RootedValue valdampingRatio(cx);
            JS::RootedValue valmotorSpeed(cx);
            JS::RootedValue valenableMotor(cx);

            ok &= JS_GetProperty(cx, jsobj, "frequencyHz", &valfrequencyHz) && valfrequencyHz.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "maxMotorTorque", &valmaxMotorTorque) && valmaxMotorTorque.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "dampingRatio", &valdampingRatio) && valdampingRatio.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "motorSpeed", &valmotorSpeed) && valmotorSpeed.isNumber();
            ok &= JS_GetProperty(cx, jsobj, "enableMotor", &valenableMotor) && valenableMotor.isBoolean();
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");

            def->frequencyHz = valfrequencyHz.toNumber();
            def->maxMotorTorque = valmaxMotorTorque.toNumber();
            def->dampingRatio = valdampingRatio.toNumber();
            def->motorSpeed = valmotorSpeed.toNumber();
            def->enableMotor = valenableMotor.toBoolean();
            break;
        }
        default:
            break;
    }
    
    return true;
}


bool jsval_to_array_of_b2Vec2(JSContext* cx, JS::HandleValue v, b2Vec2 *points, int numPoints) {
    // Parsing sequence
    JS::RootedObject jsobj(cx);
    bool ok = v.isObject() && JS_ValueToObject( cx, v, &jsobj );
    JSB_PRECONDITION3(ok, cx, false, "Error converting value to object");
    JSB_PRECONDITION3(JS_IsArrayObject( cx, jsobj, &ok) && ok, cx, false, "Object must be an array");
    
    for( uint32_t i=0; i<numPoints; i++ ) {
        JS::RootedValue valarg(cx);
        JS_GetElement(cx, jsobj, i, &valarg);
        
        ok = jsval_to_b2Vec2(cx, valarg, &points[i]);
        JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");
    }
    
    return true;
}

bool b2Manifold_to_jsval(JSContext* cx, const b2Manifold* v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    JS::RootedValue localPointVal(cx);
    JS::RootedValue localNormalVal(cx);
    
    bool ok = b2Vec2_to_jsval(cx, v->localPoint, &localPointVal);
    ok &= JS_DefineProperty(cx, tmp, "localPoint", localPointVal, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= b2Vec2_to_jsval(cx, v->localNormal, &localNormalVal);
    ok &= JS_DefineProperty(cx, tmp, "localNormal", localNormalVal, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "pointCount", v->pointCount, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "type", v->type, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, 0));
    JS::RootedObject arrElement(cx);
    localPointVal.set(JS::NullHandleValue);
    
    for (int i = 0; i < v->pointCount; i++)
    {
        const b2ManifoldPoint& p = v->points[i];
        
        arrElement = JS_NewPlainObject(cx);
        
        ok &= JS_DefineProperty(cx, arrElement, "normalImpulse", p.normalImpulse, JSPROP_ENUMERATE | JSPROP_PERMANENT);
        ok &= JS_DefineProperty(cx, arrElement, "tangentImpulse", p.tangentImpulse, JSPROP_ENUMERATE | JSPROP_PERMANENT);
        ok &= b2Vec2_to_jsval(cx, p.localPoint, &localPointVal);
        ok &= JS_DefineProperty(cx, arrElement, "localPoint", localPointVal, JSPROP_ENUMERATE | JSPROP_PERMANENT);
        
        if (!JS_SetElement(cx, jsretArr, i, arrElement)) {
            break;
        }
    }
    
    ok &= JS_DefineProperty(cx, tmp, "points", jsretArr, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool b2ContactImpulse_to_jsval(JSContext* cx, const b2ContactImpulse* v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    bool ok = true;
    
    JS::RootedObject jsretNormal(cx, JS_NewArrayObject(cx, 0));
    for (int i = 0; i < v->count; i++)
    {
        float32 normal = v->normalImpulses[i];
        
        if (!JS_SetElement(cx, jsretNormal, i, normal)) {
            break;
        }
    }
    ok &= JS_DefineProperty(cx, tmp, "normalImpulses", jsretNormal, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    JS::RootedObject jsretTangent(cx, JS_NewArrayObject(cx, 0));
    for (int i = 0; i < v->count; i++)
    {
        float32 normal = v->tangentImpulses[i];
        
        if (!JS_SetElement(cx, jsretTangent, i, normal)) {
            break;
        }
    }
    ok &= JS_DefineProperty(cx, tmp, "tangentImpulses", jsretTangent, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool array_of_b2Fixture_to_jsval(JSContext* cx, const std::vector<b2Fixture*>& fixtures, JS::MutableHandleValue ret)
{
    JS::RootedObject jsret(cx, JS_NewArrayObject(cx, 0));
    
    auto count = fixtures.size();
    for (int i = 0; i < count; i++)
    {
        b2Fixture* f = fixtures[i];
        
        JS::RootedValue arrElement(cx);
        JS::RootedObject arrObj(cx);
        js_get_or_create_jsobject<b2Fixture>(cx, f, &arrObj);
        arrElement = JS::ObjectOrNullValue(arrObj);
        
        if (!JS_SetElement(cx, jsret, i, arrElement)) {
            break;
        }
    }
    
    ret.set(JS::ObjectOrNullValue(jsret));
    return true;
}

bool array_of_b2Vec2_to_jsval(JSContext* cx, const std::vector<b2Vec2>& vs, JS::MutableHandleValue ret)
{
    JS::RootedObject jsret(cx, JS_NewArrayObject(cx, 0));
    
    auto count = vs.size();
    for (int i = 0; i < count; i++)
    {
        const b2Vec2& v = vs[i];
        
        JS::RootedValue arrElement(cx);
        bool ok = b2Vec2_to_jsval(cx, v, &arrElement);
        
        if (!ok || !JS_SetElement(cx, jsret, i, arrElement)) {
            break;
        }
    }
    
    ret.set(JS::ObjectOrNullValue(jsret));
    return true;
}

bool b2AABB_to_jsval(JSContext* cx, const b2AABB& v, JS::MutableHandleValue ret)
{
    JS::RootedObject object(cx, JS_NewPlainObject(cx));
    
    JS::RootedObject lowerBound(cx, JS_NewPlainObject(cx));
    if (!JS_DefineProperty(cx, lowerBound, "x", v.lowerBound.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) ||
        !JS_DefineProperty(cx, lowerBound, "y", v.lowerBound.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) ) {
        return false;
    }
    
    JS::RootedObject upperBound(cx, JS_NewPlainObject(cx));
    if (!JS_DefineProperty(cx, upperBound, "x", v.upperBound.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) ||
        !JS_DefineProperty(cx, upperBound, "y", v.upperBound.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) ) {
        return false;
    }
    
    if (!JS_DefineProperty(cx, object, "lowerBound", lowerBound, JSPROP_ENUMERATE | JSPROP_PERMANENT) ||
        !JS_DefineProperty(cx, object, "upperBound", upperBound, JSPROP_ENUMERATE | JSPROP_PERMANENT) ) {
        return false;
    }
    
    ret.set(JS::ObjectOrNullValue(object));
    return true;
}


extern JSClass  *jsb_b2Shape_class;
extern JS::PersistentRootedObject *jsb_b2Shape_prototype;

bool js_box2dclasses_b2Shape_GetRadius(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Shape* cobj = (b2Shape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Shape_GetRadius : Invalid Native Object");
    if (argc == 0) {
        float32 ret = cobj->m_radius;
        JS::RootedValue jsret(cx);
        long_to_jsval(cx, ret, &jsret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Shape_GetRadius : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Shape_SetRadius(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Shape* cobj = (b2Shape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Shape_SetRadius : Invalid Native Object");
    if (argc == 1) {
        JSB_PRECONDITION2(args.get(0).isNumber(), cx, false, "js_box2dclasses_b2Shape_SetRadius : Error processing arguments");
        cobj->m_radius = args.get(0).toNumber();
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Shape_SetRadius : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}


extern JSClass  *jsb_b2CircleShape_class;
extern JS::PersistentRootedObject *jsb_b2CircleShape_prototype;

bool js_box2dclasses_b2CircleShape_GetPosition(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_GetPosition : Invalid Native Object");
    if (argc == 0) {
        b2Vec2& ret = cobj->m_p;
        JS::RootedValue jsret(cx);
        bool ok = b2Vec2_to_jsval(cx, ret, &jsret);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_GetPosition : error parsing return value.");
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2CircleShape_GetPosition : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2CircleShape_SetPosition(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_SetPosition : Invalid Native Object");
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= jsval_to_b2Vec2(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2CircleShape_SetPosition : Error processing arguments");
        cobj->m_p = arg0;
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Shape_SetRadius : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_box2dclasses_b2World_CreateJoint(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_CreateJoint : Invalid Native Object");
    if (argc == 1) {
        const b2JointDef* arg0 = nullptr;
        b2JointDef* tmpDef = nullptr;
        b2JointType type = e_unknownJoint;
        {
            JS::RootedValue jsv(cx, args.get(0));
            JS::RootedObject jsobj(cx, jsv.toObjectOrNull());
            JS::RootedValue valtype(cx);
            
            ok &= JS_GetProperty(cx, jsobj, "type", &valtype);
            JSB_PRECONDITION( ok, "Error obtaining type properties");
            
            type = valtype.isInt32() ? (b2JointType)valtype.toInt32() : b2JointType::e_unknownJoint;
            
            switch (type) {
                case e_distanceJoint:
                {
                    tmpDef = new b2DistanceJointDef();
                    break;
                }
                case e_frictionJoint:
                {
                    tmpDef = new b2FrictionJointDef();
                    break;
                }
                case e_gearJoint:
                {
                    tmpDef = new b2GearJointDef();
                    break;
                }
                case e_motorJoint:
                {
                    tmpDef = new b2MotorJointDef();
                    break;
                }
                case e_mouseJoint:
                {
                    tmpDef = new b2MouseJointDef();
                    break;
                }
                case e_prismaticJoint:
                {
                    tmpDef = new b2PrismaticJointDef();
                    break;
                }
                case e_pulleyJoint:
                {
                    tmpDef = new b2PulleyJointDef();
                    break;
                }
                case e_revoluteJoint:
                {
                    tmpDef = new b2RevoluteJointDef();
                    break;
                }
                case e_ropeJoint:
                {
                    tmpDef = new b2RopeJointDef();
                    break;
                }
                case e_weldJoint: 
                {
                    tmpDef = new b2WeldJointDef();
                    break;
                }
                case e_wheelJoint:
                {
                    tmpDef = new b2WheelJointDef();
                    break;
                }
                default:
                    break;
            }
        }
        
        arg0=tmpDef; ok &= jsval_to_b2JointDef(cx, args.get(0), type, tmpDef);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_CreateJoint : Error processing arguments");
        
        b2Joint* ret = cobj->CreateJoint(arg0);
        
        delete tmpDef;
        
        JS::RootedValue jsret(cx);
        if (ret) {
            // box2d will reuse cached memory, need first remove old proxy when create new jsobject
            auto retProxy = jsb_get_native_proxy(ret);
            if (retProxy) {
                jsb_remove_proxy(retProxy);
            }
            JS::RootedObject retObj(cx);
            js_get_or_create_jsobject<b2Joint>(cx, (b2Joint*)ret, &retObj);
            jsret = JS::ObjectOrNullValue(retObj);
        }
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_CreateJoint : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_CreateBody(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_CreateBody : Invalid Native Object");
    if (argc == 1) {
        const b2BodyDef* arg0 = nullptr;
        b2BodyDef tmpDef; arg0=&tmpDef; ok &= jsval_to_b2BodyDef(cx, args.get(0), &tmpDef);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2World_CreateBody : Error processing arguments");
        b2Body* ret = cobj->CreateBody(arg0);
        JS::RootedValue jsret(cx);
        if (ret) {
            // box2d will reuse cached memory, need first remove old proxy when create new jsobject
            auto retProxy = jsb_get_native_proxy(ret);
            if (retProxy) {
                jsb_remove_proxy(retProxy);
            }
            JS::RootedObject retObj(cx);
            js_get_or_create_jsobject<b2Body>(cx, (b2Body*)ret, &retObj);
            jsret = JS::ObjectOrNullValue(retObj);
        }
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2World_CreateBody : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}


bool js_box2dclasses_b2Body_CreateFixture(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    b2Body* cobj = nullptr;
    
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Body *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_CreateFixture : Invalid Native Object");
    do {
        bool ok = true;
        if (argc == 2) {
            const b2Shape* arg0 = nullptr;
            do {
                if (args.get(0).isNull()) { arg0 = nullptr; break; }
                if (!args.get(0).isObject()) { ok = false; break; }
                js_proxy_t *jsProxy;
                JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
                jsProxy = jsb_get_js_proxy(cx, tmpObj);
                arg0 = (const b2Shape*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            JSB_PRECONDITION2(args.get(1).isNumber(), cx, false, "js_box2dclasses_b2Body_CreateFixture : Error processing arguments");
            double arg1 = args.get(1).toNumber();
            b2Fixture* ret = cobj->CreateFixture(arg0, arg1);
            JS::RootedValue jsret(cx);
            if (ret) {
                // box2d will reuse cached memory, need first remove old proxy when create new jsobject
                auto retProxy = jsb_get_native_proxy(ret);
                if (retProxy) {
                    jsb_remove_proxy(retProxy);
                }
                JS::RootedObject retObj(cx);
                js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret, &retObj);
                jsret = JS::ObjectOrNullValue(retObj);
            }
            args.rval().set(jsret);
            return true;
        }
    } while(0);
    
    do {
        bool ok = true;
        if (argc == 1) {
            const b2FixtureDef* arg0 = nullptr;
            b2FixtureDef tmpDef; arg0=&tmpDef; ok &= jsval_to_b2FixtureDef(cx, args.get(0), &tmpDef);
            if (!ok) { ok = true; break; }
            b2Fixture* ret = cobj->CreateFixture(arg0);
            JS::RootedValue jsret(cx);
            if (ret) {
                // box2d will reuse cached memory, need first remove old proxy when create new jsobject
                auto retProxy = jsb_get_native_proxy(ret);
                if (retProxy) {
                    jsb_remove_proxy(retProxy);
                }
                JS::RootedObject retObj(cx);
                js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret, &retObj);
                jsret = JS::ObjectOrNullValue(retObj);
            }
            args.rval().set(jsret);
            return true;
        }
    } while(0);
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_CreateFixture : wrong number of arguments");
    return false;
}

bool js_box2dclasses_b2Body_GetJointList(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    b2Body* cobj = nullptr;
    
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2Body *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetJointList : Invalid Native Object");
    do {
        if (argc == 0) {
            JS::RootedValue jsret(cx);
            
            b2JointEdge* list = cobj->GetJointList();
            do
            {
                if (!list) {
                    break;
                }
                
                JS::RootedObject array(cx, JS_NewArrayObject(cx, 0));
                int i = 0;
                JS::RootedObject itemObj(cx);
                JS::RootedValue item(cx);
                
                js_get_or_create_jsobject<b2Joint>(cx, list->joint, &itemObj);
                item = JS::ObjectOrNullValue(itemObj);
                if (!JS_SetElement(cx, array, i++, item)) {
                    break;
                }
                
                b2JointEdge* prev = list->prev;
                while (prev) {
                    js_get_or_create_jsobject<b2Joint>(cx, prev->joint, &itemObj);
                    item = JS::ObjectOrNullValue(itemObj);
                    if (!JS_SetElement(cx, array, i++, item)) {
                        break;
                    }
                    
                    prev = prev->prev;
                }
                
                b2JointEdge* next = list->next;
                while (next) {
                    js_get_or_create_jsobject<b2Joint>(cx, next->joint, &itemObj);
                    item = JS::ObjectOrNullValue(itemObj);
                    if (!JS_SetElement(cx, array, i++, item)) {
                        break;
                    }
                    
                    next = next->next;
                }
                
                jsret = JS::ObjectOrNullValue(array);
            }
            while(0);
            
            args.rval().set( jsret );
            return true;
        }
    } while(0);
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetJointList : wrong number of arguments");
    return false;
}

bool js_box2dclasses_b2PolygonShape_Set(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2PolygonShape* cobj = (b2PolygonShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PolygonShape_Set : Invalid Native Object");
    if (argc == 2) {
        int arg1 = 0;
        
        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_Set : Error processing arguments");
        
        b2Vec2* arg0 = new (std::nothrow) b2Vec2[arg1];
        ok &= jsval_to_array_of_b2Vec2(cx, args.get(0), arg0, arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_Set : Error processing arguments");
        
        cobj->Set(arg0, arg1);
        
        delete [] arg0;
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PolygonShape_Set : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2PolygonShape_SetAsBox(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    b2PolygonShape* cobj = nullptr;
    
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    cobj = (b2PolygonShape *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PolygonShape_SetAsBox : Invalid Native Object");
    do {
        if (argc == 4) {
            double arg0, arg1, arg3;
            bool ok = jsval_to_double(cx, args.get(0), &arg0);
            ok &= jsval_to_double(cx, args.get(1), &arg1);
            b2Vec2 arg2;
            ok &= jsval_to_b2Vec2(cx, args.get(2), &arg2);
            ok &= jsval_to_double(cx, args.get(3), &arg3);
            if (!ok) { ok = true; break; }
            cobj->SetAsBox(arg0, arg1, arg2, arg3);
            args.rval().setUndefined();
            return true;
        }
    } while(0);
    
    do {
        if (argc == 2) {
            double arg0, arg1;
            bool ok = jsval_to_double(cx, args.get(0), &arg0);
            ok &= jsval_to_double(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            cobj->SetAsBox(arg0, arg1);
            args.rval().setUndefined();
            return true;
        }
    } while(0);
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2PolygonShape_SetAsBox : arguments error");
    return false;
}

bool js_box2dclasses_b2Body_SetUserData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetUserData : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(cx, tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetUserData : Error processing arguments");
        cobj->SetUserData(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_SetUserData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_box2dclasses_b2Body_GetUserData(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetUserData : Invalid Native Object");
    if (argc == 0) {
        void* ret = cobj->GetUserData();
        JS::RootedValue jsret(cx);
        if (ret) {
            JS::RootedObject retObj(cx);
            js_get_or_create_jsobject<cocos2d::Node>(cx, (cocos2d::Node*)ret, &retObj);
            jsret = JS::ObjectOrNullValue(retObj);
        }
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2Body_GetUserData : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_box2dclasses_b2ChainShape_CreateChain(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ChainShape* cobj = (b2ChainShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ChainShape_CreateChain : Invalid Native Object");
    if (argc == 2) {
        int arg1 = 0;

        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_CreateChain : Error processing arguments");
        
        b2Vec2* arg0 = new (std::nothrow) b2Vec2[arg1];
        ok &= jsval_to_array_of_b2Vec2(cx, args.get(0), arg0, arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_Set : Error processing arguments");
        
        cobj->CreateChain(arg0, arg1);
        
        delete[] arg0;
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ChainShape_CreateChain : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_box2dclasses_b2ChainShape_CreateLoop(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    b2ChainShape* cobj = (b2ChainShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2ChainShape_CreateLoop : Invalid Native Object");
    if (argc == 2) {
        int arg1 = 0;

        ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2ChainShape_CreateLoop : Error processing arguments");
        
        b2Vec2* arg0 = new (std::nothrow) b2Vec2[arg1];
        ok &= jsval_to_array_of_b2Vec2(cx, args.get(0), arg0, arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2PolygonShape_Set : Error processing arguments");
        
        cobj->CreateLoop(arg0, arg1);
        
        delete[] arg0;
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportErrorUTF8(cx, "js_box2dclasses_b2ChainShape_CreateLoop : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

void register_all_box2dclasses_manual(JSContext* cx, JS::HandleObject obj) {
    JS::RootedObject tmpObj(cx);
    
    tmpObj.set(jsb_b2Shape_prototype->get());
    JS_DefineFunction(cx, tmpObj, "SetRadius", js_box2dclasses_b2Shape_SetRadius, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "GetRadius", js_box2dclasses_b2Shape_GetRadius, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    tmpObj.set(jsb_b2CircleShape_prototype->get());
    JS_DefineFunction(cx, tmpObj, "SetPosition", js_box2dclasses_b2CircleShape_SetPosition, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "GetPosition", js_box2dclasses_b2CircleShape_GetPosition, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    tmpObj.set(jsb_b2World_prototype->get());
    JS_DefineFunction(cx, tmpObj, "CreateBody", js_box2dclasses_b2World_CreateBody, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "CreateJoint", js_box2dclasses_b2World_CreateJoint, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    tmpObj.set(jsb_b2Body_prototype->get());
    JS_DefineFunction(cx, tmpObj, "CreateFixture", js_box2dclasses_b2Body_CreateFixture, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "SetUserData", js_box2dclasses_b2Body_SetUserData, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "GetUserData", js_box2dclasses_b2Body_GetUserData, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "GetJointList", js_box2dclasses_b2Body_GetJointList, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    tmpObj.set(jsb_b2PolygonShape_prototype->get());
    JS_DefineFunction(cx, tmpObj, "Set", js_box2dclasses_b2PolygonShape_Set, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "SetAsBox", js_box2dclasses_b2PolygonShape_SetAsBox, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    tmpObj.set(jsb_b2ChainShape_prototype->get());
    JS_DefineFunction(cx, tmpObj, "CreateLoop", js_box2dclasses_b2ChainShape_CreateLoop, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "CreateChain", js_box2dclasses_b2ChainShape_CreateChain, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
}

