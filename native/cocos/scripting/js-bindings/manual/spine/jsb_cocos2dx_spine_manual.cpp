/*
 * Created by ucchen on 2/12/14.
 * Copyright (c) 2014-2016 Chukong Technologies Inc.
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

#include "scripting/js-bindings/manual/spine/jsb_cocos2dx_spine_manual.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "editor-support/spine/spine-cocos2dx.h"

using namespace spine;

std::unordered_map<spTrackEntry*, JSObject*> _spTrackEntryMap;

bool speventdata_to_jsval(JSContext* cx, spEventData& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    JS::RootedValue jsname(cx);
    JS::RootedValue jsstr(cx);
    bool ok = c_string_to_jsval(cx, v.name, &jsname) &&
        c_string_to_jsval(cx, v.stringValue, &jsstr) &&
        JS_DefineProperty(cx, tmp, "name", jsname, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "intValue", v.intValue, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "floatValue", v.floatValue, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "stringValue", jsstr, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool spevent_to_jsval(JSContext* cx, spEvent& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    JS::RootedValue jsdata(cx);
    bool ok = speventdata_to_jsval(cx, *v.data, &jsdata);
    JS::RootedValue jsstr(cx);
    ok &= c_string_to_jsval(cx, v.stringValue, &jsstr) &&
        JS_DefineProperty(cx, tmp, "data", jsdata, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "intValue", v.intValue, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "floatValue", v.floatValue, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "stringValue", jsstr, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool spbonedata_to_jsval(JSContext* cx, const spBoneData* v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    bool ok = true;
    // root haven't parent
    JS::RootedValue parentVal(cx);
    if (strcmp(v->name, "root") && v->parent)
        ok &= spbonedata_to_jsval(cx, v->parent, &parentVal);

    JS::RootedValue jsname(cx);
    ok &= c_string_to_jsval(cx, v->name, &jsname) &&
        JS_DefineProperty(cx, tmp, "name", jsname, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "parent", parentVal,JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "length", v->length, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "x", v->x, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "y", v->y, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "rotation", v->rotation, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "scaleX", v->scaleX, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "scaleY", v->scaleY, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool spbone_to_jsval(JSContext* cx, spBone& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    bool ok = true;
    // root haven't parent
    JS::RootedValue parentVal(cx);
    if (strcmp(v.data->name, "root") && v.parent)
        ok &= spbone_to_jsval(cx, *v.parent, &parentVal);

    JS::RootedValue jsdata(cx);
    ok &= spbonedata_to_jsval(cx, v.data, &jsdata) &&
        JS_DefineProperty(cx, tmp, "data", jsdata, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "parent", parentVal, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "x", v.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "y", v.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "rotation", v.rotation, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "scaleX", v.scaleX, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "scaleY", v.scaleY, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "shearX", v.shearX, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "shearY", v.shearY, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "m00", v.a, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "m01", v.b, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "worldX", v.worldX, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "m10", v.c, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "m11", v.d, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "worldY", v.worldY, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    /*
        JS_DefineProperty(cx, tmp, "worldRotation", v.worldRotation, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "worldScaleX", v.worldScaleX, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "worldScaleY", v.worldScaleY, JSPROP_ENUMERATE | JSPROP_PERMANENT);
     */

    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool spskeleton_to_jsval(JSContext* cx, spSkeleton& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    bool ok = JS_DefineProperty(cx, tmp, "x", v.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "y", v.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "flipX", v.flipX, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "flipY", v.flipY, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "time", v.time, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "boneCount", v.bonesCount, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "slotCount", v.slotsCount, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool spattachment_to_jsval(JSContext* cx, spAttachment& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    JS::RootedValue jsname(cx);
    bool ok = c_string_to_jsval(cx, v.name, &jsname) &&
        JS_DefineProperty(cx, tmp, "name", jsname, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "type", v.type, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool spregionattachment_to_jsval(JSContext* cx, spRegionAttachment& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    JS::RootedValue jsname(cx);
    bool ok = c_string_to_jsval(cx, v.super.name, &jsname) &&
        JS_DefineProperty(cx, tmp, "name", jsname, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "type", v.super.type, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "x", v.x, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "y", v.y, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "scaleX", v.scaleX, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "scaleY", v.scaleY, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "rotation", v.rotation, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "width", v.width, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "height", v.height, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "r", v.r, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "g", v.g, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "b", v.b, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "a", v.a, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool spmeshattachment_to_jsval(JSContext* cx, spMeshAttachment& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    JS::RootedValue jsname(cx);
    bool ok = c_string_to_jsval(cx, v.super.super.name, &jsname) &&
        JS_DefineProperty(cx, tmp, "name", jsname, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "type", v.super.super.type, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "regionOffsetX", v.regionOffsetX, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "regionOffsetY", v.regionOffsetY, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "regionWidth", v.regionWidth, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "regionHeight", v.regionHeight, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "regionOriginalWidth", v.regionOriginalWidth, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "regionOriginalHeight", v.regionOriginalHeight, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "width", v.width, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "height", v.height, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "r", v.r, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "g", v.g, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "b", v.b, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "a", v.a, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool spboundingboxattachment_to_jsval(JSContext* cx, spBoundingBoxAttachment& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    std::vector<float> vertices;
    for (int i = 0; i < v.super.worldVerticesLength; ++i){
        vertices.push_back(v.super.vertices[i]);
    }
    
    JS::RootedValue jsvertices(cx);
    JS::RootedValue jsname(cx);
    
    bool ok = std_vector_float_to_jsval(cx,vertices, &jsvertices) &&
        c_string_to_jsval(cx, v.super.super.name, &jsname) &&
        JS_DefineProperty(cx, tmp, "name", jsname, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "type", v.super.super.type, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "vertices", jsvertices, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "worldVerticesLength", v.super.worldVerticesLength, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    
    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool spslotdata_to_jsval(JSContext* cx, spSlotData& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    JS::RootedValue jsname(cx);
    JS::RootedValue jsattachmentName(cx);
    JS::RootedValue jsboneData(cx);
    bool ok = c_string_to_jsval(cx, v.name, &jsname) &&
        c_string_to_jsval(cx, v.attachmentName, &jsattachmentName) &&
        spbonedata_to_jsval(cx, v.boneData, &jsboneData) &&
        JS_DefineProperty(cx, tmp, "name", jsname, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "attachmentName", jsattachmentName, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "r", v.r, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "g", v.g, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "b", v.b, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "a", v.a, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "blendMode", v.blendMode, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "boneData", jsboneData, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool spslot_to_jsval(JSContext* cx, spSlot& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));

    bool ok = true;
    JS::RootedValue jstemp(cx);
    if (v.attachment->type == spAttachmentType::SP_ATTACHMENT_REGION) {
        ok &= spregionattachment_to_jsval(cx, *((spRegionAttachment*)(v.attachment)), &jstemp);
    }
    else if (v.attachment->type == spAttachmentType::SP_ATTACHMENT_MESH ||
             v.attachment->type == spAttachmentType::SP_ATTACHMENT_LINKED_MESH) {
        ok &= spmeshattachment_to_jsval(cx, *((spMeshAttachment*)(v.attachment)), &jstemp);
    }
    else if (v.attachment->type == spAttachmentType::SP_ATTACHMENT_BOUNDING_BOX){
        
        ok &= spboundingboxattachment_to_jsval(cx, *((spBoundingBoxAttachment*)(v.attachment)), &jstemp);
    }
    else {
        ok &= spattachment_to_jsval(cx, *(v.attachment), &jstemp);
    }
    JS::RootedValue jsattachment(cx, jstemp);
    JS::RootedValue jsbone(cx);
    JS::RootedValue jsdata(cx);
    ok &= JS_DefineProperty(cx, tmp, "r", v.r, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "g", v.g, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "b", v.b, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "a", v.a, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        spbone_to_jsval(cx, *v.bone, &jsbone) &&
        spslotdata_to_jsval(cx, *v.data, &jsdata) &&
        JS_DefineProperty(cx, tmp, "bone", jsbone, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        //JS_DefineProperty(cx, tmp, "skeleton", spskeleton_to_jsval(cx, *v.skeleton), NULL, NULL, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "attachment", jsattachment, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "data", jsdata, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool sptimeline_to_jsval(JSContext* cx, spTimeline& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    bool ok = JS_DefineProperty(cx, tmp, "type", v.type, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool spanimationstate_to_jsval(JSContext* cx, spAnimationState& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    bool ok = JS_DefineProperty(cx, tmp, "timeScale", v.timeScale, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "trackCount", v.tracksCount, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

bool spanimation_to_jsval(JSContext* cx, spAnimation& v, JS::MutableHandleValue result)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    
    JS::RootedValue jsname(cx);
    JS::RootedValue jstimelines(cx);
    bool ok = c_string_to_jsval(cx, v.name, &jsname) &&
        sptimeline_to_jsval(cx, **v.timelines, &jstimelines) &&
        JS_DefineProperty(cx, tmp, "duration", v.duration, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "timelineCount", v.timelinesCount, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "name", jsname, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "timelines", jstimelines, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    if (ok)
    {
        result.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

JSClass  *jsb_spine_TrackEntry_class;
JSObject *jsb_spine_TrackEntry_prototype;

bool jsb_spine_TrackEntry_get_next(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    spTrackEntry* cobj = (spTrackEntry *)(proxy ? proxy->ptr : NULL);
    if (cobj) {
        JS::RootedValue jsret(cx, JS::NullValue());
        if (cobj->next)
        {
            sptrackentry_to_jsval(cx, *cobj->next, &jsret);
        }
        args.rval().set(jsret);
        return true;
    }
    else {
        CCLOGERROR("jsb_spine_TrackEntry_get_next : Invalid Native Object");
        return false;
    }
}

bool jsb_spine_TrackEntry_get_mixingFrom(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject jsthis(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, jsthis);
    spTrackEntry* cobj = (spTrackEntry *)(proxy ? proxy->ptr : NULL);
    if (cobj) {
        JS::RootedValue jsret(cx, JS::NullValue());
        if (cobj->mixingFrom)
        {
            sptrackentry_to_jsval(cx, *cobj->mixingFrom, &jsret);
        }
        args.rval().set(jsret);
        return true;
    }
    else {
        CCLOGERROR("jsb_spine_TrackEntry_get_mixingFrom : Invalid Native Object");
        return false;
    }
}

void js_spine_TrackEntry_finalize(JSFreeOp *fop, JSObject *obj) {
    std::unordered_map<spTrackEntry*, JSObject*>::iterator existed = _spTrackEntryMap.begin();
    while (existed != _spTrackEntryMap.end()) {
        if (existed->second == obj)
        {
            _spTrackEntryMap.erase(existed);
            break;
        }
        ++existed;
    }
}

void js_register_spine_TrackEntry(JSContext *cx, JS::HandleObject global)
{
    static const JSClassOps jsclassOps = {
        nullptr, nullptr, nullptr, nullptr,
        nullptr, nullptr, nullptr,
        js_spine_TrackEntry_finalize,
        nullptr, nullptr, nullptr, nullptr
    };
    static JSClass spine_TrackEntry_class = {
        "TrackEntry",
        JSCLASS_HAS_PRIVATE | JSCLASS_FOREGROUND_FINALIZE,
        &jsclassOps
    };
    jsb_spine_TrackEntry_class = &spine_TrackEntry_class;
    
    static JSPropertySpec properties[] =
    {
        JS_PSG("mixingFrom", jsb_spine_TrackEntry_get_mixingFrom, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PSG("next", jsb_spine_TrackEntry_get_next, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };
    
    JS::RootedObject parent_proto(cx, nullptr);
    jsb_spine_TrackEntry_prototype = JS_InitClass(cx, global, parent_proto, jsb_spine_TrackEntry_class, nullptr, 0, properties, nullptr, nullptr, nullptr);
    // add the proto and JSClass to the type->js info hash table
    JS::RootedObject proto(cx, jsb_spine_TrackEntry_prototype);
    jsb_register_class<spTrackEntry>(cx, jsb_spine_TrackEntry_class, proto);
    
    JS::RootedValue className(cx);
    std_string_to_jsval(cx, "TrackEntry", &className);
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
}

bool sptrackentry_to_jsval(JSContext* cx, spTrackEntry& v, JS::MutableHandleValue entryVal)
{
    JS::RootedObject entry(cx);
    std::unordered_map<spTrackEntry*, JSObject*>::iterator existed = _spTrackEntryMap.find(&v);
    bool found = existed != _spTrackEntryMap.end();
    if (found)
    {
        entry.set(existed->second);
    }
    else
    {
        JS::RootedObject proto(cx, jsb_spine_TrackEntry_prototype);
        entry.set(JS_NewObjectWithGivenProto(cx, jsb_spine_TrackEntry_class, proto));
    }
    
    entryVal.set(JS::ObjectOrNullValue(entry));
    if (entryVal.isObject())
    {
        JS::RootedValue val(cx, JS::DoubleValue(v.delay));
        bool ok = JS_SetProperty(cx, entry, "delay", val);
        val.set(JS::DoubleValue(v.loop));
        ok &= JS_SetProperty(cx, entry, "loop", val);
        val.set(JS::DoubleValue(v.trackIndex));
        ok &= JS_SetProperty(cx, entry, "trackIndex", val);
        val.set(JS::DoubleValue(v.trackTime));
        ok &= JS_SetProperty(cx, entry, "trackTime", val);
        val.set(JS::DoubleValue(v.trackLast));
        ok &= JS_SetProperty(cx, entry, "trackLast", val);
        val.set(JS::DoubleValue(v.trackEnd));
        ok &= JS_SetProperty(cx, entry, "trackEnd", val);
        val.set(JS::DoubleValue(v.nextTrackLast));
        ok &= JS_SetProperty(cx, entry, "nextTrackLast", val);
        val.set(JS::DoubleValue(v.timeScale));
        ok &= JS_SetProperty(cx, entry, "timeScale", val);
        val.set(JS::DoubleValue(v.mixTime));
        ok &= JS_SetProperty(cx, entry, "mixTime", val);
        val.set(JS::DoubleValue(v.mixDuration));
        ok &= JS_SetProperty(cx, entry, "mixDuration", val);
        val.set(JS::DoubleValue(v.animationStart));
        ok &= JS_SetProperty(cx, entry, "animationStart", val);
        val.set(JS::DoubleValue(v.animationEnd));
        ok &= JS_SetProperty(cx, entry, "animationEnd", val);
        val.set(JS::DoubleValue(v.animationLast));
        ok &= JS_SetProperty(cx, entry, "animationLast", val);
        val.set(JS::DoubleValue(v.nextAnimationLast));
        ok &= JS_SetProperty(cx, entry, "nextAnimationLast", val);
        if (v.animation)
        {
            ok &= spanimation_to_jsval(cx, *v.animation, &val);
        }
        else
        {
            val.set(JS::NullHandleValue);
        }
        ok &= JS_SetProperty(cx, entry, "animation", val);
        
        if (ok)
        {
            if (!found)
            {
                _spTrackEntryMap.emplace(&v, entry);
            }
            return true;
        }
    }
    
    entryVal.set(JS::NullHandleValue);
    return true;
}

bool jsb_cocos2dx_spine_findBone(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    SkeletonRenderer* cobj = (SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 1) {
        const char* arg0;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        spBone* ret = cobj->findBone(arg0);
        JS::RootedValue jsret(cx);
        do {
            if (ret)
            {
                ok = spbone_to_jsval(cx, *ret, &jsret);
            }
        } while (0);

        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool jsb_cocos2dx_spine_findSlot(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    SkeletonRenderer* cobj = (SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 1) {
        const char* arg0;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        spSlot* ret = cobj->findSlot(arg0);
        JS::RootedValue jsret(cx);
        do {
            if (ret)
            {
                spslot_to_jsval(cx, *ret, &jsret);
            }
        } while (0);

        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool jsb_cocos2dx_spine_setDebugBones(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    SkeletonRenderer* cobj = (SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 1) {
        bool enable;
        bool ok = jsval_to_bool(cx, args.get(0), &enable);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        
        cobj->setDebugBonesEnabled(enable);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool jsb_cocos2dx_spine_setDebugSolots(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    SkeletonRenderer* cobj = (SkeletonRenderer *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 1) {
        bool enable;
        bool ok = jsval_to_bool(cx, args.get(0), &enable);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        
        cobj->setDebugSlotsEnabled(enable);
        args.rval().setUndefined();
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool jsb_cocos2dx_spine_getAttachment(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    SkeletonRenderer* cobj = (SkeletonRenderer*)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 2) {
        const char* arg0;
        std::string arg0_tmp; ok &= jsval_to_std_string(cx, args.get(0), &arg0_tmp); arg0 = arg0_tmp.c_str();
        const char* arg1;
        std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        spAttachment* ret = cobj->getAttachment(arg0, arg1);
        JS::RootedValue jsret(cx);
        do {
            if (ret)
            {
                if (ret->type == spAttachmentType::SP_ATTACHMENT_REGION) {
                    spregionattachment_to_jsval(cx, *((spRegionAttachment*)ret), &jsret);
                }
                else if (ret->type == spAttachmentType::SP_ATTACHMENT_MESH ||
                         ret->type == spAttachmentType::SP_ATTACHMENT_LINKED_MESH) {
                    spmeshattachment_to_jsval(cx, *((spMeshAttachment*)ret), &jsret);
                }
                else if (ret->type == spAttachmentType::SP_ATTACHMENT_BOUNDING_BOX){
                    
                    spboundingboxattachment_to_jsval(cx, *((spBoundingBoxAttachment*)(ret)), &jsret);
                }
                else {
                    spattachment_to_jsval(cx, *ret, &jsret);
                }
            }
        } while(0);

        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool jsb_cocos2dx_spine_getCurrent(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 1) {
        int arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");
        spTrackEntry* ret = cobj->getCurrent(arg0);
        JS::RootedValue jsret(cx);
        do {
            if (ret)
            {
                sptrackentry_to_jsval(cx, *ret, &jsret);
            }
        } while (0);

        args.rval().set(jsret);
        return true;
    }
    else if (argc == 0) {
        spTrackEntry* ret = cobj->getCurrent();
        JS::RootedValue jsret(cx);
        do {
            if (ret)
            {
                 sptrackentry_to_jsval(cx, *ret, &jsret);
            }
        } while (0);

        args.rval().set(jsret);
        return true;
    }

    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool jsb_cocos2dx_spine_setAnimation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 3) {
        int arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        const char* arg1;
        std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();
        bool arg2;
        ok &= jsval_to_bool(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        spTrackEntry* ret = cobj->setAnimation(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);

        do {
            if (ret)
            {
                sptrackentry_to_jsval(cx, *ret, &jsret);
            }
        } while(0);

        args.rval().set(jsret);
        return true;
    }


    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}

bool jsb_cocos2dx_spine_addAnimation(JSContext *cx, uint32_t argc, JS::Value *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(cx, obj);
    spine::SkeletonAnimation* cobj = (spine::SkeletonAnimation *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "Invalid Native Object");
    if (argc == 3) {
        int arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        const char* arg1;
        std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();
        bool arg2;
        ok &= jsval_to_bool(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        spTrackEntry* ret = cobj->addAnimation(arg0, arg1, arg2);
        JS::RootedValue jsret(cx);

        do {
            if (ret)
            {
                sptrackentry_to_jsval(cx, *ret, &jsret);
            }
        } while(0);

        args.rval().set(jsret);
        return true;
    } else if (argc == 4) {
        int arg0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);

        const char* arg1;
        std::string arg1_tmp; ok &= jsval_to_std_string(cx, args.get(1), &arg1_tmp); arg1 = arg1_tmp.c_str();
        bool arg2;
        double arg3;
        ok &= jsval_to_bool(cx, args.get(2), &arg2);
        ok &= jsval_to_double(cx, args.get(3), &arg3);
        JSB_PRECONDITION2(ok, cx, false, "Error processing arguments");

        spTrackEntry* ret = cobj->addAnimation(arg0, arg1, arg2, arg3);
        JS::RootedValue jsret(cx);

        do {
            if (ret)
            {
                sptrackentry_to_jsval(cx, *ret, &jsret);
            }
        } while(0);

        args.rval().set(jsret);
        return true;
    }    
    
    JS_ReportErrorUTF8(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}


extern JS::PersistentRootedObject* jsb_spine_SkeletonRenderer_prototype;
extern JS::PersistentRootedObject* jsb_spine_SkeletonAnimation_prototype;

void register_all_cocos2dx_spine_manual(JSContext* cx, JS::HandleObject global)
{
    js_register_spine_TrackEntry(cx, global);
    
    JS::RootedObject skeletonRenderer(cx, jsb_spine_SkeletonRenderer_prototype->get());
    JS_DefineFunction(cx, skeletonRenderer, "findBone", jsb_cocos2dx_spine_findBone, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, skeletonRenderer, "findSlot", jsb_cocos2dx_spine_findSlot, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, skeletonRenderer, "setDebugBones", jsb_cocos2dx_spine_setDebugBones, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, skeletonRenderer, "setDebugSolots", jsb_cocos2dx_spine_setDebugSolots, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, skeletonRenderer, "getAttachment", jsb_cocos2dx_spine_getAttachment, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);

    JS::RootedObject skeletonAnimation(cx, jsb_spine_SkeletonAnimation_prototype->get());
    JS_DefineFunction(cx, skeletonAnimation, "getCurrent", jsb_cocos2dx_spine_getCurrent, 1, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, skeletonAnimation, "setAnimation", jsb_cocos2dx_spine_setAnimation, 3, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    JS_DefineFunction(cx, skeletonAnimation, "addAnimation", jsb_cocos2dx_spine_addAnimation, 4, JSPROP_ENUMERATE | JSPROP_PERMANENT);

}
