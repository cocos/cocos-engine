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

import androidx.annotation.NonNull;

import com.cocos.lib.GlobalObject;
import com.google.android.gms.games.AuthenticationResult;
import com.google.android.gms.games.GamesSignInClient;
import com.google.android.gms.games.PlayGames;
import com.google.android.gms.tasks.Task;

public final class GamesSignInClientHelper {
    public static int isAuthenticated() {
        GamesSignInClient gamesSignInClient = PlayGames.getGamesSignInClient(GlobalObject.getActivity());
        Task<AuthenticationResult> task = gamesSignInClient.isAuthenticated();
        return TaskManager.putTask(task);
    }

    public static int requestServerSideAccess(@NonNull String serverClientId, boolean forceRefreshToken) {
        GamesSignInClient gamesSignInClient = PlayGames.getGamesSignInClient(GlobalObject.getActivity());
        Task<String> task = gamesSignInClient.requestServerSideAccess(serverClientId, forceRefreshToken);
        return TaskManager.putTask(task);
    }

    public static int signIn() {
        GamesSignInClient gamesSignInClient = PlayGames.getGamesSignInClient(GlobalObject.getActivity());
        Task<AuthenticationResult> task = gamesSignInClient.signIn();
        return TaskManager.putTask(task);
    }
}
