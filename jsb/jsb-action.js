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
    'Sequence',
    'Spawn',
    'Speed',
    'Repeat',
    'RepeatForever',
    'Follow',
    'TargetedAction',
    'Animate',
    'OrbitCamera',
    'GridAction',
    'ProgressTo',
    'ProgressFromTo',
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

function setCtorReplacer (proto) {
    var ctor = proto._ctor;
    proto._ctor = function () {
        ctor.apply(this, arguments);
        this.retain();
        this._retained = true;
    };
}
function setAliasReplacer (name, type) {
    var aliasName = name[0].toLowerCase() + name.substr(1);
    cc[aliasName] = function () {
        var action = type.create.apply(this, arguments);
        action.retain();
        action._retained = true;
        return action;
    };
}

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

// Special call func
cc.callFunc = function (selector, selectorTarget, data) {
    var callback = function (sender, data) {
        if (sender) {
            sender = sender._owner || sender;
        }
        selector.call(this, sender, data);
    };
    var action = cc.CallFunc.create(callback, selectorTarget, data);
    action.retain();
    action._retained = true;
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
    this.retain();
    this._retained = true;
};

function setChainFuncReplacer (proto, name) {
    var oldFunc = proto[name];
    proto[name] = function () {
        if (this._retained) {
            this.release();
            this._retained = false;
        }
        var newAction = oldFunc.apply(this, arguments);
        newAction.retain();
        newAction._retained = true;
        return newAction;
    };
}

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
};

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
        if (action._retained) {
            action.release();
            action._retained = false;
        }
    }
};

function actionMgrFuncReplacer (funcName, targetPos) {
    var proto = cc.ActionManager.prototype;
    var oldFunc = proto[funcName];
    proto[funcName] = function () {
        arguments[targetPos] = getSGTarget(arguments[targetPos]);
        if (!arguments[targetPos]) {
            return;
        }
        else {
            return oldFunc.apply(this, arguments);
        }
    };
}

var targetRelatedFuncs = [
    ['removeAllActionsFromTarget', 0],
    ['removeActionByTag', 1],
    ['getActionByTag', 1],
    ['numberOfRunningActionsInTarget', 0],
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
    var target = this.getTarget();
    if (target._owner) {
        target._owner.x = target.getPositionX();
        target._owner.y = target.getPositionY();
    }
}

function syncRotationUpdate (dt) {
    this._jsbUpdate(dt);
    var target = this.getTarget();
    if (target._owner) {
        target._owner.rotation = target.getRotation();
    }
}

function syncScaleUpdate (dt) {
    this._jsbUpdate(dt);
    var target = this.getTarget();
    if (target._owner) {
        target._owner.scaleX = target.getScaleX();
        target._owner.scaleY = target.getScaleY();
    }
}

function syncRemoveSelfUpdate (dt) {
    this._jsbUpdate(dt);
    var target = this.getTarget();
    if (target._owner) {
        target._owner.removeFromParent();
    }
}

function syncSkewUpdate (dt) {
    this._jsbUpdate(dt);
    var target = this.getTarget();
    if (target._owner) {
        target._owner.skewX = target.getSkewX();
        target._owner.skewY = target.getSkewY();
    }
}

// function syncOpacityUpdate (dt) {
//     this._jsbUpdate(dt);
//     var target = this.getTarget();
//     if (target._owner) {
//         target._owner.opacity = target.getOpacity();
//     }
// }

function syncColorUpdate (dt) {
    this._jsbUpdate(dt);
    var target = this.getTarget();
    if (target._owner) {
        target._owner.color = target.getColor();
    }
}

var actionUpdate = {
    'MoveTo' : syncPositionUpdate,
    'MoveBy' : syncPositionUpdate,
    'JumpTo' : syncPositionUpdate,
    'JumpBy' : syncPositionUpdate,
    'Place' : syncPositionUpdate,
    'RotateTo' : syncRotationUpdate,
    'RotateBy' : syncRotationUpdate,
    'ScaleTo' : syncScaleUpdate,
    'ScaleBy' : syncScaleUpdate,
    'RemoveSelf' : syncRemoveSelfUpdate,
    'SkewTo' : syncSkewUpdate,
    'SkewBy' : syncSkewUpdate,
    // 'Blink' : syncOpacityUpdate,
    // 'FadeTo' : syncOpacityUpdate,
    // 'FadeIn' : syncOpacityUpdate,
    // 'FadeOut' : syncOpacityUpdate,
    'TintTo' : syncColorUpdate,
    'TintBy' : syncColorUpdate
};

for (var key in actionUpdate) {
    var action = cc[key];
    action.prototype._jsbUpdate = action.prototype.update;
    action.prototype.update = actionUpdate[key];
}