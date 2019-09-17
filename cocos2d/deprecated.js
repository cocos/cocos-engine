/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

if (CC_DEBUG) {

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

    function markAsDeprecated (ownerCtor, deprecatedProps, ownerName) {
        if (!ownerCtor) {
            return;
        }
        ownerName = ownerName || js.getClassName(ownerCtor);
        let descriptors = Object.getOwnPropertyDescriptors(ownerCtor.prototype);
        deprecatedProps.forEach(function (prop) {
            let deprecatedProp = prop[0];
            let newProp = prop[1];
            let descriptor = descriptors[deprecatedProp];
            js.getset(ownerCtor.prototype, deprecatedProp, function () {
                cc.warnID(1400, `${ownerName}.${deprecatedProp}`, `${ownerName}.${newProp}`);
                return descriptor.get.call(this);
            }, function (v) {
                cc.warnID(1400, `${ownerName}.${deprecatedProp}`, `${ownerName}.${newProp}`);
                descriptor.set.call(this, v);
            });
        })
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
                var propName = prop;
                var originFunc = ownerCtor[propName];
                if (!originFunc) return;

                function warn () {
                    cc.warn('Sorry, %s.%s is deprecated. Please use %s instead', ownerName, propName, obj[propName]);
                    return originFunc.apply(this, arguments);
                }

                ownerCtor[propName] = warn;
            })();
        }
    }
    // remove cc.info
    js.get(cc, 'info', function () {
        cc.warnID(1400, 'cc.info', 'cc.log');
        return cc.log;
    });
    // cc.spriteFrameCache
    js.get(cc, "spriteFrameCache", function () {
        cc.errorID(1404);
    });

    // SpriteFrame
    js.get(cc.SpriteFrame.prototype, '_textureLoaded', function () {
        cc.errorID(1400, 'spriteFrame._textureLoaded', 'spriteFrame.textureLoaded()');
        return this.textureLoaded();
    });
    markAsRemoved(cc.SpriteFrame, [
        'addLoadedEventListener'
    ]);
    markFunctionWarning(cc.Sprite.prototype, {
        setState: 'cc.Sprite.setMaterial',
        getState: 'cc.Sprite.getMaterial'
    }, 'cc.Sprite');

    js.get(cc.SpriteFrame.prototype, 'clearTexture', function () {
        cc.warnID(1406, 'cc.SpriteFrame', 'clearTexture');
        return function () {};
    });

    // cc.textureCache
    js.get(cc, 'textureCache', function () {
        cc.errorID(1406, 'cc', 'textureCache');
    });

    // Texture
    let Texture2D = cc.Texture2D;
    js.obsolete(Texture2D.prototype, 'texture.releaseTexture', 'texture.destroy');

    js.get(Texture2D.prototype, 'getName', function () {
        cc.warnID(1400, 'texture.getName()', 'texture._glID');
        return function () {
            return this._glID || null;
        };
    });

    js.get(Texture2D.prototype, 'isLoaded', function () {
        cc.errorID(1400, 'texture.isLoaded function', 'texture.loaded property');
        return (function () {
            return this.loaded;
        });
    });

    js.get(Texture2D.prototype, 'setAntiAliasTexParameters', function () {
        cc.warnID(1400, 'texture.setAntiAliasTexParameters()', 'texture.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR)');
        return function () {
            this.setFilters(Texture2D.Filter.LINEAR, Texture2D.Filter.LINEAR);
        };
    });

    js.get(Texture2D.prototype, 'setAliasTexParameters', function () {
        cc.warnID(1400, 'texture.setAntiAliasTexParameters()', 'texture.setFilters(cc.Texture2D.Filter.NEAREST, cc.Texture2D.Filter.NEAREST)');
        return function () {
            this.setFilters(Texture2D.Filter.NEAREST, Texture2D.Filter.NEAREST);
        };
    });

    // cc.macro
    markAsRemovedInObject(cc.macro, [
        'ENABLE_GL_STATE_CACHE',
        'FIX_ARTIFACTS_BY_STRECHING_TEXEL',
    ], 'cc.macro');

    provideClearError(cc.macro, {
        PI: 'Math.PI',
        PI2: 'Math.PI*2',
        FLT_MAX: 'Number.MAX_VALUE',
        FLT_MIN: 'Number.MIN_VALUE',
        UINT_MAX: 'Number.MAX_SAFE_INTEGER'
    }, 'cc.macro');

    // cc.game
    markAsRemovedInObject(cc.game, [
        'CONFIG_KEY',
    ], 'cc.game');

    // cc.sys
    markAsRemovedInObject(cc.sys, [
        'dumpRoot',
        'cleanScript',
    ], 'cc.sys');

    // cc.Director
    provideClearError(cc.Director, {
        EVENT_PROJECTION_CHANGED: '',
        EVENT_BEFORE_VISIT: 'EVENT_AFTER_UPDATE',
        EVENT_AFTER_VISIT: 'EVENT_BEFORE_DRAW',
    }, 'cc.Director');
    markFunctionWarning(cc.Director.prototype, {
        convertToGL: 'cc.view.convertToLocationInView',
        convertToUI: '',
        getWinSize: 'cc.winSize',
        getWinSizeInPixels: 'cc.winSize',
        getVisibleSize: 'cc.view.getVisibleSize',
        getVisibleOrigin: 'cc.view.getVisibleOrigin',
        purgeCachedData: 'cc.assetManager.releaseAll',
        setDepthTest: 'cc.Camera.main.depth',
        setClearColor: 'cc.Camera.main.backgroundColor',
        getRunningScene: 'cc.director.getScene',
        getAnimationInterval: 'cc.game.getFrameRate',
        setAnimationInterval: 'cc.game.setFrameRate',
        isDisplayStats: 'cc.debug.isDisplayStats',
        setDisplayStats: 'cc.debug.setDisplayStats',
        stopAnimation: 'cc.game.pause',
        startAnimation: 'cc.game.resume',
    }, 'cc.Director');
    markAsRemoved(cc.Director, [
        'pushScene',
        'popScene',
        'popToRootScene',
        'popToSceneStackLevel',
        'setProjection',
        'getProjection',
    ], 'cc.Director');

    // Scheduler
    provideClearError(cc.Scheduler, {
        scheduleCallbackForTarget: 'schedule',
        scheduleUpdateForTarget: 'scheduleUpdate',
        unscheduleCallbackForTarget: 'unschedule',
        unscheduleUpdateForTarget: 'unscheduleUpdate',
        unscheduleAllCallbacksForTarget: 'unscheduleAllForTarget',
        unscheduleAllCallbacks: 'unscheduleAll',
        unscheduleAllCallbacksWithMinPriority: 'unscheduleAllWithMinPriority'
    }, 'cc.Scheduler');

    // cc.view
    provideClearError(cc.view, {
        adjustViewPort: 'adjustViewportMeta',
        setViewPortInPoints: 'setViewportInPoints',
        getViewPortRect: 'getViewportRect'
    }, 'cc.view');
    markAsRemovedInObject(cc.view, [
        'isViewReady',
        'setTargetDensityDPI',
        'getTargetDensityDPI',
        'setFrameZoomFactor',
        'canSetContentScaleFactor',
        'setContentTranslateLeftTop',
        'getContentTranslateLeftTop',
        'setViewName',
        'getViewName'
    ], 'cc.view');

    // Loader
    markAsRemoved(cc.Pipeline, [
        'flowInDeps',
        'getItems'
    ], 'cc.loader');

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
    provideClearError(cc._BaseNode.prototype, {
        'tag': 'name',
        'getTag': 'name',
        'setTag': 'name',
        'getChildByTag': 'getChildByName',
        'removeChildByTag': 'getChildByName(name).destroy()'
    });

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
        '_sgNode',
    ]);

    markFunctionWarning(cc.Node.prototype, {
        getNodeToParentTransform: 'getLocalMatrix',
        getNodeToParentTransformAR: 'getLocalMatrix',
        getNodeToWorldTransform: 'getWorldMatrix',
        getNodeToWorldTransformAR: 'getWorldMatrix',
        getParentToNodeTransform: 'getLocalMatrix',
        getWorldToNodeTransform: 'getWorldMatrix',
        convertTouchToNodeSpace: 'convertToNodeSpaceAR',
        convertTouchToNodeSpaceAR: 'convertToNodeSpaceAR',
        convertToWorldSpace: 'convertToWorldSpaceAR',
        convertToNodeSpace: 'convertToNodeSpaceAR'
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
        getScaleX: 'scaleX',
        setScaleX: 'scaleX',
        getScaleY: 'scaleY',
        setScaleY: 'scaleY',
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

    provideClearError(cc.Sprite.prototype, {
        setInsetLeft: 'cc.SpriteFrame insetLeft',
        setInsetRight: 'cc.SpriteFrame insetRight',
        setInsetTop: 'cc.SpriteFrame insetTop',
        setInsetBottom: 'cc.SpriteFrame insetBottom',
    });

    // cc.Camera
    markFunctionWarning(cc.Camera.prototype, {
        getNodeToCameraTransform: 'getWorldToScreenMatrix2D',
        getCameraToWorldPoint: 'getScreenToWorldPoint',
        getWorldToCameraPoint: 'getWorldToScreenPoint',
        getCameraToWorldMatrix: 'getScreenToWorldMatrix2D',
        getWorldToCameraMatrix: 'getWorldToScreenMatrix2D'
    });

    markAsRemoved(cc.Camera, [
        'addTarget',
        'removeTarget',
        'getTargets'
    ]);

    // SCENE
    var ERR = '"%s" is not defined in the Scene, it is only defined in normal nodes.';
    CC_EDITOR || Object.defineProperties(cc.Scene.prototype, {
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

    // Value types
    provideClearError(cc, {
        // AffineTransform
        affineTransformMake: 'cc.AffineTransform.create',
        affineTransformMakeIdentity: 'cc.AffineTransform.identity',
        affineTransformClone: 'cc.AffineTransform.clone',
        affineTransformConcat: 'cc.AffineTransform.concat',
        affineTransformConcatIn: 'cc.AffineTransform.concat',
        affineTransformInvert: 'cc.AffineTransform.invert',
        affineTransformInvertIn: 'cc.AffineTransform.invert',
        affineTransformInvertOut: 'cc.AffineTransform.invert',
        affineTransformEqualToTransform: 'cc.AffineTransform.equal',
        pointApplyAffineTransform: 'cc.AffineTransform.transformVec2',
        sizeApplyAffineTransform: 'cc.AffineTransform.transformSize',
        rectApplyAffineTransform: 'cc.AffineTransform.transformRect',
        obbApplyAffineTransform: 'cc.AffineTransform.transformObb',

        // Vec2
        pointEqualToPoint: 'cc.Vec2 equals',

        // Size
        sizeEqualToSize: 'cc.Size equals',

        // Rect
        rectEqualToRect: 'rectA.equals(rectB)',
        rectContainsRect: 'rectA.containsRect(rectB)',
        rectContainsPoint: 'rect.contains(vec2)',
        rectOverlapsRect: 'rectA.intersects(rectB)',
        rectIntersectsRect: 'rectA.intersects(rectB)',
        rectIntersection: 'rectA.intersection(intersection, rectB)',
        rectUnion: 'rectA.union(union, rectB)',
        rectGetMaxX: 'rect.xMax',
        rectGetMidX: 'rect.center.x',
        rectGetMinX: 'rect.xMin',
        rectGetMaxY: 'rect.yMax',
        rectGetMidY: 'rect.center.y',
        rectGetMinY: 'rect.yMin',

        // Color
        colorEqual: 'colorA.equals(colorB)',
        hexToColor: 'color.fromHEX(hexColor)',
        colorToHex: 'color.toHEX()',

        // Enums
        TextAlignment: 'cc.macro.TextAlignment',
        VerticalTextAlignment: 'cc.macro.VerticalTextAlignment',

        // Point Extensions
        pNeg: 'p.neg()',
        pAdd: 'p1.add(p2)',
        pSub: 'p1.sub(p2)',
        pMult: 'p.mul(factor)',
        pMidpoint: 'p1.add(p2).mul(0.5)',
        pDot: 'p1.dot(p2)',
        pCross: 'p1.cross(p2)',
        pPerp: 'p.rotate(-90 * Math.PI / 180)',
        pRPerp: 'p.rotate(90 * Math.PI / 180)',
        pProject: 'p1.project(p2)',
        pLengthSQ: 'p.magSqr()',
        pDistanceSQ: 'p1.sub(p2).magSqr()',
        pLength: 'p.mag()',
        pDistance: 'p1.sub(p2).mag()',
        pNormalize: 'p.normalize()',
        pForAngle: 'cc.v2(Math.cos(a), Math.sin(a))',
        pToAngle: 'Math.atan2(v.y, v.x)',
        pZeroIn: 'p.x = p.y = 0',
        pIn: 'p1.set(p2)',
        pMultIn: 'p.mulSelf(factor)',
        pSubIn: 'p1.subSelf(p2)',
        pAddIn: 'p1.addSelf(p2)',
        pNormalizeIn: 'p.normalizeSelf()',
        pSameAs: 'p1.equals(p2)',
        pAngle: 'v1.angle(v2)',
        pAngleSigned: 'v1.signAngle(v2)',
        pRotateByAngle: 'p.rotate(radians)',
        pCompMult: 'v1.dot(v2)',
        pFuzzyEqual: 'v1.fuzzyEquals(v2, tolerance)',
        pLerp: 'p.lerp(endPoint, ratio)',
        pClamp: 'p.clampf(min_inclusive, max_inclusive)',

        rand: 'Math.random() * 0xffffff',
        randomMinus1To1: '(Math.random() - 0.5) * 2',

        container: 'cc.game.container',
        _canvas: 'cc.game.canvas',
        _renderType: 'cc.game.renderType',

        _getError: 'cc.debug.getError',
        _initDebugSetting: 'cc.debug._resetDebugSetting',
        DebugMode: 'cc.debug.DebugMode',
    }, 'cc');
    markAsRemovedInObject(cc, [
        'blendFuncDisable',

        'pFromSize',
        'pCompOp',
        'pIntersectPoint',
        'pSegmentIntersect',
        'pLineIntersect',

        'obbApplyMatrix',

        'getImageFormatByData',

        'initEngine',
    ], 'cc');
    markFunctionWarning(cc, {
        // cc.p
        p: 'cc.v2'
    }, 'cc');
    // cc.Rect
    provideClearError(cc.Rect, {
        contain: 'rectA.contains(rectB)',
        transformMat4: 'rect.transformMat4(out, mat4)'
    });
    // cc.Color
    provideClearError(cc.Color, {
        rgb2hsv: 'color.toHSV()',
        hsv2rgb: 'color.fromHSV(h, s, v)'
    });

    // macro functions
    js.get(cc, 'lerp', function () {
        cc.warnID(1400, 'cc.lerp', 'cc.misc.lerp');
        return cc.misc.lerp;
    });
    js.get(cc, 'random0To1', function () {
        cc.warnID(1400, 'cc.random0To1', 'Math.random');
        return Math.random;
    });
    js.get(cc, 'degreesToRadians', function () {
        cc.warnID(1400, 'cc.degreesToRadians', 'cc.misc.degreesToRadians');
        return cc.misc.degreesToRadians;
    });
    js.get(cc, 'radiansToDegrees', function () {
        cc.warnID(1400, 'cc.radiansToDegrees', 'cc.misc.radiansToDegrees');
        return cc.misc.radiansToDegrees;
    });
    js.get(cc, 'clampf', function () {
        cc.warnID(1400, 'cc.clampf', 'cc.misc.clampf');
        return cc.misc.clampf;
    });
    js.get(cc, 'clamp01', function () {
        cc.warnID(1400, 'cc.clamp01', 'cc.misc.clamp01');
        return cc.misc.clamp01;
    });
    js.get(cc, 'ImageFormat', function () {
        cc.warnID(1400, 'cc.ImageFormat', 'cc.macro.ImageFormat');
        return cc.macro.ImageFormat;
    });
    js.get(cc, 'KEY', function () {
        cc.warnID(1400, 'cc.KEY', 'cc.macro.KEY');
        return cc.macro.KEY;
    });
    js.get(cc, 'Easing', function () {
        cc.warnID(1400, 'cc.Easing', 'cc.easing');
        return cc.easing;
    });

    // cc.pool
    js.get(cc, 'pool', function () {
        cc.errorID(1407);
        return js.Pool;
    });

    // cc.isChildClassOf
    js.get(cc, 'isChildClassOf', function () {
        cc.errorID(1400, 'cc.isChildClassOf', 'cc.js.isChildClassOf');
        return cc.js.isChildClassOf;
    });

    // dragon bones
    if (typeof dragonBones !== 'undefined') {
        js.obsolete(dragonBones.CCFactory, 'dragonBones.CCFactory.getFactory', 'getInstance');
    }

    // renderEngine
    cc.renderer.renderEngine = {
        get gfx () {
            cc.warnID(1400, 'cc.renderer.renderEngine.gfx', 'cc.gfx');
            return cc.gfx;
        },
        get math () {
            cc.warnID(1400, 'cc.renderer.renderEngine.math', 'cc.vmath');
            return cc.vmath;
        },
        get InputAssembler () {
            cc.warnID(1400, 'cc.renderer.renderEngine.InputAssembler', 'cc.renderer.InputAssembler');
            return cc.renderer.InputAssembler;
        }
    };
}
