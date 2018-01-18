#include "jsb_box2d_manual.hpp"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/manual/jsb_helper.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_box2d_auto.hpp"

#include "cocos/editor-support/creator/physics/CCPhysicsContactListener.h"

bool seval_to_b2BodyDef(const se::Value& v, b2BodyDef* ret)
{
    static b2BodyDef ZERO;
    assert(v.isObject());
    assert(ret != nullptr);

    se::Object* obj = v.toObject();

    bool ok = false;
    se::Value tmp, tmp2;
    ok = obj->getProperty("angle", &tmp);
    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
    ret->angle = tmp.toFloat();

    ok = obj->getProperty("angularVelocity", &tmp);
    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
    ret->angularVelocity = tmp.toFloat();

    ok = obj->getProperty("linearDamping", &tmp);
    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
    ret->linearDamping = tmp.toFloat();

    ok = obj->getProperty("angularDamping", &tmp);
    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
    ret->angularDamping = tmp.toFloat();

    ok = obj->getProperty("gravityScale", &tmp);
    if (ok && tmp.isNumber())
        ret->gravityScale = tmp.toFloat();
    else
        ret->gravityScale = 1.0f;

    ok = obj->getProperty("allowSleep", &tmp);
    if (ok && tmp.isBoolean())
        ret->allowSleep = tmp.toBoolean();
    else
        ret->allowSleep = true;

    ok = obj->getProperty("awake", &tmp);
    if (ok && tmp.isBoolean())
        ret->awake = tmp.toBoolean();
    else
        ret->awake = true;

    ok = obj->getProperty("fixedRotation", &tmp);
    if (ok && tmp.isBoolean())
        ret->fixedRotation = tmp.toBoolean();
    else
        ret->fixedRotation = true;

    ok = obj->getProperty("bullet", &tmp);
    SE_PRECONDITION3(ok && tmp.isBoolean(), false, *ret = ZERO);
    ret->bullet = tmp.toBoolean();

    ok = obj->getProperty("active", &tmp);
    if (ok && tmp.isBoolean())
        ret->active = tmp.toBoolean();
    else
        ret->active = true;

    ok = obj->getProperty("type", &tmp);
    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
    ret->type = (b2BodyType)tmp.toInt32();

    // position
    ok = obj->getProperty("position", &tmp);
    SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);

    ok = tmp.toObject()->getProperty("x", &tmp2);
    SE_PRECONDITION3(ok && tmp2.isNumber(), false, *ret = ZERO);
    ret->position.x = tmp2.toFloat();

    ok = tmp.toObject()->getProperty("y", &tmp2);
    SE_PRECONDITION3(ok && tmp2.isNumber(), false, *ret = ZERO);
    ret->position.y = tmp2.toFloat();

    // linearVelocity
    ok = obj->getProperty("linearVelocity", &tmp);
    SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);

    ok = tmp.toObject()->getProperty("x", &tmp2);
    SE_PRECONDITION3(ok && tmp2.isNumber(), false, *ret = ZERO);
    ret->linearVelocity.x = tmp2.toFloat();

    ok = tmp.toObject()->getProperty("y", &tmp2);
    SE_PRECONDITION3(ok && tmp2.isNumber(), false, *ret = ZERO);
    ret->linearVelocity.y = tmp2.toFloat();

    return true;
}

bool seval_to_b2JointDef(const se::Value& v, b2JointType type, b2JointDef* ret)
{
    static b2JointDef ZERO;
    assert(v.isObject());
    assert(ret != nullptr);

    se::Object* obj = v.toObject();

    bool ok = false;
    se::Value tmp;
    ok = obj->getProperty("bodyA", &tmp);
    SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
    ok = seval_to_native_ptr(tmp, &ret->bodyA);
    SE_PRECONDITION3(ok, false, *ret = ZERO);

    ok = obj->getProperty("bodyB", &tmp);
    SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
    ok = seval_to_native_ptr(tmp, &ret->bodyB);
    SE_PRECONDITION3(ok, false, *ret = ZERO);

    ok = obj->getProperty("collideConnected", &tmp);
    SE_PRECONDITION3(ok && tmp.isBoolean(), false, *ret = ZERO);
    ret->collideConnected = tmp.toBoolean();

    switch (type) {
        case e_distanceJoint:
        {
            b2DistanceJointDef* def = (b2DistanceJointDef*)ret;

            ok = obj->getProperty("length", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->length = tmp.toFloat();

            ok = obj->getProperty("frequencyHz", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->frequencyHz = tmp.toFloat();

            ok = obj->getProperty("dampingRatio", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->dampingRatio = tmp.toFloat();
            break;
        }
        case e_frictionJoint:
        {
            b2FrictionJointDef* def = (b2FrictionJointDef*)ret;

            ok = obj->getProperty("localAnchorA", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorA);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("localAnchorB", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorB);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("maxForce", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->maxForce = tmp.toFloat();

            ok = obj->getProperty("maxTorque", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->maxTorque = tmp.toFloat();
            break;
        }
        case e_gearJoint:
        {
            b2GearJointDef* def = (b2GearJointDef*)ret;

            ok = obj->getProperty("valjoint1", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_native_ptr(tmp, &def->joint1);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("valjoint2", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_native_ptr(tmp, &def->joint2);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("ratio", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->ratio = tmp.toFloat();
            break;
        }
        case e_motorJoint:
        {
            b2MotorJointDef* def = (b2MotorJointDef*)ret;

            ok = obj->getProperty("linearOffset", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->linearOffset);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("angularOffset", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->angularOffset = tmp.toFloat();

            ok = obj->getProperty("maxForce", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->maxForce = tmp.toFloat();

            ok = obj->getProperty("maxTorque", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->maxTorque = tmp.toFloat();

            ok = obj->getProperty("correctionFactor", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->correctionFactor = tmp.toFloat();
            break;
        }
        case e_mouseJoint:
        {
            b2MouseJointDef* def = (b2MouseJointDef*)ret;

            ok = obj->getProperty("target", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->target);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("frequencyHz", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->frequencyHz = tmp.toFloat();

            ok = obj->getProperty("maxForce", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->maxForce = tmp.toFloat();

            ok = obj->getProperty("dampingRatio", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->dampingRatio = tmp.toFloat();
            break;
        }
        case e_prismaticJoint:
        {
            b2PrismaticJointDef* def = (b2PrismaticJointDef*)ret;

            ok = obj->getProperty("localAnchorA", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorA);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("localAnchorB", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorB);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("localAxisA", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAxisA);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("lowerTranslation", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->lowerTranslation = tmp.toFloat();

            ok = obj->getProperty("referenceAngle", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->referenceAngle = tmp.toFloat();

            ok = obj->getProperty("upperTranslation", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->upperTranslation = tmp.toFloat();

            ok = obj->getProperty("maxMotorForce", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->maxMotorForce = tmp.toFloat();

            ok = obj->getProperty("motorSpeed", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->motorSpeed = tmp.toFloat();

            ok = obj->getProperty("enableLimit", &tmp);
            SE_PRECONDITION3(ok && tmp.isBoolean(), false, *ret = ZERO);
            def->enableLimit = tmp.toBoolean();

            ok = obj->getProperty("enableMotor", &tmp);
            SE_PRECONDITION3(ok && tmp.isBoolean(), false, *ret = ZERO);
            def->enableMotor = tmp.toBoolean();
            break;
        }
        case e_pulleyJoint:
        {
            b2PulleyJointDef* def = (b2PulleyJointDef*)ret;

            ok = obj->getProperty("localAnchorA", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorA);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("localAnchorB", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorB);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("groundAnchorA", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->groundAnchorA);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("groundAnchorB", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->groundAnchorB);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("lengthB", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->lengthB = tmp.toFloat();

            ok = obj->getProperty("lengthA", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->lengthA = tmp.toFloat();

            ok = obj->getProperty("ratio", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->ratio = tmp.toFloat();

            ok = obj->getProperty("collideConnected", &tmp);
            SE_PRECONDITION3(ok && tmp.isBoolean(), false, *ret = ZERO);
            def->collideConnected = tmp.toBoolean();
            break;
        }
        case e_revoluteJoint:
        {
            b2RevoluteJointDef* def = (b2RevoluteJointDef*)ret;

            ok = obj->getProperty("localAnchorA", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorA);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("localAnchorB", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorB);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("lowerAngle", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->lowerAngle = tmp.toFloat();

            ok = obj->getProperty("referenceAngle", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->referenceAngle = tmp.toFloat();

            ok = obj->getProperty("upperAngle", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->upperAngle = tmp.toFloat();

            ok = obj->getProperty("maxMotorTorque", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->maxMotorTorque = tmp.toFloat();

            ok = obj->getProperty("motorSpeed", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->motorSpeed = tmp.toFloat();

            ok = obj->getProperty("enableLimit", &tmp);
            SE_PRECONDITION3(ok && tmp.isBoolean(), false, *ret = ZERO);
            def->enableLimit = tmp.toBoolean();

            ok = obj->getProperty("enableMotor", &tmp);
            SE_PRECONDITION3(ok && tmp.isBoolean(), false, *ret = ZERO);
            def->enableMotor = tmp.toBoolean();
            break;
        }
        case e_ropeJoint:
        {
            b2RopeJointDef* def = (b2RopeJointDef*)ret;

            ok = obj->getProperty("localAnchorA", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorA);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("localAnchorB", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorB);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("maxLength", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->maxLength = tmp.toFloat();
            break;
        }
        case e_weldJoint:
        {
            b2WeldJointDef* def = (b2WeldJointDef*)ret;

            ok = obj->getProperty("localAnchorA", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorA);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("localAnchorB", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorB);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("referenceAngle", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->referenceAngle = tmp.toFloat();

            ok = obj->getProperty("frequencyHz", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->frequencyHz = tmp.toFloat();

            ok = obj->getProperty("dampingRatio", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->dampingRatio = tmp.toFloat();
            break;
        }
        case e_wheelJoint:
        {
            b2WheelJointDef* def = (b2WheelJointDef*)ret;

            ok = obj->getProperty("localAnchorA", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorA);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("localAnchorB", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAnchorB);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("localAxisA", &tmp);
            SE_PRECONDITION3(ok && tmp.isObject(), false, *ret = ZERO);
            ok = seval_to_b2Vec2(tmp, &def->localAxisA);
            SE_PRECONDITION3(ok, false, *ret = ZERO);

            ok = obj->getProperty("frequencyHz", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->frequencyHz = tmp.toFloat();

            ok = obj->getProperty("maxMotorTorque", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->maxMotorTorque = tmp.toFloat();

            ok = obj->getProperty("dampingRatio", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->dampingRatio = tmp.toFloat();

            ok = obj->getProperty("motorSpeed", &tmp);
            SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
            def->motorSpeed = tmp.toFloat();

            ok = obj->getProperty("enableMotor", &tmp);
            SE_PRECONDITION3(ok && tmp.isBoolean(), false, *ret = ZERO);
            def->enableMotor = tmp.toBoolean();

            break;
        }
        default:
            assert(false);
            break;
    }

    return true;
}

bool seval_to_b2FixtureDef(const se::Value& v, b2FixtureDef* ret)
{
    static b2FixtureDef ZERO;
    assert(v.isObject());
    assert(ret != nullptr);

    bool ok = false;
    se::Object* obj = v.toObject();
    se::Value tmp;
    ok = obj->getProperty("friction", &tmp);
    if (ok && tmp.isNumber())
        ret->friction = tmp.toFloat();
    else
        ret->friction = 0.2f;

    ok = obj->getProperty("restitution", &tmp);
    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
    ret->restitution = tmp.toFloat();

    ok = obj->getProperty("density", &tmp);
    SE_PRECONDITION3(ok && tmp.isNumber(), false, *ret = ZERO);
    ret->density = tmp.toFloat();

    ok = obj->getProperty("isSensor", &tmp);
    SE_PRECONDITION3(ok && tmp.isBoolean(), false, *ret = ZERO);
    ret->isSensor = tmp.toBoolean();

    ok = obj->getProperty("shape", &tmp);
    SE_PRECONDITION3(ok, false, *ret = ZERO);
    ok = seval_to_native_ptr(tmp, &ret->shape);
    SE_PRECONDITION3(ok, false, *ret = ZERO);

    se::Value filterVal;
    ok = obj->getProperty("filter", &filterVal);
    SE_PRECONDITION3(ok && filterVal.isObject(), false, *ret = ZERO);

    se::Object* filterObj = filterVal.toObject();

    ok = filterObj->getProperty("categoryBits", &tmp);
    if (ok && tmp.isNumber())
        ret->filter.categoryBits = tmp.toUint16();
    else
        ret->filter.categoryBits = 0x0001;

    ok = filterObj->getProperty("groupIndex", &tmp);
    if (ok && tmp.isNumber())
        ret->filter.groupIndex = tmp.toInt16();
    else
        ret->filter.groupIndex = 0;

    ok = filterObj->getProperty("maskBits", &tmp);
    if (ok && tmp.isNumber())
        ret->filter.maskBits = tmp.toInt16();
    else
        ret->filter.maskBits = 0xFFFF;

    return true;
}

bool seval_to_array_of_b2Vec2(const se::Value& v, b2Vec2* outPoints, uint32_t numPoints)
{
    assert(v.isObject() && v.toObject()->isArray());
    assert(outPoints != nullptr);
    se::Object* arr = v.toObject();
    uint32_t arrLen = 0;
    assert(arr->getArrayLength(&arrLen) && arrLen == numPoints);
    bool ok = false;
    for (uint32_t i = 0; i < numPoints; ++i)
    {
        se::Value tmp;
        ok = arr->getArrayElement(i, &tmp);
        if (!ok) break;
        ok = seval_to_b2Vec2(tmp, &outPoints[i]);
        if (!ok) break;
    }

    return ok;
}

bool array_of_b2Fixture_to_seval(const std::vector<b2Fixture*>& fixtures, se::Value* ret)
{
    se::HandleObject obj(se::Object::createArrayObject(fixtures.size()));

    se::Value tmp;
    int i = 0;
    bool ok = true;
    for (const auto& e : fixtures)
    {
        ok = native_ptr_to_rooted_seval<b2Fixture>(e, &tmp);
        if (!ok)
            break;
        ok = obj->setArrayElement(i, tmp);
        if (!ok)
            break;
        ++i;
    }

    if (ok)
        ret->setObject(obj, true);
    else
        ret->setUndefined();

    return ok;
}

bool array_of_b2Vec2_to_seval(const std::vector<b2Vec2>& vs, se::Value* ret)
{
    se::HandleObject obj(se::Object::createArrayObject(vs.size()));

    se::Value tmp;
    int i = 0;
    bool ok = true;
    for (const auto& e : vs)
    {
        ok = b2Vec2_to_seval(e, &tmp);
        if (!ok)
            break;
        ok = obj->setArrayElement(i, tmp);
        if (!ok)
            break;
        ++i;
    }

    if (ok)
        ret->setObject(obj, true);
    else
        ret->setUndefined();

    return ok;
}

static bool js_box2dclasses_b2Shape_SetRadius(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        b2Shape* cobj = (b2Shape *)s.nativeThisObject();
        SE_PRECONDITION2(args[0].isNumber(), false, "The radius isn't a number!");
        cobj->m_radius = args[0].toFloat();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Shape_SetRadius)

static bool js_box2dclasses_b2Shape_GetRadius(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 0)
    {
        b2Shape* cobj = (b2Shape *)s.nativeThisObject();
        s.rval().setFloat(cobj->m_radius);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Shape_GetRadius)

static bool js_box2dclasses_b2World_CreateBody(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        bool ok = false;
        b2World* cobj = (b2World *)s.nativeThisObject();

        b2BodyDef def;
        ok = seval_to_b2BodyDef(args[0], &def);
        SE_PRECONDITION2(ok, false, "seval_to_b2BodyDef failed!");

        b2Body* ret = cobj->CreateBody(&def);

        native_ptr_to_rooted_seval<b2Body>(ret, __jsb_b2Body_class, &s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_CreateBody)

static bool js_box2dclasses_b2CircleShape_SetPosition(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        bool ok = false;
        b2CircleShape* cobj = (b2CircleShape *)s.nativeThisObject();
        b2Vec2 arg0;
        ok = seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "seval_to_b2Vec2 failed!");
        cobj->m_p = arg0;
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2CircleShape_SetPosition)

static bool js_box2dclasses_b2CircleShape_GetPosition(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 0)
    {
        b2CircleShape* cobj = (b2CircleShape *)s.nativeThisObject();
        bool ok = false;
        ok = b2Vec2_to_seval(cobj->m_p, &s.rval());
        SE_PRECONDITION2(ok, false, "b2Vec2_to_seval failed!");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2CircleShape_GetPosition)

static bool js_box2dclasses_b2World_CreateJoint(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        bool ok = false;
        b2World* cobj = (b2World *)s.nativeThisObject();
        b2JointDef* tmpDef = nullptr;
        b2JointType type = e_unknownJoint;

        se::Object* seObj = args[0].toObject();
        se::Value tmp;
        ok = seObj->getProperty("type", &tmp);
        SE_PRECONDITION2(ok, false, "Get type failed!");
        if (tmp.isNumber())
            type = (b2JointType)tmp.toInt32();

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
            {
                assert(false);
                break;
            }
        }

        ok = seval_to_b2JointDef(args[0], type, tmpDef);
        SE_PRECONDITION2(ok, false, "seval_to_b2JointDef failed!");

        b2Joint* ret = cobj->CreateJoint(tmpDef);

        se::Class* cls = JSBClassType::findClass<b2Joint>(ret);
        assert(cls != nullptr);
        ok = native_ptr_to_rooted_seval<b2Joint>(ret, cls, &s.rval());

        delete tmpDef;

        SE_PRECONDITION2(ok, false, "native_ptr_to_rooted_seval failed!");

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_CreateJoint)

static bool js_box2dclasses_b2Body_CreateFixture(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    bool ok = false;
    b2Body* cobj = (b2Body *)s.nativeThisObject();

    if (argc == 2)
    {
        b2Shape* arg0;
        ok = seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "seval_to_native_ptr failed!");

        float arg1 = args[1].toFloat();
        b2Fixture* ret = cobj->CreateFixture(arg0, arg1);
        ok = native_ptr_to_rooted_seval<b2Fixture>(ret, __jsb_b2Fixture_class, &s.rval());
        SE_PRECONDITION2(ok, false, "native_ptr_to_rooted_seval failed!");
        return true;
    }
    else if (argc == 1)
    {
        b2FixtureDef def;
        ok = seval_to_b2FixtureDef(args[0], &def);
        SE_PRECONDITION2(ok, false, "seval_to_b2FixtureDef failed!");
        b2Fixture* ret = cobj->CreateFixture(&def);
        ok = native_ptr_to_rooted_seval<b2Fixture>(ret, __jsb_b2Fixture_class, &s.rval());
        SE_PRECONDITION2(ok, false, "native_ptr_to_rooted_seval failed!");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_CreateFixture)

static bool js_box2dclasses_b2Body_SetUserData(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        bool ok = false;
        b2Body* cobj = (b2Body *)s.nativeThisObject();
        void* arg0 = nullptr;
        ok = seval_to_native_ptr(args[0], &arg0);
        if (ok)
            cobj->SetUserData(arg0);
        else
            cobj->SetUserData(nullptr);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetUserData)

static bool js_box2dclasses_b2Body_GetUserData(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 0)
    {
        b2Body* cobj = (b2Body *)s.nativeThisObject();
        void* data = cobj->GetUserData();

        auto iter = se::NativePtrToObjectMap::find(data);
        if (iter != se::NativePtrToObjectMap::end())
        {
            s.rval().setObject(iter->second);
        }
        else
        {
            s.rval().setNull();
        }
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetUserData)

static bool js_box2dclasses_b2Body_GetJointList(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    bool ok = false;

    if (argc == 0)
    {
        b2Body* cobj = (b2Body *)s.nativeThisObject();

        b2JointEdge* list = cobj->GetJointList();
        se::HandleObject arr(se::Object::createArrayObject(0));

        do
        {
            if (!list) {
                break;
            }

            int i = 0;

            se::Value tmp;
            ok = native_ptr_to_rooted_seval<b2Joint>(list->joint, &tmp);
            if (!ok) break;

            ok = arr->setArrayElement(i++, tmp);
            if (!ok) break;

            //FIXME: whether to iterate both prev and next?
            b2JointEdge* prev = list->prev;
            while (prev) {

                ok = native_ptr_to_rooted_seval<b2Joint>(prev->joint, &tmp);
                if (!ok) break;

                ok = arr->setArrayElement(i++, tmp);
                if (!ok) break;

                prev = prev->prev;
            }
            if (!ok) break;

            b2JointEdge* next = list->next;
            while (next) {
                ok = native_ptr_to_rooted_seval<b2Joint>(next->joint, &tmp);
                if (!ok) break;

                ok = arr->setArrayElement(i++, tmp);
                if (!ok) break;

                next = next->next;
            }
            if (!ok) break;


        }
        while(0);

        if (ok)
            s.rval().setObject(arr);
        else
            s.rval().setNull();

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetJointList)

static bool js_box2dclasses_b2PolygonShape_Set(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    bool ok = false;

    if (argc == 2)
    {
        b2PolygonShape* cobj = (b2PolygonShape *)s.nativeThisObject();
        int arg1 = 0;
        ok = seval_to_int32(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "seval_to_int32 failed!");

        b2Vec2* arg0 = new (std::nothrow) b2Vec2[arg1];
        ok = seval_to_array_of_b2Vec2(args[0], arg0, arg1);
        SE_PRECONDITION2(ok, false, "seval_to_array_of_b2Vec2 failed!");

        cobj->Set(arg0, arg1);

        delete [] arg0;

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PolygonShape_Set)

static bool js_box2dclasses_b2PolygonShape_SetAsBox(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    bool ok = false;

    if (argc == 2)
    {
        b2PolygonShape* cobj = (b2PolygonShape *)s.nativeThisObject();
        float arg0 = 0.0f, arg1 = 0.0f;
        ok = seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "seval_to_float failed!");
        ok = seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "seval_to_float failed!");

        cobj->SetAsBox(arg0, arg1);

        return true;
    }

    if (argc == 4)
    {
        b2PolygonShape* cobj = (b2PolygonShape *)s.nativeThisObject();
        float arg0 = 0.0f, arg1 = 0.0f;
        ok = seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "seval_to_float failed!");
        ok = seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "seval_to_float failed!");

        b2Vec2 arg2;
        float arg3 = 0.0f;
        ok = seval_to_b2Vec2(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "seval_to_b2Vec2 failed!");
        ok = seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "seval_to_float failed!");

        cobj->SetAsBox(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PolygonShape_SetAsBox)

static bool js_box2dclasses_b2ChainShape_CreateLoop(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    bool ok = false;

    if (argc == 2)
    {
        b2ChainShape* cobj = (b2ChainShape *)s.nativeThisObject();
        int arg1 = 0;
        ok = seval_to_int32(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "seval_to_int32 failed!");

        b2Vec2* arg0 = new (std::nothrow) b2Vec2[arg1];
        ok = seval_to_array_of_b2Vec2(args[0], arg0, arg1);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        cobj->CreateLoop(arg0, arg1);

        delete[] arg0;
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ChainShape_CreateLoop)

static bool js_box2dclasses_b2ChainShape_CreateChain(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    bool ok = false;

    if (argc == 2)
    {
        b2ChainShape* cobj = (b2ChainShape *)s.nativeThisObject();
        int arg1 = 0;
        ok = seval_to_int32(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "seval_to_int32 failed!");

        b2Vec2* arg0 = new (std::nothrow) b2Vec2[arg1];
        ok = seval_to_array_of_b2Vec2(args[0], arg0, arg1);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        cobj->CreateChain(arg0, arg1);

        delete[] arg0;
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ChainShape_CreateChain)

bool register_all_box2d_manual(se::Object* obj)
{
    __jsb_b2Shape_proto->defineFunction("SetRadius", _SE(js_box2dclasses_b2Shape_SetRadius));
    __jsb_b2Shape_proto->defineFunction("GetRadius", _SE(js_box2dclasses_b2Shape_GetRadius));

    __jsb_b2CircleShape_proto->defineFunction("SetPosition", _SE(js_box2dclasses_b2CircleShape_SetPosition));
    __jsb_b2CircleShape_proto->defineFunction("GetPosition", _SE(js_box2dclasses_b2CircleShape_GetPosition));

    __jsb_b2World_proto->defineFunction("CreateBody", _SE(js_box2dclasses_b2World_CreateBody));
    __jsb_b2World_proto->defineFunction("CreateJoint", _SE(js_box2dclasses_b2World_CreateJoint));

    __jsb_b2Body_proto->defineFunction("CreateFixture", _SE(js_box2dclasses_b2Body_CreateFixture));
    __jsb_b2Body_proto->defineFunction("SetUserData", _SE(js_box2dclasses_b2Body_SetUserData));
    __jsb_b2Body_proto->defineFunction("GetUserData", _SE(js_box2dclasses_b2Body_GetUserData));
    __jsb_b2Body_proto->defineFunction("GetJointList", _SE(js_box2dclasses_b2Body_GetJointList));

    __jsb_b2PolygonShape_proto->defineFunction("Set", _SE(js_box2dclasses_b2PolygonShape_Set));
    __jsb_b2PolygonShape_proto->defineFunction("SetAsBox", _SE(js_box2dclasses_b2PolygonShape_SetAsBox));

    __jsb_b2ChainShape_proto->defineFunction("CreateLoop", _SE(js_box2dclasses_b2ChainShape_CreateLoop));
    __jsb_b2ChainShape_proto->defineFunction("CreateChain", _SE(js_box2dclasses_b2ChainShape_CreateChain));

    se::ScriptEngine::getInstance()->clearException();

    b2SetObjectDestroyNotifier([](void* obj, b2ObjectType type, const char* typeName){

        se::Object* seObj = nullptr;

        auto iter = se::NativePtrToObjectMap::find(obj);
        if (iter != se::NativePtrToObjectMap::end())
        {
            // Save se::Object pointer for being used in cleanup method.
            seObj = iter->second;
            // Unmap native and js object since native object was destroyed.
            // Otherwise, it may trigger 'assertion' in se::Object::setPrivateData later
            // since native obj is already released and the new native object may be assigned with
            // the same address.
            se::NativePtrToObjectMap::erase(iter);
        }
        else
        {
//            CCLOG("Didn't find %s, %p in map", typeName, obj);
//            assert(false);
            return;
        }

        std::string typeNameStr = typeName;
        auto cleanup = [seObj, typeNameStr](){

            auto se = se::ScriptEngine::getInstance();
            if (!se->isValid() || se->isInCleanup())
                return;

            se::AutoHandleScope hs;
            se->clearException();

            // The native <-> JS mapping was cleared in the callback above.
            // seObj->clearPrivateData isn't needed since the JS object will be garbage collected after unroot and decRef.
            seObj->unroot();
            seObj->decRef();
        };

        if (!se::ScriptEngine::getInstance()->isGarbageCollecting())
        {
            cleanup();
        }
        else
        {
            CleanupTask::pushTaskToAutoReleasePool(cleanup);
        }

        if (type == b2ObjectType::FIXTURE)
        {
            const auto& instances = creator::PhysicsContactListener::getAllInstances();
            for (auto listener : instances)
            {
                listener->unregisterContactFixture(reinterpret_cast<b2Fixture*>(obj));
            }
        }
    });

    return true;
}
