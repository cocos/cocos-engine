/**
 * @module webview
 */
var jsb = jsb || {};

/**
 * @class WebView
 */
jsb.WebView = {

/**
 * @method setOnShouldStartLoading
 * @param {function} arg0
 */
setOnShouldStartLoading : function (
func 
)
{
},

/**
 * @method setOnDidFailLoading
 * @param {function} arg0
 */
setOnDidFailLoading : function (
func 
)
{
},

/**
 * @method canGoBack
 * @return {bool}
 */
canGoBack : function (
)
{
    return false;
},

/**
 * @method loadHTMLString
 * @param {String} arg0
 * @param {String} arg1
 */
loadHTMLString : function (
str, 
str 
)
{
},

/**
 * @method goForward
 */
goForward : function (
)
{
},

/**
 * @method goBack
 */
goBack : function (
)
{
},

/**
 * @method setScalesPageToFit
 * @param {bool} arg0
 */
setScalesPageToFit : function (
bool 
)
{
},

/**
 * @method getOnDidFailLoading
 * @return {function}
 */
getOnDidFailLoading : function (
)
{
    return std::function<void (cocos2d::WebView , std::string&)>;
},

/**
 * @method loadFile
 * @param {String} arg0
 */
loadFile : function (
str 
)
{
},

/**
 * @method loadURL
 * @param {String} arg0
 */
loadURL : function (
str 
)
{
},

/**
 * @method setBounces
 * @param {bool} arg0
 */
setBounces : function (
bool 
)
{
},

/**
 * @method evaluateJS
 * @param {String} arg0
 */
evaluateJS : function (
str 
)
{
},

/**
 * @method setOnJSCallback
 * @param {function} arg0
 */
setOnJSCallback : function (
func 
)
{
},

/**
 * @method setBackgroundTransparent
 * @param {bool} arg0
 */
setBackgroundTransparent : function (
bool 
)
{
},

/**
 * @method getOnJSCallback
 * @return {function}
 */
getOnJSCallback : function (
)
{
    return std::function<void (cocos2d::WebView , std::string&)>;
},

/**
 * @method canGoForward
 * @return {bool}
 */
canGoForward : function (
)
{
    return false;
},

/**
 * @method getOnShouldStartLoading
 * @return {function}
 */
getOnShouldStartLoading : function (
)
{
    return std::function<bool (cocos2d::WebView , std::string&)>;
},

/**
 * @method stopLoading
 */
stopLoading : function (
)
{
},

/**
 * @method setFrame
 * @param {float} arg0
 * @param {float} arg1
 * @param {float} arg2
 * @param {float} arg3
 */
setFrame : function (
float, 
float, 
float, 
float 
)
{
},

/**
 * @method setVisible
 * @param {bool} arg0
 */
setVisible : function (
bool 
)
{
},

/**
 * @method reload
 */
reload : function (
)
{
},

/**
 * @method loadData
 * @param {cc.Data} arg0
 * @param {String} arg1
 * @param {String} arg2
 * @param {String} arg3
 */
loadData : function (
data, 
str, 
str, 
str 
)
{
},

/**
 * @method setJavascriptInterfaceScheme
 * @param {String} arg0
 */
setJavascriptInterfaceScheme : function (
str 
)
{
},

/**
 * @method setOnDidFinishLoading
 * @param {function} arg0
 */
setOnDidFinishLoading : function (
func 
)
{
},

/**
 * @method getOnDidFinishLoading
 * @return {function}
 */
getOnDidFinishLoading : function (
)
{
    return std::function<void (cocos2d::WebView , std::string&)>;
},

/**
 * @method create
 * @return {cc.WebView}
 */
create : function (
)
{
    return cc.WebView;
},

/**
 * @method WebView
 * @constructor
 */
WebView : function (
)
{
},

};
