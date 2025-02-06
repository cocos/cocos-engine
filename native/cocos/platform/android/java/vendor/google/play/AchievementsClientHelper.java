/****************************************************************************
 Copyright (c) 2024 Xiamen Yaji Software Co., Ltd.

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

package google.play;

import static androidx.core.app.ActivityCompat.startActivityForResult;

import android.content.Intent;
import android.util.Log;

import androidx.annotation.IntRange;
import androidx.annotation.NonNull;

import com.cocos.lib.GlobalObject;
import com.google.android.gms.games.AchievementsClient;
import com.google.android.gms.games.AnnotatedData;
import com.google.android.gms.games.AuthenticationResult;
import com.google.android.gms.games.GamesSignInClient;
import com.google.android.gms.games.PlayGames;
import com.google.android.gms.games.achievement.AchievementBuffer;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.core.app.ActivityCompat;

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
    public static int incrementImmediate(@NonNull String var1, @IntRange(from = 0L) int var2) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        Task<Boolean> task = achievementsClient.incrementImmediate(var1, var2);
        return TaskManager.putTask(task);
    }

    public static int load(boolean var1) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        Task<AnnotatedData<AchievementBuffer>> task = achievementsClient.load(var1);
        return TaskManager.putTask(task);
    }
    public static int revealImmediate(@NonNull String var1) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        Task<Void> task = achievementsClient.revealImmediate(var1);
        return TaskManager.putTask(task);
    }

    public static int setStepsImmediate(@NonNull String var1, @IntRange(from = 0L) int var2) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        Task<Boolean> task = achievementsClient.setStepsImmediate(var1, var2);
        return TaskManager.putTask(task);
    }

    public static int unlockImmediate(@NonNull String var1) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        Task<Void> task = achievementsClient.unlockImmediate(var1);
        return TaskManager.putTask(task);
    }

    public static void increment(@NonNull String var1, @IntRange(from = 0L) int var2) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        achievementsClient.increment(var1, var2);
    }

    public static void reveal(@NonNull String var1) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        achievementsClient.reveal(var1);
    }

    public static void setSteps(@NonNull String var1, @IntRange(from = 0L) int var2) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        achievementsClient.setSteps(var1, var2);
    }

    public static void unlock(@NonNull String var1) {
        AchievementsClient achievementsClient = PlayGames.getAchievementsClient(GlobalObject.getActivity());
        achievementsClient.unlock(var1);
    }
}
