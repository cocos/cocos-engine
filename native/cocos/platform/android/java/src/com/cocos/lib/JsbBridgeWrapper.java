/****************************************************************************
 Copyright (c) 2018-2021 Xiamen Yaji Software Co., Ltd.

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
package com.cocos.lib;

import java.util.ArrayList;
import java.util.HashMap;

public class JsbBridgeWrapper {
    public interface JavaCallback {
        void onTrigger(String arg);
    }

    public static JsbBridgeWrapper getInstance() {
        if (instance == null) {
            instance = new JsbBridgeWrapper();
        }
        return instance;
    }

    public void addCallback(String event, JavaCallback cb) {
        if (eventMap.get(event) == null) {
            eventMap.put(event, new ArrayList<JavaCallback>());
        }
        eventMap.get(event).add(cb);
    }

    public void removeCallback(String event, JavaCallback cb) {
        ArrayList<JavaCallback> arr = eventMap.get(event);
        if (arr == null) {
            return;
        }
        arr.remove(cb);
    }

    public void removeEvent(String event) {
        this.eventMap.remove(event);
    }

    public void dispatchScriptEvent(String event, String arg0) {
        JsbBridge.sendToScript(event, arg0);
    }

    public void dispatchScriptEvent(String event) {
        JsbBridge.sendToScript(event);
    }

    private JsbBridgeWrapper() {
        JsbBridge.setCallback(new JsbBridge.ICallback() {
            @Override
            public void onScript(String arg0, String arg1) {
                triggerEvents(arg0, arg1);
            }
        });
    }

    private final HashMap<String, ArrayList<JavaCallback>> eventMap = new HashMap<>();
    private static JsbBridgeWrapper instance;

    private void triggerEvents(String event, String arg) {
        ArrayList<JavaCallback> arr = eventMap.get(event);
        if (arr == null)
            return;
        for (JavaCallback m : arr) {
            m.onTrigger(arg);
        }
    }
}
