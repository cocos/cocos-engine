/* eslint-disable @typescript-eslint/no-namespace */
/*
 Copyright (c) 2024-2025 Xiamen Yaji Software Co., Ltd.

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

import './billing/billing-enum';
import './play/play-enum';

import { TaskHelper, ContinuationHelper } from './play/task';

export declare namespace google {
    export namespace billing {
        export namespace UserChoiceDetails {
            export interface Product {
                /**
                 * @en Hash code
                 * @zh hash 值
                 */
                hashCode(): number;
                /**
                 * @en Returns the id of the product being purchased.
                 * @zh 返回所购买产品的 ID。
                 */
                getId(): string;
                /**
                 * @en Returns the offer token that was passed in launchBillingFlow to purchase the product.
                 * @zh 返回在 launchBillingFlow 中传递的用于购买产品的优惠令牌。
                 */
                getOfferToken(): string;
                /**
                 * @en Returns the ProductType of the product being purchased.
                 * @zh 返回所购买产品的类型（ProductType）。
                 */
                getType(): string;
                /**
                 * @en To string
                 * @zh 转换成字符串。
                 */
                toString(): string;
                /**
                 * @en Is it equal to another UserChoiceDetails.Product.
                 * @zh 判断与另一个 UserChoiceDetails.Product 是否相等。
                 */
                equals(product: Product): boolean;
            }
        }
        export class UserChoiceDetails {
            /**
             * @en Returns a token that represents the user's prospective purchase via user choice alternative billing.
             * @zh 返回一个令牌，该令牌代表用户通过用户选择的替代 Billing 方式进行的潜在购买。
             */
            getExternalTransactionToken(): string;
            /**
             * @en Returns the external transaction Id of the originating subscription, if the purchase is a subscription upgrade/downgrade.
             * @zh 如果购买的是订阅升级/降级，则返回原始订阅的外部交易 ID。
             */
            getOriginalExternalTransactionId(): string;
            /**
             * @en Returns a list of Product to be purchased in the user choice alternative billing flow.
             * @zh Product 返回用户选择替代 Billing 流程中要购买的商品列表。
             */
            getProducts(): UserChoiceDetails.Product[];
        }

        /**
         * @en Represents the offer details to buy an one-time purchase product.
         * @zh 代表一次性购买产品的报价详情。
         */
        export interface OneTimePurchaseOfferDetails {
            /**
             * @en The price for the payment in micro-units, where 1,000,000 micro-units equal one unit of the currency.
             * @zh 以微单位返回支付价格，其中 1,000,000 个微单位等于 1 个货币单位。
             */
            getPriceAmountMicros(): number;
            /**
             * @en Formatted price for the payment, including its currency sign.
             * @zh 支付的格式化价格，包括其货币单位。
             */
            getFormattedPrice(): string;
            /**
             * @en ISO 4217 currency code for price.
             * @zh 价格的 ISO 4217 货币代码。
             */
            getPriceCurrencyCode(): string;
        }

        /**
         * @en Represents additional details of an installment subscription plan.
         * @zh 表示分期付款订阅计划的附加详细信息。
         */
        export interface InstallmentPlanDetails {
            /**
             * @en Committed payments count after a user signs up for this subscription plan.
             * @zh 用户注册此订阅计划后承诺的付款数量。
             */
            getInstallmentPlanCommitmentPaymentsCount(): number;
            /**
             * @en Subsequent committed payments count after this subscription plan renews.
             * @zh 此订阅计划续订后的后续承诺付款数量。
             */
            getSubsequentInstallmentPlanCommitmentPaymentsCount(): number;
        }

        /**
         * @en Represents a pricing phase, describing how a user pays at a point in time.
         * @zh 表示定价阶段，描述用户在某个时间点如何付款。
         */
        export interface PricingPhase {
            /**
             * @en Number of cycles for which the billing period is applied.
             * @zh Billing 周期适用的周期数。
             */
            getBillingCycleCount(): number;
            /**
             * @en The price for the payment cycle in micro-units, where 1,000,000 micro-units equal one unit of the currency.
             * @zh 微单位付款周期的价格，其中 1,000,000 个微单位等于 1 个货币单位。
             */
            getPriceAmountMicros(): number;
            /**
             * @en RecurrenceMode for the pricing phase.
             * @zh 定价阶段的 RecurrenceMode 。
             */
            getRecurrenceMode(): number;
            /**
             * @en Billing period for which the given price applies, specified in ISO 8601 format.
             * @zh 给定价格适用的 billing 期，以 ISO 8601 格式指定。
             */
            getBillingPeriod(): string;
            /**
             * @en Formatted price for the payment cycle, including its currency sign.
             * @zh 付款周期的格式化价格，包括其货币符号。
             */
            getFormattedPrice(): string;
            /**
             * @en Returns ISO 4217 currency code for price.
             * @zh 返回价格的 ISO 4217 货币代码。
             */
            getPriceCurrencyCode(): string;
        }

        /**
         * @en Represents a pricing phase, describing how a user pays at a point in time.
         * @zh 表示定价阶段，描述用户在某个时间点如何付款。
         */
        export interface PricingPhases {
            /**
             * @en Returns ISO 4217 currency code for price.
             * @zh 返回价格的 ISO 4217 货币代码。
             */
            getPricingPhaseList(): PricingPhase[];
        }

        /**
         * @en Represents the available purchase plans to buy a subscription product.
         * @zh 代表一次性购买产品的报价详情。
         */
        export interface SubscriptionOfferDetails {
            /**
             * @en The base plan id associated with the subscription product.
             * @zh 与订阅产品相关的基本计划 ID。
             */
            getBasePlanId(): string;
            /**
            * @en The offer id associated with the subscription product.
            * @zh 与订阅产品相关的优惠 ID。
            */
            getOfferId(): string;
            /**
            * @en The offer tags associated with this Subscription Offer.
            * @zh 与此订阅优惠相关的优惠标签。
            */
            getOfferTags(): string[];
            /**
            * @en The offer token required to pass in launchBillingFlow to purchase the subscription product with these pricing phases.
            * @zh 在 launchBillingFlow 中传递以使用这些定价阶段购买订阅产品所需的优惠令牌。
            */
            getOfferToken(): string;
            /**
             * @en The pricing phases for the subscription product.
             * @zh 订阅产品的定价区间。
             */
            getPricingPhases(): PricingPhases;
            /**
            * @en The additional details of an installment plan.
            * @zh 分期付款计划的附加详细信息。
            */
            getInstallmentPlanDetails(): InstallmentPlanDetails;
        }

        export namespace ProductDetails {
            export type RecurrenceMode = google.billing.RecurrenceMode;
            export type OneTimePurchaseOfferDetails = google.billing.OneTimePurchaseOfferDetails;
            export type InstallmentPlanDetails = google.billing.InstallmentPlanDetails;
            export type PricingPhase = google.billing.PricingPhase;
            export type PricingPhases = google.billing.PricingPhases;
            export type SubscriptionOfferDetails = google.billing.SubscriptionOfferDetails;
        }

        /**
         * @en Represents the details of a one time or subscription product.
         * @zh 代表一次性或订阅产品的详细信息。
         */
        export class ProductDetails {
            static RecurrenceMode: typeof google.billing.RecurrenceMode;
            /**
             * @en Is it equal to another product detail.
             * @zh 判断与另一个产品详情是否相等。
             */
            equals(other: ProductDetails): boolean;
            /**
             * @en Hash code
             * @zh hash 值
             */
            hashCode(): number;
            /**
             * @en The description of the product.
             * @zh 产品的描述。
             */
            getDescription(): string;
            /**
             * @en The name of the product being sold.
             * @zh 所售产品的名称。
             */
            getName(): string;
            /**
             * @en The product's Id.
             * @zh 产品的 Id。
             */
            getProductId(): string;
            /**
             * @en The ProductType of the product.
             * @zh 产品的类型（ProductType）。
             */
            getProductType(): string;
            /**
             * @en The title of the product being sold.
             * @zh 所售产品的标题。
             */
            getTitle(): string;
            /**
             * @en To string
             * @zh 转换成字符串。
             */
            toString(): string;
            /**
             * @en The offer details of an one-time purchase product.
             * @zh 代表一次性购买产品的报价详情。
             */
            getOneTimePurchaseOfferDetails(): OneTimePurchaseOfferDetails;
            /**
             * @en A list containing all available offers to purchase a subscription product.
             * @zh 返回包含购买订阅产品的所有可用优惠的列表。
             */
            getSubscriptionOfferDetails(): SubscriptionOfferDetails[];
        }

        /**
         * @en Account identifiers that were specified when the purchase was made.
         * @zh 购买时指定的帐户标识符。
         */
        export interface AccountIdentifiers {
            /**
             * @en The obfuscated account id specified in setObfuscatedAccountId.
             * @zh 在 setObfuscatedAccountId 中设置的混淆账户id
             */
            getObfuscatedAccountId(): string;
            /**
             * @en The obfuscated profile id specified in setObfuscatedProfileId.
             * @zh 在 setObfuscatedProfileId 中设置的混淆profile id
             */
            getObfuscatedProfileId(): string;
        }

        /**
         * @en Represents a pending change/update to the existing purchase.
         * @zh 表示对现有购买的待定更改/更新。
         */
        export interface PendingPurchaseUpdate {
            /**
             * @en A token that uniquely identifies this pending transaction.
             * @zh 唯一标识此待处理交易的令牌。
             */
            getPurchaseToken(): string;
            /**
             * @en The product ids.
             * @zh 产品 ids。
             */
            getProducts(): string[];
        }

        /**
         * @en
         * Possible purchase states.
         *
         * @zh
         * 可能的购买状态。
         */
        export enum PurchaseState {
            /**
             * @en
             * Purchase is pending and not yet completed to be processed by your app.
             *
             * @zh
             * 购买处于待处理状态且尚未完成，无法由您的应用程序处理。
             */
            PENDING = 2,
            /**
             * @en
             * Purchase is completed..
             *
             * @zh
             * 购买完成。
             */
            PURCHASED = 1,
            /**
             * @en
             * Purchase with unknown state.
             *
             * @zh
             * 未知状态
             */
            UNSPECIFIED_STATE = 0,
        }
        export namespace Purchase {
            export type PurchaseState = google.billing.PurchaseState;
        }
        /**
         * @en Represents an in-app billing purchase.
         * @zh 代表应用内 billing 购买。
         */
        export class Purchase {
            static PurchaseState: typeof google.billing.PurchaseState;
            /**
             * @en One of PurchaseState indicating the state of the purchase.
             * @zh PurchaseState表示购买状态的其中一个值。
             */
            getPurchaseState(): number;
            /**
             * @en The time the product was purchased, in milliseconds since the epoch (Jan 1, 1970).
             * @zh 产品购买的时间，以纪元（1970 年 1 月 1 日）以来的毫秒数表示。
             */
            getPurchaseTime(): number;
            /**
             * @en Indicates whether the purchase has been acknowledged.
             * @zh 表示是否已确认购买。
             */
            isAcknowledged(): number;
            /**
             * @en Indicates whether the subscription renews automatically.
             * @zh 指示订阅是否自动续订。
             */
            isAutoRenewing(): number;
            /**
             * @en Hash code
             * @zh hash 值
             */
            hashCode(): number;

            /**
             * @en The quantity of the purchased product.
             * @zh 购买产品的数量。
             */
            getQuantity(): number;
            /**
             * @en The payload specified when the purchase was acknowledged or consumed.
             * @zh 确认或消费购买时指定的有效负载。
             */
            getDeveloperPayload(): string;
            /**
             * @en Returns a unique order identifier for the transaction.
             * @zh 交易的唯一订单标识符。
             */
            getOrderId(): string;
            /**
             * @en Returns a String in JSON format that contains details about the purchase order.
             * @zh 包含有关采购订单详细信息的 JSON 格式的字符串。
             */
            getOriginalJson(): string;
            /**
             * @en The application package from which the purchase originated.
             * @zh 购买来源的应用程序包。
             */
            getPackageName(): string;
            /**
             * @en A token that uniquely identifies a purchase for a given item and user pair.
             * @zh 唯一标识给定商品和用户对的购买的令牌。
             */
            getPurchaseToken(): string;
            /**
             * @en String containing the signature of the purchase data that was signed with the private key of the developer.
             * @zh 包含使用开发者私钥签名的购买数据签名的字符串。
             */
            getSignature(): string;
            /**
             * @en To string
             * @zh 转换成字符串。
             */
            toString(): string;

            /**
             * @en Returns account identifiers that were provided when the purchase was made.
             * @zh 返回购买时提供的帐户标识符。
             */
            getAccountIdentifiers(): AccountIdentifiers;
            /**
             * @en The PendingPurchaseUpdate for an uncommitted transaction.
             * @zh 返回 PendingPurchaseUpdate 未提交的事务。
             */
            getPendingPurchaseUpdate(): PendingPurchaseUpdate;
            /**
             * @en the product Ids.
             * @zh 产品 Ids。
             */
            getProducts(): string[];
        }

        /**
         * @en BillingConfig stores configuration used to perform billing operations.
         * @zh BillingConfig 存储用于执行 Billing 操作的配置。
         */
        export interface BillingConfig {
            /**
             * @en The customer's country code.
             * @zh 客户的国家代码。
             */
            getCountryCode(): string;
        }

        /**
         * @en The details used to report transactions made via alternative billing without user choice to use Google Play Billing.
         * @zh 用于报告用户未选择使用 Google Play Billing 方式而通过替代 Billing 方式进行的交易的详细信息。
         */
        export interface AlternativeBillingOnlyReportingDetails {
            /**
             * @en An external transaction token that can be used to report a transaction made via alternative billing
             *     without user choice to use Google Play billing.
             * @zh 返回一个外部交易令牌，该令牌可用于报告通过替代付款方式进行的交易，而无需用户选择使用 Google Play 付款方式。
             */
            getExternalTransactionToken(): string;
        }

        /**
         * @en The details used to report transactions made via external offer.
         * @zh 用于报告通过外部报价进行的交易的详细信息。
         */
        export interface ExternalOfferReportingDetails {
            /**
             * @en An external transaction token that can be used to report a transaction made via external offer.
             * @zh 可用于报告通过外部报价进行的交易的外部交易令牌。
             */
            getExternalTransactionToken(): string;
        }

        export namespace InAppMessageResult {
            export type InAppMessageResponseCode = google.billing.InAppMessageResponseCode;
        }
        /**
         * @en Results related to in-app messaging.
         * @zh 与应用程序内消息相关的结果。
         */
        export class InAppMessageResult {
            static InAppMessageResponseCode: typeof InAppMessageResponseCode;
            /**
             * @en Response code for the in-app messaging API call.
             * @zh 应用内消息传递 API 调用的响应代码。
             */
            getResponseCode(): number;
            /**
             * @en Token that identifies the purchase to be acknowledged, if any.
             * @zh 返回标识需要确认的购买的令牌。
             */
            getPurchaseToken(): string;
        }

        export namespace BillingResult {
            export interface Builder {
                /**
                 * @en Setting up debugging information for the in-app Billing API.
                 * @zh 设置应用内 Billing API 的调试信息。
                 */
                setDebugMessage(productType: string): Builder;
                /**
                 * @en Setting the response code for the in-app in-app Billing API.
                 * @zh 设置应用内 Billing API 的响应代码。
                 */
                setResponseCode(productType: number): Builder;
                /**
                 * @en Returns BillingResult reference.
                 * @zh 返回 BillingResult 的引用。
                 */
                build(): BillingResult;
            }
        }

        /**
         * @en Params containing the response code and the debug message from In-app Billing API response.
         * @zh 参数包含来自应用内 Billing API 响应的响应代码和调试消息。
         */
        export class BillingResult {
            private constructor();
            static Builder: BillingResult.Builder;
            /**
             * @en Response code returned in In-app Billing API calls.
             * @zh 应用内 Billing API 调用中返回的响应代码。
             */
            getResponseCode(): number;
            /**
             * @en Debug message returned in In-app Billing API calls.
             * @zh 应用内 Billing API 调用中返回的调试消息。
             */
            getDebugMessage(): string;
            /**
             * @en To string
             * @zh 转换成字符串。
             */
            toString(): string;
            /**
             * @en Constructs a new BillingResult.Builder instance.
             * @zh 构造一个新 BillingResult.Builder 实例。
             */
            public static newBuilder(): BillingResult.Builder;
        }

        /**
         * @en Listener interface for the developer-managed alternative billing flow, when it is chosen by the user when initiating a purchase.
         * @zh 当用户在发起购买时选择由开发人员管理的替代 Billing 流程的监听器接口。
         */
        export interface UserChoiceBillingListener {
            /**
             * @en Called when a user has selected to make a purchase using user choice billing.
             * @zh 当用户选择使用用户选择 Billing 进行购买时调用。
             */
            userSelectedAlternativeBilling(userChoiceDetails: UserChoiceDetails): void;
        }

        /**
         * @en Listener interface for purchase updates which happen when, for example, the user buys
         *     something within the app or by initiating a purchase from Google Play Store.
         * @zh 用于购买更新的监听器接口，例如，当用户在应用程序内购买某物或从 Google Play 商店发起购买时发生。
         */
        export interface PurchasesUpdatedListener {
            /**
             * @en Implement this method to get notifications for purchases updates.
             * @zh 实现此方法以获取购买更新的通知。
             */
            onPurchasesUpdated(billingResult: BillingResult, purchases: Purchase[]): void;
        }

        /**
         * @en Callback for setup process. This listener's onBillingSetupFinished method is called when the setup process is complete.
         * @zh 设置过程的回调。 onBillingSetupFinished 设置过程完成后，会调用此监听器的方法。
         */
        export interface BillingClientStateListener {
            /**
             * @en Called to notify that the connection to the billing service was lost.
             * @zh 调用来通知与 biiling 服务的连接已丢失。
             */
            onBillingServiceDisconnected(): void;
            /**
             * @en Called to notify that setup is complete.
             * @zh 调用来通知设置已完成。
             */
            onBillingSetupFinished(
                billingResult: BillingResult,
            ): void;
        }

        export namespace PendingPurchasesParams {
            export interface Builder {
                /**
                 * @en Enables pending purchase for one-time products.
                 * @zh 启用一次性产品的待处理购买。
                 */
                enableOneTimeProducts: () => Builder;
                /**
                 * @en Enables pending purchase for prepaid plans.
                 * @zh 启用预付费计划的待处理购买。
                 */
                enablePrepaidPlans: () => Builder;
                /**
                 * @en Returns PendingPurchasesParams reference to enable pending purchases.
                 * @zh 返回 PendingPurchasesParams 参考以启用待处理的购买。
                 */
                build: () => PendingPurchasesParams;
            }
        }

        /**
         * @en Parameters to enable pending purchases.
         * @zh 启用待处理购买的参数。
         */
        export class PendingPurchasesParams {
            private constructor();
            /**
             * @en Returns an instance of Builder.
             * @zh 返回 的一个 Builder 实例。
             */
            public static newBuilder(): google.billing.PendingPurchasesParams.Builder;
        }

        export class QueryProductDetailsParamsProduct {
            private constructor();
            /**
             * @en Returns an instance of Builder.
             * @zh 返回 的一个 Builder 实例。
             */
            public static newBuilder(): QueryProductDetailsParams.Product.Builder;
        }
        export namespace QueryProductDetailsParams {
            export interface Builder {
                /**
                 * @en Set the list of Product.
                 * @zh 设置列表 Product 。
                 */
                setProductList: (products: QueryProductDetailsParamsProduct[]) => QueryProductDetailsParams.Builder;
                /**
                 * @en Returns an instance of QueryProductDetailsParams.
                 * @zh 返回一个 QueryProductDetailsParams 实例。
                 */
                build: () => QueryProductDetailsParams;
            }
            /**
             * @en A Product identifier used for querying product details.
             * @zh 用于查询产品详细信息的产品标识符。
             */
            export namespace Product {
                export interface Builder {
                    /**
                     * @en Sets the product id of the product.
                     * @zh 设置产品的产品 id 。
                     */
                    setProductId: (productID: string) => Builder;
                    /**
                     * @en Sets the ProductType of the product.
                     * @zh 设置 ProductType 产品的。
                     */
                    setProductType: (productType: string) => Builder;
                    /**
                     * @en Returns the Product instance.
                     * @zh 返回 Product 实例。
                     */
                    build: () => QueryProductDetailsParamsProduct;
                }
            }
            export type Product = google.billing.QueryProductDetailsParamsProduct;
        }
        /**
         * @en Parameters to initiate a query for Product details queryProductDetailsAsync.
         * @zh 用于启动产品详细信息查询的参数 queryProductDetailsAsync。
         */
        export class QueryProductDetailsParams {
            static Product: typeof google.billing.QueryProductDetailsParamsProduct;
            private constructor();
            /**
             * @en Returns an instance of Builder.
             * @zh 返回一个 Builder 实例。
             */
            public static newBuilder(): QueryProductDetailsParams.Builder;
        }

        /**
         * @en Listener to a result of product details query.
         * @zh 监听产品详细信息查询的结果。
         */
        export interface ProductDetailsResponseListener {
            /**
             * @en Called to notify that query product details operation has finished.
             * @zh 调用以通知查询产品详细信息操作已完成。
             */
            onProductDetailsResponse(billingResult: BillingResult, productDetailsList: ProductDetails[]): void;
        }

        /**
         * @en Callback that notifies when a consumption operation finishes.
         * @zh 当消费操作完成时通知的回调。
         */
        export interface ConsumeResponseListener {
            /**
             * @en Called to notify that a consume operation has finished.
             * @zh 调用以通知消费操作已完成。
             */
            onConsumeResponse(billingResult: BillingResult, token: string): void
        }

        /**
         * @en Listener for the result of an acknowledge purchase request.
         * @zh 监听确认购买请求的结果。
         */
        export interface AcknowledgePurchaseResponseListener {
            /**
             * @en Called to notify that an acknowledge purchase operation has finished.
             * @zh 调用以通知确认购买操作已完成。
             */
            onAcknowledgePurchaseResponse(
                billingResult: BillingResult
            ): void
        }

        export interface BillingClientBuilder {
            enableAlternativeBillingOnly: () => BillingClientBuilder;
            enableExternalOffer: () => BillingClientBuilder;
            enablePendingPurchases: (params: PendingPurchasesParams) => BillingClientBuilder;
            enableUserChoiceBilling: (userChoiceBillingListener: UserChoiceBillingListener) => BillingClientBuilder;
            setListener: (listener: PurchasesUpdatedListener) => BillingClientBuilder;
            build: () => BillingClient;
        }

        /**
         * @en Listener to a result of purchases query.
         * @zh 监听购买查询的结果。
         */
        export interface PurchasesResponseListener {
            /**
             * @en Called to notify that the query purchases operation has finished.
             * @zh 调用以通知查询购买操作已完成。
             */
            onQueryPurchasesResponse(
                billingResult: BillingResult,
                purchase: Purchase[]
            ): void
        }

        /**
         * @en Listener for the result of the BillingClient#getBillingConfigAsync API.
         * @zh 监听 BillingClient#getBillingConfigAsync API 的返回结果。
         */
        export interface BillingConfigResponseListener {
            /**
             * @en Called to notify when the get billing config flow has finished.
             * @zh 当获取 billing 配置流程完成时调用以通知。
             */
            onBillingConfigResponse(
                billingResult: BillingResult,
                billingConfig: BillingConfig
            ): void
        }
        /**
         * @en Listener for the result of the createAlternativeBillingOnlyReportingDetailsAsync API.
         * @zh 监听 createAlternativeBillingOnlyReportingDetailsAsync API 的返回结果。
         */
        export interface AlternativeBillingOnlyReportingDetailsListener {
            /**
             * @en Called to receive the results from createAlternativeBillingOnlyReportingDetailsAsync when it is finished.
             * @zh createAlternativeBillingOnlyReportingDetailsAsync 当其完成时调用来接收结果。
             */
            onAlternativeBillingOnlyTokenResponse(
                billingResult: BillingResult,
                alternativeBillingOnlyReportingDetails: AlternativeBillingOnlyReportingDetails
            ): void
        }
        /**
         * @en Listener for the result of the BillingClient#createExternalOfferReportingDetailsAsync API.
         * @zh 监听 BillingClient#createExternalOfferReportingDetailsAsync API 的返回结果。
         */
        export interface ExternalOfferReportingDetailsListener {
            /**
             * @en Called to receive the results from createExternalOfferReportingDetailsAsync when it is finished.
             * @zh createExternalOfferReportingDetailsAsync 当其完成时调用来接收结果。
             */
            onExternalOfferReportingDetailsResponse(
                billingResult: BillingResult,
                externalOfferReportingDetails: ExternalOfferReportingDetails
            ): void
        }

        /**
         * @en Listener for the result of the BillingClient#isAlternativeBillingOnlyAvailableAsync API.
         * @zh 监听 BillingClient#isAlternativeBillingOnlyAvailableAsync API 的返回结果。
         */
        export interface AlternativeBillingOnlyAvailabilityListener {
            /**
             * @en Called to receive the results from BillingClient#isAlternativeBillingOnlyAvailableAsync when it is finished.
             * @zh BillingClient#isAlternativeBillingOnlyAvailableAsync 当其完成时调用来接收结果。
             */
            onAlternativeBillingOnlyAvailabilityResponse(
                billingResult: BillingResult
            ): void
        }
        /**
         * @en Listener for the result of the BillingClient#isExternalOfferAvailableAsync API.
         * @zh 监听 BillingClient#isExternalOfferAvailableAsync API 的返回结果。
         */
        export interface ExternalOfferAvailabilityListener {
            /**
             * @en Called to receive the results from BillingClient#isExternalOfferAvailableAsync when it is finished.
             * @zh BillingClient#isExternalOfferAvailableAsync 当其完成时调用来接收结果。
             */
            onExternalOfferAvailabilityResponse(
                billingResult: BillingResult
            ): void
        }
        /**
         * @en Listener for the result of the BillingClient#showAlternativeBillingOnlyInformationDialog API.
         * @zh 监听 BillingClient#showAlternativeBillingOnlyInformationDialog API 的返回结果。
         */
        export interface AlternativeBillingOnlyInformationDialogListener {
            /**
             * @en Called to notify that the alternative billing only dialog flow is finished.
             * @zh 调用此命令来通知仅备选 billing 对话流程已完成。
             */
            onAlternativeBillingOnlyInformationDialogResponse(
                billingResult: BillingResult
            ): void
        }
        /**
         * @en Listener for the result of the BillingClient#showExternalOfferInformationDialog API.
         * @zh 监听 BillingClient#showExternalOfferInformationDialog API 的返回结果。
         */
        export interface ExternalOfferInformationDialogListener {
            /**
             * @en Called to notify that the external offer information dialog flow is finished.
             * @zh 调用以通知外部报价信息对话流程已完成。
             */
            onExternalOfferInformationDialogResponse(
                billingResult: BillingResult
            ): void
        }

        /**
         * @en Listener for the result of the in-app messaging flow.
         * @zh 应用内消息流结果的监听器。
         */
        export interface InAppMessageResponseListener {
            /**
             * @en Called to notify when the in-app messaging flow has finished.
             * @zh 当应用内消息传递流程完成时调用以通知。
             */
            onInAppMessageResponse(
                inAppMessageResult: InAppMessageResult
            ): void
        }

        /**
         * @en
         * Connection state of billing client.
         *
         * @zh
         * Billing client的连接状态
         */
        export enum ConnectionState {
            /**
             * @en
             * This client was not yet connected to billing service or was already closed.
             *
             * @zh
             * 此客户端尚未连接到Billing服务或已关闭。
             */
            DISCONNECTED = 0,
            /**
             * @en
             * This client is currently in process of connecting to billing service.
             *
             * @zh
             * 此客户端目前正在连接到Billing服务。
             */
            CONNECTING = 1,
            /**
             * @en
             * This client is currently connected to billing service.
             *
             * @zh
             * 此客户端当前已连接到Billing服务。
             */
            CONNECTED = 2,
            /**
             * @en
             * This client was already closed and shouldn't be used again.
             *
             * @zh
             * 该客户端已关闭，不应再次使用。
             */
            CLOSED = 3,
        }
        /**
         * @en
         * Possible response codes.
         *
         * @zh
         * 可能的响应代码。
         */
        export enum BillingResponseCode {
            /**
             * @en
             * This field is deprecated.
             * See SERVICE_UNAVAILABLE which will be used instead of this code.
             *
             * @zh
             * 这个字段已经废弃。
             * 看看SERVICE_UNAVAILABLE将使用哪一个来代替此代码。
             */
            SERVICE_TIMEOUT = -3,
            /**
             * @en
             * The requested feature is not supported by the Play Store on the current device.
             *
             * @zh
             * 当前设备上的 Play Store 不支持所请求的功能。
             */
            FEATURE_NOT_SUPPORTED = -2,
            /**
             * @en
             * The app is not connected to the Play Store service via the Google Play Billing Library.
             *
             * @zh
             * 该应用未通过 Google Play Billing库连接到 Play Store 服务。
             */
            SERVICE_DISCONNECTED = -1,
            /**
             * @en
             * Success.
             *
             * @zh
             * 成功。
             */
            OK = 0,
            /**
             * @en
             * Transaction was canceled by the user.
             *
             * @zh
             * 交易已被用户取消。
             */
            USER_CANCELED = 1,
            /**
             * @en
             * The service is currently unavailable.
             *
             * @zh
             * 当前设备上的 Play Store 不支持所请求的功能。
             */
            SERVICE_UNAVAILABLE = 2,
            /**
             * @en
             * A user billing error occurred during processing.
             *
             * @zh
             * 处理过程中出现用户billing错误。
             */
            BILLING_UNAVAILABLE = 3,
            /**
             * @en
             * The requested product is not available for purchase.
             *
             * @zh
             * 所请求的产品无法购买。
             */
            ITEM_UNAVAILABLE = 4,
            /**
             * @en
             * Error resulting from incorrect usage of the API.
             *
             * @zh
             * 由于错误使用 API 而导致的错误。
             */
            DEVELOPER_ERROR = 5,
            /**
             * @en
             * Fatal error during the API action.
             *
             * @zh
             * API 操作期间发生致命错误。
             */
            ERROR = 6,
            /**
             * @en
             * The purchase failed because the item is already owned.
             *
             * @zh
             * 购买失败，因为该物品已被拥有。
             */
            ITEM_ALREADY_OWNED = 7,
            /**
             * @en
             * Requested action on the item failed since it is not owned by the user.
             *
             * @zh
             * 由于该项目不属于用户，因此对该项目请求的操作失败。
             */
            ITEM_NOT_OWNED = 8,
            /**
             * @en
             * A network error occurred during the operation.
             *
             * @zh
             * 操作期间发生网络错误。
             */
            NETWORK_ERROR = 12,
        }
        /**
         * @en
         * Features/capabilities supported by isFeatureSupported.
         *
         * @zh
         * 支持的特性/能力 isFeatureSupported。
         */
        export enum FeatureType {
            /**
             * @en
             * Purchase/query for subscriptions.
             *
             * @zh
             * 购买/查询订阅。
             */
            SUBSCRIPTIONS = 'subscriptions',
            /**
             * @en
             * Subscriptions update/replace.
             *
             * @zh
             * 订阅更新/替换。
             */
            SUBSCRIPTIONS_UPDATE = 'subscriptionsUpdate',
            /**
             * @en
             * Launch a price change confirmation flow.
             *
             * @zh
             * 启动价格变动确认流程。
             */
            PRICE_CHANGE_CONFIRMATION = 'priceChangeConfirmation',
            /**
            * @en
            * Show in-app messages.
            *
            * @zh
            * 显示应用内消息。
            */
            IN_APP_MESSAGING = 'bbb',
            /**
             * @en
             * Play billing library support for querying and purchasing.
             *
             * @zh
             * Play Billing库支持查询、购买。
             */
            PRODUCT_DETAILS = 'fff',
            /**
             * @en
             * Get billing config.
             *
             * @zh
             * 获取 billing 配置。
             */
            BILLING_CONFIG = 'ggg',
            /**
             * @en
             * Alternative billing only.
             *
             * @zh
             * 仅限替代Billing。
             */
            ALTERNATIVE_BILLING_ONLY = 'jjj',

            /**
             * @en
             * Play billing library support for external offer.
             *
             * @zh
             * Play billing库支持外部报价。
             */
            EXTERNAL_OFFER = 'kkk',
        }

        /**
         * @en
         * Supported Product types.
         *
         * @zh
         * 支持的产品类型。
         */
        export enum ProductType {
            /**
             * @en
             * A Product type for Android apps in-app products.
             *
             * @zh
             * Android 应用内产品的产品类型。
             */
            INAPP = 'inapp',
            /**
             * @en
             * A Product type for Android apps subscriptions.
             *
             * @zh
             * Android 应用程序订阅的产品类型。
             */
            SUBS = 'subs'
        }

        /**
         * @en
         * A high-level category of the in-app message.
         * One category can be mapped to multiple in-app messages.
         *
         * @zh
         * 应用程序内信息的高级类别。
         * 一个类别可映射到多个应用程序内信息。
         */
        export enum InAppMessageCategoryId {
            /**
             * @en
             * A Product type for Android apps in-app products.
             *
             * @zh
             * 应用程序中未知的消息类别 ID
             */
            UNKNOWN_IN_APP_MESSAGE_CATEGORY_ID = 0,
            /**
             * @en
             * The in-app messages of this category are for transactional purpose, such as payment issues.
             *
             * @zh
             * 这类应用内信息用于交易目的，如支付问题。
             */
            TRANSACTIONAL = 2
        }

        /**
         * @en
         * Supported replacement modes to replace an existing subscription with a new one.
         *
         * @zh
         * 支持替换模式，可将现有订购替换为新订购。
         */
        export enum ReplacementMode {
            /**
             * @en
             * Unknown replacement mode.
             *
             * @zh
             * 未知替换模式
             */
            UNKNOWN_REPLACEMENT_MODE = 0,
            /**
             * @en
             * The new plan takes effect immediately, and the remaining time will be prorated and credited to the user.
             *
             * @zh
             * 新计划立即生效，剩余时间将按比例计入用户贷方。
             */
            WITH_TIME_PRORATION = 1,
            /**
             * @en
             * The new plan takes effect immediately, and the billing cycle remains the same.
             *
             * @zh
             * 新计划立即生效，Billing 周期保持不变。
             */
            CHARGE_PRORATED_PRICE = 2,
            /**
             * @en
             * The new plan takes effect immediately, and the new price will be charged on next recurrence time.
             *
             * @zh
             * 新计划立即生效，新价格将在下次复诊时收取。
             */
            WITHOUT_PRORATION = 3,
            /**
             * @en
             * Replacement takes effect immediately, and the user is charged full price of new plan and
             * is given a full billing cycle of subscription, plus remaining prorated time from the old plan.
             *
             * @zh
             * 替换立即生效，用户将被收取新计划的全额费用，并获得一个完整的 Billing 周期，加上旧计划按比例计算的剩余时间。
             */
            CHARGE_FULL_PRICE = 5,
            /**
             * @en
             * The new purchase takes effect immediately, the new plan will take effect when the old item expires.
             *
             * @zh
             * 新购买立即生效，新计划将在旧项目到期时生效。
             */
            DEFERRED = 6,
        }

        /**
         * @en
         * Possible response codes.
         *
         * @zh
         * 可能的响应代码。
         */
        export enum InAppMessageResponseCode {
            /**
             * @en
             * The flow has finished and there is no action needed from developers.
             *
             * @zh
             * 流程已经结束，开发人员无需采取任何行动。
             */
            NO_ACTION_NEEDED = 0,
            /**
             * @en
             * The subscription status changed.
             *
             * @zh
             * 订阅状态已更改。
             */
            SUBSCRIPTION_STATUS_UPDATED = 1
        }

        /**
         * @en
         * Recurrence mode of the pricing phase.
         *
         * @zh
         * 定价阶段的复现模式。
         */
        export enum RecurrenceMode {
            /**
             * @en
             * The billing plan payment recurs for infinite billing periods unless cancelled.
             *
             * @zh
             * 除非取消，否则billing计划付款将无限期地重复。
             */
            INFINITE_RECURRING = 1,
            /**
             * @en
             * The billing plan payment recurs for a fixed number of billing period set in billingCycleCount.
             *
             * @zh
             * Billing计划付款将在 billingCycleCount 中设置的固定 Billing 周期内重复发生。
             */
            FINITE_RECURRING = 2,
            /**
             * @en
             * The billing plan payment is a one time charge that does not repeat.
             *
             * @zh
             * Billing计划付款是一次性费用，不会重复。
             */
            NON_RECURRING = 3,
        }

        /**
         * @en Params that describe the product to be purchased and the offer to purchase with.
         * @zh 描述要购买的产品和购买要约的参数。
         */
        export class ProductDetailsParams {
            private constructor();
            /**
             * @en Returns an instance of Builder.
             * @zh 返回一个 Builder 实例。
             */
            static newBuilder: () => BillingFlowParams.ProductDetailsParams.Builder;
        }

        export interface SubscriptionUpdateParamsBuilder {
            /**
             * @en Specifies the Google Play Billing purchase token that the user is upgrading or downgrading from.
             * @zh 指定用户正在升级或降级的 Google Play 结算服务购买令牌。
             */
            setOldPurchaseToken: (purchaseToken: string) => SubscriptionUpdateParamsBuilder;
            /**
             * @en If the originating transaction for the suscription that the user is upgrading or downgrading from was
             *     processed via alternative billing, specifies the external transaction id of the originating subscription.
             * @zh 如果用户升级或降级的订阅的原始交易是通过替代 Billing 处理的，则指定原始订阅的外部交易 ID。
             */
            setOriginalExternalTransactionId: (externalTransactionId: string) => SubscriptionUpdateParamsBuilder;
            /**
             * @en Specifies the ReplacementMode for replacement.
             * @zh 指定ReplacementMode用于替换。
             */
            setSubscriptionReplacementMode: (subscriptionReplacementMode: number) => SubscriptionUpdateParamsBuilder;
            /**
             * @en Construct a ProductDetailsParams.
             * @zh 构建一个 SubscriptionUpdateParams 。
             */
            build: () => SubscriptionUpdateParams;
        }
        /**
         * @en Params that describe a subscription update.
         * @zh 描述订阅更新的参数。
         */
        export class SubscriptionUpdateParams {
            private constructor();
            static Builder: SubscriptionUpdateParamsBuilder;
            /**
             * @en Returns an instance of Builder.
             * @zh 返回一个 Builder 实例。
             */
            static newBuilder: () => SubscriptionUpdateParamsBuilder;
            static ReplacementMode: typeof google.billing.ReplacementMode;
        }
        export namespace BillingFlowParams {
            export type Builder = google.billing.BillingFlowParamsBuilder;
            export namespace SubscriptionUpdateParams {
                export type Builder = google.billing.SubscriptionUpdateParamsBuilder;
                export type ReplacementMode = google.billing.ReplacementMode;
            }
            export type SubscriptionUpdateParams = google.billing.SubscriptionUpdateParams;
            export namespace ProductDetailsParams {
                export interface Builder {
                    /**
                     * @en Specifies the identifier of the offer to initiate purchase with.
                     * @zh 指定用于启动购买的优惠的标识符。
                     */
                    setOfferToken: (offerToken: string) => ProductDetailsParams.Builder;
                    /**
                     * @en Specifies the details of item to be purchased, fetched via queryProductDetailsAsync.
                     * @zh 指定要购买的商品的详细信息，通过获取 queryProductDetailsAsync 。
                     */
                    setProductDetails: (productDetails: ProductDetails) => ProductDetailsParams.Builder;
                    /**
                     * @en Construct a ProductDetailsParams.
                     * @zh 构建一个 ProductDetailsParams。
                     */
                    build: () => ProductDetailsParams;
                }
            }
            export type ProductDetailsParams = google.billing.ProductDetailsParams;

        }
        export class BillingFlowParams {
            static ProductDetailsParams: typeof google.billing.ProductDetailsParams;
            static SubscriptionUpdateParams: typeof google.billing.SubscriptionUpdateParams;
            static Builder: BillingFlowParamsBuilder;
            private constructor();
            /**
             * @en Returns an instance of Builder.
             * @zh 返回一个 Builder 实例。
             */
            public static newBuilder(): BillingFlowParamsBuilder;
        }
        /**
         * @en Helps to construct BillingFlowParams that are used to initiate a purchase flow.
         * @zh 帮助构建 BillingFlowParams 用于启动购买流程的内容。
         */
        export interface BillingFlowParamsBuilder {
            /**
             * @en Specifies whether the offer is personalized to the buyer.
             * @zh 指定报价是否针对买家进行个性化。
             */
            setIsOfferPersonalized: (isOfferPersonalized: boolean) => BillingFlowParamsBuilder;
            /**
             * @en Specifies an optional obfuscated string that is uniquely associated with the purchaser's user account in your app.
             * @zh 指定一个可选的混淆字符串，该字符串与应用中的购买者用户帐户唯一关联。
             */
            setObfuscatedAccountId: (obfuscatedAccountid: string) => BillingFlowParamsBuilder;
            /**
             * @en Specifies an optional obfuscated string that is uniquely associated with the purchaser's user profile in your app.
             * @zh 指定一个可选的混淆字符串，该字符串与应用中的购买者的用户资料唯一关联。
             */
            setObfuscatedProfileId: (obfuscatedProfileId: string) => BillingFlowParamsBuilder;
            /**
             * @en Specifies the ProductDetailsParams of the items being purchased.
             * @zh 指定所 ProductDetailsParams 购买物品的。
             */
            setProductDetailsParamsList: (userChoiceBillingListener: ProductDetailsParams[]) => BillingFlowParamsBuilder;
            /**
             * @en Params used to upgrade or downgrade a subscription.
             * @zh 用于升级或降级订阅的参数。
             */
            setSubscriptionUpdateParams: (userChoiceBillingListener: SubscriptionUpdateParams) => BillingFlowParamsBuilder;
            /**
             * @en Returns BillingFlowParams reference to initiate a purchase flow.
             * @zh 返回 BillingFlowParams 参考以启动购买流程。
             */
            build: () => BillingFlowParams;
        }

        export namespace ConsumeParams {
            export interface Builder {
                /**
                 * @en Returns token that identifies the purchase to be consumed.
                 * @zh 返回标识要消费的购买的令牌。
                 */
                setPurchaseToken: (purchaseToken: string) => Builder;
                build: () => ConsumeParams;
            }
        }
        /**
         * @en Parameters to consume a purchase. See BillingClient#consumeAsync(ConsumeParams, ConsumeResponseListener).
         * @zh 用于消费购买的参数。请参阅 BillingClient#consumeAsync(ConsumeParams, ConsumeResponseListener)。
         */
        export class ConsumeParams {
            private constructor();
            /**
             * @en Returns an instance of Builder.
             * @zh 返回一个 Builder 实例。
             */
            public static newBuilder(): ConsumeParams.Builder;
        }

        export namespace AcknowledgePurchaseParams {
            export interface Builder {
                /**
                 * @en Returns token that identifies the purchase to be acknowledged.
                 * @zh 返回用于标识待确认购买的令牌。
                 */
                setPurchaseToken: (purchaseToken: string) => Builder;
                build: () => AcknowledgePurchaseParams;
            }
        }
        /**
         * @en Parameters to acknowledge a purchase. See acknowledgePurchase.
         * @zh 确认购买的参数。请参阅 acknowledgePurchase。
         */
        export class AcknowledgePurchaseParams {
            private constructor();
            /**
             * @en Returns an instance of Builder.
             * @zh 返回一个 Builder 实例。
             */
            public static newBuilder(): AcknowledgePurchaseParams.Builder;
        }

        export namespace QueryPurchasesParams {
            export interface Builder {
                /**
                 * @en 设置ProductType查询购买情况。
                 * @zh 返回一个 Builder 实例。
                 */
                setProductType: (productType: string) => Builder;
                /**
                 * @en Returns QueryPurchasesParams.
                 * @zh 返回 QueryPurchasesParams。
                 */
                build: () => QueryPurchasesParams;
            }
        }
        /**
         * @en Parameters to initiate a query for purchases.
         * @zh 启动购买查询的参数。
         */
        export class QueryPurchasesParams {
            private constructor();
            /**
             * @en Returns an instance of Builder.
             * @zh 返回一个 Builder 实例。
             */
            public static newBuilder(): QueryPurchasesParams.Builder;
        }

        namespace InAppMessageParams {
            export interface Builder {
                /**
                 * @en Adds all in-app message categories to show.
                 * @zh 添加所有应用内消息类别以显示。
                 */
                addAllInAppMessageCategoriesToShow: () => Builder;
                /**
                 * @en Adds a specific in-app message category to show.
                 * @zh 添加要显示的特定应用内消息类别。
                 */
                addInAppMessageCategoryToShow: (inAppMessageCategoryId: number) => Builder;
                /**
                 * @en Returns InAppMessageParams.
                 * @zh 返回 InAppMessageParams。
                 */
                build: () => InAppMessageParams;
            }
            export type InAppMessageCategoryId = google.billing.InAppMessageCategoryId;
        }

        /**
         * @en Parameters for in-app messaging. See BillingClient#showInAppMessages.
         * @zh 应用内消息传递的参数。请参阅 BillingClient#showInAppMessages。
         */
        export class InAppMessageParams {
            private constructor();
            /**
             * @en Returns an instance of Builder.
             * @zh 返回一个 Builder 实例。
             */
            public static newBuilder(): InAppMessageParams.Builder;
            static InAppMessageCategoryId: typeof InAppMessageCategoryId;
        }

        namespace GetBillingConfigParams {
            export interface Builder {
                /**
                 * @en Returns GetBillingConfigParams.
                 * @zh 返回 GetBillingConfigParams
                 */
                build: () => GetBillingConfigParams;
            }
        }
        /**
         * @en Parameters for get billing config flow BillingClient#getBillingConfigAsync.
         * @zh 获取 billing 配置流程的参数 BillingClient#getBillingConfigAsync。
         */
        export class GetBillingConfigParams {
            private constructor();
            /**
             * @en Returns an instance of Builder.
             * @zh 返回一个 Builder 实例。
             */
            public static newBuilder(): GetBillingConfigParams.Builder;
        }
        export namespace BillingClient {
            export type Builder = google.billing.BillingClientBuilder;
            export type ConnectionState = google.billing.ConnectionState;
            export type BillingResponseCode = google.billing.BillingResponseCode;
            export type FeatureType = google.billing.FeatureType;
            export type ProductType = google.billing.ProductType;
        }
        /**
         * @en Main interface for communication between the library and user application code.
         * @zh 库和用户应用程序代码之间通信的主要接口。
         */
        export class BillingClient {
            private constructor();
            static Builder: BillingFlowParamsBuilder;
            static ConnectionState: typeof google.billing.ConnectionState;
            static BillingResponseCode: typeof google.billing.BillingResponseCode;
            static FeatureType: typeof google.billing.FeatureType;
            static ProductType: typeof google.billing.ProductType;
            /**
             * @en Returns an instance of Builder.
             * @zh 返回一个 Builder 实例。
             */
            public static newBuilder(): BillingClientBuilder;
            /**
             * @en Starts up BillingClient setup process asynchronously.
             * @zh 异步启动 BillingClient 设置过程。
             */
            startConnection: (listener: BillingClientStateListener) => void;
            /**
             * @en Closes the connection and releases all held resources such as service connections.
             * @zh 关闭连接并释放所有持有的资源，例如服务连接。
             */
            endConnection: () => void;
            /**
             * @en Get the current billing client connection state.
             * @zh 获取当前 billing 客户端连接状态。
             */
            getConnectionState: () => number;
            /**
             * @en Checks if the client is currently connected to the service, so that requests to other methods will succeed.
             * @zh 检查客户端当前是否连接到服务，以便对其他方法的请求能够成功。
             */
            isReady: () => void;
            /**
             * @en Performs a network query the details of products available for sale in your app.
             * @zh 执行网络查询您的应用中可供销售的产品的详细信息。
             */
            queryProductDetailsAsync: (params: QueryProductDetailsParams, listener: ProductDetailsResponseListener) => void;
            /**
             * @en Initiates the billing flow for an in-app purchase or subscription.
             * @zh 启动应用内购买或订阅的 Billing 流程。
             */
            launchBillingFlow: (params: BillingFlowParams) => void;
            /**
             * @en Consumes a given in-app product.
             * @zh 消费给定的应用内产品。
             */
            consumeAsync: (params: ConsumeParams, listener: ConsumeResponseListener) => void;
            /**
             * @en Acknowledges in-app purchases.
             * @zh 确认应用内购买。
             */
            acknowledgePurchase: (params: AcknowledgePurchaseParams, listener: AcknowledgePurchaseResponseListener) => void;
            /**
             * @en Returns purchases details for currently owned items bought within your app.
             * @zh 返回您在应用内购买的当前拥有的商品的购买详情。
             */
            queryPurchasesAsync: (params: QueryPurchasesParams, listener: PurchasesResponseListener) => void;
            /**
             * @en Gets the billing config, which stores configuration used to perform billing operations.
             * @zh 获取 billing 配置，其中存储用于执行 Billing 操作的配置。
             */
            getBillingConfigAsync: (params: GetBillingConfigParams, listener: BillingConfigResponseListener) => void;
            /**
             * @en Creates alternative billing only purchase details that can be used to report a transaction made via
             *     alternative billing without user choice to use Google Play billing.
             * @zh 创建仅限替代结算的购买详情，可用于报告通过替代结算进行的交易，而无需用户选择使用 Google Play 结算。
             */
            createAlternativeBillingOnlyReportingDetailsAsync: (listener: AlternativeBillingOnlyReportingDetailsListener) => void;
            /**
             * @en Checks the availability of offering alternative billing without user choice to use Google Play billing.
             * @zh 检查是否可以提供无需用户选择使用 Google Play 结算方式的替代结算方式。
             */
            isAlternativeBillingOnlyAvailableAsync: (listener: AlternativeBillingOnlyAvailabilityListener) => void;
            /**
             * @en Creates purchase details that can be used to report a transaction made via external offer.
             * @zh 创建可用于报告通过外部报价进行的交易的购买详情。
             */
            createExternalOfferReportingDetailsAsync: (listener: ExternalOfferReportingDetailsListener) => void;
            /**
             * @en Checks the availability of providing external offer.
             * @zh 检查提供外部报价的可用性。
             */
            isExternalOfferAvailableAsync: (listener: ExternalOfferAvailabilityListener) => void;
            /**
             * @en Checks if the specified feature or capability is supported by the Play Store.
             * @zh 检查 Play 商店是否支持指定的功能或能力。
             */
            isFeatureSupported: (productType: string) => BillingResult;
            /**
             * @en Shows the alternative billing only information dialog on top of the calling app.
             * @zh 在呼叫应用程序顶部显示仅备选 billing 信息对话框。
             */
            showAlternativeBillingOnlyInformationDialog: (listener: AlternativeBillingOnlyInformationDialogListener) => void;
            /**
             * @en Shows the external offer information dialog on top of the calling app.
             * @zh 在调用应用程序的顶部显示外部优惠信息对话框。
             */
            showExternalOfferInformationDialog: (listener: ExternalOfferInformationDialogListener) => void;
            /**
             * @en Overlays billing related messages on top of the calling app.
             * @zh 在呼叫应用程序上覆盖与 billing 相关的消息。
             */
            showInAppMessages: (params: InAppMessageParams, listener: InAppMessageResponseListener) => void;
        }
    }

    export namespace play {
        /**
         * @en Represents the current authentication status with Play Games Services.
         * @zh 代表 Play Games Services 的当前身份验证状态。
         */
        export class AuthenticationResult {
            private constructor();
            /**
             * @en Returns true if your game is authenticated to Play Games Services.
             * @zh 返回true表示您的游戏已通过 Play Games Services 的身份验证。
             */
            public isAuthenticated(): boolean;
        }
        /**
         * @en Contains the result of RecallClient.requestRecallAccess().
         * @zh 包含 RecallClient.requestRecallAccess() 的返回结果
         */
        export class RecallAccess {
            private constructor();
            /**
             * @en Hash code
             * @zh hash 值。
             */
            public hashCode(): number;
            /**
             * @en Returns the session id to be passed into PGS server API.
             * @zh 返回要传递到 PGS server API 的会话 ID。
             */
            public getSessionId(): string;
            /**
             * @en Is it equal to another RecallAccess.
             * @zh 判断与另一个 RecallAccess 是否相等。
             */
            public equals(other: RecallAccess): boolean;
        }
        export class PlayException {
            /**
             * @en Getting Exception message.
             * @zh 获取异常信息。
             */
            getMessage(): string;
            /**
             * @en Returns the name of the exception in the local language of the user (Chinese etc.).
             * @zh 用户的本地语言（中文等）返回异常名称。
             */
            getLocalizedMessage(): string;
            /**
             * @en Print the exception stack.
             * @zh 打印异常堆栈。
             */
            printStackTrace(): void;
            /**
             * @en To string.
             * @zh 转换成字符串。
             */
            toString(): string;
        }
        /**
         * @en Data interface for retrieving achievement information.
         * @zh 用于检索成就信息的数据接口。
         */
        export class Achievement {
            /**
             * @en Constant returned by getState() indicating an unlocked achievement.
             * @zh getState 返回的常量表示未解锁的成就。
             */
            public static STATE_UNLOCKED: number;
            /**
             * @en Constant returned by getState() indicating a revealed achievement.
             * @zh getState 返回的常量表示已显示的成就。
             */
            public static STATE_REVEALED: number;
            /**
             * @en Constant returned by getState() indicating a hidden achievement.
             * @zh getState 返回的常量表示隐藏的成就。
             */
            public static STATE_HIDDEN: number;
            /**
             * @en Constant returned by getType() indicating a standard achievement.
             * @zh getType 返回的常量表示标准的成就。
             */
            public static TYPE_STANDARD: number;
            /**
             * @en Constant returned by getType() indicating an incremental achievement.
             * @zh getType 返回的常量表示增量的成就。
             */
            public static TYPE_INCREMENTAL: number;
            /**
             * @en Retrieves the number of steps this user has gone toward unlocking this achievement;
             *     only applicable for TYPE_INCREMENTAL achievement types.
             * @zh 检索该用户为解锁该成就所走的步数；仅适用于 TYPE_INCREMENTAL 成就类型。
             */
            public getCurrentSteps(): number;
            /**
             * @en Returns the Achievement.AchievementState of the achievement.
             * @zh 返回该成就的状态（Achievement.AchievementState）。
             */
            public getState(): number;
            /**
             * @en Retrieves the total number of steps necessary to unlock this achievement; only applicable for TYPE_INCREMENTAL achievement types
             * @zh 检索解锁此成就所需的总步数；仅适用于 TYPE_INCREMENTAL 成就类型。
             */
            public getTotalSteps(): number;
            /**
             * @en Returns the Achievement.AchievementType of this achievement.
             * @zh 返回 Achievement.AchievementType 此成就。
             */
            public getType(): number;
            /**
             * @en Retrieves the timestamp (in millseconds since epoch) at which this achievement was last updated.
             * @zh 检索此成就最后更新的时间戳（以纪元以来的毫秒数为单位）。
             */
            public getLastUpdatedTimestamp(): number;
            /**
             * @en Retrieves the XP value of this achievement.
             * @zh 检索此成就的 XP 值。
             */
            public getXpValue(): number;
            /**
             * @en Retrieves the ID of this achievement.
             * @zh 检索此成就的 ID。
             */
            public getAchievementId(): string;
            /**
             * @en Retrieves the description for this achievement.
             * @zh 检索此成就的描述。
             */
            public getDescription(): string;
            /**
             * @enRetrieves the number of steps this user has gone toward unlocking this achievement
             *              (formatted for the user's locale); only applicable for TYPE_INCREMENTAL achievement types.
             * @zh 检索该用户为解锁此成就所经过的步数（根据用户的语言环境格式化）；仅适用于 TYPE_INCREMENTAL成就类型。
             */
            public getFormattedCurrentSteps(): string;
            /**
             * @en Loads the total number of steps necessary to unlock this achievement
             *     (formatted for the user's locale) into the given CharArrayBuffer; only applicable for TYPE_INCREMENTAL achievement types.
             * @zh 检索解锁此成就所需的总步数；仅适用于 TYPE_INCREMENTAL 成就类型。
             */
            public getFormattedTotalSteps(): string;
            /**
             * @en Retrieves the name of this achievement.
             * @zh 检索此成就的名称。
             */
            public getName(): string;
            /**
             * @en Retrieves a URI that can be used to load the achievement's revealed image icon.
             * @zh 检索可用于加载成就显示图像图标的 URI。
             */
            public getRevealedImageUrl(): string;
            /**
             * @en Retrieves a URI that can be used to load the achievement's unlocked image icon.
             * @zh 检索可用于加载成就的解锁图像图标的 URI。
             */
            public getUnlockedImageUrl(): string;
        }
        /**
         * @en Data structure providing access to a list of achievements.
         * @zh 提供访问成就列表的数据结构。
         */
        export class AchievementBuffer {
            /**
             * @en Get the count of achievement.
             * @zh 获取 achievement 的数量 。
             */
            public getCount(): number;
            /**
             * @en Get the item at the specified position.
             * @zh 获取指定位置的物品。
             */
            public get(i: number): Achievement;
            /**
             * @en Releases the data buffer, for use in try-with-resources.
             * @zh 释放数据缓冲区，以供在 try-with-resources 中使用。
             */
            public close(): void;
            /**
             * @en Releases resources used by the buffer.
             * @zh 释放缓冲区使用的资源。
             */
            public release(): void;
        }
        /**
         * @en Class to return annotated data. Currently, the only annotation is whether the data is stale or not.
         * @zh 用于返回带 annotated 数据的类。目前，唯一的 annotated 是数据是否过时。
         */
        export class AnnotatedData {
            /**
             * @en Returns true if the data returned by get() is stale.
             * @zh true如果返回的数据已过时，则返回 get() 。
             */
            public isStale(): boolean;
            /**
             * @en Returns the data that is annotated by this class.
             * @zh 返回由此类 annotated 的数据。
             */
            public get(): AchievementBuffer;
        }
        /**
         * @en Entry point for the Play Games SDK.
         * @zh Play Games SDK 的入口点。
         */
        export class PlayGamesSdk {
            /**
             * @en Initializes the Play Games SDK using the Game services application id defined in the application's manifest.
             * @zh 使用应用程序清单中定义的游戏服务应用程序 ID 初始化 Play 游戏 SDK。
             */
            public static initialize(): void;
        }
        /**
         * @en Main entry point for the Games APIs. This class provides APIs and interfaces to access the Google Play Games Services functionality.
         * @zh 游戏 API 的主要入口点。此类提供用于访问 Google Play Games Services 功能的 API 和接口。
         */
        export class PlayGames {
            /**
             * @en Returns a new instance of AchievementsClient.
             * @zh 返回一个新的 AchievementsClient 实例。
             */
            public static getAchievementsClient(): AchievementsClient;
            /**
             * @en Returns a new instance of GamesSignInClient.
             * @zh 返回一个新的 GamesSignInClient 实例。
             */
            public static getGamesSignInClient(): GamesSignInClient;
            /**
             * @en Returns a new instance of RecallClient.
             * @zh 返回一个新的 RecallClient 实例。
             */
            public static getRecallClient(): RecallClient;
        }
        /**
         * @en A client for performing sign-in with Play Games Services.
         * @zh 用于使用 Play Games Services 执行登录的客户端。
         */
        export class GamesSignInClient {
            /**
             * @en Returns the current authentication status via an AuthenticationResult.
             * @zh 通过 返回当前身份验证状态 AuthenticationResult 。
             */
            public isAuthenticated(): TaskHelper<google.play.AuthenticationResult>;
            /**
             * @en Requests server-side access to Play Games Services for the currently signed-in player.
             * @zh 向当前登录的玩家请求服务器端访问 Play Games Services。
             */
            public requestServerSideAccess(serverClientId: string, forceRefreshToken: boolean): TaskHelper<string>;
            /**
             * @en Manually requests that your game sign in with Play Games Services.
             * @zh 手动请求您的游戏通过 Play Games Services 登录。
             */
            public signIn(): TaskHelper<google.play.AuthenticationResult>;
        }
        /**
         * @en A client to interact with achievements functionality.
         * @zh 与 Achievements 功能交互的客户端。
         */
        export class AchievementsClient {
            /**
             * @en Show default achievement page.
             * @zh 显示默认的成就页面。
             */
            public showAchievements(): void;
            /**
             * @en Returns a Task which asynchronously increments an achievement by the given number of steps.
             * @zh 返回一个 Task 以给定步数异步增加成就的方法。
             */
            public incrementImmediate(id: string, numSteps: number): TaskHelper<boolean>;
            /**
             * @en Returns a Task which asynchronously loads an annotated AchievementBuffer that represents the achievement data.
             *     for the currently signed-in player.
             * @zh 返回一个 Task 异步加载的task， AchievementBuffer该注释代表当前登录玩家的成就数据。
             */
            public load(forceReload: boolean):  TaskHelper<google.play.AnnotatedData>;
            /**
             * @en Returns a Task which asynchronously reveals a hidden achievement to the currently signed in player.
             * @zh 返回一个 Task 异步向当前登录的玩家显示隐藏成就的对象。
             */
            public revealImmediate(id: string): TaskHelper<void>;
            /**
             * @en Returns a Task which asynchronously sets an achievement to have at least the given number of steps completed.
             * @zh 返回一个 Task 异步设置成就以至少完成给定数量的步骤。
             */
            public setStepsImmediate(id: string, numSteps: number): TaskHelper<boolean>;
            /**
             * @en Returns a Task which asynchronously unlocks an achievement for the currently signed in player.
             * @zh 返回一个 Task 异步解锁当前登录玩家的成就。
             */
            public unlockImmediate(id: string): TaskHelper<void>;
            /**
            * @en Increments an achievement by the given number of steps.
            * @zh 按给定的步数增加成就。
            */
            public increment(id: string, numSteps: number): void;
            /**
             * @en Reveals a hidden achievement to the currently signed-in player.
             * @zh 向当前登录的玩家揭示隐藏的成就。
             */
            public reveal(id: string): void;
            /**
             * @en Sets an achievement to have at least the given number of steps completed.
             * @zh 设置一项成就，至少完成给定数量的步骤。
             */
            public setSteps(id: string, numSteps: number): void;
            /**
             * @en Unlocks an achievement for the currently signed in player.
             * @zh 为当前登录的玩家解锁一项成就。
             */
            public unlock(id: string): void;
        }
        /**
         * @en A client for the recall functionality.
         * @zh Recall 功能客户端。
         */
        export class RecallClientHelper {
            /**
             * @en Returns a RecallAccess to use for server-to-server communication between the 3p game server and Play Games Services server.
             * @zh 返回 RecallAccess 用于第三方游戏服务器和 Play 游戏服务服务器之间的服务器到服务器通信。
             */
            public requestRecallAccess(): TaskHelper<google.play.RecallAccess>;
        }
        export type RecallClient = RecallClientHelper;
        export type Continuation<T, K = void> = ContinuationHelper<T, K>;
        export type Task<T, K = void> = TaskHelper<T, K>;
    }
}
