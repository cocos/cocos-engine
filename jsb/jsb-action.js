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

cc.Action.prototype._getSgTarget = cc.Action.prototype.getTarget;
cc.Action.prototype.getTarget = function () {
    var sgNode = this._getSgTarget();
    return sgNode._owner || sgNode;
};

cc.targetedAction = function (target, action) {
    return new cc.TargetedAction(target, action);
};

cc.TargetedAction.prototype._ctor = function(target, action) {
    var node = target._sgNode || target;
    node._owner = target;
    action && this.initWithTarget(node, action);
};

cc.follow = function (followedNode, rect) {
    return new cc.Follow(followedNode, rect);
};

cc.Follow = cc.BaseJSAction.extend({
    _followedNode:null,
    _boundarySet:false,
    _boundaryFullyCovered:false,
    _halfScreenSize:null,
    _fullScreenSize:null,
    _worldRect:null,

    leftBoundary:0.0,
    rightBoundary:0.0,
    topBoundary:0.0,
    bottomBoundary:0.0,

    ctor:function (followedNode, rect) {
        cc.BaseJSAction.prototype.ctor.call(this);
        this._followedNode = null;
        this._boundarySet = false;

        this._boundaryFullyCovered = false;
        this._halfScreenSize = null;
        this._fullScreenSize = null;

        this.leftBoundary = 0.0;
        this.rightBoundary = 0.0;
        this.topBoundary = 0.0;
        this.bottomBoundary = 0.0;
        this._worldRect = cc.rect(0, 0, 0, 0);

        if(followedNode)
            rect ? this.initWithTarget(followedNode, rect)
                : this.initWithTarget(followedNode);
    },

    clone:function () {
        var action = new cc.Follow();
        var locRect = this._worldRect;
        var rect = new cc.Rect(locRect.x, locRect.y, locRect.width, locRect.height);
        action.initWithTarget(this._followedNode, rect);
        return action;
    },

    isBoundarySet:function () {
        return this._boundarySet;
    },

    setBoudarySet:function (value) {
        this._boundarySet = value;
    },

    initWithTarget:function (followedNode, rect) {
        if(!followedNode)
            throw new Error("cc.Follow.initWithAction(): followedNode must be non nil");

        var _this = this;
        rect = rect || cc.rect(0, 0, 0, 0);
        _this._followedNode = followedNode;
        _this._worldRect = rect;

        _this._boundarySet = !cc._rectEqualToZero(rect);

        _this._boundaryFullyCovered = false;

        var winSize = cc.director.getWinSize();
        _this._fullScreenSize = cc.p(winSize.width, winSize.height);
        _this._halfScreenSize = cc.pMult(_this._fullScreenSize, 0.5);

        if (_this._boundarySet) {
            _this.leftBoundary = -((rect.x + rect.width) - _this._fullScreenSize.x);
            _this.rightBoundary = -rect.x;
            _this.topBoundary = -rect.y;
            _this.bottomBoundary = -((rect.y + rect.height) - _this._fullScreenSize.y);

            if (_this.rightBoundary < _this.leftBoundary) {
                _this.rightBoundary = _this.leftBoundary = (_this.leftBoundary + _this.rightBoundary) / 2;
            }
            if (_this.topBoundary < _this.bottomBoundary) {
                _this.topBoundary = _this.bottomBoundary = (_this.topBoundary + _this.bottomBoundary) / 2;
            }

            if ((_this.topBoundary === _this.bottomBoundary) && (_this.leftBoundary === _this.rightBoundary))
                _this._boundaryFullyCovered = true;
        }
        return true;
    },

    step:function (dt) {
        var target = this.getTarget();
        var targetWorldPos = target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var followedWorldPos = this._followedNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var delta = cc.pSub(targetWorldPos, followedWorldPos);
        var tempPos = target.parent.convertToNodeSpaceAR(cc.pAdd(delta, this._halfScreenSize));

        if (this._boundarySet) {
            if (this._boundaryFullyCovered)
                return;

            target.setPosition(cc.clampf(tempPos.x, this.leftBoundary, this.rightBoundary), cc.clampf(tempPos.y, this.bottomBoundary, this.topBoundary));
        } else {
            target.setPosition(tempPos.x, tempPos.y);
        }
    },

    isDone:function () {
        return ( !this._followedNode.isRunning() );
    },

    stop:function () {
        this.setTarget(null);
        cc.Action.prototype.stop.call(this);
    }
});


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
    var callback = function (sender) {
        if (sender) {
            sender = sender._owner || sender;
        }
        selector.call(this, sender, data);
    };
    var action = selectorTarget ? cc.CallFunc.create(callback, selectorTarget) : cc.CallFunc.create(callback);
    return action;
};

cc.CallFunc.prototype._ctor = function (selector, selectorTarget, data) {
    if(selector !== undefined){
        var callback = function (sender) {
            if (sender) {
                sender = sender._owner || sender;
            }
            selector.call(this, sender, data);
        };
        if (selectorTarget === undefined) {
            this.initWithFunction(callback);
        }
        else {
            this.initWithFunction(callback, selectorTarget);
        }
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
    }
};

function actionMgrFuncReplacer (funcName, targetPos) {
    var proto = cc.ActionManager.prototype;
    var oldFunc = proto[funcName];
    proto[funcName] = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            if (i === targetPos)
                args[i] = getSGTarget(arguments[i]);
            else
                args[i] = arguments[i];
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
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.x = target.getPositionX();
        target._owner.y = target.getPositionY();
    }
}

function syncRotationUpdate (dt) {
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.rotationX = target.getRotationX();
        target._owner.rotationY = target.getRotationY();
    }
}

function syncScaleUpdate (dt) {
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.scaleX = target.getScaleX();
        target._owner.scaleY = target.getScaleY();
    }
}

function syncRemoveSelfUpdate (dt) {
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.removeFromParent();
    }
}

function syncSkewUpdate (dt) {
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.skewX = target.getSkewX();
        target._owner.skewY = target.getSkewY();
    }
}

function syncOpacityUpdate (dt) {
    var target = this._getSgTarget();
    if (target._owner) {
        target._owner.opacity = target.getOpacity();
    }
}

function syncColorUpdate (dt) {
    var target = this._getSgTarget();
    if (target._owner) {
        var color = target.getColor();
        target._owner.color = color;
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
    action.prototype.update = actionUpdate[key];
}