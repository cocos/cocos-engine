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

//static bool js_renderer_Effect_prop_getDefines(se::State& s)
//{
//    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
//    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setProperty : Invalid Native Object");
//    const auto& args = s.args();
//    size_t argc = args.size();
//    CC_UNUSED bool ok = true;
//    if (argc == 0)
//    {
//        std_vector_EffectDefine_to_seval(cobj->getDefines(), &s.rval());
//        return true;
//    }
//
//    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
//    return false;
//}
//SE_BIND_PROP_GET(js_renderer_Effect_prop_getDefines);

//static bool js_renderer_Effect_prop_getTechniques(se::State& s)
//{
//    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
//    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setProperty : Invalid Native Object");
//    const auto& args = s.args();
//    size_t argc = args.size();
//    CC_UNUSED bool ok = true;
//    if (argc == 0)
//    {
//        Vector_to_seval(cobj->getTechniques(), &s.rval());
//        return true;
//    }
//    
//    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
//    return false;
//}
//SE_BIND_PROP_GET(js_renderer_Effect_prop_getTechniques);
//
//static bool js_renderer_Effect_prop_getProperties(se::State& s)
//{
//    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
//    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_setProperty : Invalid Native Object");
//    const auto& args = s.args();
//    size_t argc = args.size();
//    if (argc == 0)
//    {
//        std_unorderedmap_string_EffectProperty_to_seval(cobj->getProperties(), &s.rval());
//        return true;
//    }
//    
//    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
//    return false;
//}
//SE_BIND_PROP_GET(js_renderer_Effect_prop_getProperties);
//
//static bool js_renderer_Effect_getProperty(se::State& s)
//{
//    cocos2d::renderer::Effect* cobj = (cocos2d::renderer::Effect*)s.nativeThisObject();
//    SE_PRECONDITION2(cobj, false, "js_renderer_Effect_getProperty : Invalid Native Object");
//    const auto& args = s.args();
//    size_t argc = args.size();
//    CC_UNUSED bool ok = true;
//    if (argc == 1) {
//        std::string arg0;
//        ok &= seval_to_std_string(args[0], &arg0);
//        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getProperty : Error processing arguments");
//        const cocos2d::renderer::Technique::Parameter& result = cobj->getProperty(arg0);
//        ok &= EffectProperty_to_seval(result, &s.rval());
//        SE_PRECONDITION2(ok, false, "js_renderer_Effect_getProperty : Error processing arguments");
//        return true;
//    }
//    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
//    return false;
//}
//SE_BIND_FUNC(js_renderer_Effect_getProperty)

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
    
    void addEffects2Model(cocos2d::renderer::Model* model, const se::Value& modelVal)
    {
        // create effects
        se::Value effectsVal;
        modelVal.toObject()->getProperty("_effects", &effectsVal);
        const auto& effectsObj = effectsVal.toObject();
        uint32_t effectsLength = 0;
        effectsObj->getArrayLength(&effectsLength);
        se::Value effectVal;
        se::Value nativeObjVal;
        for (uint32_t i = 0; i < effectsLength; ++i)
        {
            effectsObj->getArrayElement(i, &effectVal);
            effectVal.toObject()->getProperty("_nativeObj", &nativeObjVal);
            model->addEffect(static_cast<cocos2d::renderer::Effect*>(nativeObjVal.toObject()->getPrivateData()));
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
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("getColor", _SE(js_renderer_Camera_getColor));
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("getRect", _SE(js_renderer_Camera_getRect));
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("extractView", _SE(js_renderer_Camera_extractView));
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("screenToWorld", _SE(js_renderer_Camera_screenToWorld));
    __jsb_cocos2d_renderer_Camera_proto->defineFunction("worldToScreen", _SE(js_renderer_Camera_worldToScreen));

    // Effect
//    __jsb_cocos2d_renderer_Effect_proto->defineFunction("extractDefines", _SE(js_renderer_Effect_extractDefines));
//    __jsb_cocos2d_renderer_Effect_proto->defineFunction("getProperty", _SE(js_renderer_Effect_getProperty));
    __jsb_cocos2d_renderer_Effect_proto->defineFunction("setProperty", _SE(js_renderer_Effect_setProperty));
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

    // BaseRenderer
    __jsb_cocos2d_renderer_BaseRenderer_proto->defineProperty("_programLib", _SE(js_renderer_BaseRenderer_prop_getProgramLib), nullptr);


    // Scene
    __jsb_cocos2d_renderer_Scene_proto->defineFunction("addModel", _SE(js_renderer_Scene_addModel));

    return true;
}
