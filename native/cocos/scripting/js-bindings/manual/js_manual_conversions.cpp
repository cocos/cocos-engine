/*
 * Created by Rohan Kuruvilla
 * Copyright (c) 2012 Zynga Inc.
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

#include "scripting/js-bindings/manual/js_manual_conversions.h"

#include "base/ccUTF8.h"
#include "editor-support/cocostudio/CocosStudioExtension.h"
#include "extensions/assets-manager/Manifest.h"
#include "math/TransformUtils.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "scripting/js-bindings/manual/js_bindings_config.h"

USING_NS_CC;

namespace
{
    class StringRef : public cocos2d::Ref
    {
    public:
        CREATE_FUNC(StringRef);

        virtual bool init() { return true; }

        std::string data;
    };
};

// JSStringWrapper
JSStringWrapper::JSStringWrapper()
: _buffer(nullptr)
{
}

JSStringWrapper::JSStringWrapper(JS::HandleString str, JSContext* cx/* = NULL*/)
: _buffer(nullptr)
{
    set(str, cx);
}

JSStringWrapper::JSStringWrapper(JS::HandleValue val, JSContext* cx/* = NULL*/)
: _buffer(nullptr)
{
    set(val, cx);
}

JSStringWrapper::~JSStringWrapper()
{
    JS_free(ScriptingCore::getInstance()->getGlobalContext(), (void*)_buffer);
}

void JSStringWrapper::set(JS::HandleValue val, JSContext* cx)
{
    if (val.isString())
    {
        JS::RootedString str(cx, val.toString());
        this->set(str, cx);
    }
    else
    {
        JS_free(cx, (void*)_buffer);
        _buffer = nullptr;
    }
}

void JSStringWrapper::set(JS::HandleString str, JSContext* cx)
{
    JS_free(cx, (void*)_buffer);

    if (!cx)
    {
        cx = ScriptingCore::getInstance()->getGlobalContext();
    }
    _buffer = JS_EncodeStringToUTF8(cx, str);
}

const char* JSStringWrapper::get()
{
    return _buffer ? _buffer : "";
}

bool jsval_to_opaque( JSContext *cx, JS::HandleValue vp, void **r)
{
#ifdef __LP64__

    // begin
    JS::RootedObject tmp_arg(cx);
    bool ok = JS_ValueToObject( cx, vp, &tmp_arg );
    JSB_PRECONDITION2( ok, cx, false, "Error converting value to object");
    JSB_PRECONDITION2( tmp_arg && JS_IsTypedArrayObject( tmp_arg ), cx, false, "Not a TypedArray object");
    JSB_PRECONDITION2( JS_GetTypedArrayByteLength( tmp_arg ) == sizeof(void*), cx, false, "Invalid Typed Array length");

    bool flag;
    uint32_t* arg_array = (uint32_t*)JS_GetArrayBufferViewData(tmp_arg, &flag, JS::AutoCheckCannotGC());
    uint64_t ret =  arg_array[0];
    ret = ret << 32;
    ret |= arg_array[1];

#else
    assert( sizeof(int)==4);
    int32_t ret;
    if( ! jsval_to_int32(cx, vp, &ret ) )
      return false;
#endif
    *r = (void*)ret;
    return true;
}

bool jsval_to_int( JSContext *cx, JS::HandleValue vp, int *ret )
{
    // Since this is called to cast uint64 to uint32,
    // it is needed to initialize the value to 0 first
#ifdef __LP64__
    // When int size is 8 Bit (same as long), the following operation is needed
    if (sizeof(int) == 8)
    {
        long *tmp = (long*)ret;
        *tmp = 0;
    }
#endif
    return jsval_to_int32(cx, vp, (int32_t*)ret);
}

JS::HandleValue opaque_to_jsval( JSContext *cx, void *opaque )
{
    JS::RootedValue ret(cx);
#ifdef __LP64__
    uint64_t number = (uint64_t)opaque;
    JS::RootedObject typedArray(cx, JS_NewUint32Array(cx, 2));
    bool flag;
    uint32_t *buffer = (uint32_t*)JS_GetArrayBufferViewData(typedArray, &flag, JS::AutoCheckCannotGC());
    buffer[0] = number >> 32;
    buffer[1] = number & 0xffffffff;
    ret = JS::ObjectOrNullValue(typedArray);
#else
    assert(sizeof(int)==4);
    int32_t number = (int32_t) opaque;
    ret = JS::Int32Value(number);
#endif
    return ret;
}

bool jsval_to_uint( JSContext *cx, JS::HandleValue vp, unsigned int *ret )
{
    // Since this is called to cast uint64 to uint32,
    // it is needed to initialize the value to 0 first
#ifdef __LP64__
    // When unsigned int size is 8 Bit (same as long), the following operation is needed
    if (sizeof(unsigned int)==8)
    {
        long *tmp = (long*)ret;
        *tmp = 0;
    }
#endif
    return jsval_to_int32(cx, vp, (int32_t*)ret);
}

bool long_to_jsval( JSContext *cx, long number, JS::MutableHandleValue ret )
{
#ifdef __LP64__
    assert( sizeof(long)==8);

    char chr[128];
    snprintf(chr, sizeof(chr)-1, "%ld", number);
    JS::RootedString ret_obj(cx, JS_NewStringCopyZ(cx, chr));
    ret.set(JS::StringValue(ret_obj));
#else
    CCASSERT( sizeof(int)==4, "Error!");
    ret.set(JS::Int32Value(number));
#endif
    return true;
}

bool ulong_to_jsval( JSContext *cx, unsigned long number, JS::MutableHandleValue ret )
{
#ifdef __LP64__
    assert( sizeof(unsigned long)==8);

    char chr[128];
    snprintf(chr, sizeof(chr)-1, "%lu", number);
    JS::RootedString ret_obj(cx, JS_NewStringCopyZ(cx, chr));
    ret.set(JS::StringValue(ret_obj));
#else
    CCASSERT( sizeof(int)==4, "Error!");
    ret.set(JS::Int32Value(number));
#endif
    return true;
}

bool long_long_to_jsval( JSContext *cx, long long number, JS::MutableHandleValue ret )
{
#if JSB_REPRESENT_LONGLONG_AS_STR
    char chr[128];
    snprintf(chr, sizeof(chr)-1, "%lld", number);
    JS::RootedString ret_obj(cx, JS_NewStringCopyZ(cx, chr));
    ret.set(JS::StringValue(ret_obj));
#else
    CCASSERT( sizeof(long long)==8, "Error!");
    JS::RootedObject typedArray(cx, JS_NewUint32Array(cx, 2));
    bool flag;
    uint32_t *buffer = (uint32_t*)JS_GetArrayBufferViewData(typedArray, &flag, JS::AutoCheckCannotGC());
    buffer[0] = number >> 32;
    buffer[1] = number & 0xffffffff;
    ret.set(JS::ObjectOrNullValue(typedArray));
#endif
    return true;
}

bool jsval_to_charptr( JSContext *cx, JS::HandleValue vp, const char **ret )
{
    JS::RootedString jsstr(cx, vp.toString());
    JSB_PRECONDITION2( jsstr, cx, false, "invalid string" );

    JSStringWrapper strWrapper(jsstr);

    auto tmp = StringRef::create();
    tmp->data = strWrapper.get();

    *ret = tmp->data.c_str();

    return true;
}

bool JSB_jsval_typedarray_to_dataptr( JSContext *cx, JS::HandleValue vp, GLsizei *count, void **data, js::Scalar::Type t)
{
    JS::RootedObject jsobj(cx);
    bool ok = JS_ValueToObject( cx, vp, &jsobj );
    JSB_PRECONDITION2( ok && jsobj, cx, false, "Error converting value to object");

    // WebGL supports TypedArray and sequences for some of its APIs. So when converting a TypedArray, we should
    // also check for a possible non-Typed Array JS object, like a JS Array.

    bool isArray = false;
    if( JS_IsTypedArrayObject( jsobj ) ) {

        *count = JS_GetTypedArrayLength(jsobj);
        js::Scalar::Type type = JS_GetArrayBufferViewType(jsobj);
        JSB_PRECONDITION2(t==type, cx, false, "TypedArray type different than expected type");

        bool flag;
        const JS::AutoCheckCannotGC cannotGC;
        switch (t) {
            case js::Scalar::Int8:
            case js::Scalar::Uint8:
                *data = JS_GetUint8ArrayData(jsobj, &flag, cannotGC);
                break;

            case js::Scalar::Int16:
            case js::Scalar::Uint16:
                *data = JS_GetUint16ArrayData(jsobj, &flag, cannotGC);
                break;

            case js::Scalar::Int32:
            case js::Scalar::Uint32:
                *data = JS_GetUint32ArrayData(jsobj, &flag, cannotGC);
                break;

            case js::Scalar::Float32:
                *data = JS_GetFloat32ArrayData(jsobj, &flag, cannotGC);
                break;

            default:
                JSB_PRECONDITION2(false, cx, false, "Unsupported typedarray type");
                break;
        }
    } else if(JS_IsArrayObject(cx, jsobj, &isArray) && isArray) {
        // Slow... avoid it. Use TypedArray instead, but the spec says that it can receive
        // Sequence<> as well.
        uint32_t length;
        JS_GetArrayLength(cx, jsobj, &length);

        for( uint32_t i=0; i<length;i++ ) {

            JS::RootedValue valarg(cx);
            JS_GetElement(cx, jsobj, i, &valarg);

            switch(t) {
                case js::Scalar::Int32:
                case js::Scalar::Uint32:
                {
                    uint32_t e = valarg.toInt32();
                    ((uint32_t*)data)[i] = e;
                    break;
                }
                case js::Scalar::Float32:
                {
                    double e = valarg.toNumber();
                    ((GLfloat*)data)[i] = (GLfloat)e;
                    break;
                }
                default:
                    JSB_PRECONDITION2(false, cx, false, "Unsupported typedarray type");
                    break;
            }
        }

    } else
        JSB_PRECONDITION2(false, cx, false, "Object shall be a TypedArray or Sequence");

    return true;
}

bool JSB_get_arraybufferview_dataptr( JSContext *cx, JS::HandleValue vp, GLsizei *count, GLvoid **data )
{
    JS::RootedObject jsobj(cx);
    bool ok = JS_ValueToObject( cx, vp, &jsobj );
    JSB_PRECONDITION2( ok && jsobj, cx, false, "Error converting value to object");
    JSB_PRECONDITION2( JS_IsArrayBufferViewObject(jsobj), cx, false, "Not an ArrayBufferView object");

    bool flag;
    *data = JS_GetArrayBufferViewData(jsobj, &flag, JS::AutoCheckCannotGC());
    *count = JS_GetArrayBufferViewByteLength(jsobj);

    return true;
}


#pragma mark - Conversion Routines

bool jsval_to_int32( JSContext *cx, JS::HandleValue vp, int32_t *outval )
{
    bool ok = vp.isNumber();
    if (ok) {
        *outval = (int32_t)vp.toNumber();
    }
    return ok;
}

bool jsval_to_uint32( JSContext *cx, JS::HandleValue vp, uint32_t *outval )
{
    bool ok = vp.isInt32();
    if (ok) {
        *outval = (uint32_t)(vp.toInt32());
    }
    return ok;
}

bool jsval_to_uint16( JSContext *cx, JS::HandleValue vp, uint16_t *outval )
{
    bool ok = vp.isInt32();
    if (ok) {
        *outval = (uint16_t)(vp.toInt32());
    }
    return ok;
}

bool jsval_to_bool( JSContext *cx, JS::HandleValue vp, bool *ret )
{
    bool ok = vp.isBoolean();
    if (ok) {
        *ret = vp.toBoolean();
    }
    return ok;
}

bool jsval_to_float( JSContext *cx, JS::HandleValue vp, float *ret )
{
    bool ok = vp.isNumber();
    if (ok) {
        *ret = (float)vp.toNumber();
    }
    return ok;
}

bool jsval_to_double( JSContext *cx, JS::HandleValue vp, double *ret )
{
    bool ok = vp.isNumber();
    if (ok) {
        *ret = vp.toNumber();
    }
    return ok;
}

bool jsval_to_long( JSContext *cx, JS::HandleValue vp, long *out )
{
    bool ok = vp.isNumber();
    if (ok) {
        *out = (long)vp.toNumber();
    }
    return ok;
}


bool jsval_to_ulong( JSContext *cx, JS::HandleValue vp, unsigned long *out)
{
    if (out == nullptr)
        return false;

    long rval = 0;
    bool ret = false;
    ret = jsval_to_long(cx, vp, &rval);
    if (ret)
    {
        *out = (unsigned long)rval;
    }
    return ret;
}

bool jsval_to_long_long(JSContext *cx, JS::HandleValue vp, long long* r)
{
    JS::RootedString jsstr(cx, vp.toString());
    JSB_PRECONDITION2(jsstr, cx, false, "Error converting value to string");

    char *str = JS_EncodeString(cx, jsstr);
    JSB_PRECONDITION2(str, cx, false, "Error encoding string");

    char *endptr;
#if(CC_TARGET_PLATFORM == CC_PLATFORM_WIN32 || CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
    __int64 ret = _strtoi64(str, &endptr, 10);
#else
    long long ret = strtoll(str, &endptr, 10);
#endif

    *r = ret;
    return true;
}

bool jsval_to_std_string(JSContext *cx, JS::HandleValue v, std::string* ret) {
    if (v.isString())
    {
        JS::RootedString tmp(cx, v.toString());
        JSB_PRECONDITION3(tmp, cx, false, "Error processing arguments");

        JSStringWrapper str(tmp);
        *ret = str.get();
    }
    else if (v.isBoolean())
    {
        *ret = v.toBoolean() ? "true" : "false";
    }
    else if (v.isInt32())
    {
        char buff[20];
        snprintf(buff, sizeof(buff), "%d", v.toInt32());
        *ret = buff;
    }
    else if (v.isNumber())
    {
        char buff[20];
        snprintf(buff, sizeof(buff), "%.2f", v.toNumber());
        *ret = buff;
    }
    else if (v.isNullOrUndefined())
    {
        *ret = "";
    }
    else
    {
        return false;
    }

    return true;
}

bool jsval_to_ccpoint(JSContext *cx, JS::HandleValue v, Point* ret) {
    JS::RootedObject tmp(cx);
    JS::RootedValue jsx(cx);
    JS::RootedValue jsy(cx);
    bool ok = v.isObject() &&
    JS_ValueToObject(cx, v, &tmp) &&
    JS_GetProperty(cx, tmp, "x", &jsx) &&
    JS_GetProperty(cx, tmp, "y", &jsy) &&
    jsx.isNumber() && jsy.isNumber();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");
    
    double x = jsx.toNumber();
    double y = jsy.toNumber();

    ret->x = (float)x;
    ret->y = (float)y;
    return true;
}

bool jsval_to_ccacceleration(JSContext* cx, JS::HandleValue v, Acceleration* ret) {
    JS::RootedObject tmp(cx);
    JS::RootedValue jsx(cx);
    JS::RootedValue jsy(cx);
    JS::RootedValue jsz(cx);
    JS::RootedValue jstimestamp(cx);

    bool ok = v.isObject() &&
    JS_ValueToObject(cx, v, &tmp) &&
    JS_GetProperty(cx, tmp, "x", &jsx) &&
    JS_GetProperty(cx, tmp, "y", &jsy) &&
    JS_GetProperty(cx, tmp, "z", &jsz) &&
    JS_GetProperty(cx, tmp, "timestamp", &jstimestamp) &&
    jsx.isNumber() && jsy.isNumber() && jsz.isNumber() && jstimestamp.isNumber();

    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");

    ret->x = jsx.toNumber();
    ret->y = jsy.toNumber();
    ret->z = jsz.toNumber();
    ret->timestamp = jstimestamp.toNumber();
    return true;
}

bool jsval_to_quaternion( JSContext *cx, JS::HandleValue v, cocos2d::Quaternion* ret)
{
    JS::RootedObject tmp(cx);
    JS::RootedValue x(cx);
    JS::RootedValue y(cx);
    JS::RootedValue z(cx);
    JS::RootedValue w(cx);

    bool ok = v.isObject() &&
        JS_ValueToObject(cx, v, &tmp) &&
        JS_GetProperty(cx, tmp, "x", &x) &&
        JS_GetProperty(cx, tmp, "y", &y) &&
        JS_GetProperty(cx, tmp, "z", &z) &&
        JS_GetProperty(cx, tmp, "w", &w) &&
        x.isNumber() && y.isNumber() && z.isNumber() && w.isNumber();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");
    
    double xx = x.toNumber();
    double yy = y.toNumber();
    double zz = z.toNumber();
    double ww = w.toNumber();

    ret->set(xx, yy, zz, ww);
    return true;
}

bool jsval_to_TTFConfig(JSContext *cx, JS::HandleValue v, cocos2d::TTFConfig* ret) {
    JS::RootedObject tmp(cx);
    JS::RootedValue js_fontFilePath(cx);
    JS::RootedValue js_fontSize(cx);
    JS::RootedValue js_outlineSize(cx);
    JS::RootedValue js_glyphs(cx);
    JS::RootedValue js_customGlyphs(cx);
    JS::RootedValue js_distanceFieldEnable(cx);

    std::string fontFilePath,customGlyphs;

    JS::RootedValue jsv(cx, v);
    bool ok = jsv.isObject() && JS_ValueToObject(cx, jsv, &tmp);
    if (ok)
    {
        if (JS_GetProperty(cx, tmp, "fontFilePath", &js_fontFilePath) && js_fontFilePath.isString())
        {
            ok &= jsval_to_std_string(cx,js_fontFilePath,&ret->fontFilePath);
        }
        
        if (JS_GetProperty(cx, tmp, "fontSize", &js_fontSize) && js_fontSize.isNumber())
        {
            ret->fontSize = (float)js_fontSize.toNumber();
        }
        
        if (JS_GetProperty(cx, tmp, "outlineSize", &js_outlineSize) && js_outlineSize.isNumber())
        {
            ret->outlineSize = (int)js_outlineSize.toNumber();
        }
        
        if (JS_GetProperty(cx, tmp, "glyphs", &js_glyphs) && js_glyphs.isInt32())
        {
            ret->glyphs = (GlyphCollection)(js_glyphs.toInt32());
        }
        
        if (JS_GetProperty(cx, tmp, "customGlyphs", &js_customGlyphs) && js_customGlyphs.isString())
        {
            ok &= jsval_to_std_string(cx,js_customGlyphs,&customGlyphs);
        }
        if(ret->glyphs == GlyphCollection::CUSTOM && !customGlyphs.empty())
            ret->customGlyphs = customGlyphs.c_str();
        else
            ret->customGlyphs = "";
        
        if (JS_GetProperty(cx, tmp, "distanceFieldEnable", &js_distanceFieldEnable) && js_distanceFieldEnable.isBoolean())
        {
            ret->distanceFieldEnabled = js_distanceFieldEnable.toBoolean();
        }
    }
    
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");
    
    return true;
}

bool jsvals_variadic_to_ccvaluevector( JSContext *cx, JS::Value *vp, int argc, cocos2d::ValueVector* ret)
{
    JS::RootedValue value(cx);
    for (int i = 0; i < argc; i++)
    {
        value = *vp;
        if (value.isObject())
        {
            JS::RootedObject jsobj(cx, value.toObjectOrNull());
            CCASSERT(jsb_get_js_proxy(cx, jsobj) == nullptr, "Native object should be added!");

            bool isArray = false;
            if (!JS_IsArrayObject(cx, jsobj, &isArray) || !isArray)
            {
                // It's a normal js object.
                ValueMap dictVal;
                bool ok = jsval_to_ccvaluemap(cx, value, &dictVal);
                if (ok)
                {
                    ret->push_back(Value(dictVal));
                }
            }
            else {
                // It's a js array object.
                ValueVector arrVal;
                bool ok = jsval_to_ccvaluevector(cx, value, &arrVal);
                if (ok)
                {
                    ret->push_back(Value(arrVal));
                }
            }
        }
        else if (value.isString())
        {
            JS::RootedString str(cx, value.toString());
            JSStringWrapper valueWapper(str, cx);
            ret->push_back(Value(valueWapper.get()));
        }
        else if (value.isNumber())
        {
            double number = value.toNumber();
            ret->push_back(Value(number));
        }
        else if (value.isBoolean())
        {
            bool boolVal = value.toBoolean();
            ret->push_back(Value(boolVal));
        }
        else
        {
            CCASSERT(false, "not supported type");
        }
        // next
        vp++;
    }

    return true;
}

bool jsval_to_ccrect(JSContext *cx, JS::HandleValue v, Rect* ret) {
    JS::RootedObject tmp(cx);
    JS::RootedValue jsx(cx);
    JS::RootedValue jsy(cx);
    JS::RootedValue jswidth(cx);
    JS::RootedValue jsheight(cx);

    bool ok = v.isObject() &&
    JS_ValueToObject(cx, v, &tmp) &&
    JS_GetProperty(cx, tmp, "x", &jsx) &&
    JS_GetProperty(cx, tmp, "y", &jsy) &&
    JS_GetProperty(cx, tmp, "width", &jswidth) &&
    JS_GetProperty(cx, tmp, "height", &jsheight) &&
    jsx.isNumber() && jsy.isNumber() && jswidth.isNumber() && jsheight.isNumber();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");

    ret->origin.x = jsx.toNumber();
    ret->origin.y = jsy.toNumber();
    ret->size.width = jswidth.toNumber();
    ret->size.height = jsheight.toNumber();
    return true;
}

bool jsval_to_ccsize(JSContext *cx, JS::HandleValue v, Size* ret) {
    JS::RootedObject tmp(cx);
    JS::RootedValue jsw(cx);
    JS::RootedValue jsh(cx);
    bool ok = v.isObject() &&
    JS_ValueToObject(cx, v, &tmp) &&
    JS_GetProperty(cx, tmp, "width", &jsw) &&
    JS_GetProperty(cx, tmp, "height", &jsh) &&
    jsw.isNumber() && jsh.isNumber();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");
    
    ret->width = jsw.toNumber();
    ret->height = jsh.toNumber();
    return true;
}

bool jsval_to_cccolor4b(JSContext *cx, JS::HandleValue v, Color4B* ret) {
    JS::RootedObject tmp(cx);
    JS::RootedValue jsr(cx);
    JS::RootedValue jsg(cx);
    JS::RootedValue jsb(cx);
    JS::RootedValue jsa(cx);

    bool ok = v.isObject() &&
    JS_ValueToObject(cx,  v, &tmp) &&
    JS_GetProperty(cx, tmp, "r", &jsr) &&
    JS_GetProperty(cx, tmp, "g", &jsg) &&
    JS_GetProperty(cx, tmp, "b", &jsb) &&
    JS_GetProperty(cx, tmp, "a", &jsa) &&
    jsr.isInt32() && jsg.isInt32() && jsb.isInt32() && jsa.isInt32();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");

    ret->r = (GLubyte)(jsr.toInt32());
    ret->g = (GLubyte)(jsg.toInt32());
    ret->b = (GLubyte)(jsb.toInt32());
    ret->a = (GLubyte)(jsa.toInt32());
    return true;
}

bool jsval_to_cccolor4f(JSContext *cx, JS::HandleValue v, Color4F* ret) {
    JS::RootedObject tmp(cx);
    JS::RootedValue jsr(cx);
    JS::RootedValue jsg(cx);
    JS::RootedValue jsb(cx);
    JS::RootedValue jsa(cx);
    
    bool ok = v.isObject() &&
    JS_ValueToObject(cx, v, &tmp) &&
    JS_GetProperty(cx, tmp, "r", &jsr) &&
    JS_GetProperty(cx, tmp, "g", &jsg) &&
    JS_GetProperty(cx, tmp, "b", &jsb) &&
    JS_GetProperty(cx, tmp, "a", &jsa) &&
    jsr.isNumber() && jsg.isNumber() && jsb.isNumber() && jsa.isNumber();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");
    
    ret->r = (float)(jsr.toNumber()) / 255;
    ret->g = (float)(jsg.toNumber()) / 255;
    ret->b = (float)(jsb.toNumber()) / 255;
    ret->a = (float)(jsa.toNumber()) / 255;
    return true;
}

bool jsval_to_cccolor3b(JSContext *cx, JS::HandleValue v, Color3B* ret) {
    JS::RootedObject tmp(cx);
    JS::RootedValue jsr(cx);
    JS::RootedValue jsg(cx);
    JS::RootedValue jsb(cx);
    bool ok = v.isObject() &&
    JS_ValueToObject(cx, v, &tmp) &&
    JS_GetProperty(cx, tmp, "r", &jsr) &&
    JS_GetProperty(cx, tmp, "g", &jsg) &&
    JS_GetProperty(cx, tmp, "b", &jsb) &&
    jsr.isInt32() && jsg.isInt32() && jsb.isInt32();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");

    ret->r = (GLubyte)(jsr.toInt32());
    ret->g = (GLubyte)(jsg.toInt32());
    ret->b = (GLubyte)(jsb.toInt32());
    return true;
}

bool jsval_cccolor_to_opacity(JSContext *cx, JS::HandleValue v, int32_t* ret) {
    JS::RootedObject tmp(cx);
    JS::RootedValue jsa(cx);

    if (v.isObject())
    {
        tmp = v.toObjectOrNull();
    }
    else
    {
        return false;
    }
    bool ok = JS_GetProperty(cx, tmp, "a", &jsa) && jsa.isInt32();

    if (ok)
    {
        *ret = jsa.toInt32();
        return true;
    }
    else return false;
}

bool jsval_to_ccarray_of_CCPoint(JSContext* cx, JS::HandleValue v, Point **points, int *numPoints) {
    // Parsing sequence
    JS::RootedObject jsobj(cx);
    if (v.isObject())
    {
        jsobj = v.toObjectOrNull();
    }
    else
    {
        return false;
    }
    bool isArray = false;
    JSB_PRECONDITION3(JS_IsArrayObject( cx, jsobj, &isArray) && isArray, cx, false, "Object must be an array");

    uint32_t len;
    JS_GetArrayLength(cx, jsobj, &len);

    bool ok;
    Point *array = new (std::nothrow) Point[len];

    for( uint32_t i=0; i< len;i++ ) {
        JS::RootedValue valarg(cx);
        JS_GetElement(cx, jsobj, i, &valarg);

        ok = jsval_to_ccpoint(cx, valarg, &array[i]);
        if(!ok)
            delete [] array;
        JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");
    }

    *numPoints = len;
    *points = array;

    return true;
}

bool jsval_to_ccvalue(JSContext* cx, JS::HandleValue v, cocos2d::Value* ret)
{
    if (v.isObject())
    {
        JS::RootedObject jsobj(cx, v.toObjectOrNull());
        CCASSERT(jsb_get_js_proxy(cx, jsobj) == nullptr, "Native object should be added!");
        bool isArray = false;
        if (!JS_IsArrayObject(cx, jsobj, &isArray) || !isArray)
        {
            // It's a normal js object.
            ValueMap dictVal;
            bool ok = jsval_to_ccvaluemap(cx, v, &dictVal);
            if (ok)
            {
                *ret = Value(dictVal);
            }
        }
        else {
            // It's a js array object.
            ValueVector arrVal;
            bool ok = jsval_to_ccvaluevector(cx, v, &arrVal);
            if (ok)
            {
                *ret = Value(arrVal);
            }
        }
    }
    else if (v.isString())
    {
        JS::RootedString str(cx, v.toString());
        JSStringWrapper valueWapper(str, cx);
        *ret = Value(valueWapper.get());
    }
    else if (v.isNumber())
    {
        *ret = Value(v.toNumber());
    }
    else if (v.isBoolean())
    {
        *ret = Value(v.toBoolean());
    }
    else {
        CCASSERT(false, "not supported type");
    }

    return true;
}

bool jsval_to_ccvaluemap(JSContext* cx, JS::HandleValue v, cocos2d::ValueMap* ret)
{
    if (v.isNullOrUndefined())
    {
        return true;
    }

    if (!v.isObject()) {
        CCLOG("%s", "jsval_to_ccvaluemap: the jsval is not an object.");
        return false;
    }
    
    JS::RootedObject tmp(cx, v.toObjectOrNull());
    JS::Rooted<JS::IdVector> ids(cx, cx);
    if (!JS_Enumerate(cx, tmp, &ids))
    {
        CCLOG("%s", "jsval_to_ccvaluemap: Failed to enumerate the js object.");
        return false;
    }
    
    ValueMap& dict = *ret;
    JS::RootedId idp(cx);
    JS::RootedValue key(cx);
    JS::RootedString keystr(cx);
    JS::RootedValue value(cx);
    JS::RootedObject jsobj(cx);
    for (int i = 0; i < ids.length(); ++i)
    {
        idp = ids[i];
        if (!JS_IdToValue(cx, idp, &key))
        {
            return false; // error
        }
        if (key.isNullOrUndefined()) {
            break; // end of iteration
        }
        if (!key.isString()) {
            continue; // ignore integer properties
        }

        keystr = key.toString();
        JSStringWrapper keyWrapper(keystr, cx);
        JS_GetPropertyById(cx, tmp, idp, &value);
        if (value.isObject())
        {
            jsobj = value.toObjectOrNull();
            CCASSERT(jsb_get_js_proxy(cx, jsobj) == nullptr, "Native object should be added!");
            bool isArray = false;
            if (!JS_IsArrayObject(cx, jsobj, &isArray) || !isArray)
            {
                // It's a normal js object.
                ValueMap dictVal;
                bool ok = jsval_to_ccvaluemap(cx, value, &dictVal);
                if (ok)
                {
                    dict.insert(ValueMap::value_type(keyWrapper.get(), Value(dictVal)));
                }
            }
            else {
                // It's a js array object.
                ValueVector arrVal;
                bool ok = jsval_to_ccvaluevector(cx, value, &arrVal);
                if (ok)
                {
                    dict.insert(ValueMap::value_type(keyWrapper.get(), Value(arrVal)));
                }
            }
        }
        else if (value.isString())
        {
            JS::RootedString valuestr(cx, value.toString());
            JSStringWrapper valueWapper(valuestr, cx);
            dict.insert(ValueMap::value_type(keyWrapper.get(), Value(valueWapper.get())));
        }
        else if (value.isNumber())
        {
            dict.insert(ValueMap::value_type(keyWrapper.get(), Value(value.toNumber())));
        }
        else if (value.isBoolean())
        {
            dict.insert(ValueMap::value_type(keyWrapper.get(), Value(value.toBoolean())));
        }
        else {
            CCASSERT(false, "not supported type");
        }
    }

    return true;
}

bool jsval_to_ccvaluemapintkey(JSContext* cx, JS::HandleValue v, cocos2d::ValueMapIntKey* ret)
{
    if (v.isNullOrUndefined())
    {
        return true;
    }

    if (!v.isObject()) {
        CCLOG("%s", "jsval_to_ccvaluemapintkey: the jsval is not an object.");
        return false;
    }
    
    JS::RootedObject tmp(cx, v.toObjectOrNull());
    JS::Rooted<JS::IdVector> ids(cx, cx);
    if (!JS_Enumerate(cx, tmp, &ids))
    {
        CCLOG("%s", "jsval_to_ccvaluemapintkey: Failed to enumerate the js object.");
        return false;
    }
    
    ValueMapIntKey& dict = *ret;
    JS::RootedId idp(cx);
    JS::RootedValue key(cx);
    JS::RootedValue value(cx);
    JS::RootedObject jsobj(cx);
    for (int i = 0; i < ids.length(); ++i)
    {
        idp = ids[i];
        if (!JS_IdToValue(cx, idp, &key))
        {
            return false; // error
        }
        if (key.isNullOrUndefined()) {
            break; // end of iteration
        }
        if (!key.isInt32()) {
            continue; // ignore non integer properties
        }

        int keyVal = key.toInt32();
        JS_GetPropertyById(cx, tmp, idp, &value);
        if (value.isObject())
        {
            jsobj = value.toObjectOrNull();
            CCASSERT(jsb_get_js_proxy(cx, jsobj) == nullptr, "Native object should be added!");
            bool isArray = false;
            if (!JS_IsArrayObject(cx, jsobj, &isArray) || !isArray)
            {
                // It's a normal js object.
                ValueMap dictVal;
                bool ok = jsval_to_ccvaluemap(cx, value, &dictVal);
                if (ok)
                {
                    dict.insert(ValueMapIntKey::value_type(keyVal, Value(dictVal)));
                }
            }
            else {
                // It's a js array object.
                ValueVector arrVal;
                bool ok = jsval_to_ccvaluevector(cx, value, &arrVal);
                if (ok)
                {
                    dict.insert(ValueMapIntKey::value_type(keyVal, Value(arrVal)));
                }
            }
        }
        else if (value.isString())
        {
            JS::RootedString valuestr(cx, value.toString());
            JSStringWrapper valueWapper(valuestr, cx);
            dict.insert(ValueMapIntKey::value_type(keyVal, Value(valueWapper.get())));
        }
        else if (value.isNumber())
        {
            dict.insert(ValueMapIntKey::value_type(keyVal, Value(value.toNumber())));
        }
        else if (value.isBoolean())
        {
            dict.insert(ValueMapIntKey::value_type(keyVal, Value(value.toBoolean())));
        }
        else {
            CCASSERT(false, "not supported type");
        }
    }

    return true;
}

bool jsval_to_ccvaluevector(JSContext* cx, JS::HandleValue v, cocos2d::ValueVector* ret)
{
    JS::RootedObject jsArr(cx);
    if (v.isObject())
    {
        jsArr = v.toObjectOrNull();
    }
    else
    {
        return false;
    }
    bool isArray = false;
    JSB_PRECONDITION3(JS_IsArrayObject(cx, jsArr, &isArray) && isArray, cx, false, "Object must be an array");

    uint32_t len = 0;
    JS_GetArrayLength(cx, jsArr, &len);
    bool ok = true;
    for (uint32_t i=0; i < len; i++)
    {
        JS::RootedValue value(cx);
        if (JS_GetElement(cx, jsArr, i, &value))
        {
            if (value.isObject())
            {
                JS::RootedObject jsobj(cx, value.toObjectOrNull());
                CCASSERT(jsb_get_js_proxy(cx, jsobj) == nullptr, "Native object should be added!");
                
                if (!JS_IsArrayObject(cx, jsobj, &isArray) || !isArray)
                {
                    // It's a normal js object.
                    ValueMap dictVal;
                    ok = jsval_to_ccvaluemap(cx, value, &dictVal);
                    if (ok)
                    {
                        ret->push_back(Value(dictVal));
                    }
                }
                else {
                    // It's a js array object.
                    ValueVector arrVal;
                    ok = jsval_to_ccvaluevector(cx, value, &arrVal);
                    if (ok)
                    {
                        ret->push_back(Value(arrVal));
                    }
                }
            }
            else if (value.isString())
            {
                JS::RootedString valuestr(cx, value.toString());
                JSStringWrapper valueWapper(valuestr, cx);
                ret->push_back(Value(valueWapper.get()));
            }
            else if (value.isNumber())
            {
                ret->push_back(Value(value.toNumber()));
            }
            else if (value.isBoolean())
            {
                ret->push_back(Value(value.toBoolean()));
            }
            else
            {
                CCASSERT(false, "not supported type");
            }
        }
    }

    return true;
}

bool jsval_to_ssize( JSContext *cx, JS::HandleValue vp, ssize_t* size)
{
    bool ret = false;
    int32_t sizeInt32 = 0;
    ret = jsval_to_int32(cx, vp, &sizeInt32);
    *size = sizeInt32;
    return ret;
}

bool jsval_to_std_vector_string( JSContext *cx, JS::HandleValue vp, std::vector<std::string>* ret)
{
    JS::RootedObject jsobj(cx);
    if (vp.isObject())
    {
        jsobj = vp.toObjectOrNull();
    }
    else
    {
        return false;
    }
    bool isArray = false;
    JSB_PRECONDITION3(JS_IsArrayObject(cx, jsobj, &isArray) && isArray, cx, false, "Object must be an array");

    uint32_t len = 0;
    JS_GetArrayLength(cx, jsobj, &len);
    ret->reserve(len);
    for (uint32_t i=0; i < len; i++)
    {
        JS::RootedValue value(cx);
        if (JS_GetElement(cx, jsobj, i, &value))
        {
            if (value.isString())
            {
                JS::RootedString valuestr(cx, value.toString());
                JSStringWrapper valueWapper(valuestr, cx);
                ret->push_back(valueWapper.get());
            }
            else
            {
                JS_ReportErrorUTF8(cx, "not supported type in array");
                return false;
            }
        }
    }

    return true;
}

bool jsval_to_std_vector_int( JSContext *cx, JS::HandleValue vp, std::vector<int>* ret)
{
    JS::RootedObject jsobj(cx);
    if (vp.isObject())
    {
        jsobj = vp.toObjectOrNull();
    }
    else
    {
        return false;
    }
    bool isArray = false;
    JSB_PRECONDITION3(JS_IsArrayObject(cx, jsobj, &isArray) && isArray, cx, false, "Object must be an array");

    uint32_t len = 0;
    JS_GetArrayLength(cx, jsobj, &len);
    ret->reserve(len);
    for (uint32_t i=0; i < len; i++)
    {
        JS::RootedValue value(cx);
        if (JS_GetElement(cx, jsobj, i, &value))
        {
            if (value.isInt32())
            {
                ret->push_back(value.toInt32());
            }
            else
            {
                JS_ReportErrorUTF8(cx, "not supported type in array");
                return false;
            }
        }
    }

    return true;
}

bool jsval_to_std_vector_float( JSContext *cx, JS::HandleValue vp, std::vector<float>* ret)
{
    JS::RootedObject jsobj(cx);
    if (vp.isObject())
    {
        jsobj = vp.toObjectOrNull();
    }
    else
    {
        return false;
    }
    bool isArray = false;
    JSB_PRECONDITION3(JS_IsArrayObject(cx, jsobj, &isArray) && isArray, cx, false, "Object must be an array");

    uint32_t len = 0;
    JS_GetArrayLength(cx, jsobj, &len);
    ret->reserve(len);
    for (uint32_t i=0; i < len; i++)
    {
        JS::RootedValue value(cx);
        if (JS_GetElement(cx, jsobj, i, &value))
        {
            if (value.isNumber())
            {
                ret->push_back(value.toNumber());
            }
            else
            {
                JS_ReportErrorUTF8(cx, "not supported type in array");
                return false;
            }
        }
    }

    return true;
}

bool jsval_to_matrix(JSContext *cx, JS::HandleValue vp, cocos2d::Mat4* ret)
{
    JS::RootedObject jsobj(cx);
    if (vp.isObject())
    {
        jsobj = vp.toObjectOrNull();
    }
    else
    {
        return false;
    }
    bool isArray = false;
    JSB_PRECONDITION3(JS_IsArrayObject(cx, jsobj, &isArray) && isArray, cx, false, "Object must be an array");

    uint32_t len = 0;
    JS_GetArrayLength(cx, jsobj, &len);

    if (len != 16)
    {
        JS_ReportErrorUTF8(cx, "array length error: %d, was expecting 16", len);
    }

    for (uint32_t i=0; i < len; i++)
    {
        JS::RootedValue value(cx);
        if (JS_GetElement(cx, jsobj, i, &value))
        {
            if (value.isNumber())
            {
                ret->m[i] = static_cast<float>(value.toNumber());
            }
            else
            {
                JS_ReportErrorUTF8(cx, "not supported type in matrix");
                return false;
            }
        }
    }

    return true;
}

bool jsval_to_vector2(JSContext *cx, JS::HandleValue vp, cocos2d::Vec2* ret)
{
    JS::RootedObject tmp(cx);
    JS::RootedValue jsx(cx);
    JS::RootedValue jsy(cx);
    bool ok = vp.isObject() &&
    JS_ValueToObject(cx, vp, &tmp) &&
    JS_GetProperty(cx, tmp, "x", &jsx) &&
    JS_GetProperty(cx, tmp, "y", &jsy) &&
    jsx.isNumber() && jsy.isNumber();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");

    ret->x = (float)(jsx.toNumber());
    ret->y = (float)(jsy.toNumber());
    return true;
}

bool jsval_to_vector3(JSContext *cx, JS::HandleValue vp, cocos2d::Vec3* ret)
{
    JS::RootedObject tmp(cx);
    JS::RootedValue jsx(cx);
    JS::RootedValue jsy(cx);
    JS::RootedValue jsz(cx);
    bool ok = vp.isObject() &&
    JS_ValueToObject(cx, vp, &tmp) &&
    JS_GetProperty(cx, tmp, "x", &jsx) &&
    JS_GetProperty(cx, tmp, "y", &jsy) &&
    JS_GetProperty(cx, tmp, "z", &jsz) &&
    jsx.isNumber() && jsy.isNumber() && jsz.isNumber();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");

    ret->x = (float)(jsx.toNumber());
    ret->y = (float)(jsy.toNumber());
    ret->z = (float)(jsz.toNumber());
    return true;
}

bool jsval_to_vector4(JSContext *cx, JS::HandleValue vp, cocos2d::Vec4* ret)
{
    JS::RootedObject tmp(cx);
    JS::RootedValue jsx(cx);
    JS::RootedValue jsy(cx);
    JS::RootedValue jsz(cx);
    JS::RootedValue jsw(cx);
    bool ok = vp.isObject() &&
    JS_ValueToObject(cx, vp, &tmp) &&
    JS_GetProperty(cx, tmp, "x", &jsx) &&
    JS_GetProperty(cx, tmp, "y", &jsy) &&
    JS_GetProperty(cx, tmp, "z", &jsz) &&
    JS_GetProperty(cx, tmp, "w", &jsw) &&
    jsx.isNumber() && jsy.isNumber() && jsz.isNumber() && jsw.isNumber();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");
    
    ret->x = (float)(jsx.toNumber());
    ret->y = (float)(jsy.toNumber());
    ret->z = (float)(jsz.toNumber());
    ret->w = (float)(jsw.toNumber());
    return true;
}

bool jsval_to_blendfunc(JSContext *cx, JS::HandleValue vp, cocos2d::BlendFunc* ret)
{
    JS::RootedObject tmp(cx);
    JS::RootedValue jssrc(cx);
    JS::RootedValue jsdst(cx);
    bool ok = vp.isObject() &&
    JS_ValueToObject(cx, vp, &tmp) &&
    JS_GetProperty(cx, tmp, "src", &jssrc) &&
    JS_GetProperty(cx, tmp, "dst", &jsdst) &&
    jssrc.isInt32() && jsdst.isInt32();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");

    ret->src = (unsigned int)(jssrc.toInt32());
    ret->dst = (unsigned int)(jsdst.toInt32());
    return true;
}

bool jsval_to_vector_vec2(JSContext* cx, JS::HandleValue v, std::vector<cocos2d::Vec2>* ret)
{
    JS::RootedObject jsArr(cx);
    if (v.isObject())
    {
        jsArr = v.toObjectOrNull();
    }
    else
    {
        return false;
    }
    bool isArray = false;
    JSB_PRECONDITION3(JS_IsArrayObject(cx, jsArr, &isArray) && isArray, cx, false, "Object must be an array");

    uint32_t len = 0;
    JS_GetArrayLength(cx, jsArr, &len);
    ret->reserve(len);
    bool ok = true;
    for (uint32_t i=0; i < len; i++)
    {
        JS::RootedValue value(cx);
        if (JS_GetElement(cx, jsArr, i, &value))
        {
            cocos2d::Vec2 vec2;
            ok &= jsval_to_vector2(cx, value, &vec2);
            ret->push_back(vec2);
        }
    }
    return ok;
}

bool jsval_to_cctex2f(JSContext* cx, JS::HandleValue vp, cocos2d::Tex2F* ret)
{
    JS::RootedObject tmp(cx);
    JS::RootedValue jsu(cx);
    JS::RootedValue jsv(cx);
    bool ok = vp.isObject() &&
    JS_ValueToObject(cx, vp, &tmp) &&
    JS_GetProperty(cx, tmp, "u", &jsu) &&
    JS_GetProperty(cx, tmp, "v", &jsv) &&
    jsu.isNumber() && jsv.isNumber();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");
    
    ret->u = (GLfloat)(jsu.toNumber());
    ret->v = (GLfloat)(jsv.toNumber());
    return true;
}

bool jsval_to_v3fc4bt2f(JSContext* cx, JS::HandleValue v, cocos2d::V3F_C4B_T2F* ret)
{
    JS::RootedObject object(cx, v.toObjectOrNull());

    cocos2d::Vec3 v3;
    cocos2d::Color4B color;
    cocos2d::Tex2F t2;

    JS::RootedValue jsv3(cx);
    JS::RootedValue jscolor(cx);
    JS::RootedValue jst2(cx);

    bool ok = JS_GetProperty(cx, object, "v3f", &jsv3) &&
    JS_GetProperty(cx, object, "c4b", &jscolor) &&
    JS_GetProperty(cx, object, "t2f", &jst2) &&
    jsval_to_vector3(cx, jsv3, &v3) &&
    jsval_to_cccolor4b(cx, jscolor, &color) &&
    jsval_to_cctex2f(cx, jst2, &t2);

    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");

    ret->vertices = v3;
    ret->colors = color;
    ret->texCoords = t2;
    return true;
}

bool jsval_to_v3fc4bt2f_quad(JSContext* cx, JS::HandleValue v, cocos2d::V3F_C4B_T2F_Quad* ret)
{
    JS::RootedObject object(cx, v.toObjectOrNull());

    cocos2d::V3F_C4B_T2F tl;
    cocos2d::V3F_C4B_T2F bl;
    cocos2d::V3F_C4B_T2F tr;
    cocos2d::V3F_C4B_T2F br;

    JS::RootedValue jstl(cx);
    JS::RootedValue jsbl(cx);
    JS::RootedValue jstr(cx);
    JS::RootedValue jsbr(cx);

    bool ok = JS_GetProperty(cx, object, "tl", &jstl) &&
              JS_GetProperty(cx, object, "bl", &jsbl) &&
              JS_GetProperty(cx, object, "tr", &jstr) &&
              JS_GetProperty(cx, object, "br", &jsbr) &&
              jsval_to_v3fc4bt2f(cx, jstl, &tl) &&
              jsval_to_v3fc4bt2f(cx, jsbl, &bl) &&
              jsval_to_v3fc4bt2f(cx, jstr, &tr) &&
              jsval_to_v3fc4bt2f(cx, jsbr, &br);

    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");

    ret->tl = tl;
    ret->bl = bl;
    ret->tr = tr;
    ret->br = br;
    return true;
}

bool jsval_to_vector_v3fc4bt2f(JSContext* cx, JS::HandleValue v, std::vector<cocos2d::V3F_C4B_T2F>* ret)
{
    JS::RootedObject jsArr(cx);
    if (v.isObject())
    {
        jsArr = v.toObjectOrNull();
    }
    else
    {
        return false;
    }
    bool isArray = false;
    JSB_PRECONDITION3(JS_IsArrayObject(cx, jsArr, &isArray) && isArray, cx, false, "Object must be an array");

    uint32_t len = 0;
    JS_GetArrayLength(cx, jsArr, &len);
    ret->reserve(len);
    bool ok = true;
    for (uint32_t i=0; i < len; i++)
    {
        JS::RootedValue value(cx);
        if (JS_GetElement(cx, jsArr, i, &value))
        {
            cocos2d::V3F_C4B_T2F vert;
            ok &= jsval_to_v3fc4bt2f(cx, value, &vert);
            ret->push_back(vert);
        }
    }
    return ok;
}

bool jsval_to_std_map_string_string(JSContext* cx, JS::HandleValue v, std::map<std::string, std::string>* ret)
{
    if (v.isNullOrUndefined())
    {
        return true;
    }

    if (!v.isObject())
    {
        CCLOG("%s", "jsval_to_std_map_string_string: the jsval is not an object.");
        return false;
    }
    
    JS::RootedObject tmp(cx, v.toObjectOrNull());
    JS::Rooted<JS::IdVector> ids(cx, cx);
    if (!JS_Enumerate(cx, tmp, &ids))
    {
        CCLOG("%s", "jsval_to_std_map_string_string: Failed to enumerate the js object.");
        return false;
    }
    
    std::map<std::string, std::string>& dict = *ret;
    JS::RootedId idp(cx);
    JS::RootedValue key(cx);
    JS::RootedValue value(cx);
    for (int i = 0; i < ids.length(); ++i)
    {
        idp = ids[i];
        if (!JS_IdToValue(cx, idp, &key))
        {
            return false; // error
        }
        if (key.isNullOrUndefined())
        {
            break; // end of iteration
        }
        if (!key.isString())
        {
            continue; // only take account of string key
        }

        JS::RootedString keystr(cx, key.toString());
        JSStringWrapper keyWrapper(keystr, cx);

        JS_GetPropertyById(cx, tmp, idp, &value);
        if (value.isString())
        {
            JS::RootedString valuestr(cx, value.toString());
            JSStringWrapper valueWapper(valuestr, cx);
            dict[keyWrapper.get()] = valueWapper.get();
        }
        else
        {
            CCASSERT(false, "jsval_to_std_map_string_string: not supported map type");
        }
    }

    return true;
}

// native --> jsval

bool jsval_to_ccaffinetransform(JSContext* cx, JS::HandleValue v, AffineTransform* ret)
{
    JS::RootedObject tmp(cx);
    JS::RootedValue jsa(cx);
    JS::RootedValue jsb(cx);
    JS::RootedValue jsc(cx);
    JS::RootedValue jsd(cx);
    JS::RootedValue jstx(cx);
    JS::RootedValue jsty(cx);
    bool ok = JS_ValueToObject(cx, v, &tmp) &&
    JS_GetProperty(cx, tmp, "a", &jsa) &&
    JS_GetProperty(cx, tmp, "b", &jsb) &&
    JS_GetProperty(cx, tmp, "c", &jsc) &&
    JS_GetProperty(cx, tmp, "d", &jsd) &&
    JS_GetProperty(cx, tmp, "tx", &jstx) &&
    JS_GetProperty(cx, tmp, "ty", &jsty) &&
    jstx.isNumber() && jsty.isNumber() && jsa.isNumber() && jsb.isNumber() && jsc.isNumber() && jsd.isNumber();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");
    
    double a = jsa.toNumber();
    double b = jsb.toNumber();
    double c = jsc.toNumber();
    double d = jsd.toNumber();
    double tx = jstx.toNumber();
    double ty = jsty.toNumber();

    *ret = AffineTransformMake(a, b, c, d, tx, ty);
    return true;
}

// From native type to jsval

bool std_string_to_jsval(JSContext* cx, const std::string& v, JS::MutableHandleValue ret)
{
    return c_string_to_jsval(cx, v.c_str(), ret, v.size());
}

bool c_string_to_jsval(JSContext* cx, const char* v, JS::MutableHandleValue ret, size_t length)
{
    if (v != nullptr && length == -1)
    {
        length = strlen(v);
    }

    if (0 == length || v == nullptr)
    {
        auto emptyStr = JS_NewStringCopyZ(cx, "");
        ret.set(JS::StringValue(emptyStr));
        return true;
    }

#if defined(_MSC_VER) && (_MSC_VER <= 1800)
    // NOTE: Visual Studio 2013 (Platform Toolset v120) is not fully C++11 compatible.
    // It also doesn't provide support for char16_t and std::u16string.
    // For more information, please see this article
    // https://blogs.msdn.microsoft.com/vcblog/2014/11/17/c111417-features-in-vs-2015-preview/
    int utf16_size = 0;
    const jschar* strUTF16 = (jschar*)cc_utf8_to_utf16(v, (int)length, &utf16_size);

    if (strUTF16 && utf16_size > 0) {
        JS::RootedString str(cx, JS_NewUCStringCopyN(cx, strUTF16, (size_t)utf16_size));
        if (str) {
            ret.set(JS::StringValue(str));
        }
        delete[] strUTF16;
    }
#else
    std::u16string strUTF16;
    bool ok = StringUtils::UTF8ToUTF16(std::string(v, length), strUTF16);

    if (ok && !strUTF16.empty()) {
        JS::RootedString str(cx, JS_NewUCStringCopyN(cx, reinterpret_cast<const char16_t*>(strUTF16.data()), strUTF16.size()));
        if (str) {
            ret.set(JS::StringValue(str));
        }
    }
#endif

    return true;
}

bool ccpoint_to_jsval(JSContext* cx, const Point& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "x", v.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "y", v.y, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool ccacceleration_to_jsval(JSContext* cx, const Acceleration& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "x", v.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "y", v.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "z", v.z, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "timestamp", v.timestamp, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool ccrect_to_jsval(JSContext* cx, const Rect& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "x", v.origin.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "y", v.origin.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "width", v.size.width, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "height", v.size.height, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool ccsize_to_jsval(JSContext* cx, const Size& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "width", v.width, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "height", v.height, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool cccolor4b_to_jsval(JSContext* cx, const Color4B& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "r", (int32_t)v.r, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "g", (int32_t)v.g, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "b", (int32_t)v.b, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "a", (int32_t)v.a, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool cccolor4f_to_jsval(JSContext* cx, const Color4F& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "r", (int32_t)(v.r * 255), JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "g", (int32_t)(v.g * 255), JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "b", (int32_t)(v.b * 255), JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "a", (int32_t)(v.a * 255), JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool cccolor3b_to_jsval(JSContext* cx, const Color3B& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "r", (int32_t)v.r, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "g", (int32_t)v.g, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "b", (int32_t)v.b, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "a", 255, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool ccaffinetransform_to_jsval(JSContext* cx, const AffineTransform& t, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "a", t.a, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "b", t.b, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "c", t.c, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "d", t.d, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "tx", t.tx, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "ty", t.ty, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool quaternion_to_jsval(JSContext* cx, const cocos2d::Quaternion& q, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "x", q.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "y", q.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "z", q.z, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "w", q.w, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if(ok)
        ret.set(JS::ObjectOrNullValue(tmp));

    return ok;
}

bool uniform_to_jsval(JSContext* cx, const cocos2d::Uniform* uniform, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    JS::RootedValue jsname(cx);
    bool ok = std_string_to_jsval(cx, uniform->name, &jsname) &&
        JS_DefineProperty(cx, tmp, "location", uniform->location, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "size", uniform->size, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "type", uniform->type, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "name", jsname, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if(ok)
        ret.set(JS::ObjectOrNullValue(tmp));

    return ok;
}

bool FontDefinition_to_jsval(JSContext* cx, const FontDefinition& t, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    JS::RootedValue prop(cx);

    bool ok = true;

    ok &= std_string_to_jsval(cx, t._fontName, &prop);
    ok &= JS_DefineProperty(cx, tmp, "fontName", prop, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "fontSize", t._fontSize, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "textAlign", (int32_t)t._alignment, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "verticalAlign", (int32_t)t._vertAlignment, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= cccolor3b_to_jsval(cx, t._fontFillColor, &prop);
    ok &= JS_DefineProperty(cx, tmp, "fillStyle", prop, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "boundingWidth", t._dimensions.width, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "boundingHeight", t._dimensions.height, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    // Shadow
    prop.set(JS::BooleanValue(t._shadow._shadowEnabled));
    ok &= JS_DefineProperty(cx, tmp, "shadowEnabled", prop, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "shadowOffsetX", t._shadow._shadowOffset.width, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "shadowOffsetY", t._shadow._shadowOffset.height, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "shadowBlur", t._shadow._shadowBlur, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "shadowOpacity", t._shadow._shadowOpacity, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    // Stroke
    prop.set(JS::BooleanValue(t._stroke._strokeEnabled));
    ok &= JS_DefineProperty(cx, tmp, "strokeEnabled", prop, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= cccolor3b_to_jsval(cx, t._stroke._strokeColor, &prop);
    ok &= JS_DefineProperty(cx, tmp, "strokeStyle", prop, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    ok &= JS_DefineProperty(cx, tmp, "lineWidth", t._stroke._strokeSize, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool jsval_to_FontDefinition( JSContext *cx, JS::HandleValue vp, FontDefinition *out )
{
    JS::RootedObject jsobj(cx);

    if (!JS_ValueToObject( cx, vp, &jsobj ) )
        return false;

    JSB_PRECONDITION( jsobj, "Not a valid JS object");

    // default values
    const char *            defautlFontName         = "Arial";
    const int               defaultFontSize         = 32;
    TextHAlignment         defaultTextAlignment    = TextHAlignment::LEFT;
    TextVAlignment defaultTextVAlignment   = TextVAlignment::TOP;

    // by default shadow and stroke are off
    out->_shadow._shadowEnabled = false;
    out->_stroke._strokeEnabled = false;

    // white text by default
    out->_fontFillColor = Color3B::WHITE;

    // font name
    JS::RootedValue jsr(cx);
    JS_GetProperty(cx, jsobj, "fontName", &jsr);
    JS::RootedString jsstr(cx, jsr.toString());
    JSStringWrapper wrapper(jsstr);
    const char* fontName = wrapper.get();

    if (fontName && strlen(fontName) > 0)
    {
        out->_fontName  = fontName;
    }
    else
    {
        out->_fontName  = defautlFontName;
    }

    // font size
    bool hasProperty, hasSecondProp;
    JS_HasProperty(cx, jsobj, "fontSize", &hasProperty);
    if ( hasProperty )
    {
        JS_GetProperty(cx, jsobj, "fontSize", &jsr);
        out->_fontSize  = jsr.isNumber() ? jsr.toNumber() : defaultFontSize;
    }
    else
    {
        out->_fontSize  = defaultFontSize;
    }

    // font alignment horizontal
    JS_HasProperty(cx, jsobj, "textAlign", &hasProperty);
    if ( hasProperty )
    {
        JS_GetProperty(cx, jsobj, "textAlign", &jsr);
        out->_alignment = jsr.isInt32() ? (TextHAlignment)(jsr.toInt32()) : defaultTextAlignment;
    }
    else
    {
        out->_alignment  = defaultTextAlignment;
    }

    // font alignment vertical
    JS_HasProperty(cx, jsobj, "verticalAlign", &hasProperty);
    if ( hasProperty )
    {
        JS_GetProperty(cx, jsobj, "verticalAlign", &jsr);
        out->_vertAlignment = jsr.isInt32() ? (TextVAlignment)(jsr.toInt32()) : defaultTextVAlignment;
    }
    else
    {
        out->_vertAlignment  = defaultTextVAlignment;
    }

    // font fill color
    JS_HasProperty(cx, jsobj, "fillStyle", &hasProperty);
    if ( hasProperty )
    {
        JS_GetProperty(cx, jsobj, "fillStyle", &jsr);
        jsval_to_cccolor3b(cx, jsr, &out->_fontFillColor);
    }

    // font rendering box dimensions
    JS_HasProperty(cx, jsobj, "boundingWidth", &hasProperty);
    JS_HasProperty(cx, jsobj, "boundingHeight", &hasSecondProp);
    if ( hasProperty && hasSecondProp )
    {
        JS_GetProperty(cx, jsobj, "boundingWidth", &jsr);
        double boundingW = jsr.isNumber() ? jsr.toNumber() : 0;

        JS_GetProperty(cx, jsobj, "boundingHeight", &jsr);
        double boundingH = jsr.isNumber() ? jsr.toNumber() : 0;

        Size dimension;
        dimension.width = boundingW;
        dimension.height = boundingH;
        out->_dimensions = dimension;
    }

    // shadow
    JS_HasProperty(cx, jsobj, "shadowEnabled", &hasProperty);
    if ( hasProperty )
    {
        JS_GetProperty(cx, jsobj, "shadowEnabled", &jsr);
        out->_shadow._shadowEnabled = jsr.isBoolean() ? jsr.toBoolean() : false;

        if ( out->_shadow._shadowEnabled )
        {
            // default shadow values
            out->_shadow._shadowOffset  = Size(5, 5);
            out->_shadow._shadowBlur    = 1;
            out->_shadow._shadowOpacity = 1;

            // shadow offset
            JS_HasProperty(cx, jsobj, "shadowOffsetX", &hasProperty);
            JS_HasProperty(cx, jsobj, "shadowOffsetY", &hasSecondProp);
            if ( hasProperty && hasSecondProp )
            {
                JS_GetProperty(cx, jsobj, "shadowOffsetX", &jsr);
                double offx = jsr.isNumber() ? jsr.toNumber() : 0;
                
                JS_GetProperty(cx, jsobj, "shadowOffsetY", &jsr);
                double offy = jsr.isNumber() ? jsr.toNumber() : 0;

                Size offset;
                offset.width = offx;
                offset.height = offy;
                out->_shadow._shadowOffset = offset;
            }

            // shadow blur
            JS_HasProperty(cx, jsobj, "shadowBlur", &hasProperty);
            if ( hasProperty )
            {
                JS_GetProperty(cx, jsobj, "shadowBlur", &jsr);
                double shadowBlur = jsr.isNumber() ? jsr.toNumber() : 0;
                out->_shadow._shadowBlur = shadowBlur;
            }

            // shadow intensity
            JS_HasProperty(cx, jsobj, "shadowOpacity", &hasProperty);
            if ( hasProperty )
            {
                JS_GetProperty(cx, jsobj, "shadowOpacity", &jsr);
                double shadowOpacity = jsr.isNumber() ? jsr.toNumber() : 0;
                out->_shadow._shadowOpacity = shadowOpacity;
            }
        }
    }

    // stroke
    JS_HasProperty(cx, jsobj, "strokeEnabled", &hasProperty);
    if ( hasProperty )
    {
        JS_GetProperty(cx, jsobj, "strokeEnabled", &jsr);
        out->_stroke._strokeEnabled = jsr.isBoolean() ? jsr.toBoolean() : false;

        if ( out->_stroke._strokeEnabled )
        {
            // default stroke values
            out->_stroke._strokeSize  = 1;
            out->_stroke._strokeColor = Color3B::BLUE;

            // stroke color
            JS_HasProperty(cx, jsobj, "strokeStyle", &hasProperty);
            if ( hasProperty )
            {
                JS_GetProperty(cx, jsobj, "strokeStyle", &jsr);
                jsval_to_cccolor3b(cx, jsr, &out->_stroke._strokeColor);
            }

            // stroke size
            JS_HasProperty(cx, jsobj, "lineWidth", &hasProperty);
            if ( hasProperty )
            {
                JS_GetProperty(cx, jsobj, "lineWidth", &jsr);
                double strokeSize = jsr.isNumber() ? jsr.toNumber() : 0;
                out->_stroke._strokeSize = strokeSize;
            }
        }
    }

    // we are done here
    return true;
}

bool jsval_to_CCPoint( JSContext *cx, JS::HandleValue vp, Point *ret )
{
#ifdef JSB_COMPATIBLE_WITH_COCOS2D_HTML5_BASIC_TYPES

    JS::RootedObject jsobj(cx);
    if( ! JS_ValueToObject( cx, vp, &jsobj ) )
        return false;

    JSB_PRECONDITION( jsobj, "Not a valid JS object");

    JS::RootedValue valx(cx);
    JS::RootedValue valy(cx);
    bool ok = true;
    ok &= JS_GetProperty(cx, jsobj, "x", &valx) && valx.isNumber();
    ok &= JS_GetProperty(cx, jsobj, "y", &valy) && valy.isNumber();

    if( ! ok )
        return false;

    ret->x = valx.toNumber();
    ret->y = valy.toNumber();

    return true;

#else // #! JSB_COMPATIBLE_WITH_COCOS2D_HTML5_BASIC_TYPES

    JS::RootedObject tmp_arg(cx);
    if( ! JS_ValueToObject( cx, vp, &tmp_arg ) )
        return false;

    JSB_PRECONDITION( tmp_arg && JS_IsTypedArrayObject( tmp_arg, cx ), "Not a TypedArray object");

    JSB_PRECONDITION( JS_GetTypedArrayByteLength( tmp_arg, cx ) == sizeof(cpVect), "Invalid length");

    bool flag;
    *ret = *(Point*)JS_GetArrayBufferViewData( tmp_arg, &flag, JS::AutoCheckCannotGC());

    return true;
#endif // #! JSB_COMPATIBLE_WITH_COCOS2D_HTML5_BASIC_TYPES
}

bool ccvalue_to_jsval(JSContext* cx, const cocos2d::Value& v, JS::MutableHandleValue ret)
{
    const Value& obj = v;

    switch (obj.getType())
    {
        case Value::Type::BOOLEAN:
            ret.set(JS::BooleanValue(obj.asBool()));
            break;
        case Value::Type::FLOAT:
        case Value::Type::DOUBLE:
            ret.set(JS::DoubleValue(obj.asDouble()));
            break;
        case Value::Type::INTEGER:
            ret.set(JS::Int32Value(obj.asInt()));
            break;
        case Value::Type::STRING:
            std_string_to_jsval(cx, obj.asString(), ret);
            break;
        case Value::Type::VECTOR:
            ccvaluevector_to_jsval(cx, obj.asValueVector(), ret);
            break;
        case Value::Type::MAP:
            ccvaluemap_to_jsval(cx, obj.asValueMap(), ret);
            break;
        case Value::Type::INT_KEY_MAP:
            ccvaluemapintkey_to_jsval(cx, obj.asIntKeyMap(), ret);
            break;
        default:
            ret.set(JS::NullHandleValue);
            break;
    }

    return true;
}

bool ccvaluemap_to_jsval(JSContext* cx, const cocos2d::ValueMap& v, JS::MutableHandleValue ret)
{
    JS::RootedObject jsRet(cx, JS_NewArrayObject(cx, 0));

    for (auto iter = v.begin(); iter != v.end(); ++iter)
    {
        JS::RootedValue dictElement(cx);

        std::string key = iter->first;
        const Value& obj = iter->second;

        switch (obj.getType())
        {
            case Value::Type::BOOLEAN:
                dictElement = JS::BooleanValue(obj.asBool());
                break;
            case Value::Type::FLOAT:
            case Value::Type::DOUBLE:
                dictElement = JS::DoubleValue(obj.asDouble());
                break;
            case Value::Type::INTEGER:
                dictElement = JS::Int32Value(obj.asInt());
                break;
            case Value::Type::STRING:
                std_string_to_jsval(cx, obj.asString(), &dictElement);
                break;
            case Value::Type::VECTOR:
                ccvaluevector_to_jsval(cx, obj.asValueVector(), &dictElement);
                break;
            case Value::Type::MAP:
                ccvaluemap_to_jsval(cx, obj.asValueMap(), &dictElement);
                break;
            case Value::Type::INT_KEY_MAP:
                ccvaluemapintkey_to_jsval(cx, obj.asIntKeyMap(), &dictElement);
                break;
            default:
                break;
        }

        if (!key.empty())
        {
            JS_SetProperty(cx, jsRet, key.c_str(), dictElement);
        }
    }
    ret.set(JS::ObjectOrNullValue(jsRet));
    return true;
}

bool ccvaluemapintkey_to_jsval(JSContext* cx, const cocos2d::ValueMapIntKey& v, JS::MutableHandleValue ret)
{
    JS::RootedObject jsRet(cx, JS_NewArrayObject(cx, 0));

    for (auto iter = v.begin(); iter != v.end(); ++iter)
    {
        JS::RootedValue dictElement(cx);
        std::stringstream keyss;
        keyss << iter->first;
        std::string key = keyss.str();

        const Value& obj = iter->second;

        switch (obj.getType())
        {
            case Value::Type::BOOLEAN:
                dictElement = JS::BooleanValue(obj.asBool());
                break;
            case Value::Type::FLOAT:
            case Value::Type::DOUBLE:
                dictElement = JS::DoubleValue(obj.asDouble());
                break;
            case Value::Type::INTEGER:
                dictElement = JS::Int32Value(obj.asInt());
                break;
            case Value::Type::STRING:
                std_string_to_jsval(cx, obj.asString(), &dictElement);
                break;
            case Value::Type::VECTOR:
                ccvaluevector_to_jsval(cx, obj.asValueVector(), &dictElement);
                break;
            case Value::Type::MAP:
                ccvaluemap_to_jsval(cx, obj.asValueMap(), &dictElement);
                break;
            case Value::Type::INT_KEY_MAP:
                ccvaluemapintkey_to_jsval(cx, obj.asIntKeyMap(), &dictElement);
                break;
            default:
                break;
        }

        if (!key.empty())
        {
            JS_SetProperty(cx, jsRet, key.c_str(), dictElement);
        }
    }
    ret.set(JS::ObjectOrNullValue(jsRet));
    return true;
}

bool ccvaluevector_to_jsval(JSContext* cx, const cocos2d::ValueVector& v, JS::MutableHandleValue ret)
{
    JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, 0));

    int i = 0;
    for (const auto& obj : v)
    {
        JS::RootedValue arrElement(cx);

        switch (obj.getType())
        {
            case Value::Type::BOOLEAN:
                arrElement = JS::BooleanValue(obj.asBool());
                break;
            case Value::Type::FLOAT:
            case Value::Type::DOUBLE:
                arrElement = JS::DoubleValue(obj.asDouble());
                break;
            case Value::Type::INTEGER:
                arrElement = JS::Int32Value(obj.asInt());
                break;
            case Value::Type::STRING:
                std_string_to_jsval(cx, obj.asString(), &arrElement);
                break;
            case Value::Type::VECTOR:
                ccvaluevector_to_jsval(cx, obj.asValueVector(), &arrElement);
                break;
            case Value::Type::MAP:
                ccvaluemap_to_jsval(cx, obj.asValueMap(), &arrElement);
                break;
            case Value::Type::INT_KEY_MAP:
                ccvaluemapintkey_to_jsval(cx, obj.asIntKeyMap(), &arrElement);
                break;
            default:
                break;
        }

        if (!JS_SetElement(cx, jsretArr, i, arrElement)) {
            break;
        }
        ++i;
    }
    ret.set(JS::ObjectOrNullValue(jsretArr));
    return true;
}

bool ssize_to_jsval(JSContext *cx, ssize_t v, JS::MutableHandleValue ret)
{
    CCASSERT(v < INT_MAX, "The size should not bigger than 32 bit (int32_t).");
    ret.set(JS::Int32Value(static_cast<int>(v)));
    return true;
}

bool std_vector_string_to_jsval( JSContext *cx, const std::vector<std::string>& v, JS::MutableHandleValue ret)
{
    JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, v.size()));

    int i = 0;
    for (const std::string obj : v)
    {
        JS::RootedValue arrElement(cx);
        bool ok = std_string_to_jsval(cx, obj, &arrElement);

        if (!ok || !JS_SetElement(cx, jsretArr, i, arrElement)) {
            break;
        }
        ++i;
    }
    ret.set(JS::ObjectOrNullValue(jsretArr));
    return true;
}

bool std_vector_int_to_jsval( JSContext *cx, const std::vector<int>& v, JS::MutableHandleValue ret)
{
    JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, v.size()));

    int i = 0;
    for (const int obj : v)
    {
        JS::RootedValue arrElement(cx);
        arrElement = JS::Int32Value(obj);

        if (!JS_SetElement(cx, jsretArr, i, arrElement)) {
            break;
        }
        ++i;
    }
    ret.set(JS::ObjectOrNullValue(jsretArr));
    return true;
}

bool std_vector_float_to_jsval( JSContext *cx, const std::vector<float>& v, JS::MutableHandleValue ret)
{
    JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, v.size()));

    int i = 0;
    for (const float obj : v)
    {
        JS::RootedValue arrElement(cx);
        arrElement = JS::DoubleValue(obj);

        if (!JS_SetElement(cx, jsretArr, i, arrElement)) {
            break;
        }
        ++i;
    }
    ret.set(JS::ObjectOrNullValue(jsretArr));
    return true;
}

bool matrix_to_jsval(JSContext *cx, const cocos2d::Mat4& v, JS::MutableHandleValue ret)
{
    JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, 16));

    for (int i = 0; i < 16; i++) {
        JS::RootedValue arrElement(cx);
        arrElement = JS::DoubleValue(v.m[i]);

        if (!JS_SetElement(cx, jsretArr, i, arrElement)) {
            break;
        }
    }
    
    ret.set(JS::ObjectOrNullValue(jsretArr));
    return true;
}

bool vector2_to_jsval(JSContext *cx, const cocos2d::Vec2& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "x", v.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "y", v.y, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool vector3_to_jsval(JSContext *cx, const cocos2d::Vec3& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "x", v.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "y", v.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "z", v.z, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool vector4_to_jsval(JSContext *cx, const cocos2d::Vec4& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "x", v.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "y", v.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "z", v.z, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "w", v.z, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool blendfunc_to_jsval(JSContext *cx, const cocos2d::BlendFunc& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    bool ok = JS_DefineProperty(cx, tmp, "src", (uint32_t)v.src, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
    JS_DefineProperty(cx, tmp, "dst", (uint32_t)v.dst, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool vector_vec2_to_jsval(JSContext *cx, const std::vector<cocos2d::Vec2>& v, JS::MutableHandleValue ret)
{
    JS::RootedObject jsretArr(cx, JS_NewArrayObject(cx, v.size()));

    int i = 0;
    for (const cocos2d::Vec2& obj : v)
    {
        JS::RootedValue arrElement(cx);
        vector2_to_jsval(cx, obj, &arrElement);

        if (!JS_SetElement(cx, jsretArr, i, arrElement)) {
            break;
        }
        ++i;
    }
    ret.set(JS::ObjectOrNullValue(jsretArr));
    return true;
}

bool std_map_string_string_to_jsval(JSContext* cx, const std::map<std::string, std::string>& v, JS::MutableHandleValue ret)
{
    JS::RootedObject jsRet(cx, JS_NewPlainObject(cx));

    for (auto iter = v.begin(); iter != v.end(); ++iter)
    {
        JS::RootedValue element(cx);

        std::string key = iter->first;
        std::string obj = iter->second;

        bool ok = std_string_to_jsval(cx, obj, &element);

        if (ok && !key.empty())
        {
            JS_SetProperty(cx, jsRet, key.c_str(), element);
        }
    }
    ret.set(JS::ObjectOrNullValue(jsRet));
    return true;
}

bool jsval_to_resourcedata(JSContext *cx, JS::HandleValue v, ResourceData* ret) {
    JS::RootedObject tmp(cx);
    JS::RootedValue jstype(cx);
    JS::RootedValue jsfile(cx);
    JS::RootedValue jsplist(cx);

    std::string file, plist;
    bool ok = v.isObject() &&
        JS_ValueToObject(cx, v, &tmp) &&
        JS_GetProperty(cx, tmp, "type", &jstype) &&
        JS_GetProperty(cx, tmp, "name", &jsfile) &&
        JS_GetProperty(cx, tmp, "plist", &jsplist) &&
        jsval_to_std_string(cx, jsfile, &file) &&
        jsval_to_std_string(cx, jsplist, &plist) &&
        jstype.isInt32();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");

    ret->type = jstype.toInt32();
    ret->file = file;
    ret->plist = plist;
    return true;
}

bool resourcedata_to_jsval(JSContext* cx, const ResourceData& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    JS::RootedValue fileVal(cx);
    JS::RootedValue plistVal(cx);
    bool ok = std_string_to_jsval(cx, v.file, &fileVal) &&
        std_string_to_jsval(cx, v.plist, &plistVal) &&
        JS_DefineProperty(cx, tmp, "type", v.type, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "file", fileVal, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "plist", plistVal, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool asset_to_jsval(JSContext* cx, const cocos2d::extension::ManifestAsset& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    JS::RootedValue md5Val(cx);
    JS::RootedValue pathVal(cx);
    bool ok = std_string_to_jsval(cx, v.md5, &md5Val) &&
        std_string_to_jsval(cx, v.path, &pathVal) &&
        JS_DefineProperty(cx, tmp, "md5", md5Val, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "path", pathVal, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "compressed", v.compressed, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "size", v.size, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "downloadState", (int)v.downloadState, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}
