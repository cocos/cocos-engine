#include "jsb_renderer_manual.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_renderer_auto.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
// #include "Renderer.h"
#include "renderer/INode.h"
#include "jsb_conversions.hpp"

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

static bool js_renderer_Effect_setProperty(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setProperty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        
        ok &= seval_to_std_string(args[0], &arg0);
        
        // get property type by arg0
        cocos2d::renderer::Technique::Parameter::Type propType = cocos2d::renderer::Technique::Parameter::Type::UNKNOWN;
        const auto& techinques = cobj->getTechniques();
        for (const auto& techinque : techinques)
        {
            const auto& parameters = techinque->getParameters();
            for (const auto& param : parameters)
            {
                if (arg0 == param.getName())
                {
                    propType = param.getType();
                    break;
                }
            }
        }
        assert(propType != cocos2d::renderer::Technique::Parameter::Type::UNKNOWN);
        cocos2d::renderer::Technique::Parameter arg1(arg0, propType);
        ok &= seval_to_TechniqueParameter_not_constructor(args[1], &arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_setProperty : Error processing arguments");
        cobj->setProperty(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_setProperty)

static bool js_renderer_Effect_prop_getDefines(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setProperty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0)
    {
        std_vector_EffectDefine_to_seval(cobj->getDefines(), &s.rval());
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_PROP_GET(js_renderer_Effect_prop_getDefines);

static bool js_renderer_Effect_prop_getTechniques(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setProperty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0)
    {
        Vector_to_seval(cobj->getTechniques(), &s.rval());
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_PROP_GET(js_renderer_Effect_prop_getTechniques);

static bool js_renderer_Effect_prop_getProperties(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setProperty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0)
    {
        std_unorderedmap_string_EffectProperty_to_seval(cobj->getProperties(), &s.rval());
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_PROP_GET(js_renderer_Effect_prop_getProperties);

static bool js_renderer_Effect_getProperty(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_getProperty : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getProperty : Error processing arguments");
        const cocos2d::renderer::Technique::Parameter& result = cobj->getProperty(arg0);
        ok &= EffectProperty_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getProperty : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Effect_getProperty)

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

static bool js_renderer_getStageIDs(se::State& s)
{
    auto& args = s.args();
    size_t argc = args.size();
    if (argc == 1)
    {
        std::vector<std::string> stageNames;
        CC_UNUSED bool ok = seval_to_std_vector_string(args[0], &stageNames);
        SE_PRECONDITION2(ok, false, "Convert arg0 failed!");
        unsigned int stageIDs = cocos2d::renderer::Config::getStageIDs(stageNames);
        uint32_to_seval(stageIDs, &s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_getStageIDs);

static bool js_renderer_getStageID(se::State& s)
{
    auto& args = s.args();
    size_t argc = args.size();
    if (argc == 1)
    {
        std::string stageName;
        CC_UNUSED bool ok = seval_to_std_string(args[0], &stageName);
        SE_PRECONDITION2(ok, false, "Convert arg0 failed!");
        int stageID = cocos2d::renderer::Config::getStageID(stageName);
        int32_to_seval(stageID, &s.rval());
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_getStageID);

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
            seval_to_Mat4(se::Value(obj), &worldMatrix);
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

//static bool js_renderer_Model_setNode(se::State& s)
//{
//    cocos2d::renderer::Model* cobj = (cocos2d::renderer::Model*)s.nativeThisObject();
//    SE_PRECONDITION2(cobj, false, "js_renderer_Model_setNode : Invalid Native Object");
//    auto& args = s.args();
//    size_t argc = args.size();
//    CC_UNUSED bool ok = true;
//    if (argc == 1) {
//        INode* node = cobj->getNode();
//        delete node;
//        node = new JSNode(args[0]);
//        cobj->setNode(node);
//        return true;
//    }
//    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
//    return false;
//}
//SE_BIND_FUNC(js_renderer_Model_setNode)

//static bool js_renderer_Technique_prop_getPasses(se::State& s)
//{
//    cocos2d::renderer::Technique* cobj = (cocos2d::renderer::Technique*)s.nativeThisObject();
//    SE_PRECONDITION2(cobj, false, "js_renderer_Technique_getPasses: Invalid Native Object.");
//    const auto& args = s.args();
//    size_t argc = args.size();
//    if (argc == 0)
//    {
//        const auto& passes = cobj->getPasses();
//        Vector_to_seval<cocos2d::renderer::Pass>(passes, &s.rval());
//        return true;
//    }
//
//    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
//    return false;
//}
//SE_BIND_PROP_GET(js_renderer_Technique_prop_getPasses);

//static bool js_renderer_Technique_prop_getParmaters(se::State& s)
//{
//    cocos2d::renderer::Technique* cobj = (cocos2d::renderer::Technique*)s.nativeThisObject();
//    SE_PRECONDITION2(cobj, false, "js_renderer_Technique_getPasses: Invalid Native Object.");
//    const auto& args = s.args();
//    size_t argc = args.size();
//    if (argc == 0)
//    {
//        const auto& parameters = cobj->getParameters();
//        std_vector_TechniqueParameter_to_seval(parameters, &s.rval());
//        return true;
//    }
//
//    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
//    return false;
//}
//SE_BIND_PROP_GET(js_renderer_Technique_prop_getParmaters);
//
//static bool js_renderer_Technique_prop_getStageIDs(se::State& s)
//{
//    cocos2d::renderer::Technique* cobj = (cocos2d::renderer::Technique*)s.nativeThisObject();
//    SE_PRECONDITION2(cobj, false, "js_renderer_Technique_getPasses: Invalid Native Object.");
//    const auto& args = s.args();
//    size_t argc = args.size();
//    if (argc == 0)
//    {
//        int32_to_seval(cobj->getStageIDs(), &s.rval());
//        return true;
//    }
//
//    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
//    return false;
//}
//SE_BIND_PROP_GET(js_renderer_Technique_prop_getStageIDs);

//static bool js_renderer_Tehchnique_setPass(se::State& s)
//{
//    cocos2d::renderer::Technique* cobj = (cocos2d::renderer::Technique*)s.nativeThisObject();
//    SE_PRECONDITION2(cobj, false, "js_renderer_Technique_getPasses: Invalid Native Object.");
//    const auto& args = s.args();
//    size_t argc = args.size();
//    if (argc == 2)
//    {
//        int arg0 = 0;
//        cocos2d::renderer::Pass* arg1 = nullptr;
//
//        bool ok = seval_to_int32(args[0], &arg0);
//        SE_PRECONDITION2(ok, false, "js_renderer_Tehchnique_setPass: Can not convert arg1 to int.");
//
//        ok |= seval_to_native_ptr(args[1], &arg1);
//        SE_PRECONDITION2(ok, false, "js_renderer_Tehchnique_setPass: Can not convert arg0 to Pass*.");
//
//        cobj->setPass(arg0, arg1);
//        return true;
//    }
//
//    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
//    return false;
//}
//SE_BIND_FUNC(js_renderer_Tehchnique_setPass);

//static bool js_renderer_Pass_prop_getStencilTest(se::State& s)
//{
//    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
//    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_getStencilTest: Invalid Native Object.");
//    const auto& args = s.args();
//    size_t argc = args.size();
//    if (argc == 0)
//    {
//        bool stencilTest = cobj->getStencilTest();
//        boolean_to_seval(stencilTest, &s.rval());
//        return true;
//    }
//
//    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
//    return false;
//}
//SE_BIND_PROP_GET(js_renderer_Pass_prop_getStencilTest);
//
//static bool js_renderer_Pass_prop_setStencilTest(se::State& s)
//{
//    cocos2d::renderer::Pass* cobj = (cocos2d::renderer::Pass*)s.nativeThisObject();
//    SE_PRECONDITION2(cobj, false, "js_renderer_Pass_sStencilTest: Invalid Native Object.");
//    const auto& args = s.args();
//    size_t argc = args.size();
//    if (argc == 1)
//    {
//        bool arg0 = false;
//        bool ok = seval_to_boolean(args[0], &arg0);
//        SE_PRECONDITION2(ok, false, "js_renderer_Pass_prop_setStencilTest : can not convert arg0 to bool");
//        cobj->setStencilTest(arg0);
//        return true;
//    }
//
//    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
//    return false;
//}
//SE_BIND_PROP_SET(js_renderer_Pass_prop_setStencilTest);

static bool js_renderer_Config_addStage(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 1)
    {
        std::string arg0;
        bool ok = seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Scene_addCamera : Error processing arguments");
        cocos2d::renderer::Config::addStage(arg0);
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_renderer_Config_addStage);

static bool js_renderer_BaseRenderer_prop_getProgramLib(se::State& s)
{
    cocos2d::renderer::BaseRenderer* cobj = (cocos2d::renderer::BaseRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_BaseRenderer_prop_getProgramLib: Invalid Native Object.");
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0)
    {
        auto programLib = cobj->getProgramLib();
        native_ptr_to_seval<cocos2d::renderer::ProgramLib>(programLib, &s.rval());
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_PROP_GET(js_renderer_BaseRenderer_prop_getProgramLib);

static bool js_register_renderer_Config(se::Object* obj)
{
    auto cls = se::Class::create("Config", obj, nullptr, nullptr);
    cls->defineStaticFunction("addStage", _SE(js_renderer_Config_addStage));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Config>(cls);
    
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

namespace
{
    se::Value getProperty(se::Object* obj, const std::string& propertyName)
    {
        se::Value propVal;
        obj->getProperty(propertyName.c_str(), &propVal);
        return propVal;
    }
    
    cocos2d::renderer::Pass generatePass(se::Object* passObj)
    {
        // get program name and create native Pass
        se::Value programNameVal;
        passObj->getProperty("_programName", &programNameVal);
        cocos2d::renderer::Pass pass = (programNameVal.toString());
        
        // cull mode
        uint32_t cullMode = getProperty(passObj, "_cullMode").toUint32();
        pass.setCullMode(static_cast<cocos2d::renderer::CullMode>(cullMode));
        
        // depth
        bool depthTest = getProperty(passObj, "_depthTest").toBoolean();
        bool depthWrite = getProperty(passObj, "_depthWrite").toBoolean();
        uint32_t depthFunc = getProperty(passObj, "_depthFunc").toUint32();
        pass.setDepth(depthTest,
                      depthWrite,
                      static_cast<cocos2d::renderer::DepthFunc>(depthFunc));
        
        // blend
        uint32_t blendEq = getProperty(passObj, "_blendEq").toUint32();
        uint32_t blendSrc = getProperty(passObj, "_blendSrc").toUint32();
        uint32_t blendDst = getProperty(passObj, "_blendDst").toUint32();
        uint32_t blendAlphaEq = getProperty(passObj, "_blendAlphaEq").toUint32();
        uint32_t blendSrcAlpha = getProperty(passObj, "_blendSrcAlpha").toUint32();
        uint32_t blendDstAlpha = getProperty(passObj, "_blendDstAlpha").toUint32();
        uint32_t blendColor = getProperty(passObj, "_blendColor").toUint32();
        pass.setBlend(static_cast<cocos2d::renderer::BlendOp>(blendEq),
                      static_cast<cocos2d::renderer::BlendFactor>(blendSrc),
                      static_cast<cocos2d::renderer::BlendFactor>(blendDst),
                      static_cast<cocos2d::renderer::BlendOp>(blendAlphaEq),
                      static_cast<cocos2d::renderer::BlendFactor>(blendSrcAlpha),
                      static_cast<cocos2d::renderer::BlendFactor>(blendDstAlpha),
                      blendColor);
        
        // stencil front
        uint32_t stencilFuncFront = getProperty(passObj, "_stencilFuncFront").toUint32();
        uint32_t stencilRefFront = getProperty(passObj, "_stencilRefFront").toUint32();
        uint32_t stencilMaskFront = getProperty(passObj, "_stencilMaskFront").toUint32();
        uint32_t stencilFailOpFront = getProperty(passObj, "_stencilFailOpFront").toUint32();
        uint32_t stencilZFailOpFront = getProperty(passObj, "_stencilZFailOpFront").toUint32();
        uint32_t stencilZPassOpFront = getProperty(passObj, "_stencilZPassOpFront").toUint32();
        uint32_t stencilWrtieMaskFront = getProperty(passObj, "_stencilWriteMaskFront").toUint32();
        pass.setStencilFront(static_cast<cocos2d::renderer::StencilFunc>(stencilFuncFront),
                             stencilRefFront,
                             stencilMaskFront,
                             static_cast<cocos2d::renderer::StencilOp>(stencilFailOpFront),
                             static_cast<cocos2d::renderer::StencilOp>(stencilZFailOpFront),
                             static_cast<cocos2d::renderer::StencilOp>(stencilZPassOpFront),
                             stencilWrtieMaskFront);
        
        // stencil back
        uint32_t stencilFuncBack = getProperty(passObj, "_stencilFuncBack").toUint32();
        uint32_t stencilRefBack = getProperty(passObj, "_stencilRefBack").toUint32();
        uint32_t stencilMaskBack = getProperty(passObj, "_stencilMaskBack").toUint32();
        uint32_t stencilFailOpBack = getProperty(passObj, "_stencilFailOpBack").toUint32();
        uint32_t stencilZFailOpBack = getProperty(passObj, "_stencilZFailOpBack").toUint32();
        uint32_t stencilZPassOpBack = getProperty(passObj, "_stencilZPassOpBack").toUint32();
        uint32_t stencilWrtieMaskBack = getProperty(passObj, "_stencilWriteMaskBack").toUint32();
        pass.setStencilBack(static_cast<cocos2d::renderer::StencilFunc>(stencilFuncBack),
                            stencilRefBack,
                            stencilMaskBack,
                            static_cast<cocos2d::renderer::StencilOp>(stencilFailOpBack),
                            static_cast<cocos2d::renderer::StencilOp>(stencilZFailOpBack),
                            static_cast<cocos2d::renderer::StencilOp>(stencilZPassOpBack),
                            stencilWrtieMaskBack);
        
        return pass;
    }
    
    cocos2d::renderer::Technique* generateTechnique(se::Object* techniqueObj)
    {
        // create passes for each technique
        std::vector<cocos2d::renderer::Pass> passes;
        se::Value passesVal;
        techniqueObj->getProperty("_passes", &passesVal);
        const auto& passesObj = passesVal.toObject();
        uint32_t passesLength = 0;
        passesObj->getArrayLength(&passesLength);
        for (uint32_t k = 0; k < passesLength; ++k)
        {
            se::Value passVal;
            passesObj->getArrayElement(k, &passVal);
            const auto& passObj = passVal.toObject();
            cocos2d::renderer::Pass pass(generatePass(passObj));
            passes.push_back(std::move(pass));
        }
        
        // stages
        std::vector<std::string> stages;
        se::Value stagesVal;
        techniqueObj->getProperty("_stages", &stagesVal);
        const auto& stagesObj = stagesVal.toObject();
        uint32_t stagesLength = 0;
        stagesObj->getArrayLength(&stagesLength);
        for (uint32_t l = 0; l < stagesLength; ++l)
        {
            se::Value stageVal;
            stagesObj->getArrayElement(l, &stageVal);
            stages.push_back(stageVal.toString());
        }
        
        // parameters
        se::Value parametrsVal;
        techniqueObj->getProperty("_parameters", &parametrsVal);
        std::vector<cocos2d::renderer::Technique::Parameter> parameters;
        seval_to_std_vector_TechniqueParameter(parametrsVal, &parameters);
        
        // layer
        se::Value layerVal;
        techniqueObj->getProperty("_layer", &layerVal);
        
        auto technique = new cocos2d::renderer::Technique(stages, parameters, passes, layerVal.toInt32());
        
        return technique;
    }
    
    void addEffects2Model(cocos2d::renderer::Model* model, const se::Value& modelVal)
    {
        // create effects
        se::Value effectsVal;
        modelVal.toObject()->getProperty("_effects", &effectsVal);
        const auto& effectsObj = effectsVal.toObject();
        uint32_t effectsLength = 0;
        effectsObj->getArrayLength(&effectsLength);
        for (uint32_t i = 0; i < effectsLength; ++i)
        {
            se::Value effectVal;
            effectsObj->getArrayElement(i, &effectVal);
            const auto& effectObj = effectVal.toObject();
            
            // create techniques for each effect
            cocos2d::Vector<cocos2d::renderer::Technique*> techniques;
            se::Value techinquesVal;
            effectObj->getProperty("_techniques", &techinquesVal);
            const auto& techniquesObj = techinquesVal.toObject();
            uint32_t techniquesLength = 0;
            techniquesObj->getArrayLength(&techniquesLength);
            for (uint32_t j = 0; j < techniquesLength; ++j)
            {
                se::Value techniqueVal;
                techniquesObj->getArrayElement(j, &techniqueVal);
                const auto& techniqueObj = techniqueVal.toObject();
                techniques.pushBack(generateTechnique(techniqueObj));
                
                // properties
                std::unordered_map<std::string, cocos2d::renderer::Effect::Property> properties;
                se::Value propertiesVal;
                effectObj->getProperty("_properties", &propertiesVal);
                seval_to_EffectProperty(propertiesVal, &properties);
                
                // templates
                std::vector<cocos2d::ValueMap> templates;
                se::Value templatesVal;
                effectObj->getProperty("_defines", &templatesVal);
                seval_to_EffectDefineTemplate(templatesVal, &templates);
                
                auto effect = new cocos2d::renderer::Effect(techniques, properties, templates);
                model->addEffect(effect);
            }
        }
    }
}

static bool js_renderer_Scene_addModel(se::State& s)
{
    cocos2d::renderer::Scene* cobj = (cocos2d::renderer::Scene*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Scene_addModel : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1)
    {
        auto model = new cocos2d::renderer::Model();
        const se::Value& modelVal = args[0];
        const auto& modelObj = modelVal.toObject();
        addEffects2Model(model, modelVal);
        
        // dynamicIA
        bool isDynamicIA = getProperty(modelObj, "_dynamicIA").toBoolean();
        model->setDynamicIA(isDynamicIA);
        
        // node
        auto node = getProperty(modelObj, "_node");
        model->setNode(new JSNode(node));
        
        // view id
        int32_t viewID = getProperty(modelObj, "_viewID").toInt32();
        model->setViewId(viewID);
        
        // input assemblers
        se::Value inputAssemblersVal;
        modelObj->getProperty("_inputAssemblers", &inputAssemblersVal);
        const auto& inputAssemblersObj = inputAssemblersVal.toObject();
        uint32_t inputAssemblersLength = 0;
        inputAssemblersObj->getArrayLength(&inputAssemblersLength);
        for (int i = 0; i < inputAssemblersLength; ++i)
        {
            auto inputAssembler = new cocos2d::renderer::InputAssembler();
            
            se::Value inputAssemblerVal;
            inputAssemblersObj->getArrayElement(i, &inputAssemblerVal);
            const auto& inputAssemblerObj = inputAssemblerVal.toObject();
            
            // vertex buffer
            auto vertexBufferObj = getProperty(inputAssemblerObj, "_vertexBuffer").toObject();
            auto vertexBuffer = static_cast<cocos2d::renderer::VertexBuffer*>(vertexBufferObj->getPrivateData());
            
            // index buffer
            auto indexBufferObj = getProperty(inputAssemblerObj, "_indexBuffer").toObject();
            auto indexBuffer = static_cast<cocos2d::renderer::IndexBuffer*>(indexBufferObj->getPrivateData());
            
            // primitive type
            uint32_t primitiveType = getProperty(inputAssemblerObj, "_primitiveType").toUint32();
            
            inputAssembler->init(vertexBuffer,
                                 indexBuffer,
                                 static_cast<cocos2d::renderer::PrimitiveType>(primitiveType));
            
            model->addInputAssembler(inputAssembler);
        }
        
        cobj->addModel(model);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Scene_addModel)

bool jsb_register_renderer_manual(se::Object* global)
{
    // Camera
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("getColor", _SE(js_renderer_Camera_getColor));
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("getRect", _SE(js_renderer_Camera_getRect));
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("extractView", _SE(js_renderer_Camera_extractView));
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("screenToWorld", _SE(js_renderer_Camera_screenToWorld));
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("worldToScreen", _SE(js_renderer_Camera_worldToScreen));

    // Effect
//    __jsb_cocos2d_renderer_Effect_proto->defineFunction("extractDefines", _SE(js_renderer_Effect_extractDefines));
//    __jsb_cocos2d_renderer_Effect_proto->defineFunction("getProperty", _SE(js_renderer_Effect_getProperty));
//    __jsb_cocos2d_renderer_Effect_proto->defineFunction("setProperty", _SE(js_renderer_Effect_setProperty));
//    __jsb_cocos2d_renderer_Effect_proto->defineProperty("_defines", _SE(js_renderer_Effect_prop_getDefines), nullptr);
//    __jsb_cocos2d_renderer_Effect_proto->defineProperty("_techniques", _SE(js_renderer_Effect_prop_getTechniques), nullptr);
//    __jsb_cocos2d_renderer_Effect_proto->defineProperty("_properties", _SE(js_renderer_Effect_prop_getProperties), nullptr);

    // Light
    __jsb_cocos2d_renderer_Light_proto->defineFunction("extractView", _SE(js_renderer_Light_extractView));

    // View
    __jsb_cocos2d_renderer_View_proto->defineFunction("getForward", _SE(js_renderer_View_getForward));
    __jsb_cocos2d_renderer_View_proto->defineFunction("getPosition", _SE(js_renderer_View_getPosition));

    // Config
    se::Value rendererVal;
    global->getProperty("renderer", &rendererVal);
    rendererVal.toObject()->defineFunction("addStage", _SE(js_renderer_addStage));
    rendererVal.toObject()->defineFunction("stageIDs", _SE(js_renderer_getStageIDs));
    rendererVal.toObject()->defineFunction("stageID", _SE(js_renderer_getStageID));


    // Camera
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("setNode", _SE(js_renderer_Camera_setNode));

    // Model
    // __jsb_cocos2d_renderer_Model_proto->defineFunction("setNode", _SE(js_renderer_Model_setNode));
//
    // Technique
//    __jsb_cocos2d_renderer_Technique_proto->defineProperty("_passes", _SE(js_renderer_Technique_prop_getPasses), nullptr);
//    __jsb_cocos2d_renderer_Technique_proto->defineProperty("_parameters", _SE(js_renderer_Technique_prop_getParmaters), nullptr);
//    __jsb_cocos2d_renderer_Technique_proto->defineProperty("stageIDs", _SE(js_renderer_Technique_prop_getStageIDs), nullptr);
//
    // BaseRenderer
    __jsb_cocos2d_renderer_BaseRenderer_proto->defineProperty("_programLib", _SE(js_renderer_BaseRenderer_prop_getProgramLib), nullptr);


    // Scene
    __jsb_cocos2d_renderer_Scene_proto->defineFunction("addModel", _SE(js_renderer_Scene_addModel));
    
    // Config
    
    // Get the ns
    se::Value nsVal;
    if (!global->getProperty("renderer", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        global->setProperty("renderer", nsVal);
    }
    se::Object* ns = nsVal.toObject();
    
    js_register_renderer_Config(ns);

    return true;
}
