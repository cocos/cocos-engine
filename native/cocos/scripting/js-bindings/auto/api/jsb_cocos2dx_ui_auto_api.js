/**
 * @module cocos2dx_ui
 */
var ccui = ccui || {};

/**
 * @class Widget
 */
ccui.Widget = {

/**
 * @method setSizePercent
 * @param {vec2_object} arg0
 */
setSizePercent : function (
vec2 
)
{
},

/**
 * @method getCustomSize
 * @return {size_object}
 */
getCustomSize : function (
)
{
    return cc.Size;
},

/**
 * @method getLeftBoundary
 * @return {float}
 */
getLeftBoundary : function (
)
{
    return 0;
},

/**
 * @method setFlippedX
 * @param {bool} arg0
 */
setFlippedX : function (
bool 
)
{
},

/**
 * @method init
 * @return {bool}
 */
init : function (
)
{
    return false;
},

/**
 * @method getVirtualRenderer
 * @return {cc.Node}
 */
getVirtualRenderer : function (
)
{
    return cc.Node;
},

/**
 * @method setPropagateTouchEvents
 * @param {bool} arg0
 */
setPropagateTouchEvents : function (
bool 
)
{
},

/**
 * @method isUnifySizeEnabled
 * @return {bool}
 */
isUnifySizeEnabled : function (
)
{
    return false;
},

/**
 * @method getSizePercent
 * @return {vec2_object}
 */
getSizePercent : function (
)
{
    return cc.Vec2;
},

/**
 * @method setPositionPercent
 * @param {vec2_object} arg0
 */
setPositionPercent : function (
vec2 
)
{
},

/**
 * @method setSwallowTouches
 * @param {bool} arg0
 */
setSwallowTouches : function (
bool 
)
{
},

/**
 * @method getLayoutSize
 * @return {size_object}
 */
getLayoutSize : function (
)
{
    return cc.Size;
},

/**
 * @method setHighlighted
 * @param {bool} arg0
 */
setHighlighted : function (
bool 
)
{
},

/**
 * @method setPositionType
 * @param {ccui.Widget::PositionType} arg0
 */
setPositionType : function (
positiontype 
)
{
},

/**
 * @method isIgnoreContentAdaptWithSize
 * @return {bool}
 */
isIgnoreContentAdaptWithSize : function (
)
{
    return false;
},

/**
 * @method getVirtualRendererSize
 * @return {size_object}
 */
getVirtualRendererSize : function (
)
{
    return cc.Size;
},

/**
 * @method isHighlighted
 * @return {bool}
 */
isHighlighted : function (
)
{
    return false;
},

/**
 * @method setCallbackName
 * @param {String} arg0
 */
setCallbackName : function (
str 
)
{
},

/**
 * @method addCCSEventListener
 * @param {function} arg0
 */
addCCSEventListener : function (
func 
)
{
},

/**
 * @method getPositionType
 * @return {ccui.Widget::PositionType}
 */
getPositionType : function (
)
{
    return 0;
},

/**
 * @method getTopBoundary
 * @return {float}
 */
getTopBoundary : function (
)
{
    return 0;
},

/**
 * @method ignoreContentAdaptWithSize
 * @param {bool} arg0
 */
ignoreContentAdaptWithSize : function (
bool 
)
{
},

/**
 * @method isEnabled
 * @return {bool}
 */
isEnabled : function (
)
{
    return false;
},

/**
 * @method isFocused
 * @return {bool}
 */
isFocused : function (
)
{
    return false;
},

/**
 * @method getTouchBeganPosition
 * @return {vec2_object}
 */
getTouchBeganPosition : function (
)
{
    return cc.Vec2;
},

/**
 * @method isTouchEnabled
 * @return {bool}
 */
isTouchEnabled : function (
)
{
    return false;
},

/**
 * @method getCallbackName
 * @return {String}
 */
getCallbackName : function (
)
{
    return ;
},

/**
 * @method getActionTag
 * @return {int}
 */
getActionTag : function (
)
{
    return 0;
},

/**
 * @method requestFocus
 */
requestFocus : function (
)
{
},

/**
 * @method isFocusEnabled
 * @return {bool}
 */
isFocusEnabled : function (
)
{
    return false;
},

/**
 * @method setFocused
 * @param {bool} arg0
 */
setFocused : function (
bool 
)
{
},

/**
 * @method setActionTag
 * @param {int} arg0
 */
setActionTag : function (
int 
)
{
},

/**
 * @method setTouchEnabled
 * @param {bool} arg0
 */
setTouchEnabled : function (
bool 
)
{
},

/**
 * @method setFlippedY
 * @param {bool} arg0
 */
setFlippedY : function (
bool 
)
{
},

/**
 * @method setEnabled
 * @param {bool} arg0
 */
setEnabled : function (
bool 
)
{
},

/**
 * @method getRightBoundary
 * @return {float}
 */
getRightBoundary : function (
)
{
    return 0;
},

/**
 * @method setBrightStyle
 * @param {ccui.Widget::BrightStyle} arg0
 */
setBrightStyle : function (
brightstyle 
)
{
},

/**
 * @method getWorldPosition
 * @return {vec2_object}
 */
getWorldPosition : function (
)
{
    return cc.Vec2;
},

/**
 * @method clone
 * @return {ccui.Widget}
 */
clone : function (
)
{
    return ccui.Widget;
},

/**
 * @method setFocusEnabled
 * @param {bool} arg0
 */
setFocusEnabled : function (
bool 
)
{
},

/**
 * @method getBottomBoundary
 * @return {float}
 */
getBottomBoundary : function (
)
{
    return 0;
},

/**
 * @method isBright
 * @return {bool}
 */
isBright : function (
)
{
    return false;
},

/**
 * @method dispatchFocusEvent
 * @param {ccui.Widget} arg0
 * @param {ccui.Widget} arg1
 */
dispatchFocusEvent : function (
widget, 
widget 
)
{
},

/**
 * @method setUnifySizeEnabled
 * @param {bool} arg0
 */
setUnifySizeEnabled : function (
bool 
)
{
},

/**
 * @method isPropagateTouchEvents
 * @return {bool}
 */
isPropagateTouchEvents : function (
)
{
    return false;
},

/**
 * @method hitTest
 * @param {vec2_object} arg0
 * @return {bool}
 */
hitTest : function (
vec2 
)
{
    return false;
},

/**
 * @method updateSizeAndPosition
* @param {size_object} size
*/
updateSizeAndPosition : function(
size 
)
{
},

/**
 * @method onFocusChange
 * @param {ccui.Widget} arg0
 * @param {ccui.Widget} arg1
 */
onFocusChange : function (
widget, 
widget 
)
{
},

/**
 * @method getTouchMovePosition
 * @return {vec2_object}
 */
getTouchMovePosition : function (
)
{
    return cc.Vec2;
},

/**
 * @method getSizeType
 * @return {ccui.Widget::SizeType}
 */
getSizeType : function (
)
{
    return 0;
},

/**
 * @method getCallbackType
 * @return {String}
 */
getCallbackType : function (
)
{
    return ;
},

/**
 * @method addTouchEventListener
 * @param {function} arg0
 */
addTouchEventListener : function (
func 
)
{
},

/**
 * @method getTouchEndPosition
 * @return {vec2_object}
 */
getTouchEndPosition : function (
)
{
    return cc.Vec2;
},

/**
 * @method getPositionPercent
 * @return {vec2_object}
 */
getPositionPercent : function (
)
{
    return cc.Vec2;
},

/**
 * @method propagateTouchEvent
 * @param {ccui.Widget::TouchEventType} arg0
 * @param {ccui.Widget} arg1
 * @param {cc.Touch} arg2
 */
propagateTouchEvent : function (
toucheventtype, 
widget, 
touch 
)
{
},

/**
 * @method addClickEventListener
 * @param {function} arg0
 */
addClickEventListener : function (
func 
)
{
},

/**
 * @method isFlippedX
 * @return {bool}
 */
isFlippedX : function (
)
{
    return false;
},

/**
 * @method isFlippedY
 * @return {bool}
 */
isFlippedY : function (
)
{
    return false;
},

/**
 * @method setSizeType
 * @param {ccui.Widget::SizeType} arg0
 */
setSizeType : function (
sizetype 
)
{
},

/**
 * @method interceptTouchEvent
 * @param {ccui.Widget::TouchEventType} arg0
 * @param {ccui.Widget} arg1
 * @param {cc.Touch} arg2
 */
interceptTouchEvent : function (
toucheventtype, 
widget, 
touch 
)
{
},

/**
 * @method setBright
 * @param {bool} arg0
 */
setBright : function (
bool 
)
{
},

/**
 * @method setCallbackType
 * @param {String} arg0
 */
setCallbackType : function (
str 
)
{
},

/**
 * @method isSwallowTouches
 * @return {bool}
 */
isSwallowTouches : function (
)
{
    return false;
},

/**
 * @method getCurrentFocusedWidget
 * @return {ccui.Widget}
 */
getCurrentFocusedWidget : function (
)
{
    return ccui.Widget;
},

/**
 * @method create
 * @return {ccui.Widget}
 */
create : function (
)
{
    return ccui.Widget;
},

/**
 * @method Widget
 * @constructor
 */
Widget : function (
)
{
},

};

/**
 * @class Helper
 */
ccui.Helper = {

/**
 * @method getSubStringOfUTF8String
 * @param {String} arg0
 * @param {unsigned long} arg1
 * @param {unsigned long} arg2
 * @return {String}
 */
getSubStringOfUTF8String : function (
str, 
long, 
long 
)
{
    return ;
},

/**
 * @method convertBoundingBoxToScreen
 * @param {cc.Node} arg0
 * @return {rect_object}
 */
convertBoundingBoxToScreen : function (
node 
)
{
    return cc.Rect;
},

/**
 * @method changeLayoutSystemActiveState
 * @param {bool} arg0
 */
changeLayoutSystemActiveState : function (
bool 
)
{
},

/**
 * @method seekActionWidgetByActionTag
 * @param {ccui.Widget} arg0
 * @param {int} arg1
 * @return {ccui.Widget}
 */
seekActionWidgetByActionTag : function (
widget, 
int 
)
{
    return ccui.Widget;
},

/**
 * @method seekWidgetByName
 * @param {ccui.Widget} arg0
 * @param {String} arg1
 * @return {ccui.Widget}
 */
seekWidgetByName : function (
widget, 
str 
)
{
    return ccui.Widget;
},

/**
 * @method seekWidgetByTag
 * @param {ccui.Widget} arg0
 * @param {int} arg1
 * @return {ccui.Widget}
 */
seekWidgetByTag : function (
widget, 
int 
)
{
    return ccui.Widget;
},

/**
 * @method restrictCapInsetRect
 * @param {rect_object} arg0
 * @param {size_object} arg1
 * @return {rect_object}
 */
restrictCapInsetRect : function (
rect, 
size 
)
{
    return cc.Rect;
},

};

/**
 * @class Scale9Sprite
 */
ccui.Scale9Sprite = {

/**
 * @method disableCascadeColor
 */
disableCascadeColor : function (
)
{
},

/**
 * @method updateWithSprite
* @param {cc.Sprite|cc.Sprite} sprite
* @param {rect_object|rect_object} rect
* @param {bool|bool} bool
* @param {vec2_object|rect_object} vec2
* @param {size_object} size
* @param {rect_object} rect
* @return {bool|bool}
*/
updateWithSprite : function(
sprite,
rect,
bool,
vec2,
size,
rect 
)
{
    return false;
},

/**
 * @method isFlippedX
 * @return {bool}
 */
isFlippedX : function (
)
{
    return false;
},

/**
 * @method setScale9Enabled
 * @param {bool} arg0
 */
setScale9Enabled : function (
bool 
)
{
},

/**
 * @method setFlippedY
 * @param {bool} arg0
 */
setFlippedY : function (
bool 
)
{
},

/**
 * @method setFlippedX
 * @param {bool} arg0
 */
setFlippedX : function (
bool 
)
{
},

/**
 * @method resizableSpriteWithCapInsets
 * @param {rect_object} arg0
 * @return {ccui.Scale9Sprite}
 */
resizableSpriteWithCapInsets : function (
rect 
)
{
    return ccui.Scale9Sprite;
},

/**
 * @method disableCascadeOpacity
 */
disableCascadeOpacity : function (
)
{
},

/**
 * @method getState
 * @return {ccui.Scale9Sprite::State}
 */
getState : function (
)
{
    return 0;
},

/**
 * @method setState
 * @param {ccui.Scale9Sprite::State} arg0
 */
setState : function (
state 
)
{
},

/**
 * @method setInsetBottom
 * @param {float} arg0
 */
setInsetBottom : function (
float 
)
{
},

/**
 * @method initWithSpriteFrameName
* @param {String|String} str
* @param {rect_object} rect
* @return {bool|bool}
*/
initWithSpriteFrameName : function(
str,
rect 
)
{
    return false;
},

/**
 * @method getSprite
 * @return {cc.Sprite}
 */
getSprite : function (
)
{
    return cc.Sprite;
},

/**
 * @method setInsetTop
 * @param {float} arg0
 */
setInsetTop : function (
float 
)
{
},

/**
 * @method setRenderingType
 * @param {ccui.Scale9Sprite::RenderingType} arg0
 */
setRenderingType : function (
renderingtype 
)
{
},

/**
 * @method init
* @param {cc.Sprite|cc.Sprite|cc.Sprite} sprite
* @param {rect_object|rect_object|rect_object} rect
* @param {bool|rect_object|bool} bool
* @param {rect_object|vec2_object} rect
* @param {size_object} size
* @param {rect_object} rect
* @return {bool|bool|bool|bool}
*/
init : function(
sprite,
rect,
bool,
vec2,
size,
rect 
)
{
    return false;
},

/**
 * @method setPreferredSize
 * @param {size_object} arg0
 */
setPreferredSize : function (
size 
)
{
},

/**
 * @method setSpriteFrame
 * @param {cc.SpriteFrame} arg0
 * @param {rect_object} arg1
 */
setSpriteFrame : function (
spriteframe, 
rect 
)
{
},

/**
 * @method getBlendFunc
 * @return {cc.BlendFunc}
 */
getBlendFunc : function (
)
{
    return cc.BlendFunc;
},

/**
 * @method getInsetBottom
 * @return {float}
 */
getInsetBottom : function (
)
{
    return 0;
},

/**
 * @method getCapInsets
 * @return {rect_object}
 */
getCapInsets : function (
)
{
    return cc.Rect;
},

/**
 * @method isScale9Enabled
 * @return {bool}
 */
isScale9Enabled : function (
)
{
    return false;
},

/**
 * @method resetRender
 */
resetRender : function (
)
{
},

/**
 * @method getRenderingType
 * @return {ccui.Scale9Sprite::RenderingType}
 */
getRenderingType : function (
)
{
    return 0;
},

/**
 * @method getInsetRight
 * @return {float}
 */
getInsetRight : function (
)
{
    return 0;
},

/**
 * @method getOriginalSize
 * @return {size_object}
 */
getOriginalSize : function (
)
{
    return cc.Size;
},

/**
 * @method initWithFile
* @param {String|String|rect_object|String} str
* @param {rect_object|rect_object|String} rect
* @param {rect_object} rect
* @return {bool|bool|bool|bool}
*/
initWithFile : function(
str,
rect,
rect 
)
{
    return false;
},

/**
 * @method setBlendFunc
 * @param {cc.BlendFunc} arg0
 */
setBlendFunc : function (
blendfunc 
)
{
},

/**
 * @method getInsetTop
 * @return {float}
 */
getInsetTop : function (
)
{
    return 0;
},

/**
 * @method setInsetLeft
 * @param {float} arg0
 */
setInsetLeft : function (
float 
)
{
},

/**
 * @method initWithSpriteFrame
* @param {cc.SpriteFrame|cc.SpriteFrame} spriteframe
* @param {rect_object} rect
* @return {bool|bool}
*/
initWithSpriteFrame : function(
spriteframe,
rect 
)
{
    return false;
},

/**
 * @method getPreferredSize
 * @return {size_object}
 */
getPreferredSize : function (
)
{
    return cc.Size;
},

/**
 * @method setCapInsets
 * @param {rect_object} arg0
 */
setCapInsets : function (
rect 
)
{
},

/**
 * @method isFlippedY
 * @return {bool}
 */
isFlippedY : function (
)
{
    return false;
},

/**
 * @method getInsetLeft
 * @return {float}
 */
getInsetLeft : function (
)
{
    return 0;
},

/**
 * @method setInsetRight
 * @param {float} arg0
 */
setInsetRight : function (
float 
)
{
},

/**
 * @method create
* @param {String|rect_object|String|String} str
* @param {rect_object|String|rect_object} rect
* @param {rect_object} rect
* @return {ccui.Scale9Sprite|ccui.Scale9Sprite|ccui.Scale9Sprite|ccui.Scale9Sprite|ccui.Scale9Sprite}
*/
create : function(
str,
rect,
rect 
)
{
    return ccui.Scale9Sprite;
},

/**
 * @method createWithSpriteFrameName
* @param {String|String} str
* @param {rect_object} rect
* @return {ccui.Scale9Sprite|ccui.Scale9Sprite}
*/
createWithSpriteFrameName : function(
str,
rect 
)
{
    return ccui.Scale9Sprite;
},

/**
 * @method createWithSpriteFrame
* @param {cc.SpriteFrame|cc.SpriteFrame} spriteframe
* @param {rect_object} rect
* @return {ccui.Scale9Sprite|ccui.Scale9Sprite}
*/
createWithSpriteFrame : function(
spriteframe,
rect 
)
{
    return ccui.Scale9Sprite;
},

/**
 * @method Scale9Sprite
 * @constructor
 */
Scale9Sprite : function (
)
{
},

};

/**
 * @class EditBox
 */
ccui.EditBox = {

/**
 * @method getText
 * @return {char}
 */
getText : function (
)
{
    return 0;
},

/**
 * @method setFontSize
 * @param {int} arg0
 */
setFontSize : function (
int 
)
{
},

/**
 * @method getBackgroundSprite
 * @return {ccui.Scale9Sprite}
 */
getBackgroundSprite : function (
)
{
    return ccui.Scale9Sprite;
},

/**
 * @method setPlaceholderFontName
 * @param {char} arg0
 */
setPlaceholderFontName : function (
char 
)
{
},

/**
 * @method getPlaceHolder
 * @return {char}
 */
getPlaceHolder : function (
)
{
    return 0;
},

/**
 * @method setFontName
 * @param {char} arg0
 */
setFontName : function (
char 
)
{
},

/**
 * @method setText
 * @param {char} arg0
 */
setText : function (
char 
)
{
},

/**
 * @method setPlaceholderFontSize
 * @param {int} arg0
 */
setPlaceholderFontSize : function (
int 
)
{
},

/**
 * @method setInputMode
 * @param {ccui.EditBox::InputMode} arg0
 */
setInputMode : function (
inputmode 
)
{
},

/**
 * @method setPlaceholderFontColor
* @param {color4b_object|color3b_object} color4b
*/
setPlaceholderFontColor : function(
color3b 
)
{
},

/**
 * @method setFontColor
* @param {color4b_object|color3b_object} color4b
*/
setFontColor : function(
color3b 
)
{
},

/**
 * @method setPlaceholderFont
 * @param {char} arg0
 * @param {int} arg1
 */
setPlaceholderFont : function (
char, 
int 
)
{
},

/**
 * @method initWithSizeAndBackgroundSprite
* @param {size_object|size_object} size
* @param {ccui.Scale9Sprite|String} scale9sprite
* @param {ccui.Widget::TextureResType} texturerestype
* @return {bool|bool}
*/
initWithSizeAndBackgroundSprite : function(
size,
str,
texturerestype 
)
{
    return false;
},

/**
 * @method setPlaceHolder
 * @param {char} arg0
 */
setPlaceHolder : function (
char 
)
{
},

/**
 * @method setReturnType
 * @param {ccui.EditBox::KeyboardReturnType} arg0
 */
setReturnType : function (
keyboardreturntype 
)
{
},

/**
 * @method setInputFlag
 * @param {ccui.EditBox::InputFlag} arg0
 */
setInputFlag : function (
inputflag 
)
{
},

/**
 * @method getMaxLength
 * @return {int}
 */
getMaxLength : function (
)
{
    return 0;
},

/**
 * @method setMaxLength
 * @param {int} arg0
 */
setMaxLength : function (
int 
)
{
},

/**
 * @method setFont
 * @param {char} arg0
 * @param {int} arg1
 */
setFont : function (
char, 
int 
)
{
},

/**
 * @method create
* @param {size_object|size_object} size
* @param {String|ccui.Scale9Sprite} str
* @param {ccui.Widget::TextureResType|ccui.Scale9Sprite} texturerestype
* @param {ccui.Scale9Sprite} scale9sprite
* @return {ccui.EditBox|ccui.EditBox}
*/
create : function(
size,
scale9sprite,
scale9sprite,
scale9sprite 
)
{
    return ccui.EditBox;
},

/**
 * @method EditBox
 * @constructor
 */
EditBox : function (
)
{
},

};
