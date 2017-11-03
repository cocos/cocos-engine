/****************************************************************************
 * Copyright (c) 2017 Chukong Technologies Inc.
 *
 * http://www.cocos2d-x.org
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
 ****************************************************************************/

package org.cocos2dx.lib;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import com.cocos.analytics.CAAgent;

public class CAAgentWrapper {

    private static final String TAG = "CAAgentWrapper";

    public static void init(String channelID, String appID, String appSecret) {
        CAAgent.init(Cocos2dxActivity.getContext(), channelID, appID, appSecret);
    }

    public static String getChannelID() {
        try {
            ApplicationInfo applicationInfo = Cocos2dxActivity.getContext().getPackageManager()
                    .getApplicationInfo(Cocos2dxActivity.getContext().getPackageName(),
                            PackageManager.GET_META_DATA);
            if (applicationInfo != null) {
                if (applicationInfo.metaData != null) {
                    if (applicationInfo.metaData.containsKey("ASC_ChannelID"))
                    {
                        String channelID = applicationInfo.metaData.get("ASC_ChannelID") + "";
                        if (channelID.startsWith("A")) {
                            channelID = channelID.substring(1);
                        }
                        return channelID;
                    }
                }
            }

        } catch (Exception e) {
            Log.e(TAG,"Could not get channel ID", e);
        }

        return "";
    }
}
