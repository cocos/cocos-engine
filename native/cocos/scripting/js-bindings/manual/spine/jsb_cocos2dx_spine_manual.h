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

#ifndef __jsb_cocos2dx_spine_manual__
#define __jsb_cocos2dx_spine_manual__

#include "jsapi.h"
#include "editor-support/spine/spine-cocos2dx.h"

void register_all_cocos2dx_spine_manual(JSContext* cx, JS::HandleObject global);

extern bool speventdata_to_jsval(JSContext* cx, spEventData& v, JS::MutableHandleValue result);
extern bool spevent_to_jsval(JSContext* cx, spEvent& v, JS::MutableHandleValue result);
extern bool spbonedata_to_jsval(JSContext* cx, const spBoneData* v, JS::MutableHandleValue result);
extern bool spbone_to_jsval(JSContext* cx, spBone& v, JS::MutableHandleValue result);
extern bool spskeleton_to_jsval(JSContext* cx, spSkeleton& v, JS::MutableHandleValue result);
extern bool spattachment_to_jsval(JSContext* cx, spAttachment& v, JS::MutableHandleValue result);
extern bool spregionattachment_to_jsval(JSContext* cx, spRegionAttachment& v, JS::MutableHandleValue result);
extern bool spmeshattachment_to_jsval(JSContext* cx, spMeshAttachment& v, JS::MutableHandleValue result);
extern bool spboundingboxattachment_to_jsval(JSContext* cx, spBoundingBoxAttachment& v, JS::MutableHandleValue result);
extern bool spslotdata_to_jsval(JSContext* cx, spSlotData& v, JS::MutableHandleValue result);
extern bool spslot_to_jsval(JSContext* cx, spSlot& v, JS::MutableHandleValue result);
extern bool sptimeline_to_jsval(JSContext* cx, spTimeline& v, JS::MutableHandleValue result);
extern bool spanimationstate_to_jsval(JSContext* cx, spAnimationState& v, JS::MutableHandleValue result);
extern bool spanimation_to_jsval(JSContext* cx, spAnimation& v, JS::MutableHandleValue result);
extern bool sptrackentry_to_jsval(JSContext* cx, spTrackEntry& v, JS::MutableHandleValue entryVal);

#endif /* defined(__jsb_cocos2dx_spine_manual__) */
