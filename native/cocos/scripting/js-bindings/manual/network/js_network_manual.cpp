/*
 * Copyright (c) 2017 Chukong Technologies Inc.
 * Created by panda on 1/13/17.
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

#include "js_network_manual.h"
#include "js_manual_conversions.h"

bool jsval_to_DownloaderHints(JSContext *cx, JS::HandleValue v, cocos2d::network::DownloaderHints* ret) {
    JS::RootedObject tmp(cx);
    JS::RootedValue jsCountOfMaxProcessingTasks(cx);
    JS::RootedValue jsTimeoutInSeconds(cx);
    JS::RootedValue jsTempFileNameSuffix(cx);
    
    double countOfMaxProcessingTasks = 0, timeoutInSeconds = 0;
    std::string tempFileNameSuffix;
    bool ok = v.isObject() &&
    JS_ValueToObject(cx, v, &tmp) &&
    JS_GetProperty(cx, tmp, "countOfMaxProcessingTasks", &jsCountOfMaxProcessingTasks) &&
    JS_GetProperty(cx, tmp, "timeoutInSeconds", &jsTimeoutInSeconds) &&
    JS_GetProperty(cx, tmp, "tempFileNameSuffix", &jsTempFileNameSuffix) &&
    jsval_to_std_string(cx, jsTempFileNameSuffix, &tempFileNameSuffix) &&
    jsCountOfMaxProcessingTasks.isNumber() && jsTimeoutInSeconds.isNumber();
    JSB_PRECONDITION3(ok, cx, false, "Error processing arguments");
    
    countOfMaxProcessingTasks = jsCountOfMaxProcessingTasks.toNumber();
    timeoutInSeconds = jsTimeoutInSeconds.toNumber();
    
    ret->countOfMaxProcessingTasks = (uint32_t)countOfMaxProcessingTasks;
    ret->timeoutInSeconds = (uint32_t)timeoutInSeconds;
    ret->tempFileNameSuffix = tempFileNameSuffix;
    return true;
}

bool downloadTask_to_jsval(JSContext *cx, const cocos2d::network::DownloadTask& v, JS::MutableHandleValue ret)
{
    JS::RootedObject tmp(cx, JS_NewPlainObject(cx));
    if (!tmp) return false;
    JS::RootedValue idVal(cx);
    JS::RootedValue urlVal(cx);
    JS::RootedValue pathVal(cx);
    bool ok = std_string_to_jsval(cx, v.identifier, &idVal) &&
        std_string_to_jsval(cx, v.requestURL, &urlVal) &&
        std_string_to_jsval(cx, v.storagePath, &pathVal) &&
        JS_DefineProperty(cx, tmp, "identifier", idVal, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "requestURL", urlVal, JSPROP_ENUMERATE | JSPROP_PERMANENT) &&
        JS_DefineProperty(cx, tmp, "storagePath", pathVal, JSPROP_ENUMERATE | JSPROP_PERMANENT);
    if (ok) {
        ret.set(JS::ObjectOrNullValue(tmp));
    }
    return ok;
}

