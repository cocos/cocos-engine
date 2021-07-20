/****************************************************************************
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "jsb_cocos_manual.h"

#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/bindings/manual/jsb_global_init.h"
#include "cocos/bindings/auto/jsb_cocos_auto.h"

#include "storage/local-storage/LocalStorage.h"

using namespace cc;

extern se::Object *__jsb_cc_FileUtils_proto;

static bool jsb_ccx_empty_func(se::State &s) {
    return true;
}
SE_BIND_FUNC(jsb_ccx_empty_func)

class __JSPlistDelegator : public cc::SAXDelegator {
public:
    static __JSPlistDelegator *getInstance() {
        static __JSPlistDelegator *pInstance = NULL;
        if (pInstance == NULL) {
            pInstance = new (std::nothrow) __JSPlistDelegator();
        }
        return pInstance;
    };

    virtual ~__JSPlistDelegator();

    cc::SAXParser *getParser();

    std::string parse(const std::string &path);
    std::string parseText(const std::string &text);

    // implement pure virtual methods of SAXDelegator
    void startElement(void *ctx, const char *name, const char **atts) override;
    void endElement(void *ctx, const char *name) override;
    void textHandler(void *ctx, const char *ch, int len) override;

private:
    cc::SAXParser _parser;
    std::string _result;
    bool _isStoringCharacters;
    std::string _currentValue;
};

// cc.PlistParser.getInstance()
static bool js_PlistParser_getInstance(se::State &s) {
    __JSPlistDelegator *delegator = __JSPlistDelegator::getInstance();
    SAXParser *parser = delegator->getParser();

    if (parser) {
        native_ptr_to_rooted_seval<SAXParser>(parser, __jsb_cc_SAXParser_class, &s.rval());
        return true;
    }
    return false;
}
SE_BIND_FUNC(js_PlistParser_getInstance)

// cc.PlistParser.getInstance().parse(text)
static bool js_PlistParser_parse(se::State &s) {
    const auto &args = s.args();
    size_t argc = args.size();
    __JSPlistDelegator *delegator = __JSPlistDelegator::getInstance();

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

cc::SAXParser *__JSPlistDelegator::getParser() {
    return &_parser;
}

std::string __JSPlistDelegator::parse(const std::string &path) {
    _result.clear();

    SAXParser parser;
    if (false != parser.init("UTF-8")) {
        parser.setDelegator(this);
        parser.parse(FileUtils::getInstance()->fullPathForFilename(path));
    }

    return _result;
}

__JSPlistDelegator::~__JSPlistDelegator() {
    CC_LOG_INFO("deallocing __JSSAXDelegator: %p", this);
}

std::string __JSPlistDelegator::parseText(const std::string &text) {
    _result.clear();

    SAXParser parser;
    if (false != parser.init("UTF-8")) {
        parser.setDelegator(this);
        parser.parse(text.c_str(), text.size());
    }

    return _result;
}

void __JSPlistDelegator::startElement(void *ctx, const char *name, const char **atts) {
    _isStoringCharacters = true;
    _currentValue.clear();

    std::string elementName = (char *)name;

    int end = (int)_result.size() - 1;
    if (end >= 0 && _result[end] != '{' && _result[end] != '[' && _result[end] != ':') {
        _result += ",";
    }

    if (elementName == "dict") {
        _result += "{";
    } else if (elementName == "array") {
        _result += "[";
    }
}

void __JSPlistDelegator::endElement(void *ctx, const char *name) {
    _isStoringCharacters = false;
    std::string elementName = (char *)name;

    if (elementName == "dict") {
        _result += "}";
    } else if (elementName == "array") {
        _result += "]";
    } else if (elementName == "key") {
        _result += "\"" + _currentValue + "\":";
    } else if (elementName == "string") {
        _result += "\"" + _currentValue + "\"";
    } else if (elementName == "false" || elementName == "true") {
        _result += elementName;
    } else if (elementName == "real" || elementName == "integer") {
        _result += _currentValue;
    }
}

void __JSPlistDelegator::textHandler(void *, const char *ch, int len) {
    std::string text((char *)ch, 0, len);

    if (_isStoringCharacters) {
        _currentValue += text;
    }
}

static bool register_plist_parser(se::Object *obj) {
    se::Value v;
    __jsbObj->getProperty("PlistParser", &v);
    assert(v.isObject());
    v.toObject()->defineFunction("getInstance", _SE(js_PlistParser_getInstance));

    __jsb_cc_SAXParser_proto->defineFunction("parse", _SE(js_PlistParser_parse));

    se::ScriptEngine::getInstance()->clearException();

    return true;
}

// cc.sys.localStorage

static bool JSB_localStorageGetItem(se::State &s) {
    const auto &args = s.args();
    size_t argc = args.size();
    if (argc == 1) {
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

static bool JSB_localStorageRemoveItem(se::State &s) {
    const auto &args = s.args();
    size_t argc = args.size();
    if (argc == 1) {
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

static bool JSB_localStorageSetItem(se::State &s) {
    const auto &args = s.args();
    size_t argc = args.size();
    if (argc == 2) {
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

static bool JSB_localStorageClear(se::State &s) {
    const auto &args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        localStorageClear();
        return true;
    }

    SE_REPORT_ERROR("Invalid number of arguments");
    return false;
}
SE_BIND_FUNC(JSB_localStorageClear)

static bool JSB_localStorageKey(se::State &s) {
    const auto &args = s.args();
    size_t argc = args.size();
    if (argc == 1) {
        bool ok = true;
        int nIndex = 0;
        ok = seval_to_int32(args[0], &nIndex);
        SE_PRECONDITION2(ok, false, "Error processing arguments");
        std::string value;
        localStorageGetKey(nIndex, &value);
        s.rval().setString(value);
        return true;
    }

    SE_REPORT_ERROR("Invalid number of arguments");
    return false;
}
SE_BIND_FUNC(JSB_localStorageKey)

static bool JSB_localStorage_getLength(se::State &s) {
    const auto &args = s.args();
    size_t argc = args.size();
    if (argc == 0) {
        int nLength = 0;

        localStorageGetLength(nLength);
        s.rval().setInt32(nLength);
        return true;
    }

    SE_REPORT_ERROR("Invalid number of arguments");
    return false;
}
SE_BIND_PROP_GET(JSB_localStorage_getLength);

static bool register_sys_localStorage(se::Object *obj) {
    se::Value sys;
    if (!obj->getProperty("sys", &sys)) {
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
    localStorageObj->defineFunction("key", _SE(JSB_localStorageKey));
    localStorageObj->defineProperty("length", _SE(JSB_localStorage_getLength), nullptr);

    std::string strFilePath = cc::FileUtils::getInstance()->getWritablePath();
    strFilePath += "/jsb.sqlite";
    localStorageInit(strFilePath);

    se::ScriptEngine::getInstance()->addBeforeCleanupHook([]() {
        localStorageFree();
    });

    se::ScriptEngine::getInstance()->clearException();

    return true;
}

#define BIND_PROP_WITH_TYPE__CONV_FUNC__RETURN(cls, property, type, convertFunc, returnFunc)   \
    static bool js_##cls_set_##property(se::State &s) {                                        \
        cc::cls *cobj = (cc::cls *)s.nativeThisObject();                                       \
        SE_PRECONDITION2(cobj, false, "js_#cls_set_#property : Invalid Native Object");        \
        const auto &args = s.args();                                                           \
        size_t argc = args.size();                                                             \
        bool ok = true;                                                                        \
        if (argc == 1) {                                                                       \
            type arg0;                                                                         \
            ok &= convertFunc(args[0], &arg0);                                                 \
            SE_PRECONDITION2(ok, false, "js_#cls_set_#property : Error processing arguments"); \
            cobj->set_##property(arg0);                                                        \
            return true;                                                                       \
        }                                                                                      \
        SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);      \
        return false;                                                                          \
    }                                                                                          \
    SE_BIND_PROP_SET(js_##cls_set_##property)                                                  \
                                                                                               \
    static bool js_##cls_get_##property(se::State &s) {                                        \
        cc::cls *cobj = (cc::cls *)s.nativeThisObject();                                       \
        SE_PRECONDITION2(cobj, false, "js_#cls_get_#property : Invalid Native Object");        \
        s.rval().returnFunc(cobj->_##property);                                                \
        return true;                                                                           \
    }                                                                                          \
    SE_BIND_PROP_GET(js_##cls_get_##property)

BIND_PROP_WITH_TYPE__CONV_FUNC__RETURN(CanvasRenderingContext2D, width, float, seval_to_float, setFloat)
BIND_PROP_WITH_TYPE__CONV_FUNC__RETURN(CanvasRenderingContext2D, height, float, seval_to_float, setFloat)

#define _SE_DEFINE_PROP(cls, property) \
    __jsb_cc_##cls##_proto->defineProperty(#property, _SE(js_##cls_get_##property), _SE(js_##cls_set_##property));

//IDEA:  move to auto bindings.
static bool js_CanvasRenderingContext2D_setCanvasBufferUpdatedCallback(se::State &s) {
    cc::CanvasRenderingContext2D *cobj = (cc::CanvasRenderingContext2D *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_CanvasRenderingContext2D_setCanvasBufferUpdatedCallback : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 1) {
        std::function<void(const cc::Data &)> arg0;
        do {
            if (args[0].isObject() && args[0].toObject()->isFunction()) {
                se::Value jsThis(s.thisObject());
                se::Value jsFunc(args[0]);
                jsThis.toObject()->attachObject(jsFunc.toObject());
                auto lambda = [=](const cc::Data &larg0) -> void {
                    se::ScriptEngine::getInstance()->clearException();
                    se::AutoHandleScope hs;

                    CC_UNUSED bool ok = true;
                    se::ValueArray args;
                    args.resize(1);
                    ok &= Data_to_seval(larg0, &args[0]);
                    se::Value rval;
                    se::Object *thisObj = jsThis.isObject() ? jsThis.toObject() : nullptr;
                    se::Object *funcObj = jsFunc.toObject();
                    bool succeed = funcObj->call(args, thisObj, &rval);
                    if (!succeed) {
                        se::ScriptEngine::getInstance()->clearException();
                    }
                };
                // Add an unroot to avoid the root of the copy constructor caused by the internal reference of Lambda.
                if (jsThis.isObject()) {
                    jsThis.toObject()->unroot();
                }
                jsFunc.toObject()->unroot();
                arg0 = lambda;
            } else {
                arg0 = nullptr;
            }
        } while (false);
        SE_PRECONDITION2(ok, false, "js_CanvasRenderingContext2D_setCanvasBufferUpdatedCallback : Error processing arguments");
        cobj->setCanvasBufferUpdatedCallback(arg0);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_CanvasRenderingContext2D_setCanvasBufferUpdatedCallback)

static void setCanvasRenderingContext2DProps(cc::CanvasRenderingContext2D *context, const se::Value &val) {
    se::Object *props = val.toObject();
    se::Value propVal;

    props->getProperty("lineWidth", &propVal);
    if (!propVal.isUndefined()) context->set_lineWidth(propVal.toFloat());

    props->getProperty("lineJoin", &propVal);
    if (!propVal.isUndefined()) context->set_lineJoin(propVal.toString());

    props->getProperty("fillStyle", &propVal);
    if (!propVal.isUndefined()) context->set_fillStyle(propVal.toString());

    props->getProperty("font", &propVal);
    if (!propVal.isUndefined()) context->set_font(propVal.toString());

    props->getProperty("lineCap", &propVal);
    if (!propVal.isUndefined()) context->set_lineCap(propVal.toString());

    props->getProperty("textAlign", &propVal);
    if (!propVal.isUndefined()) context->set_textAlign(propVal.toString());

    props->getProperty("textBaseline", &propVal);
    if (!propVal.isUndefined()) context->set_textBaseline(propVal.toString());

    props->getProperty("strokeStyle", &propVal);
    if (!propVal.isUndefined()) context->set_strokeStyle(propVal.toString());

    props->getProperty("globalCompositeOperation", &propVal);
    if (!propVal.isUndefined()) context->set_globalCompositeOperation(propVal.toString());
}

static bool js_engine_CanvasRenderingContext2D_measureText(se::State &s) {
    cc::CanvasRenderingContext2D *cobj = (cc::CanvasRenderingContext2D *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_engine_CanvasRenderingContext2D_measureText : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_engine_CanvasRenderingContext2D_measureText : Error processing arguments");
        SE_PRECONDITION2(args[1].isObject(), false, "js_engine_CanvasRenderingContext2D_fillText : no attributes set.");
        setCanvasRenderingContext2DProps(cobj, args[1]);
        cc::Size result = cobj->measureText(arg0);
        ok &= Size_to_seval(result, &s.rval());
        SE_PRECONDITION2(ok, false, "js_engine_CanvasRenderingContext2D_measureText : Error processing arguments");
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 1);
    return false;
}
SE_BIND_FUNC(js_engine_CanvasRenderingContext2D_measureText)

static bool js_engine_CanvasRenderingContext2D_fillRect(se::State &s) {
    cc::CanvasRenderingContext2D *cobj = (cc::CanvasRenderingContext2D *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_engine_CanvasRenderingContext2D_fillRect : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        float arg0 = 0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_float(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        ok &= seval_to_float(args[3], &arg3);
        SE_PRECONDITION2(args[4].isObject(), false, "js_engine_CanvasRenderingContext2D_fillText : no attributes set.");
        setCanvasRenderingContext2DProps(cobj, args[4]);
        SE_PRECONDITION2(ok, false, "js_engine_CanvasRenderingContext2D_fillRect : Error processing arguments");
        cobj->fillRect(arg0, arg1, arg2, arg3);
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_engine_CanvasRenderingContext2D_fillRect)

static bool js_engine_CanvasRenderingContext2D_fillText(se::State &s) {
    cc::CanvasRenderingContext2D *cobj = (cc::CanvasRenderingContext2D *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_engine_CanvasRenderingContext2D_fillText : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        std::string arg0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        SE_PRECONDITION2(args[4].isObject(), false, "js_engine_CanvasRenderingContext2D_fillText : no attributes set.");
        setCanvasRenderingContext2DProps(cobj, args[4]);
        if (args[3].isUndefined()) {
            SE_PRECONDITION2(ok, false, "js_engine_CanvasRenderingContext2D_fillText : Error processing arguments");
            cobj->fillText(arg0, arg1, arg2);
        } else {
            ok &= seval_to_float(args[3], &arg3);
            SE_PRECONDITION2(ok, false, "js_engine_CanvasRenderingContext2D_fillText : Error processing arguments");
            cobj->fillText(arg0, arg1, arg2, arg3);
        }
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_engine_CanvasRenderingContext2D_fillText)

static bool js_engine_CanvasRenderingContext2D_strokeText(se::State &s) {
    cc::CanvasRenderingContext2D *cobj = (cc::CanvasRenderingContext2D *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_engine_CanvasRenderingContext2D_strokeText : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 5) {
        std::string arg0;
        float arg1 = 0;
        float arg2 = 0;
        float arg3 = 0;
        ok &= seval_to_std_string(args[0], &arg0);
        ok &= seval_to_float(args[1], &arg1);
        ok &= seval_to_float(args[2], &arg2);
        SE_PRECONDITION2(args[4].isObject(), false, "js_engine_CanvasRenderingContext2D_strokeText : no attributes set.");
        setCanvasRenderingContext2DProps(cobj, args[4]);
        if (!args[3].isUndefined()) {
            ok &= seval_to_float(args[3], &arg3);
            SE_PRECONDITION2(ok, false, "js_engine_CanvasRenderingContext2D_strokeText : Error processing arguments");
            cobj->strokeText(arg0, arg1, arg2, arg3);
        } else {
            SE_PRECONDITION2(ok, false, "js_engine_CanvasRenderingContext2D_strokeText : Error processing arguments");
            cobj->strokeText(arg0, arg1, arg2);
        }

        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 4);
    return false;
}
SE_BIND_FUNC(js_engine_CanvasRenderingContext2D_strokeText)

static se::Object *__deviceMotionObject = nullptr;
static bool JSB_getDeviceMotionValue(se::State &s) {
    if (__deviceMotionObject == nullptr) {
        __deviceMotionObject = se::Object::createArrayObject(9);
        __deviceMotionObject->root();
    }

    const auto &v = Device::getDeviceMotionValue();

    __deviceMotionObject->setArrayElement(0, se::Value(v.accelerationX));
    __deviceMotionObject->setArrayElement(1, se::Value(v.accelerationY));
    __deviceMotionObject->setArrayElement(2, se::Value(v.accelerationZ));
    __deviceMotionObject->setArrayElement(3, se::Value(v.accelerationIncludingGravityX));
    __deviceMotionObject->setArrayElement(4, se::Value(v.accelerationIncludingGravityY));
    __deviceMotionObject->setArrayElement(5, se::Value(v.accelerationIncludingGravityZ));
    __deviceMotionObject->setArrayElement(6, se::Value(v.rotationRateAlpha));
    __deviceMotionObject->setArrayElement(7, se::Value(v.rotationRateBeta));
    __deviceMotionObject->setArrayElement(8, se::Value(v.rotationRateGamma));

    s.rval().setObject(__deviceMotionObject);
    return true;
}
SE_BIND_FUNC(JSB_getDeviceMotionValue)

static bool register_device(se::Object *obj) {
    se::Value device;
    __jsbObj->getProperty("Device", &device);

    device.toObject()->defineFunction("getDeviceMotionValue", _SE(JSB_getDeviceMotionValue));

    se::ScriptEngine::getInstance()->addBeforeCleanupHook([]() {
        if (__deviceMotionObject != nullptr) {
            __deviceMotionObject->unroot();
            __deviceMotionObject->decRef();
            __deviceMotionObject = nullptr;
        }
    });

    se::ScriptEngine::getInstance()->clearException();
    return true;
}

static bool register_canvas_context2d(se::Object *obj) {
    _SE_DEFINE_PROP(CanvasRenderingContext2D, width)
    _SE_DEFINE_PROP(CanvasRenderingContext2D, height)

    __jsb_cc_CanvasRenderingContext2D_proto->defineFunction("_setCanvasBufferUpdatedCallback", _SE(js_CanvasRenderingContext2D_setCanvasBufferUpdatedCallback));
    __jsb_cc_CanvasRenderingContext2D_proto->defineFunction("fillText", _SE(js_engine_CanvasRenderingContext2D_fillText));
    __jsb_cc_CanvasRenderingContext2D_proto->defineFunction("strokeText", _SE(js_engine_CanvasRenderingContext2D_strokeText));
    __jsb_cc_CanvasRenderingContext2D_proto->defineFunction("fillRect", _SE(js_engine_CanvasRenderingContext2D_fillRect));
    __jsb_cc_CanvasRenderingContext2D_proto->defineFunction("measureText", _SE(js_engine_CanvasRenderingContext2D_measureText));

    se::ScriptEngine::getInstance()->clearException();

    return true;
}

static bool js_engine_FileUtils_listFilesRecursively(se::State &s) {
    auto *cobj = (cc::FileUtils *)s.nativeThisObject();
    SE_PRECONDITION2(cobj, false, "js_engine_FileUtils_listFilesRecursively : Invalid Native Object");
    const auto &args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::vector<std::string> arg1;
        ok &= seval_to_std_string(args[0], &arg0);
        SE_PRECONDITION2(ok, false, "js_engine_FileUtils_listFilesRecursively : Error processing arguments");
        cobj->listFilesRecursively(arg0, &arg1);
        se::Object *list = args[1].toObject();
        SE_PRECONDITION2(args[1].isObject() && list->isArray(), false, "js_engine_FileUtils_listFilesRecursively : 2nd argument should be an Array");
        for (uint i = 0; i < static_cast<uint>(arg1.size()); i++) {
            list->setArrayElement(i, se::Value(arg1[i]));
        }
        list->setProperty("length", se::Value(static_cast<std::uint32_t>(arg1.size())));
        return true;
    }
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc, 2);
    return false;
}
SE_BIND_FUNC(js_engine_FileUtils_listFilesRecursively)

static bool js_se_setExceptionCallback(se::State &s) {
    auto &args = s.args();
    if (args.size() != 1 || !args[0].isObject() || !args[0].toObject()->isFunction()) {
        SE_REPORT_ERROR("expect 1 arguments of Function type, %d provided", (int)args.size());
        return false;
    }

    se::Object *objFunc = args[0].toObject();
    // se::Value::reset will invoke decRef() while destroying s.args()
    // increase ref here
    objFunc->incRef();
    if (s.thisObject()) {
        s.thisObject()->attachObject(objFunc); // prevent GC
    } else {
        //prevent GC in C++ & JS
        objFunc->root();
    }

    se::ScriptEngine::getInstance()->setJSExceptionCallback([objFunc](const char *location, const char *message, const char *stack) {
        se::ValueArray jsArgs;
        jsArgs.resize(3);
        jsArgs[0] = se::Value(location);
        jsArgs[1] = se::Value(message);
        jsArgs[2] = se::Value(stack);
        objFunc->call(jsArgs, nullptr);
    });
    return true;
}
SE_BIND_FUNC(js_se_setExceptionCallback)

static bool register_filetuils_ext(se::Object *obj) {
    __jsb_cc_FileUtils_proto->defineFunction("listFilesRecursively", _SE(js_engine_FileUtils_listFilesRecursively));
    return true;
}

static bool register_se_setExceptionCallback(se::Object *obj) {
    se::Value jsb;
    if (!obj->getProperty("jsb", &jsb)) {
        jsb.setObject(se::Object::createPlainObject());
        obj->setProperty("jsb", jsb);
    }
    auto *jsbObj = jsb.toObject();
    jsbObj->defineFunction("onError", _SE(js_se_setExceptionCallback));

    return true;
}

bool register_all_cocos_manual(se::Object *obj) {
    register_plist_parser(obj);
    register_sys_localStorage(obj);
    register_device(obj);
    register_canvas_context2d(obj);
    register_filetuils_ext(obj);
    register_se_setExceptionCallback(obj);
    return true;
}
