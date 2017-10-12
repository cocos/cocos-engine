#include "scripting/js-bindings/auto/jsb_creator_graphics_auto.hpp"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"
#include "creator/CCGraphicsNode.h"

se::Object* __jsb_creator_GraphicsNode_proto = nullptr;
se::Class* __jsb_creator_GraphicsNode_class = nullptr;

static bool js_creator_graphics_GraphicsNode_quadraticCurveTo(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_quadraticCurveTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_quadraticCurveTo : Error processing arguments");
        cobj->quadraticCurveTo(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_quadraticCurveTo)

static bool js_creator_graphics_GraphicsNode_moveTo(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_moveTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_moveTo : Error processing arguments");
        cobj->moveTo(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_moveTo)

static bool js_creator_graphics_GraphicsNode_lineTo(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_lineTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        float arg0 = 0;
        float arg1 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_lineTo : Error processing arguments");
        cobj->lineTo(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_lineTo)

static bool js_creator_graphics_GraphicsNode_stroke(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_stroke : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->stroke();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_stroke)

static bool js_creator_graphics_GraphicsNode_arc(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_arc : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        bool arg5;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_float(args[4], &arg4);
        ok &= seval_to_boolean(args[5], &arg5);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_arc : Error processing arguments");
        cobj->arc(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_arc)

static bool js_creator_graphics_GraphicsNode_setLineJoin(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_setLineJoin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        creator::LineJoin arg0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_setLineJoin : Error processing arguments");
        cobj->setLineJoin(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_setLineJoin)

static bool js_creator_graphics_GraphicsNode_close(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_close : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->close();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_close)

static bool js_creator_graphics_GraphicsNode_ellipse(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_ellipse : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_ellipse : Error processing arguments");
        cobj->ellipse(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_ellipse)

static bool js_creator_graphics_GraphicsNode_setLineWidth(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_setLineWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_setLineWidth : Error processing arguments");
        cobj->setLineWidth(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_setLineWidth)

static bool js_creator_graphics_GraphicsNode_fill(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_fill : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->fill();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_fill)

static bool js_creator_graphics_GraphicsNode_getStrokeColor(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_getStrokeColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color4F result = cobj->getStrokeColor();
        ok &= Color4F_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_getStrokeColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_getStrokeColor)

static bool js_creator_graphics_GraphicsNode_setLineCap(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_setLineCap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        creator::LineCap arg0;
        ok &= seval_to_uint32(args[0], (uint32_t*)&arg0);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_setLineCap : Error processing arguments");
        cobj->setLineCap(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_setLineCap)

static bool js_creator_graphics_GraphicsNode_circle(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_circle : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_circle : Error processing arguments");
        cobj->circle(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_circle)

static bool js_creator_graphics_GraphicsNode_roundRect(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_roundRect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_float(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_roundRect : Error processing arguments");
        cobj->roundRect(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_roundRect)

static bool js_creator_graphics_GraphicsNode_draw(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_draw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::Renderer* arg0 = nullptr;
        cocos2d::Mat4 arg1;
        unsigned int arg2 = 0;
        ok &= seval_to_native_ptr(args[0], &arg0);
        ok &= seval_to_Mat4(args[1], &arg1);
        ok &= seval_to_uint32(args[2], (uint32_t*)&arg2);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_draw : Error processing arguments");
        cobj->draw(arg0, arg1, arg2);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_draw)

static bool js_creator_graphics_GraphicsNode_bezierCurveTo(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_bezierCurveTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 6) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        float arg5 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_float(args[4], &arg4);
        ok &= seval_to_float(args[5], &arg5);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_bezierCurveTo : Error processing arguments");
        cobj->bezierCurveTo(arg0, arg1, arg2, arg3, arg4, arg5);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 6);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_bezierCurveTo)

static bool js_creator_graphics_GraphicsNode_arcTo(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_arcTo : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        float arg4 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        ok &= seval_to_float(args[4], &arg4);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_arcTo : Error processing arguments");
        cobj->arcTo(arg0, arg1, arg2, arg3, arg4);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 5);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_arcTo)

static bool js_creator_graphics_GraphicsNode_fillRect(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_fillRect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_fillRect : Error processing arguments");
        cobj->fillRect(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_fillRect)

static bool js_creator_graphics_GraphicsNode_onDraw(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_onDraw : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::Mat4 arg0;
        unsigned int arg1 = 0;
        ok &= seval_to_Mat4(args[0], &arg0);
        ok &= seval_to_uint32(args[1], (uint32_t*)&arg1);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_onDraw : Error processing arguments");
        cobj->onDraw(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_onDraw)

static bool js_creator_graphics_GraphicsNode_setFillColor(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_setFillColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4F arg0;
        ok &= seval_to_Color4F(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_setFillColor : Error processing arguments");
        cobj->setFillColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_setFillColor)

static bool js_creator_graphics_GraphicsNode_getFillColor(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_getFillColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cocos2d::Color4F result = cobj->getFillColor();
        ok &= Color4F_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_getFillColor : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_getFillColor)

static bool js_creator_graphics_GraphicsNode_beginPath(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_beginPath : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        cobj->beginPath();
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_beginPath)

static bool js_creator_graphics_GraphicsNode_setDeviceRatio(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_setDeviceRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_setDeviceRatio : Error processing arguments");
        cobj->setDeviceRatio(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_setDeviceRatio)

static bool js_creator_graphics_GraphicsNode_rect(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_rect : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_rect : Error processing arguments");
        cobj->rect(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_rect)

static bool js_creator_graphics_GraphicsNode_getMiterLimit(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_getMiterLimit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getMiterLimit();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_getMiterLimit : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_getMiterLimit)

static bool js_creator_graphics_GraphicsNode_getLineJoin(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_getLineJoin : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = (unsigned int)cobj->getLineJoin();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_getLineJoin : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_getLineJoin)

static bool js_creator_graphics_GraphicsNode_getLineCap(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_getLineCap : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        unsigned int result = (unsigned int)cobj->getLineCap();
        ok &= uint32_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_getLineCap : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_getLineCap)

static bool js_creator_graphics_GraphicsNode_setMiterLimit(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_setMiterLimit : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        float arg0 = 0;
        ok &= seval_to_float(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_setMiterLimit : Error processing arguments");
        cobj->setMiterLimit(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_setMiterLimit)

static bool js_creator_graphics_GraphicsNode_clear(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_clear : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        cobj->clear();
        return true;
    }
    if (argc == 1) {
        bool arg0;
        ok &= seval_to_boolean(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_clear : Error processing arguments");
        cobj->clear(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_clear)

static bool js_creator_graphics_GraphicsNode_getDeviceRatio(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_getDeviceRatio : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getDeviceRatio();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_getDeviceRatio : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_getDeviceRatio)

static bool js_creator_graphics_GraphicsNode_getLineWidth(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_getLineWidth : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        float result = cobj->getLineWidth();
        ok &= float_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_getLineWidth : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_getLineWidth)

static bool js_creator_graphics_GraphicsNode_setStrokeColor(se::State& s)
{
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_creator_graphics_GraphicsNode_setStrokeColor : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Color4F arg0;
        ok &= seval_to_Color4F(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_creator_graphics_GraphicsNode_setStrokeColor : Error processing arguments");
        cobj->setStrokeColor(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_setStrokeColor)

static bool js_creator_graphics_GraphicsNode_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = creator::GraphicsNode::create();
        result->retain();
        auto obj = se::Object::createObjectWithClass(__jsb_creator_GraphicsNode_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_creator_graphics_GraphicsNode_create)

SE_DECLARE_FINALIZE_FUNC(js_creator_GraphicsNode_finalize)

static bool js_creator_graphics_GraphicsNode_constructor(se::State& s)
{
    creator::GraphicsNode* cobj = new (std::nothrow) creator::GraphicsNode();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_creator_graphics_GraphicsNode_constructor, __jsb_creator_GraphicsNode_class, js_creator_GraphicsNode_finalize)

static bool js_creator_graphics_GraphicsNode_ctor(se::State& s)
{
    creator::GraphicsNode* cobj = new (std::nothrow) creator::GraphicsNode();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_creator_graphics_GraphicsNode_ctor, __jsb_creator_GraphicsNode_class, js_creator_GraphicsNode_finalize)


    

extern se::Object* __jsb_cocos2d_Node_proto;

static bool js_creator_GraphicsNode_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (creator::GraphicsNode)", s.nativeThisObject());
    creator::GraphicsNode* cobj = (creator::GraphicsNode*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_creator_GraphicsNode_finalize)

bool js_register_creator_graphics_GraphicsNode(se::Object* obj)
{
    auto cls = se::Class::create("GraphicsNode", obj, __jsb_cocos2d_Node_proto, _SE(js_creator_graphics_GraphicsNode_constructor));

    cls->defineFunction("quadraticCurveTo", _SE(js_creator_graphics_GraphicsNode_quadraticCurveTo));
    cls->defineFunction("moveTo", _SE(js_creator_graphics_GraphicsNode_moveTo));
    cls->defineFunction("lineTo", _SE(js_creator_graphics_GraphicsNode_lineTo));
    cls->defineFunction("stroke", _SE(js_creator_graphics_GraphicsNode_stroke));
    cls->defineFunction("arc", _SE(js_creator_graphics_GraphicsNode_arc));
    cls->defineFunction("setLineJoin", _SE(js_creator_graphics_GraphicsNode_setLineJoin));
    cls->defineFunction("close", _SE(js_creator_graphics_GraphicsNode_close));
    cls->defineFunction("ellipse", _SE(js_creator_graphics_GraphicsNode_ellipse));
    cls->defineFunction("setLineWidth", _SE(js_creator_graphics_GraphicsNode_setLineWidth));
    cls->defineFunction("fill", _SE(js_creator_graphics_GraphicsNode_fill));
    cls->defineFunction("getStrokeColor", _SE(js_creator_graphics_GraphicsNode_getStrokeColor));
    cls->defineFunction("setLineCap", _SE(js_creator_graphics_GraphicsNode_setLineCap));
    cls->defineFunction("circle", _SE(js_creator_graphics_GraphicsNode_circle));
    cls->defineFunction("roundRect", _SE(js_creator_graphics_GraphicsNode_roundRect));
    cls->defineFunction("draw", _SE(js_creator_graphics_GraphicsNode_draw));
    cls->defineFunction("bezierCurveTo", _SE(js_creator_graphics_GraphicsNode_bezierCurveTo));
    cls->defineFunction("arcTo", _SE(js_creator_graphics_GraphicsNode_arcTo));
    cls->defineFunction("fillRect", _SE(js_creator_graphics_GraphicsNode_fillRect));
    cls->defineFunction("onDraw", _SE(js_creator_graphics_GraphicsNode_onDraw));
    cls->defineFunction("setFillColor", _SE(js_creator_graphics_GraphicsNode_setFillColor));
    cls->defineFunction("getFillColor", _SE(js_creator_graphics_GraphicsNode_getFillColor));
    cls->defineFunction("beginPath", _SE(js_creator_graphics_GraphicsNode_beginPath));
    cls->defineFunction("setDeviceRatio", _SE(js_creator_graphics_GraphicsNode_setDeviceRatio));
    cls->defineFunction("rect", _SE(js_creator_graphics_GraphicsNode_rect));
    cls->defineFunction("getMiterLimit", _SE(js_creator_graphics_GraphicsNode_getMiterLimit));
    cls->defineFunction("getLineJoin", _SE(js_creator_graphics_GraphicsNode_getLineJoin));
    cls->defineFunction("getLineCap", _SE(js_creator_graphics_GraphicsNode_getLineCap));
    cls->defineFunction("setMiterLimit", _SE(js_creator_graphics_GraphicsNode_setMiterLimit));
    cls->defineFunction("clear", _SE(js_creator_graphics_GraphicsNode_clear));
    cls->defineFunction("getDeviceRatio", _SE(js_creator_graphics_GraphicsNode_getDeviceRatio));
    cls->defineFunction("getLineWidth", _SE(js_creator_graphics_GraphicsNode_getLineWidth));
    cls->defineFunction("setStrokeColor", _SE(js_creator_graphics_GraphicsNode_setStrokeColor));
    cls->defineFunction("ctor", _SE(js_creator_graphics_GraphicsNode_ctor));
    cls->defineStaticFunction("create", _SE(js_creator_graphics_GraphicsNode_create));
    cls->defineFinalizeFunction(_SE(js_creator_GraphicsNode_finalize));
    cls->install();
    JSBClassType::registerClass<creator::GraphicsNode>(cls);

    __jsb_creator_GraphicsNode_proto = cls->getProto();
    __jsb_creator_GraphicsNode_class = cls;

    jsb_set_extend_property("cc", "GraphicsNode");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_creator_graphics(se::Object* obj)
{
    // Get the ns
    se::Value nsVal;
    if (!obj->getProperty("cc", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("cc", nsVal);
    }
    se::Object* ns = nsVal.toObject();

    js_register_creator_graphics_GraphicsNode(ns);
    return true;
}

