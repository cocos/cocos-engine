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
    //Interface for listener, should be implemented and dispatched
    public interface OnScriptEventListener {
        void onScriptEvent(String arg);
    }
    /**
     * Get the instance of JsbBridgetWrapper
     */
    public static JsbBridgeWrapper getInstance() {
        if (instance == null) {
            instance = new JsbBridgeWrapper();
        }
        return instance;
    }
    /**
     * Add a listener to specified event, if the event does not exist, the wrapper will create one. Concurrent listener will be ignored
     */
    public void addScriptEventListener(String eventName, OnScriptEventListener listener) {
        if (eventMap.get(eventName) == null) {
            eventMap.put(eventName, new ArrayList<OnScriptEventListener>());
        }
        eventMap.get(eventName).add(listener);
    }
    /**
     * Remove listener for specified event, concurrent event will be deleted. Return false only if the event does not exist
     */
    public boolean removeScriptEventListener(String eventName, OnScriptEventListener listener) {
        ArrayList<OnScriptEventListener> arr = eventMap.get(eventName);
        if (arr == null) {
            return false;
        }
        arr.remove(listener);
        return true;
    }
    /**
     * Remove all listener for event specified.
     */
    public void removeAllListenersForEvent(String eventName) {
        this.eventMap.remove(eventName);
    }
    /**
     * Remove all event registered. Use it carefully!
     */
    public void removeAllListeners() {
        this.eventMap.clear();
    }
    /**
     * Dispatch the event with argument, the event should be registered in javascript, or other script language in future.
     */
    public void dispatchEventToScript(String eventName, String arg) {
        JsbBridge.sendToScript(eventName, arg);
    }
    /**
     * Dispatch the event which is registered in javascript, or other script language in future.
     */
    public void dispatchEventToScript(String eventName) {
        JsbBridge.sendToScript(eventName);
    }

    private JsbBridgeWrapper() {
        JsbBridge.setCallback(new JsbBridge.ICallback() {
            @Override
            public void onScript(String arg0, String arg1) {
                triggerEvents(arg0, arg1);
            }
        });
    }

    private final HashMap<String, ArrayList<OnScriptEventListener>> eventMap = new HashMap<>();
    private static JsbBridgeWrapper instance;

    private void triggerEvents(String eventName, String arg) {
        ArrayList<OnScriptEventListener> arr = eventMap.get(eventName);
        if (arr == null)
            return;
        for (OnScriptEventListener m : arr) {
            m.onScriptEvent(arg);
        }
    }
}
