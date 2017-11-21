#include "jsb_opengl_node.hpp"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "scripting/js-bindings/manual/jsb_opengl_functions.hpp"

USING_NS_CC;

void JSB_GLNode::draw(Renderer *renderer, const Mat4& transform, uint32_t flags)
{
    _customCommand.init(_globalZOrder);
    _customCommand.func = CC_CALLBACK_0(JSB_GLNode::onDraw, this, transform, flags);
    renderer->addCommand(&_customCommand);
}

void JSB_GLNode::onDraw(Mat4 &transform, uint32_t flags)
{
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    auto iter = se::NativePtrToObjectMap::find(this);
    if (iter != se::NativePtrToObjectMap::end())
    {
        se::Object* jsObj = iter->second;
        se::Value funcVal;
        if (jsObj->getProperty("draw", &funcVal) && funcVal.isObject() && funcVal.toObject()->isFunction())
        {
            auto director = Director::getInstance();
            director->pushMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_MODELVIEW);
            director->loadMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_MODELVIEW, transform);

            funcVal.toObject()->call(se::EmptyValueArray, jsObj);

            director->popMatrix(MATRIX_STACK_TYPE::MATRIX_STACK_MODELVIEW);
        }
    }
}

static se::Class* __jsb_cocos2dx_GLNode_class = nullptr;
static se::Object* __jsb_cocos2dx_GLNode_proto = nullptr;

static bool js_cocos2dx_GLNode_finalize(se::State& s)
{
    CCLOGINFO("jsbindings: finalizing JS object %p (JSB_GLNode)", s.nativeThisObject());
    JSB_GLNode* cobj = (JSB_GLNode*)s.nativeThisObject();
    if (cobj->getReferenceCount() == 1)
        cobj->autorelease();
    else
        cobj->release();
    return true;
}
SE_BIND_FINALIZE_FUNC(js_cocos2dx_GLNode_finalize)

static bool js_cocos2dx_GLNode_constructor(se::State& s)
{
    JSB_GLNode* cobj = new (std::nothrow) JSB_GLNode();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_CTOR(js_cocos2dx_GLNode_constructor, __jsb_cocos2dx_GLNode_class, js_cocos2dx_GLNode_finalize)

static bool js_cocos2dx_GLNode_ctor(se::State& s)
{
    JSB_GLNode* cobj = new (std::nothrow) JSB_GLNode();
    s.thisObject()->setPrivateData(cobj);
    return true;
}
SE_BIND_SUB_CLS_CTOR(js_cocos2dx_GLNode_ctor, __jsb_cocos2dx_GLNode_class, js_cocos2dx_GLNode_finalize)

static bool js_cocos2dx_GLNode_create(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        auto result = new (std::nothrow) JSB_GLNode();
        auto obj = se::Object::createObjectWithClass(__jsb_cocos2dx_GLNode_class);
        obj->setPrivateData(result);
        s.rval().setObject(obj);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_GLNode_create)

bool js_register_cocos2dx_GLNode(se::Object* obj)
{
    auto cls = se::Class::create("GLNode", obj, __jsb_cocos2d_Node_proto, _SE(js_cocos2dx_GLNode_constructor));

    cls->defineFunction("ctor", _SE(js_cocos2dx_GLNode_ctor));
    cls->defineStaticFunction("create", _SE(js_cocos2dx_GLNode_create));
    cls->defineFinalizeFunction(_SE(js_cocos2dx_GLNode_finalize));
    cls->install();
    JSBClassType::registerClass<JSB_GLNode>(cls);

    __jsb_cocos2dx_GLNode_proto = cls->getProto();
    __jsb_cocos2dx_GLNode_class = cls;

    jsb_set_extend_property("cc", "GLNode");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}
