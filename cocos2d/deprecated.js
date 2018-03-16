/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


var js = cc.js;

if (CC_DEV) {
    // cc.isChildClassOf
    js.get(cc, 'isChildClassOf', function () {
        cc.errorID(1400, 'cc.isChildClassOf', 'cc.js.isChildClassOf');
        return cc.js.isChildClassOf;
    });

    // cc.spriteFrameCache
    js.get(cc, "spriteFrameCache", function () {
        cc.errorID(1404);
    });

    js.get(cc, 'textureCache', function () {
        cc.errorID(1406, 'cc', 'textureCache');
    });

    // cc.pool
    js.get(cc, 'pool', function () {
        cc.errorID(1407);
        return js.Pool;
    });

    // Texture
    js.obsolete(cc.Texture2D.prototype, 'texture.releaseTexture', 'texture.destroy');

    js.get(cc.Texture2D.prototype, 'getName', function () {
        cc.warnID(1400, 'texture.getName()', 'texture._glID');
        return function () {
            return this._glID || null;
        };
    });

    js.get(cc.Texture2D.prototype, 'isLoaded', function () {
        cc.errorID(1400, 'texture.isLoaded function', 'texture.loaded property');
        return (function () {
            return this.loaded;
        });
    });

    // SpriteFrame
    js.get(cc.SpriteFrame.prototype, '_textureLoaded', function () {
        cc.errorID(1400, 'spriteFrame._textureLoaded', 'spriteFrame.textureLoaded()');
        return this.textureLoaded();
    });

    function deprecateEnum (obj, oldPath, newPath, hasTypePrefixBefore) {
        if (!CC_SUPPORT_JIT) {
            return;
        }
        hasTypePrefixBefore = hasTypePrefixBefore !== false;
        var enumDef = Function('return ' + newPath)();
        var entries = cc.Enum.getList(enumDef);
        var delimiter = hasTypePrefixBefore ? '_' : '.';
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i].name;
            var oldPropName;
            if (hasTypePrefixBefore) {
                var oldTypeName = oldPath.split('.').slice(-1)[0];
                oldPropName = oldTypeName + '_' + entry;
            }
            else {
                oldPropName = entry;
            }
            js.get(obj, oldPropName, function (entry) {
                cc.errorID(1400, oldPath + delimiter + entry, newPath + '.' + entry);
                return enumDef[entry];
            }.bind(null, entry));
        }
    }

    function markAsRemoved (ownerCtor, removedProps, ownerName) {
        if (!ownerCtor) {
            // 可能被裁剪了
            return;
        }
        ownerName = ownerName || js.getClassName(ownerCtor);
        removedProps.forEach(function (prop) {
            function error () {
                cc.errorID(1406, ownerName, prop);
            }
            js.getset(ownerCtor.prototype, prop, error, error);
        });
    }

    function markAsRemovedInObject (ownerObj, removedProps, ownerName) {
        if (!ownerObj) {
            // 可能被裁剪了
            return;
        }
        removedProps.forEach(function (prop) {
            function error () {
                cc.errorID(1406, ownerName, prop);
            }
            js.getset(ownerObj, prop, error);
        });
    }

    function provideClearError (owner, obj, ownerName) {
        if (!owner) {
            // 可能被裁剪了
            return;
        }
        var className = ownerName || cc.js.getClassName(owner);
        var Info = 'Sorry, ' + className + '.%s is removed, please use %s instead.';
        for (var prop in obj) {
            function define (prop, getset) {
                function accessor (newProp) {
                    cc.error(Info, prop, newProp);
                }
                if (!Array.isArray(getset)) {
                    getset = getset.split(',')
                        .map(function (x) {
                            return x.trim();
                        });
                }
                try {
                    js.getset(owner, prop, accessor.bind(null, getset[0]), getset[1] && accessor.bind(null, getset[1]));
                }
                catch (e) {}
            }
            var getset = obj[prop];
            if (prop[0] === '*') {
                // get set
                var etProp = prop.slice(1);
                define('g' + etProp, getset);
                define('s' + etProp, getset);
            }
            else {
                prop.split(',')
                    .map(function (x) {
                        return x.trim();
                    })
                    .forEach(function (x) {
                        define(x, getset);
                    });
            }
        }
    }

    function markFunctionWarning (ownerCtor, obj, ownerName) {
        if (!ownerCtor) {
            // 可能被裁剪了
            return;
        }
        ownerName = ownerName || js.getClassName(ownerCtor);
        for (var prop in obj) {
            (function(){
                var originFunc = ownerCtor[prop];
                if (!originFunc) return;

                function warn () {
                    cc.warn('Sorry, %s.%s is deprecated. Please use %s instead', ownerName, prop, obj[prop]);
                    return originFunc.apply(this, arguments);
                }
                
                ownerCtor[prop] = warn;
            })();
        }
    }

    // cc.macro
    markAsRemovedInObject(cc.macro, [
        'ENABLE_GL_STATE_CACHE',
        'FIX_ARTIFACTS_BY_STRECHING_TEXEL',
    ]);

    provideClearError(cc.macro, {
        PI: 'Math.PI',
        PI2: 'Math.PI*2',
        FLT_MAX: 'Number.MAX_VALUE',
        FLT_MIN: 'Number.MIN_VALUE',
        UINT_MAX: 'Number.MAX_SAFE_INTEGER'
    });

    // cc.Director
    provideClearError(cc.Director, {
        EVENT_PROJECTION_CHANGED: '',
        EVENT_BEFORE_VISIT: 'EVENT_AFTER_UPDATE',
        EVENT_AFTER_VISIT: 'EVENT_BEFORE_DRAW',
    });

    // cc.PhysicsManager
    markAsRemoved(cc.PhysicsManager, [
        'attachDebugDrawToCamera',
        'detachDebugDrawFromCamera',
    ]);

    // cc.CollisionManager
    markAsRemoved(cc.CollisionManager, [
        'attachDebugDrawToCamera',
        'detachDebugDrawFromCamera',
    ]);

    // cc.Node
    markAsRemoved(cc._BaseNode, [
        'tag',
        'getChildByTag',
        'removeChildByTag'
    ]);

    markAsRemoved(cc.Node, [
        '_cascadeColorEnabled',
        'cascadeColor',
        'isCascadeColorEnabled',
        'setCascadeColorEnabled',
        '_cascadeOpacityEnabled',
        'cascadeOpacity',
        'isCascadeOpacityEnabled',
        'setCascadeOpacityEnabled',
        'opacityModifyRGB',
        'isOpacityModifyRGB',
        'setOpacityModifyRGB',
        'ignoreAnchor',
        'isIgnoreAnchorPointForPosition',
        'ignoreAnchorPointForPosition',
        'isRunning',
    ]);

    markFunctionWarning(cc.Node.prototype, {
        getNodeToParentTransform: 'getLocalMatrix',
        getNodeToParentTransformAR: 'getLocalMatrix',
        getNodeToWorldTransform: 'getWorldMatrix',
        getNodeToWorldTransformAR: 'getWorldMatrix',
        getParentToNodeTransform: 'getLocalMatrix',
        getWorldToNodeTransform: 'getWorldMatrix',
        convertTouchToNodeSpace: 'convertToNodeSpace',
        convertTouchToNodeSpaceAR: 'convertToNodeSpaceAR',
    });

    provideClearError(cc.Node.prototype, {
        getRotationX: 'rotationX',
        setRotationX: 'rotationX',
        getRotationY: 'rotationY',
        setRotationY: 'rotationY',
        getPositionX: 'x',
        setPositionX: 'x',
        getPositionY: 'y',
        setPositionY: 'y',
        getSkewX: 'skewX',
        setSkewX: 'skewX',
        getSkewY: 'skewY',
        setSkewY: 'skewY',
        getOpacity: 'opacity',
        setOpacity: 'opacity',
        getColor: 'color',
        setColor: 'color',
        getLocalZOrder: 'zIndex',
        setLocalZOrder: 'zIndex',
    });

    // cc.Component
    markAsRemoved(cc.Component, [
        'isRunning',
    ]);

    // cc.Camera
    markFunctionWarning(cc.Camera.prototype, {
        getNodeToCameraTransform: 'getWorldToCameraMatrix'
    });

    markAsRemoved(cc.Camera, [
        'addTarget',
        'removeTarget',
        'getTargets'
    ]);

    // SCENE
    var ERR = '"%s" is not defined in the Scene, it is only defined in normal nodes.';
    Object.defineProperties(cc.Scene.prototype, {
        active: {
            get: function () {
                cc.error(ERR, 'active');
                return true;
            },
            set: function () {
                cc.error(ERR, 'active');
            }
        },
        activeInHierarchy: {
            get: function () {
                cc.error(ERR, 'activeInHierarchy');
                return true;
            },
        },
        getComponent: {
            get: function () {
                cc.error(ERR, 'getComponent');
                return function () {
                    return null;
                };
            }
        },
        addComponent: {
            get: function () {
                cc.error(ERR, 'addComponent');
                return function () {
                    return null;
                };
            }
        },
    });

    // dragon bones
    if (typeof dragonBones !== 'undefined') {
        js.obsolete(dragonBones.CCFactory, 'dragonBones.CCFactory.getFactory', 'getInstance');
    }
}
