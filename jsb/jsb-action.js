/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var ENABLE_GC_FOR_NATIVE_OBJECTS = cc.macro.ENABLE_GC_FOR_NATIVE_OBJECTS;

// Independent Action from retain/release
var actionArr = [
    'ActionEase',
    'EaseExponentialIn',
    'EaseExponentialOut',
    'EaseExponentialInOut',
    'EaseSineIn',
    'EaseSineOut',
    'EaseSineInOut',
    'EaseBounce',
    'EaseBounceIn',
    'EaseBounceOut',
    'EaseBounceInOut',
    'EaseBackIn',
    'EaseBackOut',
    'EaseBackInOut',
    'EaseRateAction',
    'EaseIn',
    'EaseElastic',
    'EaseElasticIn',
    'EaseElasticOut',
    'EaseElasticInOut',
    'RemoveSelf',
    'FlipX',
    'FlipY',
    'Place',
    'CallFunc',
    'DelayTime',
    'Speed',
    'Repeat',
    'RepeatForever',
    'Follow',
    'TargetedAction',
    'ActionInterval',
    'RotateTo',
    'RotateBy',
    'MoveBy',
    'MoveTo',
    'SkewTo',
    'SkewBy',
    'JumpTo',
    'JumpBy',
    'ScaleTo',
    'ScaleBy',
    'Blink',
    'FadeTo',
    'FadeIn',
    'FadeOut',
    'TintTo',
    'TintBy',
];

cc.Action.prototype._getSgTarget = cc.Action.prototype.getTarget;
cc.Action.prototype.getTarget = function () {
    var sgNode = this._getSgTarget();
    return sgNode._owner || sgNode;
};

function setCtorReplacer (proto) {
    var ctor = proto._ctor;
    proto._ctor = function (...args) {
        ctor.apply(this, args);
        this.retain();
        this._retained = true;
    };
}
function setAliasReplacer (name, type) {
    var aliasName = name[0].toLowerCase() + name.substr(1);
    cc[aliasName] = function (...args) {
        var action = type.create.apply(this, args);
        action.retain();
        action._retained = true;
        return action;
    };
}

if (!ENABLE_GC_FOR_NATIVE_OBJECTS) {
    for (var i = 0; i < actionArr.length; ++i) {
        var name = actionArr[i];
        var type = cc[name];
        if (!type) 
            continue;
        var proto = type.prototype;
        setCtorReplacer(proto);
        if (name.indexOf('Ease') === -1) {
            setAliasReplacer(name, type);
        }
    }
}

cc.Sequence.prototype._ctor = function (...args) {
    var paramArray = (args[0] instanceof Array) ? args[0] : args;
    if (paramArray.length === 1) {
        cc.errorID(1019);
        return;
    }
    var last = paramArray.length - 1;
    if ((last >= 0) && (paramArray[last] == null))
        cc.logID(1015);

    if (last >= 0) {
        this.init(paramArray);
    }

    if (!ENABLE_GC_FOR_NATIVE_OBJECTS) {
        this.retain();
        this._retained = true;
    }
};

cc.sequence = function (...args) {
    var paramArray = (args[0] instanceof Array) ? args[0] : args;
    return new cc.Sequence(paramArray);
}

cc.Spawn.prototype._ctor = function (...args) {
    var paramArray = (args[0] instanceof Array) ? args[0] : args;
    if (paramArray.length === 1)
        cc.errorID(1020);
    var last = paramArray.length - 1;
    if ((last >= 0) && (paramArray[last] == null))
        cc.logID(1015);

    if (last >= 0) {
        this.init(paramArray);
    }

    if (!ENABLE_GC_FOR_NATIVE_OBJECTS) {
        this.retain();
        this._retained = true;
    }
};

cc.spawn = function (...args) {
    var paramArray = (args[0] instanceof Array) ? args[0] : args;
    return new cc.Spawn(paramArray);
}

cc.targetedAction = function (target, action) {
    return new cc.TargetedAction(target, action);
};

cc.TargetedAction.prototype._ctor = function(target, action) {
    var node = target._sgNode || target;
    node._owner = target;
    action && this.initWithTarget(node, action);
};

cc.follow = function (followedNode, rect) {
    return new cc.Follow(followedNode._sgNode, rect);
};

cc.Follow.prototype.update = function(dt) {
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.setPosition(target.getPosition());
    }
};

var _FlipX = cc.FlipX;
cc.FlipX = _FlipX.extend({
    _flippedX:false,

    ctor:function(flip){
        _FlipX.prototype.ctor.call(this);
        this.initWithFlipX(flip);
    },

    initWithFlipX:function (flip) {
        this._flippedX = !!flip;
        return true;
    },

    update:function (dt) {
        var target = this._getSgTarget();
        target.scaleX = Math.abs(target.scaleX) * (this._flippedX ? -1 : 1);
    },

    reverse:function () {
        return new cc.FlipX(!this._flippedX);
    },

    clone:function(){
        return new cc.FlipX(this._flippedX);
    }
});

cc.flipX = function (flip) {
    return new cc.FlipX(flip);
};

var _FlipY = cc.FlipY;
cc.FlipY = _FlipY.extend({
    _flippedY:false,

    ctor: function(flip){
        _FlipY.prototype.ctor.call(this);
        this.initWithFlipY(flip);
    },

    initWithFlipY:function (flip) {
        this._flippedY = !!flip;
        return true;
    },

    update:function (dt) {
        var target = this._getSgTarget();
        target.scaleY = Math.abs(target.scaleY) * (this._flippedY ? -1 : 1);
    },

    reverse:function () {
        return new cc.FlipY(!this._flippedY);
    },

    clone:function(){
        return new cc.FlipY(this._flippedY);
    }
});

cc.flipY = function (flip) {
    return new cc.FlipY(flip);
};

function setRendererVisibility (sgNode, toggleVisible, visible) {
    if (!sgNode) { return; }
    var _renderComps = sgNode._owner.getComponentsInChildren(cc._SGComponent);
    for (var i = 0; i < _renderComps.length; ++i) {
        var render = _renderComps[i];
        render.enabled = toggleVisible ? !render.enabled : visible;
    }
}

cc.Show.prototype.update = function (dt) {
    setRendererVisibility(this._getSgTarget(), false, true);
};

cc.Hide.prototype.update = function (dt) {
    setRendererVisibility(this._getSgTarget(), false, false);
};

cc.ToggleVisibility.prototype.update = function (dt) {
    setRendererVisibility(this._getSgTarget(), true);
};

// Special call func
cc.callFunc = function (selector, selectorTarget, data) {
    var callback = function (sender, data) {
        if (sender) {
            sender = sender._owner || sender;
        }
        selector.call(this, sender, data);
    };
    var action = cc.CallFunc.create(callback, selectorTarget, data);
    if (!ENABLE_GC_FOR_NATIVE_OBJECTS) {
        action.retain();
        action._retained = true;
    }
    return action;
};

cc.CallFunc.prototype._ctor = function (selector, selectorTarget, data) {
    if(selector !== undefined){
        var callback = function (sender, data) {
            if (sender) {
                sender = sender._owner || sender;
            }
            selector.call(this, sender, data);
        };
        if(selectorTarget === undefined)
            this.initWithFunction(callback);
        else this.initWithFunction(callback, selectorTarget, data);
    }
    if (!ENABLE_GC_FOR_NATIVE_OBJECTS) {
        this.retain();
        this._retained = true;
    }
};

function setChainFuncReplacer (proto, name) {
    var oldFunc = proto[name];
    proto[name] = function (...args) {
        if (this._retained) {
            this.release();
            this._retained = false;
        }
        var newAction = oldFunc.apply(this, args);
        newAction.retain();
        newAction._retained = true;
        return newAction;
    };
}

if (!ENABLE_GC_FOR_NATIVE_OBJECTS) {
    setChainFuncReplacer(cc.ActionInterval.prototype, 'repeat');
    setChainFuncReplacer(cc.ActionInterval.prototype, 'repeatForever');
    setChainFuncReplacer(cc.ActionInterval.prototype, 'easing');

    var jsbRunAction = cc.Node.prototype.runAction;
    cc.Node.prototype.runAction = function (action) {
        jsbRunAction.call(this, action);
        if (action._retained) {
            action.release();
            action._retained = false;
        }
        return action;
    };
}

function getSGTarget (target) {
    if (target instanceof cc.Component) {
        target = target.node._sgNode;
    }
    else if (target instanceof cc.Node) {
        target = target._sgNode;
    }
    else if (!(target instanceof _ccsg.Node)) {
        target = null;
    }
    return target;
}
var jsbAddAction = cc.ActionManager.prototype.addAction;
cc.ActionManager.prototype.addAction = function (action, target, paused) {
    target = getSGTarget(target);
    if (target) {
        jsbAddAction.call(this, action, target, paused);
        if (!ENABLE_GC_FOR_NATIVE_OBJECTS && action._retained) {
            action.release();
            action._retained = false;
        }
    }
};

function actionMgrFuncReplacer (funcName, targetPos) {
    var proto = cc.ActionManager.prototype;
    var oldFunc = proto[funcName];
    proto[funcName] = function (...args) {
        for (var i = 0; i < args.length; i++) {
            if (i === targetPos)
                args[i] = getSGTarget(args[i]);
        }
        if (!args[targetPos]) {
            return;
        }
        else {
            return oldFunc.apply(this, args);
        }
    };
}

var targetRelatedFuncs = [
    ['removeAllActionsFromTarget', 0],
    ['removeActionByTag', 1],
    ['getActionByTag', 1],
    ['getNumberOfRunningActionsInTarget', 0],
    ['pauseTarget', 0],
    ['resumeTarget', 0]
];

for (var i = 0; i < targetRelatedFuncs.length; ++i) {
    actionMgrFuncReplacer.apply(null, targetRelatedFuncs[i]);
}

cc.ActionManager.prototype.resumeTargets = function (targetsToResume) {
    if (!targetsToResume)
        return;

    for (var i = 0; i< targetsToResume.length; i++) {
        if (targetsToResume[i])
            this.resumeTarget(targetsToResume[i]);
    }
};

cc.ActionManager.prototype.pauseTargets = function (targetsToPause) {
    if (!targetsToPause)
        return;

    for (var i = 0; i< targetsToPause.length; i++) {
        if (targetsToPause[i])
            this.pauseTarget(targetsToPause[i]);
    }
};



function syncPositionUpdate (dt) {
    this._jsbUpdate(dt);
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.x = target.getPositionX();
        target._owner.y = target.getPositionY();
    }
}

function syncRotationUpdate (dt) {
    this._jsbUpdate(dt);
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.rotationX = target.getRotationX();
        target._owner.rotationY = target.getRotationY();
    }
}

function syncScaleUpdate (dt) {
    this._jsbUpdate(dt);
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.scaleX = target.getScaleX();
        target._owner.scaleY = target.getScaleY();
    }
}

function syncRemoveSelfUpdate (dt) {
    this._jsbUpdate(dt);
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.removeFromParent();
    }
}

function syncSkewUpdate (dt) {
    this._jsbUpdate(dt);
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.skewX = target.getSkewX();
        target._owner.skewY = target.getSkewY();
    }
}

function syncOpacityUpdate (dt) {
    this._jsbUpdate(dt);
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.opacity = target.getOpacity();
    }
}

function syncColorUpdate (dt) {
    this._jsbUpdate(dt);
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.color = target.getColor();
    }
}

// Sub classes must be registered before their super class.
// Otherwise, JSB there will be internal Error: "too much recursion".
var actionUpdate = {
    'MoveBy': syncPositionUpdate,
    'JumpBy': syncPositionUpdate,
    'Place': syncPositionUpdate,
    'CardinalSplineTo': syncPositionUpdate,
    'RotateTo': syncRotationUpdate,
    'RotateBy': syncRotationUpdate,
    'ScaleTo': syncScaleUpdate,
    'RemoveSelf': syncRemoveSelfUpdate,
    'SkewTo': syncSkewUpdate,
    'Blink': syncOpacityUpdate,
    'FadeIn': syncOpacityUpdate,
    'FadeOut': syncOpacityUpdate,
    'FadeTo': syncOpacityUpdate,
    'TintTo': syncColorUpdate,
    'TintBy': syncColorUpdate,
    'BezierBy': syncPositionUpdate
};

for (var key in actionUpdate) {
    var action = cc[key];
    action.prototype._jsbUpdate = action.prototype.update;
    action.prototype.update = actionUpdate[key];
}