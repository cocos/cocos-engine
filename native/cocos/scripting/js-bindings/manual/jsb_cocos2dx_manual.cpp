//
//  jsb_cocos2dx_manual.cpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 5/26/17.
//
//

#include "jsb_cocos2dx_manual.hpp"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"
#include "cocos/scripting/js-bindings/manual/ScriptingCore.h"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include "cocos/scripting/js-bindings/auto/jsb_cocos2dx_ui_auto.hpp"

#include "storage/local-storage/LocalStorage.h"
#include "cocos2d.h"

using namespace cocos2d;

static bool jsb_cocos2dx_empty_func(se::State& s)
{
    return true;
}
SE_BIND_FUNC(jsb_cocos2dx_empty_func)

class __JSPlistDelegator: public cocos2d::SAXDelegator
{
public:
    static __JSPlistDelegator* getInstance() {
        static __JSPlistDelegator* pInstance = NULL;
        if (pInstance == NULL) {
            pInstance = new (std::nothrow) __JSPlistDelegator();
        }
        return pInstance;
    };

    virtual ~__JSPlistDelegator();

    cocos2d::SAXParser* getParser();

    std::string parse(const std::string& path);
    std::string parseText(const std::string& text);

    // implement pure virtual methods of SAXDelegator
    void startElement(void *ctx, const char *name, const char **atts) override;
    void endElement(void *ctx, const char *name) override;
    void textHandler(void *ctx, const char *ch, int len) override;

private:
    cocos2d::SAXParser _parser;
    std::string _result;
    bool _isStoringCharacters;
    std::string _currentValue;
};

// cc.PlistParser.getInstance()
static bool js_PlistParser_getInstance(se::State& s)
{
    __JSPlistDelegator* delegator = __JSPlistDelegator::getInstance();
    SAXParser* parser = delegator->getParser();

    if (parser) {
        native_ptr_to_rooted_seval<SAXParser>(parser, __jsb_cocos2d_SAXParser_class, &s.rval());
        return true;
    }
    return false;
}
SE_BIND_FUNC(js_PlistParser_getInstance)

// cc.PlistParser.getInstance().parse(text)
static bool js_PlistParser_parse(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    __JSPlistDelegator* delegator = __JSPlistDelegator::getInstance();

    bool ok = true;
    if (argc == 1) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        std::string parsedStr = delegator->parseText(arg0);
        std::replace(parsedStr.begin(), parsedStr.end(), '\n', ' ');

        se::Value strVal;
        std_string_to_seval(parsedStr, &strVal);

        se::HandleObject robj(se::Object::createJSONObject(strVal.toString()));
        s.rval().setObject(robj);
        return true;
    }
    SE_REPORT_ERROR("js_PlistParser_parse : wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_PlistParser_parse)

cocos2d::SAXParser* __JSPlistDelegator::getParser() {
    return &_parser;
}

std::string __JSPlistDelegator::parse(const std::string& path) {
    _result.clear();

    SAXParser parser;
    if (false != parser.init("UTF-8") )
    {
        parser.setDelegator(this);
        parser.parse(FileUtils::getInstance()->fullPathForFilename(path));
    }

    return _result;
}

__JSPlistDelegator::~__JSPlistDelegator(){
    CCLOGINFO("deallocing __JSSAXDelegator: %p", this);
}

std::string __JSPlistDelegator::parseText(const std::string& text){
    _result.clear();

    SAXParser parser;
    if (false != parser.init("UTF-8") )
    {
        parser.setDelegator(this);
        parser.parse(text.c_str(), text.size());
    }

    return _result;
}

void __JSPlistDelegator::startElement(void *ctx, const char *name, const char **atts) {
    _isStoringCharacters = true;
    _currentValue.clear();

    std::string elementName = (char*)name;

    int end = (int)_result.size() - 1;
    if(end >= 0 && _result[end] != '{' && _result[end] != '[' && _result[end] != ':') {
        _result += ",";
    }

    if (elementName == "dict") {
        _result += "{";
    }
    else if (elementName == "array") {
        _result += "[";
    }
}

void __JSPlistDelegator::endElement(void *ctx, const char *name) {
    _isStoringCharacters = false;
    std::string elementName = (char*)name;

    if (elementName == "dict") {
        _result += "}";
    }
    else if (elementName == "array") {
        _result += "]";
    }
    else if (elementName == "key") {
        _result += "\"" + _currentValue + "\":";
    }
    else if (elementName == "string") {
        _result += "\"" + _currentValue + "\"";
    }
    else if (elementName == "false" || elementName == "true") {
        _result += elementName;
    }
    else if (elementName == "real" || elementName == "integer") {
        _result += _currentValue;
    }
}

void __JSPlistDelegator::textHandler(void*, const char *ch, int len) {
    std::string text((char*)ch, 0, len);

    if (_isStoringCharacters)
    {
        _currentValue += text;
    }
}

static bool register_plist_parser(se::Object* obj)
{
    se::Value v;
    __ccObj->getProperty("PlistParser", &v);
    assert(v.isObject());
    v.toObject()->defineFunction("getInstance", _SE(js_PlistParser_getInstance));

    __jsb_cocos2d_SAXParser_proto->defineFunction("parse", _SE(js_PlistParser_parse));

    se::ScriptEngine::getInstance()->clearException();

    return true;
}

// cc.sys.localStorage

static bool JSB_localStorageGetItem(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 1)
    {
        std::string ret_val;
        bool ok = true;
        std::string key;
        ok = seval_to_std_string(args[0], &key);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::string value;
        ok = localStorageGetItem(key, &value);
        if (ok)
            s.rval().setString(value);
        else
            s.rval().setNull(); // Should return null to make JSB behavior same as Browser since returning undefined will make JSON.parse(undefined) trigger exception.

        return true;
    }

    SE_REPORT_ERROR("Invalid number of arguments");
    return false;
}
SE_BIND_FUNC(JSB_localStorageGetItem)

static bool JSB_localStorageRemoveItem(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 1)
    {
        bool ok = true;
        std::string key;
        ok = seval_to_std_string(args[0], &key);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        localStorageRemoveItem(key);
        return true;
    }

    SE_REPORT_ERROR("Invalid number of arguments");
    return false;
}
SE_BIND_FUNC(JSB_localStorageRemoveItem)

static bool JSB_localStorageSetItem(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 2)
    {
        bool ok = true;
        std::string key;
        ok = seval_to_std_string(args[0], &key);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        std::string value;
        ok = seval_to_std_string(args[1], &value);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        localStorageSetItem(key, value);
        return true;
    }

    SE_REPORT_ERROR("Invalid number of arguments");
    return false;
}
SE_BIND_FUNC(JSB_localStorageSetItem)

static bool JSB_localStorageClear(se::State& s)
{
    const auto& args = s.args();
    size_t argc = args.size();
    if (argc == 0)
    {
        localStorageClear();
        return true;
    }

    SE_REPORT_ERROR("Invalid number of arguments");
    return false;
}
SE_BIND_FUNC(JSB_localStorageClear)


static bool register_sys_localStorage(se::Object* obj)
{
    se::Value sys;
    if (!obj->getProperty("sys", &sys))
    {
        se::HandleObject sysObj(se::Object::createPlainObject());
        obj->setProperty("sys", se::Value(sysObj));
        sys.setObject(sysObj);
    }

    se::HandleObject localStorageObj(se::Object::createPlainObject());
    sys.toObject()->setProperty("localStorage", se::Value(localStorageObj));

    localStorageObj->defineFunction("getItem", _SE(JSB_localStorageGetItem));
    localStorageObj->defineFunction("removeItem", _SE(JSB_localStorageRemoveItem));
    localStorageObj->defineFunction("setItem", _SE(JSB_localStorageSetItem));
    localStorageObj->defineFunction("clear", _SE(JSB_localStorageClear));

    std::string strFilePath = cocos2d::FileUtils::getInstance()->getWritablePath();
    strFilePath += "/jsb.sqlite";
    localStorageInit(strFilePath);

    se::ScriptEngine::getInstance()->addBeforeCleanupHook([](){
        localStorageFree();
    });

    se::ScriptEngine::getInstance()->clearException();

    return true;
}

//
static bool invokeJSMouseCallback(EventListenerMouse* listener, const char* funcName, EventMouse* arg1, se::Value* retVal)
{
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;
    bool ok = true;
    se::Value listenerVal;
    native_ptr_to_seval<EventListenerMouse>(listener, &listenerVal);
    assert(listenerVal.isObject());
    se::Object* listenerObj = listenerVal.toObject();
    se::Value funcVal;
    ok = listenerObj->getProperty(funcName, &funcVal);
    if (!ok)
    {
        CCLOGERROR("Can't find property: %s", funcName);
        return false;
    }

    assert(funcVal.isObject() && funcVal.toObject()->isFunction());
    se::ValueArray argArr;
    argArr.reserve(1);
    se::Value arg1Val;
    bool fromCache = true;
    ok = native_ptr_to_seval<EventMouse>(arg1, &arg1Val, &fromCache);
    SE_PRECONDITION2(ok, false, "invokeJSMouseCallback convert arg1 failed!");

    if (!fromCache)
    { // EventMouse is holded by CCGLView-desktop forever. So just root it once to make it never be garbage collected.
        arg1Val.toObject()->root();
    }
    argArr.push_back(std::move(arg1Val));

    assert(se::NativePtrToObjectMap::find(arg1) != se::NativePtrToObjectMap::end());

    ok = funcVal.toObject()->call(argArr, listenerObj, retVal);
    SE_PRECONDITION2(ok, false, "invokeJSMouseCallback call function failed!");

    return true;
}

static bool js_EventListenerMouse_create(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 0) {
        auto ret = new (std::nothrow) EventListenerMouse();
        ret->init();

        ret->onMouseDown = [ret](EventMouse* event) {
            invokeJSMouseCallback(ret, "onMouseDown", event, nullptr);
        };

        ret->onMouseUp = [ret](EventMouse* event) {
            invokeJSMouseCallback(ret, "onMouseUp", event, nullptr);
        };

        ret->onMouseMove = [ret](EventMouse* event) {
            invokeJSMouseCallback(ret, "onMouseMove", event, nullptr);
        };

        ret->onMouseScroll = [ret](EventMouse* event) {
            invokeJSMouseCallback(ret, "onMouseScroll", event, nullptr);
        };

        se::Object* obj = se::Object::createObjectWithClass(__jsb_cocos2d_EventListenerMouse_class);
        obj->setPrivateData(ret);
        s.rval().setObject(obj);

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_EventListenerMouse_create)

//
enum TouchOneByOneType
{
    TOUCH_ONE_BY_ONE_ON_TOUCH_BEGAN = 0,
    TOUCH_ONE_BY_ONE_ON_TOUCH_MOVED,
    TOUCH_ONE_BY_ONE_ON_TOUCH_ENDED,
    TOUCH_ONE_BY_ONE_ON_TOUCH_CANCELLED
};

static const char* __touchOneByOneTypeName[] = {
    "onTouchBegan",
    "onTouchMoved",
    "onTouchEnded",
    "onTouchCancelled"
};

static bool invokeJSTouchOneByOneCallback(EventListenerTouchOneByOne* listener, TouchOneByOneType type, Touch* touch, Event* event, se::Value* retVal)
{
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    assert(type >= TOUCH_ONE_BY_ONE_ON_TOUCH_BEGAN && type <= TOUCH_ONE_BY_ONE_ON_TOUCH_CANCELLED);
    bool ok = true;
    se::Value listenerVal;
    native_ptr_to_seval<EventListenerTouchOneByOne>(listener, &listenerVal);
    assert(listenerVal.isObject());

    const char* funcName = __touchOneByOneTypeName[type];
    se::Object* listenerObj = listenerVal.toObject();
    se::Value funcVal;
    ok = listenerObj->getProperty(funcName, &funcVal);
    if (!ok)
    {
        CCLOGERROR("Can't find property: %s", funcName);
        return false;
    }

    assert(funcVal.isObject() && funcVal.toObject()->isFunction());

    se::ValueArray argArr;
    argArr.reserve(2);
    se::Value arg1Val;

    do
    {
        ok = native_ptr_to_seval<Touch>(touch, &arg1Val);
        SE_PRECONDITION_ERROR_BREAK(ok, "invokeJSTouchOneByOneCallback convert arg1 failed!");
        argArr.push_back(std::move(arg1Val));

        bool fromCache = true;
        se::Value arg2Val;
        ok = native_ptr_to_seval<Event>(event, &arg2Val, &fromCache);
        SE_PRECONDITION_ERROR_BREAK(ok, "invokeJSTouchOneByOneCallback convert arg2 failed!");
        if (!fromCache)
        {
            // EventTouch is holded by CCGLView forever. So just root it once to make it never be garbage collected.
            arg2Val.toObject()->root();
        }

        argArr.push_back(std::move(arg2Val));

        assert(se::NativePtrToObjectMap::find(touch) != se::NativePtrToObjectMap::end());
        assert(se::NativePtrToObjectMap::find(event) != se::NativePtrToObjectMap::end());

        ok = funcVal.toObject()->call(argArr, listenerObj, retVal);
        SE_PRECONDITION_ERROR_BREAK(ok, "invokeJSTouchOneByOneCallback call function failed!");

    } while(false);

    return ok;
}

static bool js_EventListenerTouchOneByOne_create(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 0) {
        auto ret = new (std::nothrow) EventListenerTouchOneByOne();
        ret->init();

        ret->onTouchBegan = [ret](Touch* touch, Event* event) -> bool {

            se::Value retVal;
            invokeJSTouchOneByOneCallback(ret, TOUCH_ONE_BY_ONE_ON_TOUCH_BEGAN, touch, event, &retVal);
            if (retVal.isBoolean())
                return retVal.toBoolean();

            return false;
        };

        ret->onTouchMoved = [ret](Touch* touch, Event* event) {
            invokeJSTouchOneByOneCallback(ret, TOUCH_ONE_BY_ONE_ON_TOUCH_MOVED, touch, event, nullptr);
        };

        ret->onTouchEnded = [ret](Touch* touch, Event* event) {
            invokeJSTouchOneByOneCallback(ret, TOUCH_ONE_BY_ONE_ON_TOUCH_ENDED, touch, event, nullptr);
        };

        ret->onTouchCancelled = [ret](Touch* touch, Event* event) {
            invokeJSTouchOneByOneCallback(ret, TOUCH_ONE_BY_ONE_ON_TOUCH_CANCELLED, touch, event, nullptr);
        };

        se::Object* obj = se::Object::createObjectWithClass(__jsb_cocos2d_EventListenerTouchOneByOne_class);
        obj->setPrivateData(ret);
        s.rval().setObject(obj);

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_EventListenerTouchOneByOne_create)

static bool invokeJSTouchAllAtOnceCallback(EventListenerTouchAllAtOnce* listener, const char* funcName, const std::vector<Touch*>& touches, Event* event, se::Value* retVal)
{
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;

    bool ok = true;
    se::Value listenerVal;
    native_ptr_to_seval<EventListenerTouchAllAtOnce>(listener, &listenerVal);
    assert(listenerVal.isObject());
    se::Object* listenerObj = listenerVal.toObject();
    se::Value funcVal;
    ok = listenerObj->getProperty(funcName, &funcVal);
    if (!ok)
    {
        CCLOGERROR("Can't find property: %s", funcName);
        return false;
    }

    assert(funcVal.isObject() && funcVal.toObject()->isFunction());
    se::ValueArray argArr;
    argArr.reserve(2);

    se::Value arg1Val;
    ok = std_vector_Touch_to_seval(touches, &arg1Val);
    SE_PRECONDITION2(ok, false, "invokeJSTouchAllAtOnceCallback convert arg1 failed!");
    argArr.push_back(std::move(arg1Val));

    bool fromCache = true;
    se::Value arg2Val;
    ok = native_ptr_to_seval<Event>(event, &arg2Val, &fromCache);
    SE_PRECONDITION2(ok, false, "invokeJSTouchAllAtOnceCallback convert arg2 failed!");
    if (!fromCache)
    {
        // EventTouch is holded by CCGLView forever. So just root it once to make it never be garbage collected.
        arg2Val.toObject()->root();
    }

    argArr.push_back(std::move(arg2Val));

    ok = funcVal.toObject()->call(argArr, listenerObj, retVal);
    SE_PRECONDITION2(ok, false, "invokeJSTouchAllAtOnceCallback call function failed!");

    return true;
}

static bool js_EventListenerTouchAllAtOnce_create(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 0)
    {
        auto ret = new (std::nothrow) EventListenerTouchAllAtOnce();
        ret->init();

        ret->onTouchesBegan = [ret](const std::vector<Touch*>& touches, Event* event) {
            invokeJSTouchAllAtOnceCallback(ret, "onTouchesBegan", touches, event, nullptr);
        };

        ret->onTouchesMoved = [ret](const std::vector<Touch*>& touches, Event* event) {
            invokeJSTouchAllAtOnceCallback(ret, "onTouchesMoved", touches, event, nullptr);
        };

        ret->onTouchesEnded = [ret](const std::vector<Touch*>& touches, Event* event) {
            invokeJSTouchAllAtOnceCallback(ret, "onTouchesEnded", touches, event, nullptr);
        };

        ret->onTouchesCancelled = [ret](const std::vector<Touch*>& touches, Event* event) {
            invokeJSTouchAllAtOnceCallback(ret, "onTouchesCancelled", touches, event, nullptr);
        };

        se::Object* obj = se::Object::createObjectWithClass(__jsb_cocos2d_EventListenerTouchAllAtOnce_class);
        obj->setPrivateData(ret);
        s.rval().setObject(obj);

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_EventListenerTouchAllAtOnce_create)

static bool invokeJSKeyboardCallback(EventListenerKeyboard* listener, const char* funcName, EventKeyboard::KeyCode keyCode, Event* event, se::Value* retVal)
{
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;
    bool ok = true;
    se::Value listenerVal;
    native_ptr_to_seval<EventListenerKeyboard>(listener, &listenerVal);
    assert(listenerVal.isObject());
    se::Object* listenerObj = listenerVal.toObject();
    se::Value funcVal;
    ok = listenerObj->getProperty(funcName, &funcVal);
    if (!ok)
    {
        CCLOGERROR("Can't find property: %s", funcName);
        return false;
    }

    assert(funcVal.isObject() && funcVal.toObject()->isFunction());
    se::ValueArray argArr;
    argArr.reserve(2);

    se::Value arg1Val;
    ok = int32_to_seval((int32_t)keyCode, &arg1Val);
    SE_PRECONDITION2(ok, false, "invokeJSKeyboardCallback convert arg1 failed!");
    argArr.push_back(std::move(arg1Val));


    se::Value arg2Val;
    ok = native_ptr_to_seval<Event>(event, &arg2Val);
    SE_PRECONDITION2(ok, false, "invokeJSKeyboardCallback convert arg2 failed!");
    argArr.push_back(std::move(arg2Val));

    ok = funcVal.toObject()->call(argArr, listenerObj, retVal);
    SE_PRECONDITION2(ok, false, "invokeJSKeyboardCallback call function failed!");

    return true;
}

static bool js_EventListenerKeyboard_create(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 0)
    {
        auto ret = new (std::nothrow) EventListenerKeyboard();
        ret->init();

        ret->onKeyPressed = [ret](EventKeyboard::KeyCode keyCode, Event* event) {
            invokeJSKeyboardCallback(ret, "_onKeyPressed", keyCode, event, nullptr);
        };

        ret->onKeyReleased = [ret](EventKeyboard::KeyCode keyCode, Event* event) {
            invokeJSKeyboardCallback(ret, "_onKeyReleased", keyCode, event, nullptr);
        };

        se::Object* obj = se::Object::createObjectWithClass(__jsb_cocos2d_EventListenerKeyboard_class);
        obj->setPrivateData(ret);
        s.rval().setObject(obj);

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_EventListenerKeyboard_create)

static bool js_EventListenerAcceleration_create(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 1)
    {
        se::Object* obj = se::Object::createObjectWithClass(__jsb_cocos2d_EventListenerAcceleration_class);
        s.rval().setObject(obj);

        std::function<void (Acceleration*, Event*)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction())
            {
                se::Value jsThis(obj);
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](Acceleration* acc, Event* event) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;

                    bool ok = true;
                    se::ValueArray args;
                    args.resize(2);
                    ok = Acceleration_to_seval(acc, &args[0]);
                    ok = native_ptr_to_seval<Event>(event, &args[1]);
                    se::Value rval;
                    se::Object* thisObj = jsThis.toObject();
                    se::Object* funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                arg0 = lambda;
            }
            else
            {
                arg0 = nullptr;
            }
        } while(false);

        auto ret = new (std::nothrow) EventListenerAcceleration();
        ret->init(arg0);

        obj->setPrivateData(ret);

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_EventListenerAcceleration_create)

static bool js_EventListenerFocus_create(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 0)
    {
        auto ret = new (std::nothrow) EventListenerFocus();
        ret->init();

        ret->onFocusChanged = [ret](ui::Widget* lostFocusWidget, ui::Widget* getFocusWidget){

            se::Value thisVal;
            native_ptr_to_seval<EventListenerFocus>(ret, &thisVal);

            assert(thisVal.isObject());

            se::Value funcVal;
            if (thisVal.toObject()->getProperty("onFocusChanged", &funcVal) && funcVal.isObject() && funcVal.toObject()->isFunction())
            {
                se::ValueArray args;
                args.resize(2);

                native_ptr_to_seval<ui::Widget>(lostFocusWidget, &args[0]);
                native_ptr_to_seval<ui::Widget>(getFocusWidget, &args[1]);

                funcVal.toObject()->call(args, thisVal.toObject());
            }
        };

        se::Object* obj = se::Object::createObjectWithClass(__jsb_cocos2d_EventListenerFocus_class);
        obj->setPrivateData(ret);
        s.rval().setObject(obj);

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_EventListenerFocus_create)

static bool js_EventListenerCustom_create(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();

    if (argc == 2)
    {
        bool ok = false;
        std::string eventName;
        ok = seval_to_std_string(args[0], &eventName);
        SE_PRECONDITION2(ok && !eventName.empty(), false, "Convert event name failed!");

        se::Value funcVal = args[1];
        assert(funcVal.isObject() && funcVal.toObject()->isFunction());

        auto ret = new (std::nothrow) EventListenerCustom();

        ret->init(eventName, [ret, funcVal](EventCustom* event){

            if (se::NativePtrToObjectMap::find(ret) == se::NativePtrToObjectMap::end())
            {
                CCLOGERROR("can't find se::Object with native ptr: %p", ret);
                return;
            }

            bool ok = false;
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            assert(funcVal.isObject() && funcVal.toObject()->isFunction());

            se::ValueArray argArr;
            argArr.reserve(1);

            const std::string& eventName = event->getEventName();
            if (eventName != Director::EVENT_AFTER_DRAW
                && eventName != Director::EVENT_AFTER_VISIT
                && eventName != Director::EVENT_AFTER_DRAW
                && eventName != Director::EVENT_AFTER_UPDATE
                && eventName != Director::EVENT_BEFORE_UPDATE)
            {
                se::Value arg1Val;
                ok = native_ptr_to_seval<EventCustom>(event, &arg1Val);
                SE_PRECONDITION2_VOID(ok, "EventListenerCustom::create callback: convert arg1 failed!");
                argArr.push_back(std::move(arg1Val));
            }
            funcVal.toObject()->call(argArr, nullptr);

        });

        se::Object* obj = se::Object::createObjectWithClass(__jsb_cocos2d_EventListenerCustom_class);
        obj->setPrivateData(ret);
        s.rval().setObject(obj);

        obj->attachObject(funcVal.toObject());

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 2);
    return false;
}
SE_BIND_FUNC(js_EventListenerCustom_create)

static void onBeforeDispatchTouchEvent(Event* event)
{
    se::AutoHandleScope hs;
    if (event->getType() == Event::Type::TOUCH)
    {
        EventTouch* touchEvent = static_cast<EventTouch*>(event);
        if (touchEvent->getEventCode() == EventTouch::EventCode::BEGAN)
        {
            bool fromCache = true;
            const auto& touches = touchEvent->getTouches();
            for (auto&& touch : touches)
            {
                se::Value touchVal;
                native_ptr_to_seval<Touch>(touch, __jsb_cocos2d_Touch_class, &touchVal, &fromCache);
                assert(!fromCache);
                touchVal.toObject()->root();
            }
        }
    }
}

static void onAfterDispatchTouchEvent(Event* event)
{
    se::AutoHandleScope hs;
    if (event->getType() == Event::Type::TOUCH)
    {
        EventTouch* touchEvent = static_cast<EventTouch*>(event);
        EventTouch::EventCode code = touchEvent->getEventCode();
        if (code == EventTouch::EventCode::ENDED || code == EventTouch::EventCode::CANCELLED)
        {
            const auto& touches = touchEvent->getTouches();
            for (auto&& touch : touches)
            {
                auto iter = se::NativePtrToObjectMap::find(touch);
                assert(iter != se::NativePtrToObjectMap::end());
                iter->second->unroot();
            }
        }
    }
}

static void onTextureCreate(TextureCache* cache, Texture2D* texture)
{
    se::AutoHandleScope hs;
    auto iterOwner = se::NativePtrToObjectMap::find(cache);
    if (iterOwner == se::NativePtrToObjectMap::end())
    {
        assert(false);
        return;
    }

    se::Value textureVal;
    bool fromCache = false;
    native_ptr_to_seval<Texture2D>(texture, __jsb_cocos2d_Texture2D_class, &textureVal, &fromCache);
    if (!fromCache && textureVal.isObject())
    {
        iterOwner->second->attachObject(textureVal.toObject());
    }
    else
    {
        assert(false);
    }
}

static void onTextureDestroy(TextureCache* cache, Texture2D* texture)
{
    se::AutoHandleScope hs;
    auto iterOwner = se::NativePtrToObjectMap::find(cache);
    if (iterOwner == se::NativePtrToObjectMap::end())
    {
        assert(false);
        return;
    }

    se::Value textureVal;
    bool fromCache = false;
    native_ptr_to_seval<Texture2D>(texture, __jsb_cocos2d_Texture2D_class, &textureVal, &fromCache);
    if (fromCache && textureVal.isObject())
    {
        iterOwner->second->detachObject(textureVal.toObject());
    }
    else
    {
        assert(false);
    }
}

static bool register_eventlistener(se::Object* obj)
{
    se::Value v;
    __ccObj->getProperty("EventListenerMouse", &v);
    assert(v.isObject());
    v.toObject()->defineFunction("create", _SE(js_EventListenerMouse_create));

    __ccObj->getProperty("EventListenerTouchOneByOne", &v);
    assert(v.isObject());
    v.toObject()->defineFunction("create", _SE(js_EventListenerTouchOneByOne_create));

    __ccObj->getProperty("EventListenerTouchAllAtOnce", &v);
    assert(v.isObject());
    v.toObject()->defineFunction("create", _SE(js_EventListenerTouchAllAtOnce_create));

    __ccObj->getProperty("EventListenerKeyboard", &v);
    assert(v.isObject());
    v.toObject()->defineFunction("create", _SE(js_EventListenerKeyboard_create));

    __ccObj->getProperty("EventListenerAcceleration", &v);
    assert(v.isObject());
    v.toObject()->defineFunction("create", _SE(js_EventListenerAcceleration_create));

    __ccObj->getProperty("EventListenerFocus", &v);
    assert(v.isObject());
    v.toObject()->defineFunction("create", _SE(js_EventListenerFocus_create));

    __ccObj->getProperty("EventListenerCustom", &v);
    assert(v.isObject());
    v.toObject()->defineFunction("create", _SE(js_EventListenerCustom_create));

    Director::getInstance()->getEventDispatcher()->setBeforeDispatchEventHook(Event::Type::TOUCH, onBeforeDispatchTouchEvent);
    Director::getInstance()->getEventDispatcher()->setAfterDispatchEventHook(Event::Type::TOUCH, onAfterDispatchTouchEvent);

    Director::getInstance()->getTextureCache()->setTextureCreateHook(onTextureCreate);
    Director::getInstance()->getTextureCache()->setTextureDestroyHook(onTextureDestroy);

    se::ScriptEngine::getInstance()->clearException();

    return true;
}


// ActionInterval

static void rebindNativeObject(se::Object* seObj, cocos2d::Ref* oldRef, cocos2d::Ref* newRef)
{
    // Release the old reference as it have been retained by 'action' previously,
    // and the 'action' won't have any chance to release it in the future
    oldRef->release();
    seObj->clearPrivateData();
    seObj->setPrivateData(newRef);
}

static bool js_cocos2dx_TMXLayer_getTiles(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    cocos2d::TMXLayer* cobj = (cocos2d::TMXLayer *)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_TMXLayer_getTiles : Invalid Native Object");

    if (argc == 0)
    {
        uint32_t* tiles = cobj->getTiles();
        cocos2d::Size size = cobj->getLayerSize();
        int32_t count = size.width * size.height;

        se::HandleObject obj(se::Object::createTypedArray(se::Object::TypedArrayType::UINT32, tiles, count * sizeof(int32_t)));
        s.rval().setObject(obj);
        return true;
    }

    SE_REPORT_ERROR("js_cocos2dx_TMXLayer_getTiles : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_TMXLayer_getTiles)

static bool js_cocos2dx_ActionInterval_repeat(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    cocos2d::ActionInterval* cobj = (cocos2d::ActionInterval *)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ActionInterval_repeat : Invalid Native Object");

    if (argc == 1)
    {
        double times;
        if( !seval_to_double(args[0], &times) ) {
            return false;
        }
        int timesInt = (int)times;
        if (timesInt <= 0) {
            SE_REPORT_ERROR("js_cocos2dx_ActionInterval_repeat : Repeat times must be greater than 0");
        }

        cocos2d::Repeat* action = new (std::nothrow) cocos2d::Repeat;
        bool ok = action->initWithAction(cobj, timesInt);
        if (ok)
        {
            rebindNativeObject(s.thisObject(), cobj, action);
            s.rval().setObject(s.thisObject());
        }
        return ok;
    }

    SE_REPORT_ERROR("js_cocos2dx_ActionInterval_repeat : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ActionInterval_repeat)

static bool js_cocos2dx_ActionInterval_repeatForever(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    cocos2d::ActionInterval* cobj = (cocos2d::ActionInterval *)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ActionInterval_repeatForever : Invalid Native Object");

    if (argc == 0) {
        cocos2d::RepeatForever* action = new (std::nothrow) cocos2d::RepeatForever;
        bool ok = action->initWithAction(cobj);
        if (ok)
        {
            rebindNativeObject(s.thisObject(), cobj, action);
            s.rval().setObject(s.thisObject());
        }
        return ok;
    }

    SE_REPORT_ERROR("js_cocos2dx_ActionInterval_repeatForever : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ActionInterval_repeatForever)

static bool js_cocos2dx_ActionInterval_speed(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    cocos2d::ActionInterval* cobj = (cocos2d::ActionInterval *)s.nativeThisObject();
    SE_PRECONDITION2( cobj, false, "js_cocos2dx_ActionInterval_speed : Invalid Native Object");

    if (argc == 1)
    {
        double speed;
        if( !seval_to_double(args[0], &speed) ) {
            return false;
        }
        if (speed < 0) {
            SE_REPORT_ERROR("js_cocos2dx_ActionInterval_speed : Speed must not be negative");
            return false;
        }

        cocos2d::Speed* action = new (std::nothrow) cocos2d::Speed;
        bool ok = action->initWithAction(cobj, speed);
        if (ok)
        {
            rebindNativeObject(s.thisObject(), cobj, action);
            s.rval().setObject(s.thisObject());
        }
        return ok;
    }

    SE_REPORT_ERROR("js_cocos2dx_ActionInterval_speed : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_ActionInterval_speed)

enum ACTION_TAG {
    EASE_IN = 0,
    EASE_OUT,
    EASE_INOUT,
    EASE_EXPONENTIAL_IN,
    EASE_EXPONENTIAL_OUT,
    EASE_EXPONENTIAL_INOUT,
    EASE_SINE_IN,
    EASE_SINE_OUT,
    EASE_SINE_INOUT,
    EASE_ELASTIC_IN,
    EASE_ELASTIC_OUT,
    EASE_ELASTIC_INOUT,
    EASE_BOUNCE_IN,
    EASE_BOUNCE_OUT,
    EASE_BOUNCE_INOUT,
    EASE_BACK_IN,
    EASE_BACK_OUT,
    EASE_BACK_INOUT,

    EASE_BEZIER_ACTION,
    EASE_QUADRATIC_IN,
    EASE_QUADRATIC_OUT,
    EASE_QUADRATIC_INOUT,
    EASE_QUARTIC_IN,
    EASE_QUARTIC_OUT,
    EASE_QUARTIC_INOUT,
    EASE_QUINTIC_IN,
    EASE_QUINTIC_OUT,
    EASE_QUINTIC_INOUT,
    EASE_CIRCLE_IN,
    EASE_CIRCLE_OUT,
    EASE_CIRCLE_INOUT,
    EASE_CUBIC_IN,
    EASE_CUBIC_OUT,
    EASE_CUBIC_INOUT
};

static bool js_cocos2dx_ActionInterval_easing(se::State& s)
{
    const auto& args = s.args();
    uint32_t argc = (uint32_t)args.size();
    cocos2d::ActionInterval* oldAction = (cocos2d::ActionInterval *)s.nativeThisObject();
    SE_PRECONDITION2 (oldAction, false, "js_cocos2dx_ActionInterval_easing : Invalid Native Object");

    cocos2d::ActionInterval* newAction = nullptr;
    se::Value jsTag;
    se::Value jsParam;
    double tag = 0.0;
    double parameter = 0.0;

    for (uint32_t i = 0; i < argc; i++)
    {
        bool hasParam = false;
        const auto& vpi = args[i];
        bool ok = vpi.isObject() && vpi.toObject()->getProperty("tag", &jsTag) && seval_to_double(jsTag, &tag);
        if (vpi.toObject()->getProperty("param", &jsParam))
        {
            seval_to_double(jsParam, &parameter);
            hasParam = true;
        }

        if (!ok) continue;

        ok = true;
        if (tag == EASE_IN)
        {
            if (!hasParam) ok = false;
            auto tmpaction = new (std::nothrow) cocos2d::EaseIn;
            tmpaction->initWithAction(oldAction, parameter);
            newAction = tmpaction;
        }
        else if (tag == EASE_OUT)
        {
            if (!hasParam) ok = false;
            auto tmpaction = new (std::nothrow) cocos2d::EaseOut;
            tmpaction->initWithAction(oldAction, parameter);
            newAction = tmpaction;
        }
        else if (tag == EASE_INOUT)
        {
            if (!hasParam) ok = false;
            auto tmpaction = new (std::nothrow) cocos2d::EaseInOut;
            tmpaction->initWithAction(oldAction, parameter);
            newAction = tmpaction;
        }
        else if (tag == EASE_EXPONENTIAL_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseExponentialIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_EXPONENTIAL_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseExponentialOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_EXPONENTIAL_INOUT)
        {
            auto tmpaction = new (std::nothrow)cocos2d::EaseExponentialInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_SINE_IN)
        {
            auto tmpaction = new (std::nothrow)cocos2d::EaseSineIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_SINE_OUT)
        {
            auto tmpaction = new (std::nothrow)cocos2d::EaseSineOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_SINE_INOUT)
        {
            auto tmpaction = new (std::nothrow)cocos2d::EaseSineInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_ELASTIC_IN)
        {
            if (!hasParam) parameter = 0.3;
            auto tmpaction = new (std::nothrow)cocos2d::EaseElasticIn;
            tmpaction->initWithAction(oldAction, parameter);
            newAction = tmpaction;
        }
        else if (tag == EASE_ELASTIC_OUT)
        {
            if (!hasParam) parameter = 0.3;
            auto tmpaction = new (std::nothrow)cocos2d::EaseElasticOut;
            tmpaction->initWithAction(oldAction, parameter);
            newAction = tmpaction;
        }
        else if (tag == EASE_ELASTIC_INOUT)
        {
            if (!hasParam) parameter = 0.3;
            auto tmpaction = new (std::nothrow)cocos2d::EaseElasticInOut;
            tmpaction->initWithAction(oldAction, parameter);
            newAction = tmpaction;
        }
        else if (tag == EASE_BOUNCE_IN)
        {
            auto tmpaction = new (std::nothrow)cocos2d::EaseBounceIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_BOUNCE_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseBounceOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_BOUNCE_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseBounceInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_BACK_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseBackIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_BACK_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseBackOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_BACK_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseBackInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUADRATIC_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuadraticActionIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUADRATIC_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuadraticActionOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUADRATIC_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuadraticActionInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUARTIC_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuarticActionIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUARTIC_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuarticActionOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUARTIC_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuarticActionInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUINTIC_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuinticActionIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUINTIC_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuinticActionOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_QUINTIC_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseQuinticActionInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_CIRCLE_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseCircleActionIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_CIRCLE_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseCircleActionOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_CIRCLE_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseCircleActionInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_CUBIC_IN)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseCubicActionIn;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_CUBIC_OUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseCubicActionOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_CUBIC_INOUT)
        {
            auto tmpaction = new (std::nothrow) cocos2d::EaseCubicActionInOut;
            tmpaction->initWithAction(oldAction);
            newAction = tmpaction;
        }
        else if (tag == EASE_BEZIER_ACTION)
        {
            se::Value jsParam2;
            se::Value jsParam3;
            se::Value jsParam4;
            double parameter2, parameter3, parameter4;
            ok &= vpi.toObject()->getProperty("param2", &jsParam2);
            ok &=seval_to_double(jsParam2, &parameter2);
            ok &= vpi.toObject()->getProperty("param3", &jsParam3);
            ok &=seval_to_double(jsParam3, &parameter3);
            ok &= vpi.toObject()->getProperty("param4", &jsParam4);
            ok &=seval_to_double(jsParam4, &parameter4);
            if (!ok) continue;

            auto tmpaction = new (std::nothrow) cocos2d::EaseBezierAction;
            tmpaction->initWithAction(oldAction);
            tmpaction->setBezierParamer(parameter, parameter2, parameter3, parameter4);
            newAction = tmpaction;
        }
        else
            continue;

        if (!ok || !newAction) {
            SE_REPORT_ERROR("js_cocos2dx_ActionInterval_easing : Invalid action: At least one action was expecting parameter");
            return false;
        }
    }

    rebindNativeObject(s.thisObject(), oldAction, newAction);
    s.rval().setObject(s.thisObject());

    return true;
}
SE_BIND_FUNC(js_cocos2dx_ActionInterval_easing)

//

static bool js_cocos2dx_CallFunc_init(cocos2d::CallFuncN* nativeObj, se::Object* jsobj, const se::ValueArray& args)
{
    int argc = (int)args.size();

    se::Value funcVal = args[0];
    se::Value thisVal;
    se::Value dataVal;

    if (!funcVal.isObject() || !funcVal.toObject()->isFunction())
    {
        SE_PRECONDITION2(false, false, "js_cocos2dx_CallFunc_create, args[0](func) isn't a function object");
    }

    jsobj->attachObject(funcVal.toObject());

    if (argc >= 2)
    {
        thisVal = args[1];
        if (!thisVal.isObject())
        {
            SE_PRECONDITION2(false, false, "js_cocos2dx_CallFunc_create, args[1](this) isn't an object");
        }
        jsobj->attachObject(thisVal.toObject());
    }

    if (argc >= 3)
    {
        dataVal = args[2];
        if (dataVal.isObject())
            jsobj->attachObject(dataVal.toObject());
    }

    bool ok = nativeObj->initWithFunction([=](Node* sender){

        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;

        if (sender == nullptr)
        {
            sender = nativeObj->getTarget();
        }

        se::Value senderVal;
        if (sender != nullptr)
        {
            native_ptr_to_seval<Node>(sender, &senderVal);
        }

        if (!funcVal.isNullOrUndefined())
        {
            se::ValueArray valArr;
            valArr.reserve(2);
            valArr.push_back(senderVal);
            valArr.push_back(dataVal);

            if (!thisVal.isUndefined())
            {
                funcVal.toObject()->call(valArr, thisVal.toObject());
            }
            else
            {
                funcVal.toObject()->call(valArr, nullptr);
            }
        }
        else
        {
            SE_PRECONDITION2_VOID(false, "js_cocos2dx_CallFunc_create, funcVal is null or undefined!");
        }
    });

    return ok;
}

// cc.CallFunc.create( func, this, [data])
// cc.CallFunc.create( func )
static bool js_cocos2dx_CallFunc_create(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc >= 1 && argc <= 3)
    {
        CallFuncN* ret = new (std::nothrow) CallFuncN;
        se::Object* jsobj = se::Object::createObjectWithClass(__jsb_cocos2d_CallFuncN_class);
        jsobj->setPrivateData(ret);

        if (js_cocos2dx_CallFunc_init(ret, jsobj, args))
        {
            s.rval().setObject(jsobj);
            return true;
        }
        SE_REPORT_ERROR("js_cocos2dx_CallFunc_create: initWithFunction failed!");
        return false;
    }
    SE_REPORT_ERROR("js_cocos2dx_CallFunc_create: Invalid number of arguments");
    return false;
}
SE_BIND_FUNC(js_cocos2dx_CallFunc_create)

// callFunc.initWithFunction( func, this, [data])
// callFunc.initWithFunction( func )
static bool js_cocos2dx_CallFunc_initWithFunction(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc >= 1 && argc <= 3)
    {
        se::Object* jsobj = s.thisObject();
        if (js_cocos2dx_CallFunc_init((CallFuncN*)s.nativeThisObject(), jsobj, args))
        {
            s.rval().setBoolean(true);
            return true;
        }
        SE_REPORT_ERROR("js_cocos2dx_CallFunc_initWithFunction: initWithFunction failed!");
        return false;
    }
    SE_REPORT_ERROR("js_cocos2dx_CallFunc_initWithFunction: Invalid number of arguments");
    return false;
}
SE_BIND_FUNC(js_cocos2dx_CallFunc_initWithFunction)

template<typename T>
static bool js_BezierActions_init(se::State& s, T* nativeObj)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 2)
    {
        bool ok = false;
        double t = 0.0;
        ok = seval_to_double(args[0], &t);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        std::vector<Vec2> arr;
        ok = seval_to_std_vector_Vec2(args[1], &arr);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        SE_PRECONDITION2(arr.size() >= 3, false, "args[1] isn't an array with 3 elements");

        ccBezierConfig config;
        config.controlPoint_1 = arr[0];
        config.controlPoint_2 = arr[1];
        config.endPosition = arr[2];

        ok = nativeObj->initWithDuration(t, config);
        SE_PRECONDITION2(ok, false, "initWithDuration failed!");

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}


static bool js_cocos2dx_BezierBy_create(se::State& s)
{
    cocos2d::BezierBy* nativeObj = new (std::nothrow) cocos2d::BezierBy();
    bool ok = js_BezierActions_init(s, nativeObj);
    if (ok)
    {
        se::Object* jsobj = se::Object::createObjectWithClass(__jsb_cocos2d_BezierBy_class);
        jsobj->setPrivateData(nativeObj);
        s.rval().setObject(jsobj);
    }
    return ok;
}
SE_BIND_FUNC(js_cocos2dx_BezierBy_create)

static bool js_cocos2dx_BezierBy_initWithDuration(se::State& s)
{
    bool ok = js_BezierActions_init(s, (cocos2d::BezierBy*)s.nativeThisObject());
    s.rval().setBoolean(ok);
    return ok;
}
SE_BIND_FUNC(js_cocos2dx_BezierBy_initWithDuration)

static bool js_cocos2dx_BezierTo_create(se::State& s)
{
    cocos2d::BezierTo* nativeObj = new (std::nothrow) cocos2d::BezierTo();
    bool ok = js_BezierActions_init(s, nativeObj);
    if (ok)
    {
        se::Object* jsobj = se::Object::createObjectWithClass(__jsb_cocos2d_BezierTo_class);
        jsobj->setPrivateData(nativeObj);
        s.rval().setObject(jsobj);
    }
    return ok;
}
SE_BIND_FUNC(js_cocos2dx_BezierTo_create)

static bool js_cocos2dx_BezierTo_initWithDuration(se::State& s)
{
    bool ok = js_BezierActions_init(s, (cocos2d::BezierTo*)s.nativeThisObject());
    s.rval().setBoolean(ok);
    return ok;
}
SE_BIND_FUNC(js_cocos2dx_BezierTo_initWithDuration)

template<typename T>
static bool js_CardinalSplineActions_init(se::State& s, T* nativeObj)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    bool ok = true;
    if (argc == 3)
    {
        double dur = 0.0;
        ok = seval_to_double(args[0], &dur);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        std::vector<Vec2> arr;
        ok = seval_to_std_vector_Vec2(args[1], &arr);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        double ten = 0.0;
        ok = seval_to_double(args[2], &ten);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        PointArray* points = PointArray::create(arr.size());

        for(const auto& pt : arr)
        {
            points->addControlPoint(pt);
        }

        ok = nativeObj->initWithDuration(dur, points, ten);
        SE_PRECONDITION2(ok, false, "initWithDuration failed!");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

static bool js_cocos2dx_CardinalSplineBy_create(se::State& s)
{
    cocos2d::CardinalSplineBy* nativeObj = new (std::nothrow) cocos2d::CardinalSplineBy();
    bool ok = js_CardinalSplineActions_init(s, nativeObj);
    if (ok)
    {
        se::Object* jsobj = se::Object::createObjectWithClass(__jsb_cocos2d_CardinalSplineBy_class);
        jsobj->setPrivateData(nativeObj);
        s.rval().setObject(jsobj);
    }
    return ok;
}
SE_BIND_FUNC(js_cocos2dx_CardinalSplineBy_create)

static bool js_cocos2dx_CardinalSplineBy_initWithDuration(se::State& s)
{
    bool ok = js_CardinalSplineActions_init(s, (cocos2d::CardinalSplineBy*)s.nativeThisObject());
    s.rval().setBoolean(ok);
    return ok;
}
SE_BIND_FUNC(js_cocos2dx_CardinalSplineBy_initWithDuration)

static bool js_cocos2dx_CardinalSplineTo_create(se::State& s)
{
    cocos2d::CardinalSplineTo* nativeObj = new (std::nothrow) cocos2d::CardinalSplineTo();
    bool ok = js_CardinalSplineActions_init(s, nativeObj);
    if (ok)
    {
        se::Object* jsobj = se::Object::createObjectWithClass(__jsb_cocos2d_CardinalSplineTo_class);
        jsobj->setPrivateData(nativeObj);
        s.rval().setObject(jsobj);
    }
    return ok;
}
SE_BIND_FUNC(js_cocos2dx_CardinalSplineTo_create)

static bool js_cocos2dx_CardinalSplineTo_initWithDuration(se::State& s)
{
    bool ok = js_CardinalSplineActions_init(s, (cocos2d::CardinalSplineTo*)s.nativeThisObject());
    s.rval().setBoolean(ok);
    return ok;
}
SE_BIND_FUNC(js_cocos2dx_CardinalSplineTo_initWithDuration)

template<typename T>
static bool js_CatmullRomActions_init(se::State& s, T* nativeObj)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    bool ok = true;
    if (argc == 2)
    {
        double dur = 0.0;
        ok = seval_to_double(args[0], &dur);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        std::vector<Vec2> arr;
        ok = seval_to_std_vector_Vec2(args[1], &arr);
        SE_PRECONDITION2(ok, false, "Error processing arguments");

        PointArray* points = PointArray::create(arr.size());

        for(const auto& pt : arr)
        {
            points->addControlPoint(pt);
        }

        ok = nativeObj->initWithDuration(dur, points);
        SE_PRECONDITION2(ok, false, "initWithDuration failed!");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

static bool js_cocos2dx_CatmullRomBy_create(se::State& s)
{
    cocos2d::CatmullRomBy* nativeObj = new (std::nothrow) cocos2d::CatmullRomBy();
    bool ok = js_CatmullRomActions_init(s, nativeObj);
    if (ok)
    {
        se::Object* jsobj = se::Object::createObjectWithClass(__jsb_cocos2d_CatmullRomBy_class);
        jsobj->setPrivateData(nativeObj);
        s.rval().setObject(jsobj);
    }
    return ok;
}
SE_BIND_FUNC(js_cocos2dx_CatmullRomBy_create)

static bool js_cocos2dx_CatmullRomBy_initWithDuration(se::State& s)
{
    bool ok = js_CatmullRomActions_init(s, (cocos2d::CatmullRomBy*)s.nativeThisObject());
    s.rval().setBoolean(ok);
    return ok;
}
SE_BIND_FUNC(js_cocos2dx_CatmullRomBy_initWithDuration)

static bool js_cocos2dx_CatmullRomTo_create(se::State& s)
{
    cocos2d::CatmullRomTo* nativeObj = new (std::nothrow) cocos2d::CatmullRomTo();
    bool ok = js_CatmullRomActions_init(s, nativeObj);
    if (ok)
    {
        se::Object* jsobj = se::Object::createObjectWithClass(__jsb_cocos2d_CatmullRomTo_class);
        jsobj->setPrivateData(nativeObj);
        s.rval().setObject(jsobj);
    }
    return ok;
}
SE_BIND_FUNC(js_cocos2dx_CatmullRomTo_create)

static bool js_cocos2dx_CatmullRomTo_initWithDuration(se::State& s)
{
    bool ok = js_CatmullRomActions_init(s, (cocos2d::CatmullRomTo*)s.nativeThisObject());
    s.rval().setBoolean(ok);
    return ok;
}
SE_BIND_FUNC(js_cocos2dx_CatmullRomTo_initWithDuration)

//

static bool register_actions(se::Object* obj)
{
    #define JSB_BIND_ACTION(clsName, proto, initFuncName) \
        __ccObj->getProperty(#clsName, &v); \
        v.toObject()->defineFunction("create", _SE(js_cocos2dx_##clsName##_create)); \
        proto->defineFunction(#initFuncName, _SE(js_cocos2dx_##clsName##_##initFuncName));

    se::Value v;

    se::Object* proto = __jsb_cocos2d_ActionInterval_proto;
    proto->defineFunction("repeat", _SE(js_cocos2dx_ActionInterval_repeat));
    proto->defineFunction("repeatForever", _SE(js_cocos2dx_ActionInterval_repeatForever));
    proto->defineFunction("_speed", _SE(js_cocos2dx_ActionInterval_speed));
    proto->defineFunction("easing", _SE(js_cocos2dx_ActionInterval_easing));

    JSB_BIND_ACTION(CallFunc, __jsb_cocos2d_CallFuncN_proto, initWithFunction)
    JSB_BIND_ACTION(BezierBy, __jsb_cocos2d_BezierBy_proto, initWithDuration)
    JSB_BIND_ACTION(BezierTo, __jsb_cocos2d_BezierTo_proto, initWithDuration)
    JSB_BIND_ACTION(CardinalSplineBy, __jsb_cocos2d_CardinalSplineBy_proto, initWithDuration)
    JSB_BIND_ACTION(CardinalSplineTo, __jsb_cocos2d_CardinalSplineTo_proto, initWithDuration)
    JSB_BIND_ACTION(CatmullRomBy, __jsb_cocos2d_CatmullRomBy_proto, initWithDuration)
    JSB_BIND_ACTION(CatmullRomTo, __jsb_cocos2d_CatmullRomTo_proto, initWithDuration)

    se::ScriptEngine::getInstance()->clearException();

    return true;
}

bool js_cocos2dx_Texture2D_setTexParameters(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 4)
    {
        GLuint arg0, arg1, arg2, arg3;
        bool ok = seval_to_uint32(args[0], &arg0)
        && seval_to_uint32(args[1], &arg1)
        && seval_to_uint32(args[2], &arg2)
        && seval_to_uint32(args[3], &arg3);

        SE_PRECONDITION2(ok, false, "Converting arguments failed!");
        Texture2D* cobj = (Texture2D*)s.nativeThisObject();

        Texture2D::TexParams param = { arg0, arg1, arg2, arg3 };
        cobj->setTexParameters(param);
        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 4);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_Texture2D_setTexParameters)

static bool register_empty_retain_release(se::Object* obj)
{
    // empty 'retain' 'release' implementation

    se::Object* protosNeedEmptyRetainRelease[] = {
        __jsb_cocos2d_Action_proto,
        __jsb_cocos2d_SpriteFrame_proto,
        __jsb_cocos2d_Node_proto,
        __jsb_cocos2d_EventListener_proto,
        __jsb_cocos2d_GLProgram_proto,
        __jsb_cocos2d_Scheduler_proto,
        __jsb_cocos2d_ActionManager_proto,
        __jsb_cocos2d_Texture2D_proto,
        __jsb_cocos2d_Touch_proto,
    };

    for (const auto& e : protosNeedEmptyRetainRelease)
    {
        e->defineFunction("retain", _SE(jsb_cocos2dx_empty_func));
        e->defineFunction("release", _SE(jsb_cocos2dx_empty_func));
    }

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

static bool register_texture2d_manual(se::Object* obj)
{
    __jsb_cocos2d_Texture2D_proto->defineFunction("setTexParameters", _SE(js_cocos2dx_Texture2D_setTexParameters));

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

class JSB_EditBoxDelegate
: public Ref
, public ui::EditBoxDelegate
{
public:
    JSB_EditBoxDelegate()
    {
    }
    virtual ~JSB_EditBoxDelegate()
    {
        CCLOGINFO("JSB_EditBoxDelegate (%p) was destroyed!", this);
    }

    virtual void editBoxEditingDidBegin(ui::EditBox* editBox) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;
        if (!_JSDelegate.isObject())
            return;

        se::Value editBoxVal;
        bool ok = native_ptr_to_seval<ui::EditBox>(editBox, __jsb_cocos2d_ui_EditBox_class, &editBoxVal);
        if (!ok)
        {
            SE_REPORT_ERROR("Could not find js object for EditBox (%p)", editBox);
            return;
        }
        se::ValueArray args;
        args.reserve(1);
        args.push_back(editBoxVal);

        se::Value func;
        _JSDelegate.toObject()->getProperty("editBoxEditingDidBegin", &func);
        assert(func.isObject() && func.toObject()->isFunction());
        func.toObject()->call(args, _JSDelegate.toObject());
    }

    virtual void editBoxEditingDidEnd(ui::EditBox* editBox) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;
        if (!_JSDelegate.isObject())
            return;

        se::Value editBoxVal;
        bool ok = native_ptr_to_seval<ui::EditBox>(editBox, __jsb_cocos2d_ui_EditBox_class, &editBoxVal);
        if (!ok)
        {
            SE_REPORT_ERROR("Could not find js object for EditBox (%p)", editBox);
            return;
        }
        se::ValueArray args;
        args.reserve(1);
        args.push_back(editBoxVal);

        se::Value func;
        _JSDelegate.toObject()->getProperty("editBoxEditingDidEnd", &func);
        assert(func.isObject() && func.toObject()->isFunction());
        func.toObject()->call(args, _JSDelegate.toObject());
    }

    virtual void editBoxTextChanged(ui::EditBox* editBox, const std::string& text) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;
        if (!_JSDelegate.isObject())
            return;

        se::Value editBoxVal;
        bool ok = native_ptr_to_seval<ui::EditBox>(editBox, __jsb_cocos2d_ui_EditBox_class, &editBoxVal);
        if (!ok)
        {
            SE_REPORT_ERROR("Could not find js object for EditBox (%p)", editBox);
            return;
        }
        se::ValueArray args;
        args.reserve(2);
        args.push_back(editBoxVal);

        se::Value seText;
        std_string_to_seval(text, &seText);
        args.push_back(seText);

        se::Value func;
        _JSDelegate.toObject()->getProperty("editBoxTextChanged", &func);
        assert(func.isObject() && func.toObject()->isFunction());
        func.toObject()->call(args, _JSDelegate.toObject());
    }

    virtual void editBoxEditingReturn(ui::EditBox* editBox) override
    {
        se::ScriptEngine::getInstance()->clearException();
        se::AutoHandleScope hs;
        if (!_JSDelegate.isObject())
            return;

        se::Value editBoxVal;
        bool ok = native_ptr_to_seval<ui::EditBox>(editBox, __jsb_cocos2d_ui_EditBox_class, &editBoxVal);
        if (!ok)
        {
            SE_REPORT_ERROR("Could not find js object for EditBox (%p)", editBox);
            return;
        }
        se::ValueArray args;
        args.reserve(1);
        args.push_back(editBoxVal);

        se::Value func;
        _JSDelegate.toObject()->getProperty("editBoxEditingReturn", &func);
        assert(func.isObject() && func.toObject()->isFunction());
        func.toObject()->call(args, _JSDelegate.toObject());
    }

    void setJSDelegate(const se::Value& jsDelegate)
    {
        _JSDelegate = jsDelegate;
    }
private:
    se::Value _JSDelegate;
};

static bool js_cocos2dx_CCEditBox_setDelegate(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        cocos2d::ui::EditBox* cobj = (cocos2d::ui::EditBox*)s.nativeThisObject();
        // save the delegate
        JSB_EditBoxDelegate* nativeDelegate = new (std::nothrow) JSB_EditBoxDelegate();
        nativeDelegate->setJSDelegate(args[0]);
        s.thisObject()->setProperty("_delegate", args[0]);
        cobj->setUserObject(nativeDelegate);
        cobj->setDelegate(nativeDelegate);
        nativeDelegate->release();

        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_cocos2dx_CCEditBox_setDelegate)

bool register_ui_manual(se::Object* obj)
{
    __jsb_cocos2d_ui_EditBox_proto->defineFunction("setDelegate", _SE(js_cocos2dx_CCEditBox_setDelegate));

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

static bool register_tilemap_manual(se::Object* obj)
{
    __jsb_cocos2d_TMXLayer_proto->defineFunction("getTiles", _SE(js_cocos2dx_TMXLayer_getTiles));

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_cocos2dx_manual(se::Object* obj)
{
    register_plist_parser(obj);
    register_sys_localStorage(obj);
    register_eventlistener(obj);
    register_actions(obj);
    register_empty_retain_release(obj);
    register_texture2d_manual(obj);
    register_tilemap_manual(obj);
    return true;
}

