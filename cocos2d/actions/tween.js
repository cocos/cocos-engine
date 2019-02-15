
let TweenAction = cc.Class({
    name: 'TweenAction',
    extends: cc.ActionInterval,

    ctor (duration, props, opts) {
        this._opts = opts = opts || Object.create(null);
        this._props = Object.create(null);

        // global easing or progress used for this action
        opts.progress = opts.progress || this.progress;
        if (opts.easing && typeof opts.easing === 'string') {
            opts.easing = cc.easing[opts.easing];
        }

        for (let name in props) {
            let value = props[name];

            // property may have custom easing or progress function
            let easing, progress;
            if (value.value && (value.easing || value.progress)) {
                easing = typeof value.easing === 'string' ? cc.easing[value.easing] : value.easing;
                progress = value.progress;
                value = value.value;
            }

            let isNumber = typeof value === 'number';
            if (!isNumber && (!value.lerp || (!value.add && !value.mul) || !value.clone)) {
                cc.warn(`Can not animate ${name} property, because it do not have [lerp, (add|mul), clone] function.`);
                continue;
            }

            let prop = Object.create(null);
            prop.value = value;
            prop.easing = easing;
            prop.progress = progress;
            this._props[name] = prop;
        }

        this._originProps = props;
        this.initWithDuration(duration);
    },

    clone () {
        var action = new TweenAction(this._duration, this._originProps, this._opts);
        this._cloneDecoration(action);
        return action;
    },

    startWithTarget (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);

        let relative = !!this._opts.relative;
        let props = this._props;
        for (let name in props) {
            let value = target[name];
            let prop = props[name];
            
            if (typeof value === 'number') {
                prop.start = value;
                prop.current = value;
                prop.end = relative ? value + prop.value : prop.value;
            }
            else {
                prop.start = value.clone();
                prop.current = value.clone();
                prop.end = relative ? (value.add || value.mul).call(value, prop.value) : prop.value;
            }
        }
    },

    update (t) {
        let opts = this._opts;
        let easingTime = t;
        if (opts.easing) easingTime = opts.easing(t);

        let target = this.target;
        if (!target) return;
            
        let props = this._props;
        let progress = this._opts.progress;
        for (let name in props) {
            let prop = props[name];
            let time = prop.easing ? prop.easing(t) : easingTime;
            let current = prop.current = (prop.progress || progress)(prop.start, prop.end, prop.current, time);
            target[name] = current;
        }
    },

    progress (start, end, current, t) {
        if (typeof start === 'number') {
            current = start + (end - start) * t;
        }
        else {
            start.lerp(end, t, current);
        }
        return current;
    }
});



/**
 * !#en
 * Provide a simple and flexible way to create action
 * !#zh
 * 提供了一个简单灵活的方法来创建 action
 * @class Tween
 * @example
 * cc.tween(node)
 *   .to(1, {scale: 2, position: cc.v3(100, 100, 100)})
 *   .call(() => { console.log('This is a callback'); })
 *   .by(1, {scale: 3, position: cc.v3(200, 200, 200)}, {easing: 'sineOutIn'})
 *   .run(cc.find('Canvas/cocos'));
 */
function Tween (target) {
    this._actions = [];
    this._finalAction = null;
    this._target = target;
}

/**
 * !#en
 * Insert an action or tween to this sequence
 * !#zh
 * 插入一个 action 或者 tween 到队列中
 * @method then 
 * @param {Action|Tween} other
 */
Tween.prototype.then = function (other) {
    if (other instanceof cc.Action) {
        this._actions.push(other.clone());
    }
    else {
        let actions = other._actions;
        for (let i = 0; i < actions.length; i++) {
            this._actions.push(actions[i].clone());
        }
    }
    return this;
};

/**
 * !#en
 * Set tween target
 * !#zh
 * 设置 tween 的 target
 * @method target
 */
Tween.prototype.target = function (target) {
    this._target = target;
    return this;
};

/**
 * !#en
 * Start this tween
 * !#zh
 * 运行当前 tween
 * @method start
 */
Tween.prototype.start = function () {
    if (!this._target) {
        cc.warn('Please set target to tween first');
        return this;
    }
    if (!this._finalAction) {
        this._finalAction = this._get();
    }
    cc.director.getActionManager().addAction(this._finalAction, this._target, false);
    return this;
};

/**
 * !#en
 * Stop this tween
 * !#zh
 * 停止当前 tween
 * @method stop
 */
Tween.prototype.stop = function () {
    if (this._finalAction) {
        cc.director.getActionManager().removeAction(this._finalAction);
    }
    return this;
};



/**
 * !#en
 * Clone a tween
 * !#zh
 * 克隆当前 tween
 * @method clone
 * @param {Object} [target]
 */
Tween.prototype.clone = function (target) {
    let action = this._get();
    return cc.tween(target).then(action.clone());
};

/**
 * !#en
 * Get an union action from current sequence
 * !#zh
 * 从当前队列中获取一个整合的 action
 */
Tween.prototype._get = function () {
    let actions = this._actions;

    if (actions.length === 1) {
        actions = actions[0];
    }
    else {
        actions = Tween.sequence(actions);
    }

    return actions;
};


let actions = {
    /**
     * !#en
     * Add an action which calculate with absolute value
     * !#zh
     * 添加一个对属性进行绝对值计算的 action
     * @method to
     * @param {Number} duration 
     * @param {Object} props - {scale: 2, position: cc.v3(100, 100, 100)}
     * @param {Object} opts 
     * @param {Function} opts.progress
     * @param {Function|String} opts.easing
     */
    to (duration, props, opts) {
        opts = opts || Object.create(null);
        opts.relative = false;
        return new TweenAction(duration, props, opts);
    },

    /**
     * !#en
     * Add an action which calculate with relative value
     * !#zh
     * 添加一个对属性进行相对值计算的 action
     * @method by
     * @param {Number} duration 
     * @param {Object} props - {scale: 2, position: cc.v3(100, 100, 100)}
     * @param {Object} opts 
     * @param {Function} opts.progress
     * @param {Function|String} opts.easing
     */
    by (duration, props, opts) {
        opts = opts || Object.create(null);
        opts.relative = true;
        return new TweenAction(duration, props, opts);
    },
    
    /**
     * !#en
     * Add an delay action
     * !#zh
     * 添加一个延时 action
     * @method delay
     * @param {Number} duration 
     */
    delay: cc.delayTime,
    /**
     * !#en
     * Add an callback action
     * !#zh
     * 添加一个回调 action
     * @method call
     * @param {Function} callback
     */
    call: cc.callFunc,
    /**
     * !#en
     * Add an hide action
     * !#zh
     * 添加一个隐藏 action
     * @method hide
     */
    hide: cc.hide,
    /**
     * !#en
     * Add an show action
     * !#zh
     * 添加一个显示 action
     * @method show
     */
    show: cc.show,
    /**
     * !#en
     * Add an removeSelf action
     * !#zh
     * 添加一个移除自己 action
     * @method removeSelf
     */
    removeSelf: cc.removeSelf,
    /**
     * !#en
     * Add an sequence action
     * !#zh
     * 添加一个队列 action
     * @method sequence
     * @param {[Action]} actions
     */
    sequence: cc.sequence,
};

// these action should integrate before actions to a sequence action as their parameters
let otherActions = {
    /**
     * !#en
     * Add an repeat action. 
     * This action will integrate before actions to a sequence action as their parameters.
     * !#zh
     * 添加一个重复 action，这个 action 会将之前的 action 整合成一个 sequence action 作为他的参数。
     * @method repeat
     * @param {Number} repeatTimes 
     */
    repeat: cc.repeat,
    /**
     * !#en
     * Add an repeat forever action
     * This action will integrate before actions to a sequence action as their parameters.
     * !#zh
     * 添加一个永久重复 action，这个 action 会将之前的 action 整合成一个 sequence action 作为他的参数。
     * @method repeatForever
     */
    repeatForever: cc.repeatForever,
    /**
     * !#en
     * Add an reverse time action.
     * This action will integrate before actions to a sequence action as their parameters.
     * !#zh
     * 添加一个倒置时间 action，这个 action 会将之前的 action 整合成一个 sequence action 作为他的参数。
     * @method reverseTime
     */
    reverseTime: cc.reverseTime,
};

let keys = Object.keys(actions);
for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    Tween.prototype[key] = function () {
        let action = actions[key].apply(actions, arguments);
        this._actions.push(action);
        this._finalAction = null;
        return this;
    };
}

keys = Object.keys(otherActions);
for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    Tween.prototype[key] = function () {
        let args = [];
        for (let l = arguments.length, i = 0; i < l; i++) {
            args[i] = arguments[i];
        }

        let action = arguments[0];
        if (!(action instanceof cc.Action)) {
            action = this._get();
        }
        action = otherActions[key].apply(otherActions, [action].concat(args));
        this._actions.length = 0;
        this._actions.push(action);
        this._finalAction = null;
        return this;
    };
}

/**
 * @method tween
 * @param {Object} [target] - the target to animate
 * @return {Tween}
 */
cc.tween = function (target) {
    return new Tween(target);
};

cc.Tween = Tween;
