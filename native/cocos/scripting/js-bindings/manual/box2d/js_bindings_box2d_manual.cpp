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
    ok &= JS_GetProperty(cx, jsobj, "x", &valx);
    ok &= JS_GetProperty(cx, jsobj, "y", &valy);
    JSB_PRECONDITION( ok, "Error obtaining %s properties", name);
    
    double x, y;
    ok &= JS::ToNumber(cx, valx, &x);
    ok &= JS::ToNumber(cx, valy, &y);
    JSB_PRECONDITION( ok, "Error converting value to numbers");
    
    v->x = x;
    v->y = y;
    
    return true;
}

bool jsval_to_b2Vec2( JSContext *cx, jsval vp, b2Vec2 *ret )
{
    JS::RootedObject jsobj(cx);
    JS::RootedValue jsv(cx, vp);
    bool ok = JS_ValueToObject(cx, jsv, &jsobj);
    JSB_PRECONDITION( ok, "Error converting value to object");
    JSB_PRECONDITION( jsobj, "Not a valid JS object");

    JS::RootedValue valx(cx);
    JS::RootedValue valy(cx);
    ok = true;
    ok &= JS_GetProperty(cx, jsobj, "x", &valx);
    ok &= JS_GetProperty(cx, jsobj, "y", &valy);
    JSB_PRECONDITION( ok, "Error obtaining point properties");

    double x = 0, y = 0;
    ok &= JS::ToNumber(cx, valx, &x);
    ok &= JS::ToNumber(cx, valy, &y);
    JSB_PRECONDITION( ok, "Error converting value to numbers");

    ret->x = x;
    ret->y = y;

    return true;
}

jsval b2Vec2_to_jsval(JSContext *cx, const b2Vec2& v)
{
    JS::RootedObject object(cx, JS_NewPlainObject(cx));
    if (!object)
        return JSVAL_VOID;

    if (!JS_DefineProperty(cx, object, "x", v.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) ||
        !JS_DefineProperty(cx, object, "y", v.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) )
        return JSVAL_VOID;

    return OBJECT_TO_JSVAL(object);
}



bool jsval_to_b2AABB( JSContext *cx, jsval vp, b2AABB *ret )
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

bool jsval_to_b2FixtureDef( JSContext *cx, jsval vp, b2FixtureDef *ret )
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
    ok &= JS_GetProperty(cx, jsobj, "restitution", &valrestitution);
    ok &= JS_GetProperty(cx, jsobj, "density", &valdensity);
    ok &= JS_GetProperty(cx, jsobj, "isSensor", &valisSensor);
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
    
    double friction = 0.2f, restitution = 0.0f, density = 0.0f;
    bool isSensor = false;
    uint16 categoryBits = 0x0001;
    uint16 maskBits = 0xFFFF;
    int16 groupIndex = 0;
    
    ok &= JS::ToNumber(cx, valfriction, &friction);
    ok &= JS::ToNumber(cx, valrestitution, &restitution);
    ok &= JS::ToNumber(cx, valdensity, &density);
    
    JSB_PRECONDITION( ok, "Error converting value to numbers");
    isSensor = valisSensor.toBoolean();
    categoryBits = valcategoryBits.toInt32();
    maskBits = valmaskBits.toInt32();
    groupIndex = valgroupIndex.toInt32();
    
    ret->filter.categoryBits = categoryBits;
    ret->filter.groupIndex = groupIndex;
    ret->filter.maskBits = maskBits;
    ret->friction = friction;
    ret->restitution = restitution;
    ret->density = density;
    ret->isSensor = isSensor;
    
    JS::RootedObject obj(cx, valShape.toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    ret->shape = (b2Shape *)(proxy ? proxy->ptr : nullptr);
    
    return true;
}

bool jsval_to_b2BodyDef( JSContext *cx, jsval vp, b2BodyDef *ret )
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
    
    ok &= JS_GetProperty(cx, jsobj, "angle", &valangle);
    ok &= JS_GetProperty(cx, jsobj, "angularVelocity", &valangularVelocity);
    ok &= JS_GetProperty(cx, jsobj, "linearDamping", &vallinearDamping);
    ok &= JS_GetProperty(cx, jsobj, "angularDamping", &valangularDamping);
    ok &= JS_GetProperty(cx, jsobj, "gravityScale", &valgravityScale);
    ok &= JS_GetProperty(cx, jsobj, "allowSleep", &valallowSleep);
    ok &= JS_GetProperty(cx, jsobj, "awake", &valawake);
    ok &= JS_GetProperty(cx, jsobj, "fixedRotation", &valfixedRotation);
    ok &= JS_GetProperty(cx, jsobj, "bullet", &valbullet);
    ok &= JS_GetProperty(cx, jsobj, "active", &valactive);
    ok &= JS_GetProperty(cx, jsobj, "type", &valtype);
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
    ok &= JS_GetProperty(cx, js_position_obj, "x", &valx);
    ok &= JS_GetProperty(cx, js_position_obj, "y", &valy);
    
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
    
    ok &= JS_GetProperty(cx, js_velocity_obj, "x", &valVelocityx);
    ok &= JS_GetProperty(cx, js_velocity_obj, "y", &valVelocityy);
    
    JSB_PRECONDITION( ok, "Error obtaining body def linearVelocity properties");
    
    double x, y, velocityx, velocityy, angle = 0.0f, angularVelocity = 0.0f, linearDamping = 0.0f, angularDamping = 0.0f, gravityScale = 1.0f;
    bool allowSleep = true, awake = true, fixedRotation = false, bullet = false, active = true;
    b2BodyType type = b2_staticBody;
    
    ok &= JS::ToNumber(cx, valx, &x);
    ok &= JS::ToNumber(cx, valy, &y);
    ok &= JS::ToNumber(cx, valVelocityx, &velocityx);
    ok &= JS::ToNumber(cx, valVelocityy, &velocityy);
    ok &= JS::ToNumber(cx, valangle, &angle);
    ok &= JS::ToNumber(cx, valangularVelocity, &angularVelocity);
    ok &= JS::ToNumber(cx, vallinearDamping, &linearDamping);
    ok &= JS::ToNumber(cx, valangularDamping, &angularDamping);
    ok &= JS::ToNumber(cx, valgravityScale, &gravityScale);
    JSB_PRECONDITION( ok, "Error converting value to numbers");
    allowSleep = valallowSleep.toBoolean();
    awake = valawake.toBoolean();
    fixedRotation = valfixedRotation.toBoolean();
    bullet = valbullet.toBoolean();
    active = valactive.toBoolean();
    type = (b2BodyType)valtype.toInt32();
    
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


bool jsval_to_b2JointDef( JSContext *cx, jsval vp, b2JointType type, b2JointDef *ret )
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
    ok &= JS_GetProperty(cx, jsobj, "collideConnected", &valcollideConnected);
    JSB_PRECONDITION( ok, "Error obtaining b2JointDef properties");
    
    js_proxy_t *proxy = jsb_get_js_proxy( JS::RootedObject(cx, valbodyA.toObjectOrNull()) );
    ret->bodyA = (b2Body *)(proxy ? proxy->ptr : nullptr);
    
    proxy = jsb_get_js_proxy( JS::RootedObject(cx, valbodyB.toObjectOrNull()) );
    ret->bodyB = (b2Body *)(proxy ? proxy->ptr : nullptr);
    
    ret->collideConnected = valcollideConnected.toBoolean();
    
    switch (type) {
        case e_distanceJoint:
        {
            b2DistanceJointDef* def = (b2DistanceJointDef*)ret;
            
            JS::RootedValue vallength(cx);
            JS::RootedValue valfrequencyHz(cx);
            JS::RootedValue valdampingRatio(cx);
            
            ok &= JS_GetProperty(cx, jsobj, "length", &vallength);
            ok &= JS_GetProperty(cx, jsobj, "frequencyHz", &valfrequencyHz);
            ok &= JS_GetProperty(cx, jsobj, "dampingRatio", &valdampingRatio);
            JSB_PRECONDITION( ok, "Error obtaining b2DistanceJointDef properties");
            
            double length, frequencyHz, dampingRatio;
            
            ok &= JS::ToNumber(cx, vallength, &length);
            ok &= JS::ToNumber(cx, valfrequencyHz, &frequencyHz);
            ok &= JS::ToNumber(cx, valdampingRatio, &dampingRatio);
            JSB_PRECONDITION( ok, "Error converting value to numbers");
            
            def->length = length;
            def->frequencyHz = frequencyHz;
            def->dampingRatio = dampingRatio;
            
            break;
        }
        case e_frictionJoint:
        {
            b2FrictionJointDef* def = (b2FrictionJointDef*)ret;
            
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorA", &def->localAnchorA);
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorB", &def->localAnchorB);
            
            JS::RootedValue valmaxForce(cx);
            JS::RootedValue valmaxTorque(cx);
            
            ok &= JS_GetProperty(cx, jsobj, "maxForce", &valmaxForce);
            ok &= JS_GetProperty(cx, jsobj, "maxTorque", &valmaxTorque);
            JSB_PRECONDITION( ok, "Error obtaining b2FrictionJointDef properties");
            
            double maxForce, maxTorque;
            ok &= JS::ToNumber(cx, valmaxForce, &maxForce);
            ok &= JS::ToNumber(cx, valmaxTorque, &maxTorque);
            JSB_PRECONDITION( ok, "Error converting value to numbers");
            
            def->maxForce = maxForce;
            def->maxTorque = maxTorque;
            
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
            ok &= JS_GetProperty(cx, jsobj, "ratio", &valratio);
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");
            
            JS::RootedObject joint1obj(cx, valjoint1.toObjectOrNull());
            proxy = jsb_get_js_proxy(joint1obj);
            def->joint1 = (b2Joint *)(proxy ? proxy->ptr : nullptr);
            
            JS::RootedObject joint2obj(cx, valjoint2.toObjectOrNull());
            proxy = jsb_get_js_proxy(joint2obj);
            def->joint2 = (b2Joint *)(proxy ? proxy->ptr : nullptr);
            
            double ratio;
            ok &= JS::ToNumber(cx, valratio, &ratio);
            JSB_PRECONDITION( ok, "Error converting value to numbers");
            
            def->ratio = ratio;
            
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
            
            ok &= JS_GetProperty(cx, jsobj, "angularOffset", &valangularOffset);
            ok &= JS_GetProperty(cx, jsobj, "maxForce", &valmaxForce);
            ok &= JS_GetProperty(cx, jsobj, "maxTorque", &valmaxTorque);
            ok &= JS_GetProperty(cx, jsobj, "correctionFactor", &valcorrectionFactor);
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");
            
            double angularOffset, maxForce, maxTorque, correctionFactor;
            ok &= JS::ToNumber(cx, valangularOffset, &angularOffset);
            ok &= JS::ToNumber(cx, valmaxForce, &maxForce);
            ok &= JS::ToNumber(cx, valmaxTorque, &maxTorque);
            ok &= JS::ToNumber(cx, valcorrectionFactor, &correctionFactor);
            JSB_PRECONDITION( ok, "Error converting value to numbers");
            
            def->angularOffset = angularOffset;
            def->maxForce = maxForce;
            def->maxTorque = maxTorque;
            def->correctionFactor = correctionFactor;
            
            break;
        }
        case e_mouseJoint:
        {
            b2MouseJointDef* def = (b2MouseJointDef*)ret;
            
            ok &= jsval_get_b2Vec2(cx, jsobj, "target", &def->target);
            
            JS::RootedValue valmaxForce(cx);
            JS::RootedValue valfrequencyHz(cx);
            JS::RootedValue valdampingRatio(cx);
            
            ok &= JS_GetProperty(cx, jsobj, "frequencyHz", &valfrequencyHz);
            ok &= JS_GetProperty(cx, jsobj, "maxForce", &valmaxForce);
            ok &= JS_GetProperty(cx, jsobj, "dampingRatio", &valdampingRatio);
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");
            
            double frequencyHz, maxForce, dampingRatio;
            ok &= JS::ToNumber(cx, valfrequencyHz, &frequencyHz);
            ok &= JS::ToNumber(cx, valmaxForce, &maxForce);
            ok &= JS::ToNumber(cx, valdampingRatio, &dampingRatio);
            JSB_PRECONDITION( ok, "Error converting value to numbers");
            
            def->frequencyHz = frequencyHz;
            def->maxForce = maxForce;
            def->dampingRatio = dampingRatio;
            
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

            ok &= JS_GetProperty(cx, jsobj, "lowerTranslation", &vallowerTranslation);
            ok &= JS_GetProperty(cx, jsobj, "referenceAngle", &valreferenceAngle);
            ok &= JS_GetProperty(cx, jsobj, "upperTranslation", &valupperTranslation);
            ok &= JS_GetProperty(cx, jsobj, "maxMotorForce", &valmaxMotorForce);
            ok &= JS_GetProperty(cx, jsobj, "motorSpeed", &valmotorSpeed);
            ok &= JS_GetProperty(cx, jsobj, "enableLimit", &valenableLimit);
            ok &= JS_GetProperty(cx, jsobj, "enableMotor", &valenableMotor);
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");
            
            double lowerTranslation, referenceAngle, upperTranslation, maxMotorForce, motorSpeed;
            bool enableLimit, enableMotor;

            ok &= JS::ToNumber(cx, vallowerTranslation, &lowerTranslation);
            ok &= JS::ToNumber(cx, valreferenceAngle, &referenceAngle);
            ok &= JS::ToNumber(cx, valupperTranslation, &upperTranslation);
            ok &= JS::ToNumber(cx, valmaxMotorForce, &maxMotorForce);
            ok &= JS::ToNumber(cx, valmotorSpeed, &motorSpeed);
            JSB_PRECONDITION( ok, "Error converting value to numbers");
            enableLimit = valenableLimit.toBoolean();
            enableMotor = valenableMotor.toBoolean();

            def->lowerTranslation = lowerTranslation;
            def->referenceAngle = referenceAngle;
            def->upperTranslation = upperTranslation;
            def->maxMotorForce = maxMotorForce;
            def->motorSpeed = motorSpeed;
            def->enableLimit = enableLimit;
            def->enableMotor = enableMotor;

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
            JS::RootedValue valcollideConnected(cx);

            ok &= JS_GetProperty(cx, jsobj, "lengthB", &vallengthB);
            ok &= JS_GetProperty(cx, jsobj, "lengthA", &vallengthA);
            ok &= JS_GetProperty(cx, jsobj, "ratio", &valratio);
            ok &= JS_GetProperty(cx, jsobj, "collideConnected", &valcollideConnected);
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");

            double lengthB, lengthA, ratio;
            bool collideConnected;
            ok &= JS::ToNumber(cx, vallengthB, &lengthB);
            ok &= JS::ToNumber(cx, vallengthA, &lengthA);
            ok &= JS::ToNumber(cx, valratio, &ratio);
            JSB_PRECONDITION( ok, "Error converting value to numbers");
            collideConnected = valcollideConnected.toBoolean();

            def->lengthB = lengthB;
            def->lengthA = lengthA;
            def->ratio = ratio;
            def->collideConnected = collideConnected;

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

            ok &= JS_GetProperty(cx, jsobj, "lowerAngle", &vallowerAngle);
            ok &= JS_GetProperty(cx, jsobj, "referenceAngle", &valreferenceAngle);
            ok &= JS_GetProperty(cx, jsobj, "upperAngle", &valupperAngle);
            ok &= JS_GetProperty(cx, jsobj, "maxMotorTorque", &valmaxMotorTorque);
            ok &= JS_GetProperty(cx, jsobj, "motorSpeed", &valmotorSpeed);
            ok &= JS_GetProperty(cx, jsobj, "enableLimit", &valenableLimit);
            ok &= JS_GetProperty(cx, jsobj, "enableMotor", &valenableMotor);
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");
            
            double lowerAngle, referenceAngle, upperAngle, maxMotorTorque, motorSpeed;
            bool enableLimit, enableMotor;

            ok &= JS::ToNumber(cx, vallowerAngle, &lowerAngle);
            ok &= JS::ToNumber(cx, valreferenceAngle, &referenceAngle);
            ok &= JS::ToNumber(cx, valupperAngle, &upperAngle);
            ok &= JS::ToNumber(cx, valmaxMotorTorque, &maxMotorTorque);
            ok &= JS::ToNumber(cx, valmotorSpeed, &motorSpeed);
            JSB_PRECONDITION( ok, "Error converting value to numbers");
            enableLimit = valenableLimit.toBoolean();
            enableMotor = valenableMotor.toBoolean();

            def->lowerAngle = lowerAngle;
            def->referenceAngle = referenceAngle;
            def->upperAngle = upperAngle;
            def->maxMotorTorque = maxMotorTorque;
            def->motorSpeed = motorSpeed;
            def->enableLimit = enableLimit;
            def->enableMotor = enableMotor;
            
            break;
        }
        case e_ropeJoint:
        {
            b2RopeJointDef* def = (b2RopeJointDef*)ret;
            
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorA", &def->localAnchorA);
            ok &= jsval_get_b2Vec2(cx, jsobj, "localAnchorB", &def->localAnchorB);

            JS::RootedValue valmaxLength(cx);

            ok &= JS_GetProperty(cx, jsobj, "maxLength", &valmaxLength);
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");            

            double maxLength;
            ok &= JS::ToNumber(cx, valmaxLength, &maxLength);
            JSB_PRECONDITION( ok, "Error converting value to numbers");

            def->maxLength = maxLength;

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
            
            ok &= JS_GetProperty(cx, jsobj, "referenceAngle", &valreferenceAngle);
            ok &= JS_GetProperty(cx, jsobj, "frequencyHz", &valfrequencyHz);
            ok &= JS_GetProperty(cx, jsobj, "dampingRatio", &valdampingRatio);
            JSB_PRECONDITION( ok, "Error obtaining b2DistanceJointDef properties");
            
            double referenceAngle, frequencyHz, dampingRatio;
            
            ok &= JS::ToNumber(cx, valreferenceAngle, &referenceAngle);
            ok &= JS::ToNumber(cx, valfrequencyHz, &frequencyHz);
            ok &= JS::ToNumber(cx, valdampingRatio, &dampingRatio);
            JSB_PRECONDITION( ok, "Error converting value to numbers");
            
            def->referenceAngle = referenceAngle;
            def->frequencyHz = frequencyHz;
            def->dampingRatio = dampingRatio;

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

            ok &= JS_GetProperty(cx, jsobj, "frequencyHz", &valfrequencyHz);
            ok &= JS_GetProperty(cx, jsobj, "maxMotorTorque", &valmaxMotorTorque);
            ok &= JS_GetProperty(cx, jsobj, "dampingRatio", &valdampingRatio);
            ok &= JS_GetProperty(cx, jsobj, "motorSpeed", &valmotorSpeed);
            ok &= JS_GetProperty(cx, jsobj, "enableMotor", &valenableMotor);
            JSB_PRECONDITION( ok, "Error obtaining b2GearJointDef properties");
            
            double frequencyHz, maxMotorTorque, dampingRatio, maxMotorForce, motorSpeed;
            bool enableMotor;

            ok &= JS::ToNumber(cx, valfrequencyHz, &frequencyHz);
            ok &= JS::ToNumber(cx, valmaxMotorTorque, &maxMotorTorque);
            ok &= JS::ToNumber(cx, valdampingRatio, &dampingRatio);
            ok &= JS::ToNumber(cx, valmotorSpeed, &motorSpeed);
            JSB_PRECONDITION( ok, "Error converting value to numbers");
            enableMotor = valenableMotor.toBoolean();

            def->frequencyHz = frequencyHz;
            def->maxMotorTorque = maxMotorTorque;
            def->dampingRatio = dampingRatio;
            def->motorSpeed = motorSpeed;
            def->enableMotor = enableMotor;            

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
    JSB_PRECONDITION3( ok, cx, false, "Error converting value to object");
    JSB_PRECONDITION3( jsobj && JS_IsArrayObject( cx, jsobj), cx, false, "Object must be an array");
    
    for( uint32_t i=0; i<numPoints; i++ ) {
        JS::RootedValue valarg(cx);
        JS_GetElement(cx, jsobj, i, &valarg);
        
        ok = jsval_to_b2Vec2(cx, valarg, &points[i]);
        JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");
    }
    
    return true;
}


jsval b2Manifold_to_jsval(JSContext* cx, const b2Manifold* v)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    if (!tmp) return JSVAL_NULL;
    
    bool ok = JS_DefineProperty(cx, tmp, "localPoint", JS::RootedValue(cx, b2Vec2_to_jsval(cx, v->localPoint)), JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "localNormal", JS::RootedValue(cx, b2Vec2_to_jsval(cx, v->localNormal)), JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "pointCount", v->pointCount, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "type", v->type, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, 0));
    
    for (int i = 0; i < v->pointCount; i++)
    {
        const b2ManifoldPoint& p = v->points[i];
        
        JS::RootedObject arrElement(cx, JS_NewPlainObject(cx));
        
        ok &= JS_DefineProperty(cx, arrElement, "normalImpulse", p.normalImpulse, JSPROP_ENUMERATE | JSPROP_PERMANENT);
        ok &= JS_DefineProperty(cx, arrElement, "tangentImpulse", p.tangentImpulse, JSPROP_ENUMERATE | JSPROP_PERMANENT);
        ok &= JS_DefineProperty(cx, arrElement, "localPoint", JS::RootedValue(cx, b2Vec2_to_jsval(cx, p.localPoint)), JSPROP_ENUMERATE | JSPROP_PERMANENT);
        
        if (!JS_SetElement(cx, jsretArr, i, arrElement)) {
            break;
        }
    }
    
    ok &= JS_DefineProperty(cx, tmp, "points", jsretArr, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    if (ok) {
        return OBJECT_TO_JSVAL(tmp);
    }
    return JSVAL_NULL;
}

jsval b2ContactImpulse_to_jsval(JSContext* cx, const b2ContactImpulse* v)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    if (!tmp) return JSVAL_NULL;
    
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
        return OBJECT_TO_JSVAL(tmp);
    }
    return JSVAL_NULL;
}

jsval array_of_b2Fixture_to_jsval(JSContext* cx, const std::vector<b2Fixture*>& fixtures)
{
    JS::RootedObject jsret(cx, JS_NewArrayObject(cx, 0));
    
    auto count = fixtures.size();
    for (int i = 0; i < count; i++)
    {
        b2Fixture* f = fixtures[i];
        
        JS::RootedValue arrElement(cx);
        arrElement = OBJECT_TO_JSVAL(js_get_or_create_jsobject<b2Fixture>(cx, f));
        
        if (!JS_SetElement(cx, jsret, i, arrElement)) {
            break;
        }
    }
    
    return OBJECT_TO_JSVAL(jsret);
}

jsval array_of_b2Vec2_to_jsval(JSContext* cx, const std::vector<b2Vec2>& vs)
{
    JS::RootedObject jsret(cx, JS_NewArrayObject(cx, 0));
    
    auto count = vs.size();
    for (int i = 0; i < count; i++)
    {
        const b2Vec2& v = vs[i];
        
        JS::RootedValue arrElement(cx);
        arrElement = b2Vec2_to_jsval(cx, v);
        
        if (!JS_SetElement(cx, jsret, i, arrElement)) {
            break;
        }
    }
    
    return OBJECT_TO_JSVAL(jsret);
}

jsval b2AABB_to_jsval(JSContext* cx, const b2AABB& v)
{
    JS::RootedObject object(cx, JS_NewPlainObject(cx));
    if (!object) {
        return JSVAL_VOID;
    }
    
    JS::RootedObject lowerBound(cx, JS_NewPlainObject(cx));
    if (!JS_DefineProperty(cx, lowerBound, "x", v.lowerBound.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) ||
        !JS_DefineProperty(cx, lowerBound, "y", v.lowerBound.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) ) {
        return JSVAL_VOID;
    }
    
    JS::RootedObject upperBound(cx, JS_NewPlainObject(cx));
    if (!JS_DefineProperty(cx, upperBound, "x", v.upperBound.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) ||
        !JS_DefineProperty(cx, upperBound, "y", v.upperBound.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) ) {
        return JSVAL_VOID;
    }
    
    if (!JS_DefineProperty(cx, object, "lowerBound", lowerBound, JSPROP_ENUMERATE | JSPROP_PERMANENT) ||
        !JS_DefineProperty(cx, object, "upperBound", upperBound, JSPROP_ENUMERATE | JSPROP_PERMANENT) ) {
        return JSVAL_VOID;
    }
    
    return OBJECT_TO_JSVAL(object);
}


extern JSClass  *jsb_b2Shape_class;
extern JSObject *jsb_b2Shape_prototype;

bool js_box2dclasses_b2Shape_GetRadius(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    b2Shape* cobj = (b2Shape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Shape_GetRadius : Invalid Native Object");
    if (argc == 0) {
        float32 ret = cobj->m_radius;
        JS::RootedValue jsret(cx);
        jsret = long_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportError(cx, "js_box2dclasses_b2Shape_GetRadius : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2Shape_SetRadius(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    b2Shape* cobj = (b2Shape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Shape_SetRadius : Invalid Native Object");
    if (argc == 1) {
        double arg0;
        ok &= JS::ToNumber(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Shape_SetRadius : Error processing arguments");
        cobj->m_radius = arg0;
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportError(cx, "js_box2dclasses_b2Shape_SetRadius : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}


extern JSClass  *jsb_b2CircleShape_class;
extern JSObject *jsb_b2CircleShape_prototype;

bool js_box2dclasses_b2CircleShape_GetPosition(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    b2CircleShape* cobj = (b2CircleShape *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2CircleShape_GetPosition : Invalid Native Object");
    if (argc == 0) {
        b2Vec2& ret = cobj->m_p;
        JS::RootedValue jsret(cx);
        jsret = b2Vec2_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportError(cx, "js_box2dclasses_b2CircleShape_GetPosition : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_box2dclasses_b2CircleShape_SetPosition(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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
    
    JS_ReportError(cx, "js_box2dclasses_b2Shape_SetRadius : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_box2dclasses_b2World_CreateJoint(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    b2World* cobj = (b2World *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2World_CreateJoint : Invalid Native Object");
    if (argc == 1) {
        const b2JointDef* arg0 = nullptr;
        b2JointDef* tmpDef = nullptr;
        b2JointType type = e_unknownJoint;
        {
            JS::RootedObject jsobj(cx);
            JS::RootedValue jsv(cx, args.get(0));
            bool ok = JS_ValueToObject(cx, jsv, &jsobj);
            JSB_PRECONDITION( ok, "Error converting value to object");
            JSB_PRECONDITION( jsobj, "Not a valid JS object");
            
            JS::RootedValue valtype(cx);
            
            ok = true;
            ok &= JS_GetProperty(cx, jsobj, "type", &valtype);
            JSB_PRECONDITION( ok, "Error obtaining type properties");
            
            type = (b2JointType)valtype.toInt32();
            
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
            jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<b2Joint>(cx, (b2Joint*)ret));
        } else {
            jsret = JSVAL_NULL;
        };
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportError(cx, "js_box2dclasses_b2World_CreateJoint : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_box2dclasses_b2World_CreateBody(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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
            jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<b2Body>(cx, (b2Body*)ret));
        } else {
            jsret = JSVAL_NULL;
        };
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportError(cx, "js_box2dclasses_b2World_CreateBody : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}


bool js_box2dclasses_b2Body_CreateFixture(JSContext *cx, uint32_t argc, jsval *vp)
{
    b2Body* cobj = nullptr;
    
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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
                jsProxy = jsb_get_js_proxy(tmpObj);
                arg0 = (const b2Shape*)(jsProxy ? jsProxy->ptr : NULL);
                JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
            } while (0);
            if (!ok) { ok = true; break; }
            double arg1 = 0;
            ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
            if (!ok) { ok = true; break; }
            b2Fixture* ret = cobj->CreateFixture(arg0, arg1);
            jsval jsret = JSVAL_NULL;
            if (ret) {
                // box2d will reuse cached memory, need first remove old proxy when create new jsobject
                auto retProxy = jsb_get_native_proxy(ret);
                if (retProxy) {
                    jsb_remove_proxy(retProxy);
                }
                jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret));
            } else {
                jsret = JSVAL_NULL;
            };
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
            jsval jsret = JSVAL_NULL;
            if (ret) {
                jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<b2Fixture>(cx, (b2Fixture*)ret));
            } else {
                jsret = JSVAL_NULL;
            };
            args.rval().set(jsret);
            return true;
        }
    } while(0);
    
    JS_ReportError(cx, "js_box2dclasses_b2Body_CreateFixture : wrong number of arguments");
    return false;
}

bool js_box2dclasses_b2Body_GetJointList(JSContext *cx, uint32_t argc, jsval *vp)
{
    b2Body* cobj = nullptr;
    
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cobj = (b2Body *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetJointList : Invalid Native Object");
    do {
        if (argc == 0) {
            jsval jsret = JSVAL_NULL;
            
            b2JointEdge* list = cobj->GetJointList();
            do
            {
                if (!list) {
                    break;
                }
                
                JS::RootedObject array(cx, JS_NewArrayObject(cx, 0));
                int i = 0;
                JS::RootedValue item(cx);
                
                item = OBJECT_TO_JSVAL(js_get_or_create_jsobject<b2Joint>(cx, list->joint));
                if (!JS_SetElement(cx, array, i++, item)) {
                    break;
                }
                
                b2JointEdge* prev = list->prev;
                while (prev) {
                    item = OBJECT_TO_JSVAL(js_get_or_create_jsobject<b2Joint>(cx, prev->joint));
                    if (!JS_SetElement(cx, array, i++, item)) {
                        break;
                    }
                    
                    prev = prev->prev;
                }
                
                b2JointEdge* next = list->next;
                while (next) {
                    item = OBJECT_TO_JSVAL(js_get_or_create_jsobject<b2Joint>(cx, next->joint));
                    if (!JS_SetElement(cx, array, i++, item)) {
                        break;
                    }
                    
                    next = next->next;
                }
                
                jsret = OBJECT_TO_JSVAL(array);
            }
            while(0);
            
            args.rval().set( jsret );
            return true;
        }
    } while(0);
    
    JS_ReportError(cx, "js_box2dclasses_b2Body_GetJointList : wrong number of arguments");
    return false;
}

bool js_box2dclasses_b2PolygonShape_Set(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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
    
    JS_ReportError(cx, "js_box2dclasses_b2PolygonShape_Set : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
bool js_box2dclasses_b2PolygonShape_SetAsBox(JSContext *cx, uint32_t argc, jsval *vp)
{
    b2PolygonShape* cobj = nullptr;
    
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cobj = (b2PolygonShape *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2PolygonShape_SetAsBox : Invalid Native Object");
    do {
        bool ok = true;
        if (argc == 4) {
            double arg0 = 0;
            ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
            if (!ok) { ok = true; break; }
            double arg1 = 0;
            ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
            if (!ok) { ok = true; break; }
            b2Vec2 arg2;
            ok &= jsval_to_b2Vec2(cx, args.get(2), &arg2);
            if (!ok) { ok = true; break; }
            double arg3 = 0;
            ok &= JS::ToNumber( cx, args.get(3), &arg3) && !std::isnan(arg3);
            if (!ok) { ok = true; break; }
            cobj->SetAsBox(arg0, arg1, arg2, arg3);
            args.rval().setUndefined();
            return true;
        }
    } while(0);
    
    do {
        bool ok = true;
        if (argc == 2) {
            double arg0 = 0;
            ok &= JS::ToNumber( cx, args.get(0), &arg0) && !std::isnan(arg0);
            if (!ok) { ok = true; break; }
            double arg1 = 0;
            ok &= JS::ToNumber( cx, args.get(1), &arg1) && !std::isnan(arg1);
            if (!ok) { ok = true; break; }
            cobj->SetAsBox(arg0, arg1);
            args.rval().setUndefined();
            return true;
        }
    } while(0);
    
    JS_ReportError(cx, "js_box2dclasses_b2PolygonShape_SetAsBox : wrong number of arguments");
    return false;
}

bool js_box2dclasses_b2Body_SetUserData(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_SetUserData : Invalid Native Object");
    if (argc == 1) {
        cocos2d::Node* arg0 = nullptr;
        do {
            if (args.get(0).isNull()) { arg0 = nullptr; break; }
            if (!args.get(0).isObject()) { ok = false; break; }
            js_proxy_t *jsProxy;
            JS::RootedObject tmpObj(cx, args.get(0).toObjectOrNull());
            jsProxy = jsb_get_js_proxy(tmpObj);
            arg0 = (cocos2d::Node*)(jsProxy ? jsProxy->ptr : NULL);
            JSB_PRECONDITION2( arg0, cx, false, "Invalid Native Object");
        } while (0);
        JSB_PRECONDITION2(ok, cx, false, "js_box2dclasses_b2Body_SetUserData : Error processing arguments");
        cobj->SetUserData(arg0);
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportError(cx, "js_box2dclasses_b2Body_SetUserData : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool js_box2dclasses_b2Body_GetUserData(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    b2Body* cobj = (b2Body *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_box2dclasses_b2Body_GetUserData : Invalid Native Object");
    if (argc == 0) {
        void* ret = cobj->GetUserData();
        JS::RootedValue jsret(cx);
        if (ret) {
            jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<cocos2d::Node>(cx, (cocos2d::Node*)ret));
        } else {
            jsret = JSVAL_NULL;
        };
        args.rval().set(jsret);
        return true;
    }
    
    JS_ReportError(cx, "js_box2dclasses_b2Body_GetUserData : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}

bool js_box2dclasses_b2ChainShape_CreateChain(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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
        
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportError(cx, "js_box2dclasses_b2ChainShape_CreateChain : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

bool js_box2dclasses_b2ChainShape_CreateLoop(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
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
        args.rval().setUndefined();
        return true;
    }
    
    JS_ReportError(cx, "js_box2dclasses_b2ChainShape_CreateLoop : wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}

void register_all_box2dclasses_manual(JSContext* cx, JS::HandleObject obj) {
    JS::RootedObject tmpObj(cx);
    
    tmpObj.set(jsb_b2Shape_prototype);
    JS_DefineFunction(cx, tmpObj, "SetRadius", js_box2dclasses_b2Shape_SetRadius, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "GetRadius", js_box2dclasses_b2Shape_GetRadius, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    tmpObj.set(jsb_b2CircleShape_prototype);
    JS_DefineFunction(cx, tmpObj, "SetPosition", js_box2dclasses_b2CircleShape_SetPosition, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "GetPosition", js_box2dclasses_b2CircleShape_GetPosition, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    tmpObj.set(jsb_b2World_prototype);
    JS_DefineFunction(cx, tmpObj, "CreateBody", js_box2dclasses_b2World_CreateBody, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "CreateJoint", js_box2dclasses_b2World_CreateJoint, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    tmpObj.set(jsb_b2Body_prototype);
    JS_DefineFunction(cx, tmpObj, "CreateFixture", js_box2dclasses_b2Body_CreateFixture, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "SetUserData", js_box2dclasses_b2Body_SetUserData, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "GetUserData", js_box2dclasses_b2Body_GetUserData, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "GetJointList", js_box2dclasses_b2Body_GetJointList, 0, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    tmpObj.set(jsb_b2PolygonShape_prototype);
    JS_DefineFunction(cx, tmpObj, "Set", js_box2dclasses_b2PolygonShape_Set, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "SetAsBox", js_box2dclasses_b2PolygonShape_SetAsBox, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    tmpObj.set(jsb_b2ChainShape_prototype);
    JS_DefineFunction(cx, tmpObj, "CreateLoop", js_box2dclasses_b2ChainShape_CreateLoop, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, tmpObj, "CreateChain", js_box2dclasses_b2ChainShape_CreateChain, 2, JSPROP_ENUMERATE | JSPROP_PERMANENT);
}

