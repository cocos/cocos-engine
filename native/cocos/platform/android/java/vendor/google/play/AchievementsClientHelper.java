/****************************************************************************
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

https://www.cocos.com/

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

package google.play;

import static androidx.core.app.ActivityCompat.startActivityForResult;

import android.content.Intent;
import androidx.annotation.IntRange;
import androidx.annotation.NonNull;

import com.cocos.lib.GlobalObject;
import com.google.android.gms.games.AchievementsClient;
import com.google.android.gms.games.AnnotatedData;
import com.google.android.gms.games.PlayGames;
import com.google.android.gms.games.achievement.AchievementBuffer;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

public final class AchievementsClientHelper {
    public static void showAchievements() {
        GlobalObject.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                PlayGames.getAchievementsClient(GlobalObject.getActivity())
                    .getAchievementsIntent()
                    .addOnSuccessListener(new OnSuccessListener<Intent>() {
                        @Override
                        public void onSuccess(Intent intent) {
                            GlobalObject.getActivity().startActivityForResult(intent, 100);
                        }
                    });
            }
        });
    }
    public static int incrementImmediate(@NonNull String id, @IntRange(from = 0L) int numSteps) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        Task<Boolean> task = achievementsClient.incrementImmediate(id, numSteps);
        return TaskManager.putTask(task);
    }

    public static int load(boolean forceReload) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        Task<AnnotatedData<AchievementBuffer>> task = achievementsClient.load(forceReload);
        return TaskManager.putTask(task);
    }
    public static int revealImmediate(@NonNull String id) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        Task<Void> task = achievementsClient.revealImmediate(id);
        return TaskManager.putTask(task);
    }

    public static int setStepsImmediate(@NonNull String id, @IntRange(from = 0L) int numSteps) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        Task<Boolean> task = achievementsClient.setStepsImmediate(id, numSteps);
        return TaskManager.putTask(task);
    }

    public static int unlockImmediate(@NonNull String id) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        Task<Void> task = achievementsClient.unlockImmediate(id);
        return TaskManager.putTask(task);
    }

    public static void increment(@NonNull String id, @IntRange(from = 0L) int numSteps) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        achievementsClient.increment(id, numSteps);
    }

    public static void reveal(@NonNull String id) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        achievementsClient.reveal(id);
    }

    public static void setSteps(@NonNull String id, @IntRange(from = 0L) int numSteps) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        achievementsClient.setSteps(id, numSteps);
    }

    public static void unlock(@NonNull String id) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        achievementsClient.unlock(id);
    }
}
