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

static bool js_renderer_Effect_self(se::State& s)
{
    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setProperty : Invalid Native Object");
    auto addr = (unsigned long)cobj;
    s.rval().setNumber(addr);
    return true;
}
SE_BIND_FUNC(js_renderer_Effect_self);

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
        if (_jsNode.toObject()->getProperty("_getWorldMatrix4Native", &func))
        {
            se::Value ret;
            func.toObject()->call(se::EmptyValueArray, _jsNode.toObject(), &ret);
            seval_to_Mat4(ret, &worldMatrix);
        }
        return worldMatrix;
    }

    virtual Mat4 getWorldRT() const override
    {
        Mat4 worldRT;
        se::Value func;
        if (_jsNode.toObject()->getProperty("_getWorldRT4Native", &func))
        {
            se::Value ret;
            func.toObject()->call(se::EmptyValueArray, _jsNode.toObject(), &ret);
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

static bool js_renderer_ForwardRenderer_render(se::State& s)
{
    cocos2d::renderer::ForwardRenderer* cobj = (cocos2d::renderer::ForwardRenderer*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_ForwardRenderer_render : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        cocos2d::renderer::Scene* arg0 = nullptr;
        ok &= seval_to_native_ptr(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_ForwardRenderer_render : Error processing arguments");
        
        uint8_t* ptr = nullptr;
        size_t length = 0;
        args[1].toObject()->getTypedArrayData(&ptr, &length);
        double* realPtr = (double*)ptr;
        
        int numOfModels = (int)*realPtr++;
        cocos2d::Mat4 worldMatrix;
        cocos2d::renderer::InputAssembler ia;
        for (size_t i = 0; i < numOfModels; ++i)
        {
            auto model = cocos2d::renderer::ModelPool::getOrCreateModel();
            model->setDynamicIA((bool)*realPtr++);
            model->setViewId((int)*realPtr++);
            
            // because the data is 64 bits but the data type of Mat4 is float, so can not memcpy
            worldMatrix.m[0] = *realPtr++;
            worldMatrix.m[1] = *realPtr++;
            worldMatrix.m[2] = *realPtr++;
            worldMatrix.m[3] = *realPtr++;
            worldMatrix.m[4] = *realPtr++;
            worldMatrix.m[5] = *realPtr++;
            worldMatrix.m[6] = *realPtr++;
            worldMatrix.m[7] = *realPtr++;
            worldMatrix.m[8] = *realPtr++;
            worldMatrix.m[9] = *realPtr++;
            worldMatrix.m[10] = *realPtr++;
            worldMatrix.m[11] = *realPtr++;
            worldMatrix.m[12] = *realPtr++;
            worldMatrix.m[13] = *realPtr++;
            worldMatrix.m[14] = *realPtr++;
            worldMatrix.m[15] = *realPtr++;
            
            // ia
            unsigned long addr = (unsigned long)(*realPtr++);
            ia.setVertexBuffer(reinterpret_cast<cocos2d::renderer::VertexBuffer*>(addr));
            addr = (unsigned long)(*realPtr++);
            ia.setIndexBuffer(reinterpret_cast<cocos2d::renderer::IndexBuffer*>(addr));
            ia.setStart(*realPtr++);
            ia.setCount(*realPtr++);
            model->addInputAssembler(ia);
            
            // effect
            addr = (unsigned long)(*realPtr++);
            model->addEffect(reinterpret_cast<cocos2d::renderer::Effect*>(addr));
            
            arg0->addModel(model);
        }
        
        cobj->render(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_ForwardRenderer_render);

se::Object* __jsb_cocos2d_renderer_Technique_proto = nullptr;
se::Class* __jsb_cocos2d_renderer_Technique_class = nullptr;

static bool js_renderer_Technique_setPass(se::State& s)
{
    cocos2d::renderer::Technique* cobj = (cocos2d::renderer::Technique*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Technique_setPass : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        int arg0 = 0;
        cocos2d::renderer::Pass arg1;
        do { int32_t tmp = 0; ok &= seval_to_int32(args[0], &tmp); arg0 = (int)tmp; } while(false);
        ok &= seval_to_Pass(args[1], arg1);
        SE_PRECONDITION2(ok, false, "js_renderer_Technique_setPass : Error processing arguments");
        cobj->setPass(arg0, arg1);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_renderer_Technique_setPass)

static bool js_renderer_Technique_setStages(se::State& s)
{
    cocos2d::renderer::Technique* cobj = (cocos2d::renderer::Technique*)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_renderer_Technique_setStages : Invalid Native Object");
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::vector<std::string> arg0;
        ok &= seval_to_std_vector_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_renderer_Technique_setStages : Error processing arguments");
        cobj->setStages(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_renderer_Technique_setStages)

SE_DECLARE_FINALIZE_FUNC(js_cocos2d_renderer_Technique_finalize)

static bool js_renderer_Technique_constructor(se::State& s)
{
    CC_UNUSED bool ok = true;
    const auto& args = s.args();
    std::vector<std::string> arg0;
    std::vector<cocos2d::renderer::Technique::Parameter> arg1;
    std::vector<cocos2d::renderer::Pass> arg2;
    ok &= seval_to_std_vector_string(args[0], &arg0);
    ok &= seval_to_std_vector_TechniqueParameter(args[1], &arg1);
    ok &= seval_to_std_vector_Pass(args[2], &arg2);
    SE_PRECONDITION2(ok, false, "js_renderer_Technique_constructor : Error processing arguments");
    cocos2d::renderer::Technique* cobj = new (std::nothrow) cocos2d::renderer::Technique(arg0, arg1, arg2);
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_renderer_Technique_constructor, __jsb_cocos2d_renderer_Technique_class, js_cocos2d_renderer_Technique_finalize)

static bool js_cocos2d_renderer_Technique_finalize(se::State& s)
{
    
    CCLOGINFO("jsbindings: finalizing JS object %p (cocos2d::renderer::Technique)", s.nativeThisObject());
    cocos2d::renderer::Technique* cobj = (cocos2d::renderer::Technique*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2d_renderer_Technique_finalize)

bool js_register_renderer_Technique(se::Object* obj)
{
    auto cls = se::Class::create("TechniqueNative", obj, nullptr, _SE(js_renderer_Technique_constructor));
    
    cls->defineFunction("setPass", _SE(js_renderer_Technique_setPass));
    cls->defineFunction("setStages", _SE(js_renderer_Technique_setStages));
    cls->defineFinalizeFunction(_SE(js_cocos2d_renderer_Technique_finalize));
    cls->install();
    JSBClassType::registerClass<cocos2d::renderer::Technique>(cls);
    
    __jsb_cocos2d_renderer_Technique_proto = cls->getProto();
    __jsb_cocos2d_renderer_Technique_class = cls;
    
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool jsb_register_renderer_manual(se::Object* global)
{
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
    js_register_renderer_Technique(ns);
    
    // Camera
//    __jsb_cocos2d_renderer_Camera_proto->defineFunction("getColor", _SE(js_renderer_Camera_getColor));
//    __jsb_cocos2d_renderer_Camera_proto->defineFunction("getRect", _SE(js_renderer_Camera_getRect));
//   __jsb_cocos2d_renderer_Camera_proto->defineFunction("extractView", _SE(js_renderer_Camera_extractView));
//    __jsb_cocos2d_renderer_Camera_proto->defineFunction("screenToWorld", _SE(js_renderer_Camera_screenToWorld));
//    __jsb_cocos2d_renderer_Camera_proto->defineFunction("worldToScreen", _SE(js_renderer_Camera_worldToScreen));

    // Effect
    __jsb_cocos2d_renderer_Effect_proto->defineFunction("setProperty", _SE(js_renderer_Effect_setProperty));
    __jsb_cocos2d_renderer_Effect_proto->defineFunction("self", _SE(js_renderer_Effect_self));

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

    // BaseRenderer
    __jsb_cocos2d_renderer_BaseRenderer_proto->defineProperty("_programLib", _SE(js_renderer_BaseRenderer_prop_getProgramLib), nullptr);

    // Scene
//    __jsb_cocos2d_renderer_Scene_proto->defineFunction("addModelNative", _SE(js_renderer_Scene_addModel));
    
    // ForwardRenderer
    __jsb_cocos2d_renderer_ForwardRenderer_proto->defineFunction("renderNative", _SE(js_renderer_ForwardRenderer_render));

    return true;
}
