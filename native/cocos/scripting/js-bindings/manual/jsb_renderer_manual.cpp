#include "jsb_renderer_manual.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_renderer_auto.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
// #include "Renderer.h"
#include "renderer/INode.h"

using namespace cocos2d;
using namespace cocos2d::renderer;

static bool js_renderer_Camera_getColor(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getColor : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        Color4F color;
        cobj->getColor(color);
        se::Object* arg0Obj = args[0].toObject();
        arg0Obj->setProperty("r", se::Value(color.r));
        arg0Obj->setProperty("g", se::Value(color.g));
        arg0Obj->setProperty("b", se::Value(color.b));
        s.rval().setObject(arg0Obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getColor)

static bool js_renderer_Camera_getRect(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_getRect : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::renderer::Rect rect;
        cobj->getRect(rect);
        se::Object* arg0Obj = args[0].toObject();
        arg0Obj->setProperty("x", se::Value(rect.x));
        arg0Obj->setProperty("y", se::Value(rect.y));
        arg0Obj->setProperty("w", se::Value(rect.w));
        arg0Obj->setProperty("h", se::Value(rect.h));
        s.rval().setObject(arg0Obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_getRect)

static bool js_renderer_Camera_extractView(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_extractView : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 3) {
        cocos2d::renderer::View* view = nullptr;
        ok = seval_to_native_ptr(args[0], &view);
        SE_PRECONDITION2(ok, false, "Convert arg0 failed!");
        int32_t width = 0;
        ok = seval_to_int32(args[1], &width);
        SE_PRECONDITION2(ok, false, "Convert arg1 failed!");
        int32_t height = 0;
        ok = seval_to_int32(args[2], &height);
        SE_PRECONDITION2(ok, false, "Convert arg2 failed!");
        cobj->extractView(*view, width, height);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 3);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_extractView)

static bool js_renderer_Camera_screenToWorld(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_screenToWorld : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        cocos2d::Vec3 out;
        cocos2d::Vec3 screenPos;
        ok = seval_to_Vec3(args[1], &screenPos);
        SE_PRECONDITION2(ok, false, "Convert arg1 failed!");
        int32_t width = 0;
        ok = seval_to_int32(args[2], &width);
        SE_PRECONDITION2(ok, false, "Convert arg2 failed!");
        int32_t height = 0;
        ok = seval_to_int32(args[3], &height);
        SE_PRECONDITION2(ok, false, "Convert arg3 failed!");
        cobj->screenToWorld(out, screenPos, width, height);
        se::Object* arg0Obj = args[0].toObject();
        arg0Obj->setProperty("x", se::Value(out.x));
        arg0Obj->setProperty("y", se::Value(out.y));
        arg0Obj->setProperty("z", se::Value(out.z));
        s.rval().setObject(arg0Obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_screenToWorld)

static bool js_renderer_Camera_worldToScreen(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_worldToScreen : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 4) {
        cocos2d::Vec3 out;
        cocos2d::Vec3 worldPos;
        ok = seval_to_Vec3(args[1], &worldPos);
        SE_PRECONDITION2(ok, false, "Convert arg1 failed!");
        int32_t width = 0;
        ok = seval_to_int32(args[2], &width);
        SE_PRECONDITION2(ok, false, "Convert arg2 failed!");
        int32_t height = 0;
        ok = seval_to_int32(args[3], &height);
        SE_PRECONDITION2(ok, false, "Convert arg3 failed!");
        cobj->worldToScreen(out, worldPos, width, height);
        se::Object* arg0Obj = args[0].toObject();
        arg0Obj->setProperty("x", se::Value(out.x));
        arg0Obj->setProperty("y", se::Value(out.y));
        arg0Obj->setProperty("z", se::Value(out.z));
        s.rval().setObject(arg0Obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_worldToScreen)

static void fillObjectWithValueMap(const cocos2d::ValueMap& v, se::Object* obj)
{
    bool ok = true;
    for (const auto& e : v)
    {
        const std::string& key = e.first;
        const cocos2d::Value& value = e.second;

        if (key.empty())
            continue;

        se::Value tmp;
        if (!ccvalue_to_seval(value, &tmp))
        {
            ok = false;
            break;
        }

        obj->setProperty(key.c_str(), tmp);
    }
}

static bool js_renderer_Effect_extractDefines(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_extractDefines : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        se::Object* out = args[0].toObject();
        cocos2d::ValueMap valueMap;
        cobj->extractDefines(valueMap);
        fillObjectWithValueMap(valueMap, out);
        s.rval().setObject(out);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_extractDefines)

static bool js_renderer_Light_extractView(se::State& s)
{
    cocos2d::renderer::Light* cobj = (cocos2d::renderer::Light*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Light_extractView : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::renderer::View* view;
        ok = seval_to_native_ptr(args[0], &view);
        SE_PRECONDITION2(ok, false, "Convert arg0 failed!");

        std::vector<std::string> stages;
        ok = seval_to_std_vector_string(args[1], &stages);
        SE_PRECONDITION2(ok, false, "Convert arg1 failed!");

        cobj->extractView(*view, stages);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_Light_extractView)

static bool js_renderer_View_getForward(se::State& s)
{
    cocos2d::renderer::View* cobj = (cocos2d::renderer::View*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_View_getForward : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec3 out;
        cobj->getForward(out);
        se::Object* arg0Obj = args[0].toObject();
        arg0Obj->setProperty("x", se::Value(out.x));
        arg0Obj->setProperty("y", se::Value(out.y));
        arg0Obj->setProperty("z", se::Value(out.z));
        s.rval().setObject(arg0Obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_View_getForward)

static bool js_renderer_View_getPosition(se::State& s)
{
    cocos2d::renderer::View* cobj = (cocos2d::renderer::View*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_View_getPosition : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        cocos2d::Vec3 out;
        cobj->getPosition(out);
        se::Object* arg0Obj = args[0].toObject();
        arg0Obj->setProperty("x", se::Value(out.x));
        arg0Obj->setProperty("y", se::Value(out.y));
        arg0Obj->setProperty("z", se::Value(out.z));
        s.rval().setObject(arg0Obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_renderer_View_getPosition)

static bool js_renderer_addStage(se::State& s)
{
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string stageName;
        ok = seval_to_std_string(args[0], &stageName);
        SE_PRECONDITION2(ok, false, "Convert arg0 failed!");
        Config::addStage(stageName);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_addStage)

class JSNode : public INode
{
public:
    JSNode(const se::Value& jsNode)
    : _jsNode(jsNode)
    {
    }

    virtual Mat4 getWorldMatrix() const override
    {
        Mat4 worldMatrix;
        se::Value func;
        if (_jsNode.toObject()->getProperty("getWorldMatrix", &func))
        {
            se::Value ret;
            se::ValueArray args;
            se::HandleObject obj(se::Object::createPlainObject());
            args.push_back(se::Value(obj));
            func.toObject()->call(args, _jsNode.toObject(), &ret);
            seval_to_Mat4(ret, &worldMatrix);
        }
        return worldMatrix;
    }

    virtual Mat4 getWorldRT() const override
    {
        Mat4 worldRT;
        se::Value func;
        if (_jsNode.toObject()->getProperty("getWorldRT", &func))
        {
            se::Value ret;
            se::ValueArray args;
            se::HandleObject obj(se::Object::createPlainObject());
            args.push_back(se::Value(obj));
            func.toObject()->call(args, _jsNode.toObject(), &ret);
            seval_to_Mat4(ret, &worldRT);
        }
        return worldRT;
    }

    virtual Vec3 getWorldPos() const override
    {
        Vec3 pos;
        se::Value func;
        if (_jsNode.toObject()->getProperty("getWorldPos", &func))
        {
            se::Value ret;
            se::ValueArray args;
            se::HandleObject obj(se::Object::createPlainObject());
            args.push_back(se::Value(obj));
            func.toObject()->call(args, _jsNode.toObject(), &ret);
            seval_to_Vec3(ret, &pos);
        }
        return pos;
    }

private:
    se::Value _jsNode;
};

static bool js_renderer_Camera_setNode(se::State& s)
{
    cocos2d::renderer::Camera* cobj = (cocos2d::renderer::Camera*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Camera_setNode : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        INode* node = cobj->getNode();
        delete node;
        node = new JSNode(args[0]);
        cobj->setNode(node);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Camera_setNode)

static bool js_renderer_Model_setNode(se::State& s)
{
    cocos2d::renderer::Model* cobj = (cocos2d::renderer::Model*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Model_setNode : Invalid Native Object");
    auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        INode* node = cobj->getNode();
        delete node;
        node = new JSNode(args[0]);
        cobj->setNode(node);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Model_setNode)

bool jsb_register_renderer_manual(se::Object* global)
{
    // Camera
    __jsb_cocos2d_gfx_Camera_proto->defineFunction("getColor", _SE(js_renderer_Camera_getColor));
    __jsb_cocos2d_gfx_Camera_proto->defineFunction("getRect", _SE(js_renderer_Camera_getRect));
    __jsb_cocos2d_gfx_Camera_proto->defineFunction("extractView", _SE(js_renderer_Camera_extractView));
    __jsb_cocos2d_gfx_Camera_proto->defineFunction("screenToWorld", _SE(js_renderer_Camera_screenToWorld));
    __jsb_cocos2d_gfx_Camera_proto->defineFunction("worldToScreen", _SE(js_renderer_Camera_worldToScreen));

    // Effect
    __jsb_cocos2d_gfx_Effect_proto->defineFunction("extractDefines", _SE(js_renderer_Effect_extractDefines));

    // Light
    __jsb_cocos2d_gfx_Light_proto->defineFunction("extractView", _SE(js_renderer_Light_extractView));

    // View
    __jsb_cocos2d_gfx_View_proto->defineFunction("getForward", _SE(js_renderer_View_getForward));
    __jsb_cocos2d_gfx_View_proto->defineFunction("getPosition", _SE(js_renderer_View_getPosition));

    // Config
    se::Value rendererVal;
    global->getProperty("renderer", &rendererVal);
    rendererVal.toObject()->defineFunction("addStage", _SE(js_renderer_addStage));

    // Camera
    __jsb_cocos2d_gfx_Camera_proto->defineFunction("setNode", _SE(js_renderer_Camera_setNode));

    // Model
    __jsb_cocos2d_gfx_Model_proto->defineFunction("setNode", _SE(js_renderer_Model_setNode));

    return true;
}
