/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package com.cocos.lib;

import ohos.aafwk.ability.AbilitySlice;
import ohos.aafwk.content.Intent;
import ohos.aafwk.content.Operation;
import ohos.agp.text.Font;
import ohos.agp.window.service.Display;
import ohos.agp.window.service.DisplayManager;
import ohos.app.Context;
import ohos.app.dispatcher.TaskDispatcher;
import ohos.batterymanager.BatteryInfo;
import ohos.event.commonevent.*;
import ohos.global.resource.RawFileEntry;
import ohos.global.resource.Resource;
import ohos.miscservices.pasteboard.PasteData;
import ohos.miscservices.pasteboard.SystemPasteboard;
import ohos.net.NetManager;
import ohos.rpc.RemoteException;
import ohos.system.DeviceInfo;
import ohos.system.version.SystemVersion;
import ohos.utils.net.Uri;
import ohos.vibrator.agent.VibratorAgent;
import ohos.vibrator.bean.VibrationPattern;
import ohos.wifi.WifiDevice;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.FutureTask;


public class CocosHelper {
    // ===========================================================
    // Constants
    // ===========================================================
    private static final String TAG = CocosHelper.class.getSimpleName();

    // ===========================================================
    // Fields
    // ===========================================================

    private static AbilitySlice sAbilitySlice;
    private static VibratorAgent sVibrateService;
    private static Optional<BatteryReceiver> sBatteryReceiver = Optional.empty();
    private static Thread sUIThread = null;

    public static final int NETWORK_TYPE_NONE = 0;
    public static final int NETWORK_TYPE_LAN = 1;
    public static final int NETWORK_TYPE_WWAN = 2;

    // The absolute path to the OBB if it exists.
    private static String sObbFilePath = "";


    static class LockedTaskQ {
        private final Object readMtx = new Object();
        private Queue<Runnable> sTaskQ = new LinkedList<>();
        public synchronized void addTask(Runnable runnable) {
            sTaskQ.add(runnable);
        }
        public void runTasks(){
            Queue<Runnable> tmp;
            synchronized (readMtx) {
                tmp = sTaskQ;
                sTaskQ = new LinkedList<>();
            }
            for(Runnable runnable : tmp){
                runnable.run();
            }
        }
    }

    private static LockedTaskQ sTaskQOnGameThread = new LockedTaskQ();
    private static LockedTaskQ sForegroundTaskQOnGameThread = new LockedTaskQ();
    /**
     * Battery receiver to getting battery level.
     */
    static class BatteryReceiver extends CommonEventSubscriber {
        public float sBatteryLevel = 0.0f;

        public BatteryReceiver(CommonEventSubscribeInfo subscribeInfo) {
            super(subscribeInfo);
        }

        @Override
        public void onReceiveEvent(CommonEventData commonEventData) {
            Intent intent = commonEventData.getIntent();
            if (intent != null) {
                int capacity = intent.getIntParam(BatteryInfo.OHOS_BATTERY_CAPACITY, 100);
                float level = capacity / 100.0f;
                sBatteryLevel = Math.min(Math.max(level, 0.0f), 1.0f);
            }

        }
    }

    static void registerBatteryLevelReceiver(Context context) {
        if (sBatteryReceiver.isPresent()) return;

        MatchingSkills ms = new MatchingSkills();
        ms.addEvent(CommonEventSupport.COMMON_EVENT_BATTERY_CHANGED);
        CommonEventSubscribeInfo subscribeInfo = new CommonEventSubscribeInfo(ms);
        sBatteryReceiver = Optional.of(new BatteryReceiver(subscribeInfo));
        try {
            CommonEventManager.subscribeCommonEvent(sBatteryReceiver.get());
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

    @SuppressWarnings("unused")
    static void unregisterBatteryLevelReceiver(Context context) {
        if (sBatteryReceiver.isPresent()) {
            try {
                CommonEventManager.unsubscribeCommonEvent(sBatteryReceiver.get());
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            sBatteryReceiver = Optional.empty();
        }
    }

    //Run on game thread forever, no matter foreground or background
    public static void runOnGameThread(final Runnable runnable) {
        sTaskQOnGameThread.addTask(runnable);
    }
    @SuppressWarnings("unused")
    static void flushTasksOnGameThread() {
        sTaskQOnGameThread.runTasks();
    }
    public static void runOnGameThreadAtForeground(final Runnable runnable) {
        sForegroundTaskQOnGameThread.addTask(runnable);
    }
    @SuppressWarnings("unused")
    static void flushTasksOnGameThreadAtForeground() {
        sForegroundTaskQOnGameThread.runTasks();
    }

    @SuppressWarnings("unused")
    public static int getNetworkType() {

        NetManager netManager = NetManager.getInstance(sAbilitySlice.getContext());
        if (!netManager.hasDefaultNet()) return NETWORK_TYPE_NONE;

        WifiDevice wifiDevice = WifiDevice.getInstance(sAbilitySlice.getContext());
        if (null == wifiDevice) return NETWORK_TYPE_NONE;

        if (wifiDevice.isWifiActive() && wifiDevice.isConnected()) {
            return NETWORK_TYPE_LAN;
        }
        return NETWORK_TYPE_WWAN;
    }

    // ===========================================================
    // Constructors
    // ===========================================================

    private static boolean sInited = false;

    public static void init(final AbilitySlice activity) {
        sAbilitySlice = activity;
        if (!sInited) {
            CocosHelper.sVibrateService = new VibratorAgent();
            CocosHelper.sUIThread = Thread.currentThread();
            sInited = true;
        }

    }

    @SuppressWarnings("unused")
    public static float getBatteryLevel() {
        return sBatteryReceiver.map(x -> x.sBatteryLevel).orElse(1.0f);
    }

    @SuppressWarnings("unused")
    public static String getObbFilePath() {
        return CocosHelper.sObbFilePath;
    }

    public static String getWritablePath() {
        return sAbilitySlice.getApplicationContext().getFilesDir().getAbsolutePath();
    }

    @SuppressWarnings("unused")
    public static String getCurrentLanguage() {
        return Locale.getDefault().getLanguage();
    }

    @SuppressWarnings("unused")
    public static String getCurrentLanguageCode() {
        return Locale.getDefault().toString();
    }

    @SuppressWarnings("unused")
    public static String getDeviceModel() {
        return DeviceInfo.getModel();
    }

    @SuppressWarnings("unused")
    public static String getSystemVersion() {
        return SystemVersion.getVersion();
    }

    @SuppressWarnings("unused")
    public static void vibrate(float durSec) {
        List<Integer> vlist = sVibrateService.getVibratorIdList();
        if (vlist.isEmpty()) return;
        int durationMs = (int) (1000 * durSec);
        int vibrateId = -1;
        for (Integer vId : vlist) {
            // TODO: choose preferred vibration effect
            if (sVibrateService.isEffectSupport(vId, VibrationPattern.VIBRATOR_TYPE_CAMERA_CLICK)) {
                vibrateId = vId;
                break;
            }
        }
        if (vibrateId < 0) {
            sVibrateService.startOnce(durationMs);
        } else {
            sVibrateService.startOnce(durationMs, vibrateId);
        }
    }

    @SuppressWarnings("unused")
    public static boolean openURL(String url) {
        runOnUIThread(new Runnable() {
            @Override
            public void run() {
                Intent i = new Intent();
                Operation operation = new Intent.OperationBuilder()
                        .withUri(Uri.parse(url))
                        .build();
                i.setOperation(operation);
                sAbilitySlice.startAbility(i);
            }
        });
        return true;
    }

    @SuppressWarnings("unused")
    public static void copyTextToClipboard(final String text) {
        runOnUIThread(new Runnable() {
            @Override
            public void run() {
                PasteData pasteData = PasteData.creatPlainTextData(text);
                SystemPasteboard.getSystemPasteboard(sAbilitySlice.getContext()).setPasteData(pasteData);
            }
        });
    }

    public static void runOnUIThread(final Runnable r, boolean forceDelay) {
        if (Thread.currentThread().getId() == sUIThread.getId() && !forceDelay) {
            r.run();
        } else {
            TaskDispatcher dispatcher = sAbilitySlice.getUITaskDispatcher();
            dispatcher.asyncDispatch(r);
        }
    }

    public static void runOnUIThread(final Runnable r) {
        runOnUIThread(r, false);
    }

    public static void ruOnUIThreadSync(final Runnable r) {
        CountDownLatch cd = new CountDownLatch(1);
        runOnUIThread(() -> {
            r.run();
            cd.countDown();
        });
        try {
            cd.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static int getDeviceRotation() {
        try {
            DisplayManager mgr = DisplayManager.getInstance();
            Optional<Display> display = mgr.getDefaultDisplay(sAbilitySlice.getContext());
            return display.map(Display::getRotation).orElse(0);
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
        // 0 indicates no rotation,
        // 1 indicates 90 degrees,
        // 2 indicates 180 degrees,
        // 3 indicates 270 degrees.
        return 0;
    }

    public static float[] getSafeArea() {
        return new float[]{0, 0, 0, 0};
    }

    @SuppressWarnings("unused")
    public static int getDPI() {
        Optional<Display> disp = DisplayManager.getInstance().getDefaultDisplay(getContext());
        if (disp.isPresent()) {
            return (int) disp.get().getAttributes().xDpi;
        }
        return -1;
    }

    public static Context getContext() {
        return sAbilitySlice.getContext();
    }

    public static File copyOutResFile(Context ctx, String path, String tmpName) throws IOException{
        File fontTmpFile;
        FileOutputStream fontOutputStream=null;
        Resource resource = null;
        if(!path.startsWith("resources/rawfile/")){
            path = "resources/rawfile/" + path;
        }
        RawFileEntry entry = ctx.getResourceManager().getRawFileEntry(path);
        try {
            fontTmpFile = File.createTempFile(tmpName, "-tmp");
            fontOutputStream = new FileOutputStream(fontTmpFile);
            resource = entry.openRawFile();
            byte[] buf = new byte[4096];
            while (resource.available() > 0) {
                int readBytes = resource.read(buf, 0, 4096);
                if (readBytes > 0)
                    fontOutputStream.write(buf, 0, readBytes);
            }
        } finally {
            if(fontOutputStream!=null)
                fontOutputStream.close();
            if(resource != null)
                resource.close();
        }
        return fontTmpFile;
    }

    public static File copyToTempFile(String path, String tmpName) throws IOException {
        File fontTmpFile;
        FileOutputStream fontOutputStream=null;
        FileInputStream fis = null;
        try {
            fontTmpFile = File.createTempFile(tmpName, "-tmp");
            fontOutputStream = new FileOutputStream(fontTmpFile);
            fis = new FileInputStream(path);
            byte[] buf = new byte[4096];
            while (fis.available() > 0) {
                int readBytes = fis.read(buf, 0, 4096);
                if (readBytes > 0)
                    fontOutputStream.write(buf, 0, readBytes);
            }
        } finally {
            if(fontOutputStream!=null)
                fontOutputStream.close();
            if(fis != null)
                fis.close();
        }
        return fontTmpFile;
    }
}
