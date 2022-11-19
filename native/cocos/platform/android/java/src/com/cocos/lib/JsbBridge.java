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

public class JsbBridge {
    public interface ICallback{
        /**
         * Applies this callback to the given argument.
         *
         * @param arg0 as input
         * @param arg1 as input
         */
        void onScript(String arg0, String arg1);
    }
    private static ICallback callback;

    private static void callByScript(String arg0, String arg1){
        if(JsbBridge.callback != null)
            callback.onScript(arg0, arg1);
    }

    /**Add a callback which you would like to apply
     * @param f ICallback, the method which will be actually applied. multiple calls will override
     * */
    public static void setCallback(ICallback f){
        JsbBridge.callback = f;
    }
    /**
     * Java dispatch Js event, use native c++ code
     * @param arg0 input values
     */
    private static native void nativeSendToScript(String arg0, String arg1);
    public static void sendToScript(String arg0, String arg1){
        nativeSendToScript(arg0, arg1);
    }
    public static void sendToScript(String arg0){
        nativeSendToScript(arg0, null);
    }
}