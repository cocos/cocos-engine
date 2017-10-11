#include "scripting/js-bindings/auto/jsb_box2d_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "Box2D/Box2D.h"

se::Object* __jsb_b2Draw_proto = nullptr;
se::Class* __jsb_b2Draw_class = nullptr;

static bool js_box2dclasses_b2Draw_AppendFlags(se::State& s)
{
    b2Draw* cobj = (b2Draw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Draw_AppendFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Draw_AppendFlags : Error processing arguments");
        cobj->AppendFlags(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Draw_AppendFlags)

static bool js_box2dclasses_b2Draw_DrawTransform(se::State& s)
{
    b2Draw* cobj = (b2Draw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Draw_DrawTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Transform arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Draw_DrawTransform : Error processing arguments");
        cobj->DrawTransform(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Draw_DrawTransform)

static bool js_box2dclasses_b2Draw_ClearFlags(se::State& s)
{
    b2Draw* cobj = (b2Draw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Draw_ClearFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Draw_ClearFlags : Error processing arguments");
        cobj->ClearFlags(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Draw_ClearFlags)

static bool js_box2dclasses_b2Draw_DrawPolygon(se::State& s)
{
    b2Draw* cobj = (b2Draw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Draw_DrawPolygon : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        const b2Vec2* arg0 = nullptr;
        int arg1 = 0;
        b2Color arg2;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Vec2*
        ok = false;
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        #pragma warning NO CONVERSION TO NATIVE FOR b2Color
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Draw_DrawPolygon : Error processing arguments");
        cobj->DrawPolygon(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Draw_DrawPolygon)

static bool js_box2dclasses_b2Draw_ClearDraw(se::State& s)
{
    b2Draw* cobj = (b2Draw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Draw_ClearDraw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->ClearDraw();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Draw_ClearDraw)

static bool js_box2dclasses_b2Draw_DrawSolidPolygon(se::State& s)
{
    b2Draw* cobj = (b2Draw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Draw_DrawSolidPolygon : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        const b2Vec2* arg0 = nullptr;
        int arg1 = 0;
        b2Color arg2;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Vec2*
        ok = false;
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        #pragma warning NO CONVERSION TO NATIVE FOR b2Color
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Draw_DrawSolidPolygon : Error processing arguments");
        cobj->DrawSolidPolygon(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Draw_DrawSolidPolygon)

static bool js_box2dclasses_b2Draw_DrawCircle(se::State& s)
{
    b2Draw* cobj = (b2Draw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Draw_DrawCircle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        b2Vec2 arg0;
        float arg1 = 0;
        b2Color arg2;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        #pragma warning NO CONVERSION TO NATIVE FOR b2Color
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Draw_DrawCircle : Error processing arguments");
        cobj->DrawCircle(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Draw_DrawCircle)

static bool js_box2dclasses_b2Draw_SetFlags(se::State& s)
{
    b2Draw* cobj = (b2Draw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Draw_SetFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        unsigned int arg0 = 0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Draw_SetFlags : Error processing arguments");
        cobj->SetFlags(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Draw_SetFlags)

static bool js_box2dclasses_b2Draw_DrawSegment(se::State& s)
{
    b2Draw* cobj = (b2Draw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Draw_DrawSegment : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        b2Vec2 arg0;
        b2Vec2 arg1;
        b2Color arg2;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        ok &= seval_to_b2Vec2(args[1], &arg1);
        #pragma warning NO CONVERSION TO NATIVE FOR b2Color
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Draw_DrawSegment : Error processing arguments");
        cobj->DrawSegment(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Draw_DrawSegment)

static bool js_box2dclasses_b2Draw_DrawSolidCircle(se::State& s)
{
    b2Draw* cobj = (b2Draw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Draw_DrawSolidCircle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        b2Vec2 arg0;
        float arg1 = 0;
        b2Vec2 arg2;
        b2Color arg3;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_b2Vec2(args[2], &arg2);
        #pragma warning NO CONVERSION TO NATIVE FOR b2Color
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Draw_DrawSolidCircle : Error processing arguments");
        cobj->DrawSolidCircle(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Draw_DrawSolidCircle)

static bool js_box2dclasses_b2Draw_GetFlags(se::State& s)
{
    b2Draw* cobj = (b2Draw*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Draw_GetFlags : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = cobj->GetFlags();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Draw_GetFlags : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Draw_GetFlags)




bool js_register_box2dclasses_b2Draw(se::Object* obj)
{
    auto cls = se::Class::create("Draw", obj, nullptr, nullptr);

    cls->defineFunction("AppendFlags", _SE(js_box2dclasses_b2Draw_AppendFlags));
    cls->defineFunction("DrawTransform", _SE(js_box2dclasses_b2Draw_DrawTransform));
    cls->defineFunction("ClearFlags", _SE(js_box2dclasses_b2Draw_ClearFlags));
    cls->defineFunction("DrawPolygon", _SE(js_box2dclasses_b2Draw_DrawPolygon));
    cls->defineFunction("ClearDraw", _SE(js_box2dclasses_b2Draw_ClearDraw));
    cls->defineFunction("DrawSolidPolygon", _SE(js_box2dclasses_b2Draw_DrawSolidPolygon));
    cls->defineFunction("DrawCircle", _SE(js_box2dclasses_b2Draw_DrawCircle));
    cls->defineFunction("SetFlags", _SE(js_box2dclasses_b2Draw_SetFlags));
    cls->defineFunction("DrawSegment", _SE(js_box2dclasses_b2Draw_DrawSegment));
    cls->defineFunction("DrawSolidCircle", _SE(js_box2dclasses_b2Draw_DrawSolidCircle));
    cls->defineFunction("GetFlags", _SE(js_box2dclasses_b2Draw_GetFlags));
    cls->install();
    JSBClassType::registerClass<b2Draw>(cls);

    __jsb_b2Draw_proto = cls->getProto();
    __jsb_b2Draw_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2Shape_proto = nullptr;
se::Class* __jsb_b2Shape_class = nullptr;

static bool js_box2dclasses_b2Shape_ComputeMass(se::State& s)
{
    b2Shape* cobj = (b2Shape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Shape_ComputeMass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2MassData* arg0 = nullptr;
        float arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
        ok = false;
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Shape_ComputeMass : Error processing arguments");
        cobj->ComputeMass(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Shape_ComputeMass)

static bool js_box2dclasses_b2Shape_Clone(se::State& s)
{
    b2Shape* cobj = (b2Shape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Shape_Clone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2BlockAllocator* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Shape_Clone : Error processing arguments");
        b2Shape* result = cobj->Clone(arg0);
        ok &= native_ptr_to_rooted_seval<b2Shape>((b2Shape*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Shape_Clone : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Shape_Clone)

static bool js_box2dclasses_b2Shape_GetType(se::State& s)
{
    b2Shape* cobj = (b2Shape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Shape_GetType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = (unsigned int)cobj->GetType();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Shape_GetType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Shape_GetType)

static bool js_box2dclasses_b2Shape_RayCast(se::State& s)
{
    b2Shape* cobj = (b2Shape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Shape_RayCast : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        b2RayCastOutput* arg0 = nullptr;
        b2RayCastInput arg1;
        b2Transform arg2;
        int arg3 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastOutput*
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastInput
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Shape_RayCast : Error processing arguments");
        bool result = cobj->RayCast(arg0, arg1, arg2, arg3);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Shape_RayCast : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Shape_RayCast)

static bool js_box2dclasses_b2Shape_ComputeAABB(se::State& s)
{
    b2Shape* cobj = (b2Shape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Shape_ComputeAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        b2AABB* arg0 = nullptr;
        b2Transform arg1;
        int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2AABB*
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Shape_ComputeAABB : Error processing arguments");
        cobj->ComputeAABB(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Shape_ComputeAABB)

static bool js_box2dclasses_b2Shape_GetChildCount(se::State& s)
{
    b2Shape* cobj = (b2Shape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Shape_GetChildCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetChildCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Shape_GetChildCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Shape_GetChildCount)

static bool js_box2dclasses_b2Shape_TestPoint(se::State& s)
{
    b2Shape* cobj = (b2Shape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Shape_TestPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2Transform arg0;
        b2Vec2 arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_b2Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Shape_TestPoint : Error processing arguments");
        bool result = cobj->TestPoint(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Shape_TestPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Shape_TestPoint)




bool js_register_box2dclasses_b2Shape(se::Object* obj)
{
    auto cls = se::Class::create("Shape", obj, nullptr, nullptr);

    cls->defineFunction("ComputeMass", _SE(js_box2dclasses_b2Shape_ComputeMass));
    cls->defineFunction("Clone", _SE(js_box2dclasses_b2Shape_Clone));
    cls->defineFunction("GetType", _SE(js_box2dclasses_b2Shape_GetType));
    cls->defineFunction("RayCast", _SE(js_box2dclasses_b2Shape_RayCast));
    cls->defineFunction("ComputeAABB", _SE(js_box2dclasses_b2Shape_ComputeAABB));
    cls->defineFunction("GetChildCount", _SE(js_box2dclasses_b2Shape_GetChildCount));
    cls->defineFunction("TestPoint", _SE(js_box2dclasses_b2Shape_TestPoint));
    cls->install();
    JSBClassType::registerClass<b2Shape>(cls);

    __jsb_b2Shape_proto = cls->getProto();
    __jsb_b2Shape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2CircleShape_proto = nullptr;
se::Class* __jsb_b2CircleShape_class = nullptr;

static bool js_box2dclasses_b2CircleShape_ComputeMass(se::State& s)
{
    b2CircleShape* cobj = (b2CircleShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2CircleShape_ComputeMass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2MassData* arg0 = nullptr;
        float arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
        ok = false;
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_ComputeMass : Error processing arguments");
        cobj->ComputeMass(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2CircleShape_ComputeMass)

static bool js_box2dclasses_b2CircleShape_GetVertex(se::State& s)
{
    b2CircleShape* cobj = (b2CircleShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2CircleShape_GetVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_GetVertex : Error processing arguments");
        const b2Vec2& result = cobj->GetVertex(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_GetVertex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2CircleShape_GetVertex)

static bool js_box2dclasses_b2CircleShape_Clone(se::State& s)
{
    b2CircleShape* cobj = (b2CircleShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2CircleShape_Clone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2BlockAllocator* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_Clone : Error processing arguments");
        b2Shape* result = cobj->Clone(arg0);
        ok &= native_ptr_to_rooted_seval<b2Shape>((b2Shape*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_Clone : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2CircleShape_Clone)

static bool js_box2dclasses_b2CircleShape_RayCast(se::State& s)
{
    b2CircleShape* cobj = (b2CircleShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2CircleShape_RayCast : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        b2RayCastOutput* arg0 = nullptr;
        b2RayCastInput arg1;
        b2Transform arg2;
        int arg3 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastOutput*
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastInput
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_RayCast : Error processing arguments");
        bool result = cobj->RayCast(arg0, arg1, arg2, arg3);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_RayCast : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2CircleShape_RayCast)

static bool js_box2dclasses_b2CircleShape_ComputeAABB(se::State& s)
{
    b2CircleShape* cobj = (b2CircleShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2CircleShape_ComputeAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        b2AABB* arg0 = nullptr;
        b2Transform arg1;
        int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2AABB*
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_ComputeAABB : Error processing arguments");
        cobj->ComputeAABB(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2CircleShape_ComputeAABB)

static bool js_box2dclasses_b2CircleShape_GetVertexCount(se::State& s)
{
    b2CircleShape* cobj = (b2CircleShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2CircleShape_GetVertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetVertexCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_GetVertexCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2CircleShape_GetVertexCount)

static bool js_box2dclasses_b2CircleShape_GetChildCount(se::State& s)
{
    b2CircleShape* cobj = (b2CircleShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2CircleShape_GetChildCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetChildCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_GetChildCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2CircleShape_GetChildCount)

static bool js_box2dclasses_b2CircleShape_TestPoint(se::State& s)
{
    b2CircleShape* cobj = (b2CircleShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2CircleShape_TestPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2Transform arg0;
        b2Vec2 arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_b2Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_TestPoint : Error processing arguments");
        bool result = cobj->TestPoint(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_TestPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2CircleShape_TestPoint)

static bool js_box2dclasses_b2CircleShape_GetSupportVertex(se::State& s)
{
    b2CircleShape* cobj = (b2CircleShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2CircleShape_GetSupportVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_GetSupportVertex : Error processing arguments");
        const b2Vec2& result = cobj->GetSupportVertex(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_GetSupportVertex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2CircleShape_GetSupportVertex)

static bool js_box2dclasses_b2CircleShape_GetSupport(se::State& s)
{
    b2CircleShape* cobj = (b2CircleShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2CircleShape_GetSupport : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_GetSupport : Error processing arguments");
        int result = cobj->GetSupport(arg0);
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2CircleShape_GetSupport : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2CircleShape_GetSupport)

SE_DECLARE_FINALIZE_FUNC(js_b2CircleShape_finalize)

static bool js_box2dclasses_b2CircleShape_constructor(se::State& s)
{
    b2CircleShape* cobj = new (std::nothrow) b2CircleShape();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_box2dclasses_b2CircleShape_constructor, __jsb_b2CircleShape_class, js_b2CircleShape_finalize)



extern se::Object* __jsb_b2Shape_proto;

static bool js_b2CircleShape_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2CircleShape)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        b2CircleShape* cobj = (b2CircleShape*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2CircleShape_finalize)

bool js_register_box2dclasses_b2CircleShape(se::Object* obj)
{
    auto cls = se::Class::create("CircleShape", obj, __jsb_b2Shape_proto, _SE(js_box2dclasses_b2CircleShape_constructor));

    cls->defineFunction("ComputeMass", _SE(js_box2dclasses_b2CircleShape_ComputeMass));
    cls->defineFunction("GetVertex", _SE(js_box2dclasses_b2CircleShape_GetVertex));
    cls->defineFunction("Clone", _SE(js_box2dclasses_b2CircleShape_Clone));
    cls->defineFunction("RayCast", _SE(js_box2dclasses_b2CircleShape_RayCast));
    cls->defineFunction("ComputeAABB", _SE(js_box2dclasses_b2CircleShape_ComputeAABB));
    cls->defineFunction("GetVertexCount", _SE(js_box2dclasses_b2CircleShape_GetVertexCount));
    cls->defineFunction("GetChildCount", _SE(js_box2dclasses_b2CircleShape_GetChildCount));
    cls->defineFunction("TestPoint", _SE(js_box2dclasses_b2CircleShape_TestPoint));
    cls->defineFunction("GetSupportVertex", _SE(js_box2dclasses_b2CircleShape_GetSupportVertex));
    cls->defineFunction("GetSupport", _SE(js_box2dclasses_b2CircleShape_GetSupport));
    cls->defineFinalizeFunction(_SE(js_b2CircleShape_finalize));
    cls->install();
    JSBClassType::registerClass<b2CircleShape>(cls);

    __jsb_b2CircleShape_proto = cls->getProto();
    __jsb_b2CircleShape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2EdgeShape_proto = nullptr;
se::Class* __jsb_b2EdgeShape_class = nullptr;

static bool js_box2dclasses_b2EdgeShape_Set(se::State& s)
{
    b2EdgeShape* cobj = (b2EdgeShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2EdgeShape_Set : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2Vec2 arg0;
        b2Vec2 arg1;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        ok &= seval_to_b2Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2EdgeShape_Set : Error processing arguments");
        cobj->Set(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2EdgeShape_Set)

static bool js_box2dclasses_b2EdgeShape_ComputeMass(se::State& s)
{
    b2EdgeShape* cobj = (b2EdgeShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2EdgeShape_ComputeMass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2MassData* arg0 = nullptr;
        float arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
        ok = false;
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2EdgeShape_ComputeMass : Error processing arguments");
        cobj->ComputeMass(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2EdgeShape_ComputeMass)

static bool js_box2dclasses_b2EdgeShape_Clone(se::State& s)
{
    b2EdgeShape* cobj = (b2EdgeShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2EdgeShape_Clone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2BlockAllocator* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2EdgeShape_Clone : Error processing arguments");
        b2Shape* result = cobj->Clone(arg0);
        ok &= native_ptr_to_rooted_seval<b2Shape>((b2Shape*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2EdgeShape_Clone : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2EdgeShape_Clone)

static bool js_box2dclasses_b2EdgeShape_RayCast(se::State& s)
{
    b2EdgeShape* cobj = (b2EdgeShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2EdgeShape_RayCast : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        b2RayCastOutput* arg0 = nullptr;
        b2RayCastInput arg1;
        b2Transform arg2;
        int arg3 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastOutput*
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastInput
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2EdgeShape_RayCast : Error processing arguments");
        bool result = cobj->RayCast(arg0, arg1, arg2, arg3);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2EdgeShape_RayCast : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2EdgeShape_RayCast)

static bool js_box2dclasses_b2EdgeShape_ComputeAABB(se::State& s)
{
    b2EdgeShape* cobj = (b2EdgeShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2EdgeShape_ComputeAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        b2AABB* arg0 = nullptr;
        b2Transform arg1;
        int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2AABB*
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2EdgeShape_ComputeAABB : Error processing arguments");
        cobj->ComputeAABB(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2EdgeShape_ComputeAABB)

static bool js_box2dclasses_b2EdgeShape_GetChildCount(se::State& s)
{
    b2EdgeShape* cobj = (b2EdgeShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2EdgeShape_GetChildCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetChildCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2EdgeShape_GetChildCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2EdgeShape_GetChildCount)

static bool js_box2dclasses_b2EdgeShape_TestPoint(se::State& s)
{
    b2EdgeShape* cobj = (b2EdgeShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2EdgeShape_TestPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2Transform arg0;
        b2Vec2 arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_b2Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2EdgeShape_TestPoint : Error processing arguments");
        bool result = cobj->TestPoint(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2EdgeShape_TestPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2EdgeShape_TestPoint)

SE_DECLARE_FINALIZE_FUNC(js_b2EdgeShape_finalize)

static bool js_box2dclasses_b2EdgeShape_constructor(se::State& s)
{
    b2EdgeShape* cobj = new (std::nothrow) b2EdgeShape();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_box2dclasses_b2EdgeShape_constructor, __jsb_b2EdgeShape_class, js_b2EdgeShape_finalize)



extern se::Object* __jsb_b2Shape_proto;

static bool js_b2EdgeShape_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2EdgeShape)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        b2EdgeShape* cobj = (b2EdgeShape*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2EdgeShape_finalize)

bool js_register_box2dclasses_b2EdgeShape(se::Object* obj)
{
    auto cls = se::Class::create("EdgeShape", obj, __jsb_b2Shape_proto, _SE(js_box2dclasses_b2EdgeShape_constructor));

    cls->defineFunction("Set", _SE(js_box2dclasses_b2EdgeShape_Set));
    cls->defineFunction("ComputeMass", _SE(js_box2dclasses_b2EdgeShape_ComputeMass));
    cls->defineFunction("Clone", _SE(js_box2dclasses_b2EdgeShape_Clone));
    cls->defineFunction("RayCast", _SE(js_box2dclasses_b2EdgeShape_RayCast));
    cls->defineFunction("ComputeAABB", _SE(js_box2dclasses_b2EdgeShape_ComputeAABB));
    cls->defineFunction("GetChildCount", _SE(js_box2dclasses_b2EdgeShape_GetChildCount));
    cls->defineFunction("TestPoint", _SE(js_box2dclasses_b2EdgeShape_TestPoint));
    cls->defineFinalizeFunction(_SE(js_b2EdgeShape_finalize));
    cls->install();
    JSBClassType::registerClass<b2EdgeShape>(cls);

    __jsb_b2EdgeShape_proto = cls->getProto();
    __jsb_b2EdgeShape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2ChainShape_proto = nullptr;
se::Class* __jsb_b2ChainShape_class = nullptr;

static bool js_box2dclasses_b2ChainShape_ComputeMass(se::State& s)
{
    b2ChainShape* cobj = (b2ChainShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ChainShape_ComputeMass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2MassData* arg0 = nullptr;
        float arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
        ok = false;
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ChainShape_ComputeMass : Error processing arguments");
        cobj->ComputeMass(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ChainShape_ComputeMass)

static bool js_box2dclasses_b2ChainShape_Clear(se::State& s)
{
    b2ChainShape* cobj = (b2ChainShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ChainShape_Clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Clear();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ChainShape_Clear)

static bool js_box2dclasses_b2ChainShape_TestPoint(se::State& s)
{
    b2ChainShape* cobj = (b2ChainShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ChainShape_TestPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2Transform arg0;
        b2Vec2 arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_b2Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ChainShape_TestPoint : Error processing arguments");
        bool result = cobj->TestPoint(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ChainShape_TestPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ChainShape_TestPoint)

static bool js_box2dclasses_b2ChainShape_GetChildEdge(se::State& s)
{
    b2ChainShape* cobj = (b2ChainShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ChainShape_GetChildEdge : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2EdgeShape* arg0 = nullptr;
        int arg1 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ChainShape_GetChildEdge : Error processing arguments");
        cobj->GetChildEdge(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ChainShape_GetChildEdge)

static bool js_box2dclasses_b2ChainShape_RayCast(se::State& s)
{
    b2ChainShape* cobj = (b2ChainShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ChainShape_RayCast : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        b2RayCastOutput* arg0 = nullptr;
        b2RayCastInput arg1;
        b2Transform arg2;
        int arg3 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastOutput*
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastInput
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ChainShape_RayCast : Error processing arguments");
        bool result = cobj->RayCast(arg0, arg1, arg2, arg3);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ChainShape_RayCast : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ChainShape_RayCast)

static bool js_box2dclasses_b2ChainShape_ComputeAABB(se::State& s)
{
    b2ChainShape* cobj = (b2ChainShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ChainShape_ComputeAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        b2AABB* arg0 = nullptr;
        b2Transform arg1;
        int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2AABB*
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ChainShape_ComputeAABB : Error processing arguments");
        cobj->ComputeAABB(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ChainShape_ComputeAABB)

static bool js_box2dclasses_b2ChainShape_GetChildCount(se::State& s)
{
    b2ChainShape* cobj = (b2ChainShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ChainShape_GetChildCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetChildCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ChainShape_GetChildCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ChainShape_GetChildCount)

static bool js_box2dclasses_b2ChainShape_SetPrevVertex(se::State& s)
{
    b2ChainShape* cobj = (b2ChainShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ChainShape_SetPrevVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ChainShape_SetPrevVertex : Error processing arguments");
        cobj->SetPrevVertex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ChainShape_SetPrevVertex)

static bool js_box2dclasses_b2ChainShape_SetNextVertex(se::State& s)
{
    b2ChainShape* cobj = (b2ChainShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ChainShape_SetNextVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ChainShape_SetNextVertex : Error processing arguments");
        cobj->SetNextVertex(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ChainShape_SetNextVertex)

static bool js_box2dclasses_b2ChainShape_Clone(se::State& s)
{
    b2ChainShape* cobj = (b2ChainShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ChainShape_Clone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2BlockAllocator* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ChainShape_Clone : Error processing arguments");
        b2Shape* result = cobj->Clone(arg0);
        ok &= native_ptr_to_rooted_seval<b2Shape>((b2Shape*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ChainShape_Clone : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ChainShape_Clone)

SE_DECLARE_FINALIZE_FUNC(js_b2ChainShape_finalize)

static bool js_box2dclasses_b2ChainShape_constructor(se::State& s)
{
    b2ChainShape* cobj = new (std::nothrow) b2ChainShape();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_box2dclasses_b2ChainShape_constructor, __jsb_b2ChainShape_class, js_b2ChainShape_finalize)



extern se::Object* __jsb_b2Shape_proto;

static bool js_b2ChainShape_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2ChainShape)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        b2ChainShape* cobj = (b2ChainShape*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2ChainShape_finalize)

bool js_register_box2dclasses_b2ChainShape(se::Object* obj)
{
    auto cls = se::Class::create("ChainShape", obj, __jsb_b2Shape_proto, _SE(js_box2dclasses_b2ChainShape_constructor));

    cls->defineFunction("ComputeMass", _SE(js_box2dclasses_b2ChainShape_ComputeMass));
    cls->defineFunction("Clear", _SE(js_box2dclasses_b2ChainShape_Clear));
    cls->defineFunction("TestPoint", _SE(js_box2dclasses_b2ChainShape_TestPoint));
    cls->defineFunction("GetChildEdge", _SE(js_box2dclasses_b2ChainShape_GetChildEdge));
    cls->defineFunction("RayCast", _SE(js_box2dclasses_b2ChainShape_RayCast));
    cls->defineFunction("ComputeAABB", _SE(js_box2dclasses_b2ChainShape_ComputeAABB));
    cls->defineFunction("GetChildCount", _SE(js_box2dclasses_b2ChainShape_GetChildCount));
    cls->defineFunction("SetPrevVertex", _SE(js_box2dclasses_b2ChainShape_SetPrevVertex));
    cls->defineFunction("SetNextVertex", _SE(js_box2dclasses_b2ChainShape_SetNextVertex));
    cls->defineFunction("Clone", _SE(js_box2dclasses_b2ChainShape_Clone));
    cls->defineFinalizeFunction(_SE(js_b2ChainShape_finalize));
    cls->install();
    JSBClassType::registerClass<b2ChainShape>(cls);

    __jsb_b2ChainShape_proto = cls->getProto();
    __jsb_b2ChainShape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2PolygonShape_proto = nullptr;
se::Class* __jsb_b2PolygonShape_class = nullptr;

static bool js_box2dclasses_b2PolygonShape_ComputeMass(se::State& s)
{
    b2PolygonShape* cobj = (b2PolygonShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PolygonShape_ComputeMass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2MassData* arg0 = nullptr;
        float arg1 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
        ok = false;
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_ComputeMass : Error processing arguments");
        cobj->ComputeMass(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PolygonShape_ComputeMass)

static bool js_box2dclasses_b2PolygonShape_GetVertex(se::State& s)
{
    b2PolygonShape* cobj = (b2PolygonShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PolygonShape_GetVertex : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_GetVertex : Error processing arguments");
        const b2Vec2& result = cobj->GetVertex(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_GetVertex : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PolygonShape_GetVertex)

static bool js_box2dclasses_b2PolygonShape_Clone(se::State& s)
{
    b2PolygonShape* cobj = (b2PolygonShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PolygonShape_Clone : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2BlockAllocator* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_Clone : Error processing arguments");
        b2Shape* result = cobj->Clone(arg0);
        ok &= native_ptr_to_rooted_seval<b2Shape>((b2Shape*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_Clone : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PolygonShape_Clone)

static bool js_box2dclasses_b2PolygonShape_RayCast(se::State& s)
{
    b2PolygonShape* cobj = (b2PolygonShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PolygonShape_RayCast : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        b2RayCastOutput* arg0 = nullptr;
        b2RayCastInput arg1;
        b2Transform arg2;
        int arg3 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastOutput*
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastInput
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_int32(args[3], (int32_t*)&arg3);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_RayCast : Error processing arguments");
        bool result = cobj->RayCast(arg0, arg1, arg2, arg3);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_RayCast : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PolygonShape_RayCast)

static bool js_box2dclasses_b2PolygonShape_ComputeAABB(se::State& s)
{
    b2PolygonShape* cobj = (b2PolygonShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PolygonShape_ComputeAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        b2AABB* arg0 = nullptr;
        b2Transform arg1;
        int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2AABB*
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_ComputeAABB : Error processing arguments");
        cobj->ComputeAABB(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PolygonShape_ComputeAABB)

static bool js_box2dclasses_b2PolygonShape_GetVertexCount(se::State& s)
{
    b2PolygonShape* cobj = (b2PolygonShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PolygonShape_GetVertexCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetVertexCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_GetVertexCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PolygonShape_GetVertexCount)

static bool js_box2dclasses_b2PolygonShape_GetChildCount(se::State& s)
{
    b2PolygonShape* cobj = (b2PolygonShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PolygonShape_GetChildCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetChildCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_GetChildCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PolygonShape_GetChildCount)

static bool js_box2dclasses_b2PolygonShape_TestPoint(se::State& s)
{
    b2PolygonShape* cobj = (b2PolygonShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PolygonShape_TestPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2Transform arg0;
        b2Vec2 arg1;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        ok &= seval_to_b2Vec2(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_TestPoint : Error processing arguments");
        bool result = cobj->TestPoint(arg0, arg1);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_TestPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PolygonShape_TestPoint)

static bool js_box2dclasses_b2PolygonShape_Validate(se::State& s)
{
    b2PolygonShape* cobj = (b2PolygonShape*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PolygonShape_Validate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->Validate();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PolygonShape_Validate : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PolygonShape_Validate)

SE_DECLARE_FINALIZE_FUNC(js_b2PolygonShape_finalize)

static bool js_box2dclasses_b2PolygonShape_constructor(se::State& s)
{
    b2PolygonShape* cobj = new (std::nothrow) b2PolygonShape();
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_box2dclasses_b2PolygonShape_constructor, __jsb_b2PolygonShape_class, js_b2PolygonShape_finalize)



extern se::Object* __jsb_b2Shape_proto;

static bool js_b2PolygonShape_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2PolygonShape)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        b2PolygonShape* cobj = (b2PolygonShape*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2PolygonShape_finalize)

bool js_register_box2dclasses_b2PolygonShape(se::Object* obj)
{
    auto cls = se::Class::create("PolygonShape", obj, __jsb_b2Shape_proto, _SE(js_box2dclasses_b2PolygonShape_constructor));

    cls->defineFunction("ComputeMass", _SE(js_box2dclasses_b2PolygonShape_ComputeMass));
    cls->defineFunction("GetVertex", _SE(js_box2dclasses_b2PolygonShape_GetVertex));
    cls->defineFunction("Clone", _SE(js_box2dclasses_b2PolygonShape_Clone));
    cls->defineFunction("RayCast", _SE(js_box2dclasses_b2PolygonShape_RayCast));
    cls->defineFunction("ComputeAABB", _SE(js_box2dclasses_b2PolygonShape_ComputeAABB));
    cls->defineFunction("GetVertexCount", _SE(js_box2dclasses_b2PolygonShape_GetVertexCount));
    cls->defineFunction("GetChildCount", _SE(js_box2dclasses_b2PolygonShape_GetChildCount));
    cls->defineFunction("TestPoint", _SE(js_box2dclasses_b2PolygonShape_TestPoint));
    cls->defineFunction("Validate", _SE(js_box2dclasses_b2PolygonShape_Validate));
    cls->defineFinalizeFunction(_SE(js_b2PolygonShape_finalize));
    cls->install();
    JSBClassType::registerClass<b2PolygonShape>(cls);

    __jsb_b2PolygonShape_proto = cls->getProto();
    __jsb_b2PolygonShape_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2Body_proto = nullptr;
se::Class* __jsb_b2Body_class = nullptr;

static bool js_box2dclasses_b2Body_GetAngle(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetAngle();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetAngle : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetAngle)

static bool js_box2dclasses_b2Body_IsSleepingAllowed(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_IsSleepingAllowed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsSleepingAllowed();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_IsSleepingAllowed : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_IsSleepingAllowed)

static bool js_box2dclasses_b2Body_SetAngularDamping(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetAngularDamping : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetAngularDamping : Error processing arguments");
        cobj->SetAngularDamping(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetAngularDamping)

static bool js_box2dclasses_b2Body_SetActive(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetActive : Error processing arguments");
        cobj->SetActive(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetActive)

static bool js_box2dclasses_b2Body_SetGravityScale(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetGravityScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetGravityScale : Error processing arguments");
        cobj->SetGravityScale(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetGravityScale)

static bool js_box2dclasses_b2Body_GetAngularVelocity(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetAngularVelocity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetAngularVelocity();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetAngularVelocity : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetAngularVelocity)

static bool js_box2dclasses_b2Body_GetFixtureList(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2Body_GetFixtureList : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2Fixture* result = cobj->GetFixtureList();
            ok &= native_ptr_to_rooted_seval<b2Fixture>((b2Fixture*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetFixtureList : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2Fixture* result = cobj->GetFixtureList();
            ok &= native_ptr_to_rooted_seval<b2Fixture>((b2Fixture*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetFixtureList : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetFixtureList)

static bool js_box2dclasses_b2Body_ApplyForce(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_ApplyForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        b2Vec2 arg0;
        b2Vec2 arg1;
        bool arg2;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        ok &= seval_to_b2Vec2(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_ApplyForce : Error processing arguments");
        cobj->ApplyForce(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_ApplyForce)

static bool js_box2dclasses_b2Body_GetLocalPoint(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetLocalPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetLocalPoint : Error processing arguments");
        b2Vec2 result = cobj->GetLocalPoint(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetLocalPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetLocalPoint)

static bool js_box2dclasses_b2Body_SetLinearVelocity(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetLinearVelocity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetLinearVelocity : Error processing arguments");
        cobj->SetLinearVelocity(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetLinearVelocity)

static bool js_box2dclasses_b2Body_GetLinearVelocity(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetLinearVelocity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLinearVelocity();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetLinearVelocity : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetLinearVelocity)

static bool js_box2dclasses_b2Body_GetNext(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2Body_GetNext : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2Body* result = cobj->GetNext();
            ok &= native_ptr_to_rooted_seval<b2Body>((b2Body*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetNext : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2Body* result = cobj->GetNext();
            ok &= native_ptr_to_rooted_seval<b2Body>((b2Body*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetNext : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetNext)

static bool js_box2dclasses_b2Body_SetSleepingAllowed(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetSleepingAllowed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetSleepingAllowed : Error processing arguments");
        cobj->SetSleepingAllowed(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetSleepingAllowed)

static bool js_box2dclasses_b2Body_SetTransform(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2Vec2 arg0;
        float arg1 = 0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetTransform : Error processing arguments");
        cobj->SetTransform(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetTransform)

static bool js_box2dclasses_b2Body_GetMass(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetMass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMass();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetMass : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetMass)

static bool js_box2dclasses_b2Body_SetAngularVelocity(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetAngularVelocity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetAngularVelocity : Error processing arguments");
        cobj->SetAngularVelocity(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetAngularVelocity)

static bool js_box2dclasses_b2Body_GetMassData(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetMassData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2MassData* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetMassData : Error processing arguments");
        cobj->GetMassData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetMassData)

static bool js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint : Error processing arguments");
        b2Vec2 result = cobj->GetLinearVelocityFromWorldPoint(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint)

static bool js_box2dclasses_b2Body_ResetMassData(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_ResetMassData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->ResetMassData();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_ResetMassData)

static bool js_box2dclasses_b2Body_ApplyForceToCenter(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_ApplyForceToCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2Vec2 arg0;
        bool arg1;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_ApplyForceToCenter : Error processing arguments");
        cobj->ApplyForceToCenter(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_ApplyForceToCenter)

static bool js_box2dclasses_b2Body_ApplyTorque(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_ApplyTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_ApplyTorque : Error processing arguments");
        cobj->ApplyTorque(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_ApplyTorque)

static bool js_box2dclasses_b2Body_IsAwake(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_IsAwake : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsAwake();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_IsAwake : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_IsAwake)

static bool js_box2dclasses_b2Body_SetType(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2BodyType arg0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetType : Error processing arguments");
        cobj->SetType(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetType)

static bool js_box2dclasses_b2Body_SetMassData(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetMassData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        const b2MassData* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetMassData : Error processing arguments");
        cobj->SetMassData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetMassData)

static bool js_box2dclasses_b2Body_GetTransform(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetTransform : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Transform& result = cobj->GetTransform();
        #pragma warning NO CONVERSION FROM NATIVE FOR b2Transform;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetTransform : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetTransform)

static bool js_box2dclasses_b2Body_GetWorldCenter(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetWorldCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetWorldCenter();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetWorldCenter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetWorldCenter)

static bool js_box2dclasses_b2Body_GetAngularDamping(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetAngularDamping : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetAngularDamping();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetAngularDamping : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetAngularDamping)

static bool js_box2dclasses_b2Body_ApplyLinearImpulse(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_ApplyLinearImpulse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        b2Vec2 arg0;
        b2Vec2 arg1;
        bool arg2;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        ok &= seval_to_b2Vec2(args[1], &arg1);
        ok &= seval_to_boolean(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_ApplyLinearImpulse : Error processing arguments");
        cobj->ApplyLinearImpulse(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_ApplyLinearImpulse)

static bool js_box2dclasses_b2Body_IsFixedRotation(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_IsFixedRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsFixedRotation();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_IsFixedRotation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_IsFixedRotation)

static bool js_box2dclasses_b2Body_GetLocalCenter(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetLocalCenter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalCenter();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetLocalCenter : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetLocalCenter)

static bool js_box2dclasses_b2Body_GetWorldVector(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetWorldVector : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetWorldVector : Error processing arguments");
        b2Vec2 result = cobj->GetWorldVector(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetWorldVector : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetWorldVector)

static bool js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint : Error processing arguments");
        b2Vec2 result = cobj->GetLinearVelocityFromLocalPoint(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint)

static bool js_box2dclasses_b2Body_GetContactList(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2Body_GetContactList : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2ContactEdge* result = cobj->GetContactList();
            #pragma warning NO CONVERSION FROM NATIVE FOR b2ContactEdge*;
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetContactList : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2ContactEdge* result = cobj->GetContactList();
            #pragma warning NO CONVERSION FROM NATIVE FOR b2ContactEdge*;
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetContactList : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetContactList)

static bool js_box2dclasses_b2Body_GetWorldPoint(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetWorldPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetWorldPoint : Error processing arguments");
        b2Vec2 result = cobj->GetWorldPoint(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetWorldPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetWorldPoint)

static bool js_box2dclasses_b2Body_SetAwake(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetAwake : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetAwake : Error processing arguments");
        cobj->SetAwake(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetAwake)

static bool js_box2dclasses_b2Body_GetLinearDamping(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetLinearDamping : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetLinearDamping();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetLinearDamping : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetLinearDamping)

static bool js_box2dclasses_b2Body_IsBullet(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_IsBullet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsBullet();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_IsBullet : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_IsBullet)

static bool js_box2dclasses_b2Body_GetWorld(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2Body_GetWorld : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2World* result = cobj->GetWorld();
            ok &= native_ptr_to_seval<b2World>((b2World*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetWorld : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2World* result = cobj->GetWorld();
            ok &= native_ptr_to_seval<b2World>((b2World*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetWorld : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetWorld)

static bool js_box2dclasses_b2Body_GetLocalVector(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetLocalVector : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetLocalVector : Error processing arguments");
        b2Vec2 result = cobj->GetLocalVector(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetLocalVector : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetLocalVector)

static bool js_box2dclasses_b2Body_SetLinearDamping(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetLinearDamping : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetLinearDamping : Error processing arguments");
        cobj->SetLinearDamping(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetLinearDamping)

static bool js_box2dclasses_b2Body_Dump(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_Dump)

static bool js_box2dclasses_b2Body_SetBullet(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetBullet : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetBullet : Error processing arguments");
        cobj->SetBullet(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetBullet)

static bool js_box2dclasses_b2Body_GetType(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = (unsigned int)cobj->GetType();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetType)

static bool js_box2dclasses_b2Body_GetGravityScale(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetGravityScale : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetGravityScale();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetGravityScale : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetGravityScale)

static bool js_box2dclasses_b2Body_DestroyFixture(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_DestroyFixture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Fixture* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_DestroyFixture : Error processing arguments");
        cobj->DestroyFixture(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_DestroyFixture)

static bool js_box2dclasses_b2Body_GetInertia(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetInertia : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetInertia();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetInertia : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetInertia)

static bool js_box2dclasses_b2Body_IsActive(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_IsActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsActive();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_IsActive : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_IsActive)

static bool js_box2dclasses_b2Body_SetFixedRotation(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_SetFixedRotation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_SetFixedRotation : Error processing arguments");
        cobj->SetFixedRotation(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_SetFixedRotation)

static bool js_box2dclasses_b2Body_ApplyAngularImpulse(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_ApplyAngularImpulse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        bool arg1;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_boolean(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_ApplyAngularImpulse : Error processing arguments");
        cobj->ApplyAngularImpulse(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_ApplyAngularImpulse)

static bool js_box2dclasses_b2Body_GetPosition(se::State& s)
{
    b2Body* cobj = (b2Body*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Body_GetPosition : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetPosition();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Body_GetPosition : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Body_GetPosition)



static bool js_b2Body_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2Body)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2Body_finalize)

bool js_register_box2dclasses_b2Body(se::Object* obj)
{
    auto cls = se::Class::create("Body", obj, nullptr, nullptr);

    cls->defineFunction("GetAngle", _SE(js_box2dclasses_b2Body_GetAngle));
    cls->defineFunction("IsSleepingAllowed", _SE(js_box2dclasses_b2Body_IsSleepingAllowed));
    cls->defineFunction("SetAngularDamping", _SE(js_box2dclasses_b2Body_SetAngularDamping));
    cls->defineFunction("SetActive", _SE(js_box2dclasses_b2Body_SetActive));
    cls->defineFunction("SetGravityScale", _SE(js_box2dclasses_b2Body_SetGravityScale));
    cls->defineFunction("GetAngularVelocity", _SE(js_box2dclasses_b2Body_GetAngularVelocity));
    cls->defineFunction("GetFixtureList", _SE(js_box2dclasses_b2Body_GetFixtureList));
    cls->defineFunction("ApplyForce", _SE(js_box2dclasses_b2Body_ApplyForce));
    cls->defineFunction("GetLocalPoint", _SE(js_box2dclasses_b2Body_GetLocalPoint));
    cls->defineFunction("SetLinearVelocity", _SE(js_box2dclasses_b2Body_SetLinearVelocity));
    cls->defineFunction("GetLinearVelocity", _SE(js_box2dclasses_b2Body_GetLinearVelocity));
    cls->defineFunction("GetNext", _SE(js_box2dclasses_b2Body_GetNext));
    cls->defineFunction("SetSleepingAllowed", _SE(js_box2dclasses_b2Body_SetSleepingAllowed));
    cls->defineFunction("SetTransform", _SE(js_box2dclasses_b2Body_SetTransform));
    cls->defineFunction("GetMass", _SE(js_box2dclasses_b2Body_GetMass));
    cls->defineFunction("SetAngularVelocity", _SE(js_box2dclasses_b2Body_SetAngularVelocity));
    cls->defineFunction("GetMassData", _SE(js_box2dclasses_b2Body_GetMassData));
    cls->defineFunction("GetLinearVelocityFromWorldPoint", _SE(js_box2dclasses_b2Body_GetLinearVelocityFromWorldPoint));
    cls->defineFunction("ResetMassData", _SE(js_box2dclasses_b2Body_ResetMassData));
    cls->defineFunction("ApplyForceToCenter", _SE(js_box2dclasses_b2Body_ApplyForceToCenter));
    cls->defineFunction("ApplyTorque", _SE(js_box2dclasses_b2Body_ApplyTorque));
    cls->defineFunction("IsAwake", _SE(js_box2dclasses_b2Body_IsAwake));
    cls->defineFunction("SetType", _SE(js_box2dclasses_b2Body_SetType));
    cls->defineFunction("SetMassData", _SE(js_box2dclasses_b2Body_SetMassData));
    cls->defineFunction("GetTransform", _SE(js_box2dclasses_b2Body_GetTransform));
    cls->defineFunction("GetWorldCenter", _SE(js_box2dclasses_b2Body_GetWorldCenter));
    cls->defineFunction("GetAngularDamping", _SE(js_box2dclasses_b2Body_GetAngularDamping));
    cls->defineFunction("ApplyLinearImpulse", _SE(js_box2dclasses_b2Body_ApplyLinearImpulse));
    cls->defineFunction("IsFixedRotation", _SE(js_box2dclasses_b2Body_IsFixedRotation));
    cls->defineFunction("GetLocalCenter", _SE(js_box2dclasses_b2Body_GetLocalCenter));
    cls->defineFunction("GetWorldVector", _SE(js_box2dclasses_b2Body_GetWorldVector));
    cls->defineFunction("GetLinearVelocityFromLocalPoint", _SE(js_box2dclasses_b2Body_GetLinearVelocityFromLocalPoint));
    cls->defineFunction("GetContactList", _SE(js_box2dclasses_b2Body_GetContactList));
    cls->defineFunction("GetWorldPoint", _SE(js_box2dclasses_b2Body_GetWorldPoint));
    cls->defineFunction("SetAwake", _SE(js_box2dclasses_b2Body_SetAwake));
    cls->defineFunction("GetLinearDamping", _SE(js_box2dclasses_b2Body_GetLinearDamping));
    cls->defineFunction("IsBullet", _SE(js_box2dclasses_b2Body_IsBullet));
    cls->defineFunction("GetWorld", _SE(js_box2dclasses_b2Body_GetWorld));
    cls->defineFunction("GetLocalVector", _SE(js_box2dclasses_b2Body_GetLocalVector));
    cls->defineFunction("SetLinearDamping", _SE(js_box2dclasses_b2Body_SetLinearDamping));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2Body_Dump));
    cls->defineFunction("SetBullet", _SE(js_box2dclasses_b2Body_SetBullet));
    cls->defineFunction("GetType", _SE(js_box2dclasses_b2Body_GetType));
    cls->defineFunction("GetGravityScale", _SE(js_box2dclasses_b2Body_GetGravityScale));
    cls->defineFunction("DestroyFixture", _SE(js_box2dclasses_b2Body_DestroyFixture));
    cls->defineFunction("GetInertia", _SE(js_box2dclasses_b2Body_GetInertia));
    cls->defineFunction("IsActive", _SE(js_box2dclasses_b2Body_IsActive));
    cls->defineFunction("SetFixedRotation", _SE(js_box2dclasses_b2Body_SetFixedRotation));
    cls->defineFunction("ApplyAngularImpulse", _SE(js_box2dclasses_b2Body_ApplyAngularImpulse));
    cls->defineFunction("GetPosition", _SE(js_box2dclasses_b2Body_GetPosition));
    cls->defineFinalizeFunction(_SE(js_b2Body_finalize));
    cls->install();
    JSBClassType::registerClass<b2Body>(cls);

    __jsb_b2Body_proto = cls->getProto();
    __jsb_b2Body_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2Fixture_proto = nullptr;
se::Class* __jsb_b2Fixture_class = nullptr;

static bool js_box2dclasses_b2Fixture_GetRestitution(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_GetRestitution : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetRestitution();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetRestitution : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_GetRestitution)

static bool js_box2dclasses_b2Fixture_SetFilterData(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_SetFilterData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Filter arg0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Filter
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_SetFilterData : Error processing arguments");
        cobj->SetFilterData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_SetFilterData)

static bool js_box2dclasses_b2Fixture_SetFriction(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_SetFriction : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_SetFriction : Error processing arguments");
        cobj->SetFriction(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_SetFriction)

static bool js_box2dclasses_b2Fixture_GetShape(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2Fixture_GetShape : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2Shape* result = cobj->GetShape();
            ok &= native_ptr_to_rooted_seval<b2Shape>((b2Shape*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetShape : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2Shape* result = cobj->GetShape();
            ok &= native_ptr_to_rooted_seval<b2Shape>((b2Shape*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetShape : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_GetShape)

static bool js_box2dclasses_b2Fixture_SetRestitution(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_SetRestitution : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_SetRestitution : Error processing arguments");
        cobj->SetRestitution(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_SetRestitution)

static bool js_box2dclasses_b2Fixture_GetBody(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2Fixture_GetBody : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2Body* result = cobj->GetBody();
            ok &= native_ptr_to_rooted_seval<b2Body>((b2Body*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetBody : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2Body* result = cobj->GetBody();
            ok &= native_ptr_to_rooted_seval<b2Body>((b2Body*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetBody : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_GetBody)

static bool js_box2dclasses_b2Fixture_GetNext(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2Fixture_GetNext : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2Fixture* result = cobj->GetNext();
            ok &= native_ptr_to_rooted_seval<b2Fixture>((b2Fixture*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetNext : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2Fixture* result = cobj->GetNext();
            ok &= native_ptr_to_rooted_seval<b2Fixture>((b2Fixture*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetNext : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_GetNext)

static bool js_box2dclasses_b2Fixture_GetFriction(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_GetFriction : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetFriction();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetFriction : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_GetFriction)

static bool js_box2dclasses_b2Fixture_SetDensity(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_SetDensity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_SetDensity : Error processing arguments");
        cobj->SetDensity(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_SetDensity)

static bool js_box2dclasses_b2Fixture_GetMassData(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_GetMassData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2MassData* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR b2MassData*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetMassData : Error processing arguments");
        cobj->GetMassData(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_GetMassData)

static bool js_box2dclasses_b2Fixture_SetSensor(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_SetSensor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_SetSensor : Error processing arguments");
        cobj->SetSensor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_SetSensor)

static bool js_box2dclasses_b2Fixture_GetAABB(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_GetAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetAABB : Error processing arguments");
        const b2AABB& result = cobj->GetAABB(arg0);
        ok &= b2AABB_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetAABB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_GetAABB)

static bool js_box2dclasses_b2Fixture_TestPoint(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_TestPoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_TestPoint : Error processing arguments");
        bool result = cobj->TestPoint(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_TestPoint : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_TestPoint)

static bool js_box2dclasses_b2Fixture_RayCast(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_RayCast : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        b2RayCastOutput* arg0 = nullptr;
        b2RayCastInput arg1;
        int arg2 = 0;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastOutput*
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2RayCastInput
        ok = false;
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_RayCast : Error processing arguments");
        bool result = cobj->RayCast(arg0, arg1, arg2);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_RayCast : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_RayCast)

static bool js_box2dclasses_b2Fixture_Refilter(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_Refilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Refilter();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_Refilter)

static bool js_box2dclasses_b2Fixture_Dump(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        int arg0 = 0;
        ok &= seval_to_int32(args[0], (int32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_Dump : Error processing arguments");
        cobj->Dump(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_Dump)

static bool js_box2dclasses_b2Fixture_GetFilterData(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_GetFilterData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Filter& result = cobj->GetFilterData();
        #pragma warning NO CONVERSION FROM NATIVE FOR b2Filter;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetFilterData : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_GetFilterData)

static bool js_box2dclasses_b2Fixture_IsSensor(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_IsSensor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsSensor();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_IsSensor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_IsSensor)

static bool js_box2dclasses_b2Fixture_GetType(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_GetType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = (unsigned int)cobj->GetType();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_GetType)

static bool js_box2dclasses_b2Fixture_GetDensity(se::State& s)
{
    b2Fixture* cobj = (b2Fixture*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Fixture_GetDensity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetDensity();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Fixture_GetDensity : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Fixture_GetDensity)



static bool js_b2Fixture_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2Fixture)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2Fixture_finalize)

bool js_register_box2dclasses_b2Fixture(se::Object* obj)
{
    auto cls = se::Class::create("Fixture", obj, nullptr, nullptr);

    cls->defineFunction("GetRestitution", _SE(js_box2dclasses_b2Fixture_GetRestitution));
    cls->defineFunction("SetFilterData", _SE(js_box2dclasses_b2Fixture_SetFilterData));
    cls->defineFunction("SetFriction", _SE(js_box2dclasses_b2Fixture_SetFriction));
    cls->defineFunction("GetShape", _SE(js_box2dclasses_b2Fixture_GetShape));
    cls->defineFunction("SetRestitution", _SE(js_box2dclasses_b2Fixture_SetRestitution));
    cls->defineFunction("GetBody", _SE(js_box2dclasses_b2Fixture_GetBody));
    cls->defineFunction("GetNext", _SE(js_box2dclasses_b2Fixture_GetNext));
    cls->defineFunction("GetFriction", _SE(js_box2dclasses_b2Fixture_GetFriction));
    cls->defineFunction("SetDensity", _SE(js_box2dclasses_b2Fixture_SetDensity));
    cls->defineFunction("GetMassData", _SE(js_box2dclasses_b2Fixture_GetMassData));
    cls->defineFunction("SetSensor", _SE(js_box2dclasses_b2Fixture_SetSensor));
    cls->defineFunction("GetAABB", _SE(js_box2dclasses_b2Fixture_GetAABB));
    cls->defineFunction("TestPoint", _SE(js_box2dclasses_b2Fixture_TestPoint));
    cls->defineFunction("RayCast", _SE(js_box2dclasses_b2Fixture_RayCast));
    cls->defineFunction("Refilter", _SE(js_box2dclasses_b2Fixture_Refilter));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2Fixture_Dump));
    cls->defineFunction("GetFilterData", _SE(js_box2dclasses_b2Fixture_GetFilterData));
    cls->defineFunction("IsSensor", _SE(js_box2dclasses_b2Fixture_IsSensor));
    cls->defineFunction("GetType", _SE(js_box2dclasses_b2Fixture_GetType));
    cls->defineFunction("GetDensity", _SE(js_box2dclasses_b2Fixture_GetDensity));
    cls->defineFinalizeFunction(_SE(js_b2Fixture_finalize));
    cls->install();
    JSBClassType::registerClass<b2Fixture>(cls);

    __jsb_b2Fixture_proto = cls->getProto();
    __jsb_b2Fixture_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2ContactListener_proto = nullptr;
se::Class* __jsb_b2ContactListener_class = nullptr;

static bool js_box2dclasses_b2ContactListener_EndContact(se::State& s)
{
    b2ContactListener* cobj = (b2ContactListener*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ContactListener_EndContact : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Contact* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ContactListener_EndContact : Error processing arguments");
        cobj->EndContact(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ContactListener_EndContact)

static bool js_box2dclasses_b2ContactListener_PreSolve(se::State& s)
{
    b2ContactListener* cobj = (b2ContactListener*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ContactListener_PreSolve : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2Contact* arg0 = nullptr;
        const b2Manifold* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        #pragma warning NO CONVERSION TO NATIVE FOR b2Manifold*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ContactListener_PreSolve : Error processing arguments");
        cobj->PreSolve(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ContactListener_PreSolve)

static bool js_box2dclasses_b2ContactListener_BeginContact(se::State& s)
{
    b2ContactListener* cobj = (b2ContactListener*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ContactListener_BeginContact : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Contact* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ContactListener_BeginContact : Error processing arguments");
        cobj->BeginContact(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ContactListener_BeginContact)

static bool js_box2dclasses_b2ContactListener_PostSolve(se::State& s)
{
    b2ContactListener* cobj = (b2ContactListener*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2ContactListener_PostSolve : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2Contact* arg0 = nullptr;
        const b2ContactImpulse* arg1 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        #pragma warning NO CONVERSION TO NATIVE FOR b2ContactImpulse*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2ContactListener_PostSolve : Error processing arguments");
        cobj->PostSolve(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2ContactListener_PostSolve)




bool js_register_box2dclasses_b2ContactListener(se::Object* obj)
{
    auto cls = se::Class::create("b2ContactListener", obj, nullptr, nullptr);

    cls->defineFunction("EndContact", _SE(js_box2dclasses_b2ContactListener_EndContact));
    cls->defineFunction("PreSolve", _SE(js_box2dclasses_b2ContactListener_PreSolve));
    cls->defineFunction("BeginContact", _SE(js_box2dclasses_b2ContactListener_BeginContact));
    cls->defineFunction("PostSolve", _SE(js_box2dclasses_b2ContactListener_PostSolve));
    cls->install();
    JSBClassType::registerClass<b2ContactListener>(cls);

    __jsb_b2ContactListener_proto = cls->getProto();
    __jsb_b2ContactListener_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2QueryCallback_proto = nullptr;
se::Class* __jsb_b2QueryCallback_class = nullptr;

static bool js_box2dclasses_b2QueryCallback_ReportFixture(se::State& s)
{
    b2QueryCallback* cobj = (b2QueryCallback*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2QueryCallback_ReportFixture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Fixture* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2QueryCallback_ReportFixture : Error processing arguments");
        bool result = cobj->ReportFixture(arg0);
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2QueryCallback_ReportFixture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2QueryCallback_ReportFixture)




bool js_register_box2dclasses_b2QueryCallback(se::Object* obj)
{
    auto cls = se::Class::create("b2QueryCallback", obj, nullptr, nullptr);

    cls->defineFunction("ReportFixture", _SE(js_box2dclasses_b2QueryCallback_ReportFixture));
    cls->install();
    JSBClassType::registerClass<b2QueryCallback>(cls);

    __jsb_b2QueryCallback_proto = cls->getProto();
    __jsb_b2QueryCallback_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2RayCastCallback_proto = nullptr;
se::Class* __jsb_b2RayCastCallback_class = nullptr;

static bool js_box2dclasses_b2RayCastCallback_ReportFixture(se::State& s)
{
    b2RayCastCallback* cobj = (b2RayCastCallback*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RayCastCallback_ReportFixture : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        b2Fixture* arg0 = nullptr;
        b2Vec2 arg1;
        b2Vec2 arg2;
        float arg3 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_b2Vec2(args[1], &arg1);
        ok &= seval_to_b2Vec2(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RayCastCallback_ReportFixture : Error processing arguments");
        float result = cobj->ReportFixture(arg0, arg1, arg2, arg3);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RayCastCallback_ReportFixture : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RayCastCallback_ReportFixture)




bool js_register_box2dclasses_b2RayCastCallback(se::Object* obj)
{
    auto cls = se::Class::create("b2RayCastCallback", obj, nullptr, nullptr);

    cls->defineFunction("ReportFixture", _SE(js_box2dclasses_b2RayCastCallback_ReportFixture));
    cls->install();
    JSBClassType::registerClass<b2RayCastCallback>(cls);

    __jsb_b2RayCastCallback_proto = cls->getProto();
    __jsb_b2RayCastCallback_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2World_proto = nullptr;
se::Class* __jsb_b2World_class = nullptr;

static bool js_box2dclasses_b2World_ShiftOrigin(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_ShiftOrigin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_ShiftOrigin : Error processing arguments");
        cobj->ShiftOrigin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_ShiftOrigin)

static bool js_box2dclasses_b2World_QueryAABB(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_QueryAABB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        b2QueryCallback* arg0 = nullptr;
        b2AABB arg1;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_b2AABB(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_QueryAABB : Error processing arguments");
        cobj->QueryAABB(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_QueryAABB)

static bool js_box2dclasses_b2World_SetSubStepping(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_SetSubStepping : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_SetSubStepping : Error processing arguments");
        cobj->SetSubStepping(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_SetSubStepping)

static bool js_box2dclasses_b2World_GetTreeQuality(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetTreeQuality : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetTreeQuality();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetTreeQuality : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetTreeQuality)

static bool js_box2dclasses_b2World_GetTreeHeight(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetTreeHeight : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetTreeHeight();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetTreeHeight : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetTreeHeight)

static bool js_box2dclasses_b2World_GetProfile(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetProfile : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Profile& result = cobj->GetProfile();
        #pragma warning NO CONVERSION FROM NATIVE FOR b2Profile;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetProfile : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetProfile)

static bool js_box2dclasses_b2World_GetTreeBalance(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetTreeBalance : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetTreeBalance();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetTreeBalance : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetTreeBalance)

static bool js_box2dclasses_b2World_GetSubStepping(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetSubStepping : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->GetSubStepping();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetSubStepping : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetSubStepping)

static bool js_box2dclasses_b2World_SetContactListener(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_SetContactListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2ContactListener* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_SetContactListener : Error processing arguments");
        cobj->SetContactListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_SetContactListener)

static bool js_box2dclasses_b2World_DrawDebugData(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_DrawDebugData : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->DrawDebugData();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_DrawDebugData)

static bool js_box2dclasses_b2World_SetContinuousPhysics(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_SetContinuousPhysics : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_SetContinuousPhysics : Error processing arguments");
        cobj->SetContinuousPhysics(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_SetContinuousPhysics)

static bool js_box2dclasses_b2World_SetGravity(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_SetGravity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_SetGravity : Error processing arguments");
        cobj->SetGravity(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_SetGravity)

static bool js_box2dclasses_b2World_GetBodyCount(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetBodyCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetBodyCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetBodyCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetBodyCount)

static bool js_box2dclasses_b2World_GetAutoClearForces(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetAutoClearForces : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->GetAutoClearForces();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetAutoClearForces : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetAutoClearForces)

static bool js_box2dclasses_b2World_GetContinuousPhysics(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetContinuousPhysics : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->GetContinuousPhysics();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetContinuousPhysics : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetContinuousPhysics)

static bool js_box2dclasses_b2World_GetJointList(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2World_GetJointList : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2Joint* result = cobj->GetJointList();
            ok &= native_ptr_to_rooted_seval<b2Joint>((b2Joint*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetJointList : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2Joint* result = cobj->GetJointList();
            ok &= native_ptr_to_rooted_seval<b2Joint>((b2Joint*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetJointList : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetJointList)

static bool js_box2dclasses_b2World_GetBodyList(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2World_GetBodyList : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2Body* result = cobj->GetBodyList();
            ok &= native_ptr_to_rooted_seval<b2Body>((b2Body*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetBodyList : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2Body* result = cobj->GetBodyList();
            ok &= native_ptr_to_rooted_seval<b2Body>((b2Body*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetBodyList : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetBodyList)

static bool js_box2dclasses_b2World_SetDestructionListener(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_SetDestructionListener : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2DestructionListener* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_SetDestructionListener : Error processing arguments");
        cobj->SetDestructionListener(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_SetDestructionListener)

static bool js_box2dclasses_b2World_DestroyJoint(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_DestroyJoint : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Joint* arg0 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_DestroyJoint : Error processing arguments");
        cobj->DestroyJoint(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_DestroyJoint)

static bool js_box2dclasses_b2World_GetJointCount(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetJointCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetJointCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetJointCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetJointCount)

static bool js_box2dclasses_b2World_Step(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_Step : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        float arg0 = 0;
        int arg1 = 0;
        int arg2 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_int32(args[1], (int32_t*)&arg1);
        ok &= seval_to_int32(args[2], (int32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_Step : Error processing arguments");
        cobj->Step(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_Step)

static bool js_box2dclasses_b2World_ClearForces(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_ClearForces : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->ClearForces();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_ClearForces)

static bool js_box2dclasses_b2World_GetWarmStarting(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetWarmStarting : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->GetWarmStarting();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetWarmStarting : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetWarmStarting)

static bool js_box2dclasses_b2World_SetAllowSleeping(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_SetAllowSleeping : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_SetAllowSleeping : Error processing arguments");
        cobj->SetAllowSleeping(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_SetAllowSleeping)

static bool js_box2dclasses_b2World_DestroyBody(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_DestroyBody : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Body* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_DestroyBody : Error processing arguments");
        cobj->DestroyBody(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_DestroyBody)

static bool js_box2dclasses_b2World_GetAllowSleeping(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetAllowSleeping : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->GetAllowSleeping();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetAllowSleeping : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetAllowSleeping)

static bool js_box2dclasses_b2World_GetProxyCount(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetProxyCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetProxyCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetProxyCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetProxyCount)

static bool js_box2dclasses_b2World_RayCast(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_RayCast : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        b2RayCastCallback* arg0 = nullptr;
        b2Vec2 arg1;
        b2Vec2 arg2;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_b2Vec2(args[1], &arg1);
        ok &= seval_to_b2Vec2(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_RayCast : Error processing arguments");
        cobj->RayCast(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_RayCast)

static bool js_box2dclasses_b2World_IsLocked(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_IsLocked : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsLocked();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_IsLocked : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_IsLocked)

static bool js_box2dclasses_b2World_SetDebugDraw(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_SetDebugDraw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Draw* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_SetDebugDraw : Error processing arguments");
        cobj->SetDebugDraw(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_SetDebugDraw)

static bool js_box2dclasses_b2World_Dump(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_Dump)

static bool js_box2dclasses_b2World_SetAutoClearForces(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_SetAutoClearForces : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_SetAutoClearForces : Error processing arguments");
        cobj->SetAutoClearForces(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_SetAutoClearForces)

static bool js_box2dclasses_b2World_GetGravity(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetGravity : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetGravity();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetGravity : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetGravity)

static bool js_box2dclasses_b2World_GetContactCount(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_GetContactCount : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetContactCount();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_GetContactCount : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_GetContactCount)

static bool js_box2dclasses_b2World_SetWarmStarting(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_SetWarmStarting : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_SetWarmStarting : Error processing arguments");
        cobj->SetWarmStarting(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_SetWarmStarting)

static bool js_box2dclasses_b2World_SetContactFilter(se::State& s)
{
    b2World* cobj = (b2World*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2World_SetContactFilter : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2ContactFilter* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_SetContactFilter : Error processing arguments");
        cobj->SetContactFilter(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2World_SetContactFilter)

SE_DECLARE_FINALIZE_FUNC(js_b2World_finalize)

static bool js_box2dclasses_b2World_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    b2Vec2 arg0;
    ok &= seval_to_b2Vec2(args[0], &arg0);
    SE_PRECONDITION2(ok, false, "js_box2dclasses_b2World_constructor : Error processing arguments");
    b2World* cobj = new (std::nothrow) b2World(arg0);
    s.thisObject()->setPrivateData(cobj);
    se::NonRefNativePtrCreatedByCtorMap::emplace(cobj);
    return true;
}
SE_BIND_CTOR(js_box2dclasses_b2World_constructor, __jsb_b2World_class, js_b2World_finalize)




static bool js_b2World_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2World)", s.nativeThisObject());
    auto iter = se::NonRefNativePtrCreatedByCtorMap::find(s.nativeThisObject());
    if (iter != se::NonRefNativePtrCreatedByCtorMap::end())
    {
        se::NonRefNativePtrCreatedByCtorMap::erase(iter);
        b2World* cobj = (b2World*)s.nativeThisObject();
        delete cobj;
    }
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2World_finalize)

bool js_register_box2dclasses_b2World(se::Object* obj)
{
    auto cls = se::Class::create("World", obj, nullptr, _SE(js_box2dclasses_b2World_constructor));

    cls->defineFunction("ShiftOrigin", _SE(js_box2dclasses_b2World_ShiftOrigin));
    cls->defineFunction("QueryAABB", _SE(js_box2dclasses_b2World_QueryAABB));
    cls->defineFunction("SetSubStepping", _SE(js_box2dclasses_b2World_SetSubStepping));
    cls->defineFunction("GetTreeQuality", _SE(js_box2dclasses_b2World_GetTreeQuality));
    cls->defineFunction("GetTreeHeight", _SE(js_box2dclasses_b2World_GetTreeHeight));
    cls->defineFunction("GetProfile", _SE(js_box2dclasses_b2World_GetProfile));
    cls->defineFunction("GetTreeBalance", _SE(js_box2dclasses_b2World_GetTreeBalance));
    cls->defineFunction("GetSubStepping", _SE(js_box2dclasses_b2World_GetSubStepping));
    cls->defineFunction("SetContactListener", _SE(js_box2dclasses_b2World_SetContactListener));
    cls->defineFunction("DrawDebugData", _SE(js_box2dclasses_b2World_DrawDebugData));
    cls->defineFunction("SetContinuousPhysics", _SE(js_box2dclasses_b2World_SetContinuousPhysics));
    cls->defineFunction("SetGravity", _SE(js_box2dclasses_b2World_SetGravity));
    cls->defineFunction("GetBodyCount", _SE(js_box2dclasses_b2World_GetBodyCount));
    cls->defineFunction("GetAutoClearForces", _SE(js_box2dclasses_b2World_GetAutoClearForces));
    cls->defineFunction("GetContinuousPhysics", _SE(js_box2dclasses_b2World_GetContinuousPhysics));
    cls->defineFunction("GetJointList", _SE(js_box2dclasses_b2World_GetJointList));
    cls->defineFunction("GetBodyList", _SE(js_box2dclasses_b2World_GetBodyList));
    cls->defineFunction("SetDestructionListener", _SE(js_box2dclasses_b2World_SetDestructionListener));
    cls->defineFunction("DestroyJoint", _SE(js_box2dclasses_b2World_DestroyJoint));
    cls->defineFunction("GetJointCount", _SE(js_box2dclasses_b2World_GetJointCount));
    cls->defineFunction("Step", _SE(js_box2dclasses_b2World_Step));
    cls->defineFunction("ClearForces", _SE(js_box2dclasses_b2World_ClearForces));
    cls->defineFunction("GetWarmStarting", _SE(js_box2dclasses_b2World_GetWarmStarting));
    cls->defineFunction("SetAllowSleeping", _SE(js_box2dclasses_b2World_SetAllowSleeping));
    cls->defineFunction("DestroyBody", _SE(js_box2dclasses_b2World_DestroyBody));
    cls->defineFunction("GetAllowSleeping", _SE(js_box2dclasses_b2World_GetAllowSleeping));
    cls->defineFunction("GetProxyCount", _SE(js_box2dclasses_b2World_GetProxyCount));
    cls->defineFunction("RayCast", _SE(js_box2dclasses_b2World_RayCast));
    cls->defineFunction("IsLocked", _SE(js_box2dclasses_b2World_IsLocked));
    cls->defineFunction("SetDebugDraw", _SE(js_box2dclasses_b2World_SetDebugDraw));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2World_Dump));
    cls->defineFunction("SetAutoClearForces", _SE(js_box2dclasses_b2World_SetAutoClearForces));
    cls->defineFunction("GetGravity", _SE(js_box2dclasses_b2World_GetGravity));
    cls->defineFunction("GetContactCount", _SE(js_box2dclasses_b2World_GetContactCount));
    cls->defineFunction("SetWarmStarting", _SE(js_box2dclasses_b2World_SetWarmStarting));
    cls->defineFunction("SetContactFilter", _SE(js_box2dclasses_b2World_SetContactFilter));
    cls->defineFinalizeFunction(_SE(js_b2World_finalize));
    cls->install();
    JSBClassType::registerClass<b2World>(cls);

    __jsb_b2World_proto = cls->getProto();
    __jsb_b2World_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2Contact_proto = nullptr;
se::Class* __jsb_b2Contact_class = nullptr;

static bool js_box2dclasses_b2Contact_GetNext(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2Contact_GetNext : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2Contact* result = cobj->GetNext();
            ok &= native_ptr_to_rooted_seval<b2Contact>((b2Contact*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetNext : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2Contact* result = cobj->GetNext();
            ok &= native_ptr_to_rooted_seval<b2Contact>((b2Contact*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetNext : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_GetNext)

static bool js_box2dclasses_b2Contact_SetEnabled(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_SetEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_SetEnabled : Error processing arguments");
        cobj->SetEnabled(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_SetEnabled)

static bool js_box2dclasses_b2Contact_GetWorldManifold(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_GetWorldManifold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2WorldManifold* arg0 = nullptr;
        #pragma warning NO CONVERSION TO NATIVE FOR b2WorldManifold*
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetWorldManifold : Error processing arguments");
        cobj->GetWorldManifold(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_GetWorldManifold)

static bool js_box2dclasses_b2Contact_GetRestitution(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_GetRestitution : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetRestitution();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetRestitution : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_GetRestitution)

static bool js_box2dclasses_b2Contact_ResetFriction(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_ResetFriction : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->ResetFriction();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_ResetFriction)

static bool js_box2dclasses_b2Contact_GetFriction(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_GetFriction : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetFriction();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetFriction : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_GetFriction)

static bool js_box2dclasses_b2Contact_IsTouching(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_IsTouching : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsTouching();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_IsTouching : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_IsTouching)

static bool js_box2dclasses_b2Contact_IsEnabled(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_IsEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_IsEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_IsEnabled)

static bool js_box2dclasses_b2Contact_GetFixtureB(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2Contact_GetFixtureB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2Fixture* result = cobj->GetFixtureB();
            ok &= native_ptr_to_rooted_seval<b2Fixture>((b2Fixture*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetFixtureB : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2Fixture* result = cobj->GetFixtureB();
            ok &= native_ptr_to_rooted_seval<b2Fixture>((b2Fixture*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetFixtureB : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_GetFixtureB)

static bool js_box2dclasses_b2Contact_SetFriction(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_SetFriction : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_SetFriction : Error processing arguments");
        cobj->SetFriction(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_SetFriction)

static bool js_box2dclasses_b2Contact_GetFixtureA(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2Contact_GetFixtureA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2Fixture* result = cobj->GetFixtureA();
            ok &= native_ptr_to_rooted_seval<b2Fixture>((b2Fixture*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetFixtureA : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2Fixture* result = cobj->GetFixtureA();
            ok &= native_ptr_to_rooted_seval<b2Fixture>((b2Fixture*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetFixtureA : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_GetFixtureA)

static bool js_box2dclasses_b2Contact_GetChildIndexA(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_GetChildIndexA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetChildIndexA();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetChildIndexA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_GetChildIndexA)

static bool js_box2dclasses_b2Contact_GetChildIndexB(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_GetChildIndexB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        int result = cobj->GetChildIndexB();
        ok &= int32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetChildIndexB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_GetChildIndexB)

static bool js_box2dclasses_b2Contact_SetTangentSpeed(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_SetTangentSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_SetTangentSpeed : Error processing arguments");
        cobj->SetTangentSpeed(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_SetTangentSpeed)

static bool js_box2dclasses_b2Contact_GetTangentSpeed(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_GetTangentSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetTangentSpeed();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetTangentSpeed : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_GetTangentSpeed)

static bool js_box2dclasses_b2Contact_SetRestitution(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_SetRestitution : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_SetRestitution : Error processing arguments");
        cobj->SetRestitution(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_SetRestitution)

static bool js_box2dclasses_b2Contact_GetManifold(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2Contact_GetManifold : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2Manifold* result = cobj->GetManifold();
            ok &= b2Manifold_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetManifold : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2Manifold* result = cobj->GetManifold();
            ok &= b2Manifold_to_seval(result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_GetManifold : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_GetManifold)

static bool js_box2dclasses_b2Contact_Evaluate(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_Evaluate : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        b2Manifold* arg0 = nullptr;
        b2Transform arg1;
        b2Transform arg2;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Manifold*
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        #pragma warning NO CONVERSION TO NATIVE FOR b2Transform
        ok = false;
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Contact_Evaluate : Error processing arguments");
        cobj->Evaluate(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_Evaluate)

static bool js_box2dclasses_b2Contact_ResetRestitution(se::State& s)
{
    b2Contact* cobj = (b2Contact*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Contact_ResetRestitution : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->ResetRestitution();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Contact_ResetRestitution)



static bool js_b2Contact_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2Contact)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2Contact_finalize)

bool js_register_box2dclasses_b2Contact(se::Object* obj)
{
    auto cls = se::Class::create("Contact", obj, nullptr, nullptr);

    cls->defineFunction("GetNext", _SE(js_box2dclasses_b2Contact_GetNext));
    cls->defineFunction("SetEnabled", _SE(js_box2dclasses_b2Contact_SetEnabled));
    cls->defineFunction("GetWorldManifold", _SE(js_box2dclasses_b2Contact_GetWorldManifold));
    cls->defineFunction("GetRestitution", _SE(js_box2dclasses_b2Contact_GetRestitution));
    cls->defineFunction("ResetFriction", _SE(js_box2dclasses_b2Contact_ResetFriction));
    cls->defineFunction("GetFriction", _SE(js_box2dclasses_b2Contact_GetFriction));
    cls->defineFunction("IsTouching", _SE(js_box2dclasses_b2Contact_IsTouching));
    cls->defineFunction("IsEnabled", _SE(js_box2dclasses_b2Contact_IsEnabled));
    cls->defineFunction("GetFixtureB", _SE(js_box2dclasses_b2Contact_GetFixtureB));
    cls->defineFunction("SetFriction", _SE(js_box2dclasses_b2Contact_SetFriction));
    cls->defineFunction("GetFixtureA", _SE(js_box2dclasses_b2Contact_GetFixtureA));
    cls->defineFunction("GetChildIndexA", _SE(js_box2dclasses_b2Contact_GetChildIndexA));
    cls->defineFunction("GetChildIndexB", _SE(js_box2dclasses_b2Contact_GetChildIndexB));
    cls->defineFunction("SetTangentSpeed", _SE(js_box2dclasses_b2Contact_SetTangentSpeed));
    cls->defineFunction("GetTangentSpeed", _SE(js_box2dclasses_b2Contact_GetTangentSpeed));
    cls->defineFunction("SetRestitution", _SE(js_box2dclasses_b2Contact_SetRestitution));
    cls->defineFunction("GetManifold", _SE(js_box2dclasses_b2Contact_GetManifold));
    cls->defineFunction("Evaluate", _SE(js_box2dclasses_b2Contact_Evaluate));
    cls->defineFunction("ResetRestitution", _SE(js_box2dclasses_b2Contact_ResetRestitution));
    cls->defineFinalizeFunction(_SE(js_b2Contact_finalize));
    cls->install();
    JSBClassType::registerClass<b2Contact>(cls);

    __jsb_b2Contact_proto = cls->getProto();
    __jsb_b2Contact_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2Joint_proto = nullptr;
se::Class* __jsb_b2Joint_class = nullptr;

static bool js_box2dclasses_b2Joint_GetNext(se::State& s)
{
    CC_UNUSED bool ok = true;
    b2Joint* cobj = (b2Joint*)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_box2dclasses_b2Joint_GetNext : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    do {
        if (argc == 0) {
            const b2Joint* result = cobj->GetNext();
            ok &= native_ptr_to_rooted_seval<b2Joint>((b2Joint*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_GetNext : Error processing arguments");
            return true;
        }
    } while(false);

    do {
        if (argc == 0) {
            b2Joint* result = cobj->GetNext();
            ok &= native_ptr_to_rooted_seval<b2Joint>((b2Joint*)result, &s.rval());
            SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_GetNext : Error processing arguments");
            return true;
        }
    } while(false);

    SE_REPORT_ERROR("wrong number of arguments: %d", (int)argc);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Joint_GetNext)

static bool js_box2dclasses_b2Joint_GetBodyA(se::State& s)
{
    b2Joint* cobj = (b2Joint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Joint_GetBodyA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Body* result = cobj->GetBodyA();
        ok &= native_ptr_to_rooted_seval<b2Body>((b2Body*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_GetBodyA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Joint_GetBodyA)

static bool js_box2dclasses_b2Joint_GetBodyB(se::State& s)
{
    b2Joint* cobj = (b2Joint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Joint_GetBodyB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Body* result = cobj->GetBodyB();
        ok &= native_ptr_to_rooted_seval<b2Body>((b2Body*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_GetBodyB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Joint_GetBodyB)

static bool js_box2dclasses_b2Joint_GetReactionTorque(se::State& s)
{
    b2Joint* cobj = (b2Joint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Joint_GetReactionTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_GetReactionTorque : Error processing arguments");
        float result = cobj->GetReactionTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_GetReactionTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Joint_GetReactionTorque)

static bool js_box2dclasses_b2Joint_GetAnchorA(se::State& s)
{
    b2Joint* cobj = (b2Joint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Joint_GetAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_GetAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Joint_GetAnchorA)

static bool js_box2dclasses_b2Joint_ShiftOrigin(se::State& s)
{
    b2Joint* cobj = (b2Joint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Joint_ShiftOrigin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_ShiftOrigin : Error processing arguments");
        cobj->ShiftOrigin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Joint_ShiftOrigin)

static bool js_box2dclasses_b2Joint_GetType(se::State& s)
{
    b2Joint* cobj = (b2Joint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Joint_GetType : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = (unsigned int)cobj->GetType();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_GetType : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Joint_GetType)

static bool js_box2dclasses_b2Joint_GetCollideConnected(se::State& s)
{
    b2Joint* cobj = (b2Joint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Joint_GetCollideConnected : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->GetCollideConnected();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_GetCollideConnected : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Joint_GetCollideConnected)

static bool js_box2dclasses_b2Joint_Dump(se::State& s)
{
    b2Joint* cobj = (b2Joint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Joint_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Joint_Dump)

static bool js_box2dclasses_b2Joint_GetAnchorB(se::State& s)
{
    b2Joint* cobj = (b2Joint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Joint_GetAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_GetAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Joint_GetAnchorB)

static bool js_box2dclasses_b2Joint_GetReactionForce(se::State& s)
{
    b2Joint* cobj = (b2Joint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Joint_GetReactionForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_GetReactionForce : Error processing arguments");
        b2Vec2 result = cobj->GetReactionForce(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_GetReactionForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Joint_GetReactionForce)

static bool js_box2dclasses_b2Joint_IsActive(se::State& s)
{
    b2Joint* cobj = (b2Joint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2Joint_IsActive : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsActive();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2Joint_IsActive : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2Joint_IsActive)



static bool js_b2Joint_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2Joint)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2Joint_finalize)

bool js_register_box2dclasses_b2Joint(se::Object* obj)
{
    auto cls = se::Class::create("Joint", obj, nullptr, nullptr);

    cls->defineFunction("GetNext", _SE(js_box2dclasses_b2Joint_GetNext));
    cls->defineFunction("GetBodyA", _SE(js_box2dclasses_b2Joint_GetBodyA));
    cls->defineFunction("GetBodyB", _SE(js_box2dclasses_b2Joint_GetBodyB));
    cls->defineFunction("GetReactionTorque", _SE(js_box2dclasses_b2Joint_GetReactionTorque));
    cls->defineFunction("GetAnchorA", _SE(js_box2dclasses_b2Joint_GetAnchorA));
    cls->defineFunction("ShiftOrigin", _SE(js_box2dclasses_b2Joint_ShiftOrigin));
    cls->defineFunction("GetType", _SE(js_box2dclasses_b2Joint_GetType));
    cls->defineFunction("GetCollideConnected", _SE(js_box2dclasses_b2Joint_GetCollideConnected));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2Joint_Dump));
    cls->defineFunction("GetAnchorB", _SE(js_box2dclasses_b2Joint_GetAnchorB));
    cls->defineFunction("GetReactionForce", _SE(js_box2dclasses_b2Joint_GetReactionForce));
    cls->defineFunction("IsActive", _SE(js_box2dclasses_b2Joint_IsActive));
    cls->defineFinalizeFunction(_SE(js_b2Joint_finalize));
    cls->install();
    JSBClassType::registerClass<b2Joint>(cls);

    __jsb_b2Joint_proto = cls->getProto();
    __jsb_b2Joint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2DistanceJoint_proto = nullptr;
se::Class* __jsb_b2DistanceJoint_class = nullptr;

static bool js_box2dclasses_b2DistanceJoint_SetDampingRatio(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_SetDampingRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_SetDampingRatio : Error processing arguments");
        cobj->SetDampingRatio(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_SetDampingRatio)

static bool js_box2dclasses_b2DistanceJoint_GetAnchorA(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_GetAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_GetAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_GetAnchorA)

static bool js_box2dclasses_b2DistanceJoint_GetReactionTorque(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_GetReactionTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_GetReactionTorque : Error processing arguments");
        float result = cobj->GetReactionTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_GetReactionTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_GetReactionTorque)

static bool js_box2dclasses_b2DistanceJoint_Dump(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_Dump)

static bool js_box2dclasses_b2DistanceJoint_SetFrequency(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_SetFrequency : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_SetFrequency : Error processing arguments");
        cobj->SetFrequency(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_SetFrequency)

static bool js_box2dclasses_b2DistanceJoint_GetLength(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_GetLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetLength();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_GetLength : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_GetLength)

static bool js_box2dclasses_b2DistanceJoint_GetDampingRatio(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_GetDampingRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetDampingRatio();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_GetDampingRatio : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_GetDampingRatio)

static bool js_box2dclasses_b2DistanceJoint_GetFrequency(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_GetFrequency : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetFrequency();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_GetFrequency : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_GetFrequency)

static bool js_box2dclasses_b2DistanceJoint_GetLocalAnchorA(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_GetLocalAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_GetLocalAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_GetLocalAnchorA)

static bool js_box2dclasses_b2DistanceJoint_GetLocalAnchorB(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_GetLocalAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_GetLocalAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_GetLocalAnchorB)

static bool js_box2dclasses_b2DistanceJoint_GetAnchorB(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_GetAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_GetAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_GetAnchorB)

static bool js_box2dclasses_b2DistanceJoint_GetReactionForce(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_GetReactionForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_GetReactionForce : Error processing arguments");
        b2Vec2 result = cobj->GetReactionForce(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_GetReactionForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_GetReactionForce)

static bool js_box2dclasses_b2DistanceJoint_SetLength(se::State& s)
{
    b2DistanceJoint* cobj = (b2DistanceJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2DistanceJoint_SetLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2DistanceJoint_SetLength : Error processing arguments");
        cobj->SetLength(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2DistanceJoint_SetLength)


extern se::Object* __jsb_b2Joint_proto;

static bool js_b2DistanceJoint_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2DistanceJoint)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2DistanceJoint_finalize)

bool js_register_box2dclasses_b2DistanceJoint(se::Object* obj)
{
    auto cls = se::Class::create("b2DistanceJoint", obj, __jsb_b2Joint_proto, nullptr);

    cls->defineFunction("SetDampingRatio", _SE(js_box2dclasses_b2DistanceJoint_SetDampingRatio));
    cls->defineFunction("GetAnchorA", _SE(js_box2dclasses_b2DistanceJoint_GetAnchorA));
    cls->defineFunction("GetReactionTorque", _SE(js_box2dclasses_b2DistanceJoint_GetReactionTorque));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2DistanceJoint_Dump));
    cls->defineFunction("SetFrequency", _SE(js_box2dclasses_b2DistanceJoint_SetFrequency));
    cls->defineFunction("GetLength", _SE(js_box2dclasses_b2DistanceJoint_GetLength));
    cls->defineFunction("GetDampingRatio", _SE(js_box2dclasses_b2DistanceJoint_GetDampingRatio));
    cls->defineFunction("GetFrequency", _SE(js_box2dclasses_b2DistanceJoint_GetFrequency));
    cls->defineFunction("GetLocalAnchorA", _SE(js_box2dclasses_b2DistanceJoint_GetLocalAnchorA));
    cls->defineFunction("GetLocalAnchorB", _SE(js_box2dclasses_b2DistanceJoint_GetLocalAnchorB));
    cls->defineFunction("GetAnchorB", _SE(js_box2dclasses_b2DistanceJoint_GetAnchorB));
    cls->defineFunction("GetReactionForce", _SE(js_box2dclasses_b2DistanceJoint_GetReactionForce));
    cls->defineFunction("SetLength", _SE(js_box2dclasses_b2DistanceJoint_SetLength));
    cls->defineFinalizeFunction(_SE(js_b2DistanceJoint_finalize));
    cls->install();
    JSBClassType::registerClass<b2DistanceJoint>(cls);

    __jsb_b2DistanceJoint_proto = cls->getProto();
    __jsb_b2DistanceJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2FrictionJoint_proto = nullptr;
se::Class* __jsb_b2FrictionJoint_class = nullptr;

static bool js_box2dclasses_b2FrictionJoint_SetMaxTorque(se::State& s)
{
    b2FrictionJoint* cobj = (b2FrictionJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2FrictionJoint_SetMaxTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2FrictionJoint_SetMaxTorque : Error processing arguments");
        cobj->SetMaxTorque(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2FrictionJoint_SetMaxTorque)

static bool js_box2dclasses_b2FrictionJoint_GetMaxForce(se::State& s)
{
    b2FrictionJoint* cobj = (b2FrictionJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2FrictionJoint_GetMaxForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMaxForce();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2FrictionJoint_GetMaxForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2FrictionJoint_GetMaxForce)

static bool js_box2dclasses_b2FrictionJoint_GetAnchorA(se::State& s)
{
    b2FrictionJoint* cobj = (b2FrictionJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2FrictionJoint_GetAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2FrictionJoint_GetAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2FrictionJoint_GetAnchorA)

static bool js_box2dclasses_b2FrictionJoint_GetReactionTorque(se::State& s)
{
    b2FrictionJoint* cobj = (b2FrictionJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2FrictionJoint_GetReactionTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2FrictionJoint_GetReactionTorque : Error processing arguments");
        float result = cobj->GetReactionTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2FrictionJoint_GetReactionTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2FrictionJoint_GetReactionTorque)

static bool js_box2dclasses_b2FrictionJoint_Dump(se::State& s)
{
    b2FrictionJoint* cobj = (b2FrictionJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2FrictionJoint_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2FrictionJoint_Dump)

static bool js_box2dclasses_b2FrictionJoint_SetMaxForce(se::State& s)
{
    b2FrictionJoint* cobj = (b2FrictionJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2FrictionJoint_SetMaxForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2FrictionJoint_SetMaxForce : Error processing arguments");
        cobj->SetMaxForce(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2FrictionJoint_SetMaxForce)

static bool js_box2dclasses_b2FrictionJoint_GetLocalAnchorA(se::State& s)
{
    b2FrictionJoint* cobj = (b2FrictionJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2FrictionJoint_GetLocalAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2FrictionJoint_GetLocalAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2FrictionJoint_GetLocalAnchorA)

static bool js_box2dclasses_b2FrictionJoint_GetLocalAnchorB(se::State& s)
{
    b2FrictionJoint* cobj = (b2FrictionJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2FrictionJoint_GetLocalAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2FrictionJoint_GetLocalAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2FrictionJoint_GetLocalAnchorB)

static bool js_box2dclasses_b2FrictionJoint_GetAnchorB(se::State& s)
{
    b2FrictionJoint* cobj = (b2FrictionJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2FrictionJoint_GetAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2FrictionJoint_GetAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2FrictionJoint_GetAnchorB)

static bool js_box2dclasses_b2FrictionJoint_GetReactionForce(se::State& s)
{
    b2FrictionJoint* cobj = (b2FrictionJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2FrictionJoint_GetReactionForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2FrictionJoint_GetReactionForce : Error processing arguments");
        b2Vec2 result = cobj->GetReactionForce(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2FrictionJoint_GetReactionForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2FrictionJoint_GetReactionForce)

static bool js_box2dclasses_b2FrictionJoint_GetMaxTorque(se::State& s)
{
    b2FrictionJoint* cobj = (b2FrictionJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2FrictionJoint_GetMaxTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMaxTorque();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2FrictionJoint_GetMaxTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2FrictionJoint_GetMaxTorque)


extern se::Object* __jsb_b2Joint_proto;

static bool js_b2FrictionJoint_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2FrictionJoint)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2FrictionJoint_finalize)

bool js_register_box2dclasses_b2FrictionJoint(se::Object* obj)
{
    auto cls = se::Class::create("b2FrictionJoint", obj, __jsb_b2Joint_proto, nullptr);

    cls->defineFunction("SetMaxTorque", _SE(js_box2dclasses_b2FrictionJoint_SetMaxTorque));
    cls->defineFunction("GetMaxForce", _SE(js_box2dclasses_b2FrictionJoint_GetMaxForce));
    cls->defineFunction("GetAnchorA", _SE(js_box2dclasses_b2FrictionJoint_GetAnchorA));
    cls->defineFunction("GetReactionTorque", _SE(js_box2dclasses_b2FrictionJoint_GetReactionTorque));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2FrictionJoint_Dump));
    cls->defineFunction("SetMaxForce", _SE(js_box2dclasses_b2FrictionJoint_SetMaxForce));
    cls->defineFunction("GetLocalAnchorA", _SE(js_box2dclasses_b2FrictionJoint_GetLocalAnchorA));
    cls->defineFunction("GetLocalAnchorB", _SE(js_box2dclasses_b2FrictionJoint_GetLocalAnchorB));
    cls->defineFunction("GetAnchorB", _SE(js_box2dclasses_b2FrictionJoint_GetAnchorB));
    cls->defineFunction("GetReactionForce", _SE(js_box2dclasses_b2FrictionJoint_GetReactionForce));
    cls->defineFunction("GetMaxTorque", _SE(js_box2dclasses_b2FrictionJoint_GetMaxTorque));
    cls->defineFinalizeFunction(_SE(js_b2FrictionJoint_finalize));
    cls->install();
    JSBClassType::registerClass<b2FrictionJoint>(cls);

    __jsb_b2FrictionJoint_proto = cls->getProto();
    __jsb_b2FrictionJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2GearJoint_proto = nullptr;
se::Class* __jsb_b2GearJoint_class = nullptr;

static bool js_box2dclasses_b2GearJoint_GetJoint1(se::State& s)
{
    b2GearJoint* cobj = (b2GearJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2GearJoint_GetJoint1 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Joint* result = cobj->GetJoint1();
        ok &= native_ptr_to_rooted_seval<b2Joint>((b2Joint*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2GearJoint_GetJoint1 : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2GearJoint_GetJoint1)

static bool js_box2dclasses_b2GearJoint_GetAnchorA(se::State& s)
{
    b2GearJoint* cobj = (b2GearJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2GearJoint_GetAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2GearJoint_GetAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2GearJoint_GetAnchorA)

static bool js_box2dclasses_b2GearJoint_GetJoint2(se::State& s)
{
    b2GearJoint* cobj = (b2GearJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2GearJoint_GetJoint2 : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Joint* result = cobj->GetJoint2();
        ok &= native_ptr_to_rooted_seval<b2Joint>((b2Joint*)result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2GearJoint_GetJoint2 : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2GearJoint_GetJoint2)

static bool js_box2dclasses_b2GearJoint_GetReactionTorque(se::State& s)
{
    b2GearJoint* cobj = (b2GearJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2GearJoint_GetReactionTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2GearJoint_GetReactionTorque : Error processing arguments");
        float result = cobj->GetReactionTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2GearJoint_GetReactionTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2GearJoint_GetReactionTorque)

static bool js_box2dclasses_b2GearJoint_Dump(se::State& s)
{
    b2GearJoint* cobj = (b2GearJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2GearJoint_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2GearJoint_Dump)

static bool js_box2dclasses_b2GearJoint_SetRatio(se::State& s)
{
    b2GearJoint* cobj = (b2GearJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2GearJoint_SetRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2GearJoint_SetRatio : Error processing arguments");
        cobj->SetRatio(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2GearJoint_SetRatio)

static bool js_box2dclasses_b2GearJoint_GetAnchorB(se::State& s)
{
    b2GearJoint* cobj = (b2GearJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2GearJoint_GetAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2GearJoint_GetAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2GearJoint_GetAnchorB)

static bool js_box2dclasses_b2GearJoint_GetReactionForce(se::State& s)
{
    b2GearJoint* cobj = (b2GearJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2GearJoint_GetReactionForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2GearJoint_GetReactionForce : Error processing arguments");
        b2Vec2 result = cobj->GetReactionForce(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2GearJoint_GetReactionForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2GearJoint_GetReactionForce)

static bool js_box2dclasses_b2GearJoint_GetRatio(se::State& s)
{
    b2GearJoint* cobj = (b2GearJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2GearJoint_GetRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetRatio();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2GearJoint_GetRatio : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2GearJoint_GetRatio)


extern se::Object* __jsb_b2Joint_proto;

static bool js_b2GearJoint_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2GearJoint)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2GearJoint_finalize)

bool js_register_box2dclasses_b2GearJoint(se::Object* obj)
{
    auto cls = se::Class::create("b2GearJoint", obj, __jsb_b2Joint_proto, nullptr);

    cls->defineFunction("GetJoint1", _SE(js_box2dclasses_b2GearJoint_GetJoint1));
    cls->defineFunction("GetAnchorA", _SE(js_box2dclasses_b2GearJoint_GetAnchorA));
    cls->defineFunction("GetJoint2", _SE(js_box2dclasses_b2GearJoint_GetJoint2));
    cls->defineFunction("GetReactionTorque", _SE(js_box2dclasses_b2GearJoint_GetReactionTorque));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2GearJoint_Dump));
    cls->defineFunction("SetRatio", _SE(js_box2dclasses_b2GearJoint_SetRatio));
    cls->defineFunction("GetAnchorB", _SE(js_box2dclasses_b2GearJoint_GetAnchorB));
    cls->defineFunction("GetReactionForce", _SE(js_box2dclasses_b2GearJoint_GetReactionForce));
    cls->defineFunction("GetRatio", _SE(js_box2dclasses_b2GearJoint_GetRatio));
    cls->defineFinalizeFunction(_SE(js_b2GearJoint_finalize));
    cls->install();
    JSBClassType::registerClass<b2GearJoint>(cls);

    __jsb_b2GearJoint_proto = cls->getProto();
    __jsb_b2GearJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2MotorJoint_proto = nullptr;
se::Class* __jsb_b2MotorJoint_class = nullptr;

static bool js_box2dclasses_b2MotorJoint_SetMaxTorque(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_SetMaxTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_SetMaxTorque : Error processing arguments");
        cobj->SetMaxTorque(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_SetMaxTorque)

static bool js_box2dclasses_b2MotorJoint_GetAnchorA(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_GetAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_GetAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_GetAnchorA)

static bool js_box2dclasses_b2MotorJoint_GetReactionTorque(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_GetReactionTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_GetReactionTorque : Error processing arguments");
        float result = cobj->GetReactionTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_GetReactionTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_GetReactionTorque)

static bool js_box2dclasses_b2MotorJoint_GetCorrectionFactor(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_GetCorrectionFactor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetCorrectionFactor();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_GetCorrectionFactor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_GetCorrectionFactor)

static bool js_box2dclasses_b2MotorJoint_SetMaxForce(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_SetMaxForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_SetMaxForce : Error processing arguments");
        cobj->SetMaxForce(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_SetMaxForce)

static bool js_box2dclasses_b2MotorJoint_SetLinearOffset(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_SetLinearOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_SetLinearOffset : Error processing arguments");
        cobj->SetLinearOffset(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_SetLinearOffset)

static bool js_box2dclasses_b2MotorJoint_GetMaxForce(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_GetMaxForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMaxForce();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_GetMaxForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_GetMaxForce)

static bool js_box2dclasses_b2MotorJoint_Dump(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_Dump)

static bool js_box2dclasses_b2MotorJoint_SetAngularOffset(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_SetAngularOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_SetAngularOffset : Error processing arguments");
        cobj->SetAngularOffset(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_SetAngularOffset)

static bool js_box2dclasses_b2MotorJoint_GetAnchorB(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_GetAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_GetAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_GetAnchorB)

static bool js_box2dclasses_b2MotorJoint_GetReactionForce(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_GetReactionForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_GetReactionForce : Error processing arguments");
        b2Vec2 result = cobj->GetReactionForce(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_GetReactionForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_GetReactionForce)

static bool js_box2dclasses_b2MotorJoint_GetAngularOffset(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_GetAngularOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetAngularOffset();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_GetAngularOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_GetAngularOffset)

static bool js_box2dclasses_b2MotorJoint_GetLinearOffset(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_GetLinearOffset : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLinearOffset();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_GetLinearOffset : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_GetLinearOffset)

static bool js_box2dclasses_b2MotorJoint_GetMaxTorque(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_GetMaxTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMaxTorque();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_GetMaxTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_GetMaxTorque)

static bool js_box2dclasses_b2MotorJoint_SetCorrectionFactor(se::State& s)
{
    b2MotorJoint* cobj = (b2MotorJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MotorJoint_SetCorrectionFactor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MotorJoint_SetCorrectionFactor : Error processing arguments");
        cobj->SetCorrectionFactor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MotorJoint_SetCorrectionFactor)


extern se::Object* __jsb_b2Joint_proto;

static bool js_b2MotorJoint_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2MotorJoint)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2MotorJoint_finalize)

bool js_register_box2dclasses_b2MotorJoint(se::Object* obj)
{
    auto cls = se::Class::create("b2MotorJoint", obj, __jsb_b2Joint_proto, nullptr);

    cls->defineFunction("SetMaxTorque", _SE(js_box2dclasses_b2MotorJoint_SetMaxTorque));
    cls->defineFunction("GetAnchorA", _SE(js_box2dclasses_b2MotorJoint_GetAnchorA));
    cls->defineFunction("GetReactionTorque", _SE(js_box2dclasses_b2MotorJoint_GetReactionTorque));
    cls->defineFunction("GetCorrectionFactor", _SE(js_box2dclasses_b2MotorJoint_GetCorrectionFactor));
    cls->defineFunction("SetMaxForce", _SE(js_box2dclasses_b2MotorJoint_SetMaxForce));
    cls->defineFunction("SetLinearOffset", _SE(js_box2dclasses_b2MotorJoint_SetLinearOffset));
    cls->defineFunction("GetMaxForce", _SE(js_box2dclasses_b2MotorJoint_GetMaxForce));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2MotorJoint_Dump));
    cls->defineFunction("SetAngularOffset", _SE(js_box2dclasses_b2MotorJoint_SetAngularOffset));
    cls->defineFunction("GetAnchorB", _SE(js_box2dclasses_b2MotorJoint_GetAnchorB));
    cls->defineFunction("GetReactionForce", _SE(js_box2dclasses_b2MotorJoint_GetReactionForce));
    cls->defineFunction("GetAngularOffset", _SE(js_box2dclasses_b2MotorJoint_GetAngularOffset));
    cls->defineFunction("GetLinearOffset", _SE(js_box2dclasses_b2MotorJoint_GetLinearOffset));
    cls->defineFunction("GetMaxTorque", _SE(js_box2dclasses_b2MotorJoint_GetMaxTorque));
    cls->defineFunction("SetCorrectionFactor", _SE(js_box2dclasses_b2MotorJoint_SetCorrectionFactor));
    cls->defineFinalizeFunction(_SE(js_b2MotorJoint_finalize));
    cls->install();
    JSBClassType::registerClass<b2MotorJoint>(cls);

    __jsb_b2MotorJoint_proto = cls->getProto();
    __jsb_b2MotorJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2MouseJoint_proto = nullptr;
se::Class* __jsb_b2MouseJoint_class = nullptr;

static bool js_box2dclasses_b2MouseJoint_SetDampingRatio(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_SetDampingRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_SetDampingRatio : Error processing arguments");
        cobj->SetDampingRatio(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_SetDampingRatio)

static bool js_box2dclasses_b2MouseJoint_GetAnchorA(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_GetAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_GetAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_GetAnchorA)

static bool js_box2dclasses_b2MouseJoint_GetReactionTorque(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_GetReactionTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_GetReactionTorque : Error processing arguments");
        float result = cobj->GetReactionTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_GetReactionTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_GetReactionTorque)

static bool js_box2dclasses_b2MouseJoint_Dump(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_Dump)

static bool js_box2dclasses_b2MouseJoint_SetFrequency(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_SetFrequency : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_SetFrequency : Error processing arguments");
        cobj->SetFrequency(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_SetFrequency)

static bool js_box2dclasses_b2MouseJoint_GetDampingRatio(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_GetDampingRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetDampingRatio();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_GetDampingRatio : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_GetDampingRatio)

static bool js_box2dclasses_b2MouseJoint_SetTarget(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_SetTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_SetTarget : Error processing arguments");
        cobj->SetTarget(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_SetTarget)

static bool js_box2dclasses_b2MouseJoint_SetMaxForce(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_SetMaxForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_SetMaxForce : Error processing arguments");
        cobj->SetMaxForce(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_SetMaxForce)

static bool js_box2dclasses_b2MouseJoint_GetFrequency(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_GetFrequency : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetFrequency();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_GetFrequency : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_GetFrequency)

static bool js_box2dclasses_b2MouseJoint_GetTarget(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_GetTarget : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetTarget();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_GetTarget : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_GetTarget)

static bool js_box2dclasses_b2MouseJoint_GetMaxForce(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_GetMaxForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMaxForce();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_GetMaxForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_GetMaxForce)

static bool js_box2dclasses_b2MouseJoint_GetAnchorB(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_GetAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_GetAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_GetAnchorB)

static bool js_box2dclasses_b2MouseJoint_GetReactionForce(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_GetReactionForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_GetReactionForce : Error processing arguments");
        b2Vec2 result = cobj->GetReactionForce(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_GetReactionForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_GetReactionForce)

static bool js_box2dclasses_b2MouseJoint_ShiftOrigin(se::State& s)
{
    b2MouseJoint* cobj = (b2MouseJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2MouseJoint_ShiftOrigin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2MouseJoint_ShiftOrigin : Error processing arguments");
        cobj->ShiftOrigin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2MouseJoint_ShiftOrigin)


extern se::Object* __jsb_b2Joint_proto;

static bool js_b2MouseJoint_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2MouseJoint)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2MouseJoint_finalize)

bool js_register_box2dclasses_b2MouseJoint(se::Object* obj)
{
    auto cls = se::Class::create("b2MouseJoint", obj, __jsb_b2Joint_proto, nullptr);

    cls->defineFunction("SetDampingRatio", _SE(js_box2dclasses_b2MouseJoint_SetDampingRatio));
    cls->defineFunction("GetAnchorA", _SE(js_box2dclasses_b2MouseJoint_GetAnchorA));
    cls->defineFunction("GetReactionTorque", _SE(js_box2dclasses_b2MouseJoint_GetReactionTorque));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2MouseJoint_Dump));
    cls->defineFunction("SetFrequency", _SE(js_box2dclasses_b2MouseJoint_SetFrequency));
    cls->defineFunction("GetDampingRatio", _SE(js_box2dclasses_b2MouseJoint_GetDampingRatio));
    cls->defineFunction("SetTarget", _SE(js_box2dclasses_b2MouseJoint_SetTarget));
    cls->defineFunction("SetMaxForce", _SE(js_box2dclasses_b2MouseJoint_SetMaxForce));
    cls->defineFunction("GetFrequency", _SE(js_box2dclasses_b2MouseJoint_GetFrequency));
    cls->defineFunction("GetTarget", _SE(js_box2dclasses_b2MouseJoint_GetTarget));
    cls->defineFunction("GetMaxForce", _SE(js_box2dclasses_b2MouseJoint_GetMaxForce));
    cls->defineFunction("GetAnchorB", _SE(js_box2dclasses_b2MouseJoint_GetAnchorB));
    cls->defineFunction("GetReactionForce", _SE(js_box2dclasses_b2MouseJoint_GetReactionForce));
    cls->defineFunction("ShiftOrigin", _SE(js_box2dclasses_b2MouseJoint_ShiftOrigin));
    cls->defineFinalizeFunction(_SE(js_b2MouseJoint_finalize));
    cls->install();
    JSBClassType::registerClass<b2MouseJoint>(cls);

    __jsb_b2MouseJoint_proto = cls->getProto();
    __jsb_b2MouseJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2PrismaticJoint_proto = nullptr;
se::Class* __jsb_b2PrismaticJoint_class = nullptr;

static bool js_box2dclasses_b2PrismaticJoint_GetLocalAxisA(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetLocalAxisA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAxisA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetLocalAxisA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetLocalAxisA)

static bool js_box2dclasses_b2PrismaticJoint_GetLowerLimit(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetLowerLimit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetLowerLimit();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetLowerLimit : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetLowerLimit)

static bool js_box2dclasses_b2PrismaticJoint_GetAnchorA(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetAnchorA)

static bool js_box2dclasses_b2PrismaticJoint_GetLocalAnchorA(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetLocalAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetLocalAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetLocalAnchorA)

static bool js_box2dclasses_b2PrismaticJoint_SetMotorSpeed(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_SetMotorSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_SetMotorSpeed : Error processing arguments");
        cobj->SetMotorSpeed(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_SetMotorSpeed)

static bool js_box2dclasses_b2PrismaticJoint_GetLocalAnchorB(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetLocalAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetLocalAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetLocalAnchorB)

static bool js_box2dclasses_b2PrismaticJoint_GetMotorSpeed(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetMotorSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMotorSpeed();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetMotorSpeed : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetMotorSpeed)

static bool js_box2dclasses_b2PrismaticJoint_SetMaxMotorForce(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_SetMaxMotorForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_SetMaxMotorForce : Error processing arguments");
        cobj->SetMaxMotorForce(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_SetMaxMotorForce)

static bool js_box2dclasses_b2PrismaticJoint_EnableLimit(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_EnableLimit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_EnableLimit : Error processing arguments");
        cobj->EnableLimit(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_EnableLimit)

static bool js_box2dclasses_b2PrismaticJoint_IsMotorEnabled(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_IsMotorEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsMotorEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_IsMotorEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_IsMotorEnabled)

static bool js_box2dclasses_b2PrismaticJoint_GetReactionForce(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetReactionForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetReactionForce : Error processing arguments");
        b2Vec2 result = cobj->GetReactionForce(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetReactionForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetReactionForce)

static bool js_box2dclasses_b2PrismaticJoint_GetMaxMotorForce(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetMaxMotorForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMaxMotorForce();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetMaxMotorForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetMaxMotorForce)

static bool js_box2dclasses_b2PrismaticJoint_GetJointSpeed(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetJointSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetJointSpeed();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetJointSpeed : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetJointSpeed)

static bool js_box2dclasses_b2PrismaticJoint_EnableMotor(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_EnableMotor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_EnableMotor : Error processing arguments");
        cobj->EnableMotor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_EnableMotor)

static bool js_box2dclasses_b2PrismaticJoint_GetReferenceAngle(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetReferenceAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetReferenceAngle();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetReferenceAngle : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetReferenceAngle)

static bool js_box2dclasses_b2PrismaticJoint_Dump(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_Dump)

static bool js_box2dclasses_b2PrismaticJoint_GetMotorForce(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetMotorForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetMotorForce : Error processing arguments");
        float result = cobj->GetMotorForce(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetMotorForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetMotorForce)

static bool js_box2dclasses_b2PrismaticJoint_GetJointTranslation(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetJointTranslation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetJointTranslation();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetJointTranslation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetJointTranslation)

static bool js_box2dclasses_b2PrismaticJoint_IsLimitEnabled(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_IsLimitEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsLimitEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_IsLimitEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_IsLimitEnabled)

static bool js_box2dclasses_b2PrismaticJoint_GetReactionTorque(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetReactionTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetReactionTorque : Error processing arguments");
        float result = cobj->GetReactionTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetReactionTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetReactionTorque)

static bool js_box2dclasses_b2PrismaticJoint_SetLimits(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_SetLimits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_SetLimits : Error processing arguments");
        cobj->SetLimits(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_SetLimits)

static bool js_box2dclasses_b2PrismaticJoint_GetUpperLimit(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetUpperLimit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetUpperLimit();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetUpperLimit : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetUpperLimit)

static bool js_box2dclasses_b2PrismaticJoint_GetAnchorB(se::State& s)
{
    b2PrismaticJoint* cobj = (b2PrismaticJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PrismaticJoint_GetAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PrismaticJoint_GetAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PrismaticJoint_GetAnchorB)


extern se::Object* __jsb_b2Joint_proto;

static bool js_b2PrismaticJoint_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2PrismaticJoint)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2PrismaticJoint_finalize)

bool js_register_box2dclasses_b2PrismaticJoint(se::Object* obj)
{
    auto cls = se::Class::create("b2PrismaticJoint", obj, __jsb_b2Joint_proto, nullptr);

    cls->defineFunction("GetLocalAxisA", _SE(js_box2dclasses_b2PrismaticJoint_GetLocalAxisA));
    cls->defineFunction("GetLowerLimit", _SE(js_box2dclasses_b2PrismaticJoint_GetLowerLimit));
    cls->defineFunction("GetAnchorA", _SE(js_box2dclasses_b2PrismaticJoint_GetAnchorA));
    cls->defineFunction("GetLocalAnchorA", _SE(js_box2dclasses_b2PrismaticJoint_GetLocalAnchorA));
    cls->defineFunction("SetMotorSpeed", _SE(js_box2dclasses_b2PrismaticJoint_SetMotorSpeed));
    cls->defineFunction("GetLocalAnchorB", _SE(js_box2dclasses_b2PrismaticJoint_GetLocalAnchorB));
    cls->defineFunction("GetMotorSpeed", _SE(js_box2dclasses_b2PrismaticJoint_GetMotorSpeed));
    cls->defineFunction("SetMaxMotorForce", _SE(js_box2dclasses_b2PrismaticJoint_SetMaxMotorForce));
    cls->defineFunction("EnableLimit", _SE(js_box2dclasses_b2PrismaticJoint_EnableLimit));
    cls->defineFunction("IsMotorEnabled", _SE(js_box2dclasses_b2PrismaticJoint_IsMotorEnabled));
    cls->defineFunction("GetReactionForce", _SE(js_box2dclasses_b2PrismaticJoint_GetReactionForce));
    cls->defineFunction("GetMaxMotorForce", _SE(js_box2dclasses_b2PrismaticJoint_GetMaxMotorForce));
    cls->defineFunction("GetJointSpeed", _SE(js_box2dclasses_b2PrismaticJoint_GetJointSpeed));
    cls->defineFunction("EnableMotor", _SE(js_box2dclasses_b2PrismaticJoint_EnableMotor));
    cls->defineFunction("GetReferenceAngle", _SE(js_box2dclasses_b2PrismaticJoint_GetReferenceAngle));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2PrismaticJoint_Dump));
    cls->defineFunction("GetMotorForce", _SE(js_box2dclasses_b2PrismaticJoint_GetMotorForce));
    cls->defineFunction("GetJointTranslation", _SE(js_box2dclasses_b2PrismaticJoint_GetJointTranslation));
    cls->defineFunction("IsLimitEnabled", _SE(js_box2dclasses_b2PrismaticJoint_IsLimitEnabled));
    cls->defineFunction("GetReactionTorque", _SE(js_box2dclasses_b2PrismaticJoint_GetReactionTorque));
    cls->defineFunction("SetLimits", _SE(js_box2dclasses_b2PrismaticJoint_SetLimits));
    cls->defineFunction("GetUpperLimit", _SE(js_box2dclasses_b2PrismaticJoint_GetUpperLimit));
    cls->defineFunction("GetAnchorB", _SE(js_box2dclasses_b2PrismaticJoint_GetAnchorB));
    cls->defineFinalizeFunction(_SE(js_b2PrismaticJoint_finalize));
    cls->install();
    JSBClassType::registerClass<b2PrismaticJoint>(cls);

    __jsb_b2PrismaticJoint_proto = cls->getProto();
    __jsb_b2PrismaticJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2PulleyJoint_proto = nullptr;
se::Class* __jsb_b2PulleyJoint_class = nullptr;

static bool js_box2dclasses_b2PulleyJoint_GetCurrentLengthA(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_GetCurrentLengthA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetCurrentLengthA();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetCurrentLengthA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_GetCurrentLengthA)

static bool js_box2dclasses_b2PulleyJoint_GetAnchorA(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_GetAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_GetAnchorA)

static bool js_box2dclasses_b2PulleyJoint_GetGroundAnchorB(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_GetGroundAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetGroundAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetGroundAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_GetGroundAnchorB)

static bool js_box2dclasses_b2PulleyJoint_GetReactionTorque(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_GetReactionTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetReactionTorque : Error processing arguments");
        float result = cobj->GetReactionTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetReactionTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_GetReactionTorque)

static bool js_box2dclasses_b2PulleyJoint_Dump(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_Dump)

static bool js_box2dclasses_b2PulleyJoint_GetGroundAnchorA(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_GetGroundAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetGroundAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetGroundAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_GetGroundAnchorA)

static bool js_box2dclasses_b2PulleyJoint_GetLengthB(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_GetLengthB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetLengthB();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetLengthB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_GetLengthB)

static bool js_box2dclasses_b2PulleyJoint_GetLengthA(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_GetLengthA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetLengthA();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetLengthA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_GetLengthA)

static bool js_box2dclasses_b2PulleyJoint_GetCurrentLengthB(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_GetCurrentLengthB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetCurrentLengthB();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetCurrentLengthB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_GetCurrentLengthB)

static bool js_box2dclasses_b2PulleyJoint_GetAnchorB(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_GetAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_GetAnchorB)

static bool js_box2dclasses_b2PulleyJoint_GetReactionForce(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_GetReactionForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetReactionForce : Error processing arguments");
        b2Vec2 result = cobj->GetReactionForce(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetReactionForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_GetReactionForce)

static bool js_box2dclasses_b2PulleyJoint_ShiftOrigin(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_ShiftOrigin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        b2Vec2 arg0;
        ok &= seval_to_b2Vec2(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_ShiftOrigin : Error processing arguments");
        cobj->ShiftOrigin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_ShiftOrigin)

static bool js_box2dclasses_b2PulleyJoint_GetRatio(se::State& s)
{
    b2PulleyJoint* cobj = (b2PulleyJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2PulleyJoint_GetRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetRatio();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2PulleyJoint_GetRatio : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2PulleyJoint_GetRatio)


extern se::Object* __jsb_b2Joint_proto;

static bool js_b2PulleyJoint_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2PulleyJoint)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2PulleyJoint_finalize)

bool js_register_box2dclasses_b2PulleyJoint(se::Object* obj)
{
    auto cls = se::Class::create("b2PulleyJoint", obj, __jsb_b2Joint_proto, nullptr);

    cls->defineFunction("GetCurrentLengthA", _SE(js_box2dclasses_b2PulleyJoint_GetCurrentLengthA));
    cls->defineFunction("GetAnchorA", _SE(js_box2dclasses_b2PulleyJoint_GetAnchorA));
    cls->defineFunction("GetGroundAnchorB", _SE(js_box2dclasses_b2PulleyJoint_GetGroundAnchorB));
    cls->defineFunction("GetReactionTorque", _SE(js_box2dclasses_b2PulleyJoint_GetReactionTorque));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2PulleyJoint_Dump));
    cls->defineFunction("GetGroundAnchorA", _SE(js_box2dclasses_b2PulleyJoint_GetGroundAnchorA));
    cls->defineFunction("GetLengthB", _SE(js_box2dclasses_b2PulleyJoint_GetLengthB));
    cls->defineFunction("GetLengthA", _SE(js_box2dclasses_b2PulleyJoint_GetLengthA));
    cls->defineFunction("GetCurrentLengthB", _SE(js_box2dclasses_b2PulleyJoint_GetCurrentLengthB));
    cls->defineFunction("GetAnchorB", _SE(js_box2dclasses_b2PulleyJoint_GetAnchorB));
    cls->defineFunction("GetReactionForce", _SE(js_box2dclasses_b2PulleyJoint_GetReactionForce));
    cls->defineFunction("ShiftOrigin", _SE(js_box2dclasses_b2PulleyJoint_ShiftOrigin));
    cls->defineFunction("GetRatio", _SE(js_box2dclasses_b2PulleyJoint_GetRatio));
    cls->defineFinalizeFunction(_SE(js_b2PulleyJoint_finalize));
    cls->install();
    JSBClassType::registerClass<b2PulleyJoint>(cls);

    __jsb_b2PulleyJoint_proto = cls->getProto();
    __jsb_b2PulleyJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2RevoluteJoint_proto = nullptr;
se::Class* __jsb_b2RevoluteJoint_class = nullptr;

static bool js_box2dclasses_b2RevoluteJoint_GetLowerLimit(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetLowerLimit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetLowerLimit();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetLowerLimit : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetLowerLimit)

static bool js_box2dclasses_b2RevoluteJoint_GetAnchorA(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetAnchorA)

static bool js_box2dclasses_b2RevoluteJoint_GetLocalAnchorA(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetLocalAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetLocalAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetLocalAnchorA)

static bool js_box2dclasses_b2RevoluteJoint_SetMotorSpeed(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_SetMotorSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_SetMotorSpeed : Error processing arguments");
        cobj->SetMotorSpeed(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_SetMotorSpeed)

static bool js_box2dclasses_b2RevoluteJoint_GetLocalAnchorB(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetLocalAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetLocalAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetLocalAnchorB)

static bool js_box2dclasses_b2RevoluteJoint_GetJointAngle(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetJointAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetJointAngle();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetJointAngle : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetJointAngle)

static bool js_box2dclasses_b2RevoluteJoint_GetMotorSpeed(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetMotorSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMotorSpeed();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetMotorSpeed : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetMotorSpeed)

static bool js_box2dclasses_b2RevoluteJoint_GetMotorTorque(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetMotorTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetMotorTorque : Error processing arguments");
        float result = cobj->GetMotorTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetMotorTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetMotorTorque)

static bool js_box2dclasses_b2RevoluteJoint_IsLimitEnabled(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_IsLimitEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsLimitEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_IsLimitEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_IsLimitEnabled)

static bool js_box2dclasses_b2RevoluteJoint_EnableLimit(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_EnableLimit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_EnableLimit : Error processing arguments");
        cobj->EnableLimit(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_EnableLimit)

static bool js_box2dclasses_b2RevoluteJoint_IsMotorEnabled(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_IsMotorEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsMotorEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_IsMotorEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_IsMotorEnabled)

static bool js_box2dclasses_b2RevoluteJoint_GetReactionForce(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetReactionForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetReactionForce : Error processing arguments");
        b2Vec2 result = cobj->GetReactionForce(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetReactionForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetReactionForce)

static bool js_box2dclasses_b2RevoluteJoint_SetMaxMotorTorque(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_SetMaxMotorTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_SetMaxMotorTorque : Error processing arguments");
        cobj->SetMaxMotorTorque(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_SetMaxMotorTorque)

static bool js_box2dclasses_b2RevoluteJoint_GetJointSpeed(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetJointSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetJointSpeed();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetJointSpeed : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetJointSpeed)

static bool js_box2dclasses_b2RevoluteJoint_EnableMotor(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_EnableMotor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_EnableMotor : Error processing arguments");
        cobj->EnableMotor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_EnableMotor)

static bool js_box2dclasses_b2RevoluteJoint_GetReferenceAngle(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetReferenceAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetReferenceAngle();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetReferenceAngle : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetReferenceAngle)

static bool js_box2dclasses_b2RevoluteJoint_Dump(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_Dump)

static bool js_box2dclasses_b2RevoluteJoint_SetLimits(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_SetLimits : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_SetLimits : Error processing arguments");
        cobj->SetLimits(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_SetLimits)

static bool js_box2dclasses_b2RevoluteJoint_GetMaxMotorTorque(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetMaxMotorTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMaxMotorTorque();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetMaxMotorTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetMaxMotorTorque)

static bool js_box2dclasses_b2RevoluteJoint_GetReactionTorque(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetReactionTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetReactionTorque : Error processing arguments");
        float result = cobj->GetReactionTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetReactionTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetReactionTorque)

static bool js_box2dclasses_b2RevoluteJoint_GetUpperLimit(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetUpperLimit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetUpperLimit();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetUpperLimit : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetUpperLimit)

static bool js_box2dclasses_b2RevoluteJoint_GetAnchorB(se::State& s)
{
    b2RevoluteJoint* cobj = (b2RevoluteJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RevoluteJoint_GetAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RevoluteJoint_GetAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RevoluteJoint_GetAnchorB)


extern se::Object* __jsb_b2Joint_proto;

static bool js_b2RevoluteJoint_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2RevoluteJoint)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2RevoluteJoint_finalize)

bool js_register_box2dclasses_b2RevoluteJoint(se::Object* obj)
{
    auto cls = se::Class::create("b2RevoluteJoint", obj, __jsb_b2Joint_proto, nullptr);

    cls->defineFunction("GetLowerLimit", _SE(js_box2dclasses_b2RevoluteJoint_GetLowerLimit));
    cls->defineFunction("GetAnchorA", _SE(js_box2dclasses_b2RevoluteJoint_GetAnchorA));
    cls->defineFunction("GetLocalAnchorA", _SE(js_box2dclasses_b2RevoluteJoint_GetLocalAnchorA));
    cls->defineFunction("SetMotorSpeed", _SE(js_box2dclasses_b2RevoluteJoint_SetMotorSpeed));
    cls->defineFunction("GetLocalAnchorB", _SE(js_box2dclasses_b2RevoluteJoint_GetLocalAnchorB));
    cls->defineFunction("GetJointAngle", _SE(js_box2dclasses_b2RevoluteJoint_GetJointAngle));
    cls->defineFunction("GetMotorSpeed", _SE(js_box2dclasses_b2RevoluteJoint_GetMotorSpeed));
    cls->defineFunction("GetMotorTorque", _SE(js_box2dclasses_b2RevoluteJoint_GetMotorTorque));
    cls->defineFunction("IsLimitEnabled", _SE(js_box2dclasses_b2RevoluteJoint_IsLimitEnabled));
    cls->defineFunction("EnableLimit", _SE(js_box2dclasses_b2RevoluteJoint_EnableLimit));
    cls->defineFunction("IsMotorEnabled", _SE(js_box2dclasses_b2RevoluteJoint_IsMotorEnabled));
    cls->defineFunction("GetReactionForce", _SE(js_box2dclasses_b2RevoluteJoint_GetReactionForce));
    cls->defineFunction("SetMaxMotorTorque", _SE(js_box2dclasses_b2RevoluteJoint_SetMaxMotorTorque));
    cls->defineFunction("GetJointSpeed", _SE(js_box2dclasses_b2RevoluteJoint_GetJointSpeed));
    cls->defineFunction("EnableMotor", _SE(js_box2dclasses_b2RevoluteJoint_EnableMotor));
    cls->defineFunction("GetReferenceAngle", _SE(js_box2dclasses_b2RevoluteJoint_GetReferenceAngle));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2RevoluteJoint_Dump));
    cls->defineFunction("SetLimits", _SE(js_box2dclasses_b2RevoluteJoint_SetLimits));
    cls->defineFunction("GetMaxMotorTorque", _SE(js_box2dclasses_b2RevoluteJoint_GetMaxMotorTorque));
    cls->defineFunction("GetReactionTorque", _SE(js_box2dclasses_b2RevoluteJoint_GetReactionTorque));
    cls->defineFunction("GetUpperLimit", _SE(js_box2dclasses_b2RevoluteJoint_GetUpperLimit));
    cls->defineFunction("GetAnchorB", _SE(js_box2dclasses_b2RevoluteJoint_GetAnchorB));
    cls->defineFinalizeFunction(_SE(js_b2RevoluteJoint_finalize));
    cls->install();
    JSBClassType::registerClass<b2RevoluteJoint>(cls);

    __jsb_b2RevoluteJoint_proto = cls->getProto();
    __jsb_b2RevoluteJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2RopeJoint_proto = nullptr;
se::Class* __jsb_b2RopeJoint_class = nullptr;

static bool js_box2dclasses_b2RopeJoint_GetAnchorA(se::State& s)
{
    b2RopeJoint* cobj = (b2RopeJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RopeJoint_GetAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RopeJoint_GetAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RopeJoint_GetAnchorA)

static bool js_box2dclasses_b2RopeJoint_GetReactionTorque(se::State& s)
{
    b2RopeJoint* cobj = (b2RopeJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RopeJoint_GetReactionTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RopeJoint_GetReactionTorque : Error processing arguments");
        float result = cobj->GetReactionTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RopeJoint_GetReactionTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RopeJoint_GetReactionTorque)

static bool js_box2dclasses_b2RopeJoint_GetMaxLength(se::State& s)
{
    b2RopeJoint* cobj = (b2RopeJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RopeJoint_GetMaxLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMaxLength();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RopeJoint_GetMaxLength : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RopeJoint_GetMaxLength)

static bool js_box2dclasses_b2RopeJoint_GetLocalAnchorA(se::State& s)
{
    b2RopeJoint* cobj = (b2RopeJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RopeJoint_GetLocalAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RopeJoint_GetLocalAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RopeJoint_GetLocalAnchorA)

static bool js_box2dclasses_b2RopeJoint_Dump(se::State& s)
{
    b2RopeJoint* cobj = (b2RopeJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RopeJoint_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RopeJoint_Dump)

static bool js_box2dclasses_b2RopeJoint_SetMaxLength(se::State& s)
{
    b2RopeJoint* cobj = (b2RopeJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RopeJoint_SetMaxLength : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RopeJoint_SetMaxLength : Error processing arguments");
        cobj->SetMaxLength(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RopeJoint_SetMaxLength)

static bool js_box2dclasses_b2RopeJoint_GetLocalAnchorB(se::State& s)
{
    b2RopeJoint* cobj = (b2RopeJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RopeJoint_GetLocalAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RopeJoint_GetLocalAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RopeJoint_GetLocalAnchorB)

static bool js_box2dclasses_b2RopeJoint_GetAnchorB(se::State& s)
{
    b2RopeJoint* cobj = (b2RopeJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RopeJoint_GetAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RopeJoint_GetAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RopeJoint_GetAnchorB)

static bool js_box2dclasses_b2RopeJoint_GetReactionForce(se::State& s)
{
    b2RopeJoint* cobj = (b2RopeJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RopeJoint_GetReactionForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RopeJoint_GetReactionForce : Error processing arguments");
        b2Vec2 result = cobj->GetReactionForce(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RopeJoint_GetReactionForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RopeJoint_GetReactionForce)

static bool js_box2dclasses_b2RopeJoint_GetLimitState(se::State& s)
{
    b2RopeJoint* cobj = (b2RopeJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2RopeJoint_GetLimitState : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = (unsigned int)cobj->GetLimitState();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2RopeJoint_GetLimitState : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2RopeJoint_GetLimitState)


extern se::Object* __jsb_b2Joint_proto;

static bool js_b2RopeJoint_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2RopeJoint)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2RopeJoint_finalize)

bool js_register_box2dclasses_b2RopeJoint(se::Object* obj)
{
    auto cls = se::Class::create("b2RopeJoint", obj, __jsb_b2Joint_proto, nullptr);

    cls->defineFunction("GetAnchorA", _SE(js_box2dclasses_b2RopeJoint_GetAnchorA));
    cls->defineFunction("GetReactionTorque", _SE(js_box2dclasses_b2RopeJoint_GetReactionTorque));
    cls->defineFunction("GetMaxLength", _SE(js_box2dclasses_b2RopeJoint_GetMaxLength));
    cls->defineFunction("GetLocalAnchorA", _SE(js_box2dclasses_b2RopeJoint_GetLocalAnchorA));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2RopeJoint_Dump));
    cls->defineFunction("SetMaxLength", _SE(js_box2dclasses_b2RopeJoint_SetMaxLength));
    cls->defineFunction("GetLocalAnchorB", _SE(js_box2dclasses_b2RopeJoint_GetLocalAnchorB));
    cls->defineFunction("GetAnchorB", _SE(js_box2dclasses_b2RopeJoint_GetAnchorB));
    cls->defineFunction("GetReactionForce", _SE(js_box2dclasses_b2RopeJoint_GetReactionForce));
    cls->defineFunction("GetLimitState", _SE(js_box2dclasses_b2RopeJoint_GetLimitState));
    cls->defineFinalizeFunction(_SE(js_b2RopeJoint_finalize));
    cls->install();
    JSBClassType::registerClass<b2RopeJoint>(cls);

    __jsb_b2RopeJoint_proto = cls->getProto();
    __jsb_b2RopeJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2WeldJoint_proto = nullptr;
se::Class* __jsb_b2WeldJoint_class = nullptr;

static bool js_box2dclasses_b2WeldJoint_SetDampingRatio(se::State& s)
{
    b2WeldJoint* cobj = (b2WeldJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WeldJoint_SetDampingRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_SetDampingRatio : Error processing arguments");
        cobj->SetDampingRatio(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WeldJoint_SetDampingRatio)

static bool js_box2dclasses_b2WeldJoint_GetAnchorA(se::State& s)
{
    b2WeldJoint* cobj = (b2WeldJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WeldJoint_GetAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_GetAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WeldJoint_GetAnchorA)

static bool js_box2dclasses_b2WeldJoint_GetReactionTorque(se::State& s)
{
    b2WeldJoint* cobj = (b2WeldJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WeldJoint_GetReactionTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_GetReactionTorque : Error processing arguments");
        float result = cobj->GetReactionTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_GetReactionTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WeldJoint_GetReactionTorque)

static bool js_box2dclasses_b2WeldJoint_Dump(se::State& s)
{
    b2WeldJoint* cobj = (b2WeldJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WeldJoint_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WeldJoint_Dump)

static bool js_box2dclasses_b2WeldJoint_SetFrequency(se::State& s)
{
    b2WeldJoint* cobj = (b2WeldJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WeldJoint_SetFrequency : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_SetFrequency : Error processing arguments");
        cobj->SetFrequency(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WeldJoint_SetFrequency)

static bool js_box2dclasses_b2WeldJoint_GetDampingRatio(se::State& s)
{
    b2WeldJoint* cobj = (b2WeldJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WeldJoint_GetDampingRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetDampingRatio();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_GetDampingRatio : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WeldJoint_GetDampingRatio)

static bool js_box2dclasses_b2WeldJoint_GetFrequency(se::State& s)
{
    b2WeldJoint* cobj = (b2WeldJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WeldJoint_GetFrequency : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetFrequency();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_GetFrequency : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WeldJoint_GetFrequency)

static bool js_box2dclasses_b2WeldJoint_GetLocalAnchorA(se::State& s)
{
    b2WeldJoint* cobj = (b2WeldJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WeldJoint_GetLocalAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_GetLocalAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WeldJoint_GetLocalAnchorA)

static bool js_box2dclasses_b2WeldJoint_GetLocalAnchorB(se::State& s)
{
    b2WeldJoint* cobj = (b2WeldJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WeldJoint_GetLocalAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_GetLocalAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WeldJoint_GetLocalAnchorB)

static bool js_box2dclasses_b2WeldJoint_GetAnchorB(se::State& s)
{
    b2WeldJoint* cobj = (b2WeldJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WeldJoint_GetAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_GetAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WeldJoint_GetAnchorB)

static bool js_box2dclasses_b2WeldJoint_GetReactionForce(se::State& s)
{
    b2WeldJoint* cobj = (b2WeldJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WeldJoint_GetReactionForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_GetReactionForce : Error processing arguments");
        b2Vec2 result = cobj->GetReactionForce(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_GetReactionForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WeldJoint_GetReactionForce)

static bool js_box2dclasses_b2WeldJoint_GetReferenceAngle(se::State& s)
{
    b2WeldJoint* cobj = (b2WeldJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WeldJoint_GetReferenceAngle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetReferenceAngle();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WeldJoint_GetReferenceAngle : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WeldJoint_GetReferenceAngle)


extern se::Object* __jsb_b2Joint_proto;

static bool js_b2WeldJoint_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2WeldJoint)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2WeldJoint_finalize)

bool js_register_box2dclasses_b2WeldJoint(se::Object* obj)
{
    auto cls = se::Class::create("b2WeldJoint", obj, __jsb_b2Joint_proto, nullptr);

    cls->defineFunction("SetDampingRatio", _SE(js_box2dclasses_b2WeldJoint_SetDampingRatio));
    cls->defineFunction("GetAnchorA", _SE(js_box2dclasses_b2WeldJoint_GetAnchorA));
    cls->defineFunction("GetReactionTorque", _SE(js_box2dclasses_b2WeldJoint_GetReactionTorque));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2WeldJoint_Dump));
    cls->defineFunction("SetFrequency", _SE(js_box2dclasses_b2WeldJoint_SetFrequency));
    cls->defineFunction("GetDampingRatio", _SE(js_box2dclasses_b2WeldJoint_GetDampingRatio));
    cls->defineFunction("GetFrequency", _SE(js_box2dclasses_b2WeldJoint_GetFrequency));
    cls->defineFunction("GetLocalAnchorA", _SE(js_box2dclasses_b2WeldJoint_GetLocalAnchorA));
    cls->defineFunction("GetLocalAnchorB", _SE(js_box2dclasses_b2WeldJoint_GetLocalAnchorB));
    cls->defineFunction("GetAnchorB", _SE(js_box2dclasses_b2WeldJoint_GetAnchorB));
    cls->defineFunction("GetReactionForce", _SE(js_box2dclasses_b2WeldJoint_GetReactionForce));
    cls->defineFunction("GetReferenceAngle", _SE(js_box2dclasses_b2WeldJoint_GetReferenceAngle));
    cls->defineFinalizeFunction(_SE(js_b2WeldJoint_finalize));
    cls->install();
    JSBClassType::registerClass<b2WeldJoint>(cls);

    __jsb_b2WeldJoint_proto = cls->getProto();
    __jsb_b2WeldJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

se::Object* __jsb_b2WheelJoint_proto = nullptr;
se::Class* __jsb_b2WheelJoint_class = nullptr;

static bool js_box2dclasses_b2WheelJoint_IsMotorEnabled(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_IsMotorEnabled : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        bool result = cobj->IsMotorEnabled();
        ok &= boolean_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_IsMotorEnabled : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_IsMotorEnabled)

static bool js_box2dclasses_b2WheelJoint_GetMotorSpeed(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetMotorSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMotorSpeed();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetMotorSpeed : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetMotorSpeed)

static bool js_box2dclasses_b2WheelJoint_GetAnchorA(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetAnchorA)

static bool js_box2dclasses_b2WheelJoint_GetReactionTorque(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetReactionTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetReactionTorque : Error processing arguments");
        float result = cobj->GetReactionTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetReactionTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetReactionTorque)

static bool js_box2dclasses_b2WheelJoint_Dump(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_Dump : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->Dump();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_Dump)

static bool js_box2dclasses_b2WheelJoint_SetSpringDampingRatio(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_SetSpringDampingRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_SetSpringDampingRatio : Error processing arguments");
        cobj->SetSpringDampingRatio(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_SetSpringDampingRatio)

static bool js_box2dclasses_b2WheelJoint_GetSpringFrequencyHz(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetSpringFrequencyHz : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetSpringFrequencyHz();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetSpringFrequencyHz : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetSpringFrequencyHz)

static bool js_box2dclasses_b2WheelJoint_GetJointTranslation(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetJointTranslation : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetJointTranslation();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetJointTranslation : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetJointTranslation)

static bool js_box2dclasses_b2WheelJoint_GetSpringDampingRatio(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetSpringDampingRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetSpringDampingRatio();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetSpringDampingRatio : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetSpringDampingRatio)

static bool js_box2dclasses_b2WheelJoint_GetLocalAxisA(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetLocalAxisA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAxisA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetLocalAxisA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetLocalAxisA)

static bool js_box2dclasses_b2WheelJoint_SetSpringFrequencyHz(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_SetSpringFrequencyHz : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_SetSpringFrequencyHz : Error processing arguments");
        cobj->SetSpringFrequencyHz(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_SetSpringFrequencyHz)

static bool js_box2dclasses_b2WheelJoint_GetLocalAnchorA(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetLocalAnchorA : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorA();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetLocalAnchorA : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetLocalAnchorA)

static bool js_box2dclasses_b2WheelJoint_SetMotorSpeed(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_SetMotorSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_SetMotorSpeed : Error processing arguments");
        cobj->SetMotorSpeed(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_SetMotorSpeed)

static bool js_box2dclasses_b2WheelJoint_GetLocalAnchorB(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetLocalAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        const b2Vec2& result = cobj->GetLocalAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetLocalAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetLocalAnchorB)

static bool js_box2dclasses_b2WheelJoint_SetMaxMotorTorque(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_SetMaxMotorTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_SetMaxMotorTorque : Error processing arguments");
        cobj->SetMaxMotorTorque(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_SetMaxMotorTorque)

static bool js_box2dclasses_b2WheelJoint_GetAnchorB(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetAnchorB : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        b2Vec2 result = cobj->GetAnchorB();
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetAnchorB : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetAnchorB)

static bool js_box2dclasses_b2WheelJoint_GetReactionForce(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetReactionForce : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetReactionForce : Error processing arguments");
        b2Vec2 result = cobj->GetReactionForce(arg0);
        ok &= b2Vec2_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetReactionForce : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetReactionForce)

static bool js_box2dclasses_b2WheelJoint_GetMotorTorque(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetMotorTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetMotorTorque : Error processing arguments");
        float result = cobj->GetMotorTorque(arg0);
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetMotorTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetMotorTorque)

static bool js_box2dclasses_b2WheelJoint_GetJointSpeed(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetJointSpeed : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetJointSpeed();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetJointSpeed : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetJointSpeed)

static bool js_box2dclasses_b2WheelJoint_GetMaxMotorTorque(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_GetMaxMotorTorque : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->GetMaxMotorTorque();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_GetMaxMotorTorque : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_GetMaxMotorTorque)

static bool js_box2dclasses_b2WheelJoint_EnableMotor(se::State& s)
{
    b2WheelJoint* cobj = (b2WheelJoint*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_box2dclasses_b2WheelJoint_EnableMotor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_box2dclasses_b2WheelJoint_EnableMotor : Error processing arguments");
        cobj->EnableMotor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_box2dclasses_b2WheelJoint_EnableMotor)


extern se::Object* __jsb_b2Joint_proto;

static bool js_b2WheelJoint_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (b2WheelJoint)", s.nativeThisObject());
    return true;
}
SE_BIND_FINALIZE_FUNC(js_b2WheelJoint_finalize)

bool js_register_box2dclasses_b2WheelJoint(se::Object* obj)
{
    auto cls = se::Class::create("b2WheelJoint", obj, __jsb_b2Joint_proto, nullptr);

    cls->defineFunction("IsMotorEnabled", _SE(js_box2dclasses_b2WheelJoint_IsMotorEnabled));
    cls->defineFunction("GetMotorSpeed", _SE(js_box2dclasses_b2WheelJoint_GetMotorSpeed));
    cls->defineFunction("GetAnchorA", _SE(js_box2dclasses_b2WheelJoint_GetAnchorA));
    cls->defineFunction("GetReactionTorque", _SE(js_box2dclasses_b2WheelJoint_GetReactionTorque));
    cls->defineFunction("Dump", _SE(js_box2dclasses_b2WheelJoint_Dump));
    cls->defineFunction("SetSpringDampingRatio", _SE(js_box2dclasses_b2WheelJoint_SetSpringDampingRatio));
    cls->defineFunction("GetSpringFrequencyHz", _SE(js_box2dclasses_b2WheelJoint_GetSpringFrequencyHz));
    cls->defineFunction("GetJointTranslation", _SE(js_box2dclasses_b2WheelJoint_GetJointTranslation));
    cls->defineFunction("GetSpringDampingRatio", _SE(js_box2dclasses_b2WheelJoint_GetSpringDampingRatio));
    cls->defineFunction("GetLocalAxisA", _SE(js_box2dclasses_b2WheelJoint_GetLocalAxisA));
    cls->defineFunction("SetSpringFrequencyHz", _SE(js_box2dclasses_b2WheelJoint_SetSpringFrequencyHz));
    cls->defineFunction("GetLocalAnchorA", _SE(js_box2dclasses_b2WheelJoint_GetLocalAnchorA));
    cls->defineFunction("SetMotorSpeed", _SE(js_box2dclasses_b2WheelJoint_SetMotorSpeed));
    cls->defineFunction("GetLocalAnchorB", _SE(js_box2dclasses_b2WheelJoint_GetLocalAnchorB));
    cls->defineFunction("SetMaxMotorTorque", _SE(js_box2dclasses_b2WheelJoint_SetMaxMotorTorque));
    cls->defineFunction("GetAnchorB", _SE(js_box2dclasses_b2WheelJoint_GetAnchorB));
    cls->defineFunction("GetReactionForce", _SE(js_box2dclasses_b2WheelJoint_GetReactionForce));
    cls->defineFunction("GetMotorTorque", _SE(js_box2dclasses_b2WheelJoint_GetMotorTorque));
    cls->defineFunction("GetJointSpeed", _SE(js_box2dclasses_b2WheelJoint_GetJointSpeed));
    cls->defineFunction("GetMaxMotorTorque", _SE(js_box2dclasses_b2WheelJoint_GetMaxMotorTorque));
    cls->defineFunction("EnableMotor", _SE(js_box2dclasses_b2WheelJoint_EnableMotor));
    cls->defineFinalizeFunction(_SE(js_b2WheelJoint_finalize));
    cls->install();
    JSBClassType::registerClass<b2WheelJoint>(cls);

    __jsb_b2WheelJoint_proto = cls->getProto();
    __jsb_b2WheelJoint_class = cls;

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_box2dclasses(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("b2", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("b2", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_box2dclasses_b2Joint(ns);
    js_register_box2dclasses_b2DistanceJoint(ns);
    js_register_box2dclasses_b2Fixture(ns);
    js_register_box2dclasses_b2MouseJoint(ns);
    js_register_box2dclasses_b2MotorJoint(ns);
    js_register_box2dclasses_b2PulleyJoint(ns);
    js_register_box2dclasses_b2World(ns);
    js_register_box2dclasses_b2PrismaticJoint(ns);
    js_register_box2dclasses_b2Shape(ns);
    js_register_box2dclasses_b2CircleShape(ns);
    js_register_box2dclasses_b2WheelJoint(ns);
    js_register_box2dclasses_b2Draw(ns);
    js_register_box2dclasses_b2GearJoint(ns);
    js_register_box2dclasses_b2RayCastCallback(ns);
    js_register_box2dclasses_b2WeldJoint(ns);
    js_register_box2dclasses_b2RevoluteJoint(ns);
    js_register_box2dclasses_b2ContactListener(ns);
    js_register_box2dclasses_b2ChainShape(ns);
    js_register_box2dclasses_b2QueryCallback(ns);
    js_register_box2dclasses_b2RopeJoint(ns);
    js_register_box2dclasses_b2PolygonShape(ns);
    js_register_box2dclasses_b2EdgeShape(ns);
    js_register_box2dclasses_b2Contact(ns);
    js_register_box2dclasses_b2Body(ns);
    js_register_box2dclasses_b2FrictionJoint(ns);
    return true;
}

