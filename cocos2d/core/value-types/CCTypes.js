/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2015 Chukong Technologies Inc.

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

/**
 * !#en the device accelerometer reports values for each axis in units of g-force.
 * !#zh 设备重力传感器传递的各个轴的数据。
 * @class Acceleration
 *
 */
/**
 * @method constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} timestamp
 */
cc.Acceleration = function (x, y, z, timestamp) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.timestamp = timestamp || 0;
};

/**
 * !#en Blend Function used for textures.
 * !#zh 图像的混合方式。
 * @class BlendFunc
 * @Constructor
 */
/**
 * @method constructor
 * @param {Number} src1 source blend function
 * @param {Number} dst1 destination blend function
 */
cc.BlendFunc = function (src1, dst1) {
    this.src = src1;
    this.dst = dst1;
};

/**
 * !#en
 * Enum for blend factor
 * Refer to: http://www.andersriggelsen.dk/glblendfunc.php
 * !#zh
 * 混合因子
 * 可参考: http://www.andersriggelsen.dk/glblendfunc.php
 * @enum BlendFactor
 */
var BlendFactor = cc.Enum({
    /**
     * !#en All use
     * !#zh 全部使用
     * @property {Number} ONE
     */
    ONE:                    1,  //cc.macro.ONE
    /**
     * !#en Not all
     * !#zh 全部不用
     * @property {Number} ZERO
     */
    ZERO:                   0,      //cc.ZERO
    /**
     * !#en Using the source alpha
     * !#zh 使用源颜色的透明度
     * @property {Number} SRC_ALPHA
     */
    SRC_ALPHA:              0x302,  //cc.SRC_ALPHA
    /**
     * !#en Using the source color
     * !#zh 使用源颜色
     * @property {Number} SRC_COLOR
     */
    SRC_COLOR:              0x300,  //cc.SRC_COLOR
    /**
     * !#en Using the target alpha
     * !#zh 使用目标颜色的透明度
     * @property {Number} DST_ALPHA
     */
    DST_ALPHA:              0x304,  //cc.DST_ALPHA
    /**
     * !#en Using the target color
     * !#zh 使用目标颜色
     * @property {Number} DST_COLOR
     */
    DST_COLOR:              0x306,  //cc.DST_COLOR
    /**
     * !#en Minus the source alpha
     * !#zh 减去源颜色的透明度
     * @property {Number} ONE_MINUS_SRC_ALPHA
     */
    ONE_MINUS_SRC_ALPHA:    0x303,  //cc.ONE_MINUS_SRC_ALPHA
    /**
     * !#en Minus the source color
     * !#zh 减去源颜色
     * @property {Number} ONE_MINUS_SRC_COLOR
     */
    ONE_MINUS_SRC_COLOR:    0x301,  //cc.ONE_MINUS_SRC_COLOR
    /**
     * !#en Minus the target alpha
     * !#zh 减去目标颜色的透明度
     * @property {Number} ONE_MINUS_DST_ALPHA
     */
    ONE_MINUS_DST_ALPHA:    0x305,  //cc.ONE_MINUS_DST_ALPHA
    /**
     * !#en Minus the target color
     * !#zh 减去目标颜色
     * @property {Number} ONE_MINUS_DST_COLOR
     */
    ONE_MINUS_DST_COLOR:    0x307,  //cc.ONE_MINUS_DST_COLOR
});

//var BlendFactor = cc;

cc.BlendFunc._disable = function(){
    return new cc.BlendFunc(BlendFactor.ONE, BlendFactor.ZERO);
};
cc.BlendFunc._alphaPremultiplied = function(){
    return new cc.BlendFunc(BlendFactor.ONE, BlendFactor.ONE_MINUS_SRC_ALPHA);
};
cc.BlendFunc._alphaNonPremultiplied = function(){
    return new cc.BlendFunc(BlendFactor.SRC_ALPHA, BlendFactor.ONE_MINUS_SRC_ALPHA);
};
cc.BlendFunc._additive = function(){
    return new cc.BlendFunc(BlendFactor.SRC_ALPHA, BlendFactor.ONE);
};

cc.BlendFunc.BlendFactor = BlendFactor;

/** @expose */
cc.BlendFunc.DISABLE;
cc.js.get(cc.BlendFunc, "DISABLE", cc.BlendFunc._disable);
/** @expose */
cc.BlendFunc.ALPHA_PREMULTIPLIED;
cc.js.get(cc.BlendFunc, "ALPHA_PREMULTIPLIED", cc.BlendFunc._alphaPremultiplied);
/** @expose */
cc.BlendFunc.ALPHA_NON_PREMULTIPLIED;
cc.js.get(cc.BlendFunc, "ALPHA_NON_PREMULTIPLIED", cc.BlendFunc._alphaNonPremultiplied);
/** @expose */
cc.BlendFunc.ADDITIVE;
cc.js.get(cc.BlendFunc, "ADDITIVE", cc.BlendFunc._additive);

/**
 * @method blendFuncDisable
 * @returns {BlendFunc}
 */
cc.blendFuncDisable = cc.BlendFunc._disable;

/*
 * !#en
 * Common usage:</br>
 *
 * var fontDef = new cc.FontDefinition();</br>
 * fontDef.fontName = "Arial";</br>
 * fontDef.fontSize = 12;</br>
 * ...</br>
 *
 * OR using inline definition usefull for constructor injection</br>
 *
 * var fontDef = new cc.FontDefinition({ </br>
 *  fontName: "Arial", </br>
 *  fontSize: 12 </br>
 * });</br>
 *
 * !#zh
 * 常见用法：</br>
 * var fontDef = new cc.FontDefinition();</br>
 * fontDef.fontName = "Arial"; </br>
 * fontDef.fontSize = 12; </br>
 * ... </br>
 *
 * 或使用定义构造函数：</br>
 *
 * var fontDef = new cc.FontDefinition({ </br>
 *  fontName: "Arial", </br>
 *  fontSize: 12 </br>
 * });
 *
 * @class FontDefinition
 *
 */
/*
 * !#en TODO
 * !#zh 定义字体基本属性的结构体。
 * @method FontDefinition
 * @param {Object} properties - (OPTIONAL) Allow inline FontDefinition
 * @return {FontDefinition}
 */
cc.FontDefinition = function (properties) {
    var _t = this;
    _t.fontName = "Arial";
    _t.fontSize = 12;
    _t.textAlign = cc.TextAlignment.CENTER;
    _t.verticalAlign = cc.VerticalTextAlignment.TOP;
    _t.fillStyle = cc.color(255, 255, 255, 255);
    _t.boundingWidth = 0;
    _t.boundingHeight = 0;

    _t.strokeEnabled = false;
    _t.strokeStyle = cc.color(255, 255, 255, 255);
    _t.lineWidth = 1;
    _t.lineHeight = "normal";
    _t.fontStyle = "normal";
    _t.fontWeight = "normal";

    _t.shadowEnabled = false;
    _t.shadowOffsetX = 0;
    _t.shadowOffsetY = 0;
    _t.shadowBlur = 0;
    _t.shadowOpacity = 1.0;

    //properties mapping:
    if(properties && properties instanceof Object){
         for(var key in properties){
             _t[key] = properties[key];
         }
    }
};
/**
 * Web ONLY
 * */
cc.FontDefinition.prototype._getCanvasFontStr = function(){
    var lineHeight = !this.lineHeight.charAt ? this.lineHeight+"px" : this.lineHeight;
    return this.fontStyle + " " + this.fontWeight + " " + this.fontSize + "px/"+lineHeight+" '" + this.fontName + "'";
};

/**
 * @enum TextAlignment
 */

cc.TextAlignment = cc.Enum({
    /**
     * @property {Number} LEFT
     */
    LEFT: 0,
    /**
     * @property {Number} CENTER
     */
    CENTER: 1,
    /**
     * @property {Number} RIGHT
     */
    RIGHT: 2
});

cc.VerticalTextAlignment = cc.Enum({
    TOP: 0,
    CENTER: 1,
    BOTTOM: 2
});

cc._Dictionary = cc.Class({

    ctor: function () {
        this._keyMapTb = {};
        this._valueMapTb = {};
        this.__currId = 2 << (0 | (Math.random() * 10));
    },

    __getKey: function () {
        this.__currId++;
        return "key_" + this.__currId;
    },

    setObject: function (value, key) {
        if (key == null)
            return;

        var keyId = this.__getKey();
        this._keyMapTb[keyId] = key;
        this._valueMapTb[keyId] = value;
    },

    objectForKey: function (key) {
        if (key == null)
            return null;

        var locKeyMapTb = this._keyMapTb;
        for (var keyId in locKeyMapTb) {
            if (locKeyMapTb[keyId] === key)
                return this._valueMapTb[keyId];
        }
        return null;
    },

    valueForKey: function (key) {
        return this.objectForKey(key);
    },

    removeObjectForKey: function (key) {
        if (key == null)
            return;

        var locKeyMapTb = this._keyMapTb;
        for (var keyId in locKeyMapTb) {
            if (locKeyMapTb[keyId] === key) {
                delete this._valueMapTb[keyId];
                delete locKeyMapTb[keyId];
                return;
            }
        }
    },

    removeObjectsForKeys: function (keys) {
        if (keys == null)
            return;

        for (var i = 0; i < keys.length; i++)
            this.removeObjectForKey(keys[i]);
    },

    allKeys: function () {
        var keyArr = [], locKeyMapTb = this._keyMapTb;
        for (var key in locKeyMapTb)
            keyArr.push(locKeyMapTb[key]);
        return keyArr;
    },

    removeAllObjects: function () {
        this._keyMapTb = {};
        this._valueMapTb = {};
    },

    count: function () {
        return this.allKeys().length;
    }
});
