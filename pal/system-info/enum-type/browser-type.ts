/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

export enum BrowserType {
    /**
     * @en Browser Type - Unknown
     * @zh 浏览器类型 - 未知
     */
    UNKNOWN = 'unknown',
    /**
     * @en Browser Type - WeChat inner browser
     * @zh 浏览器类型 - 微信内置浏览器
     */
    WECHAT = 'wechat',
    /**
     * @en Browser Type - Android Browser
     * @zh 浏览器类型 - 安卓浏览器
     */
    ANDROID = 'androidbrowser',
    /**
     * @en Browser Type - Internet Explorer
     * @zh 浏览器类型 - 微软 IE
     */
    IE = 'ie',
    /**
     * @en Browser Type - Microsoft Edge
     * @zh 浏览器类型 - 微软 Edge
     */
    EDGE = 'edge',
    /**
     * @en Browser Type - QQ Browser
     * @zh 浏览器类型 - QQ 浏览器
     */
    QQ = 'qqbrowser',
    /**
     * @en Browser Type - Mobile QQ Browser
     * @zh 浏览器类型 - 手机 QQ 浏览器
     */
    MOBILE_QQ = 'mqqbrowser',
    /**
     * @en Browser Type - UC Browser
     * @zh 浏览器类型 - UC 浏览器
     */
    UC = 'ucbrowser',
    /**
     * @en Browser Type - Third party integrated UC browser
     * @zh 浏览器类型 - 第三方应用中集成的 UC 浏览器
     */
    UCBS = 'ucbs',
    /**
     * @en Browser Type - 360 Browser
     * @zh 浏览器类型 - 360 浏览器
     */
    BROWSER_360 = '360browser',
    /**
     * @en Browser Type - Baidu Box App
     * @zh 浏览器类型 - Baidu Box App
     */
    BAIDU_APP = 'baiduboxapp',
    /**
     * @en Browser Type - Baidu Browser
     * @zh 浏览器类型 - 百度浏览器
     */
    BAIDU = 'baidubrowser',
    /**
     * @en Browser Type - Maxthon Browser
     * @zh 浏览器类型 - 傲游浏览器
     */
    MAXTHON = 'maxthon',
    /**
     * @en Browser Type - Opera Browser
     * @zh 浏览器类型 - Opera 浏览器
     */
    OPERA = 'opera',
    /**
     * @en Browser Type - Oupeng Browser
     * @zh 浏览器类型 - 欧朋浏览器
     */
    OUPENG = 'oupeng',
    /**
     * @en Browser Type - MI UI Browser
     * @zh 浏览器类型 - MIUI 内置浏览器
     */
    MIUI = 'miuibrowser',
    /**
     * @en Browser Type - Firefox Browser
     * @zh 浏览器类型 - Firefox 浏览器
     */
    FIREFOX = 'firefox',
    /**
     * @en Browser Type - Safari Browser
     * @zh 浏览器类型 - Safari 浏览器
     */
    SAFARI = 'safari',
    /**
     * @en Browser Type - Chrome Browser
     * @zh 浏览器类型 - Chrome 浏览器
     */
    CHROME = 'chrome',
    /**
     * @en Browser Type - Cheetah Browser
     * @zh 浏览器类型 - 猎豹浏览器
     */
    LIEBAO = 'liebao',
    /**
     * @en Browser Type - QZone Inner Browser
     * @zh 浏览器类型 - QZone 内置浏览器
     */
    QZONE = 'qzone',
    /**
     * @en Browser Type - Sogou Browser
     * @zh 浏览器类型 - 搜狗浏览器
     */
    SOUGOU = 'sogou',
    /**
     * @en Browser Type - Huawei Browser
     * @zh 浏览器类型 - 华为浏览器
     */
    HUAWEI = 'huawei',
}
