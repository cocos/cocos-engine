/* eslint-disable @typescript-eslint/no-namespace */
/*
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
import { JSB } from 'internal:constants';
import './billing/billing-enum';
import './play/play-enum';

import { AchievementsClientHelper, GamesSignInClientHelper, RecallClientHelper, PlayGamesHelper } from './play/games';

const ns: any = globalThis.jsb ?? {};
export namespace google {
    export namespace billing {
        export const BillingClient = ns.BillingClient;
        export const BillingResult = ns.BillingResult;
        export const InAppMessageResult = ns.InAppMessageResult;
        export const ProductDetails = ns.ProductDetails;
        export const Purchase = ns.Purchase;
        export const PendingPurchasesParams = ns.PendingPurchasesParams;
        export const QueryProductDetailsParams = ns.QueryProductDetailsParams;
        export const BillingFlowParams = ns.BillingFlowParams;
        export const ConsumeParams = ns.ConsumeParams;
        export const AcknowledgePurchaseParams = ns.AcknowledgePurchaseParams;
        export const QueryPurchasesParams = ns.QueryPurchasesParams;
        export const GetBillingConfigParams = ns.GetBillingConfigParams;
        export const InAppMessageParams = ns.InAppMessageParams;
    }
    export namespace play {
        export const PlayGamesSdk = ns.PlayGamesSdk;
        export const PlayGames = PlayGamesHelper;
        export const GamesSignInClient = GamesSignInClientHelper;
        export const AchievementsClient = AchievementsClientHelper;
        export const RecallClient = RecallClientHelper;
        export const AuthenticationResult = ns.AuthenticationResult;
        export const RecallAccess = ns.RecallAccess;
        export const PlayException = ns.PlayException;
        export const AnnotatedData = ns.AnnotatedData;
        export const AchievementBuffer = ns.AchievementBuffer;
        export const Achievement = ns.Achievement;
    }
}
